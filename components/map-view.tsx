"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";
import type { Coords } from "@/lib/distance";
import type { Spot } from "@/lib/types";

/**
 * Pans/zooms the map to frame the given spots whenever `triggerKey` changes
 * (e.g. the selected area). Filter-pill toggles don't move the map.
 */
function FitBounds({
  spots,
  triggerKey,
}: {
  spots: Spot[];
  triggerKey: string;
}) {
  const map = useMap();
  useEffect(() => {
    if (!map || spots.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    spots.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    map.fitBounds(bounds, 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, triggerKey]);
  return null;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapViewProps {
  apiKey: string;
  spots: Spot[];
  center: Coords;
  /** Spot currently hovered in the list, highlighted on the map. */
  activeId: string | null;
  onActiveChange: (id: string | null) => void;
  onBoundsChange: (bounds: MapBounds) => void;
  /** Map re-frames to the current spots whenever this value changes. */
  fitKey: string;
}

export function MapView({
  apiKey,
  spots,
  center,
  activeId,
  onActiveChange,
  onBoundsChange,
  fitKey,
}: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = spots.find((s) => s.id === selectedId) ?? null;

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted p-6 text-center text-sm text-muted-foreground">
        Map unavailable — set GOOGLE_MAPS_API_KEY to enable it.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId="DEMO_MAP_ID"
        disableDefaultUI
        gestureHandling="greedy"
        className="h-full w-full"
        onCameraChanged={(ev) => onBoundsChange(ev.detail.bounds)}
        onClick={() => setSelectedId(null)}
      >
        <FitBounds spots={spots} triggerKey={fitKey} />
        {spots.map((spot) => {
          const highlighted = spot.id === activeId || spot.id === selectedId;
          return (
            <AdvancedMarker
              key={spot.id}
              position={{ lat: spot.lat, lng: spot.lng }}
              zIndex={highlighted ? 10 : 1}
              onClick={() => {
                setSelectedId(spot.id);
                onActiveChange(spot.id);
              }}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 border-white bg-primary shadow-md transition-transform",
                  highlighted ? "size-6 scale-[1.15]" : "size-5",
                )}
              >
                <span className="size-1.5 rounded-full bg-white" />
              </div>
            </AdvancedMarker>
          );
        })}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            pixelOffset={[0, -12]}
            onCloseClick={() => setSelectedId(null)}
          >
            <div className="px-1 py-0.5">
              <p className="text-sm font-semibold text-zinc-900">
                {selected.name}
              </p>
              <Link
                href={`/spots/${selected.id}`}
                className="text-xs font-medium text-blue-600 underline"
              >
                View details
              </Link>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
