import { create } from 'zustand';

export type LifecycleState = 'Demand' | 'Intake' | 'Active Allocation' | 'Offboarding';

export interface YearMap { current: number; y2027: number; y2028: number; y2029: number; y2030: number }

export interface Demand {
  id: string;
  portfolio: string;
  program: string;
  projectName: string;
  projectRole: string;
  budgetCode: string;
  pillar: string;
  allocationPercent: number;
  status: 'Draft' |'Pending' | 'Approved' | 'Rejected' | 'Awaiting Approval';
  comments: string;
  identified: boolean;
  estimatedRate: number;
  currentYearForecast: number;
  resourceName: string;
  workstream: string;
  subTeam: string;
  startDate: string;
  endDate: string;
  type: 'Internal' | 'External';
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
  type: 'Internal' | 'External';
  vendor: string;
  location: string;
  level: string;
  status: 'Active' | 'Inactive';
  primarySkill: string;
  allSkills: string[];
  yearsExperience: number;
  costPerHour: number;
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
  status: 'Draft' | 'Approved' | 'Flagged' | 'Converted';
  createdBy: string;
  createdDate: string;
}

export interface HistoryEntry {
  fieldName: string;
  from: string;
  to: string;
  updatedOn: string;
  updatedBy: string;
}

export interface WorklistItem {
  id: string;
  activityType: string;
  summary: string;
  project: string;
  status: 'Open' | 'Approved' | 'Rejected';
  dueBy: string;
  demandId: string;
}

interface AppState {
  demands: Demand[];
  allocations: Allocation[];
  worklist: WorklistItem[];
  resources: ResourceProfile[];
  forecasts: Forecast[];
  selectedProject: string;
  powerBiUrl: string;

  addDemand: (
    d: Omit<
      Demand,
      'id' | 'history' | 'createdBy' | 'createdDate' | 'updatedBy' | 'updatedDate'
    >
  ) => void;

  addDemands: (
    ds: Omit<
      Demand,
      'id' | 'history' | 'createdBy' | 'createdDate' | 'updatedBy' | 'updatedDate'
    >[]
  ) => void;

  updateDemand: (id: string, updates: Partial<Demand>) => void;
  deleteDemand: (id: string) => void;
  updateAllocation: (id: string, updates: Partial<Allocation>) => void;
  approveWorklistItem: (id: string) => void;
  rejectWorklistItem: (id: string) => void;
  setSelectedProject: (p: string) => void;
  updateResource: (id: string, updates: Partial<ResourceProfile>) => void;

  addForecast: (
    f: Omit<Forecast, 'id' | 'createdBy' | 'createdDate' | 'status'> & {
      status?: Forecast['status'];
    }
  ) => void;

  updateForecast: (id: string, updates: Partial<Forecast>) => void;
  deleteForecast: (id: string) => void;
  convertForecastToDemand: (id: string) => void;
}

const pillars = ['Hi-tech', 'Retail', 'Banking', 'Healthcare', 'Life Sciences'];
const projects = ['Data Modernization - ASPAC', 'QE Automation', 'Cloud Enablement', 'Application Support'];
const roles = ['Business Analyst', 'Technical Lead', 'QA Engineer', 'Project Manager', 'DevOps Engineer'];
const budgetCodes = ['DM-ASPAC-01', 'QE-AUTO-02', 'CLD-ENB-03', 'APP-SUP-04', 'GEN-OPS-05'];
const statuses: Demand['status'][] = ['Pending', 'Approved', 'Rejected', 'Awaiting Approval'];
const resourceNames = [
  'Grishma Gangar', 'Anurag Vaishy', 'Karthik Dontula', 'Adnan Siddiqui', 'Ian Lee',
  'Rich Bowers', 'Matthew Truelove', 'Jamison Ducey', 'Lindsey Lord', 'Kristie Shirkavand',
];
const vendors = ['UX Reactor', 'Hyqoo', 'Collabera', 'Ascendion Global', 'Moodys NWC'];
const locations = ['Sydney', 'Germany', 'Australia', 'Poland'];
const lifecycle: LifecycleState[] = ['Demand', 'Intake', 'Active Allocation', 'Offboarding'];
const skillsPool = ['React', 'Node.js', 'AWS', 'Python', 'Java', 'Selenium', 'Salesforce', 'Snowflake', 'Kubernetes', 'Power BI'];

