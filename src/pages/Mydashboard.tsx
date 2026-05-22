import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  blue:   "#2563EB",
  teal:   "#0D9488",
  orange: "#EA580C",
  red:    "#DC2626",
  purple: "#7C3AED",
  green:  "#16A34A",
  amber:  "#D97706",
  gray:   "#6B7280",
  indigo: "#4F46E5",
  sky:    "#0284C7",
};

// ─── Theme tokens (light + dark) ─────────────────────────────────────────────
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

  const t = isDark
    ? {
        pageBg: "#0f172a", panelBg: "#1e293b", cardBg: "#1e293b",
        border: "#334155", inputBg: "#0f172a", hoverBg: "#1e3a5f",
        textPrimary: "#f1f5f9", textSecondary: "#cbd5e1", textMuted: "#94a3b8",
        tableHeader: "#0f172a", tooltipBg: "#1e293b", overlay: "rgba(0,0,0,0.65)",
        selectBg: "#0f172a", dragChecked: "#1e3a5f", dragCheckedBorder: "#1d4ed8",
        dragUnchecked: "#1e293b", savedActive: "#1e3a5f", savedActiveBorder: "#1d4ed8",
        badgeInProgress: { bg: "#1e3a5f", color: C.blue },
        badgeOpen: { bg: "#14532d", color: C.green },
        badgeNotStarted: { bg: "#1e293b", color: "#94a3b8" },
        gridStroke: "#334155", axisColor: "#94a3b8",
      }
    : {
        pageBg: "#f8fafc", panelBg: "#fff", cardBg: "#fff",
        border: "#e2e8f0", inputBg: "#f8fafc", hoverBg: "#eff6ff",
        textPrimary: "#0f172a", textSecondary: "#374151", textMuted: "#64748b",
        tableHeader: "#f8fafc", tooltipBg: "#fff", overlay: "rgba(15,23,42,0.45)",
        selectBg: "transparent", dragChecked: "#f0f9ff", dragCheckedBorder: "#bae6fd",
        dragUnchecked: "#f8fafc", savedActive: "#eff6ff", savedActiveBorder: "#bfdbfe",
        badgeInProgress: { bg: "#dbeafe", color: C.blue },
        badgeOpen: { bg: "#dcfce7", color: C.green },
        badgeNotStarted: { bg: "#f3f4f6", color: C.gray },
        gridStroke: "#f1f5f9", axisColor: "#6b7280",
      };

  return { isDark, t };
}

// ─── Chart data ───────────────────────────────────────────────────────────────
const capDemandData = [
  { month: "Dec 2023", Capacity: 7100, Demand: 7500, Gap: -200 },
  { month: "Jan 2024", Capacity: 7200, Demand: 7500, Gap: -300 },
  { month: "Feb 2024", Capacity: 7300, Demand: 7700, Gap: -400 },
  { month: "Mar 2024", Capacity: 7400, Demand: 7600, Gap: -200 },
  { month: "Apr 2024", Capacity: 7400, Demand: 8100, Gap: -700 },
  { month: "May 2024", Capacity: 7400, Demand: 8000, Gap: -600 },
];
const utilTrendData = [
  { month: "Dec 2023", rate: 76 }, { month: "Jan 2024", rate: 78 },
  { month: "Feb 2024", rate: 79 }, { month: "Mar 2024", rate: 80 },
  { month: "Apr 2024", rate: 81 }, { month: "May 2024", rate: 83 },
];
const allocationTrendData = [
  { month: "Dec 2023", fte: 6200 }, { month: "Jan 2024", fte: 6400 },
  { month: "Feb 2024", fte: 6600 }, { month: "Mar 2024", fte: 6800 },
  { month: "Apr 2024", fte: 7000 }, { month: "May 2024", fte: 7100 },
];
const portfolioAlloc = [
  { name: "Digital Transformation", value: 2346, pct: 33.0, color: C.blue   },
  { name: "Product Engineering",    value: 1842, pct: 25.9, color: C.teal   },
  { name: "Cloud Services",         value: 1396, pct: 19.6, color: C.orange },
  { name: "Data & Analytics",       value: 1030, pct: 14.5, color: C.purple },
  { name: "Business Applications",  value: 601,  pct: 8.4,  color: C.green  },
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
  { id: "DM-1248", name: "AI Platform Implementation",  priority: "High",   skills: "Python, ML, Azure",          fte: 15, by: "Arjun N.",   date: "Jun 15, 2024", status: "In Progress" },
  { id: "DM-1251", name: "Mobile App Revamp",           priority: "High",   skills: "React Native, iOS, Android",  fte: 12, by: "Priya S.",   date: "Jun 20, 2024", status: "Open"        },
  { id: "DM-1256", name: "Data Warehouse Migration",    priority: "Medium", skills: "SQL, ETL, Azure",             fte: 8,  by: "Karthik R.", date: "Jul 05, 2024", status: "Open"        },
  { id: "DM-1260", name: "Cloud Optimization",          priority: "Medium", skills: "AWS, DevOps",                 fte: 6,  by: "Vimal K.",   date: "Jul 10, 2024", status: "Not Started" },
];
const utilByDept = [
  { dept: "Engineering",      value: 89 },
  { dept: "Consulting",       value: 85 },
  { dept: "Data & Analytics", value: 83 },
  { dept: "Cloud Services",   value: 79 },
  { dept: "Product",          value: 75 },
  { dept: "Business Ops",     value: 60 },
];

