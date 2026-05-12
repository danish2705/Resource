import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
}

export default function DataTable<T extends object>({
  data,
  columns,
  searchPlaceholder = "Search...",
  pageSize: defaultPageSize = 10,
}: Props<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const [sortKey, setSortKey] = useState<string | null>(null);

  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    if (!search) return data;

    const s = search.toLowerCase();

    return data.filter((row) =>
      columns.some((col) =>
        String((row as Record<string, unknown>)[col.key] ?? "")
          .toLowerCase()
          .includes(s),
      ),
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];

      const cmp = String(av).localeCompare(String(bv), undefined, {
        numeric: true,
      });

      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700 px-2 py-1 rounded text-xs";

      case "busy":
        return "bg-red-100 text-red-700 px-2 py-1 rounded text-xs";

      case "leave":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs";

      default:
        return "";
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search */}
        <Input
          className="max-w-md h-10"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Team Filter */}
          <Select>
            <SelectTrigger className="w-48 h-10">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="cloud">Cloud Engineering</SelectItem>
              <SelectItem value="data">Data Engineering</SelectItem>
              <SelectItem value="devsecops">DevSecOps</SelectItem>
              <SelectItem value="delivery">Delivery Management</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select>
            <SelectTrigger className="w-40 h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="allocated">Allocated</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="bench">Bench</SelectItem>
              <SelectItem value="overallocated">Overallocated</SelectItem>
            </SelectContent>
          </Select>

          {/* Results Count */}
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {filtered.length} results
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={
                    col.sortable !== false
                      ? "cursor-pointer select-none hover:bg-muted/50"
                      : ""
                  }
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  {col.header}

                  {sortKey === col.key && (sortDir === "asc" ? " ↑" : " ↓")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, i) => {
                const rowData = row as Record<string, unknown>;

                return (
                  <TableRow
                    key={(rowData.id as string | number) ?? i}
                    className="hover:bg-accent/30"
                  >
                    {columns.map((col) => {
                      const value = rowData[col.key];

                      return (
                        <TableCell key={col.key}>
                          {col.key === "status" ? (
                            <span
                              className={getStatusStyle(String(value ?? ""))}
                            >
                              {String(value ?? "")}
                            </span>
                          ) : col.render ? (
                            col.render(row, page * pageSize + i)
                          ) : (
                            String(value ?? "")
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {sorted.length === 0 ? 0 : page * pageSize + 1} to{" "}
          {Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}{" "}
          entries
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p =
              totalPages <= 5
                ? i
                : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;

            return (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                className="w-8 h-8"
                onClick={() => setPage(p)}
              >
                {p + 1}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
