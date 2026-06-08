import type { Filters } from "@/components/filter-pills";
import { closesLate, isOpenNow } from "@/lib/hours";
import type { Spot } from "@/lib/types";

/**
 * Returns the spots matching every active filter. Active filters combine with AND.
 */
export function filterSpots(
  spots: Spot[],
  filters: Filters,
  now: Date = new Date(),
): Spot[] {
  return spots.filter((spot) => {
    if (filters.outlets && spot.outletCount <= 0) return false;
    if (filters.wifi && !spot.hasWifi) return false;
    if (filters.quiet && spot.noiseLevel === "Loud") return false;
    if (filters.openNow && !isOpenNow(spot.hours, now)) return false;
    if (filters.openLate && !closesLate(spot.hours, now)) return false;
    return true;
  });
}
