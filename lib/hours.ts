import type { Hours } from "@/lib/types";

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
  const today = hours[now.getDay()];
  if (!today) return false;
  const open = toMinutes(today.open);
  const close = toMinutes(today.close);
  if (close <= open) return true; // closes after midnight
  return close >= hour * 60;
}

/** Today's hours as a label, e.g. "9:00 AM – 8:00 PM" or "Closed". */
export function formatTodayHours(hours: Hours, now: Date = new Date()): string {
  const today = hours[now.getDay()];
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
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const day = now.getDay();

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
