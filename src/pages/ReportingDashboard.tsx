import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = {
  blue: "#378ADD", green: "#639922", orange: "#BA7517", red: "#E24B4A",
  purple: "#7F77DD", teal: "#1D9E75", gray: "#888780", amber: "#EF9F27",
};

const kpis = [
  { label: "Total Resources (FTE)", value: "8,532", delta: "+2.3%", deltaUp: true, icon: "👥", color: COLORS.blue },
  { label: "Total Capacity (FTE)", value: "7,427", delta: "+1.8%", deltaUp: true, icon: "🏗️", color: COLORS.teal },
  { label: "Total Demand (FTE)", value: "8,016", delta: "+3.6%", deltaUp: true, icon: "📋", color: COLORS.orange },
  { label: "Capacity Gap (FTE)", value: "-589", delta: "-4.7%", deltaUp: false, icon: "📉", color: COLORS.red },
  { label: "Utilization", value: "83%", delta: "+2pp", deltaUp: true, icon: "📈", color: COLORS.purple },
  { label: "Over Allocated (FTE)", value: "312", delta: "-3.2%", deltaUp: true, icon: "⚠️", color: COLORS.amber },
  { label: "Open Demands", value: "412", delta: "-5.1%", deltaUp: true, icon: "📂", color: COLORS.blue },
  { label: "Projects On Track", value: "78%", delta: "+3pp", deltaUp: true, icon: "✅", color: COLORS.green },
];

const capacityDemandTrend = [
  { month: "Dec 23", Capacity: 7100, Demand: 7300, Gap: -200 },
  { month: "Jan 24", Capacity: 7200, Demand: 7500, Gap: -300 },
  { month: "Feb 24", Capacity: 7300, Demand: 7700, Gap: -400 },
  { month: "Mar 24", Capacity: 7700, Demand: 7800, Gap: -100 },
  { month: "Apr 24", Capacity: 7350, Demand: 8000, Gap: -650 },
  { month: "May 24", Capacity: 7427, Demand: 8016, Gap: -589 },
];

const utilizationTrend = [
  { month: "Dec 23", rate: 76 },
  { month: "Jan 24", rate: 78 },
  { month: "Feb 24", rate: 80 },
  { month: "Mar 24", rate: 81 },
  { month: "Apr 24", rate: 83 },
  { month: "May 24", rate: 83 },
];

const workforceRisks = [
  { name: "High Risk", value: 7, color: COLORS.red },
  { name: "Medium Risk", value: 8, color: COLORS.orange },
  { name: "Low Risk", value: 6, color: COLORS.amber },
  { name: "Informational", value: 3, color: COLORS.blue },
];

const portfolioReadiness = [
  { portfolio: "Digital Transformation", onTrack: 14, atRisk: 6, offTrack: 3, readiness: "72%" },
  { portfolio: "Product Engineering", onTrack: 12, atRisk: 4, offTrack: 2, readiness: "80%" },
  { portfolio: "Cloud Services", onTrack: 8, atRisk: 3, offTrack: 2, readiness: "77%" },
  { portfolio: "Data & Analytics", onTrack: 6, atRisk: 3, offTrack: 1, readiness: "67%" },
  { portfolio: "Business Applications", onTrack: 5, atRisk: 2, offTrack: 1, readiness: "75%" },
];

const reportCards = [
  {
    num: 1, title: "Executive Leadership Report",
    desc: "Enterprise view of performance, risks, gaps & portfolio readiness",
    execStats: [
      { label: "Capacity Gap", value: "-589 FTE", color: COLORS.red },
      { label: "Workforce Risk", value: "High", color: COLORS.red },
      { label: "Portfolio Readiness", value: "78%", color: COLORS.green },
    ],
    icon: "🎯", color: COLORS.purple,
  },
  {
    num: 2, title: "Resource Management Dashboard",
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
    icon: "🏢", color: COLORS.teal,
  },
  {
    num: 3, title: "Resource Planning Dashboard",
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
    icon: "📊", color: COLORS.blue,
  },
  {
    num: 4, title: "Resource Allocation Report",
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
    icon: "🥧", color: COLORS.purple,
  },
  {
    num: 5, title: "Resource Over-Allocation Report",
    desc: "Report for showing resources over-allocation",
    overList: [
      { name: "John Smith", pct: 132, color: COLORS.red },
      { name: "Priya Patel", pct: 128, color: COLORS.red },
      { name: "Ravi Kumar", pct: 118, color: COLORS.orange },
      { name: "Anita Desai", pct: 116, color: COLORS.orange },
      { name: "Carlos M.", pct: 112, color: COLORS.amber },
    ],
    highlight: "312 FTE",
    icon: "🚨", color: COLORS.red,
  },
  {
    num: 6, title: "Resource Availability & Shared Resources",
    desc: "Report for showing resources shared across projects with availability",
    availability: { available: "1,842 FTE", shared: "2,315 FTE", bench: "1,842 (24.8%)" },
    icon: "🔗", color: COLORS.teal,
  },
  {
    num: 7, title: "Monthly Compliance Report",
    desc: "Report for showing monthly compliance details",
    compliance: 92,
    items: [
      { label: "Timesheet Submission", value: 96 },
      { label: "Allocation Adherence", value: 91 },
      { label: "Manager Approval", value: 93 },
      { label: "Data Quality", value: 88 },
    ],
    icon: "✅", color: COLORS.green,
  },
  {
    num: 8, title: "Budget Variance Report",
    desc: "Report for showing budget variance",
    budget: { total: "$24.80M", actual: "$20.36M", variance: "-$4.44M", varPct: "-17.9%" },
    budgetRows: [
      { name: "Digital Transformation", variance: -1.2 },
      { name: "Product Engineering", variance: -1.12 },
      { name: "Cloud Services", variance: -0.95 },
      { name: "Data & Analytics", variance: -0.73 },
      { name: "Business Applications", variance: -0.42 },
    ],
    icon: "💲", color: COLORS.orange,
  },
  {
    num: 9, title: "Vendor Ranking Report",
    desc: "Report for showing vendor ranking report based on budget spent",
    vendors: [
      { name: "Tech Mahindra", spend: "$3.21M", rank: 1, score: 92 },
      { name: "Tata Consultancy Svcs", spend: "$2.98M", rank: 2, score: 88 },
      { name: "Infosys", spend: "$2.25M", rank: 3, score: 85 },
      { name: "Wipro", spend: "$1.89M", rank: 4, score: 80 },
      { name: "HCL Technologies", spend: "$1.46M", rank: 5, score: 78 },
    ],
    icon: "🏆", color: COLORS.amber,
  },
  {
    num: 10, title: "Demand Management Dashboard",
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
    icon: "📋", color: COLORS.blue,
  },
  {
    num: 11, title: "Forecasting & Capacity Planning",
    desc: "Forecast demand vs capacity & identify future gaps",
    forecastData: [
      { month: "May 24", cap: 8.0, demand: 8.9, gap: -0.9 },
      { month: "Jun 24", cap: 8.3, demand: 9.1, gap: -0.8 },
      { month: "Jul 24", cap: 8.5, demand: 9.3, gap: -0.8 },
      { month: "Aug 24", cap: 6.9, demand: 8.7, gap: -1.8 },
      { month: "Sep 24", cap: 6.9, demand: 8.8, gap: -0.9 },
      { month: "Oct 24", cap: 7.5, demand: 8.4, gap: -0.9 },
    ],
    icon: "🔮", color: COLORS.purple,
  },
  {
    num: 12, title: "Utilization Dashboard",
    desc: "Measure resource utilization across teams, roles & work types",
    utilOverall: 83,
    utilByType: [
      { label: "Project Work", value: 86 },
      { label: "BAU Work", value: 78 },
      { label: "Internal Initiatives", value: 74 },
      { label: "Training", value: 65 },
    ],
    icon: "📈", color: COLORS.teal,
  },
  {
    num: 13, title: "Timesheet & Actuals Dashboard",
    desc: "Compare planned allocations vs actual efforts",
    tsCompliance: 96,
    tsBreakdown: [
      { label: "On track", pct: 66, color: COLORS.green },
      { label: "Over", pct: 20, color: COLORS.red },
      { label: "Under", pct: 10, color: COLORS.orange },
    ],
    actualFTE: "2,850",
    icon: "⏱️", color: COLORS.blue,
  },
  {
    num: 14, title: "Governance & Approval Dashboard",
    desc: "Monitor approvals, exceptions & workflow status",
    pending: 27, overdue: 12,
    byType: [
      { label: "Resource Requests", value: 12 },
      { label: "Project Requests", value: 7 },
      { label: "Allocation Changes", value: 5 },
      { label: "Time Off Requests", value: 3 },
    ],
    icon: "🔐", color: COLORS.amber,
  },
  {
    num: 15, title: "Reports Hub",
    desc: "Access all reports in one place",
    hub: true,
    icon: "🗂️", color: COLORS.gray,
  },
];

