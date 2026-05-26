import { useState, useRef, useCallback, useMemo, useEffect } from "react";
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
import {
  Users,
  Gauge,
  PieChart as PieChartIcon,
  UserCheck,
  UserX,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  C,
  capacityTrendData,
  utilizationData,
  riskData,
  topRisks,
  portfolioAlloc,
  utilTrendData,
  utilByDept,
  allocationByFn,
  forecastVsActuals,
  demandByPriority,
  allocationTrendData,
  alertsData,
  staffingData,
  completeness,
} from "@/mocks/dashboard.ts";

// ─── CSS custom properties — exact same system as ReportingAnalytics ──────────
function GlobalStyles() {
  return (
    <style>{`
      :root {
        --db-bg:           #f3f4f6;
        --db-surface:      #ffffff;
        --db-surface-alt:  #f9fafb;
        --db-border:       #e5e7eb;
        --db-border-light: #f3f4f6;
        --db-text-primary: #111827;
        --db-text-sec:     #374151;
        --db-text-muted:   #6b7280;
        --db-text-faint:   #9ca3af;
        --db-input-bg:     #ffffff;
        --db-overlay:      rgba(0,0,0,0.3);
        --db-drag-checked: #eff6ff;
        --db-drag-checked-border: #3b82f6;
        --db-drag-unchecked: #f9fafb;
        --db-hover-bg:     #f3f4f6;
        --db-section-label:#9ca3af;
        --db-row-alert:    #fff5f5;
      }
      .dark {
        --db-bg:           #0f1117;
        --db-surface:      #1a1d27;
        --db-surface-alt:  #1f2231;
        --db-border:       #2d3148;
        --db-border-light: #252838;
        --db-text-primary: #f1f5f9;
        --db-text-sec:     #cbd5e1;
        --db-text-muted:   #8b99b5;
        --db-text-faint:   #4f5b73;
        --db-input-bg:     #1f2231;
        --db-overlay:      rgba(0,0,0,0.6);
        --db-drag-checked: #1e2a3a;
        --db-drag-checked-border: #3b82f6;
        --db-drag-unchecked: #1a1d27;
        --db-hover-bg:     #252838;
        --db-section-label:#4f5b73;
        --db-row-alert:    #2a1a1a;
      }
      .dark .recharts-tooltip-wrapper .recharts-default-tooltip {
        background: #1a1d27 !important;
        border-color: #2d3148 !important;
        color: #f1f5f9 !important;
      }
      * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease; }
    `}</style>
  );
}

// ─── Token shorthands (CSS vars — auto dark/light, no JS logic needed) ────────
const T = {
  bg: "var(--db-bg)",
  surface: "var(--db-surface)",
  surfaceAlt: "var(--db-surface-alt)",
  border: "var(--db-border)",
  borderLight: "var(--db-border-light)",
  text: "var(--db-text-primary)",
  textSec: "var(--db-text-sec)",
  textMuted: "var(--db-text-muted)",
  textFaint: "var(--db-text-faint)",
  inputBg: "var(--db-input-bg)",
  overlay: "var(--db-overlay)",
  dragChecked: "var(--db-drag-checked)",
  dragCheckedBorder: "var(--db-drag-checked-border)",
  dragUnchecked: "var(--db-drag-unchecked)",
  hoverBg: "var(--db-hover-bg)",
  sectionLabel: "var(--db-section-label)",
  rowAlert: "var(--db-row-alert)",
  // semantic colours — vivid, same in both modes
  blue: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  teal: "#14b8a6",
  purple: "#8b5cf6",
  sky: "#0ea5e9",
  gray: "#6b7280",
};

