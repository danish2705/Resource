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

const reports = [
  { key: 'resource-allocation', name: 'Resource Allocation', description: 'Report For Showing Resource Allocation Across Projects' },
  { key: 'over-allocation', name: 'Resource Over-Allocation', description: 'Report For Showing Resources Over-Allocation' },
  { key: 'availability-shared', name: 'Resource Availability & Shared Resources', description: 'Report For Showing Resources Shared Across Projects With Availability' },
  { key: 'monthly-compliance', name: 'Monthly Compliance', description: 'Report For Showing Monthly Compliance Details' },
  { key: 'budget-variance', name: 'Budget Variance', description: 'Report For Showing Budget Variance' },
  { key: 'vendor-ranking', name: 'Vendor Ranking', description: 'Report For Showing Vendor Ranking Report Based On Budget Spent' },
];

export default function ReportingDashboard() {
  const [active, setActive] = useState<ReportKey | null>(null);
  const [search, setSearch] = useState('');

  const filtered = reports.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase()),
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
              <TableRow
                key={r.key}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => setActive(r.key as ReportKey)}
              >
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-info"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(r.key as ReportKey);
                    }}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-primary">{r.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.description}</TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground text-sm">
                  No reports found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="text-xs text-muted-foreground mt-3">
          Showing {filtered.length} of {reports.length} entries
        </div>
      </CardContent>
    </Card>
  );
}

function ReportView({ keyName }: { keyName: ReportKey }) {
  const { allocations, demands } = useStore();
  const pillars = useActiveValues('pillars');
  const vendors = useActiveValues('vendors');

  // 👉 Keep your existing report logic here (unchanged)

  return null;
}