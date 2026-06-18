import { cn } from "@/lib/utils";

type Tone = "muted" | "brand" | "green" | "red" | "amber" | "violet";

const tones: Record<Tone, string> = {
  muted: "bg-muted text-muted-foreground",
  brand: "bg-brand-50 text-brand-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
};

export function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", tones[tone])}>
      {children}
    </span>
  );
}

export const roleTone = (role: string): Tone => (role === "super_admin" ? "violet" : role === "admin" ? "brand" : "muted");
export const statusTone = (s: string): Tone => (s === "suspended" ? "red" : "green");
export const planTone = (p: string): Tone => (p === "agency" ? "violet" : p === "pro" ? "brand" : "muted");
