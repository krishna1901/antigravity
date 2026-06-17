import { listAutomations, getAutomationStats } from "@/lib/db/automations";
import { AutomationsView } from "./_view";

export default async function AutomationsPage() {
  const [automations, stats] = await Promise.all([listAutomations(), getAutomationStats()]);
  return (
    <AutomationsView
      automations={automations}
      pendingApprovals={stats.pendingApprovals}
      leadsCaptured={stats.leadsCaptured}
    />
  );
}
