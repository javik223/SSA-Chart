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
  setupBrushZoom,
  setupPan
} from '@/utils/chartHelpers';
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
  colorPalette = 'default',
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

  const previousZoomDomainRef = useRef<typeof zoomDomain>( null );

  // Chart dimensions
  const margin = useMemo( () => calculateChartMargins( {
    legendShow,
    legendPosition,
    xAxisShow,
    xAxisPosition,
    xAxisTitlePadding,
    xAxisLabelSpacing,
    yAxis,
    width: propWidth,
    height: propHeight
  } ), [
    legendShow,
    legendPosition,
    xAxisShow,
    xAxisPosition,
    xAxisTitlePadding,
    xAxisLabelSpacing,
    yAxis,
    propWidth,
    propHeight
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

  useEffect( () => {
    if ( !svgRef.current || !data || !propWidth || !propHeight ) return;

    const isZoomUpdate = previousZoomDomainRef.current !== null &&
      JSON.stringify( previousZoomDomainRef.current ) !== JSON.stringify( zoomDomain );

    previousZoomDomainRef.current = zoomDomain;

    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).interrupt(); // Stop any active transitions

    // Create main group if it doesn't exist
    let g = svg.select<SVGGElement>( 'g.main-group' );
    if ( g.empty() ) {
      svg.selectAll( '*' ).remove();
      g = svg
        .append( 'g' )
        .attr( 'class', 'main-group' )
        .attr( 'transform', `translate(${ margin.margin.left },${ margin.margin.top })` );
    } else {
      g.attr( 'transform', `translate(${ margin.margin.left },${ margin.margin.top })` );
    }

    // Handle Zoom Updates efficiently
    if ( isZoomUpdate ) {
      // Update scales
      // Re-render X Axis
      renderXAxis( g as any, {
        xScale,
        innerWidth,
        innerHeight,
        xAxisShow,
        xAxisPosition,
        xAxisTickSize,
        xAxisTickPadding,
        xAxisTickCount,
        xAxisTickFormat,
        xAxisScaleType: 'band',
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

      // Re-render Y Axis
      renderYAxis( g as any, {
        yScale,
        innerWidth,
        innerHeight,
        yAxis
      } );

      // Re-render X Grid
      renderXGrid( g as any, {
        xScale,
        innerWidth,
        innerHeight,
        xAxisShowGrid,
        xAxisGridColor,
        xAxisGridWidth,
        xAxisGridOpacity,
        xAxisGridDashArray,
        xAxisTickCount
      } );

      // Re-render Y Grid
      renderYGrid( g as any, {
        yScale,
        innerWidth,
        innerHeight,
        yAxis
      } );
    }

    // If not a zoom update, or if we want to fully re-render bars (which we do for now to handle enter/exit)
    if ( !isZoomUpdate ) {
      g.selectAll( '.content-group' ).remove();
    }

    let contentGroup = g.select<SVGGElement>( '.content-group' );
    if ( contentGroup.empty() ) {
      contentGroup = g.append( 'g' ).attr( 'class', 'content-group' );
    }

    // Render Bars
    // We group bars by category (X axis value)
    const barGroups = contentGroup
      .selectAll<SVGGElement, any>( '.bar-group' )
      .data( filteredData, ( d ) => String( d[ labelKey ] ) );

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
          ? ( colors?.[ i ] || colorScale( key ) as string )
          : ( colors?.[ filteredData.indexOf( d ) % colors.length ] || colorScale( key ) as string )
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

    // Render Axes and Grids (only if not zoom update, or if we want to ensure they are there)
    if ( !isZoomUpdate ) {
      renderXGrid( g as any, {
        xScale,
        innerWidth,
        innerHeight,
        xAxisShowGrid,
        xAxisGridColor,
        xAxisGridWidth,
        xAxisGridOpacity,
        xAxisGridDashArray,
        xAxisTickCount
      } );

      renderYGrid( g as any, {
        yScale,
        innerWidth,
        innerHeight,
        yAxis
      } );

      renderXAxis( g as any, {
        xScale,
        innerWidth,
        innerHeight,
        xAxisShow,
        xAxisPosition,
        xAxisTickSize,
        xAxisTickPadding,
        xAxisTickCount,
        xAxisTickFormat,
        xAxisScaleType: 'band',
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

      renderYAxis( g as any, {
        yScale,
        innerWidth,
        innerHeight,
        yAxis
      } );
    }

    // Render Legend
    renderLegend( {
      svg,
      width: propWidth,
      height: propHeight,
      chartMargin: margin.margin,
      innerWidth,
      valueKeys,
      colors: valueKeys.map( ( key, i ) => colors?.[ i ] || colorScale( key ) as string ),
      legendShow,
      legendPosition,
      legendAlignment,
      legendFontSize: 12,
      legendGap,
      legendPaddingTop,
      legendPaddingRight,
      legendPaddingBottom,
      legendPaddingLeft
    } );

    // Setup Brush Zoom
    setupBrushZoom( {
      g: g as any,
      innerWidth,
      innerHeight,
      data,
      labelKey,
      valueKeys,
      setZoomDomain
    } );

    // Setup Pan
    setupPan( {
      g: g as any,
      innerWidth,
      innerHeight,
      data,
      zoomDomain: zoomDomain as any,
      setZoomDomain,
      valueKeys
    } );

  }, [
    data,
    labelKey,
    valueKeys,
    propWidth,
    propHeight,
    colors,
    colorMode,
    legendShow,
    legendPosition,
    legendAlignment,
    legendGap,
    legendPaddingTop,
    legendPaddingRight,
    legendPaddingBottom,
    legendPaddingLeft,
    xAxisShow,
    xAxisTitle,
    xAxisShowGrid,
    xAxisShowDomain,
    xAxisTickCount,
    xAxisTickSize,
    xAxisTickPadding,
    xAxisLabelRotation,
    xAxisTickFormat,
    xAxisPosition,
    xAxisLabelSize,
    xAxisLabelWeight,
    xAxisLabelColor,
    xAxisLabelSpacing,
    xAxisTitleType,
    xAxisTitleWeight,
    xAxisTitleColor,
    xAxisTitleSize,
    xAxisTitlePadding,
    xAxisGridColor,
    xAxisGridWidth,
    xAxisGridOpacity,
    xAxisGridDashArray,
    yAxis,
    margin,
    innerWidth,
    innerHeight,
    colorPalette,
    zoomDomain,
    setZoomDomain,
    xScale,
    yScale,
    colorScale,
    filteredData
  ] );

  return (
    <div className="relative w-full h-full">
      <svg
        ref={ svgRef }
        viewBox={ `0 0 ${ propWidth } ${ propHeight }` }
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full overflow-visible"
      />
      <ChartZoomControls
        xScale={ xScale }
        yScale={ yScale }
        dataLength={ data.length }
      />
    </div>
  );
};

