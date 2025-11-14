# Quick Start: Testing AG-Grid Implementation

## Switch to AG-Grid (One-Line Change)

Open `components/data-table.tsx` and change line 4:

### Before (Handsontable)
```tsx
import { DataGrid } from '@/components/data-grid';
```

### After (AG-Grid)
```tsx
import { DataGrid } from '@/components/data-grid-ag';
```

That's it! The rest of the code remains unchanged.

## Alternative: Export Renaming

If you prefer to keep the import statement unchanged, you can rename the export in `components/data-grid-ag.tsx`:

```tsx
// In data-grid-ag.tsx, change line 273 from:
export function DataGridAG({ ... }) { ... }

// To:
export function DataGrid({ ... }) { ... }
```

Then import as usual:
```tsx
import { DataGrid } from '@/components/data-grid-ag';
```

## Running the App

```bash
npm run dev
```

Visit `http://localhost:3000` and test the data grid functionality.

## What to Test

1. ✅ **Load Data**: Import CSV/Excel file
2. ✅ **Search**: Use the search popup (bottom right)
3. ✅ **Edit Cells**: Click any cell and edit
4. ✅ **Resize Columns**: Drag column borders
5. ✅ **Sort**: Click column headers
6. ✅ **Pagination**: Navigate through pages
7. ✅ **Column Mapping**: Check pink/purple backgrounds
8. ✅ **Performance**: Monitor with Chrome DevTools

## Performance Profiling

### Chrome DevTools

1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with the grid (scroll, search, edit)
5. Stop recording
6. Analyze frame rate and main thread activity

### Memory Usage

1. Open DevTools > Memory tab
2. Take Heap Snapshot before loading data
3. Load large dataset (10k+ rows)
4. Take another Heap Snapshot
5. Compare memory usage

## Files

- `components/data-grid.tsx` - Original Handsontable implementation
- `components/data-grid-ag.tsx` - New AG-Grid implementation
- `AG_GRID_COMPARISON.md` - Detailed comparison and testing guide

## Need Help?

See `AG_GRID_COMPARISON.md` for detailed feature comparison and performance testing guidelines.