const slugify = (n: string) => n.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.');

const mockResources: ResourceProfile[] = resourceNames.map((name, i) => {
  const primary = skillsPool[i % skillsPool.length];
  const all = [primary, skillsPool[(i + 1) % skillsPool.length], skillsPool[(i + 3) % skillsPool.length]];
  return {
    id: `res-${i}`,
    name,
    resId: String(100000 + i * 12345),
    email: `${slugify(name)}@ascendion.com`,
    type: i % 3 === 0 ? 'External' : 'Internal',
    vendor: i % 3 === 0 ? vendors[i % vendors.length] : 'N/A',
    location: locations[i % locations.length],
    level: ['External', 'M1', 'M2', 'D1', 'D2', 'VP'][i % 6],
    status: i % 7 === 0 ? 'Inactive' : 'Active',
    primarySkill: primary,
    allSkills: all,
    yearsExperience: 3 + (i % 12),
    costPerHour: 75 + i * 8,
  };
});

const mockDemands: Demand[] = Array.from({ length: 47 }, (_, i) => ({
  id: `dem-${i + 1}`,
  portfolio: pillars[i % pillars.length],
  program: 'Enterprise',
  projectName: projects[i % projects.length],
  projectRole: roles[i % roles.length],
  budgetCode: budgetCodes[i % budgetCodes.length],
  pillar: pillars[i % pillars.length],
  allocationPercent: Math.floor(Math.random() * 15),
  status: statuses[i % statuses.length],
  comments: '',
  identified: i % 2 === 0,
  estimatedRate: i % 2 === 0 ? (110 + i * 10) : 0,
  currentYearForecast: i % 2 === 0 ? (100000 + i * 10000) : 0,
  resourceName: i % 2 === 0 ? resourceNames[i % resourceNames.length] : '',
  workstream: 'WS-' + ((i % 3) + 1),
  subTeam: 'ST-' + ((i % 4) + 1),
  startDate: '2027-01-01',
  endDate: '2028-12-31',
  type: i % 3 === 0 ? 'External' : 'Internal',
  vendorName: i % 3 === 0 ? vendors[i % vendors.length] : '',
  country: locations[i % locations.length],
  allocation: { current: 0.8, y2027: 0.8, y2028: 0, y2029: 0, y2030: 0 },
  forecast: {
    current: 50000 + i * 5000,
    y2027: 70000 + i * 3000,
    y2028: i < 5 ? 90000 + i * 2000 : 0,
    y2029: 0,
    y2030: 0,
  },
  createdBy: 'admin@enterprise.com',
  createdDate: '01/15/2027',
  updatedBy: 'admin@enterprise.com',
  updatedDate: '01/15/2027',
  history: [],
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
  level: ['External', 'M1', 'M2', 'D1', 'D2', 'VP'][i % 6],
  status: ['On-Boarded', 'Cancelled', '-- Select --'][i % 3],
  chargeType: ['Backfill Charge', 'Direct HC Charge', '-- Select --'][i % 3],
  externalPO: i % 3 === 0 ? budgetCodes[i % budgetCodes.length] : 'N/A',
  hourlyRate: i % 3 === 0 ? 121 + i : 0,
  poTitle: i % 3 === 0 ? 'PMO' : 'N/A',
  poApproval: i % 3 === 0 ? 'Approved' : 'N/A',
  startDate: '2027-01-01',
  endDate: ['2027-06-30', '2027-12-31', '2028-06-30', '2028-12-31'][i % 4],
  allocationPercent: [25, 50, 75, 100][i % 4],
  lifecycle: lifecycle[i % lifecycle.length],
  history: [],
}));

