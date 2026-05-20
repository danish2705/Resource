// src/mocks/allocations.ts

export interface AllocationRow {
  resourceId: string;
  projectId: string;
  resource: string;
  project: string;
  role: string;

  allocationType: "Client" | "Internal";

  allocationPercentage: number;
  hoursPerWeek: number;

  startDate: string;
  endDate: string;

  utilizationStatus: "low" | "medium" | "high";
}

export const allocations: AllocationRow[] = [
  {
    resourceId: "RID-1001",
    projectId: "PID-501",
    resource: "Priya Sharma",
    project: "Cloud Migration Phase 1",
    role: "Lead Architect",

    allocationType: "Client",

    allocationPercentage: 80,
    hoursPerWeek: 32,

    startDate: "15 Jan",
    endDate: "30 June",

    utilizationStatus: "high",
  },

  {
    resourceId: "RID-1004",
    projectId: "PID-501",
    resource: "Kiran Patel",
    project: "Cloud Migration Phase 1",
    role: "Frontend Developer",

    allocationType: "Client",

    allocationPercentage: 100,
    hoursPerWeek: 40,

    startDate: "15 Jan",
    endDate: "30 June",

    utilizationStatus: "high",
  },

  {
    resourceId: "RID-1002",
    projectId: "PID-502",
    resource: "Arjun Mehta",
    project: "Data Platform Modernisation",
    role: "Data Engineer",

    allocationType: "Client",

    allocationPercentage: 100,
    hoursPerWeek: 40,

    startDate: "1 Feb",
    endDate: "31 July",

    utilizationStatus: "high",
  },

  {
    resourceId: "RID-1003",
    projectId: "PID-503",
    resource: "Sneha Iyer",
    project: "DevSecOps Pipeline Setup",
    role: "DevSecOps Lead",

    allocationType: "Internal",

    allocationPercentage: 80,
    hoursPerWeek: 32,

    startDate: "1 Mar",
    endDate: "31 May",

    utilizationStatus: "high",
  },

  {
    resourceId: "RID-1005",
    projectId: "PID-501",
    resource: "Ananya Rao",
    project: "Cloud Migration Phase 1",
    role: "Delivery Manager",

    allocationType: "Client",

    allocationPercentage: 60,
    hoursPerWeek: 24,

    startDate: "15 Jan",
    endDate: "30 June",

    utilizationStatus: "medium",
  },

  {
    resourceId: "RID-1007",
    projectId: "PID-504",
    resource: "Meera Joshi",
    project: "Identity & Access Management",

    role: "Cloud Engineer",

    allocationType: "Client",

    allocationPercentage: 100,
    hoursPerWeek: 40,

    startDate: "15 Feb",
    endDate: "15 Aug",

    utilizationStatus: "high",
  },

  {
    resourceId: "RID-1004",
    projectId: "PID-505",
    resource: "Kiran Patel",
    project: "Analytics Dashboard Suite",

    role: "UI Developer",

    allocationType: "Internal",

    allocationPercentage: 20,
    hoursPerWeek: 8,

    startDate: "20 Jan",
    endDate: "30 Apr",

    utilizationStatus: "low",
  },

  {
    resourceId: "RID-1008",
    projectId: "PID-503",
    resource: "Dev Krishnan",
    project: "DevSecOps Pipeline Setup",

    role: "Security Reviewer",

    allocationType: "Internal",

    allocationPercentage: 50,
    hoursPerWeek: 10,

    startDate: "1 Mar",
    endDate: "31 May",

    utilizationStatus: "medium",
  },

  {
    resourceId: "RID-1009",
    projectId: "PID-501",
    resource: "Vikram Singh",
    project: "Cloud Migration Phase 1",

    role: "Cloud Engineer",

    allocationType: "Client",

    allocationPercentage: 100,
    hoursPerWeek: 40,

    startDate: "15 Jan",
    endDate: "30 June",

    utilizationStatus: "high",
  },

  {
    resourceId: "RID-1006",
    projectId: "PID-506",
    resource: "Rohit Nair",
    project: "ML Forecasting Engine",

    role: "ML Engineer",

    allocationType: "Client",

    allocationPercentage: 80,
    hoursPerWeek: 32,

    startDate: "1 May",
    endDate: "30 Sept",

    utilizationStatus: "high",
  },
];
