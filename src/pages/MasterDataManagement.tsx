// src/pages/MasterDataManagement.tsx
import { useState } from "react";
import {
  Eye, EyeOff, RotateCcw, Save, ChevronDown, ChevronRight,
  Database, Plus, X, AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ColumnDef {
  key: string;
  label: string;
  visible: boolean;
  required?: boolean;  // cannot be hidden
  custom?: boolean;    // added by super admin — can be deleted
}

interface PageConfig {
  id: string;
  label: string;
  description: string;
  columns: ColumnDef[];
}

// ─── Add-column form state (one per page) ──────────────────────────────────────

interface AddFormState {
  open: boolean;
  label: string;
  key: string;
  labelTouched: boolean;
  keyTouched: boolean;
}

const emptyForm = (): AddFormState => ({
  open: false,
  label: "",
  key: "",
  labelTouched: false,
  keyTouched: false,
});

// ─── Default pages ─────────────────────────────────────────────────────────────

const DEFAULT_PAGES: PageConfig[] = [
  {
    id: "resources",
    label: "Resource Information",
    description: "Columns shown in the Resource Information table",
    columns: [
      { key: "name",       label: "Name",            visible: true,  required: true },
      { key: "team",       label: "Team / Pillar",    visible: true  },
      { key: "role",       label: "Designation",      visible: true  },
      { key: "systemRole", label: "System Role",      visible: true  },
      { key: "email",      label: "Email",            visible: true  },
      { key: "location",   label: "Location",         visible: true  },
      { key: "experience", label: "Experience (yrs)", visible: false },
      { key: "skills",     label: "Skills",           visible: false },
    ],
  },
  {
    id: "demand",
    label: "Demand Summary & Allocation",
    description: "Columns shown in the Demand Summary table",
    columns: [
      { key: "demandId",    label: "Demand ID",    visible: true,  required: true },
      { key: "project",     label: "Project",      visible: true  },
      { key: "role",        label: "Role",         visible: true  },
      { key: "startDate",   label: "Start Date",   visible: true  },
      { key: "endDate",     label: "End Date",     visible: true  },
      { key: "status",      label: "Status",       visible: true  },
      { key: "allocatedTo", label: "Allocated To", visible: true  },
      { key: "pillar",      label: "Pillar",       visible: false },
      { key: "priority",    label: "Priority",     visible: false },
    ],
  },
  {
    id: "allocation",
    label: "Allocation Details",
    description: "Columns shown in the Allocation Details table",
    columns: [
      { key: "resource",      label: "Resource",      visible: true,  required: true },
      { key: "project",       label: "Project",       visible: true  },
      { key: "allocationPct", label: "Allocation %",  visible: true  },
      { key: "startDate",     label: "Start Date",    visible: true  },
      { key: "endDate",       label: "End Date",      visible: true  },
      { key: "status",        label: "Status",        visible: true  },
      { key: "manager",       label: "Manager",       visible: false },
      { key: "remarks",       label: "Remarks",       visible: false },
    ],
  },
  {
    id: "demand-status",
    label: "Allocation Status",
    description: "Columns shown in the Allocation Status table",
    columns: [
      { key: "resource",   label: "Resource",    visible: true,  required: true },
      { key: "demandId",   label: "Demand ID",   visible: true  },
      { key: "project",    label: "Project",     visible: true  },
      { key: "status",     label: "Status",      visible: true  },
      { key: "approvedBy", label: "Approved By", visible: true  },
      { key: "date",       label: "Date",        visible: false },
    ],
  },
  {
    id: "resource-review",
    label: "Allocation Review & Approval",
    description: "Columns shown in the Resource Review table",
    columns: [
      { key: "resource",    label: "Resource",     visible: true,  required: true },
      { key: "demandId",    label: "Demand ID",    visible: true  },
      { key: "requestedBy", label: "Requested By", visible: true  },
      { key: "project",     label: "Project",      visible: true  },
      { key: "startDate",   label: "Start Date",   visible: true  },
      { key: "endDate",     label: "End Date",     visible: true  },
      { key: "status",      label: "Status",       visible: true  },
      { key: "comments",    label: "Comments",     visible: false },
    ],
  },
  {
    id: "projects",
    label: "Projects & Assign Task",
    description: "Columns shown in the Projects table",
    columns: [
      { key: "projectName", label: "Project Name", visible: true,  required: true },
      { key: "client",      label: "Client",       visible: true  },
      { key: "startDate",   label: "Start Date",   visible: true  },
      { key: "endDate",     label: "End Date",     visible: true  },
      { key: "status",      label: "Status",       visible: true  },
      { key: "manager",     label: "Manager",      visible: true  },
      { key: "pillar",      label: "Pillar",       visible: false },
      { key: "budget",      label: "Budget",       visible: false },
    ],
  },
  {
    id: "audit-log",
    label: "Audit Log",
    description: "Columns shown in the Audit Log table",
    columns: [
      { key: "timestamp", label: "Timestamp", visible: true,  required: true },
      { key: "user",      label: "User",      visible: true  },
      { key: "action",    label: "Action",    visible: true  },
      { key: "module",    label: "Module",    visible: true  },
      { key: "details",   label: "Details",   visible: true  },
      { key: "ipAddress", label: "IP Address",visible: false },
    ],
  },
  {
    id: "reports",
    label: "Reporting & Analytics",
    description: "Columns shown in the Reporting table",
    columns: [
      { key: "metric",    label: "Metric",    visible: true,  required: true },
      { key: "value",     label: "Value",     visible: true  },
      { key: "period",    label: "Period",    visible: true  },
      { key: "pillar",    label: "Pillar",    visible: true  },
      { key: "trend",     label: "Trend",     visible: false },
      { key: "benchmark", label: "Benchmark", visible: false },
    ],
  },
];

// ─── Persistence ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "rmd_column_config";

interface StoredPage {
  columns: { key: string; label: string; visible: boolean; custom?: boolean }[];
}

function loadConfig(): PageConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PAGES;
    const saved = JSON.parse(raw) as Record<string, StoredPage>;

    return DEFAULT_PAGES.map((page) => {
      const savedPage = saved[page.id];
      if (!savedPage) return page;

      // Merge visibility for default columns
      const mergedDefaults = page.columns.map((col) => {
        const savedCol = savedPage.columns.find((c) => c.key === col.key);
        return savedCol ? { ...col, visible: savedCol.visible } : col;
      });

      // Append custom columns that were added by the super admin
      const customCols = savedPage.columns.filter((c) => c.custom);

      return { ...page, columns: [...mergedDefaults, ...customCols] };
    });
  } catch {
    return DEFAULT_PAGES;
  }
}