// ─── Passive theme listener — watches <html class> set by profile dropdown ────
function resolveDark(): boolean {
  if (document.documentElement.classList.contains("dark")) return true;
  if (document.documentElement.classList.contains("light")) return false;
  try {
    for (const key of [
      "theme",
      "dashboard-theme",
      "color-theme",
      "app-theme",
    ]) {
      const v = localStorage.getItem(key);
      if (v === "dark") return true;
      if (v === "light") return false;
    }
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function useDark(): boolean {
  const [dark, setDark] = useState<boolean>(resolveDark);
  useEffect(() => {
    const mo = new MutationObserver(() => setDark(resolveDark()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const onStorage = (e: StorageEvent) => {
      if (
        ["theme", "dashboard-theme", "color-theme", "app-theme"].includes(
          e.key ?? "",
        )
      )
        setDark(resolveDark());
    };
    window.addEventListener("storage", onStorage);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onMq = () => setDark(resolveDark());
    mq.addEventListener("change", onMq);
    return () => {
      mo.disconnect();
      window.removeEventListener("storage", onStorage);
      mq.removeEventListener("change", onMq);
    };
  }, []);
  return dark;
}

// ─── KPI Cards data ───────────────────────────────────────────────────────────
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
    valueColor: T.blue,
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
    valueColor: T.green,
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
    valueColor: T.orange,
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
    valueColor: T.red,
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
    valueColor: T.purple,
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
    valueColor: T.amber,
    checked: true,
  },
  {
    id: "kpi_opendemand",
    icon: UserCheck,
    iconBg: "#e0f2fe",
    iconColor: T.sky,
    label: "Open Demands",
    value: "27",
    vsLabel: "vs Apr 2025",
    delta: "5.1%",
    deltaUp: false,
    valueColor: T.sky,
    checked: true,
  },
];

// ─── Widgets ──────────────────────────────────────────────────────────────────
const DEFAULT_WIDGETS = [
  {
    id: "capTrendLine",
    label: "Capacity & Demand Trend",
    checked: true,
    row: 1,
  },
  { id: "utilDonut", label: "Utilization Distribution", checked: true, row: 1 },
  { id: "utilDept", label: "Utilization by Department", checked: true, row: 1 },
  {
    id: "allocPortfolio",
    label: "Allocation by Portfolio",
    checked: true,
    row: 2,
  },
  { id: "allocByFn", label: "Allocation by Function", checked: true, row: 2 },
  { id: "forecastBar", label: "Forecast vs Actuals", checked: true, row: 2 },
  { id: "utilTrend", label: "Utilization Trend (%)", checked: true, row: 3 },
  { id: "allocTrend", label: "Allocation Trend", checked: true, row: 3 },
  { id: "demandPriority", label: "Demand by Priority", checked: true, row: 3 },
  { id: "forecastAcc", label: "Forecast Accuracy", checked: true, row: 4 },
  { id: "staffing", label: "Pending Staffing", checked: true, row: 4 },
  { id: "resourceRisk", label: "Resource Risks", checked: true, row: 4 },
];

const INITIAL_SAVED_VIEWS = [
  {
    name: "Default View",
    widgets: DEFAULT_WIDGETS,
    kpiCards: DEFAULT_KPI_CARDS,
    active: true,
  },
  {
    name: "Leadership View",
    widgets: DEFAULT_WIDGETS,
    kpiCards: DEFAULT_KPI_CARDS,
    active: false,
  },
  {
    name: "My Team View",
    widgets: DEFAULT_WIDGETS,
    kpiCards: DEFAULT_KPI_CARDS,
    active: false,
  },
  {
    name: "Weekly Planning",
    widgets: DEFAULT_WIDGETS,
    kpiCards: DEFAULT_KPI_CARDS,
    active: false,
  },
  {
    name: "Finance View",
    widgets: DEFAULT_WIDGETS,
    kpiCards: DEFAULT_KPI_CARDS,
    active: false,
  },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function formatDateRange(start, end) {
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}
function toInputValue(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromInputValue(s) {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, m - 1, day);
}

// alert colours — use CSS-var aware values so they adapt automatically
const alertTokens = {
  red: { bg: "rgba(239,68,68,0.10)", text: T.red, dot: T.red },
  orange: { bg: "rgba(249,115,22,0.10)", text: T.orange, dot: T.orange },
  amber: { bg: "rgba(245,158,11,0.10)", text: T.amber, dot: T.amber },
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        fontSize: 12,
        color: T.text,
        minWidth: 140,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6, color: T.textMuted }}>
        {label}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 2,
          }}
        >
          <span style={{ color: p.color }}>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Shared Components ────────────────────────────────────────────────────────
function DashSectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: T.sectionLabel,
        marginBottom: 12,
        paddingLeft: 2,
      }}
    >
      {children}
    </div>
  );
}

