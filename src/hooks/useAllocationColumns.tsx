import { useMemo, useCallback } from "react";
import { type Column } from "@/components/DataTable";
import { type AllocationRow } from "@/mocks/allocation";
import { AllocCell } from "../components/allocation/AllocCell";
import { ProjectCell } from "../components/allocation/ProjectCell";

export function useAllocationColumns(
  onOpenDialog: (row: AllocationRow) => void,
) {
  const handleClick = useCallback(
    (row: AllocationRow) => onOpenDialog(row),
    [onOpenDialog],
  );

  return useMemo<Column<AllocationRow>[]>(
    () => [
      {
        key: "projectId",
        header: "Project ID",
        render: (r) => (
          <span className="text-xs font-medium">{r.projectId}</span>
        ),
      },
      {
        key: "project",
        header: "Project",
        render: (r) => <ProjectCell row={r} onShowAll={handleClick} />,
      },
      {
        key: "resourceId",
        header: "Resource ID",
        render: (r) => (
          <span className="text-xs font-medium">{r.resourceId}</span>
        ),
      },
      {
        key: "resource",
        header: "Resource",
        render: (r) => (
          <span className="font-semibold text-foreground">{r.resource}</span>
        ),
      },
      {
        key: "role",
        header: "Role",
        render: (r) => (
          <span className="text-sm text-muted-foreground">{r.role}</span>
        ),
      },
      {
        key: "allocationType",
        header: "Allocation Type",
        render: (r) => {
          const color =
            r.allocationType === "Project"
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-purple-500/20 text-purple-400 border border-purple-500/30";
          return (
            <div className="flex justify-center items-center w-full">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                {r.allocationType}
              </span>
            </div>
          );
        },
      },
      {
        key: "allocationPercentage",
        header: "Alloc %",
        render: (r) => <AllocCell row={r} onClick={handleClick} />,
      },
      {
        key: "hoursPerWeek",
        header: "Hrs/Wk",
        render: (r) => (
          <div className="flex justify-center items-center w-full">
            <span className="text-sm">{r.hoursPerWeek}</span>
          </div>
        ),
      },
      {
        key: "startDate",
        header: "Start",
        render: (r) => (
          <span className="text-sm text-muted-foreground">{r.startDate}</span>
        ),
      },
      {
        key: "endDate",
        header: "End",
        render: (r) => (
          <span className="text-sm text-muted-foreground">{r.endDate}</span>
        ),
      },
    ],
    [handleClick],
  );
}