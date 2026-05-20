import { create } from "zustand";

export type LifecycleState =
  | "Demand"
  | "Intake"
  | "Active Allocation"
  | "Offboarding";

export interface YearMap {
  current: number;
  y2027: number;
  y2028: number;
  y2029: number;
  y2030: number;
}

export interface Demand {
  id: string;
  portfolio: string;
  program: string;
  projectName: string;
  projectRole: string;
  budgetCode: string;
  pillar: string;
  allocationPercent: number;
  status:
    | "Draft"
    | "Pending"
    | "Approved"
    | "Rejected"
    | "Awaiting Approval"
    | "RM Approved"
    | "RM Rejected"
    | "PMO Approved"
    | "PMO Rejected";
  comments: string;
  identified: boolean;
  estimatedRate: number;
  currentYearForecast: number;
  resourceName: string;
  workstream: string;
  subTeam: string;
  startDate: string;
  endDate: string;
  type: "Internal" | "External";
  vendorName: string;
  country: string;
  allocation: YearMap;
  forecast: YearMap;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  history: HistoryEntry[];
  forecastSourceId?: string;
  source?:
    | "Manual"
    | "Jira"
    | "Planisware"
    | "Smartsheets"
    | "Monday.com"
    | "Connected Source";
  isEdited?: boolean;
}

export interface Allocation {
  id: string;
  portfolio: string;
  pillar: string;
  budgetCode: string;
  project: string;
  projectRole: string;
  resourceName: string;
  resId: string;
  level: string;
  status: string;
  chargeType: string;
  externalPO: string;
  hourlyRate: number;
  poTitle: string;
  poApproval: string;
  startDate: string;
  endDate: string;
  allocationPercent: number;
  lifecycle: LifecycleState;
  history: HistoryEntry[];
}

export interface ResourceProfile {
  id: string;
  name: string;
  resId: string;
  email: string;
  type: "Internal" | "External";
  vendor: string;
  location: string;
  level: string;
  status: "Active" | "Inactive";
  primarySkill: string;
  allSkills: string[];
  yearsExperience: number;
  costPerHour: number;
  // ── Audit history (NEW) ──
  history: HistoryEntry[];
}

export interface Forecast {
  id: string;
  portfolio: string;
  program: string;
  projectName: string;
  requiredRole: string;
  headcount: number;
  startDate: string;
  endDate: string;
  estimatedCost: number;
  pillar: string;
  status: "Draft" | "Approved" | "Flagged" | "Converted";
  createdBy: string;
  createdDate: string;
  // ── Audit history (NEW) ──
  history: HistoryEntry[];
}

export interface HistoryEntry {
  fieldName: string;
  from: string;
  to: string;
  updatedOn: string;
  updatedBy: string;
}

// ── NEW: Flat audit log entry (aggregated across all entities) ──
export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  entity: "Demand" | "Allocation" | "Resource" | "Forecast";
  entityId: string;
  entityLabel: string; // human-readable name e.g. project name or resource name
  action: string; // e.g. "Field Updated", "Status Changed", "Created", "Deleted"
  field: string; // which field changed (empty for create/delete)
  oldValue: string;
  newValue: string;
}

export interface WorklistItem {
  id: string;
  activityType: string;
  summary: string;
  project: string;
  status: "Open" | "Approved" | "Rejected";
  dueBy: string;
  demandId: string;
}

interface AppState {
  demands: Demand[];
  allocations: Allocation[];
  worklist: WorklistItem[];
  resources: ResourceProfile[];
  forecasts: Forecast[];
  auditLog: AuditEntry[]; // ── NEW
  selectedProject: string;
  powerBiUrl: string;

  addDemand: (
    d: Omit<
      Demand,
      | "id"
      | "history"
      | "createdBy"
      | "createdDate"
      | "updatedBy"
      | "updatedDate"
    >,
  ) => void;

  addDemands: (
    ds: Omit<
      Demand,
      | "id"
      | "history"
      | "createdBy"
      | "createdDate"
      | "updatedBy"
      | "updatedDate"
    >[],
  ) => void;

  updateDemand: (id: string, updates: Partial<Demand>) => void;
  deleteDemand: (id: string) => void;
  updateAllocation: (id: string, updates: Partial<Allocation>) => void;
  approveWorklistItem: (id: string) => void;
  rejectWorklistItem: (id: string) => void;
  setSelectedProject: (p: string) => void;
  updateResource: (id: string, updates: Partial<ResourceProfile>) => void;

