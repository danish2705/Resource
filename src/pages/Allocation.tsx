import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, CheckCircle } from "lucide-react";
import DataTable, { type Column } from "@/components/DataTable";
import { toast } from "sonner";

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
    key: "billable",
    header: "Billable",
    render: (r) => {
      const color =
        r.billable === "Yes"
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-gray-500/20 text-gray-300 border border-gray-500/30";

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {r.billable}
        </span>
      );
    },
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

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              size="sm"
              onClick={() => toast.success("Allocation validated successfully")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <DataTable data={allocationData} columns={columns} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}
