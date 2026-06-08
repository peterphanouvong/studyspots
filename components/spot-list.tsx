import { SpotCard } from "@/components/spot-card";
import type { Coords } from "@/lib/distance";
import { distanceKm } from "@/lib/distance";
import type { Spot } from "@/lib/types";

interface SpotListProps {
  spots: Spot[];
  /** User location, used to show per-card distance. */
  origin?: Coords;
  /** Spot whose map pin is currently highlighted. */
  activeId?: string | null;
  onActiveChange?: (id: string | null) => void;
}

export function SpotList({
  spots,
  origin,
  activeId,
  onActiveChange,
}: SpotListProps) {
  if (spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-20 text-center">
        <p className="font-heading text-lg font-semibold">No spots match</p>
        <p className="text-sm text-muted-foreground">
          Try turning off a filter to see more places.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {spots.map((spot) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          distanceKm={origin ? distanceKm(origin, spot) : undefined}
          active={activeId === spot.id}
          onActiveChange={onActiveChange}
        />
      ))}
    </div>
  );
}
