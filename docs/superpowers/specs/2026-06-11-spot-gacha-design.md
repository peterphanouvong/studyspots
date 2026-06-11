# Spot Gacha — Design Spec

**Date:** 2026-06-11
**Status:** Approved, building (implementation plan intentionally skipped per user request)

## Summary

A randomized discovery feature ("Spot Gacha" / "Study Teleport"). The user taps a
stylized button; a 1.5s full-screen animated spin sequence cycles through the
local study spots with accelerating ticking audio, decelerates onto a randomly
chosen winner with a neon glow + success chime, then presents a match sheet with
the cafe's key data and the founder's tip. A "Send to Study Buddy" share CTA and a
dismiss path close the experience.

## Goals

- Immersive, gamified, mobile-responsive reveal.
- No map-canvas jank (the known risk with rapid camera pans).
- Audio that respects browser autoplay restrictions (unlocked on the click).
- Hard state-lock during the spin so nothing else can be triggered.

## Non-goals

- Persisting gacha history / streaks / "already seen" tracking.
- Server-side randomness or any backend.
- Animating the live Google Map camera (explicitly rejected for perf).

## Decisions (locked with user)

1. **Data:** add optional `foundersTip?: string` and `verified?: boolean` to the
   `Spot` type. Content filled by the founder later; card hides tip/badge until
   populated.
2. **Animation:** full-screen `position: fixed` overlay, not a route. No live map
   camera movement during the spin.
3. **Audio:** synthesized via Web Audio API (no asset files), unlocked on click.
4. **Selection scope:** uniform random over the **currently-filtered** spots
   (respects area + active filter pills).

## Data model — `lib/types.ts`

```ts
/** Founder's personal one-liner about the spot. Hero of the gacha match card. */
foundersTip?: string;
/** Founder has physically verified this spot. Drives the green "Verified" badge. */
verified?: boolean;
```

Both optional → no migration needed. The two STUB spots (Saigon Cafe New, Blossom
Cafe) stay `verified: false` naturally. The match card conditionally renders the
tip and badge only when present.

## Selection logic

- Source set = `filtered` spots in `SpotsExplorer` (area + pills applied), the same
  list already fed to the map.
- **0 spots:** the gacha button is disabled (dimmed) with an explanatory title.
- **1 spot:** short-circuit — skip the spin theater, reveal it directly.
- **2+ spots:** pick `winnerIndex` uniformly at random up front; the animation is
  pure theater that lands on the pre-chosen index.

## State machine — `hooks/use-gacha.ts`

Phases: `idle → spinning → decelerating → revealed → idle (on dismiss)`.

- `start(spots)` — chosen on the click event. Unlocks audio, picks the winner,
  begins the rAF loop. No-op if not `idle` or `spots.length === 0`.
- `spinning` (~1.0s): highlight index hops at a constant fast rate (~70ms),
  ticks accelerate.
- `decelerating` (~0.5s): hop interval grows on an ease-out curve, ticks spread,
  landing exactly on `winnerIndex`.
- `revealed`: success chime + the match sheet opens; overlay fades.
- `dismiss()` — back to `idle`.

A **single `requestAnimationFrame` loop** drives the whole sequence (not N
intervals). The loop computes the current highlight index from elapsed time, so
it is frame-rate independent and cheap. Cleans up the rAF + AudioContext on unmount.

Returns `{ phase, highlightIndex, winner, isLocked, start, dismiss }` where
`isLocked = phase !== "idle"`.

## Audio engine — `lib/gacha-audio.ts`

`createGachaAudio()` returns an object that lazily constructs one `AudioContext`
on first use (the click), so it is created inside a user gesture and not blocked.

- `tick()` — a short percussive click (oscillator/noise burst, fast gain decay).
  Called by the rAF loop on each highlight hop, so cadence naturally accelerates
  then decelerates with the animation.
- `chime()` — a pleasant 2–3 note success arpeggio on reveal.
- Respects a `muted` flag (persisted in `localStorage`) and
  `prefers-reduced-motion` (no audio when reduced).
- `resume()` on the gesture in case the context starts suspended.

## Components (all client components)

### `components/gacha-button.tsx`
Stylized entry point: "Spot Gacha" label + `Dices` (lucide) icon. Desktop: sits in
the filter row. Mobile: floating action button bottom-right, above the sheet peek
(`z-50`, clear of the existing "Map" button). Disabled + dimmed while `isLocked`
or when 0 spots match.

### `components/gacha-overlay.tsx`
`position: fixed inset-0 z-[100]`, rendered only while `phase !== "idle"` (and not
yet `revealed`). Renders the filtered spots as a grid of mini pin-chips; the
`highlightIndex` chip lights up (neon glow + `scale`). Animation uses transform /
opacity only (GPU-composited, no layout thrash). Winner land: chip scales up with a
pulsing neon glow + a CSS particle pop. `role="dialog"`, focus-trapped, Escape
cancels. Includes a mute toggle.

### `components/gacha-match-sheet.tsx`
Built on the existing `vaul` `Drawer` (bottom). Shows:
- Cafe name + green **Verified** badge (only if `verified`).
- Key data points via existing `coreAmenities(spot)` (WiFi / outlets / noise).
- **`foundersTip`** as the prominent hero block (only if present).
- Primary CTA **"Send to Study Buddy"** → `navigator.share()`; clipboard-copy
  fallback + `sonner` toast when Web Share unavailable.
- Secondary: "View details" → `/spots/[id]`; dismiss returns to map.

On reveal, `SpotsExplorer` also sets `activeId` to the winner so the live map pin
pulses underneath.

## Integration — `components/spots-explorer.tsx`

- Instantiate `useGacha`.
- Render `<GachaButton>`, `<GachaOverlay>`, `<GachaMatchSheet>`.
- Pass `isLocked` to `FilterPills`, `AreaSearch`, and the map so pin clicks /
  toggles are disabled mid-spin.
- On reveal, set `activeId = winner.id`.

## State lock

While `isLocked`:
- Overlay covers the screen (blocks map interaction physically).
- `FilterPills` buttons + area select disabled.
- Gacha button disabled.
Prevents concurrent spins and state corruption.

## Accessibility & polish

- `prefers-reduced-motion`: skip the spin and audio entirely, go straight to reveal.
- Overlay: `role="dialog"`, focus trap, Escape to cancel.
- Mute toggle persisted in `localStorage`.
- Optional `navigator.vibrate` haptic pop on reveal (mobile, best-effort).

## Analytics — `lib/analytics.ts`

Extend the `AnalyticsEvent` union:
- `gacha_started`
- `gacha_revealed` (`{ id, name, suburb }`)
- `gacha_shared` (`{ id, method: "share" | "clipboard" }`)
- `gacha_dismissed`

## Testing (Playwright)

1. Button disabled when 0 spots match the filters.
2. Full spin lands on a winner and opens the match sheet (winner is one of the
   filtered spots).
3. Lock prevents a second spin while one is in progress.
4. `prefers-reduced-motion` path skips straight to reveal with no audio.

## File inventory

| File | Change |
| --- | --- |
| `lib/types.ts` | add `foundersTip?`, `verified?` |
| `lib/analytics.ts` | add 4 gacha events |
| `lib/gacha-audio.ts` | new — Web Audio engine |
| `hooks/use-gacha.ts` | new — state machine + rAF loop |
| `components/gacha-button.tsx` | new — entry point |
| `components/gacha-overlay.tsx` | new — spin animation |
| `components/gacha-match-sheet.tsx` | new — result drawer |
| `components/spots-explorer.tsx` | wire everything + state lock |
