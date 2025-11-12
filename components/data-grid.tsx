'use client';

import { useEffect, useRef, useState } from 'react';
import { useChartStore } from '@/store/useChartStore';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import type Handsontable from 'handsontable/base';
import { HotTable, type HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import {
  searchData,
  getCellClassName,
  type SearchResult,
} from '@/utils/searchUtils';
import { getColumnTypeIcon } from '@/utils/dataTypeUtils';

registerAllModules();

interface DataGridProps {
  searchQuery?: string;
  shouldNavigate?: boolean;
  onNavigated?: () => void;
}

export function DataGrid({
  searchQuery = '',
  shouldNavigate = false,
  onNavigated,
}: DataGridProps) {
  const { data, setData, columnMapping, autoSetColumns, columnTypes } =
    useChartStore();
  const hasAutoSet = useRef(false);
  const hotRef = useRef<HotTableRef>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Create column headers with letters and type indicators
  const colHeaderFunction = (col: number) => {
    // Helper function to convert column index to Excel-style letter
    const getColumnLetter = (index: number): string => {
      let letter = '';
      let num = index;
      while (num >= 0) {
        letter = String.fromCharCode((num % 26) + 65) + letter;
        num = Math.floor(num / 26) - 1;
      }
      return letter;
    };

    const type = columnTypes[col]?.type || 'text';
    const icon = getColumnTypeIcon(type);
    const letter = getColumnLetter(col);

    return `
      <div class="flex items-center justify-center gap-1.5">
        <span class="inline-flex items-center justify-center rounded bg-violet-100 px-1 py-0.5 text-[12px] font-mono font-medium text-slate-500 scale-75" title="${type}">${icon}</span>
        <span class="text-sm text-slate-700">${letter}</span>
      </div>
    `;
  };

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

  // Perform search and filter using hiddenRows plugin
  useEffect(() => {
    const performSearch = () => {
      const hotInstance = hotRef.current?.hotInstance;
      if (!hotInstance) return;

      const hiddenRowsPlugin = hotInstance.getPlugin('hiddenRows');
      if (!hiddenRowsPlugin) return;

      // Calculate data row count (excluding header row 0)
      const dataRowCount = data.length - 1;

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
        hotInstance.render();
      } else {
        // Clear search and show all rows (skip row 0)
        setSearchResults([]);
        const allDataRows = Array.from(
          { length: dataRowCount },
          (_, i) => i + 1
        );
        hiddenRowsPlugin.showRows(allDataRows);
        hotInstance.render();
      }
    };

    // Small delay to ensure Handsontable is fully initialized
    const timeoutId = setTimeout(performSearch, 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, data]);

  // Trigger re-render when search results change
  useEffect(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (hotInstance) {
      hotInstance.render();
      if (searchResults.length === 0 && !searchQuery) {
        hotInstance.deselectCell();
      }
    }
  }, [searchResults, searchQuery]);

  // Trigger re-render when column mapping changes
  useEffect(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (hotInstance) {
      hotInstance.render();
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

  const handleDataChange = (
    changes: Handsontable.CellChange[] | null,
    source: Handsontable.ChangeSource
  ) => {
    if (changes && source !== 'loadData') {
      const newData = [...data];
      changes.forEach(([row, col, , newValue]) => {
        // Update directly - row index matches data index now
        if (!newData[row]) {
          newData[row] = [];
        }
        newData[row][col as number] = newValue;
      });
      setData(newData);
    }
  };

  return (
    <HotTable
      ref={hotRef}
      themeName='ht-theme-main'
      className='w-full h-full'
      data={data}
      rowHeaders={true}
      colHeaders={colHeaderFunction}
      height='100%'
      width='100%'
      contextMenu={true}
      minSpareRows={0}
      stretchH='all'
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
      fixedRowsTop={1}
      fixedColumnsStart={1}
      manualColumnFreeze={true}
      hiddenRows={true}
      pagination={true}
      beforeColumnSort={() => {
        // Disable sorting to prevent header row from being sorted
        return false;
      }}
      cells={(row, col) => {
        const cellProperties: Partial<Handsontable.CellProperties> = {};

        // Build className array for better management
        const classNames: string[] = [];

        // Style header row (row 0)
        if (row === 0) {
          classNames.push('htMiddle', 'font-semibold');
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
      }}
      afterChange={handleDataChange}
    />
  );
}
