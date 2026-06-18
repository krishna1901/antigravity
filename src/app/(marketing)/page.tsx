import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  CalendarDays,
  BarChart2,
  Inbox,
  Bot,
  Crosshair,
  ArrowRight,
  Check,
  Wand2,
  Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingCards } from "@/components/marketing/pricing-cards";

export const metadata: Metadata = {
  title: "SocialFlow AI — The AI content command center",
  description:
    "Plan, create, schedule, and grow across every social platform with one premium, AI-powered workspace. Built for creators, marketers, and agencies.",
};

const features = [
  { icon: Wand2, title: "AI Content Studio", body: "Generate hooks, captions, scripts, hashtags, and full carousels in your brand voice — in seconds." },
  { icon: CalendarDays, title: "Plan & schedule", body: "A drag-friendly calendar and smart queue publish to LinkedIn, Instagram, X, TikTok, and YouTube." },
  { icon: BarChart2, title: "Analytics that matter", body: "Track reach, engagement, and best-performing formats with clean, real-time dashboards." },
  { icon: Inbox, title: "Unified inbox", body: "Comments and DMs from every platform in one place — never miss a conversation again." },
  { icon: Bot, title: "Automations", body: "Auto-reply, capture leads, and run playbooks while you sleep — with human-in-the-loop approval." },
  { icon: Crosshair, title: "Competitor intel", body: "See what's working for the brands you watch and turn their best ideas into your next post." },
];

const steps = [
  { icon: Plug, title: "Connect your channels", body: "Securely link your social accounts in a couple of clicks — no API keys to manage." },
  { icon: Sparkles, title: "Create with AI", body: "Describe an idea and let the Content Studio draft on-brand posts you can refine instantly." },
  { icon: CalendarDays, title: "Schedule & grow", body: "Queue everything on your calendar, then watch analytics and your inbox in one command center." },
];

export default function MarketingHome() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-coral-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered social media command center
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Create, schedule & grow —{" "}
            <span className="bg-gradient-to-r from-brand-500 to-coral-500 bg-clip-text text-transparent">
              on autopilot
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            SocialFlow AI plans, writes, and publishes your content across every platform — so you
            spend less time posting and more time growing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup">
              <Button variant="gradient" size="lg" className="rounded-full">
                Get started free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="rounded-full">See pricing</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">No credit card required · Free Starter plan forever</p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-border/60 bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            One workspace for LinkedIn · Instagram · X · TikTok · YouTube · Facebook
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to run social</h2>
          <p className="mt-3 text-muted-foreground">From the first idea to the analytics that prove it worked.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-0.5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-coral-500 text-white shadow-lg shadow-brand-500/25">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Live in minutes</h2>
            <p className="mt-3 text-muted-foreground">Three steps from sign-up to your first scheduled post.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="absolute right-5 top-5 text-3xl font-extrabold text-brand-100">{i + 1}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade when you&apos;re ready to scale.</p>
        </div>
        <div className="mt-12">
          <PricingCards />
        </div>
        <div className="mt-8 text-center">
          <Link href="/pricing" className="text-sm font-semibold text-brand-600 hover:underline">
            Compare all features →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-sidebar p-10 text-center text-white sm:p-16">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-coral-500/20 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to grow on autopilot?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Join creators and teams using SocialFlow AI to plan, create, and publish smarter.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup">
                <Button size="lg" className="rounded-full bg-white text-sidebar hover:bg-white/90">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  View plans
                </Button>
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/60">
              <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-300" /> Free forever plan</li>
              <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-300" /> No credit card</li>
              <li className="flex items-center gap-1.5"><Check className="h-4 w-4 text-brand-300" /> Cancel anytime</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
