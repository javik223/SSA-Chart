export type PanelId =
  | 'preview'
  | 'theme'
  | 'chartType'
  | 'controls'
  | 'colors'
  | 'lines'
  | 'labels'
  | 'divergingBar'
  | 'divergingBar'
  | 'donut'
  | 'radialBar'
  | 'radialArea'
  | 'treemap'
  | 'xAxis'
  | 'yAxis'
  | 'background'
  | 'formatting'
  | 'legend'
  | 'popups'
  | 'annotations'
  | 'animations'
  | 'zoom'
  | 'layout'
  | 'header'
  | 'footer';

export interface PanelConfig {
  id: PanelId;
  title: string;
  description: string;
  keywords: string[];
}

export const PANEL_CONFIGS: Record<PanelId, PanelConfig> = {
  preview: {
    id: 'preview',
    title: 'Preview',
    description: 'Configure preview size, colorblind modes, and theme',
    keywords: ['preview', 'size', 'colorblind', 'dark mode', 'dimensions', 'accessibility'],
  },
  theme: {
    id: 'theme',
    title: 'Theme',
    description: 'Choose a visual theme for your chart',
    keywords: ['theme', 'visual', 'style', 'appearance', 'light', 'dark'],
  },
  chartType: {
    id: 'chartType',
    title: 'Chart type',
    description: 'Select the type of chart to display',
    keywords: ['chart', 'type', 'visualization', 'graph', 'display'],
  },
  controls: {
    id: 'controls',
    title: 'Controls & filters',
    description: 'Configure interactive controls and data filters',
    keywords: ['controls', 'filters', 'interactive', 'data'],
  },
  colors: {
    id: 'colors',
    title: 'Colors',
    description: 'Customize chart color schemes',
    keywords: ['colors', 'color', 'schemes', 'palette', 'theme'],
  },
  lines: {
    id: 'lines',
    title: 'Lines, dots and areas',
    description: 'Configure line styles, markers, and fill areas',
    keywords: ['lines', 'dots', 'areas', 'markers', 'style', 'stroke'],
  },
  labels: {
    id: 'labels',
    title: 'Labels',
    description: 'Customize data point labels',
    keywords: ['labels', 'text', 'annotations', 'data points'],
  },
  divergingBar: {
    id: 'divergingBar',
    title: 'Diverging Bar Options',
    description: 'Configure diverging bar chart specific settings',
    keywords: ['diverging', 'bar', 'sort', 'gradient', 'colors', 'labels'],
  },
  donut: {
    id: 'donut',
    title: 'Donut Options',
    description: 'Configure donut chart geometry and center content',
    keywords: ['donut', 'radius', 'angle', 'center', 'total'],
  },
  radialBar: {
    id: 'radialBar',
    title: 'Radial Bar Options',
    description: 'Configure radial bar chart geometry and angles',
    keywords: ['radial', 'radius', 'angle', 'inner', 'outer'],
  },
  radialArea: {
    id: 'radialArea',
    title: 'Radial Area Options',
    description: 'Configure radial area chart geometry and curve style',
    keywords: ['radial', 'area', 'curve', 'inner', 'interpolation'],
  },
  treemap: {
    id: 'treemap',
    title: 'Treemap Options',
    description: 'Configure treemap tiling and layout',
    keywords: ['treemap', 'tile', 'squarify', 'hierarchy', 'padding'],
  },
  xAxis: {
    id: 'xAxis',
    title: 'X axis',
    description: 'Configure horizontal axis settings',
    keywords: ['x axis', 'horizontal', 'axis', 'bottom', 'categories'],
  },
  yAxis: {
    id: 'yAxis',
    title: 'Y axis',
    description: 'Configure vertical axis settings',
    keywords: ['y axis', 'vertical', 'axis', 'left', 'right', 'values'],
  },
  background: {
    id: 'background',
    title: 'Plot background',
    description: 'Set background colors and styling',
    keywords: ['background', 'plot', 'canvas', 'color'],
  },
  formatting: {
    id: 'formatting',
    title: 'Number formatting',
    description: 'Format numbers, currency, and percentages',
    keywords: ['number', 'formatting', 'format', 'currency', 'percentage', 'decimal'],
  },
  legend: {
    id: 'legend',
    title: 'Legend',
    description: 'Configure legend position and appearance',
    keywords: ['legend', 'key', 'series', 'position'],
  },
  popups: {
    id: 'popups',
    title: 'Tooltips',
    description: 'Customize chart tooltips',
    keywords: ['popups', 'panels', 'tooltips', 'hover', 'information'],
  },
  annotations: {
    id: 'annotations',
    title: 'Annotations',
    description: 'Add text and shapes to highlight data',
    keywords: ['annotations', 'text', 'shapes', 'highlight', 'notes'],
  },
  animations: {
    id: 'animations',
    title: 'Animations',
    description: 'Configure chart animation effects',
    keywords: ['animations', 'effects', 'transitions', 'motion'],
  },
  zoom: {
    id: 'zoom',
    title: 'Zoom',
    description: 'Enable interactive zoom functionality',
    keywords: ['zoom', 'interactive', 'brush', 'selection', 'pan'],
  },
  layout: {
    id: 'layout',
    title: 'Layout',
    description: 'Adjust chart layout and spacing',
    keywords: ['layout', 'spacing', 'margins', 'padding'],
  },
  header: {
    id: 'header',
    title: 'Header',
    description: 'Customize chart title and subtitle',
    keywords: ['header', 'title', 'subtitle', 'heading'],
  },
  footer: {
    id: 'footer',
    title: 'Footer',
    description: 'Customize chart footer text',
    keywords: ['footer', 'source', 'credits', 'notes'],
  },
};

export const UNIVERSAL_PANELS: PanelId[] = [
  'preview',
  'theme',
  'chartType',
  'controls',
  'colors',
  'background',
  'formatting',
  'legend',
  'popups',
  'annotations',
  'animations',
  'zoom',
  'layout',
  'header',
  'footer',
];

export const CHART_SPECIFIC_PANELS: Record<string, PanelId[]> = {
  'diverging-bar': ['divergingBar', 'xAxis', 'yAxis'],
  'treemap': ['treemap', 'labels'],
  'line': ['lines', 'xAxis', 'yAxis', 'labels'],
  'multi-line': ['lines', 'xAxis', 'yAxis', 'labels'],
  'bar': ['xAxis', 'yAxis', 'labels'],
  'column': ['xAxis', 'yAxis', 'labels'],
  'area': ['lines', 'xAxis', 'yAxis', 'labels'],
  'pie': ['labels'],
  'donut': ['donut', 'labels'],
  'scatter': ['xAxis', 'yAxis', 'labels'],
  'bubble': ['xAxis', 'yAxis', 'labels'],
  'radar': ['labels'],
  'polar': ['labels'],
  'heatmap': ['xAxis', 'yAxis', 'labels'],
  'candlestick': ['xAxis', 'yAxis'],
  'funnel': ['labels'],
  'gauge': ['labels'],
  'sankey': ['labels'],
  'chord': ['labels'],
  'choropleth': ['labels'],
  'bubble-map': ['labels'],
  'radial-bar': ['radialBar', 'labels'],
  'radial-stacked-bar': ['radialBar', 'labels'],
  'radial-area': ['radialArea', 'labels', 'xAxis', 'yAxis'],
};

export const EXCLUDED_PANELS: Record<string, PanelId[]> = {
  'treemap': ['zoom'],
};