  addForecast: (
    f: Omit<
      Forecast,
      "id" | "createdBy" | "createdDate" | "status" | "history"
    > & {
      status?: Forecast["status"];
    },
  ) => void;

  updateForecast: (id: string, updates: Partial<Forecast>) => void;
  deleteForecast: (id: string) => void;
  convertForecastToDemand: (id: string) => void;
}

const pillars = ["Hi-tech", "Retail", "Banking", "Healthcare", "Life Sciences"];
const projects = [
  "Data Modernization - ASPAC",
  "QE Automation",
  "Cloud Enablement",
  "Application Support",
];
const roles = [
  "Business Analyst",
  "Technical Lead",
  "QA Engineer",
  "Project Manager",
  "DevOps Engineer",
];
const budgetCodes = [
  "DM-ASPAC-01",
  "QE-AUTO-02",
  "CLD-ENB-03",
  "APP-SUP-04",
  "GEN-OPS-05",
];
const statuses: Demand["status"][] = [
  "Pending",
  "Approved",
  "Rejected",
  "Awaiting Approval",
];
const sources: Demand["source"][] = [
  "Manual",
  "Jira",
  "Planisware",
  "Smartsheets",
  "Monday.com",
  "Connected Source",
];
const resourceNames = [
  "Grishma Gangar",
  "Anurag Vaishy",
  "Karthik Dontula",
  "Adnan Siddiqui",
  "Ian Lee",
  "Rich Bowers",
  "Matthew Truelove",
  "Jamison Ducey",
  "Lindsey Lord",
  "Kristie Shirkavand",
];
const vendors = [
  "UX Reactor",
  "Hyqoo",
  "Collabera",
  "Ascendion Global",
  "Moodys NWC",
];
const locations = ["Sydney", "Germany", "Australia", "Poland"];
const lifecycle: LifecycleState[] = [
  "Demand",
  "Intake",
  "Active Allocation",
  "Offboarding",
];
const skillsPool = [
  "React",
  "Node.js",
  "AWS",
  "Python",
  "Java",
  "Selenium",
  "Salesforce",
  "Snowflake",
  "Kubernetes",
  "Power BI",
];

const slugify = (n: string) =>
  n
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");

const mockResources: ResourceProfile[] = resourceNames.map((name, i) => {
  const primary = skillsPool[i % skillsPool.length];
  const all = [
    primary,
    skillsPool[(i + 1) % skillsPool.length],
    skillsPool[(i + 3) % skillsPool.length],
  ];
  return {
    id: `res-${i}`,
    name,
    resId: String(100000 + i * 12345),
    email: `${slugify(name)}@ascendion.com`,
    type: i % 3 === 0 ? "External" : "Internal",
    vendor: i % 3 === 0 ? vendors[i % vendors.length] : "N/A",
    location: locations[i % locations.length],
    level: ["External", "M1", "M2", "D1", "D2", "VP"][i % 6],
    status: i % 7 === 0 ? "Inactive" : "Active",
    primarySkill: primary,
    allSkills: all,
    yearsExperience: 3 + (i % 12),
    costPerHour: 75 + i * 8,
    history: [], // ── NEW
  };
});

const mockDemands: Demand[] = Array.from({ length: 47 }, (_, i) => ({
  id: `dem-${i + 1}`,
  portfolio: pillars[i % pillars.length],
  program: "Enterprise",
  projectName: projects[i % projects.length],
  projectRole: roles[i % roles.length],
  budgetCode: budgetCodes[i % budgetCodes.length],
  pillar: pillars[i % pillars.length],
  allocationPercent: Math.floor(Math.random() * 15),
  status: statuses[i % statuses.length],
  comments: "",
  identified: i % 2 === 0,
  estimatedRate: 110 + i * 10,
  currentYearForecast: 100000 + i * 10000,
  resourceName: i % 2 === 0 ? resourceNames[i % resourceNames.length] : "",
  workstream: "WS-" + ((i % 3) + 1),
  subTeam: "ST-" + ((i % 4) + 1),
  startDate: "2027-01-01",
  endDate: "2028-12-31",
  type: i % 3 === 0 ? "External" : "Internal",
  vendorName: i % 3 === 0 ? vendors[i % vendors.length] : "",
  country: locations[i % locations.length],
  allocation: { current: 0.8, y2027: 0.8, y2028: 0, y2029: 0, y2030: 0 },
  forecast: {
    current: 50000 + i * 5000,
    y2027: 70000 + i * 3000,
    y2028: i < 5 ? 90000 + i * 2000 : 0,
    y2029: 0,
    y2030: 0,
  },
  createdBy: "james.carter@ascendion.com",
  createdDate: "01/15/2027",
  updatedBy: "james.carter@ascendion.com",
  updatedDate: "01/15/2027",
  history: [],
  source: sources[i % sources.length],
  isEdited: i % 7 === 0,
}));

