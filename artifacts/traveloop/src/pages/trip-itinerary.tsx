import { useState, useMemo } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useGetTrip, getGetTripQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Calendar, MapPin, Clock, ChevronLeft, LayoutList,
  CalendarDays, IndianRupee, Compass, Plane, Zap, Tag,
} from "lucide-react";
import { format, parseISO, isValid, eachDayOfInterval, isSameDay } from "date-fns";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const typeColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  sightseeing: { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",  dot: "bg-blue-500"   },
  food:        { bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-200",dot: "bg-orange-500" },
  culture:     { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200",dot: "bg-purple-500" },
  adventure:   { bg: "bg-green-50",   text: "text-green-700",  border: "border-green-200", dot: "bg-green-500"  },
  shopping:    { bg: "bg-pink-50",    text: "text-pink-700",   border: "border-pink-200",  dot: "bg-pink-500"   },
  transport:   { bg: "bg-sky-50",     text: "text-sky-700",    border: "border-sky-200",   dot: "bg-sky-500"    },
  accommodation:{ bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200",dot: "bg-indigo-500" },
  other:       { bg: "bg-muted",      text: "text-muted-foreground", border: "border-border", dot: "bg-muted-foreground" },
};

const stopPalette = [
  "from-orange-400 to-rose-400",
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-violet-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-blue-500",
];

function typeStyle(type: string) {
  return typeColors[type] ?? typeColors.other;
}

function ActivityBadge({ type }: { type: string }) {
  const s = typeStyle(type);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

/* ─── Activity Card ─────────────────────────────────────────────────────────── */
function ActivityCard({ act, compact = false }: { act: any; compact?: boolean }) {
  const s = typeStyle(act.type);
  return (
    <div className={`rounded-xl border p-3 ${s.bg} ${s.border} transition-all`}>
      <div className="flex items-start gap-2">
        <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold leading-tight">{act.name}</span>
            {!compact && <ActivityBadge type={act.type} />}
          </div>
          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
            {act.cost != null && (
              <span className={`flex items-center gap-0.5 font-semibold ${s.text}`}>
                <IndianRupee className="w-3 h-3" />
                {Number(act.cost).toLocaleString("en-IN")}
              </span>
            )}
            {act.duration && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {act.duration >= 60
                  ? `${Math.floor(act.duration / 60)}h ${act.duration % 60 > 0 ? `${act.duration % 60}m` : ""}`
                  : `${act.duration}m`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LIST VIEW ─────────────────────────────────────────────────────────────── */
function ListView({ stops }: { stops: any[] }) {
  const sorted = [...stops].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-8">
      {sorted.map((stop, stopIdx) => {
        const hasStart = stop.startDate && isValid(parseISO(stop.startDate));
        const hasEnd = stop.endDate && isValid(parseISO(stop.endDate));

        const days: Record<string, any[]> = {};
        const undated: any[] = [];

        for (const act of (stop.activities || [])) {
          if (act.scheduledDate && isValid(parseISO(act.scheduledDate))) {
            const k = act.scheduledDate.slice(0, 10);
            if (!days[k]) days[k] = [];
            days[k].push(act);
          } else {
            undated.push(act);
          }
        }

        const sortedDays = Object.keys(days).sort();
        const palette = stopPalette[stopIdx % stopPalette.length];
        const stopCost = (stop.activities || []).reduce((s: number, a: any) => s + (a.cost || 0), 0);

        return (
          <div key={stop.id} className="relative">
            {/* City header */}
            <div className={`rounded-2xl bg-gradient-to-r ${palette} p-5 text-white mb-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                    {stopIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold leading-tight">{stop.cityName}</h3>
                    <p className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {stop.country}
                      {hasStart && hasEnd &&
                        ` · ${format(parseISO(stop.startDate), "MMM d")} – ${format(parseISO(stop.endDate), "MMM d")}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {stopCost > 0 && (
                    <div className="bg-white/20 rounded-xl px-3 py-1.5">
                      <p className="text-xs text-white/70">Est. cost</p>
                      <p className="font-bold text-sm">₹{stopCost.toLocaleString("en-IN")}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {stop.activities?.length === 0 && (
              <p className="text-sm text-muted-foreground px-2 py-4 text-center">
                No activities planned for this stop.
              </p>
            )}

            {/* Days */}
            {sortedDays.map(day => (
              <div key={day} className="mb-5">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold">{format(parseISO(day), "EEEE, MMMM d")}</span>
                  </div>
                  <div className="flex-1 border-t border-border" />
                  <span className="text-xs text-muted-foreground">
                    {days[day].length} {days[day].length === 1 ? "activity" : "activities"}
                  </span>
                </div>
                <div className="space-y-2 pl-1">
                  {days[day].map((act: any) => <ActivityCard key={act.id} act={act} />)}
                </div>
              </div>
            ))}

            {undated.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-1.5">
                    <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground">Unscheduled</span>
                  </div>
                  <div className="flex-1 border-t border-dashed border-border" />
                </div>
                <div className="space-y-2 pl-1">
                  {undated.map((act: any) => <ActivityCard key={act.id} act={act} />)}
                </div>
              </div>
            )}

            {/* Connector line to next city */}
            {stopIdx < sorted.length - 1 && (
              <div className="flex items-center gap-3 my-6 px-2">
                <div className="flex-1 border-t-2 border-dashed border-orange-200" />
                <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                  <Plane className="w-3 h-3 text-orange-500 rotate-90" />
                  <span className="text-xs font-medium text-orange-600">
                    Next: {sorted[stopIdx + 1].cityName}
                  </span>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-orange-200" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── CALENDAR VIEW ─────────────────────────────────────────────────────────── */
function CalendarView({ stops, tripStart, tripEnd }: { stops: any[]; tripStart: Date; tripEnd: Date }) {
  // Build a lookup: date string → { stop, activities[] }
  const dayMap = useMemo(() => {
    const map: Record<string, { stop: any; activities: any[] }[]> = {};
    for (const stop of stops) {
      for (const act of (stop.activities || [])) {
        if (act.scheduledDate && isValid(parseISO(act.scheduledDate))) {
          const k = act.scheduledDate.slice(0, 10);
          if (!map[k]) map[k] = [];
          const existing = map[k].find(x => x.stop.id === stop.id);
          if (existing) existing.activities.push(act);
          else map[k].push({ stop, activities: [act] });
        }
      }
    }
    return map;
  }, [stops]);

  // Which stop is active on each date (by date range)
  function stopForDate(d: Date) {
    return stops.find(s => {
      if (!s.startDate || !s.endDate) return false;
      const sd = parseISO(s.startDate);
      const ed = parseISO(s.endDate);
      return d >= sd && d <= ed;
    });
  }

  const allDays = eachDayOfInterval({ start: tripStart, end: tripEnd });

  // Group into weeks of 7
  const weeks: Date[][] = [];
  let week: Date[] = [];
  allDays.forEach((d, i) => {
    week.push(d);
    if (week.length === 7 || i === allDays.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className="space-y-4">
      {/* City legend */}
      <div className="flex flex-wrap gap-2">
        {[...stops].sort((a, b) => a.orderIndex - b.orderIndex).map((stop, idx) => (
          <div key={stop.id} className={`flex items-center gap-1.5 bg-gradient-to-r ${stopPalette[idx % stopPalette.length]} text-white rounded-full px-3 py-1 text-xs font-medium`}>
            <MapPin className="w-3 h-3" /> {stop.cityName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="space-y-3">
        {weeks.map((wk, wi) => (
          <div key={wi} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${wk.length}, 1fr)` }}>
            {wk.map(day => {
              const key = format(day, "yyyy-MM-dd");
              const stopAtDay = stopForDate(day);
              const stopIdx = stopAtDay ? [...stops].sort((a, b) => a.orderIndex - b.orderIndex).findIndex(s => s.id === stopAtDay.id) : -1;
              const palette = stopIdx >= 0 ? stopPalette[stopIdx % stopPalette.length] : null;
              const dayActivities = dayMap[key] || [];
              const totalActs = dayActivities.reduce((s, g) => s + g.activities.length, 0);
              const dayTotal = dayActivities.reduce((s, g) =>
                s + g.activities.reduce((ss: number, a: any) => ss + (a.cost || 0), 0), 0);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={key}
                  className={`rounded-2xl border min-h-[120px] flex flex-col overflow-hidden
                    ${isToday ? "ring-2 ring-orange-400 ring-offset-1" : ""}
                    ${stopAtDay ? "border-transparent" : "border-border bg-muted/20"}
                  `}
                >
                  {/* Day header */}
                  <div className={`px-2.5 py-2 ${palette ? `bg-gradient-to-r ${palette}` : "bg-muted/40"}`}>
                    <p className={`text-xs font-bold leading-tight ${palette ? "text-white" : "text-muted-foreground"}`}>
                      {format(day, "EEE")}
                    </p>
                    <p className={`text-lg font-bold leading-none mt-0.5 ${palette ? "text-white" : "text-foreground"}`}>
                      {format(day, "d")}
                    </p>
                    {stopAtDay && (
                      <p className="text-white/70 text-[10px] mt-0.5 truncate">{stopAtDay.cityName}</p>
                    )}
                  </div>

                  {/* Activities */}
                  <div className="flex-1 p-1.5 space-y-1 bg-card">
                    {dayActivities.flatMap(g => g.activities).map((act: any) => {
                      const s = typeStyle(act.type);
                      return (
                        <div key={act.id} className={`rounded-lg px-1.5 py-1 border text-[10px] leading-tight ${s.bg} ${s.border} ${s.text}`}>
                          <div className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                            <span className="font-medium truncate">{act.name}</span>
                          </div>
                          {act.cost != null && (
                            <p className="text-[9px] mt-0.5 pl-2.5 opacity-80">₹{Number(act.cost).toLocaleString("en-IN")}</p>
                          )}
                        </div>
                      );
                    })}
                    {totalActs === 0 && stopAtDay && (
                      <p className="text-[10px] text-muted-foreground px-1">Free day</p>
                    )}
                  </div>

                  {/* Footer totals */}
                  {totalActs > 0 && (
                    <div className="px-2 py-1 border-t border-border bg-muted/20 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{totalActs} act{totalActs > 1 ? "s" : ""}</span>
                      {dayTotal > 0 && <span className="text-[10px] font-semibold text-orange-600">₹{dayTotal.toLocaleString("en-IN")}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Unscheduled activities */}
      {(() => {
        const unscheduled = stops.flatMap(stop =>
          (stop.activities || [])
            .filter((a: any) => !a.scheduledDate || !isValid(parseISO(a.scheduledDate)))
            .map((a: any) => ({ ...a, _stopName: stop.cityName }))
        );
        if (!unscheduled.length) return null;
        return (
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-1.5">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">Unscheduled Activities</span>
              </div>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {unscheduled.map((act: any) => (
                <div key={act.id} className="flex items-start gap-2">
                  <ActivityCard act={act} />
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
type ViewMode = "list" | "calendar";

export default function TripItinerary() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = tripId;
  const [, setLocation] = useLocation();
  const [view, setView] = useState<ViewMode>("list");

  const { data: trip, isLoading } = useGetTrip(id, { query: { enabled: !!id, queryKey: getGetTripQueryKey(id) } });

  if (isLoading) return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-4">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-32 rounded-2xl" />
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
    </div>
  );
  if (!trip) return <div className="p-8 text-center text-muted-foreground">Trip not found.</div>;

  const tripStart = trip.startDate ? parseISO(trip.startDate) : null;
  const tripEnd = trip.endDate ? parseISO(trip.endDate) : null;
  const validDates = tripStart && tripEnd && isValid(tripStart) && isValid(tripEnd);
  const totalDays = validDates ? Math.ceil((tripEnd!.getTime() - tripStart!.getTime()) / 86400000) + 1 : null;
  const stops = trip.stops ? [...trip.stops].sort((a: any, b: any) => a.orderIndex - b.orderIndex) : [];
  const totalCost = stops.reduce((s, stop) =>
    s + (stop.activities || []).reduce((ss: number, a: any) => ss + (a.cost || 0), 0), 0);
  const totalActivities = stops.reduce((s, stop) => s + (stop.activities?.length || 0), 0);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back nav */}
      <button
        onClick={() => setLocation(`/trips/${id}`)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Itinerary Builder
      </button>

      {/* Trip hero */}
      <div className="rounded-3xl bg-gradient-to-br from-orange-500 via-rose-400 to-pink-500 p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Compass className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Trip Itinerary</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">{trip.name}</h1>
          {trip.description && <p className="text-white/75 text-sm mb-4">{trip.description}</p>}
          <div className="flex flex-wrap gap-3">
            {validDates && (
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {format(tripStart!, "MMM d")} – {format(tripEnd!, "MMM d, yyyy")}
              </span>
            )}
            {totalDays && (
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium">
                <CalendarDays className="w-3.5 h-3.5" />
                {totalDays} {totalDays === 1 ? "day" : "days"}
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {stops.length} {stops.length === 1 ? "city" : "cities"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{stops.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Cities</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-orange-500">{totalActivities}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Activities</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">
            {totalCost > 0 ? `₹${totalCost.toLocaleString("en-IN")}` : "—"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Est. Cost</p>
        </div>
      </div>

      {/* View toggle + content */}
      {stops.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <Zap className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-medium mb-1">No stops planned yet</p>
          <p className="text-xs text-muted-foreground mb-4">Go back to the itinerary builder to add cities and activities.</p>
          <Button size="sm" className="rounded-xl bg-orange-500 hover:bg-orange-600 border-0" onClick={() => setLocation(`/trips/${id}`)}>
            Open Itinerary Builder
          </Button>
        </div>
      ) : (
        <>
          {/* Toggle */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Full Plan</h2>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  view === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}>
                <LayoutList className="w-3.5 h-3.5" /> List
              </button>
              <button
                onClick={() => setView("calendar")}
                disabled={!validDates}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  view === "calendar" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}>
                <CalendarDays className="w-3.5 h-3.5" /> Calendar
              </button>
            </div>
          </div>

          {view === "list"
            ? <ListView stops={stops} />
            : validDates
              ? <CalendarView stops={stops} tripStart={tripStart!} tripEnd={tripEnd!} />
              : null
          }
        </>
      )}
    </div>
  );
}
