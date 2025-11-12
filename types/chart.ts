/**
 * Chart type definitions for Claude Charts
 */

export type ChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'column'
  | 'pie'
  | 'donut'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'treemap'
  | 'sunburst'
  | 'sankey'
  | 'network'
  | 'choropleth'
  | 'histogram'
  | 'waterfall'
  | 'boxplot'
  | 'violin';

export type ChartCategory =
  | 'line-bar-pie'
  | 'scatter-distribution'
  | 'hierarchical-network'
  | 'maps-geospatial'
  | 'advanced-composite';

export interface ChartData {
  labels: string[];
  datasets: DatasetConfig[];
}

export interface DatasetConfig {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartConfig {
  type: ChartType;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  animation?: AnimationConfig;
  axes?: AxesConfig;
  legend?: LegendConfig;
  colors?: string[];
  theme?: 'light' | 'dark';
}

export interface AnimationConfig {
  enabled: boolean;
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface AxesConfig {
  x?: AxisConfig;
  y?: AxisConfig;
}

export interface AxisConfig {
  label?: string;
  show?: boolean;
  grid?: boolean;
  format?: string;
}

export interface LegendConfig {
  show?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export interface ChartExport {
  format: 'png' | 'svg' | 'json' | 'iframe';
  quality?: number;
  scale?: number;
}
