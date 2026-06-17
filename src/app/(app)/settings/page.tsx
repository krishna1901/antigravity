"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Building2,
  Palette,
  Sparkles,
  Webhook,
  Bell,
  Clock,
  Plug,
  Save,
  Send,
  Plus,
  Settings as SettingsIcon,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeader } from "@/components/ui/section-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SelectField } from "@/components/ui/select-field";
import { StatusBadge } from "@/components/ui/status-badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import {
  settingsDefaults,
  connectedChannels,
  studioToneOptions,
  platformMeta,
  type Platform,
} from "@/lib/demo-data";

type SectionId =
  | "profile"
  | "workspace"
  | "brand"
  | "ai"
  | "webhooks"
  | "notifications"
  | "posting"
  | "channels";

type NavGroup = "Account" | "Content" | "Connections";

const sections: {
  id: SectionId;
  label: string;
  desc: string;
  icon: LucideIcon;
  group: NavGroup;
}[] = [
  { id: "profile", label: "Profile", desc: "Your account details", icon: User, group: "Account" },
  { id: "workspace", label: "Workspace", desc: "Team-wide settings", icon: Building2, group: "Account" },
  { id: "brand", label: "Brand", desc: "Identity & color", icon: Palette, group: "Account" },
  { id: "ai", label: "AI & content defaults", desc: "Generation defaults", icon: Sparkles, group: "Content" },
  { id: "posting", label: "Posting preferences", desc: "Queue & scheduling", icon: Clock, group: "Content" },
  { id: "notifications", label: "Notifications", desc: "Emails & alerts", icon: Bell, group: "Content" },
  { id: "webhooks", label: "Webhooks", desc: "External endpoints", icon: Webhook, group: "Connections" },
  { id: "channels", label: "Connected channels", desc: "Social accounts", icon: Plug, group: "Connections" },
];

const navGroups: NavGroup[] = ["Account", "Content", "Connections"];

const timezoneOptions = [
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
  "Australia/Sydney",
];

