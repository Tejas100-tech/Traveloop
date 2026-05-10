import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, MapPin, Star, Shield, Zap, CheckCircle, AlertCircle, Mail, Lock, User } from "lucide-react";

const FEATURES = [
  { icon: MapPin, title: "Plan India Trips", desc: "Build multi-city itineraries across 50+ Indian destinations", color: "text-orange-500 bg-orange-100" },
  { icon: Star, title: "Activity Templates", desc: "Pre-loaded activities with ₹ costs for every major Indian city", color: "text-amber-500 bg-amber-100" },
  { icon: Shield, title: "Budget in INR", desc: "Track spending in Indian Rupees with city-wise breakdowns", color: "text-green-600 bg-green-100" },
  { icon: Zap, title: "AI Voice Assistant", desc: "Ask our India travel assistant for tips, costs, and recommendations", color: "text-blue-600 bg-blue-100" },
];

const DESTINATIONS = [
  { name: "Taj Mahal", state: "Uttar Pradesh", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=75" },
  { name: "Jaipur", state: "Rajasthan", img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=75" },
  { name: "Kerala", state: "God's Own Country", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=75" },
  { name: "Goa", state: "Beach Paradise", img: "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=400&q=75" },
];

export default function Register() {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!formData.email || !formData.password || formData.password.length < 6) {
      setErrorMsg("Please provide a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Registration failed");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 text-orange-500 cursor-pointer">
            <Compass className="w-7 h-7" />
            <span className="text-xl font-bold">Traveloop</span>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">India</span>
          </div>
        </Link>
        <Link href="/login">
          <Button
            variant="outline"
            className="rounded-full px-6 border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer"
          >
            Sign In
          </Button>
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
            🇮🇳 Free for Indian Travelers
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Plan your perfect<br />
            <span className="text-orange-500">India adventure</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Join thousands of travelers using Traveloop to plan multi-city Indian trips — with ₹ budgets, activity templates, and an AI travel assistant.
          </p>

          {/* Form */}
          <div className="max-w-md mx-auto bg-card border border-border p-6 rounded-2xl shadow-sm text-left mt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="firstName" className="pl-10" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="lastName" className="pl-10" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" required className="pl-10" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type="password" required className="pl-10" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <Button disabled={loading} type="submit" className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
                {loading ? "Creating account..." : "Create Free Account"}
              </Button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
            {["No credit card required", "100% free to use", "Instant access"].map(item => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" /> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Destination Preview */}
        <div>
          <p className="text-center text-sm text-muted-foreground font-medium uppercase tracking-wider mb-6">Explore 50+ Indian destinations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DESTINATIONS.map(dest => (
              <div key={dest.name} className="relative rounded-2xl overflow-hidden aspect-[3/4] group">
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white font-bold text-sm">{dest.name}</p>
                  <p className="text-white/70 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.state}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Everything you need to travel India</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
