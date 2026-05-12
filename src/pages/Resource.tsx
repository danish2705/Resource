import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable, { type Column } from "@/components/DataTable";

interface Resource {
  id: string;
  name: string;
  role: string;
  initials: string;
  level: string;
  team: string;
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
    name: "Priya Sharma",
    role: "Cloud Architect",
    initials: "PS",
    level: "Senior",
    team: "Cloud Eng",
    skills: ["AWS", "Terraform", "Kubernetes"],
    ratePerHr: 95,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 80,
  },
  {
    id: "res-1",
    name: "Arjun Mehta",
    role: "Data Engineer",
    initials: "AM",
    level: "Mid",
    team: "Data Eng",
    skills: ["Python", "Spark", "SQL"],
    ratePerHr: 75,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Allocated",
    utilization: 100,
  },
  {
    id: "res-2",
    name: "Sneha Iyer",
    role: "DevSecOps Engineer",
    initials: "SI",
    level: "Senior",
    team: "DevSecOps",
    skills: ["Docker", "CI/CD", "Security"],
    ratePerHr: 85,
    capacity: "40 hrs",
    location: "Brisbane",
    status: "Allocated",
    utilization: 80,
  },
  {
    id: "res-3",
    name: "Kiran Patel",
    role: "Full Stack Developer",
    initials: "KP",
    level: "Mid",
    team: "Cloud Eng",
    skills: ["React", "Node.js", "APIs"],
    ratePerHr: 70,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Overallocated",
    utilization: 120,
  },
  {
    id: "res-4",
    name: "Ananya Rao",
    role: "Delivery Manager",
    initials: "AR",
    level: "Senior",
    team: "Delivery",
    skills: ["Agile", "PMO", "Stakeholder Mgmt"],
    ratePerHr: 90,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 60,
  },
  {
    id: "res-5",
    name: "Rohit Nair",
    role: "Data Scientist",
    initials: "RN",
    level: "Mid",
    team: "Data Eng",
    skills: ["ML", "Python", "TensorFlow"],
    ratePerHr: 80,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Available",
    utilization: 80,
  },
  {
    id: "res-6",
    name: "Meera Joshi",
    role: "Cloud Engineer",
    initials: "MJ",
    level: "Junior",
    team: "Cloud Eng",
    skills: ["Azure", "ARM Templates", "Networking"],
    ratePerHr: 55,
    capacity: "40 hrs",
    location: "Perth",
    status: "Allocated",
    utilization: 100,
  },
  {
    id: "res-7",
    name: "Dev Krishnan",
    role: "Security Engineer",
    initials: "DK",
    level: "Senior",
    team: "DevSecOps",
    skills: ["Pen Testing", "SIEM", "IAM"],
    ratePerHr: 90,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 50,
  },
  {
    id: "res-8",
    name: "Vikram Singh",
    role: "Cloud Engineer",
    initials: "VS",
    level: "Mid",
    team: "Cloud Eng",
    skills: ["AWS", "CloudFormation", "Lambda"],
    ratePerHr: 75,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Allocated",
    utilization: 100,
  },
  {
    id: "res-9",
    name: "Lalitha Krishnan",
    role: "ML Engineer",
    initials: "LK",
    level: "Mid",
    team: "Data Eng",
    skills: ["ML", "Python", "Spark"],
    ratePerHr: 80,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Available",
    utilization: 80,
  },
];

const totalAllocated = resourceData.filter(
  (r) => r.status === "Allocated",
).length;
const totalAvailable = resourceData.filter(
  (r) => r.status === "Available",
).length;
const totalOverallocated = resourceData.filter(
  (r) => r.status === "Overallocated",
).length;

const columns: Column<Resource>[] = [
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

export default function ResourceInformation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resource Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Allocated</p>
              <p className="text-xl font-bold text-blue-500">
                {totalAllocated}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-xl font-bold text-green-500">
                {totalAvailable}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Overallocated</p>
              <p className="text-xl font-bold text-red-500">
                {totalOverallocated}
              </p>
            </CardContent>
          </Card>
        </div>
        <DataTable data={resourceData} columns={columns} pageSize={10} />
      </CardContent>
    </Card>
  );
}
