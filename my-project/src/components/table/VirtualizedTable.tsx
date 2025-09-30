import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VirtualizedTableProps, FilterState, Status } from '@/types/table';
import { TableRowComponent } from './TableRowComponent';
import { TableHeader } from './TableHeader';
import { SkeletonTable } from './SkeletonLoader';

interface ExtendedVirtualizedTableProps extends VirtualizedTableProps {
  totalRows: number;
  filteredRows: number;
  filters: FilterState;
  hasActiveFilters: boolean;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onClearFilters: () => void;
  onDeleteRecord: (id: string) => Promise<boolean>;
  onUpdateStatus: (id: string, status: Status) => Promise<boolean>;
  onUpdateScore: (id: string, score: number) => Promise<boolean>;
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
  onDeleteRecord,
  onUpdateStatus,
  onUpdateScore,
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
      <SkeletonTable
        height={height}
        rowHeight={rowHeight}
        rowCount={Math.floor(height / rowHeight)}
      />
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
                onDeleteRecord={onDeleteRecord}
                onUpdateStatus={onUpdateStatus}
                onUpdateScore={onUpdateScore}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
