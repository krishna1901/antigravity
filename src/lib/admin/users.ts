import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminUserRow {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  status: string;
  created_at: string;
  workspaceCount: number;
}

type ProfileRow = Omit<AdminUserRow, "workspaceCount">;

/** All users (profiles), newest first, with their workspace membership count. */
export async function listUsers(opts: { search?: string; limit?: number } = {}): Promise<AdminUserRow[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  let q = admin
    .from("profiles")
    .select("id, email, full_name, role, status, created_at")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 100);

  const search = opts.search?.trim();
  if (search) q = q.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);

  const { data } = await q;
  const rows = (data ?? []) as ProfileRow[];

  const counts: Record<string, number> = {};
  const ids = rows.map((r) => r.id);
  if (ids.length) {
    const { data: mems } = await admin.from("workspace_members").select("user_id").in("user_id", ids);
    for (const m of (mems ?? []) as { user_id: string }[]) {
      counts[m.user_id] = (counts[m.user_id] ?? 0) + 1;
    }
  }

  return rows.map((r) => ({ ...r, workspaceCount: counts[r.id] ?? 0 }));
}

export interface AdminUserDetail extends AdminUserRow {
  workspaces: { id: string; name: string; plan: string; role: string }[];
}

export async function getUserDetail(id: string): Promise<AdminUserDetail | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: p } = await admin
    .from("profiles")
    .select("id, email, full_name, role, status, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!p) return null;

  const { data: mems } = await admin
    .from("workspace_members")
    .select("role, workspaces(id, name, plan)")
    .eq("user_id", id);

  type MemberJoin = { role: string; workspaces: { id: string; name: string; plan: string } | null };
  const workspaces = ((mems ?? []) as unknown as MemberJoin[])
    .filter((m) => m.workspaces)
    .map((m) => ({
      id: m.workspaces!.id,
      name: m.workspaces!.name,
      plan: m.workspaces!.plan,
      role: m.role,
    }));

  const profile = p as ProfileRow;
  return { ...profile, workspaceCount: workspaces.length, workspaces };
}
