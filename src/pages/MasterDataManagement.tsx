// src/pages/UserManagement.tsx  —  Lookup Management (v2)
import { useState } from "react";
import {
  Plus,
  Save,
  X,
  Shield,
  Settings2,
  ChevronDown,
  Eye,
  EyeOff,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/auth/useAuth";
import { useColumnConfig } from "@/store/useColumnConfig";

// ─── Page → Column definitions ───────────────────────────────────────────────

interface ColDef {
  id: string;
  label: string;
  required?: boolean;
}
interface PageDef {
  id: string;
  label: string;
  columns: ColDef[];
}

const PAGE_DEFS: PageDef[] = [
  {
    id: "resource_information",
    label: "Resource Information",
    columns: [
      { id: "resourceId", label: "Resource ID", required: true },
      { id: "name", label: "Name", required: true },
      { id: "level", label: "Level" },
      { id: "team", label: "Team / Pillar" },
      { id: "reportingManager", label: "Reporting Manager" },
      { id: "employeeType", label: "Employee Type" },
      { id: "availableDate", label: "Available Date" },
      { id: "skills", label: "Skills" },
      { id: "ratePerHr", label: "Rate / Hrs" },
      { id: "location", label: "Location" },
      { id: "status", label: "Status" },
      { id: "utilization", label: "Util %" },
    ],
  },
  {
    id: "demand_summary",
    label: "Demand Summary & Allocation",
    columns: [
      { id: "demandId", label: "Demand ID", required: true },
      { id: "projectName", label: "Project Name" },
      { id: "requiredRole", label: "Required Role" },
      { id: "budgetCode", label: "Budget Code" },
      { id: "pillar", label: "Pillar" },
      { id: "estimatedRate", label: "Estimated Rate" },
      { id: "forecastCY", label: "Current Year Forecast" },
      { id: "status", label: "Status" },
      { id: "action", label: "Action" },
    ],
  },
  {
    id: "allocation",
    label: "Allocation Details",
    columns: [
      { id: "projectId", label: "Project ID", required: true },
      { id: "project", label: "Project" },
      { id: "resourceId", label: "Resource ID" },
      { id: "resource", label: "Resource" },
      { id: "role", label: "Role" },
      { id: "allocationType", label: "Allocation Type" },
      { id: "allocPct", label: "Alloc %" },
      { id: "hrsPerWeek", label: "Hrs / Wk" },
      { id: "startDate", label: "Start" },
      { id: "endDate", label: "End" },
    ],
  },
  {
    id: "allocation_status",
    label: "Allocation Status",
    columns: [
      { id: "portfolio", label: "Portfolio", required: true },
      { id: "program", label: "Program" },
      { id: "projectName", label: "Project Name" },
      { id: "projectRole", label: "Project Role" },
      { id: "pillar", label: "Pillar" },
      { id: "budgetCode", label: "Budget Code" },
      { id: "workstream", label: "Workstream" },
      { id: "startDate", label: "Start Date" },
      { id: "endDate", label: "End Date" },
      { id: "noOfResources", label: "No. of Resources" },
      { id: "allocatedRes", label: "Allocated Resources" },
    ],
  },
  {
    id: "task_review",
    label: "Allocation Review & Approval",
    columns: [
      { id: "task", label: "Task", required: true },
      { id: "project", label: "Project" },
      { id: "assignedTo", label: "Assigned To" },
      { id: "dateSubmitted", label: "Date Submitted" },
      { id: "sprint", label: "Sprint" },
      { id: "allocation", label: "Allocation" },
      { id: "timeline", label: "Timeline" },
      { id: "actions", label: "Actions" },
    ],
  },
  {
    id: "resource_forecast",
    label: "Resource Forecast",
    columns: [
      { id: "portfolio", label: "Portfolio", required: true },
      { id: "program", label: "Program" },
      { id: "projectName", label: "Project" },
      { id: "requiredRole", label: "Required Role" },
      { id: "headcount", label: "HC" },
      { id: "startDate", label: "Start" },
      { id: "endDate", label: "End" },
      { id: "estimatedCost", label: "Est. Cost" },
      { id: "status", label: "Status" },
      { id: "actions", label: "Actions" },
    ],
  },
  {
    id: "audit_log",
    label: "Audit Log",
    columns: [
      { id: "timestamp", label: "Timestamp", required: true },
      { id: "resourceId", label: "Resource ID" },
      { id: "user", label: "User" },
      { id: "entity", label: "Entity" },
      { id: "action", label: "Action" },
      { id: "field", label: "Field" },
      { id: "oldValue", label: "Old Value" },
      { id: "newValue", label: "New Value" },
    ],
  },
  {
    id: "master_data",
    label: "Master Data Management",
    columns: [
      { id: "name", label: "Name", required: true },
      { id: "team", label: "Team / Pillar" },
      { id: "role", label: "Designation" },
      { id: "systemRole", label: "System Role" },
      { id: "email", label: "Email" },
      { id: "location", label: "Location" },
      { id: "experience", label: "Experience (yrs)" },
      { id: "skills", label: "Skills" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    columns: [
      { id: "taskName", label: "Task Name", required: true },
      { id: "type", label: "Type" },
      { id: "assignedTo", label: "Assigned To" },
      { id: "status", label: "Status" },
      { id: "priority", label: "Priority" },
      { id: "sprint", label: "Sprint" },
    ],
  },
  {
    id: "project_portfolio",
    label: "Project Portfolio",
    columns: [
      { id: "project", label: "Project", required: true },
      { id: "priority", label: "Priority" },
      { id: "owner", label: "Owner" },
      { id: "type", label: "Type" },
      { id: "status", label: "Status" },
      { id: "startDate", label: "Start Date" },
      { id: "endDate", label: "End Date" },
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    columns: [
      { id: "kpiDemands", label: "Total Demands", required: true },
      { id: "kpiAllocated", label: "Allocated" },
      { id: "kpiBench", label: "Bench Count" },
      { id: "kpiUtil", label: "Avg Utilization" },
      { id: "demandChart", label: "Demand Chart" },
      { id: "allocationChart", label: "Allocation Chart" },
      { id: "insightPanel", label: "Insights Panel" },
    ],
  },
  {
    id: "user_management",
    label: "User Management",
    columns: [
      { id: "email", label: "Email", required: true },
      { id: "name", label: "Name" },
      { id: "pillar", label: "Pillar" },
      { id: "systemRole", label: "System Role" },
      { id: "actions", label: "Actions" },
    ],
  },
];

// ─── Per-page row state ───────────────────────────────────────────────────────

interface ColRow {
  colId: string;
  isActive: boolean; // visible / enabled
  sequence: number;
  description: string;
}

function initRows(pageDef: PageDef): ColRow[] {
  return pageDef.columns.map((c, i) => ({
    colId: c.id,
    isActive: true,
    sequence: i + 1,
    description: "",
  }));
}

type PageRowState = Record<string, ColRow[]>;

function buildInitialState(): PageRowState {
  const s: PageRowState = {};
  PAGE_DEFS.forEach((p) => {
    s[p.id] = initRows(p);
  });
  return s;
}

// ─── Add Column Modal ─────────────────────────────────────────────────────────

function AddColumnModal({
  onAdd,
  onClose,
  existingIds,
}: {
  onAdd: (label: string) => void;
  onClose: () => void;
  existingIds: string[];
}) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    const t = name.trim();
    if (!t) {
      setErr("Column name is required.");
      return;
    }
    const newId = t.toLowerCase().replace(/\s+/g, "_");
    if (existingIds.includes(newId)) {
      setErr("Column already exists.");
      return;
    }
    onAdd(t);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Add New Column
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Added to the current page's column list.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5">
          <label className="block text-xs font-medium text-foreground mb-1">
            Column Name <span className="text-destructive">*</span>
          </label>
          <input
            autoFocus
            className={`w-full rounded-lg border px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${err ? "border-destructive" : "border-border"}`}
            placeholder="e.g. Region, Category..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErr("");
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {err && <p className="text-xs text-destructive mt-1">{err}</p>}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Column
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Manage Visibility Modal ──────────────────────────────────────────────────

function VisibilityModal({
  pageId,
  columns,
  rows,
  onClose,
  onSave,
}: {
  pageId: string;
  columns: ColDef[];
  rows: ColRow[];
  onClose: () => void;
  onSave: (updated: ColRow[]) => void;
}) {
  const [local, setLocal] = useState<ColRow[]>(rows.map((r) => ({ ...r })));
  const toggle = (colId: string) =>
    setLocal((prev) =>
      prev.map((r) =>
        r.colId === colId ? { ...r, isActive: !r.isActive } : r,
      ),
    );
  const hiddenCount = local.filter((r) => !r.isActive).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Manage Column Visibility
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggle which columns appear on this page.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {local.map((row) => {
            const col = columns.find((c) => c.id === row.colId);
            if (!col) return null;
            return (
              <div
                key={row.colId}
                className="flex items-center justify-between py-2 px-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {row.isActive ? (
                    <Eye className="h-4 w-4 text-primary" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground/50" />
                  )}
                  <span
                    className={`text-sm ${!row.isActive ? "text-muted-foreground line-through" : "text-foreground"}`}
                  >
                    {col.label}
                  </span>
                  {col.required && (
                    <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5">
                      required
                    </span>
                  )}
                </div>
                <button
                  onClick={() => !col.required && toggle(row.colId)}
                  disabled={col.required}
                  className={`h-7 px-3 rounded-md text-xs font-medium transition-colors ${col.required ? "opacity-40 cursor-not-allowed bg-muted text-muted-foreground" : row.isActive ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
                >
                  {col.required
                    ? "Required"
                    : row.isActive
                      ? "Disable"
                      : "Enable"}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-muted/40 shrink-0">
          <p className="text-xs text-muted-foreground">
            {hiddenCount} column{hiddenCount !== 1 ? "s" : ""} hidden
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(local)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Check className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UserManagement() {
  const { user } = useAuth();
  const { updateColumns } = useColumnConfig();

  const [selectedPageId, setSelectedPageId] = useState(PAGE_DEFS[0].id);
  const [pageRowState, setPageRowState] =
    useState<PageRowState>(buildInitialState);
  const [customCols, setCustomCols] = useState<Record<string, ColDef[]>>({});

  const [showAddCol, setShowAddCol] = useState(false);
  const [showVisibility, setShowVisibility] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ColDef | null>(null);

  if (user?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Shield className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">Access Restricted</p>
        <p className="text-xs text-muted-foreground">
          This page is only accessible to Super Admins.
        </p>
      </div>
    );
  }

  const pageDef = PAGE_DEFS.find((p) => p.id === selectedPageId)!;
  const allColumns: ColDef[] = [
    ...pageDef.columns,
    ...(customCols[selectedPageId] ?? []),
  ];
  const rows = pageRowState[selectedPageId] ?? [];

  const updateCell = (
    colId: string,
    field: "sequence" | "description",
    value: string,
  ) => {
    setPageRowState((prev) => ({
      ...prev,
      [selectedPageId]: prev[selectedPageId].map((r) =>
        r.colId === colId ? { ...r, [field]: value } : r,
      ),
    }));
  };

  const toggleActive = (colId: string) => {
    setPageRowState((prev) => ({
      ...prev,
      [selectedPageId]: prev[selectedPageId].map((r) =>
        r.colId === colId ? { ...r, isActive: !r.isActive } : r,
      ),
    }));
  };

  const addColumn = (label: string) => {
    const id = label.toLowerCase().replace(/\s+/g, "_") + "_custom";
    const newCol: ColDef = { id, label };
    setCustomCols((prev) => ({
      ...prev,
      [selectedPageId]: [...(prev[selectedPageId] ?? []), newCol],
    }));
    setPageRowState((prev) => ({
      ...prev,
      [selectedPageId]: [
        ...prev[selectedPageId],
        {
          colId: id,
          isActive: true,
          sequence: prev[selectedPageId].length + 1,
          description: "",
        },
      ],
    }));
    setShowAddCol(false);
  };

  const deleteCustomCol = (col: ColDef) => {
    setCustomCols((prev) => ({
      ...prev,
      [selectedPageId]: (prev[selectedPageId] ?? []).filter(
        (c) => c.id !== col.id,
      ),
    }));
    setPageRowState((prev) => ({
      ...prev,
      [selectedPageId]: prev[selectedPageId].filter((r) => r.colId !== col.id),
    }));
    setDeleteTarget(null);
  };

  const handleSave = () => {
    const enabledCols = allColumns
      .filter((c) => rows.find((r) => r.colId === c.id)?.isActive !== false)
      .map((c) => c.label);
    updateColumns(selectedPageId, enabledCols);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleVisibilitySave = (updated: ColRow[]) => {
    setPageRowState((prev) => ({ ...prev, [selectedPageId]: updated }));
    setShowVisibility(false);
    const enabledCols = allColumns
      .filter((c) => updated.find((r) => r.colId === c.id)?.isActive !== false)
      .map((c) => c.label);
    updateColumns(selectedPageId, enabledCols);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const isCustomCol = (colId: string) =>
    (customCols[selectedPageId] ?? []).some((c) => c.id === colId);

  const activeCount = rows.filter((r) => r.isActive).length;

  return (
    <div className="h-[calc(100vh-110px)] flex flex-col gap-4">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Lookup Management
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure columns and visibility per page.
            </p>
          </div>
        </div>
        {savedBanner && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-700 dark:text-green-300 text-sm font-medium">
            <Check className="h-4 w-4" /> Saved successfully
          </div>
        )}
      </div>

      <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          {/* Controls row */}
          <div className="shrink-0 flex flex-wrap items-end gap-4 px-5 pt-5 pb-4 border-b border-border bg-muted/20">
            <div className="flex flex-col gap-1 min-w-[260px]">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Lookup Type
              </label>
              <div className="relative">
                <select
                  value={selectedPageId}
                  onChange={(e) => setSelectedPageId(e.target.value)}
                  className="appearance-none w-full h-10 pl-3 pr-9 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                >
                  {PAGE_DEFS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowAddCol(true)}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Plus className="h-4 w-4" /> Add New
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
              >
                <Save className="h-4 w-4" /> Save
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted/60 border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-14 border-r border-border/50">
                    SR NO.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24 border-r border-border/50">
                    IS ACTIVE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/50">
                    NAME
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28 border-r border-border/50">
                    VALUE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28 border-r border-border/50">
                    SEQUENCE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/50">
                    DESCRIPTION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-10"></th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      No columns found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, idx) => {
                    const col = allColumns.find((c) => c.id === row.colId);
                    if (!col) return null;
                    const isCustom = isCustomCol(row.colId);
                    return (
                      <tr
                        key={row.colId}
                        className={`border-b border-border/40 transition-colors ${row.isActive ? "hover:bg-accent/20" : "opacity-50 bg-muted/10"}`}
                      >
                        {/* Sr No */}
                        <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground border-r border-border/30">
                          {idx + 1}
                        </td>

                        {/* Is Active toggle */}
                        <td className="px-4 py-2.5 border-r border-border/30">
                          <button
                            onClick={() =>
                              !col.required && toggleActive(row.colId)
                            }
                            disabled={col.required}
                            title={
                              col.required
                                ? "Required — cannot disable"
                                : row.isActive
                                  ? "Click to disable"
                                  : "Click to enable"
                            }
                            className={`h-6 w-10 rounded-full transition-colors relative ${col.required ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${row.isActive ? "bg-primary" : "bg-muted border border-border"}`}
                          >
                            <span
                              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${row.isActive ? "left-[18px]" : "left-0.5"}`}
                            />
                          </button>
                        </td>

                        {/* Name */}
                        <td className="px-4 py-2.5 border-r border-border/30">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${row.isActive ? "text-foreground" : "text-muted-foreground line-through"}`}
                            >
                              {col.label}
                            </span>
                            {col.required && (
                              <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5">
                                required
                              </span>
                            )}
                            {isCustom && (
                              <span className="text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded px-1.5 py-0.5">
                                custom
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Value (read-only key) */}
                        <td className="px-4 py-2.5 border-r border-border/30">
                          <span className="text-xs font-mono text-muted-foreground">
                            {col.id}
                          </span>
                        </td>

                        {/* Sequence */}
                        <td className="px-2 py-1.5 border-r border-border/30">
                          <input
                            type="number"
                            value={row.sequence}
                            onChange={(e) =>
                              updateCell(row.colId, "sequence", e.target.value)
                            }
                            disabled={!row.isActive}
                            className="w-20 px-2.5 py-1.5 rounded-md text-sm bg-transparent border border-transparent hover:border-border focus:border-primary focus:bg-card focus:outline-none transition-colors text-foreground"
                          />
                        </td>

                        {/* Description */}
                        <td className="px-2 py-1.5 border-r border-border/30">
                          <input
                            value={row.description}
                            onChange={(e) =>
                              updateCell(
                                row.colId,
                                "description",
                                e.target.value,
                              )
                            }
                            disabled={!row.isActive}
                            placeholder="—"
                            className="w-full min-w-[140px] px-2.5 py-1.5 rounded-md text-sm bg-transparent border border-transparent hover:border-border focus:border-primary focus:bg-card focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/40"
                          />
                        </td>

                        {/* Delete (custom only) */}
                        <td className="px-2 py-2.5 text-center">
                          {isCustom && (
                            <button
                              onClick={() => setDeleteTarget(col)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors mx-auto"
                              title="Delete custom column"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="shrink-0 px-5 py-3 border-t border-border bg-muted/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing columns for{" "}
              <span className="font-medium text-foreground">
                {pageDef.label}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {activeCount} active / {rows.length} total columns
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showAddCol && (
        <AddColumnModal
          onAdd={addColumn}
          onClose={() => setShowAddCol(false)}
          existingIds={allColumns.map((c) => c.id)}
        />
      )}

      {showVisibility && (
        <VisibilityModal
          pageId={selectedPageId}
          columns={allColumns}
          rows={rows}
          onClose={() => setShowVisibility(false)}
          onSave={handleVisibilitySave}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Delete Column
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Delete the custom column{" "}
              <span className="font-semibold text-foreground">
                "{deleteTarget.label}"
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCustomCol(deleteTarget)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
