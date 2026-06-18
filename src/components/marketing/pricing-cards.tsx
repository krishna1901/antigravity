import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN_ORDER, PLANS } from "@/lib/billing/plans";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PLAN_ORDER.map((id) => {
        const plan = PLANS[id];
        const featured = Boolean(plan.featured);
        return (
          <div
            key={id}
            className={cn(
              "relative flex flex-col rounded-3xl border bg-card p-7",
              featured
                ? "border-brand-300 shadow-elevated ring-2 ring-brand-500/30"
                : "border-border shadow-soft"
            )}
          >
            {featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-coral-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                Most popular
              </span>
            )}
            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.tagline}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold tracking-tight tabular-nums">{plan.price}</span>
              <span className="text-sm text-muted-foreground">/ {plan.cadence}</span>
            </div>
            <Link href="/signup" className="mt-5 block">
              <Button variant={featured ? "gradient" : "outline"} className="w-full rounded-full">
                {id === "starter" ? "Start free" : `Choose ${plan.name}`}
              </Button>
            </Link>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {f}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
