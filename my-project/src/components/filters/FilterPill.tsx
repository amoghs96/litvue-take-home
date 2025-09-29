import React from 'react';

interface FilterPillProps {
  label: string;
  value: string;
  onRemove: () => void;
  className?: string;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  value,
  onRemove,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 ${className}`}
    >
      <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
        {label}:
      </span>
      <span>{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
