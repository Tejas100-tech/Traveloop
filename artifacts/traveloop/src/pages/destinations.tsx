import { useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Calendar, IndianRupee, MapPin, Search, Star, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlaceImage } from "@/components/place-image";
import { PLACES, TAGS, tagById, type Place, type TagId } from "@/data/places";
import { photoCredit } from "@/data/place-photos";

/** Scenic header photo, taken from the same catalogue as the cards. */
const HEADER = PLACES.find((p) => p.id === "gandikota") ?? PLACES[0];

export default function Destinations() {
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagId[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Place | null>(null);

  const toggleTag = (id: TagId) =>
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const toggleSave = (id: string) =>
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLACES.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesTags = selectedTags.length === 0 || selectedTags.some((t) => p.tags.includes(t));
      return matchesQuery && matchesTags;
    }).sort((a, b) => b.rating - a.rating);
  }, [query, selectedTags]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="relative h-40 overflow-hidden rounded-2xl">
        <PlaceImage place={HEADER} width={1400} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/85 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center p-6">
          <h1 className="text-2xl font-bold text-white">Discover Destinations</h1>
          <p className="mt-1 text-sm text-white/70">
            {filtered.length} of {PLACES.length} lesser-known places · tag and filter by interest
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, state, or interest…"
          className="h-11 rounded-xl pl-10 pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Location tags */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-semibold">Location Tags</p>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="ml-auto text-xs text-emerald-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const active = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? `${tag.color} ring-2 ring-offset-1 ring-emerald-300`
                    : "border-transparent bg-muted text-muted-foreground hover:border-border"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((place) => (
          <div
            key={place.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md"
          >
            <div className="relative h-40 overflow-hidden">
              <PlaceImage
                place={place}
                width={700}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <button
                onClick={() => toggleSave(place.id)}
                className="absolute right-3 top-3 rounded-full bg-black/35 p-2 backdrop-blur-sm transition-colors hover:bg-black/55"
                aria-label={savedIds.has(place.id) ? "Remove from saved" : "Save destination"}
              >
                {savedIds.has(place.id) ? (
                  <BookmarkCheck className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                ) : (
                  <Bookmark className="h-4 w-4 text-white" />
                )}
              </button>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-base font-bold text-white drop-shadow">{place.name}</h3>
                <p className="flex items-center gap-1 text-xs text-white/75">
                  <MapPin className="h-3 w-3" /> {place.region}
                </p>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {place.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((id) => {
                  const tag = tagById(id);
                  return tag ? (
                    <span
                      key={id}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tag.color}`}
                    >
                      {tag.label}
                    </span>
                  ) : null;
                })}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{place.rating}</span>
                  <span className="text-muted-foreground">({place.reviews})</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg border-emerald-200 text-xs text-emerald-600 hover:bg-emerald-50"
                  onClick={() => setDetail(place)}
                >
                  View details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium">No destinations found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try a different search or clear your tags</p>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl">
          {detail && (
            <>
              <div className="relative -mx-6 -mt-6 h-44 overflow-hidden rounded-t-2xl">
                <PlaceImage key={detail.id} place={detail} width={1000} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <DialogTitle className="text-xl font-bold text-white">{detail.name}</DialogTitle>
                  <p className="flex items-center gap-1 text-sm text-white/75">
                    <MapPin className="h-3 w-3" /> {detail.region}
                  </p>
                </div>
              </div>

              <DialogHeader className="sr-only">
                <DialogTitle>{detail.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <p className="text-sm leading-relaxed text-muted-foreground">{detail.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {detail.tags.map((id) => {
                    const tag = tagById(id);
                    return tag ? (
                      <span
                        key={id}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tag.color}`}
                      >
                        {tag.label}
                      </span>
                    ) : null;
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> Best time
                    </p>
                    <p className="mt-0.5 text-sm font-semibold">{detail.bestTime}</p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IndianRupee className="h-3.5 w-3.5" /> Entry
                    </p>
                    <p className="mt-0.5 text-sm font-semibold">{detail.entryFee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-border p-3">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{detail.rating}</span>
                    <span className="text-muted-foreground">({detail.reviews} reviews)</span>
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                    {detail.lat.toFixed(4)}, {detail.lng.toFixed(4)}
                  </span>
                </div>

                {photoCredit(detail.id) && (
                  <p className="text-[11px] text-muted-foreground">{photoCredit(detail.id)}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    className="flex-1 rounded-xl border-0 bg-emerald-500 text-white hover:bg-emerald-600"
                    onClick={() => toggleSave(detail.id)}
                  >
                    {savedIds.has(detail.id) ? "Saved" : "Save for later"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${detail.lat},${detail.lng}`,
                        "_blank",
                        "noopener",
                      )
                    }
                  >
                    Get directions
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
