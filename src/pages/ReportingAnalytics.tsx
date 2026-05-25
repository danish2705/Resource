import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── CSS Variable helpers (replaces hardcoded hex) ────────────────────────────
// These mirror the same tokens used in UserManagement.tsx

const CV = {
  bgPrimary: "var(--color-background-primary)",
  bgSecondary: "var(--color-background-secondary)",
  bgTertiary: "var(--color-background-tertiary)",
  bgInfo: "var(--color-background-info)",
  bgDanger: "var(--color-background-danger)",
  bgSuccess: "var(--color-background-success)",
  bgWarning: "var(--color-background-warning)",

  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textTertiary: "var(--color-text-tertiary)",
  textInfo: "var(--color-text-info)",
  textDanger: "var(--color-text-danger)",
  textSuccess: "var(--color-text-success)",
  textWarning: "var(--color-text-warning)",

  borderTertiary: "var(--color-border-tertiary)",
  borderSecondary: "var(--color-border-secondary)",
  borderPrimary: "var(--color-border-primary)",
  borderInfo: "var(--color-border-info)",
  borderDanger: "var(--color-border-danger)",
  borderSuccess: "var(--color-border-success)",
  borderWarning: "var(--color-border-warning)",

  radiusMd: "var(--border-radius-md)",
  radiusLg: "var(--border-radius-lg)",
};

// Semantic chart colors mapped to CSS variable equivalents
const COLORS = {
  blue: "var(--color-text-info)",
  green: "var(--color-text-success)",
  red: "var(--color-text-danger)",
  orange: "var(--color-text-warning)",
  teal: "#1D9E75",
  purple: "#7F77DD",
  gray: "var(--color-text-tertiary)",
  amber: "#BA7517",
};

// Donut / multi-series palette (fixed hues that work on both bg modes)
const DONUT_COLORS = [
  "#378ADD",
  "#1D9E75",
  "#7F77DD",
  "#BA7517",
  "#D85A30",
  "#D4537E",
  "#888780",
];

// ─── Mock data ────────────────────────────────────────────────────────────────

const kpis = [
  {
    label: "Total Capacity",
    value: "2,986 FTE",
    delta: "▲ 6.2%",
    deltaUp: true,
    color: COLORS.blue,
    icon: "👥",
  },
  {
    label: "Utilization Rate",
    value: "78.2%",
    delta: "▲ 2.6%",
    deltaUp: true,
    color: COLORS.green,
    icon: "📈",
  },
  {
    label: "Capacity Gap",
    value: "-259 FTE",
    delta: "▼ 2.8%",
    deltaUp: false,
    color: COLORS.red,
    icon: "📉",
  },
  {
    label: "Open Demands",
    value: "412",
    delta: "▼ 5.1%",
    deltaUp: true,
    color: COLORS.orange,
    icon: "📋",
  },
];

const reportCards = [
  {
    num: 1,
    title: "Executive Leadership Report",
    icon: "🏆",
    desc: "Strategic overview of resource planning, utilization, and performance",
    color: COLORS.purple,
    stats: [
      { value: "2,986", label: "Total FTE", color: COLORS.blue },
      { value: "82%", label: "Utilization", color: COLORS.green },
    ],
    extra: [
      { label: "Capacity Gap", value: "-259 FTE" },
      { label: "Open Demands", value: "412" },
    ],
  },
  {
    num: 2,
    title: "Capacity & Demand Report",
    icon: "📊",
    desc: "Detailed view of capacity vs demand across all business units",
    color: COLORS.blue,
    stats: [
      { value: "7,427", label: "Capacity FTE", color: COLORS.blue },
      { value: "8,016", label: "Demand FTE", color: COLORS.orange },
    ],
    extra: [
      { label: "Gap", value: "-589 FTE" },
      { label: "Utilization", value: "83%" },
    ],
  },
  {
    num: 3,
    title: "Planning & Approvals Report",
    icon: "📝",
    desc: "Planning inputs, approval status, and workflow overview",
    color: COLORS.teal,
    pending: 381,
    overdue: 67,
    byType: [
      { label: "Demand Inputs", value: 488 },
      { label: "Capacity Inputs", value: 324 },
      { label: "Allocation Inputs", value: 221 },
    ],
  },
  {
    num: 4,
    title: "Allocation Report",
    icon: "🗂️",
    desc: "Resource allocation across projects, portfolios, and business units",
    color: COLORS.orange,
    stats: [
      { value: "7,115", label: "Allocated FTE", color: COLORS.blue },
      { value: "124", label: "Projects", color: COLORS.teal },
    ],
    barData: [
      { name: "Digital Transformation", value: 32 },
      { name: "Product Engineering", value: 26 },
      { name: "Cloud Services", value: 19 },
      { name: "Data & Analytics", value: 15 },
    ],
  },
  {
    num: 5,
    title: "Over-Allocation Report",
    icon: "⚠️",
    desc: "Identify and manage over-allocated resources across all projects",
    color: COLORS.red,
    highlight: "312 FTE",
    overList: [
      { name: "John Smith", pct: 132, color: COLORS.red },
      { name: "Priya Patel", pct: 128, color: COLORS.red },
      { name: "Ravi Kumar", pct: 120, color: COLORS.orange },
      { name: "Anita Desai", pct: 116, color: COLORS.orange },
    ],
  },
  {
    num: 6,
    title: "Availability & Bench Report",
    icon: "🪑",
    desc: "Track resource availability, bench strength, and shared resources",
    color: COLORS.green,
    availability: {
      available: "1,842",
      shared: "2,315",
      bench: "1,842 (21.6%)",
    },
  },
  {
    num: 7,
    title: "Compliance Report",
    icon: "✅",
    desc: "Resource compliance across timesheets, allocation, and governance",
    color: COLORS.teal,
    compliance: 92,
    items: [
      { label: "Timesheet Submission", value: 96 },
      { label: "Allocation Adherence", value: 91 },
      { label: "Manager Approval", value: 93 },
      { label: "Data Quality", value: 88 },
    ],
  },
  {
    num: 8,
    title: "Financial Report",
    icon: "💰",
    desc: "Budget vs actual cost analysis with variance tracking",
    color: COLORS.amber,
    budget: { total: "$24.80M", actual: "$20.36M", variance: "-$4.44M" },
    budgetRows: [
      { name: "Digital Transformation", variance: "1.2" },
      { name: "Product Engineering", variance: "1.12" },
      { name: "Cloud Services", variance: "0.95" },
    ],
  },
  {
    num: 9,
    title: "Vendor Management Report",
    icon: "🤝",
    desc: "Vendor performance, spend analysis, and contract compliance",
    color: COLORS.purple,
    vendors: [
      { name: "Tech Mahindra", spend: "$3.21M", rank: 1, score: 92 },
      { name: "Tata Consultancy", spend: "$2.98M", rank: 2, score: 88 },
      { name: "Infosys", spend: "$2.25M", rank: 3, score: 85 },
    ],
  },
  {
    num: 10,
    title: "Demand Management Report",
    icon: "📥",
    desc: "Open demands, fulfillment status, and demand prioritization",
    color: COLORS.blue,
    demandStats: [
      { value: "412", label: "Open Demands", color: COLORS.red },
      { value: "186", label: "In Progress", color: COLORS.orange },
      { value: "226", label: "Fulfilled", color: COLORS.green },
    ],
    demandByPriority: [
      { label: "High", value: 156, pct: "38%", color: COLORS.red },
      { label: "Medium", value: 164, pct: "40%", color: COLORS.orange },
      { label: "Low", value: 92, pct: "22%", color: COLORS.blue },
    ],
  },
  {
    num: 11,
    title: "Forecast & Planning Report",
    icon: "🔮",
    desc: "6-month capacity and demand forecast with planning recommendations",
    color: COLORS.teal,
    forecastData: [
      { month: "11/05/26", cap: 8.0, demand: 8.9, gap: -0.9 },
      { month: "01/06/26", cap: 8.3, demand: 9.1, gap: -0.8 },
      { month: "01/07/26", cap: 8.5, demand: 9.3, gap: -0.8 },
      { month: "01/08/26", cap: 6.9, demand: 8.7, gap: -1.8 },
      { month: "01/09/26", cap: 6.9, demand: 8.8, gap: -0.9 },
    ],
  },
  {
    num: 12,
    title: "Utilization Dashboard",
    icon: "📉",
    desc: "Measure workforce efficiency & workload distribution",
    color: COLORS.green,
    utilOverall: 78.2,
    utilByType: [
      { label: "Project Delivery", value: 47.9 },
      { label: "Support / BAU", value: 24.1 },
      { label: "Internal / Admin", value: 14.4 },
      { label: "Training", value: 7.7 },
    ],
  },
  {
    num: 13,
    title: "Timesheet Report",
    icon: "🕐",
    desc: "Timesheet compliance, planned vs actual effort tracking",
    color: COLORS.blue,
    tsCompliance: 96,
    actualFTE: "2,850",
    tsBreakdown: [
      { label: "On Track", pct: 66, color: COLORS.green },
      { label: "Over", pct: 20, color: COLORS.red },
      { label: "Under", pct: 10, color: COLORS.orange },
    ],
  },
  {
    num: 14,
    title: "Approval Workflow Report",
    icon: "🔔",
    desc: "Pending and overdue approvals across all workflow types",
    color: COLORS.orange,
    pending: 27,
    overdue: 12,
    byType: [
      { label: "Resource Requests", value: 12 },
      { label: "Project Requests", value: 7 },
      { label: "Allocation Changes", value: 5 },
      { label: "Time Off Requests", value: 3 },
    ],
  },
  {
    num: 15,
    title: "Reports Hub",
    icon: "🗃️",
    desc: "Central hub for all reports, favorites, and scheduled reports",
    color: COLORS.purple,
    hub: true,
  },
];