const DONUT_COLORS = [COLORS.blue, COLORS.teal, COLORS.orange, COLORS.purple, COLORS.green, COLORS.gray];

function KpiCard({ kpi }) {
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "12px 14px",
      display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.3 }}>{kpi.label}</span>
        <span style={{ fontSize: 18 }}>{kpi.icon}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color, lineHeight: 1.1 }}>{kpi.value}</div>
      <div style={{ fontSize: 11, color: kpi.deltaUp ? COLORS.green : COLORS.red }}>
        {kpi.delta} <span style={{ color: "#9ca3af" }}>vs Apr 2024</span>
      </div>
    </div>
  );
}

function MiniBar({ value, max = 100, color = COLORS.blue }) {
  return (
    <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 3 }} />
    </div>
  );
}

function SmallDonut({ data, centerLabel, centerSub, size = 90 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <PieChart width={size} height={size}>
        <Pie data={data} cx={size / 2 - 1} cy={size / 2 - 1} innerRadius={size * 0.3} outerRadius={size * 0.47}
          dataKey="value" startAngle={90} endAngle={-270}>
          {data.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
        </Pie>
      </PieChart>
      {centerLabel && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", pointerEvents: "none",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#111", lineHeight: 1 }}>{centerLabel}</div>
          {centerSub && <div style={{ fontSize: 8, color: "#6b7280", lineHeight: 1.2 }}>{centerSub}</div>}
        </div>
      )}
    </div>
  );
}

