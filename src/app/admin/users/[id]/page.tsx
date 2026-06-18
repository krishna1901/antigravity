import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUserDetail } from "@/lib/admin/users";
import { requireSuperAdmin } from "@/lib/admin/guard";
import { UserActions } from "@/components/admin/user-actions";
import { ChartCard } from "@/components/ui/chart-card";
import { Pill, roleTone, statusTone, planTone } from "@/components/admin/badges";

export default async function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireSuperAdmin();
  const u = await getUserDetail(id);
  if (!u) notFound();

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Users
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{u.full_name ?? u.email ?? "User"}</h1>
          <p className="text-sm text-muted-foreground">{u.email}</p>
        </div>
        <div className="flex gap-2">
          <Pill tone={roleTone(u.role)}>{u.role}</Pill>
          <Pill tone={statusTone(u.status)}>{u.status}</Pill>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Manage account">
          <UserActions userId={u.id} role={u.role} status={u.status} isSelf={u.id === admin.userId} />
        </ChartCard>

        <ChartCard title={`Workspaces (${u.workspaces.length})`} bodyClassName="p-0">
          {u.workspaces.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No workspaces.</p>
          ) : (
            <ul className="divide-y divide-border">
              {u.workspaces.map((w) => (
                <li key={w.id} className="flex items-center justify-between px-5 py-3">
                  <Link href={`/admin/workspaces/${w.id}`} className="text-sm font-medium text-foreground hover:underline">
                    {w.name}
                  </Link>
                  <span className="flex items-center gap-2">
                    <Pill tone={planTone(w.plan)}>{w.plan}</Pill>
                    <Pill>{w.role}</Pill>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