const utilTrendData = [
  { month: "01/01/26", overall: 73.1, billable: 58.2 },
  { month: "01/02/26", overall: 74.0, billable: 59.1 },
  { month: "01/03/26", overall: 75.6, billable: 60.3 },
  { month: "01/04/26", overall: 76.8, billable: 61.0 },
  { month: "11/04/26", overall: 75.6, billable: 59.3 },
  { month: "11/05/26", overall: 78.2, billable: 62.4 },
];

const utilByDeptData = [
  { dept: "Delivery", overall: 66.7, billable: 88.1, capacity: 92 },
  { dept: "Technology", overall: 65.1, billable: 83.2, capacity: 88 },
  { dept: "Business Support", overall: 50.2, billable: 78.4, capacity: 82 },
  { dept: "Operations", overall: 48.5, billable: 76.8, capacity: 79 },
  { dept: "Finance", overall: 41.6, billable: 73.2, capacity: 75 },
  { dept: "HR", overall: 38.7, billable: 70.1, capacity: 71 },
];

const utilByWorkType = [
  { name: "Project Delivery", value: 47.9, hours: 56500, color: COLORS.blue },
  { name: "Support / BAU", value: 24.1, hours: 28400, color: COLORS.green },
  { name: "Internal / Admin", value: 14.4, hours: 17000, color: COLORS.orange },
  { name: "Training", value: 7.7, hours: 9100, color: COLORS.purple },
  { name: "Other", value: 5.9, hours: 7000, color: COLORS.gray },
];

const billableNonBillableData = [
  { dept: "Delivery", billable: 67, nonBillable: 13, total: 80 },
  { dept: "Technology", billable: 65, nonBillable: 16, total: 81 },
  { dept: "Business Support", billable: 50, nonBillable: 20, total: 70 },
  { dept: "Operations", billable: 48, nonBillable: 18, total: 66 },
  { dept: "Finance", billable: 42, nonBillable: 17, total: 59 },
  { dept: "HR", billable: 39, nonBillable: 16, total: 55 },
];

const underutilizedResources = [
  { name: "Neha Patel", dept: "Business Support", util: 32, hours: 96 },
  { name: "Rohit Sharma", dept: "Technology", util: 38, hours: 84 },
  { name: "Kavya Iyer", dept: "Delivery", util: 42, hours: 80 },
  { name: "Priya Nair", dept: "Finance", util: 45, hours: 72 },
  { name: "Arjun Reddy", dept: "Operations", util: 48, hours: 64 },
  { name: "Vikram Singh", dept: "Technology", util: 49, hours: 60 },
  { name: "Anita Singh", dept: "HR", util: 50, hours: 58 },
  { name: "Sandeep Das", dept: "Business Support", util: 52, hours: 56 },
  { name: "Rahul Verma", dept: "Operations", util: 55, hours: 50 },
  { name: "Manoj Gupta", dept: "Delivery", util: 57, hours: 48 },
];

const overutilizedResources = [
  { name: "Amit Kumar", dept: "Delivery", util: 128, overtime: 42 },
  { name: "Sneha Joshi", dept: "Delivery", util: 122, overtime: 36 },
  { name: "Deepak Yadav", dept: "Technology", util: 118, overtime: 32 },
  { name: "Pooja Mehta", dept: "Technology", util: 116, overtime: 28 },
  { name: "Varun Joshi", dept: "Operations", util: 115, overtime: 26 },
  { name: "Rakesh Patel", dept: "Delivery", util: 112, overtime: 24 },
  { name: "Meera Nair", dept: "Business Support", util: 110, overtime: 20 },
  { name: "Karan Malhotra", dept: "Delivery", util: 108, overtime: 18 },
  { name: "Isha Verma", dept: "Technology", util: 106, overtime: 16 },
  { name: "Sunil Rao", dept: "Operations", util: 105, overtime: 16 },
];

const heatmapManagers = [
  "Amit Kumar",
  "Rajesh Kumar",
  "Neha Iyer",
  "Vikram Singh",
];
const heatmapDepts = [
  { dept: "Delivery", vals: [92, 95, 88, 96], avg: 82.6 },
  { dept: "Technology", vals: [88, 112, 80, 92], avg: 80.3 },
  { dept: "Business Support", vals: [65, 82, 70, 91], avg: 77.1 },
  { dept: "Operations", vals: [66, 78, 72, 83], avg: 74.9 },
  { dept: "Finance", vals: [58, 69, 76, 82], avg: 72.4 },
  { dept: "HR", vals: [55, 64, 68, 72], avg: 69.8 },
];

const execKpis = [
  {
    label: "Total Capacity",
    value: "2,986 FTE",
    delta: "+6.2% vs 11/04/26",
    up: true,
    color: COLORS.blue,
    icon: "👥",
  },
  {
    label: "Total Demand",
    value: "3,245 FTE",
    delta: "+3.4% vs 11/04/26",
    up: true,
    color: COLORS.orange,
    icon: "📋",
  },
  {
    label: "Capacity Gap",
    value: "-259 FTE",
    delta: "▼ 2.8% vs 11/04/26",
    up: false,
    color: COLORS.red,
    icon: "📉",
  },
  {
    label: "Utilization Rate",
    value: "82%",
    delta: "▲ 2.3 pp vs 11/04/26",
    up: true,
    color: COLORS.purple,
    icon: "📈",
  },
  {
    label: "Open Demands",
    value: "412",
    delta: "▼ 5.1% vs 11/04/26",
    up: false,
    color: COLORS.blue,
    icon: "📂",
  },
  {
    label: "Overallocated",
    value: "168",
    delta: "▼ 3.6% vs 11/04/26",
    up: true,
    color: COLORS.amber,
    icon: "⚠️",
  },
  {
    label: "Vendor Spend",
    value: "$14.62M",
    delta: "▲ 7.3% vs 11/04/26",
    up: false,
    color: COLORS.teal,
    icon: "💲",
  },
  {
    label: "Staffing Risk",
    value: "23",
    delta: "▼ 4 vs 11/04/26",
    up: true,
    color: COLORS.red,
    icon: "🚨",
  },
];

const heatmapData = [
  {
    pillar: "Banking",
    icon: "🏦",
    rows: [
      { team: "Application Development", vals: [82, 84, 88, 91, 96, 104, 107] },
      { team: "Data Engineering", vals: [78, 83, 99, 101, 106, 110, 112] },
      { team: "QA Automation", vals: [76, 80, 92, 98, 105, 108, 111] },
      { team: "Cloud Engineering", vals: [85, 86, 90, 93, 97, 102, 101] },
    ],
  },
  {
    pillar: "Retail",
    icon: "🛒",
    rows: [
      { team: "Application Development", vals: [81, 82, 85, 88, 93, 98, 101] },
      { team: "Data Engineering", vals: [77, 79, 83, 86, 90, 94, 96] },
      { team: "QA Automation", vals: [80, 83, 88, 92, 95, 99, 101] },
      { team: "Cloud Engineering", vals: [75, 78, 82, 86, 88, 93, 95] },
    ],
  },
  {
    pillar: "Healthcare",
    icon: "🏥",
    rows: [
      { team: "Application Development", vals: [83, 85, 90, 94, 96, 102, 104] },
      { team: "Data Engineering", vals: [78, 81, 86, 91, 97, 101, 103] },
    ],
  },
];

const heatmapMonths = [
  "01/01/26",
  "01/02/26",
  "01/03/26",
  "11/04/26",
  "11/05/26",
  "01/06/26 (F)",
  "01/07/26 (F)",
];

const execCapDemandData = [
  { month: "01/08/25", Capacity: 2600, Demand: 2850, Gap: -250 },
  { month: "01/09/25", Capacity: 2680, Demand: 2920, Gap: -240 },
  { month: "01/10/25", Capacity: 2720, Demand: 2970, Gap: -250 },
  { month: "01/11/25", Capacity: 2760, Demand: 3010, Gap: -250 },
  { month: "01/12/25", Capacity: 2810, Demand: 3060, Gap: -250 },
  { month: "01/01/26", Capacity: 2850, Demand: 3100, Gap: -250 },
  { month: "01/02/26", Capacity: 2890, Demand: 3140, Gap: -250 },
  { month: "01/03/26", Capacity: 2930, Demand: 3180, Gap: -250 },
  { month: "11/04/26", Capacity: 2960, Demand: 3215, Gap: -255 },
  { month: "11/05/26", Capacity: 2986, Demand: 3245, Gap: -259 },
  { month: "01/06/26 (F)", Capacity: 3040, Demand: 3340, Gap: -300 },
  { month: "01/07/26 (F)", Capacity: 3020, Demand: 3380, Gap: -360 },
];

const demandStatusData = [
  { name: "Approved", value: 1558, pct: 48, color: COLORS.green },
  { name: "Pending Approval", value: 864, pct: 27, color: COLORS.orange },
  { name: "Draft", value: 496, pct: 15, color: COLORS.blue },
  { name: "Rejected", value: 327, pct: 10, color: COLORS.red },
];

const vendorData = [
  {
    name: "Ascendion Global",
    util: 86,
    fte: 685,
    spend: "$5.24M",
    demands: 92,
  },
  { name: "Collabera", util: 79, fte: 542, spend: "$3.86M", demands: 76 },
  { name: "UX Reactor", util: 83, fte: 418, spend: "$2.91M", demands: 58 },
  { name: "Hycoo", util: 75, fte: 312, spend: "$1.72M", demands: 36 },
  { name: "Moodys NWC", util: 71, fte: 256, spend: "$0.89M", demands: 28 },
];

