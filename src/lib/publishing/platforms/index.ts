import "server-only";
import type { Platform } from "@/lib/demo-data";
import type { PublishingJobRow } from "@/lib/db/types";
import type { FormattedPost } from "@/lib/publishing/formatter";
import { publish as publishLinkedIn } from "./linkedin";
import { publish as publishMeta } from "./meta";
import { publish as publishYouTube } from "./youtube";
import { publish as publishTikTok } from "./tiktok";
import { publish as publishX } from "./x";

/**
 * Unified publish result. Platform modules return the `ok|status|message`
 * subset; real publishers (Phase 3C+) may additionally include the external id
 * and permalink.
 */
export interface PublishResult {
  ok: boolean;
  status: "posted" | "failed" | "not_implemented";
  message: string;
  externalId?: string;
  externalUrl?: string;
}

/**
 * Dispatch a job to the matching platform publisher. Instagram + Facebook both
 * route to the Meta module (Graph API). Until Phase 3C+, publishers report
 * `not_implemented`, which the runner records as a simulated success by default.
 */
export async function publishToPlatform(
  platform: Platform,
  job: PublishingJobRow,
  formatted: FormattedPost
): Promise<PublishResult> {
  switch (platform) {
    case "linkedin":
      return publishLinkedIn(job, formatted);
    case "instagram":
    case "facebook":
      return publishMeta(job, formatted);
    case "youtube":
      return publishYouTube(job, formatted);
    case "tiktok":
      return publishTikTok(job, formatted);
    case "x":
      return publishX(job, formatted);
    default:
      return { ok: false, status: "failed", message: `Unsupported platform: ${platform}` };
  }
}
