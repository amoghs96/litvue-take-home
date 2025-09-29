import React from 'react';

interface SkeletonRowProps {
  className?: string;
}

const SkeletonRow: React.FC<SkeletonRowProps> = ({ className = '' }) => {
  return (
    <div
      className={`flex gap-4 px-6 py-4 border-b border-gray-200 animate-pulse ${className}`}
      role="row"
      aria-label="Loading row"
    >
      {/* Name */}
      <div className="w-64 flex-shrink-0 flex items-center space-x-3">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="min-w-0 flex-1">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>

      {/* Email */}
      <div className="w-64 flex-shrink-0 flex items-center">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>

      {/* Role */}
      <div className="w-32 flex-shrink-0 flex items-center">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </div>

      {/* Status */}
      <div className="w-32 flex-shrink-0 flex items-center">
        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
      </div>

      {/* Score */}
      <div className="w-24 flex-shrink-0 flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div className="h-2 bg-gray-300 rounded-full w-3/4"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-8"></div>
      </div>

      {/* Join Date */}
      <div className="w-32 flex-shrink-0 flex items-center">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

interface SkeletonHeaderProps {
  className?: string;
}

const SkeletonHeader: React.FC<SkeletonHeaderProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-gray-50 border-b px-6 py-4 animate-pulse ${className}`}
      role="banner"
      aria-label="Loading table controls"
    >
      <div className="mb-6 space-y-4">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-6">
            {/* Search filter skeleton */}
            <div className="w-72">
              <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>

            {/* Role filter skeleton */}
            <div className="w-36">
              <div className="h-4 bg-gray-300 rounded w-12 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>

            {/* Status filter skeleton */}
            <div className="w-36">
              <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Clear filters button skeleton */}
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Filter pills area - empty during loading */}
        <div className="h-6"></div>
      </div>

      {/* Stats and bulk select area */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </div>

      {/* Column headers */}
      <div className="flex gap-4 px-6 py-3 mt-4 border-t bg-white">
        <div className="w-64 flex-shrink-0 h-4 bg-gray-300 rounded w-16"></div>
        <div className="w-64 flex-shrink-0 h-4 bg-gray-300 rounded w-12"></div>
        <div className="w-32 flex-shrink-0 h-4 bg-gray-300 rounded w-12"></div>
        <div className="w-32 flex-shrink-0 h-4 bg-gray-300 rounded w-16"></div>
        <div className="w-24 flex-shrink-0 h-4 bg-gray-300 rounded w-12"></div>
        <div className="w-32 flex-shrink-0 h-4 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  );
};

interface SkeletonTableProps {
  height: number;
  rowHeight: number;
  rowCount?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  height,
  rowCount = 10,
}) => {
  const skeletonRows = Array.from({ length: rowCount }, (_, index) => (
    <SkeletonRow key={`skeleton-${index}`} />
  ));

  return (
    <div
      className="border rounded-lg overflow-hidden bg-white shadow-sm"
      role="table"
      aria-label="Loading employee data table"
      aria-busy="true"
    >
      <SkeletonHeader />

      <div
        className="border-t overflow-hidden"
        style={{ height: `${height}px` }}
        role="rowgroup"
        aria-label="Loading table body"
      >
        <div className="relative">
          {skeletonRows}
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 font-medium">Loading data...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
