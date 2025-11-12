# Adding New Charts to Claude Charts

This guide explains how to add new chart types to Claude Charts using the chart registry system.

## Quick Start

To add a new chart, you only need to:
1. Create the chart component
2. Register it in `lib/chartRegistrations.ts`

That's it! No need to modify dropdowns, switch statements, or other UI components.

## Step-by-Step Guide

### 1. Create Your Chart Component

Create a new file in `components/charts/` (e.g., `ScatterChartD3.tsx`):

```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartComponentProps } from '@/lib/chartRegistry';

export function ScatterChartD3({ data, labelKey, valueKeys }: ChartComponentProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Your D3.js chart rendering code here
    const svg = d3.select(svgRef.current);
    // ... implement your chart
  }, [data, labelKey, valueKeys]);

  return (
    <div className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
```

### 2. Register Your Chart

Open `lib/chartRegistrations.ts` and add your chart to the `registerCharts()` array:

```typescript
import { ScatterChartD3 } from '@/components/charts/ScatterChartD3';

export function initializeCharts() {
  registerCharts([
    // ... existing charts

    // Add your new chart
    {
      type: 'scatter',
      name: 'Scatter plot',
      category: 'scatter-distribution',
      description: 'Show correlation between two variables',
      component: ScatterChartD3,
      supportsMultipleSeries: false,
      supportsAnimation: true,
      status: 'stable', // or 'beta', 'experimental', 'coming-soon'
      tags: ['correlation', 'distribution', 'xy'],
      requiredColumns: {
        label: false,
        value: true,
      },
    },
  ]);
}
```

### 3. Done!

Your chart will automatically appear in:
- ✅ The chart type dropdown (organized by category)
- ✅ The chart rendering engine
- ✅ All search and filter functionality

## Chart Registration Options

### Required Fields

- **type**: The unique chart type identifier (must match a `ChartType` in `types/chart.ts`)
- **name**: Display name shown in the dropdown
- **category**: Which category this chart belongs to
- **component**: The React component to render

### Optional Fields

- **description**: Brief description of the chart (used for tooltips/help)
- **icon**: Icon name or path (for future icon support)
- **thumbnail**: Preview image path (for gallery view)
- **supportsMultipleSeries**: Whether the chart can show multiple data series
- **supportsAnimation**: Whether the chart supports animations
- **requiresGeospatial**: Whether the chart needs lat/long data
- **requiresHierarchical**: Whether the chart needs hierarchical data
- **minDataPoints**: Minimum number of data points required
- **requiredColumns**: Specify which columns are required (label, value, category, etc.)
- **status**:
  - `'stable'` (default) - Production ready
  - `'beta'` - Feature complete but testing
  - `'experimental'` - Work in progress
  - `'coming-soon'` - Shows disabled with "Coming Soon" badge
- **tags**: Array of searchable keywords

## Chart Status Badges

Charts with non-stable status automatically get badges in the dropdown:
- Beta → Shows "Beta" badge
- Experimental → Shows "Experimental" badge
- Coming Soon → Shows "Coming Soon" badge and disables selection

## Component Props

Your chart component receives these props:

```typescript
interface ChartComponentProps {
  data: any[];           // Transformed data array
  labelKey: string;      // Column name for labels
  valueKeys: string[];   // Column names for values
  config?: any;          // Optional custom config
}
```

## Categories

Available categories (defined in `lib/chartRegistry.ts`):

1. **line-bar-pie** - Line, Bar, and Pie Charts
2. **scatter-distribution** - Scatter and Distribution
3. **hierarchical-network** - Hierarchical and Network
4. **maps-geospatial** - Maps and Geospatial
5. **advanced-composite** - Advanced and Composite

## Advanced Features

### Conditional Registration

Register charts based on feature flags:

```typescript
if (process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL === 'true') {
  registerChart({
    type: 'my-experimental-chart',
    // ...
  });
}
```

### Multiple Variants

Register multiple variants of the same chart:

```typescript
registerCharts([
  {
    type: 'bar',
    name: 'Bar chart',
    component: BarChartD3,
    // ...
  },
  {
    type: 'bar-stacked',
    name: 'Bar chart (stacked)',
    component: BarChartD3,
    // Can use the same component with different config
    // ...
  },
]);
```

### Dynamic Chart Discovery

The registry supports dynamic queries:

```typescript
import { chartRegistry } from '@/lib/chartRegistry';

// Get all stable charts
const stableCharts = chartRegistry.getStable();

// Search charts
const searchResults = chartRegistry.search('scatter');

// Get charts by category
const scatterCharts = chartRegistry.getByCategory('scatter-distribution');
```

## File Structure

```
/lib
  /chartRegistry.ts         # Registry infrastructure
  /chartRegistrations.ts    # All chart registrations

/components
  /charts
    /LineChartD3.tsx        # Chart implementations
    /BarChartD3.tsx
    /ScatterChartD3.tsx
    # ... add new charts here

  /ChartInitializer.tsx     # Auto-initializes registry
  /chart-settings.tsx       # Auto-generates dropdown
  /charts/BasicChart.tsx    # Auto-renders from registry
```

## Best Practices

1. **One chart per file** - Keep chart components focused and maintainable
2. **Use TypeScript** - Leverage type safety with `ChartComponentProps`
3. **Mark status correctly** - Don't mark as 'stable' until fully tested
4. **Add descriptive tags** - Helps users find your chart
5. **Document data requirements** - Use `requiredColumns` to specify needs
6. **Handle edge cases** - Check for empty data, missing columns, etc.

## Example: Adding a Complete Chart

```typescript
// 1. Create components/charts/BubbleChartD3.tsx
export function BubbleChartD3({ data, labelKey, valueKeys }: ChartComponentProps) {
  // Implementation
}

// 2. Register in lib/chartRegistrations.ts
import { BubbleChartD3 } from '@/components/charts/BubbleChartD3';

export function initializeCharts() {
  registerCharts([
    // ... existing charts
    {
      type: 'bubble',
      name: 'Bubble chart',
      category: 'scatter-distribution',
      description: 'Show three dimensions of data with x, y, and size',
      component: BubbleChartD3,
      supportsMultipleSeries: true,
      supportsAnimation: true,
      status: 'stable',
      tags: ['scatter', 'bubble', 'three-dimensional', 'size'],
      requiredColumns: {
        label: false,
        value: true,
        category: true,
      },
      minDataPoints: 3,
    },
  ]);
}

// 3. Done! Chart automatically appears everywhere
```

## Troubleshooting

### Chart doesn't appear in dropdown
- Check that `initializeCharts()` is being called (it should be in `ChartInitializer`)
- Verify the chart `type` matches a type in `types/chart.ts`
- Check browser console for registration warnings

### Chart renders incorrectly
- Verify your component receives and handles the props correctly
- Check that `data`, `labelKey`, and `valueKeys` are being used
- Test with sample data

### TypeScript errors
- Ensure your chart type exists in `types/chart.ts`
- Update `ChartType` union if adding a completely new type
- Check that component props match `ChartComponentProps`

## Need Help?

- See existing charts in `components/charts/` for examples
- Check `types/chart.ts` for type definitions
- Review `lib/chartRegistry.ts` for registry API