const skillsGapData = [
  { skill: "QA Automation", demand: 325, available: 198, gap: -127 },
  { skill: "Data Engineering", demand: 512, available: 348, gap: -164 },
  { skill: "Cloud Engineering", demand: 418, available: 285, gap: -133 },
  { skill: "React", demand: 278, available: 203, gap: -75 },
  { skill: "Project Management", demand: 165, available: 124, gap: -41 },
];

const crossPillarData = [
  {
    borrowing: "Retail",
    from: "Banking",
    fte: 128,
    skills: "QA Automation, BA",
  },
  {
    borrowing: "Healthcare",
    from: "Hi-tech",
    fte: 96,
    skills: "Cloud Engineering",
  },
  {
    borrowing: "Life Sciences",
    from: "Banking",
    fte: 78,
    skills: "Data Engineering",
  },
  { borrowing: "Retail", from: "Hi-tech", fte: 64, skills: "DevOps, Cloud" },
];

const staffingRiskProjects = [
  {
    project: "Core Banking Upgrade",
    pillar: "Banking",
    risk: "High",
    gap: -28,
  },
  { project: "Cloud Migration", pillar: "Retail", risk: "High", gap: -24 },
  {
    project: "Data Modernization",
    pillar: "Healthcare",
    risk: "Medium",
    gap: -16,
  },
  {
    project: "Customer Portal Revamp",
    pillar: "Hi-tech",
    risk: "Medium",
    gap: -12,
  },
  {
    project: "AI Analytics Platform",
    pillar: "Retail",
    risk: "Medium",
    gap: -10,
  },
];

const strategicAlerts = [
  {
    icon: "⚠️",
    text: "Projected capacity gap of 259 FTE in Jun 2026",
    level: "High",
    color: COLORS.red,
  },
  {
    icon: "ℹ️",
    text: "168 resources are over allocated (>100%)",
    level: "Medium",
    color: COLORS.orange,
  },
  {
    icon: "ℹ️",
    text: "12 projects at staffing risk",
    level: "Medium",
    color: COLORS.orange,
  },
  {
    icon: "ℹ️",
    text: "412 demands pending approval",
    level: "Info",
    color: COLORS.blue,
  },
  {
    icon: "ℹ️",
    text: "12 timesheets pending submission",
    level: "Info",
    color: COLORS.blue,
  },
];

const capDemand2026 = [
  { month: "01/01/26", Capacity: 7100, Demand: 7300, Gap: -200 },
  { month: "01/02/26", Capacity: 7200, Demand: 7500, Gap: -300 },
  { month: "01/03/26", Capacity: 7300, Demand: 7700, Gap: -400 },
  { month: "11/04/26", Capacity: 7700, Demand: 7800, Gap: -100 },
  { month: "11/05/26", Capacity: 7427, Demand: 8016, Gap: -589 },
];

// ─── Shared style helpers ─────────────────────────────────────────────────────

/** Card wrapper matching UserManagement card style */
const cardStyle: React.CSSProperties = {
  background: CV.bgPrimary,
  border: `1px solid ${CV.borderPrimary}`,
  borderRadius: CV.radiusLg,
  padding: "14px 16px",
  boxShadow:
    "0 0 0 0.5px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)",
  outline: `1px solid rgba(255,255,255,0.06)`,
};

/** Table header cell */
const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "6px 8px",
  fontSize: 10,
  color: CV.textSecondary,
  borderBottom: `0.5px solid ${CV.borderSecondary}`,
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

/** Table body cell */
const tdStyle: React.CSSProperties = {
  padding: "7px 8px",
  fontSize: 11,
  color: CV.textPrimary,
  borderBottom: `0.5px solid ${CV.borderSecondary}`,
};

// ─── Reusable small components ────────────────────────────────────────────────