const mockAllocations: Allocation[] = Array.from({ length: 17 }, (_, i) => ({
  id: `alloc-${i + 1}`,
  portfolio: pillars[i % pillars.length],
  pillar: pillars[i % pillars.length],
  budgetCode: budgetCodes[i % budgetCodes.length],
  project: projects[i % projects.length],
  projectRole: roles[i % roles.length],
  resourceName: resourceNames[i % resourceNames.length],
  resId: String(100000 + Math.floor(Math.random() * 900000)),
  level: ["External", "M1", "M2", "D1", "D2", "VP"][i % 6],
  status: ["On-Boarded", "Cancelled", "-- Select --"][i % 3],
  chargeType: ["Backfill Charge", "Direct HC Charge", "-- Select --"][i % 3],
  externalPO: i % 3 === 0 ? budgetCodes[i % budgetCodes.length] : "N/A",
  hourlyRate: i % 3 === 0 ? 121 + i : 0,
  poTitle: i % 3 === 0 ? "PMO" : "N/A",
  poApproval: i % 3 === 0 ? "Approved" : "N/A",
  startDate: "2027-01-01",
  endDate: ["2027-06-30", "2027-12-31", "2028-06-30", "2028-12-31"][i % 4],
  allocationPercent: [25, 50, 75, 100][i % 4],
  lifecycle: lifecycle[i % lifecycle.length],
  history: [],
}));

const mockWorklist: WorklistItem[] = [
  {
    id: "wl-1",
    activityType: "Review Demand Approval",
    summary: "Demand For Technical Lead Created By Anurag Vaishy",
    project: "Data Modernization - ASPAC",
    status: "Open",
    dueBy: "02/14/2027",
    demandId: "dem-2",
  },
  {
    id: "wl-2",
    activityType: "Review Demand Approval",
    summary: "Demand For QA Engineer Created By Karthik Dontula",
    project: "QE Automation",
    status: "Open",
    dueBy: "02/15/2027",
    demandId: "dem-5",
  },
  {
    id: "wl-3",
    activityType: "Review Resource Allocation",
    summary: "Resource Allocation For Cloud Enablement Submitted",
    project: "Cloud Enablement",
    status: "Open",
    dueBy: "02/16/2027",
    demandId: "dem-10",
  },
];

const mockForecasts: Forecast[] = Array.from({ length: 6 }, (_, i) => ({
  id: `fc-${i + 1}`,
  portfolio: pillars[i % pillars.length],
  program: ["Enterprise", "EMEA", "AMER", "APAC"][i % 4],
  projectName: projects[i % projects.length],
  requiredRole: roles[i % roles.length],
  headcount: 1 + (i % 5),
  startDate: "2027-04-01",
  endDate: "2028-03-31",
  estimatedCost: 80000 + i * 25000,
  pillar: pillars[i % pillars.length],
  status: (["Draft", "Approved", "Flagged", "Draft"] as Forecast["status"][])[
    i % 4
  ],
  createdBy: "olivia.bennett@ascendion.com",
  createdDate: "02/01/2027",
  history: [], // ── NEW
}));

