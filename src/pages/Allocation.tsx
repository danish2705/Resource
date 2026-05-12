import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, CheckCircle } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import { toast } from "sonner";

interface AllocationRecord {
  id: string;
  resource: string;
  project: string;
  role: string;
  allocPercent: number;
  hrsPerWeek: number;
  start: string;
  end: string;
  totalUtil: "OK" | "Full" | "Overallocated";
}

const allocationData: AllocationRecord[] = [
  {
    id: "A-001",
    resource: "Priya Sharma",
    project: "Cloud Migration Phase ...",
    role: "Lead Architect",
    allocPercent: 80,
    hrsPerWeek: 32,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "OK",
  },
  {
    id: "A-002",
    resource: "Kiran Patel",
    project: "Cloud Migration Phase ...",
    role: "Frontend Developer",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "Overallocated",
  },
  {
    id: "A-003",
    resource: "Arjun Mehta",
    project: "Data Platform Modernis...",
    role: "Data Engineer",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "1 Feb",
    end: "31 July",
    totalUtil: "Full",
  },
  {
    id: "A-004",
    resource: "Sneha Iyer",
    project: "DevSecOps Pipeline Set...",
    role: "DevSecOps Lead",
    allocPercent: 80,
    hrsPerWeek: 32,
    start: "1 Mar",
    end: "31 May",
    totalUtil: "OK",
  },
  {
    id: "A-005",
    resource: "Ananya Rao",
    project: "Cloud Migration Phase ...",
    role: "Delivery Manager",
    allocPercent: 60,
    hrsPerWeek: 24,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "OK",
  },
  {
    id: "A-006",
    resource: "Meera Joshi",
    project: "Identity & Access Mana...",
    role: "Cloud Engineer",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "15 Feb",
    end: "15 Aug",
    totalUtil: "Full",
  },
  {
    id: "A-007",
    resource: "Kiran Patel",
    project: "Analytics Dashboard Su...",
    role: "UI Developer",
    allocPercent: 20,
    hrsPerWeek: 8,
    start: "20 Jan",
    end: "30 Apr",
    totalUtil: "Overallocated",
  },
  {
    id: "A-008",
    resource: "Dev Krishnan",
    project: "DevSecOps Pipeline Set...",
    role: "Security Reviewer",
    allocPercent: 50,
    hrsPerWeek: 10,
    start: "1 Mar",
    end: "31 May",
    totalUtil: "OK",
  },
  {
    id: "A-009",
    resource: "Vikram Singh",
    project: "Cloud Migration Phase ...",
    role: "Cloud Engineer",
    allocPercent: 100,
    hrsPerWeek: 40,
    start: "15 Jan",
    end: "30 June",
    totalUtil: "Full",
  },
  {
    id: "A-010",
    resource: "Rohit Nair",
    project: "ML Forecasting Engine",
    role: "ML Engineer",
    allocPercent: 80,
    hrsPerWeek: 32,
    start: "1 May",
    end: "30 Sept",
    totalUtil: "OK",
  },
];

const columns: Column<AllocationRecord>[] = [
  {
    key: "id",
    header: "ID",
    render: (r) => (
      <span className="text-muted-foreground text-xs font-mono">{r.id}</span>
    ),
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
  {
    key: "totalUtil",
    header: "Total Util",
    render: (r) => {
      const colorMap = {
        OK: "bg-green-500/20 text-green-400 border border-green-500/30",
        Full: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        Overallocated: "bg-red-500/20 text-red-400 border border-red-500/30",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[r.totalUtil]}`}
        >
          {r.totalUtil}
        </span>
      );
    },
  },
];

export default function ResourceAllocation() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Allocation Details</CardTitle>
          <div className="flex gap-2"></div>
        </CardHeader>
        <CardContent>
          <DataTable data={allocationData} columns={columns} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
