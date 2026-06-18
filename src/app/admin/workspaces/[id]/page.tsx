import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getWorkspaceDetail } from "@/lib/admin/workspaces";
import { WorkspaceActions } from "@/components/admin/workspace-actions";
import { ChartCard } from "@/components/ui/chart-card";
import { Pill, planTone, statusTone } from "@/components/admin/badges";

export default async function AdminWorkspaceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const w = await getWorkspaceDetail(id);
  if (!w) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/workspaces" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Workspaces
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{w.name}</h1>
          <p className="text-sm text-muted-foreground">Owner: {w.owner_email ?? "—"}</p>
        </div>
        <Pill tone={planTone(w.plan)}>{w.plan}</Pill>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Manage workspace">
          <WorkspaceActions workspaceId={w.id} plan={w.plan} />
          <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subscription</dt><dd>{w.subscription_status ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Stripe customer</dt><dd className="font-mono text-xs">{w.stripe_customer_id ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Created</dt><dd>{new Date(w.created_at).toLocaleDateString()}</dd></div>
          </dl>
        </ChartCard>

        <div className="space-y-4">
          <ChartCard title={`Members (${w.members.length})`} bodyClassName="p-0">
            {w.members.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No members.</p>
            ) : (
              <ul className="divide-y divide-border">
                {w.members.map((m) => (
                  <li key={m.user_id} className="flex items-center justify-between px-5 py-3">
                    <Link href={`/admin/users/${m.user_id}`} className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground hover:underline">{m.full_name ?? m.email ?? "—"}</p>
                      <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                    </Link>
                    <Pill>{m.role}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </ChartCard>

          <ChartCard title={`Connected accounts (${w.connectedAccounts.length})`} bodyClassName="p-0">
            {w.connectedAccounts.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">No connected accounts.</p>
            ) : (
              <ul className="divide-y divide-border">
                {w.connectedAccounts.map((a, i) => (
                  <li key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium capitalize text-foreground">{a.platform}</p>
                      <p className="text-xs text-muted-foreground">{a.account_name ?? "—"}</p>
                    </div>
                    <Pill tone={statusTone(a.status === "connected" ? "active" : "suspended")}>{a.status}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
