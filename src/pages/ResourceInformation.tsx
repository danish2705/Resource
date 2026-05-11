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
  actualHours: number;
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

    let projectHours = 20 + (i % 20);
    let operationalHours = 5 + (i % 10);

    if (i === 2 || i === 7) {
      projectHours = 60;
      operationalHours = 10;
    }

    if (i % 4 === 0) {
      projectHours += 10;
    }

    const allocatedHours = projectHours + operationalHours;

    // ✅ Actuals (simulated timesheet data)
    let actualHours = allocatedHours - (i % 8);

    if (i === 3 || i === 8) {
      actualHours = allocatedHours + 10;
    }

    if (i === 5) {
      actualHours = allocatedHours - 15;
    }

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
      actualHours,
      projects: 1 + (i % 4),
    };
  });

  const totalCapacity = data.length * 40;
  const totalDemand = data.reduce((sum, r) => sum + r.allocatedHours, 0);
  const overloadedCount = data.filter(r => r.allocatedHours > 40).length;

  const getUtilization = (hours: number) => Math.round((hours / 40) * 100);

  const columns: Column<Resource>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium text-primary">{r.name}</span> },
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
          r.status === 'Available' ? 'default'
          : r.status === 'Busy' ? 'destructive'
          : 'secondary';

        return <Badge variant={variant}>{r.status}</Badge>;
      }
    },

    { key: 'projectHours', header: 'Project Hrs' },
    { key: 'operationalHours', header: 'Operational Hrs' },

    // ✅ Forecast
    { key: 'allocatedHours', header: 'Forecast (Hrs)' },

    // ✅ Actual
    { key: 'actualHours', header: 'Actual (Hrs)' },

    // ✅ Variance
    {
      key: 'variance',
      header: 'Variance (Hrs)',
      render: (r) => {
        const variance = r.actualHours - r.allocatedHours;

        return (
          <span className={
            variance > 0 ? 'text-red-600 font-medium'
            : variance < 0 ? 'text-green-600 font-medium'
            : ''
          }>
            {variance}
          </span>
        );
      }
    },

    // ✅ Variance %
    {
      key: 'variancePercent',
      header: 'Variance (%)',
      render: (r) => {
        const variance = r.actualHours - r.allocatedHours;
        const percent = Math.round((variance / r.allocatedHours) * 100);

        return (
          <span className={
            percent > 20 ? 'text-red-600 font-medium'
            : percent < -20 ? 'text-green-600 font-medium'
            : ''
          }>
            {percent}%
          </span>
        );
      }
    },

    {
      key: 'utilization',
      header: 'Utilization %',
      render: (r) => {
        const utilization = getUtilization(r.allocatedHours);

        const className =
          utilization > 100 ? 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs'
          : utilization >= 80 ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs'
          : 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs';

        return <span className={className}>{utilization}%</span>;
      }
    },

    {
      key: 'availability',
      header: 'Availability (Hrs)',
      render: (r) => {
        const availability = 40 - r.allocatedHours;

        return (
          <span className={
            availability < 0 ? 'text-red-600 font-medium'
            : availability <= 10 ? 'text-yellow-600 font-medium'
            : 'text-green-600 font-medium'
          }>
            {availability}
          </span>
        );
      }
    },

    {
      key: 'alerts',
      header: 'Alerts',
      render: (r) => {
        const utilization = getUtilization(r.allocatedHours);
        const availability = 40 - r.allocatedHours;

        if (utilization > 100) {
          return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Overloaded</span>;
        }

        if (availability < 0) {
          return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">No Capacity</span>;
        }

        if (availability <= 5) {
          return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Low Capacity</span>;
        }

        return <span className="text-muted-foreground">—</span>;
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
        <div className="grid grid-cols-3 gap-4 mb-4">

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Capacity</p>
              <p className="text-xl font-bold">{totalCapacity} hrs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Demand</p>
              <p className={`text-xl font-bold ${totalDemand > totalCapacity ? 'text-red-600' : ''}`}>
                {totalDemand} hrs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Overloaded Resources</p>
              <p className="text-xl font-bold text-red-600">{overloadedCount}</p>
            </CardContent>
          </Card>

        </div>

        <DataTable data={data} columns={columns} pageSize={10} />
      </CardContent>
    </Card>
  );
}