import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
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
  Plus,
  Users,
  X,
  Wand2,
  ClipboardList,
  ArrowLeft,
  CheckCircle2,
  Search,
  Zap,
  AlertCircle,
  Save,
  SendHorizonal,
} from "lucide-react";
import { toast } from "sonner";
import DataTable, { type Column } from "@/components/DataTable";

// ─── Shared Resource type ─────────────────────────────────────────────────────

interface Resource {
  id: string;
  resourceId: string;
  name: string;
  role: string;
  initials: string;
  level: string;
  team: string;
  reportingManager: string;
  employeeType: "Full Time" | "Contractor";
  availableAfter: string;
  skills: string[];
  ratePerHr: number;
  capacity: string;
  location: string;
  status: "Allocated" | "Available" | "Overallocated";
  utilization: number;
}

// ─── Resource Data ────────────────────────────────────────────────────────────

const resourceData: Resource[] = [
  {
    id: "res-0",
    resourceId: "RID-1001",
    name: "Priya Sharma",
    role: "Cloud Architect",
    initials: "PS",
    level: "Senior",
    team: "Cloud Eng",
    reportingManager: "Emma Wilson",
    employeeType: "Full Time",
    availableAfter: "Jun 4 2026",
    skills: ["AWS", "Terraform", "Kubernetes"],
    ratePerHr: 95,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 80,
  },
  {
    id: "res-1",
    resourceId: "RID-1002",
    name: "Liam Anderson",
    role: "Data Engineer",
    initials: "LA",
    level: "Mid",
    team: "Data Eng",
    reportingManager: "Ananya Rao",
    employeeType: "Contractor",
    availableAfter: "May 6 2027",
    skills: ["Python", "Spark", "SQL"],
    ratePerHr: 75,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Allocated",
    utilization: 100,
  },
  {
    id: "res-2",
    resourceId: "RID-1003",
    name: "Sneha Iyer",
    role: "DevSecOps Engineer",
    initials: "SI",
    level: "Senior",
    team: "DevSecOps",
    reportingManager: "Daniel Carter",
    employeeType: "Full Time",
    availableAfter: "Dec 8 2027",
    skills: ["Docker", "CI/CD", "Security"],
    ratePerHr: 85,
    capacity: "40 hrs",
    location: "Brisbane",
    status: "Allocated",
    utilization: 80,
  },
  {
    id: "res-3",
    resourceId: "RID-1004",
    name: "Kiran Patel",
    role: "Full Stack Developer",
    initials: "KP",
    level: "Mid",
    team: "Cloud Eng",
    reportingManager: "Priya Sharma",
    employeeType: "Contractor",
    availableAfter: "Jul 12 2026",
    skills: ["React", "Node.js", "APIs"],
    ratePerHr: 70,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Overallocated",
    utilization: 120,
  },
  {
    id: "res-4",
    resourceId: "RID-1005",
    name: "Olivia Bennett",
    role: "Delivery Manager",
    initials: "OB",
    level: "Senior",
    team: "Delivery",
    reportingManager: "Executive Board",
    employeeType: "Full Time",
    availableAfter: "Aug 2 2027",
    skills: ["Agile", "PMO", "Stakeholder Mgmt"],
    ratePerHr: 90,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 60,
  },
  {
    id: "res-5",
    resourceId: "RID-1006",
    name: "Rohit Nair",
    role: "Data Scientist",
    initials: "RN",
    level: "Mid",
    team: "Data Eng",
    reportingManager: "Olivia Bennett",
    employeeType: "Full Time",
    availableAfter: "May 18 2026",
    skills: ["ML", "Python", "TensorFlow"],
    ratePerHr: 80,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Available",
    utilization: 80,
  },
  {
    id: "res-6",
    resourceId: "RID-1007",
    name: "Sophia Miller",
    role: "Cloud Engineer",
    initials: "SM",
    level: "Junior",
    team: "Cloud Eng",
    reportingManager: "Priya Sharma",
    employeeType: "Full Time",
    availableAfter: "Jun 10 2026",
    skills: ["Azure", "ARM Templates", "Networking"],
    ratePerHr: 55,
    capacity: "40 hrs",
    location: "Perth",
    status: "Allocated",
    utilization: 100,
  },
  {
    id: "res-7",
    resourceId: "RID-1008",
    name: "Dev Krishnan",
    role: "Security Engineer",
    initials: "DK",
    level: "Senior",
    team: "DevSecOps",
    reportingManager: "Emma Wilson",
    employeeType: "Full Time",
    availableAfter: "May 30 2027",
    skills: ["Pen Testing", "SIEM", "IAM"],
    ratePerHr: 90,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 50,
  },
  {
    id: "res-8",
    resourceId: "RID-1009",
    name: "Ethan Brooks",
    role: "Cloud Engineer",
    initials: "EB",
    level: "Mid",
    team: "Cloud Eng",
    reportingManager: "Priya Sharma",
    employeeType: "Contractor",
    availableAfter: "Jun 21 2026",
    skills: ["AWS", "CloudFormation", "Lambda"],
    ratePerHr: 75,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 100,
  },
  {
    id: "res-9",
    resourceId: "RID-1010",
    name: "Lalitha Krishnan",
    role: "ML Engineer",
    initials: "LK",
    level: "Mid",
    team: "Data Eng",
    reportingManager: "Rohit Nair",
    employeeType: "Full Time",
    availableAfter: "Sep 14 2026",
    skills: ["ML", "Python", "Spark"],
    ratePerHr: 80,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Available",
    utilization: 80,
  },
];

