/**
 * Data Sync Hook - Bidirectional Sync
 *
 * Handles synchronization between Zustand (persisted to IndexedDB) and DuckDB (in-memory).
 *
 * This hook:
 * 1. On page load: Loads persisted data from Zustand into DuckDB
 * 2. On data upload: Syncs new data to both Zustand (for persistence) and DuckDB (for operations)
 * 3. Does nothing when in Standard mode (Zustand-only)
 *
 * Note: Zustand handles persistence to IndexedDB. DuckDB is in-memory only.
 */

import { useEffect, useRef } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { useDuckDB } from './useDuckDB';

export function useDataSync() {
  const data = useChartStore(state => state.data);
  const setAvailableColumns = useChartStore(state => state.setAvailableColumns);
  const setDataRowCount = useChartStore(state => state.setDataRowCount);
  const setDataColCount = useChartStore(state => state.setDataColCount);

  const duckdb = useDuckDB();
  const hasLoadedIntoDuckDB = useRef(false);
  const lastDataLength = useRef(0);

  // Load persisted data from Zustand into DuckDB on startup
  useEffect(() => {
    if (!duckdb.isInitialized) return;
    if (hasLoadedIntoDuckDB.current) return;

    const loadIntoDuckDB = async () => {
      try {
        // Check if DuckDB already has data
        const tableInfo = await duckdb.getTableInfo();

        if (tableInfo.exists && tableInfo.rowCount && tableInfo.rowCount > 0) {
          console.log(`[DataSync] DuckDB already has ${tableInfo.rowCount} rows`);
          hasLoadedIntoDuckDB.current = true;
          lastDataLength.current = data.length;

          // Just update metadata
          if (tableInfo.columns) {
            const columnNames = tableInfo.columns.map(col => col.name);
            setAvailableColumns(columnNames);
            setDataColCount(tableInfo.columns.length);
          }
          setDataRowCount(tableInfo.rowCount);
          return;
        }

        // If DuckDB is empty but Zustand has persisted data, load it
        if (data.length > 0) {
          console.log(`[DataSync] Loading ${data.length} rows from Zustand into DuckDB...`);
          await duckdb.loadData(data);
          hasLoadedIntoDuckDB.current = true;
          lastDataLength.current = data.length;

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

          console.log(`[DataSync] ✅ Loaded ${data.length} rows into DuckDB`);
        } else {
          console.log('[DataSync] No data to load into DuckDB');
          hasLoadedIntoDuckDB.current = true;
        }
      } catch (error) {
        console.error('[DataSync] Failed to load data into DuckDB:', error);
      }
    };

    loadIntoDuckDB();
  }, [duckdb.isInitialized, data, duckdb, setAvailableColumns, setDataColCount, setDataRowCount]);

  // When new data is uploaded (data array changes significantly), reload into DuckDB
  useEffect(() => {
    if (!duckdb.isInitialized) return;
    if (!hasLoadedIntoDuckDB.current) return;

    // Detect if data was replaced (significant change in length or first load after initial)
    const dataWasReplaced = Math.abs(data.length - lastDataLength.current) > 10;

    if (!dataWasReplaced) {
      lastDataLength.current = data.length;
      return;
    }

    const reloadIntoDuckDB = async () => {
      try {
        console.log(`[DataSync] Data changed significantly (${lastDataLength.current} -> ${data.length}), reloading into DuckDB...`);

        await duckdb.loadData(data);
        lastDataLength.current = data.length;

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

        console.log(`[DataSync] ✅ Reloaded ${data.length} rows into DuckDB`);
      } catch (error) {
        console.error('[DataSync] Failed to reload data into DuckDB:', error);
      }
    };

    reloadIntoDuckDB();
  }, [duckdb.isInitialized, data, duckdb, setAvailableColumns, setDataColCount, setDataRowCount]);
}
