import { useState, useMemo } from "react";
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
import { Search } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";

interface Resource {
  id: string;
  resourceId: string;
  name: string;
  role: string;
  initials: string;
  level: string;
  team: string;
  reportingManager: string;
  employeeType: "FTE" | "Contractor";
  availableAfter: string;
  skills: string[];
  ratePerHr: number;
  capacity: string;
  location: string;
  status: "Allocated" | "Available" | "Overallocated";
  utilization: number;
}

const resourceData: Resource[] = [
  {
    id: "res-0",
    resourceId: "RID-1001",
    name: "Priya Sharma",
    role: "Cloud Architect",
    initials: "PS",
    level: "Senior",
    team: "Cloud Eng",
    reportingManager: "Ananya Rao",
    employeeType: "FTE",
    availableAfter: "Jun 4",
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
    name: "Arjun Mehta",
    role: "Data Engineer",
    initials: "AM",
    level: "Mid",
    team: "Data Eng",
    reportingManager: "Ananya Rao",
    employeeType: "Contractor",
    availableAfter: "May 6",
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
    reportingManager: "Dev Krishnan",
    employeeType: "FTE",
    availableAfter: "Dec 8",
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
    availableAfter: "Jul 12",
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
    name: "Ananya Rao",
    role: "Delivery Manager",
    initials: "AR",
    level: "Senior",
    team: "Delivery",
    reportingManager: "Executive Board",
    employeeType: "FTE",
    availableAfter: "Aug 2",
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
    reportingManager: "Ananya Rao",
    employeeType: "FTE",
    availableAfter: "May 18",
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
    name: "Meera Joshi",
    role: "Cloud Engineer",
    initials: "MJ",
    level: "Junior",
    team: "Cloud Eng",
    reportingManager: "Priya Sharma",
    employeeType: "FTE",
    availableAfter: "Jun 10",
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
    reportingManager: "Ananya Rao",
    employeeType: "FTE",
    availableAfter: "May 30",
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
    name: "Vikram Singh",
    role: "Cloud Engineer",
    initials: "VS",
    level: "Mid",
    team: "Cloud Eng",
    reportingManager: "Priya Sharma",
    employeeType: "Contractor",
    availableAfter: "Jun 21",
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
    employeeType: "FTE",
    availableAfter: "Sep 14",
    skills: ["ML", "Python", "Spark"],
    ratePerHr: 80,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Available",
    utilization: 80,
  },
];

const columns: Column<Resource>[] = [
  { key: "resourceId", header: "Resource ID" },
  {
    key: "name",
    header: "Resource",
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
  { key: "availableAfter", header: "Available After" },
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
    header: "Rate/Hr",
    render: (r) => <span className="font-medium">${r.ratePerHr}</span>,
  },
  { key: "capacity", header: "Capacity" },
  { key: "location", header: "Location" },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      const colorMap = {
        Allocated: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        Available: "bg-green-500/20 text-green-400 border border-green-500/30",
        Overallocated: "bg-red-500/20 text-red-400 border border-red-500/30",
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

// Derive unique values for dropdowns
const allTeams = Array.from(new Set(resourceData.map((r) => r.team)));
const allLevels = Array.from(new Set(resourceData.map((r) => r.level)));
const allLocations = Array.from(new Set(resourceData.map((r) => r.location)));
const allManagers = Array.from(
  new Set(resourceData.map((r) => r.reportingManager)),
);

export default function ResourceInformation() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [empTypeFilter, setEmpTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return resourceData.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.resourceId.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchTeam = teamFilter === "all" || r.team === teamFilter;
      const matchLevel = levelFilter === "all" || r.level === levelFilter;
      const matchEmpType =
        empTypeFilter === "all" || r.employeeType === empTypeFilter;
      const matchLocation =
        locationFilter === "all" || r.location === locationFilter;
      const matchManager =
        managerFilter === "all" || r.reportingManager === managerFilter;
      return (
        matchSearch &&
        matchStatus &&
        matchTeam &&
        matchLevel &&
        matchEmpType &&
        matchLocation &&
        matchManager
      );
    });
  }, [
    search,
    statusFilter,
    teamFilter,
    levelFilter,
    empTypeFilter,
    locationFilter,
    managerFilter,
  ]);

  const activeFilterCount = [
    statusFilter,
    teamFilter,
    levelFilter,
    empTypeFilter,
    locationFilter,
    managerFilter,
  ].filter((v) => v !== "all").length;

  function clearAllFilters() {
    setSearch("");
    setStatusFilter("all");
    setTeamFilter("all");
    setLevelFilter("all");
    setEmpTypeFilter("all");
    setLocationFilter("all");
    setManagerFilter("all");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Named Resource Catalogue</CardTitle>
        <p className="text-sm text-muted-foreground">
          {filteredData.length} resources · live utilization from allocations
        </p>
      </CardHeader>

      <CardContent>
        {/* Row 1: Search + results count + clear */}
        <div className="flex items-center gap-3 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search name, role, skill, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredData.length} results
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 whitespace-nowrap transition-colors"
            >
              Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {/* Row 2: Dropdown filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Allocated">Allocated</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Overallocated">Overallocated</SelectItem>
            </SelectContent>
          </Select>

          {/* Team */}
          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {allTeams.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Level */}
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {allLevels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Employee Type */}
          <Select value={empTypeFilter} onValueChange={setEmpTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Emp Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Emp Types</SelectItem>
              <SelectItem value="FTE">FTE</SelectItem>
              <SelectItem value="Contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>

          {/* Location */}
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {allLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reporting Manager */}
          <Select value={managerFilter} onValueChange={setManagerFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="All Managers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Managers</SelectItem>
              {allManagers.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable data={filteredData} columns={columns} pageSize={10} />
      </CardContent>
    </Card>
  );
}