// ─── Table Columns ────────────────────────────────────────────────────────────

const columns: Column<Resource>[] = [
  { key: "resourceId", header: "Resource ID" },
  {
    key: "name",
    header: "Resource Name",
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
          {r.initials}
        </div>
        <div>
          <div className="font-medium text-foreground">{r.name}</div>
          <div className="text-xs text-muted-foreground">{r.role}</div>
        </div>
      </div>
    ),
  },
  { key: "level", header: "Level" },
  { key: "team", header: "Team" },
  { key: "reportingManager", header: "Reporting Manager" },
  {
    key: "employeeType",
    header: "Employee Type",
    render: (r) => (
      <Badge variant={r.employeeType === "FTE" ? "default" : "secondary"}>
        {r.employeeType}
      </Badge>
    ),
  },
  // { key: "availableAfter", header: "Start Date" },
  {
    key: "availableAfter",
    header: "Available Date",
    render: (r) => (
      <span className="whitespace-nowrap">{r.availableAfter}</span>
    ),
  },
  {
    key: "skills",
    header: "Skills",
    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.skills.map((s) => (
          <Badge key={s} variant="secondary" className="text-xs px-1.5 py-0">
            {s}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "ratePerHr",
    header: "Rate/Hours",
    render: (r) => <span className="font-medium">${r.ratePerHr}</span>,
  },

  { key: "location", header: "Location" },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const colorMap = {
        Allocated:
          "bg-blue-500/20 text-blue-700 border border-blue-500/30 dark:text-blue-300",
        Available:
          "bg-green-500/20 text-green-700 border border-green-500/30 dark:text-green-300",
        Overallocated:
          "bg-red-500/20 text-red-700 border border-red-500/30 dark:text-red-300",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[r.status]}`}
        >
          {r.status}
        </span>
      );
    },
  },
  {
    key: "utilization",
    header: "Utilization",
    render: (r) => {
      const barColor =
        r.utilization > 100
          ? "bg-red-500"
          : r.utilization >= 80
            ? "bg-yellow-500"
            : "bg-green-500";
      const textColor =
        r.utilization > 100
          ? "text-red-400"
          : r.utilization >= 80
            ? "text-yellow-400"
            : "text-green-400";
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${Math.min(r.utilization, 100)}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${textColor}`}>
            {r.utilization}%
          </span>
        </div>
      );
    },
  },
];

