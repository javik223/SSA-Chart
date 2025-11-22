'use client';

import { AreaChartD3 } from './AreaChartD3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';

interface AreaChartProps {
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
 * AreaChart component using SVG rendering via D3.js
 *
 * Provides high-quality, scalable area charts with:
 * - Crisp rendering at any resolution
 * - CSS styling support
 * - Easy export to SVG/PNG
 * - Accessible and inspectable DOM
 */
export function AreaChart( props: AreaChartProps ) {
  return <AreaChartD3 { ...props } yAxis={ props.yAxis || DEFAULT_Y_AXIS_CONFIG } />;
}

// Re-export D3 component for direct use
export { AreaChartD3 };
