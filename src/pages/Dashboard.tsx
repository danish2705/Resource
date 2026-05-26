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
import { C, capacityTrendData, utilizationData, riskData, topRisks, portfolioAlloc, utilTrendData, utilByDept, allocationByFn, forecastVsActuals, demandByPriority, allocationTrendData, alertsData, staffingData, completeness } from "@/mocks/dashboard.ts";

// ─── Theme hook ────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const h = (e) => setDark(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
 
  const t = dark
    ? {
        // base tokens
        pageBg: "#181818", panel: "#222222", card: "#2a2a2a",
        border: "#3a3a3a", inputBg: "#1e1e1e",
        text1: "#f0f0f0", text2: "#b0b0b0", text3: "#666666",
        grid: "#333333", axis: "#777777",
        tableHead: "#1e1e1e",
        // component aliases
        cardBg: "#2a2a2a",
        textSecondary: "#b0b0b0",
        axisColor: "#777777",
        gridStroke: "#333333",
        tooltipBg: "#1e293b",
        tableHeader: "#1e1e1e",
        sectionLabel: "#888888",
        overlay: "rgba(0,0,0,0.6)",
        hoverBg: "#333333",
        dragChecked: "#1e2a3a", dragCheckedBorder: C.blue,
        dragUnchecked: "#2a2a2a",
        // alerts
        alertRed:    { bg: "rgba(220,38,38,.12)",   text: "#fca5a5", dot: "#ef4444" },
        alertOrange: { bg: "rgba(234,88,12,.12)",    text: "#fdba74", dot: "#f97316" },
        alertAmber:  { bg: "rgba(217,119,6,.12)",    text: "#fcd34d", dot: "#f59e0b" },
        // badges (both old and new key names)
        badgeIP:  { bg: "#1e3a5f", color: C.blue  },
        badgeO:   { bg: "#14351f", color: C.green },
        badgeNS:  { bg: "#2a2a2a", color: C.gray  },
        badgeInProgress: { bg: "#1e3a5f", color: C.blue  },
        badgeOpen:       { bg: "#14351f", color: C.green },
        badgeNotStarted: { bg: "#2a2a2a", color: C.gray  },
        trackBg: "#3a3a3a",
      }
    : {
        // base tokens
        pageBg: "#f5f5f4", panel: "#ffffff", card: "#ffffff",
        border: "#e5e7eb", inputBg: "#f9fafb",
        text1: "#111827", text2: "#374151", text3: "#9ca3af",
        grid: "#f3f4f6", axis: "#9ca3af",
        tableHead: "#f9fafb",
        // component aliases
        cardBg: "#ffffff",
        textSecondary: "#374151",
        axisColor: "#9ca3af",
        gridStroke: "#f3f4f6",
        tooltipBg: "#ffffff",
        tableHeader: "#f9fafb",
        sectionLabel: "#9ca3af",
        overlay: "rgba(0,0,0,0.3)",
        hoverBg: "#f3f4f6",
        dragChecked: "#eff6ff", dragCheckedBorder: C.blue,
        dragUnchecked: "#f9fafb",
        // alerts
        alertRed:    { bg: "rgba(220,38,38,.07)",   text: "#b91c1c", dot: "#ef4444" },
        alertOrange: { bg: "rgba(234,88,12,.07)",    text: "#c2410c", dot: "#f97316" },
        alertAmber:  { bg: "rgba(217,119,6,.07)",    text: "#b45309", dot: "#f59e0b" },
        // badges (both old and new key names)
        badgeIP:  { bg: "#dbeafe", color: "#1d4ed8" },
        badgeO:   { bg: "#dcfce7", color: "#15803d" },
        badgeNS:  { bg: "#f3f4f6", color: C.gray   },
        badgeInProgress: { bg: "#dbeafe", color: "#1d4ed8" },
        badgeOpen:       { bg: "#dcfce7", color: "#15803d" },
        badgeNotStarted: { bg: "#f3f4f6", color: C.gray   },
        trackBg: "#e5e7eb",
      };
  return { dark, t };
}

