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
  allocatedHours: number;
  projectHours: number;
  operationalHours: number;
}

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.');

export default function ResourceInformation() {
  const resourceNames = useActiveValues('resources');
  const vendors = useActiveValues('vendors');
  const countries = useActiveValues('countries');
  const levels = useActiveValues('levels');

  const data: Resource[] = resourceNames.map((name, i) => {
    let status = 'Available';
    if (i % 3 === 0) status = 'Busy';
    else if (i % 7 === 0) status = 'Leave';

    // ✅ NEW: Work type split
    let projectHours = 20 + (i % 20);
    let operationalHours = 5 + (i % 10);

    // ✅ Force overload for some rows
    if (i === 2 || i === 7) {
      projectHours = 45 + i * 2;
      operationalHours = 10;
    }

    const allocatedHours = projectHours + operationalHours;

    return {
      id: `res-${i}`,
      name,
      resId: String(100000 + i * 12345),
      email: `${slugify(name)}@ascendion.com`,
      type: i % 3 === 0 ? 'External' : 'Internal',
      vendor: i % 3 === 0 ? (vendors[i % Math.max(vendors.length, 1)] || 'N/A') : 'N/A',
      country: countries[i % Math.max(countries.length, 1)] || 'USA',
      level: levels[i % Math.max(levels.length, 1)] || 'M1',
      status,
      projectHours,
      operationalHours,
      allocatedHours,
      projects: 1 + (i % 4),
    };
  });

  // Utilization
  const getUtilization = (hours: number) => {
    return Math.round((hours / 40) * 100);
  };

  // Remaining capacity
  const getRemainingCapacity = (hours: number) => {
    return 40 - hours;
  };

  const columns: Column<Resource>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => <span className="font-medium text-primary">{r.name}</span>
    },
    { key: 'resId', header: 'Res ID' },
    { key: 'email', header: 'Email' },

    {
      key: 'type',
      header: 'Type',
      render: (r) => (
        <Badge variant={r.type === 'External' ? 'secondary' : 'outline'}>
          {r.type}
        </Badge>
      )
    },

    { key: 'vendor', header: 'Vendor' },
    { key: 'country', header: 'Country' },
    { key: 'level', header: 'Level' },

    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const variant =
          r.status === 'Available'
            ? 'default'
            : r.status === 'Busy'
            ? 'destructive'
            : 'secondary';

        return <Badge variant={variant}>{r.status}</Badge>;
      }
    },

    // ✅ Project Hours
    {
      key: 'projectHours',
      header: 'Project Hrs',
    },

    // ✅ Operational Hours
    {
      key: 'operationalHours',
      header: 'Operational Hrs',
    },

    // ✅ Utilization
    {
      key: 'utilization',
      header: 'Utilization %',
      render: (r) => {
        const utilization = getUtilization(r.allocatedHours);

        let className = '';

        if (utilization > 100) {
          className = 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs';
        } else if (utilization >= 80) {
          className = 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs';
        } else {
          className = 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs';
        }

        return <span className={className}>{utilization}%</span>;
      }
    },

    // ✅ Remaining Capacity
    {
      key: 'capacity',
      header: 'Remaining Hrs',
      render: (r) => {
        const remaining = getRemainingCapacity(r.allocatedHours);

        return (
          <span className={remaining < 0 ? 'text-red-600 font-medium' : ''}>
            {remaining}
          </span>
        );
      }
    },

    { key: 'projects', header: 'Projects' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Resource Information</CardTitle>
      </CardHeader>

      <CardContent>
        <DataTable data={data} columns={columns} pageSize={10} />
      </CardContent>
    </Card>
  );
}