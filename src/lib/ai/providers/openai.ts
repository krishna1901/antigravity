import "server-only";
import { getPlatformSecret } from "@/lib/platform/secrets";

/**
 * OpenAI Chat Completions provider — dependency-free server-side `fetch`.
 *
 * The key comes from the admin-managed platform store (env fallback), read on
 * the server ONLY — it never reaches the client bundle (`import "server-only"`).
 */

/** Thrown on a non-2xx response so the caller can record a failed generation. */
export class AIError extends Error {
  constructor(
    message: string,
    readonly provider: "openai" | "anthropic",
    readonly statusCode?: number
  ) {
    super(message);
    this.name = "AIError";
  }
}

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export interface OpenAICallParams {
  system: string;
  user: string;
  model: string;
  maxTokens?: number;
}

interface OpenAIChatResponse {
  choices?: { message?: { content?: string | null } }[];
  model?: string;
  error?: { message?: string };
}

/** Call OpenAI's chat completions API. Returns the assistant text + model id. */
export async function callOpenAI({
  system,
  user,
  model,
  maxTokens = 1024,
}: OpenAICallParams): Promise<{ text: string; model: string }> {
  const apiKey = await getPlatformSecret("OPENAI_API_KEY");
  if (!apiKey) throw new AIError("OPENAI_API_KEY is not set.", "openai");

  const res = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    let detail = `OpenAI request failed (${res.status}).`;
    try {
      const body = (await res.json()) as OpenAIChatResponse;
      if (body.error?.message) detail = body.error.message;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new AIError(detail, "openai", res.status);
  }

  const data = (await res.json()) as OpenAIChatResponse;
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new AIError("OpenAI returned an empty response.", "openai");
  return { text, model: data.model ?? model };
}
