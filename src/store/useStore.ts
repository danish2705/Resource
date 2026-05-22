import { create } from "zustand";
import {
  mockDemands,
  mockAllocations,
  mockWorklist,
  mockResources,
  mockForecasts,
  seedAuditLog,
} from "@/mocks/store";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  history: HistoryEntry[];
}

export interface HistoryEntry {
  fieldName: string;
  from: string;
  to: string;
  updatedOn: string;
  updatedBy: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  entity: "Demand" | "Allocation" | "Resource" | "Forecast";
  entityId: string;
  entityLabel: string;
  action: string;
  field: string;
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

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AppState {
  demands: Demand[];
  allocations: Allocation[];
  worklist: WorklistItem[];
  resources: ResourceProfile[];
  forecasts: Forecast[];
  auditLog: AuditEntry[];
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
  ) => string; // ← now returns the new demand ID

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

// ─── Helper ───────────────────────────────────────────────────────────────────

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

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>((set, get) => ({
  demands: mockDemands,
  allocations: mockAllocations,
  worklist: mockWorklist,
  resources: mockResources,
  forecasts: mockForecasts,
  auditLog: seedAuditLog,

  selectedProject: "Global",

  powerBiUrl:
    "https://app.powerbi.com/reportEmbed?reportId=2ab54997-497c-4dcc-af21-74a90b01f79c&autoAuth=true&ctid=5b062343-db15-4905-9f00-236a9938ed0a",

  // ── Demand: Create ── (prepends + returns new ID)
  addDemand: (d) => {
    const id = `dem-${Date.now()}`;
    const now = new Date().toLocaleString();
    const newDemand: Demand = {
      ...d,
      id,
      history: [],
      createdBy: "admin@company.com",
      createdDate: new Date().toLocaleDateString(),
      updatedBy: "admin@company.com",
      updatedDate: new Date().toLocaleDateString(),
    };
    const newEntry: AuditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: now,
      user: "admin@company.com",
      entity: "Demand",
      entityId: id,
      entityLabel: d.projectName,
      action: "Created",
      field: "",
      oldValue: "",
      newValue: `status: ${d.status}`,
    };
    set((state) => ({
      demands: [newDemand, ...state.demands], // ← prepend
      auditLog: [newEntry, ...state.auditLog],
    }));
    return id; // ← return so callers can navigate with it
  },

  // ── Demand: Bulk Create ── (prepends)
  addDemands: (ds) =>
    set((state) => {
      const now = new Date().toLocaleString();
      const newDemands = ds.map((d, i) => ({
        ...d,
        id: `dem-${Date.now()}-${i}`,
        history: [],
        createdBy: "admin@company.com",
        createdDate: new Date().toLocaleDateString(),
        updatedBy: "admin@company.com",
        updatedDate: new Date().toLocaleDateString(),
      }));
      const newAuditEntries: AuditEntry[] = newDemands.map((d) => ({
        id: `audit-${Date.now()}-${d.id}`,
        timestamp: now,
        user: "admin@company.com",
        entity: "Demand",
        entityId: d.id,
        entityLabel: d.projectName,
        action: "Bulk Import",
        field: "",
        oldValue: "",
        newValue: `status: ${d.status}`,
      }));
      return {
        demands: [...newDemands, ...state.demands], // ← prepend bulk
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
              updatedBy: "admin@company.com",
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
            updatedBy: "admin@company.com",
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
            user: "admin@company.com",
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
              updatedBy: "admin@company.com",
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
                updatedBy: "admin@company.com",
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
            user: "admin@company.com",
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
            user: "admin@company.com",
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

  // ── Resource: Update ──
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
              updatedBy: "admin@company.com",
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
        user: "admin@company.com",
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
            createdBy: "admin@company.com",
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
              updatedBy: "admin@company.com",
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
            user: "admin@company.com",
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

  // ── Forecast: Convert to Demand ── (prepends)
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
        createdBy: "admin@company.com",
        createdDate: new Date().toLocaleDateString(),
        updatedBy: "admin@company.com",
        updatedDate: new Date().toLocaleDateString(),
        history: [],
        forecastSourceId: f.id,
      };
      const auditForecast: AuditEntry = {
        id: `audit-${Date.now()}-fc`,
        timestamp: now,
        user: "admin@company.com",
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
        user: "admin@company.com",
        entity: "Demand",
        entityId: newDemandId,
        entityLabel: f.projectName,
        action: "Created (from Forecast)",
        field: "",
        oldValue: "",
        newValue: `status: Pending, source: ${f.id}`,
      };
      return {
        demands: [newDemand, ...state.demands], // ← prepend
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
                    updatedBy: "admin@company.com",
                  },
                ],
              }
            : x,
        ),
        auditLog: [auditDemand, auditForecast, ...state.auditLog],
      };
    }),
}));

// ─── Re-exports ───────────────────────────────────────────────────────────────
export {
  projects,
  pillars,
  roles,
  budgetCodes,
  vendors,
  resourceNames,
  locations,
} from "@/mocks/store";