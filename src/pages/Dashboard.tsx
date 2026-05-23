import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users, Gauge, PieChart as PieChartIcon, UserCheck, UserX,
  TrendingUp, AlertTriangle, ClipboardCheck,
  Activity, Zap, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  blue:       "#2563EB",
  blueSoft:   "#DBEAFE",
  teal:       "#0D9488",
  orange:     "#EA580C",
  orangeSoft: "#FFEDD5",
  red:        "#DC2626",
  redSoft:    "#FEE2E2",
  purple:     "#7C3AED",
  purpleSoft: "#EDE9FE",
  green:      "#16A34A",
  greenSoft:  "#DCFCE7",
  amber:      "#D97706",
  amberSoft:  "#FEF3C7",
  gray:       "#6B7280",
  indigo:     "#4F46E5",
  sky:        "#0284C7",
};

// ─── Theme hook ────────────────────────────────────────────────────────────────
function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => {
      const html = document.documentElement;
      const body = document.body;
      setIsDark(
        html.classList.contains("dark") ||
        body.classList.contains("dark") ||
        html.getAttribute("data-theme") === "dark" ||
        body.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    };
    check();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", check);
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => { mq.removeEventListener("change", check); observer.disconnect(); };
  }, []);

  const t = isDark ? {
    pageBg: "#0b1120", panelBg: "#131c2e", cardBg: "#1a2540",
    border: "#243050", inputBg: "#0f1728", hoverBg: "#1b2d52",
    textPrimary: "#f0f4ff", textSecondary: "#c4cfe8", textMuted: "#6c7fa8",
    tableHeader: "#131c2e", tooltipBg: "#1a2540",
    overlay: "rgba(0,0,0,0.7)", selectBg: "#0f1728",
    dragChecked: "#1b2d52", dragCheckedBorder: "#2563EB",
    dragUnchecked: "#1a2540", savedActive: "#1b2d52", savedActiveBorder: "#2563EB",
    badgeInProgress: { bg: "#1b2d52", color: C.blue },
    badgeOpen:       { bg: "#0d2a1a", color: C.green },
    badgeNotStarted: { bg: "#1a2540", color: "#6c7fa8" },
    gridStroke: "#243050", axisColor: "#6c7fa8",
    sectionLabel: "#6c7fa8",
    accentLine: "#243050",
  } : {
    pageBg: "#fafafa", panelBg: "#ffffff", cardBg: "#ffffff",
    border: "#e2e8f4", inputBg: "#f7f9fd", hoverBg: "#eff4ff",
    textPrimary: "#0d1526", textSecondary: "#374151", textMuted: "#64748b",
    tableHeader: "#f7f9fd", tooltipBg: "#ffffff",
    overlay: "rgba(13,21,38,0.5)", selectBg: "transparent",
    dragChecked: "#eff4ff", dragCheckedBorder: "#bfdbfe",
    dragUnchecked: "#f7f9fd", savedActive: "#eff4ff", savedActiveBorder: "#bfdbfe",
    badgeInProgress: { bg: "#dbeafe", color: C.blue },
    badgeOpen:       { bg: "#dcfce7", color: C.green },
    badgeNotStarted: { bg: "#f3f4f6", color: C.gray },
    gridStroke: "#eef2fa", axisColor: "#94a3b8",
    sectionLabel: "#0c0d0e",
    accentLine: "#e2e8f4",
  };

  return { isDark, t, setIsDark };
}

