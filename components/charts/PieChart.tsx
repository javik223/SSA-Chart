'use client';

import { PieChartD3 } from './PieChartD3';

interface PieChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  innerRadius?: number;
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
}

/**
 * PieChart component using SVG rendering via D3.js
 *
 * Provides high-quality, scalable pie/donut charts with:
 * - Crisp rendering at any resolution
 * - CSS styling support
 * - Easy export to SVG/PNG
 * - Smooth animations and transitions
 * - Accessible and inspectable DOM
 */
export function PieChart(props: PieChartProps) {
  return <PieChartD3 {...props} />;
}

// Re-export D3 component for direct use
export { PieChartD3 };
