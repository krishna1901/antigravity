import "server-only";
import Stripe from "stripe";
import { getPlatformSecret } from "@/lib/platform/secrets";

/**
 * Phase 5 — Stripe client + capability guards.
 *
 * Server-only. With no `STRIPE_SECRET_KEY` the whole billing feature degrades to
 * a safe no-op so the app still builds and previews in demo mode. Never import
 * this into client code, and never expose the secret or webhook signing key.
 */

let cached: Stripe | null = null;

/** True when a Stripe secret key is present (checkout / portal can run). */
export async function isStripeConfigured(): Promise<boolean> {
  return Boolean(await getPlatformSecret("STRIPE_SECRET_KEY"));
}

/** True when both the secret key and the webhook signing secret are present. */
export async function isStripeWebhookConfigured(): Promise<boolean> {
  const [secret, webhook] = await Promise.all([
    getPlatformSecret("STRIPE_SECRET_KEY"),
    getPlatformSecret("STRIPE_WEBHOOK_SECRET"),
  ]);
  return Boolean(secret && webhook);
}

/**
 * Shared Stripe client, or `null` when unconfigured. We intentionally do NOT pin
 * `apiVersion` so the SDK uses the version its TypeScript types were generated
 * against, keeping runtime and types in lockstep.
 */
export async function getStripe(): Promise<Stripe | null> {
  const secretKey = await getPlatformSecret("STRIPE_SECRET_KEY");
  if (!secretKey) return null;
  if (!cached) cached = new Stripe(secretKey);
  return cached;
}

/** Absolute app origin for building return URLs (mirrors the OAuth routes). */
export function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}
