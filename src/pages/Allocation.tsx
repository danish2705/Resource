import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";

interface AllocationRecord {
  id?: string;
  [key: string]: unknown;
  resourceId: string;
  projectId: string;
  resource: string;
  project: string;
  role: string;
  billable: "Yes" | "No";
  allocationType: "Client" | "Internal";
  allocPercent: number;
  hrsPerWeek: number;
  start: string;
  end: string;
  totalUtil: "OK" | "Full" | "Overallocated";
}

const allocationData: AllocationRecord[] = [
  {
    resourceId: "RID-1001",
    projectId: "PID-501",
    resource: "Priya Sharma",
    project: "Cloud Migration Phase ...",
    role: "Lead Architect",
    billable: "Yes",
    allocationType: "Client",
    allocPercent: 80,
    hrsPerWeek: 32,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "OK",
  },
  {
    resourceId: "RID-1004",
    projectId: "PID-501",
    resource: "Kiran Patel",
    project: "Cloud Migration Phase ...",
    role: "Frontend Developer",
    billable: "Yes",
    allocationType: "Client",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "Overallocated",
  },
  {
    resourceId: "RID-1002",
    projectId: "PID-502",
    resource: "Arjun Mehta",
    project: "Data Platform Modernis...",
    role: "Data Engineer",
    billable: "Yes",
    allocationType: "Client",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "1 Feb",
    end: "31 July",
    totalUtil: "Full",
  },
  {
    resourceId: "RID-1003",
    projectId: "PID-503",
    resource: "Sneha Iyer",
    project: "DevSecOps Pipeline Set...",
    role: "DevSecOps Lead",
    billable: "No",
    allocationType: "Internal",
    allocPercent: 80,
    hrsPerWeek: 32,
    start: "1 Mar",
    end: "31 May",
    totalUtil: "OK",
  },
  {
    resourceId: "RID-1005",
    projectId: "PID-501",
    resource: "Ananya Rao",
    project: "Cloud Migration Phase ...",
    role: "Delivery Manager",
    billable: "Yes",
    allocationType: "Client",
    allocPercent: 60,
    hrsPerWeek: 24,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "OK",
  },
  {
    resourceId: "RID-1007",
    projectId: "PID-504",
    resource: "Meera Joshi",
    project: "Identity & Access Mana...",
    role: "Cloud Engineer",
    billable: "Yes",
    allocationType: "Client",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "15 Feb",
    end: "15 Aug",
    totalUtil: "Full",
  },
  {
    resourceId: "RID-1004",
    projectId: "PID-505",
    resource: "Kiran Patel",
    project: "Analytics Dashboard Su...",
    role: "UI Developer",
    billable: "No",
    allocationType: "Internal",
    allocPercent: 20,
    hrsPerWeek: 8,
    start: "20 Jan",
    end: "30 Apr",
    totalUtil: "Overallocated",
  },
  {
    resourceId: "RID-1008",
    projectId: "PID-503",
    resource: "Dev Krishnan",
    project: "DevSecOps Pipeline Set...",
    role: "Security Reviewer",
    billable: "No",
    allocationType: "Internal",
    allocPercent: 50,
    hrsPerWeek: 10,
    start: "1 Mar",
    end: "31 May",
    totalUtil: "OK",
  },
  {
    resourceId: "RID-1009",
    projectId: "PID-501",
    resource: "Vikram Singh",
    project: "Cloud Migration Phase ...",
    role: "Cloud Engineer",
    billable: "Yes",
    allocationType: "Client",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "Full",
  },
  {
    resourceId: "RID-1006",
    projectId: "PID-506",
    resource: "Rohit Nair",
    project: "ML Forecasting Engine",
    role: "ML Engineer",
    billable: "Yes",
    allocationType: "Client",
    allocPercent: 80,
    hrsPerWeek: 32,
    start: "1 May",
    end: "30 Sept",
    totalUtil: "OK",
  },
];

