import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CalendarRange,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ForecastStatus = "On Track" | "At Risk" | "Over Budget" | "Under Utilized";

interface BudgetForecastRow {
  id: string;
  project: string;
  pillar: string;
  role: string;
  resourceCount: number;
  startDate: string;
  endDate: string;
  billRate: number; // $ per hour
  burnRate: number; // $ per month actual spend
  forecastedBurn: number; // $ per month expected
  totalBudget: number;
  spentToDate: number;
  allocationPct: number;
  status: ForecastStatus;
  portfolio: string;
}

// ─── Static Mock Data ─────────────────────────────────────────────────────────

const mockData: BudgetForecastRow[] = [
  {
    id: "bf-001",
    project: "Data Modernization - ASPAC",
    pillar: "Hi-tech",
    role: "Technical Lead",
    resourceCount: 3,
    startDate: "2027-01-01",
    endDate: "2027-12-31",
    billRate: 145,
    burnRate: 68000,
    forecastedBurn: 72000,
    totalBudget: 864000,
    spentToDate: 340000,
    allocationPct: 100,
    status: "On Track",
    portfolio: "Enterprise",
  },
  {
    id: "bf-002",
    project: "Data Modernization - ASPAC",
    pillar: "Hi-tech",
    role: "Business Analyst",
    resourceCount: 2,
    startDate: "2027-01-01",
    endDate: "2027-06-30",
    billRate: 110,
    burnRate: 52000,
    forecastedBurn: 48000,
    totalBudget: 288000,
    spentToDate: 156000,
    allocationPct: 75,
    status: "Over Budget",
    portfolio: "Enterprise",
  },
  {
    id: "bf-003",
    project: "QE Automation",
    pillar: "Retail",
    role: "QA Engineer",
    resourceCount: 4,
    startDate: "2027-02-01",
    endDate: "2028-01-31",
    billRate: 95,
    burnRate: 58000,
    forecastedBurn: 64000,
    totalBudget: 768000,
    spentToDate: 290000,
    allocationPct: 100,
    status: "Under Utilized",
    portfolio: "EMEA",
  },
  {
    id: "bf-004",
    project: "Cloud Enablement",
    pillar: "Banking",
    role: "DevOps Engineer",
    resourceCount: 2,
    startDate: "2027-03-01",
    endDate: "2028-02-28",
    billRate: 130,
    burnRate: 38000,
    forecastedBurn: 36000,
    totalBudget: 432000,
    spentToDate: 114000,
    allocationPct: 50,
    status: "On Track",
    portfolio: "Enterprise",
  },
  {
    id: "bf-005",
    project: "Cloud Enablement",
    pillar: "Banking",
    role: "Technical Lead",
    resourceCount: 1,
    startDate: "2027-01-01",
    endDate: "2027-09-30",
    billRate: 155,
    burnRate: 24000,
    forecastedBurn: 26000,
    totalBudget: 234000,
    spentToDate: 96000,
    allocationPct: 100,
    status: "At Risk",
    portfolio: "Enterprise",
  },
  {
    id: "bf-006",
    project: "Application Support",
    pillar: "Healthcare",
    role: "Project Manager",
    resourceCount: 1,
    startDate: "2027-01-01",
    endDate: "2028-12-31",
    billRate: 120,
    burnRate: 19000,
    forecastedBurn: 20000,
    totalBudget: 480000,
    spentToDate: 95000,
    allocationPct: 100,
    status: "On Track",
    portfolio: "AMER",
  },
  {
    id: "bf-007",
    project: "Application Support",
    pillar: "Healthcare",
    role: "Business Analyst",
    resourceCount: 2,
    startDate: "2027-04-01",
    endDate: "2028-03-31",
    billRate: 105,
    burnRate: 29000,
    forecastedBurn: 28000,
    totalBudget: 336000,
    spentToDate: 87000,
    allocationPct: 75,
    status: "Over Budget",
    portfolio: "AMER",
  },
  {
    id: "bf-008",
    project: "Data Modernization - ASPAC",
    pillar: "Hi-tech",
    role: "DevOps Engineer",
    resourceCount: 2,
    startDate: "2027-06-01",
    endDate: "2028-05-31",
    billRate: 125,
    burnRate: 43000,
    forecastedBurn: 45000,
    totalBudget: 540000,
    spentToDate: 129000,
    allocationPct: 100,
    status: "On Track",
    portfolio: "Enterprise",
  },
  {
    id: "bf-009",
    project: "QE Automation",
    pillar: "Retail",
    role: "Technical Lead",
    resourceCount: 1,
    startDate: "2027-01-01",
    endDate: "2027-12-31",
    billRate: 148,
    burnRate: 21000,
    forecastedBurn: 24000,
    totalBudget: 288000,
    spentToDate: 105000,
    allocationPct: 100,
    status: "Under Utilized",
    portfolio: "EMEA",
  },
  {
    id: "bf-010",
    project: "Cloud Enablement",
    pillar: "Banking",
    role: "QA Engineer",
    resourceCount: 3,
    startDate: "2027-05-01",
    endDate: "2028-04-30",
    billRate: 92,
    burnRate: 49000,
    forecastedBurn: 46000,
    totalBudget: 552000,
    spentToDate: 196000,
    allocationPct: 75,
    status: "At Risk",
    portfolio: "Enterprise",
  },
  {
    id: "bf-011",
    project: "Application Support",
    pillar: "Healthcare",
    role: "DevOps Engineer",
    resourceCount: 1,
    startDate: "2027-02-01",
    endDate: "2027-11-30",
    billRate: 118,
    burnRate: 17000,
    forecastedBurn: 17500,
    totalBudget: 175000,
    spentToDate: 85000,
    allocationPct: 50,
    status: "On Track",
    portfolio: "AMER",
  },
  {
    id: "bf-012",
    project: "QE Automation",
    pillar: "Retail",
    role: "Business Analyst",
    resourceCount: 2,
    startDate: "2027-03-01",
    endDate: "2028-02-28",
    billRate: 108,
    burnRate: 31000,
    forecastedBurn: 34000,
    totalBudget: 408000,
    spentToDate: 93000,
    allocationPct: 75,
    status: "Under Utilized",
    portfolio: "EMEA",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function fmtRate(v: number) {
  return `$${v}/hr`;
}

function months(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const diff =
    (e.getFullYear() - s.getFullYear()) * 12 +
    (e.getMonth() - s.getMonth()) +
    1;
  return `${diff}mo`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusStyle: Record<
  ForecastStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  "On Track": {
    bg: "bg-green-500/15 dark:bg-green-500/20",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-500/40",
    dot: "bg-green-500",
  },
  "At Risk": {
    bg: "bg-amber-500/15 dark:bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-500/40",
    dot: "bg-amber-500",
  },
  "Over Budget": {
    bg: "bg-red-500/15 dark:bg-red-500/20",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-500/40",
    dot: "bg-red-500",
  },
  "Under Utilized": {
    bg: "bg-blue-500/15 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-500/40",
    dot: "bg-blue-500",
  },
};

function BurnBar({
  actual,
  forecasted,
}: {
  actual: number;
  forecasted: number;
}) {
  const pct = forecasted === 0 ? 0 : Math.min((actual / forecasted) * 100, 130);
  const over = actual > forecasted;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        <span>{fmt(actual)}</span>
        <span className="text-muted-foreground/60">/ {fmt(forecasted)}</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${over ? "bg-red-500" : pct > 85 ? "bg-amber-500" : "bg-green-500"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function BudgetBar({ spent, total }: { spent: number; total: number }) {
  const pct = total === 0 ? 0 : Math.min((spent / total) * 100, 100);
  const color =
    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-primary";
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
        <span>{fmt(spent)}</span>
        <span className="text-muted-foreground/60">{pct.toFixed(0)}%</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function DetailModal({
  row,
  onClose,
}: {
  row: BudgetForecastRow;
  onClose: () => void;
}) {
  const st = statusStyle[row.status];
  const variance = row.burnRate - row.forecastedBurn;
  const budgetPct =
    row.totalBudget === 0 ? 0 : (row.spentToDate / row.totalBudget) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground">{row.id}</p>
            <h2 className="text-lg font-semibold text-foreground mt-0.5">
              {row.project}
            </h2>
            <p className="text-xs text-muted-foreground">
              {row.role} · {row.pillar}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${st.bg} ${st.text} ${st.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
              {row.status}
            </span>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Bill Rate",
                value: fmtRate(row.billRate),
                icon: DollarSign,
                color: "text-primary",
              },
              {
                label: "Resources",
                value: String(row.resourceCount),
                icon: Users,
                color: "text-indigo-500 dark:text-indigo-400",
              },
              {
                label: "Timeline",
                value: months(row.startDate, row.endDate),
                icon: CalendarRange,
                color: "text-sky-500 dark:text-sky-400",
              },
              {
                label: "Allocation",
                value: `${row.allocationPct}%`,
                icon: TrendingUp,
                color: "text-emerald-500 dark:text-emerald-400",
              },
            ].map((k) => (
              <div
                key={k.label}
                className="rounded-xl border border-border bg-muted/30 p-3 flex items-center gap-3"
              >
                <k.icon className={`h-5 w-5 shrink-0 ${k.color}`} />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                    {k.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {k.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <section className="rounded-xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/30 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400 mb-3">
              Timeline
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-medium text-foreground mt-0.5">
                  {fmtDate(row.startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-medium text-foreground mt-0.5">
                  {fmtDate(row.endDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground mt-0.5">
                  {months(row.startDate, row.endDate)}
                </p>
              </div>
            </div>
          </section>

          {/* Burn Rate */}
          <section className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-3">
              Burn Rate (Monthly)
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Actual Burn</p>
                <p
                  className={`font-semibold mt-0.5 ${variance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {fmt(row.burnRate)}/mo
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Forecasted Burn</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {fmt(row.forecastedBurn)}/mo
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Variance</p>
                <p
                  className={`font-semibold mt-0.5 flex items-center gap-1 ${variance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {variance > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {variance > 0 ? "+" : ""}
                  {fmt(Math.abs(variance))}
                </p>
              </div>
            </div>
            <BurnBar actual={row.burnRate} forecasted={row.forecastedBurn} />
          </section>

          {/* Budget */}
          <section className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-400 mb-3">
              Budget Utilization
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Budget</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {fmt(row.totalBudget)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Spent to Date</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {fmt(row.spentToDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p
                  className={`font-semibold mt-0.5 ${row.totalBudget - row.spentToDate < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                >
                  {fmt(row.totalBudget - row.spentToDate)}
                </p>
              </div>
            </div>
            <BudgetBar spent={row.spentToDate} total={row.totalBudget} />
            <p className="text-xs text-muted-foreground mt-2">
              {budgetPct.toFixed(1)}% of total budget consumed
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BudgetForecasting() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPillar, setFilterPillar] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [selected, setSelected] = useState<BudgetForecastRow | null>(null);

  const roles = useMemo(
    () => Array.from(new Set(mockData.map((r) => r.role))),
    [],
  );
  const pillars = useMemo(
    () => Array.from(new Set(mockData.map((r) => r.pillar))),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockData.filter((r) => {
      const matchSearch =
        !q ||
        r.project.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.pillar.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      const matchPillar = filterPillar === "all" || r.pillar === filterPillar;
      const matchRole = filterRole === "all" || r.role === filterRole;
      return matchSearch && matchStatus && matchPillar && matchRole;
    });
  }, [search, filterStatus, filterPillar, filterRole]);

  // Summary KPIs
  const totalBudget = filtered.reduce((s, r) => s + r.totalBudget, 0);
  const totalSpent = filtered.reduce((s, r) => s + r.spentToDate, 0);
  const totalBurn = filtered.reduce((s, r) => s + r.burnRate, 0);
  const totalForecastBurn = filtered.reduce((s, r) => s + r.forecastedBurn, 0);
  const totalResources = filtered.reduce((s, r) => s + r.resourceCount, 0);
  const overBudgetCount = filtered.filter(
    (r) => r.status === "Over Budget",
  ).length;

  return (
    <div className="h-[calc(100vh-110px)] flex flex-col gap-4 overflow-auto">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
        {[
          {
            label: "Total Budget",
            value: fmt(totalBudget),
            sub: `${fmt(totalSpent)} spent`,
            icon: DollarSign,
            color: "text-primary",
            border: "border-primary/20",
            bg: "bg-primary/5 dark:bg-primary/10",
          },
          {
            label: "Monthly Burn Rate",
            value: fmt(totalBurn),
            sub: `Forecast: ${fmt(totalForecastBurn)}`,
            icon: totalBurn > totalForecastBurn ? TrendingUp : TrendingDown,
            color:
              totalBurn > totalForecastBurn
                ? "text-red-500 dark:text-red-400"
                : "text-green-600 dark:text-green-400",
            border:
              totalBurn > totalForecastBurn
                ? "border-red-500/20"
                : "border-green-500/20",
            bg:
              totalBurn > totalForecastBurn
                ? "bg-red-500/5 dark:bg-red-500/10"
                : "bg-green-500/5 dark:bg-green-500/10",
          },
          {
            label: "Total Resources",
            value: String(totalResources),
            sub: `${filtered.length} role${filtered.length !== 1 ? "s" : ""}`,
            icon: Users,
            color: "text-indigo-500 dark:text-indigo-400",
            border: "border-indigo-500/20",
            bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
          },
          {
            label: "Over Budget",
            value: String(overBudgetCount),
            sub: `of ${filtered.length} entries`,
            icon: TrendingUp,
            color:
              overBudgetCount > 0
                ? "text-red-500 dark:text-red-400"
                : "text-green-600 dark:text-green-400",
            border:
              overBudgetCount > 0 ? "border-red-500/20" : "border-green-500/20",
            bg:
              overBudgetCount > 0
                ? "bg-red-500/5 dark:bg-red-500/10"
                : "bg-green-500/5 dark:bg-green-500/10",
          },
        ].map((k) => (
          <Card key={k.label} className={`border ${k.border} ${k.bg}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center ${k.bg} border ${k.border} shrink-0`}
              >
                <k.icon className={`h-4 w-4 ${k.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">
                  {k.label}
                </p>
                <p className={`text-lg font-bold leading-tight ${k.color}`}>
                  {k.value}
                </p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Table Card ── */}
      <Card className="flex-1 min-h-0 flex flex-col">
        <CardHeader className="shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Budget Forecast by Role</CardTitle>
            <span className="text-xs text-muted-foreground">
              {filtered.length} entries
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                className="pl-8 h-8 text-sm"
                placeholder="Search project, role, pillar…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[145px] h-8 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="On Track">On Track</SelectItem>
                <SelectItem value="At Risk">At Risk</SelectItem>
                <SelectItem value="Over Budget">Over Budget</SelectItem>
                <SelectItem value="Under Utilized">Under Utilized</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPillar} onValueChange={setFilterPillar}>
              <SelectTrigger className="w-[130px] h-8 text-sm">
                <SelectValue placeholder="Pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pillars</SelectItem>
                {pillars.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 overflow-auto p-0">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              <tr>
                {[
                  "Project",
                  "Role",
                  "Count",
                  "Timeline",
                  "Bill Rate",
                  "Burn Rate",
                  "Budget Utilized",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap border-b border-border"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No entries match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((row) => {
                const st = statusStyle[row.status];
                const variance = row.burnRate - row.forecastedBurn;
                return (
                  <tr
                    key={row.id}
                    className="border-t border-border hover:bg-muted/40 transition-colors"
                  >
                    {/* Project */}
                    <td className="px-4 py-3 max-w-[180px]">
                      <div className="font-medium text-foreground truncate">
                        {row.project}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {row.pillar}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {row.role}
                      </Badge>
                    </td>

                    {/* Count */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        <Users className="h-3 w-3" />
                        {row.resourceCount}
                      </span>
                    </td>

                    {/* Timeline */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <CalendarRange className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <div>
                          <div className="text-foreground font-medium">
                            {months(row.startDate, row.endDate)}
                          </div>
                          <div className="text-muted-foreground">
                            {fmtDate(row.startDate)} – {fmtDate(row.endDate)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Bill Rate */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-foreground">
                        {fmtRate(row.billRate)}
                      </span>
                    </td>

                    {/* Burn Rate */}
                    <td className="px-4 py-3 min-w-[130px]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`text-xs font-semibold ${variance > 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                        >
                          {fmt(row.burnRate)}/mo
                        </span>
                        {variance > 0 ? (
                          <TrendingUp className="h-3 w-3 text-red-500 dark:text-red-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <BurnBar
                        actual={row.burnRate}
                        forecasted={row.forecastedBurn}
                      />
                    </td>

                    {/* Budget Utilized */}
                    <td className="px-4 py-3 min-w-[140px]">
                      <div className="text-xs text-muted-foreground mb-1">
                        {fmt(row.totalBudget)} total
                      </div>
                      <BudgetBar
                        spent={row.spentToDate}
                        total={row.totalBudget}
                      />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${st.bg} ${st.text} ${st.border}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${st.dot}`}
                        />
                        {row.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-blue-500 hover:text-blue-600"
                        onClick={() => setSelected(row)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selected && (
        <DetailModal row={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
