import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextFilter } from '@/components/filters/TextFilter';
import { SelectFilter } from '@/components/filters/SelectFilter';
import { FilterPills } from '@/components/filters/FilterPills';
import { FilterState } from '@/types/table';

interface TableHeaderProps {
  totalRows: number;
  filteredRows: number;
  selectedCount: number;
  filters: FilterState;
  hasActiveFilters: boolean;
  selectedRows: Set<string>;
  onBulkSelect?: (selected: boolean) => void;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onClearFilters: () => void;
  onBulkDelete: (
    ids: string[]
  ) => Promise<{ success: boolean; deletedCount: number; failedCount: number }>;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  totalRows,
  filteredRows,
  selectedCount,
  filters,
  hasActiveFilters,
  selectedRows,
  onBulkSelect,
  onFilterChange,
  onClearFilters,
  onBulkDelete,
}) => {
  const isAllSelected = selectedCount === filteredRows && filteredRows > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < filteredRows;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkSelect = () => {
    onBulkSelect?.(!isAllSelected);
  };

  const handleBulkDelete = async () => {
    const selectedIds = Array.from(selectedRows);

    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} selected record${selectedIds.length > 1 ? 's' : ''}?`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await onBulkDelete(selectedIds);

      if (result.success) {
        if (result.failedCount > 0) {
          alert(
            `Bulk delete completed. ${result.deletedCount} records deleted successfully. ${result.failedCount} records failed to delete.`
          );
        }
        // Success feedback is implicit (records disappear from table)
      } else {
        alert('Failed to delete selected records. Please try again.');
      }
    } catch {
      alert('An error occurred while deleting records. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'intern', label: 'Intern' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' },
  ];

  return (
    <div
      className="bg-gray-50 border-b px-6 py-4"
      role="banner"
      aria-label="Table controls and headers"
    >
      <div className="mb-6 space-y-4">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-6">
            <TextFilter
              value={filters.nameFilter}
              onChange={(value) => onFilterChange('nameFilter', value)}
              placeholder="Search by name..."
              label="Filter by employee name"
              className="w-72"
            />

            <SelectFilter
              value={filters.roleFilter}
              onChange={(value) => onFilterChange('roleFilter', value)}
              options={roleOptions}
              label="Role"
              className="w-42"
            />

            <SelectFilter
              value={filters.statusFilter}
              onChange={(value) => onFilterChange('statusFilter', value)}
              options={statusOptions}
              label="Status"
              className="w-42"
            />
          </div>

          <div className="text-sm font-medium self-center">
            {hasActiveFilters ? (
              <span className="text-blue-600">
                {filteredRows.toLocaleString()} of {totalRows.toLocaleString()}{' '}
                rows
              </span>
            ) : (
              <span className="text-gray-600">
                {totalRows.toLocaleString()} total rows
              </span>
            )}
          </div>
        </div>

        {/* Filter Pills Row */}
        {hasActiveFilters && (
          <FilterPills
            filters={filters}
            onFilterChange={onFilterChange}
            onClearAll={onClearFilters}
            className="pt-2 border-t border-gray-200"
          />
        )}
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
                className="border-red-600 text-red-700 hover:bg-red-50"
                aria-label={`Delete ${selectedCount} selected rows`}
                onClick={handleBulkDelete}
                disabled={isDeleting || selectedCount === 0}
              >
                {isDeleting ? 'Deleting...' : 'Delete Selected'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
