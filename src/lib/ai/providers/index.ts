import "server-only";
import type { AIProvider } from "@/lib/ai/types";
import { getPlatformSecret } from "@/lib/platform/secrets";

/**
 * Provider resolution — all server-only. Keys/config come from the
 * admin-managed platform store first, then environment variables (fallback).
 */

/** Default model per provider when `AI_DEFAULT_MODEL` is not set. */
const DEFAULT_MODELS: Record<AIProvider, string> = {
  // Current Claude model (see the claude-api skill).
  anthropic: "claude-opus-4-8",
  openai: "gpt-4o-mini",
};

export async function getOpenAIKey(): Promise<string | undefined> {
  return getPlatformSecret("OPENAI_API_KEY");
}

export async function getAnthropicKey(): Promise<string | undefined> {
  return getPlatformSecret("ANTHROPIC_API_KEY");
}

/** True when at least one provider key is available (store or env). */
export async function isAIConfigured(): Promise<boolean> {
  return Boolean((await getOpenAIKey()) || (await getAnthropicKey()));
}

/**
 * Resolve the active provider:
 *   1. `AI_DEFAULT_PROVIDER` when set AND its key exists,
 *   2. otherwise whichever key is present (Anthropic preferred),
 *   3. `null` when no key is configured (caller falls back to demo).
 */
export async function resolveProvider(): Promise<AIProvider | null> {
  const preferred = (await getPlatformSecret("AI_DEFAULT_PROVIDER")) as AIProvider | undefined;
  const hasOpenAI = Boolean(await getOpenAIKey());
  const hasAnthropic = Boolean(await getAnthropicKey());

  if (preferred === "openai" && hasOpenAI) return "openai";
  if (preferred === "anthropic" && hasAnthropic) return "anthropic";
  if (hasAnthropic) return "anthropic";
  if (hasOpenAI) return "openai";
  return null;
}

/** Model id for a provider, honoring the `AI_DEFAULT_MODEL` override. */
export async function defaultModelFor(provider: AIProvider): Promise<string> {
  return (await getPlatformSecret("AI_DEFAULT_MODEL")) || DEFAULT_MODELS[provider];
}
