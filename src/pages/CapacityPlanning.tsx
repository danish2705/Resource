import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { Users, Briefcase, AlertTriangle, TrendingUp } from 'lucide-react';
import CapacityPlanningGrid from '@/components/capacity/CapacityPlanningGrid';

const CapacityPlanning = () => {
  const { resources, allocations, demands, forecasts } = useStore();

  // =========================
  // FILTER STATES
  // =========================

  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedResource, setSelectedResource] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // =========================
  // PLANNING STATUS HELPERS
  // =========================

  const getPlanningStatus = (allocationPercent: number) => {
    if (allocationPercent === 0) return 'Available';
    if (allocationPercent < 100) return 'Partial Allocation';
    if (allocationPercent === 100) return 'Fully Allocated';

    return 'Overallocated';
  };

  // =========================
  // FILTER OPTIONS
  // =========================

  const projectOptions = Array.from(
    new Set(allocations.map((item) => item.project))
  );

  const resourceOptions = Array.from(
    new Set(resources.map((item) => item.name))
  );

  const vendorOptions = Array.from(
    new Set(
      resources
        .map((item) => item.vendor)
        .filter((vendor) => vendor && vendor !== 'N/A')
    )
  );

  const skillOptions = Array.from(
    new Set(resources.map((item) => item.primarySkill))
  );

  const employmentTypeOptions = Array.from(
    new Set(resources.map((item) => item.type))
  );

  const statusOptions = [
    'Available',
    'Partial Allocation',
    'Fully Allocated',
    'Overallocated',
    'Bench',
  ];

  // =========================
  // FILTERED DATASETS
  // =========================

  const filteredAllocations = useMemo(() => {
    return allocations.filter((allocation) => {
      const resource = resources.find(
        (res) => res.name === allocation.resourceName
      );

      const planningStatus = getPlanningStatus(
        allocation.allocationPercent
      );

      const matchesProject =
        selectedProject === 'all' ||
        allocation.project === selectedProject;

      const matchesResource =
        selectedResource === 'all' ||
        allocation.resourceName === selectedResource;

      const matchesVendor =
        selectedVendor === 'all' ||
        resource?.vendor === selectedVendor;

      const matchesSkill =
        selectedSkill === 'all' ||
        resource?.primarySkill === selectedSkill;

      const matchesEmploymentType =
        selectedEmploymentType === 'all' ||
        resource?.type === selectedEmploymentType;

      const matchesStatus =
        selectedStatus === 'all' ||
        planningStatus === selectedStatus;

      return (
        matchesProject &&
        matchesResource &&
        matchesVendor &&
        matchesSkill &&
        matchesEmploymentType &&
        matchesStatus
      );
    });
  }, [
    allocations,
    resources,
    selectedProject,
    selectedResource,
    selectedVendor,
    selectedSkill,
    selectedEmploymentType,
    selectedStatus,
  ]);

  // =========================
  // KPI CALCULATIONS
  // =========================

  // Workforce size
  const totalResources = resources.length;

  // Total workforce capacity
  const totalCapacity = totalResources * 100;

  // Current allocated %
  const allocatedCapacity = filteredAllocations.reduce(
    (sum, allocation) => sum + allocation.allocationPercent,
    0
  );

  // Workforce utilization %
  const workforceUtilization =
    totalCapacity > 0
      ? Number(
          ((allocatedCapacity / totalCapacity) * 100).toFixed(1)
        )
      : 0;

  // Remaining / deficit capacity
  const remainingCapacity = totalCapacity - allocatedCapacity;

  const isOverCapacity = remainingCapacity < 0;

  const availableCapacityPercent = Number(
    Math.abs((remainingCapacity / totalCapacity) * 100).toFixed(1)
  );

  // Allocation map
  const resourceAllocationMap = filteredAllocations.reduce(
    (acc, allocation) => {
      acc[allocation.resourceName] =
        (acc[allocation.resourceName] || 0) +
        allocation.allocationPercent;

      return acc;
    },
    {} as Record<string, number>
  );

  // Overallocated resources
  const overallocatedResources = Object.values(
    resourceAllocationMap
  ).filter((value) => value > 100).length;

  // Demand allocation requirement
  const totalDemandCapacity = demands
    .filter((demand) => demand.identified)
    .reduce((sum, demand) => {
      return sum + demand.allocationPercent;
    }, 0);

  // Demand coverage %
  const demandCoverage =
    totalDemandCapacity > 0
      ? Number(
          Math.min(
            100,
            (allocatedCapacity / totalDemandCapacity) * 100
          ).toFixed(1)
        )
      : 0;

  // Forecasted demand estimation
  const totalForecastDemand = forecasts.reduce(
    (sum, forecast) => {
      return sum + forecast.headcount * 100;
    },
    0
  );

  // Forecast utilization %
  const forecastUtilization =
    totalCapacity > 0
      ? Number(
          Math.min(
            999,
            (totalForecastDemand / totalCapacity) * 100
          ).toFixed(1)
        )
      : 0;

  // =========================
  // GRID DATA
  // =========================

  const gridData = filteredAllocations.map((allocation) => {
    const resource = resources.find(
      (res) => res.name === allocation.resourceName
    );

    const totalResourceAllocation =
      resourceAllocationMap[allocation.resourceName] || 0;

    const availableCapacity = Math.max(
      0,
      100 - totalResourceAllocation
    );

    let planningStatus = 'Available';

    if (totalResourceAllocation > 100) {
      planningStatus = 'Overallocated';
    } else if (totalResourceAllocation === 100) {
      planningStatus = 'Fully Allocated';
    } else if (totalResourceAllocation > 0) {
      planningStatus = 'Partial Allocation';
    }

    return {
      id: allocation.id,
      resourceName: allocation.resourceName,
      role: allocation.projectRole,
      vendor: resource?.vendor || 'Internal',
      project: allocation.project,
      allocationPercent: allocation.allocationPercent,
      totalAllocation: totalResourceAllocation,
      availableCapacity,
      planningStatus,
      startDate: allocation.startDate,
      endDate: allocation.endDate,
    };
  });

  const kpis = [
    {
      title: 'Workforce Size',
      value: `${totalResources}`,
      icon: Users,
      description: 'Total active resources',
    },
    {
      title: 'Workforce Utilization',
      value: `${workforceUtilization}%`,
      icon: Briefcase,
      description: `${filteredAllocations.length} active allocations`,
    },
    {
      title: isOverCapacity
        ? 'Capacity Deficit'
        : 'Available Capacity',
      value: `${availableCapacityPercent}%`,
      icon: TrendingUp,
      description: isOverCapacity
        ? 'Organization over capacity'
        : 'Remaining workforce bandwidth',
    },
    {
      title: 'Overallocated Resources',
      value: `${overallocatedResources}`,
      icon: AlertTriangle,
      description: 'Resources above 100% allocation',
    },
    {
      title: 'Demand Coverage',
      value: `${demandCoverage}%`,
      icon: Briefcase,
      description: 'Demand fulfilled by current allocations',
    },
    {
      title: 'Forecast Utilization',
      value: `${forecastUtilization}%`,
      icon: TrendingUp,
      description: `${selectedPeriod} planning horizon`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Capacity Planning
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Enterprise workforce capacity, allocation, and forecast planning
        </p>
      </div>

      {/* GLOBAL FILTERS */}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Global Filters
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* Project */}

            <Select
              value={selectedProject}
              onValueChange={setSelectedProject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Project" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>

                {projectOptions.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Resource */}

            <Select
              value={selectedResource}
              onValueChange={setSelectedResource}
            >
              <SelectTrigger>
                <SelectValue placeholder="Resource" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Resources</SelectItem>

                {resourceOptions.map((resource) => (
                  <SelectItem key={resource} value={resource}>
                    {resource}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vendor */}

            <Select
              value={selectedVendor}
              onValueChange={setSelectedVendor}
            >
              <SelectTrigger>
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>

                {vendorOptions.map((vendor) => (
                  <SelectItem key={vendor} value={vendor}>
                    {vendor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Skill */}

            <Select
              value={selectedSkill}
              onValueChange={setSelectedSkill}
            >
              <SelectTrigger>
                <SelectValue placeholder="Skill" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>

                {skillOptions.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Employment Type */}

            <Select
              value={selectedEmploymentType}
              onValueChange={setSelectedEmploymentType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Employment Types
                </SelectItem>

                {employmentTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}

            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>

                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Period */}

            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">
                  Quarterly
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>

                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {kpi.value}
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CAPACITY PLANNING GRID */}

      <CapacityPlanningGrid data={gridData} />
    </div>
  );
};

export default CapacityPlanning;