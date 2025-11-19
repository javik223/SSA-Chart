/**
 * DuckDB Web Worker - v2.0
 *
 * This worker handles all DuckDB operations in a separate thread to avoid
 * blocking the main UI thread with large dataset operations.
 */

import * as duckdb from '@duckdb/duckdb-wasm';

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

// Version identifier to force cache bust
console.log('[DuckDB Worker v2.0] Worker script loaded');

// Message types for communication with main thread
export type WorkerMessage =
  | { type: 'INIT' }
  | { type: 'LOAD_DATA'; payload: { data: unknown[][]; tableName?: string } }
  | { type: 'QUERY'; payload: { sql: string; params?: unknown[] } }
  | { type: 'INSERT_ROWS'; payload: { rows: unknown[][]; tableName?: string } }
  | { type: 'UPDATE_CELL'; payload: { row: number; col: number; value: unknown; tableName?: string } }
  | { type: 'DELETE_ROWS'; payload: { rowIndices: number[]; tableName?: string } }
  | { type: 'DELETE_COLUMNS'; payload: { colIndices: number[]; tableName?: string } }
  | { type: 'GET_TABLE_INFO'; payload: { tableName?: string } }
  | { type: 'CLEAR_TABLE'; payload: { tableName?: string } }
  | { type: 'EXPORT_DATA'; payload: { tableName?: string } };

export type WorkerResponse =
  | { type: 'SUCCESS'; requestId: string; payload?: unknown }
  | { type: 'ERROR'; requestId: string; error: string };

const DEFAULT_TABLE_NAME = 'chart_data';

/**
 * Convert BigInt values to numbers recursively
 */
function convertBigInts(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  if (Array.isArray(value)) {
    return value.map(convertBigInts);
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = convertBigInts(val);
    }
    return result;
  }
  return value;
}

/**
 * Initialize DuckDB instance
 */
async function initializeDuckDB() {
  try {
    console.log('[DuckDB Worker] Starting initialization...');

    // Use jsdelivr CDN for WASM bundles (most reliable for browser usage)
    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

    // Select a bundle based on browser capabilities
    const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
    console.log('[DuckDB Worker] Bundle selected');

    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker}");`], {
        type: 'text/javascript',
      })
    );

    const worker = new Worker(worker_url);
    const logger = new duckdb.ConsoleLogger();

    db = new duckdb.AsyncDuckDB(logger, worker);
    console.log('[DuckDB Worker] Instantiating WASM...');
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    console.log('[DuckDB Worker] Connecting...');
    conn = await db.connect();

    console.log('[DuckDB Worker] ✅ Initialization complete!');
    return { success: true };
  } catch (error) {
    console.error('[DuckDB Worker] ❌ Failed to initialize:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Load data into DuckDB table
 */
async function loadData(data: unknown[][], tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn || !db) {
    throw new Error('DuckDB not initialized');
  }

  try {
    console.log(`[DuckDB Worker] Loading ${data.length} rows into ${tableName}`);

    // Drop existing table if it exists
    await conn.query(`DROP TABLE IF EXISTS ${tableName}`);

    if (data.length === 0) {
      return { success: true, rowCount: 0, colCount: 0 };
    }

    // Determine column count from first row
    const colCount = data[0]?.length || 0;
    if (colCount === 0) {
      return { success: true, rowCount: 0, colCount: 0 };
    }

    // Check if first row is header (all strings)
    const firstRow = data[0];
    const hasHeader = firstRow.every(cell => typeof cell === 'string');

    let headers: string[];
    let dataRows: unknown[][];

    if (hasHeader) {
      headers = firstRow.map((h, i) => sanitizeColumnName(String(h) || `col_${i}`));
      dataRows = data.slice(1);
    } else {
      headers = Array.from({ length: colCount }, (_, i) => `col_${i}`);
      dataRows = data;
    }

    // Create table with inferred types
    const columnDefs = headers.map(h => `"${h}" VARCHAR`).join(', ');
    await conn.query(`CREATE TABLE ${tableName} (${columnDefs})`);

    // Insert data in batches for better performance
    const batchSize = 1000;
    for (let i = 0; i < dataRows.length; i += batchSize) {
      const batch = dataRows.slice(i, i + batchSize);
      const values = batch.map(row => {
        const cells = row.map(cell => {
          if (cell === null || cell === undefined) return 'NULL';
          return `'${String(cell).replace(/'/g, "''")}'`;
        }).join(', ');
        return `(${cells})`;
      }).join(', ');

      if (values) {
        await conn.query(`INSERT INTO ${tableName} VALUES ${values}`);
      }
    }

    console.log(`[DuckDB Worker] ✅ Loaded ${dataRows.length} rows successfully`);

    return {
      success: true,
      rowCount: dataRows.length,
      colCount: colCount,
      headers,
      hasHeader
    };
  } catch (error) {
    console.error('[DuckDB Worker] ❌ Failed to load data:', error);
    throw error;
  }
}

/**
 * Execute a SQL query
 */
async function executeQuery(sql: string, params?: unknown[]) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    const result = await conn.query(sql);
    const rows = result.toArray().map(row => Object.values(row));
    const columns = result.schema.fields.map(field => field.name);

    return {
      success: true,
      rows,
      columns,
      rowCount: rows.length
    };
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
}

