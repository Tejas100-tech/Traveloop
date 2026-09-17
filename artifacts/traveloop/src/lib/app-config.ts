import { useEffect, useState } from "react";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");

export interface AppConfig {
  googleMapsApiKey: string | null;
}

let cached: AppConfig | null = null;

/** Reads public runtime config from the API server (cached for the session). */
export function useAppConfig() {
  const [config, setConfig] = useState<AppConfig | null>(cached);

  useEffect(() => {
    if (cached) return;
    let cancelled = false;

    fetch(`${API}/api/config`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("unavailable"))))
      .then((data: AppConfig) => {
        if (cancelled) return;
        cached = data;
        setConfig(data);
      })
      .catch(() => {
        if (!cancelled) setConfig({ googleMapsApiKey: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loading: config === null };
}
