/**
 * Chart Helper Utilities
 * 
 * Shared functions for rendering common chart elements across different chart types.
 * This reduces code duplication and ensures consistency.
 */

import * as d3 from 'd3';
import { YAxisConfig } from '@/types/chart-types';
import { ChartDimensions, MarginConfig } from '@/types/chart-props';

/**
 * Calculate chart margins based on legend position and axis settings
 */
export function calculateChartMargins(config: MarginConfig): ChartDimensions {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const legendSpace = 120;

  // Adjust margins for legend
  if (config.legendShow) {
    if (config.legendPosition === 'top') margin.top += legendSpace;
    if (config.legendPosition === 'bottom') margin.bottom += legendSpace;
    if (config.legendPosition === 'left') margin.left += legendSpace;
    if (config.legendPosition === 'right') margin.right += legendSpace;
  }

  // Default margins if legend is not taking up space
  if (config.legendPosition !== 'bottom') margin.bottom = Math.max(margin.bottom, 40);
  if (config.legendPosition !== 'left') margin.left = Math.max(margin.left, 50);

  // Adjust margins for axis titles and labels
  if (config.xAxisShow && config.xAxisPosition !== 'hidden') {
    if (config.xAxisPosition === 'bottom') margin.bottom += config.xAxisTitlePadding + config.xAxisLabelSpacing;
    if (config.xAxisPosition === 'top') margin.top += config.xAxisTitlePadding + config.xAxisLabelSpacing;
  }

  if (config.yAxis.show && config.yAxis.position !== 'hidden') {
    if (config.yAxis.position === 'left') margin.left += config.yAxis.titlePadding + config.yAxis.labelSpacing;
    if (config.yAxis.position === 'right') margin.right += config.yAxis.titlePadding + config.yAxis.labelSpacing;
  }

  // Add edge padding
  margin.top += config.yAxis.edgePadding;
  margin.bottom += config.yAxis.edgePadding;

  return {
    width: config.width,
    height: config.height,
    innerWidth: config.width - margin.left - margin.right,
    innerHeight: config.height - margin.top - margin.bottom,
    margin
  };
}

/**
 * Create a clip path for the chart area
 */
export function createClipPath(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  innerWidth: number,
  innerHeight: number
): string {
  const clipId = `clip-${Math.random().toString(36).substr(2, 9)}`;
  svg.append('defs')
    .append('clipPath')
    .attr('id', clipId)
    .append('rect')
    .attr('width', innerWidth)
    .attr('height', innerHeight);
  return clipId;
}

/**
 * Get X position for a data point based on scale type
 */
export function getXPosition(
  d: any,
  labelKey: string,
  xScale: any,
  xAxisScaleType: 'linear' | 'log' | 'time' | 'band' | 'point'
): number {
  let value: any;

  if (xAxisScaleType === 'linear') {
    value = Number(d[labelKey]);
  } else if (xAxisScaleType === 'time') {
    value = new Date(d[labelKey]);
  } else {
    value = String(d[labelKey]);
  }

  const pos = xScale(value as any) || 0;

  // Add bandwidth offset for point/band scales
  if ('bandwidth' in xScale) {
    return pos + (xScale.bandwidth() / 2);
  }
  return pos;
}

interface XAxisConfig {
  xScale: any;
  innerWidth: number;
  innerHeight: number;
  xAxisShow: boolean;
  xAxisPosition: 'bottom' | 'top' | 'hidden';
  xAxisTickSize: number;
  xAxisTickPadding: number;
  xAxisTickCount?: number | null;
  xAxisTickFormat?: string;
  xAxisScaleType: 'linear' | 'log' | 'time' | 'band' | 'point';
  xAxisLabelSize: number;
  xAxisLabelWeight: 'bold' | 'regular';
  xAxisLabelColor: string;
  xAxisLabelRotation: number;
  xAxisLabelSpacing: number;
  xAxisTitle?: string;
  xAxisTitleSize: number;
  xAxisTitleWeight: 'bold' | 'regular';
  xAxisTitleColor: string;
  xAxisTitlePadding: number;
  xAxisShowDomain: boolean;
}

/**
 * Render X-axis with all settings
 */
