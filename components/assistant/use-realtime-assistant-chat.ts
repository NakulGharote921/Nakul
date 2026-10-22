"use client";

import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import {
  limitToLast,
  onValue,
  orderByKey,
  push,
  query,
  ref,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/database";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { AiChatMessage, AiChatStatus } from "@/components/assistant/ai-chat-panel";
import { AssistantRequestError, streamAssistantReply } from "@/lib/assistant-client";
import { firebaseAuth, firebaseConfigured, realtimeDatabase } from "@/lib/firebase";

const MAX_CONTENT_LENGTH = 2000;
const MAX_HISTORY = 14;

type StoredMessage = AiChatMessage & { requestId?: string };
type SessionMode = "connecting" | "cloud" | "local";

function validMessage(value: unknown): value is { role: "user" | "assistant"; content: string; requestId?: string } {
  if (!value || typeof value !== "object") return false;
  const { role, content, requestId } = value as Record<string, unknown>;
  return (role === "user" || role === "assistant") && typeof content === "string" &&
    content.trim().length > 0 && content.length <= MAX_CONTENT_LENGTH &&
    (requestId === undefined || typeof requestId === "string");
}

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function useRealtimeAssistantChat() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<SessionMode>(
    firebaseConfigured && firebaseAuth ? "connecting" : "local"
  );
  const [history, setHistory] = useState<StoredMessage[]>([]);
  const [session, setSession] = useState<StoredMessage[]>([]);
  const [status, setStatus] = useState<AiChatStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [streaming, setStreaming] = useState<StoredMessage | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const activeRequest = useRef<string | null>(null);
  const sessionRequestIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!firebaseConfigured || !firebaseAuth) return;

    let cancelled = false;
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      if (cancelled || !nextUser) return;
      setUser(nextUser);
      setMode("cloud");
    });

    if (!firebaseAuth.currentUser) {
      // Anonymous auth may be disabled on the Firebase project. That only
      // affects synced history, so fall back to a local session instead of
      // blocking the assistant.
      void signInAnonymously(firebaseAuth).catch(() => {
        if (cancelled) return;
        setMode((current) => (current === "cloud" ? "cloud" : "local"));
      });
    }

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (mode !== "cloud" || !user || !realtimeDatabase) return;
    const messagesRef = ref(realtimeDatabase, `assistantSessions/${user.uid}/messages`);
    // Give the Realtime Database a moment to sync, then fall back to a local
    // session instead of leaving the chat waiting on history.
    const fallback = window.setTimeout(() => {
      setMode((current) => (current === "cloud" ? "local" : current));
    }, 5000);
    const unsubscribe: Unsubscribe = onValue(
      query(messagesRef, orderByKey(), limitToLast(50)),
      (snapshot) => {
        window.clearTimeout(fallback);
        const next: StoredMessage[] = [];
        snapshot.forEach((child) => {
          const data = child.val();
          if (!validMessage(data)) return;
          if (data.requestId && sessionRequestIds.current.has(data.requestId)) return;
          next.push({ id: child.key ?? createId(), ...data });
        });
        setHistory(next);
      },
      () => {
        window.clearTimeout(fallback);
        setHistory([]);
        setMode((current) => (current === "cloud" ? "local" : current));
      }
    );
    return () => {
      window.clearTimeout(fallback);
      unsubscribe();
    };
  }, [mode, user]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const displayMessages = useMemo(() => {
    const combined = [...history, ...session];
    return streaming ? [...combined, streaming] : combined;
  }, [history, session, streaming]);
  const busy = status === "thinking" || status === "streaming";

  const send = useCallback(async (raw: string) => {
    const content = raw.trim().slice(0, MAX_CONTENT_LENGTH);
    if (!content || busy || mode === "connecting") return;

    const requestId = createId();
    sessionRequestIds.current.add(requestId);
    const userMessage: StoredMessage = { id: requestId, role: "user", content, requestId };
    setSession((current) => [...current, userMessage]);
    setError(null);
    setStatus("thinking");

    try {
      if (mode === "cloud" && user && realtimeDatabase) {
        // Best-effort history sync. Never block the reply on the database.
        void push(ref(realtimeDatabase, `assistantSessions/${user.uid}/messages`), {
          role: "user",
          content,
          status: "completed",
          requestId,
          createdAt: serverTimestamp(),
        }).catch(() => setMode("local"));
      }

      let idToken = "";
      if (mode === "cloud" && firebaseAuth?.currentUser) {
        idToken = await firebaseAuth.currentUser.getIdToken().catch(() => "");
      }

      const transcript = [...history, ...session, userMessage]
        .slice(-MAX_HISTORY)
        .map(({ role, content: messageContent }) => ({ role, content: messageContent }));
      const controller = new AbortController();
      abortRef.current = controller;
      setStreaming({ id: `stream-${requestId}`, role: "assistant", content: "", requestId });
      const full = await streamAssistantReply({
        messages: transcript,
        sessionId: user?.uid ?? "local",
        idToken,
        requestId,
        signal: controller.signal,
        onDelta: (snapshot) => {
          if (activeRequest.current !== requestId) return;
          setStatus("streaming");
          setStreaming({ id: `stream-${requestId}`, role: "assistant", content: snapshot, requestId });
        },
      });
      if (!full.trim()) throw new Error("The assistant returned an empty response.");
      setSession((current) => [
        ...current,
        { id: `assistant-${requestId}`, role: "assistant", content: full, requestId },
      ]);
      if (mode === "cloud" && user && realtimeDatabase) {
        // Best-effort sync of the reply, matching the user message above.
        void push(ref(realtimeDatabase, `assistantSessions/${user.uid}/messages`), {
          role: "assistant",
          content: full.slice(0, MAX_CONTENT_LENGTH),
          status: "completed",
          requestId,
          createdAt: serverTimestamp(),
        }).catch(() => setMode("local"));
      }
      setStatus("idle");
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === "AbortError") {
        setStatus("idle");
      } else {
        setStatus("error");
        setError(caught instanceof AssistantRequestError || caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
      }
    } finally {
      if (activeRequest.current === requestId) {
        activeRequest.current = null;
        abortRef.current = null;
        setStreaming(null);
      }
    }
  }, [busy, history, mode, session, user]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    activeRequest.current = null;
    setStreaming(null);
    setError(null);
    setStatus("idle");
  }, []);

  return {
    messages: displayMessages,
    status,
    error,
    busy,
    send,
    reset,
    ready: mode !== "connecting",
  };
}
