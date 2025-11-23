'use client';

import { LineChartD3 } from './LineChartD3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorMode?: 'by-column' | 'by-row';
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
  yAxis?: YAxisConfig;
}

/**
 * LineChart component using SVG rendering via D3.js
 *
 * Provides high-quality, scalable line charts with:
 * - Crisp rendering at any resolution
 * - CSS styling support
 * - Easy export to SVG/PNG
 * - Accessible and inspectable DOM
 */
export function LineChart( props: LineChartProps ) {
  return (
    <LineChartD3 { ...props } yAxis={ props.yAxis || DEFAULT_Y_AXIS_CONFIG } />
  );
}

// Re-export D3 component for direct use
export { LineChartD3 };
