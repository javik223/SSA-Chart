'use client';

import { useDataAdapter } from '@/hooks/useDataAdapter';
import { useChartStore } from '@/store/useChartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Database, HardDrive, Loader2 } from 'lucide-react';

/**
 * Example component demonstrating DuckDB integration
 *
 * This shows how to:
 * 1. Toggle between Zustand and DuckDB modes
 * 2. Load data using the adapter
 * 3. Query and display data
 * 4. Handle loading and error states
 */
export function DataAdapterExample() {
  const adapter = useDataAdapter();
  const useDuckDB = useChartStore(state => state.useDuckDB);
  const setUseDuckDB = useChartStore(state => state.setUseDuckDB);

  const [displayData, setDisplayData] = useState<unknown[][]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load sample data
  const loadSampleData = async () => {
    setIsLoadingData(true);
    try {
      const sampleData = [
        ['Name', 'Age', 'City', 'Score'],
        ['Alice', 25, 'New York', 95],
        ['Bob', 30, 'San Francisco', 87],
        ['Charlie', 35, 'Chicago', 92],
        ['Diana', 28, 'Boston', 88],
        ['Eve', 32, 'Seattle', 94],
      ];

      await adapter.loadData(sampleData);
      await refreshData();
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Refresh displayed data
  const refreshData = async () => {
    if (!adapter.isReady) return;

    try {
      const data = await adapter.getData({ limit: 10 });
      setDisplayData(data);
    } catch (error) {
      console.error('Failed to get data:', error);
    }
  };

  // Add a new row
  const addRow = async () => {
    try {
      const newRow = [
        `Person ${adapter.getRowCount() + 1}`,
        Math.floor(Math.random() * 40) + 20,
        'New City',
        Math.floor(Math.random() * 100),
      ];

      await adapter.insertRows([newRow]);
      await refreshData();
    } catch (error) {
      console.error('Failed to add row:', error);
    }
  };

  // Update a cell
  const updateRandomCell = async () => {
    try {
      const rowCount = adapter.getRowCount();
      if (rowCount === 0) return;

      const randomRow = Math.floor(Math.random() * rowCount);
      const randomCol = Math.floor(Math.random() * adapter.getColCount());
      const randomValue = Math.floor(Math.random() * 100);

      await adapter.updateCell(randomRow, randomCol, randomValue);
      await refreshData();
    } catch (error) {
      console.error('Failed to update cell:', error);
    }
  };

  // Delete a row
  const deleteLastRow = async () => {
    try {
      const rowCount = adapter.getRowCount();
      if (rowCount === 0) return;

      await adapter.deleteRows([rowCount - 1]);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete row:', error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Adapter Example</CardTitle>
          <CardDescription>
            Demonstrates DuckDB integration with automatic mode switching
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {useDuckDB ? (
                <Database className="h-5 w-5 text-blue-500" />
              ) : (
                <HardDrive className="h-5 w-5 text-gray-500" />
              )}
              <span className="font-medium">
                {useDuckDB ? 'DuckDB Mode' : 'Standard Mode'}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => setUseDuckDB(!useDuckDB)}
              disabled={isLoadingData}
            >
              Switch to {useDuckDB ? 'Standard' : 'DuckDB'}
            </Button>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="flex items-center gap-2 mt-1">
                {adapter.isReady ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium">Ready</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="font-medium">Initializing...</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Data</div>
              <div className="font-medium mt-1">
                {adapter.getRowCount()} rows × {adapter.getColCount()} columns
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={loadSampleData}
              disabled={!adapter.isReady || isLoadingData}
            >
              {isLoadingData ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load Sample Data'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={addRow}
              disabled={!adapter.isReady || adapter.getRowCount() === 0}
            >
              Add Row
            </Button>
            <Button
              variant="outline"
              onClick={updateRandomCell}
              disabled={!adapter.isReady || adapter.getRowCount() === 0}
            >
              Update Random Cell
            </Button>
            <Button
              variant="outline"
              onClick={deleteLastRow}
              disabled={!adapter.isReady || adapter.getRowCount() === 0}
            >
              Delete Last Row
            </Button>
            <Button
              variant="outline"
              onClick={refreshData}
              disabled={!adapter.isReady}
            >
              Refresh
            </Button>
          </div>

          {/* Error Display */}
          {adapter.error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              Error: {adapter.error}
            </div>
          )}

          {/* Data Display */}
          {displayData.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {displayData[0]?.map((header, i) => (
                        <th key={i} className="px-4 py-2 text-left font-medium">
                          {String(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-t hover:bg-muted/50">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2">
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
