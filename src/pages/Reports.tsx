import { useMemo } from 'react';
import { useStore, pillars } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0d7377', '#14919b', '#0b5e61', '#32a4a8', '#1a6c6e', '#45b7ba', '#087f82', '#5cc9cc'];

export default function Reports() {
  const { demands } = useStore();

  const byStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    demands.forEach((d) => { counts[d.status] = (counts[d.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [demands]);

  const byPillar = useMemo(() => {
    const sums: Record<string, number> = {};
    demands.forEach((d) => { sums[d.pillar] = (sums[d.pillar] || 0) + d.currentYearForecast; });
    return pillars.map((p) => ({ name: p, forecast: sums[p] || 0 }));
  }, [demands]);

  const byProject = useMemo(() => {
    const counts: Record<string, number> = {};
    demands.forEach((d) => { counts[d.projectName] = (counts[d.projectName] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [demands]);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Reports & Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Demands by Status</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Forecast by Pillar</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byPillar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="forecast" fill="hsl(195, 80%, 30%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Demands by Project</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byProject}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#14919b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-md"><div className="text-2xl font-bold">{demands.length}</div><div className="text-sm text-muted-foreground">Total Demands</div></div>
              <div className="text-center p-4 border rounded-md"><div className="text-2xl font-bold">{demands.filter((d) => d.status === 'Approved').length}</div><div className="text-sm text-muted-foreground">Approved</div></div>
              <div className="text-center p-4 border rounded-md"><div className="text-2xl font-bold">{demands.filter((d) => d.status === 'Pending').length}</div><div className="text-sm text-muted-foreground">Pending</div></div>
              <div className="text-center p-4 border rounded-md"><div className="text-2xl font-bold">${(demands.reduce((s, d) => s + d.currentYearForecast, 0) / 1000000).toFixed(1)}M</div><div className="text-sm text-muted-foreground">Total Forecast</div></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
