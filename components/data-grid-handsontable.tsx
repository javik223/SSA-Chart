'use client';

import { useChartStore } from '@/store/useChartStore';
import { getColumnTypeIcon } from '@/utils/dataTypeUtils';
import { searchData, type SearchResult } from '@/utils/searchUtils';
import { HotTable, type HotTableRef } from '@handsontable/react-wrapper';
import type Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import debounce from 'lodash.debounce';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './data-grid-handsontable.css';

registerAllModules();

interface DataGridProps {
  searchQuery?: string;
  shouldNavigate?: boolean;
  onNavigated?: () => void;
}

// Helper function to convert column index to Excel-style letter (outside component)
const getColumnLetter = (index: number): string => {
  let letter = '';
  let num = index;
  while (num >= 0) {
    letter = String.fromCharCode((num % 26) + 65) + letter;
    num = Math.floor(num / 26) - 1;
  }
  return letter;
};

export const DataGrid = memo(function DataGrid({
  searchQuery = '',
  shouldNavigate = false,
  onNavigated,
}: DataGridProps) {
  const { data, setData, columnMapping, autoSetColumns, columnTypes } =
    useChartStore();
  const hasAutoSet = useRef(false);
  const hotRef = useRef<HotTableRef>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const batchUpdateRef = useRef<NodeJS.Timeout | null>(null);

  const rowHeaderFunction = useCallback((row: number) => {
    return `
        <div class="flex items-center justify-center gap-1.5">
          <span class="text-sm text-slate-700 font-mono">${row}</span>
        </div>
      `;
  }, []);

  // Memoize column header function to prevent recreation on every render
  const colHeaderFunction = useCallback(
    (col: number) => {
      const type = columnTypes[col]?.type || 'text';
      const icon = getColumnTypeIcon(type);
      const letter = getColumnLetter(col);

      return `
        <div class="flex items-center justify-center gap-1.5">
          <span class="inline-flex items-center justify-center rounded bg-violet-100 px-1 py-0.5 text-[12px] font-mono font-medium text-slate-500 scale-75" title="${type}">${icon}</span>
          <span class="text-sm text-slate-700 font-mono">${letter}</span>
        </div>
      `;
    },
    [columnTypes]
  );

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    // Auto-set columns on first load
    if (!hasAutoSet.current && data.length > 0) {
      autoSetColumns();
      hasAutoSet.current = true;
    }
  }, [data, autoSetColumns]);

  // Performance-optimized search with batching
  useEffect(() => {
    const performSearch = () => {
      const hotInstance = hotRef.current?.hotInstance;
      if (!hotInstance) return;

      const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');
      if (!hiddenRowsPlugin) return;

      // Calculate data row count (excluding header row 0)
      const dataRowCount = data.length - 1;

      // Use batch operation to minimize renders
      hotInstance.batch(() => {
        if (searchQuery) {
          // Use optimized search function with max 100 results for highlighting
          const results = searchData(data, searchQuery, 100);
          setSearchResults(results);

          // First, show all rows to reset (skip row 0 which is header)
          const allDataRows = Array.from(
            { length: dataRowCount },
            (_, i) => i + 1
          );
          hiddenRowsPlugin.showRows(allDataRows);

          // Find rows that match the search (excluding header row)
          const normalizedQuery = searchQuery.toLowerCase().trim();
          const matchingRows = new Set<number>();

          // Check each data row (starting from index 1 because 0 is header)
          for (let row = 1; row < data.length; row++) {
            const rowData = data[row];
            const hasMatch = rowData?.some(
              (cell: unknown) =>
                cell != null &&
                String(cell).toLowerCase().includes(normalizedQuery)
            );
            if (hasMatch) {
              matchingRows.add(row);
            }
          }

          // Hide rows that don't match (skip row 0)
          const rowsToHide: number[] = [];
          for (let i = 1; i <= dataRowCount; i++) {
            if (!matchingRows.has(i)) {
              rowsToHide.push(i);
            }
          }

          if (rowsToHide.length > 0) {
            hiddenRowsPlugin.hideRows(rowsToHide);
          }
        } else {
          // Clear search and show all rows (skip row 0)
          setSearchResults([]);
          const allDataRows = Array.from(
            { length: dataRowCount },
            (_, i) => i + 1
          );
          // hiddenRowsPlugin.showRows(allDataRows);
        }
      });
    };

    // Small delay to ensure Handsontable is fully initialized
    const timeoutId = setTimeout(performSearch, 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, data]);

  // Performance-optimized re-render when search results change
  useEffect(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (hotInstance) {
      // Batch operations to minimize renders
      hotInstance.batch(() => {
        if (searchResults.length === 0 && !searchQuery) {
          hotInstance.deselectCell();
        }
      });
    }
  }, [searchResults, searchQuery]);

  // Performance-optimized re-render when column mapping changes
  useEffect(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (hotInstance) {
      // Use batch to minimize renders
      hotInstance.batch(() => {
        // Render will be called automatically after batch
      });
    }
  }, [columnMapping]);

  // Handle navigation to first result (only when Enter is pressed)
  useEffect(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (shouldNavigate && hotInstance && searchResults.length > 0) {
      const firstResult = searchResults[0];
      // Navigate to the cell directly
      hotInstance.selectCell(firstResult.row, firstResult.col);
      hotInstance.scrollViewportTo(firstResult.row, firstResult.col);

      // Notify parent that navigation is complete
      onNavigated?.();
    }
  }, [shouldNavigate, onNavigated, searchResults]);

  // Debounced data update to batch rapid changes (Performance optimization)
  const debouncedSetData = useMemo(
    () =>
      debounce((newData: unknown[][]) => {
        setData(newData);
      }, 10),
    [setData]
  );

  // Optimized data change handler with batching
  const handleDataChange = useCallback(
    (
      changes: Handsontable.CellChange[] | null,
      source: Handsontable.ChangeSource
    ) => {
      if (changes && source !== 'loadData') {
        const hotInstance = hotRef.current?.hotInstance;
        if (!hotInstance) return;

        // Use batch operation to minimize renders
        hotInstance.batch(() => {
          const newData = [...data];
          changes.forEach(([row, col, , newValue]) => {
            if (!newData[row]) {
              newData[row] = [];
            }
            newData[row][col as number] = newValue;
          });
          debouncedSetData(newData);
        });
      }
    },
    [data, debouncedSetData]
  );

  // Optimized cells callback with memoization
  const handleCells = useCallback(
    (row: number, col: number) => {
      const cellProperties: Partial<Handsontable.CellProperties> = {};

      // Build className array for better management
      const classNames: string[] = [];

      // Style header row (row 0)
      if (row === 0) {
        classNames.push('htMiddle', 'font-semibold', 'sticky', 'top-0');
        cellProperties.readOnly = false; // Allow editing headers
      }

      // Apply cell styling for column mapping (skip header row)
      if (row > 0) {
        if (col === columnMapping.labels) {
          classNames.push('bg-pink-100');
        } else if (columnMapping.values.includes(col)) {
          classNames.push('bg-purple-100');
        }
      }

      // Check for search highlights
      const isSearchResult = searchResults.some(
        (result) => result.row === row && result.col === col
      );
      if (isSearchResult) {
        classNames.push('bg-yellow-200');
      }

      // Set the final className
      if (classNames.length > 0) {
        cellProperties.className = classNames.join(' ');
      }

      return cellProperties;
    },
    [columnMapping, searchResults]
  );

  return (
    <div className='w-full h-full overflow-hidden'>
      <HotTable
        ref={hotRef}
        themeName='ht-theme-main'
        className='w-full h-full'
        // Performance: Fixed dimensions prevent recalculation
        colWidths={120}
        rowHeights={28}
        // Performance: Disable auto-sizing for faster rendering
        autoRowSize={false}
        autoColumnSize={false}
        // Performance: Optimized viewport rendering (reduced from 100 to 30)
        viewportRowRenderingOffset={100}
        viewportRowRenderingThreshold={'auto'}
        viewportColumnRenderingOffset={100}
        bindRowsWithHeaders={true}
        // Performance: Prevent rendering all rows at once
        renderAllRows={false}
        // Performance: Prevent overflow calculations
        preventOverflow='horizontal'
        // Performance: Enable fragment selection for faster rendering
        fragmentSelection={true}
        // Performance: Disable unnecessary calculations
        autoWrapRow={true}
        autoWrapCol={true}
        allowHtml={false} // Core settings
        data={data}
        rowHeaders={rowHeaderFunction}
        colHeaders={colHeaderFunction}
        height='100%'
        width='100%'
        // Features
        collapsibleColumns={true}
        navigableHeaders={true}
        contextMenu={true}
        // minSpareRows={0}
        // stretchH='all'
        licenseKey='non-commercial-and-evaluation'
        manualColumnResize={true}
        manualRowResize={true}
        manualColumnMove={true}
        manualRowMove={true}
        dropdownMenu={true}
        filters={true}
        multiColumnSorting={true}
        textEllipsis={true}
        wordWrap={true}
        manualColumnFreeze={true}
        loading={true}
        // fixedColumnsLeft={1}
        // fixedRowsTop={1}
        hiddenRows={true}
        tabMoves={{
          col: 1,
          row: 0,
        }}
        selectionMode='multiple'
        trimRows={true}
        // Performance: Pagination for large datasets
        pagination={{
          pageSize: 1000,
        }}
        // Performance: Use memoized callbacks
        beforeColumnSort={() => {
          // Disable sorting to prevent header row from being sorted
          return false;
        }}
        columnSorting={true}
        cells={handleCells}
        afterChange={handleDataChange}
        search={true}
      />
    </div>
  );
});
