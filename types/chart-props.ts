/**
 * Shared type definitions for chart components
 */

import { YAxisConfig } from './chart-types';

/**
 * Common legend properties shared across all charts
 */
export interface LegendProps {
  legendShow?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendAlignment?: 'start' | 'center' | 'end';
  legendFontSize?: number;
  legendShowValues?: boolean;
  legendGap?: number;
  legendPaddingTop?: number;
  legendPaddingRight?: number;
  legendPaddingBottom?: number;
  legendPaddingLeft?: number;
}

/**
 * Common X-axis properties shared across all charts
 */
export interface XAxisProps {
  xAxisShow?: boolean;
  xAxisTitle?: string;
  xAxisShowGrid?: boolean;
  xAxisShowDomain?: boolean;
  xAxisTickCount?: number | null;
  xAxisTickSize?: number;
  xAxisTickPadding?: number;
  xAxisLabelRotation?: number;
  xAxisTickFormat?: string;
  xAxisPosition?: 'bottom' | 'top' | 'hidden';
  xAxisScaleType?: 'linear' | 'log' | 'time' | 'band' | 'point';
  xAxisMin?: number | null;
  xAxisMax?: number | null;
  xAxisTitleType?: 'auto' | 'custom';
  xAxisTitleWeight?: 'bold' | 'regular';
  xAxisTitleColor?: string;
  xAxisTitleSize?: number;
  xAxisTitlePadding?: number;
  xAxisTitleAlignment?: 'start' | 'center' | 'end';
  xAxisTitleArrow?: boolean;
  xAxisTickPosition?: 'outside' | 'inside' | 'cross';
  xAxisLabelWeight?: 'bold' | 'regular';
  xAxisLabelColor?: string;
  xAxisLabelSize?: number;
  xAxisLabelSpacing?: number;
  xAxisGridColor?: string;
  xAxisGridWidth?: number;
  xAxisGridOpacity?: number;
  xAxisGridDashArray?: string;
}

/**
 * Base chart properties shared across all chart types
 */
export interface BaseChartProps extends LegendProps, XAxisProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorMode?: 'by-column' | 'by-row';
  yAxis?: YAxisConfig;
}

/**
 * Chart dimensions and margins
 */
export interface ChartDimensions {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

/**
 * Configuration for margin calculation
 */
export interface MarginConfig {
  width: number;
  height: number;
  legendShow: boolean;
  legendPosition: 'top' | 'right' | 'bottom' | 'left';
  xAxisShow: boolean;
  xAxisPosition: 'bottom' | 'top' | 'hidden';
  xAxisTitlePadding: number;
  xAxisLabelSpacing: number;
  xAxisTickSize?: number;
  xAxisTickPadding?: number;
  xAxisLabelSize?: number;
  xAxisTitleSize?: number;
  yAxis: YAxisConfig;
}
