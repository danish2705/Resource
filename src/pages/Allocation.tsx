import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/DataTable";
import { usePillarFilter } from "@/hooks/usePillarFilter";
import { allocations, type AllocationRow } from "@/mocks/allocation";

import { AllocationDialog } from "../components/allocationComponents/AllocationDialog";
import { AllocationFilters } from "../components/allocationComponents/AllocationFilters";
import { useAllocationColumns } from "../hooks/useAllocationColumns";
import { useAllocationFilters } from "../hooks/useAllocationFilters";

export default function ResourceAllocation() {
  const { filterByPillar } = usePillarFilter();

  // 1. Pillar-scoped rows
  const visibleAllocations = filterByPillar(allocations);

  // 2. Deduplicate: one row per resource
  const deduplicatedAllocations = useMemo(() => {
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    return visibleAllocations.filter((r) => {
      if (seenIds.has(r.resourceId) || seenNames.has(r.resource)) return false;
      seenIds.add(r.resourceId);
      seenNames.add(r.resource);
      return true;
    });
  }, [visibleAllocations]);

  // 3. Unique project IDs for the dropdown
  const allProjectIds = useMemo(
    () => Array.from(new Set(visibleAllocations.map((r) => r.projectId))),
    [visibleAllocations],
  );

  // 4. Filter state + filtered rows
  const { filters, updateFilters, filteredData } =
    useAllocationFilters(deduplicatedAllocations);

  // 5. Dialog state
  const [dialogRow, setDialogRow] = useState<AllocationRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = useCallback((row: AllocationRow) => {
    setDialogRow(row);
    setDialogOpen(true);
  }, []);

  // 6. Stable column definitions
  const columns = useAllocationColumns(handleOpenDialog);

  return (
    <div className="h-[calc(100vh-110px)] flex flex-col">
      <Card className="flex-1 min-h-0 flex flex-col">
        <CardHeader className="shrink-0">
          <CardTitle className="text-base">Allocation Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredData.length} allocation
            {filteredData.length !== 1 ? "s" : ""}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 min-h-0">
          <AllocationFilters
            filters={filters}
            projectIds={allProjectIds}
            resultCount={filteredData.length}
            onChange={updateFilters}
          />

          <div className="flex-1 min-h-0">
            <DataTable data={filteredData} columns={columns} pageSize={50} />
          </div>
        </CardContent>
      </Card>

      <AllocationDialog
        row={dialogRow}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}