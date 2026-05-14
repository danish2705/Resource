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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  X,
  MoreHorizontal,
  Pencil,
  SendHorizonal,
  Eye,
  ClipboardList,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DemandStatusType =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected";

interface Demand {
  id: string;
  projectId: string;
  projectName: string;
  requiredSkills: string[];
  budgetCode: string;
  domainPillar: string;
  noOfResources: number;
  allocatedResources: number;
  estimatedRate: number;
  currentYearForecast: number;
  status: DemandStatusType;
  submittedBy: string;
  deliveryManager: string;
  // Additional detail fields
  portfolio?: string;
  program?: string;
  projectRole?: string;
  workstream?: string;
  startDate?: string;
  endDate?: string;
  comments?: string;
  allocation?: {
    currentYear: number;
    y2027: number;
    y2028: number;
    y2029: number;
    y2030: number;
  };
  forecast?: {
    currentYear: number;
    y2027: number;
    y2028: number;
    y2029: number;
    y2030: number;
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const demandData: Demand[] = [
  {
    id: "dem-001",
    projectId: "PRJ-1001",
    projectName: "Cloud Migration Phase 1",
    requiredSkills: ["AWS", "Terraform", "Kubernetes"],
    budgetCode: "BC-4421",
    domainPillar: "Cloud Eng",
    noOfResources: 4,
    allocatedResources: 3,
    estimatedRate: 85,
    currentYearForecast: 280000,
    status: "Approved",
    submittedBy: "Ananya Rao",
    deliveryManager: "Dev Krishnan",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "Cloud Architect",
    workstream: "Infrastructure",
    startDate: "2026-01-15",
    endDate: "2026-12-31",
    comments: "Phase 1 covers primary workloads migration to AWS.",
    allocation: { currentYear: 80, y2027: 60, y2028: 20, y2029: 0, y2030: 0 },
    forecast: {
      currentYear: 280000,
      y2027: 210000,
      y2028: 70000,
      y2029: 0,
      y2030: 0,
    },
  },
  {
    id: "dem-002",
    projectId: "PRJ-1002",
    projectName: "Data Lake Modernisation",
    requiredSkills: ["Python", "Spark", "SQL"],
    budgetCode: "BC-4422",
    domainPillar: "Data Eng",
    noOfResources: 3,
    allocatedResources: 2,
    estimatedRate: 78,
    currentYearForecast: 195000,
    status: "Under Review",
    submittedBy: "Rohit Nair",
    deliveryManager: "Ananya Rao",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "Data Engineer",
    workstream: "Analytics",
    startDate: "2026-02-01",
    endDate: "2026-11-30",
    comments: "Modernising legacy data pipelines to cloud-native architecture.",
    allocation: { currentYear: 70, y2027: 40, y2028: 0, y2029: 0, y2030: 0 },
    forecast: {
      currentYear: 195000,
      y2027: 112000,
      y2028: 0,
      y2029: 0,
      y2030: 0,
    },
  },
  {
    id: "dem-003",
    projectId: "PRJ-1003",
    projectName: "DevSecOps Pipeline Setup",
    requiredSkills: ["Docker", "CI/CD", "Security"],
    budgetCode: "BC-4423",
    domainPillar: "DevSecOps",
    noOfResources: 2,
    allocatedResources: 2,
    estimatedRate: 87,
    currentYearForecast: 144000,
    status: "Approved",
    submittedBy: "Dev Krishnan",
    deliveryManager: "Ananya Rao",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "DevSecOps Engineer",
    workstream: "Security",
    startDate: "2026-03-01",
    endDate: "2026-09-30",
    comments: "Establishing secure CI/CD pipelines across all product teams.",
    allocation: { currentYear: 100, y2027: 50, y2028: 25, y2029: 0, y2030: 0 },
    forecast: {
      currentYear: 144000,
      y2027: 72000,
      y2028: 36000,
      y2029: 0,
      y2030: 0,
    },
  },
  {
    id: "dem-004",
    projectId: "PRJ-1004",
    projectName: "Customer Portal Rebuild",
    requiredSkills: ["React", "Node.js", "APIs"],
    budgetCode: "BC-4424",
    domainPillar: "Cloud Eng",
    noOfResources: 5,
    allocatedResources: 1,
    estimatedRate: 72,
    currentYearForecast: 300000,
    status: "Draft",
    submittedBy: "Kiran Patel",
    deliveryManager: "Priya Sharma",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "Full Stack Developer",
    workstream: "Digital",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    comments: "Full rebuild of customer-facing portal with modern tech stack.",
    allocation: { currentYear: 20, y2027: 80, y2028: 40, y2029: 0, y2030: 0 },
    forecast: {
      currentYear: 300000,
      y2027: 240000,
      y2028: 120000,
      y2029: 0,
      y2030: 0,
    },
  },
  {
    id: "dem-005",
    projectId: "PRJ-1005",
    projectName: "ML Model Deployment",
    requiredSkills: ["ML", "Python", "TensorFlow"],
    budgetCode: "BC-4425",
    domainPillar: "Data Eng",
    noOfResources: 3,
    allocatedResources: 3,
    estimatedRate: 80,
    currentYearForecast: 192000,
    status: "Submitted",
    submittedBy: "Lalitha Krishnan",
    deliveryManager: "Rohit Nair",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "ML Engineer",
    workstream: "AI/ML",
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    comments:
      "Production deployment of trained ML models with monitoring setup.",
    allocation: { currentYear: 100, y2027: 60, y2028: 30, y2029: 10, y2030: 0 },
    forecast: {
      currentYear: 192000,
      y2027: 115000,
      y2028: 57000,
      y2029: 19000,
      y2030: 0,
    },
  },
  {
    id: "dem-006",
    projectId: "PRJ-1006",
    projectName: "Azure Networking Overhaul",
    requiredSkills: ["Azure", "ARM Templates", "Networking"],
    budgetCode: "BC-4426",
    domainPillar: "Cloud Eng",
    noOfResources: 2,
    allocatedResources: 0,
    estimatedRate: 65,
    currentYearForecast: 104000,
    status: "Rejected",
    submittedBy: "Meera Joshi",
    deliveryManager: "Priya Sharma",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "Network Engineer",
    workstream: "Infrastructure",
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    comments:
      "Overhaul of Azure virtual network architecture for improved performance.",
    allocation: { currentYear: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
    forecast: { currentYear: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
  },
  {
    id: "dem-007",
    projectId: "PRJ-1007",
    projectName: "IAM & SIEM Integration",
    requiredSkills: ["Pen Testing", "SIEM", "IAM"],
    budgetCode: "BC-4427",
    domainPillar: "DevSecOps",
    noOfResources: 2,
    allocatedResources: 1,
    estimatedRate: 90,
    currentYearForecast: 148000,
    status: "Under Review",
    submittedBy: "Dev Krishnan",
    deliveryManager: "Ananya Rao",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "Security Engineer",
    workstream: "Security",
    startDate: "2026-03-15",
    endDate: "2026-10-31",
    comments:
      "Integration of IAM with SIEM for unified security event management.",
    allocation: { currentYear: 50, y2027: 30, y2028: 0, y2029: 0, y2030: 0 },
    forecast: {
      currentYear: 148000,
      y2027: 88000,
      y2028: 0,
      y2029: 0,
      y2030: 0,
    },
  },
  {
    id: "dem-008",
    projectId: "PRJ-1008",
    projectName: "Lambda Serverless Migration",
    requiredSkills: ["AWS", "CloudFormation", "Lambda"],
    budgetCode: "BC-4428",
    domainPillar: "Cloud Eng",
    noOfResources: 3,
    allocatedResources: 2,
    estimatedRate: 75,
    currentYearForecast: 180000,
    status: "Submitted",
    submittedBy: "Vikram Singh",
    deliveryManager: "Priya Sharma",
    portfolio: "Global",
    program: "Enterprise",
    projectRole: "Cloud Developer",
    workstream: "Infrastructure",
    startDate: "2026-04-01",
    endDate: "2026-11-30",
    comments:
      "Migrating batch processing workloads to serverless Lambda functions.",
    allocation: { currentYear: 70, y2027: 50, y2028: 20, y2029: 0, y2030: 0 },
    forecast: {
      currentYear: 180000,
      y2027: 128000,
      y2028: 51000,
      y2029: 0,
      y2030: 0,
    },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyleMap: Record<DemandStatusType, string> = {
  Draft: "bg-muted/60 text-muted-foreground border border-border",
  Submitted: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  "Under Review":
    "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Approved: "bg-green-500/20 text-green-400 border border-green-500/30",
  Rejected: "bg-red-500/20 text-red-400 border border-red-500/30",
};

function formatCurrency(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── AllocationBar ────────────────────────────────────────────────────────────

function AllocationBar({
  allocated,
  total,
}: {
  allocated: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.min((allocated / total) * 100, 100);
  const barColor =
    allocated === 0
      ? "bg-muted-foreground/30"
      : allocated < total
        ? "bg-yellow-500"
        : "bg-green-500";
  const textColor =
    allocated === 0
      ? "text-muted-foreground"
      : allocated < total
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <div className="flex items-center gap-2">
      <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-medium ${textColor}`}>
        {allocated}/{total}
      </span>
    </div>
  );
}

// ─── View Details Modal ───────────────────────────────────────────────────────

function ViewDetailsModal({
  demand,
  onClose,
}: {
  demand: Demand;
  onClose: () => void;
}) {
  const years = ["Current Year", "2027", "2028", "2029", "2030"];
  const allocationValues = demand.allocation
    ? [
        demand.allocation.currentYear,
        demand.allocation.y2027,
        demand.allocation.y2028,
        demand.allocation.y2029,
        demand.allocation.y2030,
      ]
    : [0, 0, 0, 0, 0];
  const forecastValues = demand.forecast
    ? [
        demand.forecast.currentYear,
        demand.forecast.y2027,
        demand.forecast.y2028,
        demand.forecast.y2029,
        demand.forecast.y2030,
      ]
    : [0, 0, 0, 0, 0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border"
        style={{
          background: "#0f1117",
          borderColor: "#1e2130",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10"
          style={{ background: "#0f1117", borderColor: "#1e2130" }}
        >
          <div>
            <p className="text-xs font-mono" style={{ color: "#5a6070" }}>
              {demand.projectId}
            </p>
            <h2 className="text-base font-semibold text-white mt-0.5">
              {demand.projectName}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyleMap[demand.status]}`}
            >
              {demand.status}
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              style={{ color: "#5a6070" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* ── PROJECT DETAILS ── */}
          <section>
            <p
              className="text-[10px] font-bold tracking-widest mb-4 uppercase"
              style={{ color: "#5a6070", letterSpacing: "0.15em" }}
            >
              Project Details
            </p>

            <div className="grid grid-cols-3 gap-4">
              {/* Portfolio */}
              <Field label="Portfolio" value={demand.portfolio || "Global"} />
              {/* Program */}
              <Field label="Program" value={demand.program || "Enterprise"} />
              {/* Project Name */}
              <Field label="Project Name" value={demand.projectName} />
              {/* Project Role */}
              <Field label="Project Role" value={demand.projectRole || "—"} />
              {/* Pillar */}
              <Field label="Pillar" value={demand.domainPillar} />
              {/* Budget Code */}
              <Field label="Budget Code" value={demand.budgetCode} />
              {/* Workstream */}
              <Field label="Workstream" value={demand.workstream || "—"} />
              {/* Start Date */}
              <Field label="Start Date" value={formatDate(demand.startDate)} />
              {/* End Date */}
              <Field label="End Date" value={formatDate(demand.endDate)} />
            </div>

            {/* Skills */}
            <div className="mt-4">
              <p className="text-xs mb-1.5" style={{ color: "#5a6070" }}>
                Required Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {demand.requiredSkills.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Comments */}
            {demand.comments && (
              <div className="mt-4">
                <p className="text-xs mb-1.5" style={{ color: "#5a6070" }}>
                  Comments
                </p>
                <div
                  className="text-sm rounded-lg px-3 py-2.5"
                  style={{
                    background: "#161820",
                    color: "#a0a8b8",
                    border: "1px solid #1e2130",
                  }}
                >
                  {demand.comments}
                </div>
              </div>
            )}
          </section>

          {/* ── ALLOCATION ── */}
          <section>
            <div
              className="rounded-xl px-5 py-4"
              style={{ background: "#0c1420", border: "1px solid #0e2040" }}
            >
              <p
                className="text-[10px] font-bold tracking-widest mb-4 uppercase"
                style={{ color: "#38bdf8", letterSpacing: "0.15em" }}
              >
                Allocation (%)
              </p>
              <div className="grid grid-cols-5 gap-3">
                {years.map((yr, i) => (
                  <YearField
                    key={yr}
                    label={yr}
                    value={allocationValues[i]}
                    suffix="%"
                    accent="#38bdf8"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── FORECAST ── */}
          <section>
            <div
              className="rounded-xl px-5 py-4"
              style={{ background: "#150c0c", border: "1px solid #3a1010" }}
            >
              <p
                className="text-[10px] font-bold tracking-widest mb-4 uppercase"
                style={{ color: "#f87171", letterSpacing: "0.15em" }}
              >
                Forecast
              </p>
              <div className="grid grid-cols-5 gap-3">
                {years.map((yr, i) => (
                  <YearField
                    key={yr}
                    label={yr}
                    value={forecastValues[i] === 0 ? 0 : forecastValues[i]}
                    prefix="$"
                    formatK
                    accent="#f87171"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Meta row ── */}
          <div className="flex items-center justify-between pt-1 pb-2">
            <div className="flex gap-6 text-xs" style={{ color: "#5a6070" }}>
              <span>
                Submitted by:{" "}
                <span className="text-white font-medium">
                  {demand.submittedBy}
                </span>
              </span>
              <span>
                Delivery Manager:{" "}
                <span className="text-white font-medium">
                  {demand.deliveryManager}
                </span>
              </span>
              <span>
                Est. Rate:{" "}
                <span className="text-white font-medium">
                  ${demand.estimatedRate}/hr
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs mb-1" style={{ color: "#5a6070" }}>
        {label}
      </p>
      <div
        className="text-sm font-medium rounded-lg px-3 py-2"
        style={{
          background: "#161820",
          color: "#d0d8e8",
          border: "1px solid #1e2130",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function YearField({
  label,
  value,
  suffix,
  prefix,
  formatK,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  formatK?: boolean;
  accent: string;
}) {
  const display = formatK
    ? value === 0
      ? "0"
      : value >= 1000
        ? `${(value / 1000).toFixed(0)}K`
        : `${value}`
    : `${value}`;

  return (
    <div>
      <p className="text-xs mb-1.5" style={{ color: "#5a6070" }}>
        {label}
      </p>
      <div
        className="text-sm font-medium rounded-lg px-3 py-2.5"
        style={{
          background: "#0a0a12",
          color: value > 0 ? accent : "#3a4050",
          border: "1px solid #1a1f2e",
        }}
      >
        {prefix}
        {display}
        {suffix}
      </div>
    </div>
  );
}

// ─── DemandStatus Page ────────────────────────────────────────────────────────

export default function DemandStatus() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterAllocation, setFilterAllocation] = useState("all");
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return demandData.filter((d) => {
      const matchSearch =
        !q ||
        d.projectId.toLowerCase().includes(q) ||
        d.projectName.toLowerCase().includes(q) ||
        d.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
        d.submittedBy.toLowerCase().includes(q);
      const matchStatus = filterStatus === "all" || d.status === filterStatus;
      const matchDomain =
        filterDomain === "all" || d.domainPillar === filterDomain;
      const matchAllocation =
        filterAllocation === "all" ||
        (filterAllocation === "full" &&
          d.allocatedResources === d.noOfResources) ||
        (filterAllocation === "partial" &&
          d.allocatedResources > 0 &&
          d.allocatedResources < d.noOfResources) ||
        (filterAllocation === "none" && d.allocatedResources === 0);
      return matchSearch && matchStatus && matchDomain && matchAllocation;
    });
  }, [search, filterStatus, filterDomain, filterAllocation]);

  const hasActiveFilters =
    search ||
    filterStatus !== "all" ||
    filterDomain !== "all" ||
    filterAllocation !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterDomain("all");
    setFilterAllocation("all");
  };

  const domains = [...new Set(demandData.map((d) => d.domainPillar))].sort();

  return (
    <>
      {selectedDemand && (
        <ViewDetailsModal
          demand={selectedDemand}
          onClose={() => setSelectedDemand(null)}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Demand Status</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {demandData.length} demands · track allocation &amp; approval
            progress
          </p>
        </CardHeader>

        <CardContent>
          {/* ── Search + Filters ── */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                className="pl-9 h-9 text-sm"
                placeholder="Search project, skill, submitted by…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-9 w-[150px] text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDomain} onValueChange={setFilterDomain}>
              <SelectTrigger className="h-9 w-[145px] text-sm">
                <SelectValue placeholder="All Domains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterAllocation}
              onValueChange={setFilterAllocation}
            >
              <SelectTrigger className="h-9 w-[160px] text-sm">
                <SelectValue placeholder="All Allocations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Allocations</SelectItem>
                <SelectItem value="full">Fully Allocated</SelectItem>
                <SelectItem value="partial">Partially Allocated</SelectItem>
                <SelectItem value="none">Not Allocated</SelectItem>
              </SelectContent>
            </Select>

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
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      Project ID
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      Project Name
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      Required Skills
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      No. of Resources
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      Estimated Rate
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      Current Year Forecast
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-3 py-2.5 text-left font-medium text-muted-foreground whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-10 text-center text-muted-foreground text-sm"
                      >
                        No demands match your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((d) => (
                      <tr
                        key={d.id}
                        className="border-t hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-3 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {d.projectId}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-foreground leading-snug max-w-[180px]">
                            {d.projectName}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {d.domainPillar}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {d.requiredSkills.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-xs px-1.5 py-0"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <AllocationBar
                            allocated={d.allocatedResources}
                            total={d.noOfResources}
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {d.allocatedResources === d.noOfResources
                              ? "Fully allocated"
                              : d.allocatedResources === 0
                                ? "Not allocated"
                                : `${d.noOfResources - d.allocatedResources} pending`}
                          </div>
                        </td>
                        <td className="px-3 py-3 font-medium whitespace-nowrap">
                          ${d.estimatedRate}
                          <span className="text-xs text-muted-foreground font-normal">
                            /hr
                          </span>
                        </td>
                        <td className="px-3 py-3 font-medium whitespace-nowrap">
                          {formatCurrency(d.currentYearForecast)}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyleMap[d.status]}`}
                          >
                            {d.status}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {d.submittedBy}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                className="gap-2 text-xs"
                                onClick={() => setSelectedDemand(d)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-xs"
                                disabled={d.status === "Approved"}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit Allocation
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-xs"
                                disabled={
                                  d.status === "Approved" ||
                                  d.status === "Submitted" ||
                                  d.status === "Under Review"
                                }
                              >
                                <SendHorizonal className="h-3.5 w-3.5" />
                                Re-submit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Footer summary ── */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                Total forecast:{" "}
                <span className="font-medium text-foreground">
                  {formatCurrency(
                    filteredData.reduce(
                      (sum, d) => sum + d.currentYearForecast,
                      0,
                    ),
                  )}
                </span>
              </span>
              <span>
                Approved:{" "}
                <span className="font-medium text-green-400">
                  {filteredData.filter((d) => d.status === "Approved").length}
                </span>
              </span>
              <span>
                Pending:{" "}
                <span className="font-medium text-yellow-400">
                  {
                    filteredData.filter(
                      (d) =>
                        d.status === "Submitted" || d.status === "Under Review",
                    ).length
                  }
                </span>
              </span>
              <span>
                Draft / Rejected:{" "}
                <span className="font-medium text-muted-foreground">
                  {
                    filteredData.filter(
                      (d) => d.status === "Draft" || d.status === "Rejected",
                    ).length
                  }
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
