import { useMemo } from 'react';
import {
  Users,
  Gauge,
  PieChart as PieChartIcon,
  UserCheck,
  UserX,
  TrendingUp,
  AlertTriangle,
  ClipboardCheck,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const COLORS = {
  blue: 'hsl(var(--kpi-blue))',
  green: 'hsl(var(--kpi-green))',
  orange: 'hsl(var(--kpi-orange))',
  purple: 'hsl(var(--kpi-purple))',
  red: 'hsl(var(--destructive))',
};

const kpiCards = [
  {
    title: 'Total Active Resources',
    value: '2,487',
    change: 'vs last month +3.2%',
    icon: Users,
    color: COLORS.blue,
    bg: 'bg-[hsl(var(--kpi-blue-bg))]',
  },
  {
    title: 'Available Capacity',
    value: '18.6%',
    change: 'vs last month -2.1%',
    icon: Gauge,
    color: COLORS.green,
    bg: 'bg-[hsl(var(--kpi-green-bg))]',
  },
  {
    title: 'Utilization',
    value: '78.4%',
    change: 'QoQ +1.8%',
    icon: PieChartIcon,
    color: COLORS.purple,
    bg: 'bg-[hsl(var(--kpi-purple-bg))]',
  },
  {
    title: 'Allocated Resources',
    value: '1,945',
    change: 'vs last month +2.7%',
    icon: UserCheck,
    color: COLORS.orange,
    bg: 'bg-[hsl(var(--kpi-orange-bg))]',
  },
  {
    title: 'Bench Resources',
    value: '335',
    change: 'vs last month -5.6%',
    icon: UserX,
    color: COLORS.red,
    bg: 'bg-red-100',
  },
  {
    title: 'Forecasted Demand',
    value: '2,721',
    change: 'forecast growth +4.3%',
    icon: TrendingUp,
    color: COLORS.blue,
    bg: 'bg-[hsl(var(--kpi-blue-bg))]',
  },
  {
    title: 'Demand vs Capacity Gap',
    value: '-234',
    change: 'resource shortage',
    icon: AlertTriangle,
    color: COLORS.red,
    bg: 'bg-red-100',
  },
  {
    title: 'Timesheet Compliance',
    value: '93.1%',
    change: 'vs last month +2.5%',
    icon: ClipboardCheck,
    color: COLORS.green,
    bg: 'bg-[hsl(var(--kpi-green-bg))]',
  },
];

const trendData = [
  {
    month: 'Jan 26',
    capacity: 2200,
    allocated: 1500,
    available: 700,
  },
  {
    month: 'Feb 26',
    capacity: 2400,
    allocated: 1700,
    available: 700,
  },
  {
    month: 'Mar 26',
    capacity: 2600,
    allocated: 1750,
    available: 850,
  },
  {
    month: 'Apr 26',
    capacity: 2500,
    allocated: 1680,
    available: 820,
    forecast: 2400,
  },
  {
    month: 'May 26',
    capacity: 2580,
    allocated: 1780,
    available: 800,
    forecast: 2500,
  },
  {
    month: 'Jun 26',
    capacity: 2520,
    allocated: 1600,
    available: 920,
    forecast: 2721,
  },
];

const utilizationData = [
  { name: 'Optimal', value: 54, color: COLORS.blue },
  { name: 'High', value: 22, color: COLORS.orange },
  { name: 'Underutilized', value: 16, color: COLORS.green },
  { name: 'Overallocated', value: 8, color: COLORS.red },
];

const allocationData = [
  { name: 'Engineering', allocated: 78, available: 14, bench: 8 },
  { name: 'Product', allocated: 74, available: 16, bench: 10 },
  { name: 'Architecture', allocated: 81, available: 11, bench: 8 },
  { name: 'Data', allocated: 72, available: 17, bench: 11 },
  { name: 'QA', allocated: 76, available: 14, bench: 10 },
  { name: 'Operations', allocated: 68, available: 17, bench: 15 },
  { name: 'Shared Services', allocated: 63, available: 22, bench: 15 },
];

const forecastVsActuals = [
  { month: 'Jan 26', planned: 115000, forecast: 100000, actual: 95000 },
  { month: 'Feb 26', planned: 118000, forecast: 102000, actual: 98000 },
  { month: 'Mar 26', planned: 120000, forecast: 108000, actual: 99000 },
  { month: 'Apr 26', planned: 125000, forecast: 115000, actual: 104000 },
  { month: 'May 26', planned: 126000, forecast: 112000, actual: 100000 },
  { month: 'Jun 26', planned: 127000, forecast: 118000, actual: 98000 },
];

const capacityHeatmap = [
  {
    skill: 'Cloud Engineering',
    may: 'bg-green-500',
    jun: 'bg-green-400',
    jul: 'bg-yellow-400',
  },
  {
    skill: 'Data Engineering',
    may: 'bg-green-400',
    jun: 'bg-yellow-400',
    jul: 'bg-orange-500',
  },
  {
    skill: 'Software Engineering',
    may: 'bg-yellow-400',
    jun: 'bg-orange-500',
    jul: 'bg-red-500',
  },
  {
    skill: 'QA Automation',
    may: 'bg-yellow-400',
    jun: 'bg-orange-400',
    jul: 'bg-red-500',
  },
  {
    skill: 'DevOps',
    may: 'bg-orange-400',
    jun: 'bg-red-500',
    jul: 'bg-red-600',
  },
];

const resourceCompleteness = [
  { label: 'Skills', value: 95 },
  { label: 'Allocation Data', value: 93 },
  { label: 'Manager Assignment', value: 91 },
  { label: 'Timesheet Data', value: 89 },
  { label: 'Certifications', value: 85 },
];

export default function Dashboard() {
  const overallCompleteness = useMemo(() => {
    const total = resourceCompleteness.reduce(
      (acc, item) => acc + item.value,
      0,
    );

    return Math.round(
      total / resourceCompleteness.length,
    );
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Overview
          </h1>

          <p className="text-muted-foreground text-sm mt-1">
            High level view of capacity, utilization,
            demand and resource health.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <Badge
            variant="outline"
            className="px-3 py-1 text-xs"
          >
            Reporting Period: May 2026
          </Badge>

          <Badge
            variant="outline"
            className="px-3 py-1 text-xs"
          >
            Forecast Horizon: 90 Days
          </Badge>

        </div>
      </div>

      {/* KPI SECTION */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8 gap-4">

  {kpiCards.map((card) => {
    const Icon = card.icon;

    return (
      <Card
        key={card.title}
        className="shadow-sm border bg-card/95 backdrop-blur"
      >
        <CardContent className="p-5">

          <div className="flex items-start justify-between mb-4">

            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${card.bg}`}
            >
              <Icon
                className="h-6 w-6"
                style={{
                  color: card.color,
                }}
              />
            </div>

          </div>

          <div className="text-4xl xl:text-[40px] font-semibold tracking-tight leading-none">
            {card.value}
          </div>

          <div className="text-[15px] xl:text-base font-medium text-muted-foreground mt-3 min-h-[48px] leading-snug">
            {card.title}
          </div>

          <div
            className={`text-[15px] xl:text-base font-semibold mt-3 ${
              card.change.includes('-') ||
              card.change.includes('shortage')
                ? 'text-red-500'
                : 'text-green-600'
            }`}
          >
            {card.change}
          </div>

        </CardContent>
      </Card>
    );
  })}
</div>

      {/* ROW 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CAPACITY TREND */}
        <Card className="xl:col-span-2">

          <CardHeader>
            <CardTitle>
              Capacity vs Demand Trend
            </CardTitle>
          </CardHeader>

          <CardContent className="h-[360px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart data={trendData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="capacity"
                  stroke={COLORS.blue}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Total Capacity"
                />

                <Line
                  type="monotone"
                  dataKey="allocated"
                  stroke={COLORS.green}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Allocated"
                />

                <Line
                  type="monotone"
                  dataKey="available"
                  stroke={COLORS.orange}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Available"
                />

                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke={COLORS.purple}
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  dot={{ r: 4 }}
                  name="Forecast Demand"
                />

              </LineChart>
            </ResponsiveContainer>

          </CardContent>
        </Card>

        {/* UTILIZATION */}
        <Card>

          <CardHeader>
            <CardTitle>
              Utilization Distribution
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="h-[240px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={utilizationData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {utilizationData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

            </div>

            <div className="text-center -mt-32 mb-16">

              <div className="text-3xl font-bold">
                78.4%
              </div>

              <div className="text-sm text-muted-foreground">
                Utilization
              </div>

            </div>

            <div className="space-y-2 mt-8">

              {utilizationData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >

                  <div className="flex items-center gap-2">

                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          item.color,
                      }}
                    />

                    <span>{item.name}</span>

                  </div>

                  <span className="font-medium">
                    {item.value}%
                  </span>

                </div>
              ))}

            </div>

          </CardContent>
        </Card>
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ALLOCATION */}
        <Card>

          <CardHeader>
            <CardTitle>
              Allocation by Function
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {allocationData.map((item) => (
              <div
                key={item.name}
                className="space-y-1"
              >

                <div className="flex justify-between text-sm">

                  <span>{item.name}</span>

                  <span className="font-medium">
                    {item.allocated}%
                  </span>

                </div>

                <div className="flex h-3 overflow-hidden rounded-full bg-muted">

                  <div
                    className="bg-blue-500"
                    style={{
                      width: `${item.allocated}%`,
                    }}
                  />

                  <div
                    className="bg-green-500"
                    style={{
                      width: `${item.available}%`,
                    }}
                  />

                  <div
                    className="bg-orange-400"
                    style={{
                      width: `${item.bench}%`,
                    }}
                  />

                </div>

              </div>
            ))}

            {/* LEGENDS */}

            <div className="flex items-center gap-4 pt-4 text-xs text-muted-foreground flex-wrap">

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span>Allocated</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Available</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-400" />
                <span>Bench</span>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* HEATMAP */}
        <Card>

          <CardHeader>
            <CardTitle>
              Demand vs Available Capacity
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="space-y-4">

              <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground">

                <div>Skill</div>

                <div className="text-center">
                  May
                </div>

                <div className="text-center">
                  Jun
                </div>

                <div className="text-center">
                  Jul
                </div>

              </div>

              {capacityHeatmap.map((row) => (
                <div
                  key={row.skill}
                  className="grid grid-cols-4 items-center gap-2"
                >

                  <div className="text-sm">
                    {row.skill}
                  </div>

                  <div
                    className={`h-8 rounded ${row.may}`}
                  />

                  <div
                    className={`h-8 rounded ${row.jun}`}
                  />

                  <div
                    className={`h-8 rounded ${row.jul}`}
                  />

                </div>
              ))}

            </div>

            {/* HEATMAP LEGENDS */}

            <div className="flex items-center gap-4 pt-5 text-xs text-muted-foreground flex-wrap">

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-green-500" />
                <span>Healthy Capacity</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-yellow-400" />
                <span>Moderate Risk</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-orange-500" />
                <span>High Risk</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-red-500" />
                <span>Critical Shortage</span>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* FORECAST VS ACTUALS */}
        <Card>

          <CardHeader>
            <CardTitle>
              Forecast vs Actuals
            </CardTitle>
          </CardHeader>

          <CardContent className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={forecastVsActuals}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="planned"
                  fill={COLORS.blue}
                  name="Planned"
                />

                <Bar
                  dataKey="forecast"
                  fill={COLORS.green}
                  name="Forecast"
                />

                <Bar
                  dataKey="actual"
                  fill={COLORS.purple}
                  name="Actuals"
                />

              </BarChart>
            </ResponsiveContainer>

          </CardContent>
        </Card>
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

        {/* ALERTS */}
        <Card>

          <CardHeader>
            <CardTitle>
              High Level Risk Alerts
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-4 mb-6">

              <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">

                <AlertTriangle className="h-7 w-7 text-red-500" />

              </div>

              <div>

                <div className="text-3xl font-bold">
                  5
                </div>

                <div className="text-sm text-muted-foreground">
                  Active Alerts
                </div>

              </div>

            </div>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Overallocated Resources</span>
                <Badge variant="destructive">
                  2
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Missing Timesheets</span>
                <Badge className="bg-orange-500">
                  1
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Expiring Contracts</span>
                <Badge className="bg-yellow-500">
                  1
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Critical Skill Shortage</span>
                <Badge variant="destructive">
                  1
                </Badge>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* STAFFING */}
        <Card>

          <CardHeader>
            <CardTitle>
              Pending Staffing Requests
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-4 mb-6">

              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">

                <Users className="h-7 w-7 text-blue-500" />

              </div>

              <div>

                <div className="text-3xl font-bold">
                  27
                </div>

                <div className="text-sm text-muted-foreground">
                  Open Requests
                </div>

              </div>

            </div>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>High Priority</span>
                <span className="font-semibold text-red-500">
                  12
                </span>
              </div>

              <div className="flex justify-between">
                <span>Medium Priority</span>
                <span className="font-semibold text-orange-500">
                  10
                </span>
              </div>

              <div className="flex justify-between">
                <span>Low Priority</span>
                <span className="font-semibold text-green-600">
                  5
                </span>
              </div>

            </div>

          </CardContent>
        </Card>

        {/* DATA COMPLETENESS */}
        <Card>

          <CardHeader>
            <CardTitle>
              Resource Data Completeness
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="flex items-center justify-center mb-6">

              <div className="relative h-36 w-36 rounded-full border-[14px] border-green-500 flex items-center justify-center">

                <div className="text-center">

                  <div className="text-3xl font-bold">
                    {overallCompleteness}%
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Overall
                  </div>

                </div>

              </div>

            </div>

            <div className="space-y-3">

              {resourceCompleteness.map((item) => (
                <div key={item.label}>

                  <div className="flex justify-between text-sm mb-1">

                    <span>{item.label}</span>

                    <span>{item.value}%</span>

                  </div>

                  <Progress
                    value={item.value}
                    className="h-2"
                  />

                </div>
              ))}

            </div>

          </CardContent>
        </Card>

        {/* FORECAST ACCURACY */}
        <Card>

          <CardHeader>
            <CardTitle>
              Forecast Accuracy
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center h-full text-center">

            <div className="h-28 w-28 rounded-full border-[12px] border-blue-500 flex items-center justify-center mb-5">

              <span className="text-3xl font-bold">
                74%
              </span>

            </div>

            <div className="text-sm text-muted-foreground mb-2">
              Forecast Accuracy Score
            </div>

            <Badge className="bg-green-600 hover:bg-green-600">
              +3.6% vs Last Month
            </Badge>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}