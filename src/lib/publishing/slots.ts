/**
 * Phase 7 — posting-schedule preferences + next-queue slot computation.
 *
 * Pure module (safe for client + server). The scheduler uses `nextQueueSlot` to
 * resolve the real next "queue" time for a workspace from its saved posting
 * preferences + IANA timezone, instead of a naive +24h placeholder.
 */

export interface PostingPrefs {
  /** Label of the preferred posting window (see POSTING_WINDOWS). */
  defaultWindow: string;
  /** Max posts per day; 0 = unlimited. */
  postsPerDay: number;
  /** Auto-queue ready drafts into the next open slot. */
  autoQueue: boolean;
  /** Surface best-time suggestions. */
  bestTime: boolean;
}

export const POSTING_WINDOWS = [
  "Morning · 8–10 AM",
  "Midday · 11 AM–1 PM",
  "Afternoon · 2–4 PM",
  "Evening · 6–8 PM",
] as const;

export const defaultPostingPrefs: PostingPrefs = {
  defaultWindow: POSTING_WINDOWS[0],
  postsPerDay: 3,
  autoQueue: true,
  bestTime: true,
};

/** Local "HH:MM" candidate times offered within each posting window. */
const WINDOW_TIMES: Record<string, string[]> = {
  "Morning · 8–10 AM": ["08:00", "09:00", "10:00"],
  "Midday · 11 AM–1 PM": ["11:00", "12:00", "13:00"],
  "Afternoon · 2–4 PM": ["14:00", "15:00", "16:00"],
  "Evening · 6–8 PM": ["18:00", "19:00", "20:00"],
};

function windowTimes(window: string): string[] {
  return WINDOW_TIMES[window] ?? WINDOW_TIMES[POSTING_WINDOWS[0]];
}

/** Wall-clock fields of `date` as observed in `timeZone`. */
function tzParts(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  return { y: map.year, mo: map.month - 1, d: map.day, h: map.hour, mi: map.minute, s: map.second };
}

/** Offset (ms) between `timeZone` wall-clock and UTC at the given instant. */
function tzOffsetMs(date: Date, timeZone: string): number {
  const p = tzParts(date, timeZone);
  const asUTC = Date.UTC(p.y, p.mo, p.d, p.h, p.mi, p.s);
  return asUTC - date.getTime();
}

/** The UTC instant for a wall-clock time in `timeZone` (DST-correct). */
function zonedWallClockToUtc(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  timeZone: string
): Date {
  const naive = Date.UTC(y, mo, d, h, mi, 0);
  // Two-pass correction handles DST boundaries.
  let ts = naive - tzOffsetMs(new Date(naive), timeZone);
  ts = naive - tzOffsetMs(new Date(ts), timeZone);
  return new Date(ts);
}

/**
 * The first window slot strictly after `from`, scanning up to 14 days ahead in
 * the workspace timezone. Falls back to `from + 1h` if nothing resolves.
 */
export function nextQueueSlot(
  prefs: PostingPrefs,
  timeZone: string,
  from: Date = new Date()
): string {
  const tz = timeZone || "UTC";
  const times = windowTimes(prefs.defaultWindow);
  for (let dayOffset = 0; dayOffset <= 14; dayOffset++) {
    const base = new Date(from.getTime() + dayOffset * 86_400_000);
    const { y, mo, d } = tzParts(base, tz);
    for (const t of times) {
      const [h, mi] = t.split(":").map(Number);
      const candidate = zonedWallClockToUtc(y, mo, d, h, mi, tz);
      if (candidate.getTime() > from.getTime()) return candidate.toISOString();
    }
  }
  return new Date(from.getTime() + 60 * 60 * 1000).toISOString();
}
