# External Forms — Build Spec

Three external forms (Tally / Formspree / Google Forms — your choice) power the
traction-probe buttons in the app. They are **demand instruments**: at MVP traffic the
volume is tiny, so there's no moderation overhead — the *signal* is the point. Keep each
short; every extra field costs completions.

Once built, drop the URLs into `.env`:

```
NEXT_PUBLIC_SUBMIT_SPOT_URL=
NEXT_PUBLIC_FEEDBACK_URL=
NEXT_PUBLIC_CLAIM_CAFE_URL=
```

General notes for all three:
- Anonymous-friendly — no login. Email is optional except on the cafe form.
- Submissions go to your inbox / a sheet you watch. Nothing auto-publishes.
- Friendly confirmation screen after submit (copy suggested per form).

---

## 1. Submit a spot

**Purpose:** Let users suggest a study spot we're missing. Feeds your curation queue
(you vet before adding). Signal = how much people want to contribute.

**Who fills it:** A student / remote worker who knows a good cafe or library.

**Fields:**
| Field | Type | Required |
|---|---|---|
| Spot name | Short text | ✅ |
| Suburb / area | Short text | ✅ |
| Address or Google Maps link | Short text | optional |
| What makes it good for studying? (outlets, WiFi, quiet, time limits, vibe…) | Long text | optional |
| Your email (so we can let you know when it's added) | Email | optional |

**Confirmation copy:** "Thanks! We'll check it out and add it if it's a good study spot."

---

## 2. Send feedback

**Purpose:** General product feedback — what people want, what's broken. Signal =
engagement + direction.

**Who fills it:** Any visitor.

**Fields:**
| Field | Type | Required |
|---|---|---|
| Type of feedback (Idea / Bug / General) | Single-select | optional |
| Your feedback | Long text | ✅ |
| Your email (if you'd like a reply) | Email | optional |

**Confirmation copy:** "Thanks — every bit of feedback helps shape this."

---

## 3. Is this your cafe?

**Purpose:** Capture cafe owners/managers — the **B2B lead probe**. Every submission is a
warm lead for the future "secure-a-table / booking" business. This is the highest-value
form; bias toward capturing contact details.

**Who fills it:** A cafe owner, manager, or staff member who found their venue listed.

**Fields:**
| Field | Type | Required |
|---|---|---|
| Which cafe? | Short text | ✅ (see note) |
| Your name | Short text | ✅ |
| Your role (Owner / Manager / Staff / Other) | Single-select | optional |
| Email | Email | ✅ |
| Phone | Phone | optional |
| What are you interested in? (Update our info / Claim the listing / Hear about table bookings) | Multi-select | optional |
| Anything else? | Long text | optional |

**Confirmation copy:** "Thanks — we'll be in touch soon."

**Note — prefill which cafe:** This button lives on a specific spot's page, so we can
pass the cafe name to the form via a URL parameter (e.g. `?cafe=Cafe%20Noi`) and have the
form pre-fill / hidden-store it. Use a **hidden field** mapped to that param so each lead
is tagged with the cafe automatically. If your form builder supports URL prefill (Tally
and Google Forms do), tell me the param name and I'll wire the button to append it.
