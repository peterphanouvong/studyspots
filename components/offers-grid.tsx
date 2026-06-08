import { Plug, Volume2, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { coreAmenities, type AmenityIcon } from "@/lib/amenities";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

const ICON: Record<AmenityIcon, LucideIcon> = {
  outlets: Plug,
  wifi: Wifi,
  noise: Volume2,
};

/** Peerspace-style amenity grid — unavailable items are muted + struck through. */
export function OffersGrid({ spot }: { spot: Spot }) {
  const amenities = coreAmenities(spot);

  return (
    <div className="rounded-2xl bg-card p-5">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {amenities.map((a) => {
          const Icon = ICON[a.key];
          return (
            <div
              key={a.key}
              className={cn(
                "flex items-center gap-3",
                !a.available && "text-muted-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.75} />
              <span className={cn("text-[15px]", !a.available && "line-through")}>
                {a.label}
              </span>
            </div>
          );
        })}
      </div>

      {((spot.vibe && spot.vibe.length > 0) || spot.music) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4">
          {spot.vibe?.map((v) => (
            <span
              key={v}
              className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-foreground"
            >
              {v}
            </span>
          ))}
          {spot.music && spot.music !== "None" && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              ♪ {spot.music}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