// ── Seed audit log with representative historical entries ──
const seedAuditLog: AuditEntry[] = [
  {
    id: "audit-seed-1",
    timestamp: "01/15/2027, 09:12:00",
    user: "james.carter@ascendion.com",
    entity: "Demand",
    entityId: "dem-1",
    entityLabel: "Data Modernization - ASPAC",
    action: "Created",
    field: "",
    oldValue: "",
    newValue: "status: Pending",
  },
  {
    id: "audit-seed-2",
    timestamp: "01/16/2027, 10:45:00",
    user: "james.carter@ascendion.com",
    entity: "Demand",
    entityId: "dem-2",
    entityLabel: "QE Automation",
    action: "Status Changed",
    field: "status",
    oldValue: "Pending",
    newValue: "Approved",
  },
  {
    id: "audit-seed-3",
    timestamp: "01/17/2027, 14:30:00",
    user: "olivia.bennett@ascendion.com",
    entity: "Demand",
    entityId: "dem-bulk-01",
    entityLabel: "Cloud Enablement",
    action: "Bulk Import",
    field: "",
    oldValue: "",
    newValue: "status: Pending",
  },
  {
    id: "audit-seed-4",
    timestamp: "01/18/2027, 11:00:00",
    user: "sarah.mitchell@ascendion.com",
    entity: "Resource",
    entityId: "res-0",
    entityLabel: "James Carter",
    action: "Field Updated",
    field: "primarySkill",
    oldValue: "React",
    newValue: "Node.js",
  },
  {
    id: "audit-seed-5",
    timestamp: "01/19/2027, 16:20:00",
    user: "james.carter@ascendion.com",
    entity: "Demand",
    entityId: "dem-3",
    entityLabel: "Cloud Enablement",
    action: "Field Updated",
    field: "estimatedRate",
    oldValue: "130",
    newValue: "150",
  },
  {
    id: "audit-seed-6",
    timestamp: "01/20/2027, 08:55:00",
    user: "sarah.mitchell@ascendion.com",
    entity: "Resource",
    entityId: "res-0",
    entityLabel: "James Carter",
    action: "Field Updated",
    field: "primarySkill",
    oldValue: "React",
    newValue: "Kubernetes",
  },
  {
    id: "audit-seed-7",
    timestamp: "01/21/2027, 13:10:00",
    user: "james.carter@ascendion.com",
    entity: "Demand",
    entityId: "dem-9",
    entityLabel: "QE Automation",
    action: "Deleted",
    field: "",
    oldValue: "status: Rejected",
    newValue: "",
  },
  {
    id: "audit-seed-8",
    timestamp: "01/22/2027, 15:45:00",
    user: "sarah.mitchell@ascendion.com",
    entity: "Demand",
    entityId: "dem-4",
    entityLabel: "Application Support",
    action: "Deleted",
    field: "",
    oldValue: "status: Rejected",
    newValue: "",
  },
];

// ── Helper: push entries into the flat audit log ──
function makeAuditEntries(
  entity: AuditEntry["entity"],
  entityId: string,
  entityLabel: string,
  historyEntries: HistoryEntry[],
  action?: string,
): AuditEntry[] {
  return historyEntries.map((h, i) => ({
    id: `audit-${Date.now()}-${i}`,
    timestamp: h.updatedOn,
    user: h.updatedBy,
    entity,
    entityId,
    entityLabel,
    action:
      action ?? (h.fieldName === "status" ? "Status Changed" : "Field Updated"),
    field: h.fieldName,
    oldValue: h.from,
    newValue: h.to,
  }));
}

