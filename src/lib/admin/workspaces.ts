import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminWorkspaceRow {
  id: string;
  name: string;
  plan: string;
  subscription_status: string | null;
  owner_email: string | null;
  member_count: number;
  created_at: string;
}

type WsRow = {
  id: string;
  name: string;
  plan: string;
  subscription_status: string | null;
  owner_id: string;
  created_at: string;
};

export async function listWorkspaces(
  opts: { search?: string; limit?: number; paidOnly?: boolean } = {}
): Promise<AdminWorkspaceRow[]> {
  const admin = createAdminClient();
  if (!admin) return [];

  let q = admin
    .from("workspaces")
    .select("id, name, plan, subscription_status, owner_id, created_at")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 100);
  const search = opts.search?.trim();
  if (search) q = q.ilike("name", `%${search}%`);
  if (opts.paidOnly) q = q.neq("plan", "starter");

  const { data } = await q;
  const rows = (data ?? []) as WsRow[];

  const emails: Record<string, string | null> = {};
  const ownerIds = [...new Set(rows.map((r) => r.owner_id))];
  if (ownerIds.length) {
    const { data: profs } = await admin.from("profiles").select("id, email").in("id", ownerIds);
    for (const p of (profs ?? []) as { id: string; email: string | null }[]) emails[p.id] = p.email;
  }

  const counts: Record<string, number> = {};
  const ids = rows.map((r) => r.id);
  if (ids.length) {
    const { data: mems } = await admin.from("workspace_members").select("workspace_id").in("workspace_id", ids);
    for (const m of (mems ?? []) as { workspace_id: string }[]) {
      counts[m.workspace_id] = (counts[m.workspace_id] ?? 0) + 1;
    }
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    plan: r.plan,
    subscription_status: r.subscription_status,
    owner_email: emails[r.owner_id] ?? null,
    member_count: counts[r.id] ?? 0,
    created_at: r.created_at,
  }));
}

export interface AdminWorkspaceDetail {
  id: string;
  name: string;
  plan: string;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  owner_email: string | null;
  created_at: string;
  members: { user_id: string; email: string | null; full_name: string | null; role: string }[];
  connectedAccounts: { platform: string; account_name: string | null; status: string }[];
}

export async function getWorkspaceDetail(id: string): Promise<AdminWorkspaceDetail | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data: ws } = await admin
    .from("workspaces")
    .select("id, name, plan, subscription_status, stripe_customer_id, stripe_subscription_id, owner_id, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!ws) return null;
  const w = ws as WsRow & { stripe_customer_id: string | null; stripe_subscription_id: string | null };

  const { data: memData } = await admin
    .from("workspace_members")
    .select("user_id, role")
    .eq("workspace_id", id);
  const memRows = (memData ?? []) as { user_id: string; role: string }[];

  const profMap: Record<string, { email: string | null; full_name: string | null }> = {};
  const uids = memRows.map((m) => m.user_id);
  if (uids.length) {
    const { data: profs } = await admin.from("profiles").select("id, email, full_name").in("id", uids);
    for (const p of (profs ?? []) as { id: string; email: string | null; full_name: string | null }[]) {
      profMap[p.id] = { email: p.email, full_name: p.full_name };
    }
  }
  const members = memRows.map((m) => ({
    user_id: m.user_id,
    email: profMap[m.user_id]?.email ?? null,
    full_name: profMap[m.user_id]?.full_name ?? null,
    role: m.role,
  }));

  const { data: accts } = await admin
    .from("connected_accounts")
    .select("platform, account_name, status")
    .eq("workspace_id", id);
  const connectedAccounts = (accts ?? []) as { platform: string; account_name: string | null; status: string }[];

  const { data: ownerP } = await admin.from("profiles").select("email").eq("id", w.owner_id).maybeSingle();
  const owner_email = (ownerP as { email: string | null } | null)?.email ?? null;

  return {
    id: w.id,
    name: w.name,
    plan: w.plan,
    subscription_status: w.subscription_status,
    stripe_customer_id: w.stripe_customer_id,
    stripe_subscription_id: w.stripe_subscription_id,
    owner_email,
    created_at: w.created_at,
    members,
    connectedAccounts,
  };
}
