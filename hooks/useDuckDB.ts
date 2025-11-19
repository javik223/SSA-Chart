/**
 * React Hook for DuckDB Worker
 *
 * Provides a clean interface for React components to interact with
 * DuckDB running in a web worker.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { WorkerMessage, WorkerResponse } from '@/workers/duckdb.worker';

export interface QueryResult {
  rows: unknown[][];
  columns: string[];
  rowCount: number;
}

export interface TableInfo {
  exists: boolean;
  columns?: Array<{ name: string; type: string }>;
  rowCount?: number;
  colCount?: number;
}

export interface UseDuckDBReturn {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  loadData: (data: unknown[][], tableName?: string) => Promise<void>;
  query: (sql: string, params?: unknown[]) => Promise<QueryResult>;
  insertRows: (rows: unknown[][], tableName?: string) => Promise<void>;
  updateCell: (row: number, col: number, value: unknown, tableName?: string) => Promise<void>;
  deleteRows: (rowIndices: number[], tableName?: string) => Promise<void>;
  deleteColumns: (colIndices: number[], tableName?: string) => Promise<void>;
  getTableInfo: (tableName?: string) => Promise<TableInfo>;
  clearTable: (tableName?: string) => Promise<void>;
  exportData: (tableName?: string) => Promise<unknown[][]>;
}

let globalWorker: Worker | null = null;
let initializationPromise: Promise<void> | null = null;
let isGloballyInitialized = false;

// Global pending requests map shared across all hook instances
let globalRequestId = 0;
const globalPendingRequests = new Map<string, {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}>();

/**
 * Custom hook for interacting with DuckDB
 */
export function useDuckDB(): UseDuckDBReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  /**
   * Initialize the DuckDB worker (shared across all hook instances)
   */
  useEffect(() => {
    // If already globally initialized, just reuse
    if (globalWorker && isGloballyInitialized) {
      workerRef.current = globalWorker;
      setIsInitialized(true);
      return;
    }

    // If initialization is in progress, wait for it
    if (initializationPromise) {
      initializationPromise.then(() => {
        if (globalWorker) {
          workerRef.current = globalWorker;
          setIsInitialized(true);
        }
      });
      return;
    }

    const initWorker = async () => {
      try {
        setIsLoading(true);

        // Create worker
        const worker = new Worker(
          new URL('../workers/duckdb.worker.ts', import.meta.url),
          { type: 'module' }
        );

        // Set up message handler
        worker.onmessage = (event: MessageEvent<{ type: string; requestId: string; payload?: unknown; error?: string }>) => {
          const { type, requestId, payload, error: errorMsg } = event.data;

          console.log(`[DuckDB Hook] Received ${type} response (${requestId})`);

          const pending = globalPendingRequests.get(requestId);
          if (!pending) {
            console.warn(`[DuckDB Hook] No pending request for ${requestId}`);
            return;
          }

          globalPendingRequests.delete(requestId);

          if (type === 'SUCCESS') {
            pending.resolve(payload);
          } else {
            pending.reject(new Error(errorMsg || 'Unknown error'));
          }
        };

        worker.onerror = (error) => {
          console.error('Worker error:', error);
          setError(`Worker error: ${error.message}`);
        };

        workerRef.current = worker;
        globalWorker = worker;

        // Initialize DuckDB using global pending requests
        const requestId = `req_${++globalRequestId}`;
        const initPromise = new Promise((resolve, reject) => {
          globalPendingRequests.set(requestId, { resolve, reject });

          setTimeout(() => {
            if (globalPendingRequests.has(requestId)) {
              globalPendingRequests.delete(requestId);
              reject(new Error('Init timeout'));
            }
          }, 30000);
        });

        worker.postMessage({ type: 'INIT', requestId });
        await initPromise;

        isGloballyInitialized = true;
        setIsInitialized(true);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        console.error('Failed to initialize DuckDB:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Ensure only one initialization happens
    if (!initializationPromise) {
      initializationPromise = initWorker();
    }

    return () => {
      // Don't terminate the worker on unmount since it's shared
      // Only terminate when the app is closed
    };
  }, []);

  /**
   * Send a message to the worker and wait for response
   */
  const sendMessage = useCallback(<T = unknown>(
    message: { type: string; payload?: unknown }
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      const requestId = `req_${++globalRequestId}`;

      console.log(`[DuckDB Hook] Sending ${message.type} request (${requestId})`);

      globalPendingRequests.set(requestId, {
        resolve: resolve as (value: unknown) => void,
        reject
      });

      workerRef.current.postMessage({
        ...message,
        requestId
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (globalPendingRequests.has(requestId)) {
          globalPendingRequests.delete(requestId);
          console.error(`[DuckDB Hook] Request timeout for ${message.type} (${requestId})`);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }, []);

  /**
   * Load data into DuckDB
   */
  const loadData = useCallback(async (data: unknown[][], tableName?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await sendMessage({
        type: 'LOAD_DATA',
        payload: { data, tableName }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sendMessage]);

  /**
   * Execute a SQL query
   */
  const query = useCallback(async (sql: string, params?: unknown[]): Promise<QueryResult> => {
    setError(null);
    try {
      const result = await sendMessage<QueryResult>({
        type: 'QUERY',
        payload: { sql, params }
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  /**
   * Insert new rows
   */
  const insertRows = useCallback(async (rows: unknown[][], tableName?: string) => {
    setError(null);
    try {
      await sendMessage({
        type: 'INSERT_ROWS',
        payload: { rows, tableName }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  /**
   * Update a single cell
   */
  const updateCell = useCallback(async (
    row: number,
    col: number,
    value: unknown,
    tableName?: string
  ) => {
    setError(null);
    try {
      await sendMessage({
        type: 'UPDATE_CELL',
        payload: { row, col, value, tableName }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  /**
   * Delete rows by indices
   */
  const deleteRows = useCallback(async (rowIndices: number[], tableName?: string) => {
    setError(null);
    try {
      await sendMessage({
        type: 'DELETE_ROWS',
        payload: { rowIndices, tableName }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  /**
   * Delete columns by indices
   */
  const deleteColumns = useCallback(async (colIndices: number[], tableName?: string) => {
    setError(null);
    try {
      await sendMessage({
        type: 'DELETE_COLUMNS',
        payload: { colIndices, tableName }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  /**
   * Get table information
   */
  const getTableInfo = useCallback(async (tableName?: string): Promise<TableInfo> => {
    setError(null);
    try {
      const result = await sendMessage<TableInfo>({
        type: 'GET_TABLE_INFO',
        payload: { tableName }
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  /**
   * Clear all data from table
   */
  const clearTable = useCallback(async (tableName?: string) => {
    setError(null);
    try {
      await sendMessage({
        type: 'CLEAR_TABLE',
        payload: { tableName }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  /**
   * Export all data from table
   */
  const exportData = useCallback(async (tableName?: string): Promise<unknown[][]> => {
    setError(null);
    try {
      const result = await sendMessage<{ data: unknown[][] }>({
        type: 'EXPORT_DATA',
        payload: { tableName }
      });
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    }
  }, [sendMessage]);

  return {
    isInitialized,
    isLoading,
    error,
    loadData,
    query,
    insertRows,
    updateCell,
    deleteRows,
    deleteColumns,
    getTableInfo,
    clearTable,
    exportData
  };
}