export function renderXAxis(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  config: XAxisConfig
): void {
  if (!config.xAxisShow || config.xAxisPosition === 'hidden') return;

  const axisFn = config.xAxisPosition === 'top' 
    ? d3.axisTop(config.xScale as any) 
    : d3.axisBottom(config.xScale as any);
  
  const axis = axisFn
    .tickSize(config.xAxisTickSize)
    .tickPadding(config.xAxisTickPadding);

  if (config.xAxisTickCount) axis.ticks(config.xAxisTickCount);
  
  if (config.xAxisTickFormat) {
    if (config.xAxisScaleType === 'time') {
      axis.tickFormat(d3.timeFormat(config.xAxisTickFormat) as any);
    } else {
      try { 
        axis.tickFormat(d3.format(config.xAxisTickFormat) as any); 
      } catch (e) { 
        // Invalid format, ignore
      }
    }
  }

  const yPosition = config.xAxisPosition === 'top' ? 0 : config.innerHeight;

  const xAxisGroup = g.append('g')
    .attr('transform', `translate(0,${yPosition})`)
    .call(axis)
    .style('font-size', `${config.xAxisLabelSize}px`)
    .style('font-weight', config.xAxisLabelWeight)
    .style('color', config.xAxisLabelColor);

  // Apply label rotation
  if (config.xAxisLabelRotation !== 0) {
    const rotation = config.xAxisLabelRotation;
    const isBottomAxis = config.xAxisPosition !== 'top';

    xAxisGroup.selectAll('text')
      .each(function() {
        const text = d3.select(this);
        const x = parseFloat(text.attr('x') || '0');
        const y = parseFloat(text.attr('y') || '0');
        
        text.attr('transform', `translate(${x}, ${y}) rotate(${rotation})`);
        text.attr('x', 0);
        text.attr('y', 0);
      })
      .style('text-anchor', isBottomAxis 
        ? (rotation > 0 ? 'start' : 'end') 
        : (rotation > 0 ? 'end' : 'start'))
      .attr('dx', isBottomAxis
        ? (rotation > 0 ? '0.5em' : '-0.5em')
        : (rotation > 0 ? '-0.5em' : '0.5em'))
      .attr('dy', '0.32em');
  }

  // Apply label spacing (but not if rotation is applied, as it has its own dy)
  if (config.xAxisLabelRotation === 0) {
    xAxisGroup.selectAll('.tick text')
      .attr('dy', config.xAxisPosition === 'top' ? `-${config.xAxisLabelSpacing}px` : `${config.xAxisLabelSpacing}px`);
  }

  // Add X axis title
  if (config.xAxisTitle) {
    const titleY = config.xAxisPosition === 'top'
      ? -config.xAxisTitlePadding
      : config.innerHeight + config.xAxisTitlePadding;

    g.append('text')
      .attr('x', config.innerWidth / 2)
      .attr('y', titleY)
      .style('text-anchor', 'middle')
      .style('font-size', `${config.xAxisTitleSize}px`)
      .style('font-weight', config.xAxisTitleWeight)
      .style('fill', config.xAxisTitleColor)
      .text(config.xAxisTitle);
  }

  // Hide domain line if needed
  if (!config.xAxisShowDomain) {
    xAxisGroup.select('.domain').remove();
  }
}

interface RenderYAxisConfig {
  yScale: any;
  innerWidth: number;
  innerHeight: number;
  yAxis: YAxisConfig;
}

/**
 * Render Y-axis with all settings
 */