export const useStore = create<AppState>((set) => ({
  demands: mockDemands,
  allocations: mockAllocations,
  worklist: mockWorklist,
  resources: mockResources,
  forecasts: mockForecasts,
  auditLog: seedAuditLog, // ── NEW

  selectedProject: "Global",

  powerBiUrl:
    "https://app.powerbi.com/reportEmbed?reportId=6fe8891f-cbe6-4462-98ec-5044e47b137d&autoAuth=true&ctid=1a264c83-db2d-4da1-8cc5-44b1b94837a8",

  // ── Demand: Create ──
  addDemand: (d) =>
    set((state) => {
      const id = `dem-${Date.now()}`;
      const now = new Date().toLocaleString();
      const newEntry: AuditEntry = {
        id: `audit-${Date.now()}`,
        timestamp: now,
        user: "sarah.mitchell@ascendion.com",
        entity: "Demand",
        entityId: id,
        entityLabel: d.projectName,
        action: "Created",
        field: "",
        oldValue: "",
        newValue: `status: ${d.status}`,
      };
      return {
        demands: [
          ...state.demands,
          {
            ...d,
            id,
            history: [],
            createdBy: "sarah.mitchell@ascendion.com",
            createdDate: new Date().toLocaleDateString(),
            updatedBy: "sarah.mitchell@ascendion.com",
            updatedDate: new Date().toLocaleDateString(),
          },
        ],
        auditLog: [newEntry, ...state.auditLog],
      };
    }),

  // ── Demand: Bulk Create ──
  addDemands: (ds) =>
    set((state) => {
      const now = new Date().toLocaleString();
      const newDemands = ds.map((d, i) => ({
        ...d,
        id: `dem-${Date.now()}-${i}`,
        history: [],
        createdBy: "sarah.mitchell@ascendion.com",
        createdDate: new Date().toLocaleDateString(),
        updatedBy: "sarah.mitchell@ascendion.com",
        updatedDate: new Date().toLocaleDateString(),
      }));
      const newAuditEntries: AuditEntry[] = newDemands.map((d) => ({
        id: `audit-${Date.now()}-${d.id}`,
        timestamp: now,
        user: "sarah.mitchell@ascendion.com",
        entity: "Demand",
        entityId: d.id,
        entityLabel: d.projectName,
        action: "Bulk Import",
        field: "",
        oldValue: "",
        newValue: `status: ${d.status}`,
      }));
      return {
        demands: [...state.demands, ...newDemands],
        auditLog: [...newAuditEntries, ...state.auditLog],
      };
    }),

  // ── Demand: Update ──
  updateDemand: (id, updates) =>
    set((state) => {
      const demand = state.demands.find((d) => d.id === id);
      const historyEntries: HistoryEntry[] = [];
      if (demand) {
        for (const [key, val] of Object.entries(updates)) {
          if (key !== "history" && (demand as any)[key] !== val) {
            historyEntries.push({
              fieldName: key,
              from: String((demand as any)[key]),
              to: String(val),
              updatedOn: new Date().toLocaleString(),
              updatedBy: "sarah.mitchell@ascendion.com",
            });
          }
        }
      }
      const newAuditEntries = demand
        ? makeAuditEntries("Demand", id, demand.projectName, historyEntries)
        : [];
      return {
        demands: state.demands.map((d) => {
          if (d.id !== id) return d;
          return {
            ...d,
            ...updates,
            history: [...d.history, ...historyEntries],
            updatedBy: "sarah.mitchell@ascendion.com",
            updatedDate: new Date().toLocaleDateString(),
          };
        }),
        auditLog: [...newAuditEntries, ...state.auditLog],
      };
    }),

  // ── Demand: Delete ──
  deleteDemand: (id) =>
    set((state) => {
      const demand = state.demands.find((d) => d.id === id);
      const newAuditEntry: AuditEntry | null = demand
        ? {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            user: "sarah.mitchell@ascendion.com",
            entity: "Demand",
            entityId: id,
            entityLabel: demand.projectName,
            action: "Deleted",
            field: "",
            oldValue: `status: ${demand.status}`,
            newValue: "",
          }
        : null;
      return {
        demands: state.demands.filter((d) => d.id !== id),
        auditLog: newAuditEntry
          ? [newAuditEntry, ...state.auditLog]
          : state.auditLog,
      };
    }),

  // ── Allocation: Update ──
  updateAllocation: (id, updates) =>
    set((state) => {
      const alloc = state.allocations.find((a) => a.id === id);
      const historyEntries: HistoryEntry[] = [];
      if (alloc) {
        for (const [key, val] of Object.entries(updates)) {
          if (key !== "history" && (alloc as any)[key] !== val) {
            historyEntries.push({
              fieldName: key,
              from: String((alloc as any)[key]),
              to: String(val),
              updatedOn: new Date().toLocaleString(),
              updatedBy: "sarah.mitchell@ascendion.com",
            });
          }
        }
      }
      const newAuditEntries = alloc
        ? makeAuditEntries("Allocation", id, alloc.resourceName, historyEntries)
        : [];
      return {
        allocations: state.allocations.map((a) => {
          if (a.id !== id) return a;
          const historyEntries2: HistoryEntry[] = [];
          for (const [key, val] of Object.entries(updates)) {
            if (key !== "history" && (a as any)[key] !== val) {
              historyEntries2.push({
                fieldName: key,
                from: String((a as any)[key]),
                to: String(val),
                updatedOn: new Date().toLocaleString(),
                updatedBy: "sarah.mitchell@ascendion.com",
              });
            }
          }
          const next: Allocation = {
            ...a,
            ...updates,
            history: [...a.history, ...historyEntries2],
          };
          if (updates.lifecycle === "Offboarding") next.status = "Cancelled";
          return next;
        }),
        auditLog: [...newAuditEntries, ...state.auditLog],
      };
    }),

  // ── Worklist: Approve ──
  approveWorklistItem: (id) =>
    set((state) => {
      const item = state.worklist.find((w) => w.id === id);
      const now = new Date().toLocaleString();
      const newAuditEntry: AuditEntry | null = item
        ? {
            id: `audit-${Date.now()}`,
            timestamp: now,
            user: "sarah.mitchell@ascendion.com",
            entity: "Demand",
            entityId: item.demandId,
            entityLabel: item.project,
            action: "Status Changed",
            field: "status",
            oldValue: "Pending",
            newValue: "Approved",
          }
        : null;
      return {
        worklist: state.worklist.map((w) =>
          w.id === id ? { ...w, status: "Approved" as const } : w,
        ),
        demands: state.demands.map((d) => {
          if (item && d.id === item.demandId)
            return { ...d, status: "Approved" as const };
          return d;
        }),
        auditLog: newAuditEntry
          ? [newAuditEntry, ...state.auditLog]
          : state.auditLog,
      };
    }),

  // ── Worklist: Reject ──
  rejectWorklistItem: (id) =>
    set((state) => {
      const item = state.worklist.find((w) => w.id === id);
      const now = new Date().toLocaleString();
      const newAuditEntry: AuditEntry | null = item
        ? {
            id: `audit-${Date.now()}`,
            timestamp: now,
            user: "sarah.mitchell@ascendion.com",
            entity: "Demand",
            entityId: item.demandId,
            entityLabel: item.project,
            action: "Status Changed",
            field: "status",
            oldValue: "Pending",
            newValue: "Rejected",
          }
        : null;
      return {
        worklist: state.worklist.map((w) =>
          w.id === id ? { ...w, status: "Rejected" as const } : w,
        ),
        demands: state.demands.map((d) => {
          if (item && d.id === item.demandId)
            return { ...d, status: "Rejected" as const };
          return d;
        }),
        auditLog: newAuditEntry
          ? [newAuditEntry, ...state.auditLog]
          : state.auditLog,
      };
    }),

  setSelectedProject: (p) => set({ selectedProject: p }),

  // ── Resource: Update (now with history) ──
  updateResource: (id, updates) =>
    set((state) => {
      const resource = state.resources.find((r) => r.id === id);
      const historyEntries: HistoryEntry[] = [];
      if (resource) {
        for (const [key, val] of Object.entries(updates)) {
          if (key !== "history" && (resource as any)[key] !== val) {
            historyEntries.push({
              fieldName: key,
              from: String((resource as any)[key]),
              to: String(val),
              updatedOn: new Date().toLocaleString(),
              updatedBy: "sarah.mitchell@ascendion.com",
            });
          }
        }
      }
      const newAuditEntries = resource
        ? makeAuditEntries("Resource", id, resource.name, historyEntries)
        : [];
      return {
        resources: state.resources.map((r) =>
          r.id === id
            ? { ...r, ...updates, history: [...r.history, ...historyEntries] }
            : r,
        ),
        auditLog: [...newAuditEntries, ...state.auditLog],
      };
    }),

  // ── Forecast: Create ──
  addForecast: (f) =>
    set((state) => {
      const id = `fc-${Date.now()}`;
      const now = new Date().toLocaleString();
      const newEntry: AuditEntry = {
        id: `audit-${Date.now()}`,
        timestamp: now,
        user: "sarah.mitchell@ascendion.com",
        entity: "Forecast",
        entityId: id,
        entityLabel: f.projectName,
        action: "Created",
        field: "",
        oldValue: "",
        newValue: `status: ${f.status ?? "Draft"}`,
      };
      return {
        forecasts: [
          ...state.forecasts,
          {
            ...f,
            id,
            status: f.status || "Draft",
            createdBy: "sarah.mitchell@ascendion.com",
            createdDate: new Date().toLocaleDateString(),
            history: [],
          },
        ],
        auditLog: [newEntry, ...state.auditLog],
      };
    }),

  // ── Forecast: Update ──
  updateForecast: (id, updates) =>
    set((state) => {
      const forecast = state.forecasts.find((f) => f.id === id);
      const historyEntries: HistoryEntry[] = [];
      if (forecast) {
        for (const [key, val] of Object.entries(updates)) {
          if (key !== "history" && (forecast as any)[key] !== val) {
            historyEntries.push({
              fieldName: key,
              from: String((forecast as any)[key]),
              to: String(val),
              updatedOn: new Date().toLocaleString(),
              updatedBy: "sarah.mitchell@ascendion.com",
            });
          }
        }
      }
      const newAuditEntries = forecast
        ? makeAuditEntries("Forecast", id, forecast.projectName, historyEntries)
        : [];
      return {
        forecasts: state.forecasts.map((f) =>
          f.id === id
            ? { ...f, ...updates, history: [...f.history, ...historyEntries] }
            : f,
        ),
        auditLog: [...newAuditEntries, ...state.auditLog],
      };
    }),

  // ── Forecast: Delete ──
  deleteForecast: (id) =>
    set((state) => {
      const forecast = state.forecasts.find((f) => f.id === id);
      const newAuditEntry: AuditEntry | null = forecast
        ? {
            id: `audit-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            user: "sarah.mitchell@ascendion.com",
            entity: "Forecast",
            entityId: id,
            entityLabel: forecast.projectName,
            action: "Deleted",
            field: "",
            oldValue: `status: ${forecast.status}`,
            newValue: "",
          }
        : null;
      return {
        forecasts: state.forecasts.filter((f) => f.id !== id),
        auditLog: newAuditEntry
          ? [newAuditEntry, ...state.auditLog]
          : state.auditLog,
      };
    }),

  // ── Forecast: Convert to Demand ──
  convertForecastToDemand: (id) =>
    set((state) => {
      const f = state.forecasts.find((x) => x.id === id);
      if (!f || f.status === "Converted") return state;
      const newDemandId = `dem-${Date.now()}`;
      const now = new Date().toLocaleString();
      const newDemand: Demand = {
        id: newDemandId,
        portfolio: f.portfolio,
        program: f.program,
        projectName: f.projectName,
        projectRole: f.requiredRole,
        budgetCode: "",
        pillar: f.pillar,
        allocationPercent: 100,
        status: "Pending",
        comments: `Converted from Forecast ${f.id}`,
        identified: false,
        estimatedRate:
          f.headcount > 0
            ? Math.round(f.estimatedCost / f.headcount / 2080)
            : 0,
        currentYearForecast: f.estimatedCost,
        resourceName: "",
        workstream: "",
        subTeam: "",
        startDate: f.startDate,
        endDate: f.endDate,
        type: "Internal",
        vendorName: "",
        country: "Sydney",
        allocation: { current: 1, y2027: 1, y2028: 0, y2029: 0, y2030: 0 },
        forecast: {
          current: f.estimatedCost,
          y2027: f.estimatedCost,
          y2028: 0,
          y2029: 0,
          y2030: 0,
        },
        createdBy: "sarah.mitchell@ascendion.com",
        createdDate: new Date().toLocaleDateString(),
        updatedBy: "sarah.mitchell@ascendion.com",
        updatedDate: new Date().toLocaleDateString(),
        history: [],
        forecastSourceId: f.id,
      };
      const auditForecast: AuditEntry = {
        id: `audit-${Date.now()}-fc`,
        timestamp: now,
        user: "sarah.mitchell@ascendion.com",
        entity: "Forecast",
        entityId: id,
        entityLabel: f.projectName,
        action: "Converted to Demand",
        field: "status",
        oldValue: f.status,
        newValue: "Converted",
      };
      const auditDemand: AuditEntry = {
        id: `audit-${Date.now()}-dem`,
        timestamp: now,
        user: "sarah.mitchell@ascendion.com",
        entity: "Demand",
        entityId: newDemandId,
        entityLabel: f.projectName,
        action: "Created (from Forecast)",
        field: "",
        oldValue: "",
        newValue: `status: Pending, source: ${f.id}`,
      };
      return {
        demands: [...state.demands, newDemand],
        forecasts: state.forecasts.map((x) =>
          x.id === id
            ? {
                ...x,
                status: "Converted" as const,
                history: [
                  ...x.history,
                  {
                    fieldName: "status",
                    from: x.status,
                    to: "Converted",
                    updatedOn: now,
                    updatedBy: "sarah.mitchell@ascendion.com",
                  },
                ],
              }
            : x,
        ),
        auditLog: [auditDemand, auditForecast, ...state.auditLog],
      };
    }),
}));

export {
  projects,
  pillars,
  roles,
  budgetCodes,
  vendors,
  resourceNames,
  locations,
};
