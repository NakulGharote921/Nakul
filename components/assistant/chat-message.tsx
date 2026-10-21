"use client";

import type { ReactNode } from "react";

import type { AssistantRole } from "@/lib/assistant";

type ChatMessageProps = {
  role: AssistantRole;
  content: string;
};

const URL_PATTERN = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g;

/**
 * Renders a chat bubble and turns any URL inside the text into a real link
 * so project and profile links stay clickable.
 */
export function ChatMessage({
  role,
  content,
}: ChatMessageProps): ReactNode {
  const isUser = role === "user";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={`max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-[1.55] tracking-tight break-words whitespace-pre-wrap transition-colors duration-300 ${
          isUser
            ? "bg-[#0a0a0c] text-white dark:bg-white dark:text-[#0a0a0c]"
            : "border border-black/10 bg-black/[0.04] text-black/80 dark:border-white/10 dark:bg-white/[0.06] dark:text-white/85"
        }`}
      >
        {renderWithLinks(content)}
      </div>
    </div>
  );
}

function renderWithLinks(text: string): ReactNode {
  // `split` with a capture group keeps the matches at the odd indexes.
  const parts = text.split(URL_PATTERN);

  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return <span key={`text-${index}`}>{part}</span>;
    }

    return (
      <a
        key={`link-${index}`}
        href={part}
        target="_blank"
        rel="noreferrer noopener"
        className="font-medium text-cyan-600 underline decoration-cyan-600/40 underline-offset-2 transition-colors hover:decoration-cyan-600 dark:text-cyan-300 dark:decoration-cyan-300/40 dark:hover:decoration-cyan-300"
      >
        {part}
      </a>
    );
  });
}
