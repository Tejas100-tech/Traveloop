import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Cloud,
  CloudRain,
  CloudSnow,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  Shield,
  Sun,
  Thermometer,
  Users,
  Wifi,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceImage } from "@/components/place-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PLACES, placeStatus, type Place } from "@/data/places";

/** Header photo, drawn from the same catalogue as the destination cards. */
const HEADER = PLACES.find((p) => p.id === "dzukou") ?? PLACES[0];

const WEATHER_ICONS: Record<string, React.ElementType> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
};

const SAFETY_COLORS: Record<string, string> = {
  safe: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  caution: "bg-orange-100 text-orange-700",
};

const CROWD_COLORS: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
};

const CONNECTIVITY_COLORS: Record<string, string> = {
  good: "text-emerald-600",
  moderate: "text-amber-600",
  poor: "text-red-500",
};

const SORT_OPTIONS = [
  { value: "rating", label: "Top rated" },
  { value: "crowd", label: "Least crowded" },
  { value: "connectivity", label: "Best connectivity" },
] as const;

const CROWD_ORDER: Record<string, number> = { low: 0, moderate: 1, high: 2 };
const CONNECTIVITY_ORDER: Record<string, number> = { good: 0, moderate: 1, poor: 2 };

export default function LiveStatus() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("rating");
  const [lastRefresh, setLastRefresh] = useState(() => new Date());

  // Snapshot the randomness-free status once per refresh so the list is stable.
  const rows = useMemo(() => {
    const withStatus = PLACES.map((place: Place) => ({ place, status: placeStatus(place) }));
    const q = query.trim().toLowerCase();
    const filtered = q
      ? withStatus.filter(
          (r) => r.place.name.toLowerCase().includes(q) || r.place.region.toLowerCase().includes(q),
        )
      : withStatus;

    return [...filtered].sort((a, b) => {
      if (sort === "rating") return b.place.rating - a.place.rating;
      if (sort === "crowd") return CROWD_ORDER[a.status.crowd.level] - CROWD_ORDER[b.status.crowd.level];
      return (
        CONNECTIVITY_ORDER[a.status.connectivity.level] - CONNECTIVITY_ORDER[b.status.connectivity.level]
      );
    });
    // `lastRefresh` is intentionally a dependency: it re-rolls the derived data.
  }, [query, sort, lastRefresh]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      <div className="relative h-36 overflow-hidden rounded-2xl">
        <PlaceImage place={HEADER} width={1400} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/85 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
          <h1 className="text-2xl font-bold text-white">Live Status Simulator</h1>
          <p className="mt-1 text-sm text-white/70">
            Weather, safety, crowd and connectivity for {PLACES.length} destinations
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search destinations…"
            className="h-11 rounded-xl pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="h-11 w-[190px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => setLastRefresh(new Date())}
          variant="outline"
          className="h-11 gap-2 rounded-xl"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Simulated feed · last updated {lastRefresh.toLocaleTimeString()}
      </p>

      <div className="space-y-4">
        {rows.map(({ place, status }) => {
          const WeatherIcon = WEATHER_ICONS[status.weather.condition] ?? Cloud;
          return (
            <div key={place.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-emerald-50/50 px-5 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-bold">{place.name}</h3>
                  <span className="text-xs text-muted-foreground">· {place.region}</span>
                </div>
                {status.alerts.length > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                    <AlertTriangle className="h-3 w-3" /> {status.alerts.length} alert
                    {status.alerts.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
                <div className="space-y-2 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <WeatherIcon className="h-4 w-4 text-blue-500" /> Weather
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{status.weather.temp}</span>
                    <span className="text-xs capitalize text-muted-foreground">
                      {status.weather.condition}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1">
                      <Wind className="h-3 w-3" /> {status.weather.wind}
                    </p>
                    <p className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {status.weather.visibility}
                    </p>
                    <p className="flex items-center gap-1">
                      <Thermometer className="h-3 w-3" /> {status.weather.humidity} humidity
                    </p>
                  </div>
                </div>

                <div className="space-y-2 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Shield className="h-4 w-4 text-emerald-500" /> Safety
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${SAFETY_COLORS[status.safety.level]}`}
                  >
                    Score: {status.safety.score}/10
                  </span>
                  <p className="text-xs leading-relaxed text-muted-foreground">{status.safety.note}</p>
                </div>

                <div className="space-y-2 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Users className="h-4 w-4 text-purple-500" /> Crowd
                  </p>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${CROWD_COLORS[status.crowd.level]}`}
                  >
                    {status.crowd.level.charAt(0).toUpperCase() + status.crowd.level.slice(1)}
                  </span>
                  <p className="text-xs text-muted-foreground">{status.crowd.estimate}</p>
                </div>

                <div className="space-y-2 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Wifi className="h-4 w-4 text-blue-500" /> Connectivity
                  </p>
                  <p
                    className={`text-sm font-bold capitalize ${CONNECTIVITY_COLORS[status.connectivity.level]}`}
                  >
                    {status.connectivity.level}
                  </p>
                  <p className="text-xs text-muted-foreground">{status.connectivity.note}</p>
                </div>
              </div>

              {status.alerts.length > 0 && (
                <div className="space-y-1 border-t border-orange-100 bg-orange-50 px-5 py-3">
                  {status.alerts.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-orange-700">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <p className="font-medium">{a.text}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium">No destinations match that search</p>
        </div>
      )}
    </div>
  );
}
