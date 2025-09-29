import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label: string;
  className?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  value,
  onChange,
  options,
  placeholder = 'All',
  label,
  className = '',
}) => {
  const handleValueChange = (newValue: string) => {
    // If "all" is selected, pass empty string to clear filter
    onChange(newValue === 'all' ? '' : newValue);
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
        {label}
      </label>

      <Select value={value || 'all'} onValueChange={handleValueChange}>
        <SelectTrigger
          className="w-full bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label={`Filter by ${label.toLowerCase()}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all" className="font-medium">
            All {label}
          </SelectItem>

          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="capitalize"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Screen reader feedback */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {value
          ? `Filtering by ${label.toLowerCase()}: ${options.find((opt) => opt.value === value)?.label || value}`
          : `No ${label.toLowerCase()} filter applied`}
      </div>
    </div>
  );
};
