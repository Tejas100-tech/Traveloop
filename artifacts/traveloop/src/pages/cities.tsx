import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useSearchCities, getSearchCitiesQueryKey,
  useListCityActivityTemplates, getListCityActivityTemplatesQueryKey,
  useListTrips, getListTripsQueryKey,
  useCreateStop,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetTripQueryKey } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Globe, Clock, MapPin, X, Info,
  Star, Flame, TrendingUp, Plus, ChevronRight,
  SlidersHorizontal, Check,
} from "lucide-react";

/* ─── Cost levels ──────────────────────────────────────────────────────────── */
interface CostLevel { label: string; rupees: string; color: string; bg: string; daily: string; desc: string }
const COST_LEVELS: Record<string, CostLevel> = {
  "1.0": { label: "Very Budget", rupees: "₹",     color: "text-green-700",  bg: "bg-green-100",  daily: "₹800–1,500/day",    desc: "Hostels, dhabas, local transport" },
  "1.5": { label: "Budget",      rupees: "₹",     color: "text-green-600",  bg: "bg-green-100",  daily: "₹1,000–2,000/day",  desc: "Budget stays, street food & autos" },
  "2.0": { label: "Moderate",    rupees: "₹₹",    color: "text-amber-600",  bg: "bg-amber-100",  daily: "₹2,000–4,000/day",  desc: "Mid-range hotels, restaurants & cabs" },
  "2.5": { label: "Moderate",    rupees: "₹₹",    color: "text-amber-600",  bg: "bg-amber-100",  daily: "₹2,500–5,000/day",  desc: "Comfortable hotels & dining" },
  "3.0": { label: "Comfortable", rupees: "₹₹₹",   color: "text-orange-600", bg: "bg-orange-100", daily: "₹4,000–7,000/day",  desc: "3-star hotels, good restaurants" },
  "3.5": { label: "Comfortable", rupees: "₹₹₹",   color: "text-orange-600", bg: "bg-orange-100", daily: "₹5,000–9,000/day",  desc: "Business hotels, upscale dining" },
  "4.0": { label: "Premium",     rupees: "₹₹₹₹",  color: "text-red-600",    bg: "bg-red-100",    daily: "₹8,000–15,000/day", desc: "4-star hotels, fine dining" },
  "4.5": { label: "Premium",     rupees: "₹₹₹₹",  color: "text-red-600",    bg: "bg-red-100",    daily: "₹10,000–20,000/day",desc: "Luxury stays & curated experiences" },
  "5.0": { label: "Luxury",      rupees: "₹₹₹₹₹", color: "text-purple-600", bg: "bg-purple-100", daily: "₹20,000+/day",      desc: "Heritage hotels, private guides & VIP access" },
};
function getCostLevel(ci: number): CostLevel {
  return COST_LEVELS[String(Math.round(ci * 2) / 2)] ?? COST_LEVELS["2.0"];
}
function CostBadge({ costIndex }: { costIndex: number }) {
  const l = getCostLevel(costIndex);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${l.color} ${l.bg}`}>
      {l.rupees} {l.label}
    </span>
  );
}

/* ─── Popularity indicator ─────────────────────────────────────────────────── */
function PopularityBadge({ popularity }: { popularity: number }) {
  if (popularity >= 80) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-600">
      <Flame className="w-3 h-3" /> Trending
    </span>
  );
  if (popularity >= 60) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
      <TrendingUp className="w-3 h-3" /> Popular
    </span>
  );
  if (popularity >= 40) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
      <Star className="w-3 h-3" /> Liked
    </span>
  );
  return null;
}

/* ─── Add to Trip dialog ────────────────────────────────────────────────────── */
function AddToTripDialog({ city, open, onClose }: { city: any; open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createStop = useCreateStop();
  const { data: trips, isLoading: tripsLoading } = useListTrips({ query: { queryKey: getListTripsQueryKey() } });

  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const selectedTrip = trips?.find((t: any) => t.id === selectedTripId);

  function handle() {
    if (!selectedTripId || !startDate || !endDate) {
      toast({ title: "Please select a trip and both dates", variant: "destructive" });
      return;
    }
    createStop.mutate(
      {
        tripId: selectedTripId,
        data: {
          cityName: city.name,
          country: city.country || "India",
          region: city.region || undefined,
          startDate,
          endDate,
          orderIndex: 999,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(selectedTripId) });
          toast({ title: `${city.name} added to "${selectedTrip?.name}"!` });
          onClose();
          setLocation(`/trips/${selectedTripId}`);
        },
        onError: () => toast({ title: "Failed to add stop", variant: "destructive" }),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" />
            Add {city.name} to a Trip
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          {/* Trip selector */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block font-medium">Select trip</label>
            {tripsLoading ? (
              <div className="space-y-2">{[1, 2].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
            ) : !trips || trips.length === 0 ? (
              <div className="text-center py-4 border border-dashed border-border rounded-xl">
                <p className="text-sm text-muted-foreground">No trips yet.</p>
                <button className="text-xs text-orange-500 underline mt-1" onClick={() => { onClose(); setLocation("/trips/new"); }}>
                  Create a trip first
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {trips.map((trip: any) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      selectedTripId === trip.id
                        ? "border-orange-400 bg-orange-50 ring-1 ring-orange-300"
                        : "border-border bg-card hover:border-orange-200"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      selectedTripId === trip.id ? "border-orange-500 bg-orange-500" : "border-muted-foreground/30"
                    }`}>
                      {selectedTripId === trip.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{trip.name}</p>
                      {trip.startDate && trip.endDate && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(trip.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} –{" "}
                          {new Date(trip.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Arrival in {city.name}</label>
              <Input type="date" className="rounded-xl h-10" value={startDate}
                min={selectedTrip?.startDate?.slice(0, 10)}
                max={selectedTrip?.endDate?.slice(0, 10)}
                onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Departure</label>
              <Input type="date" className="rounded-xl h-10" value={endDate} min={startDate}
                max={selectedTrip?.endDate?.slice(0, 10)}
                onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          {startDate && endDate && startDate <= endDate && (
            <p className="text-xs text-orange-600 font-medium flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1} days in {city.name}
            </p>
          )}

          <Button
            className="w-full rounded-xl h-11 bg-orange-500 hover:bg-orange-600 border-0"
            onClick={handle}
            disabled={!selectedTripId || !startDate || !endDate || createStop.isPending}
          >
            {createStop.isPending ? "Adding…" : `Add ${city.name} to Trip`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Activity card ─────────────────────────────────────────────────────────── */
const typeColors: Record<string, string> = {
  sightseeing: "bg-primary/10 text-primary",
  food: "bg-orange-100 text-orange-600",
  culture: "bg-purple-100 text-purple-600",
  adventure: "bg-green-100 text-green-700",
  shopping: "bg-pink-100 text-pink-600",
  transport: "bg-blue-100 text-blue-600",
  other: "bg-muted text-muted-foreground",
};
function ActivityTemplateCard({ tmpl }: { tmpl: any }) {
  return (
    <div className="bg-muted/40 rounded-xl px-4 py-3 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{tmpl.name}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[tmpl.type] || typeColors.other}`}>{tmpl.type}</span>
        </div>
        {tmpl.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tmpl.description}</p>}
        <div className="flex gap-3 mt-1.5 text-xs">
          {tmpl.cost != null && (
            <span className="font-semibold text-orange-600">
              {Number(tmpl.cost) === 0 ? "Free entry" : `₹${Number(tmpl.cost).toLocaleString("en-IN")}`}
            </span>
          )}
          {tmpl.duration && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {tmpl.duration >= 60 ? `${Math.floor(tmpl.duration / 60)}h${tmpl.duration % 60 ? ` ${tmpl.duration % 60}m` : ""}` : `${tmpl.duration}min`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── City card ─────────────────────────────────────────────────────────────── */
function CityCard({ city, selected, onSelect, onAddToTrip }: {
  city: any; selected: boolean;
  onSelect: () => void;
  onAddToTrip: (e: React.MouseEvent) => void;
}) {
  return (
    <div className={`group bg-card border rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer
      ${selected ? "border-orange-400 ring-2 ring-orange-200 shadow-md" : "border-border hover:border-orange-300/60 hover:shadow-sm"}`}
      onClick={onSelect}>
      {/* Image */}
      <div className="h-36 relative overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50">
        {city.imageUrl
          ? <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-100" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {city.popularity != null && city.popularity >= 60 && (
            <PopularityBadge popularity={city.popularity} />
          )}
        </div>
        {city.costIndex != null && (
          <div className="absolute top-2 right-2">
            <CostBadge costIndex={city.costIndex} />
          </div>
        )}

        {/* City name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-base leading-tight drop-shadow-sm">{city.name}</h3>
          <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {city.region ? `${city.region}, ` : ""}{city.country}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          {city.costIndex != null && (
            <p className="text-xs text-muted-foreground truncate">~{getCostLevel(city.costIndex).daily}</p>
          )}
        </div>
        <button
          onClick={onAddToTrip}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-3 h-3" /> Add to Trip
        </button>
      </div>
    </div>
  );
}

/* ─── Cost legend ───────────────────────────────────────────────────────────── */
function CostLegend() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="text-sm font-semibold text-amber-900">What does the budget level mean?</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { rupees: "₹",    label: "Budget",      daily: "₹1,000–2,000/day",  desc: "Hostels, street food, local transport" },
          { rupees: "₹₹",   label: "Moderate",    daily: "₹2,500–5,000/day",  desc: "Mid-range hotels, restaurants, cabs" },
          { rupees: "₹₹₹",  label: "Comfortable", daily: "₹5,000–9,000/day",  desc: "3-star hotels, good dining" },
          { rupees: "₹₹₹₹", label: "Premium",     daily: "₹10,000–20,000/day",desc: "4-star hotels, fine dining" },
        ].map(l => (
          <div key={l.label} className="bg-white rounded-xl p-3 border border-amber-100">
            <p className="text-base font-bold text-orange-600">{l.rupees}</p>
            <p className="text-xs font-semibold mt-0.5">{l.label}</p>
            <p className="text-xs text-orange-700 font-medium mt-0.5">{l.daily}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{l.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-amber-700 mt-3 flex items-start gap-1.5">
        <Info className="w-3 h-3 mt-0.5 shrink-0" />
        Estimated per person per day including accommodation, food, local transport, and entry fees.
      </p>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function Cities() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<any | null>(null);
  const [addToTripCity, setAddToTripCity] = useState<any | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "popularity" | "budget" | "name">("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get("q");
    if (qParam) {
      setQuery(qParam);
    }
  }, []);

  const { data: cities, isLoading } = useSearchCities(
    { q: query || undefined },
    { query: { queryKey: getSearchCitiesQueryKey({ q: query || undefined }) } }
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addParam = params.get("add");
    if (addParam && cities) {
      // Find the best match
      const lowerAdd = addParam.toLowerCase();
      const match = cities.find((c: any) => c.name.toLowerCase() === lowerAdd || c.name.toLowerCase().includes(lowerAdd));
      if (match && !addToTripCity) {
        setAddToTripCity(match);
      }
    }
  }, [cities]);

  const { data: templates, isLoading: templatesLoading } = useListCityActivityTemplates(
    selectedCity?.id,
    { query: { enabled: !!selectedCity, queryKey: getListCityActivityTemplatesQueryKey(selectedCity?.id) } }
  );

  // Derive filter options from loaded cities
  const countries = useMemo(() => {
    if (!cities) return [];
    return [...new Set(cities.map((c: any) => c.country).filter(Boolean))].sort() as string[];
  }, [cities]);

  const regions = useMemo(() => {
    if (!cities) return [];
    const source = activeCountry ? cities.filter((c: any) => c.country === activeCountry) : cities;
    return [...new Set(source.map((c: any) => c.region).filter(Boolean))].sort() as string[];
  }, [cities, activeCountry]);

  // Apply filters and sort
  const filtered = useMemo(() => {
    if (!cities) return [];
    let list = [...cities];
    if (activeCountry) list = list.filter((c: any) => c.country === activeCountry);
    if (activeRegion) list = list.filter((c: any) => c.region === activeRegion);
    switch (sortBy) {
      case "popularity": list.sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0)); break;
      case "budget":     list.sort((a: any, b: any) => (a.costIndex ?? 999) - (b.costIndex ?? 999)); break;
      case "name":       list.sort((a: any, b: any) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [cities, activeCountry, activeRegion, sortBy]);

  const hasActiveFilters = activeCountry || activeRegion || sortBy !== "default";

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-5">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"
          alt="India cities"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-black/40" />
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white">Explore India</h1>
          <p className="text-white/70 text-sm mt-1">
            {isLoading ? "Loading…" : `${cities?.length ?? 0} destinations`} · Search, filter, and add to your trip
          </p>
        </div>
      </div>

      {/* Search bar + actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search cities (e.g. Goa, Kerala, Jaipur)…"
            className="rounded-xl h-11 pl-10 pr-4"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedCity(null); setActiveCountry(null); setActiveRegion(null); }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-1.5 text-sm px-3 py-2.5 rounded-xl border font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-orange-50 border-orange-300 text-orange-700"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
              {[activeCountry, activeRegion, sortBy !== "default" ? "1" : null].filter(Boolean).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowLegend(v => !v)}
          className={`flex items-center gap-1.5 text-sm px-3 py-2.5 rounded-xl border transition-colors ${
            showLegend ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Info className="w-4 h-4" /> Budget guide
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          {/* Country filter */}
          {countries.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Country</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setActiveCountry(null); setActiveRegion(null); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    !activeCountry ? "bg-orange-500 text-white border-orange-500" : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  }`}
                >
                  All
                </button>
                {countries.map(c => (
                  <button
                    key={c}
                    onClick={() => { setActiveCountry(activeCountry === c ? null : c); setActiveRegion(null); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      activeCountry === c ? "bg-orange-500 text-white border-orange-500" : "bg-muted text-muted-foreground border-transparent hover:border-border"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Region filter */}
          {regions.length > 1 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Region / State</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveRegion(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    !activeRegion ? "bg-orange-500 text-white border-orange-500" : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  }`}
                >
                  All regions
                </button>
                {regions.map(r => (
                  <button
                    key={r}
                    onClick={() => setActiveRegion(activeRegion === r ? null : r)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      activeRegion === r ? "bg-orange-500 text-white border-orange-500" : "bg-muted text-muted-foreground border-transparent hover:border-border"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Sort by</p>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "default", label: "Default" },
                { key: "popularity", label: "Most Popular" },
                { key: "budget", label: "Lowest Cost" },
                { key: "name", label: "A → Z" },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key as any)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    sortBy === opt.key ? "bg-orange-500 text-white border-orange-500" : "bg-muted text-muted-foreground border-transparent hover:border-border"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => { setActiveCountry(null); setActiveRegion(null); setSortBy("default"); }}
              className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              <X className="w-3.5 h-3.5" /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Cost legend */}
      {showLegend && <CostLegend />}

      {/* Results count */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "city" : "cities"}
            {activeCountry ? ` in ${activeCountry}` : ""}
            {activeRegion ? ` · ${activeRegion}` : ""}
          </p>
          {query && (
            <p className="text-xs text-muted-foreground">Results for "<span className="font-medium">{query}</span>"</p>
          )}
        </div>
      )}

      {/* Main content: grid + detail panel */}
      <div className="flex gap-6 flex-col md:flex-row">
        {/* City grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((city: any) => (
                <CityCard
                  key={city.id}
                  city={city}
                  selected={selectedCity?.id === city.id}
                  onSelect={() => setSelectedCity((s: any) => s?.id === city.id ? null : city)}
                  onAddToTrip={e => { e.stopPropagation(); setAddToTripCity(city); }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <Globe className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium">No cities found</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search or clear your filters</p>
              {hasActiveFilters && (
                <button
                  onClick={() => { setActiveCountry(null); setActiveRegion(null); setSortBy("default"); setQuery(""); }}
                  className="mt-3 text-xs text-orange-500 hover:text-orange-600 font-medium underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedCity && (
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-6">
              {/* City image */}
              <div className="relative h-32 overflow-hidden">
                {selectedCity.imageUrl
                  ? <img src={selectedCity.imageUrl} alt={selectedCity.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-100" />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-10">
                  <h3 className="text-white font-bold text-lg leading-tight">{selectedCity.name}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {selectedCity.region ? `${selectedCity.region}, ` : ""}{selectedCity.country}
                  </p>
                </div>
                <button onClick={() => setSelectedCity(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Meta row: cost + popularity */}
              <div className="px-4 py-3 border-b border-border flex items-center gap-3 flex-wrap">
                {selectedCity.costIndex != null && <CostBadge costIndex={selectedCity.costIndex} />}
                {selectedCity.popularity != null && <PopularityBadge popularity={selectedCity.popularity} />}
                {selectedCity.popularity != null && (
                  <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3" /> {selectedCity.popularity}/100
                  </span>
                )}
              </div>

              {/* Cost detail */}
              {selectedCity.costIndex != null && (() => {
                const l = getCostLevel(selectedCity.costIndex);
                return (
                  <div className={`px-4 py-3 border-b border-border ${l.bg}`}>
                    <p className={`text-sm font-bold ${l.color}`}>{l.rupees} {l.label} Destination</p>
                    <p className={`text-xs font-medium ${l.color} opacity-80 mt-0.5`}>{l.daily} per person</p>
                    <p className="text-xs text-muted-foreground mt-1">{l.desc}</p>
                  </div>
                );
              })()}

              {/* Description */}
              {selectedCity.description && (
                <p className="px-4 py-3 text-xs text-muted-foreground border-b border-border leading-relaxed">
                  {selectedCity.description}
                </p>
              )}

              {/* Add to Trip button */}
              <div className="px-4 pt-3 pb-1">
                <Button
                  className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 border-0 gap-2"
                  onClick={() => setAddToTripCity(selectedCity)}
                >
                  <Plus className="w-4 h-4" /> Add {selectedCity.name} to a Trip
                </Button>
              </div>

              {/* Activities */}
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Popular Activities & Entry Costs
                </p>
                {templatesLoading ? (
                  <div className="space-y-2">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
                ) : templates && templates.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {templates.map((t: any) => <ActivityTemplateCard key={t.id} tmpl={t} />)}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <MapPin className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No activities listed yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add to Trip dialog */}
      {addToTripCity && (
        <AddToTripDialog
          city={addToTripCity}
          open={!!addToTripCity}
          onClose={() => setAddToTripCity(null)}
        />
      )}
    </div>
  );
}
