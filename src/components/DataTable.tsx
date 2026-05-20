// src/components/DataTable.tsx

import { useState, useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { ChevronLeft, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Column Type
// ─────────────────────────────────────────────────────────────

export interface Column<T extends object> {
  key: keyof T | string;

  header: string;

  render?: (row: T, index: number) => React.ReactNode;

  sortable?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface Props<T extends object> {
  data: T[];

  columns: Column<T>[];

  searchPlaceholder?: string;

  pageSize?: number;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function DataTable<T extends object>({
  data,
  columns,
  pageSize: defaultPageSize = 10,
}: Props<T>) {
  const [search] = useState("");

  const [page, setPage] = useState(0);

  const [pageSize] = useState(defaultPageSize);

  const [sortKey, setSortKey] = useState<string | null>(null);

  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ───────────────────────────────────────────────────────────
  // Search Filter
  // ───────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    if (!search) return data;

    const s = search.toLowerCase();

    return data.filter((row) =>
      columns.some((col) => {
        if (!(col.key in (row as object))) return false;

        return String(row[col.key as keyof T] ?? "")
          .toLowerCase()
          .includes(s);
      }),
    );
  }, [data, search, columns]);

  // ───────────────────────────────────────────────────────────
  // Sorting
  // ───────────────────────────────────────────────────────────

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof T];

      const bv = b[sortKey as keyof T];

      const cmp = String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
        numeric: true,
      });

      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // ───────────────────────────────────────────────────────────
  // Pagination
  // ───────────────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  // ───────────────────────────────────────────────────────────
  // Sorting Handler
  // ───────────────────────────────────────────────────────────

  const handleSort = (key: string) => {
    if (!data.length || !(key in (data[0] as object))) return;

    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);

      setSortDir("asc");
    }
  };

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={
                    col.sortable !== false
                      ? "cursor-pointer select-none hover:bg-muted/50"
                      : ""
                  }
                  onClick={() =>
                    col.sortable !== false && handleSort(String(col.key))
                  }
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
              paged.map((row, i) => (
                <TableRow key={i} className="hover:bg-accent/30">
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row, page * pageSize + i)
                        : String(row[col.key as keyof T] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
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

          {Array.from(
            {
              length: Math.min(totalPages, 5),
            },
            (_, i) => {
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
            },
          )}

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
