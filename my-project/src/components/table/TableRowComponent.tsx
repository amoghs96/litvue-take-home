import React from 'react';
import { TableRow } from '@/types/table';

interface TableRowComponentProps {
  row: TableRow;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
};

const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const getRoleStyles = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'developer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'designer':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'analyst':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'intern':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleStyles(role)}`}
      role="img"
      aria-label={`Role: ${role}`}
    >
      {role}
    </span>
  );
};

const ScoreBar: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className="w-16 bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Score: ${score} out of 100`}
      >
        <div
          className={`h-2 rounded-full ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className="text-sm font-medium text-gray-700 w-8"
        aria-hidden="true"
      >
        {score}
      </span>
    </div>
  );
};

export const TableRowComponent: React.FC<TableRowComponentProps> = ({
  row,
  isSelected,
  onSelect,
}) => {
  const handleSelect = () => {
    onSelect(!isSelected);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      className={`flex gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : ''
      }`}
      role="row"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      aria-label={`Row for ${row.name}`}
      aria-selected={isSelected}
    >
      {/* Name */}
      <div className="w-64 flex-shrink-0 flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
          aria-label={`Select ${row.name}`}
          aria-describedby={`row-${row.id}-info`}
        />
        <div className="min-w-0 flex-1" id={`row-${row.id}-info`}>
          <div
            className="text-sm font-medium text-gray-900 truncate"
            title={row.name}
          >
            {row.name}
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="w-64 flex-shrink-0 flex items-center">
        <span className="text-sm text-gray-700 truncate" title={row.email}>
          {row.email}
        </span>
      </div>

      {/* Role */}
      <div className="w-32 flex-shrink-0 flex items-center">
        <RoleBadge role={row.role} />
      </div>

      {/* Status */}
      <div className="w-32 flex-shrink-0 flex items-center">
        <StatusBadge status={row.status} />
      </div>

      {/* Score */}
      <div className="w-24 flex-shrink-0 flex items-center">
        <ScoreBar score={row.score} />
      </div>

      {/* Join Date */}
      <div className="w-32 flex-shrink-0 flex items-center">
        <span className="text-sm text-gray-500">{row.joinDate}</span>
      </div>
    </div>
  );
};
