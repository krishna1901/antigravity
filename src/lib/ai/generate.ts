import "server-only";
import type { AIGenerateInput, AIGenerateResult, AIProvider } from "@/lib/ai/types";
import { buildPrompt, demoOutputFor, toolIsMulti } from "@/lib/ai/prompts";
import {
  defaultModelFor,
  isAIConfigured,
  resolveProvider,
} from "@/lib/ai/providers";
import { callOpenAI } from "@/lib/ai/providers/openai";
import { callAnthropic } from "@/lib/ai/providers/anthropic";

/**
 * Parse model text into discrete variations for "multi" tools.
 * Splits on leading "1.", "2)", "- ", etc.; falls back to the whole text.
 */
function splitVariations(text: string): string[] {
  const lines = text.split("\n");
  const items: string[] = [];
  let current: string[] = [];

  const isNewItem = (line: string) => /^\s*(?:\d+[.)]|[-*•])\s+/.test(line);

  for (const line of lines) {
    if (isNewItem(line)) {
      if (current.length) items.push(current.join("\n").trim());
      current = [line.replace(/^\s*(?:\d+[.)]|[-*•])\s+/, "")];
    } else {
      current.push(line);
    }
  }
  if (current.length) items.push(current.join("\n").trim());

  const cleaned = items.map((s) => s.trim()).filter(Boolean);
  return cleaned.length ? cleaned : [text.trim()];
}

/** Shape a successful provider response into an `AIGenerateResult`. */
function buildResult(
  input: AIGenerateInput,
  text: string,
  provider: AIProvider,
  model: string
): AIGenerateResult {
  const variations = toolIsMulti(input.tool) ? splitVariations(text) : [text.trim()];
  return {
    ok: true,
    output: text.trim(),
    variations,
    demo: false,
    provider,
    model,
    status: "success",
  };
}

/** Demo result (no API key) — canned, on-brand output that never crashes. */
function demoResult(input: AIGenerateInput): AIGenerateResult {
  const variations = demoOutputFor(input);
  return {
    ok: true,
    output: variations.join("\n\n"),
    variations,
    demo: true,
    provider: null,
    model: null,
    status: "demo",
  };
}

/**
 * Generate content for a Content Studio tool.
 *
 * NEVER throws — callers always get a result they can render:
 *   • no API key      → demo output (status "demo")
 *   • provider success → real output (status "success")
 *   • provider error   → { ok:false, status:"failed", error }
 */
export async function generateAI(input: AIGenerateInput): Promise<AIGenerateResult> {
  if (!(await isAIConfigured())) return demoResult(input);

  const provider = await resolveProvider();
  if (!provider) return demoResult(input);

  const model = await defaultModelFor(provider);
  const { system, user } = buildPrompt(input);

  try {
    const { text, model: usedModel } =
      provider === "anthropic"
        ? await callAnthropic({ system, user, model })
        : await callOpenAI({ system, user, model });
    return buildResult(input, text, provider, usedModel);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed.";
    return {
      ok: false,
      output: "",
      variations: [],
      demo: false,
      provider,
      model,
      status: "failed",
      error: message,
    };
  }
}
