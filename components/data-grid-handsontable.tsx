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

export const DataGrid = memo(function DataGrid({
  searchQuery = '',
  shouldNavigate = false,
  onNavigated,
}: DataGridProps) {
  const data = useChartStore((state) => state.data);
  const setData = useChartStore((state) => state.setData);
  const columnMapping = useChartStore((state) => state.columnMapping);
  const autoSetColumns = useChartStore((state) => state.autoSetColumns);
  const columnTypes = useChartStore((state) => state.columnTypes);

  const hasAutoSet = useRef(false);
  const hotRef = useRef<HotTableRef | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // --- Header logic: detect if first row looks like a header row in your data.
  // If so, extract it and pass the rest of the rows to Handsontable.
  const { hotData, colHeaderRenderer } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        hotData: data,
        colHeaderRenderer: null as null | ((col: number) => string),
      };
    }

    const firstRow = data[0];
    const isHeaderRow =
      Array.isArray(firstRow) &&
      firstRow.length > 0 &&
      firstRow.every((cell) => typeof cell === 'string');

    if (isHeaderRow) {
      // Use the first row as header labels while still showing your icon + type string
      const headerLabels = firstRow as string[];
      const renderer = (col: number) => {
        const label = headerLabels[col] ?? '';
        const type = columnTypes[col]?.type || 'text';
        const icon = getColumnTypeIcon(type);
        const letter = getColumnLetter(col);
        // return HTML — allowHtml must be true in HotTable
        return `
          <div class="flex gap-1.5 w-full justify-start -ml-5 text-ellipsis ">
            <div class="rounded bg-violet-100 px-1 py-0.5 text-[13px] font-mono font-medium text-slate-500 scale-75" title="${type}">${icon}</div>
            <span class="text-sm text-slate-700 font-bold">${
              label || letter
            }</span>
          </div>
        `;
      };
      return { hotData: data.slice(1), colHeaderRenderer: renderer };
    } else {
      // No header row detected — use default column header renderer (letters + icon)
      const renderer = (col: number) => {
        const type = columnTypes[col]?.type || 'text';
        const icon = getColumnTypeIcon(type);
        const letter = getColumnLetter(col);
        return `
          <div class="flex items-center justify-center gap-1.5">
            <span class="inline-flex items-center justify-center rounded bg-violet-100 px-1 py-0.5 text-[12px] font-mono font-medium text-slate-500 scale-75" title="${type}">${icon}</span>
            <span class="text-sm text-slate-700 font-mono">${letter}</span>
          </div>
        `;
      };
      return { hotData: data, colHeaderRenderer: renderer };
    }
  }, [data, columnTypes]);

  // Row header uses HTML (allowHtml true)
  const rowHeaderFunction = useCallback((row: number) => {
    return `
        <div class="flex items-center justify-center gap-1.5">
          <span class="text-sm text-slate-700 font-mono">${row}</span>
        </div>
      `;
  }, []);

  // Small optimization: convert searchResults to a Set for O(1) cell lookup
  const searchResultSet = useMemo(() => {
    const s = new Set<string>();
    for (const r of searchResults) {
      s.add(`${r.row}:${r.col}`);
    }
    return s;
  }, [searchResults]);

  // --- Perform the custom search & hide non-matching rows (uses hiddenRows plugin safely)
  useEffect(() => {
    const performSearch = () => {
              const hotInstance: Handsontable = hotRef.current?.hotInstance;      if (!hotInstance) return;

      const hiddenRowsPlugin = hotInstance.getPlugin?.('hiddenRows');
      // if plugin not available, bail out (we configured plugin in props, so it should be there)
      if (!hiddenRowsPlugin) return;

      // data passed to handsontable (hotData) may not include the original header row, adjust indices accordingly
      // we assume hotData is the data the table is rendering (no header row)
      const tableData = hotInstance.getData() as unknown[][];
      const rowCount = Array.isArray(tableData) ? tableData.length : 0;

      hotInstance.batch(() => {
        if (searchQuery) {
          const results = searchData(data, searchQuery, 100);
          setSearchResults(results);

          // show all rows first
          const allRows = Array.from({ length: rowCount }, (_, i) => i);
          hiddenRowsPlugin.showRows(allRows);

          const normalizedQuery = searchQuery.toLowerCase().trim();
          const matchingRows = new Set<number>();

          // scan tableData (which corresponds to rendered rows)
          for (let row = 0; row < tableData.length; row++) {
            const rowData = tableData[row];
            const hasMatch =
              Array.isArray(rowData) &&
              rowData.some(
                (cell) =>
                  cell != null &&
                  String(cell).toLowerCase().includes(normalizedQuery)
              );
            if (hasMatch) {
              matchingRows.add(row);
            }
          }

          // hide rows that are not matching
          const rowsToHide: number[] = [];
          for (let i = 0; i < rowCount; i++) {
            if (!matchingRows.has(i)) rowsToHide.push(i);
          }
          if (rowsToHide.length > 0) hiddenRowsPlugin.hideRows(rowsToHide);
        } else {
          // clear search
          setSearchResults([]);
          // show all rows
          const allRows = Array.from({ length: rowCount }, (_, i) => i);
          hiddenRowsPlugin.showRows(allRows);
        }
      });
    };

    // schedule after next tick to ensure hotInstance is present
    const id = setTimeout(performSearch, 0);
    return () => clearTimeout(id);
    // note: include `data` in deps because searchData uses it
  }, [searchQuery, data, hotData]);

  // When search results change, deselect if nothing to navigate to
  useEffect(() => {
            const hotInstance: Handsontable = hotRef.current?.hotInstance;    if (hotInstance) {
      hotInstance.batch(() => {
        if (searchResults.length === 0 && !searchQuery) {
          hotInstance.deselectCell?.();
        }
      });
    }
  }, [searchResults, searchQuery]);

  // Keep a debounced setter but ensure cleanup on unmount
  const debouncedSetData = useMemo(
    () =>
      debounce((newData: unknown[][]) => {
        setData(newData as string[][]);
      }, 36),
    [setData]
  );

  useEffect(() => {
    return () => {
      // cancel any pending debounced calls on unmount
      debouncedSetData.cancel();
    };
  }, [debouncedSetData]);

  // Data change handler - read full table data and update store debounced
  const handleDataChange = useCallback(
    (changes: Handsontable.CellChange[] | null) => {
      if (!changes) return;
              const hotInstance: Handsontable = hotRef.current?.hotInstance;      if (!hotInstance) return;

      hotInstance.batch(() => {
        const newData = hotInstance.getData();
        debouncedSetData(newData);
      });
    },
    [debouncedSetData]
  );

  // after rows removed — sync immediately (non-debounced)
  const handleAfterRowRemove = useCallback(() => {
            const hotInstance: Handsontable = hotRef.current?.hotInstance;    if (!hotInstance) return;
    const currentHandsontableData = hotInstance.getData();
    setData(currentHandsontableData);
  }, [setData]);

  const updateData = useCallback(() => {
            const hotInstance: Handsontable = hotRef.current?.hotInstance;    if (!hotInstance) return;
    hotInstance.batch(() => {
      const newData = hotInstance.getData();
      setData(newData);
    });
  }, [setData]);

  // Optimize cells callback: avoid expensive .some(...) calls by using a Set lookup
  const handleCells = useCallback(
    (row: number, col: number) => {
      const cellProperties: Partial<Handsontable.CellProperties> = {};
      const classNames: string[] = [];

      // header styling: HOT's header is separate; rows shown here are table rows
      // if you still want a visual sticky header inside the data, you can add rules; by default we don't treat row 0 as header
      // apply mapping colors for data rows only
      if (row >= 0) {
        if (col === columnMapping.labels) {
          classNames.push('bg-pink-100');
        } else if (columnMapping.values.includes(col)) {
          classNames.push('bg-purple-100');
        }
      }

      // Highlight search results using Set
      if (searchResultSet.has(`${row}:${col}`)) {
        classNames.push('bg-yellow-200');
      }

      if (classNames.length > 0) {
        cellProperties.className = classNames.join(' ');
      }

      return cellProperties;
    },
    [columnMapping, searchResultSet]
  );

  // Navigate to first result when requested (note: hotData indices are used)
  useEffect(() => {
            const hotInstance: Handsontable = hotRef.current?.hotInstance;    if (shouldNavigate && hotInstance && searchResults.length > 0) {
      const first = searchResults[0];
      // If original data had a header row, the plugin sees rows shifted by -1; we used hotData = data.slice(1) earlier,
      // but `searchData` returned positions relative to full original `data`. Adjust if needed:
      // Detect if we removed header row
      const headerWasPresent =
        Array.isArray(data) &&
        data.length > 0 &&
        data[0].every?.((c: unknown) => typeof c === 'string');
      const targetRow = headerWasPresent ? first.row - 1 : first.row;
      hotInstance.selectCell(targetRow, first.col);
      hotInstance.scrollViewportTo(targetRow, first.col);
      onNavigated?.();
    }
  }, [shouldNavigate, onNavigated, searchResults, data, hotData]);

  const handleAfterColumnRemove = useCallback(
    (index: number, amount: number) => {
      // 1. Update data (remove column from each row)
      const newData = data.map((row) =>
        row.filter(
          (_, colIndex) => !(colIndex >= index && colIndex < index + amount)
        )
      );

      // 2. Push updates - setData will handle columnTypes and columnMapping
      setData(newData, { index, count: amount });
    },
    [data, setData]
  );

  // ----- HotTable props: cleaned / fixed -----
  return (
    <div className='w-full h-full overflow-hidden'>
      <HotTable
        ref={hotRef}
        themeName='ht-theme-main'
        className='w-full h-full'
        // data (hotData excludes header row if we extracted it)
        data={hotData}
        // Allow HTML in headers because our header renderers output HTML
        allowHtml={true}
        // Row headers (we keep a small formatted row header)
        rowHeaders={rowHeaderFunction}
        // Column headers: either function based on detected header row or default renderer
        colHeaders={colHeaderRenderer ?? undefined}
        // layout / performance
        colWidths={120}
        rowHeights={28}
        autoRowSize={false}
        autoColumnSize={false}
        // reasonable viewport offsets to avoid rendering too many rows
        viewportRowRenderingOffset={30}
        viewportColumnRenderingOffset={10}
        bindRowsWithHeaders={true}
        renderAllRows={false}
        preventOverflow='horizontal'
        // standard selection settings
        selectionMode='multiple'
        // features & plugins — avoid conflicting built-in search since we do our own
        contextMenu={true}
        collapsibleColumns={true}
        navigableHeaders={true}
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
        // correct hiddenRows config (object)
        hiddenRows={{ indicators: false }}
        // tab navigation
        tabMoves={{ col: 1, row: 0 }}
        trimRows={false}
        // removed: search={true} (conflicts with custom search)
        columnSorting={true}
        cells={handleCells}
        afterChange={handleDataChange}
        afterRemoveRow={handleAfterRowRemove}
        afterColumnMove={updateData}
        beforeColumnSort={() => false}
        afterColumnSort={updateData}
        afterRowMove={updateData}
        licenseKey='non-commercial-and-evaluation'
        afterRemoveCol={handleAfterColumnRemove}
        pagination={true}
      />
    </div>
  );
});
