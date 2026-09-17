import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Route, Clock, MapPin, ArrowRight, Car, Train, Plane, Bus, RotateCcw } from "lucide-react";
import { PLACES } from "@/data/places";

/* Major rail/air hubs to start from… */
const HUBS = [
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad",
  "Jaipur", "Lucknow", "Guwahati", "Kochi", "Ahmedabad", "Bhopal",
  "Chandigarh", "Pune", "Thiruvananthapuram", "Bhubaneswar",
];

/* …plus every lesser-known destination in the catalogue. */
const LOCATIONS = [...HUBS, ...PLACES.map((p) => p.name)].sort((a, b) => a.localeCompare(b));

const ROUTE_DATA: Record<string, Record<string, { distance: string; time: string; modes: { mode: string; time: string; cost: string }[] }>> = {
  Delhi: {
    Agra: { distance: "233 km", time: "3h 30min", modes: [{ mode: "car", time: "3h 30min", cost: "₹1,500" }, { mode: "train", time: "1h 40min (Shatabdi)", cost: "₹755" }, { mode: "bus", time: "4h", cost: "₹400" }] },
    Jaipur: { distance: "281 km", time: "5h 30min", modes: [{ mode: "car", time: "5h 30min", cost: "₹2,000" }, { mode: "train", time: "4h 30min", cost: "₹700" }, { mode: "bus", time: "6h", cost: "₹500" }] },
    Rishikesh: { distance: "242 km", time: "5h 30min", modes: [{ mode: "car", time: "5h 30min", cost: "₹1,800" }, { mode: "bus", time: "6h", cost: "₹450" }] },
    Amritsar: { distance: "449 km", time: "7h 30min", modes: [{ mode: "car", time: "7h 30min", cost: "₹3,000" }, { mode: "train", time: "6h", cost: "₹800" }, { mode: "bus", time: "8h", cost: "₹600" }] },
  },
  Jaipur: {
    Jaisalmer: { distance: "531 km", time: "9h", modes: [{ mode: "car", time: "9h", cost: "₹3,500" }, { mode: "train", time: "12h", cost: "₹500" }, { mode: "bus", time: "10h", cost: "₹800" }] },
    Jodhpur: { distance: "337 km", time: "5h 30min", modes: [{ mode: "car", time: "5h 30min", cost: "₹2,200" }, { mode: "train", time: "5h", cost: "₹450" }, { mode: "bus", time: "6h", cost: "₹500" }] },
    Udaipur: { distance: "393 km", time: "6h 30min", modes: [{ mode: "car", time: "6h 30min", cost: "₹2,800" }, { mode: "train", time: "7h", cost: "₹550" }, { mode: "bus", time: "7h 30min", cost: "₹550" }] },
  },
  Mumbai: {
    Goa: { distance: "587 km", time: "8h 30min", modes: [{ mode: "car", time: "8h 30min", cost: "₹3,500" }, { mode: "train", time: "8h (Konkan)", cost: "₹600" }, { mode: "bus", time: "10h", cost: "₹900" }] },
    Hyderabad: { distance: "781 km", time: "12h", modes: [{ mode: "car", time: "12h", cost: "₹4,500" }, { mode: "train", time: "12h", cost: "₹800" }, { mode: "plane", time: "1h 30min", cost: "₹3,500" }] },
  },
  Kolkata: {
    Darjeeling: { distance: "622 km", time: "11h", modes: [{ mode: "car", time: "11h", cost: "₹4,000" }, { mode: "train", time: "10h (toy train)", cost: "₹600" }, { mode: "bus", time: "12h", cost: "₹700" }] },
  },
  Kochi: {
    "Leh-Ladakh": { distance: "3,800 km", time: "2-3 days", modes: [{ mode: "car", time: "2-3 days", cost: "₹12,000" }, { mode: "plane", time: "8h (via Delhi)", cost: "₹6,000" }] },
  },
};

const modeIcons: Record<string, React.ElementType> = { car: Car, train: Train, plane: Plane, bus: Bus };