// ─── Chart Data ────────────────────────────────────────────────────────────────
const capDemandData = [
  { month: "Dec '23", Capacity: 7100, Demand: 7500, Gap: -200 },
  { month: "Jan '24", Capacity: 7200, Demand: 7500, Gap: -300 },
  { month: "Feb '24", Capacity: 7300, Demand: 7700, Gap: -400 },
  { month: "Mar '24", Capacity: 7400, Demand: 7600, Gap: -200 },
  { month: "Apr '24", Capacity: 7400, Demand: 8100, Gap: -700 },
  { month: "May '24", Capacity: 7400, Demand: 8000, Gap: -600 },
];
const utilTrendData = [
  { month: "Dec '23", rate: 76 }, { month: "Jan '24", rate: 78 },
  { month: "Feb '24", rate: 79 }, { month: "Mar '24", rate: 80 },
  { month: "Apr '24", rate: 81 }, { month: "May '24", rate: 83 },
];
const allocationTrendData = [
  { month: "Dec '23", fte: 6200 }, { month: "Jan '24", fte: 6400 },
  { month: "Feb '24", fte: 6600 }, { month: "Mar '24", fte: 6800 },
  { month: "Apr '24", fte: 7000 }, { month: "May '24", fte: 7100 },
];
const capacityTrendData = [
  { month: "Jan", capacity: 2200, allocated: 1500, available: 700 },
  { month: "Feb", capacity: 2400, allocated: 1700, available: 700 },
  { month: "Mar", capacity: 2600, allocated: 1750, available: 850 },
  { month: "Apr", capacity: 2500, allocated: 1680, available: 820, forecast: 2400 },
  { month: "May", capacity: 2580, allocated: 1780, available: 800, forecast: 2500 },
  { month: "Jun", capacity: 2520, allocated: 1600, available: 920, forecast: 2721 },
];
const portfolioAlloc = [
  { name: "Digital Transformation", value: 2346, pct: 33.0, color: C.blue   },
  { name: "Product Engineering",    value: 1842, pct: 25.9, color: C.teal   },
  { name: "Cloud Services",         value: 1396, pct: 19.6, color: C.orange },
  { name: "Data & Analytics",       value: 1030, pct: 14.5, color: C.purple },
  { name: "Business Applications",  value: 601,  pct: 8.4,  color: C.green  },
];
const utilizationData = [
  { name: "Optimal",       value: 54, color: C.blue   },
  { name: "High",          value: 22, color: C.orange },
  { name: "Underutilized", value: 16, color: C.green  },
  { name: "Overallocated", value: 8,  color: C.red    },
];
const riskData = [
  { name: "High Risk",     value: 7, color: C.red    },
  { name: "Medium Risk",   value: 8, color: C.orange },
  { name: "Low Risk",      value: 6, color: C.amber  },
  { name: "Informational", value: 3, color: C.blue   },
];
const topRisks = [
  { text: "Critical skill shortage in Data Engineering", count: 5, color: C.red    },
  { text: "Over allocation in Mobile Projects",          count: 4, color: C.red    },
  { text: "Open high priority demands",                  count: 4, color: C.orange },
  { text: "Key resource attrition risk",                 count: 3, color: C.green  },
  { text: "Timesheets pending submission",               count: 3, color: C.blue   },
];
const demandByPriority = [
  { label: "High",        value: 156, color: C.red    },
  { label: "Medium",      value: 146, color: C.orange },
  { label: "Low",         value: 92,  color: C.green  },
  { label: "Not Started", value: 18,  color: C.gray   },
];
const recentDemands = [
  { id: "DM-1248", name: "AI Platform Implementation", priority: "High",   skills: "Python, ML, Azure",          fte: 15, by: "Arjun N.",   date: "Jun 15, 2024", status: "In Progress" },
  { id: "DM-1251", name: "Mobile App Revamp",          priority: "High",   skills: "React Native, iOS, Android",  fte: 12, by: "Priya S.",   date: "Jun 20, 2024", status: "Open"        },
  { id: "DM-1256", name: "Data Warehouse Migration",   priority: "Medium", skills: "SQL, ETL, Azure",             fte: 8,  by: "Karthik R.", date: "Jul 05, 2024", status: "Open"        },
  { id: "DM-1260", name: "Cloud Optimization",         priority: "Medium", skills: "AWS, DevOps",                 fte: 6,  by: "Vimal K.",   date: "Jul 10, 2024", status: "Not Started" },
];
const utilByDept = [
  { dept: "Engineering",      value: 89 },
  { dept: "Consulting",       value: 85 },
  { dept: "Data & Analytics", value: 83 },
  { dept: "Cloud Services",   value: 79 },
  { dept: "Product",          value: 75 },
  { dept: "Business Ops",     value: 60 },
];
const allocationByFn = [
  { name: "Engineering",     allocated: 78, available: 14, bench: 8  },
  { name: "Product",         allocated: 74, available: 16, bench: 10 },
  { name: "Architecture",    allocated: 81, available: 11, bench: 8  },
  { name: "Data",            allocated: 72, available: 17, bench: 11 },
  { name: "QA",              allocated: 76, available: 14, bench: 10 },
  { name: "Operations",      allocated: 68, available: 17, bench: 15 },
  { name: "Shared Services", allocated: 63, available: 22, bench: 15 },
];
const heatmap = [
  { skill: "Cloud Engineering",    may: "#22C55E", jun: "#86EFAC", jul: "#FDE047" },
  { skill: "Data Engineering",     may: "#86EFAC", jun: "#FDE047", jul: "#F97316" },
  { skill: "Software Engineering", may: "#FDE047", jun: "#F97316", jul: "#EF4444" },
  { skill: "QA Automation",        may: "#FDE047", jun: "#FB923C", jul: "#EF4444" },
  { skill: "DevOps",               may: "#FB923C", jun: "#EF4444", jul: "#B91C1C" },
];
const completeness = [
  { label: "Skills",             value: 95 },
  { label: "Allocation Data",    value: 93 },
  { label: "Manager Assignment", value: 91 },
  { label: "Timesheet Data",     value: 89 },
  { label: "Certifications",     value: 85 },
];
const alertsData = [
  { label: "Overallocated Resources", count: 2, variant: "red"    },
  { label: "Missing Timesheets",      count: 1, variant: "orange" },
  { label: "Expiring Contracts",      count: 1, variant: "amber"  },
  { label: "Critical Skill Shortage", count: 1, variant: "red"    },
];
const staffingData = [
  { label: "High Priority",   count: 12, color: C.red    },
  { label: "Medium Priority", count: 10, color: C.orange },
  { label: "Low Priority",    count: 5,  color: C.green  },
];
const forecastVsActuals = [
  { month: "Jan", planned: 115, forecast: 100, actual: 95  },
  { month: "Feb", planned: 118, forecast: 102, actual: 98  },
  { month: "Mar", planned: 120, forecast: 108, actual: 99  },
  { month: "Apr", planned: 125, forecast: 115, actual: 104 },
  { month: "May", planned: 126, forecast: 112, actual: 100 },
  { month: "Jun", planned: 127, forecast: 118, actual: 98  },
];

// ─── KPI Cards Data ────────────────────────────────────────────────────────────
const DEFAULT_KPI_CARDS = [
  { id: "kpi_resources",   icon: Users,          iconBg: C.blueSoft,   iconColor: C.blue,   label: "Total Resources (FTE)",    value: "8,532", vsLabel: "vs Apr 2024", delta: "2.3%", deltaUp: true,  valueColor: C.blue,   checked: true },
  { id: "kpi_capacity",    icon: Gauge,          iconBg: C.greenSoft,  iconColor: C.green,  label: "Total Capacity (FTE)",     value: "7,427", vsLabel: "vs Apr 2024", delta: "1.8%", deltaUp: true,  valueColor: C.green,  checked: true },
  { id: "kpi_demand",      icon: TrendingUp,     iconBg: C.orangeSoft, iconColor: C.orange, label: "Total Demand (FTE)",       value: "8,016", vsLabel: "vs Apr 2024", delta: "3.6%", deltaUp: true,  valueColor: C.orange, checked: true },
  { id: "kpi_gap",         icon: AlertTriangle,  iconBg: C.redSoft,    iconColor: C.red,    label: "Capacity Gap (FTE)",       value: "-589",  vsLabel: "vs Apr 2024", delta: "4.7%", deltaUp: false, valueColor: C.red,    checked: true },
  { id: "kpi_util",        icon: PieChartIcon,   iconBg: C.purpleSoft, iconColor: C.purple, label: "Utilization Rate",         value: "83%",   vsLabel: "vs Apr 2024", delta: "2pp",  deltaUp: true,  valueColor: C.purple, checked: true },
  { id: "kpi_bench",       icon: UserX,          iconBg: C.amberSoft,  iconColor: C.amber,  label: "Bench Resources",          value: "335",   vsLabel: "vs Apr 2024", delta: "5.6%", deltaUp: true,  valueColor: C.amber,  checked: true },
  { id: "kpi_opendemand",  icon: UserCheck,      iconBg: "#e0f2fe",    iconColor: C.sky,    label: "Open Demands",             value: "412",   vsLabel: "vs Apr 2024", delta: "5.1%", deltaUp: false, valueColor: C.sky,    checked: true }
];

