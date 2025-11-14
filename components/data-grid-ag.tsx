'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type {
  ColDef,
  GridReadyEvent,
  CellEditingStoppedEvent,
  CellClassParams,
  GridApi,
  IRowNode,
} from 'ag-grid-community';
import { searchData, type SearchResult } from '@/utils/searchUtils';
import { getColumnTypeIcon } from '@/utils/dataTypeUtils';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataGridProps {
  searchQuery?: string;
  shouldNavigate?: boolean;
  onNavigated?: () => void;
}

export function DataGridAG({
  searchQuery = '',
  shouldNavigate = false,
  onNavigated,
}: DataGridProps) {
  const { data, setData, columnMapping, autoSetColumns, columnTypes } =
    useChartStore();
  const hasAutoSet = useRef(false);
  const gridRef = useRef<AgGridReact>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Helper function to convert column index to Excel-style letter
  const getColumnLetter = useCallback((index: number): string => {
    let letter = '';
    let num = index;
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  }, []);

  // Convert array-based data to AG-Grid format
  const rowData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Skip header row (row 0) and convert rest to objects
    return data.slice(1).map((row, rowIndex) => {
      const rowObj: any = {
        _rowIndex: rowIndex + 1, // Store original row index (1-based)
      };
      row.forEach((cell, colIndex) => {
        rowObj[`col_${colIndex}`] = cell;
      });
      return rowObj;
    });
  }, [data]);

  // Create column definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    if (!data || data.length === 0) return [];

    const numCols = data[0]?.length || 0;
    return Array.from({ length: numCols }, (_, colIndex) => {
      const type = columnTypes[colIndex]?.type || 'text';
      const icon = getColumnTypeIcon(type);
      const letter = getColumnLetter(colIndex);
      const headerName = data[0]?.[colIndex] || letter;

      return {
        field: `col_${colIndex}`,
        headerName: headerName,
        editable: true,
        resizable: true,
        sortable: true,
        filter: true,
        width: 120,
        cellEditor: 'agTextCellEditor',
        headerComponentParams: {
          template: `
            <div class="ag-cell-label-container" role="presentation">
              <div class="flex items-center gap-1.5 w-full">
                <span class="inline-flex items-center justify-center rounded bg-violet-100 px-1 py-0.5 text-[12px] font-mono font-medium text-slate-500 scale-75" title="${type}">${icon}</span>
                <span class="ag-header-cell-text text-sm text-slate-700">${letter}</span>
              </div>
            </div>
          `,
        },
        cellClass: (params: CellClassParams) => {
          const classes: string[] = [];
          const rowIndex = params.data._rowIndex;

          // Column mapping styling
          if (colIndex === columnMapping.labels) {
            classes.push('!bg-pink-100');
          } else if (columnMapping.values.includes(colIndex)) {
            classes.push('!bg-purple-100');
          }

          // Search highlighting
          const isSearchResult = searchResults.some(
            (result) => result.row === rowIndex && result.col === colIndex
          );
          if (isSearchResult) {
            classes.push('!bg-yellow-200');
          }

          return classes;
        },
      };
    });
  }, [data, columnTypes, columnMapping, searchResults, getColumnLetter]);

  // Default column definition
  const defaultColDef = useMemo<ColDef>(
    () => ({
      editable: true,
      sortable: true,
      filter: true,
      resizable: true,
      enableCellChangeFlash: true,
    }),
    []
  );

  // Auto-set columns on first load
  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    if (!hasAutoSet.current && data.length > 0) {
      autoSetColumns();
      hasAutoSet.current = true;
    }
  }, [data, autoSetColumns]);

  // Handle search and filtering
  useEffect(() => {
    const gridApi = gridRef.current?.api;
    if (!gridApi) return;

    if (searchQuery) {
      // Perform search
      const results = searchData(data, searchQuery, 100);
      setSearchResults(results);

      // Filter rows based on search
      const normalizedQuery = searchQuery.toLowerCase().trim();

      gridApi.setGridOption('isExternalFilterPresent', () => true);
      gridApi.setGridOption('doesExternalFilterPass', (node: IRowNode) => {
        const rowIndex = node.data._rowIndex;
        const rowData = data[rowIndex];

        if (!rowData) return false;

        return rowData.some(
          (cell: unknown) =>
            cell != null &&
            String(cell).toLowerCase().includes(normalizedQuery)
        );
      });

      gridApi.onFilterChanged();
    } else {
      // Clear search
      setSearchResults([]);
      gridApi.setGridOption('isExternalFilterPresent', () => false);
      gridApi.onFilterChanged();
    }
  }, [searchQuery, data]);

  // Handle navigation to first search result
  useEffect(() => {
    const gridApi = gridRef.current?.api;
    if (shouldNavigate && gridApi && searchResults.length > 0) {
      const firstResult = searchResults[0];

      // Find the node with matching row index
      gridApi.forEachNode((node) => {
        if (node.data._rowIndex === firstResult.row) {
          gridApi.ensureIndexVisible(node.rowIndex || 0);
          gridApi.setFocusedCell(node.rowIndex || 0, `col_${firstResult.col}`);
          gridApi.flashCells({ rowNodes: [node] });
        }
      });

      onNavigated?.();
    }
  }, [shouldNavigate, onNavigated, searchResults]);

  // Handle cell editing
  const onCellEditingStopped = useCallback(
    (event: CellEditingStoppedEvent) => {
      if (!event.colDef.field) return;

      const colIndex = parseInt(event.colDef.field.replace('col_', ''));
      const rowIndex = event.data._rowIndex;
      const newValue = event.newValue;

      // Update data in store
      const newData = [...data];
      if (!newData[rowIndex]) {
        newData[rowIndex] = [];
      }
      newData[rowIndex][colIndex] = newValue;
      setData(newData);
    },
    [data, setData]
  );

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    // Size columns to fit
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="w-full h-full ag-theme-quartz">
      <style jsx global>{`
        .ag-theme-quartz {
          --ag-header-height: 36px;
          --ag-row-height: 28px;
          --ag-font-size: 14px;
          --ag-header-foreground-color: rgb(51, 65, 85);
          --ag-header-background-color: rgb(248, 250, 252);
          --ag-border-color: rgb(226, 232, 240);
        }

        .ag-theme-quartz .ag-header-cell-text {
          font-weight: 600;
        }

        .ag-theme-quartz .ag-cell {
          display: flex;
          align-items: center;
        }

        /* Column mapping backgrounds with higher specificity */
        .ag-theme-quartz .ag-cell.\\!bg-pink-100 {
          background-color: rgb(252, 231, 243) !important;
        }

        .ag-theme-quartz .ag-cell.\\!bg-purple-100 {
          background-color: rgb(243, 232, 255) !important;
        }

        .ag-theme-quartz .ag-cell.\\!bg-yellow-200 {
          background-color: rgb(254, 240, 138) !important;
        }
      `}</style>

      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onGridReady={onGridReady}
        onCellEditingStopped={onCellEditingStopped}
        enableCellTextSelection={true}
        ensureDomOrder={true}
        suppressMenuHide={false}
        enableRangeSelection={true}
        rowSelection="multiple"
        pagination={true}
        paginationPageSize={100}
        paginationPageSizeSelector={[50, 100, 200, 500]}
        suppressRowClickSelection={true}
        domLayout="normal"
      />
    </div>
  );
}

// Export with same name for easy swapping
export { DataGridAG as DataGrid };
