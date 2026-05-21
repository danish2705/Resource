import { useMemo, useState } from 'react';
import {
  Users, Gauge, PieChart as PieChartIcon, UserCheck, UserX,
  TrendingUp, AlertTriangle, ClipboardCheck, ChevronRight,
  Activity, Zap, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import type { TooltipProps } from 'recharts';

/* ─────────────────────────── tokens ─────────────────────────── */
const C = {
  blue:   '#2563EB',
  blueSoft: '#DBEAFE',
  green:  '#16A34A',
  greenSoft: '#DCFCE7',
  orange: '#EA580C',
  orangeSoft: '#FFEDD5',
  purple: '#7C3AED',
  purpleSoft: '#EDE9FE',
  red:    '#DC2626',
  redSoft:  '#FEE2E2',
  amber:  '#D97706',
  amberSoft: '#FEF3C7',
  slate:  '#64748B',
  border: '#E2E8F0',
  bg:     '#F8FAFC',
  surface: '#FFFFFF',
};

/* ─────────────────────────── data ─────────────────────────────── */
const kpiCards = [
  { title: 'Total Active Resources', value: '2,487', raw: 2487, change: '+3.2%', up: true,  icon: Users,         accent: C.blue,   soft: C.blueSoft  },
  { title: 'Available Capacity',     value: '18.6%', raw: 18.6, change: '-2.1%', up: false, icon: Gauge,         accent: C.green,  soft: C.greenSoft },
  { title: 'Utilization Rate',       value: '78.4%', raw: 78.4, change: '+1.8%', up: true,  icon: PieChartIcon,  accent: C.purple, soft: C.purpleSoft},
  { title: 'Allocated Resources',    value: '1,945', raw: 1945, change: '+2.7%', up: true,  icon: UserCheck,     accent: C.orange, soft: C.orangeSoft},
  { title: 'Bench Resources',        value: '335',   raw: 335,  change: '-5.6%', up: true,  icon: UserX,         accent: C.amber,  soft: C.amberSoft },
  { title: 'Forecasted Demand',      value: '2,721', raw: 2721, change: '+4.3%', up: true,  icon: TrendingUp,    accent: C.blue,   soft: C.blueSoft  },
  { title: 'Demand vs Capacity Gap', value: '-234',  raw: -234, change: 'shortage', up: false, icon: AlertTriangle, accent: C.red, soft: C.redSoft },
  { title: 'Timesheet Compliance',   value: '93.1%', raw: 93.1, change: '+2.5%', up: true,  icon: ClipboardCheck,accent: C.green, soft: C.greenSoft },
];

const trendData = [
  { month: 'Jan', capacity: 2200, allocated: 1500, available: 700 },
  { month: 'Feb', capacity: 2400, allocated: 1700, available: 700 },
  { month: 'Mar', capacity: 2600, allocated: 1750, available: 850 },
  { month: 'Apr', capacity: 2500, allocated: 1680, available: 820, forecast: 2400 },
  { month: 'May', capacity: 2580, allocated: 1780, available: 800, forecast: 2500 },
  { month: 'Jun', capacity: 2520, allocated: 1600, available: 920, forecast: 2721 },
];

const utilizationData = [
  { name: 'Optimal',      value: 54, color: C.blue   },
  { name: 'High',         value: 22, color: C.orange  },
  { name: 'Underutilized',value: 16, color: C.green   },
  { name: 'Overallocated',value:  8, color: C.red     },
];

const allocationData = [
  { name: 'Engineering',     allocated: 78, available: 14, bench: 8  },
  { name: 'Product',         allocated: 74, available: 16, bench: 10 },
  { name: 'Architecture',    allocated: 81, available: 11, bench: 8  },
  { name: 'Data',            allocated: 72, available: 17, bench: 11 },
  { name: 'QA',              allocated: 76, available: 14, bench: 10 },
  { name: 'Operations',      allocated: 68, available: 17, bench: 15 },
  { name: 'Shared Services', allocated: 63, available: 22, bench: 15 },
];

const forecastVsActuals = [
  { month: 'Jan', planned: 115, forecast: 100, actual: 95  },
  { month: 'Feb', planned: 118, forecast: 102, actual: 98  },
  { month: 'Mar', planned: 120, forecast: 108, actual: 99  },
  { month: 'Apr', planned: 125, forecast: 115, actual: 104 },
  { month: 'May', planned: 126, forecast: 112, actual: 100 },
  { month: 'Jun', planned: 127, forecast: 118, actual: 98  },
];

const heatmap = [
  { skill: 'Cloud Engineering',    may: '#22C55E', jun: '#86EFAC', jul: '#FDE047' },
  { skill: 'Data Engineering',     may: '#86EFAC', jun: '#FDE047', jul: '#F97316' },
  { skill: 'Software Engineering', may: '#FDE047', jun: '#F97316', jul: '#EF4444' },
  { skill: 'QA Automation',        may: '#FDE047', jun: '#FB923C', jul: '#EF4444' },
  { skill: 'DevOps',               may: '#FB923C', jun: '#EF4444', jul: '#B91C1C' },
];

const completeness = [
  { label: 'Skills',              value: 95 },
  { label: 'Allocation Data',     value: 93 },
  { label: 'Manager Assignment',  value: 91 },
  { label: 'Timesheet Data',      value: 89 },
  { label: 'Certifications',      value: 85 },
];

const alerts = [
  { label: 'Overallocated Resources', count: 2, variant: 'red'    },
  { label: 'Missing Timesheets',      count: 1, variant: 'orange' },
  { label: 'Expiring Contracts',      count: 1, variant: 'amber'  },
  { label: 'Critical Skill Shortage', count: 1, variant: 'red'    },
];

const staffing = [
  { label: 'High Priority',   count: 12, color: C.red    },
  { label: 'Medium Priority', count: 10, color: C.orange },
  { label: 'Low Priority',    count:  5, color: C.green  },
];

/* ─────────────────────────── sub-components ─────────────────── */

const alertColors = {
  red:    { bg: '#FEE2E2', text: '#B91C1C', dot: '#EF4444' },
  orange: { bg: '#FFEDD5', text: '#C2410C', dot: '#F97316' },
  amber:  { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' },
};

type PillProps = {
  children: React.ReactNode;
  color?: string;
  bg?: string;
};

function Pill({
  children,
  color = C.blue,
  bg,
}: PillProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 10px',
        borderRadius: 9999,
        fontSize: 11,
        fontWeight: 600,
        background: bg || color + '18',
        color,
      }}
    >
      {children}
    </span>
  );
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: '#1E293B',
        border: '1px solid #334155',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: 12,
        color: '#F1F5F9',
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 6,
          color: '#94A3B8',
        }}
      >
        {label}
      </div>

      {payload.map((p, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 2,
          }}
        >
          <span style={{ color: p.color }}>
            {p.name}
          </span>

          <span style={{ fontWeight: 600 }}>
            {p.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: C.slate, marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────── KPI card ─────────────────────────── */
function KpiCard({ card }) {
  const Icon = card.icon;
  const isNegativeChange = !card.up;
  return (
    <div style={{
      background: C.surface, borderRadius: 16, padding: '20px 20px 18px',
      border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column',
      gap: 0, position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* accent strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: card.accent, borderRadius: '16px 16px 0 0' }} />

      {/* icon */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: card.soft,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
      }}>
        <Icon size={18} color={card.accent} />
      </div>

      {/* value */}
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 6 }}>
        {card.value}
      </div>

      {/* title */}
      <div style={{ fontSize: 12, color: C.slate, fontWeight: 500, marginBottom: 10, lineHeight: 1.4, minHeight: 32 }}>
        {card.title}
      </div>

      {/* change */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }}>
        {card.change === 'shortage' ? (
          <span style={{ color: C.red }}>⚠ Resource shortage</span>
        ) : (
          <>
            {isNegativeChange
              ? <ArrowDownRight size={13} color={C.red} />
              : <ArrowUpRight size={13} color={C.green} />}
            <span style={{ color: isNegativeChange ? C.red : C.green }}>{card.change}</span>
            <span style={{ color: '#00050b', fontWeight: 600 }}>vs Jan 2026</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN ─────────────────────────────── */
export default function Dashboard() {
  const overall = useMemo(() => Math.round(completeness.reduce((s, i) => s + i.value, 0) / completeness.length), []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '28px 32px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 0 3px ${C.greenSoft}` }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.green, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live</span>
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.03em' }}>
            Overview
          </h1>
          <p style={{ fontSize: 13, color: C.slate, marginTop: 4, fontWeight: 400 }}>
            Capacity · Utilization · Demand · Resource Health
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: '7px 14px', fontSize: 12, fontWeight: 600, color: '#475569',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Activity size={13} color={C.blue} />
            May 2026
          </div>
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: '7px 14px', fontSize: 12, fontWeight: 600, color: '#475569',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Zap size={13} color={C.orange} />
            90-day Horizon
          </div>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <SectionLabel>Key Performance Indicators</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 12, marginBottom: 28 }}>
        {kpiCards.map((c) => <KpiCard key={c.title} card={c} />)}
      </div>

      {/* ── ROW 1: trend + utilization ── */}
      <SectionLabel>Capacity & Utilization</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Capacity trend */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Capacity vs Demand Trend</div>
              <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>Jan – Jun 2026</div>
            </div>
            <Pill color={C.blue}>FTE</Pill>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />
                <Line type="monotone" dataKey="capacity"  stroke={C.blue}   strokeWidth={2.5} dot={{ r: 4, fill: C.blue,   strokeWidth: 0 }} name="Total Capacity" />
                <Line type="monotone" dataKey="allocated" stroke={C.green}  strokeWidth={2.5} dot={{ r: 4, fill: C.green,  strokeWidth: 0 }} name="Allocated" />
                <Line type="monotone" dataKey="available" stroke={C.orange} strokeWidth={2.5} dot={{ r: 4, fill: C.orange, strokeWidth: 0 }} name="Available" />
                <Line type="monotone" dataKey="forecast"  stroke={C.purple} strokeWidth={2}   dot={{ r: 4, fill: C.purple, strokeWidth: 0 }} strokeDasharray="6 4" name="Forecast Demand" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Utilization donut */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Utilization Distribution</div>
          <div style={{ fontSize: 12, color: C.slate, marginBottom: 16 }}>Current period breakdown</div>
          <div style={{ position: 'relative', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={utilizationData} innerRadius={68} outerRadius={95} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {utilizationData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>78.4%</div>
              <div style={{ fontSize: 11, color: C.slate, fontWeight: 500 }}>Utilization</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {utilizationData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                  <span style={{ color: '#475569' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: allocation + heatmap + forecast ── */}
      <SectionLabel>Allocation & Forecast</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Allocation by function */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Allocation by Function</div>
          <div style={{ fontSize: 12, color: C.slate, marginBottom: 20 }}>Breakdown across teams</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {allocationData.map((item) => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.allocated}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${item.allocated}%`, background: C.blue,   borderRadius: '99px 0 0 99px', transition: 'width 0.5s ease' }} />
                  <div style={{ width: `${item.available}%`, background: C.green }} />
                  <div style={{ width: `${item.bench}%`,    background: C.orange, borderRadius: '0 99px 99px 0' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
            {[['Allocated', C.blue], ['Available', C.green], ['Bench', C.orange]].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.slate }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Demand vs Capacity</div>
          <div style={{ fontSize: 12, color: C.slate, marginBottom: 20 }}>Skill availability heatmap</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px', gap: 8, fontSize: 11, color: C.slate, fontWeight: 600, marginBottom: 8 }}>
            <span>Skill</span>
            {['May', 'Jun', 'Jul'].map(m => <span key={m} style={{ textAlign: 'center' }}>{m}</span>)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {heatmap.map((row) => (
              <div key={row.skill} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>{row.skill}</span>
                {['may', 'jun', 'jul'].map(m => (
                  <div key={m} style={{
                    height: 32, borderRadius: 8, background: row[m],
                    opacity: 0.85, transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18 }}>
            {[['Healthy', '#22C55E'], ['Moderate Risk', '#FDE047'], ['High Risk', '#F97316'], ['Critical', '#EF4444']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: C.slate }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Forecast vs Actuals */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Forecast vs Actuals</div>
          <div style={{ fontSize: 12, color: C.slate, marginBottom: 16 }}>Budget (K) comparison</div>
          <div style={{ height: 270 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastVsActuals} barSize={10} barCategoryGap="30%" margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.slate }} axisLine={false} tickLine={false} tickFormatter={v => `${v}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="planned"  fill={C.blue}   radius={[4, 4, 0, 0]} name="Planned"   />
                <Bar dataKey="forecast" fill={C.green}  radius={[4, 4, 0, 0]} name="Forecast"  />
                <Bar dataKey="actual"   fill={C.purple} radius={[4, 4, 0, 0]} name="Actuals"   />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── ROW 3: alerts + staffing + completeness + accuracy ── */}
      <SectionLabel>Risk & Data Health</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>

        {/* Alerts */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Risk Alerts</div>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: C.redSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertTriangle size={15} color={C.red} />
            </div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 2 }}>5</div>
          <div style={{ fontSize: 12, color: C.slate, marginBottom: 20 }}>Active alerts requiring attention</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {alerts.map((a) => {
              const col = alertColors[a.variant];
              return (
                <div key={a.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', borderRadius: 10, background: col.bg,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: col.text, fontWeight: 500 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: col.dot }} />
                    {a.label}
                  </div>
                  <span style={{
                    background: col.dot, color: '#fff', borderRadius: 99, padding: '1px 8px',
                    fontSize: 11, fontWeight: 700, minWidth: 22, textAlign: 'center',
                  }}>{a.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staffing */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Pending Staffing</div>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: C.blueSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Users size={15} color={C.blue} />
            </div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 2 }}>27</div>
          <div style={{ fontSize: 12, color: C.slate, marginBottom: 20 }}>Open staffing requests</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {staffing.map((s) => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.count}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{ width: `${(s.count / 27) * 100}%`, height: '100%', background: s.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Completeness */}
        <div style={{ background: C.surface, borderRadius: 16, padding: '22px 24px', border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Data Completeness</div>
          <div style={{ fontSize: 12, color: C.slate, marginBottom: 20 }}>Resource profile quality</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              border: `10px solid ${C.green}`, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 4px ${C.greenSoft}`,
            }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>{overall}%</span>
              <span style={{ fontSize: 10, color: C.slate }}>Overall</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {completeness.map((item) => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: '#475569', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.value}%</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: '#F1F5F9', overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.value}%`, height: '100%', borderRadius: 99,
                    background: item.value >= 90 ? C.green : item.value >= 85 ? C.amber : C.red,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Accuracy */}
        <div style={{
          background: C.surface, borderRadius: 16, padding: '22px 24px',
          border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Forecast Accuracy</div>
            <div style={{ fontSize: 12, color: C.slate, marginBottom: 24 }}>Model performance score</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              border: `10px solid ${C.blue}`, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 4px ${C.blueSoft}`,
            }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>74%</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 24 }}>
            <span style={{ fontSize: 12, color: C.slate }}>Forecast Accuracy Score</span>
            <div style={{
              background: C.greenSoft, color: C.green, borderRadius: 99, padding: '4px 14px',
              fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <ArrowUpRight size={13} /> +3.6% vs Last Month
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}