// ─── Default KPI cards ────────────────────────────────────────────────────────
const DEFAULT_KPI_CARDS = [
  { id: "kpi_resources",  icon: "👥", iconBg: "#dbeafe", label: "Total Resources (FTE)", value: "8,532", vsLabel: "vs Apr 2024", delta: "2.3%", deltaUp: true,  valueColor: C.blue,   checked: true },
  { id: "kpi_capacity",   icon: "🏗️", iconBg: "#d1fae5", label: "Total Capacity (FTE)",  value: "7,427", vsLabel: "vs Apr 2024", delta: "1.8%", deltaUp: true,  valueColor: C.green,  checked: true },
  { id: "kpi_demand",     icon: "📋", iconBg: "#fed7aa", label: "Total Demand (FTE)",    value: "8,016", vsLabel: "vs Apr 2024", delta: "3.6%", deltaUp: true,  valueColor: C.orange, checked: true },
  { id: "kpi_gap",        icon: "⚡", iconBg: "#fee2e2", label: "Capacity Gap (FTE)",    value: "-589",  vsLabel: "vs Apr 2024", delta: "4.7%", deltaUp: false, valueColor: C.red,    checked: true },
  { id: "kpi_util",       icon: "💲", iconBg: "#ede9fe", label: "Utilization",           value: "83%",   vsLabel: "vs Apr 2024", delta: "2pp",  deltaUp: true,  valueColor: C.purple, checked: true },
  { id: "kpi_overalloc",  icon: "⚠️", iconBg: "#fef3c7", label: "Over Allocated (FTE)",  value: "312",   vsLabel: "vs Apr 2024", delta: "3.2%", deltaUp: false, valueColor: C.amber,  checked: true },
  { id: "kpi_opendemand", icon: "📂", iconBg: "#e0f2fe", label: "Open Demands",          value: "412",   vsLabel: "vs Apr 2024", delta: "5.1%", deltaUp: false, valueColor: C.sky,    checked: true },
];

// ─── Widget definitions ───────────────────────────────────────────────────────
// Each widget carries its layout row group (1, 2, 3) and the grid column span
// within that group. The dashboard renderer groups checked widgets by row, then
// renders each group in the correct grid. Reordering changes position within a row.

const DEFAULT_WIDGETS = [
  { id: "capDemand",      label: "Capacity vs Demand Trend",  checked: true,  row: 1, colSpan: "1.4fr" },
  { id: "utilTrend",      label: "Utilization Trend",         checked: true,  row: 1, colSpan: "1fr"   },
  { id: "resourceRisk",   label: "Resource Risks",            checked: true,  row: 1, colSpan: "0.9fr" },
  { id: "allocPortfolio", label: "Allocation by Portfolio",   checked: true,  row: 2, colSpan: "1fr"   },
  { id: "allocTrend",     label: "Allocation Trend",          checked: true,  row: 2, colSpan: "1fr"   },
  { id: "benchAvail",     label: "Bench Availability",        checked: true,  row: 2, colSpan: "0.7fr" },
  { id: "demandPriority", label: "Demand by Priority",        checked: true,  row: 2, colSpan: "0.9fr" },
  { id: "recentDemands",  label: "Recent Demands",            checked: true,  row: 3, colSpan: "1.1fr" },
  { id: "utilDept",       label: "Utilization by Department", checked: true,  row: 3, colSpan: "0.9fr" },
  { id: "budgetSummary",  label: "Budget Summary",            checked: false, row: 2, colSpan: "1fr"   },
  { id: "vendorSummary",  label: "Vendor Summary",            checked: false, row: 3, colSpan: "1fr"   },
];

