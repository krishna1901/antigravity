import type { Metadata } from "next";
import { listAuditLog } from "@/lib/admin/audit";

export const metadata: Metadata = { title: "Audit Log" };

export default async function AdminAuditPage() {
  const rows = await listAuditLog(150);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit log</h1>
        <p className="text-sm text-muted-foreground">Recent administrative actions.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">When</th>
              <th className="px-4 py-3 font-semibold">Actor</th>
              <th className="px-4 py-3 font-semibold">Action</th>
              <th className="px-4 py-3 font-semibold">Target</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No admin activity yet.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.actor_email ?? "—"}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.target_type ? `${r.target_type}:${(r.target_id ?? "").slice(0, 8)}` : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
