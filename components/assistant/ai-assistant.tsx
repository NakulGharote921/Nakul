"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { AiChatPanel } from "@/components/assistant/ai-chat-panel";
import { AiOrb } from "@/components/assistant/ai-orb";
import { useRealtimeAssistantChat } from "@/components/assistant/use-realtime-assistant-chat";
import { assistantName, floatingAssistantGreeting } from "@/lib/assistant";
import { useReducedMotion } from "@/lib/motion";

const HINT_STORAGE_KEY = "nakul-ai-assistant-hint-dismissed";

function useStoredHintDismissed(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return window.localStorage.getItem(HINT_STORAGE_KEY) === "1";
      } catch {
        return false;
      }
    },
    // This is also used for the first hydration render, matching the server.
    () => false
  );
}

type AIAssistantProps = {
  initialOpen?: boolean;
};

export function AIAssistant({
  initialOpen = false,
}: AIAssistantProps = {}): ReactNode {
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef(false);

  const [open, setOpen] = useState(initialOpen);
  const [hintDismissed, setHintDismissed] = useState(false);
  const storedHintDismissed = useStoredHintDismissed();
  const [input, setInput] = useState("");
  const { messages: storedMessages, status, error, busy, send, reset } = useRealtimeAssistantChat();
  const messages = [
    { id: "assistant-greeting", role: "assistant" as const, content: floatingAssistantGreeting },
    ...storedMessages,
  ];
  // The tooltip belongs to the closed state: it never shows together with
  // the chat panel, and the visitor can dismiss it for good.
  const tooltipVisible = !open && !hintDismissed && !storedHintDismissed;

  // The orb is unmounted while the panel is open, so the focus is handed back
  // to it once it is mounted again.
  useEffect(() => {
    if (open || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    orbRef.current?.focus();
  }, [open]);

  const dismissHint = useCallback(() => {
    setHintDismissed(true);
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, "1");
    } catch {
      // Ignore storage failures; the hint is hidden for this session anyway.
    }
  }, []);

  const openPanel = useCallback(() => {
    setOpen(true);
  }, []);

  const closePanel = useCallback((restoreFocus = false) => {
    if (restoreFocus) restoreFocusRef.current = true;
    setOpen(false);
  }, []);


  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closePanel(true);
      }
    };

    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target;
      if (target instanceof Node && panelRef.current?.contains(target)) return;
      closePanel(false);
    };

    const onFocusOut = (event: FocusEvent): void => {
      const next = event.relatedTarget;
      if (!(next instanceof Node)) return;
      if (panelRef.current?.contains(next)) return;
      closePanel(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [closePanel, open]);

  const panelMotion = reducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 14, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 14, scale: 0.98 },
      };
  const panelTransition = {
    duration: reducedMotion ? 0 : 0.24,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Chat panel: bottom-right, never wider than 400px, never taller than
          the viewport allows. It shares the corner with the orb, which is
          unmounted while the panel is open so the two can never overlap. */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="ai-chat-panel"
            ref={panelRef}
            {...panelMotion}
            transition={panelTransition}
            className="pointer-events-auto absolute right-4 bottom-4 w-[min(400px,calc(100vw-32px))] sm:right-6 sm:bottom-6"
          >
            <AiChatPanel
              messages={messages}
              status={status}
              error={error}
              demoMode={false}
              input={input}
              onInputChange={setInput}
              onSend={(text) => { setInput(""); void send(text); }}
              onReset={reset}
              onClose={() => closePanel(true)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-auto absolute right-4 bottom-4 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        <AnimatePresence>
          {tooltipVisible ? (
            <motion.div
              key="ai-hint"
              role="status"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex max-w-[calc(100vw-32px)] items-center gap-1.5 rounded-full border border-black/5 bg-white py-2 pr-2 pl-3.5 text-[12.5px] font-medium tracking-tight whitespace-nowrap text-[#0a0a0c] shadow-[0_16px_40px_-12px_rgba(15,23,42,0.35)] transition-colors duration-300 sm:text-[13px] dark:border-white/10 dark:bg-[#15151a] dark:text-white dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85)]"
            >
              Need a little inspiration?
              <button
                type="button"
                onClick={dismissHint}
                aria-label="Dismiss this hint"
                className="focus-ring-cyan inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0a0a0c]/45 transition-colors hover:bg-black/8 hover:text-[#0a0a0c] dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
              <span
                aria-hidden="true"
                className="absolute -bottom-1 right-9 h-2.5 w-2.5 rotate-45 bg-white transition-colors duration-300 dark:bg-[#15151a]"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {!open ? (
            <motion.button
              key="ai-orb"
              ref={orbRef}
              type="button"
              onClick={openPanel}
              aria-label={`Open ${assistantName}`}
              aria-expanded={open}
              aria-controls="ai-assistant-panel"
              id="ai-assistant-orb"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="focus-ring-cyan ai-orb-float relative block h-16 w-16 cursor-pointer rounded-full sm:h-[76px] sm:w-[76px]"
            >
              <AiOrb
                energy={busy ? 0.92 : 0.62}
                listening={status === "streaming"}
                className="h-full w-full"
              />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