function ReportCard({ card, onView }) {
  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "14px",
      display: "flex", flexDirection: "column", gap: 10, minHeight: 220,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: card.color + "22",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
        }}>{card.icon}</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#111", lineHeight: 1.3 }}>
            {card.num}. {card.title}
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af", lineHeight: 1.4, marginTop: 2 }}>{card.desc}</div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {card.stats && (
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            {card.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 16, fontWeight: 700, color: s.color || "#111" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {card.extra && (
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {card.extra.map((e, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#374151" }}>
                <span>{e.label}</span><span style={{ fontWeight: 600 }}>{e.value}</span>
              </div>
            ))}
          </div>
        )}

        {card.summaryStats && (
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            {card.summaryStats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        {card.barData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {card.barData.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}>
                <span style={{ color: "#6b7280", minWidth: 90, fontSize: 9 }}>{r.name}</span>
                <MiniBar value={r.value} color={COLORS.teal} />
                <span style={{ color: "#111", minWidth: 28, fontWeight: 600 }}>{r.value}%</span>
              </div>
            ))}
          </div>
        )}

        {card.donut && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SmallDonut data={card.donut} centerLabel={card.centerLabel} centerSub={card.centerSub} size={80} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {card.donut.slice(0, 5).map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "#374151" }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: DONUT_COLORS[i] }} />
                  {d.name} <span style={{ color: "#9ca3af" }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {card.overList && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.red, marginBottom: 4 }}>{card.highlight}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6 }}>Over Allocated Resources</div>
            {card.overList.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0", borderBottom: "0.5px solid #f3f4f6" }}>
                <span style={{ color: "#374151" }}>{r.name}</span>
                <span style={{ fontWeight: 700, color: r.color }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        )}

        {card.availability && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "Available", value: card.availability.available, color: COLORS.green },
              { label: "Shared", value: card.availability.shared, color: COLORS.blue },
              { label: "Bench", value: card.availability.bench, color: COLORS.gray },
            ].map((r, i) => (
              <div key={i}>
                <div style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.value}</div>
                <div style={{ fontSize: 10, color: "#6b7280" }}>{r.label}</div>
              </div>
            ))}
          </div>
        )}

        {card.compliance !== undefined && (
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.green }}>{card.compliance}%</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6 }}>Overall Compliance</div>
            {card.items.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, marginBottom: 3 }}>
                <span style={{ color: "#6b7280", minWidth: 120 }}>{r.label}</span>
                <MiniBar value={r.value} color={COLORS.green} />
                <span style={{ fontWeight: 600, color: "#111" }}>{r.value}%</span>
              </div>
            ))}
          </div>
        )}

        {card.budget && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              {[
                { l: "Total Budget", v: card.budget.total, c: "#111" },
                { l: "Total Actual", v: card.budget.actual, c: "#111" },
                { l: "Variance", v: card.budget.variance, c: COLORS.red },
              ].map((b, i) => (
                <div key={i}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: b.c }}>{b.v}</div>
                  <div style={{ fontSize: 9, color: "#9ca3af" }}>{b.l}</div>
                </div>
              ))}
            </div>
            {card.budgetRows.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#374151", padding: "2px 0" }}>
                <span>{r.name}</span>
                <span style={{ color: COLORS.red, fontWeight: 600 }}>${r.variance}M</span>
              </div>
            ))}
          </div>
        )}

        {card.vendors && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "3px 8px", fontSize: 10, color: "#6b7280", marginBottom: 2 }}>
              <span>Vendor</span><span>Spend</span><span>Rank</span><span>Score</span>
            </div>
            {card.vendors.map((v, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: "2px 8px", fontSize: 10, padding: "2px 0", borderBottom: "0.5px solid #f3f4f6" }}>
                <span style={{ color: "#374151" }}>{v.name}</span>
                <span style={{ fontWeight: 600, color: "#111" }}>{v.spend}</span>
                <span style={{ color: COLORS.blue, fontWeight: 700 }}>#{v.rank}</span>
                <span style={{ color: v.score >= 85 ? COLORS.green : COLORS.orange, fontWeight: 600 }}>{v.score}%</span>
              </div>
            ))}
          </div>
        )}

        {card.demandStats && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
              {card.demandStats.map((d, i) => (
                <div key={i}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: d.color }}>{d.value}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{d.label}</div>
                </div>
              ))}
            </div>
            {card.demandByPriority.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, marginBottom: 3 }}>
                <span style={{ color: "#6b7280", minWidth: 50 }}>{r.label}</span>
                <MiniBar value={parseInt(r.pct)} color={[COLORS.red, COLORS.orange, COLORS.blue][i]} />
                <span style={{ color: "#374151" }}>{r.value} ({r.pct})</span>
              </div>
            ))}
          </div>
        )}

        {card.forecastData && (
          <div style={{ height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={card.forecastData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} domain={[5, 11]} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="cap" stroke={COLORS.green} strokeWidth={1.5} dot={false} name="Capacity" />
                <Line type="monotone" dataKey="demand" stroke={COLORS.blue} strokeWidth={1.5} dot={false} name="Demand" />
                <Line type="monotone" dataKey="gap" stroke={COLORS.red} strokeWidth={1.5} dot={false} name="Gap" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {card.utilOverall && (
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.teal }}>{card.utilOverall}%</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 6 }}>Overall Utilization</div>
            {card.utilByType.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, marginBottom: 3 }}>
                <span style={{ color: "#6b7280", minWidth: 110, fontSize: 9 }}>{r.label}</span>
                <MiniBar value={r.value} color={COLORS.teal} />
                <span style={{ fontWeight: 600, color: "#111" }}>{r.value}%</span>
              </div>
            ))}
          </div>
        )}

        {card.tsCompliance && (
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.green }}>{card.tsCompliance}%</div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>TS Compliance</div>
              {card.tsBreakdown.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, marginTop: 2 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: r.color }} />
                  <span style={{ color: "#6b7280" }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: "#111" }}>{r.pct}%</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.blue }}>{card.actualFTE}</div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>Actual FTE</div>
            </div>
          </div>
        )}

        {card.pending !== undefined && !card.tsCompliance && (
          <div>
            <div style={{ display: "flex", gap: 16, marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.orange }}>{card.pending}</div>
                <div style={{ fontSize: 10, color: "#6b7280" }}>Pending Approvals</div>
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.red }}>{card.overdue}</div>
                <div style={{ fontSize: 10, color: "#6b7280" }}>Overdue Approvals</div>
              </div>
            </div>
            {card.byType.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0", color: "#374151" }}>
                <span>{r.label}</span><span style={{ fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}

        {card.execStats && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
            {card.execStats.map((s, i) => (
              <div key={i} style={{
                background: s.color + "11", border: `0.5px solid ${s.color}44`,
                borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 11, color: "#6b7280" }}>{s.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {card.hub && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            {["All Reports", "Favorites", "Recent", "Scheduled"].map((l, i) => (
              <div key={i} style={{
                background: "#f9fafb", border: "0.5px solid #e5e7eb", borderRadius: 8,
                padding: "10px", textAlign: "center", fontSize: 11, color: "#374151", fontWeight: 500,
              }}>
                {["📊", "⭐", "🕐", "📅"][i]} {l}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => onView(card)} style={{
        background: "none", border: "none", padding: 0, cursor: "pointer",
        fontSize: 11, color: card.color, fontWeight: 600, textAlign: "left",
        display: "flex", alignItems: "center", gap: 4, marginTop: "auto",
      }}>
        View Report →
      </button>
    </div>
  );
}

const riskTopItems = [
  { icon: "⚠️", text: "Critical skill shortage in Data Engineering", count: 5, color: COLORS.red },
  { icon: "⚠️", text: "Over allocation in Multiple Projects", count: 4, color: COLORS.red },
  { icon: "🟠", text: "Open high priority demands", count: 6, color: COLORS.orange },
  { icon: "🔵", text: "Key resource attrition risk", count: 3, color: COLORS.blue },
  { icon: "📋", text: "Timesheets pending submission", count: 6, color: COLORS.blue },
];

// ─── Shared helpers for detail views ─────────────────────────────────────────

function DetailMiniBar({ value, max = 100, color = COLORS.blue }) {
  return (
    <div style={{ flex: 1, height: 7, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, height: "100%", background: color, borderRadius: 3 }} />
    </div>
  );
}

function StatTile({ label, value, color }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${color}33`, borderRadius: 10, padding: "12px 16px", borderLeft: `3px solid ${color}` }}>
      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, marginTop: 18, borderBottom: "0.5px solid #e5e7eb", paddingBottom: 6 }}>
      {children}
    </div>
  );
}

function DetailCard({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "16px 18px", ...style }}>
      {children}
    </div>
  );
}

function DetailTable({ headers, rows }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, color: "#6b7280", borderBottom: "0.5px solid #e5e7eb", fontWeight: 600 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: "0.5px solid #f3f4f6" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "7px 8px", fontSize: 11 }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Individual Report Detail Views ──────────────────────────────────────────

function ReportDetail1() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        <StatTile label="Capacity Gap" value="-589 FTE" color={COLORS.red} />
        <StatTile label="Workforce Risk" value="High" color={COLORS.red} />
        <StatTile label="Portfolio Readiness" value="78%" color={COLORS.green} />
        <StatTile label="Overall Utilization" value="83%" color={COLORS.purple} />
        <StatTile label="Budget Variance" value="-17.9%" color={COLORS.orange} />
        <StatTile label="Compliance Rate" value="92%" color={COLORS.green} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Capacity vs Demand Trend</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={capacityDemandTrend} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 10 }} formatter={v => v.toLocaleString()} />
              <Bar dataKey="Capacity" fill={COLORS.blue} radius={[2,2,0,0]} />
              <Bar dataKey="Demand" fill={COLORS.teal} radius={[2,2,0,0]} />
              <Bar dataKey="Gap" fill={COLORS.red} radius={[2,2,0,0]} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Portfolio Health</SectionLabel>
          {portfolioReadiness.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
              <span style={{ fontSize: 10, color: "#374151", minWidth: 150 }}>{p.portfolio}</span>
              <DetailMiniBar value={parseInt(p.readiness)} color={parseInt(p.readiness) >= 75 ? COLORS.green : COLORS.orange} />
              <span style={{ fontSize: 11, fontWeight: 700, color: parseInt(p.readiness) >= 75 ? COLORS.green : COLORS.orange, minWidth: 34 }}>{p.readiness}</span>
            </div>
          ))}
        </DetailCard>
        <DetailCard>
          <SectionLabel>Top Workforce Risks</SectionLabel>
          {[
            { text: "Critical skill shortage — Data Engineering", level: "Critical", color: COLORS.red },
            { text: "Over-allocation across multiple projects", level: "Critical", color: COLORS.red },
            { text: "6 open high-priority demands unfulfilled", level: "High", color: COLORS.orange },
            { text: "Key resource attrition risk identified", level: "High", color: COLORS.orange },
            { text: "Timesheet submissions pending (6 staff)", level: "Medium", color: COLORS.amber },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid #f3f4f6" }}>
              <span style={{ fontSize: 11, color: "#374151", flex: 1 }}>{r.text}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: r.color + "18", padding: "2px 8px", borderRadius: 4 }}>{r.level}</span>
            </div>
          ))}
        </DetailCard>
        <DetailCard>
          <SectionLabel>Utilization Trend</SectionLabel>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={utilizationTrend} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
              <defs>
                <linearGradient id="ug1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis domain={[60,100]} tick={{ fontSize: 9 }} tickFormatter={v=>`${v}%`} />
              <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v}%`} />
              <Area type="monotone" dataKey="rate" stroke={COLORS.purple} strokeWidth={2} fill="url(#ug1)" name="Utilization" />
            </AreaChart>
          </ResponsiveContainer>
        </DetailCard>
      </div>
    </div>
  );
}

function ReportDetail2() {
  const byRole = [
    { role: "Developers", allocated: 3240, capacity: 3825, util: "85%", gap: -585 },
    { role: "Consultants", allocated: 1910, capacity: 2310, util: "83%", gap: -400 },
    { role: "Analysts", allocated: 1105, capacity: 1320, util: "84%", gap: -215 },
    { role: "Testers", allocated: 605, capacity: 720, util: "84%", gap: -115 },
    { role: "Architects", allocated: 255, capacity: 300, util: "85%", gap: -45 },
  ];
  const buUtil = [
    { name: "Engineering", util: 85, color: COLORS.blue },
    { name: "Consulting", util: 81, color: COLORS.teal },
    { name: "Data & Analytics", util: 84, color: COLORS.purple },
    { name: "Products", util: 79, color: COLORS.orange },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
        <StatTile label="Total Capacity" value="7,427" color={COLORS.blue} />
        <StatTile label="Total Demand" value="8,016" color={COLORS.orange} />
        <StatTile label="Allocated (FTE)" value="7,115" color={COLORS.teal} />
        <StatTile label="Utilization" value="83%" color={COLORS.purple} />
        <StatTile label="Capacity Gap" value="-589" color={COLORS.red} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Capacity vs Demand Trend</SectionLabel>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={capacityDemandTrend} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>v.toLocaleString()} />
              <Bar dataKey="Capacity" fill={COLORS.blue} radius={[2,2,0,0]} />
              <Bar dataKey="Demand" fill={COLORS.teal} radius={[2,2,0,0]} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Utilization by Business Unit</SectionLabel>
          {buUtil.map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#374151" }}>{r.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.util}%</span>
              </div>
              <DetailMiniBar value={r.util} color={r.color} />
            </div>
          ))}
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Allocation by Role</SectionLabel>
        <DetailTable
          headers={["Role", "Allocated (FTE)", "Capacity (FTE)", "Utilization", "Gap"]}
          rows={byRole.map(r => [
            <span style={{ color: "#374151", fontWeight: 600 }}>{r.role}</span>,
            r.allocated.toLocaleString(),
            r.capacity.toLocaleString(),
            <span style={{ color: COLORS.green, fontWeight: 700 }}>{r.util}</span>,
            <span style={{ color: COLORS.red, fontWeight: 700 }}>{r.gap}</span>,
          ])}
        />
      </DetailCard>
    </div>
  );
}

function ReportDetail3() {
  const owners = [
    { name: "Sarah Johnson", total: 235, approved: 168, pending: 67, rate: "71%" },
    { name: "Michael Lee", total: 188, approved: 128, pending: 60, rate: "68%" },
    { name: "Emily Davis", total: 176, approved: 129, pending: 47, rate: "73%" },
    { name: "David Brown", total: 154, approved: 101, pending: 53, rate: "66%" },
    { name: "Olivia Martin", total: 138, approved: 92, pending: 46, rate: "67%" },
  ];
  const approvalTrend = [
    { month: "Dec 23", Approved: 720, Pending: 310 },
    { month: "Jan 24", Approved: 780, Pending: 340 },
    { month: "Feb 24", Approved: 810, Pending: 360 },
    { month: "Mar 24", Approved: 830, Pending: 370 },
    { month: "Apr 24", Approved: 850, Pending: 380 },
    { month: "May 24", Approved: 864, Pending: 381 },
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Total Planning Inputs" value="1,245" color={COLORS.blue} />
        <StatTile label="Approved" value="864" color={COLORS.green} />
        <StatTile label="Pending" value="381" color={COLORS.orange} />
        <StatTile label="Approval Rate" value="69.4%" color={COLORS.teal} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Approval Trend (Last 6 Months)</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={approvalTrend} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey="Approved" stroke={COLORS.green} fill={COLORS.green+"33"} strokeWidth={2} />
              <Area type="monotone" dataKey="Pending" stroke={COLORS.orange} fill={COLORS.orange+"33"} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </AreaChart>
          </ResponsiveContainer>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Planning Inputs by Type</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={byType} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 90 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} />
              <Tooltip contentStyle={{ fontSize: 10 }} />
              <Bar dataKey="value" radius={[0,3,3,0]}>
                {byType.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Planning Inputs by Owner</SectionLabel>
        <DetailTable
          headers={["Owner", "Total Inputs", "Approved", "Pending", "Approval Rate"]}
          rows={owners.map(r => [
            <span style={{ color: "#374151", fontWeight: 600 }}>{r.name}</span>,
            r.total,
            <span style={{ color: COLORS.green, fontWeight: 600 }}>{r.approved}</span>,
            <span style={{ color: COLORS.orange, fontWeight: 600 }}>{r.pending}</span>,
            <span style={{ color: COLORS.blue, fontWeight: 700 }}>{r.rate}</span>,
          ])}
        />
      </DetailCard>
    </div>
  );
}

function ReportDetail4() {
  const donutData = [
    { name: "Cloud Migration", value: 18, fte: 1281 },
    { name: "Data Warehouse", value: 14, fte: 996 },
    { name: "Mobile App Revamp", value: 12, fte: 854 },
    { name: "ERP Implementation", value: 10, fte: 712 },
    { name: "AI Platform", value: 8, fte: 569 },
    { name: "Others", value: 38, fte: 2703 },
  ];
  const byPortfolio = [
    { name: "Digital Transformation", fte: 2248, pct: 31.6 },
    { name: "Product Engineering", fte: 1842, pct: 25.9 },
    { name: "Cloud Services", fte: 1365, pct: 19.2 },
    { name: "Data & Analytics", fte: 1030, pct: 14.5 },
    { name: "Business Applications", fte: 630, pct: 8.9 },
  ];
  const allocationTrend = [
    { month: "Dec 23", fte: 6200 }, { month: "Jan 24", fte: 6500 },
    { month: "Feb 24", fte: 6700 }, { month: "Mar 24", fte: 6900 },
    { month: "Apr 24", fte: 7000 }, { month: "May 24", fte: 7115 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        <StatTile label="Total Allocated (FTE)" value="7,115" color={COLORS.blue} />
        <StatTile label="Active Projects" value="124" color={COLORS.teal} />
        <StatTile label="Avg Allocation %" value="81%" color={COLORS.purple} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Allocation by Project (Top 6)</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0 }}>
              <PieChart width={160} height={160}>
                <Pie data={donutData} cx={79} cy={79} innerRadius={48} outerRadius={72} dataKey="value" startAngle={90} endAngle={-270}>
                  {donutData.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />)}
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#111" }}>7,115</div>
                <div style={{ fontSize: 9, color: "#6b7280" }}>Total FTE</div>
              </div>
            </div>
            <div>
              {donutData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: DONUT_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: "#374151", flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#111" }}>{d.value}%</span>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>{d.fte.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Allocation by Portfolio</SectionLabel>
          {byPortfolio.map((p, i) => (
            <div key={i} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: "#374151" }}>{p.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: DONUT_COLORS[i] }}>{p.fte.toLocaleString()} ({p.pct}%)</span>
              </div>
              <DetailMiniBar value={p.pct} max={35} color={DONUT_COLORS[i]} />
            </div>
          ))}
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Allocation Trend (Last 6 Months)</SectionLabel>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={allocationTrend} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
            <YAxis tick={{ fontSize: 9 }} />
            <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v.toLocaleString()} FTE`} />
            <Line type="monotone" dataKey="fte" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 3, fill: COLORS.blue }} name="Allocated FTE" />
          </LineChart>
        </ResponsiveContainer>
      </DetailCard>
    </div>
  );
}

function ReportDetail5() {
  const overList = [
    { name: "John Smith", role: "Developer", alloc: 132, projects: 5 },
    { name: "Priya Patel", role: "Analyst", alloc: 128, projects: 4 },
    { name: "Ravi Kumar", role: "Developer", alloc: 120, projects: 4 },
    { name: "Anita Desai", role: "Tester", alloc: 116, projects: 3 },
    { name: "Carlos Martinez", role: "Consultant", alloc: 112, projects: 3 },
    { name: "Emily Clark", role: "Developer", alloc: 110, projects: 2 },
    { name: "David Lee", role: "Architect", alloc: 108, projects: 2 },
    { name: "Sophie Wilson", role: "Analyst", alloc: 105, projects: 5 },
    { name: "James Thomas", role: "Developer", alloc: 104, projects: 3 },
    { name: "Maria Garcia", role: "Tester", alloc: 103, projects: 3 },
  ];
  const byRole = [
    { role: "Developer", count: 198 }, { role: "Consultant", count: 42 },
    { role: "Analyst", count: 18 }, { role: "Tester", count: 14 }, { role: "Architect", count: 10 },
  ];
  const byProject = [
    { name: "Cloud Migration", count: 45 }, { name: "Data Warehouse", count: 36 },
    { name: "Mobile App Revamp", count: 32 }, { name: "AI Platform", count: 28 }, { name: "ERP Implementation", count: 20 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        <StatTile label="Over Allocated Resources" value="312 FTE" color={COLORS.red} />
        <StatTile label="Over Allocation %" value="12.3%" color={COLORS.orange} />
        <StatTile label="Projects Impacted" value="47" color={COLORS.amber} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Over-Allocated Resources (Top 10)</SectionLabel>
          <DetailTable
            headers={["Resource", "Role", "Allocation %", "Projects"]}
            rows={overList.map(r => [
              <span style={{ color: "#374151", fontWeight: 600 }}>{r.name}</span>,
              <span style={{ color: "#6b7280" }}>{r.role}</span>,
              <span style={{ fontWeight: 800, color: r.alloc >= 125 ? COLORS.red : r.alloc >= 115 ? COLORS.orange : COLORS.amber }}>{r.alloc}%</span>,
              r.projects,
            ])}
          />
        </DetailCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DetailCard>
            <SectionLabel>Over Allocation by Role</SectionLabel>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={byRole} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 65 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis type="category" dataKey="role" tick={{ fontSize: 9 }} width={65} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="count" fill={COLORS.red} radius={[0,3,3,0]} name="Over-Allocated" />
              </BarChart>
            </ResponsiveContainer>
          </DetailCard>
          <DetailCard>
            <SectionLabel>Over Allocation by Project</SectionLabel>
            {byProject.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 10, color: "#374151", minWidth: 120 }}>{p.name}</span>
                <DetailMiniBar value={p.count} max={50} color={COLORS.red} />
                <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.red, minWidth: 22 }}>{p.count}</span>
              </div>
            ))}
          </DetailCard>
        </div>
      </div>
    </div>
  );
}

function ReportDetail6() {
  const byRole = [
    { role: "Developers", total: 4520, avail: 875, pct: "19.4%" },
    { role: "Consultants", total: 1850, avail: 410, pct: "22.2%" },
    { role: "Analysts", total: 1210, avail: 245, pct: "20.2%" },
    { role: "Testers", total: 700, avail: 155, pct: "22.1%" },
    { role: "Architects", total: 252, avail: 57, pct: "22.6%" },
    { role: "Others", total: 112, avail: 7, pct: "24.1%" },
  ];
  const sharedProjects = [
    { name: "Cloud Migration", shared: 245 }, { name: "Data Warehouse", shared: 198 },
    { name: "Mobile App Revamp", shared: 176 }, { name: "ERP Implementation", shared: 164 },
    { name: "DevOps Implementation", shared: 142 }, { name: "Analytics Dashboard", shared: 138 },
    { name: "Customer Portal", shared: 116 }, { name: "Security Upgrade", shared: 98 },
    { name: "Automation Testing", shared: 66 },
  ];
  const availTrend = [
    { month: "Dec 23", pct: 23.1 }, { month: "Jan 24", pct: 22.4 },
    { month: "Feb 24", pct: 22.4 }, { month: "Mar 24", pct: 21.5 },
    { month: "Apr 24", pct: 21.1 }, { month: "May 24", pct: 21.6 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Total Resources (FTE)" value="8,532" color={COLORS.blue} />
        <StatTile label="Available (FTE)" value="1,842" color={COLORS.green} />
        <StatTile label="Shared Resources" value="2,315" color={COLORS.teal} />
        <StatTile label="Bench Resources" value="1,842 (21.6%)" color={COLORS.gray} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Availability by Role</SectionLabel>
          <DetailTable
            headers={["Role", "Total (FTE)", "Available (FTE)", "Availability %"]}
            rows={byRole.map(r => [
              <span style={{ color: "#374151" }}>{r.role}</span>,
              r.total.toLocaleString(),
              <span style={{ color: COLORS.green, fontWeight: 600 }}>{r.avail}</span>,
              <span style={{ color: COLORS.teal, fontWeight: 700 }}>{r.pct}</span>,
            ])}
          />
        </DetailCard>
        <DetailCard>
          <SectionLabel>Shared Resources by Project (Top 10)</SectionLabel>
          {sharedProjects.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "#374151", minWidth: 150 }}>{p.name}</span>
              <DetailMiniBar value={p.shared} max={250} color={COLORS.teal} />
              <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.teal, minWidth: 28 }}>{p.shared}</span>
            </div>
          ))}
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Availability Trend (Last 6 Months)</SectionLabel>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={availTrend} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
            <YAxis domain={[18,26]} tick={{ fontSize: 9 }} tickFormatter={v=>`${v}%`} />
            <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v}%`} />
            <Area type="monotone" dataKey="pct" stroke={COLORS.green} fill={COLORS.green+"33"} strokeWidth={2} name="Availability %" />
          </AreaChart>
        </ResponsiveContainer>
      </DetailCard>
    </div>
  );
}

