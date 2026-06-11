import { Layers } from "lucide-react";

import { type AllocationRow } from "@/mocks/allocation";
import {
  isMultiProject,
  getTotalAllocation,
  getAllocColor,
} from "../../utils/allocationUtils";

interface AllocCellProps {
  row: AllocationRow;
  onClick: (row: AllocationRow) => void;
}

export function AllocCell({ row, onClick }: AllocCellProps) {
  const multi = isMultiProject(row.resourceId);
  const totalPct = multi
    ? getTotalAllocation(row.resourceId)
    : row.allocationPercentage;
  const color = getAllocColor(totalPct);

  return (
    <div className="flex justify-center items-center w-full">
      {multi ? (
        <button
          onClick={() => onClick(row)}
          className={`font-semibold ${color} underline decoration-dotted underline-offset-2 cursor-pointer hover:opacity-75 transition-opacity flex items-center gap-1`}
          title="Click to see all project allocations"
        >
          {totalPct}%
          <Layers className="h-3 w-3 opacity-60" />
        </button>
      ) : (
        <span className={`font-semibold ${color}`}>
          {row.allocationPercentage}%
        </span>
      )}
    </div>
  );
}