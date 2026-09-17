import { useState } from "react";
import { Search, MapPin, Star, Home, Compass, X, Check, Plus, Phone, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlaceImage } from "@/components/place-image";
import { PLACES, type Place } from "@/data/places";

const PLACE_BY_ID = new Map(PLACES.map((place) => [place.id, place]));

interface Listing {
  id: string;
  name: string;
  location: string;
  type: "homestay" | "guide";
  rating: number;
  reviews: number;
  price: string;
  /** Portrait of the host. */
  avatar: string;
  /** Catalogue id whose real photo fronts the card. */
  coverPlaceId: string;
  verified: boolean;
  description: string;
  amenities: string[];
}

const HOSTS: Listing[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    location: "Spiti Valley",
    type: "homestay",
    rating: 4.9,
    reviews: 47,
    price: "₹1,200/night",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=75",
    coverPlaceId: "spiti",
    verified: true,
    description: "Traditional stone house with valley views. Home-cooked Himachali meals included.",
    amenities: ["WiFi", "Meals", "Parking", "Heating"],
  },
  {
    id: "2",
    name: "Priya Deka",
    location: "Majuli Island",
    type: "guide",
    rating: 4.8,
    reviews: 32,
    price: "₹800/tour",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=75",
    coverPlaceId: "majuli",
    verified: true,
    description: "Local guide specializing in Majuli's mask-making traditions and satra visits.",
    amenities: ["Boat ride", "Walking tour", "Cultural experience"],
  },
  {
    id: "3",
    name: "Anita Borgohain",
    location: "Ziro Valley",
    type: "homestay",
    rating: 4.7,
    reviews: 28,
    price: "₹900/night",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=75",
    coverPlaceId: "ziro",
    verified: true,
    description: "Apatani tribe homestay with rice-fish culture experience and bamboo house.",
    amenities: ["Meals", "Cultural tour", "Garden"],
  },
  {
    id: "4",
    name: "Tashi Dorje",
    location: "Ladakh",
    type: "guide",
    rating: 4.9,
    reviews: 63,
    price: "₹1,500/day",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=75",
    coverPlaceId: "zanskar",
    verified: true,
    description: "Experienced mountain guide. Specializes in Spiti, Zanskar, and high-altitude treks.",
    amenities: ["4x4 transport", "Camping gear", "First aid"],
  },
  {
    id: "5",
    name: "Lakshmi Devi",
    location: "Orchha",
    type: "homestay",
    rating: 4.6,
    reviews: 19,
    price: "₹700/night",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=75",
    coverPlaceId: "orchha",
    verified: true,
    description: "Heritage haveli near Betwa river. Traditional Bundela cuisine and folk music.",
    amenities: ["River view", "Meals", "Bicycle"],
  },
  {
    id: "6",
    name: "Mohammed Irfan",
    location: "Gokarna",
    type: "guide",
    rating: 4.5,
    reviews: 41,
    price: "₹600/tour",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=75",
    coverPlaceId: "gokarna",
    verified: true,
    description: "Beach and temple tour specialist. Knows every hidden cove in Gokarna.",
    amenities: ["Beach tour", "Temple visits", "Local food tour"],
  },
  {
    id: "7",
    name: "Sagar Patil",
    location: "Bhandardara, Maharashtra",
    type: "homestay",
    rating: 4.7,
    reviews: 22,
    price: "₹1,400/night",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=75",
    coverPlaceId: "bhandardara",
    verified: true,
    description: "Lake-facing cottage above Arthur Lake. Boats, monsoon waterfalls and village thalis.",
    amenities: ["Lake view", "Meals", "Boating", "Bonfire"],
  },
  {
    id: "8",
    name: "Meera Joshi",
    location: "Sinnar, Maharashtra",
    type: "guide",
    rating: 4.8,
    reviews: 36,
    price: "₹900/tour",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=75",
    coverPlaceId: "gondeshwar",
    verified: true,
    description: "Heritage walks through Gondeshwar's Chalukya carvings and Sinnar's old temple tanks.",
    amenities: ["Heritage walk", "Temple tour", "Local food"],
  },
  {
    id: "9",
    name: "Sunita Murmu",
    location: "Maluti, Jharkhand",
    type: "guide",
    rating: 4.7,
    reviews: 24,
    price: "₹750/tour",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=75",
    coverPlaceId: "maluti",
    verified: true,
    description: "Santhal village walks around Maluti's terracotta temples, plus dokra metalwork.",
    amenities: ["Village walk", "Craft workshop", "Birding"],
  },
  {
    id: "10",
    name: "Devendra Rathore",
    location: "Osian, Rajasthan",
    type: "guide",
    rating: 4.6,
    reviews: 29,
    price: "₹1,100/tour",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=75",
    coverPlaceId: "osian",
    verified: true,
    description: "Desert temple circuit — Osian's sandstone shrines, then the dunes before sunset.",
    amenities: ["4x4 transport", "Temple tour", "Camel ride"],
  },
];

const LISTING_TYPES = [
  { id: "homestay", label: "Homestay", icon: Home, badge: "bg-emerald-100 text-emerald-700" },
  { id: "guide", label: "Local Guide", icon: Compass, badge: "bg-blue-100 text-blue-700" },
];

/** Header photo, from the same catalogue the destination cards use. */
const HEADER_PLACE: Place = PLACES.find((p) => p.id === "tirthan") ?? PLACES[0];

