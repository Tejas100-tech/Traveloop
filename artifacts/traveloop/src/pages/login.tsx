import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@workspace/replit-auth-web";
import { Compass, Eye, EyeOff, Mail, Lock, AlertCircle, MapPin, Star } from "lucide-react";

const HIGHLIGHTS = [
  { icon: "🏔️", text: "Plan multi-city Himalaya treks" },
  { icon: "🏖️", text: "Organize Goa beach itineraries" },
  { icon: "🕌", text: "Explore Rajasthan heritage circuits" },
  { icon: "🌿", text: "Build Kerala backwater journeys" },
];

const DESTINATIONS = [
  { name: "Taj Mahal", state: "Agra", img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=75" },
  { name: "Golden Temple", state: "Amritsar", img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&q=75" },
  { name: "Goa Beaches", state: "Goa", img: "https://images.unsplash.com/photo-1607823489283-1deb240f9e27?w=400&q=75" },
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
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [forgotSent, setForgotSent] = useState(false);

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
    if (Object.keys(errs).length === 0) {
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          window.location.href = "/";
        } else {
          const data = await res.json();
          setErrorMsg(data.error || "Login failed");
        }
      } catch (err) {
        setErrorMsg("Network error. Please try again.");
      }
    }
  }

  function handleForgotPassword(e: React.MouseEvent) {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 text-orange-500 cursor-pointer">
            <Compass className="w-7 h-7" />
            <span className="text-xl font-bold">Traveloop</span>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">India</span>
          </div>
        </Link>
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register">
            <span className="text-orange-500 font-semibold hover:underline cursor-pointer">Sign up free</span>
          </Link>
        </p>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left panel — form */}
        <div className="flex flex-col justify-center w-full lg:w-1/2 px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-md w-full mx-auto space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold mb-1">
                <MapPin className="w-3 h-3" /> Welcome back, traveler
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Sign in to Traveloop</h1>
              <p className="text-muted-foreground text-sm">Continue planning your India adventures.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
                    className={`pl-10 h-11 rounded-xl border transition-colors ${
                      touched.email && errors.email
                        ? "border-red-400 focus-visible:ring-red-300"
                        : "border-border focus-visible:ring-orange-200"
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
                    className={`pl-10 pr-10 h-11 rounded-xl border transition-colors ${
                      touched.password && errors.password
                        ? "border-red-400 focus-visible:ring-red-300"
                        : "border-border focus-visible:ring-orange-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot password notice */}
              {forgotSent && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                  <Star className="w-4 h-4 text-green-500 shrink-0" />
                  Password reset is handled securely through our login provider. Click the login button to continue.
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 border-0 text-white font-semibold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Log in to Traveloop
              </Button>
            </form>



            {/* Signup link */}
            <p className="text-center text-sm text-muted-foreground">
              New to Traveloop?{" "}
              <Link href="/register">
                <span className="text-orange-500 font-semibold hover:underline cursor-pointer">Create a free account</span>
              </Link>
            </p>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-5 pt-2">
              {["Free to use", "Secure login", "No credit card"].map((badge) => (
                <span key={badge} className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — visual (hidden on small screens) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=85"
            alt="India travel"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/70 via-orange-800/50 to-black/60" />

          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            {/* Top quote */}
            <div className="space-y-1">
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest">India awaits</p>
              <h2 className="text-3xl font-bold text-white leading-tight max-w-xs">
                Your journey through <span className="text-orange-300">Incredible India</span> starts here.
              </h2>
            </div>

            {/* Destination cards */}
            <div className="space-y-4">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Popular destinations</p>
              <div className="grid grid-cols-3 gap-2">
                {DESTINATIONS.map((d) => (
                  <div key={d.name} className="relative rounded-xl overflow-hidden aspect-[3/4] shadow-lg">
                    <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <p className="text-white text-xs font-bold leading-tight">{d.name}</p>
                      <p className="text-white/60 text-[10px] flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5" />{d.state}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2.5">
              {HIGHLIGHTS.map((h) => (
                <div key={h.text} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5">
                  <span className="text-lg">{h.icon}</span>
                  <span className="text-white text-sm font-medium">{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
