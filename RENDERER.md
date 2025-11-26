# Chart Renderer Documentation

## Overview

The Chart Renderer is a standalone page that allows you to view and share charts created with Claude Charts. Charts are saved to a client-side **PGlite database** (stored in IndexedDB) and can be shared via short URLs or uploaded as JSON files.

## Features

- **Database Persistence**:
  - Charts saved to PGlite (PostgreSQL in the browser)
  - Data persisted in IndexedDB across sessions
  - Short, shareable URLs using chart IDs
  - View tracking for each chart

- **Multiple Import Methods**:
  - Share via database (short URLs)
  - Upload JSON configuration files
  - Load charts via URL parameters (legacy)
  - Drag-and-drop file upload

- **Full Feature Support**:
  - All chart types (bar, line, donut, diverging bar, treemap, etc.)
  - Custom styling and layout settings
  - Responsive preview modes
  - Interactive legends and controls

- **Chart Management**:
  - Browse saved charts at `/saved`
  - Search charts by title
  - Delete charts
  - Track view counts

## Usage

### Method 1: Share Link (Recommended)

1. In the main app, create and configure your chart
2. Click the Export dropdown
3. Select "Share Link"
4. Chart is automatically saved to the database
5. Copy the generated short URL (e.g., `/render/abc123`)
6. Share the URL with others

**Benefits:**
- Short, clean URLs
- No URL length limitations
- Persistent storage
- View tracking

### Method 2: Upload JSON File

1. Navigate to `/render` in your browser
2. Click "Choose File" or drag and drop your exported `.json` file
3. The chart will render automatically

### Method 3: Browse Saved Charts

1. Navigate to `/saved` in your browser
2. View all your saved charts
3. Search by title
4. Click "View" to open any chart
5. Delete charts you no longer need

### Method 4: Direct URL (Legacy)

For backwards compatibility, you can still load charts via URL parameters:

```
/render?data=<encoded-json-data>
```

**Note:** This method has URL length limitations. Use the database method for large datasets.

Example:
```javascript
const chartData = {
  chartType: 'bar',
  data: [/* your data */],
  // ... other settings
};

const encodedData = encodeURIComponent(JSON.stringify(chartData));
const url = `${window.location.origin}/render?data=${encodedData}`;
```

## File Format

The renderer accepts JSON files exported from Claude Charts. The expected format includes:

```json
{
  "chartType": "bar",
  "data": [
    ["Category", "Value 1", "Value 2"],
    ["A", 10, 20],
    ["B", 15, 25]
  ],
  "columnMapping": {
    "labels": 0,
    "values": [1, 2]
  },
  "chartTitle": "My Chart",
  "chartSubtitle": "Subtitle text",
  "colorPalette": "default",
  // ... all other chart settings
}
```

## Components

### Main Components

1. **`/app/render/page.tsx`**
   - Main renderer page (manual upload)
   - Handles file uploads and URL parameters
   - Manages loading states and error handling

2. **`/app/render/[id]/page.tsx`**
   - Dynamic route for database-stored charts
   - Fetches chart by ID from PGlite
   - Increments view counter
   - Displays chart metadata (title, views)

3. **`/app/saved/page.tsx`**
   - Chart gallery and management
   - Lists all saved charts
   - Search functionality
   - Delete charts

4. **`/components/ChartRenderer.tsx`**
   - Core rendering component
   - Displays charts with full styling
   - Supports all chart types and configurations

5. **`/components/export-dropdown.tsx`**
   - Enhanced with "Share Link" feature
   - Saves charts to database
   - Generates short URLs
   - Copy-to-clipboard functionality

### Database Layer

6. **`/lib/db.ts`**
   - PGlite database initialization
   - IndexedDB storage configuration
   - Schema management

7. **`/lib/chartStorage.ts`**
   - Chart CRUD operations
   - ID generation
   - Search functionality
   - View tracking

### Supporting Components

- `ChartDisplay.tsx` - Original preview component
- `BasicChart.tsx` - Single chart renderer
- `GridChart.tsx` - Grid layout renderer
- Chart-specific components (DonutChart, TreemapChart, etc.)

## Technical Details

### Database Architecture

#### PGlite Storage

The application uses **PGlite** - a lightweight PostgreSQL implementation that runs entirely in the browser:

```typescript
import { PGlite } from '@electric-sql/pglite';

// Initialize with IndexedDB persistence
const db = new PGlite('idb://claude-charts-db');
```

