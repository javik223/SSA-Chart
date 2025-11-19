/**
 * Virtual Data Hook for DuckDB Mode
 *
 * Handles loading data with pagination, filtering, and sorting from DuckDB.
 * Only loads the visible portion of data into Zustand for rendering.
 *
 * This hook:
 * 1. Builds SQL queries with LIMIT/OFFSET for pagination
 * 2. Applies WHERE clauses for filtering
 * 3. Applies ORDER BY for sorting
 * 4. Loads only the current page into Zustand
 * 5. Syncs cell edits back to DuckDB
 */

import { useEffect, useCallback, useRef } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { useDuckDB } from './useDuckDB';
import debounce from 'lodash.debounce';

/**
 * Convert BigInt values in data to numbers
 * This prevents serialization errors when persisting to IndexedDB
 */
function convertBigIntToNumber(data: unknown[][]): unknown[][] {
  return data.map(row =>
    row.map(cell => {
      if (typeof cell === 'bigint') {
        // Convert to number if it's within safe integer range
        const num = Number(cell);
        if (Number.isSafeInteger(num)) {
          return num;
        }
        // Otherwise convert to string to preserve precision
        return cell.toString();
      }
      return cell;
    })
  );
}

export function useVirtualData() {
  const setData = useChartStore(state => state.setData);
  const replaceData = useChartStore(state => state.replaceData);
  const setAvailableColumns = useChartStore(state => state.setAvailableColumns);
  const setDataRowCount = useChartStore(state => state.setDataRowCount);
  const setDataColCount = useChartStore(state => state.setDataColCount);

  // Pagination state
  const currentPage = useChartStore(state => state.currentPage);
  const pageSize = useChartStore(state => state.pageSize);

  // Filtering state
  const filterColumn = useChartStore(state => state.filterColumn);
  const filterValue = useChartStore(state => state.filterValue);

  // Sorting state
  const sortColumn = useChartStore(state => state.sortColumn);
  const sortDirection = useChartStore(state => state.sortDirection);

  // Column info
  const availableColumns = useChartStore(state => state.availableColumns);

  const duckdb = useDuckDB();

  // Refs to prevent infinite loops
  const isLoadingRef = useRef(false);
  const isUpdatingRef = useRef(false);

  /**
   * Export full data from DuckDB and persist to Zustand for IndexedDB persistence
   */
  const exportAndPersist = useCallback(async () => {
    try {
      console.log('[VirtualData] Exporting full data for persistence...');
      const fullData = await duckdb.exportData();

      if (!fullData || fullData.length === 0) {
        console.warn('[VirtualData] No data to persist');
        return;
      }

      // Convert BigInt values - exportData already includes headers as first row
      const convertedData = convertBigIntToNumber(fullData);

      console.log('[VirtualData] Sample of data to persist:', {
        headers: convertedData[0],
        firstRow: convertedData[1],
        rowCount: convertedData.length - 1
      });

      // Persist to Zustand (which persists to IndexedDB)
      replaceData(convertedData as unknown[][]);

      console.log(`[VirtualData] ✅ Persisted ${convertedData.length - 1} data rows to Zustand`);
    } catch (error) {
      console.error('[VirtualData] Failed to export and persist data:', error);
    }
  }, [duckdb, replaceData]);

  /**
   * Build SQL query with pagination, filtering, and sorting
   */
  const buildQuery = useCallback(() => {
    let sql = 'SELECT * FROM chart_data';
    const params: unknown[] = [];

    // Add WHERE clause for filtering
    if (filterValue && availableColumns.length > 0) {
      if (filterColumn !== null) {
        // Filter on specific column
        const columnName = availableColumns[filterColumn];
        sql += ` WHERE "${columnName}" LIKE '%${filterValue.replace(/'/g, "''")}%'`;
      } else {
        // Search across all columns
        const searchConditions = availableColumns.map(col =>
          `CAST("${col}" AS VARCHAR) LIKE '%${filterValue.replace(/'/g, "''")}%'`
        ).join(' OR ');
        sql += ` WHERE (${searchConditions})`;
      }
    }

    // Add ORDER BY clause for sorting
    if (sortColumn !== null && sortDirection && availableColumns.length > 0) {
      const columnName = availableColumns[sortColumn];
      sql += ` ORDER BY "${columnName}" ${sortDirection.toUpperCase()}`;
    }

    // Add LIMIT and OFFSET for pagination
    const offset = currentPage * pageSize;
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;

    return { sql, params };
  }, [filterColumn, filterValue, sortColumn, sortDirection, currentPage, pageSize, availableColumns]);

  /**
   * Load current page of data from DuckDB
   */
  const loadPage = useCallback(async () => {
    if (!duckdb.isInitialized) return;
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;

    try {
      // Get table info first
      const tableInfo = await duckdb.getTableInfo();

      if (!tableInfo.exists || !tableInfo.rowCount) {
        console.log('[VirtualData] No data in DuckDB');
        isLoadingRef.current = false;
        return;
      }

      // Update metadata
      if (tableInfo.columns) {
        const columnNames = tableInfo.columns.map(col => col.name);
        setAvailableColumns(columnNames);
        setDataColCount(tableInfo.columns.length);
      }

      // Get total count (with filter if applicable)
      let countSql = 'SELECT COUNT(*) as count FROM chart_data';
      if (filterValue && availableColumns.length > 0) {
        if (filterColumn !== null) {
          const columnName = availableColumns[filterColumn];
          countSql += ` WHERE "${columnName}" LIKE '%${filterValue.replace(/'/g, "''")}%'`;
        } else {
          // Search across all columns
          const searchConditions = availableColumns.map(col =>
            `CAST("${col}" AS VARCHAR) LIKE '%${filterValue.replace(/'/g, "''")}%'`
          ).join(' OR ');
          countSql += ` WHERE (${searchConditions})`;
        }
      }

      const countResult = await duckdb.query(countSql);
      const totalCount = Number(countResult.rows[0]?.[0] || 0);
      setDataRowCount(totalCount);

      // Build and execute query for current page
      const { sql } = buildQuery();
      console.log(`[VirtualData] Loading page ${currentPage + 1} (${pageSize} rows):`, sql);

      const result = await duckdb.query(sql);

      // Convert BigInt to numbers
      const convertedData = convertBigIntToNumber(result.rows);

      // Add column headers as first row
      const dataWithHeaders = [result.columns, ...convertedData];

      // Update Zustand with just this page
      setData(dataWithHeaders);

      console.log(`[VirtualData] Loaded ${convertedData.length} rows (page ${currentPage + 1}/${Math.ceil(totalCount / pageSize)})`);
    } catch (error) {
      console.error('[VirtualData] Failed to load page:', error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [
    duckdb.isInitialized,
    buildQuery,
    currentPage,
    pageSize,
    filterColumn,
    filterValue,
    availableColumns,
    setData,
    setAvailableColumns,
    setDataRowCount,
    setDataColCount,
    duckdb,
  ]);

  /**
   * Reload data when pagination/filtering/sorting changes
   */
  useEffect(() => {
    if (!duckdb.isInitialized) return;

    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    duckdb.isInitialized,
    currentPage,
    pageSize,
    filterColumn,
    filterValue,
    sortColumn,
    sortDirection,
    // Note: loadPage intentionally excluded to prevent infinite loops
  ]);

  /**
   * Update a cell in DuckDB
   */
  const updateCell = useCallback(async (row: number, col: number, value: unknown) => {
    if (!duckdb.isInitialized) return;

    try {
      // Adjust row index for pagination offset
      const actualRow = currentPage * pageSize + row;

      console.log(`[VirtualData] Updating cell at row ${actualRow}, col ${col}`);
      await duckdb.updateCell(actualRow, col, value);

      // Export and persist for single cell edits
      await exportAndPersist();
    } catch (error) {
      console.error('[VirtualData] Failed to update cell:', error);
      throw error;
    }
  }, [duckdb, currentPage, pageSize, exportAndPersist]);

  /**
   * Update multiple cells and persist (for batch operations like fill)
   */
  const updateCellsAndPersist = useCallback(async (updates: Array<{row: number, col: number, value: unknown}>) => {
    if (!duckdb.isInitialized) return;

    try {
      // Execute all updates
      for (const { row, col, value } of updates) {
        const actualRow = currentPage * pageSize + row;
        await duckdb.updateCell(actualRow, col, value);
      }

      // Export and persist full data for IndexedDB after all updates
      await exportAndPersist();
    } catch (error) {
      console.error('[VirtualData] Failed to update cells:', error);
      throw error;
    }
  }, [duckdb, currentPage, pageSize, exportAndPersist]);

  /**
   * Delete rows from DuckDB
   */
  const deleteRows = useCallback(async (rowIndices: number[]) => {
    if (!duckdb.isInitialized) return;

    try {
      // Adjust row indices for pagination offset
      const actualIndices = rowIndices.map(idx => currentPage * pageSize + idx);

      console.log(`[VirtualData] Deleting rows:`, actualIndices);
      await duckdb.deleteRows(actualIndices);

      // Export and persist full data for IndexedDB
      await exportAndPersist();

      // Reload current page
      await loadPage();
    } catch (error) {
      console.error('[VirtualData] Failed to delete rows:', error);
      throw error;
    }
  }, [duckdb, currentPage, pageSize, loadPage, exportAndPersist]);

  /**
   * Insert new rows into DuckDB
   */
  const insertRows = useCallback(async (rows: unknown[][]) => {
    if (!duckdb.isInitialized) return;

    try {
      console.log(`[VirtualData] Inserting ${rows.length} rows`);
      await duckdb.insertRows(rows);

      // Export and persist full data for IndexedDB
      await exportAndPersist();

      // Reload current page
      await loadPage();
    } catch (error) {
      console.error('[VirtualData] Failed to insert rows:', error);
      throw error;
    }
  }, [duckdb, loadPage, exportAndPersist]);

  /**
   * Sync current Zustand data to DuckDB (for column operations)
   */
  const syncToDuckDB = useCallback(async (data: unknown[][]) => {
    if (!duckdb.isInitialized) return;

    try {
      console.log('[VirtualData] Syncing data to DuckDB...');
      await duckdb.loadData(data);

      // Update metadata
      const updatedInfo = await duckdb.getTableInfo();
      if (updatedInfo.columns) {
        const columnNames = updatedInfo.columns.map(col => col.name);
        setAvailableColumns(columnNames);
        setDataColCount(updatedInfo.columns.length);
      }
      if (updatedInfo.rowCount) {
        setDataRowCount(updatedInfo.rowCount);
      }

      console.log('[VirtualData] ✅ Synced data to DuckDB');
    } catch (error) {
      console.error('[VirtualData] Failed to sync to DuckDB:', error);
      throw error;
    }
  }, [duckdb, setAvailableColumns, setDataColCount, setDataRowCount]);

  return {
    isReady: duckdb.isInitialized,
    isLoading: duckdb.isLoading,
    error: duckdb.error,
    loadPage,
    updateCell,
    updateCellsAndPersist,
    deleteRows,
    insertRows,
    syncToDuckDB,
  };
}
