import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useActiveValues } from '@/store/useMasterData';
import type { Demand } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pencil, Trash2, History, Plus, Search, Download, Upload } from 'lucide-react';
import DataTable, { type Column } from '@/components/DataTable';
import HistoryModal from '@/components/HistoryModal';
import { toast } from 'sonner';

const statusColor = (s: string) => {
  switch (s) {
    case 'Approved': return 'default';
    case 'Pending': return 'outline';
    case 'Rejected': return 'destructive';
    default: return 'secondary';
  }
};

const ALLOC_YEARS = ['current', 'y2027', 'y2028', 'y2029', 'y2030'] as const;
const FORECAST_YEARS = ALLOC_YEARS;

type DemandForm = {
  portfolio: string; program: string; projectName: string; projectRole: string; budgetCode: string; pillar: string; allocationPercent: number;
  status: Demand['status']; comments: string; identified: boolean; estimatedRate: number; currentYearForecast: number;
  resourceName: string; workstream: string; subTeam: string; startDate: string; endDate: string; type: Demand['type'];
  vendorName: string; country: string;
  allocation: { current: number; y2027: number; y2028: number; y2029: number; y2030: number };
  forecast: { current: number; y2027: number; y2028: number; y2029: number; y2030: number };
};

const emptyDemand: DemandForm = {
  portfolio: 'Hi-tech', program: 'Enterprise', projectName: '', projectRole: '', budgetCode: '', pillar: '', allocationPercent: 0,
  status: 'Pending', comments: '', identified: false, estimatedRate: 0, currentYearForecast: 0,
  resourceName: '', workstream: '', subTeam: '', startDate: '', endDate: '', type: 'Internal',
  vendorName: '', country: 'Sydney',
  allocation: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
  forecast: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
};

const yearLabel = (k: string) => k === 'current' ? 'Current Year' : k.replace('y', '');

// CSV/Excel parsing
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ''; });
    return row;
  });
}

function mapRowToDemand(row: Record<string, string>): DemandForm | null {
  const projectName = row['Project Name'] || row['Project'] || row['projectName'] || '';
  const pillar = row['Pillar'] || row['pillar'] || '';
  if (!projectName && !pillar) return null;
  return {
    portfolio: row['Portfolio'] || pillar || 'Hi-tech',
    program: row['Program'] || 'Enterprise',
    projectName,
    projectRole: row['Project Role'] || row['Role'] || row['projectRole'] || '',
    budgetCode: row['Budget Code'] || row['budgetCode'] || '',
    pillar,
    allocationPercent: parseFloat(row['Allocation (%)'] || row['allocationPercent'] || '0') || 0,
    status: 'Pending',
    comments: row['Comments'] || '',
    identified: (row['Identified'] || '').toLowerCase() === 'yes',
    estimatedRate: parseFloat(row['Estimated Rate'] || row['estimatedRate'] || '0') || 0,
    currentYearForecast: parseFloat(row['Current Year Forecast'] || row['currentYearForecast'] || '0') || 0,
    resourceName: row['Resource Name'] || row['resourceName'] || '',
    workstream: row['Workstream'] || row['workstream'] || '',
    subTeam: row['Sub Team'] || row['subTeam'] || '',
    startDate: row['Start Date'] || row['startDate'] || '',
    endDate: row['End Date'] || row['endDate'] || '',
    type: (row['Type'] || row['type'] || 'Internal') as 'Internal' | 'External',
    vendorName: row['Vendor Name'] || row['vendorName'] || '',
    country: row['Country'] || row['Location'] || row['country'] || 'Sydney',
    allocation: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
    forecast: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
  };
}