**Database Schema:**

```sql
CREATE TABLE charts (
  id TEXT PRIMARY KEY,              -- Short unique ID (e.g., "abc123")
  title TEXT,                        -- Chart title
  data JSONB NOT NULL,               -- Complete chart state
  created_at TIMESTAMP,              -- Creation timestamp
  updated_at TIMESTAMP,              -- Last update timestamp
  views INTEGER DEFAULT 0            -- View counter
);

CREATE INDEX idx_charts_created_at ON charts(created_at DESC);
```

**Storage Location:**
- Data is stored in the browser's IndexedDB
- Persists across sessions
- No server-side storage required
- Each browser has its own local database

#### Chart ID Generation

```typescript
function generateChartId(): string {
  const timestamp = Date.now().toString(36);  // Base-36 timestamp
  const random = generateRandomString(8);      // 8 random characters
  return `${timestamp}-${random}`;            // e.g., "l5x2k9-Abc123Xy"
}
```

### State Management

The renderer uses the same Zustand store as the main application:

```typescript
import { useChartStore } from '@/store/useChartStore';

// Load chart state
const loadChartState = useChartStore((state) => state.loadChartState);
loadChartState(chartData);
```

### Chart Operations

#### Save Chart

```typescript
import { saveChart } from '@/lib/chartStorage';

const chartId = await saveChart(chartData);
// Returns: "l5x2k9-Abc123Xy"
```

#### Load Chart

```typescript
import { loadChart } from '@/lib/chartStorage';

const chart = await loadChart(chartId);
// Returns: { id, title, data, created_at, updated_at, views }
```

#### List Charts

```typescript
import { listCharts } from '@/lib/chartStorage';

const charts = await listCharts(50, 0);  // limit, offset
```

#### Search Charts

```typescript
import { searchCharts } from '@/lib/chartStorage';

const results = await searchCharts('sales');
```

### URL Encoding (Legacy)

Chart data is encoded using standard URL encoding:

```typescript
const encodedData = encodeURIComponent(JSON.stringify(chartData));
const url = `/render?data=${encodedData}`;
```

### Limitations

1. **URL Length**: Very large datasets may produce URLs that exceed browser limits (typically ~2000 characters for IE, ~65,000 for modern browsers)
   - For large datasets, use file upload instead
   - Consider using URL shortening services for sharing

2. **Browser Support**: Requires modern browsers with ES6+ support

3. **Storage**: Chart data is encoded in the URL and not stored server-side

## API Reference

### ChartRenderer Component

```typescript
<ChartRenderer />
```

Props: None (reads from Zustand store)

### Load Chart State

```typescript
useChartStore.getState().loadChartState(chartState);
```

Parameters:
- `chartState`: Partial or complete chart store state

## Best Practices

1. **File Size**: Keep datasets reasonably sized for URL sharing
2. **Validation**: The renderer validates chart data before rendering
3. **Error Handling**: Displays user-friendly error messages for invalid data
4. **Security**: Sanitizes user input to prevent XSS attacks

## Examples

### Basic Bar Chart

```json
{
  "chartType": "bar",
  "data": [
    ["Month", "Sales"],
    ["Jan", 100],
    ["Feb", 150],
    ["Mar", 120]
  ],
  "columnMapping": {
    "labels": 0,
    "values": [1]
  }
}
```

### Multi-Series Line Chart

```json
{
  "chartType": "multi-line",
  "data": [
    ["Date", "Series A", "Series B"],
    ["2024-01", 10, 20],
    ["2024-02", 15, 25],
    ["2024-03", 12, 30]
  ],
  "columnMapping": {
    "labels": 0,
    "values": [1, 2]
  }
}
```

## Troubleshooting

### Chart Not Rendering

- Verify JSON file is valid
- Check that required fields are present
- Ensure data array has at least 2 rows (headers + data)

### Share Link Not Working

- URL may be too long (try file upload instead)
- Check browser console for errors
- Verify URL is properly encoded

### Styling Issues

- Ensure all required style properties are included
- Check that color values are valid CSS colors
- Verify font names are available

## Future Enhancements

- [ ] Backend storage for chart configurations
- [ ] URL shortening integration
- [ ] Real-time collaborative editing
- [ ] Chart templates gallery
- [ ] Embedding via iframe code generator
- [ ] QR code generation for mobile sharing
