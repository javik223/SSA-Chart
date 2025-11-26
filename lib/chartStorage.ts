import { getDB } from './db';

/**
 * Generate a unique short ID for charts
 * Uses base62 encoding for URL-friendly IDs
 */
export function generateChartId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let id = '';

  // Add timestamp prefix for better uniqueness
  const timestamp = Date.now().toString(36);

  // Add random characters
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${timestamp}-${id}`;
}

export interface SavedChart {
  id: string;
  title: string;
  data: any;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  views: number;
}

/**
 * Save a chart to the database
 */
export async function saveChart(chartData: any, chartId?: string, thumbnail?: string): Promise<string> {
  console.log('saveChart called with:', { chartId, hasData: !!chartData, hasThumbnail: !!thumbnail });

  const db = await getDB();
  const id = chartId || generateChartId();
  const title = chartData.chartTitle || 'Untitled Chart';

  console.log('Chart details:', { id, title, thumbnailLength: thumbnail?.length || 0 });

  try {
    // Check if chart already exists
    const existing = await db.query(
      'SELECT id FROM charts WHERE id = $1',
      [id]
    );

    console.log('Chart exists:', existing.rows.length > 0);

    if (existing.rows.length > 0) {
      // Update existing chart
      console.log('Updating existing chart...');
      await db.query(
        `UPDATE charts
         SET data = $1, title = $2, thumbnail = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [JSON.stringify(chartData), title, thumbnail || null, id]
      );
      console.log('Chart updated successfully');
    } else {
      // Insert new chart
      console.log('Inserting new chart...');
      await db.query(
        `INSERT INTO charts (id, title, data, thumbnail, created_at, updated_at, views)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0)`,
        [id, title, JSON.stringify(chartData), thumbnail || null]
      );
      console.log('Chart inserted successfully');
    }

    return id;
  } catch (error) {
    console.error('Failed to save chart:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

/**
 * Load a chart from the database by ID
 */
export async function loadChart(chartId: string): Promise<SavedChart | null> {
  const db = await getDB();

  try {
    // Increment view count
    await db.query(
      'UPDATE charts SET views = views + 1 WHERE id = $1',
      [chartId]
    );

    // Fetch the chart
    const result = await db.query(
      `SELECT id, title, data, thumbnail, created_at, updated_at, views
       FROM charts
       WHERE id = $1`,
      [chartId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as any;
    return {
      id: row.id as string,
      title: row.title as string,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      thumbnail: row.thumbnail as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      views: row.views as number,
    };
  } catch (error) {
    console.error('Failed to load chart:', error);
    throw new Error('Failed to load chart from database');
  }
}

/**
 * Delete a chart from the database
 */
export async function deleteChart(chartId: string): Promise<boolean> {
  const db = await getDB();

  try {
    const result = await db.query(
      'DELETE FROM charts WHERE id = $1',
      [chartId]
    );

    return (result.affectedRows ?? 0) > 0;
  } catch (error) {
    console.error('Failed to delete chart:', error);
    throw new Error('Failed to delete chart from database');
  }
}

/**
 * List all saved charts
 */
export async function listCharts(limit = 50, offset = 0): Promise<SavedChart[]> {
  const db = await getDB();

  try {
    const result = await db.query(
      `SELECT id, title, data, thumbnail, created_at, updated_at, views
       FROM charts
       ORDER BY updated_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    console.log('listCharts: Retrieved', result.rows.length, 'charts');

    return result.rows.map((row: any) => ({
      id: row.id as string,
      title: row.title as string,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      thumbnail: row.thumbnail as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      views: row.views as number,
    }));
  } catch (error) {
    console.error('Failed to list charts:', error);
    throw new Error('Failed to list charts from database');
  }
}

/**
 * Get chart count
 */
export async function getChartCount(): Promise<number> {
  const db = await getDB();

  try {
    const result = await db.query('SELECT COUNT(*) as count FROM charts');
    return (result.rows[0] as any).count as number;
  } catch (error) {
    console.error('Failed to get chart count:', error);
    return 0;
  }
}

/**
 * Search charts by title
 */
export async function searchCharts(query: string, limit = 50): Promise<SavedChart[]> {
  const db = await getDB();

  try {
    const result = await db.query(
      `SELECT id, title, data, thumbnail, created_at, updated_at, views
       FROM charts
       WHERE title ILIKE $1
       ORDER BY updated_at DESC
       LIMIT $2`,
      [`%${query}%`, limit]
    );

    return result.rows.map((row: any) => ({
      id: row.id as string,
      title: row.title as string,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      thumbnail: row.thumbnail as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      views: row.views as number,
    }));
  } catch (error) {
    console.error('Failed to search charts:', error);
    throw new Error('Failed to search charts in database');
  }
}