export function renderYAxis(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  config: RenderYAxisConfig
): void {
  const yAxis = config.yAxis;
  if (!yAxis.show || yAxis.position === 'hidden') return;

  const yAxisFunction = yAxis.position === 'left' 
    ? d3.axisLeft(config.yScale) 
    : d3.axisRight(config.yScale);
  
  const axis = yAxisFunction
    .tickSize(yAxis.tickSize)
    .tickPadding(yAxis.tickPadding)
    .ticks(yAxis.tickCount ?? 10);

  // Apply tick format if provided
  if (yAxis.tickFormat) {
    try {
      axis.tickFormat(d3.format(yAxis.tickFormat) as any);
    } catch (e) {
      console.warn('Invalid Y-axis tick format:', yAxis.tickFormat);
    }
  }

  const yAxisGroup = g.append('g')
    .attr('transform', `translate(${yAxis.position === 'left' ? 0 : config.innerWidth},0)`)
    .style('font-size', `${yAxis.labelSize}px`)
    .style('font-weight', yAxis.labelWeight)
    .style('color', yAxis.labelColor);

  // Apply axis with transition for smooth zoom animation
  yAxisGroup.transition()
    .duration(300)
    .call(axis);

  // Apply tick position
  if (yAxis.tickPosition === 'inside') {
    yAxisGroup.selectAll('.tick line')
      .attr('x2', yAxis.position === 'left' ? yAxis.tickSize : -yAxis.tickSize);
  } else if (yAxis.tickPosition === 'cross') {
    yAxisGroup.selectAll('.tick line')
      .attr('x1', yAxis.position === 'left' ? yAxis.tickSize / 2 : -yAxis.tickSize / 2)
      .attr('x2', yAxis.position === 'left' ? -yAxis.tickSize / 2 : yAxis.tickSize / 2);
  }

  // Apply label rotation
  if (yAxis.labelAngle !== 0) {
    yAxisGroup.selectAll('text')
      .attr('transform', `rotate(${yAxis.labelAngle})`)
      .style('text-anchor', yAxis.labelAngle < 0 ? 'end' : 'start');
  }

  // Add Y axis title
  if (yAxis.title) {
    const titleX = yAxis.position === 'left' ? -yAxis.titlePadding : config.innerWidth + yAxis.titlePadding;
    const titleY = config.innerHeight / 2;
    g.append('text')
      .attr('transform', `translate(${titleX},${titleY}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .style('font-size', `${yAxis.titleSize}px`)
      .style('font-weight', yAxis.titleWeight)
      .style('fill', yAxis.titleColor)
      .text(yAxis.title);
  }

  // Hide domain line if needed
  if (!yAxis.showDomain) {
    yAxisGroup.select('.domain').remove();
  }

  // Apply axis line color/width if shown
  if (yAxis.showDomain) {
    yAxisGroup.select('.domain')
      .attr('stroke', yAxis.lineColor)
      .attr('stroke-width', yAxis.lineWidth);
  }
}

interface GridConfig {
  xScale?: any;
  yScale?: any;
  innerWidth: number;
  innerHeight: number;
  xAxisShowGrid?: boolean;
  xAxisGridColor?: string;
  xAxisGridWidth?: number;
  xAxisGridOpacity?: number;
  xAxisGridDashArray?: string;
  xAxisTickCount?: number | null;
  yAxis?: YAxisConfig;
}

/**
 * Render X-axis grid lines
 */
export function renderXGrid(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  config: GridConfig
): void {
  if (!config.xAxisShowGrid || !config.xScale) return;

  const grid = g.append('g')
    .attr('class', 'x-grid')
    .attr('transform', `translate(0,${config.innerHeight})`)
    .attr('opacity', config.xAxisGridOpacity ?? 0.5);

  const gridAxis = d3.axisBottom(config.xScale as any)
    .tickSize(-config.innerHeight)
    .tickFormat(() => '');

  if (config.xAxisTickCount) gridAxis.ticks(config.xAxisTickCount);

  grid.call(gridAxis);

  grid.selectAll('line')
    .attr('stroke', config.xAxisGridColor ?? '#e5e7eb')
    .attr('stroke-width', config.xAxisGridWidth ?? 1)
    .attr('stroke-dasharray', config.xAxisGridDashArray ?? '0');

  grid.select('.domain').remove();
}

/**
 * Render Y-axis grid lines
 */
export function renderYGrid(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  config: GridConfig
): void {
  if (!config.yAxis?.showGrid || !config.yScale) return;

  const grid = g.append('g')
    .attr('class', 'y-grid')
    .attr('opacity', 0.5);

  const gridAxis = d3.axisLeft(config.yScale)
    .tickSize(-config.innerWidth)
    .tickFormat(() => '')
    .ticks(config.yAxis.tickCount ?? 10);

  // Apply grid with transition for smooth zoom animation
  grid.transition()
    .duration(300)
    .call(gridAxis);

  grid.selectAll('line')
    .attr('stroke', config.yAxis.gridColor)
    .attr('stroke-width', config.yAxis.gridWidth)
    .attr('stroke-dasharray', config.yAxis.gridStyle === 'dashed' ? '4,4' : config.yAxis.gridStyle === 'dotted' ? '1,4' : '0');

  grid.select('.domain').remove();
}

interface LegendConfig {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  width: number;
  height: number;
  chartMargin: { top: number; right: number; bottom: number; left: number };
  innerWidth: number;
  valueKeys: string[];
  colors: string[];
  legendShow: boolean;
  legendPosition: 'top' | 'right' | 'bottom' | 'left';
  legendAlignment: 'start' | 'center' | 'end';
  legendFontSize: number;
  legendGap: number;
  legendPaddingTop: number;
  legendPaddingRight: number;
  legendPaddingBottom: number;
  legendPaddingLeft: number;
}

/**
 * Render legend with all positioning options
 */
export function renderLegend(config: LegendConfig): void {
  if (!config.legendShow) return;

  // Calculate legend position based on legendPosition prop
  let legendX = 0;
  let legendY = 0;
  let legendOrientation: 'vertical' | 'horizontal' = 'vertical';

  if (config.legendPosition === 'right') {
    legendX = config.width - config.chartMargin.right + 5 - config.legendPaddingRight;
    if (config.legendAlignment === 'center') {
      legendY = config.height / 2;
    } else if (config.legendAlignment === 'end') {
      legendY = config.height - config.chartMargin.bottom;
    } else {
      legendY = config.chartMargin.top;
    }
    legendY += config.legendPaddingTop;
    legendOrientation = 'vertical';
  } else if (config.legendPosition === 'left') {
    legendX = 5 + config.legendPaddingLeft;
    if (config.legendAlignment === 'center') {
      legendY = config.height / 2;
    } else if (config.legendAlignment === 'end') {
      legendY = config.height - config.chartMargin.bottom;
    } else {
      legendY = config.chartMargin.top;
    }
    legendY += config.legendPaddingTop;
    legendOrientation = 'vertical';
  } else if (config.legendPosition === 'top') {
    if (config.legendAlignment === 'center') {
      legendX = config.width / 2;
    } else if (config.legendAlignment === 'end') {
      legendX = config.width - config.chartMargin.right;
    } else {
      legendX = config.chartMargin.left;
    }
    legendX += config.legendPaddingLeft;
    legendY = 5 + config.legendPaddingTop;
    legendOrientation = 'horizontal';
  } else if (config.legendPosition === 'bottom') {
    if (config.legendAlignment === 'center') {
      legendX = config.width / 2;
    } else if (config.legendAlignment === 'end') {
      legendX = config.width - config.chartMargin.right;
    } else {
      legendX = config.chartMargin.left;
    }
    legendX += config.legendPaddingLeft;
    legendY = config.height - config.chartMargin.bottom + 45 - config.legendPaddingBottom;
    legendOrientation = 'horizontal';
  }

  const legend = config.svg
    .append('g')
    .attr('transform', `translate(${legendX},${legendY})`);

  if (legendOrientation === 'vertical') {
    // Vertical layout
    config.valueKeys.forEach((key, index) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0,${index * (15 + config.legendGap)})`);

      legendRow
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', config.colors[index % config.colors.length]);

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(key)
        .style('font-size', `${config.legendFontSize}px`)
        .attr('text-anchor', 'start');
    });
  } else {
    // Horizontal layout with wrapping
    let cumulativeX = 0;
    let cumulativeY = 0;
    const maxWidth = config.innerWidth;
    const lineHeight = 15 + config.legendGap;

    config.valueKeys.forEach((key, index) => {
      // Estimate item width (rect + spacing + text width)
      const itemWidth = 15 + 5 + key.length * config.legendFontSize * 0.6 + config.legendGap;

      // Check if we need to wrap to next line
      if (cumulativeX > 0 && cumulativeX + itemWidth > maxWidth) {
        cumulativeX = 0;
        cumulativeY += lineHeight;
      }

      const legendItem = legend
        .append('g')
        .attr('transform', `translate(${cumulativeX},${cumulativeY})`);

      legendItem
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', config.colors[index % config.colors.length]);

      legendItem
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(key)
        .style('font-size', `${config.legendFontSize}px`)
        .attr('text-anchor', 'start');

      // Move X position for next item
      cumulativeX += itemWidth;
    });
  }
}

