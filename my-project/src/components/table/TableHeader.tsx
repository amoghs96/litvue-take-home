import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextFilter } from '@/components/filters/TextFilter';
import { SelectFilter } from '@/components/filters/SelectFilter';
import { FilterPills } from '@/components/filters/FilterPills';
import { FilterState } from '@/types/table';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

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
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const handleBulkSelect = () => {
    onBulkSelect?.(!isAllSelected);
  };

  const handleBulkDeleteConfirm = async () => {
    const selectedIds = Array.from(selectedRows);

    setIsDeleting(true);
    try {
      const result = await onBulkDelete(selectedIds);

      if (result.success) {
        if (result.failedCount > 0) {
          toast.warning(
            `Bulk delete completed. ${result.deletedCount} records deleted successfully. ${result.failedCount} records failed to delete.`
          );
        } else {
          toast.success(
            `Successfully deleted ${result.deletedCount} record${result.deletedCount > 1 ? 's' : ''}`
          );
        }
      } else {
        toast.error('Failed to delete selected records. Please try again.');
      }
    } catch {
      toast.error(
        'An error occurred while deleting records. Please try again.'
      );
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
                variant="destructive"
                size="sm"
                aria-label={`Delete ${selectedCount} selected rows`}
                onClick={() => setShowBulkDeleteDialog(true)}
                disabled={isDeleting || selectedCount === 0}
              >
                {isDeleting ? 'Deleting...' : 'Delete Selected'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Delete Selected Records"
        description={`Are you sure you want to delete ${selectedCount} selected record${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleBulkDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};
