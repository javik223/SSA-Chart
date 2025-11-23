import { BaseChartProps, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';

export interface ChartLayout {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  innerWidth: number;
  innerHeight: number;
}

export function calculateChartLayout(
  props: BaseChartProps,
  defaultWidth = 800,
  defaultHeight = 600
): ChartLayout {
  const {
    width = defaultWidth,
    height = defaultHeight,
    legendShow = true,
    legendPosition = 'right',
    xAxisShow = true,
    xAxisPosition = 'bottom',
    xAxisTitlePadding = 35,
    xAxisLabelSpacing = 3,
    yAxis = DEFAULT_Y_AXIS_CONFIG,
  } = props;

  // Reserve space for legend based on position
  const legendSpace = legendShow ? 120 : 0;
  const margin = {
    top: legendPosition === 'top' ? legendSpace : 0,
    right: legendPosition === 'right' ? legendSpace : 40,
    bottom: legendPosition === 'bottom' ? legendSpace : 40,
    left: legendPosition === 'left' ? legendSpace : 50,
  };

  // Add minimal space for axes when legend isn't on that side
  if (legendPosition !== 'bottom')
    margin.bottom = Math.max(margin.bottom, 40);
  if (legendPosition !== 'left')
    margin.left = Math.max(margin.left, 50);

  // Adjust margins for axis titles and labels
  if (xAxisShow && xAxisPosition !== 'hidden') {
    const xAxisTickSize = props.xAxisTickSize ?? 6;
    const xAxisTickPadding = props.xAxisTickPadding ?? 8;
    const xAxisLabelSize = props.xAxisLabelSize ?? 12;
    
    // Calculate total space needed:
    // tick size + tick padding + label height + label spacing + title padding + title size
    const labelHeight = xAxisLabelSize * 1.2; // Account for line height
    const titleSize = props.xAxisTitleSize ?? 12;
    const totalSpace = xAxisTickSize + xAxisTickPadding + labelHeight + xAxisLabelSpacing + xAxisTitlePadding + titleSize;
    
    if (xAxisPosition === 'bottom')
      margin.bottom += totalSpace;
    if (xAxisPosition === 'top')
      margin.top += totalSpace;
  }

  if (yAxis.show && yAxis.position !== 'hidden') {
    // Calculate total space needed for Y-axis:
    // tick length + tick padding + estimated label width + label spacing + title padding + title size
    const estimatedLabelWidth = yAxis.labelSize * 4; // Rough estimate for numeric labels
    const totalSpace = (yAxis.tickLength || 6) + (yAxis.tickPadding || 3) + estimatedLabelWidth + (yAxis.labelSpacing || 4) + (yAxis.titlePadding || 10) + (yAxis.titleSize || 12);
    
    if (yAxis.position === 'left')
      margin.left += totalSpace;
    if (yAxis.position === 'right')
      margin.right += totalSpace;
  }

  // Add edge padding
  margin.top += yAxis.edgePadding;
  margin.bottom += yAxis.edgePadding;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  return {
    margin,
    innerWidth,
    innerHeight,
  };
}
