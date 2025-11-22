'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { YAxisConfig } from '@/types/chart-types';

interface LineChartD3Props {
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
  curveType?: 'monotone' | 'linear' | 'step';

  // X Axis
  xAxisShow?: boolean;
  xAxisTitle?: string;
  xAxisShowGrid?: boolean;
  xAxisShowDomain?: boolean;
  xAxisTickCount?: number;
  xAxisTickSize?: number;
  xAxisTickPadding?: number;
  xAxisLabelRotation?: number;
  xAxisTickFormat?: string;
  xAxisPosition?: 'bottom' | 'top' | 'hidden';
  xAxisScaleType?: 'linear' | 'log';
  xAxisMin?: number | null;
  xAxisMax?: number | null;
  xAxisTitleType?: 'auto' | 'custom';
  xAxisTitleWeight?: 'bold' | 'regular';
  xAxisTitleColor?: string;
  xAxisTitleSize?: number;
  xAxisTitlePadding?: number;
  xAxisTickPosition?: 'outside' | 'inside' | 'cross';
  xAxisLabelWeight?: 'bold' | 'regular';
  xAxisLabelColor?: string;
  xAxisLabelSize?: number;
  xAxisLabelSpacing?: number;
  xAxisGridColor?: string;
  xAxisGridWidth?: number;
  xAxisGridOpacity?: number;
  xAxisGridDashArray?: string;

  // Y Axis
  yAxis: YAxisConfig;
}


const DEFAULT_COLORS = [ '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f' ];