interface BrushZoomConfig {
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
  innerWidth: number;
  innerHeight: number;
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  setZoomDomain: (domain: { x: [number, number]; y: [number, number] }) => void;
}

/**
 * Setup brush zoom interaction
 */
export function setupBrushZoom(config: BrushZoomConfig): void {
  const brush = d3.brushX()
    .extent([[0, 0], [config.innerWidth, config.innerHeight]])
    .on('end', (event) => {
      if (!event.selection) return;

      const [x0, x1] = event.selection as [number, number];

      // Convert pixel coordinates to data indices
      const allLabels = config.data.map((d) => String(d[config.labelKey]));
      const xScaleFull = d3.scalePoint()
        .domain(allLabels)
        .range([0, config.innerWidth])
        .padding(0.5);

      // Find the indices of the selected range
      let startIndex = 0;
      let endIndex = config.data.length - 1;

      allLabels.forEach((label, i) => {
        const pos = (xScaleFull(label) || 0) + xScaleFull.bandwidth() / 2;
        if (pos >= x0 && i < startIndex) startIndex = i;
        if (pos <= x1) endIndex = i;
      });

      // Calculate Y domain from the selected data range
      const selectedData = config.data.slice(startIndex, endIndex + 1);
      const yMinSelected = d3.min(selectedData, (d) =>
        Math.min(...config.valueKeys.map((key) => Number(d[key]) || 0))
      ) || 0;
      const yMaxSelected = d3.max(selectedData, (d) =>
        Math.max(...config.valueKeys.map((key) => Number(d[key]) || 0))
      ) || 0;

      // Update zoom domain
      config.setZoomDomain({
        x: [startIndex, endIndex],
        y: [yMinSelected, yMaxSelected],
      });

      // Clear brush selection
      config.g.select('.brush').call(brush.move as any, null);
    });

  // Add brush overlay
  config.g.append('g')
    .attr('class', 'brush')
    .call(brush);
}