const mockWorklist: WorklistItem[] = [
  { id: 'wl-1', activityType: 'Review Demand Approval', summary: 'Demand For Technical Lead Created By Anurag Vaishy', project: 'Data Modernization - ASPAC', status: 'Open', dueBy: '02/14/2027', demandId: 'dem-2' },
  { id: 'wl-2', activityType: 'Review Demand Approval', summary: 'Demand For QA Engineer Created By Karthik Dontula', project: 'QE Automation', status: 'Open', dueBy: '02/15/2027', demandId: 'dem-5' },
  { id: 'wl-3', activityType: 'Review Resource Allocation', summary: 'Resource Allocation For Cloud Enablement Submitted', project: 'Cloud Enablement', status: 'Open', dueBy: '02/16/2027', demandId: 'dem-10' },
];

const mockForecasts: Forecast[] = Array.from({ length: 6 }, (_, i) => ({
  id: `fc-${i + 1}`,
  portfolio: pillars[i % pillars.length],
  program: ['Enterprise', 'EMEA', 'AMER', 'APAC'][i % 4],
  projectName: projects[i % projects.length],
  requiredRole: roles[i % roles.length],
  headcount: 1 + (i % 5),
  startDate: '2027-04-01',
  endDate: '2028-03-31',
  estimatedCost: 80000 + i * 25000,
  pillar: pillars[i % pillars.length],
  status: (['Draft', 'Approved', 'Flagged', 'Draft'] as Forecast['status'][])[i % 4],
  createdBy: 'planner@ascendion.com',
  createdDate: '02/01/2027',
}));