export function LineChartD3( {
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
  curveType = 'monotone',
  // X Axis
  xAxisShow = true,
  xAxisTitle = '',
  xAxisShowGrid = true,
  xAxisShowDomain = true,
  xAxisTickCount = 10,
  xAxisTickSize = 6,
  xAxisTickPadding = 3,
  xAxisLabelRotation = 0,
  xAxisTickFormat = '',
  xAxisPosition = 'bottom',
  xAxisScaleType = 'linear',
  xAxisMin = null,
  xAxisMax = null,
  xAxisTitleType = 'auto',
  xAxisTitleWeight = 'regular',
  xAxisTitleColor = '#000000',
  xAxisTitleSize = 12,
  xAxisTitlePadding = 35,
  xAxisTickPosition = 'outside',
  xAxisLabelWeight = 'regular',
  xAxisLabelColor = '#000000',
  xAxisLabelSize = 12,
  xAxisLabelSpacing = 3,
  xAxisGridColor = '#e5e7eb',
  xAxisGridWidth = 1,
  xAxisGridOpacity = 0.5,
  xAxisGridDashArray = '0',
  // Y Axis
  yAxis,
}: LineChartD3Props ) {
  const svgRef = useRef<SVGSVGElement>( null );

  useEffect( () => {
    if ( !svgRef.current || data.length === 0 ) return;

    // Clear previous chart
    d3.select( svgRef.current ).selectAll( '*' ).remove();

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
    if ( legendPosition !== 'bottom' ) chartMargin.bottom = Math.max( chartMargin.bottom, 40 );
    if ( legendPosition !== 'left' ) chartMargin.left = Math.max( chartMargin.left, 50 );

    // Adjust margins for axis titles and labels
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      if ( xAxisPosition === 'bottom' ) chartMargin.bottom += xAxisTitlePadding + xAxisLabelSpacing;
      if ( xAxisPosition === 'top' ) chartMargin.top += xAxisTitlePadding + xAxisLabelSpacing;
    }

    if ( yAxis.show && yAxis.position !== 'hidden' ) {
      if ( yAxis.position === 'left' ) chartMargin.left += yAxis.titlePadding + yAxis.labelSpacing;
      if ( yAxis.position === 'right' ) chartMargin.right += yAxis.titlePadding + yAxis.labelSpacing;
    }

    // Add edge padding
    chartMargin.top += yAxis.edgePadding;
    chartMargin.bottom += yAxis.edgePadding;

    const innerWidth = width - chartMargin.left - chartMargin.right;
    const innerHeight = height - chartMargin.top - chartMargin.bottom;

    // Create SVG with viewBox for responsiveness
    const svg = d3
      .select( svgRef.current )
      .attr( 'viewBox', `0 0 ${ width } ${ height }` )
      .attr( 'preserveAspectRatio', 'xMidYMid meet' );

    const g = svg
      .append( 'g' )
      .attr( 'transform', `translate(${ chartMargin.left },${ chartMargin.top })` );

    // Scales
    const xScale = d3
      .scalePoint()
      .domain( data.map( ( d ) => String( d[ labelKey ] ) ) )
      .range( [ 0, innerWidth ] )
      .padding( 0.5 );

    // Calculate Y domain
    const yMin = yAxis.min !== null ? yAxis.min : 0;
    const yMax = yAxis.max !== null ? yAxis.max : ( d3.max( data, ( d ) =>
      Math.max( ...valueKeys.map( ( key ) => Number( d[ key ] ) || 0 ) )
    ) || 0 );

    const yScale = d3
      .scaleLinear()
      .domain( [ yMin, yMax ] )
      .range( [ innerHeight, 0 ] );

    // Only apply nice() if not using custom domain
    if ( yAxis.min === null && yAxis.max === null ) {
      yScale.nice();
    }

    // Y Grid lines
    if ( yAxis.showGrid ) {
      const grid = g.append( 'g' )
        .attr( 'class', 'y-grid' )
        .attr( 'opacity', 0.5 ) // Use a default opacity or add a prop for it
        .call(
          d3
            .axisLeft( yScale )
            .tickSize( -innerWidth )
            .tickFormat( () => '' )
            .ticks( yAxis.tickCount )
        );

      grid.selectAll( 'line' )
        .attr( 'stroke', yAxis.gridColor )
        .attr( 'stroke-width', yAxis.gridWidth )
        .attr( 'stroke-dasharray', yAxis.gridStyle === 'dashed' ? '4,4' : yAxis.gridStyle === 'dotted' ? '1,4' : '0' );

      grid.select( '.domain' ).remove();
    }

    // Y Axis
    if ( yAxis.show && yAxis.position !== 'hidden' ) {
      const yAxisFunction = yAxis.position === 'left' ? d3.axisLeft( yScale ) : d3.axisRight( yScale );
      const axis = yAxisFunction
        .tickSize( yAxis.tickSize )
        .tickPadding( yAxis.tickPadding )
        .ticks( yAxis.tickCount );

      // Apply tick format if provided
      if ( yAxis.tickFormat ) {
        try {
          axis.tickFormat( d3.format( yAxis.tickFormat ) );
        } catch ( e ) {
          console.warn( 'Invalid Y-axis tick format:', yAxis.tickFormat );
        }
      }

      const yAxisGroup = g.append( 'g' )
        .attr( 'transform', `translate(${ yAxis.position === 'left' ? 0 : innerWidth },0)` )
        .call( axis )
        .style( 'font-size', `${ yAxis.labelSize }px` )
        .style( 'font-weight', yAxis.labelWeight )
        .style( 'color', yAxis.labelColor );

      // Apply tick position
      if ( yAxis.tickPosition === 'inside' ) {
        yAxisGroup.selectAll( '.tick line' )
          .attr( 'x2', yAxis.position === 'left' ? yAxis.tickSize : -yAxis.tickSize );
      } else if ( yAxis.tickPosition === 'cross' ) {
        yAxisGroup.selectAll( '.tick line' )
          .attr( 'x1', yAxis.position === 'left' ? yAxis.tickSize / 2 : -yAxis.tickSize / 2 )
          .attr( 'x2', yAxis.position === 'left' ? -yAxis.tickSize / 2 : yAxis.tickSize / 2 );
      }

      // Apply label rotation
      if ( yAxis.labelAngle !== 0 ) {
        yAxisGroup.selectAll( 'text' )
          .attr( 'transform', `rotate(${ yAxis.labelAngle })` )
          .style( 'text-anchor', yAxis.labelAngle < 0 ? 'end' : 'start' );
      }

      // Add Y axis title
      if ( yAxis.title ) {
        const titleX = yAxis.position === 'left' ? -yAxis.titlePadding : innerWidth + yAxis.titlePadding;
        const titleY = innerHeight / 2;
        g.append( 'text' )
          .attr( 'transform', `translate(${ titleX },${ titleY }) rotate(-90)` )
          .style( 'text-anchor', 'middle' )
          .style( 'font-size', `${ yAxis.titleSize }px` )
          .style( 'font-weight', yAxis.titleWeight )
          .style( 'fill', yAxis.titleColor )
          .text( yAxis.title );
      }

      // Hide domain line if needed
      if ( !yAxis.showDomain ) {
        yAxisGroup.select( '.domain' ).remove();
      }

      // Apply axis line color/width if shown
      if ( yAxis.showDomain ) {
        yAxisGroup.select( '.domain' )
          .attr( 'stroke', yAxis.lineColor )
          .attr( 'stroke-width', yAxis.lineWidth );
      }
    }



    // X axis
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      // Determine axis function based on position
      const axisFunction = xAxisPosition === 'top' ? d3.axisTop( xScale ) : d3.axisBottom( xScale );
      const xAxis = axisFunction
        .tickSize( xAxisTickSize )
        .tickPadding( xAxisTickPadding );

      // Note: xAxisTickFormat is not applied for scalePoint as it uses string domain
      // Tick count also doesn't apply to scalePoint

      // Calculate Y position based on axis position
      const yPosition = xAxisPosition === 'top' ? 0 : innerHeight;

      const xAxisGroup = g.append( 'g' )
        .attr( 'transform', `translate(0,${ yPosition })` )
        .call( xAxis )
        .style( 'font-size', `${ xAxisLabelSize }px` )
        .style( 'font-weight', xAxisLabelWeight )
        .style( 'color', xAxisLabelColor );

      // Apply tick position
      if ( xAxisTickPosition === 'inside' ) {
        xAxisGroup.selectAll( '.tick line' )
          .attr( 'y2', xAxisPosition === 'top' ? xAxisTickSize : -xAxisTickSize );
      } else if ( xAxisTickPosition === 'cross' ) {
        xAxisGroup.selectAll( '.tick line' )
          .attr( 'y1', xAxisPosition === 'top' ? xAxisTickSize / 2 : -xAxisTickSize / 2 )
          .attr( 'y2', xAxisPosition === 'top' ? -xAxisTickSize / 2 : xAxisTickSize / 2 );
      }

      // Apply label rotation
      if ( xAxisLabelRotation !== 0 ) {
        xAxisGroup.selectAll( 'text' )
          .attr( 'transform', `rotate(${ xAxisLabelRotation })` )
          .style( 'text-anchor', xAxisLabelRotation > 0 ? 'start' : 'end' )
          .attr( 'dx', xAxisLabelRotation > 0 ? '0.5em' : '-0.5em' )
          .attr( 'dy', xAxisLabelRotation > 0 ? '0.5em' : '0.5em' );
      }

      // Apply label spacing
      xAxisGroup.selectAll( '.tick text' )
        .attr( 'dy', xAxisPosition === 'top' ? `-${ xAxisLabelSpacing }px` : `${ xAxisLabelSpacing }px` );

      // Add X axis title
      if ( xAxisTitle ) {
        const titleY = xAxisPosition === 'top'
          ? -xAxisTitlePadding
          : innerHeight + xAxisTitlePadding;

        g.append( 'text' )
          .attr( 'x', innerWidth / 2 )
          .attr( 'y', titleY )
          .style( 'text-anchor', 'middle' )
          .style( 'font-size', `${ xAxisTitleSize }px` )
          .style( 'font-weight', xAxisTitleWeight )
          .style( 'fill', xAxisTitleColor )
          .text( xAxisTitle );
      }

      // Hide domain line if needed
      if ( !xAxisShowDomain ) {
        xAxisGroup.select( '.domain' ).remove();
      }

      // X Grid lines
      if ( xAxisShowGrid ) {
        const grid = g.append( 'g' )
          .attr( 'class', 'x-grid' )
          .attr( 'opacity', xAxisGridOpacity )
          .call(
            d3
              .axisBottom( xScale )
              .tickSize( innerHeight )
              .tickFormat( () => '' )
          );

        grid.selectAll( 'line' )
          .attr( 'stroke', xAxisGridColor )
          .attr( 'stroke-width', xAxisGridWidth )
          .attr( 'stroke-dasharray', xAxisGridDashArray );

        grid.select( '.domain' ).remove();
      }
    }

    // Draw lines for each value key
    valueKeys.forEach( ( key, index ) => {
      const color = colors[ index % colors.length ];

      // Line generator
      const line = d3
        .line<any>()
        .x( ( d ) => ( xScale( String( d[ labelKey ] ) ) || 0 ) + xScale.bandwidth() / 2 )
        .y( ( d ) => yScale( Number( d[ key ] ) ) );

      if ( curveType === 'monotone' ) line.curve( d3.curveMonotoneX );
      if ( curveType === 'step' ) line.curve( d3.curveStep );
      if ( curveType === 'linear' ) line.curve( d3.curveLinear );

      // Line
      g.append( 'path' )
        .datum( data )
        .attr( 'fill', 'none' )
        .attr( 'stroke', color )
        .attr( 'stroke-width', 2 )
        .attr( 'd', line( data ) );

      // Dots
      g.selectAll( `.dot-${ index }` )
        .data( data )
        .enter()
        .append( 'circle' )
        .attr( 'class', `dot-${ index }` )
        .attr( 'cx', ( d ) => ( xScale( String( d[ labelKey ] ) ) || 0 ) + xScale.bandwidth() / 2 )
        .attr( 'cy', ( d ) => yScale( Number( d[ key ] ) ) )
        .attr( 'r', 4 )
        .attr( 'fill', color )
        .attr( 'stroke', '#fff' )
        .attr( 'stroke-width', 2 );
    } );

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
        legendY = height - chartMargin.bottom + 45 - legendPaddingBottom;
        legendOrientation = 'horizontal';
      }

      const legend = svg
        .append( 'g' )
        .attr( 'transform', `translate(${ legendX },${ legendY })` );

      if ( legendOrientation === 'vertical' ) {
        // Vertical layout
        valueKeys.forEach( ( key, index ) => {
          const legendRow = legend
            .append( 'g' )
            .attr( 'transform', `translate(0,${ index * ( 15 + legendGap ) })` );

          legendRow
            .append( 'rect' )
            .attr( 'width', 15 )
            .attr( 'height', 15 )
            .attr( 'fill', colors[ index % colors.length ] );

          legendRow
            .append( 'text' )
            .attr( 'x', 20 )
            .attr( 'y', 12 )
            .text( key )
            .style( 'font-size', `${ legendFontSize }px` )
            .attr( 'text-anchor', 'start' );
        } );
      } else {
        // Horizontal layout with wrapping
        let cumulativeX = 0;
        let cumulativeY = 0;
        const maxWidth = innerWidth;
        const lineHeight = 15 + legendGap;

        valueKeys.forEach( ( key, index ) => {
          // Estimate item width (rect + spacing + text width)
          const itemWidth = 15 + 5 + key.length * legendFontSize * 0.6 + legendGap;

          // Check if we need to wrap to next line
          if ( cumulativeX > 0 && cumulativeX + itemWidth > maxWidth ) {
            cumulativeX = 0;
            cumulativeY += lineHeight;
          }

          const legendItem = legend
            .append( 'g' )
            .attr( 'transform', `translate(${ cumulativeX },${ cumulativeY })` );

          legendItem
            .append( 'rect' )
            .attr( 'width', 15 )
            .attr( 'height', 15 )
            .attr( 'fill', colors[ index % colors.length ] );

          legendItem
            .append( 'text' )
            .attr( 'x', 20 )
            .attr( 'y', 12 )
            .text( key )
            .style( 'font-size', `${ legendFontSize }px` )
            .attr( 'text-anchor', 'start' );

          // Move X position for next item
          cumulativeX += itemWidth;
        } );
      }
    }
  }, [ data, labelKey, valueKeys, propWidth, propHeight, colors, colorMode, legendShow, legendPosition, legendAlignment, legendFontSize, legendGap, legendPaddingTop, legendPaddingRight, legendPaddingBottom, legendPaddingLeft, xAxisShow, xAxisTitle, xAxisShowGrid, xAxisShowDomain, xAxisTickCount, xAxisTickSize, xAxisTickPadding, xAxisLabelRotation, xAxisTickFormat, xAxisPosition, xAxisScaleType, xAxisMin, xAxisMax, xAxisTitleType, xAxisTitleWeight, xAxisTitleColor, xAxisTitleSize, xAxisTitlePadding, xAxisTickPosition, xAxisLabelWeight, xAxisLabelColor, xAxisLabelSize, xAxisLabelSpacing, xAxisGridColor, xAxisGridWidth, xAxisGridOpacity, xAxisGridDashArray, yAxis ] );

  return (
    <svg ref={ svgRef } className='w-full h-full' />
  );
}
