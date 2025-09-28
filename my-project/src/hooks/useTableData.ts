import { useState, useEffect, useCallback, useMemo } from 'react';
import { TableRow, FilterState } from '@/types/table';
import { fetchMockData } from '@/utils/mockApi';

const initialFilters: FilterState = {
  nameFilter: '',
  roleFilter: '',
  statusFilter: '',
  scoreMin: 0,
  scoreMax: 100,
};

export const useTableData = (initialCount: number = 50) => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const mockData = await fetchMockData(initialCount);
        setData(mockData);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [initialCount]);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!data.length) return [];

    return data.filter((row) => {
      if (filters.nameFilter) {
        const nameMatch = row.name
          .toLowerCase()
          .includes(filters.nameFilter.toLowerCase());
        if (!nameMatch) return false;
      }

      if (filters.roleFilter && row.role !== filters.roleFilter) {
        return false;
      }

      if (filters.statusFilter && row.status !== filters.statusFilter) {
        return false;
      }

      if (row.score < filters.scoreMin || row.score > filters.scoreMax) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

  const handleRowSelect = useCallback((id: string, selected: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }, []);

  const handleBulkSelect = useCallback(
    (selected: boolean) => {
      if (selected) {
        setSelectedRows(new Set(filteredData.map((row) => row.id)));
      } else {
        setSelectedRows(new Set());
      }
    },
    [filteredData]
  );

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Clear selection when filters change
      setSelectedRows(new Set());
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSelectedRows(new Set());
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.nameFilter !== '' ||
      filters.roleFilter !== '' ||
      filters.statusFilter !== '' ||
      filters.scoreMin !== 0 ||
      filters.scoreMax !== 100
    );
  }, [filters]);

  return {
    data: filteredData,
    allData: data,
    loading,
    error,
    selectedRows,
    filters,
    totalCount: data.length,
    filteredCount: filteredData.length,
    hasActiveFilters,
    handleRowSelect,
    handleBulkSelect,
    clearSelection,
    updateFilter,
    clearFilters,
  };
};
