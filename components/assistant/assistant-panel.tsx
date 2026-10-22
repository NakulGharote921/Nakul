"use client";

import { ArrowUp, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import Strands from "@/components/Strands";
import { ThoughtStatus } from "@/components/assistant/thought-status";
import { ResumeDownloadButton } from "@/components/assistant/resume-download-button";
import { useRealtimeAssistantChat } from "@/components/assistant/use-realtime-assistant-chat";
import { FadeIn } from "@/components/ui/motion-primitives";
import {
  assistantGreeting,
  assistantName,
  assistantOrbColors,
  assistantSuggestions,
} from "@/lib/assistant";

type Status = "idle" | "thinking" | "streaming" | "error";

const STATUS_LABEL: Record<Status, string> = {
  idle: "",
  thinking: "Thinking",
  streaming: "Speaking",
  error: "Offline",
};

export function AssistantPanel(): ReactNode {
  const [input, setInput] = useState("");
  const { messages, status, error, busy, send, reset } = useRealtimeAssistantChat();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);


  return (
    <FadeIn delay={0.35} className="h-full">
      <section
        aria-label="Portfolio assistant"
        className="border-foreground/8 bg-background flex h-full flex-col overflow-hidden rounded-4xl border shadow-sm"
      >
        <div className="border-foreground/5 relative h-40 w-full shrink-0 overflow-hidden border-b">
          <Strands
            colors={assistantOrbColors}
            count={3}
            speed={1}
            amplitude={1}
            waviness={1}
            thickness={1}
            spread={1}
            glow={1}
            taper={1}
            intensity={1}
            saturation={1}
            hueShift={0}
            scale={1}
            glass
            glassSize={1}
            refraction={1}
            rim={1}
            dispersion={1}
            energy={status === "thinking" ? 0.95 : 0.45}
            listening={status === "streaming"}
            interactive
            clickPulse
            intro
            lightMode={false}
            maxDevicePixelRatio={1.75}
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 px-4 pt-3">
            <span className="text-foreground text-[13px] font-medium tracking-tight">
              {assistantName}
            </span>
            {STATUS_LABEL[status] ? (
              <span className="border-foreground/10 bg-background/70 text-foreground/65 inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] tracking-tight">
                <span
                  aria-hidden="true"
                  className={`bg-foreground/60 h-1.5 w-1.5 rounded-full ${
                    status === "thinking" ? "animate-pulse" : ""
                  }`}
                />
                {STATUS_LABEL[status]}
              </span>
            ) : null}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="max-h-72 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 lg:max-h-none"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col gap-4">
              <p className="text-foreground/70 text-[14px] leading-[1.6] tracking-tight">
                {assistantGreeting}
              </p>
              <div className="flex flex-wrap gap-2">
                {assistantSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void send(suggestion)}
                    className="focus-ring border-foreground/10 hover:border-foreground/25 hover:text-foreground text-foreground/70 cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] tracking-tight transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <ResumeDownloadButton />
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={`max-w-[92%] rounded-3xl px-3.5 py-2.5 text-[13.5px] leading-[1.55] tracking-tight whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-foreground/5 text-foreground/85"
                    }`}
                  >
                    {message.content}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3">
            <ThoughtStatus working={busy} active={messages.length > 0} />
          </div>

          {error ? (
            <p
              role="status"
              className="border-foreground/12 bg-foreground/3 text-foreground/70 mt-3 rounded-2xl border px-3 py-2 text-[12.5px] leading-[1.5] tracking-tight"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="border-foreground/5 shrink-0 border-t p-3">
          {messages.length > 0 ? (
            <div className="mb-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={reset}
                aria-label="Clear the conversation"
                className="focus-ring text-foreground/55 hover:text-foreground inline-flex cursor-pointer items-center gap-1 text-[11.5px] tracking-tight transition-colors"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset
              </button>
            </div>
          ) : null}


          <form
            onSubmit={(event) => {
              event.preventDefault();
              setInput("");
              void send(input);
            }}
            className="flex items-center gap-2"
          >
            <label htmlFor="assistant-input" className="sr-only">
              Message the assistant
            </label>
            <input
              id="assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about experience, stack, projects..."
              disabled={busy}
              className="focus-ring border-foreground/12 placeholder:text-foreground/35 bg-background text-foreground min-w-0 flex-1 rounded-full border px-4 py-2.5 text-[13.5px] tracking-tight transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || input.trim().length === 0}
              aria-label="Send message"
              className="focus-ring bg-foreground text-background inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowUp
                className="h-4 w-4"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </button>
          </form>
        </div>
      </section>
    </FadeIn>
  );
}
