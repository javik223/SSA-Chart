'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartTooltip } from './ChartTooltip';

import { TooltipContent } from './TooltipContent';

interface PieChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  innerRadius?: number; // For donut charts, set this to > 0
  padAngle?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  showTotal?: boolean;
  centerLabel?: string;
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

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff6b9d',
  '#c084fc',
  '#fb923c',
];

import { TooltipProvider } from '@/components/providers/TooltipProvider';
import { useTooltipActions } from '@/hooks/useTooltip';

function PieChartInner( {
  data,
  labelKey,
  valueKeys,
  innerRadius = 0,
  padAngle = 0,
  cornerRadius = 0,
  startAngle = 0,
  endAngle = 360,
  showTotal = true,
  centerLabel = 'Total',
  width: propWidth = 800,
  height: propHeight = 600,
  colors = DEFAULT_COLORS,
  colorMode = 'by-column',
  legendShow = true,
  legendPosition = 'right',
  legendAlignment = 'start',
  legendFontSize = 12,
  legendShowValues = false,
  legendGap = 20,
  legendPaddingTop = 0,
  legendPaddingRight = 0,
  legendPaddingBottom = 0,
  legendPaddingLeft = 0,
}: PieChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const { showTooltip, hideTooltip, moveTooltip } = useTooltipActions();

  useEffect( () => {
    if ( !svgRef.current || data.length === 0 ) return;

    // Clear previous chart
    d3.select( svgRef.current ).selectAll( '*' ).remove();

    // Use prop dimensions for calculations
    const width = propWidth;
    const height = propHeight;

    // Reserve space for legend based on position
    // Use more space for horizontal legends (top/bottom) as they may wrap
    const legendSpace = legendShow
      ? ( legendPosition === 'top' || legendPosition === 'bottom' ? 100 : 150 )
      : 0;
    const chartMargin = {
      top: legendPosition === 'top' ? legendSpace : 20,
      right: legendPosition === 'right' ? legendSpace : 20,
      bottom: legendPosition === 'bottom' ? legendSpace : 20,
      left: legendPosition === 'left' ? legendSpace : 20,
    };

    const innerWidth = width - chartMargin.left - chartMargin.right;
    const innerHeight = height - chartMargin.top - chartMargin.bottom;

    // Determine radius
    const radius = Math.min( innerWidth, innerHeight ) / 2;
    const outerRadius = radius;
    const actualInnerRadius = innerRadius * radius;

    // Create SVG with viewBox for responsiveness
    const svg = d3
      .select( svgRef.current )
      .attr( 'viewBox', `0 0 ${ width } ${ height }` )
      .attr( 'preserveAspectRatio', 'xMidYMid meet' );

    const g = svg
      .append( 'g' )
      .attr(
        'transform',
        `translate(${ chartMargin.left + innerWidth / 2 },${ chartMargin.top + innerHeight / 2 })`
      );

    // Use first value key for pie chart (pie charts typically show one value series)
    const valueKey = valueKeys[ 0 ];

    // Prepare data for pie
    const pieData = data.map( ( d ) => ( {
      label: String( d[ labelKey ] ),
      value: Number( d[ valueKey ] ) || 0,
      originalData: d,
    } ) );

    // Calculate total for percentages
    const total = d3.sum( pieData, ( d ) => d.value );

    // Convert angles from degrees to radians
    const startAngleRad = ( startAngle * Math.PI ) / 180;
    const endAngleRad = ( endAngle * Math.PI ) / 180;

    // Create pie generator
    const pie = d3
      .pie<{ label: string; value: number; originalData: any; }>()
      .value( ( d ) => d.value )
      .sort( null )
      .startAngle( startAngleRad )
      .endAngle( endAngleRad )
      .padAngle( padAngle );

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; originalData: any; }>>()
      .innerRadius( actualInnerRadius )
      .outerRadius( outerRadius )
      .cornerRadius( cornerRadius );

    // Create hover arc (slightly larger)
    const hoverArc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number; originalData: any; }>>()
      .innerRadius( actualInnerRadius )
      .outerRadius( outerRadius + 10 )
      .cornerRadius( cornerRadius );

    // Create arcs
    const arcs = g
      .selectAll( '.arc' )
      .data( pie( pieData ) )
      .enter()
      .append( 'g' )
      .attr( 'class', 'arc' );

    // Add paths with animation
    arcs
      .append( 'path' )
      .attr( 'd', arc )
      .attr( 'fill', ( d, i ) => colors[ i % colors.length ] )
      .attr( 'stroke', 'white' )
      .attr( 'stroke-width', 2 )
      .style( 'cursor', 'pointer' )
      .on( 'mouseenter', function ( event, d ) {
        // Highlight slice
        d3.select( this )
          .transition()
          .duration( 200 )
          .attr( 'd', hoverArc as any );

        // Show tooltip
        const colorScale = () => colors[ d.index % colors.length ];
        showTooltip(
          <TooltipContent
            data={ d.data.originalData }
            labelKey={ labelKey }
            valueKeys={ [ valueKey ] }
            colorScale={ colorScale }
          />,
          event.pageX,
          event.pageY
        );
      } )
      .on( 'mousemove', function ( event ) {
        moveTooltip( event.pageX, event.pageY );
      } )
      .on( 'mouseleave', function () {
        // Reset slice
        d3.select( this )
          .transition()
          .duration( 200 )
          .attr( 'd', arc as any );

        // Hide tooltip
        hideTooltip();
      } )
      // Animate entry
      .transition()
      .duration( 800 )
      .attrTween( 'd', function ( d ) {
        const interpolate = d3.interpolate( { startAngle: startAngleRad, endAngle: startAngleRad }, d );
        return function ( t ) {
          return arc( interpolate( t ) ) || '';
        };
      } );

    // Add labels to slices (only if slice is large enough)
    arcs
      .append( 'text' )
      .attr( 'transform', ( d ) => {
        const pos = arc.centroid( d );
        return `translate(${ pos })`;
      } )
      .attr( 'text-anchor', 'middle' )
      .attr( 'dy', '0.35em' )
      .style( 'font-size', '11px' )
      .style( 'font-weight', '600' )
      .style( 'fill', 'white' )
      .style( 'pointer-events', 'none' )
      .text( ( d ) => {
        const percentage = ( ( d.data.value / total ) * 100 );
        // Only show label if slice is > 5%
        return percentage > 5 ? `${ percentage.toFixed( 0 ) }%` : '';
      } )
      .style( 'opacity', 0 )
      .transition()
      .delay( 800 )
      .duration( 400 )
      .style( 'opacity', 1 );

    // Legend
    if ( legendShow ) {
      // Calculate legend position based on legendPosition prop
      let legendX = 0;
      let legendY = 0;
      let legendOrientation: 'vertical' | 'horizontal' = 'vertical';

      if ( legendPosition === 'right' ) {
        legendX = width - chartMargin.right + 5 - legendPaddingRight;
        // Apply vertical alignment for right position
        if ( legendAlignment === 'center' ) {
          legendY = height / 2;
        } else if ( legendAlignment === 'end' ) {
          legendY = height - chartMargin.bottom;
        } else {
          legendY = chartMargin.top;
        }
        legendY += legendPaddingTop;
        legendOrientation = 'vertical';
      } else if ( legendPosition === 'left' ) {
        legendX = 5 + legendPaddingLeft;
        // Apply vertical alignment for left position
        if ( legendAlignment === 'center' ) {
          legendY = height / 2;
        } else if ( legendAlignment === 'end' ) {
          legendY = height - chartMargin.bottom;
        } else {
          legendY = chartMargin.top;
        }
        legendY += legendPaddingTop;
        legendOrientation = 'vertical';
      } else if ( legendPosition === 'top' ) {
        // Apply horizontal alignment for top position
        if ( legendAlignment === 'center' ) {
          legendX = width / 2;
        } else if ( legendAlignment === 'end' ) {
          legendX = width - chartMargin.right;
        } else {
          legendX = chartMargin.left;
        }
        legendX += legendPaddingLeft;
        legendY = 5 + legendPaddingTop;
        legendOrientation = 'horizontal';
      } else if ( legendPosition === 'bottom' ) {
        // Apply horizontal alignment for bottom position
        if ( legendAlignment === 'center' ) {
          legendX = width / 2;
        } else if ( legendAlignment === 'end' ) {
          legendX = width - chartMargin.right;
        } else {
          legendX = chartMargin.left;
        }
        legendX += legendPaddingLeft;
        legendY = height - chartMargin.bottom + 10 + legendPaddingTop;
        legendOrientation = 'horizontal';
      }

      const legend = svg
        .append( 'g' )
        .attr( 'transform', `translate(${ legendX }, ${ legendY })` );

      if ( legendOrientation === 'vertical' ) {
        // Vertical layout
        const legendItems = legend
          .selectAll( '.legend-item' )
          .data( pieData )
          .enter()
          .append( 'g' )
          .attr( 'class', 'legend-item' )
          .attr( 'transform', ( d, i ) => `translate(0, ${ i * ( 15 + legendGap ) })` );

        legendItems
          .append( 'rect' )
          .attr( 'width', 15 )
          .attr( 'height', 15 )
          .attr( 'fill', ( d, i ) => colors[ i % colors.length ] );

        legendItems
          .append( 'text' )
          .attr( 'x', 20 )
          .attr( 'y', 12 )
          .text( ( d ) => {
            const percentage = ( ( d.value / total ) * 100 ).toFixed( 1 );
            if ( legendShowValues ) {
              return `${ d.label } (${ d.value.toLocaleString() }, ${ percentage }%)`;
            }
            return `${ d.label } (${ percentage }%)`;
          } )
          .style( 'font-size', `${ legendFontSize }px` )
          .attr( 'text-anchor', 'start' );
      } else {
        // Horizontal layout with wrapping
        let cumulativeX = 0;
        let cumulativeY = 0;
        const maxWidth = innerWidth;
        const lineHeight = 15 + legendGap;

        pieData.forEach( ( d, i ) => {
          const percentage = ( ( d.value / total ) * 100 ).toFixed( 1 );
          const label = legendShowValues
            ? `${ d.label } (${ d.value.toLocaleString() }, ${ percentage }%)`
            : `${ d.label } (${ percentage }%)`;

          // Estimate item width (rect + spacing + text width)
          const itemWidth = 15 + 5 + label.length * legendFontSize * 0.6 + legendGap;

          // Check if we need to wrap to next line
          if ( cumulativeX > 0 && cumulativeX + itemWidth > maxWidth ) {
            cumulativeX = 0;
            cumulativeY += lineHeight;
          }

          const legendItem = legend
            .append( 'g' )
            .attr( 'transform', `translate(${ cumulativeX }, ${ cumulativeY })` );

          legendItem
            .append( 'rect' )
            .attr( 'width', 15 )
            .attr( 'height', 15 )
            .attr( 'fill', colors[ i % colors.length ] );

          legendItem
            .append( 'text' )
            .attr( 'x', 20 )
            .attr( 'y', 12 )
            .text( label )
            .style( 'font-size', `${ legendFontSize }px` )
            .attr( 'text-anchor', 'start' );

          // Move X position for next item
          cumulativeX += itemWidth;
        } );
      }
    }

    // Center text for donut charts
    if ( actualInnerRadius > 0 && showTotal ) {
      const centerGroup = g.append( 'g' ).attr( 'class', 'center-text' );

      centerGroup
        .append( 'text' )
        .attr( 'text-anchor', 'middle' )
        .attr( 'dy', '-0.5em' )
        .style( 'font-size', '24px' )
        .style( 'font-weight', 'bold' )
        .style( 'fill', '#333' )
        .text( total.toLocaleString() );

      centerGroup
        .append( 'text' )
        .attr( 'text-anchor', 'middle' )
        .attr( 'dy', '1.2em' )
        .style( 'font-size', '14px' )
        .style( 'fill', '#666' )
        .text( centerLabel );
    }
  }, [ data, labelKey, valueKeys, innerRadius, padAngle, cornerRadius, startAngle, endAngle, showTotal, centerLabel, propWidth, propHeight, colors, colorMode, legendShow, legendPosition, legendAlignment, legendFontSize, legendShowValues, legendGap, legendPaddingTop, legendPaddingRight, legendPaddingBottom, legendPaddingLeft, showTooltip, hideTooltip, moveTooltip ] );

  return (
    <div className='relative w-full h-full'>
      <svg ref={ svgRef } className='w-full h-full' />
      <ChartTooltip />
    </div>
  );
}

export function PieChart( props: PieChartProps ) {
  return (
    <TooltipProvider>
      <PieChartInner { ...props } />
    </TooltipProvider>
  );
}
