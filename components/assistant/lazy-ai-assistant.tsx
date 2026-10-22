"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const AIAssistant = dynamic(
  () =>
    import("@/components/assistant/ai-assistant").then(
      (module) => module.AIAssistant
    ),
  { ssr: false }
);

const HINT_STORAGE_KEY = "nakul-ai-assistant-hint-dismissed";

function loadAssistantModule(): void {
  void import("@/components/assistant/ai-assistant");
}

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
    () => false
  );
}

export function LazyAIAssistant(): ReactNode {
  const [activated, setActivated] = useState(false);
  const [openOnMount, setOpenOnMount] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const storedHintDismissed = useStoredHintDismissed();
  const hintVisible = !hintDismissed && !storedHintDismissed;

  const dismissHint = useCallback(() => {
    setHintDismissed(true);
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, "1");
    } catch {
      // The hint is still hidden for the current session.
    }
  }, []);

  const openAssistant = useCallback(() => {
    setOpenOnMount(true);
    setActivated(true);
  }, []);

  if (activated) {
    return <AIAssistant initialOpen={openOnMount} />;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div className="pointer-events-auto absolute right-4 bottom-4 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        {hintVisible ? (
          <div
            role="status"
            className="relative flex max-w-[calc(100vw-32px)] items-center gap-1.5 rounded-full border border-black/5 bg-white py-2 pr-2 pl-3.5 text-[12.5px] font-medium tracking-tight whitespace-nowrap text-[#0a0a0c] shadow-[0_16px_40px_-12px_rgba(15,23,42,0.35)] transition-colors duration-300 sm:text-[13px] dark:border-white/10 dark:bg-[#15151a] dark:text-white dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85)]"
          >
            Need a little inspiration?
            <button
              type="button"
              onClick={dismissHint}
              aria-label="Dismiss this hint"
              className="focus-ring-cyan inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#0a0a0c]/45 transition-colors hover:bg-black/8 hover:text-[#0a0a0c] dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <span
              aria-hidden="true"
              className="absolute -bottom-1 right-9 h-2.5 w-2.5 rotate-45 bg-white transition-colors duration-300 dark:bg-[#15151a]"
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={openAssistant}
          onPointerEnter={loadAssistantModule}
          onFocus={loadAssistantModule}
          aria-label="Open Nakul AI Assistant"
          className="focus-ring-cyan ai-orb-float relative block h-16 w-16 cursor-pointer rounded-full sm:h-[76px] sm:w-[76px]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.16),rgba(20,20,24,0.97)_42%,rgba(4,4,6,0.99)_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.9),0_0_0_2.5px_rgba(15,23,42,0.07),0_12px_28px_-16px_rgba(15,23,42,0.45)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_0_0_1px_rgba(34,211,238,0.22),0_0_16px_rgba(34,211,238,0.26),0_0_36px_rgba(59,130,246,0.16)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-[18%] rounded-full bg-[conic-gradient(from_210deg,rgba(34,211,238,0.75),rgba(59,130,246,0.65),rgba(168,85,247,0.6),rgba(34,211,238,0.75))] opacity-80 blur-[5px]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-[23%] rounded-full bg-[radial-gradient(circle_at_38%_30%,rgba(255,255,255,0.3),rgba(12,12,16,0.95)_58%)]"
          />
        </button>
      </div>
    </div>
  );
}
