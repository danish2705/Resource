// src/pages/Resource.tsx

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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Search, X } from "lucide-react";

import DataTable, { type Column } from "@/components/DataTable";

import { resources, type Resource } from "@/mocks/resources";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function isCurrentlyUnavailable(r: Resource): boolean {
  if (!r.unavailability) return false;

  const today = new Date();

  const from = new Date(r.unavailability.from);

  const to = new Date(r.unavailability.to);

  return today >= from && today <= to;
}

// ─────────────────────────────────────────────────────────────
// Table Columns
// ─────────────────────────────────────────────────────────────

const columns: Column<Resource>[] = [
  {
    key: "resourceId",
    header: "Resource ID",
  },

  {
    key: "name",
    header: "Resource Name",

    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
          {r.initials}
        </div>

        <div>
          <div className="font-medium">{r.name}</div>

          <div className="text-xs text-muted-foreground">{r.role}</div>

          {r.unavailability && isCurrentlyUnavailable(r) && (
            <div
              className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium
                ${
                  r.unavailability.state === "out-of-office"
                    ? "bg-amber-500/20 text-amber-700 border border-amber-500/40 dark:text-amber-300"
                    : "bg-red-500/20 text-red-700 border border-red-500/40 dark:text-red-300"
                }`}
            >
              {r.unavailability.state === "out-of-office"
                ? "🌴 Out of Office"
                : "⛔ Unavailable"}

              <span className="opacity-70">
                · {r.unavailability.from} → {r.unavailability.to}
              </span>
            </div>
          )}
        </div>
      </div>
    ),
  },

  {
    key: "level",
    header: "Level",
  },

  {
    key: "team",
    header: "Team",
  },

  {
    key: "reportingManager",
    header: "Reporting Manager",
  },

  {
    key: "employeeType",
    header: "Employee Type",

    render: (r) => (
      <Badge variant={r.employeeType === "Full Time" ? "default" : "secondary"}>
        {r.employeeType}
      </Badge>
    ),
  },

  {
    key: "availableAfter",
    header: "Available Date",
  },

  {
    key: "skills",
    header: "Skills",

    render: (r) => (
      <div className="flex flex-wrap gap-1">
        {r.skills.map((s) => (
          <Badge key={s} variant="secondary" className="text-xs">
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

  {
    key: "location",
    header: "Location",
  },

  {
    key: "status",
    header: "Status",

    render: (r) => {
      const unavailable = isCurrentlyUnavailable(r);

      const status = unavailable ? "Unavailable" : r.status;

      const styles: Record<string, string> = {
        Available:
          "bg-green-500/20 text-green-700 border border-green-500/40 dark:text-green-300",
        Allocated:
          "bg-blue-500/20 text-blue-700 border border-blue-500/40 dark:text-blue-300",
        Overallocated:
          "bg-red-500/20 text-red-700 border border-red-500/40 dark:text-red-300",
        Unavailable:
          "bg-amber-500/20 text-amber-700 border border-amber-500/40 dark:text-amber-300",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
        >
          {status}
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

      return (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{
                width: `${Math.min(r.utilization, 100)}%`,
              }}
            />
          </div>

          <span className="text-xs font-medium">{r.utilization}%</span>
        </div>
      );
    },
  },
];

// ─────────────────────────────────────────────────────────────
// Resource Dialog
// ─────────────────────────────────────────────────────────────

interface ResourceDialogProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  demandId: string;

  projectName: string;

  projectSkills: string[];
}

export function ResourceDialog({
  open,
  onOpenChange,
  projectName,
  projectSkills,
}: ResourceDialogProps) {
  const filteredResources = resources.filter((r) =>
    projectSkills.length === 0
      ? true
      : r.skills.some((s) =>
          projectSkills.some((p) => s.toLowerCase().includes(p.toLowerCase())),
        ),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Matching Resources</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <div className="font-medium">{projectName}</div>

            <div className="flex flex-wrap gap-2 mt-2">
              {projectSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <DataTable data={filteredResources} columns={columns} pageSize={5} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function ResourceInformation() {
  const [search, setSearch] = useState("");

  const [team, setTeam] = useState("all");

  const [status, setStatus] = useState("all");

  const [type, setType] = useState("all");

  const [utilization, setUtilization] = useState("all");

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();

    return resources.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.resourceId.toLowerCase().includes(q);

      const matchTeam = team === "all" || r.team === team;

      const matchStatus = status === "all" || r.status === status;

      const matchType = type === "all" || r.employeeType === type;

      const matchUtil =
        utilization === "all" ||
        (utilization === "low" && r.utilization < 80) ||
        (utilization === "mid" && r.utilization >= 80 && r.utilization < 100) ||
        (utilization === "high" && r.utilization >= 100);

      return matchSearch && matchTeam && matchStatus && matchType && matchUtil;
    });
  }, [search, team, status, type, utilization]);

  const clearFilters = () => {
    setSearch("");
    setTeam("all");
    setStatus("all");
    setType("all");
    setUtilization("all");
  };

  const hasFilters =
    search ||
    team !== "all" ||
    status !== "all" ||
    type !== "all" ||
    utilization !== "all";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resource Catalogue</CardTitle>

        <p className="text-sm text-muted-foreground">
          {resources.length} resources
        </p>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />

            <Input
              className="pl-9 h-9 text-sm"
              placeholder="Search resource, role, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>

              {[...new Set(resources.map((r) => r.team))].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>

              <SelectItem value="Available">Available</SelectItem>

              <SelectItem value="Allocated">Allocated</SelectItem>

              <SelectItem value="Overallocated">Overallocated</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>

              <SelectItem value="Full Time">Full Time</SelectItem>

              <SelectItem value="Contractor">Contractor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={utilization} onValueChange={setUtilization}>
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="All Utilization" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Utilization</SelectItem>

              <SelectItem value="low">Under 80%</SelectItem>

              <SelectItem value="mid">80-99%</SelectItem>

              <SelectItem value="high">100%+</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground">
            {filteredData.length} results
          </span>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <DataTable data={filteredData} columns={columns} pageSize={10} />
      </CardContent>
    </Card>
  );
}
