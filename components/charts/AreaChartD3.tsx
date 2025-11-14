'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AreaChartD3Props {
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
}

const DEFAULT_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];

export function AreaChartD3({
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  colors = DEFAULT_COLORS,
  colorMode = 'by-column',
  legendShow = true,
  legendPosition = 'right',
  legendAlignment = 'start',
  legendFontSize = 12,
  legendGap = 20,
  legendPaddingTop = 0,
  legendPaddingRight = 0,
  legendPaddingBottom = 0,
  legendPaddingLeft = 0,
}: AreaChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Use prop dimensions for calculations
    const width = propWidth;
    const height = propHeight;

    // Reserve space for legend based on position
    const legendSpace = legendShow ? 120 : 0;
    const chartMargin = {
      top: legendPosition === 'top' ? legendSpace : 0,
      right: legendPosition === 'right' ? legendSpace : 0,
      bottom: legendPosition === 'bottom' ? legendSpace : 40, // Space for x-axis labels
      left: legendPosition === 'left' ? legendSpace : 50, // Space for y-axis
    };

    // Add minimal space for axes when legend isn't on that side
    if (legendPosition !== 'bottom') chartMargin.bottom = Math.max(chartMargin.bottom, 40);
    if (legendPosition !== 'left') chartMargin.left = Math.max(chartMargin.left, 50);

    const innerWidth = width - chartMargin.left - chartMargin.right;
    const innerHeight = height - chartMargin.top - chartMargin.bottom;

    // Create SVG with viewBox for responsiveness
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg
      .append('g')
      .attr('transform', `translate(${chartMargin.left},${chartMargin.top})`);

    // Scales
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => String(d[labelKey])))
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, (d) =>
          Math.max(...valueKeys.map((key) => Number(d[key]) || 0))
        ) || 0,
      ])
      .range([innerHeight, 0])
      .nice();

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y axis
    g.append('g').call(d3.axisLeft(yScale));

    // Area generator
    const area = d3
      .area<Record<string, string | number>>()
      .x((d) => xScale(String(d[labelKey])) || 0)
      .y0(innerHeight)
      .y1((d, i, arr) => {
        const key = valueKeys[Math.floor(i / data.length)];
        return yScale(Number(d[key]) || 0);
      })
      .curve(d3.curveMonotoneX);

    // Draw areas for each value key
    valueKeys.forEach((key, index) => {
      const color = colors[index % colors.length];

      // Area
      g.append('path')
        .datum(data)
        .attr('fill', color)
        .attr('fill-opacity', 0.6)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', (d) =>
          d3
            .area<Record<string, string | number>>()
            .x((point) => xScale(String(point[labelKey])) || 0)
            .y0(innerHeight)
            .y1((point) => yScale(Number(point[key]) || 0))
            .curve(d3.curveMonotoneX)(d)
        );
    });

    // Legend
    if (legendShow) {
      // Calculate legend position based on legendPosition prop
      let legendX = 0;
      let legendY = 0;
      let legendOrientation: 'vertical' | 'horizontal' = 'vertical';

      if (legendPosition === 'right') {
        legendX = width - chartMargin.right + 5 - legendPaddingRight;
        // Apply vertical alignment for right position
        if (legendAlignment === 'center') {
          legendY = height / 2;
        } else if (legendAlignment === 'end') {
          legendY = height - chartMargin.bottom;
        } else {
          legendY = chartMargin.top;
        }
        legendY += legendPaddingTop;
        legendOrientation = 'vertical';
      } else if (legendPosition === 'left') {
        legendX = 5 + legendPaddingLeft;
        // Apply vertical alignment for left position
        if (legendAlignment === 'center') {
          legendY = height / 2;
        } else if (legendAlignment === 'end') {
          legendY = height - chartMargin.bottom;
        } else {
          legendY = chartMargin.top;
        }
        legendY += legendPaddingTop;
        legendOrientation = 'vertical';
      } else if (legendPosition === 'top') {
        // Apply horizontal alignment for top position
        if (legendAlignment === 'center') {
          legendX = width / 2;
        } else if (legendAlignment === 'end') {
          legendX = width - chartMargin.right;
        } else {
          legendX = chartMargin.left;
        }
        legendX += legendPaddingLeft;
        legendY = 5 + legendPaddingTop;
        legendOrientation = 'horizontal';
      } else if (legendPosition === 'bottom') {
        // Apply horizontal alignment for bottom position
        if (legendAlignment === 'center') {
          legendX = width / 2;
        } else if (legendAlignment === 'end') {
          legendX = width - chartMargin.right;
        } else {
          legendX = chartMargin.left;
        }
        legendX += legendPaddingLeft;
        legendY = height - chartMargin.bottom + 45 - legendPaddingBottom;
        legendOrientation = 'horizontal';
      }

      const legend = svg
        .append('g')
        .attr('transform', `translate(${legendX}, ${legendY})`);

      if (legendOrientation === 'vertical') {
        // Vertical layout
        valueKeys.forEach((key, index) => {
          const legendRow = legend
            .append('g')
            .attr('transform', `translate(0, ${index * (15 + legendGap)})`);

          legendRow
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', colors[index % colors.length])
            .attr('fill-opacity', 0.6);

          legendRow
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(key)
            .style('font-size', `${legendFontSize}px`)
            .attr('text-anchor', 'start');
        });
      } else {
        // Horizontal layout with wrapping
        let cumulativeX = 0;
        let cumulativeY = 0;
        const maxWidth = innerWidth;
        const lineHeight = 15 + legendGap;

        valueKeys.forEach((key, index) => {
          // Estimate item width (rect + spacing + text width)
          const itemWidth = 15 + 5 + key.length * legendFontSize * 0.6 + legendGap;

          // Check if we need to wrap to next line
          if (cumulativeX > 0 && cumulativeX + itemWidth > maxWidth) {
            cumulativeX = 0;
            cumulativeY += lineHeight;
          }

          const legendItem = legend
            .append('g')
            .attr('transform', `translate(${cumulativeX}, ${cumulativeY})`);

          legendItem
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', colors[index % colors.length])
            .attr('fill-opacity', 0.6);

          legendItem
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(key)
            .style('font-size', `${legendFontSize}px`)
            .attr('text-anchor', 'start');

          // Move X position for next item
          cumulativeX += itemWidth;
        });
      }
    }
  }, [data, labelKey, valueKeys, propWidth, propHeight, colors, colorMode, legendShow, legendPosition, legendAlignment, legendFontSize, legendGap, legendPaddingTop, legendPaddingRight, legendPaddingBottom, legendPaddingLeft]);

  return (
    <svg ref={svgRef} className='w-full h-full' />
  );
}
