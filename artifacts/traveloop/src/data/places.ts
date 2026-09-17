/**
 * Shared catalogue of lesser-known Indian destinations.
 *
 * Every feature reads from this one list so a place only has to be described
 * once: the map plots `lat`/`lng`, the destinations grid renders the card, and
 * the live-status simulator derives conditions from the same record.
 */

export interface PlaceStatus {
  weather: {
    condition: "sunny" | "cloudy" | "rainy" | "snowy";
    temp: string;
    humidity: string;
    wind: string;
    visibility: string;
  };
  safety: { level: "safe" | "moderate" | "caution"; score: number; note: string };
  crowd: { level: "low" | "moderate" | "high"; estimate: string };
  connectivity: { level: "good" | "moderate" | "poor"; note: string };
  alerts: { type: "weather" | "safety" | "event"; text: string }[];
}

export interface Place {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  tags: TagId[];
  rating: number;
  reviews: number;
  description: string;
  bestTime: string;
  entryFee: string;
  image: string;
  /** Live-status inputs. Anything omitted is derived deterministically. */
  status?: Partial<PlaceStatus>;
}

export type TagId =
  | "adventure"
  | "spiritual"
  | "heritage"
  | "nature"
  | "beach"
  | "food"
  | "offbeat"
  | "trekking";

export const TAGS: { id: TagId; label: string; color: string; pin: string }[] = [
  { id: "adventure", label: "Adventure", color: "bg-green-100 text-green-700 border-green-200", pin: "#22c55e" },
  { id: "spiritual", label: "Spiritual", color: "bg-purple-100 text-purple-700 border-purple-200", pin: "#a855f7" },
  { id: "heritage", label: "Heritage", color: "bg-amber-100 text-amber-700 border-amber-200", pin: "#f59e0b" },
  { id: "nature", label: "Nature", color: "bg-emerald-100 text-emerald-700 border-emerald-200", pin: "#10b981" },
  { id: "beach", label: "Beach", color: "bg-blue-100 text-blue-700 border-blue-200", pin: "#3b82f6" },
  { id: "food", label: "Food & Culture", color: "bg-orange-100 text-orange-700 border-orange-200", pin: "#f97316" },
  { id: "offbeat", label: "Offbeat", color: "bg-teal-100 text-teal-700 border-teal-200", pin: "#14b8a6" },
  { id: "trekking", label: "Trekking", color: "bg-rose-100 text-rose-700 border-rose-200", pin: "#f43f5e" },
];

export function tagById(id: TagId) {
  return TAGS.find((t) => t.id === id);
}

/** Primary pin colour for a place = colour of its first tag. */
export function pinColor(place: Place): string {
  return tagById(place.tags[0])?.pin ?? "#10b981";
}

const IMG = {
  mountain: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=75",
  valley: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=75",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=75",
  heritage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=75",
  temple: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=75",
  desert: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=600&q=75",
  forest: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=75",
  river: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=75",
  lake: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=75",
} as const;

