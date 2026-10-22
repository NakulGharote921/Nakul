import { NextResponse } from "next/server";

import { assistantSystemPrompt, type AssistantRole } from "@/lib/assistant";

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_MAX_TOKENS = 4096;
const DEFAULT_TEMPERATURE = 0.5;
const MAX_HISTORY = 14;
const MAX_CONTENT_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const RATE_LIMIT_MAX_BUCKETS = 5_000;

export const maxDuration = 60;

type IncomingMessage = {
  role?: unknown;
  content?: unknown;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfter: number;
} {
  const now = Date.now();

  if (buckets.size > RATE_LIMIT_MAX_BUCKETS) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { error: "forbidden_origin", message: "Cross-origin requests are not allowed." },
      { status: 403 }
    );
  }

  const limit = checkRateLimit(clientKey(request));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Too many requests. Please wait a moment and try again.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "missing_api_key",
        message:
          "The assistant is offline. Add OPENAI_API_KEY to .env.local to switch it on.",
      },
      { status: 503 }
    );
  }

  let payload: { messages?: IncomingMessage[] };
  try {
    payload = (await request.json()) as { messages?: IncomingMessage[] };
  } catch {
    return NextResponse.json(
      { error: "invalid_request", message: "Malformed request body." },
      { status: 400 }
    );
  }

  const history = sanitizeMessages(payload.messages);
  if (history.length === 0) {
    return NextResponse.json(
      { error: "invalid_request", message: "No messages were provided." },
      { status: 400 }
    );
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/+$/,
    ""
  );
  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  const maxTokens = readNumber(process.env.OPENAI_MAX_TOKENS, DEFAULT_MAX_TOKENS);
  const temperature = readNumber(
    process.env.OPENAI_TEMPERATURE,
    DEFAULT_TEMPERATURE
  );

  const nvidia = isNvidiaEndpoint(baseUrl);
  const enableThinking = nvidia
    ? readBoolean(process.env.OPENAI_ENABLE_THINKING, false)
    : false;

  const body: Record<string, unknown> = {
    model,
    stream: true,
    temperature,
    max_tokens: maxTokens,
    messages: [{ role: "system", content: assistantSystemPrompt }, ...history],
  };

  if (nvidia) {
    body.chat_template_kwargs = { enable_thinking: enableThinking };
    if (enableThinking) {
      body.reasoning_budget = readNumber(
        process.env.OPENAI_REASONING_BUDGET,
        maxTokens
      );
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: request.signal,
    });
  } catch {
    return NextResponse.json(
      {
        error: "upstream_unreachable",
        message: "Could not reach the model provider.",
      },
      { status: 502 }
    );
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return NextResponse.json(
      {
        error: "upstream_error",
        message:
          detail.slice(0, 300) ||
          "The model provider returned an error. Check your API key and model name.",
      },
      { status: 502 }
    );
  }

  return new Response(contentOnlyStream(upstream.body), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function isNvidiaEndpoint(baseUrl: string): boolean {
  try {
    const host = new URL(baseUrl).hostname.toLowerCase();
    return host === "integrate.api.nvidia.com" || host.endsWith(".nvidia.com");
  } catch {
    return false;
  }
}

type ProviderChunk = {
  choices?: {
    delta?: { content?: string };
    message?: { content?: string };
  }[];
};

function contentOnlyStream(
  source: ReadableStream<Uint8Array>
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const forward = (
    line: string,
    controller: TransformStreamDefaultController<Uint8Array>
  ): void => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;

    const data = trimmed.slice(5).trim();
    if (!data) return;

    if (data === "[DONE]") {
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      return;
    }

    try {
      const parsed = JSON.parse(data) as ProviderChunk;
      const choice = parsed.choices?.[0];
      const content = choice?.delta?.content ?? choice?.message?.content ?? "";
      if (!content) return;

      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`
        )
      );
    } catch {
      // Ignore malformed provider chunks and keep streaming.
    }
  };

  return source.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) forward(line, controller);
      },
      flush(controller) {
        if (buffer) forward(buffer, controller);
      },
    })
  );
}

function sanitizeMessages(
  messages: unknown
): { role: AssistantRole; content: string }[] {
  if (!Array.isArray(messages)) return [];

  const result: { role: AssistantRole; content: string }[] = [];
  for (const entry of messages) {
    if (!entry || typeof entry !== "object") continue;

    const { role, content } = entry as IncomingMessage;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;

    const trimmed = content.trim().slice(0, MAX_CONTENT_LENGTH);
    if (!trimmed) continue;

    result.push({ role, content: trimmed });
  }

  return result.slice(-MAX_HISTORY);
}
