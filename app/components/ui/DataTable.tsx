import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Pagination } from "../../types/common";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no items to display at this time.",
  pagination,
  onPageChange,
  onRowClick,
  renderMobileCard,
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={`w-full bg-[#131B2E] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-lg ${className}`}>
      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW (Table with headers for md screens and larger)           */}
      {/* ========================================================================= */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0F172A] border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width }}
                  className={`px-5 py-3.5 ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              // Desktop Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  {columns.map((col, j) => (
                    <td key={`skeleton-cell-${j}`} className="px-5 py-4">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <p className="text-base font-bold text-white mb-1">{emptyTitle}</p>
                    <p className="text-xs text-slate-400">{emptyDescription}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isClickable = !!onRowClick;
                return (
                  <tr
                    key={keyExtractor(item, index)}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      isClickable ? "cursor-pointer hover:bg-slate-800/50" : "hover:bg-slate-900/30"
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={`${keyExtractor(item, index)}-${col.key}`}
                        className={`px-5 py-4 text-xs lg:text-sm ${
                          col.align === "right"
                            ? "text-right"
                            : col.align === "center"
                            ? "text-center"
                            : "text-left"
                        } ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(item, index)
                          : (item as Record<string, unknown>)[col.key]?.toString() || "—"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW (Dedicated Card/Stack layout for screens < md)            */}
      {/* ========================================================================= */}
      <div className="block md:hidden w-full divide-y divide-slate-800/60">
        {isLoading ? (
          // Mobile Loading Skeleton Cards
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`mob-skeleton-${i}`}
                className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 space-y-3 animate-pulse"
              >
                <div className="h-4 bg-slate-800 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-800/70 rounded w-3/4" />
                <div className="h-3 bg-slate-800/70 rounded w-2/3" />
                <div className="h-7 bg-slate-800/50 rounded mt-3 w-full" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <p className="text-sm font-bold text-white mb-1">{emptyTitle}</p>
            <p className="text-xs text-slate-400">{emptyDescription}</p>
          </div>
        ) : (
          <div className="p-3.5 space-y-3">
            {data.map((item, index) => {
              const isClickable = !!onRowClick;

              if (renderMobileCard) {
                return (
                  <div
                    key={`custom-card-${keyExtractor(item, index)}`}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={isClickable ? "cursor-pointer active:scale-[0.99] transition-transform" : ""}
                  >
                    {renderMobileCard(item, index)}
                  </div>
                );
              }

              // Separate regular columns from trailing actions column
              const actionColumn = columns.find(
                (c) => c.key === "actions" || c.key === "action" || c.header === "Action" || c.header === "Actions"
              );
              const dataColumns = columns.filter((c) => c !== actionColumn);

              return (
                <div
                  key={`card-${keyExtractor(item, index)}`}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`bg-[#0F172A] border border-slate-800/80 rounded-xl p-4 space-y-2.5 transition-all shadow-sm ${
                    isClickable ? "cursor-pointer hover:border-slate-700 active:scale-[0.99]" : ""
                  }`}
                >
                  {dataColumns.map((col) => {
                    const content = col.render
                      ? col.render(item, index)
                      : (item as Record<string, unknown>)[col.key]?.toString() || "—";

                    return (
                      <div
                        key={`mob-${keyExtractor(item, index)}-${col.key}`}
                        className="flex items-start justify-between gap-3 text-xs py-1 border-b border-slate-800/30 last:border-b-0"
                      >
                        <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wide shrink-0">
                          {col.header}
                        </span>
                        <div className="text-right text-slate-200 font-normal break-words max-w-[65%]">
                          {content}
                        </div>
                      </div>
                    );
                  })}

                  {/* Actions Row at bottom of card */}
                  {actionColumn && (
                    <div
                      key={`mob-${keyExtractor(item, index)}-act`}
                      className="pt-2.5 mt-1 border-t border-slate-800/70 flex items-center justify-end gap-2"
                    >
                      {actionColumn.render
                        ? actionColumn.render(item, index)
                        : (item as Record<string, unknown>)[actionColumn.key]?.toString() || null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. PAGINATION FOOTER (Responsive desktop & mobile layout)                */}
      {/* ========================================================================= */}
      {pagination && pagination.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-[#0F172A] border-t border-slate-800 text-xs text-slate-400">
          <div className="text-center sm:text-left text-[11px] sm:text-xs">
            Showing <span className="font-semibold text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
            <span className="font-semibold text-white">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of <span className="font-semibold text-white">{pagination.total}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevious || isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Prev</span>
            </button>
            <span className="px-2 text-slate-300 font-medium text-xs">
              Page {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || isLoading}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1 text-xs"
              aria-label="Next page"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
