import { useParams } from "wouter";
import { useGetSharedTrip, getGetSharedTripQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, Compass, Globe, Activity } from "lucide-react";
import { format } from "date-fns";

const typeColors: Record<string, string> = {
  sightseeing: "bg-primary/10 text-primary",
  food: "bg-orange-100 text-orange-600",
  culture: "bg-purple-100 text-purple-600",
  adventure: "bg-green-100 text-green-700",
  shopping: "bg-pink-100 text-pink-600",
  other: "bg-muted text-muted-foreground",
};

export default function ShareView() {
  const { shareSlug } = useParams<{ shareSlug: string }>();
  const { data: trip, isLoading, isError } = useGetSharedTrip(shareSlug, {
    query: { enabled: !!shareSlug, queryKey: getGetSharedTripQueryKey(shareSlug) },
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-24 rounded-2xl" />
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
    </div>
  );

  if (isError || !trip) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-center p-6">
      <div>
        <Globe className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-xl font-bold mb-2">Trip not found</h1>
        <p className="text-muted-foreground text-sm">This trip may be private or the link may be incorrect.</p>
      </div>
    </div>
  );

  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;
  const totalActivities = trip.stops?.reduce((sum: number, s: any) => sum + (s.activities?.length || 0), 0) || 0;
  const totalCost = trip.stops?.reduce((sum: number, s: any) =>
    sum + (s.activities?.reduce((a: number, act: any) => a + (act.cost || 0), 0) || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-primary">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Traveloop</span>
        </div>
        <span className="text-xs bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-medium">Public Itinerary</span>
      </div>

      <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
        {/* Trip header */}
        <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
            {trip.description && <p className="text-muted-foreground text-sm mb-4">{trip.description}</p>}
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary" /> {format(start, "MMM d")} – {format(end, "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-primary" /> {trip.stops?.length || 0} cities
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-primary" /> {days} days
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-primary">{trip.stops?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cities</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-secondary">{totalActivities}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Activities</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">₹{totalCost.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Est. Cost</p>
          </div>
        </div>

        {/* Stops */}
        {trip.stops && trip.stops.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Itinerary</h2>
            {trip.stops.map((stop: any, idx: number) => (
              <div key={stop.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">{idx + 1}</div>
                  <div>
                    <h3 className="font-semibold">{stop.cityName}</h3>
                    <p className="text-xs text-muted-foreground">{stop.country} · {format(new Date(stop.startDate), "MMM d")} – {format(new Date(stop.endDate), "MMM d")}</p>
                  </div>
                </div>
                {stop.activities && stop.activities.length > 0 ? (
                  <div className="p-4 space-y-2">
                    {stop.activities.map((act: any) => (
                      <div key={act.id} className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2.5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{act.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[act.type] || typeColors.other}`}>{act.type}</span>
                          </div>
                          <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                            {act.cost != null && <span className="flex items-center gap-1">₹{act.cost}</span>}
                            {act.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration}min</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-3 text-xs text-muted-foreground">No activities listed for this stop.</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