function ReportDetail7() {
  const items = [
    { label: "Timesheet Submission", value: 96, target: 95 },
    { label: "Allocation Adherence", value: 91, target: 90 },
    { label: "Manager Approval", value: 93, target: 90 },
    { label: "Data Quality", value: 88, target: 90 },
    { label: "Skill Certification", value: 90, target: 85 },
  ];
  const compTrend = [
    { month: "Dec 23", rate: 90 }, { month: "Jan 24", rate: 91 },
    { month: "Feb 24", rate: 90 }, { month: "Mar 24", rate: 91 },
    { month: "Apr 24", rate: 92 }, { month: "May 24", rate: 92 },
  ];
  const nonCompReasons = [
    { name: "Missing Timesheet", value: 36, color: COLORS.red },
    { name: "Over Allocation", value: 28, color: COLORS.orange },
    { name: "Delayed Approval", value: 19, color: COLORS.amber },
    { name: "Incorrect Allocation", value: 10, color: COLORS.blue },
    { name: "Others", value: 8, color: COLORS.gray },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Overall Compliance" value="92%" color={COLORS.green} />
        <StatTile label="Timesheet Compliance" value="96%" color={COLORS.teal} />
        <StatTile label="Allocation Adherence" value="91%" color={COLORS.blue} />
        <StatTile label="Manager Approval" value="93%" color={COLORS.purple} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Compliance by Area</SectionLabel>
          {items.map((r, i) => (
            <div key={i} style={{ marginBottom: 11 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#374151" }}>{r.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: r.value >= r.target ? COLORS.green : COLORS.red }}>{r.value}%</span>
              </div>
              <DetailMiniBar value={r.value} color={r.value >= r.target ? COLORS.green : COLORS.red} />
            </div>
          ))}
        </DetailCard>
        <DetailCard>
          <SectionLabel>Non-Compliance by Reason</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
              <PieChart width={130} height={130}>
                <Pie data={nonCompReasons} cx={64} cy={64} innerRadius={38} outerRadius={60} dataKey="value">
                  {nonCompReasons.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div>
              {nonCompReasons.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                  <span style={{ fontSize: 10, color: "#374151" }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.color, marginLeft: 4 }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Compliance Trend (Last 6 Months)</SectionLabel>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={compTrend} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
            <YAxis domain={[85,100]} tick={{ fontSize: 9 }} tickFormatter={v=>`${v}%`} />
            <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v}%`} />
            <Line type="monotone" dataKey="rate" stroke={COLORS.green} strokeWidth={2} dot={{ r: 3, fill: COLORS.green }} name="Compliance %" />
          </LineChart>
        </ResponsiveContainer>
      </DetailCard>
    </div>
  );
}

function ReportDetail8() {
  const budgetMonthly = [
    { month: "Dec 23", budget: 4.2, actual: 4.6, variance: -0.4 },
    { month: "Jan 24", budget: 4.4, actual: 4.9, variance: -0.5 },
    { month: "Feb 24", budget: 4.3, actual: 4.7, variance: -0.4 },
    { month: "Mar 24", budget: 5.1, actual: 5.6, variance: -0.5 },
    { month: "Apr 24", budget: 5.4, actual: 5.8, variance: -0.4 },
    { month: "May 24", budget: 5.4, actual: 5.6, variance: -0.2 },
  ];
  const portfolioVar = [
    { name: "Digital Transformation", budget: 7.2, actual: 5.96, variance: -1.2, pct: -16.7 },
    { name: "Product Engineering", budget: 6.5, actual: 5.38, variance: -1.12, pct: -17.2 },
    { name: "Cloud Services", budget: 5.8, actual: 4.85, variance: -0.95, pct: -16.4 },
    { name: "Data & Analytics", budget: 3.5, actual: 2.77, variance: -0.73, pct: -20.9 },
    { name: "Business Applications", budget: 1.8, actual: 1.38, variance: -0.42, pct: -23.3 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Total Budget" value="$24.80M" color={COLORS.blue} />
        <StatTile label="Total Actual" value="$20.36M" color={COLORS.teal} />
        <StatTile label="Variance" value="-$4.44M" color={COLORS.red} />
        <StatTile label="Variance %" value="-17.9%" color={COLORS.red} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Budget vs Actual — Monthly</SectionLabel>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={budgetMonthly} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} tickFormatter={v=>`$${v}M`} />
              <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`$${v}M`} />
              <Bar dataKey="budget" fill={COLORS.blue} radius={[2,2,0,0]} name="Budget" />
              <Bar dataKey="actual" fill={COLORS.orange} radius={[2,2,0,0]} name="Actual" />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Variance by Type</SectionLabel>
          <div style={{ position: "relative", width: 200, height: 160 }}>
            <PieChart width={200} height={160}>
              <Pie data={[
                { name: "Resource Cost", value: 58.5 },
                { name: "Infrastructure", value: 25.1 },
                { name: "Other Cost", value: 15.5 },
              ]} cx={99} cy={79} innerRadius={45} outerRadius={70} dataKey="value">
                {[COLORS.red, COLORS.orange, COLORS.amber].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v}%`} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </PieChart>
          </div>
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Variance by Portfolio</SectionLabel>
        <DetailTable
          headers={["Portfolio", "Budget ($M)", "Actual ($M)", "Variance ($M)", "Variance %"]}
          rows={portfolioVar.map(r => [
            <span style={{ color: "#374151" }}>{r.name}</span>,
            `$${r.budget}M`,
            `$${r.actual}M`,
            <span style={{ color: COLORS.red, fontWeight: 700 }}>${r.variance}M</span>,
            <span style={{ color: COLORS.red, fontWeight: 700 }}>{r.pct}%</span>,
          ])}
        />
      </DetailCard>
    </div>
  );
}

function ReportDetail9() {
  const vendors = [
    { name: "Tech Mahindra", spend: 3.21, pct: 15.3, score: 92, category: "Development", onTime: 94 },
    { name: "Tata Consultancy Svcs", spend: 2.98, pct: 13.1, score: 88, category: "Consulting", onTime: 91 },
    { name: "Infosys", spend: 2.25, pct: 10.7, score: 85, category: "Development", onTime: 89 },
    { name: "Wipro", spend: 1.89, pct: 9.0, score: 80, category: "Support", onTime: 86 },
    { name: "HCL Technologies", spend: 1.46, pct: 7.0, score: 78, category: "Development", onTime: 83 },
    { name: "Accenture", spend: 1.02, pct: 4.9, score: 90, category: "Consulting", onTime: 92 },
    { name: "Cognizant", spend: 0.98, pct: 4.7, score: 84, category: "Development", onTime: 87 },
    { name: "LTI Mindtree", spend: 0.87, pct: 4.1, score: 81, category: "Support", onTime: 85 },
    { name: "Capgemini", spend: 0.31, pct: 3.8, score: 82, category: "Consulting", onTime: 88 },
    { name: "Others", spend: 1.71, pct: 21.4, score: 79, category: "Mixed", onTime: 84 },
  ];
  const spendByCat = [
    { name: "Development", value: 48 }, { name: "Consulting", value: 25 },
    { name: "Support & Maintenance", value: 17 }, { name: "Infrastructure", value: 10 },
  ];
  const spendTrend = [
    { month: "Dec 23", spend: 6.2 }, { month: "Jan 24", spend: 6.84 },
    { month: "Feb 24", spend: 5.84 }, { month: "Mar 24", spend: 5.98 },
    { month: "Apr 24", spend: 7.1 }, { month: "May 24", spend: 8.1 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Total Vendor Spend" value="$8.12M" color={COLORS.blue} />
        <StatTile label="Active Vendors" value="56" color={COLORS.teal} />
        <StatTile label="Avg Performance Score" value="87%" color={COLORS.green} />
        <StatTile label="On-Time Delivery" value="92%" color={COLORS.purple} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Vendor Ranking by Spend</SectionLabel>
          <DetailTable
            headers={["#", "Vendor", "Spend ($M)", "% of Total", "Score", "On-Time"]}
            rows={vendors.map((v, i) => [
              <span style={{ fontWeight: 800, color: i < 3 ? COLORS.amber : "#9ca3af" }}>#{i+1}</span>,
              <span style={{ color: "#374151", fontWeight: 600 }}>{v.name}</span>,
              `$${v.spend}M`,
              `${v.pct}%`,
              <span style={{ fontWeight: 700, color: v.score >= 85 ? COLORS.green : COLORS.orange }}>{v.score}%</span>,
              `${v.onTime}%`,
            ])}
          />
        </DetailCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DetailCard>
            <SectionLabel>Spend by Category</SectionLabel>
            <div style={{ position: "relative", width: 180, height: 150 }}>
              <PieChart width={180} height={150}>
                <Pie data={spendByCat} cx={89} cy={74} innerRadius={40} outerRadius={65} dataKey="value">
                  {spendByCat.map((_, i) => <Cell key={i} fill={DONUT_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v}%`} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </div>
          </DetailCard>
          <DetailCard>
            <SectionLabel>Spend Trend</SectionLabel>
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={spendTrend} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} tickFormatter={v=>`$${v}M`} />
                <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`$${v}M`} />
                <Line type="monotone" dataKey="spend" stroke={COLORS.amber} strokeWidth={2} dot={{ r: 3 }} name="Vendor Spend" />
              </LineChart>
            </ResponsiveContainer>
          </DetailCard>
        </div>
      </div>
    </div>
  );
}

function ReportDetail10() {
  const demandByPriority = [
    { label: "High", value: 156, pct: 38, color: COLORS.red },
    { label: "Medium", value: 164, pct: 40, color: COLORS.orange },
    { label: "Low", value: 92, pct: 22, color: COLORS.blue },
  ];
  const aging = [
    { range: "0–15 Days", count: 142, pct: "34.5%", color: COLORS.green },
    { range: "16–30 Days", count: 113, pct: "27.4%", color: COLORS.teal },
    { range: "31–40 Days", count: 96, pct: "23.3%", color: COLORS.orange },
    { range: ">40 Days", count: 61, pct: "14.8%", color: COLORS.red },
  ];
  const byRole = [
    { role: "Developers", value: 156 }, { role: "Consultants", value: 92 },
    { role: "Analysts", value: 108 }, { role: "Testers", value: 100 }, { role: "Architects", value: 28 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Open Demands" value="412" color={COLORS.red} />
        <StatTile label="In Progress (FTE)" value="186" color={COLORS.orange} />
        <StatTile label="Fulfilled (FTE)" value="226" color={COLORS.green} />
        <StatTile label="Avg Days to Fulfill" value="23" color={COLORS.teal} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Demands by Priority</SectionLabel>
          {demandByPriority.map((d, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>{d.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: d.color }}>{d.value} ({d.pct}%)</span>
              </div>
              <DetailMiniBar value={d.pct} color={d.color} />
            </div>
          ))}
          <SectionLabel>Demands Aging</SectionLabel>
          {aging.map((d, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid #f3f4f6" }}>
              <span style={{ fontSize: 11, color: "#374151" }}>{d.range}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#6b7280" }}>{d.pct}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: d.color }}>{d.count}</span>
              </div>
            </div>
          ))}
        </DetailCard>
        <DetailCard>
          <SectionLabel>Demands by Role (Top 5)</SectionLabel>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={byRole} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 65 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 9 }} />
              <YAxis type="category" dataKey="role" tick={{ fontSize: 9 }} width={65} />
              <Tooltip contentStyle={{ fontSize: 10 }} />
              <Bar dataKey="value" fill={COLORS.blue} radius={[0,3,3,0]} name="Demands" />
            </BarChart>
          </ResponsiveContainer>
          <SectionLabel>Demand Fulfillment Status</SectionLabel>
          <div style={{ display: "flex", gap: 20, marginTop: 4 }}>
            {[
              { label: "Open", value: 412, color: COLORS.red },
              { label: "In Progress", value: 186, color: COLORS.orange },
              { label: "Fulfilled", value: 226, color: COLORS.green },
              { label: "Staffing Gap", value: -18, color: COLORS.red },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </DetailCard>
      </div>
    </div>
  );
}

function ReportDetail11() {
  const forecastData = [
    { month: "May 24", cap: 8.0, demand: 8.9, gap: -0.9 },
    { month: "Jun 24", cap: 8.3, demand: 9.1, gap: -0.8 },
    { month: "Jul 24", cap: 8.5, demand: 9.3, gap: -0.8 },
    { month: "Aug 24", cap: 6.9, demand: 8.7, gap: -1.8 },
    { month: "Sep 24", cap: 6.9, demand: 8.8, gap: -0.9 },
    { month: "Oct 24", cap: 7.5, demand: 8.4, gap: -0.9 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        <StatTile label="Forecast Capacity (Jun)" value="8.3K FTE" color={COLORS.blue} />
        <StatTile label="Forecast Demand (Jun)" value="9.1K FTE" color={COLORS.orange} />
        <StatTile label="Projected Gap (Jun)" value="-800 FTE" color={COLORS.red} />
      </div>
      <DetailCard>
        <SectionLabel>6-Month Capacity vs Demand Forecast</SectionLabel>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={forecastData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 9 }} />
            <YAxis domain={[4,12]} tick={{ fontSize: 9 }} tickFormatter={v=>`${v}K`} />
            <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v}K FTE`} />
            <Line type="monotone" dataKey="cap" stroke={COLORS.green} strokeWidth={2} dot={{ r: 4 }} name="Capacity" />
            <Line type="monotone" dataKey="demand" stroke={COLORS.blue} strokeWidth={2} dot={{ r: 4 }} name="Demand" />
            <Line type="monotone" dataKey="gap" stroke={COLORS.red} strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="Gap" />
            <Legend wrapperStyle={{ fontSize: 9 }} />
          </LineChart>
        </ResponsiveContainer>
      </DetailCard>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Gap Analysis by Month</SectionLabel>
          <DetailTable
            headers={["Month", "Capacity (K)", "Demand (K)", "Gap (K)", "Risk"]}
            rows={forecastData.map(r => [
              <span style={{ fontWeight: 600, color: "#374151" }}>{r.month}</span>,
              r.cap,
              r.demand,
              <span style={{ color: COLORS.red, fontWeight: 700 }}>{r.gap}</span>,
              <span style={{ fontSize: 10, fontWeight: 700, color: r.gap < -1.5 ? COLORS.red : COLORS.orange, background: (r.gap < -1.5 ? COLORS.red : COLORS.orange)+"18", padding: "1px 6px", borderRadius: 4 }}>
                {r.gap < -1.5 ? "Critical" : "High"}
              </span>,
            ])}
          />
        </DetailCard>
        <DetailCard>
          <SectionLabel>Planning Recommendations</SectionLabel>
          {[
            { action: "Hire 200 developers for Aug gap", priority: "Critical", color: COLORS.red },
            { action: "Cross-train 150 analysts from other BUs", priority: "High", color: COLORS.orange },
            { action: "Engage 2 new vendor partners for Q3", priority: "High", color: COLORS.orange },
            { action: "Defer 3 low-priority projects to Q4", priority: "Medium", color: COLORS.amber },
            { action: "Upskill bench resources — Data Engg.", priority: "Medium", color: COLORS.amber },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid #f3f4f6" }}>
              <span style={{ fontSize: 11, color: "#374151", flex: 1 }}>{r.action}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: r.color, background: r.color+"18", padding: "2px 8px", borderRadius: 4 }}>{r.priority}</span>
            </div>
          ))}
        </DetailCard>
      </div>
    </div>
  );
}

function ReportDetail12() {
  const utilByType = [
    { label: "Project Work", value: 86 },
    { label: "BAU Work", value: 78 },
    { label: "Internal Initiatives", value: 74 },
    { label: "Training", value: 65 },
  ];
  const utilByBU = [
    { month: "Dec 23", Engineering: 74, Consulting: 78, Data: 72 },
    { month: "Jan 24", Engineering: 76, Consulting: 80, Data: 74 },
    { month: "Feb 24", Engineering: 78, Consulting: 81, Data: 76 },
    { month: "Mar 24", Engineering: 80, Consulting: 83, Data: 78 },
    { month: "Apr 24", Engineering: 82, Consulting: 84, Data: 80 },
    { month: "May 24", Engineering: 83, Consulting: 85, Data: 82 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        <StatTile label="Overall Utilization" value="83%" color={COLORS.teal} />
        <StatTile label="Target Utilization" value="85%" color={COLORS.blue} />
        <StatTile label="Gap to Target" value="-2pp" color={COLORS.orange} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Utilization by Work Type</SectionLabel>
          {utilByType.map((r, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#374151" }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: r.value >= 80 ? COLORS.green : r.value >= 70 ? COLORS.orange : COLORS.red }}>{r.value}%</span>
              </div>
              <DetailMiniBar value={r.value} color={r.value >= 80 ? COLORS.green : r.value >= 70 ? COLORS.orange : COLORS.red} />
            </div>
          ))}
        </DetailCard>
        <DetailCard>
          <SectionLabel>Utilization Trend by BU</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={utilByBU} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis domain={[60,100]} tick={{ fontSize: 9 }} tickFormatter={v=>`${v}%`} />
              <Tooltip contentStyle={{ fontSize: 10 }} formatter={v=>`${v}%`} />
              <Line type="monotone" dataKey="Engineering" stroke={COLORS.blue} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Consulting" stroke={COLORS.teal} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Data" stroke={COLORS.purple} strokeWidth={2} dot={false} />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </LineChart>
          </ResponsiveContainer>
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Utilization by Business Unit</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { name: "Engineering", util: 83, target: 85, color: COLORS.blue },
            { name: "Consulting", util: 85, target: 85, color: COLORS.teal },
            { name: "Data & Analytics", util: 82, target: 85, color: COLORS.purple },
            { name: "Products", util: 79, target: 85, color: COLORS.orange },
          ].map((b, i) => (
            <div key={i} style={{ textAlign: "center", padding: "14px", background: "#f9fafb", borderRadius: 10 }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: b.util >= b.target ? COLORS.green : COLORS.orange }}>{b.util}%</div>
              <div style={{ fontSize: 11, color: "#374151", marginTop: 4, fontWeight: 600 }}>{b.name}</div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>Target: {b.target}%</div>
            </div>
          ))}
        </div>
      </DetailCard>
    </div>
  );
}

