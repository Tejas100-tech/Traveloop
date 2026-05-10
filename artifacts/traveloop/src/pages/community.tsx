import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@workspace/replit-auth-web";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MessageSquarePlus, Trash2, MapPin, Calendar, Users, X, ChevronDown, ChevronUp } from "lucide-react";

const API = import.meta.env.BASE_URL.replace(/\/$/, "");

const TRAVEL_STYLES = ["Solo", "Couple", "Family", "Friends Group", "Business", "Backpacker", "Luxury"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              n <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, currentUserId, onDelete }: { review: any; currentUserId?: string; onDelete: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const isOwn = review.userId === currentUserId;
  const isLong = review.body.length > 220;
  const bodyText = expanded || !isLong ? review.body : review.body.slice(0, 220) + "…";

  const timeAgo = (() => {
    const diff = Date.now() - new Date(review.createdAt).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  })();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {review.authorAvatar
            ? <img src={review.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
            : <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                {review.authorName?.[0]?.toUpperCase() || "T"}
              </div>
          }
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{review.authorName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StarRating value={review.rating} />
          {isOwn && (
            <button onClick={() => onDelete(review.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete review">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Trip info */}
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
          <MapPin className="w-3 h-3" />{review.cities}
        </span>
        {review.travelMonth && (
          <span className="flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
            <Calendar className="w-3 h-3" />{review.travelMonth}
          </span>
        )}
        {review.travelStyle && (
          <span className="flex items-center gap-1 bg-muted text-muted-foreground text-xs px-2.5 py-1 rounded-full">
            <Users className="w-3 h-3" />{review.travelStyle}
          </span>
        )}
      </div>

      {/* Content */}
      <div>
        <p className="font-semibold text-sm mb-1">{review.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{bodyText}</p>
        {isLong && (
          <button onClick={() => setExpanded(v => !v)} className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-1 hover:underline">
            {expanded ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read more</>}
          </button>
        )}
      </div>

      {/* Trip name footer */}
      <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-1">
        Trip: <span className="font-medium text-foreground">{review.tripName}</span>
      </p>
    </div>
  );
}

function WriteReviewModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    tripName: "",
    cities: "",
    rating: 0,
    title: "",
    body: "",
    travelMonth: "",
    travelStyle: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch(`${API}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Review posted!", description: "Thanks for sharing your experience." });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to post review", variant: "destructive" });
    },
  });

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.tripName && form.cities && form.rating > 0 && form.title && form.body.length >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-lg">Share Your Experience</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Help fellow travellers plan their India trip</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Trip Name *</label>
              <Input placeholder="e.g. Golden Triangle 2024" value={form.tripName} onChange={e => set("tripName", e.target.value)} className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Cities Visited *</label>
              <Input placeholder="e.g. Delhi, Agra, Jaipur" value={form.cities} onChange={e => set("cities", e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Travel Month</label>
              <select value={form.travelMonth} onChange={e => set("travelMonth", e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Travel Style</label>
              <select value={form.travelStyle} onChange={e => set("travelStyle", e.target.value)} className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select style</option>
                {TRAVEL_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Overall Rating *</label>
            <div className="flex items-center gap-3">
              <StarRating value={form.rating} onChange={v => set("rating", v)} />
              <span className="text-sm text-muted-foreground">
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][form.rating] || "Tap to rate"}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Review Title *</label>
            <Input placeholder="e.g. Unforgettable Rajasthan adventure!" value={form.title} onChange={e => set("title", e.target.value)} className="rounded-xl" maxLength={120} />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Your Review *</label>
            <Textarea
              placeholder="Share what you loved, tips for other travellers, must-eats, hidden gems, things you'd do differently..."
              value={form.body}
              onChange={e => set("body", e.target.value)}
              className="rounded-xl min-h-[120px] resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{form.body.length}/2000</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
            disabled={!valid || mutation.isPending}
            onClick={() => mutation.mutate(form)}
          >
            {mutation.isPending ? "Posting…" : "Post Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const RATING_LABELS: Record<number, string> = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [filterRating, setFilterRating] = useState(0);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/reviews`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load reviews");
      return res.json() as Promise<any[]>;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`${API}/api/reviews/${id}`, { method: "DELETE", credentials: "include" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast({ title: "Review deleted" });
    },
  });

  const filtered = reviews?.filter(r => filterRating === 0 || r.rating === filterRating) ?? [];
  const avgRating = reviews?.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1200&q=80" alt="India travel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/85 to-black/40" />
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-white">Traveller Community</h1>
          <p className="text-white/70 text-sm mt-1">Real experiences from real India travellers</p>
          {avgRating && reviews && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-4 h-4 ${n <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "fill-transparent text-white/40"}`} />
                ))}
              </div>
              <span className="text-white font-semibold text-sm">{avgRating}</span>
              <span className="text-white/60 text-sm">· {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4">
          <Button onClick={() => setShowForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2 shadow-lg">
            <MessageSquarePlus className="w-4 h-4" /> Write a Review
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground font-medium">Filter:</span>
        <button onClick={() => setFilterRating(0)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterRating === 0 ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
          All
        </button>
        {[5, 4, 3, 2, 1].map(n => (
          <button key={n} onClick={() => setFilterRating(f => f === n ? 0 : n)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterRating === n ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            <Star className="w-3 h-3 fill-current" /> {n} · {RATING_LABELS[n]}
          </button>
        ))}
      </div>

      {/* Reviews grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(r => (
            <ReviewCard
              key={r.id}
              review={r}
              currentUserId={user?.id}
              onDelete={id => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <MessageSquarePlus className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-medium">No reviews yet</p>
          <p className="text-xs text-muted-foreground mt-1">Be the first to share your India travel experience!</p>
          <Button onClick={() => setShowForm(true)} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2">
            <MessageSquarePlus className="w-4 h-4" /> Write a Review
          </Button>
        </div>
      )}

      {showForm && <WriteReviewModal onClose={() => setShowForm(false)} />}
    </div>
  );
}
