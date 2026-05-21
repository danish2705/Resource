import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
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
  { month: "Dec 2023", rate: 76 },
  { month: "Jan 2024", rate: 78 },
  { month: "Feb 2024", rate: 79 },
  { month: "Mar 2024", rate: 80 },
  { month: "Apr 2024", rate: 81 },
  { month: "May 2024", rate: 83 },
];

const allocationTrendData = [
  { month: "Dec 2023", fte: 6200 },
  { month: "Jan 2024", fte: 6400 },
  { month: "Feb 2024", fte: 6600 },
  { month: "Mar 2024", fte: 6800 },
  { month: "Apr 2024", fte: 7000 },
  { month: "May 2024", fte: 7100 },
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
  { id: "DM-1248", name: "AI Platform Implementation",  priority: "High",   skills: "Python, ML, Azure",         fte: 15, by: "Arjun N.", date: "Jun 15, 2024", status: "In Progress" },
  { id: "DM-1251", name: "Mobile App Revamp",           priority: "High",   skills: "React Native, iOS, Android", fte: 12, by: "Priya S.", date: "Jun 20, 2024", status: "Open"        },
  { id: "DM-1256", name: "Data Warehouse Migration",    priority: "Medium", skills: "SQL, ETL, Azure",            fte: 8,  by: "Karthik R.",date: "Jul 05, 2024", status: "Open"        },
  { id: "DM-1260", name: "Cloud Optimization",          priority: "Medium", skills: "AWS, DevOps",                fte: 6,  by: "Vimal K.", date: "Jul 10, 2024", status: "Not Started" },
];

const utilByDept = [
  { dept: "Engineering",  value: 89 },
  { dept: "Consulting",   value: 85 },
  { dept: "Data & Analytics", value: 83 },
  { dept: "Cloud Services",   value: 79 },
  { dept: "Product",      value: 75 },
  { dept: "Business Ops", value: 60 },
];

const ALL_WIDGETS = [
  { id: "capDemand",    label: "Capacity vs Demand Trend", checked: true  },
  { id: "utilTrend",    label: "Utilization Trend",        checked: true  },
  { id: "resourceRisk", label: "Resource Risks",           checked: true  },
  { id: "allocPortfolio",label: "Allocation by Portfolio", checked: true  },
  { id: "allocTrend",   label: "Allocation Trend",         checked: true  },
  { id: "benchAvail",   label: "Bench Availability",       checked: true  },
  { id: "demandPriority",label: "Demand by Priority",      checked: true  },
  { id: "recentDemands",label: "Recent Demands",           checked: true  },
  { id: "utilDept",     label: "Utilization by Department",checked: true  },
  { id: "budgetSummary",label: "Budget Summary",           checked: false },
  { id: "vendorSummary",label: "Vendor Summary",           checked: false },
];

