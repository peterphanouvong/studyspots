import posthog from "posthog-js";

/** The real product/traction events we care about. */
export type AnalyticsEvent =
  | "filter_toggled"
  | "area_changed"
  | "spot_card_clicked"
  | "directions_clicked"
  | "outlet_vote"
  | "submit_spot_clicked"
  | "feedback_clicked"
  | "claim_cafe_clicked"
  | "external_link_clicked"
  | "map_list_toggled";

function isReady(): boolean {
  return (
    typeof window !== "undefined" &&
    (posthog as unknown as { __loaded?: boolean }).__loaded === true
  );
}

/** Capture a typed event. No-ops if PostHog isn't configured (e.g. local dev). */
export function track(
  event: AnalyticsEvent,
  props?: Record<string, unknown>,
): void {
  if (!isReady()) return;
  posthog.capture(event, props);
}
