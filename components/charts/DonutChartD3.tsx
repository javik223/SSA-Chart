'use client';

import { PieChartD3 } from './PieChartD3';

interface DonutChartD3Props {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  innerRadiusRatio?: number; // Ratio of inner radius to outer radius (0-1), default 0.5
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
  colors,
  colorMode,
  legendShow,
  legendPosition,
  legendAlignment,
  legendFontSize,
  legendShowValues,
  legendGap,
  legendPaddingTop,
  legendPaddingRight,
  legendPaddingBottom,
  legendPaddingLeft,
}: DonutChartD3Props) {
  return (
    <PieChartD3
      data={data}
      labelKey={labelKey}
      valueKeys={valueKeys}
      innerRadius={innerRadiusRatio}
      width={width}
      height={height}
      colors={colors}
      colorMode={colorMode}
      legendShow={legendShow}
      legendPosition={legendPosition}
      legendAlignment={legendAlignment}
      legendFontSize={legendFontSize}
      legendShowValues={legendShowValues}
      legendGap={legendGap}
      legendPaddingTop={legendPaddingTop}
      legendPaddingRight={legendPaddingRight}
      legendPaddingBottom={legendPaddingBottom}
      legendPaddingLeft={legendPaddingLeft}
    />
  );
}
