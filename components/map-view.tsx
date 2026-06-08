"use client";

import { useEffect, useRef, useState } from "react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  APIProvider,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { MapSpotCard } from "@/components/map-spot-card";
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

/**
 * When `triggerKey` changes, re-frames the map's *current* visible bounds into
 * the area not covered by the chrome/sheet — so what you saw stays in view as
 * the bottom sheet expands. (Mobile: the sheet covers ~half the screen.)
 */
function ReframeCurrent({ triggerKey }: { triggerKey: number }) {
  const map = useMap();
  const firstRun = useRef(true);
  useEffect(() => {
    if (!map) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const bounds = map.getBounds();
    if (!bounds) return;
    const vh = typeof window === "undefined" ? 800 : window.innerHeight;
    map.fitBounds(bounds, {
      top: 156, // header + filters
      bottom: Math.round(vh * 0.5), // half sheet
      left: 24,
      right: 24,
    });
  }, [map, triggerKey]);
  return null;
}

// Public Map ID (enables Advanced Markers). Falls back to Google's demo ID in dev.
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

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
  /** Map re-fits to the current spots whenever this value changes (area change). */
  fitKey: string;
  /** Re-frames the current visible bounds whenever this changes (sheet → half). */
  reframeKey: number;
}

export function MapView({
  apiKey,
  spots,
  center,
  activeId,
  onActiveChange,
  onBoundsChange,
  fitKey,
  reframeKey,
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
        mapId={MAP_ID}
        disableDefaultUI
        gestureHandling="greedy"
        className="h-full w-full"
        onCameraChanged={(ev) => onBoundsChange(ev.detail.bounds)}
        onClick={() => setSelectedId(null)}
      >
        <FitBounds spots={spots} triggerKey={fitKey} />
        <ReframeCurrent triggerKey={reframeKey} />
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
          <AdvancedMarker
            position={{ lat: selected.lat, lng: selected.lng }}
            zIndex={30}
            anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
          >
            {/* lifts the card clear of the pin */}
            <div className="pb-3">
              <MapSpotCard
                spot={selected}
                origin={center}
                onClose={() => setSelectedId(null)}
              />
            </div>
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  );
}