function ReportDetail13() {
  const tsData = [
    { month: "Dec 23", planned: 2600, actual: 2450 }, { month: "Jan 24", planned: 2650, actual: 2500 },
    { month: "Feb 24", planned: 2700, actual: 2550 }, { month: "Mar 24", planned: 2750, actual: 2650 },
    { month: "Apr 24", planned: 2800, actual: 2750 }, { month: "May 24", planned: 2850, actual: 2850 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="TS Compliance" value="96%" color={COLORS.green} />
        <StatTile label="Actual FTE" value="2,850" color={COLORS.blue} />
        <StatTile label="Planned FTE" value="2,850" color={COLORS.teal} />
        <StatTile label="Variance" value="0%" color={COLORS.gray} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Planned vs Actual Effort (FTE)</SectionLabel>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={tsData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 10 }} />
              <Bar dataKey="planned" fill={COLORS.blue} radius={[2,2,0,0]} name="Planned" />
              <Bar dataKey="actual" fill={COLORS.green} radius={[2,2,0,0]} name="Actual" />
              <Legend wrapperStyle={{ fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
        <DetailCard>
          <SectionLabel>Timesheet Breakdown</SectionLabel>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 14 }}>
            <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
              <PieChart width={120} height={120}>
                <Pie data={[{value:66},{value:20},{value:10},{value:4}]} cx={59} cy={59} innerRadius={34} outerRadius={54} dataKey="value" startAngle={90} endAngle={-270}>
                  {[COLORS.green, COLORS.red, COLORS.orange, COLORS.gray].map((c,i) => <Cell key={i} fill={c} />)}
                </Pie>
              </PieChart>
            </div>
            <div>
              {[["On Track","66%",COLORS.green],["Over","20%",COLORS.red],["Under","10%",COLORS.orange],["Absent","4%",COLORS.gray]].map(([l,v,c]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                  <span style={{ fontSize: 11, color: "#374151" }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <SectionLabel>Compliance by Department</SectionLabel>
          {[
            { dept: "Engineering", v: 94 }, { dept: "Consulting", v: 97 },
            { dept: "IT Services", v: 96 }, { dept: "Data & Analytics", v: 93 },
            { dept: "Business Operations", v: 98 },
          ].map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "#374151", minWidth: 130 }}>{d.dept}</span>
              <DetailMiniBar value={d.v} color={d.v >= 95 ? COLORS.green : COLORS.orange} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "#111", minWidth: 30 }}>{d.v}%</span>
            </div>
          ))}
        </DetailCard>
      </div>
    </div>
  );
}

