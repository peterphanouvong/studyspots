"use client";

import { useEffect, useState } from "react";
import { DEFAULT_CENTER } from "@/lib/spots";
import type { Coords } from "@/lib/distance";

interface GeolocationState {
  /** User's location, or the default center while loading / if denied. */
  coords: Coords;
  /** True once we have the user's real position (not the fallback). */
  isPrecise: boolean;
  loading: boolean;
}

/**
 * Requests the browser's location once on mount. Falls back to DEFAULT_CENTER
 * if the user denies permission or geolocation is unavailable.
 */
export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    coords: DEFAULT_CENTER,
    isPrecise: false,
    loading: true,
  });

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          isPrecise: true,
          loading: false,
        });
      },
      () => {
        setState({ coords: DEFAULT_CENTER, isPrecise: false, loading: false });
      },
      { timeout: 8000 },
    );
  }, []);

  return state;
}
