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

/**
 * Hyperlocal seed — Cabramatta & Canley Heights, SW Sydney.
 *
 * Study attributes (outlet count, measured noise, vibe, music, rules) come from
 * the founder's hand-collected cafe CSV. Address / coordinates / hours were looked
 * up per cafe; coordinates are approximate (street-level) and hours are
 * best-estimates pending on-the-ground verification.
 */
export const SPOTS: Spot[] = [
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
    hours: days({ weekday: h("06:00", "17:00"), sat: h("07:00", "17:00"), sun: h("07:00", "17:00") }),
    houseRules: ["Limited street parking"],
    vibe: ["Colourful", "Earthy", "Homey"],
    music: "Asian Pop",
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=70",
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
    hours: days({ weekday: h("06:30", "19:00"), sat: h("06:30", "21:00"), sun: h("06:30", "21:00") }),
    houseRules: ["Limited street parking"],
    vibe: ["Earthy"],
    music: "Viet-Pop",
    imageUrl:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=70",
  },
  {
    id: "the-usual-cabramatta",
    name: "The Usual Cafe",
    suburb: "Cabramatta",
    lat: -33.89515,
    lng: 150.9375,
    address: "Shop 8, 46 Hill St, Cabramatta NSW 2166",
    googleMapsUrl: gmaps("The Usual Cafe", "46 Hill St, Cabramatta NSW 2166"),
    hasWifi: true,
    outletCount: 2,
    noiseLevel: "Moderate",
    hours: days({ weekday: h("07:00", "16:00"), sat: h("08:00", "15:00"), sun: h("08:00", "15:00") }),
    houseRules: ["Limited street parking"],
    website: "https://theusualcafe.com.au",
    vibe: ["Minimal"],
    music: "R&B",
    imageUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=70",
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
    houseRules: [
      "Max 2 hour limit when busy",
      "Plenty of seating",
      "Limited street parking",
    ],
    vibe: ["Minimal"],
    music: "None",
    imageUrl:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=70",
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
    houseRules: ["Plenty of parking", "Open late — till 10pm"],
    instagram: "saltycafe_2166",
    vibe: ["Minimal"],
    imageUrl:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=70",
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
    hours: days({ weekday: h("06:30", "22:30"), sat: h("06:30", "23:00"), sun: h("06:30", "23:00") }),
    houseRules: ["Dessert café, open late", "Plenty of parking"],
    vibe: [],
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=70",
  },
];
