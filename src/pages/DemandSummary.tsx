import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useActiveValues } from "@/store/useMasterData";
import type { Demand } from "@/store/useStore";
import { ResourceDialog } from "@/pages/Resource";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  History,
  Search,
  Download,
  Upload,
  Plus,
  Users,
} from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import HistoryModal from "@/components/HistoryModal";
import { toast } from "sonner";
import type { DemandForm } from "./CreateDemand";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImportSource =
  | "Excel"
  | "Jira"
  | "Planisware"
  | "Smartsheets"
  | "Connected Source";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusColor = (s: string) => {
  switch (s) {
    case "Approved":
      return "default";
    case "Pending":
      return "outline";
    case "Rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = vals[i] || "";
    });
    return row;
  });
}

function mapRowToDemand(row: Record<string, string>): DemandForm | null {
  const projectName =
    row["Project Name"] || row["Project"] || row["projectName"] || "";
  const pillar = row["Pillar"] || row["pillar"] || "";
  if (!projectName && !pillar) return null;
  return {
    portfolio: row["Portfolio"] || pillar || "Hi-tech",
    program: row["Program"] || "Enterprise",
    projectName,
    projectRole: row["Project Role"] || row["Role"] || "",
    budgetCode: row["Budget Code"] || row["budgetCode"] || "",
    pillar,
    allocationPercent: parseFloat(row["Allocation (%)"] || "0") || 0,
    status: "Pending",
    comments: row["Comments"] || "",
    identified: (row["Identified"] || "").toLowerCase() === "yes",
    estimatedRate: parseFloat(row["Estimated Rate"] || "0") || 0,
    currentYearForecast: parseFloat(row["Current Year Forecast"] || "0") || 0,
    resourceName: row["Resource Name"] || "",
    workstream: row["Workstream"] || "",
    subTeam: row["Sub Team"] || "",
    startDate: row["Start Date"] || "",
    endDate: row["End Date"] || "",
    type: (row["Type"] || "Internal") as "Internal" | "External",
    vendorName: row["Vendor Name"] || "",
    country: row["Country"] || row["Location"] || "Sydney",
    allocation: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
    forecast: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DemandSummary() {
  const navigate = useNavigate();
  const { demands, addDemands, deleteDemand } = useStore();
  const projects = useActiveValues("projects");
  const pillars = useActiveValues("pillars");
  const roles = useActiveValues("roles");
  const locationOpts = useActiveValues("countries");

  const [showAdvSearch, setShowAdvSearch] = useState(false);
  const [fProject, setFProject] = useState("all");
  const [fRole, setFRole] = useState("all");
  const [fPillar, setFPillar] = useState("all");
  const [fStatus, setFStatus] = useState("all");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Demand["history"] | null>(
    null,
  );

  const [resourceModal, setResourceModal] = useState<{
    open: boolean;
    demandId: string;
    projectName: string;
    projectSkills: string[];
  }>({ open: false, demandId: "", projectName: "", projectSkills: [] });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importChooserOpen, setImportChooserOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importPreview, setImportPreview] = useState<DemandForm[]>([]);
  const [importSource, setImportSource] = useState<ImportSource>("Excel");

  const filtered = useMemo(
    () =>
      demands.filter(
        (d) =>
          (fProject === "all" || d.projectName === fProject) &&
          (fRole === "all" || d.projectRole === fRole) &&
          (fPillar === "all" || d.pillar === fPillar) &&
          (fStatus === "all" || d.status === fStatus),
      ),
    [demands, fProject, fRole, fPillar, fStatus],
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteDemand(deleteId);
      toast.success("Demand deleted");
      setDeleteId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "xlsx") {
      toast.error("Please upload .csv or .xlsx");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const mapped = parseCSV(ev.target?.result as string)
          .map(mapRowToDemand)
          .filter(Boolean) as DemandForm[];
        if (!mapped.length) {
          toast.error("No valid rows found");
          return;
        }
        setImportPreview(mapped);
        setShowImport(true);
      } catch {
        toast.error("Error parsing file");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fetchFromExternal = (source: Exclude<ImportSource, "Excel">) => {
    setImportSource(source);
    const safeProjects = projects.length ? projects : ["Cloud Enablement"];
    const safeRoles = roles.length ? roles : ["Project Manager"];
    const safePillars = pillars.length ? pillars : ["Hi-tech"];
    const safeLocations = locationOpts.length ? locationOpts : ["Sydney"];
    const cfg: Record<string, { count: number; prefix: string }> = {
      Jira: { count: 4, prefix: "JIRA" },
      Planisware: { count: 5, prefix: "PLNS" },
      Smartsheets: { count: 3, prefix: "SMRT" },
      "Connected Source": { count: 6, prefix: "API" },
    };
    const { count, prefix } = cfg[source];
    const rows: DemandForm[] = Array.from({ length: count }, (_, i) => ({
      portfolio: safePillars[i % safePillars.length],
      program: "Enterprise",
      projectName: safeProjects[i % safeProjects.length],
      projectRole: safeRoles[i % safeRoles.length],
      budgetCode: `${prefix}-${1000 + i}`,
      pillar: safePillars[i % safePillars.length],
      allocationPercent: 100,
      status: "Pending" as const,
      comments: `Imported from ${source}`,
      identified: false,
      estimatedRate: 110 + i * 5,
      currentYearForecast: 80000 + i * 12000,
      resourceName: "",
      workstream: `WS-${(i % 3) + 1}`,
      subTeam: "",
      startDate: "2027-04-01",
      endDate: "2027-12-31",
      type: "Internal" as const,
      vendorName: "",
      country: safeLocations[i % safeLocations.length],
      allocation: { current: 1, y2027: 1, y2028: 0, y2029: 0, y2030: 0 },
      forecast: {
        current: 80000 + i * 12000,
        y2027: 80000 + i * 12000,
        y2028: 0,
        y2029: 0,
        y2030: 0,
      },
    }));
    toast.info(`Fetching from ${source}...`);
    setTimeout(() => {
      setImportPreview(rows);
      setImportChooserOpen(false);
      setShowImport(true);
    }, 600);
  };

  const triggerExcelUpload = () => {
    setImportSource("Excel");
    setImportChooserOpen(false);
    fileInputRef.current?.click();
  };

  const confirmImport = () => {
    const existingKeys = new Set(
      demands.map((d) => `${d.projectName}|${d.projectRole}|${d.resourceName}`),
    );
    const fresh = importPreview.filter(
      (r) =>
        !existingKeys.has(
          `${r.projectName}|${r.projectRole}|${r.resourceName}`,
        ),
    );
    const dropped = importPreview.length - fresh.length;
    if (!fresh.length) {
      toast.error("All rows are duplicates");
      return;
    }
    addDemands(fresh);
    toast.success(
      `${fresh.length} demand(s) imported${dropped ? ` (${dropped} skipped)` : ""}`,
    );
    setShowImport(false);
    setImportPreview([]);
  };

  // ── Columns ──────────────────────────────────────────────────────────────────
  const columns: Column<Demand>[] = [
    {
      key: "id",
      header: "Project ID",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.id.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    { key: "projectName", header: "Project Name" },
    {
      key: "projectRole",
      header: "Required Skills",
      render: (row) =>
        row.projectRole ? (
          <Badge variant="secondary" className="text-xs">
            {row.projectRole}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    { key: "budgetCode", header: "Budget Code" },
    {
      key: "pillar",
      header: "Domain / Pillar",
      render: (row) => <Badge variant="outline">{row.pillar}</Badge>,
    },
    {
      key: "resourceName",
      header: "No. of Resources",
      sortable: false,
      render: (row) => {
        const count = row.resourceName ? 2 : 0;
        return (
          <button
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
            onClick={() =>
              setResourceModal({
                open: true,
                demandId: row.id,
                projectName: row.projectName,
                projectSkills: row.projectRole ? [row.projectRole] : [],
              })
            }
          >
            <Users className="h-3 w-3" />
            {count}
          </button>
        );
      },
    },
    {
      key: "estimatedRate",
      header: "Estimated Rate",
      render: (row) =>
        row.estimatedRate ? `$${row.estimatedRate.toFixed(2)}` : "—",
    },
    {
      key: "currentYearForecast",
      header: "Current Year Forecast",
      render: (row) =>
        row.currentYearForecast
          ? `$${row.currentYearForecast.toLocaleString()}`
          : "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusColor(row.status)}>{row.status}</Badge>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: false,
      render: (row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => navigate(`/demand/create?id=${row.id}`)}
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive"
            onClick={() => setDeleteId(row.id)}
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setHistoryData(row.history)}
            title="History"
          >
            <History className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Demand Summary</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => navigate("/demand/create")}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setImportChooserOpen(true)}
            >
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowAdvSearch(!showAdvSearch)}
            >
              <Search className="h-4 w-4 mr-1" />
              Advance Search
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {showAdvSearch && (
            <div className="border rounded-md p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <FilterSelect
                label="Project"
                value={fProject}
                onChange={setFProject}
                options={projects}
              />
              <FilterSelect
                label="Required Skills"
                value={fRole}
                onChange={setFRole}
                options={roles}
              />
              <FilterSelect
                label="Domain / Pillar"
                value={fPillar}
                onChange={setFPillar}
                options={pillars}
              />
              <FilterSelect
                label="Demand Status"
                value={fStatus}
                onChange={setFStatus}
                options={[
                  "Pending",
                  "Approved",
                  "Rejected",
                  "Awaiting Approval",
                ]}
              />
              <div className="col-span-full flex gap-2">
                <Button size="sm">Search</Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFProject("all");
                    setFRole("all");
                    setFPillar("all");
                    setFStatus("all");
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
          <DataTable data={filtered} columns={columns} pageSize={5} />
        </CardContent>
      </Card>

      {/* ── Resource Dialog with Auto / Manual allocation flow ── */}
      <ResourceDialog
        open={resourceModal.open}
        onOpenChange={(v) => setResourceModal((s) => ({ ...s, open: v }))}
        demandId={resourceModal.demandId}
        projectName={resourceModal.projectName}
        projectSkills={resourceModal.projectSkills}
      />

      {/* ── Import Source Chooser ── */}
      <Dialog open={importChooserOpen} onOpenChange={setImportChooserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Demand Data</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Choose a source. External tools are simulated for demo purposes.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              onClick={triggerExcelUpload}
              className="border rounded-md p-4 text-left hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-xs">
                  XLS
                </div>
                <div className="font-semibold text-sm">Excel / CSV Upload</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Upload .xlsx or .csv with Project, Role, Pillar columns
              </div>
            </button>

            {(["Jira", "Planisware", "Smartsheets"] as const).map((src) => (
              <button
                key={src}
                onClick={() => fetchFromExternal(src)}
                className="border rounded-md p-4 text-left hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">
                    {src.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="font-semibold text-sm">{src}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {src === "Jira" && "Fetch open epics & stories as demand"}
                  {src === "Planisware" &&
                    "Pull project plans & resource needs"}
                  {src === "Smartsheets" && "Sync resource sheets into demand"}
                </div>
              </button>
            ))}

            <button
              onClick={() => fetchFromExternal("Connected Source")}
              className="border rounded-md p-4 text-left hover:bg-accent transition-colors col-span-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">
                  API
                </div>
                <div className="font-semibold text-sm">
                  Fetch from Connected Source
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Pull from configured enterprise API endpoint
              </div>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={handleFileUpload}
          />
        </DialogContent>
      </Dialog>

      {/* ── Import Preview ── */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Import Preview — {importPreview.length} records from{" "}
              {importSource}
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-md overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  {[
                    "Project Name",
                    "Required Skills",
                    "Domain / Pillar",
                    "Budget Code",
                    "Resource",
                    "Type",
                  ].map((h) => (
                    <th key={h} className="px-3 py-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importPreview.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1.5">{r.projectName}</td>
                    <td className="px-3 py-1.5">{r.projectRole}</td>
                    <td className="px-3 py-1.5">{r.pillar}</td>
                    <td className="px-3 py-1.5">{r.budgetCode}</td>
                    <td className="px-3 py-1.5">{r.resourceName}</td>
                    <td className="px-3 py-1.5">{r.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowImport(false)}>
              Cancel
            </Button>
            <Button onClick={confirmImport}>Confirm Import</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Demand</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HistoryModal
        open={!!historyData}
        onOpenChange={() => setHistoryData(null)}
        history={historyData || []}
      />
    </>
  );
}
