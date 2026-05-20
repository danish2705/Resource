import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectResource {
  resourceId: string;
  resourceName: string;
  designation: string;
}

interface Project {
  id: string;
  project: string;
  client: string;
  status: "Active" | "Planning";
  priority: "High" | "Medium" | "Low";
  budget: string;
  budgetHrs: string;
  start: string;
  end: string;
  teamSize: string;
  progress: number;
  resources: ProjectResource[];
}

const projectData: Project[] = [
  {
    id: "P-001",
    project: "Cloud Migration Phase 2",
    client: "TechCorp AU",
    status: "Active",
    priority: "High",
    budget: "$250k",
    budgetHrs: "2,800",
    start: "15 Jan 2025",
    end: "30 June 2026",
    teamSize: "4 resources",
    progress: 42,
    resources: [
      {
        resourceId: "RID-1001",
        resourceName: "Tracey Warren",
        designation: "Cloud Architect",
      },
      {
        resourceId: "RID-1004",
        resourceName: "Kiran Patel",
        designation: "Frontend Developer",
      },
      {
        resourceId: "RID-1005",
        resourceName: "Miranda Ford",
        designation: "Delivery Manager",
      },
      {
        resourceId: "RID-1009",
        resourceName: "Seth Green",
        designation: "Cloud Engineer",
      },
    ],
  },
  {
    id: "P-002",
    project: "Data Platform Modernisation",
    client: "FinServe Ltd",
    status: "Active",
    priority: "High",
    budget: "$180k",
    budgetHrs: "2,000",
    start: "1 Feb 2026",
    end: "31 July 2026",
    teamSize: "1 resource",
    progress: 28,
    resources: [
      {
        resourceId: "RID-1002",
        resourceName: "Arjun Mehta",
        designation: "Data Engineer",
      },
    ],
  },
  {
    id: "P-003",
    project: "DevSecOps Pipeline Setup",
    client: "GovDept NSW",
    status: "Active",
    priority: "Medium",
    budget: "$95k",
    budgetHrs: "1,100",
    start: "1 Mar 2025",
    end: "31 May 2027",
    teamSize: "2 resources",
    progress: 65,
    resources: [
      {
        resourceId: "RID-1003",
        resourceName: "Sneha Iyer",
        designation: "DevSecOps Lead",
      },
      {
        resourceId: "RID-1008",
        resourceName: "Dev Krishnan",
        designation: "Security Reviewer",
      },
    ],
  },
  {
    id: "P-004",
    project: "Analytics Dashboard Suite",
    client: "RetailCo",
    status: "Active",
    priority: "Medium",
    budget: "$70k",
    budgetHrs: "800",
    start: "20 Jan 2026",
    end: "30 Apr 2026",
    teamSize: "1 resource",
    progress: 88,
    resources: [
      {
        resourceId: "RID-1004",
        resourceName: "Kiran Patel",
        designation: "UI Developer",
      },
    ],
  },
  {
    id: "P-005",
    project: "API Integration Gateway",
    client: "InsureTech",
    status: "Planning",
    priority: "Low",
    budget: "$50k",
    budgetHrs: "600",
    start: "1 Apr 2026",
    end: "15 June 2026",
    teamSize: "0 resources",
    progress: 0,
    resources: [],
  },
  {
    id: "P-006",
    project: "Identity & Access Management",
    client: "HealthGroup",
    status: "Active",
    priority: "High",
    budget: "$120k",
    budgetHrs: "1,400",
    start: "15 Dec 2025",
    end: "15 Aug 2026",
    teamSize: "1 resource",
    progress: 35,
    resources: [
      {
        resourceId: "RID-1007",
        resourceName: "Meera Joshi",
        designation: "Cloud Engineer",
      },
    ],
  },
  {
    id: "P-007",
    project: "ML Forecasting Engine",
    client: "RetailCo",
    status: "Planning",
    priority: "Medium",
    budget: "$90k",
    budgetHrs: "1,000",
    start: "1 May 2026",
    end: "30 Sept  2027",
    teamSize: "1 resource",
    progress: 0,
    resources: [
      {
        resourceId: "RID-1006",
        resourceName: "Rohit Nair",
        designation: "ML Engineer",
      },
    ],
  },
];

