import React, { useState, useMemo, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Search, X } from 'lucide-react';

interface TextFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  debounceMs?: number;
  className?: string;
}

export const TextFilter: React.FC<TextFilterProps> = ({
  value,
  onChange,
  placeholder = 'Filter...',
  label = 'Filter',
  debounceMs = 300,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create debounced onChange function
  const debouncedOnChange = useMemo(
    () =>
      debounce((newValue: string) => {
        onChange(newValue);
      }, debounceMs),
    [onChange, debounceMs]
  );

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor="text-filter" className="sr-only">
        {label}
      </label>

      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />

        {/* Input Field */}
        <input
          ref={inputRef}
          id="text-filter"
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-10 w-full pl-9 pr-10 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label={label}
          aria-describedby={localValue ? 'filter-clear-btn' : undefined}
        />

        {/* Clear Button */}
        {localValue && (
          <button
            id="filter-clear-btn"
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            aria-label="Clear filter"
            tabIndex={0}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Screen reader feedback */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {localValue ? `Filtering by: ${localValue}` : 'No filter applied'}
      </div>
    </div>
  );
};