// ─── KPI Cards Data ────────────────────────────────────────────────────────────
const DEFAULT_KPI_CARDS = [
  {
    id: "kpi_resources",
    icon: Users,
    iconBg: C.blueSoft,
    iconColor: C.blue,
    label: "Total Resources (FTE)",
    value: "86",
    vsLabel: "vs Apr 2025",
    delta: "2.3%",
    deltaUp: true,
    valueColor: C.blue,
    checked: true,
  },
  {
    id: "kpi_capacity",
    icon: Gauge,
    iconBg: C.greenSoft,
    iconColor: C.green,
    label: "Total Capacity (FTE)",
    value: "74",
    vsLabel: "vs Apr 2025",
    delta: "1.8%",
    deltaUp: true,
    valueColor: C.green,
    checked: true,
  },
  {
    id: "kpi_demand",
    icon: TrendingUp,
    iconBg: C.orangeSoft,
    iconColor: C.orange,
    label: "Total Demand (FTE)",
    value: "80",
    vsLabel: "vs Apr 2025",
    delta: "3.6%",
    deltaUp: true,
    valueColor: C.orange,
    checked: true,
  },
  {
    id: "kpi_gap",
    icon: AlertTriangle,
    iconBg: C.redSoft,
    iconColor: C.red,
    label: "Capacity Gap (FTE)",
    value: "-6",
    vsLabel: "vs Apr 2025",
    delta: "4.7%",
    deltaUp: false,
    valueColor: C.red,
    checked: true,
  },
  {
    id: "kpi_util",
    icon: PieChartIcon,
    iconBg: C.purpleSoft,
    iconColor: C.purple,
    label: "Utilization Rate",
    value: "83%",
    vsLabel: "vs Apr 2025",
    delta: "2pp",
    deltaUp: true,
    valueColor: C.purple,
    checked: true,
  },
  {
    id: "kpi_bench",
    icon: UserX,
    iconBg: C.amberSoft,
    iconColor: C.amber,
    label: "Bench Resources",
    value: "12",
    vsLabel: "vs Apr 2025",
    delta: "5.6%",
    deltaUp: true,
    valueColor: C.amber,
    checked: true,
  },
  {
    id: "kpi_opendemand",
    icon: UserCheck,
    iconBg: "#e0f2fe",
    iconColor: C.sky,
    label: "Open Demands",
    value: "27",
    vsLabel: "vs Apr 2025",
    delta: "5.1%",
    deltaUp: false,
    valueColor: C.sky,
    checked: true,
  },
];

// ─── Widgets ───────────────────────────────────────────────────────────────────
// Only the 12 required charts in exact order; removed widgets keep their
// renderWidgetContent cases intact so no functionality is lost.
const DEFAULT_WIDGETS = [
  // Row 1 — Capacity & Utilization
  { id: "capTrendLine",   label: "Capacity & Demand Trend",    checked: true, row: 1, colSpan: "1fr" },
  { id: "utilDonut",      label: "Utilization Distribution",   checked: true, row: 1, colSpan: "1fr" },
  { id: "utilDept",       label: "Utilization by Department",  checked: true, row: 1, colSpan: "1fr" },
  // Row 2 — Allocation & Forecast
  { id: "allocPortfolio", label: "Allocation by Portfolio",    checked: true, row: 2, colSpan: "1fr" },
  { id: "allocByFn",      label: "Allocation by Function",     checked: true, row: 2, colSpan: "1fr" },
  { id: "forecastBar",    label: "Forecast vs Actuals",        checked: true, row: 2, colSpan: "1fr" },
  // Row 3 — Trends & Demand
  { id: "utilTrend",      label: "Utilization Trend (%)",      checked: true, row: 3, colSpan: "1fr" },
  { id: "allocTrend",     label: "Allocation Trend",           checked: true, row: 3, colSpan: "1fr" },
  { id: "demandPriority", label: "Demand by Priority",         checked: true, row: 3, colSpan: "1fr" },
  // Row 4 — Risk & Data Health
  { id: "forecastAcc",    label: "Forecast Accuracy",          checked: true, row: 4, colSpan: "1fr" },
  { id: "staffing",       label: "Pending Staffing",           checked: true, row: 4, colSpan: "1fr" },
  { id: "resourceRisk",   label: "Resource Risks",             checked: true, row: 4, colSpan: "1fr" },
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
        <div style={{ fontSize: 13, fontWeight: 700, color: t.text1 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: t.text3, marginTop: 2 }}>{subtitle}</div>}
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
      <div style={{ fontSize: 10, color: t.text3, lineHeight: 1.4, marginBottom: 6, minHeight: 28 }}>{label}</div>
      <div style={{ fontSize: 10, color: t.text3, display: "flex", alignItems: "center", gap: 3 }}>
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
          <span style={{ fontSize:16, fontWeight:700, color:t.text1 }}>Select Date Range</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:t.text3, lineHeight:1 }}>×</button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:16 }}>
          {[["Start Date", start, setStart], ["End Date", end, setEnd]].map(([label, val, setter]: any) => (
            <div key={label as string}>
              <label style={{ fontSize:12, fontWeight:600, color:t.textSecondary, display:"block", marginBottom:6 }}>{label}</label>
              <input type="date" value={val} onChange={e => { setter(e.target.value); setError(""); }}
                style={{ width:"100%", boxSizing:"border-box", padding:"10px 12px", fontSize:13,
                  border:`1px solid ${error ? C.red : t.border}`, borderRadius:8, outline:"none",
                  color:t.text1, background:t.inputBg }} />
            </div>
          ))}
        </div>
        {error && <div style={{ fontSize:11, color:C.red, marginBottom:12 }}>{error}</div>}
        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"8px 20px", fontSize:12, fontWeight:600, color:t.text3, background:t.inputBg, border:`1px solid ${t.border}`, borderRadius:8, cursor:"pointer" }}>Cancel</button>
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
          <span style={{ fontSize: 16, fontWeight: 700, color: t.text1 }}>Save View</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: t.text3 }}>×</button>
        </div>
        <label style={{ fontSize: 12, fontWeight: 600, color: t.textSecondary, display: "block", marginBottom: 6 }}>Report Name</label>
        <input autoFocus value={name} onChange={e => { setName(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && (name.trim() ? onSave(name.trim()) : setError("Please enter a report name."))}
          placeholder="e.g. My Custom View"
          style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontSize: 13, border: `1px solid ${error ? C.red : t.border}`, borderRadius: 8, outline: "none", color: t.text1, background: t.inputBg }} />
        {error && <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>{error}</div>}
        <div style={{ fontSize: 11, color: t.text3, margin: "16px 0" }}>Saves your current widget & KPI selection as a named view.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", fontSize: 12, fontWeight: 600, color: t.text3, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer" }}>Cancel</button>
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
      <span style={{ fontSize: 14, color: t.text3, cursor: "grab" }}>⠿</span>
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
      <span style={{ fontSize: 14, color: t.text3, cursor: "grab" }}>⠿</span>
    </div>
  );
}

