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
import { X, Search } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import { resources, type Resource } from "@/mocks/resources";

// ─── Table Column Definitions ─────────────────────────────────────────────────

const columns: Column<Resource>[] = [
  {
    key: "resourceId",
    header: "Resource ID",
    render: (r) => (
      <span className="text-xs whitespace-nowrap text-muted-foreground font-mono">
        {r.resourceId}
      </span>
    ),
  },
  {
    key: "name",
    header: "Resource",
    render: (r) => (
      <div className="flex items-center gap-1.5">
        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
          {r.initials}
        </div>
        <div>
          <div className="font-medium text-foreground text-xs whitespace-nowrap">
            {r.name}
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">
            {r.role}
          </div>
          {r.unavailability && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap mt-0.5
              ${
                r.unavailability.state === "out-of-office"
                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-300"
                  : "bg-red-500/15 text-red-600 dark:text-red-300"
              }`}
            >
              {r.unavailability.state === "out-of-office"
                ? "🏖 OOO"
                : "⛔ Unavailable"}{" "}
              {r.unavailability.from} – {r.unavailability.to}
            </span>
          )}
        </div>
      </div>
    ),
  },
  { key: "level", header: "Level" },
  { key: "team", header: "Team" },
  {
    key: "reportingManager",
    header: "Reporting Manager",
    render: (r) => (
      <span className="text-xs whitespace-nowrap">{r.reportingManager}</span>
    ),
  },
  {
    key: "employeeType",
    header: "Employee Type",
    render: (r) => (
      <Badge
        variant={r.employeeType === "Full Time" ? "default" : "secondary"}
        className="text-xs whitespace-nowrap"
      >
        {r.employeeType}
      </Badge>
    ),
  },
  {
    key: "availableAfter",
    header: "Available Date",
    render: (r) => (
      <span className="whitespace-nowrap text-xs">{r.availableAfter}</span>
    ),
  },
  {
    key: "skills",
    header: "Skills",
    render: (r) => (
      <div className="flex flex-wrap gap-1 max-w-[120px]">
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
    header: "Rate/Hrs",
    render: (r) => (
      <div className="flex justify-center items-center w-full">
        <span className="font-medium text-xs whitespace-nowrap">
          ${r.ratePerHr}
        </span>
      </div>
    ),
  },
  {
    key: "location",
    header: "Location",
    render: (r) => (
      <span className="text-xs whitespace-nowrap">{r.location}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => {
      if (r.unavailability) {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-amber-500/15 text-amber-700 border border-amber-500/30 dark:text-amber-300">
            Unavailable
          </span>
        );
      }
      const colorMap = {
        Allocated:
          "bg-blue-500/15 text-blue-700 border border-blue-500/30 dark:text-blue-300",
        Available:
          "bg-green-500/15 text-green-700 border border-green-500/30 dark:text-green-300",
        Overallocated:
          "bg-red-500/15 text-red-700 border border-red-500/30 dark:text-red-300",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorMap[r.status]}`}
        >
          {r.status}
        </span>
      );
    },
  },
  {
    key: "utilization",
    header: "Util%",
    render: (r) => {
      if (r.unavailability) {
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${Math.min(r.utilization, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium whitespace-nowrap text-amber-500">
              {r.utilization}%
            </span>
          </div>
        );
      }
      const barColor =
        r.utilization > 100
          ? "bg-red-500"
          : r.utilization >= 80
            ? "bg-blue-500"
            : "bg-green-500";
      const textColor =
        r.utilization > 100
          ? "text-red-400"
          : r.utilization >= 80
            ? "text-blue-400"
            : "text-green-400";
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${Math.min(r.utilization, 100)}%` }}
            />
          </div>
          <span className={`text-xs font-medium whitespace-nowrap ${textColor}`}>
            {r.utilization}%
          </span>
        </div>
      );
    },
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ResourceInformation() {
  const [search, setSearch] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterUtil, setFilterUtil] = useState("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return resources.filter((r) => {
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
    <Card className="h-[calc(100vh-120px)] flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Resource Catalogue</CardTitle>
        <p className="text-sm text-muted-foreground">
          {resources.length} resources
        </p>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              className="pl-9 h-9 text-sm"
              placeholder="Search resource, role, ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="h-9 w-[140px] text-sm">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {[...new Set(resources.map((r) => r.team))].sort().map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-9 w-[130px] text-sm">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Full Time">Full Time</SelectItem>
              <SelectItem value="Contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="flex-1 min-h-0">
          <DataTable data={filteredData} columns={columns} pageSize={10} />
        </div>
      </CardContent>
    </Card>
  );
}
