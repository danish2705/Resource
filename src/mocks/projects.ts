export interface ProjectResource {
  resourceId: string;
  resourceName: string;
  designation: string;
}

export interface Project {
  id: string;
  project: string;
  client: string;
  pillar: "Hi-tech" | "Retail" | "Banking" | "Healthcare" | "Life Sciences"; // ADD THIS
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

export const PROGRESS_RANGES = [
  { label: "All Progress", value: "all" },
  { label: "Not started (0%)", value: "0" },
  { label: "Early stage (1–30%)", value: "1-30" },
  { label: "In progress (31–70%)", value: "31-70" },
  { label: "Near complete (71–99%)", value: "71-99" },
  { label: "Complete (100%)", value: "100" },
];

export const projectData: Project[] = [
  {
    id: "P-001",
    project: "Cloud Migration Phase 2",
    client: "TechCorp AU",
    pillar: "Hi-tech",
    status: "Active",
    priority: "High",
    budget: "$250,000",
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
    pillar: "Banking",
    status: "Active",
    priority: "High",
    budget: "$180,000",
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
    pillar: "Hi-tech",
    status: "Active",
    priority: "Medium",
    budget: "$95,000",
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
    pillar: "Retail",
    status: "Active",
    priority: "Medium",
    budget: "$70,000",
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
    pillar: "Banking",
    status: "Planning",
    priority: "Low",
    budget: "$50,000",
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
    pillar: "Healthcare",
    status: "Active",
    priority: "High",
    budget: "$120,000",
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
    pillar: "Life Sciences",
    status: "Planning",
    priority: "Medium",
    budget: "$90,000",
    budgetHrs: "1,000",
    start: "1 May 2026",
    end: "30 Sept 2027",
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
