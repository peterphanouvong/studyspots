import type { DayHours, Hours, Spot } from "@/lib/types";

/**
 * Default map/list center for the hyperlocal launch cluster
 * (between Cabramatta and Canley Heights, SW Sydney).
 */
export const DEFAULT_CENTER = { lat: -33.89, lng: 150.926 };

const h = (open: string, close: string): DayHours => ({ open, close });

/** [Sun, Mon, Tue, Wed, Thu, Fri, Sat] */
function days(opts: {
  weekday: DayHours;
  sat?: DayHours;
  sun?: DayHours;
}): Hours {
  const { weekday, sat = weekday, sun = weekday } = opts;
  return [sun, weekday, weekday, weekday, weekday, weekday, sat];
}

const gmaps = (name: string, address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name}, ${address}`,
  )}`;

// ⚠️ PLACEHOLDER PHOTOS — generic stock cafe shots, NOT the real venues.
// Replace with real per-cafe photos during photo verification before promoting.
// Bare URLs (no ?w/&q) so next/image controls sizing and quality per slot.
const STOCK = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
  "https://images.unsplash.com/photo-1453614512568-c4024d13c247",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
  "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
];

/** 5 placeholder photos, rotated by index so each spot looks distinct. */
const pics = (start: number): string[] =>
  Array.from({ length: 5 }, (_, k) => STOCK[(start + k) % STOCK.length]);

/** Real per-cafe photos served from `public/spots/<id>/<n>.jpeg`. */
const localPics = (id: string, count: number): string[] =>
  Array.from({ length: count }, (_, k) => `/spots/${id}/${k + 1}.jpeg`);

/**
 * Hyperlocal seed — Cabramatta & Canley Heights, SW Sydney.
 *
 * Study attributes (outlet count, measured noise, vibe, music, rules) come from
 * the founder's hand-collected cafe CSV. Address / coordinates / hours were looked
 * up per cafe; coordinates are approximate (street-level) and hours are
 * best-estimates pending on-the-ground verification.
 */
