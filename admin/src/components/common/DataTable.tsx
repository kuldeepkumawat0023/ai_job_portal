import React from 'react';
import EmptyState from './EmptyState';
import { cn } from '@/utils/cn';

interface Column {
  header: string;
  className?: string;
}

interface DataTableProps {
  columns: Column[] | string[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDesc?: string;
  children: React.ReactNode;
  className?: string;
}

export default function DataTable({
  columns,
  isLoading = false,
  isEmpty = false,
  emptyTitle,
  emptyDesc,
  children,
  className
}: DataTableProps) {
  const normalizedColumns = columns.map(col => 
    typeof col === 'string' ? { header: col } : col
  );

  return (
    <div className={cn("glass-card rounded-2xl p-6 overflow-hidden", className)}>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 dark:border-zinc-800">
              {normalizedColumns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "text-left text-[10px] font-black uppercase tracking-widest text-on-surface-variant dark:text-zinc-400 py-3 pb-4 pr-4 select-none",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative">
            {isLoading ? (
              <tr>
                <td colSpan={normalizedColumns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-on-surface-variant font-medium">Loading entries...</span>
                  </div>
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={normalizedColumns.length} className="py-6">
                  <EmptyState title={emptyTitle} description={emptyDesc} />
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
