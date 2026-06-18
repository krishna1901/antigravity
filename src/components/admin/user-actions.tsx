"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  setUserRoleAction,
  setUserStatusAction,
  deleteUserAction,
  impersonateUserAction,
} from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

type Role = "member" | "admin" | "super_admin";

export function UserActions({
  userId,
  role,
  status,
  isSelf,
}: {
  userId: string;
  role: string;
  status: string;
  isSelf: boolean;
}) {
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
        <span className="text-sm text-muted-foreground">Platform role</span>
        <select
          defaultValue={role}
          disabled={pending}
          onChange={(e) => run(() => setUserRoleAction(userId, e.target.value as Role))}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        >
          <option value="member">member</option>
          <option value="admin">admin</option>
          <option value="super_admin">super_admin</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {status === "suspended" ? (
          <Button variant="outline" disabled={pending} onClick={() => run(() => setUserStatusAction(userId, "active"))}>
            Reactivate
          </Button>
        ) : (
          <Button variant="outline" disabled={pending || isSelf} onClick={() => run(() => setUserStatusAction(userId, "suspended"))}>
            Suspend
          </Button>
        )}

        <Button variant="outline" disabled={pending || isSelf} onClick={() => run(() => impersonateUserAction(userId))}>
          Impersonate
        </Button>

        <Button
          variant="destructive"
          disabled={pending || isSelf}
          onClick={() => {
            if (confirm("Permanently delete this user and all of their workspaces & data? This cannot be undone.")) {
              run(() => deleteUserAction(userId), () => router.push("/admin/users"));
            }
          }}
        >
          Delete user
        </Button>
      </div>
    </div>
  );
}
