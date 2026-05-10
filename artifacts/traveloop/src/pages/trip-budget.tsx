import { useParams, useLocation } from "wouter";
import {
  useGetTripBudget,
  getGetTripBudgetQueryKey,
  useGetTrip,
  getGetTripQueryKey,
} from "@workspace/api-client-react";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Calendar,
  Wallet,
  BarChart3,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((value / total) * 100));
}

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const CATEGORY_COLORS: Record<string, string> = {
  transport: "#f97316",
  accommodation: "#3b82f6",
  food: "#22c55e",
  sightseeing: "#a855f7",
  adventure: "#ec4899",
  culture: "#eab308",
  entertainment: "#06b6d4",
  shopping: "#f43f5e",
  other: "#94a3b8",
};

const CITY_COLORS = [
  "#f97316",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
  "#ec4899",
  "#eab308",
  "#06b6d4",
];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold">{capitalize(d.name)}</p>
        <p className="text-muted-foreground">{fmt(d.value)}</p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-muted-foreground">
            {fmt(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TripBudget() {
  const { tripId } = useParams<{ tripId: string }>();
  const id = tripId;
  const [, setLocation] = useLocation();
  const { data: trip } = useGetTrip(id, {
    query: { enabled: !!id, queryKey: getGetTripQueryKey(id) },
  });
  const { data: budget, isLoading } = useGetTripBudget(id, {
    query: { enabled: !!id, queryKey: getGetTripBudgetQueryKey(id) },
  });

  const over =
    budget &&
    budget.totalBudget != null &&
    budget.totalEstimated > budget.totalBudget;
  const under =
    budget &&
    budget.totalBudget != null &&
    budget.totalEstimated <= budget.totalBudget;
  const overAmount =
    over && budget.totalBudget != null
      ? budget.totalEstimated - budget.totalBudget
      : 0;
  const pctUsed =
    budget && budget.totalBudget
      ? Math.round((budget.totalEstimated / budget.totalBudget) * 100)
      : null;

  const pieData =
    budget?.categoryBreakdown
      ?.filter((c) => c.cost > 0)
      .map((c) => ({ name: c.category, value: c.cost })) ?? [];

  const barData =
    budget?.breakdown
      ?.filter((b) => b.cost > 0)
      .map((b) => ({ city: b.cityName, cost: b.cost })) ?? [];

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => setLocation(`/trips/${id}`)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> {trip?.name || "Trip"}
        </button>
        <h1 className="text-2xl font-bold">Budget Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Summarized cost breakdown for your trip
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : budget ? (
        <>
          {/* Over-budget alert */}
          {over && (
            <div className="flex items-start gap-3 bg-destructive/8 border border-destructive/30 rounded-2xl px-5 py-4">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-destructive text-sm">
                  Over budget by {fmt(overAmount)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your estimated spend is{" "}
                  {pctUsed ? `${pctUsed}%` : "more than"} of your set budget.
                  Consider reviewing high-cost stops.
                </p>
              </div>
            </div>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card border border-border rounded-2xl p-4 space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Estimated
              </p>
              <p className="text-xl font-bold text-foreground">
                {fmt(budget.totalEstimated)}
              </p>
              <p className="text-xs text-muted-foreground">total spend</p>
            </div>
            <div
              className={`border rounded-2xl p-4 space-y-1 ${
                budget.totalBudget != null
                  ? over
                    ? "bg-destructive/5 border-destructive/30"
                    : "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                  : "bg-card border-border"
              }`}
            >
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Budget
              </p>
              <p className="text-xl font-bold">
                {budget.totalBudget != null ? fmt(budget.totalBudget) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">set limit</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Avg / Day
                </p>
              </div>
              <p className="text-xl font-bold text-foreground">
                {fmt(budget.avgCostPerDay)}
              </p>
              <p className="text-xs text-muted-foreground">
                over {budget.tripDays} day{budget.tripDays !== 1 ? "s" : ""}
              </p>
            </div>
            <div
              className={`border rounded-2xl p-4 space-y-1 ${
                over
                  ? "bg-destructive/5 border-destructive/30"
                  : budget.totalBudget != null
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                    : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {over ? (
                  <TrendingUp className="w-3.5 h-3.5 text-destructive" />
                ) : budget.totalBudget != null ? (
                  <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Difference
                </p>
              </div>
              {budget.totalBudget != null ? (
                <p
                  className={`text-xl font-bold ${over ? "text-destructive" : "text-green-600"}`}
                >
                  {over ? "+" : "-"}
                  {fmt(Math.abs(budget.totalEstimated - budget.totalBudget))}
                </p>
              ) : (
                <p className="text-xl font-bold text-muted-foreground">—</p>
              )}
              <p className="text-xs text-muted-foreground">
                {over
                  ? "over budget"
                  : budget.totalBudget != null
                    ? "under budget"
                    : "no budget set"}
              </p>
            </div>
          </div>

          {/* Budget progress bar */}
          {budget.totalBudget != null && pctUsed !== null && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Budget Usage</span>
                </div>
                <span
                  className={`text-sm font-bold ${over ? "text-destructive" : "text-green-600"}`}
                >
                  {pctUsed}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${over ? "bg-destructive" : "bg-green-500"}`}
                  style={{ width: `${Math.min(100, pctUsed)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {fmt(budget.totalEstimated)} spent of {fmt(budget.totalBudget)}{" "}
                budget
              </p>
            </div>
          )}

          {/* Charts row */}
          {(pieData.length > 0 || barData.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category pie chart */}
              {pieData.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <h2 className="font-semibold text-sm">By Category</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, i) => (
                          <Cell
                            key={entry.name}
                            fill={
                              CATEGORY_COLORS[entry.name] ??
                              CITY_COLORS[i % CITY_COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend
                        formatter={(value) => capitalize(value)}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* City bar chart */}
              {barData.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <h2 className="font-semibold text-sm">By City</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={barData}
                      margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
                    >
                      <XAxis
                        dataKey="city"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) =>
                          v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                        }
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                        {barData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CITY_COLORS[i % CITY_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Category breakdown list */}
          {budget.categoryBreakdown && budget.categoryBreakdown.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-sm">Category Breakdown</h2>
              <div className="space-y-3">
                {budget.categoryBreakdown
                  .filter((c) => c.cost > 0)
                  .map((item) => (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              background:
                                CATEGORY_COLORS[item.category] ?? "#94a3b8",
                            }}
                          />
                          <span className="font-medium">
                            {capitalize(item.category)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {pct(item.cost, budget.totalEstimated)}%
                          </span>
                          <span className="font-medium">{fmt(item.cost)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct(item.cost, budget.totalEstimated)}%`,
                            background:
                              CATEGORY_COLORS[item.category] ?? "#94a3b8",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Per-city breakdown */}
          {budget.breakdown && budget.breakdown.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold text-sm">Per City Breakdown</h2>
              <div className="space-y-3">
                {budget.breakdown.map((item, i) => {
                  const cityPct = pct(item.cost, budget.totalEstimated);
                  const budgetPerStop =
                    budget.totalBudget && budget.breakdown
                      ? budget.totalBudget / budget.breakdown.length
                      : null;
                  const cityOver =
                    budgetPerStop != null && item.cost > budgetPerStop;
                  return (
                    <div key={item.stopId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.cityName}</span>
                          {cityOver && (
                            <span className="text-xs text-destructive flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" /> over
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {cityPct}%
                          </span>
                          <span className="font-medium">{fmt(item.cost)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500`}
                          style={{
                            width: `${cityPct}%`,
                            background: CITY_COLORS[i % CITY_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {budget.breakdown && budget.breakdown.length === 0 && (
            <div className="bg-card border border-dashed border-border rounded-2xl p-10 text-center space-y-2">
              <Wallet className="w-10 h-10 text-muted-foreground/30 mx-auto" />
              <p className="text-sm font-medium">No costs yet</p>
              <p className="text-xs text-muted-foreground">
                Add activities with costs to your trip stops to see the budget
                breakdown.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
          Could not load budget.
        </div>
      )}
    </div>
  );
}
