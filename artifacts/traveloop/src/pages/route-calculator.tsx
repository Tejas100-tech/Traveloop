import { useMemo, useState } from "react";
import { ArrowRight, Bike, Car, Clock, Footprints, Info, Loader2, MapPin, RotateCcw, Route, Train } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceImage } from "@/components/place-image";
import { useAppConfig } from "@/lib/app-config";
import {
  computeRoute,
  formatDistance,
  formatDuration,
  straightLineKm,
  type RouteLeg,
  type RoutePoint,
  type TravelMode,
} from "@/lib/google-routes";
import { PLACES } from "@/data/places";

/** Rail/air hubs travellers actually start from. */
const HUBS: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Guwahati: { lat: 26.1445, lng: 91.7362 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Nashik: { lat: 19.9975, lng: 73.7898 },
  Chandigarh: { lat: 30.7333, lng: 76.7794 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  Bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  Goa: { lat: 15.2993, lng: 74.124 },
  Madurai: { lat: 9.9252, lng: 78.1198 },
};

interface ModeSpec {
  id: TravelMode;
  label: string;
  icon: React.ElementType;
  /** Used only by the offline estimate. */
  speedKmh: number;
  /** Rough running cost per km, for the labelled fuel estimate. */
  fuelPerKm?: number;
}

const MODES: ModeSpec[] = [
  { id: "DRIVE", label: "Car", icon: Car, speedKmh: 45, fuelPerKm: 6.5 },
  { id: "TWO_WHEELER", label: "Motorbike", icon: Bike, speedKmh: 40, fuelPerKm: 2.2 },
  { id: "TRANSIT", label: "Train & bus", icon: Train, speedKmh: 40 },
  { id: "WALK", label: "On foot", icon: Footprints, speedKmh: 4.5 },
];

/** Roads are never straight: pad the great-circle distance before estimating. */
const DETOUR_FACTOR = 1.25;

const PLACE_BY_NAME = new Map(PLACES.map((place) => [place.name.toLowerCase(), place]));
const LOCATIONS = [...Object.keys(HUBS), ...PLACES.map((p) => p.name)].sort((a, b) => a.localeCompare(b));

const HEADER_PLACE = PLACES.find((p) => p.id === "spiti") ?? PLACES[0];

/** Resolves a typed name to coordinates when we know them, else leaves it as text. */
function pointFor(label: string): RoutePoint {
  const place = PLACE_BY_NAME.get(label.trim().toLowerCase());
  if (place) return { label: place.name, lat: place.lat, lng: place.lng };
  const hub = HUBS[label.trim()];
  if (hub) return { label: label.trim(), lat: hub.lat, lng: hub.lng };
  return { label: label.trim() };
}

export default function RouteCalculator() {
  const { config, loading: configLoading } = useAppConfig();
  const apiKey = config?.googleMapsApiKey ?? null;

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [legs, setLegs] = useState<RouteLeg[] | null>(null);
  const [source, setSource] = useState<"live" | "estimated" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const filteredFrom = useMemo(
    () => LOCATIONS.filter((l) => l.toLowerCase().includes(from.toLowerCase()) && l !== to),
    [from, to],
  );
  const filteredTo = useMemo(
    () => LOCATIONS.filter((l) => l.toLowerCase().includes(to.toLowerCase()) && l !== from),
    [to, from],
  );

  const reset = () => {
    setLegs(null);
    setSource(null);
    setError(null);
  };

  const calculate = async () => {
    if (!from.trim() || !to.trim() || busy) return;
    setBusy(true);
    reset();

    const origin = pointFor(from);
    const destination = pointFor(to);

    if (apiKey) {
      const results = await Promise.all(
        MODES.map((mode) => computeRoute(apiKey, origin, destination, mode.id)),
      );
      const found = results.filter((leg): leg is RouteLeg => leg !== null);
      if (found.length === 0) {
        setError("Google found no route between these two places. Check the spelling and try again.");
      } else {
        setLegs(found);
        setSource("live");
      }
    } else {
      const km = straightLineKm(origin, destination);
      if (km === null) {
        setError("We have no coordinates for one of these places, so an estimate is not possible.");
      } else {
        const roadKm = km * DETOUR_FACTOR;
        setLegs(
          MODES.map((mode) => ({
            mode: mode.id,
            distanceMeters: roadKm * 1000,
            durationSeconds: (roadKm / mode.speedKmh) * 3600,
            staticDurationSeconds: null,
          })),
        );
        setSource("estimated");
      }
    }

    setBusy(false);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    reset();
  };

  const legFor = (mode: TravelMode) => legs?.find((leg) => leg.mode === mode) ?? null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="relative h-36 overflow-hidden rounded-2xl">
        <PlaceImage place={HEADER_PLACE} width={1400} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
          <h1 className="text-2xl font-bold text-white">Route &amp; Time Calculator</h1>
          <p className="mt-1 text-sm text-white/75">
            Real driving, riding, rail and walking times
          </p>
        </div>
      </div>

      {/* Calculator Form */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="relative">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
              <Input
                placeholder="Starting point"
                className="h-11 rounded-xl pl-10"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowFromSuggestions(true);
                  reset();
                }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              />
            </div>
            {showFromSuggestions && from && filteredFrom.length > 0 && (
              <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                {filteredFrom.map((loc) => (
                  <button
                    key={loc}
                    className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-emerald-50"
                    onClick={() => {
                      setFrom(loc);
                      setShowFromSuggestions(false);
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={swap} className="mb-0.5 rounded-full bg-muted p-2 transition-colors hover:bg-emerald-100" aria-label="Swap">
            <RotateCcw className="h-4 w-4 text-emerald-600" />
          </button>

          <div className="relative">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
              <Input
                placeholder="Destination"
                className="h-11 rounded-xl pl-10"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowToSuggestions(true);
                  reset();
                }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              />
            </div>
            {showToSuggestions && to && filteredTo.length > 0 && (
              <div className="absolute top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                {filteredTo.map((loc) => (
                  <button
                    key={loc}
                    className="w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-emerald-50"
                    onClick={() => {
                      setTo(loc);
                      setShowToSuggestions(false);
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="gap-2 rounded-xl border-0 bg-emerald-500 text-white hover:bg-emerald-600"
            onClick={calculate}
            disabled={!from.trim() || !to.trim() || busy}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Route className="h-4 w-4" />}
            {busy ? "Calculating…" : "Calculate Route"}
          </Button>

          {!configLoading && (
            <span
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                apiKey ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              <Info className="h-3.5 w-3.5" />
              {apiKey ? "Live Google Routes" : "Estimates only — set GOOGLE_MAPS_API_KEY"}
            </span>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
      )}

      {/* Results */}
      {legs && source && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-center justify-center gap-4 text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">From</p>
                <p className="text-lg font-bold text-emerald-900">{from}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">To</p>
                <p className="text-lg font-bold text-emerald-900">{to}</p>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-emerald-700">
              {source === "live"
                ? "Distances and times from Google Routes, with live traffic where available."
                : "Estimated from straight-line distance — add a Google Maps key for real road routing."}
            </p>
          </div>

          <div className="p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Transport Options
            </h3>
            <div className="space-y-3">
              {MODES.map((mode) => {
                const leg = legFor(mode.id);
                const Icon = mode.icon;
                const km = leg ? leg.distanceMeters / 1000 : 0;
                const fuel =
                  leg && mode.fuelPerKm ? Math.round(km * mode.fuelPerKm) : null;

                return (
                  <div
                    key={mode.id}
                    className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                      leg
                        ? "border-border hover:border-emerald-300 hover:bg-emerald-50/50"
                        : "border-dashed border-border opacity-60"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{mode.label}</p>
                      {leg ? (
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(leg.durationSeconds)}
                          {leg.staticDurationSeconds &&
                            leg.staticDurationSeconds < leg.durationSeconds && (
                              <span className="text-amber-600">
                                {" "}
                                · {formatDuration(leg.staticDurationSeconds - leg.durationSeconds)} in traffic
                              </span>
                            )}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">No route available</p>
                      )}
                    </div>
                    {leg && (
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-emerald-700">
                          {formatDistance(leg.distanceMeters)}
                        </p>
                        {fuel !== null && (
                          <p className="text-[11px] text-muted-foreground">≈ ₹{fuel.toLocaleString("en-IN")} fuel</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {source === "estimated" && (
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                Estimated using a {DETOUR_FACTOR}× detour factor on the straight-line distance, at{" "}
                {MODES.map((m) => `${m.speedKmh} km/h ${m.label.toLowerCase()}`).join(", ")}. Fuel costs assume
                ₹105/litre and are indicative only — Google does not publish fares.
              </p>
            )}

            {source === "live" && legs.some((l) => l.mode === "DRIVE") && (
              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                Fuel figures are indicative (₹105/litre), not quoted fares. Times are traffic-aware where Google
                provides it.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Routes */}
      <div>
        <h2 className="mb-3 text-base font-semibold">Popular Routes</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { from: "Chandigarh", to: "Spiti Valley" },
            { from: "Bengaluru", to: "Chikmagalur" },
            { from: "Goa", to: "Gokarna" },
            { from: "Bhopal", to: "Orchha" },
            { from: "Guwahati", to: "Majuli" },
            { from: "Madurai", to: "Dhanushkodi" },
            { from: "Mumbai", to: "Bhandardara & Arthur Lake" },
            { from: "Nashik", to: "Gondeshwar Temple" },
          ].map((route) => (
            <button
              key={`${route.from}-${route.to}`}
              onClick={() => {
                setFrom(route.from);
                setTo(route.to);
                reset();
              }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-emerald-300 hover:bg-emerald-50/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{route.from}</span>
                  <ArrowRight className="h-3 w-3 text-emerald-400" />
                  <span className="text-sm font-semibold">{route.to}</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> Tap to calculate
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
