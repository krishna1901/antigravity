import { cn } from "@/lib/utils";

export interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
  barClassName?: string;
  valueFormatter?: (n: number) => string;
  /** Render the formatted value above each bar */
  showValues?: boolean;
  /** Render a left value axis (max / mid / 0) + horizontal gridlines */
  showAxis?: boolean;
}

/**
 * CSS-based vertical bar chart — crisp, responsive, dependency-free.
 * Bars reveal with a subtle staggered grow-in (respects reduced-motion).
 */
export function BarChart({
  data,
  height = 200,
  className,
  barClassName,
  valueFormatter = (n) => `${n}`,
  showValues = false,
  showAxis = false,
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div className={className}>
      <div className="flex gap-3">
        {showAxis && (
          <div
            className="flex shrink-0 flex-col justify-between pb-px text-right text-[10px] font-medium tabular-nums text-muted-foreground"
            style={{ height }}
            aria-hidden
          >
            <span>{valueFormatter(max)}</span>
            <span>{valueFormatter(Math.round(max / 2))}</span>
            <span>0</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="relative">
            {/* gridlines */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden>
              <span className="border-t border-border/70" />
              <span className="border-t border-dashed border-border/50" />
              <span className="border-t border-border" />
            </div>
            <div className="relative flex items-end justify-between gap-3" style={{ height }}>
              {data.map((d, i) => {
                const pct = Math.max((d.value / max) * 100, 2);
                return (
                  <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                    {showValues && (
                      <span className="text-[11px] font-semibold tabular-nums text-foreground/70">{valueFormatter(d.value)}</span>
                    )}
                    <div className="relative flex w-full max-w-12 flex-1 items-end">
                      <div
                        title={`${d.label}: ${valueFormatter(d.value)}`}
                        style={{ height: `${pct}%`, animationDelay: `${i * 60}ms` }}
                        className={cn(
                          "chart-bar w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-coral-400 shadow-sm transition-colors duration-300 group-hover:from-brand-600 group-hover:to-coral-500",
                          barClassName
                        )}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-2 flex justify-between gap-3">
            {data.map((d) => (
              <span key={d.label} className="flex-1 text-center text-[11px] font-medium text-muted-foreground">
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
