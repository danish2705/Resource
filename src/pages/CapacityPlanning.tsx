import { useMemo, useState } from 'react';

import { useStore } from '@/store/useStore';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import CapacityPlanningGrid from '@/components/capacity/CapacityPlanningGrid';
import CapacityAnalytics from '@/components/capacity/CapacityAnalytics';
import CapacityAlerts from '@/components/capacity/CapacityAlerts';
import BenchInsights from '@/components/capacity/BenchInsights';
import ScenarioPlanning from '@/components/capacity/ScenarioPlanning';

export default function CapacityPlanning() {

  const {
    allocations,
    resources,
  } = useStore();

  // =========================
  // FILTERS
  // =========================

  const [selectedVendor, setSelectedVendor] =
    useState('All');

  const [selectedStatus, setSelectedStatus] =
    useState('All');

  // =========================
  // FILTER OPTIONS
  // =========================

  const vendorOptions = useMemo(() => {

    const vendors = new Set(
      resources.map(
        (resource) => resource.vendor
      )
    );

    return ['All', ...vendors];

  }, [resources]);

  // =========================
  // FILTERED DATA
  // =========================

  const filteredAllocations = useMemo(() => {

    return allocations.filter((allocation) => {

      const resource = resources.find(
        (r) =>
          r.resourceName ===
          allocation.resourceName
      );

      const vendor =
        resource?.vendor || 'Internal';

      // =========================
      // TOTAL RESOURCE ALLOCATION
      // =========================

      const totalResourceAllocation =
        allocations
          .filter(
            (a) =>
              a.resourceName ===
              allocation.resourceName
          )
          .reduce(
            (sum, item) =>
              sum + item.allocationPercent,
            0
          );

      let planningStatus = 'Available';

      if (totalResourceAllocation > 100) {

        planningStatus = 'Overallocated';

      } else if (
        totalResourceAllocation === 100
      ) {

        planningStatus =
          'Fully Allocated';

      } else if (
        totalResourceAllocation > 0
      ) {

        planningStatus =
          'Partial Allocation';

      }

      // =========================
      // FILTERS
      // =========================

      const vendorMatch =
        selectedVendor === 'All' ||
        vendor === selectedVendor;

      const statusMatch =
        selectedStatus === 'All' ||
        planningStatus === selectedStatus;

      return (
        vendorMatch &&
        statusMatch
      );

    });

  }, [
    allocations,
    resources,
    selectedVendor,
    selectedStatus,
  ]);

  // =========================
  // KPI CALCULATIONS
  // =========================

  const capacityMetrics = useMemo(() => {

    const groupedResources:
      Record<string, number> = {};

    filteredAllocations.forEach(
      (allocation) => {

        groupedResources[
          allocation.resourceName
        ] =
          (
            groupedResources[
              allocation.resourceName
            ] || 0
          ) +
          allocation.allocationPercent;

      }
    );

    // TOTAL RESOURCES

    const totalResources =
      Object.keys(groupedResources)
        .length;

    // TOTAL CAPACITY

    const totalCapacity =
      totalResources * 100;

    // ALLOCATED CAPACITY

    const allocatedCapacity =
      Object.values(
        groupedResources
      ).reduce(
        (sum, allocation) =>
          sum + allocation,
        0
      );

    // NORMALIZED DISPLAY

    const normalizedAllocatedCapacity =
      totalResources > 0
        ? Number(
            (
              allocatedCapacity /
              totalResources
            ).toFixed(1)
          )
        : 0;

    // AVAILABLE CAPACITY

    const rawAvailableCapacity =
      totalCapacity -
      allocatedCapacity;

    const availableCapacity =
      Math.max(
        0,
        rawAvailableCapacity
      );

    // OVERFLOW

    const capacityOverflow =
      allocatedCapacity > totalCapacity
        ? allocatedCapacity -
          totalCapacity
        : 0;

    // OVERALLOCATED

    const overallocatedResources =
      Object.values(
        groupedResources
      ).filter(
        (allocation) =>
          allocation > 100
      ).length;

    // UTILIZATION

    const utilization =
      totalCapacity > 0
        ? Math.round(
            (
              allocatedCapacity /
              totalCapacity
            ) * 100
          )
        : 0;

    return {
      totalResources,
      totalCapacity,
      allocatedCapacity,
      normalizedAllocatedCapacity,
      availableCapacity,
      capacityOverflow,
      overallocatedResources,
      utilization,
    };

  }, [filteredAllocations]);

  // =========================
  // GRID DATA
  // =========================

  const capacityGridData = useMemo(() => {

    return filteredAllocations.map(
      (allocation) => {

        const resource =
          resources.find(
            (r) =>
              r.resourceName ===
              allocation.resourceName
          );

        const vendor =
          resource?.vendor ||
          'Internal';

        const totalResourceAllocation =
          allocations
            .filter(
              (a) =>
                a.resourceName ===
                allocation.resourceName
            )
            .reduce(
              (sum, item) =>
                sum +
                item.allocationPercent,
              0
            );

        const availableCapacity =
          Math.max(
            0,
            100 -
              totalResourceAllocation
          );

        let planningStatus =
          'Available';

        if (
          totalResourceAllocation > 100
        ) {

          planningStatus =
            'Overallocated';

        } else if (
          totalResourceAllocation === 100
        ) {

          planningStatus =
            'Fully Allocated';

        } else if (
          totalResourceAllocation > 0
        ) {

          planningStatus =
            'Partial Allocation';

        }

        return {
          id: allocation.id,
          resourceName:
            allocation.resourceName,
          role:
            allocation.projectRole,
          vendor,
          project:
            allocation.project,
          allocationPercent:
            allocation.allocationPercent,
          totalAllocation:
            totalResourceAllocation,
          availableCapacity,
          planningStatus,
          startDate:
            allocation.startDate,
          endDate:
            allocation.endDate,
        };

      }
    );

  }, [
    filteredAllocations,
    resources,
    allocations,
  ]);

  return (

    <div className="space-y-6">

      {/* PAGE TITLE */}

      <div>

        <h1 className="text-2xl font-bold">
          Capacity Planning
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Enterprise workforce planning
          and utilization management
        </p>

      </div>

      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Capacity
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {
                capacityMetrics.totalResources
              }
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              Resources
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Allocated Capacity
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {
                capacityMetrics.normalizedAllocatedCapacity
              }
              %
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              Average allocation utilization
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Available Capacity
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {
                capacityMetrics.availableCapacity
              }
              %
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              Remaining healthy capacity
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Capacity Overflow
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {
                capacityMetrics.capacityOverflow
              }
              %
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              Capacity beyond organization limit
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Overallocated
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {
                capacityMetrics.overallocatedResources
              }
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              Resources above 100%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Utilization
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold">
              {
                capacityMetrics.utilization
              }
              %
            </div>

            <div className="text-sm text-muted-foreground mt-1">
              Overall workforce utilization
            </div>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS */}

      <Card>

        <CardHeader>
          <CardTitle className="text-sm">
            Capacity Filters
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <div className="text-sm font-medium mb-2">
                Vendor
              </div>

              <Select
                value={selectedVendor}
                onValueChange={
                  setSelectedVendor
                }
              >

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  {vendorOptions.map(
                    (vendor) => (
                      <SelectItem
                        key={vendor}
                        value={vendor}
                      >
                        {vendor}
                      </SelectItem>
                    )
                  )}

                </SelectContent>

              </Select>

            </div>

            <div>

              <div className="text-sm font-medium mb-2">
                Planning Status
              </div>

              <Select
                value={selectedStatus}
                onValueChange={
                  setSelectedStatus
                }
              >

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="All">
                    All
                  </SelectItem>

                  <SelectItem value="Available">
                    Available
                  </SelectItem>

                  <SelectItem value="Partial Allocation">
                    Partial Allocation
                  </SelectItem>

                  <SelectItem value="Fully Allocated">
                    Fully Allocated
                  </SelectItem>

                  <SelectItem value="Overallocated">
                    Overallocated
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* GRID */}

      <CapacityPlanningGrid
        data={capacityGridData}
      />

      {/* ANALYTICS */}

      <CapacityAnalytics
        allocations={filteredAllocations.map(
          (allocation) => ({
            resourceName:
              allocation.resourceName,
            allocationPercent:
              allocation.allocationPercent,
          })
        )}
      />

      {/* EXCEPTION ALERTS */}

      <CapacityAlerts
        allocations={filteredAllocations.map(
          (allocation) => ({
            resourceName:
              allocation.resourceName,
            allocationPercent:
              allocation.allocationPercent,
            endDate:
              allocation.endDate,
          })
        )}
      />

      {/* SCENARIO PLANNING */}

      <ScenarioPlanning
        allocations={filteredAllocations.map(
          (allocation) => ({
            id: allocation.id,
            resourceName:
              allocation.resourceName,
            project:
              allocation.project,
            allocationPercent:
              allocation.allocationPercent,
          })
        )}
      />

      {/* BENCH INSIGHTS */}

      <BenchInsights
        allocations={filteredAllocations.map(
          (allocation) => ({
            resourceName:
              allocation.resourceName,
            allocationPercent:
              allocation.allocationPercent,
            endDate:
              allocation.endDate,
          })
        )}
      />

    </div>
  );
}