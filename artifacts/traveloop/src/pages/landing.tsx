import { Button } from "@/components/ui/button";
import { Map, MapPin, Users, Star, Bell, Wifi, Shield, Globe, Compass, Route, Activity, Calendar } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Link } from "wouter";
import { PlaceImage } from "@/components/place-image";
import { PLACES } from "@/data/places";

/**
 * Landing gallery. Ids resolve against the shared place catalogue, so each tile
 * shows a photograph of that actual destination rather than generic scenery.
 */
const HIDDEN_GEMS = [
  { id: "mawlynnong", tag: "Asia's Cleanest Village" },
  { id: "spiti", tag: "Cold Desert Paradise" },
  { id: "gondeshwar", tag: "12th-Century Temple" },
  { id: "palitana", tag: "3,800 Steps to Marble" },
  { id: "gokarna", tag: "Hidden Coastal Gem" },
  { id: "hampi", tag: "UNESCO Heritage Site" },
];

const FEATURES = [
  {
    icon: Map,
    title: "Interactive Map Display",
    description: "Explore destinations visually with real-time map integration. Pin, zoom, and discover hidden gems nearby.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Route,
    title: "Route & Time Calculator",
    description: "Plan your journey with accurate travel time estimates between destinations, including mode of transport.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Activity,
    title: "Live Status Simulator",
    description: "Check real-time weather, crowd levels, and safety conditions at your destination before you go.",
    color: "bg-orange-100 text-orange-500",
  },
  {
    icon: Bell,
    title: "Notification Engine",
    description: "Get alerts about weather changes, safety conditions, and local events at your saved destinations.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Users,
    title: "Listing & Registration",
    description: "Local hosts and guides register and list their homestays and experiences for travellers to discover.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Wifi,
    title: "Offline/Low Bandwidth Mode",
    description: "Access saved destinations, maps, and itineraries even in remote areas with poor connectivity.",
    color: "bg-red-100 text-red-500",
  },
  {
    icon: Star,
    title: "Rating & Review System",
    description: "Verified reviews and ratings for destinations, hosts, and guides to ensure trustworthy information.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: MapPin,
    title: "Location Tagging",
    description: "Tag and organize destinations by category, activity type, and personal interest for easy discovery.",
    color: "bg-teal-100 text-teal-600",
  },
];

const TRUST_STATS = [
  { icon: Users, value: "5,000+", label: "Local Travellers" },
  { icon: MapPin, value: "200+", label: "Hidden Destinations" },
  { icon: Star, value: "4.8", label: "Avg Rating" },
  { icon: Shield, value: "100%", label: "Verified Hosts" },
];

export default function Landing() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85"
            alt="Hidden local destination"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-2 text-white">
            <Compass className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">LocalDiscover</span>
            <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">India</span>
          </div>
          <Link href="/auth">
            <Button
              size="lg"
              className="font-medium rounded-full px-8 bg-white text-gray-900 hover:bg-emerald-50 shadow-lg border-0"
            >
              Log in
            </Button>
          </Link>
        </header>

        {/* Hero Content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative pb-20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-200 px-4 py-2 rounded-full text-sm font-medium mb-2">
              <MapPin className="w-4 h-4" />
              Discover Lesser-Known Local Destinations
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
              Explore the <span className="text-emerald-400 italic font-serif">hidden</span><br />
              gems of India.
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              A travel discovery platform helping you find, compare, and book experiences at lesser-known local destinations — with verified hosts, real-time alerts, and offline access.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={login}
                className="h-14 text-lg rounded-full px-12 bg-emerald-500 hover:bg-emerald-600 shadow-xl border-0 transition-transform hover:scale-105"
              >
                Start Exploring
              </Button>
              <Link href="/register">
                <Button
                  variant="outline"
                  className="h-14 text-lg rounded-full px-10 bg-white/10 backdrop-blur-sm text-white border-white/40 hover:bg-white/20"
                >
                  Register as Host
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 pt-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 5,000+ travellers</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> 200+ hidden destinations</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Verified hosts</span>
            </div>
          </div>
        </main>
      </div>

      {/* Hidden Gems Gallery */}
      <section className="py-20 px-6 bg-gradient-to-b from-emerald-50 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Hidden Gems</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Destinations You Won't Find in Guidebooks</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Explore villages, valleys, and coastlines that most tourists never discover.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HIDDEN_GEMS.map((gem) => {
              const place = PLACES.find((p) => p.id === gem.id);
              if (!place) return null;
              return (
                <button
                  key={gem.id}
                  onClick={login}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <PlaceImage
                    place={place}
                    width={800}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-medium">{gem.tag}</span>
                    <h3 className="text-white font-bold text-sm mt-1 drop-shadow-sm">{place.name}</h3>
                    <p className="text-white/70 text-xs">{place.region}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Platform Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything you need to travel confidently</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="bg-card p-6 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feat.color}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-emerald-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Three steps to your next adventure</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Discover", desc: "Browse lesser-known destinations filtered by interests, budget, and travel style.", icon: Map },
              { step: "02", title: "Compare", desc: "View real-time conditions, reviews, and route times to choose the best destination.", icon: Route },
              { step: "03", title: "Book", desc: "Reserve homestays and experiences directly with verified local hosts and guides.", icon: Calendar },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-emerald-600 font-bold text-sm mb-1">Step {item.step}</p>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"
            alt="Travel adventure"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-emerald-900/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to discover something new?</h2>
          <p className="text-white/80 text-lg mb-8">Join thousands of travellers exploring India's hidden destinations.</p>
          <Button
            onClick={login}
            className="h-14 text-lg rounded-full px-12 bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl border-0 font-semibold transition-transform hover:scale-105"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-muted/30 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold text-foreground">LocalDiscover India</span>
        </div>
        <p>Your local tourism & travel discovery platform 🇮🇳</p>
      </footer>
    </div>
  );
}
