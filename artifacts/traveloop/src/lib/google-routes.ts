/**
 * Google Routes API client (`directions/v2:computeRoutes`).
 *
 * This is a plain `fetch`, not part of the Maps JavaScript SDK, so it works even
 * when no map is on screen. It uses the same runtime key as the map, served by
 * the API server through `useAppConfig`.
 *
 * Google returns no route at all for some mode/place combinations (bicycles on
 * Indian highways, for instance), so every call resolves to `null` rather than
 * throwing — the UI decides what to do about a missing mode.
 */

export type TravelMode = "DRIVE" | "TWO_WHEELER" | "WALK" | "TRANSIT";

/** A trip endpoint. Coordinates are preferred; the label is the fallback. */
export interface RoutePoint {
  label: string;
  lat?: number;
  lng?: number;
}

export interface RouteLeg {
  mode: TravelMode;
  distanceMeters: number;
  /** Traffic-aware when Google supplies it (drive / two-wheeler). */
  durationSeconds: number;
  /** Free-flow duration for the same route, when Google supplies it. */
  staticDurationSeconds: number | null;
}

const ENDPOINT = "https://routes.googleapis.com/directions/v2:computeRoutes";
const FIELD_MASK = "routes.duration,routes.distanceMeters,routes.staticDuration";

function waypoint(point: RoutePoint) {
  return point.lat !== undefined && point.lng !== undefined
    ? { location: { latLng: { latitude: point.lat, longitude: point.lng } } }
    : { address: point.label };
}

/** Google reports durations as protobuf strings like "3328s". */
function parseDuration(value: unknown): number {
  const seconds = Number.parseFloat(String(value ?? "").replace(/s$/, ""));
  return Number.isFinite(seconds) ? seconds : 0;
}

/** Transit journeys require a departure time; ask for the next hour. */
function departureTime(): string {
  return new Date(Date.now() + 60 * 60 * 1000).toISOString();
}

export async function computeRoute(
  apiKey: string,
  origin: RoutePoint,
  destination: RoutePoint,
  mode: TravelMode,
): Promise<RouteLeg | null> {
  const body: Record<string, unknown> = {
    origin: waypoint(origin),
    destination: waypoint(destination),
    travelMode: mode,
  };

  // Without this Google returns free-flow times and quietly ignores traffic.
  if (mode === "DRIVE" || mode === "TWO_WHEELER") body.routingPreference = "TRAFFIC_AWARE";
  if (mode === "TRANSIT") body.departureTime = departureTime();

  let response: Response;
  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
    });
  } catch {
    return null; // Offline or blocked — the caller falls back to the estimate.
  }

  if (!response.ok) return null;

  const data = await response.json();
  const route = data?.routes?.[0];
  if (!route) return null;

  return {
    mode,
    distanceMeters: route.distanceMeters ?? 0,
    durationSeconds: parseDuration(route.duration),
    staticDurationSeconds: route.staticDuration ? parseDuration(route.staticDuration) : null,
  };
}

/**
 * Great-circle distance, used for the offline estimate. Road distance is longer
 * than this in practice, so the caller applies a detour factor.
 */
export function straightLineKm(a: RoutePoint, b: RoutePoint): number | null {
  if (a.lat === undefined || a.lng === undefined || b.lat === undefined || b.lng === undefined) {
    return null;
  }
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(meters < 10_000 ? 1 : 0)} km`;
}

export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours < 24) return minutes ? `${hours}h ${minutes}min` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}
