import "server-only";
import { AIError } from "./openai";
import { getPlatformSecret } from "@/lib/platform/secrets";

/**
 * Anthropic Messages API provider — dependency-free server-side `fetch`.
 *
 * Endpoint/headers/shape per the Anthropic Messages API:
 *   POST https://api.anthropic.com/v1/messages
 *   headers: x-api-key, anthropic-version, content-type
 *   body:    { model, max_tokens, system?, messages: [{ role, content }] }
 *   resp:    { content: [{ type: "text", text }] }
 *
 * The system prompt is sent as the top-level `system` field. We intentionally
 * do NOT send temperature/top_p/top_k/thinking — a plain text call on the
 * current Opus model rejects those parameters.
 */

const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export interface AnthropicCallParams {
  system: string;
  user: string;
  model: string;
  maxTokens?: number;
}

interface AnthropicMessageResponse {
  content?: { type: string; text?: string }[];
  model?: string;
  error?: { message?: string };
}

/** Call Anthropic's Messages API. Returns the response text + model id. */
export async function callAnthropic({
  system,
  user,
  model,
  maxTokens = 1024,
}: AnthropicCallParams): Promise<{ text: string; model: string }> {
  const apiKey = await getPlatformSecret("ANTHROPIC_API_KEY");
  if (!apiKey) throw new AIError("ANTHROPIC_API_KEY is not set.", "anthropic");

  const res = await fetch(ANTHROPIC_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    let detail = `Anthropic request failed (${res.status}).`;
    try {
      const body = (await res.json()) as AnthropicMessageResponse;
      if (body.error?.message) detail = body.error.message;
    } catch {
      /* non-JSON error body — keep the generic message */
    }
    throw new AIError(detail, "anthropic", res.status);
  }

  const data = (await res.json()) as AnthropicMessageResponse;
  const text =
    data.content
      ?.filter((b) => b.type === "text" && b.text)
      .map((b) => b.text)
      .join("")
      .trim() ?? "";
  if (!text) throw new AIError("Anthropic returned an empty response.", "anthropic");
  return { text, model: data.model ?? model };
}
