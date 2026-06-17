"use client";

import { useMemo, useState } from "react";
import {
  RefreshCw,
  Sparkles,
  Workflow,
  Webhook,
  Plug,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Segmented } from "@/components/ui/segmented";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { integrations, type Platform } from "@/lib/demo-data";

type Integration = (typeof integrations)[number];

const PLATFORM_IDS: Platform[] = ["instagram", "facebook", "linkedin", "youtube", "tiktok", "x"];

const lucideById: Record<string, LucideIcon> = {
  openai: Sparkles,
  claude: Sparkles,
  n8n: Workflow,
  webhooks: Webhook,
};

const categories = ["Social", "AI", "Automation"] as const;
type Category = (typeof categories)[number];

const categoryMeta: Record<Category, { description: string }> = {
  Social: { description: "Publish and sync engagement across your social channels." },
  AI: { description: "Connect AI providers that power content generation." },
  Automation: { description: "Wire SocialFlow into your workflows and external tools." },
};

const setupNotes: Record<Integration["status"], string> = {
  connected: "Auto-syncs every 15 min",
  available: "Requires OAuth connection",
  error: "Token expired — reconnect",
};

type StatusFilter = "all" | Integration["status"];

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "connected", label: "Connected" },
  { value: "available", label: "Available" },
  { value: "error", label: "Needs attention" },
];

function isPlatform(id: string): id is Platform {
  return (PLATFORM_IDS as string[]).includes(id);
}

function IntegrationTile({ item }: { item: Integration }) {
  const LucideIco = lucideById[item.id] ?? Plug;
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-105 ${item.accent}`}
    >
      {item.category === "Social" && isPlatform(item.id) ? (
        <PlatformIcon platform={item.id} className="h-5 w-5 text-white" />
      ) : (
        <LucideIco className="h-5 w-5" />
      )}
    </div>
  );
}

function IntegrationCard({ item }: { item: Integration }) {
  return (
    <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated hover:ring-1 hover:ring-brand-200/70">
      <div className="flex items-start gap-3">
        <IntegrationTile item={item} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{item.name}</h3>
            <StatusBadge status={item.status} withDot />
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 rounded-xl bg-muted/40 px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          Last sync · <span className="font-medium text-foreground/80">{item.lastSync ?? "Never"}</span>
        </p>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {item.status === "error" ? (
            <AlertTriangle className="h-3 w-3 shrink-0 text-red-500" />
          ) : (
            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
          )}
          {setupNotes[item.status]}
        </p>
      </div>

      <div className="mt-4 flex items-center">
        {item.status === "connected" ? (
          <Button variant="outline" size="sm" className="w-full">
            Manage
          </Button>
        ) : item.status === "error" ? (
          <Button variant="destructive" size="sm" className="w-full">
            <RefreshCw className="h-3.5 w-3.5" /> Reconnect
          </Button>
        ) : (
          <Button
            size="sm"
            className={`w-full bg-gradient-to-r text-white hover:opacity-90 ${item.accent}`}
          >
            <Plug className="h-3.5 w-3.5" /> Connect
          </Button>
        )}
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [status, setStatus] = useState<StatusFilter>("all");

  const connected = integrations.filter((i) => i.status === "connected").length;
  const available = integrations.filter((i) => i.status === "available").length;
  const needsAttention = integrations.filter((i) => i.status === "error").length;
  const aiProviders = integrations.filter((i) => i.category === "AI").length;

  const filtered = useMemo(
    () => (status === "all" ? integrations : integrations.filter((i) => i.status === status)),
    [status]
  );

  const stats = [
    {
      label: "Connected",
      value: connected,
      delta: `${Math.round((connected / integrations.length) * 100)}%`,
      positive: true,
      hint: "Active & syncing",
      icon: <CheckCircle2 className="h-4 w-4" />,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: "Available",
      value: available,
      hint: "Ready to connect",
      icon: <Plug className="h-4 w-4" />,
      accent: "from-brand-500 to-coral-500",
    },
    {
      label: "Needs attention",
      value: needsAttention,
      delta: needsAttention > 0 ? "Action" : undefined,
      positive: false,
      hint: "Reconnect required",
      icon: <AlertTriangle className="h-4 w-4" />,
      accent: "from-amber-500 to-orange-500",
    },
    {
      label: "AI providers",
      value: aiProviders,
      hint: "Generation engines",
      icon: <Sparkles className="h-4 w-4" />,
      accent: "from-violet-500 to-indigo-500",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Connections"
        title="Integrations"
        description="Connect your social accounts, AI providers and automation tools."
        icon={<Plug className="h-5 w-5" />}
        actions={
          <>
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
              <CheckCircle2 className="h-3.5 w-3.5" /> {connected} live
            </span>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" /> Refresh status
            </Button>
            <Button className="bg-gradient-to-r from-brand-500 to-coral-500 text-white shadow-sm shadow-brand-500/20 hover:opacity-95">
              <Plug className="h-4 w-4" /> Browse marketplace
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            positive={s.positive}
            hint={s.hint}
            icon={s.icon}
            accent={s.accent}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <p className="px-1 text-xs font-medium text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground tabular-nums">{filtered.length}</span> of{" "}
          {integrations.length} integrations
        </p>
        <Segmented
          options={statusFilters}
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
          size="sm"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" />}
          title="No integrations match this filter"
          description="Nothing here right now. Switch back to all integrations to browse everything you can connect."
          action={
            <Button variant="outline" size="sm" onClick={() => setStatus("all")}>
              <RefreshCw className="h-4 w-4" /> Show all integrations
            </Button>
          }
        />
      ) : (
        categories.map((category) => {
          const items = filtered.filter((i) => i.category === category);
          if (items.length === 0) return null;
          return (
            <section key={category} className="space-y-4">
              <SectionHeader
                title={category}
                description={categoryMeta[category].description}
                action={
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {items.length} {items.length === 1 ? "integration" : "integrations"}
                  </span>
                }
              />
              <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <IntegrationCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
