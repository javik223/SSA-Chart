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

interface LineChartProps {
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
  xAxisTickCount?: number | null;
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

export function LineChart( {
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
}: LineChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );

  // Store hooks
  const zoomDomain = useChartStore( ( state ) => state.zoomDomain );
  const setZoomDomain = useChartStore( ( state ) => state.setZoomDomain );
  const showZoomControls = useChartStore( ( state ) => state.showZoomControls );
  const setXAxisScaleType = useChartStore( ( state ) => state.setXAxisScaleType );

  // Visual settings
  const curveType = useChartStore( ( state ) => state.curveType );
  const lineWidth = useChartStore( ( state ) => state.lineWidth );
  const lineStyle = useChartStore( ( state ) => state.lineStyle );
  const showPoints = useChartStore( ( state ) => state.showPoints );
  const pointSize = useChartStore( ( state ) => state.pointSize );
  const pointShape = useChartStore( ( state ) => state.pointShape );
  const showArea = useChartStore( ( state ) => state.showArea );
  const areaOpacity = useChartStore( ( state ) => state.areaOpacity );

  // Automatically infer and set X-axis scale type when data or labelKey changes
  useEffect( () => {
    if ( !data || data.length === 0 || !labelKey ) return;

    const values = data.map( d => d[ labelKey ] );
    const inferredType = inferScaleType( values );

    // Only update if the inferred type is different to avoid unnecessary re-renders
    // We use the store action directly
    setXAxisScaleType( inferredType );
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
      // For point scale, we use indices
      return i >= xMin && i <= xMax;
    } );
  }, [ data, zoomDomain?.x ] );

  // 3. Create Scales
  const xScale = useMemo( () => {
    let domainValues: any[];
    if ( xAxisScaleType === 'linear' ) {
      domainValues = filteredData.map( ( d ) => Number( d[ labelKey ] ) );
    } else if ( xAxisScaleType === 'time' ) {
      domainValues = filteredData.map( ( d ) => new Date( d[ labelKey ] ) );
    } else {
      domainValues = filteredData.map( ( d ) => String( d[ labelKey ] ) );
    }

    return createScale(
      ( xAxisScaleType || 'point' ) as any,
      {
        domain: domainValues,
        range: [ 0, innerWidth ],
        padding: 0.5,
      }
    ) as d3.ScalePoint<string> | d3.ScaleLinear<number, number>;
  }, [ filteredData, labelKey, xAxisScaleType, innerWidth ] );

  const yScale = useMemo( () => {
    // Calculate Y domain
    let yMin = yAxis.min !== null ? yAxis.min : 0;
    let yMax = yAxis.max !== null ? yAxis.max : ( d3.max( filteredData, ( d ) =>
      Math.max( ...valueKeys.map( ( key ) => Number( d[ key ] ) || 0 ) )
    ) || 0 );

    // Apply zoom domain to Y if it exists
    if ( zoomDomain?.y ) {
      [ yMin, yMax ] = zoomDomain.y;
    }

    const scale = d3.scaleLinear()
      .domain( [ yMin, yMax ] )
      .range( [ innerHeight, 0 ] );

    // Only apply nice() if not using custom domain and not zoomed
    if ( yAxis.min === null && yAxis.max === null && !zoomDomain?.y ) {
      scale.nice();
    }

    return scale;
  }, [ filteredData, valueKeys, yAxis.min, yAxis.max, zoomDomain?.y, innerHeight ] );

  // Helper function to get X position based on scale type (uses utility)
  const getXPosition = ( d: any ): number => {
    return getXPositionHelper( d, labelKey, xScale, xAxisScaleType );
  };

  useEffect( () => {
    if ( !svgRef.current || !data || !propWidth || !propHeight ) return;

    // Clear previous chart
    d3.select( svgRef.current ).selectAll( '*' ).remove();

    const width = propWidth;
    const height = propHeight;

    // Create SVG with viewBox for responsiveness
    const svg = d3
      .select( svgRef.current )
      .attr( 'viewBox', `0 0 ${ propWidth } ${ propHeight }` )
      .attr( 'preserveAspectRatio', 'xMidYMid meet' );

    // Clip Path (using utility)
    const clipId = createClipPath( svg, innerWidth, innerHeight );

    const g = svg
      .append( 'g' )
      .attr( 'transform', `translate(${ chartMargin.left },${ chartMargin.top })` );

    // Y Grid lines (using utility)
    renderYGrid( g, {
      yScale,
      innerWidth,
      innerHeight,
      yAxis
    } );

    // Y Axis (using utility)
    renderYAxis( g, {
      yScale,
      innerWidth,
      innerHeight,
      yAxis
    } );



    // X axis
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      // X Axis (using utility)
      renderXAxis( g, {
        xScale,
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

      // X Grid lines (using utility)
      renderXGrid( g, {
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
    }

    // Lines, Areas, and Dots (Clipped)
    const contentGroup = g.append( 'g' ).attr( 'clip-path', `url(#${ clipId })` );

    // Draw lines for each value key
    valueKeys.forEach( ( key, index ) => {
      const color = colors[ index % colors.length ];

      // Area generator
      const area = d3
        .area<any>()
        .x( ( d ) => getXPosition( d ) )
        .y0( innerHeight )
        .y1( ( d ) => yScale( Number( d[ key ] ) ) );

      if ( curveType === 'monotone' ) area.curve( d3.curveMonotoneX );
      if ( curveType === 'step' ) area.curve( d3.curveStep );
      if ( curveType === 'linear' ) area.curve( d3.curveLinear );

      // Draw Area
      if ( showArea ) {
        contentGroup.append( 'path' )
          .datum( filteredData )
          .attr( 'fill', color )
          .attr( 'fill-opacity', areaOpacity )
          .attr( 'd', area( filteredData ) );
      }

      // Line generator
      const line = d3
        .line<any>()
        .x( ( d ) => getXPosition( d ) )
        .y( ( d ) => yScale( Number( d[ key ] ) ) );

      if ( curveType === 'monotone' ) line.curve( d3.curveMonotoneX );
      if ( curveType === 'step' ) line.curve( d3.curveStep );
      if ( curveType === 'linear' ) line.curve( d3.curveLinear );

      // Line
      contentGroup.append( 'path' )
        .datum( filteredData )
        .attr( 'fill', 'none' )
        .attr( 'stroke', color )
        .attr( 'stroke-width', lineWidth )
        .attr( 'stroke-dasharray', lineStyle === 'dashed' ? '5,5' : lineStyle === 'dotted' ? '1,5' : '0' )
        .attr( 'd', line( filteredData ) );

      // Dots
      if ( showPoints ) {
        contentGroup.selectAll( `.dot-${ index }` )
          .data( filteredData )
          .enter()
          .append( 'path' )
          .attr( 'class', `dot-${ index }` )
          .attr( 'transform', ( d ) => `translate(${ getXPosition( d ) },${ yScale( Number( d[ key ] ) ) })` )
          .attr( 'fill', color )
          .attr( 'stroke', '#fff' )
          .attr( 'stroke-width', 2 )
          .attr( 'd', d3.symbol().type(
            pointShape === 'square' ? d3.symbolSquare :
              pointShape === 'diamond' ? d3.symbolDiamond :
                pointShape === 'triangle' ? d3.symbolTriangle :
                  d3.symbolCircle
          ).size( Math.PI * Math.pow( pointSize, 2 ) ) );
      }
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

  }, [ data, labelKey, valueKeys, propWidth, propHeight, colors, colorMode, legendShow, legendPosition, legendAlignment, legendFontSize, legendGap, legendPaddingTop, legendPaddingRight, legendPaddingBottom, legendPaddingLeft, xAxisShow, xAxisTitle, xAxisShowGrid, xAxisShowDomain, xAxisTickCount, xAxisTickSize, xAxisTickPadding, xAxisLabelRotation, xAxisTickFormat, xAxisPosition, xAxisScaleType, xAxisMin, xAxisMax, xAxisTitleType, xAxisTitleWeight, xAxisTitleColor, xAxisTitleSize, xAxisTitlePadding, xAxisTickPosition, xAxisLabelWeight, xAxisLabelColor, xAxisLabelSize, xAxisLabelSpacing, xAxisGridColor, xAxisGridWidth, xAxisGridOpacity, xAxisGridDashArray, yAxis, zoomDomain, setZoomDomain, curveType, lineWidth, lineStyle, showPoints, pointSize, pointShape, showArea, areaOpacity ] );

  return (
    <div className='relative w-full h-full'>
      <svg
        ref={ svgRef }
        width={ propWidth }
        height={ propHeight }
        className='overflow-visible w-full h-full'
      />
      <ChartZoomControls xScale={ xScale } yScale={ yScale } dataLength={ data.length } />
    </div>
  );
}
