/**
 * External form-service URLs for the traction-probe buttons (Tally/Formspree/etc).
 *
 * These are demand instruments, not features — each tap is a signal. Set the URLs
 * via environment variables (or edit the fallbacks here). Until set, the buttons
 * point at "#" and do nothing.
 *
 *   NEXT_PUBLIC_SUBMIT_SPOT_URL  — "Submit a spot" form
 *   NEXT_PUBLIC_FEEDBACK_URL     — "Send feedback" form
 *   NEXT_PUBLIC_CLAIM_CAFE_URL   — "Is this your cafe?" (B2B lead) form
 */
export const FORM_LINKS = {
  submitSpot: process.env.NEXT_PUBLIC_SUBMIT_SPOT_URL || "",
  feedback: process.env.NEXT_PUBLIC_FEEDBACK_URL || "",
  claimCafe: process.env.NEXT_PUBLIC_CLAIM_CAFE_URL || "",
} as const;

export type FormLinkKey = keyof typeof FORM_LINKS;
