import { useMemo, useState } from "react";
import { Compass, Filter, Info, Layers, MapPin, Star, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleMap } from "@/components/google-map";
import { useAppConfig } from "@/lib/app-config";
import { PLACES, TAGS, pinColor, type Place, type TagId } from "@/data/places";

/* Bounding box used by the offline fallback plot (mainland India). */
const BOX = { west: 68, east: 97.5, north: 35.5, south: 8 };

function projectToPercent(lat: number, lng: number) {
  const left = ((lng - BOX.west) / (BOX.east - BOX.west)) * 100;
  const top = (1 - (lat - BOX.south) / (BOX.north - BOX.south)) * 100;
  return { left: `${left}%`, top: `${top}%` };
}

/** Lightweight plotted map used when no Google Maps key is configured. */
function FallbackMap({
  places,
  selectedId,
  onSelect,
}: {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-50">
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          className="rounded-lg border border-border bg-card p-2 hover:bg-emerald-50"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
          className="rounded-lg border border-border bg-card p-2 hover:bg-emerald-50"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          <path
            d="M 45,5 L 55,5 L 62,15 L 70,20 L 72,30 L 75,35 L 78,40 L 82,50 L 80,60 L 78,65 L 72,70 L 68,78 L 65,82 L 60,88 L 55,92 L 52,95 L 48,92 L 45,88 L 42,82 L 38,78 L 35,72 L 32,65 L 30,58 L 28,50 L 25,42 L 22,35 L 25,28 L 30,20 L 35,12 L 40,8 Z"
            fill="none"
            stroke="rgba(16,185,129,0.3)"
            strokeWidth="1"
          />
        </svg>

        {places.map((p) => {
          const pos = projectToPercent(p.lat, p.lng);
          const active = selectedId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.left, top: pos.top }}
              aria-label={p.name}
            >
              <span
                className={`block rounded-full shadow-lg ring-2 ring-white transition-transform ${
                  active ? "scale-150" : "group-hover:scale-125"
                }`}
                style={{ backgroundColor: pinColor(p), width: 14, height: 14 }}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/80 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {p.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-3 left-3 z-10 rounded-xl border border-border bg-card/90 p-3 text-xs backdrop-blur-sm">
        <p className="mb-1.5 font-semibold">Legend</p>
        <div className="space-y-1">
          {TAGS.filter((t) => places.some((p) => p.tags[0] === t.id)).map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.pin }} />
              <span className="text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-3 bottom-3 z-10 rounded-xl border border-border bg-card/90 p-2 backdrop-blur-sm">
        <Compass className="h-6 w-6 text-emerald-500" />
      </div>
    </div>
  );
}

export default function InteractiveMap() {
  const { config, loading } = useAppConfig();
  const [activeTag, setActiveTag] = useState<TagId | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapsError, setMapsError] = useState<string | null>(null);

  const places = useMemo(
    () => (activeTag === "all" ? PLACES : PLACES.filter((p) => p.tags.includes(activeTag))),
    [activeTag],
  );

  const selected = PLACES.find((p) => p.id === selectedId) ?? null;
  const apiKey = config?.googleMapsApiKey ?? null;
  const useGoogle = Boolean(apiKey) && !mapsError;

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Interactive Map</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {places.length} lesser-known destinations · click a pin for details
          </p>
        </div>
        {useGoogle ? (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <Layers className="h-3.5 w-3.5" /> Google Maps
          </span>
        ) : (
          !loading && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <Info className="h-3.5 w-3.5" /> Offline map view
            </span>
          )
        )}
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <button
          onClick={() => setActiveTag("all")}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
            activeTag === "all" ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {TAGS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTag(t.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTag === t.id ? "text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            style={activeTag === t.id ? { backgroundColor: t.pin } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="h-[520px]">
        {useGoogle ? (
          <GoogleMap
            apiKey={apiKey as string}
            places={places}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onError={setMapsError}
            className="h-full w-full"
          />
        ) : (
          <div className="h-full overflow-hidden rounded-2xl border border-border">
            <FallbackMap places={places} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        )}
      </div>

      {mapsError ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Showing the offline map — {mapsError}
        </p>
      ) : (
        !apiKey &&
        !loading && (
          <p className="rounded-xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
            Add <code className="font-mono font-semibold">GOOGLE_MAPS_API_KEY</code> in Settings →
            Environment to enable the live Google Map with satellite and street layers. Pin positions
            are accurate either way.
          </p>
        )
      )}

      {/* Selected place */}
      {selected && (
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: pinColor(selected) }}
          >
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold">{selected.name}</h3>
            <p className="text-sm text-muted-foreground">{selected.region}</p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {selected.rating} ({selected.reviews})
              </span>
              <span className="text-muted-foreground">Best: {selected.bestTime}</span>
              <span className="text-muted-foreground">Entry: {selected.entryFee}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 rounded-lg border-emerald-200 text-emerald-600"
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`,
                "_blank",
                "noopener",
              )
            }
          >
            Directions
          </Button>
        </div>
      )}
    </div>
  );
}
