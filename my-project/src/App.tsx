import React from 'react';
import './App.css';
import { VirtualizedTable } from '@/components/table/VirtualizedTable';
import { useTableData } from '@/hooks/useTableData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

const App: React.FC = () => {
  const {
    data,
    loading,
    error,
    selectedRows,
    filters,
    totalCount,
    filteredCount,
    hasActiveFilters,
    handleRowSelect,
    handleBulkSelect,
    updateFilter,
    clearFilters,
    handleDeleteRecord,
    handleUpdateStatus,
    handleUpdateScore,
    handleBulkDelete,
  } = useTableData(100000);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Data</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Employee Data Table - 100K Records
            </CardTitle>
            <p className="text-gray-600">
              Virtualized table displaying 100,000 employee records with bulk
              selection + filters
            </p>
          </CardHeader>
          <CardContent>
            <VirtualizedTable
              data={data}
              height={700}
              rowHeight={72}
              loading={loading}
              selectedRows={selectedRows}
              totalRows={totalCount}
              filteredRows={filteredCount}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              onRowSelect={handleRowSelect}
              onBulkSelect={handleBulkSelect}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
              onDeleteRecord={handleDeleteRecord}
              onUpdateStatus={handleUpdateStatus}
              onUpdateScore={handleUpdateScore}
              onBulkDelete={handleBulkDelete}
            />
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