/**
 * Insert new rows
 */
async function insertRows(rows: unknown[][], tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    // Get column names from table
    const schemaResult = await conn.query(`DESCRIBE ${tableName}`);
    const columns = schemaResult.toArray().map((row: { column_name: string }) => row.column_name);

    const values = rows.map(row => {
      const cells = row.map(cell => {
        if (cell === null || cell === undefined) return 'NULL';
        return `'${String(cell).replace(/'/g, "''")}'`;
      }).join(', ');
      return `(${cells})`;
    }).join(', ');

    if (values) {
      await conn.query(`INSERT INTO ${tableName} VALUES ${values}`);
    }

    return { success: true, insertedCount: rows.length };
  } catch (error) {
    console.error('Failed to insert rows:', error);
    throw error;
  }
}

/**
 * Update a single cell
 */
async function updateCell(row: number, col: number, value: unknown, tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    // Get column names
    const schemaResult = await conn.query(`DESCRIBE ${tableName}`);
    const columns = schemaResult.toArray().map((r: { column_name: string }) => r.column_name);

    if (col >= columns.length) {
      throw new Error(`Column index ${col} out of range`);
    }

    const columnName = columns[col];
    const sanitizedValue = value === null || value === undefined
      ? 'NULL'
      : `'${String(value).replace(/'/g, "''")}'`;

    // Get all ROWIDs in order
    const rowidsResult = await conn.query(`SELECT ROWID as rid FROM ${tableName}`);
    const rowidsArray = rowidsResult.toArray();
    const rowids = rowidsArray.map((r: any) => r.rid);

    console.log(`[DuckDB Worker] Got ${rowids.length} ROWIDs, looking for row ${row}`);

    if (row >= rowids.length) {
      throw new Error(`Row index ${row} out of range (${rowids.length} rows)`);
    }

    const targetRowid = rowids[row];
    console.log(`[DuckDB Worker] Target ROWID: ${targetRowid}`);

    const updateQuery = `UPDATE ${tableName} SET "${columnName}" = ${sanitizedValue} WHERE ROWID = ${targetRowid}`;

    console.log(`[DuckDB Worker] Executing update:`, updateQuery);
    await conn.query(updateQuery);

    console.log(`[DuckDB Worker] Updated cell at row ${row} (ROWID ${targetRowid}), col ${col} (${columnName}) = ${sanitizedValue}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to update cell:', error);
    throw error;
  }
}

/**
 * Delete rows by indices
 */
async function deleteRows(rowIndices: number[], tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    // DuckDB ROWID is 1-based
    const rowIds = rowIndices.map(idx => idx + 1).join(', ');
    await conn.query(`DELETE FROM ${tableName} WHERE ROWID IN (${rowIds})`);

    return { success: true, deletedCount: rowIndices.length };
  } catch (error) {
    console.error('Failed to delete rows:', error);
    throw error;
  }
}

/**
 * Delete columns by indices
 */
async function deleteColumns(colIndices: number[], tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    // Get current columns
    const schemaResult = await conn.query(`DESCRIBE ${tableName}`);
    const allColumns = schemaResult.toArray().map((r: { column_name: string }) => r.column_name);

    // Keep columns that are not in colIndices
    const remainingColumns = allColumns.filter((_, idx) => !colIndices.includes(idx));

    if (remainingColumns.length === 0) {
      // If all columns deleted, drop table
      await conn.query(`DROP TABLE ${tableName}`);
      return { success: true, deletedCount: colIndices.length };
    }

    // Create new table with remaining columns
    const columnList = remainingColumns.map(c => `"${c}"`).join(', ');
    await conn.query(`CREATE TEMPORARY TABLE temp_table AS SELECT ${columnList} FROM ${tableName}`);
    await conn.query(`DROP TABLE ${tableName}`);
    await conn.query(`ALTER TABLE temp_table RENAME TO ${tableName}`);

    return { success: true, deletedCount: colIndices.length };
  } catch (error) {
    console.error('Failed to delete columns:', error);
    throw error;
  }
}

/**
 * Get table information
 */
async function getTableInfo(tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    // Check if table exists
    const tableCheck = await conn.query(
      `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = '${tableName}'`
    );
    const countValue = tableCheck.toArray()[0]?.count;
    const tableExists = (typeof countValue === 'bigint' ? Number(countValue) : countValue) > 0;

    if (!tableExists) {
      return { success: true, exists: false };
    }

    // Get schema
    const schemaResult = await conn.query(`DESCRIBE ${tableName}`);
    const columns = schemaResult.toArray().map((r: { column_name: string; column_type: string }) => ({
      name: r.column_name,
      type: r.column_type
    }));

    // Get row count
    const countResult = await conn.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    const rawRowCount = countResult.toArray()[0]?.count || 0;
    const rowCount = typeof rawRowCount === 'bigint' ? Number(rawRowCount) : rawRowCount;

    return {
      success: true,
      exists: true,
      columns,
      rowCount,
      colCount: columns.length
    };
  } catch (error) {
    console.error('Failed to get table info:', error);
    throw error;
  }
}

/**
 * Clear all data from table
 */
async function clearTable(tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    await conn.query(`DROP TABLE IF EXISTS ${tableName}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to clear table:', error);
    throw error;
  }
}

