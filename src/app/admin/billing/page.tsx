import type { Metadata } from "next";
import Link from "next/link";
import { BadgeDollarSign, CreditCard, Building2 } from "lucide-react";
import { getPlatformStats } from "@/lib/admin/stats";
import { listWorkspaces } from "@/lib/admin/workspaces";
import { StatCard } from "@/components/ui/stat-card";
import { Pill, planTone } from "@/components/admin/badges";

export const metadata: Metadata = { title: "Billing" };

export default async function AdminBillingPage() {
  const [stats, paid] = await Promise.all([getPlatformStats(), listWorkspaces({ paidOnly: true })]);

  const cards = [
    { label: "Est. MRR", value: `$${stats.estMrr.toLocaleString()}`, icon: <BadgeDollarSign className="h-4 w-4" />, accent: "from-emerald-500 to-teal-500" },
    { label: "Active subscriptions", value: stats.activeSubscriptions, icon: <CreditCard className="h-4 w-4" />, accent: "from-violet-500 to-indigo-500" },
    { label: "Paid workspaces", value: paid.length, icon: <Building2 className="h-4 w-4" />, accent: "from-brand-500 to-coral-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">Subscriptions &amp; revenue across the platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <StatCard
            key={c.label}
            label={c.label}
            value={typeof c.value === "number" ? c.value.toLocaleString() : c.value}
            icon={c.icon}
            accent={c.accent}
          />
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Workspace</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Owner</th>
            </tr>
          </thead>
          <tbody>
            {paid.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No paid subscriptions yet.</td>
              </tr>
            ) : (
              paid.map((w) => (
                <tr key={w.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link href={`/admin/workspaces/${w.id}`} className="font-medium text-foreground hover:underline">{w.name}</Link>
                  </td>
                  <td className="px-4 py-3"><Pill tone={planTone(w.plan)}>{w.plan}</Pill></td>
                  <td className="px-4 py-3 text-muted-foreground">{w.subscription_status ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{w.owner_email ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
