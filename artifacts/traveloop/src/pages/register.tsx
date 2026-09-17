import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, MapPin, Star, Shield, Camera, CheckCircle, AlertCircle, Mail, Lock, User } from "lucide-react";

const FEATURES = [
  { icon: MapPin, title: "Hidden Destinations", desc: "Lesser-known villages, valleys and coastlines across India", color: "text-emerald-600 bg-emerald-100" },
  { icon: Star, title: "Trusted Reviews", desc: "Verified ratings for destinations, homestays and local guides", color: "text-amber-500 bg-amber-100" },
  { icon: Shield, title: "Live Conditions", desc: "Weather, safety, crowd and connectivity before you travel", color: "text-blue-600 bg-blue-100" },
  { icon: Camera, title: "Offline Ready", desc: "Save places, maps and contacts for low-signal areas", color: "text-purple-600 bg-purple-100" },
];

const DESTINATIONS = [
  { name: "Spiti Valley", state: "Himachal Pradesh", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75" },
  { name: "Mawlynnong", state: "Meghalaya", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=75" },
  { name: "Gandikota", state: "Andhra Pradesh", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=75" },
  { name: "Gokarna", state: "Karnataka", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=75" },
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
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Registration failed");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur-sm">
        <Link href="/">
          <div className="flex cursor-pointer items-center gap-2 text-emerald-600">
            <Compass className="h-7 w-7" />
            <span className="text-xl font-bold">LocalDiscover</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">Already have an account?</span>
          <Link href="/login">
            <Button variant="outline" className="cursor-pointer rounded-full border-emerald-300 px-6 text-emerald-700 hover:bg-emerald-50">
              Log in
            </Button>
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center">
        {/* Form */}
        <div className="mx-auto w-full max-w-md space-y-7">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              <MapPin className="h-3 w-3" /> Start exploring
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground">
              Discover lesser-known local destinations, compare hosts and guides, and travel with
              real-time information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="First name"
                    className="h-11 rounded-xl pl-10"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  className="h-11 rounded-xl"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-xl pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className="h-11 rounded-xl pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <Button
              disabled={loading}
              type="submit"
              className="h-11 w-full rounded-xl border-0 bg-emerald-500 text-white hover:bg-emerald-600"
            >
              {loading ? "Creating account…" : "Create free account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link href="/login">
              <span className="cursor-pointer font-semibold text-emerald-600 hover:underline">Log in</span>
            </Link>
          </p>
        </div>

        {/* Visual */}
        <div className="hidden space-y-6 lg:block">
          <div className="grid grid-cols-2 gap-3">
            {DESTINATIONS.map((d) => (
              <div key={d.name} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
                <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="text-sm font-bold leading-tight text-white">{d.name}</p>
                  <p className="flex items-center gap-0.5 text-[10px] text-white/70">
                    <MapPin className="h-2.5 w-2.5" />
                    {d.state}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
