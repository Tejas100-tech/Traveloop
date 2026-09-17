/**
 * Loads the Google Maps JavaScript API on demand.
 *
 * The key is fetched from the API server at runtime (see `useAppConfig`) rather
 * than baked into the bundle, so rotating it does not require a rebuild. The
 * promise is memoised so multiple components share a single script tag.
 */

declare global {
  interface Window {
    google?: any;
    /** Invoked by Google when the script loads but the API key is rejected. */
    gm_authFailure?: () => void;
    __localDiscoverMaps?: Promise<void>;
  }
}

let loaderPromise: Promise<void> | null = null;

type Listener = () => void;
const authFailureListeners = new Set<Listener>();

/**
 * Google calls `gm_authFailure` when the script itself loads but the key is
 * rejected (invalid key, missing referrer, API not enabled). The hook has to
 * exist on `window` *before* the script runs, so it is installed up front.
 */
function installAuthFailureHook(): void {
  if (typeof window === "undefined" || window.gm_authFailure) return;
  window.gm_authFailure = () => {
    loaderPromise = null;
    authFailureListeners.forEach((listener) => listener());
  };
}

/** Notifies when Google rejects the key. Returns an unsubscribe function. */
export function onMapsAuthFailure(listener: Listener): () => void {
  installAuthFailureHook();
  authFailureListeners.add(listener);
  return () => {
    authFailureListeners.delete(listener);
  };
}

/**
 * `window.google.maps` only exists once the API has actually initialised, so
 * this doubles as the "is the loaded key usable?" check.
 */
export function googleMapsLoaded(): boolean {
  return typeof window !== "undefined" && !!window.google?.maps;
}

export function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only load in the browser"));
  }
  if (googleMapsLoaded()) return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  installAuthFailureHook();

  loaderPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      // Allow a retry on the next mount instead of caching the failure forever.
      loaderPromise = null;
      reject(new Error("Could not load the Google Maps script"));
    };
    document.head.appendChild(script);
  });

  window.__localDiscoverMaps = loaderPromise;
  return loaderPromise;
}
