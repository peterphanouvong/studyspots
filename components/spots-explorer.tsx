"use client";

import { useMemo, useState } from "react";
import { List, Map as MapIcon, Plus } from "lucide-react";
import { ALL_AREAS, AreaSelect } from "@/components/area-select";
import {
  EMPTY_FILTERS,
  FilterPills,
  type FilterKey,
} from "@/components/filter-pills";
import { MapView, type MapBounds } from "@/components/map-view";
import { SpotList } from "@/components/spot-list";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use-geolocation";
import { track } from "@/lib/analytics";
import { distanceKm } from "@/lib/distance";
import { filterSpots } from "@/lib/filter";
import { FORM_LINKS } from "@/lib/links";
import { SPOTS } from "@/lib/spots";
import { cn } from "@/lib/utils";
import type { Spot } from "@/lib/types";
import { Wordmark } from "./wordmark";

function inBounds(spot: Spot, b: MapBounds): boolean {
  return (
    spot.lat <= b.north &&
    spot.lat >= b.south &&
    spot.lng <= b.east &&
    spot.lng >= b.west
  );
}

const SUBURBS = [...new Set(SPOTS.map((s) => s.suburb))].sort();

export function SpotsExplorer({ apiKey }: { apiKey: string }) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [area, setArea] = useState<string>(ALL_AREAS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [showMapOnMobile, setShowMapOnMobile] = useState(false);
  const { coords, isPrecise } = useGeolocation();

  const toggle = (key: FilterKey) => {
    track("filter_toggled", { filter: key, active: !filters[key] });
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  const changeArea = (next: string) => {
    setArea(next);
    track("area_changed", { area: next });
  };

  // Pins reflect the selected area + active filter pills.
  const filtered = useMemo(() => {
    const inArea =
      area === ALL_AREAS ? SPOTS : SPOTS.filter((s) => s.suburb === area);
    return [...filterSpots(inArea, filters)].sort(
      (a, b) => distanceKm(coords, a) - distanceKm(coords, b),
    );
  }, [filters, area, coords]);

  // The list additionally narrows to what's inside the current map viewport.
  const listed = useMemo(
    () => (bounds ? filtered.filter((s) => inBounds(s, bounds)) : filtered),
    [filtered, bounds],
  );

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b bg-background px-4 py-3">
        <Wordmark className="text-lg" />
        <Button asChild variant="outline" size="sm">
          <a
            href={FORM_LINKS.submitSpot || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("submit_spot_clicked", { from: "header" })}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Submit a spot</span>
          </a>
        </Button>
      </header>

      <div className="flex shrink-0 flex-col gap-2 border-b bg-background px-4 py-3 sm:flex-row sm:items-center">
        <AreaSelect suburbs={SUBURBS} value={area} onChange={changeArea} />
        <div className="min-w-0 flex-1">
          <FilterPills filters={filters} onToggle={toggle} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Map: 40% on desktop; full-screen toggle on mobile */}
        <div
          className={cn(
            "h-full md:block md:w-2/5",
            showMapOnMobile ? "block w-full" : "hidden",
          )}
        >
          <MapView
            apiKey={apiKey}
            spots={filtered}
            center={coords}
            activeId={activeId}
            onActiveChange={setActiveId}
            onBoundsChange={setBounds}
            fitKey={area}
          />
        </div>

        {/* List: 60% on desktop; hidden on mobile when map is shown */}
        <div
          className={cn(
            "w-full overflow-y-auto md:block md:w-3/5",
            showMapOnMobile && "hidden",
          )}
        >
          <div className="flex min-h-full flex-col px-4 py-5">
            <p className="mb-4 text-sm text-muted-foreground">
              {listed.length} {listed.length === 1 ? "spot" : "spots"}
              {area === ALL_AREAS
                ? isPrecise
                  ? " near you"
                  : ""
                : ` in ${area}`}
            </p>
            <SpotList
              spots={listed}
              origin={coords}
              activeId={activeId}
              onActiveChange={setActiveId}
            />
            <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-8 text-xs text-muted-foreground">
              <a
                href={FORM_LINKS.submitSpot || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("submit_spot_clicked", { from: "footer" })}
                className="hover:text-foreground hover:underline"
              >
                Know a spot we're missing?
              </a>
              <a
                href={FORM_LINKS.feedback || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("feedback_clicked")}
                className="hover:text-foreground hover:underline"
              >
                Send feedback
              </a>
            </footer>
          </div>
        </div>
      </div>

      {/* Mobile-only view toggle */}
      <button
        type="button"
        onClick={() => {
          track("map_list_toggled", {
            view: showMapOnMobile ? "list" : "map",
          });
          setShowMapOnMobile((v) => !v);
        }}
        className="fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg md:hidden"
      >
        {showMapOnMobile ? (
          <>
            <List className="size-4" /> List View
          </>
        ) : (
          <>
            <MapIcon className="size-4" /> Map View
          </>
        )}
      </button>
    </div>
  );
}