function ReportDetail14() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Pending Approvals" value="27" color={COLORS.orange} />
        <StatTile label="Overdue Approvals" value="12" color={COLORS.red} />
        <StatTile label="Approved (This Month)" value="186" color={COLORS.green} />
        <StatTile label="Avg Approval Time" value="2.4 days" color={COLORS.teal} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <DetailCard>
          <SectionLabel>Pending Approvals by Type</SectionLabel>
          {[
            { label: "Resource Requests", value: 12, color: COLORS.blue },
            { label: "Project Requests", value: 7, color: COLORS.teal },
            { label: "Allocation Changes", value: 5, color: COLORS.purple },
            { label: "Time Off Requests", value: 3, color: COLORS.orange },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: r.color }} />
                <span style={{ fontSize: 12, color: "#374151" }}>{r.label}</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: r.color }}>{r.value}</span>
            </div>
          ))}
        </DetailCard>
        <DetailCard>
          <SectionLabel>Approval Workflow Status</SectionLabel>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={[
              { stage: "Submitted", count: 186 }, { stage: "In Review", count: 27 },
              { stage: "Approved", count: 160 }, { stage: "Rejected", count: 12 },
            ]} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
              <XAxis dataKey="stage" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 10 }} />
              <Bar dataKey="count" radius={[3,3,0,0]}>
                {[COLORS.blue, COLORS.orange, COLORS.green, COLORS.red].map((c,i) => <Cell key={i} fill={c} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </DetailCard>
      </div>
      <DetailCard>
        <SectionLabel>Overdue Approvals Detail</SectionLabel>
        <DetailTable
          headers={["Request ID", "Type", "Requestor", "Days Overdue", "Priority"]}
          rows={[
            { id: "REQ-2024-0892", type: "Resource Request", req: "Sarah Johnson", days: 14, pri: "Critical", col: COLORS.red },
            { id: "REQ-2024-0885", type: "Project Request", req: "Michael Lee", days: 11, pri: "High", col: COLORS.orange },
            { id: "REQ-2024-0878", type: "Allocation Change", req: "Emily Davis", days: 9, pri: "High", col: COLORS.orange },
            { id: "REQ-2024-0861", type: "Resource Request", req: "David Brown", days: 7, pri: "Medium", col: COLORS.amber },
          ].map(r => [
            <span style={{ color: COLORS.blue, fontFamily: "monospace", fontSize: 10 }}>{r.id}</span>,
            r.type,
            <span style={{ color: "#6b7280" }}>{r.req}</span>,
            <span style={{ color: r.days >= 12 ? COLORS.red : COLORS.orange, fontWeight: 700 }}>{r.days} days</span>,
            <span style={{ fontSize: 10, fontWeight: 700, color: r.col, background: r.col+"18", padding: "2px 8px", borderRadius: 4 }}>{r.pri}</span>,
          ])}
        />
      </DetailCard>
    </div>
  );
}

