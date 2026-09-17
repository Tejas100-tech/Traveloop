import { useEffect, useRef, useState } from "react";
import { Loader2, MapPinOff } from "lucide-react";
import { loadGoogleMaps, googleMapsLoaded, onMapsAuthFailure } from "@/lib/google-maps";
import { pinColor, type Place } from "@/data/places";
import { placePhotoUrl } from "@/data/place-photos";

interface GoogleMapProps {
  apiKey: string;
  places: Place[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  /** Lets the parent swap in the offline plot when Google rejects the key. */
  onError?: (message: string) => void;
  className?: string;
}

const INDIA_CENTER = { lat: 22.5937, lng: 78.9629 };

export function GoogleMap({ apiKey, places, selectedId, onSelect, onError, className }: GoogleMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const infoRef = useRef<any>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  const [ready, setReady] = useState(googleMapsLoaded());
  const [error, setError] = useState<string | null>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // A key can be accepted by the script but rejected by Google afterwards
  // (missing referrer, API not enabled), which never rejects the load promise.
  useEffect(
    () =>
      onMapsAuthFailure(() => {
        setError("Google rejected this API key. Check the key and its HTTP referrer restrictions.");
      }),
    [],
  );

  useEffect(() => {
    if (error) onErrorRef.current?.(error);
  }, [error]);

  // ── Create the map once the script has loaded ────────────────────────────
  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        const g = window.google;
        mapRef.current = new g.maps.Map(containerRef.current, {
          center: INDIA_CENTER,
          zoom: 5,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          backgroundColor: "#f1f5f9",
        });
        infoRef.current = new g.maps.InfoWindow();
        setReady(true);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });


    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  // ── Rebuild markers whenever the place list changes ──────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    const g = window.google;
    const markers = markersRef.current;

    markers.forEach((m) => m.setMap(null));
    markers.clear();

    places.forEach((place) => {
      const marker = new g.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map,
        title: place.name,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: pinColor(place),
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2.5,
        },
      });

      const photo = placePhotoUrl(place.id, 400) ?? place.image;

      marker.addListener("click", () => {
        infoRef.current?.setContent(`
          <div style="font-family:inherit;min-width:180px;max-width:210px">
            <img src="${photo}" alt="" style="display:block;width:100%;height:92px;object-fit:cover;border-radius:8px;margin-bottom:6px" />
            <div style="font-weight:700;font-size:13px;color:#0f172a">${place.name}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">${place.region}</div>
            <div style="font-size:11px;color:#0f172a;margin-top:6px">★ ${place.rating} · ${place.reviews} reviews</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">Best time: ${place.bestTime} · ${place.entryFee}</div>
          </div>
        `);
        infoRef.current?.open({ anchor: marker, map });
        onSelectRef.current?.(place.id);
      });

      markers.set(place.id, marker);
    });

    // Frame everything we just plotted.
    if (places.length > 1) {
      const bounds = new g.maps.LatLngBounds();
      places.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
      map.fitBounds(bounds, 48);
    }
  }, [places, ready]);

  // ── Focus the selected pin ───────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (!marker) return;
    mapRef.current?.panTo(marker.getPosition());
    mapRef.current?.setZoom(11);
  }, [selectedId, ready]);

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 ${className ?? ""}`}>
        <MapPinOff className="w-6 h-6 text-muted-foreground" />
        <p className="text-sm font-medium">Google Maps could not load</p>
        <p className="text-xs text-muted-foreground max-w-xs text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border ${className ?? ""}`}>
      <div ref={containerRef} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/60">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <p className="text-sm text-muted-foreground">Loading map…</p>
        </div>
      )}
    </div>
  );
}
