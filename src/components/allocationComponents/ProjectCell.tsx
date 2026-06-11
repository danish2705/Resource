import { type AllocationRow } from "@/mocks/allocation";
import { getAllProjectsForResource } from "../../utils/allocationUtils";

interface ProjectCellProps {
  row: AllocationRow;
  onShowAll: (row: AllocationRow) => void;
}

export function ProjectCell({ row, onShowAll }: ProjectCellProps) {
  const extraCount = getAllProjectsForResource(row.resourceId).length - 1;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-muted-foreground">{row.project}</span>
      {extraCount > 0 && (
        <button
          onClick={() => onShowAll(row)}
          className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors cursor-pointer whitespace-nowrap"
          title={`Also on ${extraCount} more project${extraCount > 1 ? "s" : ""}`}
        >
          +{extraCount}
        </button>
      )}
    </div>
  );
}