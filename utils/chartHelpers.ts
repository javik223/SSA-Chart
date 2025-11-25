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

  let xAxisGroup = g.select<SVGGElement>('.x-axis');
  if (xAxisGroup.empty()) {
    xAxisGroup = g.append('g')
      .attr('class', 'x-axis');
  }

  xAxisGroup
    .attr('transform', `translate(0,${yPosition})`)
    .style('font-size', `${config.xAxisLabelSize}px`)
    .style('font-weight', config.xAxisLabelWeight)
    .style('color', config.xAxisLabelColor);

  // Render axis with transition for smooth value changes
  const transition = xAxisGroup.transition().duration(500);
  
  transition.call(axis)
    .on('end', () => {
      // Apply label rotation and styling after transition completes
      if (config.xAxisLabelRotation !== 0) {
        const rotation = config.xAxisLabelRotation;
        const isBottomAxis = config.xAxisPosition !== 'top';
        const tickSize = config.xAxisTickSize ?? 6;
        const tickPadding = config.xAxisTickPadding ?? 3;
        const yOffset = isBottomAxis ? (tickSize + tickPadding) : -(tickSize + tickPadding);
        const xOffset = 0;
        
        const spacing = config.xAxisLabelSpacing || 0;
        const spacingOffset = isBottomAxis ? spacing : -spacing;

        xAxisGroup.selectAll('.tick text')
          .attr('transform', `translate(0, ${spacingOffset}) rotate(${rotation}, ${xOffset}, ${yOffset})`)
          .style('text-anchor', isBottomAxis 
            ? (rotation > 0 ? 'start' : 'end') 
            : (rotation > 0 ? 'end' : 'start'))
          .attr('dx', isBottomAxis
            ? (rotation > 0 ? '0.5em' : '-0.5em')
            : (rotation > 0 ? '-0.5em' : '0.5em'))
          .attr('dy', '0.32em');
      } else {
        // Reset if no rotation (handle spacing only)
        if (config.xAxisLabelSpacing !== 0) {
          xAxisGroup.selectAll('.tick text')
            .attr('dy', config.xAxisPosition === 'top' ? `-${config.xAxisLabelSpacing}px` : `${config.xAxisLabelSpacing}px`);
        }
      }
    });
  
  // Also apply immediately for initial render
  if (config.xAxisLabelRotation !== 0) {
    const rotation = config.xAxisLabelRotation;
    const isBottomAxis = config.xAxisPosition !== 'top';
    const tickSize = config.xAxisTickSize ?? 6;
    const tickPadding = config.xAxisTickPadding ?? 3;
    const yOffset = isBottomAxis ? (tickSize + tickPadding) : -(tickSize + tickPadding);
    const xOffset = 0;
    
    const spacing = config.xAxisLabelSpacing || 0;
    const spacingOffset = isBottomAxis ? spacing : -spacing;

    xAxisGroup.selectAll('.tick text')
      .attr('transform', `translate(0, ${spacingOffset}) rotate(${rotation}, ${xOffset}, ${yOffset})`)
      .style('text-anchor', isBottomAxis 
        ? (rotation > 0 ? 'start' : 'end') 
        : (rotation > 0 ? 'end' : 'start'))
      .attr('dx', isBottomAxis
        ? (rotation > 0 ? '0.5em' : '-0.5em')
        : (rotation > 0 ? '-0.5em' : '0.5em'))
      .attr('dy', '0.32em');
  } else {
    // Reset if no rotation (handle spacing only)
    if (config.xAxisLabelSpacing !== 0) {
      xAxisGroup.selectAll('.tick text')
        .attr('dy', config.xAxisPosition === 'top' ? `-${config.xAxisLabelSpacing}px` : `${config.xAxisLabelSpacing}px`);
    }
  }

  // Add X axis title
  if (config.xAxisTitle) {
    const titleY = config.xAxisPosition === 'top'
      ? -config.xAxisTitlePadding
      : config.innerHeight + config.xAxisTitlePadding;

    // Remove existing title if any
    g.select('.x-axis-title').remove();

    g.append('text')
      .attr('class', 'x-axis-title')
      .attr('x', config.innerWidth / 2)
      .attr('y', titleY)
      .style('text-anchor', 'middle')
      .style('font-size', `${config.xAxisTitleSize}px`)
      .style('font-weight', config.xAxisTitleWeight)
      .style('fill', config.xAxisTitleColor)
      .text(config.xAxisTitle);
  } else {
    // Remove title if xAxisTitle is empty
    g.select('.x-axis-title').remove();
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

  let yAxisGroup = g.select<SVGGElement>('.y-axis');
  if (yAxisGroup.empty()) {
    yAxisGroup = g.append('g')
      .attr('class', 'y-axis');
  }

  yAxisGroup
    .attr('transform', `translate(${yAxis.position === 'left' ? 0 : config.innerWidth},0)`)
    .style('font-size', `${yAxis.labelSize}px`)
    .style('font-weight', yAxis.labelWeight)
    .style('color', yAxis.labelColor);

  yAxisGroup.transition()
    .duration(500)
    .call(axis);

  // Render axis with transition for smooth value changes
  const transition = yAxisGroup.transition().duration(500);
  
  transition.call(axis)
    .on('end', () => {
      // Apply label rotation after transition completes
      if (yAxis.labelAngle !== 0) {
        yAxisGroup.selectAll('.tick text')
          .attr('transform', `rotate(${yAxis.labelAngle})`)
          .style('text-anchor', yAxis.labelAngle < 0 ? 'end' : 'start');
      }
    });

  // Also apply immediately for initial render
  if (yAxis.labelAngle !== 0) {
    yAxisGroup.selectAll('.tick text')
      .attr('transform', `rotate(${yAxis.labelAngle})`)
      .style('text-anchor', yAxis.labelAngle < 0 ? 'end' : 'start');
  }

  // Add Y axis title
  if (yAxis.title) {
    const titleX = yAxis.position === 'left' ? -yAxis.titlePadding : config.innerWidth + yAxis.titlePadding;
    const titleY = config.innerHeight / 2;

    // Remove existing title if any
    g.select('.y-axis-title').remove();

    g.append('text')
      .attr('class', 'y-axis-title')
      .attr('transform', `translate(${titleX},${titleY}) rotate(-90)`)
      .style('text-anchor', 'middle')
      .style('font-size', `${yAxis.titleSize}px`)
      .style('font-weight', yAxis.titleWeight)
      .style('fill', yAxis.titleColor)
      .text(yAxis.title);
  } else {
    // Remove title if yAxis.title is empty
    g.select('.y-axis-title').remove();
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

  let grid = g.select<SVGGElement>('.x-grid');
  if (grid.empty()) {
    grid = g.append('g')
      .attr('class', 'x-grid');
  }

  grid
    .attr('transform', `translate(0,${config.innerHeight})`)
    .attr('opacity', config.xAxisGridOpacity ?? 0.5);

  const gridAxis = d3.axisBottom(config.xScale as any)
    .tickSize(-config.innerHeight)
    .tickFormat(() => '');

  if (config.xAxisTickCount) gridAxis.ticks(config.xAxisTickCount);

  grid.transition().duration(500).call(gridAxis);

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

  let grid = g.select<SVGGElement>('.y-grid');
  if (grid.empty()) {
    grid = g.append('g')
      .attr('class', 'y-grid');
  }

  grid
    .attr('opacity', 0.5);

  const gridAxis = d3.axisLeft(config.yScale)
    .tickSize(-config.innerWidth)
    .tickFormat(() => '')
    .ticks(config.yAxis.tickCount ?? 10);

  // Apply grid with transition for smooth zoom animation
  grid.transition()
    .duration(500)
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
 * Setup brush zoom interaction (drag to select region)
 */
export function setupBrushZoom(config: BrushZoomConfig): void {
  const brush = d3.brushX()
    .extent([[0, 0], [config.innerWidth, config.innerHeight]])
    .filter((event) => !event.shiftKey && !event.button) // Normal drag without Shift
    // Allow very small selections (minimum 1 pixel) to enable zooming to single points
    .on('end', (event) => {
  // Handle zoom reset on double-click (empty selection)
      if (!event.selection) {
        const svgNode = config.g.node() as any;
        
        if (!svgNode.__idleTimeout) {
          svgNode.__idleTimeout = setTimeout(() => {
            svgNode.__idleTimeout = null;
          }, 350);
          return;
        }
        
        svgNode.__idleTimeout = null;

        // Reset to full domain
        const yMinFull = d3.min(config.data, (d) =>
          Math.min(...config.valueKeys.map((key) => Number(d[key]) || 0))
        ) || 0;
        const yMaxFull = d3.max(config.data, (d) =>
          Math.max(...config.valueKeys.map((key) => Number(d[key]) || 0))
        ) || 0;

        config.setZoomDomain({
          x: [0, config.data.length - 1],
          y: [yMinFull, yMaxFull]
        });
        return;
      }

      const [x0, x1] = event.selection as [number, number];

      // Convert pixel coordinates to data indices
      const allLabels = config.data.map((d) => String(d[config.labelKey]));
      const xScaleFull = d3.scalePoint()
        .domain(allLabels)
        .range([0, config.innerWidth])
        .padding(0.5);

      // Find the indices of the selected range
      let startIndex = config.data.length - 1;
      let endIndex = 0;

      allLabels.forEach((label, i) => {
        const pos = (xScaleFull(label) || 0);
        if (pos >= x0 && i < startIndex) startIndex = i;
        if (pos <= x1) endIndex = i;
      });

      // Ensure we have at least one data point selected
      if (startIndex > endIndex) {
        // If selection is too small, find the closest point
        const midpoint = (x0 + x1) / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        allLabels.forEach((label, i) => {
          const pos = (xScaleFull(label) || 0);
          const distance = Math.abs(pos - midpoint);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        });

        startIndex = closestIndex;
        endIndex = closestIndex;
      }

      // Calculate Y domain from the selected data range
      const selectedData = config.data.slice(startIndex, endIndex + 1);
      const yMinSelected = d3.min(selectedData, (d) =>
        Math.min(...config.valueKeys.map((key) => Number(d[key]) || 0))
      ) || 0;
      const yMaxSelected = d3.max(selectedData, (d) =>
        Math.max(...config.valueKeys.map((key) => Number(d[key]) || 0))
      ) || 0;

      // Update zoom domain - allow zooming to a single point
      config.setZoomDomain({
        x: [startIndex, endIndex],
        y: [yMinSelected, yMaxSelected],
      });

      // Clear brush selection
      config.g.select('.brush').call(brush.move as any, null);
    });

  // Add brush overlay
  let brushGroup = config.g.select<SVGGElement>('.brush');
  if (brushGroup.empty()) {
    brushGroup = config.g.append('g')
      .attr('class', 'brush');
  }
  
  brushGroup.call(brush);
  
  // Ensure brush is raised
  brushGroup.raise();
}

interface PanConfig {
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
  innerWidth: number;
  innerHeight: number;
  data: Array<Record<string, string | number>>;
  zoomDomain: { x: [number, number]; y: [number, number] } | null;
  setZoomDomain: (domain: { x: [number, number]; y: [number, number] }) => void;
  valueKeys: string[];
}

/**
 * Setup drag panning interaction (Shift+Drag to pan)
 */
export function setupPan(config: PanConfig): void {
  let isDragging = false;
  let accumulatedDx = 0;

  const drag = d3.drag()
    .filter((event) => event.shiftKey && !event.button) // Only activate with Shift key held
    .on('start', function() {
      isDragging = true;
      accumulatedDx = 0;
      d3.select(this).style('cursor', 'grabbing');
    })
    .on('drag', (event) => {
      if (!isDragging) return;

      // Get current domain or default to full range
      const [currentStart, currentEnd] = config.zoomDomain?.x || [0, config.data.length - 1];
      const range = currentEnd - currentStart;

      // Accumulate drag distance
      accumulatedDx += event.dx;

      // Calculate how many data points to shift based on accumulated pixel drag
      // Use sensitivity multiplier for adjustable panning responsiveness
      const dataPointsPerPixel = range / config.innerWidth;
      const sensitivity = 3; // Adjust this value: lower = less sensitive (easier to drag), higher = more sensitive
      const indexDelta = Math.round(-accumulatedDx * dataPointsPerPixel * sensitivity);

      if (indexDelta === 0) return;

      // Reset accumulated dx after applying the delta
      accumulatedDx = 0;

      // Calculate new indices
      let newStart = currentStart + indexDelta;
      let newEnd = currentEnd + indexDelta;

      // Clamp to data bounds
      if (newStart < 0) {
        newStart = 0;
        newEnd = range;
      }
      if (newEnd > config.data.length - 1) {
        newEnd = config.data.length - 1;
        newStart = newEnd - range;
      }

      // If we hit the bounds, don't update
      if (newStart === currentStart && newEnd === currentEnd) return;

      // Calculate new Y domain based on the new visible data
      const selectedData = config.data.slice(newStart, newEnd + 1);
      const yMinSelected = d3.min(selectedData, (d) =>
        Math.min(...config.valueKeys.map((key) => Number(d[key]) || 0))
      ) || 0;
      const yMaxSelected = d3.max(selectedData, (d) =>
        Math.max(...config.valueKeys.map((key) => Number(d[key]) || 0))
      ) || 0;

      config.setZoomDomain({
        x: [newStart, newEnd],
        y: [yMinSelected, yMaxSelected]
      });
    })
    .on('end', function(event) {
      isDragging = false;
      accumulatedDx = 0;
      // Restore cursor based on shift key state
      if (event.sourceEvent && event.sourceEvent.shiftKey) {
        d3.select(this).style('cursor', 'grab');
      } else {
        d3.select(this).style('cursor', 'crosshair');
      }
    });

  // Apply drag behavior
  // We prefer attaching to the brush overlay if it exists, as it's usually on top
  let target = config.g.select<SVGRectElement>('.brush .overlay');

  if (target.empty()) {
    // Fallback to creating our own rect if no brush
    let panRect = config.g.select<SVGRectElement>('.pan-rect');
    if (panRect.empty()) {
      panRect = config.g.append('rect')
        .attr('class', 'pan-rect')
        .attr('fill', 'transparent');

      panRect.lower();
      config.g.select('.grid').lower();
    }

    panRect
      .attr('width', config.innerWidth)
      .attr('height', config.innerHeight)
      .style('cursor', 'grab');

    target = panRect;
  } else {
    // If using brush overlay, ensure cursor stays as grab for panning
    // and handle cursor changes on shift key press/release
    target
      .style('cursor', 'crosshair')
      .on('mouseenter', function() {
        d3.select(this).style('cursor', 'crosshair');
      })
      .on('mousemove', function(event) {
        // Update cursor based on shift key state
        if (event.shiftKey) {
          d3.select(this).style('cursor', 'grab');
        } else {
          d3.select(this).style('cursor', 'crosshair');
        }
      });
  }

  target.call(drag as any);
}
