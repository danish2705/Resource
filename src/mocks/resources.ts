// src/mocks/resources.ts

export interface Resource {
  id: string;

  resourceId: string;

  name: string;
  initials: string;

  role: string;
  level: "Junior" | "Mid" | "Senior";

  team: string;

  reportingManager: string;

  employeeType: "Full Time" | "Contractor";

  availableAfter: string;

  skills: string[];

  ratePerHr: number;

  capacity: string;

  location: string;

  status: "Allocated" | "Available" | "Overallocated";

  utilization: number;

  unavailability?: {
    state: "out-of-office" | "unavailable";
    from: string;
    to: string;
  };
}

export const resources: Resource[] = [
  {
    id: "res-0",

    resourceId: "RID-1001",

    name: "Priya Sharma",
    initials: "PS",

    role: "Cloud Architect",
    level: "Senior",

    team: "Cloud Eng",

    reportingManager: "Emma Wilson",

    employeeType: "Full Time",

    availableAfter: "2026-06-04",

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

    name: "Liam Anderson",
    initials: "LA",

    role: "Data Engineer",
    level: "Mid",

    team: "Data Eng",

    reportingManager: "Ananya Rao",

    employeeType: "Contractor",

    availableAfter: "2027-05-06",

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
    initials: "SI",

    role: "DevSecOps Engineer",
    level: "Senior",

    team: "DevSecOps",

    reportingManager: "Daniel Carter",

    employeeType: "Full Time",

    availableAfter: "2027-12-08",

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
    initials: "KP",

    role: "Full Stack Developer",
    level: "Mid",

    team: "Cloud Eng",

    reportingManager: "Priya Sharma",

    employeeType: "Contractor",

    availableAfter: "2026-07-12",

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

    name: "Olivia Bennett",
    initials: "OB",

    role: "Delivery Manager",
    level: "Senior",

    team: "Delivery",

    reportingManager: "Executive Board",

    employeeType: "Full Time",

    availableAfter: "2027-08-02",

    skills: ["Agile", "PMO", "Stakeholder Mgmt"],

    ratePerHr: 90,

    capacity: "40 hrs",

    location: "Sydney",

    status: "Available",

    utilization: 60,
  },

  {
    id: "res-5",

    resourceId: "RID-1006",

    name: "Rohit Nair",
    initials: "RN",

    role: "Data Scientist",
    level: "Mid",

    team: "Data Eng",

    reportingManager: "Olivia Bennett",

    employeeType: "Full Time",

    availableAfter: "2026-05-18",

    skills: ["ML", "Python", "TensorFlow"],

    ratePerHr: 80,

    capacity: "40 hrs",

    location: "Melbourne",

    status: "Available",

    utilization: 80,

    unavailability: {
      state: "out-of-office",
      from: "2026-05-15",
      to: "2026-05-30",
    },
  },

  {
    id: "res-6",

    resourceId: "RID-1007",

    name: "Sophia Miller",
    initials: "SM",

    role: "Cloud Engineer",
    level: "Junior",

    team: "Cloud Eng",

    reportingManager: "Priya Sharma",

    employeeType: "Full Time",

    availableAfter: "2026-06-10",

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
    initials: "DK",

    role: "Security Engineer",
    level: "Senior",

    team: "DevSecOps",

    reportingManager: "Emma Wilson",

    employeeType: "Full Time",

    availableAfter: "2027-05-30",

    skills: ["Pen Testing", "SIEM", "IAM"],

    ratePerHr: 90,

    capacity: "40 hrs",

    location: "Sydney",

    status: "Allocated",

    utilization: 100,
  },

  {
    id: "res-8",

    resourceId: "RID-1009",

    name: "Ethan Brooks",
    initials: "EB",

    role: "Cloud Engineer",
    level: "Mid",

    team: "Cloud Eng",

    reportingManager: "Priya Sharma",

    employeeType: "Contractor",

    availableAfter: "2026-06-21",

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
    initials: "LK",

    role: "ML Engineer",
    level: "Mid",

    team: "Data Eng",

    reportingManager: "Rohit Nair",

    employeeType: "Full Time",

    availableAfter: "2026-09-14",

    skills: ["ML", "Python", "Spark"],

    ratePerHr: 80,

    capacity: "40 hrs",

    location: "Melbourne",

    status: "Available",

    utilization: 80,

    unavailability: {
      state: "out-of-office",
      from: "2026-05-15",
      to: "2026-05-30",
    },
  },

  {
    id: "res-10",
    resourceId: "RID-1011",
    name: "Anika Mehta",
    initials: "AM",
    role: "Business Analyst",
    level: "Senior",
    team: "Delivery",
    reportingManager: "Olivia Bennett",
    employeeType: "Full Time",
    availableAfter: "2026-06-01",
    skills: ["Business Analysis", "Agile", "Requirements"],
    ratePerHr: 85,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Available",
    utilization: 55,
  },

  {
    id: "res-11",
    resourceId: "RID-1012",
    name: "James Thornton",
    initials: "JT",
    role: "Technical Lead",
    level: "Senior",
    team: "Cloud Eng",
    reportingManager: "Priya Sharma",
    employeeType: "Full Time",
    availableAfter: "2026-07-01",
    skills: ["Architecture", "Java", "Microservices"],
    ratePerHr: 110,
    capacity: "40 hrs",
    location: "Melbourne",
    status: "Allocated",
    utilization: 70,
  },

  {
    id: "res-12",
    resourceId: "RID-1013",
    name: "Sara Nguyen",
    initials: "SN",
    role: "QA Engineer",
    level: "Mid",
    team: "DevSecOps",
    reportingManager: "Daniel Carter",
    employeeType: "Contractor",
    availableAfter: "2026-06-15",
    skills: ["Selenium", "Test Automation", "JIRA"],
    ratePerHr: 70,
    capacity: "40 hrs",
    location: "Brisbane",
    status: "Available",
    utilization: 40,
  },

  {
    id: "res-13",
    resourceId: "RID-1014",
    name: "Marcus Reid",
    initials: "MR",
    role: "Project Manager",
    level: "Senior",
    team: "Delivery",
    reportingManager: "Olivia Bennett",
    employeeType: "Full Time",
    availableAfter: "2026-05-28",
    skills: ["PMO", "Stakeholder Mgmt", "Risk Management"],
    ratePerHr: 95,
    capacity: "40 hrs",
    location: "Sydney",
    status: "Available",
    utilization: 50,
  },

  {
    id: "res-14",
    resourceId: "RID-1015",
    name: "Divya Reddy",
    initials: "DR",
    role: "DevOps Engineer",
    level: "Mid",
    team: "DevSecOps",
    reportingManager: "Sneha Iyer",
    employeeType: "Full Time",
    availableAfter: "2026-06-10",
    skills: ["CI/CD", "Jenkins", "Kubernetes"],
    ratePerHr: 80,
    capacity: "40 hrs",
    location: "Perth",
    status: "Available",
    utilization: 60,
  },
];
