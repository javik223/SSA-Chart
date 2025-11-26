# Edit Chart Workflow Documentation

## Overview

Claude Charts now supports editing saved charts! You can load any saved chart, make changes, and update it with the same URL. This creates a seamless workflow for iterative chart design.

## Features

✅ **Load Charts for Editing** - Click "Edit" from saved charts page
✅ **Visual Edit Mode** - Blue "Editing" badge shows you're in edit mode
✅ **Preserve Chart ID** - Updates keep the same shareable URL
✅ **Auto-Update** - Clicking "Share Link" updates the existing chart
✅ **New Chart Option** - Start fresh while editing with "New Chart" button
✅ **Updated Timestamp** - Track when charts were last modified

## User Workflow

### 1. Browse Saved Charts

Navigate to `/saved` to see all your charts:

```
/saved
```

Features on this page:
- **Search** - Find charts by title
- **View** - Open chart in renderer
- **Edit** - Load chart into editor
- **Delete** - Remove chart permanently

### 2. Start Editing

Click the **"Edit"** button on any chart card:

```typescript
// Redirects to: /?edit={chartId}
// Example: /?edit=l5x2k9-Abc123Xy
```

**What happens:**
1. Chart loads into main editor
2. All settings and data restored
3. Blue "Editing" badge appears in header
4. "New Chart" button becomes available
5. Ready to make changes!

### 3. Make Your Changes

Edit anything you want:
- Change chart type
- Update data
- Modify colors
- Adjust layout
- Update title/subtitle
- Change legend position
- Tweak axes settings
- Everything!

### 4. Save Updates

You have two options to save:

**Option A: Save Button (Recommended)**

Click the **"Save"** button in the header:

```typescript
// Visual feedback:
// - Button shows "Saving..." with pulse animation
// - Changes to "Saved!" with checkmark
// - Returns to "Save" after 2 seconds

// Keyboard shortcut:
// - Press Cmd+S (Mac) or Ctrl+S (Windows/Linux)
```

**Option B: Share Link Button**

Click the **"Share Link"** button for save + share dialog:

```typescript
// If editing existing chart:
// - Uses same chart ID
// - Updates database record
// - Keeps same URL
// - Updates timestamp

// If new chart:
// - Creates new chart ID
// - New database record
// - New shareable URL
```

**Dialog shows:**
```
✓ Chart Updated!
Your chart has been updated in the database...
```

### 5. Start New Chart (Optional)

Click **"New Chart"** button when editing:

```typescript
// Confirmation dialog appears
// Clears current chart
// Resets editor to blank state
// Removes edit mode
```

## Technical Implementation

### State Management

The app tracks the current chart ID:

```typescript
interface ChartSlice {
  currentChartId: string | null;
  setCurrentChartId: (id: string | null) => void;
}
```

**States:**
- `null` - Creating new chart
- `string` - Editing existing chart

### Load for Editing

```typescript
// URL: /?edit=abc123

useEffect(() => {
  const editId = searchParams.get('edit');
  if (editId) {
    const chart = await loadChart(editId);
    if (chart) {
      loadChartState(chart.data);      // Restore all settings
      setCurrentChartId(chartId);       // Track chart ID
      setActiveTab('preview');          // Show chart
    }
  }
}, [searchParams]);
```

### Save/Update Logic

```typescript
const handleShare = async () => {
  const state = useChartStore.getState();

  // If currentChartId exists, update that chart
  // If null, create new chart
  const chartId = await saveChart(state, currentChartId || undefined);

  // Update store with chart ID
  if (!currentChartId) {
    setCurrentChartId(chartId);
  }

  // Generate URL
  const url = `${origin}/render/${chartId}`;
};
```

### Database Update

```typescript
export async function saveChart(chartData: any, chartId?: string): Promise<string> {
  const id = chartId || generateChartId();

  const existing = await db.query('SELECT id FROM charts WHERE id = $1', [id]);

  if (existing.rows.length > 0) {
    // UPDATE existing chart
    await db.query(
      `UPDATE charts SET data = $1, title = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [JSON.stringify(chartData), title, id]
    );
  } else {
    // INSERT new chart
    await db.query(
      `INSERT INTO charts (id, title, data, ...) VALUES (...)`,
      [...]
    );
  }

  return id;
}
```

## UI Components

### 1. Saved Charts Page (`/app/saved/page.tsx`)

**Edit Button:**
```tsx
<Button onClick={() => router.push(`/?edit=${chart.id}`)}>
  <Edit className="h-4 w-4 mr-2" />
  Edit
