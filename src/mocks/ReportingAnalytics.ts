// ─── Color Palette ────────────────────────────────────────────────────────────

export const COLORS = {
  blue: "#378ADD",
  green: "#639922",
  orange: "#BA7517",
  red: "#E24B4A",
  purple: "#7F77DD",
  teal: "#1D9E75",
  gray: "#888780",
  amber: "#EF9F27",
} as const;

export const DONUT_COLORS = [
  COLORS.blue,
  COLORS.teal,
  COLORS.orange,
  COLORS.purple,
  COLORS.green,
  COLORS.gray,
];

// ─── KPI Cards ────────────────────────────────────────────────────────────────

export const kpis = [
  {
    label: "Total Resources (Full Time)",
    value: "92",
    delta: "+2.3%",
    deltaUp: true,
    icon: "👥",
    color: COLORS.blue,
  },
  {
    label: "Total Capacity (FTE)",
    value: "88",
    delta: "+1.8%",
    deltaUp: true,
    icon: "🏗️",
    color: COLORS.teal,
  },
  {
    label: "Total Demand (FTE)",
    value: "94",
    delta: "+3.6%",
    deltaUp: true,
    icon: "📋",
    color: COLORS.orange,
  },
  {
    label: "Capacity Gap (FTE)",
    value: "-6",
    delta: "-4.7%",
    deltaUp: false,
    icon: "📉",
    color: COLORS.red,
  },
  {
    label: "Utilization",
    value: "83%",
    delta: "+2pp",
    deltaUp: true,
    icon: "📈",
    color: COLORS.purple,
  },
  {
    label: "Over Allocated (FTE)",
    value: "12",
    delta: "-3.2%",
    deltaUp: true,
    icon: "⚠️",
    color: COLORS.amber,
  },
  {
    label: "Open Demands",
    value: "41",
    delta: "-5.1%",
    deltaUp: true,
    icon: "📂",
    color: COLORS.blue,
  },
  {
    label: "Projects On Track",
    value: "78%",
    delta: "+3pp",
    deltaUp: true,
    icon: "✅",
    color: COLORS.green,
  },
];

// ─── Dashboard Trend Data ─────────────────────────────────────────────────────

export const capacityDemandTrend = [
  { month: "Jan 2026", Capacity: 71, Demand: 73, Gap: -2 },
  { month: "Feb 2026", Capacity: 72, Demand: 75, Gap: -3 },
  { month: "Mar 2026", Capacity: 73, Demand: 77, Gap: -4 },
  { month: "Apr 2026", Capacity: 77, Demand: 78, Gap: -1 },
  { month: "May 2026", Capacity: 74, Demand: 80, Gap: -6 },
];

export const utilizationTrend = [
  { month: "Jan 2026", rate: 76 },
  { month: "Feb 2026", rate: 78 },
  { month: "Mar 2026", rate: 80 },
  { month: "Apr 2026", rate: 81 },
  { month: "May 2026", rate: 83 },
];

export const workforceRisks = [
  { name: "High Risk", value: 7, color: COLORS.red },
  { name: "Medium Risk", value: 8, color: COLORS.orange },
  { name: "Low Risk", value: 6, color: COLORS.amber },
  { name: "Informational", value: 3, color: COLORS.blue },
];

export const portfolioReadiness = [
  {
    portfolio: "Digital Transformation",
    onTrack: 14,
    atRisk: 6,
    offTrack: 3,
    readiness: "72%",
  },
  {
    portfolio: "Product Engineering",
    onTrack: 12,
    atRisk: 4,
    offTrack: 2,
    readiness: "80%",
  },
  {
    portfolio: "Cloud Services",
    onTrack: 8,
    atRisk: 3,
    offTrack: 2,
    readiness: "77%",
  },
  {
    portfolio: "Data & Analytics",
    onTrack: 6,
    atRisk: 3,
    offTrack: 1,
    readiness: "67%",
  },
  {
    portfolio: "Business Applications",
    onTrack: 5,
    atRisk: 2,
    offTrack: 1,
    readiness: "75%",
  },
];

// ─── Report Cards ─────────────────────────────────────────────────────────────

