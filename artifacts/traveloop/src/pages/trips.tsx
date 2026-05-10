import { useState } from "react";
import { useListTrips, getListTripsQueryKey, useDeleteTrip, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import {
  PlusCircle, Calendar, MapPin, Trash2, Edit2, Eye, Share2, Plane,
  IndianRupee, Globe, Lock, CheckCircle2, Clock, TrendingUp, Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays, isAfter, isBefore, parseISO, isValid } from "date-fns";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const INDIA_IMAGES = [
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
  "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=600&q=80",
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
  "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80",
];

type FilterType = "all" | "upcoming" | "ongoing" | "completed";

function safeParseDate(dateStr: any): Date {
  if (!dateStr) return new Date();
  // If it's already an ISO string, parse it directly
  if (typeof dateStr === "string" && dateStr.includes("T")) {
    const d = parseISO(dateStr);
    if (isValid(d)) return d;
  }
  // Otherwise try parsing it as a date string
  const d = parseISO(dateStr);
  if (isValid(d)) return d;
  
  // Fallback to native Date
  const nativeDate = new Date(dateStr);
  if (isValid(nativeDate)) return nativeDate;
  
  return new Date();
}

function getTripStatus(trip: any): { label: string; filter: FilterType; chipColor: string; dotColor: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = safeParseDate(trip.startDate);
  start.setHours(0, 0, 0, 0);
  const end = safeParseDate(trip.endDate);
  end.setHours(0, 0, 0, 0);

  if (isBefore(end, today)) return { label: "Completed", filter: "completed", chipColor: "bg-gray-100 text-gray-500", dotColor: "bg-gray-400" };
  if (isAfter(start, today)) {
    const days = differenceInDays(start, today);
    const label = days === 0 ? "Starts today" : days === 1 ? "Tomorrow" : `In ${days} days`;
    return { label, filter: "upcoming", chipColor: "bg-green-100 text-green-700", dotColor: "bg-green-500" };
  }
  return { label: "Ongoing", filter: "ongoing", chipColor: "bg-blue-100 text-blue-600", dotColor: "bg-blue-500" };
}

function TripCard({ trip, index }: { trip: any; index: number }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const deleteTrip = useDeleteTrip();

  const start = safeParseDate(trip.startDate);
  const end = safeParseDate(trip.endDate);
  const days = differenceInDays(end, start) + 1;
  const status = getTripStatus(trip);
  const coverImg = trip.coverPhoto || INDIA_IMAGES[index % INDIA_IMAGES.length];

  function handleDelete() {
    deleteTrip.mutate({ tripId: trip.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
        toast({ title: "Trip deleted", description: `"${trip.name}" has been removed.` });
      },
      onError: () => toast({ title: "Error", description: "Could not delete trip.", variant: "destructive" }),
    });
  }

  function copyShareLink() {
    const url = `${window.location.origin}/share/${trip.shareSlug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Share link copied!", description: "Anyone with this link can view your itinerary." });
  }

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-200 flex flex-col">
      {/* Cover image */}
      <div
        className="h-40 relative overflow-hidden cursor-pointer"
        onClick={() => setLocation(`/trips/${trip.id}`)}
      >
        <img
          src={coverImg}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {/* Status chip */}
        <div className="absolute top-2.5 left-2.5">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${status.chipColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
            {status.label}
          </span>
        </div>

        {/* Public/private badge */}
        <div className="absolute top-2.5 right-2.5">
          {trip.isPublic
            ? <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white"><Globe className="w-3 h-3" /> Public</span>
            : <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-white/80"><Lock className="w-3 h-3" /> Private</span>
          }
        </div>

        {/* Trip name */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-sm line-clamp-2">{trip.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Date + duration */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {format(start, "MMM d")} – {format(end, "MMM d, yyyy")}
          </span>
          <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {days} {days === 1 ? "day" : "days"}
          </span>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {(trip.stopCount ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600">
              <MapPin className="w-3 h-3" />
              {trip.stopCount} {trip.stopCount === 1 ? "stop" : "stops"}
            </span>
          )}
          {trip.totalBudget != null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
              <IndianRupee className="w-3 h-3" />
              {Number(trip.totalBudget).toLocaleString("en-IN")}
            </span>
          )}
          {(trip.stopCount ?? 0) === 0 && trip.totalBudget == null && (
            <span className="text-xs text-muted-foreground italic">No stops or budget yet</span>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-1 pt-2 border-t border-border mt-auto">
          <Button
            size="sm" variant="ghost"
            className="h-8 flex-1 rounded-xl text-xs gap-1.5 hover:bg-orange-50 hover:text-orange-600"
            onClick={() => setLocation(`/trips/${trip.id}`)}
          >
            <Eye className="w-3.5 h-3.5" /> View
          </Button>
          <Button
            size="sm" variant="ghost"
            className="h-8 flex-1 rounded-xl text-xs gap-1.5 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => setLocation(`/trips/${trip.id}/edit`)}
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </Button>
          {trip.isPublic && (
            <Button
              size="sm" variant="ghost"
              className="h-8 flex-1 rounded-xl text-xs gap-1.5 hover:bg-green-50 hover:text-green-600"
              onClick={copyShareLink}
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm" variant="ghost"
                className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete "{trip.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the trip and all its stops, activities, packing items, and notes. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-xl bg-destructive hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Delete trip
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

const FILTER_TABS: { id: FilterType; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Filter },
  { id: "upcoming", label: "Upcoming", icon: TrendingUp },
  { id: "ongoing", label: "Ongoing", icon: Clock },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
];

export default function Trips() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { data: trips, isLoading } = useListTrips({ query: { queryKey: getListTripsQueryKey() } });

  const filtered = (trips ?? []).filter((trip: any) => {
    if (filter === "all") return true;
    return getTripStatus(trip).filter === filter;
  });

  const totalBudget = (trips ?? []).reduce((sum: number, t: any) => sum + (t.totalBudget != null ? Number(t.totalBudget) : 0), 0);
  const upcomingCount = (trips ?? []).filter((t: any) => getTripStatus(t).filter === "upcoming").length;
  const ongoingCount = (trips ?? []).filter((t: any) => getTripStatus(t).filter === "ongoing").length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Trips</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isLoading ? "Loading…" : `${trips?.length ?? 0} ${(trips?.length ?? 0) === 1 ? "trip" : "trips"} planned`}
          </p>
        </div>
        <Link href="/trips/new">
          <Button className="rounded-xl gap-2 bg-orange-500 hover:bg-orange-600 border-0 shadow-lg shadow-orange-500/25 text-white font-semibold shrink-0">
            <PlusCircle className="w-4 h-4" /> New Trip
          </Button>
        </Link>
      </div>

      {/* Summary stats */}
      {!isLoading && (trips?.length ?? 0) > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Plane, label: "Total trips", value: trips?.length ?? 0, color: "bg-orange-100 text-orange-500" },
            { icon: TrendingUp, label: "Upcoming", value: upcomingCount, color: "bg-green-100 text-green-600" },
            { icon: Clock, label: "Ongoing", value: ongoingCount, color: "bg-blue-100 text-blue-600" },
            { icon: IndianRupee, label: "Total budget", value: totalBudget > 0 ? `₹${totalBudget.toLocaleString("en-IN")}` : "—", color: "bg-purple-100 text-purple-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-foreground truncate">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      {!isLoading && (trips?.length ?? 0) > 0 && (
        <div className="flex items-center gap-1 bg-muted/50 border border-border rounded-xl p-1 w-fit">
          {FILTER_TABS.map(({ id, label, icon: Icon }) => {
            const count = id === "all"
              ? (trips?.length ?? 0)
              : (trips ?? []).filter((t: any) => getTripStatus(t).filter === id).length;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === id
                    ? "bg-white shadow-sm text-foreground border border-border/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {count > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold min-w-[18px] text-center leading-none ${
                    filter === id ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Trip grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      ) : (trips?.length ?? 0) === 0 ? (
        /* Global empty state */
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="h-44 relative">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80"
              alt="India"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
              <p className="text-white text-lg font-semibold text-center px-4">India is waiting — start planning</p>
            </div>
          </div>
          <div className="p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No trips yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
              Every great Indian adventure starts with a plan. Create your first trip and begin building your itinerary.
            </p>
            <Link href="/trips/new">
              <Button className="rounded-xl gap-2 bg-orange-500 hover:bg-orange-600 border-0 text-white">
                <PlusCircle className="w-4 h-4" /> Plan your first trip
              </Button>
            </Link>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        /* Filter empty state */
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Filter className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">No {filter} trips</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {filter === "upcoming" && "You don't have any upcoming trips. Plan a new one!"}
            {filter === "ongoing" && "No trips are happening right now."}
            {filter === "completed" && "No completed trips yet — your first adventure awaits."}
          </p>
          <button
            onClick={() => setFilter("all")}
            className="text-sm text-orange-500 hover:underline font-medium"
          >
            Show all trips
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((trip: any, i: number) => (
            <TripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