function CardShell({ title, subtitle, children }: any) {
  return (
    <div
      style={{
        background: T.surface,
        borderRadius: 14,
        border: `1px solid ${T.border}`,
        padding: "18px 18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
        boxSizing: "border-box",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: T.textFaint, marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function MiniBar({ value, max = 100, color = T.blue, height = 8 }) {
  return (
    <div
      style={{
        flex: 1,
        height,
        background: T.borderLight,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min((value / max) * 100, 100)}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width .3s",
        }}
      />
    </div>
  );
}

function KpiCard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
  valueColor,
  vsLabel,
  delta,
  deltaUp,
}) {
  return (
    <div
      style={{
        background: T.surface,
        borderRadius: 14,
        border: `1px solid ${T.border}`,
        padding: "16px 16px 14px",
        minWidth: 0,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: valueColor,
          borderRadius: "14px 14px 0 0",
        }}
      />
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Icon size={16} color={iconColor} />
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: valueColor,
          lineHeight: 1,
          marginBottom: 4,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 10,
          color: T.textFaint,
          lineHeight: 1.4,
          marginBottom: 6,
          minHeight: 28,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 10,
          color: T.textFaint,
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        {deltaUp ? (
          <ArrowUpRight size={11} color={T.green} />
        ) : (
          <ArrowDownRight size={11} color={T.red} />
        )}
        <span style={{ color: deltaUp ? T.green : T.red, fontWeight: 700 }}>
          {delta}
        </span>
        <span>{vsLabel}</span>
      </div>
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function CalendarModal({ startDate, endDate, onApply, onClose }: any) {
  const [start, setStart] = useState(toInputValue(startDate));
  const [end, setEnd] = useState(toInputValue(endDate));
  const [error, setError] = useState("");
  const handleApply = () => {
    if (!start || !end) {
      setError("Please select both dates.");
      return;
    }
    if (start > end) {
      setError("Start date must be before end date.");
      return;
    }
    onApply(fromInputValue(start), fromInputValue(end));
  };
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: T.overlay,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: T.surface,
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
          width: 360,
          padding: 28,
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
            Select Date Range
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: T.textMuted,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 16,
          }}
        >
          {[
            ["Start Date", start, setStart],
            ["End Date", end, setEnd],
          ].map(([label, val, setter]: any) => (
            <div key={label as string}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textSec,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {label}
              </label>
              <input
                type="date"
                value={val}
                onChange={(e) => {
                  setter(e.target.value);
                  setError("");
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  fontSize: 13,
                  border: `1px solid ${error ? T.red : T.border}`,
                  borderRadius: 8,
                  outline: "none",
                  color: T.text,
                  background: T.inputBg,
                }}
              />
            </div>
          ))}
        </div>
        {error && (
          <div style={{ fontSize: 11, color: T.red, marginBottom: 12 }}>
            {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              fontSize: 12,
              fontWeight: 600,
              color: T.textSec,
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: "8px 24px",
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              background: T.blue,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function SaveViewModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: T.overlay,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: T.surface,
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
          width: 400,
          padding: 28,
          border: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
            Save View
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 20,
              color: T.textMuted,
            }}
          >
            ×
          </button>
        </div>
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: T.textSec,
            display: "block",
            marginBottom: 6,
          }}
        >
          Report Name
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            (name.trim()
              ? onSave(name.trim())
              : setError("Please enter a report name."))
          }
          placeholder="e.g. My Custom View"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 12px",
            fontSize: 13,
            border: `1px solid ${error ? T.red : T.border}`,
            borderRadius: 8,
            outline: "none",
            color: T.text,
            background: T.inputBg,
          }}
        />
        {error && (
          <div style={{ fontSize: 11, color: T.red, marginTop: 4 }}>
            {error}
          </div>
        )}
        <div style={{ fontSize: 11, color: T.textFaint, margin: "16px 0" }}>
          Saves your current widget & KPI selection as a named view.
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              fontSize: 12,
              fontWeight: 600,
              color: T.textSec,
              background: T.surfaceAlt,
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() =>
              name.trim()
                ? onSave(name.trim())
                : setError("Please enter a report name.")
            }
            style={{
              padding: "8px 24px",
              fontSize: 12,
              fontWeight: 600,
              color: "#fff",
              background: T.blue,
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Draggable rows ───────────────────────────────────────────────────────────
function DraggableWidgetRow({
  widget,
  index,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver,
  isDragging,
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDrop={() => onDrop(index)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        borderRadius: 8,
        background: isDraggingOver
          ? T.hoverBg
          : widget.checked
            ? T.dragChecked
            : T.dragUnchecked,
        border: `1px solid ${isDraggingOver ? T.blue : widget.checked ? T.dragCheckedBorder : T.border}`,
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        transition: "background .15s, opacity .15s",
        userSelect: "none",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          flex: 1,
        }}
      >
        <input
          type="checkbox"
          checked={widget.checked}
          onChange={() => onToggle(widget.id)}
          style={{ accentColor: T.blue, width: 14, height: 14 }}
        />
        <span style={{ fontSize: 11, color: T.textSec, fontWeight: 500 }}>
          {widget.label}
        </span>
      </label>
      <span style={{ fontSize: 14, color: T.textMuted, cursor: "grab" }}>
        ⠿
      </span>
    </div>
  );
}

function DraggableKpiRow({
  kpi,
  index,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver,
  isDragging,
}) {
  const Icon = kpi.icon;
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDrop={() => onDrop(index)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        borderRadius: 8,
        background: isDraggingOver
          ? T.hoverBg
          : kpi.checked
            ? T.dragChecked
            : T.dragUnchecked,
        border: `1px solid ${isDraggingOver ? T.blue : kpi.checked ? T.dragCheckedBorder : T.border}`,
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        transition: "background .15s, opacity .15s",
        userSelect: "none",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          flex: 1,
        }}
      >
        <input
          type="checkbox"
          checked={kpi.checked}
          onChange={() => onToggle(kpi.id)}
          style={{ accentColor: T.blue, width: 14, height: 14 }}
        />
        <Icon size={12} color={kpi.iconColor} />
        <span style={{ fontSize: 11, color: T.textSec, fontWeight: 500 }}>
          {kpi.label}
        </span>
      </label>
      <span style={{ fontSize: 14, color: T.textMuted, cursor: "grab" }}>
        ⠿
      </span>
    </div>
  );
}