export const reportCards = [
  {
    num: 1,
    title: "Executive Leadership Report",
    desc: "Enterprise view of performance, risks, gaps & portfolio readiness",
    execStats: [
      { label: "Capacity Gap", value: "-6 FTE", color: COLORS.red },
      { label: "Workforce Risk", value: "High", color: COLORS.red },
      { label: "Portfolio Readiness", value: "78%", color: COLORS.green },
    ],
    icon: "🎯",
    color: COLORS.purple,
  },
  {
    num: 2,
    title: "Resource Management Dashboard",
    desc: "Overview of capacity, demand, allocation & utilization",
    barData: [
      { name: "Engineering", value: 85, cap: 74 },
      { name: "Consulting", value: 81, cap: 62 },
      { name: "Data & Analytics", value: 84, cap: 48 },
      { name: "Products", value: 79, cap: 32 },
    ],
    summaryStats: [
      { label: "Capacity", value: "74" },
      { label: "Demand", value: "80" },
      { label: "Utilization", value: "83%" },
    ],
    icon: "🏢",
    color: COLORS.teal,
  },
  {
    num: 3,
    title: "Resource Planning Dashboard",
    desc: "Real-time view of planning inputs, owners & visibility across organization",
    stats: [
      { label: "Planning Inputs", value: "86" },
      { label: "Approved", value: "64", color: COLORS.green },
      { label: "Pending", value: "22", color: COLORS.orange },
    ],
    extra: [
      { label: "Sarah Johnson", value: "35" },
      { label: "Michael Lee", value: "28" },
      { label: "Emily Davis", value: "23" },
    ],
    icon: "📊",
    color: COLORS.blue,
  },
  {
    num: 4,
    title: "Resource Allocation Report",
    desc: "Report for showing resource allocation across projects",
    donut: [
      { name: "Cloud Migration", value: 18 },
      { name: "Data Warehouse", value: 14 },
      { name: "Mobile App Revamp", value: 12 },
      { name: "ERP Implementation", value: 10 },
      { name: "AI Platform", value: 8 },
      { name: "Others", value: 38 },
    ],
    centerLabel: "71 FTE",
    centerSub: "Total Allocated",
    icon: "🥧",
    color: COLORS.purple,
  },
  {
    num: 5,
    title: "Resource Over-Allocation Report",
    desc: "Report for showing resources over-allocation",
    overList: [
      { name: "John Smith", pct: 98, color: COLORS.red },
      { name: "Priya Patel", pct: 95, color: COLORS.red },
      { name: "Ravi Kumar", pct: 92, color: COLORS.orange },
      { name: "Anita Desai", pct: 89, color: COLORS.orange },
      { name: "Carlos M.", pct: 85, color: COLORS.amber },
    ],
    highlight: "31 FTE",
    icon: "🚨",
    color: COLORS.red,
  },
  {
    num: 6,
    title: "Resource Availability & Shared Resources",
    desc: "Report for showing resources shared across projects with availability",
    availability: {
      available: "18 FTE",
      shared: "23 FTE",
      bench: "18 (24.8%)",
    },
    icon: "🔗",
    color: COLORS.teal,
  },
  {
    num: 7,
    title: "Monthly Compliance Report",
    desc: "Report for showing monthly compliance details",
    compliance: 92,
    items: [
      { label: "Timesheet Submission", value: 96 },
      { label: "Allocation Adherence", value: 91 },
      { label: "Manager Approval", value: 93 },
      { label: "Data Quality", value: 88 },
    ],
    icon: "✅",
    color: COLORS.green,
  },
  {
    num: 8,
    title: "Budget Variance Report",
    desc: "Report for showing budget variance",
    budget: {
      total: "$24.80M",
      actual: "$20.36M",
      variance: "-$4.44M",
      varPct: "-17.9%",
    },
    budgetRows: [
      { name: "Digital Transformation", variance: -1.2 },
      { name: "Product Engineering", variance: -1.12 },
      { name: "Cloud Services", variance: -0.95 },
      { name: "Data & Analytics", variance: -0.73 },
      { name: "Business Applications", variance: -0.42 },
    ],
    icon: "💲",
    color: COLORS.orange,
  },
  {
    num: 9,
    title: "Vendor Ranking Report",
    desc: "Report for showing vendor ranking report based on budget spent",
    vendors: [
      { name: "Tech Mahindra", spend: "$3.21M", rank: 1, score: 92 },
      { name: "Tata Consultancy Svcs", spend: "$2.98M", rank: 2, score: 88 },
      { name: "Infosys", spend: "$2.25M", rank: 3, score: 85 },
      { name: "Wipro", spend: "$1.89M", rank: 4, score: 80 },
      { name: "HCL Technologies", spend: "$1.46M", rank: 5, score: 78 },
    ],
    icon: "🏆",
    color: COLORS.amber,
  },
  {
    num: 10,
    title: "Demand Management Dashboard",
    desc: "Track workforce demand, fulfillment progress & staffing gaps",
    demandStats: [
      { label: "Open Demands", value: "41", color: COLORS.red },
      { label: "In Progress", value: "18", color: COLORS.orange },
      { label: "Fulfilled", value: "23", color: COLORS.green },
    ],
    demandByPriority: [
      { label: "High", value: 16, pct: "38%" },
      { label: "Medium", value: 16, pct: "40%" },
      { label: "Low", value: 9, pct: "22%" },
    ],
    icon: "📋",
    color: COLORS.blue,
  },
  {
    num: 11,
    title: "Forecasting & Capacity Planning",
    desc: "Forecast demand vs capacity & identify future gaps",
    forecastData: [
      { month: "Jan 2026", cap: 8.0, demand: 8.9, gap: -0.9 },
      { month: "Feb 2026", cap: 8.3, demand: 9.1, gap: -0.8 },
      { month: "Mar 2026", cap: 8.5, demand: 9.3, gap: -0.8 },
      { month: "Apr 2026", cap: 6.9, demand: 8.7, gap: -1.8 },
      { month: "May 2026", cap: 6.9, demand: 8.8, gap: -0.9 },
      { month: "Jun 2026", cap: 7.5, demand: 8.4, gap: -0.9 },
    ],
    icon: "🔮",
    color: COLORS.purple,
  },
  {
    num: 12,
    title: "Utilization Dashboard",
    desc: "Measure resource utilization across teams, roles & work types",
    utilOverall: 83,
    utilByType: [
      { label: "Project Work", value: 86 },
      { label: "BAU Work", value: 78 },
      { label: "Internal Initiatives", value: 74 },
      { label: "Training", value: 65 },
    ],
    icon: "📈",
    color: COLORS.teal,
  },
  {
    num: 13,
    title: "Timesheet & Actuals Dashboard",
    desc: "Compare planned allocations vs actual efforts",
    tsCompliance: 96,
    tsBreakdown: [
      { label: "On track", pct: 66, color: COLORS.green },
      { label: "Over", pct: 20, color: COLORS.red },
      { label: "Under", pct: 10, color: COLORS.orange },
    ],
    actualFTE: "85",
    icon: "⏱️",
    color: COLORS.blue,
  },
  {
    num: 14,
    title: "Governance & Approval Dashboard",
    desc: "Monitor approvals, exceptions & workflow status",
    pending: 27,
    overdue: 12,
    byType: [
      { label: "Resource Requests", value: 12 },
      { label: "Project Requests", value: 7 },
      { label: "Allocation Changes", value: 5 },
      { label: "Time Off Requests", value: 3 },
    ],
    icon: "🔐",
    color: COLORS.amber,
  },
  {
    num: 15,
    title: "Reports Hub",
    desc: "Access all reports in one place",
    hub: true,
    icon: "🗂️",
    color: COLORS.gray,
  },
];