function saveConfig(pages: PageConfig[]) {
  const out: Record<string, StoredPage> = {};
  pages.forEach((page) => {
    out[page.id] = {
      columns: page.columns.map((col) => ({
        key: col.key,
        label: col.label,
        visible: col.visible,
        ...(col.custom ? { custom: true } : {}),
      })),
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Convert a human label into a camelCase key, e.g. "Start Date" → "startDate" */
function labelToKey(label: string): string {
  return label
    .trim()
    .split(/\s+/)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function MasterDataManagement() {
  const [pages, setPages] = useState<PageConfig[]>(loadConfig);
  const [expandedPage, setExpandedPage] = useState<string | null>(pages[0]?.id ?? null);
  const [savedBanner, setSavedBanner] = useState(false);

  // One add-form per page, keyed by page id
  const [addForms, setAddForms] = useState<Record<string, AddFormState>>(() =>
    Object.fromEntries(DEFAULT_PAGES.map((p) => [p.id, emptyForm()]))
  );

  // ── Column visibility toggle ──────────────────────────────────────────────────
  const toggleColumn = (pageId: string, colKey: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id !== pageId
          ? page
          : {
              ...page,
              columns: page.columns.map((col) =>
                col.key === colKey && !col.required
                  ? { ...col, visible: !col.visible }
                  : col
              ),
            }
      )
    );
  };

  // ── Delete a custom column ────────────────────────────────────────────────────
  const deleteColumn = (pageId: string, colKey: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id !== pageId
          ? page
          : { ...page, columns: page.columns.filter((col) => col.key !== colKey) }
      )
    );
  };

  // ── Reset page to defaults ────────────────────────────────────────────────────
  const resetPage = (pageId: string) => {
    const defaults = DEFAULT_PAGES.find((p) => p.id === pageId);
    if (!defaults) return;
    setPages((prev) =>
      prev.map((page) => (page.id === pageId ? { ...page, columns: defaults.columns } : page))
    );
  };

  // ── Add-form field updates ────────────────────────────────────────────────────
  const updateForm = (pageId: string, patch: Partial<AddFormState>) => {
    setAddForms((prev) => ({ ...prev, [pageId]: { ...prev[pageId], ...patch } }));
  };

  const openAddForm = (pageId: string) => {
    updateForm(pageId, { open: true, label: "", key: "", labelTouched: false, keyTouched: false });
  };

  const closeAddForm = (pageId: string) => {
    updateForm(pageId, emptyForm());
  };

  // Auto-derive key from label while user types (unless they've manually edited key)
  const handleLabelChange = (pageId: string, value: string) => {
    const form = addForms[pageId];
    const derivedKey = labelToKey(value);
    // Only auto-fill key if the user hasn't manually touched the key field
    updateForm(pageId, {
      label: value,
      labelTouched: true,
      key: form.keyTouched ? form.key : derivedKey,
    });
  };

  const handleKeyChange = (pageId: string, value: string) => {
    // Allow only alphanumeric + underscore, no spaces
    const sanitised = value.replace(/[^a-zA-Z0-9_]/g, "");
    updateForm(pageId, { key: sanitised, keyTouched: true });
  };

  // ── Validation ────────────────────────────────────────────────────────────────
  const getFormErrors = (pageId: string) => {
    const form = addForms[pageId];
    const page = pages.find((p) => p.id === pageId);
    const errors: { label?: string; key?: string } = {};

    if (form.labelTouched && !form.label.trim()) {
      errors.label = "Column name is required.";
    }
    if (form.keyTouched && !form.key.trim()) {
      errors.key = "Data Type is required.";
    }
    if (form.key && page?.columns.some((c) => c.key === form.key)) {
      errors.key = "A column with this key already exists.";
    }
    return errors;
  };

  // ── Submit new column ─────────────────────────────────────────────────────────
  const submitAddColumn = (pageId: string) => {
    const form = addForms[pageId];
    // Force-touch both fields so errors show
    updateForm(pageId, { labelTouched: true, keyTouched: true });

    const page = pages.find((p) => p.id === pageId);
    if (!form.label.trim() || !form.key.trim()) return;
    if (page?.columns.some((c) => c.key === form.key)) return;

    const newCol: ColumnDef = {
      key: form.key,
      label: form.label.trim(),
      visible: true,
      custom: true,
    };

    setPages((prev) =>
      prev.map((p) =>
        p.id !== pageId ? p : { ...p, columns: [...p.columns, newCol] }
      )
    );

    closeAddForm(pageId);
  };

  // ── Save ──────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    saveConfig(pages);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const visibleCount = (page: PageConfig) => page.columns.filter((c) => c.visible).length;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-muted-foreground" />
          <div>
            <h1 className="text-xl font-semibold">Master Data Management</h1>
            <p className="text-sm text-muted-foreground">
              Control which columns are visible on each page, and add custom columns.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedBanner && (
            <span className="text-sm text-green-600 font-medium animate-in fade-in">
              ✓ Changes saved
            </span>
          )}
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </div>

      {/* ── Page List ── */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {pages.map((page) => {
          const isOpen   = expandedPage === page.id;
          const form     = addForms[page.id] ?? emptyForm();
          const errors   = getFormErrors(page.id);
          const hasError = Object.keys(errors).length > 0;

          return (
            <Card key={page.id} className="overflow-hidden">

              {/* ── Accordion Header ── */}
              <CardHeader
                className="py-3 px-4 cursor-pointer select-none hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedPage(isOpen ? null : page.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isOpen
                      ? <ChevronDown  className="h-4 w-4 text-muted-foreground" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    <CardTitle className="text-sm font-medium">{page.label}</CardTitle>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {page.description}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {visibleCount(page)} / {page.columns.length} visible
                  </Badge>
                </div>
              </CardHeader>

              {/* ── Accordion Body ── */}
              {isOpen && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="border-t pt-3 space-y-3">

                    {/* Column toggle grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {page.columns.map((col) => (
                        <div key={col.key} className="relative group/col">
                          <button
                            onClick={() => toggleColumn(page.id, col.key)}
                            disabled={col.required}
                            className={`
                              w-full flex items-center gap-2 px-3 py-2 rounded-md border text-sm text-left
                              transition-colors
                              ${col.visible
                                ? "bg-primary/5 border-primary/30 text-foreground"
                                : "bg-muted/30 border-transparent text-muted-foreground"}
                              ${col.required
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer hover:border-primary/50"}
                              ${col.custom ? "pr-8" : ""}
                            `}
                          >
                            {col.visible
                              ? <Eye    className="h-3.5 w-3.5 shrink-0 text-primary" />
                              : <EyeOff className="h-3.5 w-3.5 shrink-0" />}
                            <span className="truncate flex-1">{col.label}</span>
                            {col.required && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1 shrink-0">
                                required
                              </Badge>
                            )}
                            {col.custom && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1 shrink-0 border-blue-300 text-blue-600">
                                custom
                              </Badge>
                            )}
                          </button>

                          {/* Delete button — only for custom columns */}
                          {col.custom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteColumn(page.id, col.key);
                              }}
                              title="Remove column"
                              className="
                                absolute right-1.5 top-1/2 -translate-y-1/2
                                opacity-0 group-hover/col:opacity-100
                                transition-opacity
                                p-0.5 rounded
                                text-muted-foreground hover:text-destructive hover:bg-destructive/10
                              "
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* ── Add Column Form / Trigger ── */}
                    {!form.open ? (
                      <button
                        onClick={() => openAddForm(page.id)}
                        className="
                          flex items-center gap-1.5 text-xs text-muted-foreground
                          hover:text-foreground transition-colors
                          border border-dashed border-muted-foreground/30
                          hover:border-muted-foreground/60
                          rounded-md px-3 py-2 w-full justify-center
                        "
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add new column
                      </button>
                    ) : (
                      <div className="border rounded-md p-3 bg-muted/20 space-y-3">
                        <p className="text-xs font-medium text-foreground">New Column</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Column Name */}
                          <div className="space-y-1">
                            <Label className="text-xs">
                              Column Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              value={form.label}
                              onChange={(e) => handleLabelChange(page.id, e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && submitAddColumn(page.id)}
                              placeholder="e.g. Cost Centre"
                              className="h-8 text-sm"
                              autoFocus
                            />
                            {form.labelTouched && errors.label && (
                              <p className="flex items-center gap-1 text-[11px] text-destructive">
                                <AlertCircle className="h-3 w-3" /> {errors.label}
                              </p>
                            )}
                          </div>

                          {/* Column Key */}
                          <div className="space-y-1">
                            <Label className="text-xs">
                              Data Type <span className="text-destructive">*</span>
                              <span className="text-muted-foreground font-normal ml-1">(auto-filled)</span>
                            </Label>
                            <Input
                              value={form.key}
                              onChange={(e) => handleKeyChange(page.id, e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && submitAddColumn(page.id)}
                              placeholder="e.g. costCentre"
                              className="h-8 text-sm font-mono"
                            />
                            {form.keyTouched && errors.key && (
                              <p className="flex items-center gap-1 text-[11px] text-destructive">
                                <AlertCircle className="h-3 w-3" /> {errors.key}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Form actions */}
                        <div className="flex items-center gap-2 justify-end pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => closeAddForm(page.id)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1"
                            disabled={hasError && (form.labelTouched || form.keyTouched)}
                            onClick={() => submitAddColumn(page.id)}
                          >
                            <Plus className="h-3 w-3" />
                            Add Column
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Reset link */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => resetPage(page.id)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset to defaults
                      </button>
                    </div>

                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