// ─── Widget Content Renderer ──────────────────────────────────────────────────
function renderWidgetContent(id) {
  const axisProps = { tick: { fontSize: 9, fill: T.textMuted } };
  const tooltipStyle = {
    contentStyle: {
      fontSize: 10,
      background: T.surface,
      border: `1px solid ${T.border}`,
      color: T.text,
      borderRadius: 8,
    },
  };

  switch (id) {
    case "capTrendLine":
      return (
        <CardShell title="Capacity & Demand Trend" subtitle="Jan – Jun 2026">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={capacityTrendData}
              margin={{ top: 4, right: 8, bottom: 4, left: -12 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke={T.borderLight} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 9, paddingTop: 8 }}
              />
              <Line
                type="monotone"
                dataKey="capacity"
                stroke={T.blue}
                strokeWidth={2.5}
                dot={{ r: 3, fill: T.blue, strokeWidth: 0 }}
                name="Total Capacity"
              />
              <Line
                type="monotone"
                dataKey="allocated"
                stroke={T.green}
                strokeWidth={2.5}
                dot={{ r: 3, fill: T.green, strokeWidth: 0 }}
                name="Allocated"
              />
              <Line
                type="monotone"
                dataKey="available"
                stroke={T.orange}
                strokeWidth={2.5}
                dot={{ r: 3, fill: T.orange, strokeWidth: 0 }}
                name="Available"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke={T.purple}
                strokeWidth={2}
                dot={{ r: 3, fill: T.purple, strokeWidth: 0 }}
                strokeDasharray="5 3"
                name="Forecast"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "utilDonut":
      return (
        <CardShell
          title="Utilization Distribution"
          subtitle="Current period breakdown"
        >
          <div style={{ position: "relative", height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={utilizationData}
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {utilizationData.map((e, i) => (
                    <Cell key={i} fill={e.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
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
              <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>
                78.4%
              </div>
              <div style={{ fontSize: 9, color: T.textMuted }}>Utilization</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {utilizationData.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 11,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: item.color,
                    }}
                  />
                  <span style={{ color: T.textSec }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: T.text }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "utilDept":
      return (
        <CardShell title="Utilization by Department">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              paddingTop: 4,
            }}
          >
            {utilByDept.map((d, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{ fontSize: 10.5, color: T.textSec, minWidth: 106 }}
                >
                  {d.dept}
                </span>
                <MiniBar
                  value={d.value}
                  max={100}
                  color={
                    d.value >= 85
                      ? T.blue
                      : d.value >= 75
                        ? T.teal
                        : d.value >= 65
                          ? T.amber
                          : T.gray
                  }
                  height={10}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.text,
                    minWidth: 28,
                    textAlign: "right",
                  }}
                >
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "allocPortfolio":
      return (
        <CardShell title="Allocation by Portfolio (FTE)">
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
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>
                  100
                </div>
                <div style={{ fontSize: 8, color: T.textMuted }}>FTE</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: T.textSec, flex: 1 }}>{d.name}</span>
                  <span style={{ fontWeight: 600, color: T.text }}>
                    {d.value}
                  </span>
                  <span style={{ color: T.textFaint }}>({d.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </CardShell>
      );

    case "allocByFn":
      return (
        <CardShell
          title="Allocation by Function"
          subtitle="Breakdown across teams"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allocationByFn.map((item) => (
              <div key={item.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: T.textSec, fontWeight: 500 }}>
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 700, color: T.text }}>
                    {item.allocated}%
                  </span>
                </div>
                <div
                  style={{
                    height: 7,
                    borderRadius: 99,
                    background: T.borderLight,
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${item.allocated}%`,
                      background: T.blue,
                      borderRadius: "99px 0 0 99px",
                    }}
                  />
                  <div
                    style={{ width: `${item.available}%`, background: T.green }}
                  />
                  <div
                    style={{
                      width: `${item.bench}%`,
                      background: T.orange,
                      borderRadius: "0 99px 99px 0",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            {[
              ["Allocated", T.blue],
              ["Available", T.green],
              ["Bench", T.orange],
            ].map(([l, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 10,
                  color: T.textMuted,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
                {l}
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "forecastBar":
      return (
        <CardShell title="Forecast vs Actuals" subtitle="Budget (K) comparison">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={forecastVsActuals}
              barSize={9}
              barCategoryGap="28%"
              margin={{ top: 4, right: 4, bottom: 4, left: -18 }}
            >
              <CartesianGrid
                strokeDasharray="2 2"
                stroke={T.borderLight}
                vertical={false}
              />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} tickFormatter={(v) => `${v}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 9, paddingTop: 6 }}
              />
              <Bar
                dataKey="planned"
                fill={T.blue}
                radius={[3, 3, 0, 0]}
                name="Planned"
              />
              <Bar
                dataKey="forecast"
                fill={T.green}
                radius={[3, 3, 0, 0]}
                name="Forecast"
              />
              <Bar
                dataKey="actual"
                fill={T.purple}
                radius={[3, 3, 0, 0]}
                name="Actuals"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "utilTrend":
      return (
        <CardShell title="Utilization Trend (%)">
          <ResponsiveContainer width="100%" height={165}>
            <AreaChart
              data={utilTrendData}
              margin={{ top: 4, right: 4, bottom: 4, left: -22 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke={T.borderLight} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis
                domain={[50, 100]}
                {...axisProps}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} />
              <defs>
                <linearGradient id="utilG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.purple} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={T.purple} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="rate"
                stroke={T.purple}
                strokeWidth={2.5}
                fill="url(#utilG)"
                dot={{ r: 4, fill: T.purple }}
                name="Utilization"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "allocTrend":
      return (
        <CardShell title="Allocation Trend" subtitle="Last 6 months">
          <ResponsiveContainer width="100%" height={155}>
            <AreaChart
              data={allocationTrendData}
              margin={{ top: 4, right: 8, bottom: 4, left: -12 }}
            >
              <CartesianGrid strokeDasharray="2 2" stroke={T.borderLight} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip
                {...tooltipStyle}
                formatter={(v) => `${Number(v).toLocaleString()} FTE`}
              />
              <defs>
                <linearGradient id="allocG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.blue} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={T.blue} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="fte"
                stroke={T.blue}
                strokeWidth={2.5}
                fill="url(#allocG)"
                dot={{ r: 3, fill: T.blue }}
                name="Allocated FTE"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardShell>
      );

    case "demandPriority":
      return (
        <CardShell title="Demand by Priority">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              paddingTop: 4,
            }}
          >
            {demandByPriority.map((d, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: T.textSec, fontWeight: 500 }}
                  >
                    {d.label}
                  </span>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: d.color }}
                  >
                    {d.value}
                  </span>
                </div>
                <MiniBar value={d.value} max={180} color={d.color} height={9} />
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "forecastAcc":
      return (
        <CardShell title="Forecast Accuracy" subtitle="Model performance score">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              paddingTop: 8,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                border: `9px solid ${T.blue}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 0 3px rgba(59,130,246,0.15)`,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: "-0.03em",
                }}
              >
                74%
              </span>
            </div>
            <span style={{ fontSize: 11, color: T.textMuted }}>
              Forecast Accuracy Score
            </span>
            <div
              style={{
                background: "rgba(16,185,129,0.12)",
                color: T.green,
                borderRadius: 99,
                padding: "4px 14px",
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <ArrowUpRight size={12} /> +3.6% vs Last Month
            </div>
          </div>
        </CardShell>
      );

    case "staffing":
      return (
        <CardShell
          title="Pending Staffing"
          subtitle="27 open staffing requests"
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: T.text,
              letterSpacing: "-0.03em",
            }}
          >
            27
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 4,
            }}
          >
            {staffingData.map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: T.textSec, fontWeight: 500 }}>
                    {s.label}
                  </span>
                  <span style={{ fontWeight: 700, color: s.color }}>
                    {s.count}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 99,
                    background: T.borderLight,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(s.count / 27) * 100}%`,
                      height: "100%",
                      background: s.color,
                      borderRadius: 99,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardShell>
      );

    case "resourceRisk":
      return (
        <CardShell title="Resource Risks">
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                position: "relative",
                width: 84,
                height: 84,
                flexShrink: 0,
              }}
            >
              <PieChart width={84} height={84}>
                <Pie
                  data={riskData}
                  cx={41}
                  cy={41}
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {riskData.map((d, i) => (
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
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>
                  24
                </div>
                <div style={{ fontSize: 7, color: T.textMuted }}>Risks</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {riskData.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10,
                    padding: "2px 0",
                    color: T.textSec,
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 2,
                        background: r.color,
                        display: "inline-block",
                      }}
                    />
                    {r.name}
                  </span>
                  <span style={{ fontWeight: 700, color: r.color }}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ paddingTop: 4, borderTop: `1px solid ${T.border}` }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.textSec,
                marginBottom: 6,
              }}
            >
              Top Risks
            </div>
            {topRisks.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 9.5,
                  color: T.textMuted,
                  padding: "2px 0",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: r.color,
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  {r.text}
                </span>
                <span
                  style={{ fontWeight: 700, color: r.color, marginLeft: 6 }}
                >
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      );

    default:
      return null;
  }
}

function buildGridTemplate(rowWidgets) {
  return rowWidgets.map(() => "1fr").join(" ");
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const dark = useDark(); // only used to force re-render when theme changes

  const [showCustomize, setShowCustomize] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [dateStart, setDateStart] = useState(new Date(2026, 4, 1));
  const [dateEnd, setDateEnd] = useState(new Date(2026, 4, 31));
  const [customizeTab, setCustomizeTab] = useState("widgets");
  const [activeViewName, setActiveViewName] = useState("Default View");
  const [filters, setFilters] = useState({
    pillar: "All",
    portfolio: "All",
    region: "All",
    dept: "All",
    resourceType: "All",
  });

  const [widgets, setWidgets] = useState(() =>
    DEFAULT_WIDGETS.map((w) => ({ ...w })),
  );
  const [kpiCards, setKpiCards] = useState(() =>
    DEFAULT_KPI_CARDS.map((k) => ({ ...k })),
  );
  const [savedViews, setSavedViews] = useState(() =>
    INITIAL_SAVED_VIEWS.map((v) => ({
      ...v,
      widgets: v.widgets.map((w) => ({ ...w })),
      kpiCards: (v.kpiCards || DEFAULT_KPI_CARDS).map((k) => ({ ...k })),
    })),
  );

  const widgetDragRef = useRef(null);
  const kpiDragRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [activeDragGroup, setActiveDragGroup] = useState(null);

  const toggleWidget = useCallback(
    (id) =>
      setWidgets((ws) =>
        ws.map((w) => (w.id === id ? { ...w, checked: !w.checked } : w)),
      ),
    [],
  );
  const toggleKpi = useCallback(
    (id) =>
      setKpiCards((ks) =>
        ks.map((k) => (k.id === id ? { ...k, checked: !k.checked } : k)),
      ),
    [],
  );

  const handleWidgetDragStart = useCallback((i) => {
    widgetDragRef.current = i;
    setDraggingIndex(i);
    setActiveDragGroup("widget");
  }, []);
  const handleWidgetDragOver = useCallback(
    (i) => {
      if (activeDragGroup === "widget") setDragOverIndex(i);
    },
    [activeDragGroup],
  );
  const handleWidgetDrop = useCallback((dropIdx) => {
    const from = widgetDragRef.current;
    if (from === null || from === dropIdx) {
      widgetDragRef.current = null;
      setDraggingIndex(null);
      setDragOverIndex(null);
      setActiveDragGroup(null);
      return;
    }
    setWidgets((prev) => {
      const n = [...prev];
      const [m] = n.splice(from, 1);
      n.splice(dropIdx, 0, m);
      return n;
    });
    widgetDragRef.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
    setActiveDragGroup(null);
  }, []);

  const handleKpiDragStart = useCallback((i) => {
    kpiDragRef.current = i;
    setDraggingIndex(i);
    setActiveDragGroup("kpi");
  }, []);
  const handleKpiDragOver = useCallback(
    (i) => {
      if (activeDragGroup === "kpi") setDragOverIndex(i);
    },
    [activeDragGroup],
  );
  const handleKpiDrop = useCallback((dropIdx) => {
    const from = kpiDragRef.current;
    if (from === null || from === dropIdx) {
      kpiDragRef.current = null;
      setDraggingIndex(null);
      setDragOverIndex(null);
      setActiveDragGroup(null);
      return;
    }
    setKpiCards((prev) => {
      const n = [...prev];
      const [m] = n.splice(from, 1);
      n.splice(dropIdx, 0, m);
      return n;
    });
    kpiDragRef.current = null;
    setDraggingIndex(null);
    setDragOverIndex(null);
    setActiveDragGroup(null);
  }, []);

  const clearDrag = useCallback(() => {
    setDraggingIndex(null);
    setDragOverIndex(null);
    setActiveDragGroup(null);
  }, []);

  const handleReset = useCallback(() => {
    setWidgets(DEFAULT_WIDGETS.map((w) => ({ ...w })));
    setKpiCards(DEFAULT_KPI_CARDS.map((k) => ({ ...k })));
    setActiveViewName("Default View");
  }, []);

  const handleSaveView = useCallback(
    (name) => {
      const ws = widgets.map((w) => ({ ...w }));
      const ks = kpiCards.map((k) => ({ ...k }));
      setSavedViews((prev) => {
        const idx = prev.findIndex((v) => v.name === name);
        if (idx >= 0)
          return prev.map((v, i) =>
            i === idx
              ? { ...v, widgets: ws, kpiCards: ks, active: true }
              : { ...v, active: false },
          );
        return [
          ...prev.map((v) => ({ ...v, active: false })),
          { name, widgets: ws, kpiCards: ks, active: true },
        ];
      });
      setActiveViewName(name);
      setShowSaveModal(false);
      (window as any).__newSavedView = {
        name,
        widgetCount: ws.filter((w) => w.checked).length,
        kpiCount: ks.filter((k) => k.checked).length,
      };
      window.location.href = "/mydashboard";
    },
    [widgets, kpiCards],
  );

  const handleLoadView = useCallback(
    (index) => {
      setSavedViews((sv) => sv.map((v, i) => ({ ...v, active: i === index })));
      const view = savedViews[index];
      setWidgets(view.widgets.map((w) => ({ ...w })));
      setKpiCards((view.kpiCards || DEFAULT_KPI_CARDS).map((k) => ({ ...k })));
      setActiveViewName(view.name);
    },
    [savedViews],
  );

  const filterDefs = [
    {
      label: "Pillars",
      key: "pillar",
      options: [
        "All",
        "Hi-tech",
        "Retail",
        "Banking",
        "Healthcare",
        "Life Sciences",
      ],
    },
    {
      label: "Portfolio",
      key: "portfolio",
      options: [
        "All",
        "Digital Transformation",
        "Cloud Services",
        "Data & Analytics",
        "Product Engineering",
      ],
    },
    {
      label: "Region",
      key: "region",
      options: ["All", "APAC", "EMEA", "AMER"],
    },
    {
      label: "Department",
      key: "dept",
      options: [
        "All",
        "Data Engineering",
        "QA Automation",
        "Cloud Engineering",
        "Application Development",
      ],
    },
    {
      label: "Resource Type",
      key: "resourceType",
      options: ["All", "Full Time", "Contract", "Vendor"],
    },
  ];

  const visibleKpiCards = useMemo(
    () => kpiCards.filter((k) => k.checked),
    [kpiCards],
  );
  const checkedWidgets = useMemo(
    () => widgets.filter((w) => w.checked),
    [widgets],
  );
  const widgetRows = useMemo(() => {
    const rowMap = new Map();
    for (const w of checkedWidgets) {
      const row = w.row ?? 1;
      if (!rowMap.has(row)) rowMap.set(row, []);
      rowMap.get(row).push(w);
    }
    return Array.from(rowMap.entries()).sort(([a], [b]) => a - b);
  }, [checkedWidgets]);

  const resetBtnStyle: any = {
    flex: 1,
    padding: "9px 0",
    fontSize: 11,
    fontWeight: 700,
    color: "#ffffff",
    background: T.blue,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    letterSpacing: "0.03em",
    transition: "filter 0.15s, transform 0.12s",
  };

  return (
    <>
      <GlobalStyles />
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showSaveModal && (
          <SaveViewModal
            onSave={handleSaveView}
            onClose={() => setShowSaveModal(false)}
          />
        )}
        {showCalendar && (
          <CalendarModal
            startDate={dateStart}
            endDate={dateEnd}
            onApply={(s, e) => {
              setDateStart(s);
              setDateEnd(e);
              setShowCalendar(false);
            }}
            onClose={() => setShowCalendar(false)}
          />
        )}

        {/* ── Header ── */}
        <div
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.02em",
              }}
            >
              Dashboard
            </h1>
            <div
              style={{
                padding: "3px 10px",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span style={{ fontSize: 12, color: T.textFaint }}>☆</span>
              <span style={{ fontSize: 11, color: T.textSec, fontWeight: 500 }}>
                {activeViewName}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: T.green,
                  boxShadow: `0 0 0 3px rgba(16,185,129,0.2)`,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: T.green,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Live
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setShowCalendar(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                border: `1px solid ${T.border}`,
                borderRadius: 9,
                padding: "6px 12px",
                background: T.inputBg,
                fontSize: 11,
                color: T.textSec,
                cursor: "pointer",
              }}
            >
              📅 {formatDateRange(dateStart, dateEnd)}
            </button>
            <button
              onClick={() => setShowCustomize((c) => !c)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: T.blue,
                border: "none",
                borderRadius: 9,
                padding: "7px 16px",
                fontSize: 12,
                cursor: "pointer",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              ✦ Customize
            </button>
          </div>
        </div>

        {/* ── Filters Bar ── */}
        <div
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
            padding: "7px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {filterDefs.map((f) => (
            <div
              key={f.key}
              style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                background: T.inputBg,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: T.textFaint,
                  padding: "0 8px",
                  borderRight: `1px solid ${T.border}`,
                  fontWeight: 500,
                }}
              >
                {f.label}
              </span>
              <select
                value={filters[f.key]}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, [f.key]: e.target.value }))
                }
                style={{
                  fontSize: 11,
                  border: "none",
                  background: T.inputBg,
                  padding: "5px 8px",
                  color: T.textSec,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={() => setShowSaveModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(59,130,246,0.1)",
                border: `1px solid rgba(59,130,246,0.3)`,
                borderRadius: 8,
                padding: "5px 12px",
                fontSize: 11,
                color: T.blue,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              💾 Save View
            </button>
          </div>
        </div>

        {/* ── Main Content + Sidebar ── */}
        <div
          style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
        >
          {/* ── Dashboard ── */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minWidth: 0,
            }}
          >
            {visibleKpiCards.length > 0 && (
              <>
                <DashSectionLabel>Key Performance Indicators</DashSectionLabel>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${Math.min(visibleKpiCards.length, 8)}, minmax(0, 1fr))`,
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  {visibleKpiCards.map((k) => (
                    <KpiCard key={k.id} {...k} />
                  ))}
                </div>
              </>
            )}

            {widgetRows.map(([rowNum, rowWidgets]) => {
              const sectionLabels: Record<number, string> = {
                1: "Capacity & Utilization",
                2: "Allocation & Forecast",
                3: "Trends & Demand",
                4: "Risk & Data Health",
              };
              return (
                <div key={rowNum}>
                  {sectionLabels[rowNum] && (
                    <DashSectionLabel>{sectionLabels[rowNum]}</DashSectionLabel>
                  )}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: buildGridTemplate(rowWidgets),
                      gap: 12,
                      marginBottom: 6,
                    }}
                  >
                    {rowWidgets.map((w) => (
                      <div key={w.id} style={{ minWidth: 0 }}>
                        {renderWidgetContent(w.id)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Customize Sidebar ── */}
          {showCustomize && (
            <div
              style={{
                width: 296,
                minWidth: 296,
                background: T.surface,
                borderLeft: `1px solid ${T.border}`,
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${T.border}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                  Customize Dashboard
                </span>
                <button
                  onClick={() => setShowCustomize(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 18,
                    color: T.textMuted,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  borderBottom: `1px solid ${T.border}`,
                  padding: "0 16px",
                }}
              >
                {["widgets", "kpi"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCustomizeTab(tab)}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      borderBottom:
                        customizeTab === tab
                          ? `2px solid ${T.blue}`
                          : "2px solid transparent",
                      color: customizeTab === tab ? T.blue : T.textMuted,
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "kpi" ? "KPI Cards" : "Widgets"}
                  </button>
                ))}
              </div>

              <div
                style={{
                  flex: 1,
                  overflow: "auto",
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {customizeTab === "widgets" && (
                  <>
                    <p style={{ margin: 0, fontSize: 11, color: T.textFaint }}>
                      Toggle widgets on/off and drag to reorder.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                      onDragEnd={clearDrag}
                    >
                      {widgets.map((w, i) => (
                        <DraggableWidgetRow
                          key={w.id}
                          widget={w}
                          index={i}
                          onToggle={toggleWidget}
                          onDragStart={handleWidgetDragStart}
                          onDragOver={handleWidgetDragOver}
                          onDrop={handleWidgetDrop}
                          isDraggingOver={
                            activeDragGroup === "widget" &&
                            dragOverIndex === i &&
                            draggingIndex !== i
                          }
                          isDragging={
                            activeDragGroup === "widget" && draggingIndex === i
                          }
                        />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={handleReset}
                        style={resetBtnStyle}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.filter =
                            "brightness(1.15)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.filter =
                            "none";
                        }}
                      >
                        ↺ Reset to Default
                      </button>
                    </div>
                  </>
                )}

                {customizeTab === "kpi" && (
                  <>
                    <p style={{ margin: 0, fontSize: 11, color: T.textFaint }}>
                      Toggle KPI cards on/off and drag to reorder.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                      onDragEnd={clearDrag}
                    >
                      {kpiCards.map((k, i) => (
                        <DraggableKpiRow
                          key={k.id}
                          kpi={k}
                          index={i}
                          onToggle={toggleKpi}
                          onDragStart={handleKpiDragStart}
                          onDragOver={handleKpiDragOver}
                          onDrop={handleKpiDrop}
                          isDraggingOver={
                            activeDragGroup === "kpi" &&
                            dragOverIndex === i &&
                            draggingIndex !== i
                          }
                          isDragging={
                            activeDragGroup === "kpi" && draggingIndex === i
                          }
                        />
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={handleReset}
                        style={resetBtnStyle}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.filter =
                            "brightness(1.15)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.filter =
                            "none";
                        }}
                      >
                        ↺ Reset to Default
                      </button>
                    </div>
                  </>
                )}

                {/* Saved Views */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{ fontSize: 12, fontWeight: 700, color: T.text }}
                    >
                      Saved Views
                    </div>
                    <button
                      onClick={() => setShowSaveModal(true)}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: T.blue,
                        background: "rgba(59,130,246,0.1)",
                        border: `1px solid rgba(59,130,246,0.3)`,
                        borderRadius: 6,
                        padding: "3px 8px",
                        cursor: "pointer",
                      }}
                    >
                      + Save Current
                    </button>
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {savedViews.map((v, i) => (
                      <div
                        key={i}
                        onClick={() => handleLoadView(i)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: v.active ? T.inputBg : T.surfaceAlt,
                          border: `1px solid ${v.active ? T.blue : T.border}`,
                          transition: "background .15s, border-color .15s",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: v.active ? 700 : 500,
                            color: v.active ? T.blue : T.textSec,
                          }}
                        >
                          {v.name}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          {v.active && (
                            <span style={{ fontSize: 13, color: T.amber }}>
                              ★
                            </span>
                          )}
                          <span style={{ fontSize: 13, color: T.textMuted }}>
                            ⋮
                          </span>
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
    </>
  );
}
