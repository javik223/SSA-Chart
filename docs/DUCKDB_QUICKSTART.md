# DuckDB Integration - Quick Start

## What's New?

Claude Charts now supports **DuckDB** as an optional data storage backend, providing:

- **10-100x faster** operations on large datasets (100K+ rows)
- **Non-blocking** data operations (runs in web worker)
- **Lower memory usage** in main thread
- **SQL query capabilities** for advanced filtering

## TL;DR

```tsx
import { useDataAdapter } from '@/hooks/useDataAdapter';
import { useChartStore } from '@/store/useChartStore';

function MyComponent() {
  // Enable DuckDB mode (optional - defaults to standard mode)
  const setUseDuckDB = useChartStore(state => state.setUseDuckDB);
  setUseDuckDB(true);

  // Use the adapter (works in both modes!)
  const adapter = useDataAdapter();

  // Load data
  await adapter.loadData(myData);

  // Get data
  const data = await adapter.getData();

  // Update, delete, insert - all work the same!
}
```

## File Structure

```
/hooks
  ├── useDuckDB.ts          # Low-level DuckDB hook
  └── useDataAdapter.ts     # High-level unified interface

/workers
  └── duckdb.worker.ts      # Web worker for DuckDB

/store
  └── useChartStore.ts      # Updated with DuckDB mode flag

/components/settings
  └── DataStorageSettings.tsx  # UI for toggling modes

/docs
  ├── DUCKDB_INTEGRATION.md    # Full documentation
  └── DUCKDB_QUICKSTART.md     # This file

/examples
  └── DataAdapterExample.tsx   # Working example
```

## Quick Integration Steps

### 1. Add the Settings UI (Optional)

```tsx
import { DataStorageSettings } from '@/components/settings/DataStorageSettings';

<DataStorageSettings />
```

### 2. Update Your Components

Replace direct Zustand usage with the data adapter:

**Before:**
```tsx
const data = useChartStore(state => state.data);
const setData = useChartStore(state => state.setData);

// Update data
setData(newData);
```

**After:**
```tsx
const adapter = useDataAdapter();

// Load data
await adapter.loadData(newData);

// Get data
const data = await adapter.getData();
```

### 3. That's it!

The adapter automatically routes to DuckDB or Zustand based on the `useDuckDB` flag. Your components work in both modes without changes!

## Key Benefits

| Feature | Standard Mode | DuckDB Mode |
|---------|--------------|-------------|
| Max Rows | ~10K | Millions |
| UI Blocking | Yes | No |
| Memory Usage | High | Low |
| Setup | Instant | ~200ms |
| SQL Queries | No | Yes |

## When to Use Each Mode

### Use Standard Mode (Default)
- Small datasets (< 10K rows)
- Simple operations
- Instant startup needed

### Use DuckDB Mode
- Large datasets (> 10K rows)
- Complex filtering/aggregations
- Need non-blocking operations

## Example: Loading Large CSV

```tsx
import { useDataAdapter } from '@/hooks/useDataAdapter';

function CSVUploader() {
  const adapter = useDataAdapter();
  const setUseDuckDB = useChartStore(state => state.setUseDuckDB);

  const handleUpload = async (file: File) => {
    const text = await file.text();
    const rows = text.split('\n').map(line => line.split(','));

    // Enable DuckDB for large files
    if (rows.length > 10000) {
      setUseDuckDB(true);
    }

    // Load data (adapter handles the rest)
    await adapter.loadData(rows);
  };

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />;
}
```

## Advanced: Direct SQL Queries

```tsx
import { useDuckDB } from '@/hooks/useDuckDB';

function AdvancedAnalytics() {
  const duckdb = useDuckDB();

  const runAnalysis = async () => {
    const result = await duckdb.query(`
      SELECT
        category,
        AVG(value) as avg_value,
        COUNT(*) as count
      FROM chart_data
      WHERE value > 100
      GROUP BY category
      ORDER BY avg_value DESC
    `);

    console.log(result.rows);
  };

  return <button onClick={runAnalysis}>Run Analysis</button>;
}
```

## Common Patterns

### Pattern 1: Automatic Mode Selection

```tsx
const handleDataLoad = async (data: unknown[][]) => {
  const setUseDuckDB = useChartStore.getState().setUseDuckDB;

  // Auto-enable DuckDB for large datasets
  if (data.length > 10000) {
    setUseDuckDB(true);
  }

  await adapter.loadData(data);
};
```

### Pattern 2: Pagination

```tsx
const getPage = async (page: number, pageSize: number = 100) => {
  return await adapter.getData({
    limit: pageSize,
    offset: page * pageSize
  });
};
```

### Pattern 3: Error Handling

```tsx
try {
  await adapter.loadData(data);
} catch (error) {
  console.error('Failed to load:', error);
  // Fallback to standard mode
  setUseDuckDB(false);
  await adapter.loadData(data);
}
```

## Testing

Run the example component:

```tsx
import { DataAdapterExample } from '@/examples/DataAdapterExample';

<DataAdapterExample />
```

This provides an interactive demo of:
- Mode switching
- Data loading
- CRUD operations
- Error handling

## Performance Tips

1. **Enable DuckDB early** for large datasets
2. **Use pagination** when displaying data
3. **Batch updates** instead of individual cell updates
4. **Cache query results** for frequently accessed data

## Troubleshooting

### "Worker not initialized"
- Wait for `adapter.isReady` before operations
- Check browser console for worker errors

### Slow queries
- Use LIMIT clause to reduce result size
- Enable DuckDB mode for better performance
- Consider adding filters to queries

### Memory issues
- Enable DuckDB mode to offload to worker
- Clear unused data with `adapter.clearTable()`

## Next Steps

- Read [Full Documentation](./DUCKDB_INTEGRATION.md)
- Explore [DuckDB SQL Reference](https://duckdb.org/docs/sql/introduction)
- Try the example component
- Check out advanced use cases

## Migration Checklist

- [ ] Install `@duckdb/duckdb-wasm` (already done)
- [ ] Add DataStorageSettings UI component
- [ ] Update data-loading components to use `useDataAdapter`
- [ ] Test with sample data
- [ ] Monitor performance with large datasets
- [ ] Update chart components to use adapter
- [ ] Deploy and measure improvements

## Support

Questions? Check:
- `docs/DUCKDB_INTEGRATION.md` - Full documentation
- `examples/DataAdapterExample.tsx` - Working example
- Browser console for error messages
- DuckDB logs in worker console
