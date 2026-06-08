"use client";

import type { ComponentProps } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * An external anchor that fires a PostHog event on click. Lets us track clicks
 * from inside server-rendered pages (e.g. the spot profile).
 */
export function TrackedLink({
  event,
  eventProps,
  onClick,
  ...props
}: {
  event: AnalyticsEvent;
  eventProps?: Record<string, unknown>;
} & ComponentProps<"a">) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
