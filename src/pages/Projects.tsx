import { useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

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
    start: "15 Jan",
    end: "30 June",
    teamSize: "4 resources",
    progress: 42,
    resources: [
      {
        resourceId: "RID-1001",
        resourceName: "Priya Sharma",
        designation: "Cloud Architect",
      },
      {
        resourceId: "RID-1004",
        resourceName: "Kiran Patel",
        designation: "Frontend Developer",
      },
      {
        resourceId: "RID-1005",
        resourceName: "Ananya Rao",
        designation: "Delivery Manager",
      },
      {
        resourceId: "RID-1009",
        resourceName: "Vikram Singh",
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
    start: "1 Feb",
    end: "31 July",
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
    start: "1 Mar",
    end: "31 May",
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
    start: "20 Jan",
    end: "30 Apr",
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
    start: "1 Apr",
    end: "15 June",
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
    start: "15 Feb",
    end: "15 Aug",
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
    start: "1 May",
    end: "30 Sept",
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

export default function ProjectsPage() {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search + Filters */}

      <div className="flex gap-4">
        <div className="flex items-center bg-card border rounded-lg px-3 flex-1 h-12">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />

          <input
            placeholder="Search project or client..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <select className="bg-card border rounded-lg px-4 w-32">
          <option>All</option>
        </select>

        <select className="bg-card border rounded-lg px-4 w-32">
          <option>All</option>
        </select>
      </div>

      {/* Table */}

      <div className="border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[1400px]">
          <thead className="bg-card border-b">
            <tr className="text-left text-xs font-medium tracking-wide text-muted-foreground/80 uppercase">
              <th className="w-8 px-2 py-3"></th>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">PROJECT</th>
              <th className="px-4 py-3 font-medium">STATUS</th>
              <th className="px-4 py-3 font-medium">PRIORITY</th>
              <th className="px-4 py-3 font-medium">BUDGET</th>
              <th className="px-4 py-3 font-medium">BUDGET HRS</th>
              <th className="px-4 py-3 font-medium">START</th>
              <th className="px-4 py-3 font-medium">END</th>
              <th className="px-4 py-3 font-medium">TEAM SIZE</th>
              <th className="p-4 min-w-[160px]">PROGRESS</th>
            </tr>
          </thead>

          <tbody>
            {projectData.map((project) => {
              const expanded = expandedRows.includes(project.id);

              return (
                <>
                  <tr
                    key={project.id}
                    className="border-b border-border/50 hover:bg-accent/20 transition-colors"
                  >
                    {/* Arrow */}

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

                    {/* ID */}

                    <td className="p-4 text-sm text-muted-foreground font-medium">
                      {project.id}
                    </td>

                    {/* Project */}

                    <td className="p-4 min-w-[240px]">
                      <div className="font-medium text-foreground">
                        {project.project}
                      </div>

                      <div className="text-xs text-muted-foreground mt-0.5">
                        {project.client}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          project.status === "Active"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    {/* Priority */}

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          project.priority === "High"
                            ? "bg-red-500/20 text-red-400 border-red-500/30"
                            : project.priority === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-green-500/20 text-green-400 border-green-500/30"
                        }`}
                      >
                        {project.priority}
                      </span>
                    </td>

                    {/* Budget */}

                    <td className="p-4 text-sm font-medium">
                      {project.budget}
                    </td>

                    {/* Budget Hrs */}

                    <td className="p-4 text-sm text-muted-foreground">
                      {project.budgetHrs}
                    </td>

                    {/* Start */}

                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {project.start}
                    </td>

                    {/* End */}

                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {project.end}
                    </td>

                    {/* Team Size */}

                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {project.teamSize}
                    </td>

                    {/* Progress */}

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
                            style={{
                              width: `${project.progress}%`,
                            }}
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

                  {/* Accordion */}

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
                              {project.resources.map((resource) => (
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
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
