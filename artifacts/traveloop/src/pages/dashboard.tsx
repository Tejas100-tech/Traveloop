import { useAuth } from "@workspace/replit-auth-web";
import { Link } from "wouter";
import {
  Map, MapPin, Route, Activity, Bell, Users, Star, Wifi, Compass, ArrowRight,
  Cloud, AlertTriangle, Calendar, TrendingUp, PlusCircle, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceImage } from "@/components/place-image";
import { PLACES, tagById } from "@/data/places";

function getGreeting(firstName: string): { greeting: string; sub: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: `Good morning, ${firstName} 🙏`, sub: "Ready to explore hidden gems?" };
  if (hour < 17) return { greeting: `Good afternoon, ${firstName} 🌞`, sub: "What local destination catches your eye?" };
  return { greeting: `Good evening, ${firstName} 🌙`, sub: "Plan tomorrow's adventure tonight." };
}

const FEATURE_CARDS = [
  { href: "/destinations", icon: Map, label: "Explore Destinations", desc: "Discover hidden local gems", color: "bg-emerald-500 text-white hover:bg-emerald-600" },
  { href: "/map", icon: Globe, label: "Interactive Map", desc: "Visual map exploration", color: "bg-card border border-border hover:shadow-md" },
  { href: "/routes", icon: Route, label: "Route Calculator", desc: "Plan travel times", color: "bg-card border border-border hover:shadow-md" },
  { href: "/live-status", icon: Activity, label: "Live Status", desc: "Weather & safety info", color: "bg-card border border-border hover:shadow-md" },
  { href: "/listings", icon: Users, label: "Hosts & Guides", desc: "Verified local services", color: "bg-card border border-border hover:shadow-md" },
  { href: "/reviews", icon: Star, label: "Reviews", desc: "Trusted traveller reviews", color: "bg-card border border-border hover:shadow-md" },
  { href: "/notifications", icon: Bell, label: "Notifications", desc: "Alerts & updates", color: "bg-card border border-border hover:shadow-md" },
  { href: "/offline", icon: Wifi, label: "Offline Mode", desc: "Save for connectivity", color: "bg-card border border-border hover:shadow-md" },
];

const LIVE_ALERTS = [
  { icon: Cloud, text: "Heavy rainfall in Meghalaya — Mawlynnong area affected", color: "text-blue-500 bg-blue-50" },
  { icon: AlertTriangle, text: "Spiti Valley road advisory — check routes", color: "text-orange-500 bg-orange-50" },
  { icon: Users, text: "Low crowd at Gokarna — great time to visit", color: "text-emerald-500 bg-emerald-50" },
];

/** Highest-rated places from the shared catalogue, so photos are of the actual place. */
const RECOMMENDED = [...PLACES].sort((a, b) => b.rating - a.rating).slice(0, 6);

const HERO = PLACES.find((p) => p.id === "zanskar") ?? PLACES[0];

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.firstName || "Explorer";
  const { greeting, sub } = getGreeting(firstName);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-7">

      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden h-52 md:h-60">
        <PlaceImage place={HERO} width={1400} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-1">
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> {today}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{greeting}</h1>
            <p className="text-white/70 text-sm">{sub}</p>
          </div>
          <Link href="/destinations">
            <Button className="w-fit rounded-xl gap-2 bg-emerald-500 hover:bg-emerald-600 border-0 shadow-lg shadow-emerald-500/30 text-white text-sm font-semibold transition-transform hover:scale-[1.02]">
              <Map className="w-4 h-4" /> Explore Destinations
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-emerald-500" /> Quick Access
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURE_CARDS.map((action) => (
            <Link key={action.href} href={action.href} className={`block rounded-2xl p-4 transition-all duration-150 ${action.color}`}>
              <action.icon className="w-5 h-5 mb-2.5 text-emerald-600" />
              <p className="text-sm font-semibold leading-tight">{action.label}</p>
              <p className="text-xs mt-0.5 text-muted-foreground">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Alerts */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" /> Live Alerts
        </h2>
        <div className="space-y-2">
          {LIVE_ALERTS.map((alert, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${alert.color} border border-transparent`}>
              <alert.icon className="w-4 h-4 shrink-0" />
              <p className="text-sm font-medium">{alert.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Destinations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recommended Local Gems</h2>
          <Link href="/destinations" className="text-sm text-emerald-500 hover:underline flex items-center gap-1 font-medium">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {RECOMMENDED.map((dest) => (
            <Link key={dest.id} href="/destinations" className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-emerald-300/50 transition-all">
              <div className="h-32 relative overflow-hidden">
                <PlaceImage
                  place={dest}
                  width={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-2 right-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">
                  {tagById(dest.tags[0])?.label ?? "Offbeat"}
                </span>
                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="text-white font-bold text-sm drop-shadow">{dest.name}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {dest.region}
                  </p>
                </div>
              </div>
              <div className="px-3 py-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {dest.rating}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-4 text-center">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-600">200+</p>
            <p className="text-xs text-muted-foreground">Destinations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">5,000+</p>
            <p className="text-xs text-muted-foreground">Travellers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">150+</p>
            <p className="text-xs text-muted-foreground">Hosts & Guides</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">4.8</p>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