export const PLACES: Place[] = [
  // ── North-East ────────────────────────────────────────────────────────────
  {
    id: "mawlynnong",
    name: "Mawlynnong",
    region: "Meghalaya",
    lat: 25.1969,
    lng: 91.9194,
    tags: ["nature", "offbeat"],
    rating: 4.8,
    reviews: 124,
    description:
      "Billed as Asia's cleanest village, with bamboo sky-walks, living root bridges nearby, and Khasi hospitality.",
    bestTime: "Oct – Apr",
    entryFee: "Free",
    image: IMG.forest,
    status: {
      weather: { condition: "rainy", temp: "22°C", humidity: "85%", wind: "10 km/h", visibility: "5 km" },
      connectivity: { level: "moderate", note: "4G in the village centre only" },
      alerts: [{ type: "weather", text: "Heavy rainfall expected tomorrow" }],
    },
  },
  {
    id: "ziro",
    name: "Ziro Valley",
    region: "Arunachal Pradesh",
    lat: 27.5878,
    lng: 93.8306,
    tags: ["heritage", "offbeat", "nature"],
    rating: 4.5,
    reviews: 67,
    description:
      "Apatani tribal heartland of wet rice fields ringed by pine hills, and home to the Ziro music festival.",
    bestTime: "Mar – Oct",
    entryFee: "Free",
    image: IMG.valley,
    status: {
      safety: { level: "safe", score: 8, note: "Inner Line Permit required for non-locals." },
      connectivity: { level: "poor", note: "Basic 2G/3G only" },
      alerts: [{ type: "safety", text: "Leopard sighting reported near trails" }],
    },
  },
  {
    id: "majuli",
    name: "Majuli Island",
    region: "Assam",
    lat: 26.95,
    lng: 94.17,
    tags: ["heritage", "nature", "offbeat"],
    rating: 4.4,
    reviews: 45,
    description:
      "The world's largest river island, dotted with Vaishnavite satras and mask-making workshops on the Brahmaputra.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.river,
  },
  {
    id: "unakoti",
    name: "Unakoti",
    region: "Tripura",
    lat: 24.32,
    lng: 92.08,
    tags: ["heritage", "spiritual", "offbeat"],
    rating: 4.4,
    reviews: 38,
    description:
      "A hillside of colossal rock-cut Shaivite carvings, said to number one less than a crore.",
    bestTime: "Oct – Mar",
    entryFee: "₹20",
    image: IMG.heritage,
  },
  {
    id: "dzukou",
    name: "Dzükou Valley",
    region: "Nagaland",
    lat: 25.55,
    lng: 94.1,
    tags: ["trekking", "nature", "adventure"],
    rating: 4.7,
    reviews: 52,
    description:
      "A rolling emerald bowl of dwarf bamboo straddling the Nagaland–Manipur ridge, reached on a full-day trek.",
    bestTime: "Jun – Sep",
    entryFee: "₹50",
    image: IMG.valley,
  },
  {
    id: "tawang",
    name: "Tawang",
    region: "Arunachal Pradesh",
    lat: 27.5859,
    lng: 91.8594,
    tags: ["spiritual", "nature"],
    rating: 4.8,
    reviews: 143,
    description:
      "Home to India's largest monastery, perched at 3,000 m with lakes, high passes and Monpa culture.",
    bestTime: "Mar – Oct",
    entryFee: "Free",
    image: IMG.temple,
  },

  // ── Himalaya / Ladakh ────────────────────────────────────────────────────
  {
    id: "spiti",
    name: "Spiti Valley",
    region: "Himachal Pradesh",
    lat: 32.2266,
    lng: 78.0718,
    tags: ["adventure", "trekking", "offbeat"],
    rating: 4.9,
    reviews: 203,
    description:
      "A cold desert of mud villages and thousand-year-old monasteries suspended between Tibet and the Kullu hills.",
    bestTime: "Jun – Sep",
    entryFee: "Free",
    image: IMG.mountain,
    status: {
      connectivity: { level: "poor", note: "4G patchy in remote areas" },
      alerts: [{ type: "safety", text: "Manali–Kaza highway partly closed by landslides" }],
    },
  },
  {
    id: "chitkul",
    name: "Chitkul",
    region: "Himachal Pradesh",
    lat: 31.3487,
    lng: 78.436,
    tags: ["nature", "offbeat"],
    rating: 4.6,
    reviews: 88,
    description:
      "The last village on the Baspa before the Tibet frontier, with wooden houses and potato fields.",
    bestTime: "Apr – Oct",
    entryFee: "Free",
    image: IMG.mountain,
  },
  {
    id: "tirthan",
    name: "Tirthan Valley",
    region: "Himachal Pradesh",
    lat: 31.63,
    lng: 77.35,
    tags: ["nature", "trekking"],
    rating: 4.7,
    reviews: 96,
    description:
      "A trout-fishing valley at the gate of Great Himalayan National Park, all riverside cottages and pine.",
    bestTime: "Mar – Jun",
    entryFee: "Free",
    image: IMG.river,
  },
  {
    id: "barot",
    name: "Barot Valley",
    region: "Himachal Pradesh",
    lat: 32.04,
    lng: 76.83,
    tags: ["nature", "offbeat", "trekking"],
    rating: 4.5,
    reviews: 41,
    description:
      "A remote Uhl river valley with a colonial trout hatchery and the road onward to Bada Bhangal.",
    bestTime: "Apr – Oct",
    entryFee: "Free",
    image: IMG.valley,
  },
  {
    id: "turtuk",
    name: "Turtuk",
    region: "Ladakh",
    lat: 34.848,
    lng: 76.83,
    tags: ["heritage", "offbeat"],
    rating: 4.8,
    reviews: 74,
    description:
      "A Balti village of apricot orchards and stone homes, opened to visitors only in 2010.",
    bestTime: "May – Sep",
    entryFee: "₹20",
    image: IMG.mountain,
  },
  {
    id: "zanskar",
    name: "Zanskar",
    region: "Ladakh",
    lat: 33.467,
    lng: 76.883,
    tags: ["adventure", "trekking", "spiritual"],
    rating: 4.8,
    reviews: 61,
    description:
      "A frozen-river valley cut off for eight months a year, with cliff-hung monasteries above Padum.",
    bestTime: "Jun – Sep",
    entryFee: "Free",
    image: IMG.mountain,
    status: {
      safety: { level: "moderate", score: 7, note: "Altitude over 3,500 m — acclimatise slowly." },
      connectivity: { level: "poor", note: "No mobile coverage on most of the valley" },
    },
  },
  {
    id: "chopta",
    name: "Chopta",
    region: "Uttarakhand",
    lat: 30.488,
    lng: 79.215,
    tags: ["trekking", "nature"],
    rating: 4.7,
    reviews: 156,
    description:
      "Meadows below Tungnath, the world's highest Shiva temple, and the trailhead to Chandrashila summit.",
    bestTime: "Mar – Jun",
    entryFee: "Free",
    image: IMG.valley,
    status: {
      weather: { condition: "cloudy", temp: "15°C", humidity: "60%", wind: "20 km/h", visibility: "6 km" },
      safety: { level: "moderate", score: 7, note: "Altitude sickness risk above 3,000 m." },
      connectivity: { level: "poor", note: "No mobile coverage on the trek" },
      alerts: [{ type: "safety", text: "Leopard activity reported near trekking trails" }],
    },
  },
  {
    id: "munsiyari",
    name: "Munsiyari",
    region: "Uttarakhand",
    lat: 30.0687,
    lng: 80.236,
    tags: ["nature", "trekking", "offbeat"],
    rating: 4.6,
    reviews: 63,
    description:
      "A frontier town under the Panchachuli peaks, the base for Johar valley and Milam glacier trails.",
    bestTime: "Apr – Jun",
    entryFee: "Free",
    image: IMG.mountain,
  },
  {
    id: "kanatal",
    name: "Kanatal",
    region: "Uttarakhand",
    lat: 30.3933,
    lng: 78.4202,
    tags: ["nature", "adventure"],
    rating: 4.3,
    reviews: 34,
    description:
      "A quiet oak-and-rhododendron ridge between Mussoorie and Chamba, with apple orchards and cliff views.",
    bestTime: "Mar – Jun",
    entryFee: "Free",
    image: IMG.forest,
  },

  // ── West / Central ───────────────────────────────────────────────────────
  {
    id: "kaas",
    name: "Kaas Plateau",
    region: "Maharashtra",
    lat: 17.715,
    lng: 73.82,
    tags: ["nature", "offbeat"],
    rating: 4.6,
    reviews: 118,
    description:
      "A laterite plateau that erupts into wildflowers after the monsoon — a UNESCO biodiversity site.",
    bestTime: "Aug – Sep",
    entryFee: "₹150",
    image: IMG.valley,
  },
  {
    id: "tarkarli",
    name: "Tarkarli",
    region: "Maharashtra",
    lat: 16.04,
    lng: 73.47,
    tags: ["beach", "adventure", "food"],
    rating: 4.5,
    reviews: 91,
    description:
      "Clear Konkan water above a white sand spit, with scuba diving and Malvani seafood shacks.",
    bestTime: "Nov – Feb",
    entryFee: "Free",
    image: IMG.beach,
  },
  {
    id: "harihar",
    name: "Harihar Fort",
    region: "Maharashtra",
    lat: 19.9,
    lng: 73.46,
    tags: ["trekking", "adventure", "heritage"],
    rating: 4.5,
    reviews: 57,
    description:
      "A rock-cut staircase pitched at nearly 80 degrees, climbing to a hilltop fort in the Sahyadris.",
    bestTime: "Jul – Feb",
    entryFee: "Free",
    image: IMG.mountain,
  },
  {
    id: "orchha",
    name: "Orchha",
    region: "Madhya Pradesh",
    lat: 25.351,
    lng: 78.642,
    tags: ["heritage", "spiritual"],
    rating: 4.7,
    reviews: 78,
    description:
      "A Bundela capital frozen in time, with riverfront cenotaphs, palaces and a rambling Betwa ghat.",
    bestTime: "Oct – Mar",
    entryFee: "₹25",
    image: IMG.heritage,
  },
  {
    id: "chanderi",
    name: "Chanderi",
    region: "Madhya Pradesh",
    lat: 24.713,
    lng: 78.137,
    tags: ["heritage", "food"],
    rating: 4.4,
    reviews: 32,
    description:
      "A weaving town of gossamer saris, Jain shrines and a hilltop fort above a lake.",
    bestTime: "Oct – Mar",
    entryFee: "₹25",
    image: IMG.heritage,
  },
  {
    id: "bhedaghat",
    name: "Bhedaghat",
    region: "Madhya Pradesh",
    lat: 23.129,
    lng: 79.8,
    tags: ["nature", "offbeat"],
    rating: 4.6,
    reviews: 104,
    description:
      "Marble cliffs a hundred feet high funnelling the Narmada past the Dhuandhar falls.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.river,
  },
  {
    id: "tamia",
    name: "Tamia",
    region: "Madhya Pradesh",
    lat: 22.2,
    lng: 78.65,
    tags: ["nature", "offbeat"],
    rating: 4.2,
    reviews: 26,
    description:
      "A near-empty forest plateau on the Satpura ridge, with a colonial rest house above a deep valley.",
    bestTime: "Jul – Feb",
    entryFee: "Free",
    image: IMG.forest,
  },

  // ── Deccan / South ───────────────────────────────────────────────────────
  {
    id: "gandikota",
    name: "Gandikota",
    region: "Andhra Pradesh",
    lat: 14.815,
    lng: 78.287,
    tags: ["heritage", "adventure", "offbeat"],
    rating: 4.7,
    reviews: 86,
    description:
      "The 'Grand Canyon of India' — a Pennar river gorge below a 13th-century fort and granary.",
    bestTime: "Oct – Feb",
    entryFee: "₹20",
    image: IMG.heritage,
  },
  {
    id: "lepakshi",
    name: "Lepakshi",
    region: "Andhra Pradesh",
    lat: 13.8,
    lng: 77.6,
    tags: ["heritage", "spiritual"],
    rating: 4.5,
    reviews: 64,
    description:
      "A Vijayanagara temple with a monolithic Nandi and a pillar famously hanging without touching the ground.",
    bestTime: "Oct – Feb",
    entryFee: "Free",
    image: IMG.temple,
  },
  {
    id: "araku",
    name: "Araku Valley",
    region: "Andhra Pradesh",
    lat: 18.3273,
    lng: 82.875,
    tags: ["nature", "food", "offbeat"],
    rating: 4.4,
    reviews: 72,
    description:
      "Coffee and pepper terraces in the Eastern Ghats, reached by a spectacular ghat railway.",
    bestTime: "Sep – Feb",
    entryFee: "Free",
    image: IMG.valley,
  },
  {
    id: "chikmagalur",
    name: "Chikmagalur",
    region: "Karnataka",
    lat: 13.3161,
    lng: 75.772,
    tags: ["nature", "trekking", "food"],
    rating: 4.6,
    reviews: 112,
    description:
      "Where Indian coffee began — misty estates, Mullayanagiri peak and waterfalls off the Charmadi ghats.",
    bestTime: "Sep – Feb",
    entryFee: "Free",
    image: IMG.forest,
  },
  {
    id: "gokarna",
    name: "Gokarna",
    region: "Karnataka",
    lat: 14.549,
    lng: 74.318,
    tags: ["beach", "spiritual", "offbeat"],
    rating: 4.6,
    reviews: 89,
    description:
      "A temple town with a string of cliff-backed coves reachable only on foot or by boat.",
    bestTime: "Oct – Feb",
    entryFee: "Free",
    image: IMG.beach,
  },
  {
    id: "hampi",
    name: "Hampi",
    region: "Karnataka",
    lat: 15.335,
    lng: 76.46,
    tags: ["heritage", "adventure"],
    rating: 4.7,
    reviews: 149,
    description:
      "The boulder-strewn capital of Vijayanagara, with temple complexes strung along the Tungabhadra.",
    bestTime: "Nov – Feb",
    entryFee: "₹40",
    image: IMG.heritage,
  },
  {
    id: "kollihills",
    name: "Kolli Hills",
    region: "Tamil Nadu",
    lat: 11.25,
    lng: 78.34,
    tags: ["nature", "trekking", "offbeat"],
    rating: 4.3,
    reviews: 43,
    description:
      "Seventy hairpin bends up to a quiet coffee-and-pineapple plateau with the Agaya Gangai falls.",
    bestTime: "Jun – Sep",
    entryFee: "Free",
    image: IMG.valley,
  },
  {
    id: "chettinad",
    name: "Chettinad",
    region: "Tamil Nadu",
    lat: 10.16,
    lng: 78.72,
    tags: ["heritage", "food"],
    rating: 4.5,
    reviews: 56,
    description:
      "A cluster of villages of towering mansions built by 19th-century merchants, and a famed cuisine.",
    bestTime: "Nov – Feb",
    entryFee: "Free",
    image: IMG.heritage,
  },
  {
    id: "dhanushkodi",
    name: "Dhanushkodi",
    region: "Tamil Nadu",
    lat: 9.156,
    lng: 79.419,
    tags: ["beach", "offbeat", "heritage"],
    rating: 4.6,
    reviews: 97,
    description:
      "A cyclone-erased town at the tip of Rameswaram, where the road runs out into the sea.",
    bestTime: "Oct – Feb",
    entryFee: "Free",
    image: IMG.beach,
  },
  {
    id: "tranquebar",
    name: "Tranquebar",
    region: "Tamil Nadu",
    lat: 11.028,
    lng: 79.853,
    tags: ["heritage", "beach"],
    rating: 4.4,
    reviews: 39,
    description:
      "A forgotten Danish trading post on the Coromandel coast, with a sea-facing fort and colonial lanes.",
    bestTime: "Nov – Feb",
    entryFee: "₹10",
    image: IMG.heritage,
  },
  {
    id: "munroe",
    name: "Munroe Island",
    region: "Kerala",
    lat: 8.99,
    lng: 76.61,
    tags: ["nature", "offbeat"],
    rating: 4.5,
    reviews: 51,
    description:
      "A warp-and-weft of canals near Kollam, best seen by canoe as the sun goes down.",
    bestTime: "Sep – Feb",
    entryFee: "Free",
    image: IMG.river,
  },
  {
    id: "poovar",
    name: "Poovar",
    region: "Kerala",
    lat: 8.317,
    lng: 77.071,
    tags: ["beach", "nature"],
    rating: 4.4,
    reviews: 68,
    description:
      "Where a backwater river, a beach and the sea run side by side, sheltered by a mangrove island.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.beach,
  },

  // ── Desert / West Rajasthan ──────────────────────────────────────────────
  {
    id: "khuri",
    name: "Khuri",
    region: "Rajasthan",
    lat: 26.79,
    lng: 70.68,
    tags: ["adventure", "offbeat"],
    rating: 4.5,
    reviews: 47,
    description:
      "The quiet face of the Thar — dunes and mud villages without the Sam sand dunes crowds.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.desert,
  },
  {
    id: "bishnoi",
    name: "Bishnoi Villages",
    region: "Rajasthan",
    lat: 26.42,
    lng: 73.06,
    tags: ["heritage", "nature", "food"],
    rating: 4.6,
    reviews: 58,
    description:
      "Communities near Jodhpur whose faith forbids felling trees — blackbuck graze between the homes.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.desert,
  },

  // ── Temples & landmarks across India ──────────────────────────────────────
  {
    id: "gondeshwar",
    name: "Gondeshwar Temple",
    region: "Sinnar, Maharashtra",
    lat: 19.8514,
    lng: 74.0019,
    tags: ["spiritual", "heritage"],
    rating: 4.7,
    reviews: 96,
    description:
      "A 12th-century Chalukya temple at Sinnar with a rare four-shrine plan — arguably the finest in Maharashtra, and almost always empty.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.temple,
    status: {
      crowd: { level: "low", estimate: "~40 visitors today" },
      connectivity: { level: "good", note: "4G through Sinnar town" },
    },
  },
  {
    id: "bhandardara",
    name: "Bhandardara & Arthur Lake",
    region: "Igatpuri, Maharashtra",
    lat: 19.5292,
    lng: 73.7514,
    tags: ["nature", "offbeat"],
    rating: 4.6,
    reviews: 214,
    description:
      "A monsoon-fed reservoir in the Sahyadris — Wilson Dam, Randha Falls, and the firefly fields of Purushwadi on early-summer nights.",
    bestTime: "Jul – Feb",
    entryFee: "Free",
    image: IMG.lake,
    status: {
      weather: { condition: "rainy", temp: "24°C", humidity: "88%", wind: "16 km/h", visibility: "6 km" },
      connectivity: { level: "moderate", note: "Patchy 4G away from the dam road" },
      alerts: [{ type: "weather", text: "Heavy showers forecast over the ghats" }],
    },
  },
  {
    id: "kailasa-ellora",
    name: "Kailasa Temple, Ellora",
    region: "Chhatrapati Sambhajinagar, Maharashtra",
    lat: 20.0239,
    lng: 75.1792,
    tags: ["heritage", "spiritual"],
    rating: 4.9,
    reviews: 486,
    description:
      "Carved top-down from a single basalt cliff in the 8th century — 200,000 tonnes of rock removed with no room for a second attempt.",
    bestTime: "Oct – Mar",
    entryFee: "₹40 (ASI)",
    image: IMG.heritage,
    status: {
      crowd: { level: "high", estimate: "~1,100 visitors today" },
      safety: { level: "safe", score: 9, note: "Slippery steps when wet — grip shoes advised." },
    },
  },
  {
    id: "bhuleshwar",
    name: "Bhuleshwar Temple",
    region: "Yavat, Pune, Maharashtra",
    lat: 18.4359,
    lng: 74.2411,
    tags: ["spiritual", "heritage"],
    rating: 4.6,
    reviews: 128,
    description:
      "A 13th-century hilltop Shiva temple above the Pune plains, known for its carved dancers and the parrot that 'speaks' when you clap below it.",
    bestTime: "Oct – Feb",
    entryFee: "Free",
    image: IMG.temple,
  },
  {
    id: "lonar",
    name: "Lonar Crater Lake",
    region: "Buldhana, Maharashtra",
    lat: 19.975,
    lng: 76.5075,
    tags: ["nature", "offbeat"],
    rating: 4.7,
    reviews: 232,
    description:
      "A meteor struck the Deccan basalt here some 50,000 years ago. The crater lake is both saline and alkaline, ringed by old temples.",
    bestTime: "Oct – Feb",
    entryFee: "Free",
    image: IMG.lake,
    status: {
      connectivity: { level: "moderate", note: "4G in Lonar town, none on the rim trail" },
    },
  },
  {
    id: "ambarnath",
    name: "Ambarnath Temple",
    region: "Thane, Maharashtra",
    lat: 19.209,
    lng: 73.186,
    tags: ["heritage", "spiritual"],
    rating: 4.5,
    reviews: 74,
    description:
      "A 1060 CE Hemadpanthi Shiva temple beside a suburban railway line, with unusually fine carving across its mandapa ceiling.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.temple,
  },
  {
    id: "kiradu",
    name: "Kiradu Temples",
    region: "Barmer, Rajasthan",
    lat: 25.7528,
    lng: 71.0977,
    tags: ["heritage", "spiritual", "offbeat"],
    rating: 4.6,
    reviews: 88,
    description:
      "Eleven-hundred-year-old stone temples standing alone in the Thar. Locals call the cluster cursed; the carving is Khajuraho-grade.",
    bestTime: "Nov – Feb",
    entryFee: "Free",
    image: IMG.desert,
    status: {
      weather: { condition: "sunny", temp: "38°C", humidity: "18%", wind: "20 km/h", visibility: "16 km" },
      connectivity: { level: "poor", note: "No network at the site" },
      alerts: [{ type: "safety", text: "Carry water — no facilities and extreme heat" }],
    },
  },
  {
    id: "osian",
    name: "Osian Temples",
    region: "Jodhpur, Rajasthan",
    lat: 26.7167,
    lng: 72.9167,
    tags: ["spiritual", "heritage"],
    rating: 4.5,
    reviews: 141,
    description:
      "An 8th–11th-century temple town on an old caravan route, where Jain and Hindu shrines share one stretch of red sandstone.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.desert,
  },
  {
    id: "mitaoli",
    name: "Chausath Yogini Temple",
    region: "Mitaoli, Morena, Madhya Pradesh",
    lat: 26.4368,
    lng: 78.2352,
    tags: ["heritage", "spiritual"],
    rating: 4.7,
    reviews: 163,
    description:
      "A 1323 CE circular shrine of 64 chambers around a central sanctum — widely held to be the model for India's old Parliament building.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.heritage,
  },
  {
    id: "bateshwar",
    name: "Bateshwar Temples",
    region: "Morena, Madhya Pradesh",
    lat: 26.4271,
    lng: 78.1968,
    tags: ["heritage", "spiritual", "offbeat"],
    rating: 4.8,
    reviews: 197,
    description:
      "Around 200 sandstone temples scattered across a ravine floor, rebuilt almost stone by stone after being cleared from rubble.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.heritage,
    status: {
      connectivity: { level: "poor", note: "No reliable data at the site" },
      crowd: { level: "low", estimate: "~60 visitors today" },
    },
  },
  {
    id: "maluti",
    name: "Maluti Temples",
    region: "Dumka, Jharkhand",
    lat: 24.1611,
    lng: 87.6747,
    tags: ["heritage", "spiritual", "offbeat"],
    rating: 4.7,
    reviews: 63,
    description:
      "Seventy-odd terracotta temples in a Santhal village, carrying a carving style that travelled here from Bengal centuries ago.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.temple,
  },
  {
    id: "baijnath",
    name: "Baijnath Temple",
    region: "Kangra, Himachal Pradesh",
    lat: 32.0836,
    lng: 76.9664,
    tags: ["spiritual", "heritage"],
    rating: 4.7,
    reviews: 178,
    description:
      "A Shiva temple raised in 1204 CE above the Binwa, and one of the oldest surviving stone temples in the Himalaya.",
    bestTime: "Mar – Jun, Sep – Nov",
    entryFee: "Free",
    image: IMG.temple,
  },
  {
    id: "tabo",
    name: "Tabo Monastery",
    region: "Spiti, Himachal Pradesh",
    lat: 32.08,
    lng: 78.38,
    tags: ["spiritual", "heritage", "offbeat"],
    rating: 4.8,
    reviews: 156,
    description:
      "Founded in 996 CE and called the Ajanta of the Himalaya — mud-walled chambers holding original murals at 3,050 m.",
    bestTime: "May – Sep",
    entryFee: "₹30",
    image: IMG.mountain,
    status: {
      connectivity: { level: "poor", note: "Intermittent BSNL only" },
      weather: { condition: "sunny", temp: "14°C", humidity: "30%", wind: "22 km/h", visibility: "20 km" },
    },
  },
  {
    id: "jageshwar",
    name: "Jageshwar Temple Complex",
    region: "Almora, Uttarakhand",
    lat: 29.6373,
    lng: 79.8547,
    tags: ["spiritual", "heritage", "nature"],
    rating: 4.8,
    reviews: 289,
    description:
      "A hundred-odd stone temples inside a deodar grove, at the meeting of two streams — one of the twelve Jyotirlingas.",
    bestTime: "Mar – Jun, Sep – Nov",
    entryFee: "Free",
    image: IMG.forest,
  },
  {
    id: "modhera",
    name: "Modhera Sun Temple",
    region: "Mehsana, Gujarat",
    lat: 23.5838,
    lng: 72.1327,
    tags: ["heritage", "spiritual"],
    rating: 4.7,
    reviews: 341,
    description:
      "Built in 1026 CE so the equinox sun falls on the sanctum, with a stepped tank in front that doubles as a geometry lesson.",
    bestTime: "Oct – Mar",
    entryFee: "₹25",
    image: IMG.heritage,
  },
  {
    id: "rani-ki-vav",
    name: "Rani ki Vav",
    region: "Patan, Gujarat",
    lat: 23.8589,
    lng: 72.1017,
    tags: ["heritage"],
    rating: 4.8,
    reviews: 402,
    description:
      "An 11th-century stepwell designed as an inverted temple, seven levels down, lined with more than 500 sculptures.",
    bestTime: "Oct – Mar",
    entryFee: "₹25",
    image: IMG.heritage,
  },
  {
    id: "belur",
    name: "Chennakeshava Temple, Belur",
    region: "Hassan, Karnataka",
    lat: 13.1629,
    lng: 75.8606,
    tags: ["heritage", "spiritual"],
    rating: 4.8,
    reviews: 366,
    description:
      "A 1117 CE Hoysala temple in soapstone — lathe-turned pillars, bracket figures, and friezes that take hours to read.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.temple,
  },
  {
    id: "kailasanathar",
    name: "Kailasanathar Temple",
    region: "Kanchipuram, Tamil Nadu",
    lat: 12.8423,
    lng: 79.6897,
    tags: ["spiritual", "heritage"],
    rating: 4.7,
    reviews: 154,
    description:
      "The oldest standing structure in Kanchipuram — an 8th-century Pallava sandstone temple with a warren of shrines behind it.",
    bestTime: "Oct – Mar",
    entryFee: "Free",
    image: IMG.temple,
  },
  {
    id: "palitana",
    name: "Palitana Temples",
    region: "Bhavnagar, Gujarat",
    lat: 21.483,
    lng: 71.794,
    tags: ["spiritual", "heritage", "trekking"],
    rating: 4.9,
    reviews: 428,
    description:
      "More than 3,000 marble Jain temples crowning Shatrunjaya hill — you climb 3,800 steps to reach them, and no one stays overnight.",
    bestTime: "Nov – Feb",
    entryFee: "Free",
    image: IMG.temple,
    status: {
      crowd: { level: "moderate", estimate: "~700 visitors today" },
      safety: { level: "moderate", score: 7, note: "Steep stone steps — start before sunrise." },
    },
  },
];

