import React from 'react';
import { X } from 'lucide-react';

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
        aria-label={`Remove ${label} filter`}
      >
        <X size={10} />
      </button>
    </div>
  );
};
