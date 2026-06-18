"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setWorkspacePlanAction, deleteWorkspaceAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { PLAN_ORDER, type PlanId } from "@/lib/billing/plans";

export function WorkspaceActions({ workspaceId, plan }: { workspaceId: string; plan: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) {
    setError(null);
    start(async () => {
      const r = await fn();
      if (!r.ok) setError(r.error ?? "Something went wrong.");
      else if (after) after();
      else router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Plan</span>
        <select
          defaultValue={plan}
          disabled={pending}
          onChange={(e) => run(() => setWorkspacePlanAction(workspaceId, e.target.value as PlanId))}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          {PLAN_ORDER.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <Button
        variant="destructive"
        disabled={pending}
        onClick={() => {
          if (confirm("Permanently delete this workspace and all of its data? This cannot be undone.")) {
            run(() => deleteWorkspaceAction(workspaceId), () => router.push("/admin/workspaces"));
          }
        }}
      >
        Delete workspace
      </Button>
    </div>
  );
}
