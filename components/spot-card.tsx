"use client";

import Link from "next/link";
import { useState } from "react";
import { Coffee, Info, Plug, Volume2, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { track } from "@/lib/analytics";
import { coreAmenities, type AmenityIcon } from "@/lib/amenities";
import { formatDistance } from "@/lib/distance";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

const ICON: Record<AmenityIcon, LucideIcon> = {
  outlets: Plug,
  wifi: Wifi,
  noise: Volume2,
};

interface SpotCardProps {
  spot: Spot;
  /** Distance from the user in km, if known. */
  distanceKm?: number;
  /** True when the matching map pin is highlighted. */
  active?: boolean;
  /** Fired on hover/focus so the page can highlight the map pin. */
  onActiveChange?: (id: string | null) => void;
}

export function SpotCard({
  spot,
  distanceKm,
  active,
  onActiveChange,
}: SpotCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = spot.imageUrl && !imgError;
  const amenities = coreAmenities(spot);

  return (
    <Link
      href={`/spots/${spot.id}`}
      onClick={() =>
        track("spot_card_clicked", {
          id: spot.id,
          name: spot.name,
          suburb: spot.suburb,
        })
      }
      onMouseEnter={() => onActiveChange?.(spot.id)}
      onMouseLeave={() => onActiveChange?.(null)}
      onFocus={() => onActiveChange?.(spot.id)}
      onBlur={() => onActiveChange?.(null)}
      className="group flex flex-col gap-3 rounded-2xl outline-none"
    >
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted ring-offset-2 ring-offset-background transition-all",
          active && "ring-2 ring-primary",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring",
        )}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={spot.imageUrl}
            alt={spot.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground">
            <Coffee className="size-10" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-heading text-[17px] font-semibold leading-tight tracking-tight">
            {spot.name}
          </h3>
          {distanceKm !== undefined && (
            <span className="shrink-0 text-sm text-muted-foreground">
              {formatDistance(distanceKm)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{spot.suburb}</p>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {amenities.map((a) => {
            const Icon = ICON[a.key];
            return (
              <span
                key={a.key}
                className={cn(
                  "inline-flex items-center gap-1",
                  !a.available && "line-through opacity-70",
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
                {a.label}
              </span>
            );
          })}
        </div>

        {spot.houseRules && spot.houseRules.length > 0 && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/70">
            <Info className="size-3 shrink-0" strokeWidth={2} />
            <span className="truncate">
              {spot.houseRules[0]}
              {spot.houseRules.length > 1 &&
                ` · +${spot.houseRules.length - 1} more`}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