function ReportDetail15() {
  const allReports = reportCards.filter(r => !r.hub);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        <StatTile label="Total Reports" value="14" color={COLORS.blue} />
        <StatTile label="Scheduled Reports" value="8" color={COLORS.teal} />
        <StatTile label="Favorites" value="5" color={COLORS.amber} />
        <StatTile label="Recently Viewed" value="7" color={COLORS.purple} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {["Executive", "Operational", "Planning", "Finance", "Compliance", "Allocation", "Governance", "All"].map((type, i) => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "12px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: DONUT_COLORS[i % DONUT_COLORS.length] }}>{type}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#111", marginTop: 2 }}>
              {type === "All" ? allReports.length : Math.floor(Math.random() * 3) + 1}
            </div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>reports</div>
          </div>
        ))}
      </div>
      <DetailCard>
        <SectionLabel>All Reports</SectionLabel>
        <DetailTable
          headers={["#", "Report", "Description", "Last Run", "Status"]}
          rows={allReports.map(r => [
            <span style={{ color: "#9ca3af", fontWeight: 600 }}>{r.num}</span>,
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>{r.icon}</span>
              <span style={{ color: "#374151", fontWeight: 600 }}>{r.title}</span>
            </div>,
            <span style={{ color: "#9ca3af" }}>{r.desc}</span>,
            <span style={{ color: "#6b7280" }}>May 15, 2024</span>,
            <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.green, background: COLORS.green+"18", padding: "2px 8px", borderRadius: 4 }}>Active</span>,
          ])}
        />
      </DetailCard>
    </div>
  );
}

