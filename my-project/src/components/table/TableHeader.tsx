import React from 'react';
import { Button } from '@/components/ui/button';
import { TextFilter } from '@/components/filters/TextFilter';

interface TableHeaderProps {
  totalRows: number;
  filteredRows: number;
  selectedCount: number;
  nameFilter: string;
  hasActiveFilters: boolean;
  onBulkSelect?: (selected: boolean) => void;
  onNameFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  totalRows,
  filteredRows,
  selectedCount,
  nameFilter,
  hasActiveFilters,
  onBulkSelect,
  onNameFilterChange,
  onClearFilters,
}) => {
  const isAllSelected = selectedCount === filteredRows && filteredRows > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < filteredRows;

  const handleBulkSelect = () => {
    onBulkSelect?.(!isAllSelected);
  };

  return (
    <div
      className="bg-gray-50 border-b px-6 py-4"
      role="banner"
      aria-label="Table controls and headers"
    >
      {/* Filter Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <TextFilter
              value={nameFilter}
              onChange={onNameFilterChange}
              placeholder="Search by name..."
              label="Filter by employee name"
              className="w-80"
            />

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Clear all filters"
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-600">
            {hasActiveFilters ? (
              <span>
                Showing {filteredRows.toLocaleString()} of{' '}
                {totalRows.toLocaleString()} rows
              </span>
            ) : (
              <span>{totalRows.toLocaleString()} total rows</span>
            )}
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isIndeterminate;
              }}
              onChange={handleBulkSelect}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              aria-label={
                isAllSelected ? 'Deselect all rows' : 'Select all rows'
              }
              aria-describedby="selection-status"
            />
            <span
              id="selection-status"
              className="text-sm font-medium text-gray-700"
            >
              {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
            </span>
          </div>

          {selectedCount > 0 && (
            <div
              className="flex items-center space-x-2"
              role="group"
              aria-label="Bulk actions"
            >
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-700 hover:bg-blue-50"
                aria-label={`Export ${selectedCount} selected rows`}
              >
                Export Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-600 text-red-700 hover:bg-red-50"
                aria-label={`Delete ${selectedCount} selected rows`}
              >
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Row counts now shown in filter section */}
      </div>

      {/* Column Headers */}
      <div
        className="grid grid-cols-8 gap-4 mt-4 text-xs font-medium text-gray-500 uppercase tracking-wider"
        role="row"
        aria-label="Column headers"
      >
        <div className="col-span-2" role="columnheader">
          Name & Email
        </div>
        <div role="columnheader">Role</div>
        <div role="columnheader">Status</div>
        <div role="columnheader">Score</div>
        <div role="columnheader">Department</div>
        <div role="columnheader">Join Date</div>
        <div role="columnheader">Last Active</div>
      </div>
    </div>
  );
};
