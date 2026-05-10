import { Button } from "@/components/ui/button";
import { Compass, Map, Plane, Calendar, Star, Users, Shield } from "lucide-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Link } from "wouter";

const INDIA_DESTINATIONS = [
  {
    name: "Taj Mahal, Agra",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
    tag: "UNESCO Heritage",
  },
  {
    name: "Jaipur, Rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    tag: "Pink City",
  },
  {
    name: "Kerala Backwaters",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
    tag: "God's Own Country",
  },
  {
    name: "Goa Beaches",
    image: "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=600&q=80",
    tag: "Sun & Sand",
  },
  {
    name: "Varanasi Ghats",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80",
    tag: "Spiritual Capital",
  },
  {
    name: "Mumbai Skyline",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80",
    tag: "City of Dreams",
  },
];

export default function Landing() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* Hero section with full-screen image */}
      <div className="relative min-h-screen flex flex-col">
        {/* Hero background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=85"
            alt="India - Incredible landscapes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Header */}
        <header className="px-6 py-5 flex items-center justify-between z-10 relative">
          <div className="flex items-center gap-2 text-white">
            <Compass className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">Traveloop</span>
            <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">India</span>
          </div>
          <Link href="/login">
            <Button
              size="lg"
              className="font-medium rounded-full px-8 bg-white text-gray-900 hover:bg-orange-50 shadow-lg border-0"
            >
              Log in
            </Button>
          </Link>
        </header>

        {/* Hero content */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative pb-20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-400/30 text-orange-200 px-4 py-2 rounded-full text-sm font-medium mb-2">
              <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
              Explore Incredible India
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
              Plan your <span className="text-orange-400 italic font-serif">Indian</span><br />
              adventure here.
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              From the Himalayas to the beaches of Goa — Traveloop is your all-in-one command center for multi-city itineraries, budgets, and packing lists across India.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={login}
                className="h-14 text-lg rounded-full px-12 bg-orange-500 hover:bg-orange-600 shadow-xl border-0 transition-transform hover:scale-105"
              >
                Start Planning Now
              </Button>
              <Button
                onClick={login}
                variant="outline"
                className="h-14 text-lg rounded-full px-10 bg-white/10 backdrop-blur-sm text-white border-white/40 hover:bg-white/20"
              >
                Explore Destinations
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 pt-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 10,000+ travelers</span>
              <span className="flex items-center gap-1.5"><Map className="w-4 h-4" /> 50+ Indian cities</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Free to use</span>
            </div>
          </div>
        </main>
      </div>

      {/* Destination Gallery */}
      <section className="py-20 px-6 bg-gradient-to-b from-amber-50 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">Explore India</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Iconic Destinations Await</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">From ancient temples to pristine beaches, plan your perfect journey across the subcontinent.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INDIA_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                onClick={login}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-medium">{dest.tag}</span>
                  <h3 className="text-white font-bold text-sm mt-1 drop-shadow-sm">{dest.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2">Everything you need</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Travel smarter across India</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 mb-6">
                <Map className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-City Itineraries</h3>
              <p className="text-muted-foreground leading-relaxed">Plan the Golden Triangle, Kerala circuit, or your own custom route. Every stop perfectly organized.</p>
            </div>
            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mb-6">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Budgeting</h3>
              <p className="text-muted-foreground leading-relaxed">Track your INR spending city by city. Get cost estimates based on real traveler data.</p>
            </div>
            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                <Plane className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">Share the Journey</h3>
              <p className="text-muted-foreground leading-relaxed">Generate a beautiful public link to share your meticulously planned Indian itinerary with friends and family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519302959554-a75be0afc082?w=1400&q=80"
            alt="India travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-orange-900/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to explore India?</h2>
          <p className="text-white/80 text-lg mb-8">Join thousands of travelers planning unforgettable Indian journeys.</p>
          <Button
            onClick={login}
            className="h-14 text-lg rounded-full px-12 bg-white text-orange-700 hover:bg-orange-50 shadow-xl border-0 font-semibold transition-transform hover:scale-105"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-muted/30 text-center text-muted-foreground text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-foreground">Traveloop India</span>
        </div>
        <p>Your complete travel planning companion for Incredible India 🇮🇳</p>
      </footer>
    </div>
  );
}