const SAVED_VIEWS = [
  { name: "Default View",     active: true  },
  { name: "Leadership View",  active: false },
  { name: "My Team View",     active: false },
  { name: "Weekly Planning",  active: false },
  { name: "Finance View",     active: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    "In Progress": { bg: "#dbeafe", color: C.blue   },
    "Open":        { bg: "#dcfce7", color: C.green  },
    "Not Started": { bg: "#f3f4f6", color: C.gray   },
    "Closed":      { bg: "#f3f4f6", color: C.gray   },
  };
  const s = map[status] || map["Closed"];
  return (
    <span style={{ fontSize: 10, fontWeight: 600, color: s.color, background: s.bg, padding: "2px 8px", borderRadius: 10, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function priorityBadge(p) {
  const map = { High: C.red, Medium: C.amber, Low: C.green };
  const c = map[p] || C.gray;
  return <span style={{ fontSize: 10, fontWeight: 700, color: c }}>{p}</span>;
}

function MiniBar({ value, max = 100, color = C.blue, height = 8 }) {
  return (
    <div style={{ flex: 1, height, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: "100%", background: color, borderRadius: 4, transition: "width .3s" }} />
    </div>
  );
}

interface CardShellProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function CardShell({title, children, action,}: CardShellProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {title}
        </span>

        {action || (
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: 16,
              lineHeight: 1,
              padding: "0 2px",
            }}
          >
            ···
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, iconBg, label, value, valueColor, vsLabel, delta, deltaUp }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "14px 16px", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: 10, color: "#64748b", lineHeight: 1.3 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: valueColor || "#0f172a", lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 10, color: "#94a3b8" }}>
        {vsLabel}&nbsp;
        <span style={{ color: deltaUp ? C.green : C.red, fontWeight: 600 }}>
          {deltaUp ? "▲" : "▼"} {delta}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyDashboard() {
  const [showCustomize, setShowCustomize] = useState(false);
  const [widgets, setWidgets] = useState(ALL_WIDGETS);
  const [customizeTab, setCustomizeTab] = useState("widgets");
  const [savedViews, setSavedViews] = useState(SAVED_VIEWS);

  const [filters, setFilters] = useState({
    bu: "All", portfolio: "All", region: "All", dept: "All", resourceType: "All",
  });

  const isVisible = (id) => widgets.find(w => w.id === id)?.checked;

  const toggleWidget = (id) => {
    setWidgets(ws => ws.map(w => w.id === id ? { ...w, checked: !w.checked } : w));
  };

  const filterDefs = [
    { label: "Business Unit", key: "bu",           options: ["All","Engineering","Consulting","Products","Operations"] },
    { label: "Portfolio",      key: "portfolio",    options: ["All","Digital Transformation","Cloud Services","Data & Analytics","Product Engineering"] },
    { label: "Region",         key: "region",       options: ["All","APAC","EMEA","AMER"] },
    { label: "Department",     key: "dept",         options: ["All","Data Engineering","QA Automation","Cloud Engineering","Application Development"] },
    { label: "Resource Type",  key: "resourceType", options: ["All","Full Time","Contract","Vendor"] },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* ── Page Header ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>My Dashboard</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 12 }}>☆</span>
            <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>Default View</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", color: "#374151", fontWeight: 500 }}>
            <span>＋</span> Add Widget
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 14px", fontSize: 12, cursor: "pointer", color: "#374151", fontWeight: 500 }}>
            <span>↗</span> Share
          </button>
          <button
            onClick={() => setShowCustomize(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: C.blue, border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, cursor: "pointer", color: "#fff", fontWeight: 600 }}
          >
            ✦ Customize
          </button>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "8px 20px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
        {filterDefs.map(f => (
          <div key={f.key} style={{ display: "flex", alignItems: "center", border: "1px solid #e2e8f0", borderRadius: 8, background: "#f8fafc", overflow: "hidden" }}>
            <span style={{ fontSize: 10, color: "#64748b", padding: "0 8px", borderRight: "1px solid #e2e8f0", fontWeight: 500 }}>{f.label}</span>
            <select
              value={filters[f.key]}
              onChange={e => setFilters(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ fontSize: 11, border: "none", background: "transparent", padding: "6px 8px", color: "#374151", cursor: "pointer", outline: "none" }}
            >
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, border: "1px solid #e2e8f0", borderRadius: 8, padding: "5px 10px", background: "#f8fafc", fontSize: 11, color: "#374151" }}>
            📅 May 1 – May 31, 2024 <span style={{ color: "#94a3b8" }}>▼</span>
          </div>
          <button style={{ fontSize: 11, color: C.red, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>⊗ Reset</button>
          <button style={{ display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "5px 12px", fontSize: 11, color: C.blue, fontWeight: 600, cursor: "pointer" }}>
            💾 Save View
          </button>
        </div>
      </div>

      {/* ── Main Content + Sidebar ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Dashboard Content ── */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* KPI Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 10 }}>
            <KpiCard icon="👥" iconBg="#dbeafe" label="Total Resources (FTE)" value="8,532" vsLabel="vs Apr 2024" delta="2.3%" deltaUp={true}  valueColor={C.blue}/>
            <KpiCard icon="🏗️" iconBg="#d1fae5" label="Total Capacity (FTE)"  value="7,427" vsLabel="vs Apr 2024" delta="1.8%" deltaUp={true}  valueColor={C.green}/>
            <KpiCard icon="📋" iconBg="#fed7aa" label="Total Demand (FTE)"    value="8,016" vsLabel="vs Apr 2024" delta="3.6%" deltaUp={true}  valueColor={C.orange} />
            <KpiCard icon="⚡" iconBg="#fee2e2" label="Capacity Gap (FTE)"    value="-589"  vsLabel="vs Apr 2024" delta="4.7%" deltaUp={false} valueColor={C.red}    />
            <KpiCard icon="💲" iconBg="#ede9fe" label="Utilization"           value="83%"   vsLabel="vs Apr 2024" delta="2pp"  deltaUp={true}  valueColor={C.purple} />
            <KpiCard icon="⚠️" iconBg="#fef3c7" label="Over Allocated (FTE)"  value="312"   vsLabel="vs Apr 2024" delta="3.2%" deltaUp={false} valueColor={C.amber}  />
            <KpiCard icon="📂" iconBg="#e0f2fe" label="Open Demands"          value="412"   vsLabel="vs Apr 2024" delta="5.1%" deltaUp={false} valueColor={C.sky}    />
          </div>

          {/* Row 1: Cap/Demand + Utilization + Resource Risks */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.9fr", gap: 12 }}>

            {isVisible("capDemand") && (
              <CardShell title="Capacity vs Demand Trend (FTE)">
                <div style={{ display: "flex", gap: 12, marginBottom: 2 }}>
                  {[["Total Capacity (FTE)",C.blue],["Total Demand (FTE)",C.orange],["Gap (FTE)",C.red]].map(([l,c])=>(
                    <span key={l} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, color:"#64748b" }}>
                      <span style={{ width:20, height:3, background:c, display:"inline-block", borderRadius:2 }}/>{l}
                    </span>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={195}>
                  <BarChart data={capDemandData} margin={{ top:5, right:5, bottom:5, left:-15 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize:8 }} />
                    <YAxis tick={{ fontSize:8 }} tickFormatter={v => v < 0 ? v : `${(v/1000).toFixed(1)}K`} />
                    <Tooltip contentStyle={{ fontSize:10 }} formatter={v => `${v.toLocaleString()} FTE`} />
                    <Bar dataKey="Capacity" fill={C.blue}   radius={[2,2,0,0]} name="Capacity" />
                    <Bar dataKey="Demand"   fill={C.orange} radius={[2,2,0,0]} name="Demand"   />
                    <Bar dataKey="Gap"      fill={C.red}    radius={[2,2,0,0]} name="Gap"      />
                  </BarChart>
                </ResponsiveContainer>
              </CardShell>
            )}

            {isVisible("utilTrend") && (
              <CardShell title="Utilization Trend (%)">
                <ResponsiveContainer width="100%" height={215}>
                  <LineChart data={utilTrendData} margin={{ top:5, right:5, bottom:5, left:-20 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize:8 }} />
                    <YAxis domain={[50,100]} tick={{ fontSize:8 }} tickFormatter={v=>`${v}%`} />
                    <Tooltip contentStyle={{ fontSize:10 }} formatter={v=>`${v}%`} />
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
            )}

            {isVisible("resourceRisk") && (
              <CardShell title="Resource Risks">
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ position:"relative", width:88, height:88, flexShrink:0 }}>
                    <PieChart width={88} height={88}>
                      <Pie data={riskData} cx={43} cy={43} innerRadius={27} outerRadius={42} dataKey="value" startAngle={90} endAngle={-270}>
                        {riskData.map((d,i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                      <div style={{ fontSize:16, fontWeight:800, color:"#0f172a" }}>24</div>
                      <div style={{ fontSize:7, color:"#94a3b8" }}>Total Risks</div>
                    </div>
                  </div>
                  <div style={{ flex:1 }}>
                    {riskData.map((r,i) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:10, padding:"2px 0", color:"#374151" }}>
                        <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <span style={{ width:7, height:7, borderRadius:2, background:r.color, display:"inline-block" }} />{r.name}
                        </span>
                        <span style={{ fontWeight:700, color:r.color }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"#374151", marginBottom:6, marginTop:4 }}>Top Risks</div>
                  {topRisks.map((r,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:9.5, color:"#64748b", padding:"2px 0" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:r.color, display:"inline-block", flexShrink:0 }} />
                        {r.text}
                      </span>
                      <span style={{ fontWeight:700, color:r.color, marginLeft:6 }}>{r.count}</span>
                    </div>
                  ))}
                </div>
              </CardShell>
            )}
          </div>

          {/* Row 2: Allocation by Portfolio + Allocation Trend + Bench Availability + Demand by Priority */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 0.7fr 0.9fr", gap:12 }}>

            {isVisible("allocPortfolio") && (
              <CardShell title="Allocation by Portfolio (FTE)">
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ position:"relative", width:110, height:110, flexShrink:0 }}>
                    <PieChart width={110} height={110}>
                      <Pie data={portfolioAlloc} cx={54} cy={54} innerRadius={32} outerRadius={52} dataKey="value" startAngle={90} endAngle={-270}>
                        {portfolioAlloc.map((d,i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                      <div style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>7,115</div>
                      <div style={{ fontSize:8, color:"#94a3b8" }}>FTE</div>
                    </div>
                  </div>
                  <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
                    {portfolioAlloc.map((d,i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:5, fontSize:9.5 }}>
                        <span style={{ width:7, height:7, borderRadius:2, background:d.color, flexShrink:0 }} />
                        <span style={{ color:"#374151", flex:1 }}>{d.name}</span>
                        <span style={{ fontWeight:600, color:"#0f172a" }}>{d.value.toLocaleString()}</span>
                        <span style={{ color:"#94a3b8" }}>({d.pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardShell>
            )}

            {isVisible("allocTrend") && (
              <CardShell title="Allocation Trend (Last 6 Months)">
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={allocationTrendData} margin={{ top:5, right:10, bottom:5, left:-10 }}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize:8 }} />
                    <YAxis tick={{ fontSize:8 }} tickFormatter={v=>`${(v/1000).toFixed(1)}K`} />
                    <Tooltip contentStyle={{ fontSize:10 }} formatter={v=>`${v.toLocaleString()} FTE`} />
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
            )}

            {isVisible("benchAvail") && (
              <CardShell title="Bench Availability">
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                  <div style={{ position:"relative", width:110, height:110 }}>
                    <PieChart width={110} height={110}>
                      <Pie data={[{value:78.4},{value:21.6}]} cx={54} cy={54} innerRadius={34} outerRadius={52} dataKey="value" startAngle={90} endAngle={-270}>
                        <Cell fill={C.green} />
                        <Cell fill="#e2e8f0" />
                      </Pie>
                    </PieChart>
                    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                      <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>1,842</div>
                      <div style={{ fontSize:8,  color:"#94a3b8" }}>FTE</div>
                    </div>
                  </div>
                  <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:5 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#374151", alignItems:"center" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ width:7, height:7, borderRadius:2, background:C.green }} /> Available
                      </span>
                      <span style={{ fontWeight:700, color:C.green }}>1,842 (78.4%)</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#374151", alignItems:"center" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <span style={{ width:7, height:7, borderRadius:2, background:C.gray }} /> Shared Resources
                      </span>
                      <span style={{ fontWeight:700, color:C.gray }}>2,315 (21.6%)</span>
                    </div>
                  </div>
                </div>
              </CardShell>
            )}

            {isVisible("demandPriority") && (
              <CardShell title="Demand by Priority">
                <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
                  {demandByPriority.map((d,i) => (
                    <div key={i}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:11, color:"#374151", fontWeight:500 }}>{d.label}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:d.color }}>{d.value}</span>
                      </div>
                      <MiniBar value={d.value} max={180} color={d.color} height={10} />
                    </div>
                  ))}
                </div>
              </CardShell>
            )}
          </div>

          {/* Row 3: Recent Demands + Utilization by Department */}
          <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:12 }}>

            {isVisible("recentDemands") && (
              <CardShell title="Recent Demands">
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"#f8fafc" }}>
                      {["Demand ID","Demand Name","Priority","Required Skills","Required FTE","Requested By","Target Date","Status"].map(h => (
                        <th key={h} style={{ textAlign:"left", padding:"6px 8px", fontSize:9, color:"#64748b", fontWeight:600, borderBottom:"1px solid #e2e8f0", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentDemands.map((r,i) => (
                      <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}>
                        <td style={{ padding:"8px 8px", fontSize:10, color:C.blue, fontWeight:600, whiteSpace:"nowrap" }}>{r.id}</td>
                        <td style={{ padding:"8px 8px", fontSize:11, color:"#0f172a", fontWeight:500 }}>{r.name}</td>
                        <td style={{ padding:"8px 8px" }}>{priorityBadge(r.priority)}</td>
                        <td style={{ padding:"8px 8px", fontSize:10, color:"#64748b" }}>{r.skills}</td>
                        <td style={{ padding:"8px 8px", fontSize:11, fontWeight:700, color:"#0f172a", textAlign:"center" }}>{r.fte}</td>
                        <td style={{ padding:"8px 8px", fontSize:10, color:"#374151" }}>{r.by}</td>
                        <td style={{ padding:"8px 8px", fontSize:10, color:"#64748b", whiteSpace:"nowrap" }}>{r.date}</td>
                        <td style={{ padding:"8px 8px" }}>{statusBadge(r.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardShell>
            )}

            {isVisible("utilDept") && (
              <CardShell title="Utilization by Department">
                <div style={{ display:"flex", flexDirection:"column", gap:10, paddingTop:4 }}>
                  {utilByDept.map((d,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:11, color:"#374151", minWidth:110 }}>{d.dept}</span>
                      <MiniBar value={d.value} max={100} color={d.value >= 85 ? C.blue : d.value >= 75 ? C.teal : d.value >= 65 ? C.amber : C.gray} height={12} />
                      <span style={{ fontSize:11, fontWeight:700, color:"#0f172a", minWidth:30, textAlign:"right" }}>{d.value}%</span>
                    </div>
                  ))}
                </div>
                {/* X-axis labels */}
                <div style={{ display:"flex", justifyContent:"space-between", paddingLeft:120, paddingRight:36, marginTop:4 }}>
                  {["0%","25%","50%","75%","100%"].map(l => (
                    <span key={l} style={{ fontSize:9, color:"#94a3b8" }}>{l}</span>
                  ))}
                </div>
              </CardShell>
            )}
          </div>

        </div>

        {/* ── Customize Sidebar ── */}
        {showCustomize && (
          <div style={{ width: 300, background: "#fff", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            {/* Sidebar header */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Customize Dashboard</span>
              <button onClick={() => setShowCustomize(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94a3b8", lineHeight: 1 }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", padding: "0 16px" }}>
              {["widgets","layout"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setCustomizeTab(tab)}
                  style={{
                    flex: 1, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer", background: "none", border: "none",
                    borderBottom: customizeTab === tab ? `2px solid ${C.blue}` : "2px solid transparent",
                    color: customizeTab === tab ? C.blue : "#64748b",
                    textTransform: "capitalize",
                  }}
                >{tab}</button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

              {customizeTab === "widgets" && (
                <>
                  <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Add or remove widgets from your dashboard</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {widgets.map(w => (
                      <div key={w.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, background: w.checked ? "#f0f9ff" : "#f8fafc", border: `1px solid ${w.checked ? "#bae6fd" : "#e2e8f0"}` }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={w.checked}
                            onChange={() => toggleWidget(w.id)}
                            style={{ accentColor: C.blue, width: 14, height: 14 }}
                          />
                          <span style={{ fontSize: 11, color: "#374151", fontWeight: 500 }}>{w.label}</span>
                        </label>
                        <span style={{ fontSize: 14, color: "#94a3b8", cursor: "grab" }}>⠿</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                    <button
                      onClick={() => setWidgets(ws => ws.map(w => ({ ...w, checked: ALL_WIDGETS.find(a => a.id === w.id)?.checked ?? w.checked })))}
                      style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 600, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}
                    >Reset to Default</button>
                    <button style={{ flex: 1, padding: "8px", fontSize: 11, fontWeight: 600, color: "#fff", background: C.blue, border: "none", borderRadius: 8, cursor: "pointer" }}>Apply</button>
                  </div>
                </>
              )}

              {customizeTab === "layout" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Drag widgets to rearrange your layout</p>
                  {widgets.filter(w => w.checked).map(w => (
                    <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", cursor: "grab" }}>
                      <span style={{ fontSize: 14, color: "#94a3b8" }}>⠿</span>
                      <span style={{ fontSize: 11, color: "#374151", fontWeight: 500, flex: 1 }}>{w.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Saved Views */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Saved Views</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {savedViews.map((v, i) => (
                    <div
                      key={i}
                      onClick={() => setSavedViews(sv => sv.map((s, j) => ({ ...s, active: j === i })))}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "9px 12px", borderRadius: 8, cursor: "pointer",
                        background: v.active ? "#eff6ff" : "#f8fafc",
                        border: `1px solid ${v.active ? "#bfdbfe" : "#e2e8f0"}`,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: v.active ? 700 : 500, color: v.active ? C.blue : "#374151" }}>{v.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {v.active && <span style={{ fontSize: 14, color: C.amber }}>★</span>}
                        <span style={{ fontSize: 14, color: "#94a3b8" }}>⋮</span>
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