// ─── Widget Content Renderer ───────────────────────────────────────────────────
function renderWidgetContent(id, t, isDark) {
  const axisProps = { tick: { fontSize: 9, fill: t.axisColor } };
  const tooltipStyle = { contentStyle: { fontSize: 10, background: t.tooltipBg, border: `1px solid ${t.border}`, color: t.text1, borderRadius: 8 } };
  const aColors = isDark ? alertColorsDark : alertColors;

  switch (id) {
    case "capDemandBar":
      return (
        <CardShell title="Capacity vs Demand Trend" subtitle="Jan – Jun 2026" t={t}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={capacityTrendData} barSize={10} barCategoryGap="28%" margin={{ top: 4, right: 8, bottom: 4, left: -12 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 9, paddingTop: 8 }} />
              <Bar dataKey="capacity"  fill={C.blue}   radius={[3,3,0,0]} name="Total Capacity" />
              <Bar dataKey="allocated" fill={C.green}  radius={[3,3,0,0]} name="Allocated" />
              <Bar dataKey="available" fill={C.orange} radius={[3,3,0,0]} name="Available" />
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
              <div style={{ fontSize: 20, fontWeight: 800, color: t.text1 }}>78.4%</div>
              <div style={{ fontSize: 9, color: t.text3 }}>Utilization</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {utilizationData.map(item => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.color }} />
                  <span style={{ color: t.textSecondary }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: t.text1 }}>{item.value}%</span>
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
                <div style={{ fontSize: 15, fontWeight: 800, color: t.text1 }}>24</div>
                <div style={{ fontSize: 7, color: t.text3 }}>Risks</div>
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
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: t.text3, padding: "2px 0" }}>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 18,
              width: "100%",
              minHeight: 220,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 100,
                height: 100,
                flexShrink: 0,
              }}
            >
              <PieChart width={100} height={100}>
                <Pie
                  data={portfolioAlloc}
                  cx={49}
                  cy={49}
                  innerRadius={28}
                  outerRadius={47}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {portfolioAlloc.map((d, i) => (
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
                    fontSize: 13,
                    fontWeight: 800,
                    color: t.text1,
                  }}
                >
                  100
                </div>

                <div
                  style={{
                    fontSize: 8,
                    color: t.text3,
                  }}
                >
                  FTE
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                justifyContent: "center",
              }}
            >
              {portfolioAlloc.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 9.5,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: d.color,
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      color: t.textSecondary,
                      flex: 1,
                    }}
                  >
                    {d.name}
                  </span>

                  <span
                    style={{
                      fontWeight: 600,
                      color: t.text1,
                    }}
                  >
                    {d.value}
                  </span>

                  <span style={{ color: t.text3 }}>
                    ({d.pct}%)
                  </span>
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
                  <span style={{ fontWeight: 700, color: t.text1 }}>{item.allocated}%</span>
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
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: t.text3 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: c }} />{l}
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
            <AreaChart data={utilTrendData} margin={{ top: 4, right: 4, bottom: 4, left: -22 }}>
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
            </AreaChart>
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
                <div style={{ fontSize: 13, fontWeight: 800, color: t.text1 }}>1,842</div>
                <div style={{ fontSize: 8, color: t.text3 }}>FTE</div>
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
            <AreaChart data={allocationTrendData} margin={{ top: 4, right: 8, bottom: 4, left: -12 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={t.gridStroke} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={v => `${v}`} />
              <Tooltip {...tooltipStyle} formatter={v => `${Number(v).toLocaleString()} FTE`} />
              <defs>
                <linearGradient id="allocG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={C.blue} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={C.blue} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="fte" stroke={C.blue} strokeWidth={2.5} fill="url(#allocG)" dot={{ r: 3, fill: C.blue }} name="Allocated FTE" />
            </AreaChart>
          </ResponsiveContainer>
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
                <span style={{ fontSize: 11, fontWeight: 700, color: t.text1, minWidth: 28, textAlign: "right" }}>{d.value}%</span>
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
          <div style={{ fontSize: 32, fontWeight: 800, color: t.text1, letterSpacing: "-0.03em" }}>27</div>
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
              <span style={{ fontSize: 18, fontWeight: 800, color: t.text1 }}>{overall}%</span>
              <span style={{ fontSize: 9, color: t.text3 }}>Overall</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {completeness.map(item => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: t.textSecondary, fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: t.text1 }}>{item.value}%</span>
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
              <span style={{ fontSize: 24, fontWeight: 800, color: t.text1, letterSpacing: "-0.03em" }}>74%</span>
            </div>
            <span style={{ fontSize: 11, color: t.text3 }}>Forecast Accuracy Score</span>
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
  // Use equal 1fr columns for all rows — ensures stable reflow when
  // the customize sidebar opens/closes without layout shift.
  return rowWidgets.map(() => "1fr").join(" ");
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Dashboard() {
   const { dark, t } = useTheme();

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
    // Pass saved view metadata to MyDashboard before navigating
    (window as any).__newSavedView = {
      name,
      widgetCount: ws.filter(w => w.checked).length,
      kpiCount: ks.filter(k => k.checked).length,
    };
    window.location.href = "/mydashboard";
  }, [widgets, kpiCards]);

  const handleLoadView = useCallback(index => {
    setSavedViews(sv => sv.map((v, i) => ({ ...v, active: i === index })));
    const view = savedViews[index];
    setWidgets(view.widgets.map(w => ({ ...w })));
    setKpiCards((view.kpiCards || DEFAULT_KPI_CARDS).map(k => ({ ...k })));
    setActiveViewName(view.name);
  }, [savedViews]);

  const filterDefs = [
    { label: "Pillars", key: "pillar",           options: ["All", "Hi-tech", "Retail", "Banking", "Healthcare", "Life Sciences"] },
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
      <div style={{ background: t.panel, borderBottom: `1px solid ${t.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text1, letterSpacing: "-0.02em" }}>Dashboard</h1>
          <div style={{ padding: "3px 10px", border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 12, color: t.text3 }}>☆</span>
            <span style={{ fontSize: 11, color: t.text2, fontWeight: 500 }}>{activeViewName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 0 3px ${C.greenSoft}` }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: C.green, letterSpacing: "0.08em", textTransform: "uppercase" }}>Live</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => setShowCalendar(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${t.border}`, borderRadius: 9, padding: "6px 12px", background: t.inputBg, fontSize: 11, color: t.text2, cursor: "pointer" }}>
            📅 {formatDateRange(dateStart, dateEnd)}
          </button>
          <button onClick={() => setShowCustomize(c => !c)}
            style={{ display: "flex", alignItems: "center", gap: 5, background: C.blue, border: "none", borderRadius: 9, padding: "7px 16px", fontSize: 12, cursor: "pointer", color: "#fff", fontWeight: 600 }}>
            ✦ Customize
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ background: t.panel, borderBottom: `1px solid ${t.border}`, padding: "7px 20px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
        {filterDefs.map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", border: `1px solid ${t.border}`, borderRadius: 8, background: t.inputBg, overflow: "hidden" }}>
            <span style={{ fontSize: 10, color: t.text3, padding: "0 8px", borderRight: `1px solid ${t.border}`, fontWeight: 500 }}>{f.label}</span>
            <select value={filters[f.key]} onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ fontSize: 11, border: "none", background: t.inputBg, padding: "5px 8px", color: t.text2, cursor: "pointer", outline: "none" }}>
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
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* ── Dashboard ── */}
        <div style={{ flex: 1, overflow: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>

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
              4: "Risk & Data Health",
            };
            return (
              <div key={rowNum}>
                {sectionLabels[rowNum] && <SectionLabel t={t}>{sectionLabels[rowNum]}</SectionLabel>}
                <div style={{ display: "grid", gridTemplateColumns: buildGridTemplate(rowWidgets), gap: 12, marginBottom: 6 }}>
                  {rowWidgets.map(w => (
                    <div key={w.id} style={{ minWidth: 0 }}>
                      {renderWidgetContent(w.id, t, dark)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        </div>

        {/* ── Customize Sidebar ── */}
        {showCustomize && (
          <div style={{ width: 296, minWidth: 296, background: t.panel, borderLeft: `1px solid ${t.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", transition: "width 0.2s ease" }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.text1 }}>Customize Dashboard</span>
              <button onClick={() => setShowCustomize(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: t.text3, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "flex", borderBottom: `1px solid ${t.border}`, padding: "0 16px" }}>
              {["widgets", "kpi"].map(tab => (
                <button key={tab} onClick={() => setCustomizeTab(tab)}
                  style={{ flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", background: "none", border: "none",
                    borderBottom: customizeTab === tab ? `2px solid ${C.blue}` : "2px solid transparent",
                    color: customizeTab === tab ? C.blue : t.text3, textTransform: "capitalize" }}>
                  {tab === "kpi" ? "KPI Cards" : "Widgets"}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

              {customizeTab === "widgets" && (
                <>
                  <p style={{ margin: 0, fontSize: 11, color: t.text3 }}>Toggle widgets on/off and drag to reorder.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }} onDragEnd={clearDrag}>
                    {widgets.map((w, i) => (
                      <DraggableWidgetRow key={w.id} widget={w} index={i} onToggle={toggleWidget}
                        onDragStart={handleWidgetDragStart} onDragOver={handleWidgetDragOver} onDrop={handleWidgetDrop}
                        isDraggingOver={activeDragGroup === "widget" && dragOverIndex === i && draggingIndex !== i}
                        isDragging={activeDragGroup === "widget" && draggingIndex === i} t={t} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={handleReset}
                      style={{
                        flex: 1, padding: "9px 0", fontSize: 11, fontWeight: 700,
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                        border: "none",
                        borderRadius: 8, cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                        letterSpacing: "0.03em",
                        transition: "filter 0.15s, box-shadow 0.15s, transform 0.12s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.12)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(37,99,235,0.5)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(37,99,235,0.35)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(0.98)"; }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px) scale(1)"; }}
                    >↺ Reset to Default</button>
                  </div>
                </>
              )}

              {customizeTab === "kpi" && (
                <>
                  <p style={{ margin: 0, fontSize: 11, color: t.text3 }}>Toggle KPI cards on/off and drag to reorder.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }} onDragEnd={clearDrag}>
                    {kpiCards.map((k, i) => (
                      <DraggableKpiRow key={k.id} kpi={k} index={i} onToggle={toggleKpi}
                        onDragStart={handleKpiDragStart} onDragOver={handleKpiDragOver} onDrop={handleKpiDrop}
                        isDraggingOver={activeDragGroup === "kpi" && dragOverIndex === i && draggingIndex !== i}
                        isDragging={activeDragGroup === "kpi" && draggingIndex === i} t={t} />
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={handleReset}
                      style={{
                        flex: 1, padding: "9px 0", fontSize: 11, fontWeight: 700,
                        color: "#ffffff",
                        background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                        border: "none",
                        borderRadius: 8, cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                        letterSpacing: "0.03em",
                        transition: "filter 0.15s, box-shadow 0.15s, transform 0.12s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.12)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(37,99,235,0.5)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(37,99,235,0.35)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(0.98)"; }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px) scale(1)"; }}
                    >↺ Reset to Default</button>
                  </div>
                </>
              )}

              {/* Saved Views */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: t.text1 }}>Saved Views</div>
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
                        background: v.active ? t.inputBg : t.card,
                        border: `1px solid ${v.active ? C.blue : t.border}`,
                        transition: "background .15s, border-color .15s" }}>
                      <span style={{ fontSize: 11, fontWeight: v.active ? 700 : 500, color: v.active ? C.blue : t.text2 }}>{v.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {v.active && <span style={{ fontSize: 13, color: C.amber }}>★</span>}
                        <span style={{ fontSize: 13, color: t.text3 }}>⋮</span>
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