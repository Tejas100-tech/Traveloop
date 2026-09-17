import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Compass, Eye, EyeOff, Lock, Mail, MapPin, Shield, Star } from "lucide-react";

const HIGHLIGHTS = [
  { icon: MapPin, text: "Discover villages and valleys off the tourist trail" },
  { icon: Star, text: "Compare verified homestays and local guides" },
  { icon: Shield, text: "Live weather, safety and connectivity alerts" },
];

const DESTINATIONS = [
  { name: "Spiti Valley", state: "Himachal", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75" },
  { name: "Hampi", state: "Karnataka", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=75" },
  { name: "Gokarna", state: "Karnataka", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=75" },
];

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errorMsg, setErrorMsg] = useState("");

  function handleBlur(field: "email" | "password") {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(email, password));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(email, password);
    setTouched({ email: true, password: true });
    setErrors(errs);
    setErrorMsg("");
    if (Object.keys(errs).length > 0) return;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Login failed");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/90 px-6 py-4 backdrop-blur-sm">
        <Link href="/">
          <div className="flex cursor-pointer items-center gap-2 text-emerald-600">
            <Compass className="h-7 w-7" />
            <span className="text-xl font-bold">LocalDiscover</span>
          </div>
        </Link>
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register">
            <span className="cursor-pointer font-semibold text-emerald-600 hover:underline">
              Create an account
            </span>
          </Link>
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                <MapPin className="h-3 w-3" /> Welcome back, traveller
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Sign in to LocalDiscover</h1>
              <p className="text-sm text-muted-foreground">
                Pick up where you left off exploring India's hidden places.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) setErrors(validate(e.target.value, password));
                    }}
                    onBlur={() => handleBlur("email")}
                    className={`h-11 rounded-xl border pl-10 transition-colors ${
                      touched.email && errors.email
                        ? "border-red-400 focus-visible:ring-red-300"
                        : "border-border focus-visible:ring-emerald-200"
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) setErrors(validate(email, e.target.value));
                    }}
                    onBlur={() => handleBlur("password")}
                    className={`h-11 rounded-xl border pl-10 pr-10 transition-colors ${
                      touched.password && errors.password
                        ? "border-red-400 focus-visible:ring-red-300"
                        : "border-border focus-visible:ring-emerald-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" /> {errors.password}
                  </p>
                )}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <Button
                type="submit"
                className="h-11 w-full rounded-xl border-0 bg-emerald-500 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01] hover:bg-emerald-600 active:scale-[0.99]"
              >
                Log in
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              New to LocalDiscover?{" "}
              <Link href="/register">
                <span className="cursor-pointer font-semibold text-emerald-600 hover:underline">
                  Create a free account
                </span>
              </Link>
            </p>
          </div>
        </div>

        {/* Visual */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=85"
            alt="Indian landscapes"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-emerald-800/55 to-black/65" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12">
            <div className="space-y-1">
              <p className="text-sm font-medium uppercase tracking-widest text-white/60">Go further</p>
              <h2 className="max-w-xs text-3xl font-bold leading-tight text-white">
                Find the India that <span className="text-emerald-300">guidebooks miss</span>.
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Traveller favourites
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DESTINATIONS.map((d) => (
                  <div key={d.name} className="relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg">
                    <img src={d.img} alt={d.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <p className="text-xs font-bold leading-tight text-white">{d.name}</p>
                      <p className="flex items-center gap-0.5 text-[10px] text-white/60">
                        <MapPin className="h-2.5 w-2.5" />
                        {d.state}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {HIGHLIGHTS.map((h) => (
                <div key={h.text} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                  <h.icon className="h-4 w-4 shrink-0 text-emerald-300" />
                  <span className="text-sm font-medium text-white">{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
