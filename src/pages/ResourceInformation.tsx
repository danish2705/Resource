import { useActiveValues } from '@/store/useMasterData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DataTable, { type Column } from '@/components/DataTable';

interface Resource {
  id: string;
  name: string;
  resId: string;
  email: string;
  type: string;
  vendor: string;
  country: string;
  level: string;
  status: string;
  projects: number;
}

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.');

export default function ResourceInformation() {
  const resourceNames = useActiveValues('resources');
  const vendors = useActiveValues('vendors');
  const countries = useActiveValues('countries');
  const levels = useActiveValues('levels');

  const data: Resource[] = resourceNames.map((name, i) => ({
    id: `res-${i}`,
    name,
    resId: String(100000 + i * 12345),
    email: `${slugify(name)}@ascendion.com`,
    type: i % 3 === 0 ? 'External' : 'Internal',
    vendor: i % 3 === 0 ? (vendors[i % Math.max(vendors.length, 1)] || 'N/A') : 'N/A',
    country: countries[i % Math.max(countries.length, 1)] || 'USA',
    level: levels[i % Math.max(levels.length, 1)] || 'M1',
    status: i % 5 === 0 ? 'Inactive' : 'Active',
    projects: 1 + (i % 4),
  }));

  const columns: Column<Resource>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-primary">{r.name}</span> },
    { key: 'resId', header: 'Res ID' },
    { key: 'email', header: 'Email' },
    { key: 'type', header: 'Type', render: (r) => <Badge variant={r.type === 'External' ? 'secondary' : 'outline'}>{r.type}</Badge> },
    { key: 'vendor', header: 'Vendor' },
    { key: 'country', header: 'Country' },
    { key: 'level', header: 'Level' },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'Active' ? 'default' : 'destructive'}>{r.status}</Badge> },
    { key: 'projects', header: 'Projects' },
  ];

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Resource Information</CardTitle></CardHeader>
      <CardContent>
        <DataTable data={data} columns={columns} pageSize={10} />
      </CardContent>
    </Card>
  );
}
