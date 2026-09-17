import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Calendar,
  Check,
  CheckCheck,
  CloudRain,
  MapPin,
  Settings,
  Sun,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLACES, placeStatus } from "@/data/places";

type NotifType = "weather" | "safety" | "crowd" | "event";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  location: string;
  time: string;
}

const TYPE_META: Record<NotifType, { icon: React.ElementType; color: string }> = {
  weather: { icon: CloudRain, color: "text-blue-500 bg-blue-100" },
  safety: { icon: AlertTriangle, color: "text-orange-500 bg-orange-100" },
  crowd: { icon: Users, color: "text-emerald-500 bg-emerald-100" },
  event: { icon: Calendar, color: "text-purple-500 bg-purple-100" },
};

const TIME_LABELS = ["2 hours ago", "5 hours ago", "1 day ago", "2 days ago", "3 days ago", "4 days ago"];

const FILTERS: { id: NotifType | "all"; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "weather", label: "Weather", icon: CloudRain },
  { id: "safety", label: "Safety", icon: AlertTriangle },
  { id: "crowd", label: "Crowd", icon: Users },
  { id: "event", label: "Events", icon: Calendar },
];

/** Builds a feed from the real place catalogue so alerts always match a destination. */
function buildFeed(): Notification[] {
  const feed: Notification[] = [];
  let i = 0;

  for (const place of PLACES) {
    const status = placeStatus(place);

    for (const alert of status.alerts) {
      feed.push({
        id: `${place.id}-alert-${i}`,
        type: alert.type === "event" ? "event" : alert.type,
        title: alert.type === "safety" ? "Safety advisory" : alert.type === "event" ? "Local event" : "Weather warning",
        message: alert.text,
        location: `${place.name}, ${place.region}`,
        time: TIME_LABELS[i % TIME_LABELS.length],
      });
      i++;
    }

    // Surface the notable non-alert conditions too.
    if (status.crowd.level === "low") {
      feed.push({
        id: `${place.id}-crowd`,
        type: "crowd",
        title: "Quiet right now",
        message: `${place.name} is currently uncrowded (${status.crowd.estimate}). A good window to visit.`,
        location: `${place.name}, ${place.region}`,
        time: TIME_LABELS[i++ % TIME_LABELS.length],
      });
    }

    if (status.weather.condition === "sunny" && status.safety.score >= 8) {
      feed.push({
        id: `${place.id}-clear`,
        type: "weather",
        title: "Clear conditions",
        message: `${status.weather.temp} and clear at ${place.name}. Visibility ${status.weather.visibility}.`,
        location: `${place.name}, ${place.region}`,
        time: TIME_LABELS[i++ % TIME_LABELS.length],
      });
    }
  }

  return feed.slice(0, 24);
}

export default function Notifications() {
  const [filter, setFilter] = useState<NotifType | "all">("all");
  const [prefs, setPrefs] = useState<Record<NotifType, boolean>>({
    weather: true,
    safety: true,
    crowd: true,
    event: true,
  });
  const [showSettings, setShowSettings] = useState(false);

  const all = useMemo(buildFeed, []);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [read, setRead] = useState<Set<string>>(new Set());

  const visible = all.filter((n) => !removed.has(n.id) && prefs[n.type]);
  const filtered = visible.filter((n) => filter === "all" || n.type === filter);
  const unreadCount = visible.filter((n) => !read.has(n.id)).length;

  const markRead = (id: string) =>
    setRead((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  const markAllRead = () => setRead(new Set(visible.map((n) => n.id)));

  const remove = (id: string) =>
    setRemoved((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "All caught up"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg" onClick={markAllRead}>
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-lg"
            onClick={() => setShowSettings((v) => !v)}
          >
            <Settings className="h-3.5 w-3.5" /> Settings
          </Button>
        </div>
      </div>

      {showSettings && (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Alert preferences</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(
              [
                { key: "weather", label: "Weather alerts", desc: "Rain, temperature, visibility" },
                { key: "safety", label: "Safety alerts", desc: "Road closures, wildlife, advisories" },
                { key: "crowd", label: "Crowd updates", desc: "Visitor density at destinations" },
                { key: "event", label: "Local events", desc: "Festivals, walks, activities" },
              ] as const
            ).map((p) => {
              const on = prefs[p.key];
              return (
                <button
                  key={p.key}
                  onClick={() => setPrefs((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                    on ? "border-emerald-300 bg-emerald-50" : "border-border bg-muted/50"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                      on ? "border-emerald-500 bg-emerald-500" : "border-muted-foreground/30"
                    }`}
                  >
                    {on && <Check className="h-3 w-3 text-white" />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{p.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{p.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
              filter === f.id ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <f.icon className="h-3.5 w-3.5" /> {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((n) => {
          const meta = TYPE_META[n.type];
          const Icon = meta.icon;
          const isRead = read.has(n.id);
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex w-full gap-4 rounded-2xl border bg-card p-4 text-left transition-all hover:shadow-sm ${
                isRead ? "border-border" : "border-emerald-200 bg-emerald-50/30"
              }`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold ${isRead ? "" : "text-emerald-900"}`}>{n.title}</h3>
                  {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.message}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {n.location}
                  </span>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
              </div>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  remove(n.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                    remove(n.id);
                  }
                }}
                className="shrink-0 self-start rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <BellOff className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-medium">No notifications</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {filter === "all" ? "You're all caught up." : `No ${filter} alerts right now.`}
          </p>
        </div>
      )}

      {unreadCount === 0 && filtered.length > 0 && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Sun className="h-3.5 w-3.5" /> Everything reviewed
        </p>
      )}
    </div>
  );
}
