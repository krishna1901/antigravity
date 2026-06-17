"use client";

import { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * A single generated variation in the Content Studio output preview.
 * Shows a copy affordance with transient "Copied" feedback and lightweight
 * metadata (length) so the done-state reads like a real generation result.
 */
export function VariationCard({ text, index }: { text: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      /* clipboard unavailable in demo — still show feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          <Sparkles className="h-3 w-3" /> Variation {index + 1}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Copy variation ${index + 1}`}
          onClick={handleCopy}
          className={copied ? "text-emerald-600" : "text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{text}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
        <span className="tabular-nums">{text.length} chars</span>
        <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
        <span className={copied ? "text-emerald-600" : ""}>{copied ? "Copied to clipboard" : "Ready to use"}</span>
      </div>
    </div>
  );
}
