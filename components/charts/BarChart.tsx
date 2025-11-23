'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { useChartStore } from '@/store/useChartStore';
import { createScale } from '@/utils/chartScales';
import { inferScaleType } from '@/utils/inferScaleType';
import { ChartZoomControls } from './ChartZoomControls';

interface BarChartProps {
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
  xAxisScaleType?: 'linear' | 'log' | 'time' | 'band' | 'point';
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
  yAxis?: YAxisConfig;
}

const DEFAULT_COLORS = [ '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f' ];

export function BarChart( {
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
  yAxis = DEFAULT_Y_AXIS_CONFIG,
}: BarChartProps ) {

  const svgRef = useRef<SVGSVGElement>( null );

  // Store hooks
  const zoomDomain = useChartStore( ( state ) => state.zoomDomain );
  const setZoomDomain = useChartStore( ( state ) => state.setZoomDomain );
  const showZoomControls = useChartStore( ( state ) => state.showZoomControls );
  const setXAxisScaleType = useChartStore( ( state ) => state.setXAxisScaleType );

  // Automatically infer and set X-axis scale type when data or labelKey changes
  useEffect( () => {
    if ( !data || data.length === 0 || !labelKey ) return;

    const values = data.map( d => d[ labelKey ] );
    const inferredType = inferScaleType( values );

    setXAxisScaleType( inferredType === 'point' ? 'band' : inferredType );
  }, [ data, labelKey, setXAxisScaleType ] );

  // 1. Calculate Dimensions
  const { innerWidth, innerHeight, chartMargin } = useMemo( () => {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const legendSpace = 120;

    if ( legendShow ) {
      if ( legendPosition === 'top' ) margin.top += legendSpace;
      if ( legendPosition === 'bottom' ) margin.bottom += legendSpace;
      if ( legendPosition === 'left' ) margin.left += legendSpace;
      if ( legendPosition === 'right' ) margin.right += legendSpace;
    }

    if ( legendPosition !== 'bottom' ) margin.bottom = Math.max( margin.bottom, 40 );
    if ( legendPosition !== 'left' ) margin.left = Math.max( margin.left, 50 );

    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      if ( xAxisPosition === 'bottom' ) margin.bottom += xAxisTitlePadding + xAxisLabelSpacing;
      if ( xAxisPosition === 'top' ) margin.top += xAxisTitlePadding + xAxisLabelSpacing;
    }

    if ( yAxis.show && yAxis.position !== 'hidden' ) {
      if ( yAxis.position === 'left' ) margin.left += yAxis.titlePadding + yAxis.labelSpacing;
      if ( yAxis.position === 'right' ) margin.right += yAxis.titlePadding + yAxis.labelSpacing;
    }

    margin.top += yAxis.edgePadding;
    margin.bottom += yAxis.edgePadding;

    return {
      innerWidth: propWidth - margin.left - margin.right,
      innerHeight: propHeight - margin.top - margin.bottom,
      chartMargin: margin
    };
  }, [
    propWidth, propHeight, legendShow, legendPosition,
    xAxisShow, xAxisPosition, xAxisTitlePadding, xAxisLabelSpacing,
    yAxis.show, yAxis.position, yAxis.titlePadding, yAxis.labelSpacing, yAxis.edgePadding
  ] );

  // 2. Filter Data
  const filteredData = useMemo( () => {
    if ( !zoomDomain?.x ) return data;
    const [ xMin, xMax ] = zoomDomain.x;
    return data.filter( ( d, i ) => {
      return i >= xMin && i <= xMax;
    } );
  }, [ data, zoomDomain?.x ] );

  // 3. Create Scales
  const x0Scale = useMemo( () => {
    let domainValues: any[];
    if ( xAxisScaleType === 'linear' ) {
      domainValues = filteredData.map( ( d ) => Number( d[ labelKey ] ) );
    } else if ( xAxisScaleType === 'time' ) {
      domainValues = filteredData.map( ( d ) => new Date( d[ labelKey ] ) );
    } else {
      domainValues = filteredData.map( ( d ) => String( d[ labelKey ] ) );
    }

    return createScale( xAxisScaleType, {
      domain: domainValues,
      range: [ 0, innerWidth ],
      padding: 0.2 // Default padding for band scale
    } );
  }, [ filteredData, labelKey, xAxisScaleType, innerWidth ] );

  const x1Scale = useMemo( () => {
    // This scale is for the bars within a group
    // It's always a band scale
    // We need to know the bandwidth of x0Scale if it's a band scale
    // If x0Scale is linear/time, we need a fixed width or calculated width

    let bandwidth = 0;
    if ( 'bandwidth' in x0Scale ) {
      bandwidth = ( x0Scale as d3.ScaleBand<string> ).bandwidth();
    } else {
      // Fallback for linear/time scales: divide width by data length * 1.5 (gap)
      bandwidth = innerWidth / ( filteredData.length || 1 ) * 0.8;
    }

    return d3.scaleBand()
      .domain( valueKeys )
      .range( [ 0, bandwidth ] )
      .padding( 0.05 );
  }, [ valueKeys, x0Scale, innerWidth, filteredData.length ] );

  const yScale = useMemo( () => {
    const yMin = yAxis.min !== null ? yAxis.min : 0;
    const yMax = yAxis.max !== null ? yAxis.max : ( d3.max( filteredData, ( d ) =>
      Math.max( ...valueKeys.map( ( key ) => Number( d[ key ] ) || 0 ) )
    ) || 0 );

    const scale = d3.scaleLinear()
      .domain( [ yMin, yMax ] )
      .range( [ innerHeight, 0 ] );

    if ( yAxis.min === null && yAxis.max === null ) {
      scale.nice();
    }

    return scale;
  }, [ filteredData, valueKeys, yAxis.min, yAxis.max, innerHeight ] );

  // Helper to get X position
  const getXPosition = ( d: any ) => {
    const val = d[ labelKey ];
    if ( xAxisScaleType === 'time' ) {
      return x0Scale( new Date( val ) as any ) || 0;
    } else if ( xAxisScaleType === 'linear' ) {
      return x0Scale( Number( val ) as any ) || 0;
    } else {
      return x0Scale( String( val ) as any ) || 0;
    }
  };

  // Render Chart
  useEffect( () => {
    if ( !svgRef.current || !x0Scale || !yScale ) return;

    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    // Set viewBox for responsiveness
    svg
      .attr( 'viewBox', `0 0 ${ propWidth } ${ propHeight }` )
      .attr( 'preserveAspectRatio', 'xMidYMid meet' );

    // Clip Path
    const clipId = `clip-${ Math.random().toString( 36 ).substr( 2, 9 ) }`;
    svg.append( 'defs' )
      .append( 'clipPath' )
      .attr( 'id', clipId )
      .append( 'rect' )
      .attr( 'width', innerWidth )
      .attr( 'height', innerHeight );

    const g = svg
      .append( 'g' )
      .attr( 'transform', `translate(${ chartMargin.left },${ chartMargin.top })` );

    // Grid
    if ( xAxisShowGrid ) {
      const grid = g.append( 'g' )
        .attr( 'class', 'x-grid' )
        .attr( 'transform', `translate(0,${ innerHeight })` )
        .attr( 'opacity', xAxisGridOpacity );

      const gridAxis = d3.axisBottom( x0Scale as any )
        .tickSize( -innerHeight )
        .tickFormat( () => '' );

      if ( xAxisTickCount ) gridAxis.ticks( xAxisTickCount );

      grid.call( gridAxis );

      grid.selectAll( 'line' )
        .attr( 'stroke', xAxisGridColor )
        .attr( 'stroke-width', xAxisGridWidth )
        .attr( 'stroke-dasharray', xAxisGridDashArray );

      grid.select( '.domain' ).remove();
    }

    if ( yAxis.showGrid ) {
      const grid = g.append( 'g' )
        .attr( 'class', 'y-grid' )
        .attr( 'opacity', 0.5 );

      const gridAxis = d3.axisLeft( yScale )
        .tickSize( -innerWidth )
        .tickFormat( () => '' )
        .ticks( yAxis.tickCount );

      grid.call( gridAxis );

      grid.selectAll( 'line' )
        .attr( 'stroke', yAxis.gridColor )
        .attr( 'stroke-width', yAxis.gridWidth )
        .attr( 'stroke-dasharray', yAxis.gridStyle === 'dashed' ? '4,4' : yAxis.gridStyle === 'dotted' ? '1,4' : '0' );

      grid.select( '.domain' ).remove();
    }

    // Bars (Clipped)
    const contentGroup = g.append( 'g' ).attr( 'clip-path', `url(#${ clipId })` );

    const barGroups = contentGroup
      .selectAll( '.bar-group' )
      .data( filteredData )
      .enter()
      .append( 'g' )
      .attr( 'class', 'bar-group' )
      .attr( 'transform', ( d ) => {
        // For linear/time scales, we center the group around the point
        // For band scales, it's already at the start of the band
        let xPos = getXPosition( d );
        if ( xAxisScaleType !== 'band' && xAxisScaleType !== 'point' ) {
          // Center the group: subtract half the group width
          // Group width is roughly x1Scale.range()[1]
          xPos -= x1Scale.range()[ 1 ] / 2;
        }
        return `translate(${ xPos },0)`;
      } );

    barGroups.selectAll( 'rect' )
      .data( ( d ) => valueKeys.map( ( key ) => ( { key, value: d[ key ] } ) ) )
      .enter()
      .append( 'rect' )
      .attr( 'x', ( d ) => x1Scale( d.key ) || 0 )
      .attr( 'y', ( d ) => yScale( Number( d.value ) ) )
      .attr( 'width', x1Scale.bandwidth() )
      .attr( 'height', ( d ) => Math.max( 0, innerHeight - yScale( Number( d.value ) ) ) )
      .attr( 'fill', ( d, i ) => colors[ i % colors.length ] );

    // Axes
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      const axisFn = xAxisPosition === 'top' ? d3.axisTop( x0Scale as any ) : d3.axisBottom( x0Scale as any );
      const axis = axisFn.tickSize( xAxisTickSize ).tickPadding( xAxisTickPadding );

      if ( xAxisTickCount ) axis.ticks( xAxisTickCount );
      if ( xAxisTickFormat ) {
        if ( xAxisScaleType === 'time' ) {
          axis.tickFormat( d3.timeFormat( xAxisTickFormat ) as any );
        } else {
          try { axis.tickFormat( d3.format( xAxisTickFormat ) as any ); } catch ( e ) { }
        }
      }

      const xAxisGroup = g.append( 'g' )
        .attr( 'transform', `translate(0,${ xAxisPosition === 'top' ? 0 : innerHeight })` )
        .call( axis )
        .style( 'font-size', `${ xAxisLabelSize }px` )
        .style( 'font-weight', xAxisLabelWeight )
        .style( 'color', xAxisLabelColor );

      // Label rotation
      if ( xAxisLabelRotation !== 0 ) {
        xAxisGroup.selectAll( 'text' )
          .attr( 'transform', `rotate(${ xAxisLabelRotation })` )
          .style( 'text-anchor', xAxisLabelRotation > 0 ? 'start' : 'end' )
          .attr( 'dx', xAxisLabelRotation > 0 ? '0.5em' : '-0.5em' )
          .attr( 'dy', xAxisLabelRotation > 0 ? '0.5em' : '0.5em' );
      }

      // Axis Title
      if ( xAxisTitle ) {
        const titleY = xAxisPosition === 'top' ? -xAxisTitlePadding : innerHeight + xAxisTitlePadding;
        g.append( 'text' )
          .attr( 'x', innerWidth / 2 )
          .attr( 'y', titleY )
          .style( 'text-anchor', 'middle' )
          .style( 'font-size', `${ xAxisTitleSize }px` )
          .style( 'font-weight', xAxisTitleWeight )
          .style( 'fill', xAxisTitleColor )
          .text( xAxisTitle );
      }

      if ( !xAxisShowDomain ) xAxisGroup.select( '.domain' ).remove();
    }

    if ( yAxis.show && yAxis.position !== 'hidden' ) {
      const axisFn = yAxis.position === 'left' ? d3.axisLeft( yScale ) : d3.axisRight( yScale );
      const axis = axisFn.tickSize( yAxis.tickSize ).tickPadding( yAxis.tickPadding ).ticks( yAxis.tickCount );

      if ( yAxis.tickFormat ) {
        try { axis.tickFormat( d3.format( yAxis.tickFormat ) ); } catch ( e ) { }
      }

      const yAxisGroup = g.append( 'g' )
        .attr( 'transform', `translate(${ yAxis.position === 'left' ? 0 : innerWidth },0)` )
        .call( axis )
        .style( 'font-size', `${ yAxis.labelSize }px` )
        .style( 'font-weight', yAxis.labelWeight )
        .style( 'color', yAxis.labelColor );

      // Axis Title
      if ( yAxis.title ) {
        const titleX = yAxis.position === 'left' ? -yAxis.titlePadding : innerWidth + yAxis.titlePadding;
        g.append( 'text' )
          .attr( 'transform', `translate(${ titleX },${ innerHeight / 2 }) rotate(-90)` )
          .style( 'text-anchor', 'middle' )
          .style( 'font-size', `${ yAxis.titleSize }px` )
          .style( 'font-weight', yAxis.titleWeight )
          .style( 'fill', yAxis.titleColor )
          .text( yAxis.title );
      }

      if ( !yAxis.showDomain ) yAxisGroup.select( '.domain' ).remove();
      if ( yAxis.showDomain ) {
        yAxisGroup.select( '.domain' )
          .attr( 'stroke', yAxis.lineColor )
          .attr( 'stroke-width', yAxis.lineWidth );
      }
    }

    // Legend
    if ( legendShow ) {
      let legendX = 0, legendY = 0;
      if ( legendPosition === 'right' ) {
        legendX = propWidth - chartMargin.right + 5 - legendPaddingRight;
        legendY = chartMargin.top + legendPaddingTop;
      } else if ( legendPosition === 'left' ) {
        legendX = 5 + legendPaddingLeft;
        legendY = chartMargin.top + legendPaddingTop;
      } else if ( legendPosition === 'top' ) {
        legendX = chartMargin.left + legendPaddingLeft;
        legendY = 5 + legendPaddingTop;
      } else if ( legendPosition === 'bottom' ) {
        legendX = chartMargin.left + legendPaddingLeft;
        legendY = propHeight - chartMargin.bottom + 45 - legendPaddingBottom;
      }

      const legend = svg.append( 'g' ).attr( 'transform', `translate(${ legendX },${ legendY })` );

      valueKeys.forEach( ( key, index ) => {
        const row = legend.append( 'g' ).attr( 'transform', `translate(0,${ index * 20 })` );
        row.append( 'rect' ).attr( 'width', 12 ).attr( 'height', 12 ).attr( 'fill', colors[ index % colors.length ] );
        row.append( 'text' ).attr( 'x', 20 ).attr( 'y', 10 ).text( key ).style( 'font-size', '12px' );
      } );
    }

    // Add brush for zoom interaction
    const brush = d3.brushX()
      .extent( [ [ 0, 0 ], [ innerWidth, innerHeight ] ] )
      .on( 'end', ( event ) => {
        if ( !event.selection ) return;

        const [ x0, x1 ] = event.selection as [ number, number ];

        // Convert pixel coordinates to data indices
        const allLabels = data.map( ( d ) => String( d[ labelKey ] ) );
        const xScaleFull = d3.scalePoint()
          .domain( allLabels )
          .range( [ 0, innerWidth ] )
          .padding( 0.5 );

        // Find the indices of the selected range
        let startIndex = 0;
        let endIndex = data.length - 1;

        allLabels.forEach( ( label, i ) => {
          const pos = ( xScaleFull( label ) || 0 ) + xScaleFull.bandwidth() / 2;
          if ( pos >= x0 && i < startIndex ) startIndex = i;
          if ( pos <= x1 ) endIndex = i;
        } );

        // Calculate Y domain from the selected data range
        const selectedData = data.slice( startIndex, endIndex + 1 );
        const yMinSelected = d3.min( selectedData, ( d ) =>
          Math.min( ...valueKeys.map( ( key ) => Number( d[ key ] ) || 0 ) )
        ) || 0;
        const yMaxSelected = d3.max( selectedData, ( d ) =>
          Math.max( ...valueKeys.map( ( key ) => Number( d[ key ] ) || 0 ) )
        ) || 0;

        // Update zoom domain
        setZoomDomain( {
          x: [ startIndex, endIndex ],
          y: [ yMinSelected, yMaxSelected ],
        } );

        // Clear brush selection
        g.select( '.brush' ).call( brush.move as any, null );
      } );

    // Add brush overlay
    g.append( 'g' )
      .attr( 'class', 'brush' )
      .call( brush );

  }, [
    filteredData, x0Scale, x1Scale, yScale, innerWidth, innerHeight, chartMargin,
    colors, colorMode,
    xAxisShow, xAxisShowGrid, xAxisGridColor, xAxisGridWidth, xAxisGridOpacity, xAxisGridDashArray,
    yAxis, xAxisPosition, xAxisTickSize, xAxisTickPadding, xAxisTickCount, xAxisTickFormat,
    xAxisLabelSize, xAxisLabelWeight, xAxisLabelColor, xAxisLabelRotation,
    xAxisTitle, xAxisTitleSize, xAxisTitleWeight, xAxisTitleColor, xAxisTitlePadding,
    legendShow, legendPosition, valueKeys
  ] );

  return (
    <div className='relative w-full h-full'>
      <ChartZoomControls xScale={ x0Scale } yScale={ yScale } dataLength={ data.length } />
      <svg ref={ svgRef } width={ propWidth } height={ propHeight } className='overflow-visible w-full h-full' />
    </div>
  );
}