const columns: Column<AllocationRecord>[] = [
  {
    key: "resourceId",
    header: "Resource ID",
    render: (r) => <span className="text-xs font-medium">{r.resourceId}</span>,
  },
  {
    key: "projectId",
    header: "Project ID",
    render: (r) => <span className="text-xs font-medium">{r.projectId}</span>,
  },
  {
    key: "resource",
    header: "Resource",
    render: (r) => (
      <span className="font-semibold text-foreground">{r.resource}</span>
    ),
  },
  {
    key: "project",
    header: "Project",
    render: (r) => (
      <span className="text-sm text-muted-foreground">{r.project}</span>
    ),
  },
  {
    key: "role",
    header: "Role",
    render: (r) => (
      <span className="text-sm text-muted-foreground">{r.role}</span>
    ),
  },

  {
    key: "allocationType",
    header: "Allocation Type",
    render: (r) => {
      const color =
        r.allocationType === "Client"
          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
          : "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {r.allocationType}
        </span>
      );
    },
  },
  {
    key: "allocPercent",
    header: "Alloc %",
    render: (r) => {
      const color =
        r.allocPercent === 100
          ? "text-blue-400"
          : r.allocPercent >= 80
            ? "text-yellow-400"
            : "text-cyan-400";
      return (
        <span className={`font-semibold ${color}`}>{r.allocPercent}%</span>
      );
    },
  },
  {
    key: "hrsPerWeek",
    header: "Hrs/Wk",
    render: (r) => <span className="text-sm">{r.hrsPerWeek}</span>,
  },
  {
    key: "start",
    header: "Start",
    render: (r) => (
      <span className="text-sm text-muted-foreground">{r.start}</span>
    ),
  },
  {
    key: "end",
    header: "End",
    render: (r) => (
      <span className="text-sm text-muted-foreground">{r.end}</span>
    ),
  },
];

// Derive unique project IDs for dropdown
const allProjects = Array.from(new Set(allocationData.map((r) => r.projectId)));

export default function ResourceAllocation() {
  const [search, setSearch] = useState("");
  const [billableFilter, setBillableFilter] = useState("all");
  const [allocationTypeFilter, setAllocationTypeFilter] = useState("all");
  const [totalUtilFilter, setTotalUtilFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return allocationData.filter((r) => {
      const matchSearch =
        !q ||
        r.resource.toLowerCase().includes(q) ||
        r.resourceId.toLowerCase().includes(q) ||
        r.project.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.projectId.toLowerCase().includes(q);
      const matchBillable =
        billableFilter === "all" || r.billable === billableFilter;
      const matchType =
        allocationTypeFilter === "all" ||
        r.allocationType === allocationTypeFilter;
      const matchUtil =
        totalUtilFilter === "all" || r.totalUtil === totalUtilFilter;
      const matchProject =
        projectFilter === "all" || r.projectId === projectFilter;
      return (
        matchSearch && matchBillable && matchType && matchUtil && matchProject
      );
    });
  }, [
    search,
    billableFilter,
    allocationTypeFilter,
    totalUtilFilter,
    projectFilter,
  ]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allocation Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredData.length} allocation
            {filteredData.length !== 1 ? "s" : ""}
          </p>
        </CardHeader>

        <CardContent>
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search resource, project, role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Project ID */}
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {allProjects.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Billable */}
            <Select value={billableFilter} onValueChange={setBillableFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Billable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Billable</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>

            {/* Allocation Type */}
            <Select
              value={allocationTypeFilter}
              onValueChange={setAllocationTypeFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Alloc Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
              </SelectContent>
            </Select>

            {/* Total Util */}
            <Select value={totalUtilFilter} onValueChange={setTotalUtilFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Total Util" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Utilization</SelectItem>
                <SelectItem value="OK">OK</SelectItem>
                <SelectItem value="Full">Full</SelectItem>
                <SelectItem value="Overallocated">Overallocated</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredData.length} results
            </span>
          </div>

          <DataTable data={filteredData} columns={columns} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
