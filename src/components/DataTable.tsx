import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
}

export default function DataTable<T extends Record<string, any>>({ data, columns, searchPlaceholder = 'Search...', pageSize: defaultPageSize = 10 }: Props<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    if (!search) return data;
    const s = search.toLowerCase();
    return data.filter((row) => columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(s)));
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Show
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
            <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          entries
        </div>
        <Input className="max-w-xs h-8" placeholder={searchPlaceholder} value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
      </div>

      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={col.sortable !== false ? 'cursor-pointer select-none hover:bg-muted/50' : ''}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  {col.header}
                  {sortKey === col.key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow><TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">No data available</TableCell></TableRow>
            ) : paged.map((row, i) => (
              <TableRow key={(row as any).id ?? i} className="hover:bg-accent/30">
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row, page * pageSize + i) : String(row[col.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {sorted.length === 0 ? 0 : page * pageSize + 1} to {Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length} entries</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
            return (
              <Button key={p} variant={p === page ? 'default' : 'outline'} size="sm" className="w-8 h-8" onClick={() => setPage(p)}>
                {p + 1}
              </Button>
            );
          })}
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
