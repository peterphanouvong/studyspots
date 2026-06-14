import type { Hours } from "@/lib/types";

/**
 * Spot hours are expressed in the spot's local time, which for every spot is
 * Sydney. We must therefore read "now" as Sydney wall-clock time — never the
 * host's local zone, which is UTC on the server (Vercel) and the visitor's own
 * zone in the browser.
 */
const SPOT_TZ = "Australia/Sydney";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/** The day-of-week (0 = Sunday) and minutes-since-midnight in Sydney for `now`. */
function spotWallClock(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SPOT_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = WEEKDAY_INDEX[get("weekday")] ?? now.getDay();
  // Intl can emit "24" for midnight depending on the runtime; normalise to 0.
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  return { day, minutes: hour * 60 + minute };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Does the spot stay open late today? True if it closes at/after `hour` (default
 * 20:00), or runs past midnight.
 */
export function closesLate(
  hours: Hours,
  now: Date = new Date(),
  hour = 20,
): boolean {
  const today = hours[spotWallClock(now).day];
  if (!today) return false;
  const open = toMinutes(today.open);
  const close = toMinutes(today.close);
  if (close <= open) return true; // closes after midnight
  return close >= hour * 60;
}

/** Today's hours as a label, e.g. "9:00 AM – 8:00 PM" or "Closed". */
export function formatTodayHours(hours: Hours, now: Date = new Date()): string {
  const today = hours[spotWallClock(now).day];
  if (!today) return "Closed today";
  return `${to12h(today.open)} – ${to12h(today.close)}`;
}

function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Is the spot open at the given moment?
 *
 * Handles overnight ranges (e.g. open 22:00, close 02:00) by treating a
 * close time that is less-than-or-equal to the open time as the next day.
 */
export function isOpenNow(hours: Hours, now: Date = new Date()): boolean {
  const { day, minutes: minutesNow } = spotWallClock(now);

  // Spot open past midnight: a window that started "yesterday" may still apply.
  const yesterday = hours[(day + 6) % 7];
  if (yesterday) {
    const open = toMinutes(yesterday.open);
    const close = toMinutes(yesterday.close);
    if (close <= open && minutesNow < close) {
      return true;
    }
  }

  const today = hours[day];
  if (!today) return false;

  const open = toMinutes(today.open);
  const close = toMinutes(today.close);

  if (close <= open) {
    // Overnight window starting today (e.g. 22:00 -> 02:00).
    return minutesNow >= open;
  }
  return minutesNow >= open && minutesNow < close;
}
