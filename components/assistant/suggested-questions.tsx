"use client";

import type { ReactNode } from "react";

type SuggestedQuestionsProps = {
  questions: readonly string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
};

/**
 * Quick-reply chips shown before the visitor has sent any message.
 */
export function SuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
}: SuggestedQuestionsProps): ReactNode {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {questions.map((question) => (
        <li key={question}>
          <button
            type="button"
            onClick={() => onSelect(question)}
            disabled={disabled}
            className="focus-ring-cyan cursor-pointer rounded-full border border-black/12 bg-black/[0.04] px-2.5 py-1.5 text-left text-[12px] leading-[1.35] tracking-tight text-black/70 transition-colors hover:border-black/25 hover:bg-black/[0.08] hover:text-black disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/12 dark:bg-white/[0.06] dark:text-white/70 dark:hover:border-white/25 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {question}
          </button>
        </li>
      ))}
    </ul>
  );
}
