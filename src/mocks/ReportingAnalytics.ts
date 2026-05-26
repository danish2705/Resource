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
  { month: "Jan", Capacity: 7100, Demand: 7300, Gap: -200 },
  { month: "Feb", Capacity: 7200, Demand: 7500, Gap: -300 },
  { month: "Mar", Capacity: 7300, Demand: 7700, Gap: -400 },
  { month: "Apr", Capacity: 7700, Demand: 7800, Gap: -100 },
  { month: "May", Capacity: 7350, Demand: 8000, Gap: -650 },
];

export const utilizationTrend = [
  { month: "Jan", rate: 76 },
  { month: "Feb", rate: 78 },
  { month: "Mar", rate: 80 },
  { month: "Apr", rate: 81 },
  { month: "May", rate: 83 },
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
      { label: "Capacity Gap", value: "-589 FTE", color: COLORS.red },
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
      { name: "Engineering", value: 85, cap: 3240 },
      { name: "Consulting", value: 81, cap: 2190 },
      { name: "Data & Analytics", value: 84, cap: 1305 },
      { name: "Products", value: 79, cap: 692 },
    ],
    summaryStats: [
      { label: "Capacity", value: "7,427" },
      { label: "Demand", value: "8,016" },
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
      { label: "Planning Inputs", value: "1,245" },
      { label: "Approved", value: "864", color: COLORS.green },
      { label: "Pending", value: "381", color: COLORS.orange },
    ],
    extra: [
      { label: "Sarah Johnson", value: "235" },
      { label: "Michael Lee", value: "188" },
      { label: "Emily Davis", value: "176" },
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
    centerLabel: "7,115 FTE",
    centerSub: "Total Allocated",
    icon: "🥧",
    color: COLORS.purple,
  },
  {
    num: 5,
    title: "Resource Over-Allocation Report",
    desc: "Report for showing resources over-allocation",
    overList: [
      { name: "John Smith", pct: 132, color: COLORS.red },
      { name: "Priya Patel", pct: 128, color: COLORS.red },
      { name: "Ravi Kumar", pct: 118, color: COLORS.orange },
      { name: "Anita Desai", pct: 116, color: COLORS.orange },
      { name: "Carlos M.", pct: 112, color: COLORS.amber },
    ],
    highlight: "312 FTE",
    icon: "🚨",
    color: COLORS.red,
  },
  {
    num: 6,
    title: "Resource Availability & Shared Resources",
    desc: "Report for showing resources shared across projects with availability",
    availability: {
      available: "1,842 FTE",
      shared: "2,315 FTE",
      bench: "1,842 (24.8%)",
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
      { label: "Open Demands", value: "412", color: COLORS.red },
      { label: "In Progress", value: "186", color: COLORS.orange },
      { label: "Fulfilled", value: "226", color: COLORS.green },
    ],
    demandByPriority: [
      { label: "High", value: 156, pct: "38%" },
      { label: "Medium", value: 164, pct: "40%" },
      { label: "Low", value: 92, pct: "22%" },
    ],
    icon: "📋",
    color: COLORS.blue,
  },
  {
    num: 11,
    title: "Forecasting & Capacity Planning",
    desc: "Forecast demand vs capacity & identify future gaps",
    forecastData: [
      { month: "Jan", cap: 8.0, demand: 8.9, gap: -0.9 },
      { month: "Feb", cap: 8.3, demand: 9.1, gap: -0.8 },
      { month: "Mar", cap: 8.5, demand: 9.3, gap: -0.8 },
      { month: "Apr", cap: 6.9, demand: 8.7, gap: -1.8 },
      { month: "May", cap: 6.9, demand: 8.8, gap: -0.9 },
      { month: "Jun", cap: 7.5, demand: 8.4, gap: -0.9 },
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
    actualFTE: "2,850",
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
  { month: "01/01/26", overall: 73.1, billable: 58.2 },
  { month: "01/02/26", overall: 74.0, billable: 59.1 },
  { month: "01/03/26", overall: 75.6, billable: 60.3 },
  { month: "01/04/26", overall: 76.8, billable: 61.0 },
  { month: "11/04/26", overall: 75.6, billable: 59.3 },
  { month: "11/05/26", overall: 78.2, billable: 62.4 },
];

export const utilByDeptData = [
  { dept: "Delivery", overall: 66.7, billable: 88.1, capacity: 92 },
  { dept: "Technology", overall: 65.1, billable: 83.2, capacity: 88 },
  { dept: "Business Support", overall: 50.2, billable: 78.4, capacity: 82 },
  { dept: "Operations", overall: 48.5, billable: 76.8, capacity: 79 },
  { dept: "Finance", overall: 41.6, billable: 73.2, capacity: 75 },
  { dept: "HR", overall: 38.7, billable: 70.1, capacity: 71 },
];

export const utilByWorkType = [
  { name: "Project Delivery", value: 47.9, hours: 56500, color: COLORS.blue },
  { name: "Support / BAU", value: 24.1, hours: 28400, color: COLORS.green },
  { name: "Internal / Admin", value: 14.4, hours: 17000, color: COLORS.orange },
  { name: "Training", value: 7.7, hours: 9100, color: COLORS.purple },
  { name: "Other", value: 5.9, hours: 7000, color: COLORS.gray },
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

export const heatmapManagers = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
];

export const heatmapDepts = [
  { dept: "Delivery", vals: [92, 95, 88, 96], avg: 82.6 },
  { dept: "Technology", vals: [88, 112, 80, 92], avg: 80.3 },
  { dept: "Business Support", vals: [65, 82, 70, 91], avg: 77.1 },
  { dept: "Operations", vals: [66, 78, 72, 83], avg: 74.9 },
  { dept: "Finance", vals: [58, 69, 76, 82], avg: 72.4 },
  { dept: "HR", vals: [55, 64, 68, 72], avg: 69.8 },
];

// ─── Executive Report (Report #1) ─────────────────────────────────────────────

export const execKpis = [
  {
    label: "Total Capacity",
    value: "88 FTE",
    delta: "+6.2% vs 11/04/26",
    up: true,
    color: COLORS.blue,
    icon: "👥",
  },
  {
    label: "Total Demand",
    value: "94 FTE",
    delta: "+3.4% vs 11/04/26",
    up: true,
    color: COLORS.orange,
    icon: "📋",
  },
  {
    label: "Capacity Gap",
    value: "-6 FTE",
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
    value: "41",
    delta: "▼ 5.1% vs 11/04/26",
    up: false,
    color: COLORS.blue,
    icon: "📂",
  },
  {
    label: "Overallocated Resources",
    value: "17",
    delta: "▼ 3.6% vs 11/04/26",
    up: true,
    color: COLORS.amber,
    icon: "⚠️",
  },
  {
    label: "Vendor Spend",
    value: "$8.6M",
    delta: "▲ 7.3% vs 11/04/26",
    up: true,
    color: COLORS.teal,
    icon: "💲",
  },
  {
    label: "Projects at Staffing Risk",
    value: "9",
    delta: "▼ 4 vs 11/04/26",
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
      { team: "Application Development", vals: [82, 84, 88, 91, 96, 104] },
      { team: "Data Engineering", vals: [78, 83, 99, 101, 106, 110] },
      { team: "QA Automation", vals: [76, 80, 92, 98, 105, 108] },
      { team: "Cloud Engineering", vals: [85, 86, 90, 93, 97, 102] },
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
      { team: "Application Development", vals: [83, 85, 90, 94, 96, 102] },
      { team: "Data Engineering", vals: [78, 81, 86, 91, 97, 101] },
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

export const demandStatusData = [
  { name: "Approved", value: 1558, pct: 48, color: COLORS.green },
  { name: "Pending Approval", value: 864, pct: 27, color: COLORS.orange },
  { name: "Draft", value: 496, pct: 15, color: COLORS.blue },
  { name: "Rejected", value: 327, pct: 10, color: COLORS.red },
];

export const vendorData = [
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

export const skillsGapData = [
  { skill: "QA Automation", demand: 325, available: 198, gap: -127 },
  { skill: "Data Engineering", demand: 512, available: 348, gap: -164 },
  { skill: "Cloud Engineering", demand: 418, available: 285, gap: -133 },
  { skill: "React", demand: 278, available: 203, gap: -75 },
  { skill: "Project Management", demand: 165, available: 124, gap: -41 },
];

export const crossPillarData = [
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

// ─── Report #2 ────────────────────────────────────────────────────────────────

export const capDemand2026 = [
  { month: "01/01/26", Capacity: 7100, Demand: 7300, Gap: -200 },
  { month: "01/02/26", Capacity: 7200, Demand: 7500, Gap: -300 },
  { month: "01/03/26", Capacity: 7300, Demand: 7700, Gap: -400 },
  { month: "11/04/26", Capacity: 7700, Demand: 7800, Gap: -100 },
  { month: "11/05/26", Capacity: 7427, Demand: 8016, Gap: -589 },
];

export const utilTrend2026 = [
  { month: "01/01/26", rate: 76 },
  { month: "01/02/26", rate: 78 },
  { month: "01/03/26", rate: 80 },
  { month: "11/04/26", rate: 81 },
  { month: "11/05/26", rate: 83 },
];

// ─── Filter Definitions ───────────────────────────────────────────────────────

export const UTIL_FILTER_DEFS = [
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
    value: "78.2%",
    delta: "▲ 2.6%",
    up: true,
    color: COLORS.blue,
    icon: "👥",
    bg: "#e8f0fb",
  },
  {
    label: "Billable Utilization %",
    value: "62.4%",
    delta: "▲ 3.1%",
    up: true,
    color: COLORS.green,
    icon: "✅",
    bg: "#eaf3e0",
  },
  {
    label: "Non-Billable Utilization %",
    value: "15.8%",
    delta: "▼ 0.5%",
    up: false,
    color: COLORS.purple,
    icon: "🖥️",
    bg: "#f0effe",
  },
  {
    label: "Operational Work %",
    value: "46.3%",
    delta: "▲ 1.8%",
    up: true,
    color: COLORS.orange,
    icon: "⏱️",
    bg: "#fef4e6",
  },
  {
    label: "Strategic Work %",
    value: "31.9%",
    delta: "▲ 2.3%",
    up: true,
    color: COLORS.teal,
    icon: "🎯",
    bg: "#e4f6f1",
  },
  {
    label: "Underutilized (<60%)",
    value: "156",
    delta: "▼ 12",
    up: true,
    color: "#6b7280",
    icon: "👤",
    bg: "#f3f4f6",
  },
  {
    label: "Overutilized (>100%)",
    value: "92",
    delta: "▲ 8",
    up: false,
    color: COLORS.red,
    icon: "🔥",
    bg: "#fde8e8",
  },
];

// ─── Default Filter States ────────────────────────────────────────────────────

export const DEFAULT_UTIL_FILTERS = {
  timePeriod: "11/05/26",
  pillar: "All",
  team: "All",
  project: "All",
  skillSet: "All",
  vendor: "All",
};

export const DEFAULT_EXEC_FILTERS = {
  timePeriod: "11/05/26",
  pillar: "All",
  team: "All",
  project: "All",
  skillSet: "All",
  vendor: "All",
};

export const DEFAULT_GENERIC_FILTERS = {
  date: "11/05/26",
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
    text: "Overall utilization increased by 2.6% compared to 11/04/26.",
  },
  {
    icon: "⚠️",
    color: COLORS.red,
    bg: "#fde8e8",
    text: "92 resources are overutilized (>100%). Immediate attention required.",
  },
  {
    icon: "👥",
    color: COLORS.orange,
    bg: "#fef4e6",
    text: "156 resources are underutilized (<60%). Consider reallocation.",
  },
  {
    icon: "🎯",
    color: COLORS.blue,
    bg: "#e8f0fb",
    text: "Strategic work accounts for 31.9% of total effort. Continue to focus on strategic initiatives.",
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
];

export const main = {
  date: "11/05/26",
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
  { stage: "Submitted", count: 186 },
  { stage: "In Review", count: 27 },
  { stage: "Approved", count: 160 },
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
  { month: "Jan", planned: 2600, actual: 2450 },
  { month: "Feb", planned: 2650, actual: 2500 },
  { month: "Mar", planned: 2700, actual: 2550 },
  { month: "Apr", planned: 2800, actual: 2750 },
  { month: "May", planned: 2850, actual: 2850 },
];

export const planning = [
  {
    action: "Hire 200 developers for Aug gap",
    priority: "Critical",
    color: COLORS.red,
  },
  {
    action: "Cross-train 150 analysts from other BUs",
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
  { month: "Jan", cap: 8.0, demand: 8.9, gap: -0.9 },
  { month: "Feb", cap: 8.3, demand: 9.1, gap: -0.8 },
  { month: "Mar", cap: 8.5, demand: 9.3, gap: -0.8 },
  { month: "Apr", cap: 6.9, demand: 8.7, gap: -1.8 },
  { month: "May", cap: 6.9, demand: 8.8, gap: -0.9 },
  { month: "Jun", cap: 7.5, demand: 8.4, gap: -0.9 },
];

export const demand = [
  { label: "Open", value: 412, color: COLORS.red },
  { label: "In Progress", value: 186, color: COLORS.orange },
  { label: "Fulfilled", value: 226, color: COLORS.green },
  { label: "Staffing Gap", value: -18, color: COLORS.red },
];

export const byRole = [
  { role: "Developers", value: 156 },
  { role: "Consultants", value: 92 },
  { role: "Analysts", value: 108 },
  { role: "Testers", value: 100 },
  { role: "Architects", value: 28 },
];

export const aging = [
  { range: "0–15 Days", count: 142, pct: "34.5%", color: COLORS.green },
  { range: "16–30 Days", count: 113, pct: "27.4%", color: COLORS.teal },
  { range: "31–40 Days", count: 96, pct: "23.3%", color: COLORS.orange },
  { range: ">40 Days", count: 61, pct: "14.8%", color: COLORS.red },
];

export const demandByPriority = [
  { label: "High", value: 156, pct: 38, color: COLORS.red },
  { label: "Medium", value: 164, pct: 40, color: COLORS.orange },
  { label: "Low", value: 92, pct: 22, color: COLORS.blue },
];

export const spendTrend = [
  { month: "Jan", spend: 6.84 },
  { month: "Feb", spend: 5.84 },
  { month: "Mar", spend: 5.98 },
  { month: "Apr", spend: 7.1 },
  { month: "May", spend: 8.1 },
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
  { month: "Jan", budget: 4.4, actual: 4.9, variance: -0.5 },
  { month: "Feb", budget: 4.3, actual: 4.7, variance: -0.4 },
  { month: "Mar", budget: 5.1, actual: 5.6, variance: -0.5 },
  { month: "Apr", budget: 5.4, actual: 5.8, variance: -0.4 },
  { month: "May", budget: 5.4, actual: 5.6, variance: -0.2 },
];

export const nonCompReasons = [
  { name: "Missing Timesheet", value: 36, color: COLORS.red },
  { name: "Over Allocation", value: 28, color: COLORS.orange },
  { name: "Delayed Approval", value: 19, color: COLORS.amber },
  { name: "Incorrect Allocation", value: 10, color: COLORS.blue },
  { name: "Others", value: 8, color: COLORS.gray },
];

export const compTrend = [
  { month: "Jan", rate: 90 },
  { month: "Feb", rate: 91 },
  { month: "Mar", rate: 90 },
  { month: "Apr", rate: 92 },
  { month: "May", rate: 92 },
];
  
export const items = [
  { label: "Timesheet Submission", value: 96, target: 95 },
  { label: "Allocation Adherence", value: 91, target: 90 },
  { label: "Manager Approval", value: 93, target: 90 },
  { label: "Data Quality", value: 88, target: 90 },
  { label: "Skill Certification", value: 90, target: 85 },
];
  
export const availTrend = [
  { month: "Jan", pct: 23.1 },
  { month: "Feb", pct: 22.4 },
  { month: "Mar", pct: 22.4 },
  { month: "Apr", pct: 21.1 },
  { month: "May", pct: 21.6 },
];

export const sharedProjects = [
  { name: "Cloud Migration", shared: 245 },
  { name: "Data Warehouse", shared: 198 },
  { name: "Mobile App Revamp", shared: 176 },
  { name: "ERP Implementation", shared: 164 },
  { name: "DevOps Implementation", shared: 142 },
  { name: "Analytics Dashboard", shared: 138 },
  { name: "Customer Portal", shared: 116 },
  { name: "Security Upgrade", shared: 98 },
  { name: "Automation Testing", shared: 66 },
];
  
export const byRoleReportDetail16 = [
  { role: "Developers", total: 4520, avail: 875, pct: "19.4%" },
  { role: "Consultants", total: 1850, avail: 410, pct: "22.2%" },
  { role: "Analysts", total: 1210, avail: 245, pct: "20.2%" },
  { role: "Testers", total: 700, avail: 155, pct: "22.1%" },
  { role: "Architects", total: 252, avail: 57, pct: "22.6%" },
  { role: "Others", total: 112, avail: 7, pct: "24.1%" },
];