/* ----------------------------- small helpers ------------------------------ */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  description,
  icon: Icon,
  children,
  saveLabel = "Save changes",
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  saveLabel?: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <SectionHeader
          title={title}
          description={description}
          icon={Icon ? <Icon className="h-4 w-4" /> : undefined}
        />
      </div>
      <div className="space-y-5 px-5 py-5 sm:px-6">{children}</div>
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/20 px-5 py-3.5 sm:px-6">
        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> All changes saved
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm" variant="gradient">
            <Save className="h-3.5 w-3.5" /> {saveLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ notifications ----------------------------- */

const notificationPrefs: { id: string; label: string; desc: string; default: boolean }[] = [
  { id: "digests", label: "Email digests", desc: "A daily summary of activity across your workspace.", default: true },
  { id: "comments", label: "New comments", desc: "Get notified when someone comments on your posts.", default: true },
  { id: "published", label: "Scheduled post published", desc: "Confirmation when a queued post goes live.", default: true },
  { id: "trends", label: "Trend alerts", desc: "Spikes and emerging trends in your niche.", default: false },
  { id: "weekly", label: "Weekly report", desc: "Performance recap delivered every Monday.", default: true },
];

export default function SettingsPage() {
  const [active, setActive] = useState<SectionId>("profile");

  const [notifs, setNotifs] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationPrefs.map((p) => [p.id, p.default]))
  );
  const [autoQueue, setAutoQueue] = useState(true);
  const [bestTime, setBestTime] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        icon={<SettingsIcon className="h-5 w-5" />}
        title="Settings"
        description="Manage your profile, workspace, brand and preferences."
        actions={
          <>
            <Button variant="outline" size="sm">
              View changelog
            </Button>
            <Button size="sm" variant="gradient">
              <Save className="h-4 w-4" /> Save changes
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left nav */}
        <nav className="lg:col-span-3" aria-label="Settings sections">
          <div className="lg:sticky lg:top-6">
            {/* Mobile: horizontal pill scroller */}
            <ul className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {sections.map((s) => {
                const Icon = s.icon;
                const isActive = active === s.id;
                return (
                  <li key={s.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setActive(s.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-brand-500/10 to-coral-500/10 text-brand-700 ring-1 ring-brand-200"
                          : "border border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-brand-600" : ""}`} />
                      {s.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Desktop: grouped nav card */}
            <div className="hidden rounded-2xl border border-border bg-card p-2 shadow-sm lg:block">
              {navGroups.map((group) => (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {group}
                  </p>
                  <ul className="space-y-0.5">
                    {sections
                      .filter((s) => s.group === group)
                      .map((s) => {
                        const Icon = s.icon;
                        const isActive = active === s.id;
                        return (
                          <li key={s.id}>
                            <button
                              type="button"
                              onClick={() => setActive(s.id)}
                              aria-current={isActive ? "true" : undefined}
                              className={`group/nav relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-colors ${
                                isActive
                                  ? "bg-gradient-to-r from-brand-500/10 to-coral-500/10"
                                  : "hover:bg-muted/60"
                              }`}
                            >
                              {isActive && (
                                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-500 to-coral-500" />
                              )}
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  isActive
                                    ? "bg-gradient-to-br from-brand-500 to-coral-500 text-white shadow-sm"
                                    : "bg-muted text-muted-foreground group-hover/nav:text-foreground"
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span
                                  className={`block truncate text-sm font-medium ${
                                    isActive ? "text-brand-700" : "text-foreground"
                                  }`}
                                >
                                  {s.label}
                                </span>
                                <span className="block truncate text-[11px] text-muted-foreground">
                                  {s.id === "channels"
                                    ? `${connectedChannels.length} accounts`
                                    : s.desc}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* Right panels */}
        <div className="space-y-6 lg:col-span-9">
          {active === "profile" && (
            <Panel title="Profile" description="Your personal account details." icon={User}>
              <div className="flex items-center gap-4">
                <Avatar initials="AR" size="lg" ring />
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Upload photo
                    </Button>
                    <Button variant="ghost" size="sm">
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <Input defaultValue="Alex Rivera" />
                </Field>
                <Field label="Email address">
                  <Input type="email" defaultValue="alex@socialflow.ai" />
                </Field>
                <Field label="Role">
                  <SelectField
                    options={["Owner", "Admin", "Editor", "Viewer"]}
                    defaultValue="Owner"
                  />
                </Field>
                <Field label="Language">
                  <SelectField
                    options={["English (US)", "English (UK)", "Español", "Français"]}
                    defaultValue="English (US)"
                  />
                </Field>
              </div>
            </Panel>
          )}

          {active === "workspace" && (
            <Panel title="Workspace" description="Settings shared across your team." icon={Building2}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Workspace name">
                  <Input defaultValue={settingsDefaults.brandName} />
                </Field>
                <Field label="Tagline">
                  <Input defaultValue={settingsDefaults.tagline} />
                </Field>
                <Field label="Timezone" hint="Used for scheduling and best-time suggestions.">
                  <SelectField options={timezoneOptions} defaultValue={settingsDefaults.timezone} />
                </Field>
                <Field label="Plan">
                  <SelectField options={["Starter", "Pro", "Agency"]} defaultValue="Pro" />
                </Field>
              </div>
            </Panel>
          )}

          {active === "brand" && (
            <Panel title="Brand" description="How your brand appears across generated content." icon={Palette}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Brand name">
                  <Input defaultValue={settingsDefaults.brandName} />
                </Field>
                <Field label="Tagline">
                  <Input defaultValue={settingsDefaults.tagline} />
                </Field>
              </div>
              <Field label="Brand color" hint="Applied to exports, link previews and visual templates.">
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-brand-500 to-coral-500 shadow-sm ring-1 ring-border" />
                  <Input defaultValue="#FF5A3C" className="max-w-[160px] font-mono" />
                  <span className="text-xs text-muted-foreground">
                    Placeholder — full theming arrives in a later phase.
                  </span>
                </div>
              </Field>
            </Panel>
          )}

          {active === "ai" && (
            <Panel
              title="AI & content defaults"
              description="Defaults applied when generating new content."
              icon={Sparkles}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Default tone">
                  <SelectField options={studioToneOptions} defaultValue={settingsDefaults.defaultTone} />
                </Field>
                <Field label="AI provider" hint="Custom providers require an API key (configured later).">
                  <SelectField
                    options={["OpenAI (GPT)", "Claude", "Custom"]}
                    defaultValue={settingsDefaults.aiProvider}
                  />
                </Field>
              </div>
              <Field label="Default CTA">
                <Input defaultValue={settingsDefaults.defaultCTA} />
              </Field>
              <Field label="Default hashtags" hint="Appended to generated captions unless overridden.">
                <Textarea defaultValue={settingsDefaults.defaultHashtags} rows={3} />
              </Field>
            </Panel>
          )}

          {active === "webhooks" && (
            <Panel title="Webhooks" description="Send workspace events to an external endpoint." icon={Webhook}>
              <Field
                label="Webhook URL"
                hint="Placeholder — events POST as JSON. Signing secrets arrive in a later phase."
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input defaultValue={settingsDefaults.webhookUrl} className="font-mono" />
                  <Button variant="outline" size="sm" className="shrink-0">
                    <Send className="h-3.5 w-3.5" /> Test webhook
                  </Button>
                </div>
              </Field>
              <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
                Delivers events such as{" "}
                <span className="font-medium text-foreground">post.published</span>,{" "}
                <span className="font-medium text-foreground">comment.received</span> and{" "}
                <span className="font-medium text-foreground">automation.run</span>.
              </div>
            </Panel>
          )}

          {active === "notifications" && (
            <Panel title="Notifications" description="Choose what we email and notify you about." icon={Bell}>
              <ul className="divide-y divide-border">
                {notificationPrefs.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                    <Switch
                      checked={notifs[p.id]}
                      onCheckedChange={(v) => setNotifs((prev) => ({ ...prev, [p.id]: v }))}
                      aria-label={p.label}
                    />
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {active === "posting" && (
            <Panel title="Posting preferences" description="Control how posts are queued and scheduled." icon={Clock}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Default schedule window" hint="New posts default into this window.">
                  <SelectField
                    options={[
                      "Morning · 8–10 AM",
                      "Midday · 11 AM–1 PM",
                      "Afternoon · 2–4 PM",
                      "Evening · 6–8 PM",
                    ]}
                    defaultValue="Morning · 8–10 AM"
                  />
                </Field>
                <Field label="Posts per day cap">
                  <SelectField options={["2", "3", "4", "5", "Unlimited"]} defaultValue="3" />
                </Field>
              </div>
              <div className="divide-y divide-border rounded-xl border border-border">
                <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Auto-queue new drafts</p>
                    <p className="text-xs text-muted-foreground">
                      Ready posts are added to the next open slot automatically.
                    </p>
                  </div>
                  <Switch
                    checked={autoQueue}
                    onCheckedChange={setAutoQueue}
                    aria-label="Auto-queue new drafts"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Best-time suggestions</p>
                    <p className="text-xs text-muted-foreground">
                      Recommend optimal slots based on audience activity.
                    </p>
                  </div>
                  <Switch
                    checked={bestTime}
                    onCheckedChange={setBestTime}
                    aria-label="Best-time suggestions"
                  />
                </div>
              </div>
            </Panel>
          )}

          {active === "channels" && (
            <Panel
              title="Connected channels"
              description="Social accounts publishing through this workspace."
              icon={Plug}
              saveLabel="Done"
            >
              <div className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-2.5 text-xs">
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{connectedChannels.length}</span> channels ·{" "}
                  <span className="font-semibold text-emerald-600">
                    {connectedChannels.filter((c) => c.status === "connected").length} healthy
                  </span>
                  {connectedChannels.some((c) => c.status === "error") && (
                    <>
                      {" · "}
                      <span className="font-semibold text-red-600">
                        {connectedChannels.filter((c) => c.status === "error").length} need attention
                      </span>
                    </>
                  )}
                </span>
              </div>
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border">
                {connectedChannels.map((c) => {
                  const meta = platformMeta[c.platform as Platform];
                  const isError = c.status === "error";
                  return (
                    <li
                      key={`${c.platform}-${c.handle}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${meta.tint} ${meta.text}`}
                      >
                        <PlatformIcon platform={c.platform as Platform} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{c.handle}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {meta.label} ·{" "}
                          {isError ? "Reconnection required" : "Synced 8m ago"}
                        </p>
                      </div>
                      <StatusBadge status={c.status} withDot className="hidden sm:inline-flex" />
                      {isError ? (
                        <Button variant="destructive" size="sm">
                          Reconnect
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      )}
                    </li>
                  );
                })}
                <li>
                  <Link
                    href="/integrations"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-brand-600 transition-colors hover:bg-muted/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-brand-300 text-brand-500">
                      <Plus className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block">Connect a new channel</span>
                      <span className="block text-xs font-normal text-muted-foreground">
                        Add Instagram, LinkedIn, TikTok, X and more.
                      </span>
                    </span>
                  </Link>
                </li>
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