const DETAIL_VIEWS = {
  1: ReportDetail1, 2: ReportDetail2, 3: ReportDetail3, 4: ReportDetail4,
  5: ReportDetail5, 6: ReportDetail6, 7: ReportDetail7, 8: ReportDetail8,
  9: ReportDetail9, 10: ReportDetail10, 11: ReportDetail11, 12: ReportDetail12,
  13: ReportDetail13, 14: ReportDetail14, 15: ReportDetail15,
};

// ─── Main Component (original UI preserved exactly) ───────────────────────────

export default function ResourceManagementOverview() {
  const [activeReport, setActiveReport] = useState(null);
  const [filters, setFilters] = useState({ date: "May 2024", portfolio: "All", bu: "All", region: "All" });

  if (activeReport) {
    const DetailView = DETAIL_VIEWS[activeReport.num];
    return (
      <div style={{ padding: "20px", fontFamily: "system-ui, sans-serif", background: "#f9fafb", minHeight: "100vh" }}>
        {/* Header — same style as original back button area */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setActiveReport(null)} style={{
            background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 8, padding: "6px 14px",
            fontSize: 13, cursor: "pointer", color: "#374151", display: "flex", alignItems: "center", gap: 6,
          }}>
            ← Back
          </button>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111" }}>
            {activeReport.num}. {activeReport.title}
          </h2>
          <span style={{
            fontSize: 11, background: activeReport.color + "18", color: activeReport.color,
            borderRadius: 6, padding: "3px 10px",
          }}>{activeReport.desc}</span>
        </div>
        {/* Filters row — same filters as overview */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
          {[
            { label: "Date Range", key: "date", options: ["May 2024", "Apr 2024", "Q1 2024", "Q2 2024"] },
            { label: "Portfolio", key: "portfolio", options: ["All", "Digital Transformation", "Cloud Services", "Data & Analytics"] },
            { label: "Business Unit", key: "bu", options: ["All", "EMEA", "AMER", "APAC"] },
            { label: "Region", key: "region", options: ["All", "North America", "Europe", "APAC"] },
          ].map((f) => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <label style={{ fontSize: 9, color: "#9ca3af" }}>{f.label}</label>
              <select value={filters[f.key]} onChange={(e) => setFilters(p => ({ ...p, [f.key]: e.target.value }))} style={{
                fontSize: 11, borderRadius: 6, border: "0.5px solid #d1d5db", padding: "4px 8px",
                background: "#fff", color: "#374151", cursor: "pointer",
              }}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {["Filters", "Refresh", "Export"].map((l) => (
              <button key={l} style={{
                background: "#fff", border: "0.5px solid #d1d5db", borderRadius: 6,
                padding: "4px 10px", fontSize: 11, cursor: "pointer", color: "#374151",
              }}>{l}</button>
            ))}
          </div>
          <div style={{ marginLeft: "auto", marginTop: 14, fontSize: 10, color: "#9ca3af" }}>
            Last Updated: May 15, 2024 10:30 AM
          </div>
        </div>
        {/* Detail content */}
        {DetailView ? <DetailView /> : null}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", background: "#f3f4f6", minHeight: "100vh", padding: "16px 20px" }}>
      <h2 className="sr-only">Resource Management Overview — comprehensive insights across planning, allocation, utilization, finance and compliance</h2>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>Resource Management Overview</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Comprehensive insights across planning, allocation, utilization, finance & compliance</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[
            { label: "Date Range", key: "date", options: ["May 2024", "Apr 2024", "Q1 2024", "Q2 2024"] },
            { label: "Portfolio", key: "portfolio", options: ["All", "Digital Transformation", "Cloud Services", "Data & Analytics"] },
            { label: "Business Unit", key: "bu", options: ["All", "EMEA", "AMER", "APAC"] },
            { label: "Region", key: "region", options: ["All", "North America", "Europe", "APAC"] },
          ].map((f) => (
            <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <label style={{ fontSize: 9, color: "#9ca3af" }}>{f.label}</label>
              <select value={filters[f.key]} onChange={(e) => setFilters(p => ({ ...p, [f.key]: e.target.value }))} style={{
                fontSize: 11, borderRadius: 6, border: "0.5px solid #d1d5db", padding: "4px 8px",
                background: "#fff", color: "#374151", cursor: "pointer",
              }}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {["Filters", "Refresh", "Export"].map((l) => (
              <button key={l} style={{
                background: "#fff", border: "0.5px solid #d1d5db", borderRadius: 6,
                padding: "4px 10px", fontSize: 11, cursor: "pointer", color: "#374151",
              }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#9ca3af", textAlign: "right", marginBottom: 12 }}>Last Updated: May 15, 2024 10:30 AM</div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, minmax(0, 1fr))", gap: 8, marginBottom: 14 }}>
        {kpis.map((k, i) => <KpiCard key={i} kpi={k} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.7fr 0.65fr 0.65fr", gap: 10, marginBottom: 14 }}>
        {/* Capacity vs Demand */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Capacity vs Demand Trend (FTE)</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityDemandTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ fontSize: 10 }} formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="Capacity" fill={COLORS.blue} name="Total Capacity" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Demand" fill={COLORS.teal} name="Total Demand" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Gap" fill={COLORS.red} name="Gap" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            {[["Total Capacity", COLORS.blue], ["Total Demand", COLORS.teal], ["Gap (FTE)", COLORS.red]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "#6b7280" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
              </span>
            ))}
          </div>
        </div>

        {/* Utilization Trend */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Utilization Trend (%)</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationTrend} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <defs>
                  <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 9 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 9 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ fontSize: 10 }} formatter={(v) => `${v}%`} />
                <Area type="monotone" dataKey="rate" stroke={COLORS.purple} strokeWidth={2} fill="url(#utilGrad)" name="Utilization" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workforce Risks */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Workforce Risks</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ position: "relative", width: 80, height: 80 }}>
              <PieChart width={80} height={80}>
                <Pie data={workforceRisks} cx={39} cy={39} innerRadius={25} outerRadius={38} dataKey="value" startAngle={90} endAngle={-270}>
                  {workforceRisks.map((r, i) => <Cell key={i} fill={r.color} />)}
                </Pie>
              </PieChart>
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>24</div>
                <div style={{ fontSize: 7, color: "#6b7280" }}>Total Risks</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {workforceRisks.map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, padding: "2px 0", color: "#374151" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: r.color }} />{r.name}
                  </span>
                  <span style={{ fontWeight: 700, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Top Risks</div>
            {riskTopItems.map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#6b7280", padding: "1px 0" }}>
                <span>{r.icon} {r.text}</span>
                <span style={{ fontWeight: 700, color: r.color }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Readiness */}
        <div style={{ background: "#fff", border: "0.5px solid #e5e7eb", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Portfolio Readiness</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <div style={{ position: "relative", width: 70, height: 70 }}>
              <PieChart width={70} height={70}>
                <Pie data={[{ value: 78 }, { value: 22 }]} cx={34} cy={34} innerRadius={22} outerRadius={33} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill={COLORS.green} />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.green }}>78%</span>
              </div>
            </div>
            <div>
              {[["On Track", "42%", COLORS.green], ["At Risk", "28%", COLORS.orange], ["Off Track", "18%", COLORS.red], ["Not Started", "12%", COLORS.gray]].map(([l, v, c]) => (
                <div key={l} style={{ display: "flex", gap: 6, fontSize: 9, alignItems: "center", color: "#6b7280", marginBottom: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: c }} />{l} <span style={{ color: c, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#374151", marginBottom: 3 }}>Readiness by Portfolio</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto auto auto auto auto", gap: "2px 6px", fontSize: 9, color: "#6b7280" }}>
            <span style={{ fontWeight: 600 }}>Portfolio</span><span>On Track</span><span>At Risk</span><span>Off Track</span><span>Readiness%</span>
            {portfolioReadiness.map((p) => (
              <>
                <span key={p.portfolio + "n"} style={{ color: "#374151", fontSize: 8 }}>{p.portfolio}</span>
                <span key={p.portfolio + "o"} style={{ color: COLORS.green, fontWeight: 700, textAlign: "center" }}>{p.onTrack}</span>
                <span key={p.portfolio + "a"} style={{ color: COLORS.orange, fontWeight: 700, textAlign: "center" }}>{p.atRisk}</span>
                <span key={p.portfolio + "f"} style={{ color: COLORS.red, fontWeight: 700, textAlign: "center" }}>{p.offTrack}</span>
                <span key={p.portfolio + "r"} style={{ color: COLORS.blue, fontWeight: 700, textAlign: "center" }}>{p.readiness}</span>
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Section header */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#111", marginBottom: 10 }}>Resource Management Reports</div>

      {/* Report cards grid — 5 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10 }}>
        {reportCards.map((card) => (
          <ReportCard key={card.num} card={card} onView={setActiveReport} />
        ))}
      </div>
    </div>
  );
}