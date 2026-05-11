import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useActiveValues } from '@/store/useMasterData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, FileText, DollarSign, Users, Check, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import DataTable, { type Column } from '@/components/DataTable';
import type { WorklistItem } from '@/store/useStore';
import { toast } from 'sonner';

// Distinct pillar colors via CSS tokens (resolved at runtime to HSL)
const PILLAR_COLORS = [
  'hsl(var(--pillar-1))',
  'hsl(var(--pillar-2))',
  'hsl(var(--pillar-3))',
  'hsl(var(--pillar-4))',
  'hsl(var(--pillar-5))',
];

export default function Dashboard() {
  const { demands, allocations, worklist, selectedProject, setSelectedProject, approveWorklistItem, rejectWorklistItem } = useStore();
  const pillars = useActiveValues('pillars');
  const projects = useActiveValues('projects');

  const filteredDemands = selectedProject === 'Global' ? demands : demands.filter((d) => d.projectName === selectedProject);

  const stats = useMemo(() => {
    const vendorSet = new Set(filteredDemands.filter((d) => d.vendorName).map((d) => d.vendorName));
    const openPOs = filteredDemands.filter((d) => d.status === 'Pending' || d.status === 'Awaiting Approval').length;
    const budget = filteredDemands.reduce((s, d) => s + d.currentYearForecast, 0);
    const resources = allocations.length;
    return { vendors: vendorSet.size || 5, openPOs: openPOs || 13, budget: budget || 6896697.07, resources: resources || 51 };
  }, [filteredDemands, allocations]);

  const pillarData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredDemands.forEach((d) => { counts[d.pillar] = (counts[d.pillar] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return pillars.map((p) => ({ name: p, value: counts[p] || 0, pct: Math.round(((counts[p] || 0) / total) * 100) }));
  }, [filteredDemands]);

  const spendData = useMemo(() => {
    const sums: Record<string, number> = {};
    filteredDemands.forEach((d) => { sums[d.pillar] = (sums[d.pillar] || 0) + d.currentYearForecast; });
    return pillars.map((p) => ({ name: p, spend: sums[p] || 0 }));
  }, [filteredDemands]);

  const vendorSpend = useMemo(() => {
    const sums: Record<string, number> = {};
    filteredDemands.filter((d) => d.vendorName).forEach((d) => { sums[d.vendorName] = (sums[d.vendorName] || 0) + d.currentYearForecast; });
    return Object.entries(sums).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, spend]) => ({ name: name.substring(0, 16) + (name.length > 16 ? '...' : ''), spend }));
  }, [filteredDemands]);

  const demandStats = useMemo(() => {
    const total = filteredDemands.length;
    const completed = filteredDemands.filter((d) => d.status === 'Approved').length;
    const pending = filteredDemands.filter((d) => d.status === 'Pending').length;
    const awaiting = filteredDemands.filter((d) => d.status === 'Awaiting Approval').length;
    const rejected = filteredDemands.filter((d) => d.status === 'Rejected').length;
    return { total, completed, pending, awaiting, rejected, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [filteredDemands]);

  const employeeCount = allocations.filter((a) => a.chargeType !== 'Backfill Charge').length || 25;
  const contractorCount = allocations.filter((a) => a.chargeType === 'Backfill Charge').length || 26;
  const totalEmpCont = employeeCount + contractorCount;

  const worklistColumns: Column<WorklistItem>[] = [
    {
      key: 'action', header: 'Action', sortable: false,
      render: (row) => row.status === 'Open' ? (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-success" onClick={() => { approveWorklistItem(row.id); toast.success('Item Approved'); }}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive" onClick={() => { rejectWorklistItem(row.id); toast.error('Item Rejected'); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null,
    },
    { key: 'activityType', header: 'Activity Type' },
    { key: 'summary', header: 'Summary', render: (row) => <span>{row.summary} <button className="text-info text-sm underline ml-1">View Details</button></span> },
    { key: 'project', header: 'Project' },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status === 'Open' ? 'outline' : row.status === 'Approved' ? 'default' : 'destructive'}>{row.status}</Badge> },
    { key: 'dueBy', header: 'Due By' },
  ];

  const kpis = [
    { label: 'Vendors', value: stats.vendors, icon: Briefcase, ringClass: 'bg-[hsl(var(--kpi-blue-bg))] text-[hsl(var(--kpi-blue))]', barClass: 'bg-[hsl(var(--kpi-blue))]' },
    { label: 'Open Purchase Orders', value: stats.openPOs, icon: FileText, ringClass: 'bg-[hsl(var(--kpi-orange-bg))] text-[hsl(var(--kpi-orange))]', barClass: 'bg-[hsl(var(--kpi-orange))]' },
    { label: 'Budget', value: `$${stats.budget.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, ringClass: 'bg-[hsl(var(--kpi-green-bg))] text-[hsl(var(--kpi-green))]', barClass: 'bg-[hsl(var(--kpi-green))]' },
    { label: 'Resources', value: stats.resources, icon: Users, ringClass: 'bg-[hsl(var(--kpi-purple-bg))] text-[hsl(var(--kpi-purple))]', barClass: 'bg-[hsl(var(--kpi-purple))]' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Select project:</span>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-52 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Global">Global</SelectItem>
              {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs">Based On Current Financial Year</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} className="overflow-hidden relative">
              <div className={`absolute top-0 left-0 h-1 w-full ${k.barClass}`} />
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${k.ringClass}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{k.value}</div>
                  <div className="text-sm text-muted-foreground">{k.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Enterprise Program Resources</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pillarData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, pct }: any) => `${name} ${pct}%`} labelLine={false}>
                  {pillarData.map((_, i) => <Cell key={i} fill={PILLAR_COLORS[i % PILLAR_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Spend By Pillar</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="spend" radius={[4, 4, 0, 0]}>
                  {spendData.map((_, i) => <Cell key={i} fill={PILLAR_COLORS[i % PILLAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Top Vendors Spend</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorSpend} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                  {vendorSpend.map((_, i) => <Cell key={i} fill={PILLAR_COLORS[i % PILLAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Allocation Statistics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><div className="flex justify-between text-sm mb-1"><span>Over Allocated</span><span>18/51</span></div><Progress value={35} className="h-2 [&>div]:bg-destructive" /></div>
            <div><div className="flex justify-between text-sm mb-1"><span>Shared</span><span>6/51</span></div><Progress value={12} className="h-2 [&>div]:bg-info" /></div>
            <div><div className="flex justify-between text-sm mb-1"><span>Availability</span><span>5/51</span></div><Progress value={10} className="h-2 [&>div]:bg-success" /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Demand Statistics</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 border rounded-md"><div className="text-sm text-muted-foreground">Total Demand</div><div className="text-2xl font-bold">{demandStats.total}</div></div>
              <div className="text-center p-3 border rounded-md"><div className="text-sm text-muted-foreground">Completed Demand</div><div className="text-2xl font-bold">{demandStats.completed}</div></div>
            </div>
            <Progress value={demandStats.pct} className="h-4 mb-3 [&>div]:bg-success" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>✅ Completed</span><span>{demandStats.completed}</span></div>
              <div className="flex justify-between"><span>⏳ Pending</span><span>{demandStats.pending}</span></div>
              <div className="flex justify-between"><span>🔴 Awaiting Approval</span><span>{demandStats.awaiting}</span></div>
              <div className="flex justify-between"><span>⛔ Rejected</span><span>{demandStats.rejected}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Resources By Employment Type</CardTitle></CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Employees', value: employeeCount }, { name: 'Contractors', value: contractorCount }]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, value }) => `${Math.round((value / totalEmpCont) * 100)}%`}>
                  <Cell fill="hsl(var(--kpi-blue))" />
                  <Cell fill="hsl(var(--kpi-purple))" />
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">My Worklist</CardTitle></CardHeader>
        <CardContent>
          <DataTable data={worklist} columns={worklistColumns} pageSize={5} />
        </CardContent>
      </Card>
    </div>
  );
}
