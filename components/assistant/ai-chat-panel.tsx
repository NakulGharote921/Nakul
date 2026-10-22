"use client";

import { ArrowUp, RotateCcw, X } from "lucide-react";
import {
  useEffect,
  useRef,
  type FormEvent,
  type ReactNode,
} from "react";

import { ChatMessage } from "@/components/assistant/chat-message";
import { ResumeDownloadButton } from "@/components/assistant/resume-download-button";
import { SuggestedQuestions } from "@/components/assistant/suggested-questions";
import { ThoughtStatus } from "@/components/assistant/thought-status";
import { assistantName, floatingAssistantSuggestions } from "@/lib/assistant";

export type AiChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AiChatStatus = "idle" | "thinking" | "streaming" | "error";

type AiChatPanelProps = {
  messages: AiChatMessage[];
  status: AiChatStatus;
  error: string | null;
  demoMode: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: (text: string) => void;
  onReset: () => void;
  onClose: () => void;
};

const STATUS_LABEL: Record<AiChatStatus, string> = {
  idle: "",
  thinking: "Thinking",
  streaming: "Answering",
  error: "Offline",
};

export function AiChatPanel({
  messages,
  status,
  error,
  demoMode,
  input,
  onInputChange,
  onSend,
  onReset,
  onClose,
}: AiChatPanelProps): ReactNode {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const busy = status === "thinking" || status === "streaming";
  const showSuggestions =
    !busy && messages[messages.length - 1]?.role === "assistant";
  const statusText = [STATUS_LABEL[status], demoMode ? "Demo mode" : null]
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSend(input);
  };

  return (
    <section
      id="ai-assistant-panel"
      role="dialog"
      aria-label={assistantName}
      className="flex max-h-[min(620px,calc(100dvh-100px))] w-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/92 shadow-[0_28px_70px_-16px_rgba(15,23,42,0.28)] backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#0b0b0f]/92 dark:shadow-[0_28px_70px_-16px_rgba(0,0,0,0.85)]"
    >
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-black/8 px-3.5 py-3 transition-colors duration-300 dark:border-white/8">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.18),rgba(14,14,17,0.98)_45%,rgba(3,3,5,1)_100%)] shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_0_14px_rgba(34,211,238,0.35)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_0_14px_rgba(34,211,238,0.35)]"
          >
            <span className="h-3 w-3 rounded-full bg-[conic-gradient(from_0deg,#d95b56,#ffa24c,#ffe0b3,#93f1ff,#3569fa,#193d9b,#d95b56)] opacity-90 blur-[0.5px]" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium tracking-tight text-[#0a0a0c] dark:text-white">
              {assistantName}
            </span>
            {statusText ? (
              <span className="flex items-center gap-1.5 text-[11px] tracking-tight text-black/50 dark:text-white/50">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === "error"
                      ? "bg-rose-400"
                      : status === "thinking" || status === "streaming"
                        ? "animate-pulse bg-cyan-400 dark:bg-cyan-300"
                        : "bg-cyan-500/70 dark:bg-cyan-400/70"
                  }`}
                />
                {statusText}
              </span>
            ) : null}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={onReset}
            aria-label="Clear the conversation"
            className="focus-ring-cyan inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/8 dark:hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close the assistant"
            className="focus-ring-cyan inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/8 dark:hover:text-white"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div
        ref={scrollRef}
        aria-live="polite"
        className="flex h-[min(26rem,calc(100dvh-13rem))] min-w-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3.5 py-3.5"
      >
        <ul className="flex flex-col gap-2.5">
          {messages.map((message) => (
            <li key={message.id}>
              <ChatMessage role={message.role} content={message.content} />
            </li>
          ))}
        </ul>

        <ThoughtStatus working={busy} active={messages.length > 1} />

        {showSuggestions ? (
          <div className="flex flex-col items-start gap-2.5">
            <SuggestedQuestions
              questions={floatingAssistantSuggestions}
              onSelect={onSend}
              disabled={busy}
            />
            <ResumeDownloadButton />
          </div>
        ) : null}

        {error ? (
          <p
            role="status"
            className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[12px] leading-[1.5] tracking-tight text-rose-700 dark:text-rose-200"
          >
            {error}
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-black/8 px-3 py-2.5 transition-colors duration-300 dark:border-white/8"
      >
        <label htmlFor="ai-assistant-input" className="sr-only">
          Message the assistant
        </label>
        <input
          ref={inputRef}
          id="ai-assistant-input"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Ask about projects, stack, certificates..."
          autoComplete="off"
          disabled={busy}
          className="focus-ring-cyan placeholder:text-black/35 min-w-0 flex-1 rounded-full border border-black/12 bg-black/[0.04] px-3.5 py-2 text-[13px] tracking-tight text-[#0a0a0c] transition-colors disabled:opacity-50 dark:border-white/12 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-white/30"
        />
        <button
          type="submit"
          disabled={busy || input.trim().length === 0}
          aria-label="Send message"
          className="focus-ring-cyan inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#0a0a0c] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-[#0a0a0c]"
        >
          <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