// ─── Widgets ───────────────────────────────────────────────────────────────────
const DEFAULT_WIDGETS = [
  { id: "capDemandBar",   label: "Capacity vs Demand Trend",      checked: true,  row: 1, colSpan: "1.4fr" },
  { id: "capTrendLine",   label: "Capacity & Demand Line",        checked: true,  row: 1, colSpan: "1.4fr" },
  { id: "utilDonut",      label: "Utilization Distribution",      checked: true,  row: 1, colSpan: "0.9fr" },
  { id: "resourceRisk",   label: "Resource Risks",                checked: true,  row: 1, colSpan: "0.9fr" },
  { id: "allocPortfolio", label: "Allocation by Portfolio",       checked: true,  row: 2, colSpan: "1fr"   },
  { id: "allocByFn",      label: "Allocation by Function",        checked: true,  row: 2, colSpan: "1fr"   },
  { id: "skillHeatmap",   label: "Skill Demand Heatmap",          checked: true,  row: 2, colSpan: "1fr"   },
  { id: "forecastBar",    label: "Forecast vs Actuals",           checked: true,  row: 2, colSpan: "1fr"   },
  { id: "utilTrend",      label: "Utilization Trend",             checked: true,  row: 3, colSpan: "1fr"   },
  { id: "demandPriority", label: "Demand by Priority",            checked: true,  row: 3, colSpan: "0.7fr" },
  { id: "benchAvail",     label: "Bench Availability",            checked: true,  row: 3, colSpan: "0.7fr" },
  { id: "allocTrend",     label: "Allocation Trend",              checked: true,  row: 3, colSpan: "1fr"   },
  { id: "recentDemands",  label: "Recent Demands",                checked: true,  row: 4, colSpan: "2fr"   },
  { id: "utilDept",       label: "Utilization by Department",     checked: true,  row: 4, colSpan: "1fr"   },
  { id: "riskAlerts",     label: "Risk Alerts",                   checked: true,  row: 4, colSpan: "1fr"   },
  { id: "staffing",       label: "Pending Staffing",              checked: true,  row: 5, colSpan: "1fr"   },
  { id: "dataHealth",     label: "Data Completeness",             checked: true,  row: 5, colSpan: "1fr"   },
  { id: "forecastAcc",    label: "Forecast Accuracy",             checked: true,  row: 5, colSpan: "1fr"   },
];

