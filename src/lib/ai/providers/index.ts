import "server-only";
import type { AIProvider } from "@/lib/ai/types";

/**
 * Provider resolution — all server-only. Decides whether AI is configured,
 * which provider to use, and which model to send.
 */

/** Default model per provider when `AI_DEFAULT_MODEL` is not set. */
const DEFAULT_MODELS: Record<AIProvider, string> = {
  // Current Claude model (see the claude-api skill).
  anthropic: "claude-opus-4-8",
  openai: "gpt-4o-mini",
};

function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** True when at least one provider key is present (server-side only). */
export function isAIConfigured(): boolean {
  return hasOpenAIKey() || hasAnthropicKey();
}

/**
 * Resolve the active provider:
 *   1. `AI_DEFAULT_PROVIDER` when set AND its key exists,
 *   2. otherwise whichever key is present (Anthropic preferred),
 *   3. `null` when no key is configured (caller falls back to demo).
 */
export function resolveProvider(): AIProvider | null {
  const preferred = process.env.AI_DEFAULT_PROVIDER as AIProvider | undefined;
  if (preferred === "openai" && hasOpenAIKey()) return "openai";
  if (preferred === "anthropic" && hasAnthropicKey()) return "anthropic";
  if (hasAnthropicKey()) return "anthropic";
  if (hasOpenAIKey()) return "openai";
  return null;
}

/** Model id for a provider, honoring the `AI_DEFAULT_MODEL` override. */
export function defaultModelFor(provider: AIProvider): string {
  return process.env.AI_DEFAULT_MODEL || DEFAULT_MODELS[provider];
}
