export type Noise = "Quiet" | "Moderate" | "Loud";

/**
 * Opening hours for a single weekday.
 * Times are 24h "HH:MM" strings in the spot's local time.
 * `null` means closed that day.
 */
export type DayHours = { open: string; close: string } | null;

/** Length 7, indexed by `Date.getDay()` (0 = Sunday ... 6 = Saturday). */
export type Hours = [
  DayHours,
  DayHours,
  DayHours,
  DayHours,
  DayHours,
  DayHours,
  DayHours,
];

export interface Spot {
  id: string;
  name: string;
  suburb: string;
  lat: number;
  lng: number;
  address: string;
  googleMapsUrl: string;
  hasWifi: boolean;
  /** Real count of usable power points (not an adjective). */
  outletCount: number;
  noiseLevel: Noise;
  hours: Hours;
  /** "Good to know" — house rules + practical tips. Display-only, never filtered. */
  houseRules?: string[];
  /** Optional thumbnail; UI falls back to a placeholder when absent. */
  imageUrl?: string;
  /** Full URL to the cafe's website. */
  website?: string;
  /** Instagram handle, without the leading "@". */
  instagram?: string;
  /** Low-priority, display-only. */
  vibe?: string[];
  music?: string;
}
