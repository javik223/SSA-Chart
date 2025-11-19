/**
 * Data Adapter Hook
 *
 * Provides a unified interface for data operations that automatically
 * routes to either DuckDB (for large datasets) or Zustand (for smaller datasets)
 * based on the store configuration.
 */

import { useCallback, useEffect } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { useDuckDB } from './useDuckDB';
import { inferAllColumnTypes } from '@/utils/dataTypeUtils';

export interface DataAdapter {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;

  // Core data operations
  loadData: (data: unknown[][]) => Promise<void>;
  getData: (options?: { limit?: number; offset?: number }) => Promise<unknown[][]>;
  updateCell: (row: number, col: number, value: unknown) => Promise<void>;
  deleteRows: (rowIndices: number[]) => Promise<void>;
  deleteColumns: (colIndices: number[]) => Promise<void>;
  insertRows: (rows: unknown[][]) => Promise<void>;

  // Metadata
  getRowCount: () => number;
  getColCount: () => number;
}

/**
 * Hook that provides a unified data interface
 */
export function useDataAdapter(): DataAdapter {
  const isDuckDBMode = useChartStore(state => state.useDuckDB);
  const data = useChartStore(state => state.data);
  const setData = useChartStore(state => state.setData);
  const setAvailableColumns = useChartStore(state => state.setAvailableColumns);
  const setColumnTypes = useChartStore(state => state.setColumnTypes);
  const setDataRowCount = useChartStore(state => state.setDataRowCount);
  const setDataColCount = useChartStore(state => state.setDataColCount);
  const dataRowCount = useChartStore(state => state.dataRowCount);
  const dataColCount = useChartStore(state => state.dataColCount);

  const duckdb = useDuckDB();

  /**
   * Load data into the appropriate storage
   */
  const loadData = useCallback(async (newData: unknown[][]) => {
    if (isDuckDBMode) {
      // Load into DuckDB
      await duckdb.loadData(newData);

      // Update metadata in Zustand
      if (newData.length > 0) {
        const firstRow = newData[0];
        const hasHeader = firstRow.every(cell => typeof cell === 'string');

        const columnNames = hasHeader
          ? firstRow.map((h, i) => String(h || `col_${i}`))
          : Array.from({ length: firstRow.length }, (_, i) => `col_${i}`);

        const types = inferAllColumnTypes(newData);

        setAvailableColumns(columnNames);
        setColumnTypes(types);
        setDataRowCount(hasHeader ? newData.length - 1 : newData.length);
        setDataColCount(columnNames.length);
      }
    } else {
      // Load into Zustand (legacy mode)
      setData(newData);
    }
  }, [isDuckDBMode, duckdb, setData, setAvailableColumns, setColumnTypes, setDataRowCount, setDataColCount]);

  /**
   * Get data from the appropriate storage
   */
  const getData = useCallback(async (options?: { limit?: number; offset?: number }): Promise<unknown[][]> => {
    if (isDuckDBMode) {
      // Query from DuckDB
      const limit = options?.limit;
      const offset = options?.offset || 0;

      let sql = 'SELECT * FROM chart_data';
      if (limit !== undefined) {
        sql += ` LIMIT ${limit} OFFSET ${offset}`;
      }

      const result = await duckdb.query(sql);

      // Add column names as first row
      return [result.columns, ...result.rows];
    } else {
      // Get from Zustand
      if (options?.limit !== undefined) {
        const start = options.offset || 0;
        const end = start + options.limit;
        return data.slice(start, end);
      }
      return data;
    }
  }, [isDuckDBMode, duckdb, data]);

  /**
   * Update a single cell
   */
  const updateCell = useCallback(async (row: number, col: number, value: unknown) => {
    if (isDuckDBMode) {
      await duckdb.updateCell(row, col, value);
    } else {
      // Update in Zustand
      const newData = data.map((r, rowIdx) => {
        if (rowIdx === row) {
          return r.map((c, colIdx) => colIdx === col ? value : c);
        }
        return r;
      });
      setData(newData);
    }
  }, [isDuckDBMode, duckdb, data, setData]);

  /**
   * Delete rows
   */
  const deleteRows = useCallback(async (rowIndices: number[]) => {
    if (isDuckDBMode) {
      await duckdb.deleteRows(rowIndices);

      // Update row count
      const newCount = dataRowCount - rowIndices.length;
      setDataRowCount(newCount);
    } else {
      // Delete from Zustand
      const newData = data.filter((_, idx) => !rowIndices.includes(idx));
      setData(newData);
    }
  }, [isDuckDBMode, duckdb, data, setData, dataRowCount, setDataRowCount]);

  /**
   * Delete columns
   */
  const deleteColumns = useCallback(async (colIndices: number[]) => {
    if (isDuckDBMode) {
      await duckdb.deleteColumns(colIndices);

      // Update metadata
      const tableInfo = await duckdb.getTableInfo();
      if (tableInfo.exists && tableInfo.columns) {
        const columnNames = tableInfo.columns.map(c => c.name);
        setAvailableColumns(columnNames);
        setDataColCount(columnNames.length);

        // Re-infer types for remaining columns
        const fullData = await getData();
        const types = inferAllColumnTypes(fullData);
        setColumnTypes(types);
      }
    } else {
      // Delete from Zustand
      const newData = data.map(row =>
        row.filter((_, colIdx) => !colIndices.includes(colIdx))
      );
      setData(newData, {
        index: Math.min(...colIndices),
        count: colIndices.length
      });
    }
  }, [isDuckDBMode, duckdb, data, setData, setAvailableColumns, setDataColCount, setColumnTypes, getData]);

  /**
   * Insert new rows
   */
  const insertRows = useCallback(async (rows: unknown[][]) => {
    if (isDuckDBMode) {
      await duckdb.insertRows(rows);

      // Update row count
      setDataRowCount(dataRowCount + rows.length);
    } else {
      // Insert into Zustand
      const newData = [...data, ...rows];
      setData(newData);
    }
  }, [isDuckDBMode, duckdb, data, setData, dataRowCount, setDataRowCount]);

  /**
   * Get row count
   */
  const getRowCount = useCallback(() => {
    if (isDuckDBMode) {
      return dataRowCount;
    } else {
      // Count data rows (excluding header if present)
      if (data.length === 0) return 0;
      const hasHeader = data[0].every(cell => typeof cell === 'string');
      return hasHeader ? data.length - 1 : data.length;
    }
  }, [isDuckDBMode, dataRowCount, data]);

  /**
   * Get column count
   */
  const getColCount = useCallback(() => {
    if (isDuckDBMode) {
      return dataColCount;
    } else {
      return data.length > 0 ? data[0].length : 0;
    }
  }, [isDuckDBMode, dataColCount, data]);

  // Initialize DuckDB with existing data when switching modes
  useEffect(() => {
    if (isDuckDBMode && duckdb.isInitialized && data.length > 0) {
      loadData(data).catch(err => {
        console.error('Failed to initialize DuckDB with existing data:', err);
      });
    }
  }, [isDuckDBMode, duckdb.isInitialized]); // Don't include data and loadData to avoid infinite loop

  return {
    isReady: isDuckDBMode ? duckdb.isInitialized : true,
    isLoading: duckdb.isLoading,
    error: duckdb.error,
    loadData,
    getData,
    updateCell,
    deleteRows,
    deleteColumns,
    insertRows,
    getRowCount,
    getColCount,
  };
}
