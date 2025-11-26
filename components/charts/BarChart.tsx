'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { useChartStore } from '@/store/useChartStore';
import { createScale } from '@/utils/chartScales';
import { inferScaleType } from '@/utils/inferScaleType';
import { ChartZoomControls } from './ChartZoomControls';
import { calculateChartMargins } from '@/utils/chartHelpers';
import { getColorPalette } from '@/lib/colorPalettes';

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
  colorPalette?: string;

  // X Axis
  xAxisShow?: boolean;
  xAxisTitle?: string;
  xAxisName?: string;
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

import { BaseChart } from './BaseChart';

interface BarChartContentProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  xScale: any;
  yScale: any;
  colors: string[];
  colorMode: 'by-column' | 'by-row';
  innerHeight: number;
}

const BarChartContent = ( {
  data,
  labelKey,
  valueKeys,
  xScale,
  yScale,
  colors,
  colorMode,
  innerHeight
}: BarChartContentProps ) => {
  const gRef = useRef<SVGGElement>( null );

  useEffect( () => {
    if ( !gRef.current || !data ) return;

    const g = d3.select( gRef.current );

    // Render Bars
    // We group bars by category (X axis value)
    const barGroups = g
      .selectAll<SVGGElement, any>( '.bar-group' )
      .data( data, ( d ) => String( d[ labelKey ] ) );

    barGroups.exit().remove();

    const barGroupsEnter = barGroups
      .enter()
      .append( 'g' )
      .attr( 'class', 'bar-group' );

    const barGroupsMerge = barGroupsEnter.merge( barGroups );

    barGroupsMerge
      .attr( 'transform', ( d ) => `translate(${ xScale( String( d[ labelKey ] ) ) || 0 },0)` );

    // Inner bars (for multiple values per category)
    const xSubScale = d3.scaleBand()
      .domain( valueKeys )
      .range( [ 0, xScale.bandwidth() ] )
      .padding( 0.05 );

    // For each group, render rects
    barGroupsMerge.each( function ( d ) {
      const group = d3.select( this );
      const rects = group.selectAll<SVGRectElement, string>( 'rect' )
        .data( valueKeys );

      rects.exit().remove();

      const rectsEnter = rects.enter().append( 'rect' );

      const rectsMerge = rectsEnter.merge( rects );

      rectsMerge
        .attr( 'fill', ( key, i ) => colorMode === 'by-column'
          ? ( colors?.[ i ] || '#8884d8' )
          : ( colors?.[ data.indexOf( d ) % colors.length ] || '#8884d8' )
        )
        .attr( 'width', xSubScale.bandwidth() )
        .attr( 'rx', 4 ) // Rounded corners
        .attr( 'ry', 4 );

      // Animate bars
      rectsMerge.transition()
        .duration( 500 )
        .attr( 'x', ( key ) => xSubScale( key ) || 0 )
        .attr( 'y', ( key ) => yScale( Number( d[ key ] ) || 0 ) )
        .attr( 'height', ( key ) => innerHeight - yScale( Number( d[ key ] ) || 0 ) );
    } );

  }, [ data, labelKey, valueKeys, xScale, yScale, colors, colorMode, innerHeight ] );

  return <g ref={ gRef } className="bar-chart-content" />;
};

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
  colorPalette = 'default',
  // X Axis
  xAxisShow = true,
  xAxisTitle = '',
  xAxisName,
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

  // Store hooks
  const zoomDomain = useChartStore( ( state ) => state.zoomDomain );

  // Chart dimensions
  const margin = useMemo( () => calculateChartMargins( {
    width: propWidth,
    height: propHeight,
    legendShow,
    legendPosition,
    xAxisShow,
    xAxisPosition,
    xAxisTitlePadding,
    xAxisLabelSpacing,
    xAxisTickSize,
    xAxisTickPadding,
    xAxisLabelSize,
    xAxisTitleSize,
    yAxis
  } ), [
    propWidth, propHeight, legendShow, legendPosition,
    xAxisShow, xAxisPosition, xAxisTitlePadding, xAxisLabelSpacing,
    xAxisTickSize, xAxisTickPadding, xAxisLabelSize, xAxisTitleSize,
    yAxis
  ] );

  const { innerWidth, innerHeight } = margin;

  // Filter data based on zoom
  const filteredData = useMemo( () => {
    if ( !zoomDomain || !zoomDomain.x ) return data;
    const [ start, end ] = zoomDomain.x;
    return data.slice( start, end + 1 );
  }, [ data, zoomDomain ] );

  // Create scales
  const xScale = useMemo( () => {
    return d3.scaleBand()
      .domain( filteredData.map( ( d ) => String( d[ labelKey ] ) ) )
      .range( [ 0, innerWidth ] )
      .padding( 0.2 );
  }, [ filteredData, labelKey, innerWidth ] );

  const yScale = useMemo( () => {
    const yMax = d3.max( filteredData, ( d ) =>
      Math.max( ...valueKeys.map( ( key ) => Number( d[ key ] ) || 0 ) )
    ) || 0;

    // Ensure yMax is at least slightly above 0 to avoid flat line at bottom
    const safeYMax = yMax === 0 ? 1 : yMax;

    return d3.scaleLinear()
      .domain( [ 0, safeYMax * 1.1 ] ) // Add 10% padding on top
      .range( [ innerHeight, 0 ] );
  }, [ filteredData, valueKeys, innerHeight ] );

  const colorScale = useMemo( () => {
    return d3.scaleOrdinal<string, string>()
      .domain( valueKeys )
      .range( colors || getColorPalette( colorPalette ).colors );
  }, [ valueKeys, colors, colorPalette ] );

  // Use effective colors (either provided or from palette)
  const effectiveColors = colors || getColorPalette( colorPalette ).colors;

  return (
    <BaseChart
      data={ filteredData }
      labelKey={ labelKey }
      valueKeys={ valueKeys }
      width={ propWidth }
      height={ propHeight }
      colors={ effectiveColors }
      colorMode={ colorMode }
      legendShow={ legendShow }
      legendPosition={ legendPosition }
      legendAlignment={ legendAlignment }
      legendFontSize={ legendFontSize }
      legendGap={ legendGap }
      legendPaddingTop={ legendPaddingTop }
      legendPaddingRight={ legendPaddingRight }
      legendPaddingBottom={ legendPaddingBottom }
      legendPaddingLeft={ legendPaddingLeft }
      xAxisShow={ xAxisShow }
      xAxisTitle={ xAxisTitle }
      xAxisName={ xAxisName }
      xAxisShowGrid={ xAxisShowGrid }
      xAxisShowDomain={ xAxisShowDomain }
      xAxisTickCount={ xAxisTickCount }
      xAxisTickSize={ xAxisTickSize }
      xAxisTickPadding={ xAxisTickPadding }
      xAxisLabelRotation={ xAxisLabelRotation }
      xAxisTickFormat={ xAxisTickFormat }
      xAxisPosition={ xAxisPosition }
      xAxisScaleType={ xAxisScaleType }
      xAxisMin={ xAxisMin }
      xAxisMax={ xAxisMax }
      xAxisTitleType={ xAxisTitleType }
      xAxisTitleWeight={ xAxisTitleWeight }
      xAxisTitleColor={ xAxisTitleColor }
      xAxisTitleSize={ xAxisTitleSize }
      xAxisTitlePadding={ xAxisTitlePadding }
      xAxisTickPosition={ xAxisTickPosition }
      xAxisLabelWeight={ xAxisLabelWeight }
      xAxisLabelColor={ xAxisLabelColor }
      xAxisLabelSize={ xAxisLabelSize }
      xAxisLabelSpacing={ xAxisLabelSpacing }
      xAxisGridColor={ xAxisGridColor }
      xAxisGridWidth={ xAxisGridWidth }
      xAxisGridOpacity={ xAxisGridOpacity }
      xAxisGridDashArray={ xAxisGridDashArray }
      yAxis={ yAxis }
      xScale={ xScale }
      yScale={ yScale }
    >
      <BarChartContent
        data={ filteredData }
        labelKey={ labelKey }
        valueKeys={ valueKeys }
        xScale={ xScale }
        yScale={ yScale }
        colors={ effectiveColors }
        colorMode={ colorMode }
        innerHeight={ innerHeight }
      />
    </BaseChart>
  );
}

