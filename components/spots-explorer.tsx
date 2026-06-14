"use client";

import { useMemo, useState } from "react";
import { ALL_AREAS, AreaSearch } from "@/components/area-select";
import { MobileSpotsSheet } from "@/components/mobile-spots-sheet";
import {
  EMPTY_FILTERS,
  FilterPills,
  type FilterKey,
} from "@/components/filter-pills";
import { GachaButton } from "@/components/gacha-button";
import { GachaMatchSheet } from "@/components/gacha-match-sheet";
import { GachaOverlay } from "@/components/gacha-overlay";
import { MapView, type MapBounds } from "@/components/map-view";
import { SiteHeader } from "@/components/site-header";
import { Separator } from "@/components/ui/separator";
import { SpotList } from "@/components/spot-list";
import { useGacha } from "@/hooks/use-gacha";
import { useGeolocation } from "@/hooks/use-geolocation";
import { track } from "@/lib/analytics";
import { distanceKm } from "@/lib/distance";
import { filterSpots } from "@/lib/filter";
import { FORM_LINKS } from "@/lib/links";
import { SPOTS } from "@/lib/spots";
import type { Spot } from "@/lib/types";

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
  const [reframeNonce, setReframeNonce] = useState(0);
  const { coords, isPrecise } = useGeolocation();
  // When the spin lands, highlight the winner on the live map + log the reveal.
  const gacha = useGacha({
    onReveal: (winner) => {
      setActiveId(winner.id);
      track("gacha_revealed", {
        id: winner.id,
        name: winner.name,
        suburb: winner.suburb,
      });
    },
  });

  const toggle = (key: FilterKey) => {
    if (gacha.isLocked) return; // state lock — no filtering mid-spin
    track("filter_toggled", { filter: key, active: !filters[key] });
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  const changeArea = (next: string) => {
    if (gacha.isLocked) return;
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

  const countLabel = `${listed.length} ${listed.length === 1 ? "spot" : "spots"}${
    area === ALL_AREAS ? (isPrecise ? " near you" : "") : ` in ${area}`
  }`;

  const startGacha = () => {
    if (gacha.isLocked || filtered.length === 0) return;
    track("gacha_started", { count: filtered.length });
    gacha.start(filtered);
  };

  const dismissGacha = () => {
    if (gacha.winner) track("gacha_dismissed", { id: gacha.winner.id });
    gacha.dismiss();
  };

  return (
    <div className="flex h-[100dvh] flex-col">
      <SiteHeader
        center={
          <AreaSearch suburbs={SUBURBS} value={area} onChange={changeArea} />
        }
      />

      <div className="relative z-50 flex shrink-0 flex-col gap-3 border-b bg-gray-50 px-4 pb-3 sm:flex-row sm:items-center sm:px-5 sm:pb-4">
        <div className="flex min-w-0 flex-1 items-center gap-2.5 py-1 sm:justify-center">
          <GachaButton
            onStart={startGacha}
            disabled={gacha.isLocked || filtered.length === 0}
          />
          <Separator orientation="vertical" className="h-8" />
          <div className="min-w-0">
            <FilterPills filters={filters} onToggle={toggle} />
          </div>
        </div>
      </div>

      {/* Airbnb-style: list on the left, fixed map on the right (desktop);
          full-screen map + bottom sheet (mobile). */}
      <div className="flex min-h-0 flex-1 md:flex-row-reverse">
        <div className="block h-full w-full md:w-1/2 md:py-4 md:pr-4">
          <div className="h-full w-full overflow-hidden md:rounded-2xl md:border">
            <MapView
              apiKey={apiKey}
              spots={filtered}
              center={coords}
              activeId={activeId}
              onActiveChange={setActiveId}
              onBoundsChange={setBounds}
              fitKey={area}
              reframeKey={reframeNonce}
            />
          </div>
        </div>

        {/* List: left 50% on desktop only */}
        <div className="hidden overflow-y-auto md:block md:w-1/2">
          <div className="flex min-h-full flex-col px-6 py-7 lg:px-10 xl:px-14">
            <h1 className="mb-6 font-heading text-2xl font-bold tracking-tight">
              {countLabel}
            </h1>
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
                Know a spot we&apos;re missing?
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

      {/* Mobile bottom sheet (peek → half → full) */}
      <MobileSpotsSheet
        spots={listed}
        origin={coords}
        activeId={activeId}
        onActiveChange={setActiveId}
        countLabel={countLabel}
        onRecenter={() => setReframeNonce((n) => n + 1)}
      />

      {/* Spot Gacha — spin overlay + reveal sheet */}
      <GachaOverlay
        phase={gacha.phase}
        spots={gacha.spots}
        highlightIndex={gacha.highlightIndex}
        winner={gacha.winner}
        muted={gacha.muted}
        onToggleMute={gacha.toggleMute}
        onCancel={dismissGacha}
      />
      <GachaMatchSheet
        spot={gacha.winner}
        origin={coords}
        open={gacha.phase === "revealed"}
        onClose={dismissGacha}
      />
    </div>
  );
}
