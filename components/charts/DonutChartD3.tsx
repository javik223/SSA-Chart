'use client';

import { PieChartD3 } from './PieChartD3';

interface DonutChartD3Props {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  innerRadiusRatio?: number; // Ratio of inner radius to outer radius (0-1), default 0.5
  width?: number;
  height?: number;
  legendShow?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendAlignment?: 'start' | 'center' | 'end';
  legendFontSize?: number;
  legendShowValues?: boolean;
}

/**
 * Donut Chart - A pie chart with a hollow center
 * This is a convenience wrapper around PieChartD3 with a preset innerRadius
 */
export function DonutChartD3({
  data,
  labelKey,
  valueKeys,
  innerRadiusRatio = 0.5,
  width,
  height,
  legendShow,
  legendPosition,
  legendAlignment,
  legendFontSize,
  legendShowValues,
}: DonutChartD3Props) {
  return (
    <PieChartD3
      data={data}
      labelKey={labelKey}
      valueKeys={valueKeys}
      innerRadius={innerRadiusRatio}
      width={width}
      height={height}
      legendShow={legendShow}
      legendPosition={legendPosition}
      legendAlignment={legendAlignment}
      legendFontSize={legendFontSize}
      legendShowValues={legendShowValues}
    />
  );
}