</Button>
```

### 2. Main Page (`/app/page.tsx`)

**Load Logic:**
```tsx
useEffect(() => {
  const editId = searchParams.get('edit');
  if (editId) {
    loadChartForEditing(editId);
  }
}, [searchParams]);
```

### 3. Page Header (`/components/page-header.tsx`)

**Edit Badge:**
```tsx
{currentChartId && (
  <span className='bg-blue-100 px-3 py-1 text-blue-700'>
    <Edit3 className='h-3 w-3' />
    Editing
  </span>
)}
```

**New Chart Button:**
```tsx
{currentChartId && (
  <Button onClick={handleNewChart}>
    <Plus className='h-4 w-4 mr-2' />
    New Chart
  </Button>
)}
```

### 4. Export Dropdown (`/components/export-dropdown.tsx`)

**Update Message:**
```tsx
<strong>✓ Chart {currentChartId ? 'Updated' : 'Saved'}!</strong>
Your chart has been {currentChartId ? 'updated in' : 'saved to'} the database...
```

## User Experience Flow

### Happy Path: Edit Existing Chart

```
1. User visits /saved
   ↓
2. Clicks "Edit" on a chart
   ↓
3. Redirects to /?edit=abc123
   ↓
4. Chart loads into editor
   ↓
5. "Editing" badge appears
   ↓
6. User makes changes
   ↓
7. Clicks "Share Link"
   ↓
8. Chart updates in database
   ↓
9. "Chart Updated!" message
   ↓
10. Same URL still works!
```

### Alternative: Start New Chart While Editing

```
1. User is editing chart abc123
   ↓
2. Clicks "New Chart" button
   ↓
3. Confirmation dialog appears
   ↓
4. User confirms
   ↓
5. currentChartId → null
   ↓
6. Editor resets to blank
   ↓
7. "Editing" badge disappears
   ↓
8. Ready for new chart!
```

## Best Practices

### For Users

1. **Always Save Before Editing** - Make sure your changes are saved before loading another chart
2. **Check Edit Badge** - The blue "Editing" badge shows you're updating an existing chart
3. **Use New Chart** - Click "New Chart" if you want to start fresh
4. **Share Link Updates** - Clicking "Share Link" while editing updates the existing chart

### For Developers

1. **Track Chart ID** - Always check `currentChartId` to determine edit mode
2. **Clear on Reset** - Set `currentChartId` to `null` when starting fresh
3. **Update Timestamps** - Database automatically updates `updated_at` on save
4. **Preserve URLs** - Never change chart IDs during updates

## Error Handling

### Chart Not Found

```typescript
const chart = await loadChart(chartId);
if (!chart) {
  alert('Chart not found');
  return;
}
```

### Failed Update

```typescript
try {
  await saveChart(state, chartId);
} catch (error) {
  alert('Failed to update chart. Please try again.');
}
```

### Unsaved Changes

```typescript
const handleNewChart = () => {
  if (currentChartId) {
    if (confirm('Start a new chart? Your current changes will be lost if not saved.')) {
      // Proceed
    }
  }
};
```

## Database Schema Impact

The edit workflow leverages existing schema:

```sql
-- updated_at tracks when chart was last modified
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- On UPDATE:
UPDATE charts
SET data = $1,
    title = $2,
    updated_at = CURRENT_TIMESTAMP  -- Auto-updates
WHERE id = $3;
```

## URL Patterns

### Edit Mode URL
```
Main App: /?edit={chartId}
Example:  /?edit=l5x2k9-Abc123Xy
```

### View Mode URL
```
Renderer: /render/{chartId}
Example:  /render/l5x2k9-Abc123Xy
```

### Saved Charts URL
```
Gallery:  /saved
```

## Visual Indicators

1. **Save Button** - Always visible in header
   - "Save" - Ready to save
   - "Saving..." - Save in progress (with pulse animation)
   - "Saved!" - Save successful (shows for 2 seconds)
   - Hover tooltip shows keyboard shortcut
2. **Edit Badge** - Blue badge with "Editing" text when editing existing chart
3. **New Chart Button** - Only visible when editing
4. **Updated Message** - "Chart Updated!" vs "Chart Saved!" in Share dialog
5. **Chart Title** - Shows in header

## Keyboard Shortcuts

### Implemented

- **`Cmd/Ctrl + S`** - Save or update chart
  - Creates new chart if not yet saved
  - Updates existing chart if editing
  - Shows visual feedback (button changes to "Saved!")
  - Works from anywhere in the app

### Future

- `Cmd/Ctrl + N` - New chart
- `Escape` - Cancel edit mode

## Future Enhancements

- [ ] Edit history (track versions)
- [ ] Undo/redo while editing
- [ ] Compare before/after views
- [ ] Duplicate chart feature
- [ ] Rename chart feature
- [ ] Move to folder/category
- [ ] Share with collaborators
- [ ] Lock charts from editing

## Troubleshooting

### Chart doesn't load
- Check chart ID in URL
- Verify chart exists in database
- Check browser console for errors

### Updates not saving
- Ensure "Share Link" was clicked
- Check network tab for errors
- Verify database connection

### Wrong chart loads
- Clear URL parameters
- Use "New Chart" button
- Reload page

## Summary

The edit workflow provides a seamless experience for iterative chart design:

✅ Load any saved chart with one click
✅ Make unlimited changes
✅ Update with same shareable URL
✅ Track modification timestamps
✅ Clear visual feedback
✅ Safe "New Chart" option

This makes Claude Charts a complete solution for creating, sharing, AND maintaining your visualizations over time!
