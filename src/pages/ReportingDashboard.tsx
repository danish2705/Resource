import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useActiveValues } from '@/store/useMasterData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { BarChart3, ArrowLeft, Search } from 'lucide-react';

const PILLAR_COLORS = [
  'hsl(var(--pillar-1))',
  'hsl(var(--pillar-2))',
  'hsl(var(--pillar-3))',
  'hsl(var(--pillar-4))',
  'hsl(var(--pillar-5))',
];

type ReportKey =
  | 'resource-allocation'
  | 'over-allocation'
  | 'availability-shared'
  | 'monthly-compliance'
  | 'budget-variance'
  | 'vendor-ranking';

const reports: { key: ReportKey; name: string; description: string }[] = [
  { key: 'resource-allocation', name: 'Resource Allocation',                description: 'Report For Showing Resource Allocation Across Projects' },
  { key: 'over-allocation',     name: 'Resource Over-Allocation',           description: 'Report For Showing Resources Over-Allocation' },
  { key: 'availability-shared', name: 'Resource Availability & Shared Resources', description: 'Report For Showing Resources Shared Across Projects With Availability' },
  { key: 'monthly-compliance',  name: 'Monthly Compliance',                 description: 'Report For Showing Monthly Compliance Details' },
  { key: 'budget-variance',     name: 'Budget Variance',                    description: 'Report For Showing Budget Variance' },
  { key: 'vendor-ranking',      name: 'Vendor Ranking',                     description: 'Report For Showing Vendor Ranking Report Based On Budget Spent' },
];

export default function ReportingDashboard() {
  const [active, setActive] = useState<ReportKey | null>(null);
  const [search, setSearch] = useState('');

  const filtered = reports.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()),
  );

  if (active) {
    const meta = reports.find((r) => r.key === active)!;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActive(null)}>
            <ArrowLeft className="h-4 w-4 mr-1" />Back
          </Button>
          <h2 className="text-base font-semibold">{meta.name}</h2>
          <Badge variant="outline" className="ml-2">{meta.description}</Badge>
        </div>
        <ReportView keyName={active} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Reporting Dashboard</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8 h-9" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Run</TableHead>
              <TableHead>Report</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.key} className="hover:bg-muted/50 cursor-pointer" onClick={() => setActive(r.key)}>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-info" onClick={(e) => { e.stopPropagation(); setActive(r.key); }}>
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-primary">{r.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.description}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground text-sm">No reports found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="text-xs text-muted-foreground mt-3">Showing {filtered.length} of {reports.length} entries</div>
      </CardContent>
    </Card>
  );
}

function ReportView({ keyName }: { keyName: ReportKey }) {
  const { allocations, demands } = useStore();
  const pillars = useActiveValues('pillars');
  const vendors = useActiveValues('vendors');

  if (keyName === 'resource-allocation') {
    const byProject = allocations.reduce<Record<string, number>>((acc, a) => { acc[a.project] = (acc[a.project] || 0) + 1; return acc; }, {});
    const data = Object.entries(byProject).map(([name, count]) => ({ name, count }));
    return (
      <Card><CardContent className="h-80 pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip /><Legend />
            <Bar dataKey="count" name="Allocations" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={PILLAR_COLORS[i % PILLAR_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent></Card>
    );
  }

  if (keyName === 'over-allocation') {
    const byResource: Record<string, number> = {};
    allocations.forEach((a) => { byResource[a.resourceName] = (byResource[a.resourceName] || 0) + a.allocationPercent; });
    const rows = Object.entries(byResource).map(([name, pct]) => ({ name, pct })).sort((a, b) => b.pct - a.pct);
    const statusColor = (pct: number) =>
      pct > 100 ? 'hsl(var(--destructive))'
      : pct > 80 ? 'hsl(var(--kpi-orange))'
      : 'hsl(var(--kpi-green))';
    return (
      <div className="space-y-4">
        <Card><CardContent className="h-72 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 'dataMax']} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="pct" name="Total Allocation %" radius={[0, 4, 4, 0]}>
                {rows.map((r, i) => <Cell key={i} fill={statusColor(r.pct)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Resource</TableHead><TableHead>Total %</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.pct}%</TableCell>
                  <TableCell><Badge variant={r.pct > 100 ? 'destructive' : r.pct > 80 ? 'secondary' : 'outline'}>{r.pct > 100 ? 'Over Allocated' : r.pct > 80 ? 'Near Cap' : 'Healthy'}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    );
  }

  if (keyName === 'availability-shared') {
    const counts: Record<string, number> = {};
    allocations.forEach((a) => { counts[a.resourceName] = (counts[a.resourceName] || 0) + 1; });
    const shared = Object.entries(counts).filter(([, c]) => c > 1).map(([name, projects]) => ({ name, projects, availability: Math.max(0, 100 - projects * 30) }));
    return (
      <div className="space-y-4">
        {shared.length > 0 && (
          <Card><CardContent className="h-72 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shared}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip /><Legend />
                <Bar dataKey="projects" name="# Projects" fill="hsl(var(--kpi-purple))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="availability" name="Availability %" fill="hsl(var(--kpi-green))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        )}
        <Card><CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Resource</TableHead><TableHead># Projects</TableHead><TableHead>Availability</TableHead></TableRow></TableHeader>
            <TableBody>
              {shared.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.projects}</TableCell>
                  <TableCell><Badge variant={r.availability < 30 ? 'destructive' : r.availability < 60 ? 'secondary' : 'outline'}>{r.availability}%</Badge></TableCell>
                </TableRow>
              ))}
              {shared.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground text-sm">No shared resources</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    );
  }

  if (keyName === 'monthly-compliance') {
    const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({ month: m, compliance: 70 + ((i * 13) % 25), target: 90 }));
    return (
      <Card><CardContent className="h-80 pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" /><YAxis domain={[0, 100]} />
            <Tooltip formatter={(v) => `${v}%`} /><Legend />
            <Line type="monotone" dataKey="compliance" name="Compliance" stroke="hsl(var(--kpi-blue))" strokeWidth={3} dot={{ fill: 'hsl(var(--kpi-blue))', r: 5 }} />
            <Line type="monotone" dataKey="target" name="Target" stroke="hsl(var(--kpi-green))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent></Card>
    );
  }

  if (keyName === 'budget-variance') {
    const data = pillars.map((p) => {
      const planned = demands.filter((d) => d.pillar === p).reduce((s, d) => s + d.currentYearForecast, 0);
      const actual = planned * (0.8 + Math.random() * 0.4);
      return { name: p, planned, actual: Math.round(actual) };
    });
    return (
      <Card><CardContent className="h-80 pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} /><Legend />
            <Bar dataKey="planned" name="Planned" fill="hsl(var(--kpi-blue))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="hsl(var(--kpi-orange))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent></Card>
    );
  }

  if (keyName === 'vendor-ranking') {
    const sums: Record<string, number> = {};
    demands.filter((d) => d.vendorName).forEach((d) => { sums[d.vendorName] = (sums[d.vendorName] || 0) + d.currentYearForecast; });
    const data = vendors.map((v) => ({ name: v, spend: sums[v] || 0 })).sort((a, b) => b.spend - a.spend);
    return (
      <Card><CardContent className="h-80 pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="spend" label={(p: any) => `${p.name}: $${((p.spend ?? 0) / 1000).toFixed(0)}k`}>
              {data.map((_, i) => <Cell key={i} fill={PILLAR_COLORS[i % PILLAR_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} /><Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent></Card>
    );
  }

  return null;
}
