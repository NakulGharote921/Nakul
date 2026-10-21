"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import ThoughtLine from "@/components/ThoughtLine";

/**
 * How long the settled indicator stays on screen after the answer arrives.
 * When it settles the ThoughtLine swaps its label to "Thought for 2.4s" and
 * collapses the step list, so the line is kept for a moment before it is
 * removed.
 */
const SETTLE_LINGER_MS = 1600;

/**
 * Progress labels for the assistant. They describe what the portfolio
 * assistant actually does: it reads the visitor's question, picks the
 * relevant details out of the portfolio knowledge base that is sent with
 * every request, and writes the answer. They are progress status only, never
 * the model's private reasoning.
 */
const THOUGHT_STEPS = [
  "Reading the question",
  "Finding relevant portfolio information",
  "Preparing an answer",
];

type ThoughtStatusProps = {
  /** True while the assistant is working on an answer. */
  working: boolean;
  /** True once a question has been asked, so the line stays hidden before that. */
  active: boolean;
};

/**
 * Thinking indicator for the assistant chat.
 *
 * `working` is the real streaming state of the request: it is true from the
 * moment a question is sent until the provider stream ends, and it also
 * covers the error and cancellation paths so the indicator can never get
 * stuck in the working state. The line is kept mounted for a short while
 * after the work finishes so the settle animation can play.
 */
export function ThoughtStatus({ working, active }: ThoughtStatusProps): ReactNode {
  const [settled, setSettled] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!working) return undefined;
    // A new request starts: drop a pending hide so the previous settle
    // animation cannot cut this one short.
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    return undefined;
  }, [working]);

  useEffect(
    () => () => {
      if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    },
    []
  );

  const visible = active && (working || !settled);

  return (
    <div className="min-h-[1.35rem] pl-0.5 text-black/60 dark:text-white/60">
      {visible ? (
        <ThoughtLine
          working={working}
          steps={THOUGHT_STEPS}
          label="Thinking…"
          doneLabel="Thought for"
          glyph="sparkle"
          fontSize={14}
          breathPeriod={1.6}
          breathDepth={0.45}
          settleDuration={350}
          settleBlur={2}
          collapsible
          collapseOnSettle
          showTimer
          onSettle={() => {
            if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
            hideTimer.current = window.setTimeout(() => {
              hideTimer.current = null;
              setSettled(true);
            }, SETTLE_LINGER_MS);
          }}
        />
      ) : null}
    </div>
  );
}
