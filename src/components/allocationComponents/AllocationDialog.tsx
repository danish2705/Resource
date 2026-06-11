import { Layers } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type AllocationRow } from "@/mocks/allocation";
import {
  getAllProjectsForResource,
  getTotalAllocation,
  getUtilizationStatus,
} from "../../utils/allocationUtils";

// ─── ProjectCard ─────────────────────────────────────────────────────────────

function ProjectCard({ row }: { row: AllocationRow }) {
  const barColor =
    row.allocationPercentage >= 100
      ? "bg-red-500"
      : row.allocationPercentage >= 80
        ? "bg-green-500"
        : row.allocationPercentage >= 60
          ? "bg-yellow-500"
          : "bg-cyan-500";

  const typeColor =
    row.allocationType === "Project"
      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
      : "bg-purple-500/20 text-purple-400 border border-purple-500/30";

  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground leading-tight">
            {row.project}
          </p>
          <p className="text-xs text-muted-foreground">{row.projectId}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeColor}`}>
            {row.allocationType}
          </span>
          <span className="text-sm font-bold text-foreground">
            {row.allocationPercentage}%
          </span>
        </div>
      </div>

      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: `${row.allocationPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{row.hoursPerWeek} hrs/wk</span>
        <span>{row.startDate} → {row.endDate}</span>
      </div>
    </div>
  );
}

// ─── DialogSummaryFooter ──────────────────────────────────────────────────────

function DialogSummaryFooter({
  totalAlloc,
  utilizationStatus,
}: {
  totalAlloc: number;
  utilizationStatus: "low" | "medium" | "high";
}) {
  const utilizationColor =
    utilizationStatus === "high"
      ? "text-red-400 bg-red-500/10 border-red-500/30"
      : utilizationStatus === "medium"
        ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
        : "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

  const utilizationLabel =
    utilizationStatus === "high"
      ? "High — near or over capacity"
      : utilizationStatus === "medium"
        ? "Medium — moderately loaded"
        : "Low — has availability";

  const totalColor =
    totalAlloc > 100
      ? "text-red-400"
      : totalAlloc === 100
        ? "text-blue-400"
        : "text-emerald-400";

  return (
    <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
      <div className="text-sm">
        <span className="text-muted-foreground">Total allocation: </span>
        <span className={`font-semibold ${totalColor}`}>{totalAlloc}%</span>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${utilizationColor}`}>
        {utilizationLabel}
      </span>
    </div>
  );
}

// ─── AllocationDialog ─────────────────────────────────────────────────────────

interface AllocationDialogProps {
  row: AllocationRow | null;
  open: boolean;
  onClose: () => void;
}

export function AllocationDialog({ row, open, onClose }: AllocationDialogProps) {
  if (!row) return null;

  const allRows = getAllProjectsForResource(row.resourceId);
  const totalAlloc = getTotalAllocation(row.resourceId);
  const utilizationStatus = getUtilizationStatus(row.resourceId);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4 text-indigo-400" />
            {row.resource} — Project Allocations
          </DialogTitle>
          <p className="text-xs text-muted-foreground pt-0.5">
            {row.role} · {row.resourceId}
          </p>
        </DialogHeader>

        <div className="space-y-2 mt-1">
          {allRows.map((r) => (
            <ProjectCard key={r.projectId} row={r} />
          ))}
        </div>

        <DialogSummaryFooter
          totalAlloc={totalAlloc}
          utilizationStatus={utilizationStatus}
        />
      </DialogContent>
    </Dialog>
  );
}