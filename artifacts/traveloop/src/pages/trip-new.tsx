import { useCreateTrip, getListTripsQueryKey, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { TripForm, TripFormValues } from "./trip-form";
import {
  ArrowLeft, MapPin, Plane, Route, IndianRupee, Share2,
  CheckCircle,
} from "lucide-react";

const TRIP_TIPS = [
  { icon: Route, title: "Add city stops", desc: "Break your trip into stops — Agra → Jaipur → Delhi, for example." },
  { icon: IndianRupee, title: "Set a ₹ budget", desc: "Track spending per city and stay within your total budget." },
  { icon: MapPin, title: "Assign activities", desc: "Pick from pre-loaded Indian activity templates for each stop." },
  { icon: Share2, title: "Share your plan", desc: "Make it public to share a beautiful link with family & friends." },
];

const INSPIRATION = [
  { name: "Golden Triangle", cities: "Delhi · Agra · Jaipur", days: "7–10 days", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80" },
  { name: "Kerala Circuit", cities: "Kochi · Munnar · Alleppey", days: "5–8 days", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80" },
  { name: "Rajasthan Royal", cities: "Jaipur · Jodhpur · Udaipur", days: "8–12 days", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&q=80" },
];

export default function TripNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createTrip = useCreateTrip();

  function handleSubmit(values: TripFormValues) {
    createTrip.mutate({
      data: {
        name: values.name,
        description: values.description,
        coverPhoto: values.coverPhoto || undefined,
        startDate: values.startDate,
        endDate: values.endDate,
        totalBudget: values.totalBudget,
        isPublic: values.isPublic,
      },
    }, {
      onSuccess: (trip) => {
        queryClient.invalidateQueries({ queryKey: getListTripsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
        toast({ title: "Trip created!", description: "Now add your city stops." });
        setLocation(`/trips/${trip.id}`);
      },
      onError: () => toast({ title: "Error", description: "Could not create trip.", variant: "destructive" }),
    });
  }

  return (
    <div className="min-h-full flex flex-col lg:flex-row">

      {/* Left — form panel */}
      <div className="flex-1 p-6 md:p-8 lg:p-10 max-w-2xl mx-auto w-full lg:mx-0">

        {/* Back + Header */}
        <div className="mb-7">
          <Link href="/trips" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to trips
          </Link>

          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <Plane className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">Plan New Trip</h1>
              <p className="text-muted-foreground text-sm">Fill in the basics — add cities and activities next.</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <TripForm
            onSubmit={handleSubmit}
            isPending={createTrip.isPending}
            submitLabel="Create Trip"
            onCancel={() => setLocation("/trips")}
          />
        </div>

        {/* What happens next */}
        <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> What happens after you save
          </p>
          <div className="space-y-2.5">
            {TRIP_TIPS.map((tip) => (
              <div key={tip.title} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                  <tip.icon className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{tip.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — inspiration panel (desktop only) */}
      <div className="hidden lg:flex lg:w-96 xl:w-[420px] shrink-0 bg-muted/30 border-l border-border flex-col p-8 gap-7">

        {/* Header */}
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">Inspiration</p>
          <h2 className="text-lg font-bold text-foreground">Popular India Routes</h2>
          <p className="text-sm text-muted-foreground mt-1">Use these as a starting point for your adventure.</p>
        </div>

        {/* Route cards */}
        <div className="space-y-3">
          {INSPIRATION.map((route) => (
            <div key={route.name} className="group relative rounded-2xl overflow-hidden h-28 shadow-sm cursor-default">
              <img src={route.img} alt={route.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-center">
                <p className="text-white font-bold text-base leading-tight">{route.name}</p>
                <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{route.cities}
                </p>
                <span className="mt-1.5 inline-block text-[10px] bg-orange-500/80 text-white px-2 py-0.5 rounded-full font-medium w-fit">
                  {route.days}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 mt-auto">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick tips</p>
          {[
            "🏛️ Book heritage sites 2–3 days in advance",
            "🌡️ Oct–Mar is the best time to travel most of India",
            "🚄 Rajdhani Express connects major cities cheaply",
            "💰 Budget ₹2,000–4,000/day for comfortable travel",
          ].map((tip) => (
            <p key={tip} className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
          ))}
        </div>

      </div>
    </div>
  );
}