// ─── Dialog Types ─────────────────────────────────────────────────────────────

interface AssignedResource {
  id: string;
  name: string;
  email: string;
  domain: string;
}

// ─── Dialog Helpers ───────────────────────────────────────────────────────────

function scoreResource(r: Resource, requiredSkills: string[]): number {
  if (r.status === "Overallocated") return 0;
  const skillMatch = requiredSkills.length
    ? r.skills.filter((s) =>
        requiredSkills.some((req) =>
          s.toLowerCase().includes(req.toLowerCase()),
        ),
      ).length / requiredSkills.length
    : 0.5;
  const availScore =
    r.status === "Available" ? 1 : r.utilization < 80 ? 0.8 : 0.4;
  return skillMatch * 0.6 + availScore * 0.4;
}

function getStatusStyle(status: Resource["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300";
    case "Allocated":
      return "bg-blue-500/15 text-blue-700 border border-blue-500/30 dark:text-blue-300";
    case "Overallocated":
      return "bg-red-500/15 text-red-700 border border-red-500/30 dark:text-red-300";
  }
}

// ─── AllocationModeChooser ────────────────────────────────────────────────────

function AllocationModeChooser({
  onSelect,
  onCancel,
}: {
  onSelect: (mode: "auto" | "manual") => void;
  onCancel: () => void;
}) {
  return (
    <div className="py-2">
      <p className="text-sm text-muted-foreground mb-5 text-center">
        How would you like to allocate a resource to this demand?
      </p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect("auto")}
          className="group relative flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-center transition-all duration-200 hover:border-primary hover:bg-primary/5 focus:outline-none"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wand2 className="h-7 w-7" />
          </div>
          <div>
            <div className="font-semibold text-foreground mb-1">
              Auto Allocate
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed py-3">
              We'll match resources based on required skills & current
              availability score
            </div>
          </div>
        </button>

        <button
          onClick={() => onSelect("manual")}
          className="group relative flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-center transition-all duration-200 hover:border-primary hover:bg-primary/5 focus:outline-none"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ClipboardList className="h-7 w-7" />
          </div>
          <div>
            <div className="font-semibold text-foreground mb-1">
              Manual Allocate
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed py-3">
              Browse the full resource catalogue and hand-pick whoever you need
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── ResourcePicker ───────────────────────────────────────────────────────────

function ResourcePicker({
  mode,
  requiredSkills,
  onSubmit,
  onBack,
}: {
  mode: "auto" | "manual";
  requiredSkills: string[];
  onSubmit: (selected: Resource[]) => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const displayList = (() => {
    const q = search.toLowerCase();
    let list = resourceData.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q));
      return matchSearch;
    });
    if (mode === "auto") {
      list = list
        .filter((r) => r.status !== "Overallocated" && r.utilization < 100)
        .sort(
          (a, b) =>
            scoreResource(b, requiredSkills) - scoreResource(a, requiredSkills),
        );
    }
    return list;
  })();

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const matchedSkillCount = (r: Resource) =>
    requiredSkills.filter((req) =>
      r.skills.some((s) => s.toLowerCase().includes(req.toLowerCase())),
    ).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {mode === "auto" ? (
              <span className="flex items-center gap-1.5">
                <Wand2 className="h-4 w-4 text-primary" />
                Auto Allocate — Suggested Resources
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4 text-primary" />
                Manual Allocate — Select Resources
              </span>
            )}
          </div>
          {mode === "auto" && requiredSkills.length > 0 && (
            <div className="text-xs text-muted-foreground mt-0.5">
              Matching on: {requiredSkills.join(", ")}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {selected.size} selected
        </span>
      </div>

      {mode === "auto" && (
        <div className="flex items-start gap-2 rounded-lg bg-primary/8 border border-primary/20 px-3 py-2 text-xs text-primary">
          <Zap className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Resources are ranked by skill match & availability. Overallocated
            resources are excluded.
          </span>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="pl-9 h-8 text-sm"
          placeholder="Search by name, role, skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden max-h-[380px] overflow-y-auto">
        {displayList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm gap-2">
            <AlertCircle className="h-5 w-5" />
            No resources match your criteria
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left w-8"></th>
                <th className="px-3 py-2 text-left font-medium">Resource</th>
                <th className="px-3 py-2 text-left font-medium">Skills</th>
                {mode === "auto" && (
                  <th className="px-3 py-2 text-left font-medium">Match</th>
                )}
                <th className="px-3 py-2 text-left font-medium">
                  Availability
                </th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((r) => {
                const isSelected = selected.has(r.id);
                const score =
                  mode === "auto" ? scoreResource(r, requiredSkills) : null;
                const matched = matchedSkillCount(r);
                return (
                  <tr
                    key={r.id}
                    className={`border-t cursor-pointer transition-colors ${isSelected ? "bg-primary/8" : "hover:bg-muted/40"}`}
                    onClick={() => toggleSelect(r.id)}
                  >
                    <td className="px-3 py-2.5">
                      <div
                        className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-border"}`}
                      >
                        {isSelected && (
                          <svg
                            className="h-2.5 w-2.5 text-primary-foreground"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4l3 3 5-6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
                          {r.initials}
                        </div>
                        <div>
                          <div className="font-medium text-xs">{r.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.role}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {r.skills.map((s) => {
                          const isMatch =
                            mode === "auto" &&
                            requiredSkills.some((req) =>
                              s.toLowerCase().includes(req.toLowerCase()),
                            );
                          return (
                            <Badge
                              key={s}
                              variant="secondary"
                              className={`text-xs px-1.5 py-0 ${isMatch ? "bg-primary/20 text-primary border border-primary/30" : ""}`}
                            >
                              {s}
                            </Badge>
                          );
                        })}
                      </div>
                    </td>
                    {mode === "auto" && (
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.round((score ?? 0) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-primary font-medium">
                            {Math.round((score ?? 0) * 100)}%
                          </span>
                        </div>
                        {requiredSkills.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {matched}/{requiredSkills.length} skills
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {r.availableAfter}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(r.status)}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">
          {displayList.length} resource{displayList.length !== 1 ? "s" : ""}{" "}
          shown
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            Back
          </Button>
          <Button
            size="sm"
            disabled={selected.size === 0}
            onClick={() =>
              onSubmit(resourceData.filter((r) => selected.has(r.id)))
            }
            className="gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Allocate {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── ResourceDialog ───────────────────────────────────────────────────────────

type ModalStep = "list" | "chooseMode" | "picker";

export function ResourceDialog({
  open,
  onOpenChange,
  demandId,
  projectName,
  projectSkills = [],
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  demandId: string;
  projectName: string;
  projectSkills?: string[];
}) {
  const empty: Omit<AssignedResource, "id"> = {
    name: "",
    email: "",
    domain: "",
  };

  const [resources, setResources] = useState<AssignedResource[]>([
    {
      id: "r1",
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      domain: "Cloud",
    },
    {
      id: "r2",
      name: "Bob Smith",
      email: "bob.smith@company.com",
      domain: "Data",
    },
  ]);
  const [step, setStep] = useState<ModalStep>("list");
  const [pickerMode, setPickerMode] = useState<"auto" | "manual">("manual");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<AssignedResource, "id">>(empty);
  const [addForm, setAddForm] = useState<Omit<AssignedResource, "id">>(empty);
  const [showAddRow, setShowAddRow] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("list");
      setHasPendingChanges(false);
    }, 300);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasPendingChanges(false);
      toast.success(`Resource allocation saved to ${projectName}`, {
        description: `${resources.length} resource${resources.length !== 1 ? "s" : ""} have been saved to this project. Changes are in draft.`,
        duration: 4000,
      });
    }, 600);
  };

  const handleSaveAndSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setHasPendingChanges(false);
      toast.success(`Allocation submitted for approval`, {
        description: `${resources.length} resource${resources.length !== 1 ? "s" : ""} on ${projectName} have been sent to the delivery manager for approval.`,
        duration: 5000,
      });
      handleClose();
      navigate("/demand-status"); // ← only new line
    }, 800);
  };

  const startEdit = (r: AssignedResource) => {
    setEditingId(r.id);
    setEditForm({ name: r.name, email: r.email, domain: r.domain });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setResources((prev) =>
      prev.map((r) => (r.id === editingId ? { ...r, ...editForm } : r)),
    );
    setEditingId(null);
    toast.success("Resource updated");
  };

  const confirmRemove = () => {
    const removed = resources.find((r) => r.id === removeId);
    setResources((prev) => prev.filter((r) => r.id !== removeId));
    setRemoveId(null);
    setHasPendingChanges(true);
    toast.info(`${removed?.name ?? "Resource"} removed`, {
      description: "Save your changes to confirm this removal.",
    });
  };

  const addResource = () => {
    if (!addForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setResources((prev) => [...prev, { id: `r${Date.now()}`, ...addForm }]);
    setAddForm(empty);
    setShowAddRow(false);
    setHasPendingChanges(true);
    toast.info(`${addForm.name} added`, {
      description: "Save your changes to confirm this addition.",
    });
  };

  const handlePickerSubmit = (picked: Resource[]) => {
    const newResources: AssignedResource[] = picked.map((r) => ({
      id: `r${Date.now()}-${r.id}`,
      name: r.name,
      email: `${r.name.toLowerCase().replace(" ", ".")}@company.com`,
      domain: r.team,
    }));
    setResources((prev) => {
      const existingNames = new Set(prev.map((r) => r.name));
      return [
        ...prev,
        ...newResources.filter((r) => !existingNames.has(r.name)),
      ];
    });
    setHasPendingChanges(true);
    toast.info(
      `${picked.length} resource${picked.length > 1 ? "s" : ""} added`,
      {
        description: "Save your changes to confirm this allocation.",
      },
    );
    setStep("list");
  };

  const modalTitle = () => {
    if (step === "chooseMode") return `Allocate Resource — ${projectName}`;
    if (step === "picker")
      return pickerMode === "auto"
        ? `Auto Allocate — ${projectName}`
        : `Manual Allocate — ${projectName}`;
    return `Resources — ${projectName}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className={step === "picker" ? "max-w-4xl" : "max-w-2xl"}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {modalTitle()}
            </DialogTitle>
          </DialogHeader>

          {step === "list" && (
            <>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">
                        Resource Name
                      </th>
                      <th className="px-3 py-2 text-left font-medium">Email</th>
                      <th className="px-3 py-2 text-left font-medium">
                        Domain
                      </th>
                      <th className="px-3 py-2 text-left font-medium w-28">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) =>
                      editingId === r.id ? (
                        <tr key={r.id} className="border-t bg-accent/30">
                          <td className="px-2 py-1.5">
                            <Input
                              className="h-7 text-sm"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <Input
                              className="h-7 text-sm"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <Input
                              className="h-7 text-sm"
                              value={editForm.domain}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  domain: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5 flex gap-1">
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={saveEdit}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={r.id} className="border-t hover:bg-muted/40">
                          <td className="px-3 py-2">{r.name}</td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {r.email}
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant="outline" className="text-xs">
                              {r.domain}
                            </Badge>
                          </td>
                          <td className="px-6 py-2">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => setRemoveId(r.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                    {showAddRow && (
                      <tr className="border-t bg-accent/20">
                        <td className="px-2 py-1.5">
                          <Input
                            className="h-7 text-sm"
                            placeholder="Name"
                            value={addForm.name}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                name: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <Input
                            className="h-7 text-sm"
                            placeholder="Email"
                            value={addForm.email}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <Input
                            className="h-7 text-sm"
                            placeholder="Domain"
                            value={addForm.domain}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                domain: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-1.5 flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={addResource}
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setShowAddRow(false);
                              setAddForm(empty);
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )}
                    {resources.length === 0 && !showAddRow && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-4 text-center text-muted-foreground text-sm"
                        >
                          No resources assigned yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setStep("chooseMode")}
                  disabled={showAddRow}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Resource
                </Button>

                {hasPendingChanges && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-amber-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                      Unsaved changes
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled={isSaving || isSubmitting}
                      onClick={handleSave}
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isSaving ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={isSaving || isSubmitting}
                      onClick={handleSaveAndSubmit}
                    >
                      <SendHorizonal className="h-3.5 w-3.5" />
                      {isSubmitting ? "Submitting…" : "Save & Submit"}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {step === "chooseMode" && (
            <AllocationModeChooser
              onSelect={(mode) => {
                setPickerMode(mode);
                setStep("picker");
              }}
              onCancel={() => setStep("list")}
            />
          )}

          {step === "picker" && (
            <ResourcePicker
              mode={pickerMode}
              requiredSkills={projectSkills}
              onSubmit={handlePickerSubmit}
              onBack={() => setStep("chooseMode")}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!removeId} onOpenChange={() => setRemoveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this resource? This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ─── ResourceInformation (default export — the page) ─────────────────────────

export default function ResourceInformation() {
  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterUtil, setFilterUtil] = useState("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return resourceData.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.resourceId.toLowerCase().includes(q);

      const matchTeam = filterTeam === "all" || r.team === filterTeam;
      const matchStatus = filterStatus === "all" || r.status === filterStatus;
      const matchType = filterType === "all" || r.employeeType === filterType;
      const matchUtil =
        filterUtil === "all" ||
        (filterUtil === "low" && r.utilization < 80) ||
        (filterUtil === "mid" && r.utilization >= 80 && r.utilization < 100) ||
        (filterUtil === "full" && r.utilization >= 100);

      return matchSearch && matchTeam && matchStatus && matchType && matchUtil;
    });
  }, [search, filterTeam, filterStatus, filterType, filterUtil]);

  const hasActiveFilters =
    search ||
    filterTeam !== "all" ||
    filterStatus !== "all" ||
    filterType !== "all" ||
    filterUtil !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterTeam("all");
    setFilterStatus("all");
    setFilterType("all");
    setFilterUtil("all");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resource Catalogue</CardTitle>
        <p className="text-sm text-muted-foreground">
          {resourceData.length} resources
        </p>
      </CardHeader>

      <CardContent>
        {/* ── Search + Filters ── */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="pl-9 h-9 text-sm"
              placeholder="Search resource, role, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Team */}
          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="h-9 w-[140px] text-sm">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {[...new Set(resourceData.map((r) => r.team))].sort().map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 w-[140px] text-sm">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Allocated">Allocated</SelectItem>
              <SelectItem value="Overallocated">Overallocated</SelectItem>
            </SelectContent>
          </Select>

          {/* Employee Type */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-9 w-[130px] text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="FTE">FTE</SelectItem>
              <SelectItem value="Contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>

          {/* Utilization */}
          <Select value={filterUtil} onValueChange={setFilterUtil}>
            <SelectTrigger className="h-9 w-[150px] text-sm">
              <SelectValue placeholder="All Utilization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Utilization</SelectItem>
              <SelectItem value="low">Under 80%</SelectItem>
              <SelectItem value="mid">80–99%</SelectItem>
              <SelectItem value="full">100%+</SelectItem>
            </SelectContent>
          </Select>

          {/* Result count + clear */}
          <span className="text-sm text-muted-foreground ml-1">
            {filteredData.length} result{filteredData.length !== 1 ? "s" : ""}
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
        <DataTable data={filteredData} columns={columns} pageSize={10} />
      </CardContent>
    </Card>
  );
}
