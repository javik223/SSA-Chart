'use client';

import { PieChart } from './PieChart';

interface DonutChartProps {
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
  onSliceClick?: (index: number, label: string, value: number) => void;
  onSliceHover?: (index: number | null, label: string | null, value: number | null) => void;
  forceRenderer?: 'svg' | 'canvas';
}

/**
 * DonutChart - A PieChart with a hollow center
 *
 * This is a convenience wrapper around PieChart with a preset innerRadius of 0.6.
 * The center displays the total value.
 */
export function DonutChart(props: DonutChartProps) {
  return <PieChart {...props} innerRadius={0.6} />;
}