const ALL_SPOTS: Spot[] = [
  {
    id: "cafe-noi-cabramatta",
    name: "Cafe Noi",
    suburb: "Cabramatta",
    lat: -33.8946,
    lng: 150.9362,
    address: "2A John St, Cabramatta NSW 2166",
    googleMapsUrl: gmaps("Cafe Noi", "2A John St, Cabramatta NSW 2166"),
    hasWifi: false,
    outletCount: 2,
    noiseLevel: "Loud",
    hours: days({
      weekday: h("06:00", "17:00"),
      sat: h("07:00", "17:00"),
      sun: h("07:00", "17:00"),
    }),
    goodToKnow: [
      {
        icon: "wifi",
        title: "Wi-Fi via nearby networks",
        description:
          "No café Wi-Fi, but you can hop on the Telstra Air hotspot nearby or the hotel's Guest Wi-Fi.",
      },
      {
        icon: "parking",
        title: "Limited street parking",
        description:
          "Spots out front fill up fast — allow extra time or come by train.",
      },
    ],
    vibe: ["Colourful", "Earthy", "Homey"],
    music: "Asian Pop",
    images: localPics("cafe-noi-cabramatta", 4),
  },
  {
    id: "cafe-ngon-cabramatta",
    name: "Cafe Ngon",
    suburb: "Cabramatta",
    lat: -33.89505,
    lng: 150.9377,
    address: "48-50 Hill St, Cabramatta NSW 2166",
    googleMapsUrl: gmaps("Cafe Ngon", "48-50 Hill St, Cabramatta NSW 2166"),
    hasWifi: false,
    outletCount: 1,
    noiseLevel: "Moderate",
    hours: days({
      weekday: h("06:30", "19:00"),
      sat: h("06:30", "21:00"),
      sun: h("06:30", "21:00"),
    }),
    goodToKnow: [
      {
        icon: "cash",
        title: "Bring cash — no card",
        description:
          "They don't take card; it's cash or bank transfer, so bring some cash to be safe.",
      },
      {
        icon: "crowd",
        title: "A local uncle hangout",
        description:
          "Lots of Vietnamese uncles catch up here — lively and full of character, not a silent study cave.",
      },
      {
        icon: "parking",
        title: "Limited street parking",
        description:
          "Parking nearby is tight — a short walk from the station is easiest.",
      },
    ],
    vibe: ["Earthy"],
    music: "Viet-Pop",
    images: localPics("cafe-ngon-cabramatta", 3),
  },

  {
    id: "mondays-cabramatta",
    name: "Mondays",
    suburb: "Cabramatta",
    lat: -33.8943,
    lng: 150.9359,
    address: "Unit 6/88 John St, Cabramatta NSW 2166",
    googleMapsUrl: gmaps("Mondays", "88 John St, Cabramatta NSW 2166"),
    hasWifi: false,
    outletCount: 3,
    noiseLevel: "Moderate",
    hours: days({ weekday: h("07:00", "17:00") }),
    goodToKnow: [
      {
        icon: "clock",
        title: "2-hour limit when busy",
        description:
          "At peak times they may ask laptop guests to wrap up after a couple of hours.",
      },
      {
        icon: "seating",
        title: "Plenty of seating",
        description:
          "Usually easy to grab a table with room for a laptop and bags.",
      },
      {
        icon: "parking",
        title: "Limited street parking",
        description: "Street spots fill quickly — give yourself a buffer.",
      },
    ],
    vibe: ["Minimal"],
    music: "None",
    foundersTip:
      "Super comfy and spacious to work — just bring a hotspot or your own data, there's no Wi-Fi here.",
    images: localPics("mondays-cabramatta", 4),
  },
  {
    id: "salty-cafe-canley-heights",
    name: "Salty Cafe",
    suburb: "Canley Heights",
    lat: -33.8877,
    lng: 150.9156,
    address: "Shop 2/213 Canley Vale Rd, Canley Heights NSW 2166",
    googleMapsUrl: gmaps(
      "Salty Cafe",
      "213 Canley Vale Rd, Canley Heights NSW 2166",
    ),
    hasWifi: false,
    outletCount: 5,
    noiseLevel: "Moderate",
    hours: days({ weekday: h("07:00", "22:00") }),
    goodToKnow: [
      {
        icon: "parking",
        title: "Plenty of parking",
        description: "Easy to find a spot nearby, even at busier times.",
      },
      {
        icon: "clock",
        title: "Open late till 10pm",
        description: "One of the few spots around for a late-evening session.",
      },
    ],
    instagram: "saltycafe_2166",
    vibe: ["Minimal"],
    images: pics(4),
  },
  {
    id: "harrys-house-canley-heights",
    name: "Harry's House",
    suburb: "Canley Heights",
    lat: -33.8873,
    lng: 150.9147,
    address: "248 Canley Vale Rd, Canley Heights NSW 2166",
    googleMapsUrl: gmaps(
      "Harry's House",
      "248 Canley Vale Rd, Canley Heights NSW 2166",
    ),
    hasWifi: true,
    outletCount: 2,
    noiseLevel: "Moderate",
    hours: days({
      weekday: h("06:30", "22:30"),
      sat: h("06:30", "23:00"),
      sun: h("06:30", "23:00"),
    }),
    goodToKnow: [
      {
        icon: "dessert",
        title: "Dessert café, open late",
        description:
          "Sweet menu and late hours — a good change of scene for evening study.",
      },
      {
        icon: "parking",
        title: "Plenty of parking",
        description: "Easy to park close by without circling the block.",
      },
    ],
    vibe: [],
    images: localPics("harrys-house-canley-heights", 4),
  },
  {
    id: "celsius-canley-heights",
    name: "Celsius Coffee & Dessert",
    suburb: "Canley Heights",
    lat: -33.8874,
    lng: 150.9149,
    address: "240 Canley Vale Rd, Canley Heights NSW 2166",
    googleMapsUrl: gmaps(
      "Celsius Coffee & Dessert",
      "240 Canley Vale Rd, Canley Heights NSW 2166",
    ),
    hasWifi: true,
    outletCount: 4,
    noiseLevel: "Moderate",
    hours: days({ weekday: h("07:30", "22:00") }),
    goodToKnow: [
      {
        icon: "crowd",
        title: "Busy at peak times",
        description:
          "Fills up on evenings and weekends — go off-peak for a quiet desk.",
      },
      {
        icon: "parking",
        title: "Parking usually easy",
        description: "You can normally park close by without much hunting.",
      },
    ],
    instagram: "celsius.syd",
    music: "Chill",
    founderFavourite: true,
    foundersTip:
      "A favourite of mine for the vibe, drinks and outlets — get the coconut matcha with a shot of espresso. So good.",
    images: localPics("celsius-canley-heights", 3),
  },
  {
    id: "cafe-nho-canley-heights",
    name: "Cafe Nho",
    suburb: "Canley Heights",
    lat: -33.8878,
    lng: 150.9157,
    address: "208 Canley Vale Rd, Canley Heights NSW 2166",
    googleMapsUrl: gmaps(
      "Cafe Nho",
      "208 Canley Vale Rd, Canley Heights NSW 2166",
    ),
    hasWifi: false,
    outletCount: 0,
    noiseLevel: "Moderate",
    hours: days({ weekday: h("07:00", "23:00") }),
    goodToKnow: [
      {
        icon: "crowd",
        title: "Busy at peak times",
        description: "Can get loud when full — quieter mid-afternoon.",
      },
      {
        icon: "seating",
        title: "Indoor and outdoor seating",
        description: "Pick a quiet corner inside or a table out front.",
      },
    ],
    website: "https://canleyheights.cafenho.com.au",
    instagram: "cafenho_australia",
  },
  {
    id: "tina-and-po-canley-vale",
    name: "Tina & Po",
    suburb: "Canley Vale",
    lat: -33.8868,
    lng: 150.9427,
    address: "Shop 4/17 Canley Vale Rd, Canley Vale NSW 2166",
    googleMapsUrl: gmaps(
      "Tina & Po",
      "17 Canley Vale Rd, Canley Vale NSW 2166",
    ),
    hasWifi: false,
    outletCount: 0,
    noiseLevel: "Moderate",
    hours: days({ weekday: h("09:00", "21:00") }),
    instagram: "cafetinapo",
  },
  {
    id: "cafe-thanh-xuan-canley-vale",
    name: "Cafe Thanh Xuan",
    suburb: "Canley Vale",
    lat: -33.8872,
    lng: 150.9427,
    address: "3/12-18 Canley Vale Rd, Canley Vale NSW 2166",
    googleMapsUrl: gmaps(
      "Cafe Thanh Xuan",
      "12-18 Canley Vale Rd, Canley Vale NSW 2166",
    ),
    hasWifi: false,
    outletCount: 0,
    noiseLevel: "Moderate",
    hours: days({
      weekday: h("06:00", "22:00"),
      sat: h("08:00", "22:00"),
      sun: h("08:00", "22:00"),
    }),
    instagram: "cafethanhxuan",
  },
  {
    // STUB — street number & hours unconfirmed (cafe too new to be listed anywhere). Coords are exact from the Google Maps pin.
    id: "saigon-cafe-new-canley-heights",
    name: "Saigon Cafe New",
    suburb: "Canley Heights",
    lat: -33.8838,
    lng: 150.9254,
    address: "Canley Vale Rd, Canley Heights NSW 2166",
    googleMapsUrl: gmaps(
      "Saigon Cafe New",
      "Canley Vale Rd, Canley Heights NSW 2166",
    ),
    hasWifi: false,
    outletCount: 0,
    noiseLevel: "Moderate",
    hours: days({ weekday: h("08:00", "17:00") }), // placeholder — confirm
  },
  {
    id: "katsu-cafe-cabramatta",
    name: "Katsu Cafe",
    suburb: "Cabramatta",
    lat: -33.8938,
    lng: 150.9373,
    address: "2/44 Park Rd, Cabramatta NSW 2166",
    googleMapsUrl: gmaps("Katsu Cafe", "44 Park Rd, Cabramatta NSW 2166"),
    hasWifi: true,
    outletCount: 0, // confirmed present; exact count to verify
    noiseLevel: "Moderate",
    hours: [
      h("08:30", "16:30"), // Sun
      h("08:30", "16:30"), // Mon
      h("08:30", "16:30"), // Tue
      h("08:30", "16:30"), // Wed
      h("08:30", "16:30"), // Thu
      h("08:30", "17:30"), // Fri
      h("08:30", "17:30"), // Sat
    ],
    instagram: "katsucafe.co",
    vibe: ["Cosy"],
    music: "Chill R&B",
    founderFavourite: true,
    foundersTip:
      "One of my favourites — great vibe, reliable internet, and the drinks are spot on.",
    goodToKnow: [
      {
        icon: "laptop",
        title: "Laptop-friendly",
        description:
          "Locals settle in to work here, so you'll fit right in setting up for a session.",
      },
      {
        icon: "coffee",
        title: "Great drinks, friendly staff",
        description:
          "A cosy little spot with lovely drinks and welcoming staff — easy to linger.",
      },
      {
        icon: "crowd",
        title: "Popular with young locals",
        description:
          "A favourite with the younger crowd, so it can fill up — time it if you want a quiet table.",
      },
    ],
    images: localPics("katsu-cafe-cabramatta", 3),
  },
  {
    // STUB — address & hours unconfirmed (only directory listing conflates it with The Usual Cafe). Coords are exact from the Google Maps pin.
    id: "blossom-cafe-cabramatta",
    name: "Blossom Cafe",
    suburb: "Cabramatta",
    lat: -33.8939,
    lng: 150.9344,
    address: "Cabramatta NSW 2166",
    googleMapsUrl: gmaps("68 Blossom Cafe", "Cabramatta NSW 2166"),
    hasWifi: true,
    outletCount: 6,
    noiseLevel: "Quiet",
    hours: days({
      weekday: h("07:00", "15:00"),
      sat: h("07:00", "17:00"),
      sun: h("07:00", "17:00"),
    }), // placeholder — confirm
    instagram: "68blossomcafe",
    goodToKnow: [
      {
        icon: "power",
        title: "Outlets everywhere",
        description:
          "Plenty of power points (6 and counting) — settle in for a long session.",
      },
      {
        icon: "crowd",
        title: "Quiet with a few regulars",
        description:
          "Usually calm with a handful of regulars — an easy place to focus.",
      },
      {
        icon: "coffee",
        title: "Friendly staff",
        description: "Welcoming staff who are happy to let you linger.",
      },
      {
        icon: "parking",
        title: "Paid parking nearby",
        description:
          "Free parking is hard to come by, but there's paid parking close by.",
      },
    ],
    images: localPics("blossom-cafe-cabramatta", 4),
  },
  {
    id: "whitlam-library-cabramatta",
    name: "Whitlam Library",
    suburb: "Cabramatta",
    lat: -33.895,
    lng: 150.937, // approximate — near Cabramatta Station
    address: "165 Railway Pde, Cabramatta NSW 2166",
    googleMapsUrl: gmaps(
      "Whitlam Library Cabramatta",
      "165 Railway Pde, Cabramatta NSW 2166",
    ),
    hasWifi: true,
    outletCount: 15, // "plenty at study desks" — exact count to verify
    noiseLevel: "Quiet",
    hours: [
      h("10:00", "14:00"), // Sun
      h("09:30", "20:00"), // Mon
      h("09:30", "22:00"), // Tue — confirm
      h("09:30", "22:00"), // Wed — confirm
      h("09:30", "23:59"), // Thu — confirm (sources show a late close)
      h("09:30", "20:00"), // Fri
      h("10:00", "16:00"), // Sat
    ],
    hasBathroom: true,
    founderFavourite: true,
    foundersTip:
      "My pick to really lock in: grab a monitor desk in the Workary, bring headphones, and get a coffee from Seeker Cafe nearby — a must.",
    goodToKnow: [
      {
        icon: "power",
        title: "Power at every study desk",
        description:
          "Built-in outlets at the desks — no hunting for a wall socket.",
      },
      {
        icon: "transit",
        title: "Steps from Cabramatta Station",
        description: "A short walk from the station and the main eat street.",
      },
      {
        icon: "clock",
        title: "Quiet study floor",
        description:
          "A proper library hush — the most reliable focus spot on this list.",
      },
    ],
    images: localPics("whitlam-library-cabramatta", 6),
  },
];

/** True once a spot has real local photos (not stock placeholders / empty). */
const hasRealPhotos = (s: Spot): boolean =>
  s.images?.some((src) => src.startsWith("/spots/")) ?? false;

/**
 * Only publish spots with real photos for now — placeholder/stock and
 * photo-less spots are hidden from the list, map, and detail routes.
 * The full set lives in `ALL_SPOTS` so they can be re-enabled once shot.
 */
export const SPOTS: Spot[] = ALL_SPOTS.filter(hasRealPhotos);
