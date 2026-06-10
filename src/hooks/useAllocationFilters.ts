import { useState, useMemo } from "react";
import { type AllocationRow } from "@/mocks/allocation";
import { type AllocationFiltersState } from "../components/allocation/AllocationFilters";
import { getUtilizationStatus } from "../utils/allocationUtils";

const DEFAULT_FILTERS: AllocationFiltersState = {
  search: "",
  allocationTypeFilter: "all",
  projectFilter: "all",
  utilizationFilter: "all",
};

export function useAllocationFilters(rows: AllocationRow[]) {
  const [filters, setFilters] =
    useState<AllocationFiltersState>(DEFAULT_FILTERS);

  const updateFilters = (patch: Partial<AllocationFiltersState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const filteredData = useMemo(() => {
    const q = filters.search.toLowerCase();

    return rows.filter((r) => {
      const matchSearch =
        !q ||
        r.resource.toLowerCase().includes(q) ||
        r.resourceId.toLowerCase().includes(q) ||
        r.project.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.projectId.toLowerCase().includes(q);

      const matchType =
        filters.allocationTypeFilter === "all" ||
        r.allocationType === filters.allocationTypeFilter;

      const matchProject =
        filters.projectFilter === "all" ||
        r.projectId === filters.projectFilter;

      const matchUtilization =
        filters.utilizationFilter === "all" ||
        getUtilizationStatus(r.resourceId) === filters.utilizationFilter;

      return matchSearch && matchType && matchProject && matchUtilization;
    });
  }, [rows, filters]);

  return { filters, updateFilters, filteredData };
}