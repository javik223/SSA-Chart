'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { useChartStore } from '@/store/useChartStore';
import { createScale } from '@/utils/chartScales';
import { inferScaleType } from '@/utils/inferScaleType';
import { ChartZoomControls } from './ChartZoomControls';
import {
  calculateChartMargins,
  createClipPath,
  getXPosition as getXPositionHelper,
  renderXAxis,
  renderYAxis,
  renderXGrid,
  renderYGrid,
  renderLegend,
  setupBrushZoom
} from '@/utils/chartHelpers';

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

  // 1. Calculate Dimensions using utility function
  const { innerWidth, innerHeight, margin: chartMargin } = useMemo( () => {
    return calculateChartMargins( {
      width: propWidth,
      height: propHeight,
      legendShow,
      legendPosition,
      xAxisShow,
      xAxisPosition,
      xAxisTitlePadding,
      xAxisLabelSpacing,
      yAxis
    } );
  }, [
    propWidth, propHeight, legendShow, legendPosition,
    xAxisShow, xAxisPosition, xAxisTitlePadding, xAxisLabelSpacing,
    yAxis
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

  // Helper to get X position (uses utility)
  const getXPosition = ( d: any ) => {
    return getXPositionHelper( d, labelKey, x0Scale, xAxisScaleType );
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

    // Clip Path (using utility)
    const clipId = createClipPath( svg, innerWidth, innerHeight );

    const g = svg
      .append( 'g' )
      .attr( 'transform', `translate(${ chartMargin.left },${ chartMargin.top })` );

    // X Grid (using utility)
    renderXGrid( g, {
      xScale: x0Scale,
      innerWidth,
      innerHeight,
      xAxisShowGrid,
      xAxisGridColor,
      xAxisGridWidth,
      xAxisGridOpacity,
      xAxisGridDashArray,
      xAxisTickCount
    } );

    // Y Grid (using utility)
    renderYGrid( g, {
      yScale,
      innerWidth,
      innerHeight,
      yAxis
    } );

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

    // X Axis (using utility)
    renderXAxis( g, {
      xScale: x0Scale,
      innerWidth,
      innerHeight,
      xAxisShow,
      xAxisPosition,
      xAxisTickSize,
      xAxisTickPadding,
      xAxisTickCount,
      xAxisTickFormat,
      xAxisScaleType,
      xAxisLabelSize,
      xAxisLabelWeight,
      xAxisLabelColor,
      xAxisLabelRotation,
      xAxisLabelSpacing,
      xAxisTitle,
      xAxisTitleSize,
      xAxisTitleWeight,
      xAxisTitleColor,
      xAxisTitlePadding,
      xAxisShowDomain
    } );

    // Y Axis (using utility)
    renderYAxis( g, {
      yScale,
      innerWidth,
      innerHeight,
      yAxis
    } );

    // Legend (using utility)
    renderLegend( {
      svg,
      width: propWidth,
      height: propHeight,
      chartMargin,
      innerWidth,
      valueKeys,
      colors,
      legendShow,
      legendPosition,
      legendAlignment,
      legendFontSize,
      legendGap,
      legendPaddingTop,
      legendPaddingRight,
      legendPaddingBottom,
      legendPaddingLeft
    } );

    // Brush zoom (using utility)
    setupBrushZoom( {
      g,
      innerWidth,
      innerHeight,
      data,
      labelKey,
      valueKeys,
      setZoomDomain
    } );

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
