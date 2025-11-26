/**
 * Chart Registrations
 *
 * This file registers all available chart types with the chart registry.
 * To add a new chart:
 * 1. Create the chart component in components/charts/
 * 2. Import it here
 * 3. Call registerChart() with the chart metadata
 */

import { registerCharts } from './chartRegistry';
// SVG-based D3.js chart components for high-quality, scalable rendering
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { AreaChart } from '@/components/charts/AreaChart';
import { PieChart } from '@/components/charts/PieChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { SunburstChart } from '@/components/charts/SunburstChart';
import { CircularBarPlotChart } from '@/components/charts/CircularBarPlotChart';
import { RadialBarChart } from '@/components/charts/RadialBarChart';
import { PolarAreaChart } from '@/components/charts/PolarAreaChart';
import { RadarChart } from '@/components/charts/RadarChart';
import { DivergingBarChart } from '@/components/charts/DivergingBarChart';
import { TreemapChart } from '@/components/charts/TreemapChart';

/**
 * Register all charts
 * This function is called once at app initialization
 */
export function initializeCharts() {
  registerCharts([
    // ============================================
    // Line, Bar, and Pie Charts
    // ============================================
    {
      type: 'line',
      name: 'Line chart',
      category: 'line-bar-pie',
      description: 'Show trends over time or categories',
      component: LineChart,
      supportsMultipleSeries: true,
      supportsAnimation: true,
      status: 'stable',
      tags: ['trend', 'time-series', 'continuous'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'line-stacked',
      name: 'Line chart (stacked)',
      category: 'line-bar-pie',
      description: 'Stacked lines showing cumulative values',
      component: LineChart, // Will need separate component
      supportsMultipleSeries: true,
      supportsAnimation: true,
      status: 'coming-soon',
      tags: ['trend', 'stacked', 'cumulative'],
    },
    {
      type: 'area',
      name: 'Area chart',
      category: 'line-bar-pie',
      description: 'Line chart with filled area below',
      component: AreaChart,
      supportsMultipleSeries: true,
      supportsAnimation: true,
      status: 'stable',
      tags: ['trend', 'filled', 'continuous'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'bar',
      name: 'Bar chart',
      category: 'line-bar-pie',
      description: 'Compare values across categories',
      component: BarChart,
      supportsMultipleSeries: true,
      supportsAnimation: true,
      status: 'stable',
      tags: ['comparison', 'categorical', 'horizontal'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'column',
      name: 'Column chart',
      category: 'line-bar-pie',
      description: 'Vertical bar chart for comparing values',
      component: BarChart, // Can reuse with orientation prop
      supportsMultipleSeries: true,
      supportsAnimation: true,
      status: 'stable',
      tags: ['comparison', 'categorical', 'vertical'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'pie',
      name: 'Pie chart',
      category: 'line-bar-pie',
      description: 'Show proportions of a whole as slices',
      component: PieChart,
      supportsMultipleSeries: false,
      supportsAnimation: true,
      status: 'stable',
      tags: ['proportion', 'percentage', 'composition', 'parts-of-whole'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'donut',
      name: 'Donut chart',
      category: 'line-bar-pie',
      description: 'Pie chart with a hollow center, showing total in middle',
      component: DonutChart,
      supportsMultipleSeries: false,
      supportsAnimation: true,
      status: 'stable',
      tags: ['proportion', 'percentage', 'composition', 'ring', 'parts-of-whole'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'sunburst',
      name: 'Sunburst chart',
      category: 'line-bar-pie',
      description: 'Visualize hierarchical data with zoomable rings',
      component: SunburstChart,
      supportsMultipleSeries: false,
      supportsAnimation: true,
      status: 'stable',
      tags: ['hierarchy', 'proportion', 'zoomable', 'radial'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'circular-barplot',
      name: 'Circular bar plot',
      category: 'line-bar-pie',
      description: 'Display data as bars arranged in a circle',
      component: CircularBarPlotChart,
      supportsMultipleSeries: true,
      supportsAnimation: false,
      status: 'stable',
      tags: ['circular', 'radial', 'bar', 'comparison'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'radial-bar',
      name: 'Radial bar chart',
      category: 'line-bar-pie',
      description: 'Stacked bars arranged in a circular layout',
      component: RadialBarChart,
      supportsMultipleSeries: true,
      supportsAnimation: false,
      status: 'stable',
      tags: ['radial', 'circular', 'stacked', 'comparison'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'polar-area',
      name: 'Polar area chart',
      category: 'line-bar-pie',
      description: 'Like a pie chart but with varying radii',
      component: PolarAreaChart,
      supportsMultipleSeries: false,
      supportsAnimation: false,
      status: 'stable',
      tags: ['polar', 'radial', 'area', 'proportion'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'radar',
      name: 'Radar chart',
      category: 'line-bar-pie',
      description: 'Spider/radar chart for multivariate data',
      component: RadarChart,
      supportsMultipleSeries: true,
      supportsAnimation: false,
      status: 'stable',
      tags: ['radar', 'spider', 'multivariate', 'comparison'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'diverging-bar',
      name: 'Diverging bar chart',
      category: 'line-bar-pie',
      description: 'Compare positive and negative values from a central baseline',
      component: DivergingBarChart,
      supportsMultipleSeries: false,
      supportsAnimation: true,
      status: 'stable',
      tags: ['diverging', 'comparison', 'positive-negative', 'variance'],
      requiredColumns: {
        label: true,
        value: true,
      },
    },
    {
      type: 'treemap',
      name: 'Treemap',
      category: 'hierarchical-network',
      description: 'Visualize hierarchical data using nested rectangles',
      component: TreemapChart,
      supportsMultipleSeries: false,
      supportsAnimation: true,
      status: 'stable',
      tags: ['hierarchy', 'part-to-whole', 'tiling', 'nested'],
      requiredColumns: {
        label: true,
        value: true,
        category: true,
      },
    },

    // Additional chart types can be added here as they're implemented
    // Example template for new chart:
    // {
    //   type: 'scatter',
    //   name: 'Scatter plot',
    //   category: 'scatter-distribution',
    //   description: 'Show correlation between two variables',
    //   component: ScatterChartD3,
    //   supportsMultipleSeries: false,
    //   supportsAnimation: true,
    //   status: 'stable',
    //   tags: ['correlation', 'distribution', 'xy'],
    //   requiredColumns: {
    //     label: false,
    //     value: true,
    //   },
    // },
  ]);

  // You can also register charts conditionally based on feature flags:
  // if (process.env.NEXT_PUBLIC_ENABLE_EXPERIMENTAL_CHARTS === 'true') {
  //   registerChart({ ... });
  // }
}

/**
 * Get a user-friendly status badge text
 */
export function getStatusLabel(status?: string): string {
  switch (status) {
    case 'stable':
      return '';
    case 'beta':
      return 'Beta';
    case 'experimental':
      return 'Experimental';
    case 'coming-soon':
      return 'Coming Soon';
    default:
      return '';
  }
}