// ─── Risk Top Items ───────────────────────────────────────────────────────────

export const riskTopItems = [
  {
    icon: "⚠️",
    text: "Critical skill shortage in Data Engineering",
    count: 5,
    color: COLORS.red,
  },
  {
    icon: "⚠️",
    text: "Over allocation in Multiple Projects",
    count: 4,
    color: COLORS.red,
  },
  {
    icon: "🟠",
    text: "Open high priority demands",
    count: 6,
    color: COLORS.orange,
  },
  {
    icon: "🔵",
    text: "Key resource attrition risk",
    count: 3,
    color: COLORS.blue,
  },
  {
    icon: "📋",
    text: "Timesheets pending submission",
    count: 6,
    color: COLORS.blue,
  },
];

// ─── Utilization Dashboard (Report #12) ──────────────────────────────────────

export const utilTrendData = [
  { month: "Jan 2026", overall: 73, billable: 58 },
  { month: "Feb 2026", overall: 74, billable: 59 },
  { month: "Mar 2026", overall: 76, billable: 60 },
  { month: "Apr 2026", overall: 77, billable: 61 },
  { month: "Apr 2026 (2)", overall: 76, billable: 59 },
  { month: "May 2026", overall: 78, billable: 62 },
];

export const utilByDeptData = [
  { dept: "Delivery", overall: 67, billable: 88, capacity: 92 },
  { dept: "Technology", overall: 65, billable: 83, capacity: 88 },
  { dept: "Business Support", overall: 50, billable: 78, capacity: 82 },
  { dept: "Operations", overall: 49, billable: 77, capacity: 79 },
  { dept: "Finance", overall: 42, billable: 73, capacity: 75 },
  { dept: "HR", overall: 39, billable: 70, capacity: 71 },
];

export const utilByWorkType = [
  { name: "Project Delivery", value: 48, hours: 56500, color: COLORS.blue },
  { name: "Support / BAU", value: 24, hours: 28400, color: COLORS.green },
  { name: "Internal / Admin", value: 14, hours: 17000, color: COLORS.orange },
  { name: "Training", value: 8, hours: 9100, color: COLORS.purple },
  { name: "Other", value: 6, hours: 7000, color: COLORS.gray },
];

export const billableNonBillableData = [
  { dept: "Delivery", billable: 67, nonBillable: 13, total: 80 },
  { dept: "Technology", billable: 65, nonBillable: 16, total: 81 },
  { dept: "Business Support", billable: 50, nonBillable: 20, total: 70 },
  { dept: "Operations", billable: 48, nonBillable: 18, total: 66 },
  { dept: "Finance", billable: 42, nonBillable: 17, total: 59 },
  { dept: "HR", billable: 39, nonBillable: 16, total: 55 },
];

export const underutilizedResources = [
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

export const overutilizedResources = [
  { name: "Amit Kumar", dept: "Delivery", util: 98, overtime: 42 },
  { name: "Sneha Joshi", dept: "Delivery", util: 95, overtime: 36 },
  { name: "Deepak Yadav", dept: "Technology", util: 93, overtime: 32 },
  { name: "Pooja Mehta", dept: "Technology", util: 91, overtime: 28 },
  { name: "Varun Joshi", dept: "Operations", util: 90, overtime: 26 },
  { name: "Rakesh Patel", dept: "Delivery", util: 89, overtime: 24 },
  { name: "Meera Nair", dept: "Business Support", util: 87, overtime: 20 },
  { name: "Karan Malhotra", dept: "Delivery", util: 86, overtime: 18 },
  { name: "Isha Verma", dept: "Technology", util: 84, overtime: 16 },
  { name: "Sunil Rao", dept: "Operations", util: 83, overtime: 16 },
];

export const heatmapManagers = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
];

