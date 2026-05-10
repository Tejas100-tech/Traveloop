import { useGetDashboard, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Link } from "wouter";
import {
  Plane, Globe, Activity, Calendar, ArrowRight, PlusCircle, MapPin,
  TrendingUp, Globe2, Users, IndianRupee, Compass, ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isAfter, isBefore, parseISO, differenceInDays, isValid } from "date-fns";

function getGreeting(firstName: string): { greeting: string; sub: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: `Good morning, ${firstName} 🙏`, sub: "Ready to start planning?" };
  if (hour < 17) return { greeting: `Good afternoon, ${firstName} 🌞`, sub: "Where to next in India?" };
  return { greeting: `Good evening, ${firstName} 🌙`, sub: "Plan tomorrow's adventure tonight." };
}

const INDIA_HERO_IMAGES = [
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
  "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
  "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=800&q=80",
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
  "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
];

const RECOMMENDED = [
  { name: "Agra", state: "Uttar Pradesh", tag: "UNESCO", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=75" },
  { name: "Jaipur", state: "Rajasthan", tag: "Pink City", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=75" },
  { name: "Kerala", state: "God's Own Country", tag: "Backwaters", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=75" },
  { name: "Goa", state: "Goa", tag: "Beaches", img: "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=400&q=75" },
  { name: "Varanasi", state: "Uttar Pradesh", tag: "Spiritual", img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=75" },
  { name: "Mumbai", state: "Maharashtra", tag: "City of Dreams", img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=400&q=75" },
];

function safeParseDate(dateStr: any): Date {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  
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

function getTripStatus(trip: any): { label: string; color: string } {
  if (!trip.startDate || !trip.endDate) return { label: "Draft", color: "bg-gray-100 text-gray-500" };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = safeParseDate(trip.startDate);
  start.setHours(0, 0, 0, 0);
  const end = safeParseDate(trip.endDate);
  end.setHours(0, 0, 0, 0);
  
  if (isBefore(end, today)) return { label: "Completed", color: "bg-gray-100 text-gray-500" };
  if (isAfter(start, today)) {
    const days = differenceInDays(start, today);
    return { label: days === 0 ? "Today!" : `In ${days}d`, color: days <= 7 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-700" };
  }
  return { label: "Ongoing", color: "bg-blue-100 text-blue-600" };
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function TripCard({ trip, index }: { trip: any; index: number }) {
  const hasDates = trip.startDate && trip.endDate;
  const start = hasDates ? safeParseDate(trip.startDate) : null;
  const end = hasDates ? safeParseDate(trip.endDate) : null;
  const days = start && end ? differenceInDays(end, start) + 1 : null;
  const heroImage = INDIA_HERO_IMAGES[index % INDIA_HERO_IMAGES.length];
  const status = getTripStatus(trip);

  return (
    <Link href={`/trips/${trip.id}`} className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-300/50 transition-all duration-200">
      <div className="h-36 relative overflow-hidden">
        <img src={heroImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
          {status.label}
        </span>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-base leading-tight drop-shadow">{trip.name}</h3>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          {start && end ? (
            <>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(start, "MMM d")} – {format(end, "MMM d, yyyy")}</span>
              <span className="text-border">·</span>
              <span>{days} {days === 1 ? "day" : "days"}</span>
            </>
          ) : (
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />No dates set</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {trip.stopCount > 0 && (
              <span className="px-2.5 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                {trip.stopCount} {trip.stopCount === 1 ? "stop" : "stops"}
              </span>
            )}
            {trip.totalBudget != null && (
              <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                ₹{Number(trip.totalBudget).toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function BudgetCard({ trip, index }: { trip: any; index: number }) {
  const heroImage = INDIA_HERO_IMAGES[index % INDIA_HERO_IMAGES.length];
  const budget = trip.totalBudget != null ? Number(trip.totalBudget) : null;
  const status = getTripStatus(trip);
  const hasDates = trip.startDate && trip.endDate;
  const start = hasDates ? safeParseDate(trip.startDate) : null;
  const end = hasDates ? safeParseDate(trip.endDate) : null;
  const days = start && end ? differenceInDays(end, start) + 1 : null;
  const perDay = budget != null && days != null && days > 0 ? Math.round(budget / days) : null;

  return (
    <Link href={`/trips/${trip.id}/budget`} className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-green-300/50 transition-all duration-200">
      <div className="flex items-stretch">
        <div className="w-20 shrink-0 relative overflow-hidden">
          <img src={heroImage} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="flex-1 p-4 space-y-2 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-foreground text-sm truncate">{trip.name}</h4>
            <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
          </div>
          {budget != null ? (
            <>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-green-600" />
                <span className="text-lg font-bold text-green-700">{budget.toLocaleString("en-IN")}</span>
                <span className="text-xs text-muted-foreground">total budget</span>
              </div>
              {perDay != null && (
                <p className="text-xs text-muted-foreground">
                  ≈ ₹{perDay.toLocaleString("en-IN")} / day · {days} {days === 1 ? "day" : "days"}
                </p>
              )}
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "60%" }} />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">No budget set</p>
              <span className="text-xs text-orange-500 font-medium group-hover:underline">+ Add budget</span>
            </div>
          )}
        </div>
        <div className="flex items-center pr-3">
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-green-600 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

const QUICK_ACTIONS = [
  { href: "/trips/new", icon: PlusCircle, label: "Plan New Trip", desc: "Start a new itinerary", color: "bg-orange-500 text-white hover:bg-orange-600", textColor: "text-white", descColor: "text-orange-100" },
  { href: "/trips", icon: Plane, label: "My Trips", desc: "View all your trips", color: "bg-card border border-border hover:shadow-md hover:border-orange-200", textColor: "text-foreground", descColor: "text-muted-foreground" },
  { href: "/cities", icon: Globe2, label: "Explore Cities", desc: "50+ Indian destinations", color: "bg-card border border-border hover:shadow-md hover:border-blue-200", textColor: "text-foreground", descColor: "text-muted-foreground" },
  { href: "/community", icon: Users, label: "Community", desc: "Discover public trips", color: "bg-card border border-border hover:shadow-md hover:border-purple-200", textColor: "text-foreground", descColor: "text-muted-foreground" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useGetDashboard({ query: { queryKey: getGetDashboardQueryKey() } });

  const firstName = user?.firstName || "Traveler";
  const { greeting, sub } = getGreeting(firstName);
  const today = format(new Date(), "EEEE, MMMM d");
  const tripsWithBudget = data?.recentTrips ?? [];

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-7">

      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden h-52 md:h-60">
        <img
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=85"
          alt="Incredible India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> {today}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{greeting}</h1>
            <p className="text-white/70 text-sm">{sub}</p>
          </div>
          <Link href="/trips/new">
            <Button className="w-fit rounded-xl gap-2 bg-orange-500 hover:bg-orange-600 border-0 shadow-lg shadow-orange-500/30 text-white text-sm font-semibold transition-transform hover:scale-[1.02]">
              <PlusCircle className="w-4 h-4" /> Plan New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href} className={`block rounded-2xl p-4 transition-all duration-150 ${action.color}`}>
              <action.icon className={`w-5 h-5 mb-2.5 ${action.textColor}`} />
              <p className={`text-sm font-semibold leading-tight ${action.textColor}`}>{action.label}</p>
              <p className={`text-xs mt-0.5 ${action.descColor}`}>{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : (
          <>
            <StatCard icon={Plane} label="Total Trips" value={data?.totalTrips ?? 0} color="bg-orange-100 text-orange-500" />
            <StatCard icon={TrendingUp} label="Upcoming" value={data?.upcomingTrips ?? 0} color="bg-green-100 text-green-600" />
            <StatCard icon={Globe} label="Cities" value={data?.totalCitiesVisited ?? 0} color="bg-blue-100 text-blue-600" />
            <StatCard icon={Activity} label="Activities" value={data?.totalActivities ?? 0} color="bg-purple-100 text-purple-600" />
          </>
        )}
      </div>

      {/* Recent Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recent Trips</h2>
          <Link href="/trips" className="text-sm text-orange-500 hover:underline flex items-center gap-1 font-medium">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
          </div>
        ) : data?.recentTrips && data.recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.recentTrips.map((trip: any, i: number) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="h-36 relative">
              <img
                src="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&q=80"
                alt="Jaipur"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <p className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                Your Indian adventure starts here
              </p>
            </div>
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-orange-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No trips yet</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Start planning your first Indian adventure — from the Taj Mahal to the beaches of Goa.
              </p>
              <Link href="/trips/new">
                <Button size="sm" className="rounded-xl gap-2 bg-orange-500 hover:bg-orange-600 border-0 text-white">
                  <PlusCircle className="w-4 h-4" /> Create your first trip
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Budget Highlights */}
      {!isLoading && tripsWithBudget.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-green-600" /> Budget Highlights
            </h2>
            <Link href="/trips" className="text-sm text-orange-500 hover:underline flex items-center gap-1 font-medium">
              All budgets <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {tripsWithBudget.map((trip: any, i: number) => (
              <BudgetCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
          {tripsWithBudget.every((t: any) => t.totalBudget == null) && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Add budgets to your trips to track your ₹ spending.
            </p>
          )}
        </div>
      )}

      {/* Recommended Destinations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recommended Destinations</h2>
          <Link href="/cities" className="text-sm text-orange-500 hover:underline flex items-center gap-1 font-medium">
            See all cities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {RECOMMENDED.map((city) => (
            <Link key={city.name} href="/cities" className="group block">
              <div className="aspect-square rounded-xl overflow-hidden relative">
                <img
                  src={city.img}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center">
                  <p className="text-white text-xs font-bold drop-shadow leading-tight">{city.name}</p>
                  <p className="text-white/60 text-[9px] leading-tight hidden sm:block">{city.tag}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
