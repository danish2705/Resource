import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useActiveValues } from '@/store/useMasterData';
import type { Allocation } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Search, Download, CheckCircle } from 'lucide-react';
import DataTable, { type Column } from '@/components/DataTable';
import HistoryModal from '@/components/HistoryModal';
import ResourceDrilldown from '@/components/ResourceDrilldown';
import { toast } from 'sonner';

export default function ResourceAllocation() {
  const { allocations, updateAllocation } = useStore();
  const levelOptions = useActiveValues('levels');
  const [historyData, setHistoryData] = useState<Allocation['history'] | null>(null);
  const [drillResource, setDrillResource] = useState<string | null>(null);

  const InlineSelect = ({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 text-xs min-w-[100px]"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );

  const InlineInput = ({ value, onChange, type = 'text' }: { value: string | number; onChange: (v: string) => void; type?: string }) => (
    <Input className="h-7 text-xs w-20" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
  );

  const columns: Column<Allocation>[] = [
    { key: 'pillar', header: 'Pillar' },
    { key: 'budgetCode', header: 'Budget Code' },
    { key: 'project', header: 'Project' },
    { key: 'projectRole', header: 'Project Role' },
    { key: 'resourceName', header: 'Resource Name', render: (row) => <button className="text-primary font-medium hover:underline" onClick={() => setDrillResource(row.resourceName)}>{row.resourceName}</button> },
    { key: 'resId', header: 'Res ID' },
    {
      key: 'level', header: 'Level',
      render: (row) => <InlineSelect value={row.level} options={levelOptions} onChange={(v) => updateAllocation(row.id, { level: v })} />,
    },
    {
      key: 'status', header: 'Status',
      render: (row) => <InlineSelect value={row.status} options={['On-Boarded', 'Cancelled', '-- Select --']} onChange={(v) => updateAllocation(row.id, { status: v })} />,
    },
    {
      key: 'chargeType', header: 'Charge Type',
      render: (row) => <InlineSelect value={row.chargeType} options={['Backfill Charge', 'Direct HC Charge', '-- Select --']} onChange={(v) => updateAllocation(row.id, { chargeType: v })} />,
    },
    { key: 'externalPO', header: 'PO (External)' },
    {
      key: 'hourlyRate', header: 'Hourly Rate',
      render: (row) => <InlineInput type="number" value={row.hourlyRate} onChange={(v) => updateAllocation(row.id, { hourlyRate: parseFloat(v) || 0 })} />,
    },
    { key: 'poTitle', header: 'PO Title' },
    { key: 'poApproval', header: 'PO Approval' },
    {
      key: 'action', header: 'Action', sortable: false,
      render: (row) => (
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setHistoryData(row.history)}>
          <History className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Resource Allocation</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline"><Search className="h-4 w-4 mr-1" />Advance Search</Button>
            <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
            <Button size="sm" onClick={() => toast.success('Allocation Updated')}><CheckCircle className="h-4 w-4 mr-1" />Submit</Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={allocations} columns={columns} pageSize={10} />
        </CardContent>
      </Card>

      <HistoryModal open={!!historyData} onOpenChange={() => setHistoryData(null)} history={historyData || []} />
      <ResourceDrilldown resourceName={drillResource} onClose={() => setDrillResource(null)} />
    </div>
  );
}
