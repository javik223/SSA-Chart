# Thumbnail Generation - Debug Guide

## Changes Made

I've implemented comprehensive logging and error handling to help debug the thumbnail generation issue. Here's what was added:

### 1. Database Migration

**File**: [lib/db.ts](lib/db.ts)

Added automatic migration to ensure the `thumbnail` column exists:

```typescript
// Migrate existing tables to add thumbnail column if it doesn't exist
try {
  await db.exec(`
    ALTER TABLE charts ADD COLUMN IF NOT EXISTS thumbnail TEXT;
  `);
} catch (error) {
  console.log('Migration: thumbnail column already exists or added');
}
```

### 2. Enhanced Thumbnail Generation

**File**: [utils/thumbnailUtils.ts](utils/thumbnailUtils.ts)

Added comprehensive logging:

```typescript
export async function generateChartThumbnail(): Promise<string | null> {
  try {
    const chartGraphic = document.querySelector('.chart-preview-graphic') as HTMLElement;

    if (!chartGraphic) {
      console.warn('Chart graphic not found for thumbnail generation');
      console.log('Available chart elements:', {
        chartPreviewGraphic: document.querySelector('.chart-preview-graphic'),
        chartPreviewGraphicWrapper: document.querySelector('.chart-preview-graphic-wrapper'),
        dataChartContainer: document.querySelector('[data-chart-container]'),
      });
      return null;
    }

    // Wait for animations
    await new Promise(resolve => setTimeout(resolve, 100));

    const thumbnailDataUrl = await toJpeg(chartGraphic, {
      quality: 0.7,
      pixelRatio: 1,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    console.log('Thumbnail generated successfully, size:', thumbnailDataUrl.length, 'bytes');
    return thumbnailDataUrl;
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    return null;
  }
}
```

### 3. Enhanced Save Functions

**Files**:
- [components/page-header.tsx](components/page-header.tsx)
- [components/export-dropdown.tsx](components/export-dropdown.tsx)

Added logging at each step:

```typescript
const handleSave = async () => {
  try {
    console.log('Generating thumbnail...');
    const thumbnail = await generateThumbnailWithRetry();

    if (thumbnail) {
      console.log('Thumbnail generated successfully');
    } else {
      console.warn('No thumbnail generated, saving without thumbnail');
    }

    console.log('Saving chart to database...');
    const chartId = await saveChart(persistedState, currentChartId || undefined, thumbnail || undefined);
    console.log('Chart saved with ID:', chartId);
  } catch (error) {
    console.error('Failed to save chart:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    alert(`Failed to save chart: ${errorMessage}\n\nPlease check the console for details.`);
  }
}
```

### 4. Database Save Logging

**File**: [lib/chartStorage.ts](lib/chartStorage.ts)

Added detailed database operation logging:

```typescript
export async function saveChart(chartData: any, chartId?: string, thumbnail?: string): Promise<string> {
  console.log('saveChart called with:', { chartId, hasData: !!chartData, hasThumbnail: !!thumbnail });

  const db = await getDB();
  const id = chartId || generateChartId();
  const title = chartData.chartTitle || 'Untitled Chart';

  console.log('Chart details:', { id, title, thumbnailLength: thumbnail?.length || 0 });

  try {
    const existing = await db.query('SELECT id FROM charts WHERE id = $1', [id]);
    console.log('Chart exists:', existing.rows.length > 0);

    if (existing.rows.length > 0) {
      console.log('Updating existing chart...');
      await db.query(/* UPDATE query */);
      console.log('Chart updated successfully');
    } else {
      console.log('Inserting new chart...');
      await db.query(/* INSERT query */);
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
```

## How to Debug

### Step 1: Open Browser DevTools

1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Open DevTools (F12 or Cmd+Option+I)
4. Go to the **Console** tab

### Step 2: Create or Load a Chart

1. Upload some data or use sample data
2. Create a chart in the preview tab
3. Make sure the chart is visible on screen

### Step 3: Try to Save

Click the **Save** button or press **Cmd/Ctrl+S**