const INITIAL_SAVED_VIEWS = [
  { name: "Default View",    widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: true  },
  { name: "Leadership View", widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
  { name: "My Team View",    widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
  { name: "Weekly Planning", widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
  { name: "Finance View",    widgets: DEFAULT_WIDGETS, kpiCards: DEFAULT_KPI_CARDS, active: false },
];

// ─── Date utilities ───────────────────────────────────────────────────────────
function formatDateRange(start: Date, end: Date): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}
function toInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fromInputValue(s: string): Date {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, m - 1, day);
}

// ─── Calendar Modal ───────────────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status: string, t: any) {
  const map: any = {
    "In Progress": t.badgeInProgress, "Open": t.badgeOpen,
    "Not Started": t.badgeNotStarted, "Closed": t.badgeNotStarted,
  };
  const s = map[status] || t.badgeNotStarted;
  return <span style={{ fontSize:10, fontWeight:600, color:s.color, background:s.bg, padding:"2px 8px", borderRadius:10, whiteSpace:"nowrap" }}>{status}</span>;
}
function priorityBadge(p: string) {
  const map: any = { High: C.red, Medium: C.amber, Low: C.green };
  return <span style={{ fontSize:10, fontWeight:700, color:map[p] || C.gray }}>{p}</span>;
}
function MiniBar({ value, max = 100, color = C.blue, height = 8, t }: any) {
  return (
    <div style={{ flex:1, height, background:t.border, borderRadius:4, overflow:"hidden" }}>
      <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .3s" }} />
    </div>
  );
}
function CardShell({ title, children, action = null, t }: any) {
  return (
    <div style={{ background:t.cardBg, borderRadius:12, border:`1px solid ${t.border}`, padding:"16px", display:"flex", flexDirection:"column", gap:10, height:"100%" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:12, fontWeight:700, color:t.textPrimary }}>{title}</span>
        {action || <button style={{ background:"none", border:"none", cursor:"pointer", color:t.textMuted, fontSize:16, lineHeight:1, padding:"0 2px" }}>···</button>}
      </div>
      {children}
    </div>
  );
}
function KpiCard({ icon, iconBg, label, value, valueColor, vsLabel, delta, deltaUp, t }: any) {
  return (
    <div style={{ background:t.cardBg, borderRadius:12, border:`1px solid ${t.border}`, padding:"14px 16px", minWidth:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
        <div style={{ width:34, height:34, borderRadius:"50%", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{icon}</div>
        <span style={{ fontSize:10, color:t.textMuted, lineHeight:1.3 }}>{label}</span>
      </div>
      <div style={{ fontSize:24, fontWeight:800, color:valueColor || t.textPrimary, lineHeight:1, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:10, color:t.textMuted }}>
        {vsLabel}&nbsp;
        <span style={{ color:deltaUp ? C.green : C.red, fontWeight:600 }}>{deltaUp ? "▲" : "▼"} {delta}</span>
      </div>
    </div>
  );
}

// ─── Save View Modal ──────────────────────────────────────────────────────────
function SaveViewModal({ onSave, onClose, t }: any) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const handleSave = () => { if (!name.trim()) { setError("Please enter a report name."); return; } onSave(name.trim()); };
  return (
    <div style={{ position:"fixed", inset:0, background:t.overlay, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:t.cardBg, borderRadius:16, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", width:420, padding:28, border:`1px solid ${t.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <span style={{ fontSize:16, fontWeight:700, color:t.textPrimary }}>Save View</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:t.textMuted, lineHeight:1 }}>×</button>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, fontWeight:600, color:t.textSecondary, display:"block", marginBottom:6 }}>Report Name</label>
          <input autoFocus value={name} onChange={e => { setName(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSave()} placeholder="e.g. My Custom View"
            style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", fontSize:13,
              border:`1px solid ${error ? C.red : t.border}`, borderRadius:8, outline:"none", color:t.textPrimary, background:t.inputBg }} />
          {error && <div style={{ fontSize:11, color:C.red, marginTop:4 }}>{error}</div>}
        </div>
        <div style={{ fontSize:11, color:t.textMuted, marginBottom:20 }}>This will save your current widget selection and layout as a named view you can return to anytime.</div>
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 20px", fontSize:12, fontWeight:600, color:t.textMuted, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer" }}>Cancel</button>
          <button onClick={handleSave} style={{ padding:"8px 24px", fontSize:12, fontWeight:600, color:"#fff", background:C.blue, border:"none", borderRadius:8, cursor:"pointer" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Draggable rows ───────────────────────────────────────────────────────────
function DraggableWidgetRow({ widget, index, onToggle, onDragStart, onDragOver, onDrop, isDraggingOver, isDragging, t }: any) {
  return (
    <div draggable onDragStart={() => onDragStart(index)} onDragOver={e => { e.preventDefault(); onDragOver(index); }} onDrop={() => onDrop(index)}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", borderRadius:8,
        background: isDraggingOver ? t.hoverBg : widget.checked ? t.dragChecked : t.dragUnchecked,
        border:`1px solid ${isDraggingOver ? C.blue : widget.checked ? t.dragCheckedBorder : t.border}`,
        opacity: isDragging ? 0.4 : 1, cursor:"grab", transition:"background .15s, border-color .15s, opacity .15s", userSelect:"none" }}>
      <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flex:1 }}>
        <input type="checkbox" checked={widget.checked} onChange={() => onToggle(widget.id)} style={{ accentColor:C.blue, width:14, height:14 }} />
        <span style={{ fontSize:11, color:t.textSecondary, fontWeight:500 }}>{widget.label}</span>
      </label>
      <span style={{ fontSize:14, color:t.textMuted, cursor:"grab" }}>⠿</span>
    </div>
  );
}
function DraggableKpiRow({ kpi, index, onToggle, onDragStart, onDragOver, onDrop, isDraggingOver, isDragging, t }: any) {
  return (
    <div draggable onDragStart={() => onDragStart(index)} onDragOver={e => { e.preventDefault(); onDragOver(index); }} onDrop={() => onDrop(index)}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", borderRadius:8,
        background: isDraggingOver ? t.hoverBg : kpi.checked ? t.dragChecked : t.dragUnchecked,
        border:`1px solid ${isDraggingOver ? C.blue : kpi.checked ? t.dragCheckedBorder : t.border}`,
        opacity: isDragging ? 0.4 : 1, cursor:"grab", transition:"background .15s, border-color .15s, opacity .15s", userSelect:"none" }}>
      <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flex:1 }}>
        <input type="checkbox" checked={kpi.checked} onChange={() => onToggle(kpi.id)} style={{ accentColor:C.blue, width:14, height:14 }} />
        <span style={{ fontSize:11, color:t.textSecondary, fontWeight:500 }}>{kpi.icon} {kpi.label}</span>
      </label>
      <span style={{ fontSize:14, color:t.textMuted, cursor:"grab" }}>⠿</span>
    </div>
  );
}
function DraggableLayoutRow({ widget, index, onDragStart, onDragOver, onDrop, isDraggingOver, isDragging, t }: any) {
  return (
    <div draggable onDragStart={() => onDragStart(index)} onDragOver={e => { e.preventDefault(); onDragOver(index); }} onDrop={() => onDrop(index)}
      style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:8,
        background: isDraggingOver ? t.hoverBg : t.dragUnchecked,
        border:`1px solid ${isDraggingOver ? C.blue : t.border}`,
        cursor:"grab", opacity: isDragging ? 0.4 : 1,
        transition:"background .15s, border-color .15s, opacity .15s", userSelect:"none" }}>
      <span style={{ fontSize:14, color:t.textMuted }}>⠿</span>
      <span style={{ fontSize:11, color:t.textSecondary, fontWeight:500, flex:1 }}>{widget.label}</span>
      <span style={{ fontSize:9, color:t.textMuted, background:t.border, padding:"2px 6px", borderRadius:4 }}>drag to reorder</span>
    </div>
  );
}

