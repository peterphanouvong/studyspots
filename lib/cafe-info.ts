import type { Spot, TriState } from "@/lib/types";

export type CafePropertyKey = "outlets" | "wifi" | "bathrooms";

export interface CafeProperty {
  key: CafePropertyKey;
  label: string;
  state: TriState;
}

/**
 * The yes/no/unknown cafe properties shown in the "Cafe info" grid.
 *
 * Values are derived from the spot's known data; anything we haven't confirmed
 * resolves to "unknown" and renders as a "?" until verified.
 */
export function cafeProperties(spot: Spot): CafeProperty[] {
  return [
    {
      key: "outlets",
      label:
        spot.outletCount > 0 ? `Outlets (${spot.outletCount})` : "Outlets",
      // A real count means yes; no count recorded = not verified.
      state: spot.outletCount > 0 ? "yes" : "unknown",
    },
    {
      key: "wifi",
      label: "Wi-Fi",
      state: spot.hasWifi ? "yes" : "no",
    },
    {
      key: "bathrooms",
      label: "Bathrooms",
      state:
        spot.hasBathroom === undefined ? "unknown" : spot.hasBathroom ? "yes" : "no",
    },
  ];
}