export const heatmapDepts = [
  { dept: "Delivery", vals: [92, 95, 88, 96], avg: 83 },
  { dept: "Technology", vals: [88, 99, 80, 92], avg: 80 },
  { dept: "Business Support", vals: [65, 82, 70, 91], avg: 77 },
  { dept: "Operations", vals: [66, 78, 72, 83], avg: 75 },
  { dept: "Finance", vals: [58, 69, 76, 82], avg: 72 },
  { dept: "HR", vals: [55, 64, 68, 72], avg: 70 },
];

// ─── Executive Report (Report #1) ─────────────────────────────────────────────

export const execKpis = [
  {
    label: "Total Capacity",
    value: "88 FTE",
    delta: "+6.2% vs Apr 2026",
    up: true,
    color: COLORS.blue,
    icon: "👥",
  },
  {
    label: "Total Demand",
    value: "94 FTE",
    delta: "+3.4% vs Apr 2026",
    up: true,
    color: COLORS.orange,
    icon: "📋",
  },
  {
    label: "Capacity Gap",
    value: "-6 FTE",
    delta: "▼ 2.8% vs Apr 2026",
    up: false,
    color: COLORS.red,
    icon: "📉",
  },
  {
    label: "Utilization Rate",
    value: "82%",
    delta: "▲ 2.3 pp vs Apr 2026",
    up: true,
    color: COLORS.purple,
    icon: "📈",
  },
  {
    label: "Open Demands",
    value: "41",
    delta: "▼ 5.1% vs Apr 2026",
    up: false,
    color: COLORS.blue,
    icon: "📂",
  },
  {
    label: "Overallocated Resources",
    value: "17",
    delta: "▼ 3.6% vs Apr 2026",
    up: true,
    color: COLORS.amber,
    icon: "⚠️",
  },
  {
    label: "Vendor Spend",
    value: "$8.6M",
    delta: "▲ 7.3% vs Apr 2026",
    up: true,
    color: COLORS.teal,
    icon: "💲",
  },
  {
    label: "Projects at Staffing Risk",
    value: "9",
    delta: "▼ 4 vs Apr 2026",
    up: true,
    color: COLORS.red,
    icon: "🚨",
  },
];

export const heatmapData = [
  {
    pillar: "Banking",
    icon: "🏦",
    rows: [
      { team: "Application Development", vals: [82, 84, 88, 91, 96, 99] },
      { team: "Data Engineering", vals: [78, 83, 95, 98, 99, 99] },
      { team: "QA Automation", vals: [76, 80, 92, 98, 99, 99] },
      { team: "Cloud Engineering", vals: [85, 86, 90, 93, 97, 99] },
    ],
  },
  {
    pillar: "Retail",
    icon: "🛒",
    rows: [
      { team: "Application Development", vals: [81, 82, 85, 88, 93, 98] },
      { team: "Data Engineering", vals: [77, 79, 83, 86, 90, 94] },
      { team: "QA Automation", vals: [80, 83, 88, 92, 95, 99] },
      { team: "Cloud Engineering", vals: [75, 78, 82, 86, 88, 93] },
    ],
  },
  {
    pillar: "Healthcare",
    icon: "🏥",
    rows: [
      { team: "Application Development", vals: [83, 85, 90, 94, 96, 99] },
      { team: "Data Engineering", vals: [78, 81, 86, 91, 97, 99] },
    ],
  },
  {
    pillar: "Hi-tech",
    icon: "💻",
    rows: [
      { team: "Application Development", vals: [82, 84, 88, 91, 94, 97] },
      { team: "Data Engineering", vals: [79, 82, 86, 90, 93, 96] },
    ],
  },
  {
    pillar: "Life Sciences",
    icon: "🔬",
    rows: [
      { team: "Application Development", vals: [77, 80, 83, 87, 92, 95] },
      { team: "Data Engineering", vals: [74, 77, 81, 84, 88, 90] },
    ],
  },
];

export const heatmapMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
];

export const execCapDemandData = [
  { month: "Aug 2025", Capacity: 26, Demand: 29, Gap: -3 },
  { month: "Sep 2025", Capacity: 27, Demand: 29, Gap: -2 },
  { month: "Oct 2025", Capacity: 27, Demand: 30, Gap: -3 },
  { month: "Nov 2025", Capacity: 28, Demand: 30, Gap: -2 },
  { month: "Dec 2025", Capacity: 28, Demand: 31, Gap: -3 },
  { month: "Jan 2026", Capacity: 29, Demand: 31, Gap: -2 },
  { month: "Feb 2026", Capacity: 29, Demand: 31, Gap: -2 },
  { month: "Mar 2026", Capacity: 29, Demand: 32, Gap: -3 },
  { month: "Apr 2026", Capacity: 30, Demand: 32, Gap: -2 },
  { month: "May 2026", Capacity: 30, Demand: 32, Gap: -2 },
  { month: "Jun 2026 (F)", Capacity: 30, Demand: 33, Gap: -3 },
  { month: "Jul 2026 (F)", Capacity: 30, Demand: 34, Gap: -4 },
];

