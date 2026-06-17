"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  RefreshCw,
  History,
  Bookmark,
  Send,
  Wand2,
  LayoutTemplate,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ChartCard } from "@/components/ui/chart-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ToolCard } from "@/components/ui/tool-card";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  studioTools,
  studioToneOptions,
  studioContentTypes,
  sampleGeneratedHooks,
  recentGenerations,
} from "@/lib/demo-data";
import { VariationCard } from "./_components/variation-card";

type Status = "idle" | "loading" | "done";

const platformOptions = ["Instagram", "LinkedIn", "TikTok", "YouTube", "X", "Facebook"];
const templateChips = [
  "Product launch thread",
  "Founder story",
  "Listicle carousel",
  "Hot take",
  "Case study",
];

export default function ContentStudioPage() {
  const [activeTool, setActiveTool] = useState("hook");
  const [status, setStatus] = useState<Status>("idle");
  const [topic, setTopic] = useState("");

  const tool = studioTools.find((t) => t.id === activeTool) ?? studioTools[0];

  function handleGenerate() {
    setStatus("loading");
    setTimeout(() => setStatus("done"), 900);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Tools"
        title="Content Studio"
        description="Generate on-brand content with AI — hooks, captions, hashtags, scripts and more."
        icon={<Wand2 className="h-5 w-5" />}
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="tabular-nums">1,240</span> credits left
            </span>
            <Button variant="ghost">
              <History className="h-4 w-4" /> View history
            </Button>
          </>
        }
      />

      {/* Tool picker */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Choose a tool</h2>
            <p className="text-xs text-muted-foreground">
              {studioTools.length} generators tuned for every platform and format
            </p>
          </div>
          <span className="hidden text-xs font-medium text-muted-foreground sm:block">
            Selected: <span className="font-semibold text-brand-600">{tool.name}</span>
          </span>
        </div>
        <div className="grid auto-rows-fr grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {studioTools.map((t) => (
            <ToolCard
              key={t.id}
              name={t.name}
              desc={t.desc}
              icon={t.icon}
              color={t.color}
              tag={t.tag || undefined}
              selected={activeTool === t.id}
              onClick={() => {
                setActiveTool(t.id);
                setStatus("idle");
              }}
            />
          ))}
        </div>
      </section>

      {/* Split-panel workspace */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* LEFT — config */}
        <ChartCard
          title={tool.name}
          subtitle={tool.desc}
          className="lg:col-span-4"
          footer={
            <span className="flex items-center justify-between">
              <span>Each generation uses ~4 credits</span>
              <span className="font-semibold text-foreground tabular-nums">1,240 left</span>
            </span>
          }
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="topic">Topic</Label>
                <span className="text-[11px] tabular-nums text-muted-foreground">{topic.length}/120</span>
              </div>
              <Input
                id="topic"
                value={topic}
                maxLength={120}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Why faceless content is exploding in 2026"
              />
              <p className="text-[11px] text-muted-foreground">What should this content be about?</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="audience">Audience</Label>
              <Input id="audience" placeholder="e.g. Solo marketers & creators" />
              <p className="text-[11px] text-muted-foreground">Who you&apos;re writing for — shapes voice and references.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="platform">Platform</Label>
                <SelectField id="platform" options={platformOptions} defaultValue="Instagram" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tone">Tone</Label>
                <SelectField id="tone" options={studioToneOptions} defaultValue={studioToneOptions[2]} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content-type">Content format</Label>
              <SelectField id="content-type" options={studioContentTypes} defaultValue={studioContentTypes[0]} />
              <p className="text-[11px] text-muted-foreground">Optimizes length and structure for the format.</p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-brand-500 to-coral-500 text-white shadow-sm shadow-brand-500/20 hover:from-brand-600 hover:to-coral-600"
            >
              <Sparkles className="h-4 w-4" />
              {status === "loading" ? "Generating…" : `Generate ${sampleGeneratedHooks.length} variations`}
            </Button>
          </div>
        </ChartCard>

        {/* MIDDLE — output preview */}
        <ChartCard
          title="Output preview"
          subtitle={status === "done" ? `${sampleGeneratedHooks.length} variations` : undefined}
          className="lg:col-span-5"
          action={
            status === "done" ? (
              <Button variant="ghost" size="sm" onClick={handleGenerate}>
                <RefreshCw className="h-3.5 w-3.5" /> Regenerate
              </Button>
            ) : undefined
          }
        >
          {status === "idle" && (
            <EmptyState
              icon={<Wand2 className="h-6 w-6" />}
              title="Nothing generated yet"
              description="Set a topic, audience, tone and platform on the left, then hit Generate to see on-brand variations here."
              action={
                <Button
                  onClick={handleGenerate}
                  className="bg-gradient-to-r from-brand-500 to-coral-500 text-white hover:from-brand-600 hover:to-coral-600"
                >
                  <Sparkles className="h-4 w-4" /> Generate
                </Button>
              }
            />
          )}

          {status === "loading" && (
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-brand-500" />
                Generating {sampleGeneratedHooks.length} on-brand variations…
              </p>
              {Array.from({ length: sampleGeneratedHooks.length }).map((_, i) => (
                <div key={i} className="space-y-2 rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-6 rounded-md" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-2.5 w-24" />
                </div>
              ))}
            </div>
          )}

          {status === "done" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Generated <span className="font-semibold text-foreground">{sampleGeneratedHooks.length}</span> on-brand variations for{" "}
                <span className="font-semibold text-foreground">{tool.name}</span>. Copy one or convert straight into a post.
              </p>

              <div className="space-y-3">
                {sampleGeneratedHooks.map((hook, i) => (
                  <VariationCard key={i} text={hook} index={i} />
                ))}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <Button className="bg-gradient-to-r from-brand-500 to-coral-500 text-white hover:from-brand-600 hover:to-coral-600">
                  <Send className="h-4 w-4" /> Convert to post
                </Button>
                <Button variant="outline">
                  <Bookmark className="h-4 w-4" /> Save as idea
                </Button>
                <Button variant="ghost">
                  <Copy className="h-4 w-4" /> Copy all
                </Button>
                <Button variant="ghost" className="ml-auto" onClick={handleGenerate}>
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
              </div>
            </div>
          )}
        </ChartCard>

        {/* RIGHT — side panel */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          <ChartCard
            title="Recent generations"
            action={
              <button type="button" className="text-xs font-semibold text-brand-600 hover:underline">
                View all
              </button>
            }
            bodyClassName="p-0"
          >
            <ul className="divide-y divide-border">
              {recentGenerations.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{g.tool}</p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{g.preview}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground/70">{g.time}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard title="Templates" subtitle="Start from a proven format">
            <div className="flex flex-col gap-1.5">
              {templateChips.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
                >
                  <span className="inline-flex items-center gap-2">
                    <LayoutTemplate className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand-500" />
                    {t}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
