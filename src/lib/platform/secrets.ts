import "server-only";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptSecret, decryptSecret, isEncryptionConfigured } from "@/lib/security/crypto";

interface SecretRow {
  key: string;
  value: string | null;
  is_secret: boolean;
}

/** Per-request snapshot of the whole platform_secrets table (service-role). */
const loadSecrets = cache(async (): Promise<Record<string, SecretRow>> => {
  const admin = createAdminClient();
  if (!admin) return {};
  const { data } = await admin.from("platform_secrets").select("key, value, is_secret");
  const map: Record<string, SecretRow> = {};
  for (const r of (data ?? []) as SecretRow[]) map[r.key] = r;
  return map;
});

/**
 * Resolve a platform secret/config value: the admin-managed DB store first,
 * then the environment variable as a fallback. Returns undefined when neither
 * is set. Decrypts secret values transparently.
 */
export async function getPlatformSecret(name: string): Promise<string | undefined> {
  const map = await loadSecrets();
  const row = map[name];
  if (row?.value) {
    if (row.is_secret) {
      try {
        return decryptSecret(row.value);
      } catch {
        // corrupt/rotated key — fall through to env
      }
    } else {
      return row.value;
    }
  }
  const env = process.env[name];
  return env && env.length ? env : undefined;
}

/** Upsert a platform secret (encrypted when isSecret). Returns ok. */
export async function setPlatformSecret(
  name: string,
  value: string,
  opts: { isSecret?: boolean; updatedBy?: string } = {}
): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Admin backend not configured." };

  const isSecret = opts.isSecret ?? true;
  let stored = value;
  if (isSecret) {
    if (!isEncryptionConfigured()) return { ok: false, error: "Set TOKEN_ENCRYPTION_KEY to store secrets." };
    stored = encryptSecret(value);
  }

  const { error } = await admin.from("platform_secrets").upsert(
    { key: name, value: stored, is_secret: isSecret, updated_by: opts.updatedBy ?? null, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function clearPlatformSecret(name: string): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Admin backend not configured." };
  const { error } = await admin.from("platform_secrets").delete().eq("key", name);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export interface SecretStatus {
  setInDb: boolean;
  setInEnv: boolean;
}

/** For the admin UI: which keys are set, and from where (never returns values). */
export async function getSecretStatuses(keys: string[]): Promise<Record<string, SecretStatus>> {
  const map = await loadSecrets();
  const out: Record<string, SecretStatus> = {};
  for (const k of keys) {
    out[k] = { setInDb: Boolean(map[k]?.value), setInEnv: Boolean(process.env[k]) };
  }
  return out;
}
