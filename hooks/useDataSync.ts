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

import { useEffect, useRef, useCallback } from 'react';
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
  const isSyncing = useRef(false);

  // Load persisted data from Zustand into DuckDB on startup
  useEffect(() => {
    if (!duckdb.isInitialized) return;
    if (hasLoadedIntoDuckDB.current) return;
    if (isSyncing.current) return;

    const loadIntoDuckDB = async () => {
      isSyncing.current = true;

      try {
        // Check if DuckDB already has data
        let tableInfo;
        try {
          tableInfo = await duckdb.getTableInfo();
        } catch {
          // Table doesn't exist yet, that's okay
          tableInfo = { exists: false };
        }

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
          try {
            const updatedInfo = await duckdb.getTableInfo();
            if (updatedInfo.columns) {
              const columnNames = updatedInfo.columns.map(col => col.name);
              setAvailableColumns(columnNames);
              setDataColCount(updatedInfo.columns.length);
            }
            if (updatedInfo.rowCount) {
              setDataRowCount(updatedInfo.rowCount);
            }
          } catch {
            // Metadata update failed, but data was loaded
            console.warn('[DataSync] Failed to get updated table info');
          }

          console.log(`[DataSync] ✅ Loaded ${data.length} rows into DuckDB`);
        } else {
          console.log('[DataSync] No data to load into DuckDB');
          hasLoadedIntoDuckDB.current = true;
        }
      } catch (error) {
        console.error('[DataSync] Failed to load data into DuckDB:', error);
        // Mark as loaded to prevent infinite retries
        hasLoadedIntoDuckDB.current = true;
      } finally {
        isSyncing.current = false;
      }
    };

    loadIntoDuckDB();
  }, [duckdb.isInitialized, data, duckdb, setAvailableColumns, setDataColCount, setDataRowCount]);

  // When new data is uploaded (data array increases significantly), reload into DuckDB
  // Note: Only trigger on increases to avoid overwriting full data with filtered results
  useEffect(() => {
    if (!duckdb.isInitialized) return;
    if (!hasLoadedIntoDuckDB.current) return;
    if (isSyncing.current) return;

    // Only reload if data increased significantly (new upload, not filtered results)
    // When searching, data decreases - we don't want to overwrite DuckDB with filtered data
    const dataIncreased = data.length - lastDataLength.current > 10;

    if (!dataIncreased) {
      // Track the length but don't reload
      // This prevents filtered results from triggering reloads
      if (data.length > lastDataLength.current) {
        lastDataLength.current = data.length;
      }
      return;
    }

    const reloadIntoDuckDB = async () => {
      isSyncing.current = true;

      try {
        console.log(`[DataSync] New data uploaded (${lastDataLength.current} -> ${data.length}), loading into DuckDB...`);

        await duckdb.loadData(data);
        lastDataLength.current = data.length;

        // Update metadata
        try {
          const updatedInfo = await duckdb.getTableInfo();
          if (updatedInfo.columns) {
            const columnNames = updatedInfo.columns.map(col => col.name);
            setAvailableColumns(columnNames);
            setDataColCount(updatedInfo.columns.length);
          }
          if (updatedInfo.rowCount) {
            setDataRowCount(updatedInfo.rowCount);
          }
        } catch {
          console.warn('[DataSync] Failed to get updated table info');
        }

        console.log(`[DataSync] ✅ Loaded ${data.length} rows into DuckDB`);
      } catch (error) {
        console.error('[DataSync] Failed to reload data into DuckDB:', error);
        // Update length to prevent retry loop
        lastDataLength.current = data.length;
      } finally {
        isSyncing.current = false;
      }
    };

    reloadIntoDuckDB();
  }, [duckdb.isInitialized, data, duckdb, setAvailableColumns, setDataColCount, setDataRowCount]);
}
