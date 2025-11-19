'use client';

import { useChartStore } from '@/store/useChartStore';
import { getColumnTypeIcon } from '@/utils/dataTypeUtils';
import { HotTable, type HotTableRef } from '@handsontable/react-wrapper';
import type Handsontable from 'handsontable/base';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import debounce from 'lodash.debounce';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import './data-grid-handsontable.css';

registerAllModules();

interface VirtualDataFunctions {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  loadPage: () => Promise<void>;
  updateCell: (row: number, col: number, value: unknown) => Promise<void>;
  deleteRows: (rowIndices: number[]) => Promise<void>;
  insertRows: (rows: unknown[][]) => Promise<void>;
}

interface DataGridProps {
  searchQuery?: string;
  shouldNavigate?: boolean;
  onNavigated?: () => void;
  virtualData?: VirtualDataFunctions;
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
  virtualData,
}: DataGridProps) {
  const data = useChartStore((state) => state.data);
  const setData = useChartStore((state) => state.setData);
  const columnMapping = useChartStore((state) => state.columnMapping);
  const autoSetColumns = useChartStore((state) => state.autoSetColumns);
  const columnTypes = useChartStore((state) => state.columnTypes);

  // virtualData is always provided (DuckDB mode is always on)

  const hasAutoSet = useRef(false);
  const hotRef = useRef<HotTableRef | null>(null);

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

  // Search is handled via SQL WHERE clause in DuckDB - no client-side search needed

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

  // Data change handler - update cells directly in DuckDB
  const handleDataChange = useCallback(
    (changes: Handsontable.CellChange[] | null) => {
      if (!changes || !virtualData) return;

      // Update individual cells directly in DuckDB
      for (const [row, col, , newValue] of changes) {
        virtualData.updateCell(row as number, col as number, newValue).catch(err => {
          console.error('[DataGrid] Failed to update cell in DuckDB:', err);
        });
      }
    },
    [virtualData]
  );

  // after rows removed — delete rows in DuckDB
  const handleAfterRowRemove = useCallback(
    (index: number, amount: number) => {
      if (!virtualData) return;

      // Delete rows directly in DuckDB
      const indices = Array.from({ length: amount }, (_, i) => index + i);
      virtualData.deleteRows(indices).catch(err => {
        console.error('[DataGrid] Failed to delete rows in DuckDB:', err);
      });
    },
    [virtualData]
  );

  const updateData = useCallback(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (!hotInstance) return;
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

      if (classNames.length > 0) {
        cellProperties.className = classNames.join(' ');
      }

      return cellProperties;
    },
    [columnMapping]
  );

  // Navigate to first row when search requested (search results come from DuckDB)
  useEffect(() => {
    const hotInstance = hotRef.current?.hotInstance;
    if (shouldNavigate && hotInstance && hotData && hotData.length > 0) {
      // Navigate to first row since DuckDB returns only matching rows
      hotInstance.selectCell(0, 0);
      hotInstance.scrollViewportTo(0, 0);
      onNavigated?.();
    }
  }, [shouldNavigate, onNavigated, hotData]);

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
        // removed: columnSorting={true} (conflicts with multiColumnSorting)
        // fixedRowsTop={1} // Treat the first row as a fixed header
        cells={handleCells}
        afterChange={handleDataChange}
        afterRemoveRow={handleAfterRowRemove}
        afterColumnMove={updateData}
        afterColumnSort={updateData} // Keep afterColumnSort to update data after sorting
        afterRowMove={updateData}
        licenseKey='non-commercial-and-evaluation'
        afterRemoveCol={handleAfterColumnRemove}
        pagination={{
          pageSize: 200,
        }}
      />
    </div>
  );
});
