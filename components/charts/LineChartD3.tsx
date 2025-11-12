'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartD3Props {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];

export function LineChartD3({ data, labelKey, valueKeys }: LineChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Get container dimensions
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const margin = { top: 40, right: 120, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

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

    // Line generator
    const line = d3
      .line<Record<string, string | number>>()
      .x((d) => xScale(String(d[labelKey])) || 0)
      .y((d, i, arr) => {
        const key = valueKeys[Math.floor(i / data.length)];
        return yScale(Number(d[key]) || 0);
      })
      .curve(d3.curveMonotoneX);

    // Draw lines for each value key
    valueKeys.forEach((key, index) => {
      const color = COLORS[index % COLORS.length];

      // Line
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('d', (d) =>
          d3
            .line<Record<string, string | number>>()
            .x((point) => xScale(String(point[labelKey])) || 0)
            .y((point) => yScale(Number(point[key]) || 0))
            .curve(d3.curveMonotoneX)(d)
        );

      // Dots
      g.selectAll(`.dot-${index}`)
        .data(data)
        .enter()
        .append('circle')
        .attr('class', `dot-${index}`)
        .attr('cx', (d) => xScale(String(d[labelKey])) || 0)
        .attr('cy', (d) => yScale(Number(d[key]) || 0))
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    });

    // Legend
    const legend = g
      .append('g')
      .attr('transform', `translate(${innerWidth + 10}, 0)`);

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
        .style('font-size', '12px')
        .attr('text-anchor', 'start');
    });
  }, [data, labelKey, valueKeys]);

  return (
    <div ref={containerRef} className='w-full h-full'>
      <svg ref={svgRef}></svg>
    </div>
  );
}
