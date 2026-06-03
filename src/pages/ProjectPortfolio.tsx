import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  AlertTriangle,
  Layers,
  DollarSign,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Types ────────────────────────────────────────────────────────────────────

type ApprovalStatus =
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Proposed"
  | "Approved - Backlog";

interface PortfolioRow {
  id: string;
  projectId: string;
  project: string;
  priority: "Immediate" | "High" | "Medium" | "Low";
  owner: string;
  type: string;
  status: ApprovalStatus;
  fromDate: string;
  toDate: string;
  budget: number;
  cost: number;
  variance: number;
  projectedBenefits: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);

const fmtShort = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_ROWS: PortfolioRow[] = [
  {
    id: "1",
    projectId: "P-001",
    project: "Enterprise Mobility v4.2",
    priority: "Immediate",
    owner: "Ohlen, Hampus",
    type: "Strategic",
    status: "Active",
    fromDate: "01-06-2020",
    toDate: "25-01-2021",
    budget: 1000000,
    cost: 374971.08,
    variance: 625028.92,
    projectedBenefits: 269250,
  },
  {
    id: "2",
    projectId: "P-002",
    project: "Mobile Marketplace Upgrade",
    priority: "Immediate",
    owner: "Kukreja, Samir",
    type: "Strategic",
    status: "Active",
    fromDate: "01-01-2020",
    toDate: "19-08-2020",
    budget: 125000,
    cost: 166401.76,
    variance: -41401.76,
    projectedBenefits: 122000,
  },
  {
    id: "3",
    projectId: "P-003",
    project: "BDH Research Project",
    priority: "High",
    owner: "Hood, Ben",
    type: "Strategic",
    status: "Proposed",
    fromDate: "01-03-2020",
    toDate: "08-02-2021",
    budget: 50000,
    cost: 306096.0,
    variance: -256096.0,
    projectedBenefits: 760000,
  },
  {
    id: "4",
    projectId: "P-004",
    project: "Analytics Platform",
    priority: "Medium",
    owner: "Hill, Stephen",
    type: "Compliance",
    status: "Approved - Backlog",
    fromDate: "01-02-2020",
    toDate: "20-08-2020",
    budget: 450000,
    cost: 388804.46,
    variance: 61195.54,
    projectedBenefits: 520000,
  },
  {
    id: "5",
    projectId: "P-005",
    project: "AI Interface Rollout",
    priority: "Medium",
    owner: "Packebush, Sherrill",
    type: "Strategic",
    status: "Active",
    fromDate: "01-01-2020",
    toDate: "21-10-2020",
    budget: 1260000,
    cost: 433463.29,
    variance: 826536.71,
    projectedBenefits: 280000,
  },
  {
    id: "6",
    projectId: "P-006",
    project: "CRM Implementation v3",
    priority: "Medium",
    owner: "Kukreja, Samir",
    type: "Compliance",
    status: "Proposed",
    fromDate: "01-04-2020",
    toDate: "23-12-2020",
    budget: 100000,
    cost: 196161.58,
    variance: -96161.58,
    projectedBenefits: 37861,
  },
  {
    id: "7",
    projectId: "P-007",
    project: "Mobile Application Project",
    priority: "Medium",
    owner: "Hill, Stephen",
    type: "Financial",
    status: "Active",
    fromDate: "01-05-2020",
    toDate: "30-04-2021",
    budget: 50000,
    cost: 623626.68,
    variance: -573626.68,
    projectedBenefits: 72750,
  },
  {
    id: "8",
    projectId: "P-008",
    project: "Increase Machine Inspections",
    priority: "Low",
    owner: "Chrobok, Sabrina",
    type: "Strategic",
    status: "Active",
    fromDate: "01-01-2020",
    toDate: "21-08-2020",
    budget: 120000,
    cost: 386401.4,
    variance: -266401.4,
    projectedBenefits: 93083.33,
  },
];

// ─── Badge styles ─────────────────────────────────────────────────────────────

const priorityStyle = (p: PortfolioRow["priority"]) => {
  if (p === "Immediate") return "bg-red-500 text-white border-0 text-xs";
  if (p === "High") return "bg-red-200 text-red-900 border-0 text-xs";
  if (p === "Medium") return "bg-orange-200 text-orange-900 border-0 text-xs";
  return "bg-yellow-100 text-yellow-900 border-0 text-xs";
};

