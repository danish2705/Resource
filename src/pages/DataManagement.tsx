import { useState, useMemo, useRef } from 'react';
import { useMasterData, type MasterEntry, type MasterAudit } from '@/store/useMasterData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Plus, Upload, History, FolderPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

interface EditState {
  id?: string;
  value: string;
  description: string;
  status: 'Active' | 'Inactive';
}

const emptyEdit: EditState = { value: '', description: '', status: 'Active' };

// Map master object key -> demand/allocation field used for "in use" lookup
const usageMap: Record<string, { demandFields?: (keyof import('@/store/useStore').Demand)[]; allocFields?: (keyof import('@/store/useStore').Allocation)[] }> = {
  projects: { demandFields: ['projectName'], allocFields: ['project'] },
  resources: { demandFields: ['resourceName'], allocFields: ['resourceName'] },
  vendors: { demandFields: ['vendorName'] },
  pillars: { demandFields: ['pillar'], allocFields: ['pillar'] },
  roles: { demandFields: ['projectRole'], allocFields: ['projectRole'] },
  levels: { allocFields: ['level'] },
  workstreams: { demandFields: ['workstream'] },
  countries: { demandFields: ['country'] },
};

export default function DataManagement() {
  const { objects, addEntry, updateEntry, deleteEntry, bulkAddEntries, addObjectType } = useMasterData();
  const { demands, allocations } = useStore();
  const [activeKey, setActiveKey] = useState(objects[0]?.key || 'projects');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditState>(emptyEdit);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [importChooserOpen, setImportChooserOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<{ value: string; description: string; duplicate: boolean }[]>([]);
  const [importSource, setImportSource] = useState<'Excel' | 'Jira' | 'Planisware' | 'Smartsheets' | 'Connected Source'>('Excel');
  const [newObjectOpen, setNewObjectOpen] = useState(false);
  const [newObjectName, setNewObjectName] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const active = useMemo(() => objects.find((o) => o.key === activeKey), [objects, activeKey]);

  const isInUse = (value: string) => {
    const m = usageMap[activeKey];
    if (!m) return false;
    if (m.demandFields?.some((f) => demands.some((d) => (d as any)[f] === value))) return true;
    if (m.allocFields?.some((f) => allocations.some((a) => (a as any)[f] === value))) return true;
    return false;
  };

  const openAdd = () => { setEditForm(emptyEdit); setEditOpen(true); };
  const openEdit = (entry: MasterEntry) => {
    setEditForm({ id: entry.id, value: entry.value, description: entry.description, status: entry.status });
    setEditOpen(true);
  };

  const handleSave = () => {
    if (!editForm.value.trim()) {
      toast.error('Value is required');
      return;
    }
    if (editForm.id) {
      updateEntry(activeKey, editForm.id, { value: editForm.value, description: editForm.description, status: editForm.status });
      toast.success('Updated Successfully');
    } else {
      const exists = active?.entries.some((e) => e.value.toLowerCase() === editForm.value.toLowerCase());
      if (exists) {
        toast.error('Value already exists');
        return;
      }
      addEntry(activeKey, { value: editForm.value, description: editForm.description });
      toast.success('Value Added');
    }
    setEditOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId || !active) return;
    const entry = active.entries.find((e) => e.id === deleteId);
    if (entry && isInUse(entry.value)) {
      toast.error(`"${entry.value}" is in use and cannot be deleted. It will be marked Inactive.`);
    }
    deleteEntry(activeKey, deleteId);
    toast.success('Deleted Successfully');
    setDeleteId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      toast.error('Please upload a .csv or .xlsx file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.trim().split('\n');
        if (lines.length < 1) { toast.error('Empty file'); return; }
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));
        const valueIdx = headers.findIndex((h) => h === 'value' || h === 'name');
        const descIdx = headers.findIndex((h) => h === 'description');
        const startIdx = valueIdx >= 0 ? 1 : 0;
        const useIdx = valueIdx >= 0 ? valueIdx : 0;
        const existing = new Set((active?.entries || []).map((en) => en.value.toLowerCase()));
        const seen = new Set<string>();
        const preview = lines.slice(startIdx).map((l) => {
          const cols = l.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          const value = cols[useIdx] || '';
          const description = descIdx >= 0 ? (cols[descIdx] || '') : '';
          const key = value.toLowerCase();
          const duplicate = !value || existing.has(key) || seen.has(key);
          if (value) seen.add(key);
          return { value, description, duplicate };
        }).filter((r) => r.value);
        if (preview.length === 0) { toast.error('No rows found'); return; }
        setImportSource('Excel');
        setImportPreview(preview);
        setImportOpen(true);
      } catch {
        toast.error('Error parsing file');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  // Mock external connector fetch — simulates Jira / Planisware / Smartsheets / Connected Source
  const fetchFromExternal = (source: 'Jira' | 'Planisware' | 'Smartsheets' | 'Connected Source') => {
    setImportSource(source);
    const existing = new Set((active?.entries || []).map((en) => en.value.toLowerCase()));
    const sourceSeed: Record<string, { count: number; prefix: string }> = {
      Jira: { count: 5, prefix: 'JIRA' },
      Planisware: { count: 4, prefix: 'PLNS' },
      Smartsheets: { count: 4, prefix: 'SMRT' },
      'Connected Source': { count: 6, prefix: 'API' },
    };
    const cfg = sourceSeed[source];
    const objLabel = active?.label || 'Item';
    const seen = new Set<string>();
    const rows = Array.from({ length: cfg.count }, (_, i) => {
      const value = `${cfg.prefix} ${objLabel} ${i + 1}`;
      const key = value.toLowerCase();
      const duplicate = existing.has(key) || seen.has(key);
      seen.add(key);
      return { value, description: `Imported from ${source}`, duplicate };
    });
    toast.info(`Fetching from ${source}...`);
    setTimeout(() => {
      setImportPreview(rows);
      setImportChooserOpen(false);
      setImportOpen(true);
    }, 600);
  };

  const triggerExcelUpload = () => {
    setImportSource('Excel');
    setImportChooserOpen(false);
    fileRef.current?.click();
  };

  const confirmImport = () => {
    const fresh = importPreview.filter((r) => !r.duplicate);
    if (fresh.length === 0) {
      toast.error('All rows are duplicates of existing values');
      return;
    }
    const added = bulkAddEntries(activeKey, fresh);
    const dropped = importPreview.length - fresh.length;
    toast.success(`${added} value${added === 1 ? '' : 's'} imported from ${importSource}${dropped ? ` (${dropped} duplicate(s) skipped)` : ''}`);
    setImportOpen(false);
    setImportPreview([]);
  };

  const handleAddObjectType = () => {
    const name = newObjectName.trim();
    if (!name) { toast.error('Name is required'); return; }
    const key = name.toLowerCase().replace(/\s+/g, '-');
    if (objects.find((o) => o.key === key)) { toast.error('Object type already exists'); return; }
    addObjectType(name);
    setActiveKey(key);
    setNewObjectName('');
    setNewObjectOpen(false);
    toast.success('Object type added');
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Left object list */}
      <Card className="col-span-12 md:col-span-3 h-fit">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm">Object Types</CardTitle>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setNewObjectOpen(true)} title="Add object type">
            <FolderPlus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {objects.map((o) => (
              <button
                key={o.key}
                onClick={() => setActiveKey(o.key)}
                className={`text-left text-sm px-3 py-2 rounded-md transition-colors ${
                  activeKey === o.key ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{o.label}</span>
                  <Badge variant={activeKey === o.key ? 'secondary' : 'outline'} className="text-xs">
                    {o.entries.filter((e) => e.status === 'Active').length}
                  </Badge>
                </div>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Main panel */}
      <Card className="col-span-12 md:col-span-9">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">{active?.label || 'Object'}</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" />Add</Button>
            <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileUpload} />
            <Button size="sm" variant="secondary" onClick={() => setImportChooserOpen(true)}>
              <Upload className="h-4 w-4 mr-1" />Import
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAuditOpen(true)}>
              <History className="h-4 w-4 mr-1" />Audit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Value</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(active?.entries || []).map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.value}</TableCell>
                  <TableCell className="text-muted-foreground">{e.description || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={e.status === 'Active' ? 'default' : 'secondary'}>{e.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{e.createdDate}</TableCell>
                  <TableCell className="text-sm">{e.updatedDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(e)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive" onClick={() => setDeleteId(e.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(active?.entries || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No entries yet. Click "Add" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editForm.id ? 'Edit' : 'Add'} {active?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Value *</Label>
              <Input value={editForm.value} onChange={(e) => setEditForm({ ...editForm, value: e.target.value })} maxLength={100} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} maxLength={300} />
            </div>
            {editForm.id && (
              <div className="flex items-center gap-3">
                <Label>Active</Label>
                <Switch
                  checked={editForm.status === 'Active'}
                  onCheckedChange={(v) => setEditForm({ ...editForm, status: v ? 'Active' : 'Inactive' })}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete value?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteId && active && (() => {
                const entry = active.entries.find((e) => e.id === deleteId);
                if (!entry) return null;
                if (isInUse(entry.value)) {
                  return <>This value is currently used in other modules. It will be soft-deleted (marked Inactive) so existing records remain valid.</>;
                }
                return <>This will mark "{entry.value}" as Inactive. It can be restored by editing.</>;
              })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Source Chooser */}
      <Dialog open={importChooserOpen} onOpenChange={setImportChooserOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Import {active?.label || 'Master Data'}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Choose a source. External tools are simulated for demo purposes.</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button onClick={triggerExcelUpload} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-green-bg))] text-[hsl(var(--kpi-green))] flex items-center justify-center font-bold text-xs">XLS</div>
                <div className="font-semibold text-sm">Excel / CSV Upload</div>
              </div>
              <div className="text-xs text-muted-foreground">Upload .xlsx or .csv with a "Value" (or "Name") and optional "Description" column</div>
            </button>
            <button onClick={() => fetchFromExternal('Jira')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-blue-bg))] text-[hsl(var(--kpi-blue))] flex items-center justify-center font-bold text-xs">JR</div>
                <div className="font-semibold text-sm">Jira</div>
              </div>
              <div className="text-xs text-muted-foreground">Fetch master values from Jira projects & components</div>
            </button>
            <button onClick={() => fetchFromExternal('Planisware')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-orange-bg))] text-[hsl(var(--kpi-orange))] flex items-center justify-center font-bold text-xs">PL</div>
                <div className="font-semibold text-sm">Planisware</div>
              </div>
              <div className="text-xs text-muted-foreground">Sync portfolios, programs & resource pools</div>
            </button>
            <button onClick={() => fetchFromExternal('Smartsheets')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-[hsl(var(--kpi-purple-bg))] text-[hsl(var(--kpi-purple))] flex items-center justify-center font-bold text-xs">SS</div>
                <div className="font-semibold text-sm">Smartsheets</div>
              </div>
              <div className="text-xs text-muted-foreground">Pull lookup lists from Smartsheets</div>
            </button>
            <button onClick={() => fetchFromExternal('Connected Source')} className="border rounded-md p-4 text-left hover:bg-accent transition-colors col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">API</div>
                <div className="font-semibold text-sm">Fetch from Connected Source</div>
              </div>
              <div className="text-xs text-muted-foreground">Pull from configured enterprise master-data API endpoint</div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Preview */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Preview — {importPreview.length} rows from {importSource}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground mb-2">
            Duplicates will be skipped. {importPreview.filter((r) => !r.duplicate).length} new value(s) will be added to <strong>{active?.label}</strong>.
          </div>
          <div className="border rounded-md max-h-80 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {importPreview.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.value}</TableCell>
                    <TableCell className="text-muted-foreground">{r.description || '—'}</TableCell>
                    <TableCell>
                      {r.duplicate
                        ? <Badge variant="secondary">Duplicate</Badge>
                        : <Badge variant="default">New</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button onClick={confirmImport}>Confirm Import</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Modal */}
      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Audit History — {active?.label}</DialogTitle>
          </DialogHeader>
          <div className="border rounded-md max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(active?.audit || []).slice().reverse().map((a: MasterAudit) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.fieldName}</TableCell>
                    <TableCell className="text-muted-foreground">{a.oldValue || '—'}</TableCell>
                    <TableCell>{a.newValue}</TableCell>
                    <TableCell>{a.updatedBy}</TableCell>
                    <TableCell className="text-sm">{a.updatedOn}</TableCell>
                  </TableRow>
                ))}
                {(active?.audit || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                      No audit history yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Object Type Modal */}
      <Dialog open={newObjectOpen} onOpenChange={setNewObjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Object Type</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Object Name *</Label>
            <Input
              value={newObjectName}
              onChange={(e) => setNewObjectName(e.target.value)}
              placeholder="e.g. Departments"
              maxLength={50}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setNewObjectOpen(false)}>Cancel</Button>
            <Button onClick={handleAddObjectType}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