type Filters = {
  search: string;
  status: string;
  priority: string;
  client: string;
  progressRange: string;
};

const PROGRESS_RANGES = [
  { label: "All Progress", value: "all" },
  { label: "Not started (0%)", value: "0" },
  { label: "Early stage (1–30%)", value: "1-30" },
  { label: "In progress (31–70%)", value: "31-70" },
  { label: "Near complete (71–99%)", value: "71-99" },
  { label: "Complete (100%)", value: "100" },
];

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) {
  const isActive = value !== "" && value !== "all";
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none h-10 pl-3 pr-8 rounded-lg border text-sm font-medium cursor-pointer transition-colors outline-none
          ${
            isActive
              ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
              : "bg-card border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
          }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
    </div>
  );
}

export default function ProjectsPage() {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    priority: "",
    client: "",
    progressRange: "all",
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const setFilter = (key: keyof Filters) => (value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const uniqueClients = useMemo(
    () => Array.from(new Set(projectData.map((p) => p.client))).sort(),
    [],
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.client) count++;
    if (filters.progressRange !== "all") count++;
    return count;
  }, [filters]);

  const clearFilters = () =>
    setFilters({
      search: "",
      status: "",
      priority: "",
      client: "",
      progressRange: "all",
    });

  const inProgressRange = (progress: number, range: string): boolean => {
    if (range === "all") return true;
    if (range === "0") return progress === 0;
    if (range === "100") return progress === 100;
    const [min, max] = range.split("-").map(Number);
    return progress >= min && progress <= max;
  };

  const filtered = useMemo(() => {
    return projectData.filter((p) => {
      const q = filters.search.toLowerCase();
      if (
        q &&
        !p.project.toLowerCase().includes(q) &&
        !p.client.toLowerCase().includes(q) &&
        !p.id.toLowerCase().includes(q)
      )
        return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.priority && p.priority !== filters.priority) return false;
      if (filters.client && p.client !== filters.client) return false;
      if (!inProgressRange(p.progress, filters.progressRange)) return false;
      return true;
    });
  }, [filters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Project Portfolio</CardTitle>
        <p className="text-sm text-muted-foreground">
          {filtered.length} projects
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center bg-card border border-border rounded-lg px-3 h-12 gap-2">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              value={filters.search}
              onChange={(e) => setFilter("search")(e.target.value)}
              placeholder="Search project, client or ID..."
              className="bg-transparent outline-none w-full text-sm"
            />
            {filters.search && (
              <button onClick={() => setFilter("search")("")}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
            <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap pl-3 border-l border-border">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label="All Statuses"
              value={filters.status}
              onChange={setFilter("status")}
              options={[
                { label: "All Statuses", value: "" },
                { label: "Active", value: "Active" },
                { label: "Planning", value: "Planning" },
              ]}
            />
            <FilterSelect
              label="All Priorities"
              value={filters.priority}
              onChange={setFilter("priority")}
              options={[
                { label: "All Priorities", value: "" },
                { label: "High", value: "High" },
                { label: "Medium", value: "Medium" },
                { label: "Low", value: "Low" },
              ]}
            />
            <FilterSelect
              label="All Clients"
              value={filters.client}
              onChange={setFilter("client")}
              options={[
                { label: "All Clients", value: "" },
                ...uniqueClients.map((c) => ({ label: c, value: c })),
              ]}
            />
            <FilterSelect
              label="All Progress"
              value={filters.progressRange}
              onChange={setFilter("progressRange")}
              options={PROGRESS_RANGES}
            />

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 h-10 px-3 rounded-lg border border-border/60 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <X className="h-3 w-3" />
                Clear{" "}
                <span className="bg-muted rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
                  {activeFilterCount}
                </span>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="border border-border rounded-xl overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="bg-card border-b border-border">
                <tr className="text-left text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  <th className="w-8 px-2 py-3"></th>
                  <th className="px-4 py-3 font-medium normal-case">ID</th>
                  <th className="px-4 py-3 font-medium normal-case">Project</th>
                  <th className="px-4 py-3 font-medium normal-case">Status</th>
                  <th className="px-4 py-3 font-medium normal-case">
                    Priority
                  </th>
                  <th className="px-4 py-3 font-medium normal-case">Budget</th>
                  <th className="px-4 py-3 font-medium normal-case">
                    Budget Hours
                  </th>
                  <th className="px-4 py-3 font-medium normal-case">Start</th>
                  <th className="px-4 py-3 font-medium normal-case">End</th>
                  <th className="px-4 py-3 font-medium normal-case">
                    Team Size
                  </th>
                  <th className="p-4 min-w-[160px] normal-case">Progress</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="py-16 text-center text-sm text-muted-foreground"
                    >
                      No projects match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((project) => {
                    const expanded = expandedRows.includes(project.id);
                    return (
                      <>
                        <tr
                          key={project.id}
                          className="border-b border-border/50 hover:bg-accent/20 transition-colors"
                        >
                          <td className="px-2 w-8">
                            <button
                              onClick={() => toggleRow(project.id)}
                              className="flex items-center justify-center text-muted-foreground hover:text-foreground"
                            >
                              {expanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground font-medium">
                            {project.id}
                          </td>
                          <td className="p-4 min-w-[240px]">
                            <div className="font-medium text-foreground">
                              {project.project}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {project.client}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                project.status === "Active"
                                  ? "bg-green-500/20 text-green-700 border-green-500/40 dark:text-green-300"
                                  : "bg-orange-500/20 text-orange-700 border-orange-500/40 dark:text-orange-300"
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                project.priority === "High"
                                  ? "bg-red-500/20 text-red-700 border-red-500/40 dark:text-red-300"
                                  : project.priority === "Medium"
                                    ? "bg-yellow-400/20 text-yellow-700 border-yellow-500/40 dark:text-yellow-300"
                                    : "bg-green-500/20 text-green-700 border-green-500/40 dark:text-green-300"
                              }`}
                            >
                              {project.priority}
                            </span>
                          </td>
                          <td className="p-4 text-sm font-medium">
                            {`$${(Number(project.budget.replace(/[$k]/gi, "")) * 1000).toLocaleString()}`}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {project.budgetHrs}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                            {project.start}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                            {project.end}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                            {project.teamSize}
                          </td>
                          <td className="p-4 min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    project.progress > 70
                                      ? "bg-green-500"
                                      : project.progress > 0
                                        ? "bg-blue-500"
                                        : "bg-muted-foreground/30"
                                  }`}
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span
                                className={`text-xs font-medium ${
                                  project.progress > 70
                                    ? "text-green-400"
                                    : "text-blue-400"
                                }`}
                              >
                                {project.progress}%
                              </span>
                            </div>
                          </td>
                        </tr>

                        {expanded && (
                          <tr className="bg-muted/10 border-b border-border/50">
                            <td></td>
                            <td colSpan={10} className="p-4">
                              <div className="rounded-lg border border-border/50 overflow-hidden">
                                <table className="w-full">
                                  <thead className="bg-muted/20">
                                    <tr className="text-left">
                                      <th className="p-3 text-xs font-medium text-muted-foreground">
                                        Resource ID
                                      </th>
                                      <th className="p-3 text-xs font-medium text-muted-foreground">
                                        Resource Name
                                      </th>
                                      <th className="p-3 text-xs font-medium text-muted-foreground">
                                        Designation
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {project.resources.length === 0 ? (
                                      <tr>
                                        <td
                                          colSpan={3}
                                          className="p-3 text-sm text-muted-foreground italic"
                                        >
                                          No resources assigned
                                        </td>
                                      </tr>
                                    ) : (
                                      project.resources.map((resource) => (
                                        <tr
                                          key={resource.resourceId}
                                          className="border-t border-border/50"
                                        >
                                          <td className="p-3 text-sm text-muted-foreground">
                                            {resource.resourceId}
                                          </td>
                                          <td className="p-3 text-sm font-medium">
                                            {resource.resourceName}
                                          </td>
                                          <td className="p-3 text-sm text-muted-foreground">
                                            {resource.designation}
                                          </td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
