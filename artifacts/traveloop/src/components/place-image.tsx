import { useState } from "react";
import { placePhotoUrl } from "@/data/place-photos";

interface PlaceImageProps {
  place: { id: string; name: string; image: string };
  /** Width to request from the remote photo (Commons renders any size). */
  width?: number;
  className?: string;
}

/**
 * Renders the real photograph of a place, falling back to the place's generic
 * stock image if the remote file cannot load (offline, blocked host, file moved).
 *
 * The fallback matters more than it looks: these destinations are exactly the
 * places people visit with patchy connectivity, so a broken image tag is not an
 * option. Call it inside a `relative` container and the skeleton fills it.
 */
export function PlaceImage({ place, width = 1200, className }: PlaceImageProps) {
  const remote = placePhotoUrl(place.id, width);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(!remote);

  const src = remote && !failed ? remote : place.image;

  return (
    <>
      {!loaded && <span aria-hidden className="absolute inset-0 animate-pulse bg-muted" />}
      <img
        src={src}
        alt={place.name}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={className}
      />
    </>
  );
}