function MiniBar({
  value,
  max = 100,
  color = COLORS.blue,
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        height: 6,
        background: CV.bgSecondary,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${(value / max) * 100}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
        }}
      />
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, React.CSSProperties> = {
    High: {
      background: CV.bgDanger,
      color: CV.textDanger,
      border: `0.5px solid ${CV.borderDanger}`,
    },
    Medium: {
      background: CV.bgWarning,
      color: CV.textWarning,
      border: `0.5px solid ${CV.borderWarning}`,
    },
    Low: {
      background: CV.bgSuccess,
      color: CV.textSuccess,
      border: `0.5px solid ${CV.borderSuccess}`,
    },
    Info: {
      background: CV.bgInfo,
      color: CV.textInfo,
      border: `0.5px solid ${CV.borderInfo}`,
    },
    Critical: {
      background: CV.bgDanger,
      color: CV.textDanger,
      border: `0.5px solid ${CV.borderDanger}`,
    },
  };
  const s = styles[level] || styles.Info;
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: CV.radiusMd,
        ...s,
      }}
    >
      {level}
    </span>
  );
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: CV.bgSecondary,
        borderRadius: CV.radiusMd,
        padding: "12px 16px",
      }}
    >
      <div style={{ fontSize: 10, color: CV.textSecondary, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        color: CV.textSecondary,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 10,
        marginTop: 14,
        borderBottom: `0.5px solid ${CV.borderSecondary}`,
        paddingBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function DetailTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={thStyle}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={tdStyle}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DetailMiniBar({
  value,
  max = 100,
  color = COLORS.blue,
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        height: 7,
        background: CV.bgSecondary,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min((value / max) * 100, 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 3,
        }}
      />
    </div>
  );
}

function UtilBar({ value }: { value: number }) {
  const color =
    value >= 101 ? COLORS.red : value >= 95 ? COLORS.orange : COLORS.green;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          background: CV.bgSecondary,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(value, 100)}%`,
            height: "100%",
            background: color,
            borderRadius: 3,
          }}
        />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color, minWidth: 28 }}>
        {value}%
      </span>
    </div>
  );
}

function ViewAllLink({ label = "View All →" }: { label?: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <span
        style={{
          fontSize: 11,
          color: COLORS.blue,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: CV.textPrimary,
        marginBottom: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

// ─── Heatmap helpers ──────────────────────────────────────────────────────────

function heatCell(val: number) {
  if (val > 110) return { bg: CV.bgDanger, color: CV.textDanger };
  if (val > 100) return { bg: CV.bgDanger, color: CV.textDanger };
  if (val >= 85) return { bg: CV.bgSuccess, color: CV.textSuccess };
  if (val >= 70) return { bg: CV.bgInfo, color: CV.textInfo };
  return { bg: CV.bgWarning, color: CV.textWarning };
}

function heatColor(val: number) {
  if (val >= 101) return { bg: CV.bgDanger, text: CV.textDanger, fw: 700 };
  if (val >= 95) return { bg: CV.bgWarning, text: CV.textWarning, fw: 600 };
  if (val >= 70) return { bg: CV.bgSuccess, text: CV.textSuccess, fw: 500 };
  return { bg: CV.bgInfo, text: CV.textInfo, fw: 500 };
}

// ─── Filter Bars ──────────────────────────────────────────────────────────────

const filterDefs = [
  {
    label: "Time Period",
    key: "timePeriod",
    options: [
      "11/05/26",
      "11/04/26",
      "01/03/26",
      "01/02/26",
      "01/01/26",
      "Q1 2026",
      "Q2 2026",
    ],
  },
  {
    label: "Pillar",
    key: "pillar",
    options: [
      "All",
      "Banking",
      "Retail",
      "Healthcare",
      "Hi-tech",
      "Life Sciences",
    ],
  },
  {
    label: "Team",
    key: "team",
    options: [
      "All",
      "Application Dev",
      "Data Engineering",
      "QA Automation",
      "Cloud Engineering",
    ],
  },
  {
    label: "Project",
    key: "project",
    options: [
      "All",
      "Cloud Migration",
      "Data Warehouse",
      "Mobile App Revamp",
      "AI Platform",
      "ERP Implementation",
    ],
  },
  {
    label: "Skill Set",
    key: "skillSet",
    options: [
      "All",
      "QA Automation",
      "Data Engineering",
      "Cloud Engineering",
      "React",
      "Project Management",
    ],
  },
  {
    label: "Vendor",
    key: "vendor",
    options: [
      "All",
      "Tech Mahindra",
      "Tata Consultancy",
      "Infosys",
      "Wipro",
      "HCL Technologies",
    ],
  },
];

type FilterState = Record<string, string>;
const DEFAULT_FILTERS: FilterState = {
  timePeriod: "11/05/26",
  pillar: "All",
  team: "All",
  project: "All",
  skillSet: "All",
  vendor: "All",
};

const selectStyle: React.CSSProperties = {
  height: 36,
  border: `1px solid ${CV.borderSecondary}`,
  borderRadius: CV.radiusMd,
  padding: "0 12px",
  fontSize: 13,
  background: CV.bgPrimary,
  color: CV.textPrimary,
  cursor: "pointer",
  outline: "none",
};

function FilterBar({
  title,
  subtitle,
  filters,
  setFilters,
}: {
  title: string;
  subtitle: string;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
  return (
    <div
      style={{
        background: CV.bgPrimary,
        borderBottom: `1px solid ${CV.borderSecondary}`,
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: CV.textPrimary,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <span
            style={{
              background: CV.bgInfo,
              color: CV.textInfo,
              padding: "5px 12px",
              borderRadius: CV.radiusMd,
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {subtitle}
          </span>
        </div>
        <div style={{ fontSize: 12, color: CV.textTertiary }}>
          Last Updated: 15/05/26 10:30 AM
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
          flexWrap: "wrap" as const,
        }}
      >
        {filterDefs.map((f) => (
          <div
            key={f.key}
            style={{
              display: "flex",
              flexDirection: "column" as const,
              minWidth: 120,
            }}
          >
            <label
              style={{
                fontSize: 10,
                color: CV.textTertiary,
                marginBottom: 4,
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
              }}
            >
              {f.label}
            </label>
            <select
              value={filters[f.key]}
              onChange={(e) =>
                setFilters((p) => ({ ...p, [f.key]: e.target.value }))
              }
              style={selectStyle}
            >
              {f.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericFilterBar({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        marginBottom: 16,
        flexWrap: "wrap" as const,
      }}
    >
      {filterDefs.map((f) => (
        <div
          key={f.key}
          style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}
        >
          <label
            style={{
              fontSize: 10,
              color: CV.textTertiary,
              textTransform: "uppercase" as const,
              letterSpacing: "0.04em",
            }}
          >
            {f.label}
          </label>
          <select
            value={filters[f.key]}
            onChange={(e) =>
              setFilters((p) => ({ ...p, [f.key]: e.target.value }))
            }
            style={{
              ...selectStyle,
              height: 32,
              fontSize: 12,
              padding: "0 10px",
            }}
          >
            {f.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6 }}>
        {["Filters", "Refresh", "Export"].map((l) => (
          <button
            key={l}
            style={{
              background: CV.bgPrimary,
              border: `0.5px solid ${CV.borderSecondary}`,
              borderRadius: CV.radiusMd,
              padding: "5px 12px",
              fontSize: 12,
              cursor: "pointer",
              color: CV.textPrimary,
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <div style={{ marginLeft: "auto", fontSize: 10, color: CV.textTertiary }}>
        Last Updated: 15/05/26 10:30 AM
      </div>
    </div>
  );
}

// ─── Report Card ──────────────────────────────────────────────────────────────

function ReportCard({ card, onView }: { card: any; onView: (c: any) => void }) {
  return (
    <div
      style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column" as const,
        gap: 10,
        minHeight: 220,
        background:
          "color-mix(in srgb, var(--color-background-primary) 100%, #fff 3%)",
        boxShadow: "0 2px 8px 0 rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: CV.radiusMd,
            background: CV.bgSecondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          {card.icon}
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: CV.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {card.num}. {card.title}
          </div>
          <div
            style={{
              fontSize: 10,
              color: CV.textTertiary,
              lineHeight: 1.4,
              marginTop: 2,
            }}
          >
            {card.desc}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {card.stats && (
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            {card.stats.map((s: any, i: number) => (
              <div key={i}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: s.color || CV.textPrimary,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: CV.textSecondary }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
        {card.extra && (
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: 3,
            }}
          >
            {card.extra.map((e: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 11,
                  color: CV.textPrimary,
                }}
              >
                <span style={{ color: CV.textSecondary }}>{e.label}</span>
                <span style={{ fontWeight: 600 }}>{e.value}</span>
              </div>
            ))}
          </div>
        )}
        {card.barData && (
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: 4,
            }}
          >
            {card.barData.map((r: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10,
                }}
              >
                <span
                  style={{ color: CV.textSecondary, minWidth: 90, fontSize: 9 }}
                >
                  {r.name}
                </span>
                <MiniBar value={r.value} color={COLORS.teal} />
                <span
                  style={{
                    color: CV.textPrimary,
                    minWidth: 28,
                    fontWeight: 600,
                  }}
                >
                  {r.value}%
                </span>
              </div>
            ))}
          </div>
        )}
        {card.overList && (
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.red,
                marginBottom: 4,
              }}
            >
              {card.highlight}
            </div>
            <div
              style={{ fontSize: 10, color: CV.textSecondary, marginBottom: 6 }}
            >
              Over Allocated Resources
            </div>
            {card.overList.map((r: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  padding: "2px 0",
                  borderBottom: `0.5px solid ${CV.borderSecondary}`,
                }}
              >
                <span style={{ color: CV.textPrimary }}>{r.name}</span>
                <span style={{ fontWeight: 700, color: r.color }}>
                  {r.pct}%
                </span>
              </div>
            ))}
          </div>
        )}
        {card.availability && (
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: 6,
            }}
          >
            {[
              {
                label: "Available",
                value: card.availability.available,
                color: COLORS.green,
              },
              {
                label: "Shared",
                value: card.availability.shared,
                color: COLORS.blue,
              },
              {
                label: "Bench",
                value: card.availability.bench,
                color: CV.textSecondary,
              },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: 14, fontWeight: 700, color: r.color }}>
                  {r.value}
                </div>
                <div style={{ fontSize: 10, color: CV.textSecondary }}>
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        )}
        {card.compliance !== undefined && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.green }}>
              {card.compliance}%
            </div>
            <div
              style={{ fontSize: 10, color: CV.textSecondary, marginBottom: 6 }}
            >
              Overall Compliance
            </div>
            {card.items.map((r: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10,
                  marginBottom: 3,
                }}
              >
                <span style={{ color: CV.textSecondary, minWidth: 120 }}>
                  {r.label}
                </span>
                <MiniBar value={r.value} color={COLORS.green} />
                <span style={{ fontWeight: 600, color: CV.textPrimary }}>
                  {r.value}%
                </span>
              </div>
            ))}
          </div>
        )}
        {card.budget && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              {[
                { l: "Total Budget", v: card.budget.total },
                { l: "Total Actual", v: card.budget.actual },
                { l: "Variance", v: card.budget.variance },
              ].map((b, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: i === 2 ? COLORS.red : CV.textPrimary,
                    }}
                  >
                    {b.v}
                  </div>
                  <div style={{ fontSize: 9, color: CV.textTertiary }}>
                    {b.l}
                  </div>
                </div>
              ))}
            </div>
            {card.budgetRows.map((r: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: CV.textPrimary,
                  padding: "2px 0",
                }}
              >
                <span style={{ color: CV.textSecondary }}>{r.name}</span>
                <span style={{ color: COLORS.red, fontWeight: 600 }}>
                  ${r.variance}M
                </span>
              </div>
            ))}
          </div>
        )}
        {card.vendors && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: "3px 8px",
                fontSize: 10,
                color: CV.textSecondary,
                marginBottom: 2,
              }}
            >
              <span>Vendor</span>
              <span>Spend</span>
              <span>Rank</span>
              <span>Score</span>
            </div>
            {card.vendors.map((v: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: "2px 8px",
                  fontSize: 10,
                  padding: "2px 0",
                  borderBottom: `0.5px solid ${CV.borderSecondary}`,
                }}
              >
                <span style={{ color: CV.textPrimary }}>{v.name}</span>
                <span style={{ fontWeight: 600, color: CV.textPrimary }}>
                  {v.spend}
                </span>
                <span style={{ color: COLORS.blue, fontWeight: 700 }}>
                  #{v.rank}
                </span>
                <span
                  style={{
                    color: v.score >= 85 ? COLORS.green : COLORS.orange,
                    fontWeight: 600,
                  }}
                >
                  {v.score}%
                </span>
              </div>
            ))}
          </div>
        )}
        {card.demandStats && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              {card.demandStats.map((d: any, i: number) => (
                <div key={i}>
                  <div
                    style={{ fontSize: 18, fontWeight: 700, color: d.color }}
                  >
                    {d.value}
                  </div>
                  <div style={{ fontSize: 10, color: CV.textSecondary }}>
                    {d.label}
                  </div>
                </div>
              ))}
            </div>
            {card.demandByPriority.map((r: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10,
                  marginBottom: 3,
                }}
              >
                <span style={{ color: CV.textSecondary, minWidth: 50 }}>
                  {r.label}
                </span>
                <MiniBar value={parseInt(r.pct)} color={r.color} />
                <span style={{ color: CV.textPrimary }}>
                  {r.value} ({r.pct})
                </span>
              </div>
            ))}
          </div>
        )}
        {card.forecastData && (
          <div style={{ height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={card.forecastData}
                margin={{ top: 5, right: 5, bottom: 5, left: -20 }}
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke={CV.borderSecondary}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 8, fill: CV.textSecondary as string }}
                />
                <YAxis
                  tick={{ fontSize: 8, fill: CV.textSecondary as string }}
                  domain={[5, 11]}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 10,
                    background: CV.bgPrimary,
                    border: `0.5px solid ${CV.borderSecondary}`,
                    color: CV.textPrimary,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cap"
                  stroke={COLORS.green}
                  strokeWidth={1.5}
                  dot={false}
                  name="Capacity"
                />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke={COLORS.blue}
                  strokeWidth={1.5}
                  dot={false}
                  name="Demand"
                />
                <Line
                  type="monotone"
                  dataKey="gap"
                  stroke={COLORS.red}
                  strokeWidth={1.5}
                  dot={false}
                  name="Gap"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {card.utilOverall && (
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: COLORS.teal }}>
              {card.utilOverall}%
            </div>
            <div
              style={{ fontSize: 10, color: CV.textSecondary, marginBottom: 6 }}
            >
              Overall Utilization
            </div>
            {card.utilByType.map((r: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10,
                  marginBottom: 3,
                }}
              >
                <span
                  style={{
                    color: CV.textSecondary,
                    minWidth: 110,
                    fontSize: 9,
                  }}
                >
                  {r.label}
                </span>
                <MiniBar value={r.value} color={COLORS.teal} />
                <span style={{ fontWeight: 600, color: CV.textPrimary }}>
                  {r.value}%
                </span>
              </div>
            ))}
          </div>
        )}
        {card.tsCompliance && (
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div>
              <div
                style={{ fontSize: 26, fontWeight: 700, color: COLORS.green }}
              >
                {card.tsCompliance}%
              </div>
              <div style={{ fontSize: 10, color: CV.textSecondary }}>
                TS Compliance
              </div>
              {card.tsBreakdown.map((r: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    marginTop: 2,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: r.color,
                    }}
                  />
                  <span style={{ color: CV.textSecondary }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: CV.textPrimary }}>
                    {r.pct}%
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div
                style={{ fontSize: 22, fontWeight: 700, color: COLORS.blue }}
              >
                {card.actualFTE}
              </div>
              <div style={{ fontSize: 10, color: CV.textSecondary }}>
                Actual FTE
              </div>
            </div>
          </div>
        )}
        {card.pending !== undefined && !card.tsCompliance && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: COLORS.orange,
                  }}
                >
                  {card.pending}
                </div>
                <div style={{ fontSize: 10, color: CV.textSecondary }}>
                  Pending Approvals
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: 26, fontWeight: 700, color: COLORS.red }}
                >
                  {card.overdue}
                </div>
                <div style={{ fontSize: 10, color: CV.textSecondary }}>
                  Overdue Approvals
                </div>
              </div>
            </div>
            {card.byType.map((r: any, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  padding: "2px 0",
                  color: CV.textPrimary,
                }}
              >
                <span style={{ color: CV.textSecondary }}>{r.label}</span>
                <span style={{ fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}
        {card.hub && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginTop: 4,
            }}
          >
            {["All Reports", "Favorites", "Recent", "Scheduled"].map((l, i) => (
              <div
                key={i}
                style={{
                  background: CV.bgSecondary,
                  border: `0.5px solid ${CV.borderSecondary}`,
                  borderRadius: CV.radiusMd,
                  padding: "10px",
                  textAlign: "center" as const,
                  fontSize: 11,
                  color: CV.textPrimary,
                  fontWeight: 500,
                }}
              >
                {["📊", "⭐", "🕐", "📅"][i]} {l}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onView(card)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: 11,
          color: card.color,
          fontWeight: 600,
          textAlign: "left" as const,
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: "auto",
        }}
      >
        View Report →
      </button>
    </div>
  );
}

// ─── Utilization Dashboard (Report 12) ───────────────────────────────────────

function ReportDetail12() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const kpiTiles = [
    {
      label: "Overall Utilization %",
      value: "78.2%",
      delta: "▲ 2.6%",
      up: true,
      color: COLORS.blue,
      icon: "👥",
    },
    {
      label: "Billable Utilization %",
      value: "62.4%",
      delta: "▲ 3.1%",
      up: true,
      color: COLORS.green,
      icon: "✅",
    },
    {
      label: "Non-Billable Utilization %",
      value: "15.8%",
      delta: "▼ 0.5%",
      up: false,
      color: COLORS.purple,
      icon: "🖥️",
    },
    {
      label: "Operational Work %",
      value: "46.3%",
      delta: "▲ 1.8%",
      up: true,
      color: COLORS.orange,
      icon: "⏱️",
    },
    {
      label: "Strategic Work %",
      value: "31.9%",
      delta: "▲ 2.3%",
      up: true,
      color: COLORS.teal,
      icon: "🎯",
    },
    {
      label: "Underutilized (<60%)",
      value: "156",
      delta: "▼ 12",
      up: true,
      color: CV.textSecondary as string,
      icon: "👤",
    },
    {
      label: "Overutilized (>100%)",
      value: "92",
      delta: "▲ 8",
      up: false,
      color: COLORS.red,
      icon: "🔥",
    },
  ];

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: CV.bgSecondary,
        minHeight: "100vh",
      }}
    >
      <FilterBar
        title="4. Utilization Dashboard"
        subtitle="Measure workforce efficiency & workload distribution"
        filters={filters}
        setFilters={setFilters}
      />
      <div
        style={{
          padding: "14px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* KPI Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 8,
          }}
        >
          {kpiTiles.map((k, i) => (
            <div
              key={i}
              style={{
                background: CV.bgPrimary,
                border: `1px solid ${CV.borderPrimary}`,
                borderRadius: CV.radiusLg,
                padding: "12px 14px",
                boxShadow:
                  "0 1px 4px 0 rgba(0,0,0,0.10), 0 0.5px 1px 0 rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: CV.textSecondary,
                    lineHeight: 1.3,
                  }}
                >
                  {k.label}
                </span>
                <span style={{ fontSize: 16 }}>{k.icon}</span>
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: k.color,
                  lineHeight: 1.1,
                  marginBottom: 2,
                }}
              >
                {k.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: k.up ? COLORS.green : COLORS.red,
                }}
              >
                {k.delta}{" "}
                <span style={{ color: CV.textTertiary }}>vs 11/04/26</span>
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Trend + By Dept + By Work Type */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr 0.7fr",
            gap: 12,
          }}
        >
          {/* 1. Trend */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 10,
              }}
            >
              1. Utilization Trend Over Time (%)
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={utilTrendData}
                margin={{ top: 5, right: 10, bottom: 5, left: -15 }}
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke={CV.borderTertiary}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 8, fill: CV.textSecondary as string }}
                  angle={-20}
                  textAnchor="end"
                  height={36}
                />
                <YAxis
                  domain={[40, 100]}
                  tick={{ fontSize: 9, fill: CV.textSecondary as string }}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 10,
                    background: CV.bgPrimary,
                    border: `0.5px solid ${CV.borderSecondary}`,
                    color: CV.textPrimary,
                  }}
                  formatter={(v) => `${v}%`}
                />
                <Line
                  type="monotone"
                  dataKey="overall"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Overall Utilization %"
                />
                <Line
                  type="monotone"
                  dataKey="billable"
                  stroke={COLORS.green}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Billable Utilization %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 2. By Dept */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 10,
              }}
            >
              2. Utilization by Department (%)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {utilByDeptData.map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: CV.textPrimary,
                      minWidth: 110,
                    }}
                  >
                    {d.dept}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {[
                      { val: d.overall, color: COLORS.blue },
                      { val: d.billable, color: COLORS.green },
                      { val: d.capacity, color: COLORS.orange },
                    ].map((row, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          gap: 3,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: `${row.val}%`,
                            height: 6,
                            background: row.color,
                            borderRadius: 2,
                            minWidth: 2,
                            opacity: j === 2 ? 0.6 : 1,
                          }}
                        />
                        <span style={{ fontSize: 9, color: row.color }}>
                          {row.val}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. By Work Type */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 10,
              }}
            >
              3. Utilization by Work Type
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ position: "relative", width: 140, height: 140 }}>
                <PieChart width={140} height={140}>
                  <Pie
                    data={utilByWorkType}
                    cx={69}
                    cy={69}
                    innerRadius={42}
                    outerRadius={64}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {utilByWorkType.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: CV.textPrimary,
                    }}
                  >
                    118K
                  </div>
                  <div style={{ fontSize: 8, color: CV.textSecondary }}>
                    Total Hours
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {utilByWorkType.map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 9, color: CV.textPrimary, flex: 1 }}>
                    {d.name}
                  </span>
                  <span
                    style={{ fontSize: 9, fontWeight: 700, color: d.color }}
                  >
                    {(d.hours / 1000).toFixed(1)}K ({d.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Billable vs Non-Billable + Distribution + Under/Overutilized */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 0.65fr 1fr 1fr",
            gap: 12,
          }}
        >
          {/* 4. Billable vs Non-Billable */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 8,
              }}
            >
              4. Billable vs Non-Billable (%)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {billableNonBillableData.map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      fontSize: 9.5,
                      color: CV.textPrimary,
                      minWidth: 105,
                    }}
                  >
                    {d.dept}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      height: 10,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${(d.billable / (d.billable + d.nonBillable)) * 100}%`,
                        background: COLORS.blue,
                      }}
                    />
                    <div style={{ flex: 1, background: COLORS.green }} />
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      color: CV.textPrimary,
                      minWidth: 26,
                      fontWeight: 600,
                    }}
                  >
                    {d.total}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Distribution */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 8,
              }}
            >
              5. Utilization Distribution
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <div style={{ position: "relative", width: 120, height: 120 }}>
                <PieChart width={120} height={120}>
                  <Pie
                    data={[{ value: 156 }, { value: 1738 }, { value: 92 }]}
                    cx={59}
                    cy={59}
                    innerRadius={36}
                    outerRadius={54}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill={COLORS.amber} />
                    <Cell fill={COLORS.green} />
                    <Cell fill={COLORS.red} />
                  </Pie>
                </PieChart>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: CV.textPrimary,
                    }}
                  >
                    1,986
                  </div>
                  <div style={{ fontSize: 8, color: CV.textSecondary }}>
                    Total Resources
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                {
                  label: "Underutilized (<60%)",
                  count: 156,
                  pct: "7.9%",
                  color: COLORS.amber,
                },
                {
                  label: "Optimal (60%–100%)",
                  count: 1738,
                  pct: "87.4%",
                  color: COLORS.green,
                },
                {
                  label: "Overutilized (>100%)",
                  count: 92,
                  pct: "4.7%",
                  color: COLORS.red,
                },
              ].map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 5 }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 9, color: CV.textPrimary, flex: 1 }}>
                    {d.label}
                  </span>
                  <span
                    style={{ fontSize: 10, fontWeight: 700, color: d.color }}
                  >
                    {d.count}
                  </span>
                  <span style={{ fontSize: 9, color: CV.textTertiary }}>
                    ({d.pct})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Top 10 Underutilized */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 8,
              }}
            >
              6. Top 10 Underutilized Resources
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Resource", "Department", "Util %", "Avail Hrs"].map(
                    (h) => (
                      <th key={h} style={{ ...thStyle, fontSize: 9 }}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {underutilizedResources.map((r, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `0.5px solid ${CV.borderTertiary}` }}
                  >
                    <td
                      style={{
                        padding: "4px 6px",
                        fontSize: 10,
                        color: CV.textPrimary,
                        fontWeight: 500,
                      }}
                    >
                      {r.name}
                    </td>
                    <td
                      style={{
                        padding: "4px 6px",
                        fontSize: 9.5,
                        color: CV.textSecondary,
                      }}
                    >
                      {r.dept}
                    </td>
                    <td style={{ padding: "4px 6px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 3,
                          color:
                            r.util < 40
                              ? CV.textDanger
                              : r.util < 50
                                ? CV.textWarning
                                : CV.textPrimary,
                          background:
                            r.util < 40
                              ? CV.bgDanger
                              : r.util < 50
                                ? CV.bgWarning
                                : CV.bgSecondary,
                        }}
                      >
                        {r.util}%
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "4px 6px",
                        fontSize: 10,
                        fontWeight: 600,
                        color: CV.textPrimary,
                      }}
                    >
                      {r.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 7. Top 10 Overutilized */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 8,
              }}
            >
              7. Top 10 Overutilized Resources
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Resource", "Department", "Util %", "Overtime Hrs"].map(
                    (h) => (
                      <th key={h} style={{ ...thStyle, fontSize: 9 }}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {overutilizedResources.map((r, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: `0.5px solid ${CV.borderTertiary}`,
                      background: r.util >= 120 ? CV.bgDanger : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "4px 6px",
                        fontSize: 10,
                        color: CV.textPrimary,
                        fontWeight: 500,
                      }}
                    >
                      {r.name}
                    </td>
                    <td
                      style={{
                        padding: "4px 6px",
                        fontSize: 9.5,
                        color: CV.textSecondary,
                      }}
                    >
                      {r.dept}
                    </td>
                    <td style={{ padding: "4px 6px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: 3,
                          color: r.util >= 120 ? CV.textDanger : CV.textWarning,
                          background:
                            r.util >= 120 ? CV.bgDanger : CV.bgWarning,
                        }}
                      >
                        {r.util}%
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "4px 6px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: CV.textDanger,
                      }}
                    >
                      {r.overtime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 3: Operational vs Strategic + Heatmap + Key Insights */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.55fr 1.6fr 0.65fr",
            gap: 12,
          }}
        >
          {/* 8. Operational vs Strategic */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 8,
              }}
            >
              8. Operational vs Strategic Work (%)
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div style={{ position: "relative", width: 130, height: 130 }}>
                <PieChart width={130} height={130}>
                  <Pie
                    data={[{ value: 46.3 }, { value: 31.9 }, { value: 21.8 }]}
                    cx={64}
                    cy={64}
                    innerRadius={38}
                    outerRadius={58}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill={COLORS.orange} />
                    <Cell fill={COLORS.blue} />
                    <Cell fill={COLORS.purple} />
                  </Pie>
                </PieChart>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: CV.textPrimary,
                    }}
                  >
                    118K
                  </div>
                  <div style={{ fontSize: 8, color: CV.textSecondary }}>
                    Total Hours
                  </div>
                </div>
              </div>
            </div>
            {[
              {
                label: "Operational Work",
                hours: "54.6K (46.3%)",
                color: COLORS.orange,
              },
              {
                label: "Strategic Work",
                hours: "37.7K (31.9%)",
                color: COLORS.blue,
              },
              {
                label: "Other / Admin / Training",
                hours: "25.7K (21.8%)",
                color: COLORS.purple,
              },
            ].map((d, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: d.color,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <div style={{ fontSize: 9, color: CV.textSecondary }}>
                    {d.label}
                  </div>
                  <div
                    style={{ fontSize: 10, fontWeight: 700, color: d.color }}
                  >
                    {d.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 9. Heatmap */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 10,
              }}
            >
              9. Utilization Heatmap by Department & Manager
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, minWidth: 130 }}>
                    Department / Manager
                  </th>
                  {heatmapManagers.map((m) => (
                    <th
                      key={m}
                      style={{ ...thStyle, textAlign: "center" as const }}
                    >
                      {m}
                    </th>
                  ))}
                  <th style={{ ...thStyle, textAlign: "center" as const }}>
                    Dept Avg
                  </th>
                </tr>
              </thead>
              <tbody>
                {heatmapDepts.map((row, i) => {
                  const avgStyle =
                    row.avg >= 80
                      ? { bg: CV.bgSuccess, color: CV.textSuccess }
                      : { bg: CV.bgWarning, color: CV.textWarning };
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `0.5px solid ${CV.borderTertiary}`,
                      }}
                    >
                      <td
                        style={{
                          padding: "6px 8px",
                          fontSize: 11,
                          color: CV.textPrimary,
                          fontWeight: 600,
                        }}
                      >
                        {row.dept}
                      </td>
                      {row.vals.map((v, j) => {
                        const s = heatCell(v);
                        return (
                          <td
                            key={j}
                            style={{
                              padding: "4px 6px",
                              textAlign: "center" as const,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                color: s.color,
                                background: s.bg,
                                padding: "3px 8px",
                                borderRadius: 4,
                                display: "inline-block",
                              }}
                            >
                              {v}%
                            </span>
                          </td>
                        );
                      })}
                      <td
                        style={{
                          padding: "4px 6px",
                          textAlign: "center" as const,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: avgStyle.color,
                            background: avgStyle.bg,
                            padding: "3px 8px",
                            borderRadius: 4,
                            display: "inline-block",
                          }}
                        >
                          {row.avg}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 10. Key Insights */}
          <div style={cardStyle}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textPrimary,
                marginBottom: 10,
              }}
            >
              10. Key Insights
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  icon: "📈",
                  color: COLORS.green,
                  bg: CV.bgSuccess,
                  border: CV.borderSuccess,
                  text: "Overall utilization increased by 2.6% compared to 11/04/26.",
                },
                {
                  icon: "⚠️",
                  color: COLORS.red,
                  bg: CV.bgDanger,
                  border: CV.borderDanger,
                  text: "92 resources are overutilized (>100%). Immediate attention required.",
                },
                {
                  icon: "👥",
                  color: COLORS.orange,
                  bg: CV.bgWarning,
                  border: CV.borderWarning,
                  text: "156 resources are underutilized (<60%). Consider reallocation.",
                },
                {
                  icon: "🎯",
                  color: COLORS.blue,
                  bg: CV.bgInfo,
                  border: CV.borderInfo,
                  text: "Strategic work accounts for 31.9% of total effort.",
                },
              ].map((ins, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    background: ins.bg,
                    borderRadius: CV.radiusMd,
                    padding: "8px 10px",
                    border: `0.5px solid ${ins.border}`,
                  }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>
                    {ins.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: CV.textPrimary,
                      lineHeight: 1.5,
                    }}
                  >
                    {ins.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            color: CV.textTertiary,
            paddingTop: 8,
            borderTop: `0.5px solid ${CV.borderTertiary}`,
          }}
        >
          ℹ️ All metrics are based on data as of 15/05/26 10:30 AM &nbsp;|&nbsp;
          Historical data available from 01/01/26 &nbsp;|&nbsp; Data refreshed
          daily
        </div>
      </div>
    </div>
  );
}