export default function DemandManagement() {
  const { demands, addDemand, addDemands, updateDemand, deleteDemand } = useStore();
  const projects = useActiveValues('projects');
  const pillars = useActiveValues('pillars');
  const roles = useActiveValues('roles');
  const vendors = useActiveValues('vendors');
  const resourceNames = useActiveValues('resources');
  const portfolios = useActiveValues('portfolios');
  const programs = useActiveValues('programs');
  const locationOpts = useActiveValues('countries');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyDemand);
  const [showAdvSearch, setShowAdvSearch] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<Demand['history'] | null>(null);

  // Import state
  const [importChooserOpen, setImportChooserOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importPreview, setImportPreview] = useState<DemandForm[]>([]);
  const [importSource, setImportSource] = useState<'Excel' | 'Jira' | 'Planisware' | 'Smartsheets' | 'Connected Source'>('Excel');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters
  const [fProject, setFProject] = useState('all');
  const [fRole, setFRole] = useState('all');
  const [fPillar, setFPillar] = useState('all');
  const [fStatus, setFStatus] = useState('all');

  const filtered = useMemo(() => {
    return demands.filter((d) =>
      (fProject === 'all' || d.projectName === fProject) &&
      (fRole === 'all' || d.projectRole === fRole) &&
      (fPillar === 'all' || d.pillar === fPillar) &&
      (fStatus === 'all' || d.status === fStatus)
    );
  }, [demands, fProject, fRole, fPillar, fStatus]);

  const openCreate = () => { setEditId(null); setForm(emptyDemand); setShowForm(true); };

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      openCreate();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const openEdit = (d: Demand) => {
    setEditId(d.id);
    setForm({
      portfolio: d.portfolio || d.pillar, program: d.program, projectName: d.projectName, projectRole: d.projectRole, budgetCode: d.budgetCode,
      pillar: d.pillar, allocationPercent: d.allocationPercent, status: d.status, comments: d.comments,
      identified: d.identified, estimatedRate: d.estimatedRate, currentYearForecast: d.currentYearForecast,
      resourceName: d.resourceName, workstream: d.workstream, subTeam: d.subTeam, startDate: d.startDate,
      endDate: d.endDate, type: d.type as 'Internal' | 'External', vendorName: d.vendorName, country: d.country,
      allocation: { ...d.allocation }, forecast: { ...d.forecast },
    });
    setShowForm(true);
  };

  const handleSave = (submit: boolean) => {
    if (!form.projectName || !form.pillar || !form.startDate || !form.endDate || !form.budgetCode) {
      toast.error('Please fill all required fields');
      return;
    }
    const data = { ...form, status: submit ? 'Pending' as const : form.status };
    if (editId) {
      updateDemand(editId, data);
      toast.success('Demand Updated Successfully');
    } else {
      addDemand(data);
      toast.success('Demand Created Successfully');
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    if (deleteId) { deleteDemand(deleteId); toast.success('Demand Deleted'); setDeleteId(null); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      toast.error('Invalid file format. Please upload .csv or .xlsx');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const rows = parseCSV(text);
        const mapped = rows.map(mapRowToDemand).filter(Boolean) as DemandForm[];
        if (mapped.length === 0) {
          toast.error('No valid rows found in file');
          return;
        }
        setImportPreview(mapped);
        setShowImport(true);
      } catch {
        toast.error('Error parsing file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmImport = () => {
    // Dedup against existing demands by project+role+resource
    const existingKeys = new Set(demands.map((d) => `${d.projectName}|${d.projectRole}|${d.resourceName}`));
    const fresh = importPreview.filter((r) => !existingKeys.has(`${r.projectName}|${r.projectRole}|${r.resourceName}`));
    const dropped = importPreview.length - fresh.length;
    if (fresh.length === 0) {
      toast.error('All rows are duplicates of existing demands');
      return;
    }
    addDemands(fresh);
    toast.success(`${fresh.length} demand(s) imported from ${importSource}${dropped ? ` (${dropped} duplicate(s) skipped)` : ''}`);
    setShowImport(false);
    setImportPreview([]);
  };

  // Mock external connector fetch — simulates Jira / Planisware / Smartsheets / Connected Source
  const fetchFromExternal = (source: 'Jira' | 'Planisware' | 'Smartsheets' | 'Connected Source') => {
    setImportSource(source);
    const safeProjects = projects.length ? projects : ['Cloud Enablement'];
    const safeRoles = roles.length ? roles : ['Project Manager'];
    const safePillars = pillars.length ? pillars : ['Hi-tech'];
    const safePortfolios = portfolios.length ? portfolios : ['Hi-tech'];
    const safeLocations = locationOpts.length ? locationOpts : ['Sydney'];
    const sourceSeed: Record<string, { count: number; rolePrefix: string }> = {
      Jira: { count: 4, rolePrefix: 'JIRA' },
      Planisware: { count: 5, rolePrefix: 'PLNS' },
      Smartsheets: { count: 3, rolePrefix: 'SMRT' },
      'Connected Source': { count: 6, rolePrefix: 'API' },
    };
    const cfg = sourceSeed[source];
    const rows: DemandForm[] = Array.from({ length: cfg.count }, (_, i) => ({
      portfolio: safePortfolios[i % safePortfolios.length],
      program: 'Enterprise',
      projectName: safeProjects[i % safeProjects.length],
      projectRole: safeRoles[i % safeRoles.length],
      budgetCode: `${cfg.rolePrefix}-${1000 + i}`,
      pillar: safePillars[i % safePillars.length],
      allocationPercent: 100,
      status: 'Pending' as const,
      comments: `Imported from ${source}`,
      identified: false,
      estimatedRate: 110 + i * 5,
      currentYearForecast: 80000 + i * 12000,
      resourceName: '',
      workstream: `WS-${(i % 3) + 1}`,
      subTeam: '',
      startDate: '2027-04-01',
      endDate: '2027-12-31',
      type: 'Internal' as const,
      vendorName: '',
      country: safeLocations[i % safeLocations.length],
      allocation: { current: 1, y2027: 1, y2028: 0, y2029: 0, y2030: 0 },
      forecast: { current: 80000 + i * 12000, y2027: 80000 + i * 12000, y2028: 0, y2029: 0, y2030: 0 },
    }));
    // Simulate network latency
    toast.info(`Fetching from ${source}...`);
    setTimeout(() => {
      setImportPreview(rows);
      setImportChooserOpen(false);
      setShowImport(true);
    }, 600);
  };

  const triggerExcelUpload = () => {
    setImportSource('Excel');
    setImportChooserOpen(false);
    fileInputRef.current?.click();
  };

  const columns: Column<Demand>[] = [
    {
      key: 'action', header: 'Action', sortable: false,
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(row)}><Pencil className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setDeleteId(row.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setHistoryData(row.history)}><History className="h-3.5 w-3.5" /></Button>
        </div>
      ),
    },
    { key: 'projectName', header: 'Project Name' },
    { key: 'projectRole', header: 'Project Role' },
    { key: 'budgetCode', header: 'Budget Code' },
    { key: 'pillar', header: 'Pillar', render: (row) => <Badge variant="outline">{row.pillar}</Badge> },
    { key: 'allocationPercent', header: 'Allocation(%)' },
    { key: 'status', header: 'Status', render: (row) => <Badge variant={statusColor(row.status)}>{row.status}</Badge> },
    { key: 'estimatedRate', header: 'Estimated Rate', render: (row) => row.estimatedRate ? `$${row.estimatedRate.toFixed(2)}` : '' },
    { key: 'currentYearForecast', header: 'Current Year Forecast', render: (row) => row.currentYearForecast ? `$${row.currentYearForecast.toLocaleString()}` : '' },
    { key: 'resourceName', header: 'Resource Name' },
  ];

  const FilterSelect = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) => (
    <div>
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Demand Summary</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add</Button>
            
            <Button size="sm" variant="secondary" onClick={() => setImportChooserOpen(true)}><Upload className="h-4 w-4 mr-1" />Import</Button>
            <Button size="sm" variant="secondary" onClick={() => setShowAdvSearch(!showAdvSearch)}><Search className="h-4 w-4 mr-1" />Advance Search</Button>
            <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAdvSearch && (
            <div className="border rounded-md p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <FilterSelect label="Project" value={fProject} onChange={setFProject} options={projects} />
              <FilterSelect label="Project Role" value={fRole} onChange={setFRole} options={roles} />
              <FilterSelect label="Pillar" value={fPillar} onChange={setFPillar} options={pillars} />
              <FilterSelect label="Demand Status" value={fStatus} onChange={setFStatus} options={['Pending', 'Approved', 'Rejected', 'Awaiting Approval']} />
              <div className="col-span-full flex gap-2">
                <Button size="sm" onClick={() => {}}>Search</Button>
                <Button size="sm" variant="outline" onClick={() => { setFProject('all'); setFRole('all'); setFPillar('all'); setFStatus('all'); }}>Clear</Button>
              </div>
            </div>
          )}
          <DataTable data={filtered} columns={columns} pageSize={5} />
        </CardContent>
      </Card>

      {/* Import Source Chooser */}
      <Dialog open={importChooserOpen} onOpenChange={setImportChooserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Import Demand Data</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Choose a source. External tools are simulated for demo purposes.</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button onClick={triggerExcelUpload} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-green-bg))] text-[hsl(var(--kpi-green))] flex items-center justify-center font-bold text-xs">XLS</div>
                <div className="font-semibold text-sm">Excel / CSV Upload</div>
              </div>
              <div className="text-xs text-muted-foreground">Upload .xlsx or .csv with Project, Role, Pillar columns</div>
            </button>
            <button onClick={() => fetchFromExternal('Jira')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-blue-bg))] text-[hsl(var(--kpi-blue))] flex items-center justify-center font-bold text-xs">JR</div>
                <div className="font-semibold text-sm">Jira</div>
              </div>
              <div className="text-xs text-muted-foreground">Fetch open epics & stories as demand</div>
            </button>
            <button onClick={() => fetchFromExternal('Planisware')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-orange-bg))] text-[hsl(var(--kpi-orange))] flex items-center justify-center font-bold text-xs">PL</div>
                <div className="font-semibold text-sm">Planisware</div>
              </div>
              <div className="text-xs text-muted-foreground">Pull project plans & resource needs</div>
            </button>
            <button onClick={() => fetchFromExternal('Smartsheets')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-purple-bg))] text-[hsl(var(--kpi-purple))] flex items-center justify-center font-bold text-xs">SS</div>
                <div className="font-semibold text-sm">Smartsheets</div>
              </div>
              <div className="text-xs text-muted-foreground">Sync resource sheets into demand</div>
            </button>
            <button onClick={() => fetchFromExternal('Connected Source')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">API</div>
                <div className="font-semibold text-sm">Fetch from Connected Source</div>
              </div>
              <div className="text-xs text-muted-foreground">Pull from configured enterprise API endpoint</div>
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileUpload} />
        </DialogContent>
      </Dialog>

      {/* Import Preview Modal */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Import Preview — {importPreview.length} records from {importSource}</DialogTitle></DialogHeader>
          <div className="border rounded-md overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left">Project Name</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Pillar</th>
                  <th className="px-3 py-2 text-left">Budget Code</th>
                  <th className="px-3 py-2 text-left">Resource</th>
                  <th className="px-3 py-2 text-left">Type</th>
                </tr>
              </thead>
              <tbody>
                {importPreview.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1.5">{r.projectName}</td>
                    <td className="px-3 py-1.5">{r.projectRole}</td>
                    <td className="px-3 py-1.5">{r.pillar}</td>
                    <td className="px-3 py-1.5">{r.budgetCode}</td>
                    <td className="px-3 py-1.5">{r.resourceName}</td>
                    <td className="px-3 py-1.5">{r.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
            <Button onClick={confirmImport}>Confirm Import</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit Demand' : 'Create Demand'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Portfolio *</Label>
              <Select value={form.portfolio || portfolios[0]} onValueChange={(v) => setForm({ ...form, portfolio: v })}>
                <SelectTrigger><SelectValue placeholder="Select Portfolio" /></SelectTrigger>
                <SelectContent>{portfolios.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Program *</Label>
              <Select value={form.program} onValueChange={(v) => setForm({ ...form, program: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(programs.length ? programs : ['Enterprise']).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Project Name *</Label>
              <Select value={form.projectName} onValueChange={(v) => setForm({ ...form, projectName: v })}>
                <SelectTrigger><SelectValue placeholder="Select Project Name" /></SelectTrigger>
                <SelectContent>{projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Project Role *</Label>
              <Select value={form.projectRole} onValueChange={(v) => setForm({ ...form, projectRole: v })}>
                <SelectTrigger><SelectValue placeholder="Select Project Role" /></SelectTrigger>
                <SelectContent>{roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pillar *</Label>
              <Select value={form.pillar} onValueChange={(v) => setForm({ ...form, pillar: v })}>
                <SelectTrigger><SelectValue placeholder="Select Pillar" /></SelectTrigger>
                <SelectContent>{pillars.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Workstream</Label><Input value={form.workstream} onChange={(e) => setForm({ ...form, workstream: e.target.value })} /></div>
            <div><Label>Start Date *</Label><Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div><Label>End Date *</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
            <div><Label>Budget Code *</Label><Input value={form.budgetCode} onChange={(e) => setForm({ ...form, budgetCode: e.target.value })} /></div>
            <div className="col-span-2"><Label>Comments</Label><Textarea value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} /></div>
          </div>

          <h4 className="font-semibold text-primary mt-4 border-l-4 border-primary pl-2">Allocation (%)</h4>
          <div className="grid grid-cols-5 gap-2">
            {ALLOC_YEARS.map((k) => (
              <div key={k}><Label className="text-xs">{yearLabel(k)}</Label>
                <Input type="number" step="0.01" value={form.allocation[k]} onChange={(e) => setForm({ ...form, allocation: { ...form.allocation, [k]: parseFloat(e.target.value) || 0 } })} />
              </div>
            ))}
          </div>

          <h4 className="font-semibold text-primary mt-4 border-l-4 border-primary pl-2">Resource</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3"><Label>Identified</Label><Switch checked={form.identified} onCheckedChange={(v) => setForm({ ...form, identified: v })} /></div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Demand['type'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Internal">Internal</SelectItem><SelectItem value="External">External</SelectItem></SelectContent>
              </Select>
            </div>
            <div>
              <Label>Vendor Name</Label>
              <Select value={form.vendorName || '__none'} onValueChange={(v) => setForm({ ...form, vendorName: v === '__none' ? '' : v })}>
                <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {vendors.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Estimated Rate</Label><Input type="number" value={form.estimatedRate} onChange={(e) => setForm({ ...form, estimatedRate: parseFloat(e.target.value) || 0 })} /></div>
            <div>
              <Label>Location</Label>
              <Select value={form.country || locationOpts[0] || 'Sydney'} onValueChange={(v) => setForm({ ...form, country: v })}>
                <SelectTrigger><SelectValue placeholder="Select Location" /></SelectTrigger>
                <SelectContent>{locationOpts.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Resource Name</Label>
              <Select value={form.resourceName || '__none'} onValueChange={(v) => setForm({ ...form, resourceName: v === '__none' ? '' : v })}>
                <SelectTrigger><SelectValue placeholder="Select Resource" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">None</SelectItem>
                  {resourceNames.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <h4 className="font-semibold text-destructive mt-4 border-l-4 border-destructive pl-2">Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {FORECAST_YEARS.map((k) => (
              <div key={k}><Label className="text-xs">{yearLabel(k)}</Label>
                <Input type="number" value={form.forecast[k]} onChange={(e) => setForm({ ...form, forecast: { ...form.forecast, [k]: parseFloat(e.target.value) || 0 } })} />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => handleSave(false)}>Save</Button>
            <Button onClick={() => handleSave(true)}>Submit</Button>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Demand</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this demand? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <HistoryModal open={!!historyData} onOpenChange={() => setHistoryData(null)} history={historyData || []} />
    </div>
  );
}
