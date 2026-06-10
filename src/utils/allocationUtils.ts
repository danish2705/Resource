import { allocations, type AllocationRow } from "@/mocks/allocation";

/** All rows that share the same resourceId */
export function getAllProjectsForResource(resourceId: string): AllocationRow[] {
  return allocations.filter((r) => r.resourceId === resourceId);
}

/** Whether a resource is allocated to 2 or more projects */
export function isMultiProject(resourceId: string): boolean {
  return getAllProjectsForResource(resourceId).length >= 2;
}

/** Sum of allocation % across all projects for a resource */
export function getTotalAllocation(resourceId: string): number {
  return getAllProjectsForResource(resourceId).reduce(
    (sum, r) => sum + r.allocationPercentage,
    0,
  );
}

/** Utilization tier derived from total allocation % */
export function getUtilizationStatus(
  resourceId: string,
): "low" | "medium" | "high" {
  const total = getTotalAllocation(resourceId);
  if (total >= 90) return "high";
  if (total >= 60) return "medium";
  return "low";
}

/** Tailwind text-color class based on total allocation % */
export function getAllocColor(totalPct: number): string {
  if (totalPct >= 100) return "text-red-400";
  if (totalPct >= 80) return "text-green-400";
  if (totalPct >= 60) return "text-yellow-400";
  return "text-cyan-400";
}