// ─── Widget content renderer ──────────────────────────────────────────────────
// All widget JSX lives here, keyed by widget id.
// The dashboard iterates checkedWidgets IN ORDER and calls this to render each one.
function renderWidgetContent(id: string, t: any, axisProps: any, tooltipStyle: any) {
  switch (id) {
    case "capDemand":
      return (
        <CardShell title="Capacity vs Demand Trend (FTE)" t={t}>
          <div style={{ display:"flex", gap:12, marginBottom:2 }}>
            {[["Total Capacity (FTE)", C.blue], ["Total Demand (FTE)", C.orange], ["Gap (FTE)", C.red]].map(([l, c]: any) => (
              <span key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, color:t.textMuted }}>
                <span style={{ width:20, height:3, background:c, display:"inline-block", borderRadius:2 }}/>{l}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={195}>
            <BarChart data={capDemandData} margin={{ top:5, right:5, bottom:5, left:-15 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v: number) => v < 0 ? `${v}` : `${(v/1000).toFixed(1)}K`} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => `${Number(v).toLocaleString()} FTE`} />
              <Bar dataKey="Capacity" fill={C.blue}   radius={[2,2,0,0]} name="Capacity" />
              <Bar dataKey="Demand"   fill={C.orange} radius={[2,2,0,0]} name="Demand"   />
              <Bar dataKey="Gap"      fill={C.red}    radius={[2,2,0,0]} name="Gap"      />
            </BarChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "utilTrend":
      return (
        <CardShell title="Utilization Trend (%)" t={t}>
          <ResponsiveContainer width="100%" height={215}>
            <LineChart data={utilTrendData} margin={{ top:5, right:5, bottom:5, left:-20 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis domain={[50,100]} {...axisProps} tickFormatter={(v: any) => `${v}%`} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => `${v}%`} />
              <defs>
                <linearGradient id="utilG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.purple} stopOpacity={0.3}  />
                  <stop offset="100%" stopColor={C.purple} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="rate" stroke={C.purple} strokeWidth={2.5} fill="url(#utilG)" dot={{ r:4, fill:C.purple }} name="Utilization" />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "resourceRisk":
      return (
        <CardShell title="Resource Risks" t={t}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ position:"relative", width:88, height:88, flexShrink:0 }}>
              <PieChart width={88} height={88}>
                <Pie data={riskData} cx={43} cy={43} innerRadius={27} outerRadius={42} dataKey="value" startAngle={90} endAngle={-270}>
                  {riskData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                <div style={{ fontSize:16, fontWeight:800, color:t.textPrimary }}>24</div>
                <div style={{ fontSize:7, color:t.textMuted }}>Total Risks</div>
              </div>
            </div>
            <div style={{ flex:1 }}>
              {riskData.map((r, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:10, padding:"2px 0", color:t.textSecondary }}>
                  <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:7, height:7, borderRadius:2, background:r.color, display:"inline-block" }}/>{r.name}
                  </span>
                  <span style={{ fontWeight:700, color:r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:t.textSecondary, marginBottom:6, marginTop:4 }}>Top Risks</div>
            {topRisks.map((r, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:9.5, color:t.textMuted, padding:"2px 0" }}>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:r.color, display:"inline-block", flexShrink:0 }} />
                  {r.text}
                </span>
                <span style={{ fontWeight:700, color:r.color, marginLeft:6 }}>{r.count}</span>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "allocPortfolio":
      return (
        <CardShell title="Allocation by Portfolio (FTE)" t={t}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ position:"relative", width:110, height:110, flexShrink:0 }}>
              <PieChart width={110} height={110}>
                <Pie data={portfolioAlloc} cx={54} cy={54} innerRadius={32} outerRadius={52} dataKey="value" startAngle={90} endAngle={-270}>
                  {portfolioAlloc.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                <div style={{ fontSize:14, fontWeight:800, color:t.textPrimary }}>7,115</div>
                <div style={{ fontSize:8, color:t.textMuted }}>FTE</div>
              </div>
            </div>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
              {portfolioAlloc.map((d, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:9.5 }}>
                  <span style={{ width:7, height:7, borderRadius:2, background:d.color, flexShrink:0 }} />
                  <span style={{ color:t.textSecondary, flex:1 }}>{d.name}</span>
                  <span style={{ fontWeight:600, color:t.textPrimary }}>{d.value.toLocaleString()}</span>
                  <span style={{ color:t.textMuted }}>({d.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </CardShell>
      );

    case "allocTrend":
      return (
        <CardShell title="Allocation Trend (Last 6 Months)" t={t}>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={allocationTrendData} margin={{ top:5, right:10, bottom:5, left:-10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v: any) => `${(v/1000).toFixed(1)}K`} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => `${Number(v).toLocaleString()} FTE`} />
              <defs>
                <linearGradient id="allocG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue} stopOpacity={0.2}  />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="fte" stroke={C.blue} strokeWidth={2.5} fill="url(#allocG)" dot={{ r:3, fill:C.blue }} name="Allocated FTE" />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "benchAvail":
      return (
        <CardShell title="Bench Availability" t={t}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
            <div style={{ position:"relative", width:110, height:110 }}>
              <PieChart width={110} height={110}>
                <Pie data={[{value:78.4},{value:21.6}]} cx={54} cy={54} innerRadius={34} outerRadius={52} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill={C.green} /><Cell fill={t.border} />
                </Pie>
              </PieChart>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                <div style={{ fontSize:15, fontWeight:800, color:t.textPrimary }}>1,842</div>
                <div style={{ fontSize:8, color:t.textMuted }}>FTE</div>
              </div>
            </div>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:5 }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:t.textSecondary, alignItems:"center" }}>
                <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:7, height:7, borderRadius:2, background:C.green }} /> Available</span>
                <span style={{ fontWeight:700, color:C.green }}>1,842 (78.4%)</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:t.textSecondary, alignItems:"center" }}>
                <span style={{ display:"flex", alignItems:"center", gap:5 }}><span style={{ width:7, height:7, borderRadius:2, background:C.gray }} /> Shared Resources</span>
                <span style={{ fontWeight:700, color:C.gray }}>2,315 (21.6%)</span>
              </div>
            </div>
          </div>
        </CardShell>
      );

    case "demandPriority":
      return (
        <CardShell title="Demand by Priority" t={t}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            {demandByPriority.map((d, i) => (
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:11, color:t.textSecondary, fontWeight:500 }}>{d.label}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:d.color }}>{d.value}</span>
                </div>
                <MiniBar value={d.value} max={180} color={d.color} height={10} t={t} />
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "recentDemands":
      return (
        <CardShell title="Recent Demands" t={t}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:t.tableHeader }}>
                {["Demand ID","Demand Name","Priority","Required Skills","Required FTE","Requested By","Target Date","Status"].map(h => (
                  <th key={h} style={{ textAlign:"left", padding:"6px 8px", fontSize:9, color:t.textMuted, fontWeight:600, borderBottom:`1px solid ${t.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentDemands.map((r, i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${t.border}` }}>
                  <td style={{ padding:"8px 8px", fontSize:10, color:C.blue, fontWeight:600, whiteSpace:"nowrap" }}>{r.id}</td>
                  <td style={{ padding:"8px 8px", fontSize:11, color:t.textPrimary, fontWeight:500 }}>{r.name}</td>
                  <td style={{ padding:"8px 8px" }}>{priorityBadge(r.priority)}</td>
                  <td style={{ padding:"8px 8px", fontSize:10, color:t.textMuted }}>{r.skills}</td>
                  <td style={{ padding:"8px 8px", fontSize:11, fontWeight:700, color:t.textPrimary, textAlign:"center" }}>{r.fte}</td>
                  <td style={{ padding:"8px 8px", fontSize:10, color:t.textSecondary }}>{r.by}</td>
                  <td style={{ padding:"8px 8px", fontSize:10, color:t.textMuted, whiteSpace:"nowrap" }}>{r.date}</td>
                  <td style={{ padding:"8px 8px" }}>{statusBadge(r.status, t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardShell>
      );

    case "utilDept":
      return (
        <CardShell title="Utilization by Department" t={t}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
            {utilByDept.map((d, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:11, color:t.textSecondary, minWidth:110 }}>{d.dept}</span>
                <MiniBar value={d.value} max={100} color={d.value >= 85 ? C.blue : d.value >= 75 ? C.teal : d.value >= 65 ? C.amber : C.gray} height={12} t={t} />
                <span style={{ fontSize:11, fontWeight:700, color:t.textPrimary, minWidth:30, textAlign:"right" }}>{d.value}%</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", paddingLeft:120, paddingRight:36, marginTop:4 }}>
            {["0%","25%","50%","75%","100%"].map(l => (
              <span key={l} style={{ fontSize:9, color:t.textMuted }}>{l}</span>
            ))}
          </div>
        </CardShell>
      );

    default:
      return null;
  }
}

// ─── Row grid templates (keyed by row number) ─────────────────────────────────
// These are the ORIGINAL col-span templates per row, used when ALL widgets in
// a row are visible. When only a subset is checked, we use their colSpan values.
function buildGridTemplate(rowWidgets: any[]): string {
  return rowWidgets.map((w: any) => w.colSpan).join(" ");
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyDashboard() {
  const { isDark, t } = useTheme();

  const [showCustomize, setShowCustomize] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateStart, setDateStart] = useState(new Date(2026, 4, 1));
  const [dateEnd,   setDateEnd]   = useState(new Date(2026, 4, 31));

  // ── SINGLE SOURCE OF TRUTH ────────────────────────────────────────────────
  // `widgets` drives BOTH the customize panel AND the actual dashboard rendering.
  // The dashboard renders by iterating this array in order — so reordering this
  // array directly reorders the dashboard, with NO secondary state needed.
  const [widgets,  setWidgets]  = useState(() => DEFAULT_WIDGETS.map(w => ({ ...w })));
  const [kpiCards, setKpiCards] = useState(() => DEFAULT_KPI_CARDS.map(k => ({ ...k })));

  // ── Pending layout state for the Layout tab ───────────────────────────────
  // The Layout tab works on a *pending* copy so that reorder is only committed
  // to the live dashboard when the user clicks Apply. Toggle (Widgets tab) and
  // KPI toggle apply instantly as before.
  const [pendingLayout, setPendingLayout] = useState<typeof DEFAULT_WIDGETS | null>(null);

  // When user opens the Layout tab, seed pendingLayout from live widgets.
  // When user switches away without applying, discard the pending changes.
  const [customizeTab, setCustomizeTab] = useState("widgets");

  const handleTabChange = useCallback((tab: string) => {
    if (tab === "layout") {
      // Seed pending layout from current live widgets (only checked ones are shown)
      setPendingLayout(widgets.map(w => ({ ...w })));
    } else {
      // Discard pending layout when leaving layout tab without applying
      setPendingLayout(null);
    }
    setCustomizeTab(tab);
  }, [widgets]);

  const [savedViews, setSavedViews] = useState(() =>
    INITIAL_SAVED_VIEWS.map(v => ({
      ...v,
      widgets: v.widgets.map(w => ({ ...w })),
      kpiCards: (v.kpiCards || DEFAULT_KPI_CARDS).map(k => ({ ...k })),
    }))
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeViewName, setActiveViewName] = useState("Default View");
  const [filters, setFilters] = useState({ bu: "All", portfolio: "All", region: "All", dept: "All", resourceType: "All" });

  // Drag refs
  const widgetDragRef = useRef<number | null>(null);
  const kpiDragRef    = useRef<number | null>(null);
  const layoutDragRef = useRef<number | null>(null);

  const [dragOverIndex,   setDragOverIndex]   = useState<number | null>(null);
  const [draggingIndex,   setDraggingIndex]   = useState<number | null>(null);
  const [activeDragGroup, setActiveDragGroup] = useState<"widget" | "kpi" | "layout" | null>(null);

  // ── Toggles (apply instantly to live state) ───────────────────────────────
  const toggleWidget = useCallback((id: string) => {
    setWidgets(ws => ws.map(w => w.id === id ? { ...w, checked: !w.checked } : w));
  }, []);
  const toggleKpi = useCallback((id: string) => {
    setKpiCards(ks => ks.map(k => k.id === id ? { ...k, checked: !k.checked } : k));
  }, []);

  // ── Widget tab drag (reorders live state immediately) ─────────────────────
  const handleWidgetDragStart = useCallback((i: number) => { widgetDragRef.current = i; setDraggingIndex(i); setActiveDragGroup("widget"); }, []);
  const handleWidgetDragOver  = useCallback((i: number) => { if (activeDragGroup === "widget") setDragOverIndex(i); }, [activeDragGroup]);
  const handleWidgetDrop      = useCallback((dropIdx: number) => {
    const from = widgetDragRef.current;
    if (from === null || from === dropIdx) { widgetDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null); return; }
    setWidgets(prev => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(dropIdx, 0, m); return n; });
    widgetDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null);
  }, []);

  // ── KPI tab drag (reorders live state immediately) ────────────────────────
  const handleKpiDragStart = useCallback((i: number) => { kpiDragRef.current = i; setDraggingIndex(i); setActiveDragGroup("kpi"); }, []);
  const handleKpiDragOver  = useCallback((i: number) => { if (activeDragGroup === "kpi") setDragOverIndex(i); }, [activeDragGroup]);
  const handleKpiDrop      = useCallback((dropIdx: number) => {
    const from = kpiDragRef.current;
    if (from === null || from === dropIdx) { kpiDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null); return; }
    setKpiCards(prev => { const n = [...prev]; const [m] = n.splice(from, 1); n.splice(dropIdx, 0, m); return n; });
    kpiDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null);
  }, []);

  // ── Layout tab drag (reorders PENDING state only; committed on Apply) ─────
  const handleLayoutDragStart = useCallback((i: number) => { layoutDragRef.current = i; setDraggingIndex(i); setActiveDragGroup("layout"); }, []);
  const handleLayoutDragOver  = useCallback((i: number) => { if (activeDragGroup === "layout") setDragOverIndex(i); }, [activeDragGroup]);
  const handleLayoutDrop      = useCallback((dropCheckedIdx: number) => {
    const fromCheckedIdx = layoutDragRef.current;
    if (fromCheckedIdx === null || fromCheckedIdx === dropCheckedIdx) {
      layoutDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null); return;
    }
    // Reorder within the pendingLayout checked-only sublist
    setPendingLayout(prev => {
      if (!prev) return prev;
      const checked   = prev.filter(w => w.checked);
      const unchecked = prev.filter(w => !w.checked);
      const reordered = [...checked];
      const [moved] = reordered.splice(fromCheckedIdx, 1);
      reordered.splice(dropCheckedIdx, 0, moved);
      return [...reordered, ...unchecked];
    });
    layoutDragRef.current = null; setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null);
  }, []);

  const clearDragState = useCallback(() => { setDraggingIndex(null); setDragOverIndex(null); setActiveDragGroup(null); }, []);

  // ── Apply: commit pending layout to live widgets ──────────────────────────
  // This is the FIX: Apply now writes pendingLayout → setWidgets so the actual
  // dashboard re-renders with the new order.
  const handleApply = useCallback(() => {
    if (customizeTab === "layout" && pendingLayout) {
      setWidgets(pendingLayout.map(w => ({ ...w })));
      setPendingLayout(null);
    }
    setActiveViewName("Custom View");
  }, [customizeTab, pendingLayout]);

  // ── Reset: restore default order and visibility ───────────────────────────
  const handleReset = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS.map(w => ({ ...w })));
    setKpiCards(DEFAULT_KPI_CARDS.map(k => ({ ...k })));
    setPendingLayout(null);
    setActiveViewName("Default View");
  }, []);

  // ── Save / Load views ─────────────────────────────────────────────────────
  const handleSaveView = useCallback((name: string) => {
    const widgetSnapshot = widgets.map(w => ({ ...w }));
    const kpiSnapshot    = kpiCards.map(k => ({ ...k }));
    setSavedViews(prev => {
      const existing = prev.findIndex(v => v.name === name);
      if (existing >= 0) {
        return prev.map((v, i) => i === existing ? { ...v, widgets: widgetSnapshot, kpiCards: kpiSnapshot, active: true } : { ...v, active: false });
      }
      return [...prev.map(v => ({ ...v, active: false })), { name, widgets: widgetSnapshot, kpiCards: kpiSnapshot, active: true }];
    });
    setActiveViewName(name);
    setShowSaveModal(false);
  }, [widgets, kpiCards]);

  const handleLoadView = useCallback((index: number) => {
    setSavedViews(sv => sv.map((v, i) => ({ ...v, active: i === index })));
    const view = savedViews[index];
    setWidgets(view.widgets.map(w => ({ ...w })));
    setKpiCards((view.kpiCards || DEFAULT_KPI_CARDS).map(k => ({ ...k })));
    setPendingLayout(null);
    setActiveViewName(view.name);
  }, [savedViews]);

  const filterDefs = [
    { label: "Business Unit", key: "bu",           options: ["All","Engineering","Consulting","Products","Operations"] },
    { label: "Portfolio",      key: "portfolio",    options: ["All","Digital Transformation","Cloud Services","Data & Analytics","Product Engineering"] },
    { label: "Region",         key: "region",       options: ["All","APAC","EMEA","AMER"] },
    { label: "Department",     key: "dept",         options: ["All","Data Engineering","QA Automation","Cloud Engineering","Application Development"] },
    { label: "Resource Type",  key: "resourceType", options: ["All","Full Time","Contract","Vendor"] },
  ];

  // ── Derived state ─────────────────────────────────────────────────────────
  const visibleKpiCards = useMemo(() => kpiCards.filter(k => k.checked), [kpiCards]);

  // Checked widgets in their current order — this is what the dashboard renders
  const checkedWidgets = useMemo(() => widgets.filter(w => w.checked), [widgets]);

  // The layout tab shows pendingLayout's checked items when available, else live
  const layoutTabItems = useMemo(() =>
    (pendingLayout ?? widgets).filter(w => w.checked),
    [pendingLayout, widgets]
  );

  // Group checked widgets by row for rendering (preserves order within each row)
  const widgetRows = useMemo(() => {
    const rowMap = new Map<number, typeof checkedWidgets>();
    for (const w of checkedWidgets) {
      const row = w.row ?? 1;
      if (!rowMap.has(row)) rowMap.set(row, []);
      rowMap.get(row)!.push(w);
    }
    // Return rows sorted by row number
    return Array.from(rowMap.entries()).sort(([a], [b]) => a - b);
  }, [checkedWidgets]);

  // Chart theming helpers
  const axisProps    = useMemo(() => ({ tick: { fontSize: 8, fill: t.axisColor } }), [t]);
  const tooltipStyle = useMemo(() => ({ contentStyle: { fontSize: 10, background: t.tooltipBg, border: `1px solid ${t.border}`, color: t.textPrimary } }), [t]);

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif", background:t.pageBg, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {showSaveModal  && <SaveViewModal onSave={handleSaveView} onClose={() => setShowSaveModal(false)} t={t} />}
      {showCalendar   && (
        <CalendarModal startDate={dateStart} endDate={dateEnd}
          onApply={(s: Date, e: Date) => { setDateStart(s); setDateEnd(e); setShowCalendar(false); }}
          onClose={() => setShowCalendar(false)} t={t} />
      )}

      {/* ── Page Header ── */}
      <div style={{ background:t.panelBg, borderBottom:`1px solid ${t.border}`, padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <h1 style={{ margin:0, fontSize:18, fontWeight:800, color:t.textPrimary }}>My Dashboard</h1>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer" }}>
            <span style={{ fontSize:12 }}>☆</span>
            <span style={{ fontSize:11, color:t.textSecondary, fontWeight:500 }}>{activeViewName}</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => setShowCalendar(true)}
            style={{ display:"flex", alignItems:"center", gap:6, border:`1px solid ${t.border}`, borderRadius:8, padding:"5px 10px", background:t.inputBg, fontSize:11, color:t.textSecondary, cursor:"pointer" }}>
            {formatDateRange(dateStart, dateEnd)} 📅
          </button>
          <button style={{ display:"flex", alignItems:"center", gap:6, background:t.panelBg, border:`1px solid ${t.border}`, borderRadius:8, padding:"7px 14px", fontSize:12, cursor:"pointer", color:t.textSecondary, fontWeight:500 }}>
            <span>＋</span> Add Widget
          </button>
          <button style={{ display:"flex", alignItems:"center", gap:6, background:t.panelBg, border:`1px solid ${t.border}`, borderRadius:8, padding:"7px 14px", fontSize:12, cursor:"pointer", color:t.textSecondary, fontWeight:500 }}>
            <span>↗</span> Share
          </button>
          <button onClick={() => setShowCustomize(c => !c)}
            style={{ display:"flex", alignItems:"center", gap:6, background:C.blue, border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, cursor:"pointer", color:"#fff", fontWeight:600 }}>
            ✦ Customize
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ background:t.panelBg, borderBottom:`1px solid ${t.border}`, padding:"8px 20px", display:"flex", alignItems:"center", gap:10, flexShrink:0, flexWrap:"wrap" }}>
        {filterDefs.map(f => (
          <div key={f.key} style={{ display:"flex", alignItems:"center", border:`1px solid ${t.border}`, borderRadius:8, background:t.inputBg, overflow:"hidden" }}>
            <span style={{ fontSize:10, color:t.textMuted, padding:"0 8px", borderRight:`1px solid ${t.border}`, fontWeight:500 }}>{f.label}</span>
            <select value={(filters as any)[f.key]} onChange={e => setFilters((p: any) => ({ ...p, [f.key]: e.target.value }))}
              style={{ fontSize:11, border:"none", background:t.selectBg, padding:"6px 8px", color:t.textSecondary, cursor:"pointer", outline:"none" }}>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:8 }}>
          <button onClick={() => setShowSaveModal(true)}
            style={{ display:"flex", alignItems:"center", gap:5, background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, padding:"5px 12px", fontSize:11, color:C.blue, fontWeight:600, cursor:"pointer" }}>
            💾 Save View
          </button>
        </div>
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── Dashboard Content ── */}
        {/* CORE FIX: The dashboard now renders by iterating `widgetRows`, which is
            derived from `checkedWidgets` in their current array order.
            Reordering `widgets` state (via Apply in Layout tab, or Widget tab drag)
            directly changes the rendered order here — no secondary state needed. */}
        <div style={{ flex:1, overflow:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>

          {/* KPI Row */}
          {visibleKpiCards.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${visibleKpiCards.length}, minmax(0, 1fr))`, gap:10 }}>
              {visibleKpiCards.map(k => <KpiCard key={k.id} {...k} t={t} />)}
            </div>
          )}

          {/* Widget Rows — rendered dynamically from ordered `widgetRows` */}
          {widgetRows.map(([rowNum, rowWidgets]) => (
            <div key={rowNum} style={{ display:"grid", gridTemplateColumns: buildGridTemplate(rowWidgets), gap:12 }}>
              {rowWidgets.map(w => (
                <div key={w.id} style={{ minWidth:0 }}>
                  {renderWidgetContent(w.id, t, axisProps, tooltipStyle)}
                </div>
              ))}
            </div>
          ))}

        </div>

        {/* ── Customize Sidebar ── */}
        {showCustomize && (
          <div style={{ width:300, background:t.panelBg, borderLeft:`1px solid ${t.border}`, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:14, fontWeight:700, color:t.textPrimary }}>Customize Dashboard</span>
              <button onClick={() => setShowCustomize(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:t.textMuted, lineHeight:1 }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", borderBottom:`1px solid ${t.border}`, padding:"0 16px" }}>
              {["widgets","kpi","layout"].map(tab => (
                <button key={tab} onClick={() => handleTabChange(tab)}
                  style={{ flex:1, padding:"10px 0", fontSize:12, fontWeight:600, cursor:"pointer", background:"none", border:"none",
                    borderBottom: customizeTab === tab ? `2px solid ${C.blue}` : "2px solid transparent",
                    color: customizeTab === tab ? C.blue : t.textMuted, textTransform:"capitalize" }}>
                  {tab === "kpi" ? "KPI Cards" : tab}
                </button>
              ))}
            </div>

            <div style={{ flex:1, overflow:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:16 }}>

              {/* ── Widgets Tab ── */}
              {customizeTab === "widgets" && (
                <>
                  <p style={{ margin:0, fontSize:11, color:t.textMuted }}>Toggle widgets on/off and drag to reorder. Preview updates instantly.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:2 }} onDragEnd={clearDragState}>
                    {widgets.map((w, i) => (
                      <DraggableWidgetRow key={w.id} widget={w} index={i} onToggle={toggleWidget}
                        onDragStart={handleWidgetDragStart} onDragOver={handleWidgetDragOver} onDrop={handleWidgetDrop}
                        isDraggingOver={activeDragGroup === "widget" && dragOverIndex === i && draggingIndex !== i}
                        isDragging={activeDragGroup === "widget" && draggingIndex === i} t={t} />
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, paddingTop:4 }}>
                    <button onClick={handleReset} style={{ flex:1, padding:"8px", fontSize:11, fontWeight:600, color:t.textMuted, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer" }}>Reset to Default</button>
                    <button onClick={handleApply} style={{ flex:1, padding:"8px", fontSize:11, fontWeight:600, color:"#fff", background:C.blue, border:"none", borderRadius:8, cursor:"pointer" }}>Apply</button>
                  </div>
                </>
              )}

              {/* ── KPI Cards Tab ── */}
              {customizeTab === "kpi" && (
                <>
                  <p style={{ margin:0, fontSize:11, color:t.textMuted }}>Toggle KPI cards on/off and drag to reorder. Preview updates instantly.</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:2 }} onDragEnd={clearDragState}>
                    {kpiCards.map((k, i) => (
                      <DraggableKpiRow key={k.id} kpi={k} index={i} onToggle={toggleKpi}
                        onDragStart={handleKpiDragStart} onDragOver={handleKpiDragOver} onDrop={handleKpiDrop}
                        isDraggingOver={activeDragGroup === "kpi" && dragOverIndex === i && draggingIndex !== i}
                        isDragging={activeDragGroup === "kpi" && draggingIndex === i} t={t} />
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, paddingTop:4 }}>
                    <button onClick={handleReset} style={{ flex:1, padding:"8px", fontSize:11, fontWeight:600, color:t.textMuted, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer" }}>Reset to Default</button>
                    <button onClick={handleApply} style={{ flex:1, padding:"8px", fontSize:11, fontWeight:600, color:"#fff", background:C.blue, border:"none", borderRadius:8, cursor:"pointer" }}>Apply</button>
                  </div>
                </>
              )}

              {/* ── Layout Tab ── */}
              {customizeTab === "layout" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <p style={{ margin:0, fontSize:11, color:t.textMuted }}>
                    Drag to reorder widgets, then click <strong>Apply</strong> to update the dashboard.
                  </p>
                  <div onDragEnd={clearDragState}>
                    {layoutTabItems.map((w, i) => (
                      <div key={w.id} style={{ marginBottom:4 }}>
                        <DraggableLayoutRow widget={w} index={i}
                          onDragStart={handleLayoutDragStart} onDragOver={handleLayoutDragOver} onDrop={handleLayoutDrop}
                          isDraggingOver={activeDragGroup === "layout" && dragOverIndex === i && draggingIndex !== i}
                          isDragging={activeDragGroup === "layout" && draggingIndex === i} t={t} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8, paddingTop:4 }}>
                    <button onClick={handleReset} style={{ flex:1, padding:"8px", fontSize:11, fontWeight:600, color:t.textMuted, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer" }}>Reset to Default</button>
                    <button onClick={handleApply} style={{ flex:1, padding:"8px", fontSize:11, fontWeight:600, color:"#fff", background:C.blue, border:"none", borderRadius:8, cursor:"pointer" }}>Apply</button>
                  </div>
                </div>
              )}

              {/* ── Saved Views ── */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:t.textPrimary }}>Saved Views</div>
                  <button onClick={() => setShowSaveModal(true)}
                    style={{ fontSize:10, fontWeight:600, color:C.blue, background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:6, padding:"3px 8px", cursor:"pointer" }}>
                    + Save Current
                  </button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                  {savedViews.map((v, i) => (
                    <div key={i} onClick={() => handleLoadView(i)}
                      style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                        padding:"9px 12px", borderRadius:8, cursor:"pointer",
                        background: v.active ? t.savedActive : t.dragUnchecked,
                        border:`1px solid ${v.active ? t.savedActiveBorder : t.border}`,
                        transition:"background .15s, border-color .15s" }}>
                      <span style={{ fontSize:11, fontWeight: v.active ? 700 : 500, color: v.active ? C.blue : t.textSecondary }}>{v.name}</span>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {v.active && <span style={{ fontSize:14, color:C.amber }}>★</span>}
                        <span style={{ fontSize:14, color:t.textMuted }}>⋮</span>
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