export const demandStatusData = [
  { name: "Approved", value: 47, pct: 48, color: COLORS.green },
  { name: "Pending Approval", value: 27, pct: 27, color: COLORS.orange },
  { name: "Draft", value: 15, pct: 15, color: COLORS.blue },
  { name: "Rejected", value: 10, pct: 10, color: COLORS.red },
];

export const vendorData = [
  {
    name: "Ascendion Global",
    util: 86,
    fte: 68,
    spend: "$5.24M",
    demands: 92,
  },
  { name: "Collabera", util: 79, fte: 54, spend: "$3.86M", demands: 76 },
  { name: "UX Reactor", util: 83, fte: 42, spend: "$2.91M", demands: 58 },
  { name: "Hycoo", util: 75, fte: 31, spend: "$1.72M", demands: 36 },
  { name: "Moodys NWC", util: 71, fte: 26, spend: "$0.89M", demands: 28 },
];

export const skillsGapData = [
  { skill: "QA Automation", demand: 32, available: 20, gap: -12 },
  { skill: "Data Engineering", demand: 51, available: 35, gap: -16 },
  { skill: "Cloud Engineering", demand: 42, available: 29, gap: -13 },
  { skill: "React", demand: 28, available: 20, gap: -8 },
  { skill: "Project Management", demand: 17, available: 12, gap: -5 },
];

export const crossPillarData = [
  {
    borrowing: "Retail",
    from: "Banking",
    fte: 13,
    skills: "QA Automation, BA",
  },
  {
    borrowing: "Healthcare",
    from: "Hi-tech",
    fte: 10,
    skills: "Cloud Engineering",
  },
  {
    borrowing: "Life Sciences",
    from: "Banking",
    fte: 8,
    skills: "Data Engineering",
  },
  { borrowing: "Retail", from: "Hi-tech", fte: 6, skills: "DevOps, Cloud" },
];