const INITIAL_SAVED_VIEWS = [
  { name: "Default View",    widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: true  },
  { name: "Leadership View", widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
  { name: "My Team View",    widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
  { name: "Weekly Planning", widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
  { name: "Finance View",    widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
];

// ─── Utility ───────────────────────────────────────────────────────────────────
function formatDateRange(start, end) {
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}
function toInputValue(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fromInputValue(s) {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, m - 1, day);
}

const alertColors = {
  red:    { bg: "#FEE2E2", text: "#B91C1C", dot: "#EF4444" },
  orange: { bg: "#FFEDD5", text: "#C2410C", dot: "#F97316" },
  amber:  { bg: "#FEF3C7", text: "#B45309", dot: "#F59E0B" },
};
const alertColorsDark = {
  red:    { bg: "#3b1212", text: "#fca5a5", dot: "#EF4444" },
  orange: { bg: "#3b1f0b", text: "#fdba74", dot: "#F97316" },
  amber:  { bg: "#3b2c0b", text: "#fcd34d", dot: "#F59E0B" },
};

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#f1f5f9", minWidth: 140 }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#94a3b8" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 2 }}>
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Shared Components ─────────────────────────────────────────────────────────
function SectionLabel({ children, t }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: t.sectionLabel, marginBottom: 12, paddingLeft: 2 }}>
      {children}
    </div>
  );
}

function CardShell({ title, subtitle, children, t }: any) {
  return (
    <div style={{ background: t.cardBg, borderRadius: 14, border: `1px solid ${t.border}`, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 10, height: "100%", boxSizing: "border-box", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function MiniBar({ value, max = 100, color = C.blue, height = 8, t }) {
  return (
    <div style={{ flex: 1, height, background: t.border, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${Math.min((value/max)*100, 100)}%`, height: "100%", background: color, borderRadius: 4, transition: "width .3s" }} />
    </div>
  );
}

function KpiCard({ icon: Icon, iconBg, iconColor, label, value, valueColor, vsLabel, delta, deltaUp, t }) {
  return (
    <div style={{ background: t.cardBg, borderRadius: 14, border: `1px solid ${t.border}`, padding: "16px 16px 14px", minWidth: 0, position: "relative", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: valueColor, borderRadius: "14px 14px 0 0" }} />
      <div style={{ width: 34, height: 34, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <Icon size={16} color={iconColor} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: valueColor, lineHeight: 1, marginBottom: 4, letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4, marginBottom: 6, minHeight: 28 }}>{label}</div>
      <div style={{ fontSize: 10, color: t.textMuted, display: "flex", alignItems: "center", gap: 3 }}>
        {deltaUp ? <ArrowUpRight size={11} color={C.green} /> : <ArrowDownRight size={11} color={C.red} />}
        <span style={{ color: deltaUp ? C.green : C.red, fontWeight: 700 }}>{delta}</span>
        <span>{vsLabel}</span>
      </div>
    </div>
  );
}

function statusBadge(status, t) {
  const map = { "In Progress": t.badgeInProgress, "Open": t.badgeOpen, "Not Started": t.badgeNotStarted, "Closed": t.badgeNotStarted };
  const s = map[status] || t.badgeNotStarted;
  return <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 10, whiteSpace: "nowrap" }}>{status}</span>;
}
function priorityBadge(p) {
  const map = { High: C.red, Medium: C.amber, Low: C.green };
  return <span style={{ fontSize: 10, fontWeight: 700, color: map[p] || C.gray }}>{p}</span>;
}

// ─── Modals ────────────────────────────────────────────────────────────────────
function CalendarModal({ startDate, endDate, onApply, onClose, t }: any) {
  const [start, setStart] = useState(toInputValue(startDate));
  const [end,   setEnd]   = useState(toInputValue(endDate));
  const [error, setError] = useState("");
  const handleApply = () => {
    if (!start || !end) { setError("Please select both dates."); return; }
    if (start > end) { setError("Start date must be before end date."); return; }
    onApply(fromInputValue(start), fromInputValue(end));
  };
  return (
    <div style={{ position:"fixed", inset:0, background:t.overlay, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:t.cardBg, borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", width:360, padding:28, border:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontSize:16, fontWeight:700, color:t.textPrimary }}>Select Date Range</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:t.textMuted, lineHeight:1 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:16 }}>
          {[["Start Date", start, setStart], ["End Date", end, setEnd]].map(([label, val, setter]: any) => (
            <div key={label as string}>
              <label style={{ fontSize:12, fontWeight:600, color:t.textSecondary, display:"block", marginBottom:6 }}>{label}</label>
              <input type="date" value={val} onChange={e => { setter(e.target.value); setError(""); }}
                style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", fontSize:13,
                  border:`1px solid ${error ? C.red : t.border}`, borderRadius:8, outline:"none",
                  color:t.textPrimary, background:t.inputBg }} />
            </div>
          ))}
        </div>
        {error && <div style={{ fontSize:11, color:C.red, marginBottom:12 }}>{error}</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 20px", fontSize:12, fontWeight:600, color:t.textMuted, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleApply} style={{ padding:"8px 24px", fontSize:12, fontWeight:600, color:"#fff", background:C.blue, border:"none", borderRadius:8, cursor:"pointer" }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

function SaveViewModal({ onSave, onClose, t }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlay, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: t.cardBg, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", width: 400, padding: 28, border: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary }}>Save View</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: t.textMuted }}>×</button>
        </div>
        <label style={{ fontSize: 12, fontWeight: 600, color: t.textSecondary, display: "block", marginBottom: 6 }}>Report Name</label>
        <input autoFocus value={name} onChange={e => { setName(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && (name.trim() ? onSave(name.trim()) : setError("Please enter a report name."))}
          placeholder="e.g. My Custom View"
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 13, border: `1px solid ${error ? C.red : t.border}`, borderRadius: 8, outline: "none", color: t.textPrimary, background: t.inputBg }} />
        {error && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</div>}
        <div style={{ fontSize: 11, color: t.textMuted, margin: "16px 0" }}>Saves your current widget & KPI selection as a named view.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", fontSize: 12, fontWeight: 600, color: t.textMuted, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => name.trim() ? onSave(name.trim()) : setError("Please enter a report name.")}
            style={{ padding: "8px 24px", fontSize: 12, fontWeight: 600, color: "#fff", background: C.blue, border: "none", borderRadius: 8, cursor: "pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Draggable rows ────────────────────────────────────────────────────────────
function DraggableWidgetRow({ widget, index, onToggle, onDragStart, onDragOver, onDrop, isDraggingOver, isDragging, t }) {
  return (
    <div draggable onDragStart={() => onDragStart(index)} onDragOver={e => { e.preventDefault(); onDragOver(index); }} onDrop={() => onDrop(index)}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8,
        background: isDraggingOver ? t.hoverBg : widget.checked ? t.dragChecked : t.dragUnchecked,
        border: `1px solid ${isDraggingOver ? C.blue : widget.checked ? t.dragCheckedBorder : t.border}`,
        opacity: isDragging ? 0.4 : 1, cursor: "grab", transition: "background .15s, opacity .15s", userSelect: "none" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 }}>
        <input type="checkbox" checked={widget.checked} onChange={() => onToggle(widget.id)} style={{ accentColor: C.blue, width: 14, height: 14 }} />
        <span style={{ fontSize: 11, color: t.textSecondary, fontWeight: 500 }}>{widget.label}</span>
      </label>
      <span style={{ fontSize: 14, color: t.textMuted, cursor: "grab" }}>⠿</span>
    </div>
  );
}
function DraggableKpiRow({ kpi, index, onToggle, onDragStart, onDragOver, onDrop, isDraggingOver, isDragging, t }) {
  const Icon = kpi.icon;
  return (
    <div draggable onDragStart={() => onDragStart(index)} onDragOver={e => { e.preventDefault(); onDragOver(index); }} onDrop={() => onDrop(index)}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8,
        background: isDraggingOver ? t.hoverBg : kpi.checked ? t.dragChecked : t.dragUnchecked,
        border: `1px solid ${isDraggingOver ? C.blue : kpi.checked ? t.dragCheckedBorder : t.border}`,
        opacity: isDragging ? 0.4 : 1, cursor: "grab", transition: "background .15s, opacity .15s", userSelect: "none" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 }}>
        <input type="checkbox" checked={kpi.checked} onChange={() => onToggle(kpi.id)} style={{ accentColor: C.blue, width: 14, height: 14 }} />
        <Icon size={12} color={kpi.iconColor} />
        <span style={{ fontSize: 11, color: t.textSecondary, fontWeight: 500 }}>{kpi.label}</span>
      </label>
      <span style={{ fontSize: 14, color: t.textMuted, cursor: "grab" }}>⠿</span>
    </div>
  );
}

// ─── Widget Content Renderer ───────────────────────────────────────────────────
function renderWidgetContent(id, t, isDark) {
  const axisProps = { tick: { fontSize: 9, fill: t.axisColor } };
  const tooltipStyle = { contentStyle: { fontSize: 10, background: t.tooltipBg, border: `1px solid ${t.border}`, color: t.textPrimary, borderRadius: 8 } };
  const aColors = isDark ? alertColorsDark : alertColors;

  switch (id) {
    case "capDemandBar":
      return (
        <CardShell title="Capacity vs Demand Trend (FTE)" subtitle="Dec 2023 – May 2024" t={t}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["Capacity", C.blue], ["Demand", C.orange], ["Gap", C.red]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: t.textMuted }}>
                <span style={{ width: 18, height: 3, background: c, display: "inline-block", borderRadius: 2 }} />{l}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={capDemandData} margin={{ top: 4, right: 4, bottom: 4, left: -18 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={v => v < 0 ? `${v}` : `${(v/1000).toFixed(1)}K`} />
              <Tooltip {...tooltipStyle} formatter={v => `${Number(v).toLocaleString()} FTE`} />
              <Bar dataKey="Capacity" fill={C.blue}   radius={[3,3,0,0]} />
              <Bar dataKey="Demand"   fill={C.orange} radius={[3,3,0,0]} />
              <Bar dataKey="Gap"      fill={C.red}    radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "capTrendLine":
      return (
        <CardShell title="Capacity & Demand Trend" subtitle="Jan – Jun 2026" t={t}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={capacityTrendData} margin={{ top: 4, right: 8, bottom: 4, left: -12 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 9, paddingTop: 8 }} />
              <Line type="monotone" dataKey="capacity"  stroke={C.blue}   strokeWidth={2.5} dot={{ r: 3, fill: C.blue,   strokeWidth: 0 }} name="Total Capacity" />
              <Line type="monotone" dataKey="allocated" stroke={C.green}  strokeWidth={2.5} dot={{ r: 3, fill: C.green,  strokeWidth: 0 }} name="Allocated" />
              <Line type="monotone" dataKey="available" stroke={C.orange} strokeWidth={2.5} dot={{ r: 3, fill: C.orange, strokeWidth: 0 }} name="Available" />
              <Line type="monotone" dataKey="forecast"  stroke={C.purple} strokeWidth={2}   dot={{ r: 3, fill: C.purple, strokeWidth: 0 }} strokeDasharray="5 3" name="Forecast" />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "utilDonut":
      return (
        <CardShell title="Utilization Distribution" subtitle="Current period breakdown" t={t}>
          <div style={{ position: "relative", height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={utilizationData} innerRadius={46} outerRadius={68} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {utilizationData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary }}>78.4%</div>
              <div style={{ fontSize: 9, color: t.textMuted }}>Utilization</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {utilizationData.map(item => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.color }} />
                  <span style={{ color: t.textSecondary }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: t.textPrimary }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "resourceRisk":
      return (
        <CardShell title="Resource Risks" t={t}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", width: 84, height: 84, flexShrink: 0 }}>
              <PieChart width={84} height={84}>
                <Pie data={riskData} cx={41} cy={41} innerRadius={25} outerRadius={40} dataKey="value" startAngle={90} endAngle={-270}>
                  {riskData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>24</div>
                <div style={{ fontSize: 7, color: t.textMuted }}>Risks</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {riskData.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0", color: t.textSecondary }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: r.color, display: "inline-block" }} />{r.name}
                  </span>
                  <span style={{ fontWeight: 700, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: 4, borderTop: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textSecondary, marginBottom: 6 }}>Top Risks</div>
            {topRisks.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: t.textMuted, padding: "2px 0" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: r.color, flexShrink: 0, display: "inline-block" }} />
                  {r.text}
                </span>
                <span style={{ fontWeight: 700, color: r.color, marginLeft: 6 }}>{r.count}</span>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "allocPortfolio":
      return (
        <CardShell title="Allocation by Portfolio (FTE)" t={t}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
              <PieChart width={100} height={100}>
                <Pie data={portfolioAlloc} cx={49} cy={49} innerRadius={28} outerRadius={47} dataKey="value" startAngle={90} endAngle={-270}>
                  {portfolioAlloc.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: t.textPrimary }}>7,115</div>
                <div style={{ fontSize: 8, color: t.textMuted }}>FTE</div>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {portfolioAlloc.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9.5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                  <span style={{ color: t.textSecondary, flex: 1 }}>{d.name}</span>
                  <span style={{ fontWeight: 600, color: t.textPrimary }}>{d.value.toLocaleString()}</span>
                  <span style={{ color: t.textMuted }}>({d.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </CardShell>
      );

    case "allocByFn":
      return (
        <CardShell title="Allocation by Function" subtitle="Breakdown across teams" t={t}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allocationByFn.map(item => (
              <div key={item.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: t.textSecondary, fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: t.textPrimary }}>{item.allocated}%</span>
                </div>
                <div style={{ height: 7, borderRadius: 99, background: t.border, overflow: "hidden", display: "flex" }}>
                  <div style={{ width: `${item.allocated}%`, background: C.blue,   borderRadius: "99px 0 0 99px" }} />
                  <div style={{ width: `${item.available}%`, background: C.green }} />
                  <div style={{ width: `${item.bench}%`,    background: C.orange, borderRadius: "0 99px 99px 0" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            {[["Allocated", C.blue], ["Available", C.green], ["Bench", C.orange]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: t.textMuted }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />{l}
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "skillHeatmap":
      return (
        <CardShell title="Demand vs Capacity" subtitle="Skill availability heatmap" t={t}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 52px 52px 52px", gap: 6, fontSize: 10, color: t.textMuted, fontWeight: 600, marginBottom: 6 }}>
            <span>Skill</span>
            {["May", "Jun", "Jul"].map(m => <span key={m} style={{ textAlign: "center" }}>{m}</span>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {heatmap.map(row => (
              <div key={row.skill} style={{ display: "grid", gridTemplateColumns: "1fr 52px 52px 52px", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10.5, color: t.textSecondary, fontWeight: 500 }}>{row.skill}</span>
                {["may", "jun", "jul"].map(m => (
                  <div key={m} style={{ height: 28, borderRadius: 7, background: row[m], opacity: 0.85, transition: "opacity 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "0.85"} />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6, paddingTop: 6, borderTop: `1px solid ${t.border}` }}>
            {[["Healthy", "#22C55E"], ["Moderate", "#FDE047"], ["High Risk", "#F97316"], ["Critical", "#EF4444"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9.5, color: t.textMuted }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "forecastBar":
      return (
        <CardShell title="Forecast vs Actuals" subtitle="Budget (K) comparison" t={t}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={forecastVsActuals} barSize={9} barCategoryGap="28%" margin={{ top: 4, right: 4, bottom: 4, left: -18 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={v => `${v}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 9, paddingTop: 6 }} />
              <Bar dataKey="planned"  fill={C.blue}   radius={[3,3,0,0]} name="Planned" />
              <Bar dataKey="forecast" fill={C.green}  radius={[3,3,0,0]} name="Forecast" />
              <Bar dataKey="actual"   fill={C.purple} radius={[3,3,0,0]} name="Actuals" />
            </BarChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "utilTrend":
      return (
        <CardShell title="Utilization Trend (%)" t={t}>
          <ResponsiveContainer width="100%" height={165}>
            <LineChart data={utilTrendData} margin={{ top: 4, right: 4, bottom: 4, left: -22 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis domain={[50, 100]} {...axisProps} tickFormatter={v => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={v => `${v}%`} />
              <defs>
                <linearGradient id="utilG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.purple} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={C.purple} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="rate" stroke={C.purple} strokeWidth={2.5} fill="url(#utilG)" dot={{ r: 4, fill: C.purple }} name="Utilization" />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "demandPriority":
      return (
        <CardShell title="Demand by Priority" t={t}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
            {demandByPriority.map((d, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: t.textSecondary, fontWeight: 500 }}>{d.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.value}</span>
                </div>
                <MiniBar value={d.value} max={180} color={d.color} height={9} t={t} />
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "benchAvail":
      return (
        <CardShell title="Bench Availability" t={t}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", width: 100, height: 100 }}>
              <PieChart width={100} height={100}>
                <Pie data={[{value:78.4},{value:21.6}]} cx={49} cy={49} innerRadius={30} outerRadius={47} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill={C.green} /><Cell fill={t.border} />
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: t.textPrimary }}>1,842</div>
                <div style={{ fontSize: 8, color: t.textMuted }}>FTE</div>
              </div>
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
              {[["Available", C.green, "1,842", "78.4%"], ["Shared", C.gray, "2,315", "21.6%"]].map(([l, c, v, p]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.textSecondary, alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 2, background: c }} />{l}</span>
                  <span style={{ fontWeight: 700, color: c }}>{v} ({p})</span>
                </div>
              ))}
            </div>
          </div>
        </CardShell>
      );

    case "allocTrend":
      return (
        <CardShell title="Allocation Trend" subtitle="Last 6 months" t={t}>
          <ResponsiveContainer width="100%" height={155}>
            <LineChart data={allocationTrendData} margin={{ top: 4, right: 8, bottom: 4, left: -12 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
              <Tooltip {...tooltipStyle} formatter={v => `${Number(v).toLocaleString()} FTE`} />
              <defs>
                <linearGradient id="allocG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="fte" stroke={C.blue} strokeWidth={2.5} fill="url(#allocG)" dot={{ r: 3, fill: C.blue }} name="Allocated FTE" />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "recentDemands":
      return (
        <CardShell title="Recent Demands" t={t}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: t.tableHeader }}>
                  {["Demand ID","Demand Name","Priority","Required Skills","FTE","Requested By","Target Date","Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 9, color: t.textMuted, fontWeight: 600, borderBottom: `1px solid ${t.border}`, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentDemands.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.border}` }}>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: C.blue, fontWeight: 600, whiteSpace: "nowrap" }}>{r.id}</td>
                    <td style={{ padding: "7px 8px", fontSize: 11, color: t.textPrimary, fontWeight: 500 }}>{r.name}</td>
                    <td style={{ padding: "7px 8px" }}>{priorityBadge(r.priority)}</td>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: t.textMuted }}>{r.skills}</td>
                    <td style={{ padding: "7px 8px", fontSize: 11, fontWeight: 700, color: t.textPrimary, textAlign: "center" }}>{r.fte}</td>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: t.textSecondary }}>{r.by}</td>
                    <td style={{ padding: "7px 8px", fontSize: 10, color: t.textMuted, whiteSpace: "nowrap" }}>{r.date}</td>
                    <td style={{ padding: "7px 8px" }}>{statusBadge(r.status, t)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardShell>
      );

    case "utilDept":
      return (
        <CardShell title="Utilization by Department" t={t}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
            {utilByDept.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10.5, color: t.textSecondary, minWidth: 106 }}>{d.dept}</span>
                <MiniBar value={d.value} max={100} color={d.value >= 85 ? C.blue : d.value >= 75 ? C.teal : d.value >= 65 ? C.amber : C.gray} height={10} t={t} />
                <span style={{ fontSize: 11, fontWeight: 700, color: t.textPrimary, minWidth: 28, textAlign: "right" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "riskAlerts":
      return (
        <CardShell title="Risk Alerts" subtitle="5 active alerts requiring attention" t={t}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alertsData.map(a => {
              const col = aColors[a.variant];
              return (
                <div key={a.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 9, background: col.bg }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: col.text, fontWeight: 500 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: col.dot }} />
                    {a.label}
                  </div>
                  <span style={{ background: col.dot, color: "#fff", borderRadius: 99, padding: "1px 8px", fontSize: 10, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{a.count}</span>
                </div>
              );
            })}
          </div>
        </CardShell>
      );

    case "staffing":
      return (
        <CardShell title="Pending Staffing" subtitle="27 open staffing requests" t={t}>
          <div style={{ fontSize: 32, fontWeight: 800, color: t.textPrimary, letterSpacing: "-0.03em" }}>27</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {staffingData.map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: t.textSecondary, fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: t.border, overflow: "hidden" }}>
                  <div style={{ width: `${(s.count / 27) * 100}%`, height: "100%", background: s.color, borderRadius: 99, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "dataHealth":
      const overall = Math.round(completeness.reduce((s, i) => s + i.value, 0) / completeness.length);
      return (
        <CardShell title="Data Completeness" subtitle="Resource profile quality" t={t}>
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", border: `8px solid ${C.green}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${C.greenSoft}` }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary }}>{overall}%</span>
              <span style={{ fontSize: 9, color: t.textMuted }}>Overall</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {completeness.map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: t.textSecondary, fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: t.textPrimary }}>{item.value}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: t.border, overflow: "hidden" }}>
                  <div style={{ width: `${item.value}%`, height: "100%", borderRadius: 99, background: item.value >= 90 ? C.green : item.value >= 85 ? C.amber : C.red, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "forecastAcc":
      return (
        <CardShell title="Forecast Accuracy" subtitle="Model performance score" t={t}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 8 }}>
            <div style={{ width: 96, height: 96, borderRadius: "50%", border: `9px solid ${C.blue}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${C.blueSoft}` }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary, letterSpacing: "-0.03em" }}>74%</span>
            </div>
            <span style={{ fontSize: 11, color: t.textMuted }}>Forecast Accuracy Score</span>
            <div style={{ background: C.greenSoft, color: C.green, borderRadius: 99, padding: "4px 14px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowUpRight size={12} /> +3.6% vs Last Month
            </div>
          </div>
        </CardShell>
      );

    default:
      return null;
  }
}

function buildGridTemplate(rowWidgets) {
  return rowWidgets.map(w => w.colSpan).join(" ");
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CombinedDashboard() {
  const { isDark, t, setIsDark } = useTheme();

  const [showCustomize, setShowCustomize]   = useState(false);
  const [showCalendar, setShowCalendar]     = useState(false);
  const [showSaveModal, setShowSaveModal]   = useState(false);
  const [dateStart, setDateStart]           = useState(new Date(2026, 4, 1));
  const [dateEnd, setDateEnd]               = useState(new Date(2026, 4, 31));
  const [customizeTab, setCustomizeTab]     = useState("widgets");
  const [activeViewName, setActiveViewName] = useState("Default View");
  const [filters, setFilters]               = useState({ bu: "All", portfolio: "All", region: "All", dept: "All", resourceType: "All" });

  const [widgets,  setWidgets]  = useState(() => DEFAULT_WIDGETS.map(w => ({ ...w })));
  const [kpiCards, setKpiCards] = useState(() => DEFAULT_KPI_CARDS.map(k => ({ ...k })));
  const [savedViews, setSavedViews] = useState(() =>
    INITIAL_SAVED_VIEWS.map(v => ({ ...v, widgets: v.widgets.map(w => ({ ...w })), kpiCards: (v.kpiCards || DEFAULT_KPI_CARDS).map(k => ({ ...k })) }))
  );

  const widgetDragRef = useRef(null);
  const kpiDragRef    = useRef(null);
  const [dragOverIndex, setDragOverIndex]   = useState(null);
  const [draggingIndex, setDraggingIndex]   = useState(null);
  const [activeDragGroup, setActiveDragGroup] = useState(null);

  const toggleWidget = useCallback(id => setWidgets(ws => ws.map(w => w.id === id ? { ...w, checked: !w.checked } : w)), []);
  const toggleKpi    = useCallback(id => setKpiCards(ks => ks.map(k => k.id === id ? { ...k, checked: !k.checked } : k)), []);

  const handleWidgetDragStart = useCallback(i => { widgetDragRef.current = i; setDraggingIndex(i); setActiveDragGroup("widget"); }, []);
  const handleWidgetDragOver  = useCallback(i => { if (activeDragGroup === "widget") setDragOverIndex(i); }, [activeDragGroup]);
  const handleWidgetDrop      = useCallback(dropIdx => {
    const from = widgetDragRef.current;
    if (from === null || from === dropIdx) { widgetDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null); return; }
    setWidgets(prev => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(dropIdx, 0, m); return n; });
    widgetDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null);
  }, []);

  const handleKpiDragStart = useCallback(i => { kpiDragRef.current = i; setDraggingIndex(i); setActiveDragGroup("kpi"); }, []);
  const handleKpiDragOver  = useCallback(i => { if (activeDragGroup === "kpi") setDragOverIndex(i); }, [activeDragGroup]);
  const handleKpiDrop      = useCallback(dropIdx => {
    const from = kpiDragRef.current;
    if (from === null || from === dropIdx) { kpiDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null); return; }
    setKpiCards(prev => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(dropIdx, 0, m); return n; });
    kpiDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null);
  }, []);

  const clearDrag = useCallback(() => { setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null); }, []);

  const handleReset = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS.map(w => ({ ...w })));
    setKpiCards(DEFAULT_KPI_CARDS.map(k => ({ ...k })));
    setActiveViewName("Default View");
  }, []);

  const handleSaveView = useCallback(name => {
    const ws = widgets.map(w => ({ ...w }));
    const ks = kpiCards.map(k => ({ ...k }));
    setSavedViews(prev => {
      const idx = prev.findIndex(v => v.name === name);
      if (idx >= 0) return prev.map((v, i) => i === idx ? { ...v, widgets: ws, kpiCards: ks, active: true } : { ...v, active: false });
      return [...prev.map(v => ({ ...v, active: false })), { name, widgets: ws, kpiCards: ks, active: true }];
    });
    setActiveViewName(name);
    setShowSaveModal(false);
  }, [widgets, kpiCards]);

  const handleLoadView = useCallback(index => {
    setSavedViews(sv => sv.map((v, i) => ({ ...v, active: i === index })));
    const view = savedViews[index];
    setWidgets(view.widgets.map(w => ({ ...w })));
    setKpiCards((view.kpiCards || DEFAULT_KPI_CARDS).map(k => ({ ...k })));
    setActiveViewName(view.name);
  }, [savedViews]);

  const filterDefs = [
    { label: "Business Unit", key: "bu",           options: ["All", "Engineering", "Consulting", "Products", "Operations"] },
    { label: "Portfolio",     key: "portfolio",    options: ["All", "Digital Transformation", "Cloud Services", "Data & Analytics", "Product Engineering"] },
    { label: "Region",        key: "region",       options: ["All", "APAC", "EMEA", "AMER"] },
    { label: "Department",    key: "dept",         options: ["All", "Data Engineering", "QA Automation", "Cloud Engineering", "Application Development"] },
    { label: "Resource Type", key: "resourceType", options: ["All", "Full Time", "Contract", "Vendor"] },
  ];

  const visibleKpiCards = useMemo(() => kpiCards.filter(k => k.checked), [kpiCards]);
  const checkedWidgets  = useMemo(() => widgets.filter(w => w.checked), [widgets]);
  const widgetRows      = useMemo(() => {
    const rowMap = new Map();
    for (const w of checkedWidgets) {
      const row = w.row ?? 1;
      if (!rowMap.has(row)) rowMap.set(row, []);
      rowMap.get(row).push(w);
    }
    return Array.from(rowMap.entries()).sort(([a], [b]) => a - b);
  }, [checkedWidgets]);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: t.pageBg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {showSaveModal && <SaveViewModal onSave={handleSaveView} onClose={() => setShowSaveModal(false)} t={t} />}
      {showCalendar  && (
        <CalendarModal startDate={dateStart} endDate={dateEnd}
          onApply={(s, e) => { setDateStart(s); setDateEnd(e); setShowCalendar(false); }}
          onClose={() => setShowCalendar(false)} t={t} />
      )}

      {/* ── Header ── */}
      <div style={{ background: t.panelBg, borderBottom: `1px solid ${t.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.textPrimary, letterSpacing: "-0.02em" }}>Dashboard</h1>
          <div style={{ padding: "3px 10px", border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 12, color: t.textMuted }}>☆</span>
            <span style={{ fontSize: 11, color: t.textSecondary, fontWeight: 500 }}>{activeViewName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 0 3px ${C.greenSoft}` }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>Live</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setShowCalendar(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${t.border}`, borderRadius: 9, padding: "6px 12px", background: t.inputBg, fontSize: 11, color: t.textSecondary, cursor: "pointer" }}>
            📅 {formatDateRange(dateStart, dateEnd)}
          </button>
          <button onClick={() => setShowCustomize(c => !c)}
            style={{ display: "flex", alignItems: "center", gap: 5, background: C.blue, border: "none", borderRadius: 9, padding: "7px 16px", fontSize: 12, cursor: "pointer", color: "#fff", fontWeight: 600 }}>
            ✦ Customize
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ background: t.panelBg, borderBottom: `1px solid ${t.border}`, padding: "7px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
        {filterDefs.map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", border: `1px solid ${t.border}`, borderRadius: 8, background: t.inputBg, overflow: "hidden" }}>
            <span style={{ fontSize: 10, color: t.textMuted, padding: "0 8px", borderRight: `1px solid ${t.border}`, fontWeight: 500 }}>{f.label}</span>
            <select value={filters[f.key]} onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ fontSize: 11, border: "none", background: t.selectBg, padding: "5px 8px", color: t.textSecondary, cursor: "pointer", outline: "none" }}>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <button onClick={() => setShowSaveModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 5, background: C.blueSoft, border: `1px solid #bfdbfe`, borderRadius: 8, padding: "5px 12px", fontSize: 11, color: C.blue, fontWeight: 600, cursor: "pointer" }}>
            💾 Save View
          </button>
        </div>
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Dashboard ── */}
        <div style={{ flex: 1, overflow: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6 }}>

          {/* KPI Section */}
          {visibleKpiCards.length > 0 && (
            <>
              <SectionLabel t={t}>Key Performance Indicators</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(visibleKpiCards.length, 8)}, minmax(0, 1fr))`, gap: 10, marginBottom: 10 }}>
                {visibleKpiCards.map(k => <KpiCard key={k.id} {...k} t={t} />)}
              </div>
            </>
          )}

          {/* Widget Rows */}
          {widgetRows.map(([rowNum, rowWidgets], rowIdx) => {
            // Determine section labels based on row number
            const sectionLabels = {
              1: "Capacity & Utilization",
              2: "Allocation & Forecast",
              3: "Trends & Demand",
              4: "Demands & Department Health",
              5: "Risk & Data Health",
            };
            return (
              <div key={rowNum}>
                {sectionLabels[rowNum] && <SectionLabel t={t}>{sectionLabels[rowNum]}</SectionLabel>}
                <div style={{ display: "grid", gridTemplateColumns: buildGridTemplate(rowWidgets), gap: 12, marginBottom: 6 }}>
                  {rowWidgets.map(w => (
                    <div key={w.id} style={{ minWidth: 0 }}>
                      {renderWidgetContent(w.id, t, isDark)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        </div>

        {/* ── Customize Sidebar ── */}
        {showCustomize && (
          <div style={{ width: 296, background: t.panelBg, borderLeft: `1px solid ${t.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary }}>Customize Dashboard</span>
              <button onClick={() => setShowCustomize(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: t.textMuted, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, padding: "0 16px" }}>
              {["widgets", "kpi"].map(tab => (
                <button key={tab} onClick={() => setCustomizeTab(tab)}
                  style={{ flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", background: "none", border: "none",
                    borderBottom: customizeTab === tab ? `2px solid ${C.blue}` : "2px solid transparent",
                    color: customizeTab === tab ? C.blue : t.textMuted, textTransform: "capitalize" }}>
                  {tab === "kpi" ? "KPI Cards" : "Widgets"}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

              {customizeTab === "widgets" && (
                <>
                  <p style={{ margin: 0, fontSize: 11, color: t.textMuted }}>Toggle widgets on/off and drag to reorder.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }} onDragEnd={clearDrag}>
                    {widgets.map((w, i) => (
                      <DraggableWidgetRow key={w.id} widget={w} index={i} onToggle={toggleWidget}
                        onDragStart={handleWidgetDragStart} onDragOver={handleWidgetDragOver} onDrop={handleWidgetDrop}
                        isDraggingOver={activeDragGroup === "widget" && dragOverIndex === i && draggingIndex !== i}
                        isDragging={activeDragGroup === "widget" && draggingIndex === i} t={t} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleReset} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 600, color: t.textMuted, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer" }}>Reset</button>
                  </div>
                </>
              )}

              {customizeTab === "kpi" && (
                <>
                  <p style={{ margin: 0, fontSize: 11, color: t.textMuted }}>Toggle KPI cards on/off and drag to reorder.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }} onDragEnd={clearDrag}>
                    {kpiCards.map((k, i) => (
                      <DraggableKpiRow key={k.id} kpi={k} index={i} onToggle={toggleKpi}
                        onDragStart={handleKpiDragStart} onDragOver={handleKpiDragOver} onDrop={handleKpiDrop}
                        isDraggingOver={activeDragGroup === "kpi" && dragOverIndex === i && draggingIndex !== i}
                        isDragging={activeDragGroup === "kpi" && draggingIndex === i} t={t} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleReset} style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 600, color: t.textMuted, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer" }}>Reset</button>
                  </div>
                </>
              )}

              {/* Saved Views */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary }}>Saved Views</div>
                  <button onClick={() => setShowSaveModal(true)}
                    style={{ fontSize: 10, fontWeight: 600, color: C.blue, background: C.blueSoft, border: `1px solid #bfdbfe`, borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}>
                    + Save Current
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {savedViews.map((v, i) => (
                    <div key={i} onClick={() => handleLoadView(i)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "8px 12px", borderRadius: 8, cursor: "pointer",
                        background: v.active ? t.savedActive : t.dragUnchecked,
                        border: `1px solid ${v.active ? t.savedActiveBorder : t.border}`,
                        transition: "background .15s, border-color .15s" }}>
                      <span style={{ fontSize: 11, fontWeight: v.active ? 700 : 500, color: v.active ? C.blue : t.textSecondary }}>{v.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {v.active && <span style={{ fontSize: 13, color: C.amber }}>★</span>}
                        <span style={{ fontSize: 13, color: t.textMuted }}>⋮</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}