const statusStyle = (s: ApprovalStatus) => {
  if (s === "Active") return "bg-green-100 text-green-800 border-0 text-xs";
  if (s === "Approved") return "bg-blue-100 text-blue-800 border-0 text-xs";
  if (s === "Proposed") return "bg-purple-100 text-purple-800 border-0 text-xs";
  if (s === "Rejected") return "bg-red-100 text-red-800 border-0 text-xs";
  if (s === "Approved - Backlog")
    return "bg-teal-100 text-teal-800 border-0 text-xs";
  return "bg-muted text-muted-foreground border-0 text-xs";
};

// ─── Project Detail Modal ─────────────────────────────────────────────────────

function ProjectDetailModal({
  row,
  onClose,
}: {
  row: PortfolioRow;
  onClose: () => void;
}) {
  const budgetPct = Math.min(100, Math.round((row.cost / row.budget) * 100));
  const isOver = row.cost > row.budget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-mono text-muted-foreground">
                {row.projectId}
              </span>
              <Badge className={priorityStyle(row.priority)}>
                {row.priority}
              </Badge>
              <Badge className={statusStyle(row.status)}>{row.status}</Badge>
            </div>
            <h2 className="text-lg font-bold text-foreground">{row.project}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {row.owner} · {row.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Budget vs Target bar */}
          <div className="bg-muted/40 border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Budget vs. Target
              </p>
              <p className="text-xs text-muted-foreground">{budgetPct}% used</p>
            </div>
            <p className="text-2xl font-bold text-foreground mb-3">
              {fmtShort(row.budget)}
            </p>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isOver ? "bg-red-500" : "bg-orange-400"}`}
                style={{ width: `${budgetPct}%` }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-orange-400" />
                Cost · {fmtShort(row.cost)}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                Budget · {fmtShort(row.budget)}
              </span>
              <span
                className={`ml-auto font-medium ${row.variance < 0 ? "text-destructive" : "text-success"}`}
              >
                Variance ·{" "}
                {row.variance < 0
                  ? `-${fmtShort(Math.abs(row.variance))}`
                  : fmtShort(row.variance)}
              </span>
            </div>
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">
                Projected Benefits
              </p>
              <p className="text-2xl font-bold text-primary">
                {fmtShort(row.projectedBenefits)}
              </p>
            </div>
            <div className="bg-muted/40 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Actual Cost</p>
              <p className="text-2xl font-bold text-foreground">
                {fmtShort(row.cost)}
              </p>
            </div>
            <div className="bg-muted/40 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Variance</p>
              <p
                className={`text-2xl font-bold ${row.variance < 0 ? "text-destructive" : "text-success"}`}
              >
                {row.variance < 0
                  ? `-${fmtShort(Math.abs(row.variance))}`
                  : fmtShort(row.variance)}
              </p>
            </div>
            <div className="bg-muted/40 border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Budget</p>
              <p className="text-2xl font-bold text-foreground">
                {fmtShort(row.budget)}
              </p>
            </div>
          </div>

          {/* Actuals bar */}
          <div className="bg-muted/40 border border-border rounded-xl p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Actuals
            </p>
            <p className="text-2xl font-bold text-foreground mb-3">
              {fmtShort(row.cost)}
            </p>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${Math.min(100, Math.round((row.cost / (row.budget * 1.2)) * 100))}%`,
                }}
              />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                Unselected Actuals · {fmtShort(row.cost * 0.32)}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                Selected Actuals · {fmtShort(row.cost * 0.68)}
              </span>
            </div>
          </div>

          {/* Project details grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Project Owner", value: row.owner },
              { label: "Type", value: row.type },
              { label: "Priority", value: row.priority },
              { label: "Start Date", value: row.fromDate },
              { label: "End Date", value: row.toDate },
              { label: "Status", value: row.status },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-muted/40 border border-border rounded-xl p-3"
              >
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-medium">
                  {item.label}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Create Demand Dialog ─────────────────────────────────────────────────────

function CreateDemandDialog({
  rows,
  onClose,
  onSubmit,
}: {
  rows: PortfolioRow[];
  onClose: () => void;
  onSubmit: (selected: PortfolioRow[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allSelected = selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  // keep indeterminate in sync
  if (selectAllRef.current) {
    selectAllRef.current.indeterminate = someSelected;
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  };

  const handleSubmit = () => {
    const chosen = rows.filter((r) => selected.has(r.id));
    onSubmit(chosen);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-start justify-between rounded-t-2xl shrink-0">
          <div>
            <h2 className="text-lg font-bold text-foreground">Create Demand</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select one or more projects to create demand for
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Select all bar */}
        <div className="px-6 py-3 border-b border-border flex items-center gap-3 bg-muted/30 shrink-0">
          <input
            ref={selectAllRef}
            type="checkbox"
            id="selectAll"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 cursor-pointer accent-primary"
          />
          <label
            htmlFor="selectAll"
            className="text-sm text-muted-foreground cursor-pointer select-none"
          >
            Select all
          </label>
          <span className="ml-auto text-xs bg-muted px-2.5 py-0.5 rounded-full text-muted-foreground">
            {selected.size} selected
          </span>
        </div>

        {/* Project rows */}
        <div className="overflow-y-auto flex-1">
          {rows.map((row) => {
            const isChecked = selected.has(row.id);
            return (
              <div
                key={row.id}
                onClick={() => toggle(row.id)}
                className={`flex items-center gap-3 px-6 py-3 border-b border-border cursor-pointer hover:bg-muted/40 transition-colors last:border-b-0 ${
                  isChecked ? "bg-primary/5" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(row.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 accent-primary flex-shrink-0 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {row.project}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {row.projectId} · {row.owner} · {row.type}
                  </p>
                </div>
                <Badge className={priorityStyle(row.priority)}>
                  {row.priority}
                </Badge>
                <Badge className={statusStyle(row.status)}>{row.status}</Badge>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 rounded-b-2xl shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={selected.size === 0}
            onClick={handleSubmit}
            className="gap-1.5"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Submit Demand
            {selected.size > 0 && (
              <span className="ml-1 bg-white/20 rounded px-1.5 py-0.5 text-xs">
                {selected.size}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProjectPortfolio() {
  const location = useLocation();
  const navigate = useNavigate();

  const sendForApproval = location.state?.sendForApproval ?? false;
  const [viewRow, setViewRow] = useState<PortfolioRow | null>(null);
  const [showDemandDialog, setShowDemandDialog] = useState(false);
  const [rows, setRows] = useState<PortfolioRow[]>(SEED_ROWS);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const pendingRows = sendForApproval
    ? rows.filter((r) => !approvedIds.has(r.id) && !rejectedIds.has(r.id))
    : [];

  const handleApprove = (id: string) => {
    setApprovedIds((prev) => new Set([...prev, id]));
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)),
    );
  };

  const handleReject = (id: string) => {
    setRejectedIds((prev) => new Set([...prev, id]));
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r)),
    );
  };

  const handleDemandSubmit = (selected: PortfolioRow[]) => {
    // Wire your actual API call here
    console.log("Demand submitted for:", selected);
  };

  // KPI values
  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalCost = rows.reduce((s, r) => s + r.cost, 0);
  const totalBenefits = rows.reduce((s, r) => s + r.projectedBenefits, 0);
  const overBudgetCount = rows.filter((r) => r.variance < 0).length;
  const approvedCount = rows.filter(
    (r) => r.status === "Approved" || r.status === "Active",
  ).length;
  const canCreateDemand = approvedCount > 0;

  const kpiCards = [
    {
      label: "Total Budget",
      value: fmtShort(totalBudget),
      sub: "Across all projects",
      pct: Math.min(100, Math.round((totalCost / totalBudget) * 100)),
      barColor: "bg-blue-500",
      icon: <DollarSign className="w-4 h-4 text-blue-500" />,
      iconBg: "bg-blue-500/15",
    },
    {
      label: "Total Cost",
      value: fmtShort(totalCost),
      sub: `${Math.round((totalCost / totalBudget) * 100)}% of budget used`,
      pct: Math.min(100, Math.round((totalCost / totalBudget) * 100)),
      barColor: totalCost > totalBudget ? "bg-red-500" : "bg-amber-500",
      icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
      iconBg: "bg-amber-500/15",
    },
    {
      label: "Projected Benefits",
      value: fmtShort(totalBenefits),
      sub: "Expected return",
      pct: Math.min(100, Math.round((totalBenefits / (totalBudget * 2)) * 100)),
      barColor: "bg-green-500",
      icon: <BarChart3 className="w-4 h-4 text-green-500" />,
      iconBg: "bg-green-500/15",
    },
    {
      label: "Over Budget",
      value: String(overBudgetCount),
      sub: "Projects with negative variance",
      pct: Math.round((overBudgetCount / rows.length) * 100),
      barColor: "bg-red-500",
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      iconBg: "bg-red-500/15",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Modals */}
      {viewRow && (
        <ProjectDetailModal row={viewRow} onClose={() => setViewRow(null)} />
      )}
      {showDemandDialog && (
        <CreateDemandDialog
          rows={rows}
          onClose={() => setShowDemandDialog(false)}
          onSubmit={handleDemandSubmit}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-muted-foreground" />
          <div>
            <h1 className="text-xl font-semibold">Project Portfolio</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track budgets, costs, and approvals across all projects
            </p>
          </div>
          {sendForApproval && (
            <Badge className="bg-warning/15 text-warning border-0 ml-2">
              <Clock className="h-3 w-3 mr-1" />
              Pending Approval
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          className="gap-2"
          disabled={!canCreateDemand}
          onClick={() => setShowDemandDialog(true)}
          title={
            !canCreateDemand
              ? "At least one project must be approved to create demand"
              : undefined
          }
        >
          <PlusCircle className="h-4 w-4" />
          Create Demand
        </Button>
      </div>

      {/* Approval banner */}
      {sendForApproval && pendingRows.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
          <p className="text-sm text-foreground">
            <strong>{pendingRows.length}</strong> scenario(s) submitted for
            approval. Review each item below and approve or reject.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        {kpiCards.map((k) => (
          <div
            key={k.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                  {k.label}
                </p>
                <p className="text-xl font-bold text-foreground mt-1">
                  {k.value}
                </p>
              </div>
              <div
                className={`w-7 h-7 rounded-lg ${k.iconBg} flex items-center justify-center flex-shrink-0`}
              >
                {k.icon}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${k.barColor} rounded-full transition-all`}
                  style={{ width: `${k.pct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0 tabular-nums">
                {k.pct}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="w-[90px]">Project ID</TableHead>
                  <TableHead className="w-[180px]">Project</TableHead>
                  <TableHead className="w-[90px]">Priority</TableHead>
                  <TableHead>Project Owner</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">
                    Projected Benefits
                  </TableHead>
                  <TableHead>Status</TableHead>
                  {sendForApproval && (
                    <TableHead className="text-center w-[130px]">
                      Action
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const isApproved = approvedIds.has(row.id);
                  const isRejected = rejectedIds.has(row.id);
                  return (
                    <TableRow
                      key={row.id}
                      className={
                        isApproved
                          ? "bg-success/10"
                          : isRejected
                            ? "bg-destructive/10 opacity-60"
                            : ""
                      }
                    >
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {row.projectId}
                      </TableCell>
                      <TableCell
                        className="font-medium text-sm text-primary underline cursor-pointer hover:text-primary/80"
                        onClick={() => setViewRow(row)}
                      >
                        {row.project}
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityStyle(row.priority)}>
                          {row.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{row.owner}</TableCell>
                      <TableCell className="text-sm">{row.type}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.fromDate}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.toDate}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {fmt(row.budget)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {fmt(row.cost)}
                      </TableCell>
                      <TableCell
                        className={`text-right text-sm font-medium ${row.variance < 0 ? "text-destructive" : "text-success"}`}
                      >
                        {row.variance < 0
                          ? `-${fmt(Math.abs(row.variance))}`
                          : fmt(row.variance)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {fmt(row.projectedBenefits)}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyle(row.status)}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      {sendForApproval && (
                        <TableCell className="text-center">
                          {isApproved ? (
                            <span className="flex items-center justify-center gap-1 text-success text-xs font-medium">
                              <CheckCircle2 className="h-4 w-4" /> Approved
                            </span>
                          ) : isRejected ? (
                            <span className="flex items-center justify-center gap-1 text-destructive text-xs font-medium">
                              <XCircle className="h-4 w-4" /> Rejected
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs text-success border-success/30 hover:bg-success/10"
                                onClick={() => handleApprove(row.id)}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />{" "}
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={() => handleReject(row.id)}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
