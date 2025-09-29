import React from 'react';
import { FilterState } from '@/types/table';
import { FilterPill } from './FilterPill';
import { Button } from '@/components/ui/button';

interface FilterPillsProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onClearAll: () => void;
  className?: string;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  className = '',
}) => {
  const activePills: Array<{
    key: keyof FilterState;
    label: string;
    value: string;
    clearValue: string | number;
  }> = [];

  // Name filter
  if (filters.nameFilter) {
    activePills.push({
      key: 'nameFilter',
      label: 'Name',
      value: filters.nameFilter,
      clearValue: '',
    });
  }

  // Role filter
  if (filters.roleFilter) {
    activePills.push({
      key: 'roleFilter',
      label: 'Role',
      value:
        filters.roleFilter.charAt(0).toUpperCase() +
        filters.roleFilter.slice(1),
      clearValue: '',
    });
  }

  // Status filter
  if (filters.statusFilter) {
    activePills.push({
      key: 'statusFilter',
      label: 'Status',
      value:
        filters.statusFilter.charAt(0).toUpperCase() +
        filters.statusFilter.slice(1),
      clearValue: '',
    });
  }

  if (activePills.length === 0) {
    return null;
  }

  const handleRemovePill = (
    key: keyof FilterState,
    clearValue: string | number
  ) => {
    onFilterChange(key, clearValue);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Active filters:</span>

      {activePills.map((pill) => (
        <FilterPill
          key={pill.key}
          label={pill.label}
          value={pill.value}
          onRemove={() => handleRemovePill(pill.key, pill.clearValue)}
        />
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="ml-2 text-gray-600 hover:text-gray-800 border-gray-300"
      >
        Clear All
      </Button>
    </div>
  );
};
