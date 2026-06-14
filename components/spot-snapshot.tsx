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

/** Compact at-a-glance study facts (outlets · Wi-Fi · noise). */
export function SpotSnapshot({ spot }: { spot: Spot }) {
  const amenities = coreAmenities(spot);
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
      {amenities.map((a) => {
        const Icon = ICON[a.key];
        return (
          <span
            key={a.key}
            className={cn(
              "inline-flex items-center gap-1.5",
              !a.available && "line-through opacity-70",
            )}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {a.label}
          </span>
        );
      })}
    </div>
  );
}
