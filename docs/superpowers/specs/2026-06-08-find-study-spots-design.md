# Find Study Spots — MVP Design (v2)

**Date:** 2026-06-08
**Status:** In review — supersedes the original brief after product brainstorming.

## The one question the product answers

**"Can I study here?"** — answered conditionally on the user's situation. It is a
fit-check, not a directory. The moat is **trustworthy, insider data** (real outlet
counts, measured noise, house rules) that Google Maps cannot give you — not clever UX
or AI. A boring, fast filter over true data beats a smart-looking app over generic data.

No AI. No auth. Filter-based.

## What changed from the original brief

- **Outlets become a count** (e.g. "4 power points"), not an `Abundant/Sparse/None` enum.
  A number is verifiable; an adjective is not. The UI shows **both** the number and a
  derived word (0 → "None", 1-2 → "A few", 3-5 → "Several", 6+ → "Plenty").
- **House rules are a first-class, *display-only* field** — the key differentiator.
  e.g. "1 hour limit", "must buy a drink", "ask staff for WiFi". Shown on the card and
  profile; **never a filter** (they're qualitative disclosure, not a comparable axis).
- **Study Length is dropped as its own field.** Informal limits live inside house rules.
  A *guaranteed/bookable* study length is the future **B2B product**, not MVP.
- **Open status done properly** — open-now and "open late". (Holiday-awareness dropped
  from MVP scope.)
- **Area/geography is a deliberate filter** (suburb-first), not just "whatever the map
  currently shows".
- **Three traction-probe buttons** added (see below).
- **Hyperlocal launch** — seed real spots in SW Sydney (Fairfield / Cabramatta /
  Canley Vale / Canley Heights and nearby) from the user's curated CSV. Density in one
  area beats thin national coverage for a map product.

## Filters (narrow the list — objective axes only)

- **Area** — suburb selector (default to the launch cluster). Scopes the list + map.
- **Open now** — against device time + spot hours (holiday-aware).
- **Open late** — still open at/after 20:00 today.
- **Has outlets** — `outletCount > 0`.
- **Fast WiFi** — `wifiSpeed === 'Fast'`.
- **Quiet** — `noiseLevel !== 'Loud'`.

House rules are **not** here by design.

## Data model

```ts
type WifiSpeed = 'Fast' | 'Basic' | 'None';
type Noise = 'Quiet' | 'Moderate' | 'Loud';

type DayHours = { open: string; close: string } | null; // 24h "HH:MM"
type Hours = DayHours[]; // length 7, index by Date.getDay()

interface Spot {
  id: string;
  name: string;
  suburb: string;
  lat: number;
  lng: number;
  address: string;
  googleMapsUrl: string;
  wifiSpeed: WifiSpeed;
  outletCount: number;       // CHANGED: real count, not enum
  noiseLevel: Noise;
  hours: Hours;
  houseRules?: string[];     // NEW: the differentiator. Short, human, display-only.
  imageUrl?: string;
  // Low-priority, display-only (may be omitted):
  vibe?: string[];           // e.g. "Cosy", "Minimal" (CSV "Style")
  music?: string;            // e.g. "Lofi", "None"
}
```

## Crowdsourcing strategy

- **Curate the seed** (the founder, by visiting — matches the existing CSV workflow).
  House rules need human judgement; curation keeps the live map trustworthy.
- **Crowdsource = verification only**, never authoring. The existing 👍/👎 module,
  reframed to confirm perishable facts: *"Still a 1hr limit?"*, *"Outlets working
  today?"*, *"Open right now?"*. No login, no free text, no spam surface. Client-state
  for MVP (resets on refresh).

## Traction-probe buttons (external form service)

These are **instruments to measure demand**, not features. At MVP traffic the volume is
tiny, so there's no moderation problem — the *learning* is the point. Each links out to
an external form service (Tally/Formspree-style); a placeholder URL/env var holds the
link until the user wires their form.

- **Submit a spot** (header/footer) — does NOT publish to the live map; lands in the
  founder's queue to vet. Signal: consumer contribution appetite.
- **Send feedback** (footer) — product direction.
- **"Is this your cafe?"** (spot profile) — captures owner contact. **The B2B demand
  probe** — every tap is a warm lead for the future booking business.

## Layout (unchanged shape)

- Desktop >768px: split view — map left (~40%), scrollable card list right (~60%).
- Mobile <768px: single-column list; sticky FAB toggles full-screen Map ↔ List.
- Card: thumbnail, name, suburb + distance, outlet count, WiFi/noise badges, a house-rules
  hint. Profile: full scorecard, house rules prominent, Get Directions, verification, and
  the "Is this your cafe?" probe.

## Out of scope (still)

No auth. No public free-text reviews on spots. No in-app turn-by-turn navigation. No DB
(mock JSON seed + external forms). No bookable study-length (that's the B2B phase).

## Open data task

Seed coordinates: the CSV has suburbs and some `goo.gl` Maps links but no lat/lng. Coords
will be set per spot (approximate-by-address is fine for MVP). Only CSV rows with real
collected data (ports, noise, comments/house-rules) get seeded first.

## Build deltas from current code

1. Schema: `outletsAvailability` enum → `outletCount: number`; add `suburb`, `houseRules`,
   optional `vibe`/`music`. Add an outlet-count → word helper.
2. Reseed `lib/spots.ts` from the CSV, hyperlocal SW Sydney, real data only (Cabramatta,
   Canley Heights, Bonnyrigg to start). Real addresses/coords/hours looked up per cafe.
3. Filters: add Area (suburb) + Open late; outlets filter uses count.
4. House rules: card hint + prominent on profile. Display-only — not filterable.
5. Verification module: reframe prompts to the perishable facts.
6. Add external-form links: Submit a spot, Send feedback, Is this your cafe?