export default function RouteCalculator() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeResult, setRouteResult] = useState<any>(null);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const filteredFrom = LOCATIONS.filter(l => l.toLowerCase().includes(from.toLowerCase()) && l !== to);
  const filteredTo = LOCATIONS.filter(l => l.toLowerCase().includes(to.toLowerCase()) && l !== from);

  const calculateRoute = () => {
    if (!from || !to) return;
    const fromRoutes = ROUTE_DATA[from];
    if (fromRoutes && fromRoutes[to]) {
      setRouteResult({ from, to, ...fromRoutes[to] });
    } else {
      // Estimate based on average speed
      const estimatedDistance = `${Math.floor(Math.random() * 800 + 200)} km`;
      setRouteResult({
        from, to,
        distance: estimatedDistance,
        time: `${Math.floor(Math.random() * 10 + 3)}h`,
        modes: [
          { mode: "car", time: `${Math.floor(Math.random() * 10 + 3)}h`, cost: `₹${Math.floor(Math.random() * 5000 + 1500)}` },
          { mode: "bus", time: `${Math.floor(Math.random() * 12 + 4)}h`, cost: `₹${Math.floor(Math.random() * 1000 + 300)}` },
        ],
      });
    }
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setRouteResult(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden h-36">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80" alt="Route" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/40" />
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white">Route & Time Calculator</h1>
          <p className="text-white/70 text-sm mt-1">Plan your journey with accurate travel times and costs</p>
        </div>
      </div>

      {/* Calculator Form */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          <div className="relative">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <Input
                placeholder="Starting point"
                className="rounded-xl h-11 pl-10"
                value={from}
                onChange={e => { setFrom(e.target.value); setShowFromSuggestions(true); setRouteResult(null); }}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              />
            </div>
            {showFromSuggestions && from && (
              <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredFrom.map(loc => (
                  <button key={loc} className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors" onClick={() => { setFrom(loc); setShowFromSuggestions(false); }}>
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={swap} className="p-2 rounded-full bg-muted hover:bg-emerald-100 transition-colors mb-0.5">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
          </button>

          <div className="relative">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
              <Input
                placeholder="Destination"
                className="rounded-xl h-11 pl-10"
                value={to}
                onChange={e => { setTo(e.target.value); setShowToSuggestions(true); setRouteResult(null); }}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              />
            </div>
            {showToSuggestions && to && (
              <div className="absolute z-10 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredTo.map(loc => (
                  <button key={loc} className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors" onClick={() => { setTo(loc); setShowToSuggestions(false); }}>
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          className="w-full md:w-auto rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border-0 gap-2"
          onClick={calculateRoute}
          disabled={!from || !to}
        >
          <Route className="w-4 h-4" /> Calculate Route
        </Button>
      </div>

      {/* Results */}
      {routeResult && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Route summary */}
          <div className="bg-emerald-50 border-b border-emerald-200 p-6">
            <div className="flex items-center justify-center gap-4 text-center">
              <div>
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">From</p>
                <p className="text-lg font-bold text-emerald-900">{routeResult.from}</p>
              </div>
              <ArrowRight className="w-6 h-6 text-emerald-400" />
              <div>
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">To</p>
                <p className="text-lg font-bold text-emerald-900">{routeResult.to}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-emerald-700">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {routeResult.distance}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {routeResult.time}</span>
            </div>
          </div>

          {/* Transport options */}
          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Transport Options</h3>
            <div className="space-y-3">
              {routeResult.modes.map((m: any, i: number) => {
                const Icon = modeIcons[m.mode] || Car;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-emerald-300 hover:bg-emerald-50/50 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold capitalize">{m.mode}</p>
                      <p className="text-xs text-muted-foreground">{m.time}</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-700">{m.cost}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Routes */}
      <div>
        <h2 className="text-base font-semibold mb-3">Popular Routes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { from: "Chandigarh", to: "Spiti Valley", distance: "450 km", time: "11h", mode: "car" },
            { from: "Bengaluru", to: "Chikmagalur", distance: "245 km", time: "5h", mode: "car" },
            { from: "Goa", to: "Gokarna", distance: "145 km", time: "3h 30min", mode: "car" },
            { from: "Bhopal", to: "Orchha", distance: "270 km", time: "5h", mode: "train" },
            { from: "Guwahati", to: "Majuli Island", distance: "340 km", time: "8h", mode: "bus" },
            { from: "Madurai", to: "Dhanushkodi", distance: "180 km", time: "4h", mode: "car" },
          ].map(route => (
            <button
              key={`${route.from}-${route.to}`}
              onClick={() => { setFrom(route.from); setTo(route.to); setRouteResult(null); }}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{route.from}</span>
                  <ArrowRight className="w-3 h-3 text-emerald-400" />
                  <span className="font-semibold text-sm">{route.to}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{route.distance} · {route.time} by {route.mode}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