// ─── Executive Leadership Report (Report 1) ───────────────────────────────────

function ReportDetail1() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: CV.bgTertiary,
        minHeight: "100vh",
      }}
    >
      <FilterBar
        title="Executive Leadership Report"
        subtitle="Strategic overview of resource planning, utilization & performance"
        filters={filters}
        setFilters={setFilters}
      />
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* KPI Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8,1fr)",
            gap: 8,
          }}
        >
          {execKpis.map((k, i) => (
            <div
              key={i}
              style={{
                background: CV.bgPrimary,
                border: `1px solid ${CV.borderPrimary}`,
                borderRadius: CV.radiusLg,
                padding: "12px 14px",
                boxShadow:
                  "0 1px 4px 0 rgba(0,0,0,0.10), 0 0.5px 1px 0 rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: CV.textSecondary,
                    lineHeight: 1.3,
                  }}
                >
                  {k.label}
                </span>
                <span style={{ fontSize: 16 }}>{k.icon}</span>
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: k.color,
                  lineHeight: 1.1,
                  marginBottom: 3,
                }}
              >
                {k.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: k.up ? COLORS.green : COLORS.red,
                }}
              >
                {k.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Leadership Insights Banner */}
        <div
          style={{
            background: CV.bgWarning,
            border: `1px solid ${CV.borderWarning}`,
            borderRadius: CV.radiusLg,
            padding: "12px 16px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 18 }}>💡</span>
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: CV.textWarning,
                marginBottom: 3,
              }}
            >
              Leadership Insights
            </div>
            <div style={{ fontSize: 11, color: CV.textPrimary }}>
              Cloud & Retail pillars show{" "}
              <span style={{ color: COLORS.blue, fontWeight: 700 }}>
                12% demand increase
              </span>
              . Capacity shortfall expected in Q3 2026, primarily in Data
              Engineering and QA Automation skills.
            </div>
          </div>
        </div>

        {/* Heatmap + Capacity vs Demand */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 12,
          }}
        >
          <div style={cardStyle}>
            <CardHeader>1. Capacity Heatmap (Utilization %)</CardHeader>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 520,
                }}
              >
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: 36 }}>Pillar</th>
                    <th style={{ ...thStyle, minWidth: 130 }}>
                      Team / Skill Set
                    </th>
                    {heatmapMonths.map((m) => (
                      <th
                        key={m}
                        style={{
                          ...thStyle,
                          textAlign: "center" as const,
                          whiteSpace: "nowrap" as const,
                        }}
                      >
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((pillar, pi) =>
                    pillar.rows.map((row, ri) => {
                      const isFirst = ri === 0;
                      return (
                        <tr
                          key={`${pi}-${ri}`}
                          style={{
                            borderTop:
                              isFirst && pi > 0
                                ? `2px solid ${CV.borderSecondary}`
                                : `0.5px solid ${CV.borderTertiary}`,
                          }}
                        >
                          {isFirst && (
                            <td
                              rowSpan={pillar.rows.length}
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: CV.textPrimary,
                                padding: "4px 6px",
                                verticalAlign: "middle",
                                textAlign: "center" as const,
                                borderRight: `1px solid ${CV.borderTertiary}`,
                              }}
                            >
                              <div>{pillar.icon}</div>
                              <div
                                style={{
                                  fontSize: 8,
                                  marginTop: 2,
                                  color: CV.textSecondary,
                                }}
                              >
                                {pillar.pillar}
                              </div>
                            </td>
                          )}
                          <td
                            style={{
                              fontSize: 9.5,
                              color: CV.textPrimary,
                              padding: "4px 6px",
                              whiteSpace: "nowrap" as const,
                            }}
                          >
                            {row.team}
                          </td>
                          {row.vals.map((v, vi) => {
                            const { bg, text, fw } = heatColor(v);
                            return (
                              <td
                                key={vi}
                                style={{
                                  padding: "3px 3px",
                                  textAlign: "center" as const,
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: 9.5,
                                    fontWeight: fw,
                                    color: text,
                                    background: bg,
                                    borderRadius: 3,
                                    padding: "2px 5px",
                                    display: "inline-block",
                                  }}
                                >
                                  {v}%
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    }),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={cardStyle}>
            <CardHeader>
              <span>2. Capacity vs Demand Trend (FTE)</span>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  ["Capacity", COLORS.blue],
                  ["Demand", COLORS.orange],
                  ["Gap", COLORS.red],
                ].map(([l, c]) => (
                  <span
                    key={l}
                    style={{
                      fontSize: 9,
                      color: CV.textSecondary,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 2,
                        background: c,
                        display: "inline-block",
                        borderRadius: 1,
                      }}
                    />{" "}
                    {l}
                  </span>
                ))}
              </div>
            </CardHeader>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={execCapDemandData}
                margin={{ top: 5, right: 10, bottom: 5, left: -10 }}
              >
                <CartesianGrid
                  strokeDasharray="2 2"
                  stroke={CV.borderTertiary}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 8, fill: CV.textSecondary as string }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={36}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: CV.textSecondary as string }}
                  tickFormatter={(v) =>
                    v < 0 ? v : `${(v / 1000).toFixed(1)}K`
                  }
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 10,
                    background: CV.bgPrimary,
                    border: `0.5px solid ${CV.borderSecondary}`,
                    color: CV.textPrimary,
                  }}
                  formatter={(v) => `${(v as number).toLocaleString()} FTE`}
                />
                <Line
                  type="monotone"
                  dataKey="Capacity"
                  stroke={COLORS.blue}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Capacity"
                />
                <Line
                  type="monotone"
                  dataKey="Demand"
                  stroke={COLORS.orange}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Demand"
                />
                <Line
                  type="monotone"
                  dataKey="Gap"
                  stroke={COLORS.red}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  strokeDasharray="4 4"
                  name="Gap"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demand Status + Vendor + Skills Gap */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.7fr 1.1fr 1fr",
            gap: 12,
          }}
        >
          <div style={cardStyle}>
            <CardHeader>3. Demand by Status (FTE)</CardHeader>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  flexShrink: 0,
                }}
              >
                <PieChart width={120} height={120}>
                  <Pie
                    data={demandStatusData}
                    cx={59}
                    cy={59}
                    innerRadius={36}
                    outerRadius={56}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {demandStatusData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: CV.textPrimary,
                    }}
                  >
                    3,245
                  </div>
                  <div style={{ fontSize: 8, color: CV.textSecondary }}>
                    Total
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {demandStatusData.map((d, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: d.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 10, color: CV.textPrimary }}>
                      {d.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: d.color,
                        marginLeft: "auto",
                        paddingLeft: 8,
                      }}
                    >
                      {d.value.toLocaleString()} ({d.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <CardHeader>4. Vendor Overview</CardHeader>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "Vendor",
                    "Utilization %",
                    "FTE",
                    "Spend (USD)",
                    "Open Demands",
                  ].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vendorData.map((v, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `0.5px solid ${CV.borderTertiary}` }}
                  >
                    <td
                      style={{
                        padding: "6px 6px",
                        fontSize: 11,
                        color: CV.textPrimary,
                        fontWeight: 500,
                      }}
                    >
                      {v.name}
                    </td>
                    <td style={{ padding: "6px 6px", minWidth: 90 }}>
                      <UtilBar value={v.util} />
                    </td>
                    <td
                      style={{
                        padding: "6px 6px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: CV.textPrimary,
                      }}
                    >
                      {v.fte}
                    </td>
                    <td
                      style={{
                        padding: "6px 6px",
                        fontSize: 11,
                        color: COLORS.teal,
                        fontWeight: 600,
                      }}
                    >
                      {v.spend}
                    </td>
                    <td
                      style={{
                        padding: "6px 6px",
                        fontSize: 11,
                        color: COLORS.orange,
                        fontWeight: 600,
                      }}
                    >
                      {v.demands}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ViewAllLink label="View All Vendors →" />
          </div>

          <div style={cardStyle}>
            <CardHeader>5. Top 5 Skills by Demand Gap (FTE)</CardHeader>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "Skill Set",
                    "Demand (FTE)",
                    "Available (FTE)",
                    "Gap (FTE)",
                  ].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {skillsGapData.map((s, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `0.5px solid ${CV.borderTertiary}` }}
                  >
                    <td
                      style={{
                        padding: "6px 6px",
                        fontSize: 11,
                        color: CV.textPrimary,
                        fontWeight: 500,
                      }}
                    >
                      {s.skill}
                    </td>
                    <td
                      style={{
                        padding: "6px 6px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: CV.textPrimary,
                      }}
                    >
                      {s.demand}
                    </td>
                    <td
                      style={{
                        padding: "6px 6px",
                        fontSize: 11,
                        color: COLORS.green,
                        fontWeight: 600,
                      }}
                    >
                      {s.available}
                    </td>
                    <td style={{ padding: "6px 6px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 6,
                            background: CV.bgDanger,
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(Math.abs(s.gap) / 2, 100)}%`,
                              height: "100%",
                              background: COLORS.red,
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: CV.textDanger,
                          }}
                        >
                          {s.gap}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ViewAllLink label="View All Skills →" />
          </div>
        </div>

        {/* Cross-Pillar + Staffing Risk + Strategic Alerts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.9fr 1.1fr 0.9fr",
            gap: 12,
          }}
        >
          <div style={cardStyle}>
            <CardHeader>6. Cross-Pillar Resource Flow</CardHeader>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "Borrowing Pillar",
                    "Borrowing From",
                    "FTE",
                    "Top Skills",
                  ].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {crossPillarData.map((r, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `0.5px solid ${CV.borderTertiary}` }}
                  >
                    <td
                      style={{
                        padding: "7px 6px",
                        fontSize: 11,
                        color: CV.textPrimary,
                        fontWeight: 600,
                      }}
                    >
                      {r.borrowing}
                    </td>
                    <td
                      style={{
                        padding: "7px 6px",
                        fontSize: 11,
                        color: CV.textSecondary,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 6,
                            background: COLORS.teal,
                            borderRadius: 3,
                          }}
                        />
                        {r.from}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "7px 6px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: COLORS.blue,
                      }}
                    >
                      {r.fte}
                    </td>
                    <td
                      style={{
                        padding: "7px 6px",
                        fontSize: 9.5,
                        color: CV.textSecondary,
                      }}
                    >
                      {r.skills}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={cardStyle}>
            <CardHeader>7. Projects at Staffing Risk</CardHeader>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Project", "Pillar", "Risk Level", "Gap (FTE)"].map((h) => (
                    <th key={h} style={thStyle}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffingRiskProjects.map((r, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `0.5px solid ${CV.borderTertiary}` }}
                  >
                    <td
                      style={{
                        padding: "7px 6px",
                        fontSize: 11,
                        color: CV.textPrimary,
                        fontWeight: 600,
                      }}
                    >
                      {r.project}
                    </td>
                    <td
                      style={{
                        padding: "7px 6px",
                        fontSize: 10,
                        color: CV.textSecondary,
                      }}
                    >
                      {r.pillar}
                    </td>
                    <td style={{ padding: "7px 6px" }}>
                      <RiskBadge level={r.risk} />
                    </td>
                    <td
                      style={{
                        padding: "7px 6px",
                        fontSize: 12,
                        fontWeight: 700,
                        color: CV.textDanger,
                      }}
                    >
                      {r.gap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ViewAllLink label="View All Projects →" />
          </div>

          <div style={cardStyle}>
            <CardHeader>8. Strategic Alerts</CardHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {strategicAlerts.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "8px 10px",
                    background: CV.bgSecondary,
                    border: `0.5px solid ${CV.borderSecondary}`,
                    borderRadius: CV.radiusMd,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                      {a.icon}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: CV.textPrimary,
                        lineHeight: 1.4,
                      }}
                    >
                      {a.text}
                    </span>
                  </div>
                  <RiskBadge level={a.level} />
                </div>
              ))}
            </div>
            <ViewAllLink label="View All Alerts →" />
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            color: CV.textTertiary,
            paddingTop: 8,
            borderTop: `0.5px solid ${CV.borderTertiary}`,
          }}
        >
          ℹ️ All metrics are based on data as of 15/05/26 10:30 AM &nbsp;|&nbsp;
          Data refreshed daily
        </div>
      </div>
    </div>
  );
}

// ─── Generic detail views (2–11, 13–15) ──────────────────────────────────────

function DetailCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={{ ...cardStyle, ...style }}>{children}</div>;
}

function ReportDetail2() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const byRole = [
    {
      role: "Developers",
      allocated: 3240,
      capacity: 3825,
      util: "85%",
      gap: -585,
    },
    {
      role: "Consultants",
      allocated: 1910,
      capacity: 2310,
      util: "83%",
      gap: -400,
    },
    {
      role: "Analysts",
      allocated: 1105,
      capacity: 1320,
      util: "84%",
      gap: -215,
    },
    { role: "Testers", allocated: 605, capacity: 720, util: "84%", gap: -115 },
    {
      role: "Architects",
      allocated: 255,
      capacity: 300,
      util: "85%",
      gap: -45,
    },
  ];
  const buUtil = [
    { name: "Engineering", util: 85, color: COLORS.blue },
    { name: "Consulting", util: 81, color: COLORS.teal },
    { name: "Data & Analytics", util: 84, color: COLORS.purple },
    { name: "Products", util: 79, color: COLORS.orange },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <GenericFilterBar filters={filters} setFilters={setFilters} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 10,
        }}
      >
        <StatTile label="Total Capacity" value="7,427" color={COLORS.blue} />
        <StatTile label="Total Demand" value="8,016" color={COLORS.orange} />
        <StatTile label="Allocated (FTE)" value="7,115" color={COLORS.teal} />
        <StatTile label="Utilization" value="83%" color={COLORS.purple} />
        <StatTile label="Capacity Gap" value="-589" color={COLORS.red} />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}
      >
        <DetailCard>
          <SectionLabel>Capacity vs Demand Trend</SectionLabel>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={capDemand2026}
              margin={{ top: 5, right: 5, bottom: 5, left: -15 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke={CV.borderTertiary} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: CV.textSecondary as string }}
              />
              <YAxis tick={{ fontSize: 9, fill: CV.textSecondary as string }} />
              <Tooltip
                contentStyle={{
                  fontSize: 10,
                  background: CV.bgPrimary,
                  border: `0.5px solid ${CV.borderSecondary}`,
                  color: CV.textPrimary,
                }}
              />
              <Bar
                dataKey="Capacity"
                fill={COLORS.blue}
                radius={[2, 2, 0, 0]}
              />
              <Bar dataKey="Demand" fill={COLORS.teal} radius={[2, 2, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Utilization by Business Unit</SectionLabel>
          {buUtil.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 11, color: CV.textPrimary }}>
                  {r.name}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>
                  {r.util}%
                </span>
              </div>
              <DetailMiniBar value={r.util} color={r.color} />
            </div>
          ))}
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Allocation by Role</SectionLabel>
        <DetailTable
          headers={[
            "Role",
            "Allocated (FTE)",
            "Capacity (FTE)",
            "Utilization",
            "Gap",
          ]}
          rows={byRole.map((r) => [
            <span style={{ color: CV.textPrimary, fontWeight: 600 }}>
              {r.role}
            </span>,
            r.allocated.toLocaleString(),
            r.capacity.toLocaleString(),
            <span style={{ color: COLORS.green, fontWeight: 700 }}>
              {r.util}
            </span>,
            <span style={{ color: CV.textDanger, fontWeight: 700 }}>
              {r.gap}
            </span>,
          ])}
        />
      </DetailCard>
    </div>
  );
}

function ReportDetail3() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const approvalTrend = [
    { month: "01/01/26", Approved: 720, Pending: 310 },
    { month: "01/02/26", Approved: 780, Pending: 340 },
    { month: "01/03/26", Approved: 810, Pending: 360 },
    { month: "11/04/26", Approved: 850, Pending: 380 },
    { month: "11/05/26", Approved: 864, Pending: 381 },
  ];
  const byType = [
    { name: "Demand Inputs", value: 488 },
    { name: "Capacity Inputs", value: 324 },
    { name: "Allocation Inputs", value: 221 },
    { name: "Financial Inputs", value: 126 },
    { name: "Timesheet Inputs", value: 86 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <GenericFilterBar filters={filters} setFilters={setFilters} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 10,
        }}
      >
        <StatTile
          label="Total Planning Inputs"
          value="1,245"
          color={COLORS.blue}
        />
        <StatTile label="Approved" value="864" color={COLORS.green} />
        <StatTile label="Pending" value="381" color={COLORS.orange} />
        <StatTile label="Approval Rate" value="69.4%" color={COLORS.teal} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Approval Trend (Last 5 Months)</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={approvalTrend}
              margin={{ top: 5, right: 5, bottom: 5, left: -15 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke={CV.borderTertiary} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: CV.textSecondary as string }}
              />
              <YAxis tick={{ fontSize: 9, fill: CV.textSecondary as string }} />
              <Tooltip
                contentStyle={{
                  fontSize: 10,
                  background: CV.bgPrimary,
                  border: `0.5px solid ${CV.borderSecondary}`,
                  color: CV.textPrimary,
                }}
              />
              <Area
                type="monotone"
                dataKey="Approved"
                stroke={COLORS.green}
                fill={`${COLORS.green}33`}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="Pending"
                stroke={COLORS.orange}
                fill={`${COLORS.orange}33`}
                strokeWidth={2}
              />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </AreaChart>
          </ResponsiveContainer>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Planning Inputs by Type</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={byType}
              layout="vertical"
              margin={{ top: 5, right: 20, bottom: 5, left: 90 }}
            >
              <CartesianGrid
                strokeDasharray="2 2"
                stroke={CV.borderTertiary}
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 9, fill: CV.textSecondary as string }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 9, fill: CV.textSecondary as string }}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 10,
                  background: CV.bgPrimary,
                  border: `0.5px solid ${CV.borderSecondary}`,
                  color: CV.textPrimary,
                }}
              />
              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                {byType.map((_, i) => (
                  <Cell key={i} fill={DONUT_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
      </div>
    </div>
  );
}

// Reports 4–15 use the same pattern — generic placeholder returning key stats + charts
function GenericDetailView({ num, title }: { num: number; title: string }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <GenericFilterBar filters={filters} setFilters={setFilters} />
      <div
        style={{ ...cardStyle, padding: "32px", textAlign: "center" as const }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>
          {reportCards.find((c) => c.num === num)?.icon}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: CV.textPrimary,
            marginBottom: 8,
          }}
        >
          {num}. {title}
        </div>
        <div style={{ fontSize: 13, color: CV.textSecondary }}>
          {reportCards.find((c) => c.num === num)?.desc}
        </div>
      </div>
    </div>
  );
}

const DETAIL_VIEWS: Record<number, React.ComponentType> = {
  1: ReportDetail1,
  2: ReportDetail2,
  3: ReportDetail3,
  12: ReportDetail12,
};

// ─── Back Button ──────────────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      style={{
        background: CV.bgPrimary,
        borderBottom: `1px solid ${CV.borderTertiary}`,
        padding: "10px 20px",
      }}
    >
      <button
        onClick={onClick}
        style={{
          background: CV.bgPrimary,
          border: `0.5px solid ${CV.borderSecondary}`,
          borderRadius: CV.radiusMd,
          padding: "6px 14px",
          fontSize: 13,
          cursor: "pointer",
          color: CV.textPrimary,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportingAnalytics() {
  const [activeReport, setActiveReport] = useState<any | null>(null);

  if (activeReport) {
    const DetailView = DETAIL_VIEWS[activeReport.num];

    // Full-page detail views (1 and 12 have their own header/filter bar)
    if (activeReport.num === 1 || activeReport.num === 12) {
      return (
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            background: CV.bgTertiary,
            minHeight: "100vh",
          }}
        >
          <BackButton onClick={() => setActiveReport(null)} />
          {DetailView ? <DetailView /> : null}
        </div>
      );
    }

    // Standard detail views
    return (
      <div
        style={{
          padding: "20px",
          fontFamily: "system-ui, sans-serif",
          background: CV.bgTertiary,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setActiveReport(null)}
            style={{
              background: CV.bgPrimary,
              border: `0.5px solid ${CV.borderSecondary}`,
              borderRadius: CV.radiusMd,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
              color: CV.textPrimary,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back
          </button>
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: CV.textPrimary,
            }}
          >
            {activeReport.num}. {activeReport.title}
          </h2>
          <span
            style={{
              fontSize: 11,
              borderRadius: CV.radiusMd,
              padding: "3px 10px",
              background: CV.bgInfo,
              color: CV.textInfo,
            }}
          >
            {activeReport.desc}
          </span>
        </div>
        {DetailView ? (
          <DetailView />
        ) : (
          <GenericDetailView
            num={activeReport.num}
            title={activeReport.title}
          />
        )}
      </div>
    );
  }

  // ─── Main grid ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background:
          "color-mix(in srgb, var(--color-background-tertiary) 100%, #000 8%)",
        minHeight: "100vh",
        padding: "16px 20px",
      }}
    >
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: CV.textPrimary,
              margin: 0,
            }}
          >
            Resource Management Reports
          </h1>
          <p
            style={{ fontSize: 12, color: CV.textSecondary, margin: "4px 0 0" }}
          >
            {reportCards.length} reports available &nbsp;|&nbsp; Last updated:
            15/05/26 10:30 AM
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Filters", "Refresh", "Export"].map((l) => (
            <button
              key={l}
              style={{
                background: CV.bgPrimary,
                border: `0.5px solid ${CV.borderSecondary}`,
                borderRadius: CV.radiusMd,
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
                color: CV.textPrimary,
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Report cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {reportCards.map((card) => (
          <ReportCard key={card.num} card={card} onView={setActiveReport} />
        ))}
      </div>
    </div>
  );
}
