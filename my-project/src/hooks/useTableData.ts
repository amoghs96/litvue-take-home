import { useState, useEffect, useCallback, useMemo } from 'react';
import { TableRow, FilterState, Status } from '@/types/table';
import {
  fetchMockData,
  deleteRecord,
  updateRecordStatus,
  updateRecordScore,
  bulkDeleteRecords,
} from '@/utils/mockApi';

const initialFilters: FilterState = {
  nameFilter: '',
  roleFilter: '',
  statusFilter: '',
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
      filters.statusFilter !== ''
    );
  }, [filters]);

  // Mutation functions
  const handleDeleteRecord = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteRecord(id);
        setData((prevData) => prevData.filter((row) => row.id !== id));
        setSelectedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        return true;
      } catch (err) {
        console.error('Failed to delete record:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to delete record'
        );
        return false;
      }
    },
    []
  );

  const handleUpdateStatus = useCallback(
    async (id: string, status: Status): Promise<boolean> => {
      try {
        const response = await updateRecordStatus(id, status);
        if (response.success) {
          setData((prevData) =>
            prevData.map((row) => (row.id === id ? { ...row, status } : row))
          );
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to update status:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to update status'
        );
        return false;
      }
    },
    []
  );

  const handleUpdateScore = useCallback(
    async (id: string, score: number): Promise<boolean> => {
      try {
        const response = await updateRecordScore(id, score);
        if (response.success) {
          setData((prevData) =>
            prevData.map((row) => (row.id === id ? { ...row, score } : row))
          );
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to update score:', err);
        setError(err instanceof Error ? err.message : 'Failed to update score');
        return false;
      }
    },
    []
  );

  const handleBulkDelete = useCallback(
    async (
      ids: string[]
    ): Promise<{
      success: boolean;
      deletedCount: number;
      failedCount: number;
    }> => {
      try {
        const response = await bulkDeleteRecords(ids);
        if (response.success) {
          // Remove successfully deleted records from data
          setData((prevData) =>
            prevData.filter((row) => !response.deletedIds.includes(row.id))
          );

          // Remove deleted records from selection
          setSelectedRows((prev) => {
            const newSet = new Set(prev);
            response.deletedIds.forEach((id) => newSet.delete(id));
            return newSet;
          });

          return {
            success: true,
            deletedCount: response.deletedIds.length,
            failedCount: response.failedIds.length,
          };
        }
        return { success: false, deletedCount: 0, failedCount: ids.length };
      } catch (err) {
        console.error('Failed to bulk delete records:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to delete records'
        );
        return { success: false, deletedCount: 0, failedCount: ids.length };
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
    handleDeleteRecord,
    handleUpdateStatus,
    handleUpdateScore,
    handleBulkDelete,
    clearError,
  };
};
