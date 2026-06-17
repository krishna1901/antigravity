import "server-only";
import { getDbContext, isLive } from "@/lib/db/context";
import { toolLabel } from "@/lib/ai/prompts";
import type { AIGenerationStatus, AIProvider, AIToolId } from "@/lib/ai/types";
import { recentGenerations as demoRecent } from "@/lib/demo-data";

/** A record persisted after a generation attempt. */
export interface GenerationRecord {
  tool: AIToolId;
  prompt: string;
  output: string;
  input: unknown;
  outputJson: unknown;
  provider: AIProvider | null;
  model: string | null;
  status: AIGenerationStatus;
  promptVersion: string;
  errorMessage?: string | null;
}

/** Demo-facing shape consumed by the Content Studio "Recent generations" list. */
export interface RecentGeneration {
  id: string;
  tool: string;
  toolName: string;
  preview: string;
  time: string;
  output: string;
}

/** Raw row shape we read back from `ai_generations`. */
interface AIGenerationRow {
  id: string;
  tool: string;
  output: string | null;
  status: string | null;
  created_at: string;
}

/** Compact relative time ("just now", "12m ago", "3h ago", "2d ago"). */
function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toPreview(text: string | null): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > 90 ? `${clean.slice(0, 90)}…` : clean;
}

/**
 * Persist a generation (live workspaces only). Best-effort: any failure is
 * swallowed so a logging hiccup never breaks the generation UX.
 */
export async function createGeneration(rec: GenerationRecord): Promise<void> {
  const ctx = await getDbContext();
  if (!isLive(ctx)) return;

  try {
    await ctx.supabase.from("ai_generations").insert({
      workspace_id: ctx.workspaceId,
      created_by: ctx.userId,
      tool: rec.tool,
      prompt: rec.prompt,
      output: rec.output,
      input: rec.input,
      output_json: rec.outputJson,
      provider: rec.provider,
      model: rec.model,
      status: rec.status,
      prompt_version: rec.promptVersion,
      error_message: rec.errorMessage ?? null,
    });
  } catch {
    /* best-effort logging — never throw to the caller */
  }
}

/**
 * Recent generations for the active workspace. Demo data in demo/preview mode;
 * live (incl. empty) passes through.
 */
export async function listRecentGenerations(limit = 6): Promise<RecentGeneration[]> {
  const ctx = await getDbContext();
  if (!isLive(ctx)) {
    return demoRecent.slice(0, limit).map((g) => ({
      id: g.id,
      tool: g.tool,
      toolName: g.tool,
      preview: g.preview,
      time: g.time,
      output: g.preview,
    }));
  }

  const { data, error } = await ctx.supabase
    .from("ai_generations")
    .select("id, tool, output, status, created_at")
    .eq("workspace_id", ctx.workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as AIGenerationRow[]).map((row) => {
    const name = toolLabel(row.tool as AIToolId);
    return {
      id: row.id,
      tool: row.tool,
      toolName: name,
      preview: toPreview(row.output),
      time: relativeTime(row.created_at),
      output: row.output ?? "",
    };
  });
}
