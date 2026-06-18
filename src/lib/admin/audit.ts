import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AuditEntry {
  actorId: string;
  actorEmail: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

/** Append an entry to the admin audit log (best-effort, service-role). */
export async function logAdminAction(entry: AuditEntry): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  await admin.from("admin_audit_log").insert({
    actor_id: entry.actorId,
    actor_email: entry.actorEmail,
    action: entry.action,
    target_type: entry.targetType ?? null,
    target_id: entry.targetId ?? null,
    metadata: entry.metadata ?? null,
  });
}

export interface AuditRow {
  id: string;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export async function listAuditLog(limit = 100): Promise<AuditRow[]> {
  const admin = createAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as AuditRow[];
}
