import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';

interface RangeFilterProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  className?: string;
  debounceMs?: number;
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className = '',
  debounceMs = 300,
}) => {
  const [localMinValue, setLocalMinValue] = useState(minValue.toString());
  const [localMaxValue, setLocalMaxValue] = useState(maxValue.toString());

  const debouncedMinChange = useMemo(
    () =>
      debounce((value: number) => {
        onMinChange(value);
      }, debounceMs),
    [onMinChange, debounceMs]
  );

  const debouncedMaxChange = useMemo(
    () =>
      debounce((value: number) => {
        onMaxChange(value);
      }, debounceMs),
    [onMaxChange, debounceMs]
  );

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalMinValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      debouncedMinChange(numValue);
    }
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalMaxValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      debouncedMaxChange(numValue);
    }
  };

  const handleReset = () => {
    setLocalMinValue(min.toString());
    setLocalMaxValue(max.toString());
    onMinChange(min);
    onMaxChange(max);
  };

  const isFiltered = minValue !== min || maxValue !== max;

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
          {label}
        </label>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
            aria-label={`Reset ${label.toLowerCase()} filter`}
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <label htmlFor={`${label}-min`} className="sr-only">
            Minimum {label.toLowerCase()}
          </label>
          <input
            id={`${label}-min`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={localMinValue}
            onChange={handleMinChange}
            placeholder="Min"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label={`Minimum ${label.toLowerCase()}`}
          />
        </div>

        <span className="text-gray-500 text-sm">to</span>

        <div className="flex-1">
          <label htmlFor={`${label}-max`} className="sr-only">
            Maximum {label.toLowerCase()}
          </label>
          <input
            id={`${label}-max`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={localMaxValue}
            onChange={handleMaxChange}
            placeholder="Max"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label={`Maximum ${label.toLowerCase()}`}
          />
        </div>
      </div>

      {/* Visual range indicator */}
      <div className="text-xs text-gray-500 text-center">
        {minValue === min && maxValue === max
          ? `All scores (${min}-${max})`
          : `${minValue}-${maxValue}`}
      </div>

      {/* Screen reader feedback */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isFiltered
          ? `Filtering ${label.toLowerCase()} from ${minValue} to ${maxValue}`
          : `No ${label.toLowerCase()} filter applied`}
      </div>
    </div>
  );
};
