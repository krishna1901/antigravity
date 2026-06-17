import { useId } from "react";

export interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSublabel?: string;
  showLegend?: boolean;
  className?: string;
}

/** SVG donut chart with gradient segments + optional legend. Dependency-free. */
export function DonutChart({
  data,
  size = 180,
  thickness = 22,
  centerLabel,
  centerSublabel,
  showLegend = true,
  className,
}: DonutChartProps) {
  const id = useId().replace(/:/g, "");
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const segments = data.map((d, i) => {
    const len = (d.value / total) * circumference;
    const offset = data
      .slice(0, i)
      .reduce((s, x) => s + (x.value / total) * circumference, 0);
    return { ...d, len, offset, i };
  });

  return (
    <div className={className}>
      <div className="flex items-center gap-6">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <defs>
              {segments.map((s) => (
                <linearGradient key={s.label} id={`seg-${id}-${s.i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0.6" />
                </linearGradient>
              ))}
            </defs>
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--muted)" strokeWidth={thickness} />
            {segments.map((s) => (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={`url(#seg-${id}-${s.i})`}
                strokeWidth={thickness}
                strokeDasharray={`${s.len} ${circumference - s.len}`}
                strokeDashoffset={-s.offset}
                strokeLinecap="round"
              >
                <title>{`${s.label}: ${Math.round((s.value / total) * 100)}%`}</title>
              </circle>
            ))}
          </svg>
          {(centerLabel || centerSublabel) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {centerLabel && <span className="text-2xl font-bold tracking-tight tabular-nums text-foreground">{centerLabel}</span>}
              {centerSublabel && <span className="text-[11px] font-medium text-muted-foreground">{centerSublabel}</span>}
            </div>
          )}
        </div>

        {showLegend && (
          <ul className="flex-1 space-y-2.5">
            {data.map((d) => (
              <li key={d.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.label}
                </span>
                <span className="font-semibold tabular-nums text-foreground">{Math.round((d.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