export const useStore = create<AppState>((set) => ({
  demands: mockDemands,
  allocations: mockAllocations,
  worklist: mockWorklist,
  resources: mockResources,
  forecasts: mockForecasts,

  selectedProject: 'Global',

  powerBiUrl:
    'https://app.powerbi.com/reportEmbed?reportId=6fe8891f-cbe6-4462-98ec-5044e47b137d&autoAuth=true&ctid=1a264c83-db2d-4da1-8cc5-44b1b94837a8',

  addDemand: (d) =>
    set((state) => ({
      demands: [
        ...state.demands,
        {
          ...d,
          id: `dem-${Date.now()}`,
          history: [],
          createdBy: '[REDACTED_EMAIL_ADDRESS_3]',
          createdDate: new Date().toLocaleDateString(),
          updatedBy: '[REDACTED_EMAIL_ADDRESS_3]',
          updatedDate: new Date().toLocaleDateString(),
        },
      ],
    })),

  addDemands: (ds) => set((state) => ({
    demands: [...state.demands, ...ds.map((d, i) => ({
      ...d,
      id: `dem-${Date.now()}-${i}`,
      history: [],
      createdBy: 'current@user.com',
      createdDate: new Date().toLocaleDateString(),
      updatedBy: 'current@user.com',
      updatedDate: new Date().toLocaleDateString(),
    }))],
  })),

  updateDemand: (id, updates) => set((state) => ({
    demands: state.demands.map((d) => {
      if (d.id !== id) return d;
      const historyEntries: HistoryEntry[] = [];
      for (const [key, val] of Object.entries(updates)) {
        if (key !== 'history' && (d as any)[key] !== val) {
          historyEntries.push({ fieldName: key, from: String((d as any)[key]), to: String(val), updatedOn: new Date().toLocaleString(), updatedBy: 'current@user.com' });
        }
      }
      return { ...d, ...updates, history: [...d.history, ...historyEntries], updatedBy: 'current@user.com', updatedDate: new Date().toLocaleDateString() };
    }),
  })),

  deleteDemand: (id) => set((state) => ({ demands: state.demands.filter((d) => d.id !== id) })),

  updateAllocation: (id, updates) => set((state) => ({
    allocations: state.allocations.map((a) => {
      if (a.id !== id) return a;
      const historyEntries: HistoryEntry[] = [];
      for (const [key, val] of Object.entries(updates)) {
        if (key !== 'history' && (a as any)[key] !== val) {
          historyEntries.push({ fieldName: key, from: String((a as any)[key]), to: String(val), updatedOn: new Date().toLocaleString(), updatedBy: 'current@user.com' });
        }
      }
      const next: Allocation = { ...a, ...updates, history: [...a.history, ...historyEntries] };
      if (updates.lifecycle === 'Offboarding') next.status = 'Cancelled';
      return next;
    }),
  })),

  approveWorklistItem: (id) => set((state) => ({
    worklist: state.worklist.map((w) => w.id === id ? { ...w, status: 'Approved' as const } : w),
    demands: state.demands.map((d) => {
      const item = state.worklist.find((w) => w.id === id);
      if (item && d.id === item.demandId) return { ...d, status: 'Approved' as const };
      return d;
    }),
  })),

  rejectWorklistItem: (id) => set((state) => ({
    worklist: state.worklist.map((w) => w.id === id ? { ...w, status: 'Rejected' as const } : w),
    demands: state.demands.map((d) => {
      const item = state.worklist.find((w) => w.id === id);
      if (item && d.id === item.demandId) return { ...d, status: 'Rejected' as const };
      return d;
    }),
  })),

  setSelectedProject: (p) => set({ selectedProject: p }),

  updateResource: (id, updates) => set((state) => ({
    resources: state.resources.map((r) => r.id === id ? { ...r, ...updates } : r),
  })),

  addForecast: (f) => set((state) => ({
    forecasts: [...state.forecasts, {
      ...f,
      id: `fc-${Date.now()}`,
      status: f.status || 'Draft',
      createdBy: 'current@user.com',
      createdDate: new Date().toLocaleDateString(),
    }],
  })),

  updateForecast: (id, updates) => set((state) => ({
    forecasts: state.forecasts.map((f) => f.id === id ? { ...f, ...updates } : f),
  })),

  deleteForecast: (id) => set((state) => ({
    forecasts: state.forecasts.filter((f) => f.id !== id),
  })),

  convertForecastToDemand: (id) => set((state) => {
    const f = state.forecasts.find((x) => x.id === id);
    if (!f || f.status === 'Converted') return state;
    const newDemand: Demand = {
      id: `dem-${Date.now()}`,
      portfolio: f.portfolio,
      program: f.program,
      projectName: f.projectName,
      projectRole: f.requiredRole,
      budgetCode: '',
      pillar: f.pillar,
      allocationPercent: 100,
      status: 'Pending',
      comments: `Converted from Forecast ${f.id}`,
      identified: false,
      estimatedRate: f.headcount > 0 ? Math.round(f.estimatedCost / f.headcount / 2080) : 0,
      currentYearForecast: f.estimatedCost,
      resourceName: '',
      workstream: '',
      subTeam: '',
      startDate: f.startDate,
      endDate: f.endDate,
      type: 'Internal',
      vendorName: '',
      country: 'Sydney',
      allocation: { current: 1, y2027: 1, y2028: 0, y2029: 0, y2030: 0 },
      forecast: { current: f.estimatedCost, y2027: f.estimatedCost, y2028: 0, y2029: 0, y2030: 0 },
      createdBy: 'current@user.com',
      createdDate: new Date().toLocaleDateString(),
      updatedBy: 'current@user.com',
      updatedDate: new Date().toLocaleDateString(),
      history: [],
      forecastSourceId: f.id,
    };
    return {
      demands: [...state.demands, newDemand],
      forecasts: state.forecasts.map((x) => x.id === id ? { ...x, status: 'Converted' as const } : x),
    };
  }),
}));

export { projects, pillars, roles, budgetCodes, vendors, resourceNames, locations };
