import { isAIConfigured } from "@/lib/ai/providers";
import { listRecentGenerations } from "@/lib/db/ai-generations";
import { ContentStudioView } from "./_view";

/**
 * Content Studio (server) — fetches recent generations + whether a real AI
 * provider is configured, then hands off to the client view. Demo/preview mode
 * (no env) still renders fully via demo data + the demo-notice banner.
 */
export default async function ContentStudioPage() {
  const [recent, aiConfigured] = await Promise.all([
    listRecentGenerations(),
    isAIConfigured(),
  ]);

  return <ContentStudioView recent={recent} aiConfigured={aiConfigured} />;
}