export const staffingRiskProjects = [
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

export const strategicAlerts = [
  {
    icon: "⚠️",
    text: "Projected capacity gap of 6 FTE in Jun 2026",
    level: "High",
    color: COLORS.red,
  },
  {
    icon: "ℹ️",
    text: "17 resources are over allocated (>100%)",
    level: "Medium",
    color: COLORS.orange,
  },
  {
    icon: "ℹ️",
    text: "9 projects at staffing risk",
    level: "Medium",
    color: COLORS.orange,
  },
  {
    icon: "ℹ️",
    text: "41 demands pending approval",
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

// ─── Report #2 ────────────────────────────────────────────────────────────────

export const capDemand2026 = [
  { month: "Jan 2026", Capacity: 71, Demand: 73, Gap: -2 },
  { month: "Feb 2026", Capacity: 72, Demand: 75, Gap: -3 },
  { month: "Mar 2026", Capacity: 73, Demand: 77, Gap: -4 },
  { month: "Apr 2026", Capacity: 77, Demand: 78, Gap: -1 },
  { month: "May 2026", Capacity: 74, Demand: 80, Gap: -6 },
];

export const utilTrend2026 = [
  { month: "Jan 2026", rate: 76 },
  { month: "Feb 2026", rate: 78 },
  { month: "Mar 2026", rate: 80 },
  { month: "Apr 2026", rate: 81 },
  { month: "May 2026", rate: 83 },
];

// ─── Filter Definitions ───────────────────────────────────────────────────────

export const UTIL_FILTER_DEFS = [
  {
    label: "Time Period",
    key: "timePeriod",
    options: [
      "May 2026",
      "Apr 2026",
      "Mar 2026",
      "Feb 2026",
      "Jan 2026",
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
      "Ascendion",
      "Tata Consultancy",
      "Infosys",
      "Wipro",
      "HCL Technologies",
    ],
  },
];

export const EXEC_FILTER_DEFS = [
  {
    label: "Time Period",
    key: "timePeriod",
    options: [
      "May 2026",
      "Apr 2026",
      "Mar 2026",
      "Feb 2026",
      "Jan 2026",
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
      "Application Development",
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
      "Core Banking Upgrade",
      "Cloud Migration",
      "Data Modernization",
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
    ],
  },
  {
    label: "Vendor",
    key: "vendor",
    options: [
      "All",
      "Ascendion Global",
      "Collabera",
      "UX Reactor",
      "Hycoo",
      "Moodys NWC",
    ],
  },
];

export const GENERIC_FILTER_DEFS = [
  {
    label: "Date Range",
    key: "date",
    options: [
      "May 2026",
      "Apr 2026",
      "Mar 2026",
      "Feb 2026",
      "Jan 2026",
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
    ],
  },
  {
    label: "Vendor",
    key: "vendor",
    options: [
      "All",
      "Ascendion",
      "Tata Consultancy",
      "Infosys",
      "Wipro",
      "HCL Technologies",
    ],
  },
];

// ─── Utilization KPI Tiles (Report #12) ──────────────────────────────────────

export const utilKpiTiles = [
  {
    label: "Overall Utilization %",
    value: "78%",
    delta: "▲ 2.6%",
    up: true,
    color: COLORS.blue,
    icon: "👥",
    bg: "#e8f0fb",
  },
  {
    label: "Billable Utilization %",
    value: "62%",
    delta: "▲ 3.1%",
    up: true,
    color: COLORS.green,
    icon: "✅",
    bg: "#eaf3e0",
  },
  {
    label: "Non-Billable Utilization %",
    value: "16%",
    delta: "▼ 0.5%",
    up: false,
    color: COLORS.purple,
    icon: "🖥️",
    bg: "#f0effe",
  },
  {
    label: "Operational Work %",
    value: "46%",
    delta: "▲ 1.8%",
    up: true,
    color: COLORS.orange,
    icon: "⏱️",
    bg: "#fef4e6",
  },
  {
    label: "Strategic Work %",
    value: "32%",
    delta: "▲ 2.3%",
    up: true,
    color: COLORS.teal,
    icon: "🎯",
    bg: "#e4f6f1",
  },
  {
    label: "Underutilized (<60%)",
    value: "16",
    delta: "▼ 2",
    up: true,
    color: "#6b7280",
    icon: "👤",
    bg: "#f3f4f6",
  },
  {
    label: "Overutilized (>100%)",
    value: "9",
    delta: "▲ 1",
    up: false,
    color: COLORS.red,
    icon: "🔥",
    bg: "#fde8e8",
  },
];

// ─── Default Filter States ────────────────────────────────────────────────────

export const DEFAULT_UTIL_FILTERS = {
  timePeriod: "May 2026",
  pillar: "All",
  team: "All",
  project: "All",
  skillSet: "All",
  vendor: "All",
};

export const DEFAULT_EXEC_FILTERS = {
  timePeriod: "May 2026",
  pillar: "All",
  team: "All",
  project: "All",
  skillSet: "All",
  vendor: "All",
};

export const DEFAULT_GENERIC_FILTERS = {
  date: "May 2026",
  pillar: "All",
  team: "All",
  project: "All",
  skillSet: "All",
  vendor: "All",
};

export const keyInsights = [
  {
    icon: "📈",
    color: COLORS.green,
    bg: "#eaf3e0",
    text: "Overall utilization increased by 2.6% compared to Apr 2026.",
  },
  {
    icon: "⚠️",
    color: COLORS.red,
    bg: "#fde8e8",
    text: "9 resources are overutilized (>100%). Immediate attention required.",
  },
  {
    icon: "👥",
    color: COLORS.orange,
    bg: "#fef4e6",
    text: "16 resources are underutilized (<60%). Consider reallocation.",
  },
  {
    icon: "🎯",
    color: COLORS.blue,
    bg: "#e8f0fb",
    text: "Strategic work accounts for 32% of total effort. Continue to focus on strategic initiatives.",
  },
];

export const utilization = [
  {
    label: "Underutilized (<70%)",
    bg: "#fff9e6",
    color: "#92400e",
  },
  {
    label: "Optimal (70%–100%)",
    bg: "#e8f5e9",
    color: "#2e7d32",
  },
  {
    label: "Near Capacity (100%–110%)",
    bg: "#fde8e8",
    color: COLORS.red,
  },
  {
    label: "Overloaded (>110%)",
    bg: "#fde8e8",
    color: "#7f1d1d",
  },
];

export const operational = [
  {
    label: "Operational Work (BAU + Support)",
    hours: "54.6K (46.3%)",
    color: COLORS.orange,
  },
  {
    label: "Strategic Work (Projects + Innovation)",
    hours: "37.7K (31.9%)",
    color: COLORS.blue,
  },
  {
    label: "Other / Admin / Training",
    hours: "25.7K (21.8%)",
    color: COLORS.purple,
  },
];

export const utilizationDistribution = [
  {
    label: "Underutilized (<60%)",
    count: 16,
    pct: "7.9%",
    color: COLORS.amber,
  },
  {
    label: "Optimal (60%–100%)",
    count: 67,
    pct: "87.4%",
    color: COLORS.green,
  },
  {
    label: "Overutilized (>100%)",
    count: 9,
    pct: "4.7%",
    color: COLORS.red,
  },
];

export const main = {
  date: "May 2026",
  portfolio: "All",
  bu: "All",
  region: "All",
};

export const reportDetails15 = [
  "Executive",
  "Operational",
  "Planning",
  "Finance",
  "Compliance",
  "Allocation",
  "Governance",
  "All",
];

export const header = [
  "Request ID",
  "Type",
  "Requestor",
  "Days Overdue",
  "Priority",
];

export const rows = [
  {
    id: "REQ-2026-0892",
    type: "Resource Request",
    req: "Sarah Johnson",
    days: 14,
    pri: "Critical",
    col: COLORS.red,
  },
  {
    id: "REQ-2026-0885",
    type: "Project Request",
    req: "Michael Lee",
    days: 11,
    pri: "High",
    col: COLORS.orange,
  },
  {
    id: "REQ-2026-0878",
    type: "Allocation Change",
    req: "Emily Davis",
    days: 9,
    pri: "High",
    col: COLORS.orange,
  },
  {
    id: "REQ-2026-0861",
    type: "Resource Request",
    req: "David Brown",
    days: 7,
    pri: "Medium",
    col: COLORS.amber,
  },
];

export const data = [
  { stage: "Submitted", count: 86 },
  { stage: "In Review", count: 27 },
  { stage: "Approved", count: 60 },
  { stage: "Rejected", count: 12 },
];

export const pendingApprovals = [
  { label: "Resource Requests", value: 12, color: COLORS.blue },
  { label: "Project Requests", value: 7, color: COLORS.teal },
  { label: "Allocation Changes", value: 5, color: COLORS.purple },
  { label: "Time Off Requests", value: 3, color: COLORS.orange },
];

export const compliance = [
  { dept: "Engineering", v: 94 },
  { dept: "Consulting", v: 97 },
  { dept: "IT Services", v: 96 },
  { dept: "Data & Analytics", v: 93 },
  { dept: "Business Operations", v: 98 },
];

export const tsData = [
  { month: "Jan 2026", planned: 26, actual: 25 },
  { month: "Feb 2026", planned: 27, actual: 25 },
  { month: "Mar 2026", planned: 27, actual: 26 },
  { month: "Apr 2026", planned: 28, actual: 28 },
  { month: "May 2026", planned: 29, actual: 29 },
];

export const planning = [
  {
    action: "Hire 20 developers for Aug gap",
    priority: "Critical",
    color: COLORS.red,
  },
  {
    action: "Cross-train 15 analysts from other BUs",
    priority: "High",
    color: COLORS.orange,
  },
  {
    action: "Engage 2 new vendor partners for Q3",
    priority: "High",
    color: COLORS.orange,
  },
  {
    action: "Defer 3 low-priority projects to Q4",
    priority: "Medium",
    color: COLORS.amber,
  },
  {
    action: "Upskill bench resources — Data Engg.",
    priority: "Medium",
    color: COLORS.amber,
  },
];

export const forecastData = [
  { month: "Jan 2026", cap: 8.0, demand: 8.9, gap: -0.9 },
  { month: "Feb 2026", cap: 8.3, demand: 9.1, gap: -0.8 },
  { month: "Mar 2026", cap: 8.5, demand: 9.3, gap: -0.8 },
  { month: "Apr 2026", cap: 6.9, demand: 8.7, gap: -1.8 },
  { month: "May 2026", cap: 6.9, demand: 8.8, gap: -0.9 },
  { month: "Jun 2026", cap: 7.5, demand: 8.4, gap: -0.9 },
];

export const demand = [
  { label: "Open", value: 41, color: COLORS.red },
  { label: "In Progress", value: 18, color: COLORS.orange },
  { label: "Fulfilled", value: 23, color: COLORS.green },
  { label: "Staffing Gap", value: -4, color: COLORS.red },
];

export const byRole = [
  { role: "Developers", value: 16 },
  { role: "Consultants", value: 9 },
  { role: "Analysts", value: 11 },
  { role: "Testers", value: 10 },
  { role: "Architects", value: 3 },
];

export const aging = [
  { range: "0–15 Days", count: 14, pct: "34.5%", color: COLORS.green },
  { range: "16–30 Days", count: 11, pct: "27.4%", color: COLORS.teal },
  { range: "31–40 Days", count: 10, pct: "23.3%", color: COLORS.orange },
  { range: ">40 Days", count: 6, pct: "14.8%", color: COLORS.red },
];

export const demandByPriority = [
  { label: "High", value: 16, pct: 38, color: COLORS.red },
  { label: "Medium", value: 16, pct: 40, color: COLORS.orange },
  { label: "Low", value: 9, pct: 22, color: COLORS.blue },
];

export const spendTrend = [
  { month: "Jan 2026", spend: 6.84 },
  { month: "Feb 2026", spend: 5.84 },
  { month: "Mar 2026", spend: 5.98 },
  { month: "Apr 2026", spend: 7.1 },
  { month: "May 2026", spend: 8.1 },
];

export const spendByCat = [
  { name: "Development", value: 48 },
  { name: "Consulting", value: 25 },
  { name: "Support & Maintenance", value: 17 },
  { name: "Infrastructure", value: 10 },
];

export const vendors = [
  {
    name: "Ascendion",
    spend: 3.21,
    pct: 15.3,
    score: 92,
    category: "Development",
    onTime: 94,
  },
  {
    name: "Tata Consultancy Svcs",
    spend: 2.98,
    pct: 13.1,
    score: 88,
    category: "Consulting",
    onTime: 91,
  },
  {
    name: "Infosys",
    spend: 2.25,
    pct: 10.7,
    score: 85,
    category: "Development",
    onTime: 89,
  },
  {
    name: "Wipro",
    spend: 1.89,
    pct: 9.0,
    score: 80,
    category: "Support",
    onTime: 86,
  },
  {
    name: "HCL Technologies",
    spend: 1.46,
    pct: 7.0,
    score: 78,
    category: "Development",
    onTime: 83,
  },
  {
    name: "Accenture",
    spend: 1.02,
    pct: 4.9,
    score: 90,
    category: "Consulting",
    onTime: 92,
  },
  {
    name: "Cognizant",
    spend: 0.98,
    pct: 4.7,
    score: 84,
    category: "Development",
    onTime: 87,
  },
  {
    name: "LTI Mindtree",
    spend: 0.87,
    pct: 4.1,
    score: 81,
    category: "Support",
    onTime: 85,
  },
  {
    name: "Capgemini",
    spend: 0.31,
    pct: 3.8,
    score: 82,
    category: "Consulting",
    onTime: 88,
  },
  {
    name: "Others",
    spend: 1.71,
    pct: 21.4,
    score: 79,
    category: "Mixed",
    onTime: 84,
  },
];

export const varianceByPortfolioHeader = [
  "Portfolio",
  "Budget ($M)",
  "Actual ($M)",
  "Variance ($M)",
  "Variance %",
];

export const varianceByTypedData = [
  { name: "Resource Cost", value: 58.5 },
  { name: "Infrastructure", value: 25.1 },
  { name: "Other Cost", value: 15.5 },
];

export const portfolioVar = [
  {
    name: "Digital Transformation",
    budget: 7.2,
    actual: 5.96,
    variance: -1.2,
    pct: -16.7,
  },
  {
    name: "Product Engineering",
    budget: 6.5,
    actual: 5.38,
    variance: -1.12,
    pct: -17.2,
  },
  {
    name: "Cloud Services",
    budget: 5.8,
    actual: 4.85,
    variance: -0.95,
    pct: -16.4,
  },
  {
    name: "Data & Analytics",
    budget: 3.5,
    actual: 2.77,
    variance: -0.73,
    pct: -20.9,
  },
  {
    name: "Business Applications",
    budget: 1.8,
    actual: 1.38,
    variance: -0.42,
    pct: -23.3,
  },
];

export const budgetMonthly = [
  { month: "Jan 2026", budget: 4.4, actual: 4.9, variance: -0.5 },
  { month: "Feb 2026", budget: 4.3, actual: 4.7, variance: -0.4 },
  { month: "Mar 2026", budget: 5.1, actual: 5.6, variance: -0.5 },
  { month: "Apr 2026", budget: 5.4, actual: 5.8, variance: -0.4 },
  { month: "May 2026", budget: 5.4, actual: 5.6, variance: -0.2 },
];

export const nonCompReasons = [
  { name: "Missing Timesheet", value: 36, color: COLORS.red },
  { name: "Over Allocation", value: 28, color: COLORS.orange },
  { name: "Delayed Approval", value: 19, color: COLORS.amber },
  { name: "Incorrect Allocation", value: 10, color: COLORS.blue },
  { name: "Others", value: 8, color: COLORS.gray },
];

export const compTrend = [
  { month: "Jan 2026", rate: 90 },
  { month: "Feb 2026", rate: 91 },
  { month: "Mar 2026", rate: 90 },
  { month: "Apr 2026", rate: 92 },
  { month: "May 2026", rate: 92 },
];

export const items = [
  { label: "Timesheet Submission", value: 96, target: 95 },
  { label: "Allocation Adherence", value: 91, target: 90 },
  { label: "Manager Approval", value: 93, target: 90 },
  { label: "Data Quality", value: 88, target: 90 },
  { label: "Skill Certification", value: 90, target: 85 },
];

export const availTrend = [
  { month: "Jan 2026", pct: 23 },
  { month: "Feb 2026", pct: 22 },
  { month: "Mar 2026", pct: 22 },
  { month: "Apr 2026", pct: 21 },
  { month: "May 2026", pct: 22 },
];

export const sharedProjects = [
  { name: "Cloud Migration", shared: 24 },
  { name: "Data Warehouse", shared: 20 },
  { name: "Mobile App Revamp", shared: 18 },
  { name: "ERP Implementation", shared: 16 },
  { name: "DevOps Implementation", shared: 14 },
  { name: "Analytics Dashboard", shared: 14 },
  { name: "Customer Portal", shared: 12 },
  { name: "Security Upgrade", shared: 10 },
  { name: "Automation Testing", shared: 7 },
];

export const byRoleReportDetail16 = [
  { role: "Developers", total: 45, avail: 9, pct: "19.4%" },
  { role: "Consultants", total: 19, avail: 4, pct: "22.2%" },
  { role: "Analysts", total: 12, avail: 2, pct: "20.2%" },
  { role: "Testers", total: 7, avail: 2, pct: "22.1%" },
  { role: "Architects", total: 3, avail: 1, pct: "22.6%" },
  { role: "Others", total: 6, avail: 1, pct: "24.1%" },
];