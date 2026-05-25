import { useState, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePillarFilter } from "@/hooks/usePillarFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";

import DataTable, { type Column } from "@/components/DataTable";

import { allocations, type AllocationRow } from "@/mocks/allocation";

const columns: Column<AllocationRow>[] = [
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
  <div className="flex justify-center items-center w-full">
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {r.allocationType}
    </span>
  </div>
);
    },
  },

  {
    key: "allocationPercentage",
    header: "Alloc %",
    render: (r) => {
      const color =
        r.allocationPercentage === 100
          ? "text-blue-400"
          : r.allocationPercentage >= 80
            ? "text-yellow-400"
            : "text-cyan-400";

      return (
        <div className="flex justify-center items-center w-full">
        <span className={`font-semibold ${color}`}>
        {r.allocationPercentage}%
        </span>
        </div>
      );
    },
  },

  {
    key: "hoursPerWeek",
    header: "Hrs/Wk",
    render: (r) => (
  <div className="flex justify-center items-center w-full">
    <span className="text-sm">{r.hoursPerWeek}</span>
  </div>
),
  },

  {
    key: "startDate",
    header: "Start",
    render: (r) => (
      <span className="text-sm text-muted-foreground">{r.startDate}</span>
    ),
  },

  {
    key: "endDate",
    header: "End",
    render: (r) => (
      <span className="text-sm text-muted-foreground">{r.endDate}</span>
    ),
  },
];

export default function ResourceAllocation() {
  const [search, setSearch] = useState("");
  const { filterByPillar } = usePillarFilter();
  const visibleAllocations = filterByPillar(allocations);
  const allProjects = Array.from(
    new Set(visibleAllocations.map((r) => r.projectId)),
  );
  const [allocationTypeFilter, setAllocationTypeFilter] = useState("all");

  const [projectFilter, setProjectFilter] = useState("all");

  const [utilizationFilter, setUtilizationFilter] = useState("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();

    return visibleAllocations.filter((r) => {
      const matchSearch =
        !q ||
        r.resource.toLowerCase().includes(q) ||
        r.resourceId.toLowerCase().includes(q) ||
        r.project.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.projectId.toLowerCase().includes(q);

      const matchType =
        allocationTypeFilter === "all" ||
        r.allocationType === allocationTypeFilter;

      const matchProject =
        projectFilter === "all" || r.projectId === projectFilter;

      const matchUtilization =
        utilizationFilter === "all" ||
        r.utilizationStatus === utilizationFilter;

      return matchSearch && matchType && matchProject && matchUtilization;
    });
  }, [search, allocationTypeFilter, projectFilter, utilizationFilter]);

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
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search resource, project, role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Projects */}
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Projects" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>

                {allProjects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Allocation Type */}
            <Select
              value={allocationTypeFilter}
              onValueChange={setAllocationTypeFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Allocation Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>

                <SelectItem value="Client">Client</SelectItem>

                <SelectItem value="Internal">Internal</SelectItem>
              </SelectContent>
            </Select>

            {/* Utilization */}
            <Select
              value={utilizationFilter}
              onValueChange={setUtilizationFilter}
            >
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Utilization" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Utilization</SelectItem>

                <SelectItem value="low">Low</SelectItem>

                <SelectItem value="medium">Medium</SelectItem>

                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredData.length} results
            </span>
          </div>

          {/* Table */}
          <DataTable
            data={filteredData}
            columns={columns}
            pageSize={10}
          ></DataTable>
        </CardContent>
      </Card>
    </div>
  );
}