### Step 4: Check Console Output

You should see a series of log messages like:

```
Generating thumbnail...
Chart graphic not found for thumbnail generation (if element is missing)
OR
Thumbnail generated successfully, size: 123456 bytes (if successful)
OR
No thumbnail generated, saving without thumbnail (if failed)

saveChart called with: { chartId: null, hasData: true, hasThumbnail: true/false }
Chart details: { id: 'abc123-xyz', title: 'My Chart', thumbnailLength: 123456 }
Chart exists: false
Inserting new chart...
Chart inserted successfully
Chart saved with ID: abc123-xyz
```

### Step 5: Try to Share

Click **Export** → **Share Link**

Same logging will appear, helping identify where the issue occurs.

## Common Issues and Solutions

### Issue 1: "Chart graphic not found"

**Symptom**: Console shows:
```
Chart graphic not found for thumbnail generation
Available chart elements: { chartPreviewGraphic: null, ... }
```

**Cause**: The `.chart-preview-graphic` element doesn't exist in the DOM

**Solution**:
- Make sure you're on the **Preview** tab when saving
- Verify the chart has rendered before clicking Save
- Check if `ChartDisplay.tsx` is correctly applying the class

### Issue 2: "Failed to generate thumbnail" error

**Symptom**: Console shows error during `toJpeg` call

**Possible causes**:
- Chart contains external images that haven't loaded
- Chart has CORS issues with external resources
- SVG elements with invalid attributes

**Solution**:
- Wait longer before capturing (increase delay)
- Check for CORS errors in Network tab
- Try with different chart types

### Issue 3: Database save fails

**Symptom**: Console shows:
```
Failed to save chart: [error]
Error details: { name: '...', message: '...', stack: '...' }
```

**Solutions**:
- Check if PGlite initialized properly
- Clear IndexedDB and reload page
- Check if data is too large (base64 thumbnails can be big)

### Issue 4: Thumbnail is null but no error

**Symptom**:
```
No thumbnail generated, saving without thumbnail
```

**Cause**: `generateThumbnailWithRetry()` returned `null` after retries

**Solution**:
- Check all console warnings before this message
- Verify chart element exists and is visible
- Try increasing retry count or delay

## Testing the Fix

### Test 1: New Chart with Thumbnail

1. Clear your browser storage (Application → IndexedDB → Delete `claude-charts-db`)
2. Reload the page
3. Create a new chart
4. Switch to Preview tab
5. Click **Save** or press **Cmd/Ctrl+S**
6. Check console for successful thumbnail generation
7. Visit `/saved` to see if thumbnail appears

### Test 2: Update Existing Chart

1. Go to `/saved`
2. Click **Edit** on an existing chart
3. Make a change
4. Click **Save**
5. Check console logs
6. Refresh `/saved` page
7. Verify thumbnail updated

### Test 3: Share Link

1. Create a chart
2. Click **Export** → **Share Link**
3. Check console logs
4. Verify dialog shows success message
5. Visit `/saved`
6. Check if thumbnail appears

## Thumbnail Storage Format

Thumbnails are stored as **base64-encoded JPEG data URLs**:

```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDA...
```

- **Quality**: 0.7 (70%)
- **Format**: JPEG
- **Background**: White (#ffffff)
- **PixelRatio**: 1 (no scaling)

### Expected Size

Typical thumbnail sizes:
- Simple charts: 50-200 KB
- Complex charts: 200-500 KB
- Very detailed: 500 KB - 1 MB

If thumbnails exceed 1 MB consistently, consider reducing quality or pixelRatio.

## Next Steps

1. **Run the app** with `npm run dev`
2. **Open DevTools Console**
3. **Try saving a chart**
4. **Share the console output** if issues persist

The detailed logging will help identify exactly where the process is failing!

## Reverting Debug Logs (Later)

Once the issue is fixed, you can remove the excessive logging by:

1. Keeping error logging (`console.error`)
2. Removing informational logging (`console.log`)
3. Keeping warnings (`console.warn`) for missing elements

This will keep the code clean while maintaining error visibility.
