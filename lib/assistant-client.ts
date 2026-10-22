export type AssistantChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export class AssistantRequestError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AssistantRequestError";
    this.code = code;
  }
}

/**
 * Posts the conversation to the server-side chat route and streams the reply.
 * Resolves with the full assistant message, or rejects with an
 * `AssistantRequestError` carrying the provider error code.
 */
export async function streamAssistantReply({
  messages,
  sessionId,
  idToken,
  requestId,
  signal,
  onDelta,
}: {
  messages: AssistantChatMessage[];
  sessionId: string;
  idToken: string;
  requestId: string;
  signal?: AbortSignal | undefined;
  onDelta?: ((full: string) => void) | undefined;
}): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
      sessionId,
      idToken,
      requestId,
    }),
    signal: signal ?? null,
  });

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as {
      error?: string;
      message?: string;
    } | null;

    throw new AssistantRequestError(
      failure?.error ?? "request_failed",
      failure?.message ??
        "The assistant is unavailable right now. Please try again."
    );
  }

  if (!response.body) {
    throw new AssistantRequestError(
      "empty_response",
      "The assistant returned an empty response."
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  let chunk = await reader.read();
  while (!chunk.done) {
    buffer += decoder.decode(chunk.value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data) as {
          choices?: { delta?: { content?: string } }[];
        };
        const delta = parsed.choices?.[0]?.delta?.content;
        if (!delta) continue;

        full += delta;
        onDelta?.(full);
      } catch {
        // Ignore malformed provider chunks and keep streaming.
      }
    }

    chunk = await reader.read();
  }

  return full;
}