// ── Derived live status ────────────────────────────────────────────────────
// Values a place does not declare are derived from a stable hash so the UI is
// consistent between renders instead of twitching on every refresh.

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const WEATHER_CYCLE: PlaceStatus["weather"]["condition"][] = ["sunny", "sunny", "cloudy", "rainy"];

export function placeStatus(place: Place): PlaceStatus {
  const h = hash(place.id);
  const declared = place.status ?? {};
  const condition = declared.weather?.condition ?? WEATHER_CYCLE[h % WEATHER_CYCLE.length];

  const defaultWeather = {
    sunny: { temp: `${26 + (h % 6)}°C`, humidity: "55%", wind: "12 km/h", visibility: "14 km" },
    cloudy: { temp: `${18 + (h % 6)}°C`, humidity: "68%", wind: "14 km/h", visibility: "9 km" },
    rainy: { temp: `${21 + (h % 5)}°C`, humidity: "86%", wind: "11 km/h", visibility: "5 km" },
    snowy: { temp: `${2 + (h % 6)}°C`, humidity: "70%", wind: "18 km/h", visibility: "4 km" },
  }[condition];

  const crowdLevel: PlaceStatus["crowd"]["level"] =
    declared.crowd?.level ?? (["low", "low", "moderate", "moderate", "high"] as const)[h % 5];
  const crowdBase = { low: 90, moderate: 320, high: 800 }[crowdLevel];

  return {
    weather: { condition, ...defaultWeather, ...declared.weather },
    safety: declared.safety ?? {
      level: "safe",
      score: 8,
      note: "No active advisories. Standard precautions apply.",
    },
    crowd: {
      level: crowdLevel,
      estimate: declared.crowd?.estimate ?? `~${crowdBase + (h % 60)} visitors today`,
    },
    connectivity: declared.connectivity ?? {
      level: "moderate",
      note: "4G available in the main settlement",
    },
    alerts: declared.alerts ?? [],
  };
}
