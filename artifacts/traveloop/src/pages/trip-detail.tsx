import { useState, useCallback, useRef, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetTrip, getGetTripQueryKey,
  useCreateStop, useDeleteStop, useUpdateStop,
  useCreateActivity, useDeleteActivity, useUpdateActivity,
  useSearchCities, getSearchCitiesQueryKey,
  useListCityActivityTemplates, getListCityActivityTemplatesQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MapPin, Plus, Trash2, Calendar, Clock,
  ChevronLeft, Edit2, Share2, BarChart2, Package, BookOpen,
  PlusCircle, Globe, Sparkles, ChevronDown, ChevronUp, Zap,
  GripVertical, ArrowUp, ArrowDown, Check, X, Pencil, LayoutList
} from "lucide-react";
import { format, parseISO, isValid, eachDayOfInterval } from "date-fns";
import { NearbyPlacesPanel, hasNearbyPlaces } from "@/components/nearby-places";

/* ─── City autocomplete search ────────────────────────────────────────────── */
function CityAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search city...",
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (city: { name: string; country: string }) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const { data: results } = useSearchCities(
    { q: value },
    { query: { enabled: value.length >= 2, queryKey: getSearchCitiesQueryKey({ q: value }) } }
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={wrapRef}>
      <Input
        placeholder={placeholder}
        className="rounded-xl h-10"
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && results && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-popover border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {results.map((c: any) => (
            <button
              key={c.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2 transition-colors"
              onMouseDown={e => {
                e.preventDefault();
                onSelect({ name: c.name, country: c.country || "India" });
                setOpen(false);
              }}
            >
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium">{c.name}</span>
              {c.country && <span className="text-muted-foreground text-xs">{c.country}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Add Stop Dialog ──────────────────────────────────────────────────────── */
function AddStopDialog({ tripId, open, onClose, nextOrderIndex }: {
  tripId: number; open: boolean; onClose: () => void; nextOrderIndex: number;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createStop = useCreateStop();
  const [form, setForm] = useState({ cityName: "", country: "India", startDate: "", endDate: "" });

  function handle() {
    if (!form.cityName || !form.startDate || !form.endDate) {
      toast({ title: "Please fill city name and both dates", variant: "destructive" });
      return;
    }
    createStop.mutate(
      { tripId, data: { ...form, orderIndex: nextOrderIndex } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(tripId) });
          toast({ title: "Stop added!" });
          setForm({ cityName: "", country: "India", startDate: "", endDate: "" });
          onClose();
        },
        onError: () => toast({ title: "Failed to add stop", variant: "destructive" }),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" /> Add City Stop
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">City</label>
            <CityAutocomplete
              value={form.cityName}
              onChange={v => setForm(f => ({ ...f, cityName: v }))}
              onSelect={city => setForm(f => ({ ...f, cityName: city.name, country: city.country }))}
              placeholder="Search city (e.g. Jaipur)"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Country</label>
            <Input
              placeholder="Country"
              className="rounded-xl h-10"
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Arrival date</label>
              <Input type="date" className="rounded-xl h-10" value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Departure date</label>
              <Input type="date" className="rounded-xl h-10" value={form.endDate} min={form.startDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          {form.startDate && form.endDate && form.startDate <= form.endDate && (
            <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1} days in {form.cityName || "this city"}
            </p>
          )}
          <Button className="w-full rounded-xl h-11 bg-orange-500 hover:bg-orange-600 border-0" onClick={handle} disabled={createStop.isPending}>
            {createStop.isPending ? "Adding…" : "Add Stop"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Add / Edit Activity Dialog ───────────────────────────────────────────── */
function ActivityDialog({
  stopId, tripId, open, onClose, prefill, stopDateRange,
}: {
  stopId: number; tripId: number; open: boolean; onClose: () => void;
  prefill?: { id?: number; name: string; type: string; cost: string; duration: string; scheduledDate?: string };
  stopDateRange?: { start: string; end: string };
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();

  const isEdit = !!prefill?.id;
  const [form, setForm] = useState(() => ({
    name: prefill?.name ?? "",
    type: prefill?.type ?? "sightseeing",
    cost: prefill?.cost ?? "",
    duration: prefill?.duration ?? "",
    scheduledDate: prefill?.scheduledDate ?? "",
  }));

  const types = ["sightseeing", "food", "culture", "adventure", "shopping", "transport", "accommodation", "other"];

  function handle() {
    if (!form.name) { toast({ title: "Activity name is required", variant: "destructive" }); return; }
    const data = {
      name: form.name,
      type: form.type,
      cost: form.cost ? Number(form.cost) : undefined,
      duration: form.duration ? Number(form.duration) : undefined,
      scheduledDate: form.scheduledDate || undefined,
    };

    if (isEdit && prefill?.id) {
      updateActivity.mutate(
        { stopId, activityId: prefill.id, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(tripId) });
            toast({ title: "Activity updated!" });
            onClose();
          },
        }
      );
    } else {
      createActivity.mutate({ stopId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(tripId) });
          toast({ title: "Activity added!" });
          onClose();
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Activity" : "Add Activity"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Input placeholder="Activity name" className="rounded-xl h-10" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Type</label>
            <select
              className="w-full rounded-xl h-10 border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {types.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Cost (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                <Input type="number" placeholder="0" className="rounded-xl h-10 pl-7" value={form.cost}
                  onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Duration (min)</label>
              <Input type="number" placeholder="60" className="rounded-xl h-10" value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Scheduled date</label>
            <Input
              type="date"
              className="rounded-xl h-10"
              value={form.scheduledDate}
              min={stopDateRange?.start}
              max={stopDateRange?.end}
              onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
            />
            {stopDateRange && (
              <p className="text-xs text-muted-foreground mt-1">
                Between {format(parseISO(stopDateRange.start), "MMM d")} – {format(parseISO(stopDateRange.end), "MMM d")}
              </p>
            )}
          </div>
          <Button
            className="w-full rounded-xl h-11 bg-orange-500 hover:bg-orange-600 border-0"
            onClick={handle}
            disabled={createActivity.isPending || updateActivity.isPending}>
            {createActivity.isPending || updateActivity.isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Activity"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Suggested Activities ─────────────────────────────────────────────────── */
const typeColors: Record<string, string> = {
  sightseeing: "bg-primary/10 text-primary",
  food: "bg-orange-100 text-orange-600",
  culture: "bg-purple-100 text-purple-600",
  adventure: "bg-green-100 text-green-700",
  shopping: "bg-pink-100 text-pink-600",
  transport: "bg-blue-100 text-blue-600",
  accommodation: "bg-indigo-100 text-indigo-600",
  other: "bg-muted text-muted-foreground",
};

function SuggestedActivities({ cityName, stopId, tripId, stopDateRange }: {
  cityName: string; stopId: number; tripId: number;
  stopDateRange?: { start: string; end: string };
}) {
  const [expanded, setExpanded] = useState(false);
  const [prefillDialog, setPrefillDialog] = useState<{ name: string; type: string; cost: string; duration: string } | null>(null);

  const { data: cities } = useSearchCities(
    { q: cityName },
    { query: { enabled: expanded, queryKey: getSearchCitiesQueryKey({ q: cityName }) } }
  );
  const cityId = cities?.find((c: any) =>
    c.name.toLowerCase() === cityName.toLowerCase() || c.name.toLowerCase().includes(cityName.toLowerCase())
  )?.id;

  const { data: templates, isLoading } = useListCityActivityTemplates(
    cityId as any,
    { query: { enabled: !!cityId, queryKey: getListCityActivityTemplatesQueryKey(cityId as any) } }
  );

  return (
    <>
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium mt-2 px-1 transition-colors">
        <Sparkles className="w-3.5 h-3.5" />
        {expanded ? "Hide" : "Show"} suggested activities for {cityName}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="mt-2 bg-orange-50/60 border border-orange-100 rounded-xl p-3 space-y-2">
          <p className="text-xs font-semibold text-orange-700 flex items-center gap-1.5">
            <Zap className="w-3 h-3" /> Popular in {cityName} — click to prefill and add
          </p>
          {isLoading ? (
            <div className="space-y-1.5">{[1, 2, 3].map(i => <Skeleton key={i} className="h-12 rounded-lg" />)}</div>
          ) : templates && templates.length > 0 ? (
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {templates.map((tmpl: any) => (
                <div key={tmpl.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-orange-100 hover:border-orange-300 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-medium truncate">{tmpl.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${typeColors[tmpl.type] || typeColors.other}`}>{tmpl.type}</span>
                    </div>
                    <div className="flex gap-2 mt-0.5 text-xs text-muted-foreground">
                      {tmpl.cost != null && <span className="text-orange-600 font-medium">₹{Number(tmpl.cost).toLocaleString("en-IN")}</span>}
                      {tmpl.duration && <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{tmpl.duration}min</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => setPrefillDialog({ name: tmpl.name, type: tmpl.type, cost: tmpl.cost != null ? String(tmpl.cost) : "", duration: tmpl.duration ? String(tmpl.duration) : "" })}
                    className="shrink-0 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
                    + Add
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-2 text-center">No suggestions found for this city</p>
          )}
        </div>
      )}

      {prefillDialog && (
        <ActivityDialog
          tripId={tripId} stopId={stopId}
          open={!!prefillDialog} onClose={() => setPrefillDialog(null)}
          prefill={prefillDialog} stopDateRange={stopDateRange}
        />
      )}
    </>
  );
}

/* ─── Day-wise Activity List ───────────────────────────────────────────────── */
function DayWiseActivities({ activities, stop, tripId, onAddActivity }: {
  activities: any[];
  stop: any;
  tripId: number;
  onAddActivity: () => void;
}) {
  const queryClient = useQueryClient();
  const deleteActivity = useDeleteActivity();
  const [editActivity, setEditActivity] = useState<any | null>(null);

  const hasStart = stop.startDate && isValid(parseISO(stop.startDate));
  const hasEnd = stop.endDate && isValid(parseISO(stop.endDate));
  const stopDateRange = hasStart && hasEnd ? { start: stop.startDate, end: stop.endDate } : undefined;

  if (activities.length === 0) {
    return (
      <div className="text-xs text-muted-foreground py-1 px-1">
        No activities yet.
      </div>
    );
  }

  // Group by scheduledDate
  const dated: Record<string, any[]> = {};
  const undated: any[] = [];

  for (const act of activities) {
    if (act.scheduledDate && isValid(parseISO(act.scheduledDate))) {
      const key = act.scheduledDate.slice(0, 10);
      if (!dated[key]) dated[key] = [];
      dated[key].push(act);
    } else {
      undated.push(act);
    }
  }

  const sortedDays = Object.keys(dated).sort();

  function ActivityRow({ act }: { act: any }) {
    return (
      <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-3 py-2.5 group hover:bg-muted/60 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{act.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[act.type] || typeColors.other}`}>{act.type}</span>
          </div>
          <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
            {act.cost != null && <span className="text-orange-600 font-semibold">₹{Number(act.cost).toLocaleString("en-IN")}</span>}
            {act.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{act.duration}min</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => setEditActivity(act)}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteActivity.mutate(
              { stopId: stop.id, activityId: act.id },
              { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(tripId) }) }
            )}
            className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedDays.map(day => (
        <div key={day}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              {format(parseISO(day), "EEE, MMM d")}
            </span>
            <div className="flex-1 border-t border-orange-100" />
          </div>
          <div className="space-y-1.5">
            {dated[day].map((act: any) => <ActivityRow key={act.id} act={act} />)}
          </div>
        </div>
      ))}

      {undated.length > 0 && (
        <div>
          {sortedDays.length > 0 && (
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Unscheduled</span>
              <div className="flex-1 border-t border-border" />
            </div>
          )}
          <div className="space-y-1.5">
            {undated.map((act: any) => <ActivityRow key={act.id} act={act} />)}
          </div>
        </div>
      )}

      {editActivity && (
        <ActivityDialog
          tripId={tripId} stopId={stop.id}
          open={!!editActivity} onClose={() => setEditActivity(null)}
          prefill={{
            id: editActivity.id,
            name: editActivity.name,
            type: editActivity.type,
            cost: editActivity.cost != null ? String(editActivity.cost) : "",
            duration: editActivity.duration ? String(editActivity.duration) : "",
            scheduledDate: editActivity.scheduledDate?.slice(0, 10) ?? "",
          }}
          stopDateRange={stopDateRange}
        />
      )}
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function TripDetail() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = tripId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [addActivityStop, setAddActivityStop] = useState<{ stopId: number; dateRange?: { start: string; end: string } } | null>(null);
  const deleteStop = useDeleteStop();
  const updateStop = useUpdateStop();

  const { data: trip, isLoading } = useGetTrip(id, { query: { enabled: !!id, queryKey: getGetTripQueryKey(id) } });

  function copyShareLink() {
    if (!trip) return;
    const url = `${window.location.origin}/share/${trip.shareSlug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Share link copied!" });
  }

  function moveStop(stopId: number, direction: "up" | "down") {
    if (!trip?.stops) return;
    const stops = [...trip.stops].sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    const idx = stops.findIndex((s: any) => s.id === stopId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= stops.length) return;

    const current = stops[idx];
    const swap = stops[swapIdx];
    // Swap orderIndex values
    updateStop.mutate({ tripId: id, stopId: current.id, data: { orderIndex: swap.orderIndex } });
    updateStop.mutate({ tripId: id, stopId: swap.id, data: { orderIndex: current.orderIndex } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(id) }),
    });
  }

  if (isLoading) return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-4">
      <Skeleton className="h-10 w-64 rounded-xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
  if (!trip) return <div className="p-8 text-center text-muted-foreground">Trip not found.</div>;

  const start = trip.startDate ? parseISO(trip.startDate) : null;
  const end = trip.endDate ? parseISO(trip.endDate) : null;
  const days = start && end && isValid(start) && isValid(end)
    ? Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1
    : null;

  const totalCost = trip.stops?.reduce((sum: number, s: any) =>
    sum + (s.activities?.reduce((a: number, act: any) => a + (act.cost || 0), 0) || 0), 0) || 0;

  const stops = trip.stops ? [...trip.stops].sort((a: any, b: any) => a.orderIndex - b.orderIndex) : [];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button onClick={() => setLocation("/trips")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> My Trips
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
              {start && end && isValid(start) && isValid(end) && (
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{format(start, "MMM d")} – {format(end, "MMM d, yyyy")}</span>
              )}
              {days != null && <><span>·</span><span>{days} {days === 1 ? "day" : "days"}</span></>}
              {trip.totalBudget && <><span>·</span><span>Budget ₹{Number(trip.totalBudget).toLocaleString("en-IN")}</span></>}
              {totalCost > 0 && <><span>·</span><span className="text-orange-600 font-medium">Est. ₹{totalCost.toLocaleString("en-IN")}</span></>}
            </div>
            {trip.description && <p className="text-muted-foreground text-sm mt-2">{trip.description}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" className="rounded-xl gap-1.5 h-9" onClick={() => setLocation(`/trips/${id}/edit`)}>
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </Button>
            {trip.isPublic && (
              <Button size="sm" variant="outline" className="rounded-xl gap-1.5 h-9" onClick={copyShareLink}>
                <Share2 className="w-3.5 h-3.5" /> Share
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        <Link href={`/trips/${id}/itinerary`} className="bg-orange-500 text-white rounded-xl p-3 flex items-center gap-2.5 hover:bg-orange-600 shadow-sm shadow-orange-400/30 transition-all">
          <LayoutList className="w-4 h-4 shrink-0" />
          <span className="text-sm font-semibold">View Plan</span>
        </Link>
        <Link href={`/trips/${id}/budget`} className="bg-card border border-border rounded-xl p-3 flex items-center gap-2.5 hover:border-orange-300/50 hover:shadow-sm transition-all">
          <BarChart2 className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm font-medium">Budget</span>
        </Link>
        <Link href={`/trips/${id}/packing`} className="bg-card border border-border rounded-xl p-3 flex items-center gap-2.5 hover:border-orange-300/50 hover:shadow-sm transition-all">
          <Package className="w-4 h-4 text-secondary shrink-0" />
          <span className="text-sm font-medium">Packing</span>
        </Link>
        <Link href={`/trips/${id}/notes`} className="bg-card border border-border rounded-xl p-3 flex items-center gap-2.5 hover:border-orange-300/50 hover:shadow-sm transition-all">
          <BookOpen className="w-4 h-4 text-accent-foreground shrink-0" />
          <span className="text-sm font-medium">Notes</span>
        </Link>
      </div>

      {/* Itinerary */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg">Itinerary</h2>
            {stops.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {stops.length} {stops.length === 1 ? "stop" : "stops"} · use ↑↓ to reorder
              </p>
            )}
          </div>
          <Button
            size="sm"
            className="rounded-xl gap-1.5 h-9 bg-orange-500 hover:bg-orange-600 border-0 shadow-sm shadow-orange-400/30"
            onClick={() => setAddStopOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Stop
          </Button>
        </div>

        {stops.length > 0 ? (
          <div className="space-y-3">
            {stops.map((stop: any, idx: number) => {
              const stopCost = stop.activities?.reduce((a: number, act: any) => a + (act.cost || 0), 0) || 0;
              const hasStart = stop.startDate && isValid(parseISO(stop.startDate));
              const hasEnd = stop.endDate && isValid(parseISO(stop.endDate));
              const stopDays = hasStart && hasEnd
                ? Math.ceil((new Date(stop.endDate).getTime() - new Date(stop.startDate).getTime()) / 86400000) + 1
                : null;
              const stopDateRange = hasStart && hasEnd ? { start: stop.startDate, end: stop.endDate } : undefined;

              return (
                <div key={stop.id}>
                  {/* Stop card */}
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {/* Stop header */}
                    <div className="px-4 py-3.5 flex items-center justify-between border-b border-border bg-gradient-to-r from-orange-50/60 to-transparent">
                      <div className="flex items-center gap-3">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => moveStop(stop.id, "up")}
                            disabled={idx === 0}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveStop(stop.id, "down")}
                            disabled={idx === stops.length - 1}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{idx + 1}</div>

                        <div>
                          <h3 className="font-semibold leading-tight">{stop.cityName}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {stop.country}{stop.region ? `, ${stop.region}` : ""}
                            {hasStart && hasEnd
                              ? ` · ${format(parseISO(stop.startDate), "MMM d")} – ${format(parseISO(stop.endDate), "MMM d")}`
                              : ""}
                            {stopDays && ` (${stopDays}d)`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {stopCost > 0 && (
                          <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                            ₹{stopCost.toLocaleString("en-IN")}
                          </span>
                        )}
                        <button
                          onClick={() => deleteStop.mutate(
                            { tripId: id, stopId: stop.id },
                            { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetTripQueryKey(id) }) }
                          )}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="p-4 space-y-2">
                      <DayWiseActivities
                        activities={stop.activities || []}
                        stop={stop}
                        tripId={id}
                        onAddActivity={() => setAddActivityStop({ stopId: stop.id, dateRange: stopDateRange })}
                      />

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => setAddActivityStop({ stopId: stop.id, dateRange: stopDateRange })}
                          className="flex items-center gap-2 text-xs text-orange-500 hover:text-orange-600 font-medium transition-colors px-1">
                          <PlusCircle className="w-3.5 h-3.5" /> Add activity
                        </button>
                      </div>

                      {/* Suggested Activities from city templates */}
                      <SuggestedActivities
                        cityName={stop.cityName}
                        stopId={stop.id}
                        tripId={id}
                        stopDateRange={stopDateRange}
                      />
                    </div>
                  </div>

                  {/* Nearby places between stops */}
                  {idx < stops.length - 1 && hasNearbyPlaces(stop.cityName) && (
                    <div className="my-3 pl-4">
                      <NearbyPlacesPanel fromCity={stop.cityName} toCity={stops[idx + 1]?.cityName} />
                    </div>
                  )}
                  {idx === stops.length - 1 && hasNearbyPlaces(stop.cityName) && stops.length === 1 && (
                    <div className="mt-3">
                      <NearbyPlacesPanel fromCity={stop.cityName} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center">
            <Globe className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">No stops yet</p>
            <p className="text-xs text-muted-foreground mb-4">Add cities to build your day-wise itinerary</p>
            <Button size="sm" className="rounded-xl gap-2 bg-orange-500 hover:bg-orange-600 border-0" onClick={() => setAddStopOpen(true)}>
              <Plus className="w-3.5 h-3.5" /> Add first stop
            </Button>
          </div>
        )}
      </div>

      <AddStopDialog
        tripId={id}
        open={addStopOpen}
        onClose={() => setAddStopOpen(false)}
        nextOrderIndex={stops.length}
      />
      {addActivityStop && (
        <ActivityDialog
          tripId={id}
          stopId={addActivityStop.stopId}
          open={!!addActivityStop}
          onClose={() => setAddActivityStop(null)}
          stopDateRange={addActivityStop.dateRange}
        />
      )}
    </div>
  );
}
