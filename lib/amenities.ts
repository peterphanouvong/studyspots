import type { Spot } from "@/lib/types";

export type AmenityIcon = "outlets" | "wifi" | "noise";

export interface Amenity {
  key: AmenityIcon;
  label: string;
  /** Available = shown normally; unavailable = muted + struck through. */
  available: boolean;
}

/** The core study amenities for a spot, in display order. */
export function coreAmenities(spot: Spot): Amenity[] {
  const noise: Amenity =
    spot.noiseLevel === "Quiet"
      ? { key: "noise", label: "Quiet space", available: true }
      : spot.noiseLevel === "Loud"
        ? { key: "noise", label: "Can get loud", available: false }
        : { key: "noise", label: "Some background noise", available: true };

  return [
    {
      key: "outlets",
      label:
        spot.outletCount > 0
          ? `${spot.outletCount} power outlets`
          : "No power outlets",
      available: spot.outletCount > 0,
    },
    {
      key: "wifi",
      label: spot.hasWifi ? "WiFi" : "No WiFi",
      available: spot.hasWifi,
    },
    noise,
  ];
}
