import { PGlite } from '@electric-sql/pglite';

let db: PGlite | null = null;

/**
 * Initialize PGlite database for client-side chart persistence
 * Uses IndexedDB for storage persistence across sessions
 */
export async function initDB(): Promise<PGlite> {
  if (db) return db;

  // Initialize PGlite with IndexedDB persistence
  db = new PGlite('idb://claude-charts-db');

  // Create charts table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS charts (
      id TEXT PRIMARY KEY,
      title TEXT,
      data JSONB NOT NULL,
      thumbnail TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      views INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_charts_created_at ON charts(created_at DESC);
  `);

  // Migrate existing tables to add thumbnail column if it doesn't exist
  try {
    await db.exec(`
      ALTER TABLE charts ADD COLUMN IF NOT EXISTS thumbnail TEXT;
    `);
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Migration: thumbnail column already exists or added');
  }

  return db;
}

/**
 * Get the database instance (initializes if needed)
 */
export async function getDB(): Promise<PGlite> {
  if (!db) {
    return await initDB();
  }
  return db;
}

/**
 * Close the database connection
 */
export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