export default function Listings() {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ name: "", type: "homestay", location: "", description: "", price: "", phone: "", email: "" });

  const filtered = HOSTS.filter((h) => {
    const q = query.toLowerCase();
    const matchesQuery = !query || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q);
    const matchesType = selectedType === "all" || h.type === selectedType;
    return matchesQuery && matchesType;
  });

  const selected = HOSTS.find((h) => h.id === selectedHost);
  const selectedCover = selected ? PLACE_BY_ID.get(selected.coverPlaceId) : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="relative h-40 overflow-hidden rounded-2xl">
        <PlaceImage place={HEADER_PLACE} width={1400} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
          <h1 className="text-2xl font-bold text-white">Hosts & Guides</h1>
          <p className="mt-1 text-sm text-white/75">
            {HOSTS.length} verified local hosts and guides across {new Set(HOSTS.map((h) => h.location)).size} destinations
          </p>
        </div>
        <div className="absolute right-4 top-4">
          <Button
            onClick={() => setShowRegister(true)}
            className="gap-2 rounded-xl border-0 bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" /> Register
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or location…"
            className="h-11 rounded-xl pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              selectedType === "all" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
            }`}
          >
            All
          </button>
          {LISTING_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                selectedType === t.id ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((host) => {
          const cover = PLACE_BY_ID.get(host.coverPlaceId);
          const type = LISTING_TYPES.find((t) => t.id === host.type);
          return (
            <div
              key={host.id}
              onClick={() => setSelectedHost(host.id)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-emerald-300/60 hover:shadow-md"
            >
              <div className="relative h-36 overflow-hidden">
                {cover ? (
                  <PlaceImage
                    place={cover}
                    width={800}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <img src={host.avatar} alt="" className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <span
                  className={`absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${type?.badge ?? "bg-muted"}`}
                >
                  {host.type === "homestay" ? "🏠 Homestay" : "🧭 Guide"}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="truncate text-base font-bold text-white drop-shadow">{host.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-white/75">
                    <MapPin className="h-3 w-3" /> {host.location}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3">
                  <img src={host.avatar} alt={`${host.name} portrait`} className="h-11 w-11 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    {host.verified && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified host
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{host.rating}</span>
                      <span className="text-muted-foreground">({host.reviews} reviews)</span>
                    </span>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-emerald-600">{host.price}</p>
                </div>

                <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{host.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border pt-3">
                  {host.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium">No hosts or guides found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different name or location</p>
        </div>
      )}

      {/* Selected Host Detail */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setSelectedHost(null)}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card shadow-xl">
            <div className="relative h-52">
              {selectedCover ? (
                <PlaceImage key={selected.id} place={selectedCover} width={1200} className="h-full w-full object-cover" />
              ) : (
                <img src={selected.avatar} alt="" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                onClick={() => setSelectedHost(null)}
                className="absolute right-3 top-3 rounded-full bg-black/40 p-2 hover:bg-black/60"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                <img
                  src={selected.avatar}
                  alt={`${selected.name} portrait`}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-white/80"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-xl font-bold text-white">{selected.name}</h2>
                    {selected.verified && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                        <Check className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 text-sm text-white/75">
                    <MapPin className="h-3 w-3" /> {selected.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center gap-4">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${LISTING_TYPES.find((t) => t.id === selected.type)?.badge}`}>
                  {selected.type === "homestay" ? "🏠 Homestay" : "🧭 Local Guide"}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {selected.rating} ({selected.reviews} reviews)
                </span>
                <span className="ml-auto text-sm font-bold text-emerald-600">{selected.price}</span>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{selected.description}</p>

              {selectedCover && (
                <p className="text-[11px] text-muted-foreground">
                  Photos of {selectedCover.name}, where {selected.name.split(" ")[0]} hosts.
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {selected.amenities.map((a) => (
                  <span key={a} className="rounded-xl bg-muted px-3 py-1.5 text-xs font-medium">
                    {a}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 border-t border-border pt-3">
                <Button className="flex-1 gap-2 rounded-xl border-0 bg-emerald-500 text-white hover:bg-emerald-600">
                  <Phone className="h-4 w-4" /> Contact
                </Button>
                <Button variant="outline" className="flex-1 gap-2 rounded-xl">
                  <Mail className="h-4 w-4" /> Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegister && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowRegister(false)}
        >
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 pb-4 pt-5">
              <div>
                <h2 className="text-lg font-bold">Register as Host or Guide</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">List your homestay or guide services</p>
              </div>
              <button onClick={() => setShowRegister(false)} className="rounded-xl p-2 hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Your name"
                    className="rounded-xl"
                    value={regForm.name}
                    onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Listing Type *
                  </label>
                  <div className="flex gap-2">
                    {LISTING_TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setRegForm((f) => ({ ...f, type: t.id }))}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                          regForm.type === t.id
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                            : "border-border text-muted-foreground hover:border-emerald-200"
                        }`}
                      >
                        <t.icon className="h-3.5 w-3.5" /> {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location *
                </label>
                <Input
                  placeholder="e.g. Sinnar, Maharashtra"
                  className="rounded-xl"
                  value={regForm.location}
                  onChange={(e) => setRegForm((f) => ({ ...f, location: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe your homestay or guide services…"
                  className="min-h-[100px] rounded-xl"
                  value={regForm.description}
                  onChange={(e) => setRegForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price</label>
                  <Input
                    placeholder="e.g. ₹1,200/night"
                    className="rounded-xl"
                    value={regForm.price}
                    onChange={(e) => setRegForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone</label>
                  <Input
                    placeholder="+91 98765 43210"
                    className="rounded-xl"
                    value={regForm.phone}
                    onChange={(e) => setRegForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
                <Input
                  placeholder="your@email.com"
                  type="email"
                  className="rounded-xl"
                  value={regForm.email}
                  onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex shrink-0 gap-3 border-t border-border px-6 py-4">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowRegister(false)}>
                Cancel
              </Button>
              <Button className="flex-1 rounded-xl border-0 bg-emerald-500 text-white hover:bg-emerald-600">
                Submit Registration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
