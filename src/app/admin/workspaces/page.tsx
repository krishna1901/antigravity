import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { listWorkspaces } from "@/lib/admin/workspaces";
import { Pill, planTone } from "@/components/admin/badges";

export const metadata: Metadata = { title: "Workspaces" };

export default async function AdminWorkspacesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const rows = await listWorkspaces({ search: q });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workspaces</h1>
          <p className="text-sm text-muted-foreground">{rows.length} workspace{rows.length === 1 ? "" : "s"}</p>
        </div>
        <form className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search workspace name"
            className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Workspace</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Members</th>
              <th className="px-4 py-3 font-semibold">Subscription</th>
              <th className="px-4 py-3 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No workspaces found.</td>
              </tr>
            ) : (
              rows.map((w) => (
                <tr key={w.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/workspaces/${w.id}`} className="block">
                      <p className="font-medium text-foreground">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.owner_email ?? "—"}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3"><Pill tone={planTone(w.plan)}>{w.plan}</Pill></td>
                  <td className="px-4 py-3 tabular-nums">{w.member_count}</td>
                  <td className="px-4 py-3 text-muted-foreground">{w.subscription_status ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
