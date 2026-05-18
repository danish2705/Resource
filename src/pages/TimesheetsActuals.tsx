import { useState, useMemo, CSSProperties } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Resource {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

type TimesheetStatus = "Approved" | "Pending";

interface Timesheet {
  id: string;
  resourceId: string;
  projectId: string;
  week: string;
  planned: number;
  actual: number;
  status: TimesheetStatus;
  notes: string;
}

interface TimesheetStats {
  totalPlanned: number;
  totalActual: number;
  variance: number;
  overPlan: number;
  pending: number;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const resources: Resource[] = [
  { id: "R-001", name: "Alice Martin" },
  { id: "R-002", name: "Bob Chen" },
  { id: "R-003", name: "Carol Smith" },
  { id: "R-004", name: "David Park" },
  { id: "R-005", name: "Eva Torres" },
  { id: "R-006", name: "Frank Lee" },
  { id: "R-007", name: "Grace Kim" },
  { id: "R-008", name: "Henry Osei" },
  { id: "R-009", name: "Isla Nguyen" },
  { id: "R-010", name: "James Rowe" },
];

const projects: Project[] = [
  { id: "P-001", name: "Cloud Infrastructure Migration" },
  { id: "P-002", name: "Customer Portal v2" },
  { id: "P-003", name: "Data Pipeline Rebuild" },
  { id: "P-004", name: "Analytics Dashboard" },
  { id: "P-006", name: "Security Compliance Audit" },
];

const timesheets: Timesheet[] = [
  {
    id: "T-001",
    resourceId: "R-001",
    projectId: "P-001",
    week: "2025-W12",
    planned: 32,
    actual: 38,
    status: "Approved",
    notes: "Extra hours for infra review",
  },
  {
    id: "T-002",
    resourceId: "R-002",
    projectId: "P-002",
    week: "2025-W12",
    planned: 40,
    actual: 40,
    status: "Approved",
    notes: "",
  },
  {
    id: "T-003",
    resourceId: "R-003",
    projectId: "P-003",
    week: "2025-W12",
    planned: 32,
    actual: 38,
    status: "Approved",
    notes: "Pipeline debugging",
  },
  {
    id: "T-004",
    resourceId: "R-004",
    projectId: "P-001",
    week: "2025-W12",
    planned: 40,
    actual: 44,
    status: "Pending",
    notes: "UI sprint overrun",
  },
  {
    id: "T-005",
    resourceId: "R-005",
    projectId: "P-001",
    week: "2025-W12",
    planned: 24,
    actual: 24,
    status: "Approved",
    notes: "",
  },
  {
    id: "T-006",
    resourceId: "R-006",
    projectId: "P-002",
    week: "2025-W12",
    planned: 32,
    actual: 28,
    status: "Approved",
    notes: "Public holiday Friday",
  },
  {
    id: "T-007",
    resourceId: "R-007",
    projectId: "P-006",
    week: "2025-W12",
    planned: 40,
    actual: 40,
    status: "Approved",
    notes: "",
  },
  {
    id: "T-008",
    resourceId: "R-008",
    projectId: "P-003",
    week: "2025-W12",
    planned: 10,
    actual: 10,
    status: "Approved",
    notes: "",
  },
  {
    id: "T-009",
    resourceId: "R-009",
    projectId: "P-004",
    week: "2025-W12",
    planned: 40,
    actual: 44,
    status: "Pending",
    notes: "Dashboard rework",
  },
  {
    id: "T-010",
    resourceId: "R-010",
    projectId: "P-001",
    week: "2025-W12",
    planned: 18,
    actual: 36,
    status: "Pending",
    notes: "Emergency migration support",
  },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────

function getResource(id: string) {
  return resources.find((r) => r.id === id);
}

function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getVariance(row: Timesheet): number {
  return row.actual - row.planned;
}

function calcStats(data: Timesheet[]): TimesheetStats {
  const totalPlanned = data.reduce((s, t) => s + t.planned, 0);
  const totalActual = data.reduce((s, t) => s + t.actual, 0);
  return {
    totalPlanned,
    totalActual,
    variance: totalActual - totalPlanned,
    overPlan: data.filter((t) => t.actual > t.planned).length,
    pending: data.filter((t) => t.status === "Pending").length,
  };
}

// ─── KPI CARD ────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  valueClassName?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  hint,
  valueClassName,
}) => (
  <div className="bg-muted rounded-lg p-4">
    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
      {label}
    </div>
    <div
      className={`font-mono text-xl font-medium ${valueClassName ?? "text-foreground"}`}
    >
      {value}
    </div>
    {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
  </div>
);

// ─── VARIANCE CELL ───────────────────────────────────────────────────────────

const VarianceCell: React.FC<{ variance: number }> = ({ variance }) => {
  if (variance > 0)
    return (
      <span className="font-mono text-xs font-medium text-red-400">
        +{variance} hrs
      </span>
    );
  if (variance < 0)
    return (
      <span className="font-mono text-xs font-medium text-green-400">
        {variance} hrs
      </span>
    );
  return <span className="font-mono text-xs text-muted-foreground">0 hrs</span>;
};

// ─── UTILIZATION BAR ─────────────────────────────────────────────────────────

const UtilBar: React.FC<{ planned: number; actual: number }> = ({
  planned,
  actual,
}) => {
  const pct = Math.round((actual / planned) * 100);
  const barColor =
    pct > 100 ? "bg-red-500" : pct >= 90 ? "bg-yellow-500" : "bg-green-500";
  const textColor =
    pct > 100
      ? "text-red-400"
      : pct >= 90
        ? "text-yellow-400"
        : "text-green-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={`font-mono text-xs font-medium ${textColor}`}>
        {actual} hrs
      </span>
    </div>
  );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: TimesheetStatus }> = ({ status }) => {
  const cls =
    status === "Approved"
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
};

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function TimesheetsPage(): React.ReactElement {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVariance, setFilterVariance] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return timesheets.filter((t) => {
      const res = getResource(t.resourceId);
      const proj = getProject(t.projectId);
      const matchQ =
        !q ||
        res?.name.toLowerCase().includes(q) ||
        proj?.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.status.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      const v = t.actual - t.planned;
      const matchVariance =
        filterVariance === "all" ||
        (filterVariance === "over" && v > 0) ||
        (filterVariance === "under" && v < 0) ||
        (filterVariance === "exact" && v === 0);
      return matchQ && matchStatus && matchVariance;
    });
  }, [search, filterStatus, filterVariance]);

  const stats = calcStats(filtered);
  const hasActiveFilters =
    search || filterStatus !== "all" || filterVariance !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterVariance("all");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timesheet Actuals</CardTitle>
        <p className="text-sm text-muted-foreground">
          Week 12 · 2025 — planned vs actual, variance tracking
        </p>
      </CardHeader>

      <CardContent>
        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
          <KpiCard label="Total planned" value={`${stats.totalPlanned} hrs`} />
          <KpiCard label="Total actual" value={`${stats.totalActual} hrs`} />
          <KpiCard
            label="Total variance"
            value={`${stats.variance >= 0 ? "+" : ""}${stats.variance} hrs`}
            hint="Actual over plan"
            valueClassName={
              stats.variance > 0 ? "text-red-400" : "text-foreground"
            }
          />
          <KpiCard
            label="Over plan"
            value={stats.overPlan}
            hint="Resources"
            valueClassName="text-amber-400"
          />
          <KpiCard
            label="Pending approval"
            value={stats.pending}
            hint="Entries"
            valueClassName="text-amber-400"
          />
        </div>

        {/* ── Filters ── */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="pl-9 h-9 text-sm"
              placeholder="Search resource, project, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 w-[150px] text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterVariance} onValueChange={setFilterVariance}>
            <SelectTrigger className="h-9 w-[160px] text-sm">
              <SelectValue placeholder="All variance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All variance</SelectItem>
              <SelectItem value="over">Over plan</SelectItem>
              <SelectItem value="under">Under plan</SelectItem>
              <SelectItem value="exact">On plan</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-2 text-xs text-muted-foreground"
              onClick={clearFilters}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {[
                  "ID",
                  "Resource",
                  "Project",
                  "Week",
                  "Planned",
                  "Actual",
                  "Variance",
                  "Status",
                  "Notes",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap border-b border-border"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No matching timesheet records.
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => {
                  const res = getResource(t.resourceId);
                  const proj = getProject(t.projectId);
                  const variance = getVariance(t);
                  const projName = proj
                    ? proj.name.length > 24
                      ? proj.name.substring(0, 24) + "…"
                      : proj.name
                    : t.projectId;

                  return (
                    <tr
                      key={t.id}
                      className={`border-b border-border transition-colors hover:bg-muted/40 ${
                        i % 2 === 0 ? "" : "bg-muted/20"
                      }`}
                    >
                      {/* ID */}
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs text-muted-foreground">
                          {t.id}
                        </span>
                      </td>

                      {/* Resource */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium shrink-0">
                            {res ? getInitials(res.name) : "?"}
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-xs">
                              {res?.name ?? t.resourceId}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t.resourceId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="px-3 py-2.5">
                        <span className="text-xs text-muted-foreground">
                          {projName}
                        </span>
                      </td>

                      {/* Week */}
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs text-muted-foreground">
                          {t.week}
                        </span>
                      </td>

                      {/* Planned */}
                      <td className="px-3 py-2.5">
                        <span className="font-mono text-xs text-muted-foreground">
                          {t.planned} hrs
                        </span>
                      </td>

                      {/* Actual + util bar */}
                      <td className="px-3 py-2.5">
                        <UtilBar planned={t.planned} actual={t.actual} />
                      </td>

                      {/* Variance */}
                      <td className="px-3 py-2.5">
                        <VarianceCell variance={variance} />
                      </td>

                      {/* Status */}
                      <td className="px-3 py-2.5">
                        <StatusBadge status={t.status} />
                      </td>

                      {/* Notes */}
                      <td className="px-3 py-2.5">
                        <span
                          className={`text-xs ${
                            t.notes
                              ? "text-muted-foreground"
                              : "text-muted-foreground/50 italic"
                          }`}
                        >
                          {t.notes || "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
