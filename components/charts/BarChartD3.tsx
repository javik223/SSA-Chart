'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartD3Props {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  legendShow?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendAlignment?: 'start' | 'center' | 'end';
  legendFontSize?: number;
  legendShowValues?: boolean;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];

export function BarChartD3({
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  legendShow = true,
  legendPosition = 'right',
  legendFontSize = 12,
}: BarChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Use prop dimensions for calculations
    const width = propWidth;
    const height = propHeight;

    // Adjust margins based on legend position
    const baseMargin = { top: 40, right: 40, bottom: 60, left: 60 };
    const legendSpace = legendShow ? 120 : 0;
    const margin = {
      top: baseMargin.top + (legendPosition === 'top' ? legendSpace : 0),
      right: baseMargin.right + (legendPosition === 'right' ? legendSpace : 0),
      bottom: baseMargin.bottom + (legendPosition === 'bottom' ? legendSpace : 0),
      left: baseMargin.left + (legendPosition === 'left' ? legendSpace : 0),
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG with viewBox for responsiveness
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x0Scale = d3
      .scaleBand()
      .domain(data.map((d) => String(d[labelKey])))
      .range([0, innerWidth])
      .padding(0.2);

    const x1Scale = d3
      .scaleBand()
      .domain(valueKeys)
      .range([0, x0Scale.bandwidth()])
      .padding(0.05);

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
      .call(d3.axisBottom(x0Scale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Y axis
    g.append('g').call(d3.axisLeft(yScale));

    // Bars
    const barGroups = g
      .selectAll('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('transform', (d) => `translate(${x0Scale(String(d[labelKey]))},0)`);

    valueKeys.forEach((key, index) => {
      barGroups
        .append('rect')
        .attr('x', x1Scale(key) || 0)
        .attr('y', (d) => yScale(Number(d[key]) || 0))
        .attr('width', x1Scale.bandwidth())
        .attr('height', (d) => innerHeight - yScale(Number(d[key]) || 0))
        .attr('fill', COLORS[index % COLORS.length]);
    });

    // Legend
    if (legendShow) {
      // Calculate legend position based on legendPosition prop
      let legendX = 0;
      let legendY = 0;
      let legendOrientation: 'vertical' | 'horizontal' = 'vertical';

      if (legendPosition === 'right') {
        legendX = innerWidth + 10;
        legendY = 0;
        legendOrientation = 'vertical';
      } else if (legendPosition === 'left') {
        legendX = -margin.left + 10;
        legendY = 0;
        legendOrientation = 'vertical';
      } else if (legendPosition === 'top') {
        legendX = 0;
        legendY = -margin.top + 10;
        legendOrientation = 'horizontal';
      } else if (legendPosition === 'bottom') {
        legendX = 0;
        legendY = innerHeight + 40;
        legendOrientation = 'horizontal';
      }

      const legend = g
        .append('g')
        .attr('transform', `translate(${legendX}, ${legendY})`);

      if (legendOrientation === 'vertical') {
        // Vertical layout
        valueKeys.forEach((key, index) => {
          const legendRow = legend
            .append('g')
            .attr('transform', `translate(0, ${index * 25})`);

          legendRow
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', COLORS[index % COLORS.length]);

          legendRow
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(key)
            .style('font-size', `${legendFontSize}px`)
            .attr('text-anchor', 'start');
        });
      } else {
        // Horizontal layout
        let cumulativeX = 0;
        valueKeys.forEach((key, index) => {
          const legendItem = legend
            .append('g')
            .attr('transform', `translate(${cumulativeX}, 0)`);

          legendItem
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', COLORS[index % COLORS.length]);

          legendItem
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(key)
            .style('font-size', `${legendFontSize}px`)
            .attr('text-anchor', 'start');

          // Calculate width for next item (rect + spacing + text width estimate)
          cumulativeX += 15 + 5 + key.length * legendFontSize * 0.6 + 20;
        });
      }
    }
  }, [data, labelKey, valueKeys, propWidth, propHeight, legendShow, legendPosition, legendFontSize]);

  return (
    <svg ref={svgRef} className='w-full h-full' />
  );
}
