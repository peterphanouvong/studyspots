export type Noise = "Quiet" | "Moderate" | "Loud";

/** Tri-state for a cafe property: confirmed yes, confirmed no, or not yet verified. */
export type TriState = "yes" | "no" | "unknown";

/** Icon keys for "Good to know" cards, mapped to lucide icons in the UI. */
export type GoodToKnowIcon =
  | "parking"
  | "clock"
  | "seating"
  | "crowd"
  | "dessert"
  | "transit"
  | "wifi"
  | "power"
  | "location"
  | "info";

/** A founder-authored "Good to know" value-add: icon + headline + detail. */
export interface GoodToKnowItem {
  icon: GoodToKnowIcon;
  title: string;
  description: string;
}

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
  /**
   * Has customer bathrooms. `undefined` = not yet verified (shows "?" in Cafe info).
   * Outlets and Wi-Fi derive their tri-state from `outletCount` / `hasWifi`.
   */
  hasBathroom?: boolean;
  /** Wi-Fi password, shown in Cafe info when known. Empty → "+ Add" prompt. */
  wifiPassword?: string;
  /** Restroom door code, shown in Cafe info when known. Empty → "+ Add" prompt. */
  restroomCode?: string;
  /** "Good to know" — founder-authored value-adds. Display-only, never filtered. */
  goodToKnow?: GoodToKnowItem[];
  /** Photos for the carousel + gallery. UI falls back to a placeholder when empty. */
  images?: string[];
  /** Full URL to the cafe's website. */
  website?: string;
  /** Instagram handle, without the leading "@". */
  instagram?: string;
  /** Low-priority, display-only. */
  vibe?: string[];
  music?: string;
  /** Founder's personal one-liner about the spot. Hero of the Spot Gacha match card. */
  foundersTip?: string;
  /** Founder has physically verified this spot. Drives the green "Verified" badge. */
  verified?: boolean;
}