/**
 * Export all data from table
 */
async function exportData(tableName: string = DEFAULT_TABLE_NAME) {
  if (!conn) {
    throw new Error('DuckDB not initialized');
  }

  try {
    const result = await conn.query(`SELECT * FROM ${tableName}`);
    const rows = result.toArray().map(row => Object.values(row));
    const columns = result.schema.fields.map(field => field.name);

    return {
      success: true,
      data: [columns, ...rows],
      rowCount: rows.length,
      colCount: columns.length
    };
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
}

/**
 * Sanitize column name for SQL
 */
function sanitizeColumnName(name: string): string {
  // Remove special characters and spaces, replace with underscore
  return name
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^[0-9]/, '_$&') // Prefix with underscore if starts with number
    .toLowerCase();
}

/**
 * Message handler
 */
self.onmessage = async (event: MessageEvent<{ type: string; payload?: unknown; requestId: string }>) => {
  const { type, payload, requestId } = event.data;

  console.log(`[DuckDB Worker] 📨 Received ${type} request (${requestId})`);

  try {
    let result;

    switch (type) {
      case 'INIT':
        result = await initializeDuckDB();
        break;

      case 'LOAD_DATA':
        result = await loadData((payload as any).data, (payload as any).tableName);
        break;

      case 'QUERY':
        result = await executeQuery((payload as any).sql, (payload as any).params);
        break;

      case 'INSERT_ROWS':
        result = await insertRows((payload as any).rows, (payload as any).tableName);
        break;

      case 'UPDATE_CELL':
        result = await updateCell((payload as any).row, (payload as any).col, (payload as any).value, (payload as any).tableName);
        break;

      case 'DELETE_ROWS':
        result = await deleteRows((payload as any).rowIndices, (payload as any).tableName);
        break;

      case 'DELETE_COLUMNS':
        result = await deleteColumns((payload as any).colIndices, (payload as any).tableName);
        break;

      case 'GET_TABLE_INFO':
        result = await getTableInfo((payload as any)?.tableName);
        break;

      case 'CLEAR_TABLE':
        result = await clearTable((payload as any)?.tableName);
        break;

      case 'EXPORT_DATA':
        result = await exportData((payload as any)?.tableName);
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    console.log(`[DuckDB Worker] ✅ Sending SUCCESS response for ${type} (${requestId})`);
    self.postMessage({
      type: 'SUCCESS',
      requestId,
      payload: convertBigInts(result)
    } as WorkerResponse);

  } catch (error) {
    console.error(`[DuckDB Worker] ❌ Error in ${type}:`, error);
    self.postMessage({
      type: 'ERROR',
      requestId,
      error: error instanceof Error ? error.message : String(error)
    } as WorkerResponse);
  }
};

// Export type for use in main thread
export type { };
