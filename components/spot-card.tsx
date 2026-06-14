"use client";

import Link from "next/link";
import { Info, Plug, Volume2, Wifi } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ImageCarousel } from "@/components/image-carousel";
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
      <ImageCarousel
        images={spot.images}
        alt={spot.name}
        className={cn(
          "aspect-[4/3] w-full rounded-2xl ring-offset-2 ring-offset-background transition-all",
          active && "ring-2 ring-primary",
          "group-focus-visible:ring-2 group-focus-visible:ring-ring",
        )}
      />

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

        {spot.goodToKnow && spot.goodToKnow.length > 0 && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-foreground/70">
            <Info className="size-3 shrink-0" strokeWidth={2} />
            <span className="truncate">
              {spot.goodToKnow[0].title}
              {spot.goodToKnow.length > 1 &&
                ` · +${spot.goodToKnow.length - 1} more`}
            </span>
          </p>
        )}
      </div>
    </Link>
  );
}
