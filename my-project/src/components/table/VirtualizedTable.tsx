import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VirtualizedTableProps, FilterState } from '@/types/table';
import { TableRowComponent } from './TableRowComponent';
import { TableHeader } from './TableHeader';

interface ExtendedVirtualizedTableProps extends VirtualizedTableProps {
  totalRows: number;
  filteredRows: number;
  filters: FilterState;
  hasActiveFilters: boolean;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onClearFilters: () => void;
}

export const VirtualizedTable: React.FC<ExtendedVirtualizedTableProps> = ({
  data,
  height,
  rowHeight,
  totalRows,
  filteredRows,
  filters,
  hasActiveFilters,
  onRowSelect,
  onBulkSelect,
  onFilterChange,
  onClearFilters,
  selectedRows = new Set(),
  loading = false,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading data...</span>
      </div>
    );
  }

  return (
    <div
      className="border rounded-lg overflow-hidden bg-white shadow-sm"
      role="table"
      aria-label="Employee data table"
      aria-rowcount={data.length}
    >
      <TableHeader
        totalRows={totalRows}
        filteredRows={filteredRows}
        selectedCount={selectedRows.size}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onBulkSelect={onBulkSelect}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />

      <div
        ref={parentRef}
        className="border-t overflow-auto"
        style={{ height: `${height}px` }}
        role="rowgroup"
        aria-label="Table body"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <TableRowComponent
                row={data[virtualItem.index]}
                isSelected={
                  selectedRows?.has(data[virtualItem.index].id) || false
                }
                onSelect={(selected) =>
                  onRowSelect?.(data[virtualItem.index].id, selected)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
