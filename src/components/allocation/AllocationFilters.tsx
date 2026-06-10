import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AllocationFiltersState {
  search: string;
  allocationTypeFilter: string;
  projectFilter: string;
  utilizationFilter: string;
}

interface AllocationFiltersProps {
  filters: AllocationFiltersState;
  projectIds: string[];
  resultCount: number;
  onChange: (patch: Partial<AllocationFiltersState>) => void;
}

export function AllocationFilters({
  filters,
  projectIds,
  resultCount,
  onChange,
}: AllocationFiltersProps) {
  return (
    <div className="shrink-0 flex flex-wrap items-center gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search resource, project, role..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* Project */}
      <Select
        value={filters.projectFilter}
        onValueChange={(v) => onChange({ projectFilter: v })}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projectIds.map((id) => (
            <SelectItem key={id} value={id}>
              {id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Allocation type */}
      <Select
        value={filters.allocationTypeFilter}
        onValueChange={(v) => onChange({ allocationTypeFilter: v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Allocation Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Project">Project</SelectItem>
          <SelectItem value="Base Business">Base Business</SelectItem>
        </SelectContent>
      </Select>

      {/* Utilization */}
      <Select
        value={filters.utilizationFilter}
        onValueChange={(v) => onChange({ utilizationFilter: v })}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Utilization" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Utilization</SelectItem>
          <SelectItem value="low">Low (&lt;60%)</SelectItem>
          <SelectItem value="medium">Medium (60–89%)</SelectItem>
          <SelectItem value="high">High (≥90%)</SelectItem>
        </SelectContent>
      </Select>

      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {resultCount} results
      </span>
    </div>
  );
}