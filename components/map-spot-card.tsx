"use client";

import Link from "next/link";
import { Plug, Volume2, Wifi, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ImageCarousel } from "@/components/image-carousel";
import { track } from "@/lib/analytics";
import { coreAmenities, type AmenityIcon } from "@/lib/amenities";
import { distanceKm, formatDistance, type Coords } from "@/lib/distance";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";

const ICON: Record<AmenityIcon, LucideIcon> = {
  outlets: Plug,
  wifi: Wifi,
  noise: Volume2,
};

/** The popup card shown over the map when a pin is selected. */
export function MapSpotCard({
  spot,
  origin,
  onClose,
}: {
  spot: Spot;
  origin?: Coords;
  onClose: () => void;
}) {
  const amenities = coreAmenities(spot);

  return (
    <div className="w-[280px] overflow-hidden rounded-2xl bg-card text-left shadow-xl">
      <div className="relative">
        <ImageCarousel
          images={spot.images}
          alt={spot.name}
          className="aspect-video w-full"
        />
        <button
          type="button"
          aria-label="Close"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm transition hover:bg-white"
        >
          <X className="size-4" />
        </button>
      </div>

      <Link
        href={`/spots/${spot.id}`}
        onClick={() =>
          track("spot_card_clicked", {
            id: spot.id,
            name: spot.name,
            suburb: spot.suburb,
            from: "map",
          })
        }
        className="block p-3"
      >
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-heading text-[15px] font-semibold leading-tight">
            {spot.name}
          </h3>
          {origin && (
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDistance(distanceKm(origin, spot))}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{spot.suburb}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
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
      </Link>
    </div>
  );
}
