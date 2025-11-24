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

interface AreaChartProps {
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
  fillOpacity?: number;

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

export function AreaChart( {
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
  fillOpacity = 0.3,
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
}: AreaChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const previousZoomDomainRef = useRef<any>( null );

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
  const pointColor = useChartStore( ( state ) => state.pointColor );
  const pointOutlineWidth = useChartStore( ( state ) => state.pointOutlineWidth );
  const pointOutlineColor = useChartStore( ( state ) => state.pointOutlineColor );
  // Area settings are passed as props or store? 
  // LineChart uses store for showArea/areaOpacity. AreaChart has fillOpacity prop.
  // We should probably respect the prop but maybe allow store override?
  // For now, let's stick to the prop for opacity as it's specific to AreaChart, 
  // but we could also use the store's areaOpacity if we wanted to unify.
  // Let's use the store's areaOpacity if available, or fallback to prop.
  const storeAreaOpacity = useChartStore( ( state ) => state.areaOpacity );
  const effectiveFillOpacity = storeAreaOpacity ?? fillOpacity;


  // Automatically infer and set X-axis scale type when data or labelKey changes
  useEffect( () => {
    if ( !data || data.length === 0 || !labelKey ) return;

    const values = data.map( d => d[ labelKey ] );
    const inferredType = inferScaleType( values );

    // Only update if the inferred type is different to avoid unnecessary re-renders
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

    return createScale( xAxisScaleType, {
      domain: domainValues,
      range: [ 0, innerWidth ],
      padding: 0.5 // for point/band scales
    } );
  }, [ filteredData, labelKey, xAxisScaleType, innerWidth ] );

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
    return getXPositionHelper( d, labelKey, xScale, xAxisScaleType );
  };

  // Render Chart
  useEffect( () => {
    if ( !svgRef.current || !xScale || !yScale ) return;

    // Check if this is a zoom update (smooth transition) vs full redraw
    const isZoomUpdate = previousZoomDomainRef.current !== null &&
      JSON.stringify( previousZoomDomainRef.current ) !== JSON.stringify( zoomDomain );

    // Update the ref for next render
    previousZoomDomainRef.current = zoomDomain;

    // Transition duration
    const transitionDuration = isZoomUpdate ? 500 : 0;

    const svg = d3.select( svgRef.current );

    // If it's a zoom update, just update the existing elements
    if ( isZoomUpdate ) {
      const g = svg.select( 'g.main-group' );

      // Check if main-group exists (might not exist after chart type change)
      if ( g.empty() ) {
        // Main group doesn't exist, do a full redraw instead
        svg.selectAll( '*' ).remove();
        previousZoomDomainRef.current = null;
        // Continue to full render below
      } else {
        const contentGroup = g.select( 'g.content-group' );

        // Update areas and lines with transition
        valueKeys.forEach( ( key, index ) => {
          const color = colors[ index % colors.length ];

          const area = d3
            .area<any>()
            .x( ( d ) => getXPosition( d ) )
            .y0( innerHeight )
            .y1( ( d ) => yScale( Number( d[ key ] ) ) );

          if ( curveType === 'monotone' ) area.curve( d3.curveMonotoneX );
          if ( curveType === 'step' ) area.curve( d3.curveStep );
          if ( curveType === 'linear' ) area.curve( d3.curveLinear );

          // Update area path with transition
          contentGroup.select( `path.area-${ index }` )
            .datum( filteredData )
            .transition()
            .duration( transitionDuration )
            .ease( d3.easeCubicInOut )
            .attr( 'd', area( filteredData ) );

          // Update line
          const line = d3
            .line<any>()
            .x( ( d ) => getXPosition( d ) )
            .y( ( d ) => yScale( Number( d[ key ] ) ) );

          if ( curveType === 'monotone' ) line.curve( d3.curveMonotoneX );
          if ( curveType === 'step' ) line.curve( d3.curveStep );
          if ( curveType === 'linear' ) line.curve( d3.curveLinear );

          contentGroup.select( `path.line-${ index }` )
            .datum( filteredData )
            .transition()
            .duration( transitionDuration )
            .ease( d3.easeCubicInOut )
            .attr( 'd', line( filteredData ) );

          // Update dots with transition
          if ( showPoints ) {
            const dots = contentGroup.selectAll( `.dot-${ index }` )
              .data( filteredData );

            // Exit old dots
            dots.exit()
              .transition()
              .duration( 100 )
              .style( 'opacity', 0 )
              .remove();

            // Enter new dots
            const dotsEnter = dots.enter()
              .append( 'path' )
              .attr( 'class', `dot-${ index }` )
              .attr( 'fill', pointColor || color )
              .attr( 'stroke', pointOutlineColor )
              .attr( 'stroke-width', pointOutlineWidth )
              .style( 'opacity', 0 );

            const fullSize = Math.PI * Math.pow( pointSize, 2 );
            const symbolGenerator = d3.symbol().type(
              pointShape === 'square' ? d3.symbolSquare :
                pointShape === 'diamond' ? d3.symbolDiamond :
                  pointShape === 'triangle' ? d3.symbolTriangle :
                    d3.symbolCircle
            );

            // Update all dots (existing + new)
            ( ( dots as any ).merge( dotsEnter ) )
              .transition()
              .duration( 100 )
              .style( 'opacity', 0 )
              .on( 'end', function ( d: any, i: number ) {
                d3.select( this )
                  .attr( 'transform', `translate(${ getXPosition( d ) },${ yScale( Number( d[ key ] ) ) })` )
                  .transition()
                  .delay( i * 2 )
                  .duration( 250 )
                  .ease( d3.easeBackOut )
                  .style( 'opacity', 1 )
                  .attrTween( 'd', () => {
                    const i = d3.interpolate( 0, fullSize );
                    return ( t ) => symbolGenerator.size( i( t ) )() || '';
                  } );
              } );
          }
        } );

        // Update axes by re-rendering them
        // Axes and grids are updated in place
        // Axis helper functions are idempotent and handle their own text elements
        // g.selectAll( 'text' ).remove();

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

        // Re-render X Axis
        if ( xAxisShow && xAxisPosition !== 'hidden' ) {
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
        }

        // Re-initialize brush zoom
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

        // Re-render Y Axis
        renderYAxis( g as any, {
          yScale,
          innerWidth,
          innerHeight,
          yAxis
        } );

        return; // Skip the rest of the rendering
      }
    }

    svg.selectAll( '*' ).remove();

    // Set viewBox for responsiveness
    svg
      .attr( 'viewBox', `0 0 ${ propWidth } ${ propHeight }` )
      .attr( 'preserveAspectRatio', 'xMidYMid meet' );

    // Clip Path (using utility)
    const clipId = createClipPath( svg, innerWidth, innerHeight );

    const g = svg
      .append( 'g' )
      .attr( 'class', 'main-group' )
      .attr( 'transform', `translate(${ chartMargin.left },${ chartMargin.top })` );

    // X Grid (using utility)
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

    // Y Grid (using utility)
    renderYGrid( g, {
      yScale,
      innerWidth,
      innerHeight,
      yAxis
    } );

    // Areas and Lines (Clipped)
    const contentGroup = g.append( 'g' )
      .attr( 'class', 'content-group' )
      .attr( 'clip-path', `url(#${ clipId })` );

    valueKeys.forEach( ( key, index ) => {
      const color = colors[ index % colors.length ];

      // Area generator
      const area = d3.area<any>()
        .x( ( d ) => getXPosition( d ) )
        .y0( innerHeight )
        .y1( ( d ) => yScale( Number( d[ key ] ) ) );

      if ( curveType === 'monotone' ) area.curve( d3.curveMonotoneX );
      if ( curveType === 'step' ) area.curve( d3.curveStep );
      if ( curveType === 'linear' ) area.curve( d3.curveLinear );

      // Line generator
      const line = d3.line<any>()
        .x( ( d ) => getXPosition( d ) )
        .y( ( d ) => yScale( Number( d[ key ] ) ) );

      if ( curveType === 'monotone' ) line.curve( d3.curveMonotoneX );
      if ( curveType === 'step' ) line.curve( d3.curveStep );
      if ( curveType === 'linear' ) line.curve( d3.curveLinear );

      // Draw Area
      contentGroup.append( 'path' )
        .attr( 'class', `area-${ index }` )
        .datum( filteredData )
        .attr( 'fill', color )
        .attr( 'fill-opacity', effectiveFillOpacity )
        .attr( 'd', area( filteredData ) );

      // Draw Line
      contentGroup.append( 'path' )
        .attr( 'class', `line-${ index }` )
        .datum( filteredData )
        .attr( 'fill', 'none' )
        .attr( 'stroke', color )
        .attr( 'stroke-width', lineWidth )
        .attr( 'stroke-dasharray', lineStyle === 'dashed' ? '5,5' : lineStyle === 'dotted' ? '1,5' : '0' )
        .attr( 'd', line( filteredData ) );

      // Draw Dots
      if ( showPoints ) {
        contentGroup.selectAll( `.dot-${ index }` )
          .data( filteredData )
          .enter()
          .append( 'path' )
          .attr( 'class', `dot-${ index }` )
          .attr( 'transform', ( d ) => `translate(${ getXPosition( d ) },${ yScale( Number( d[ key ] ) ) })` )
          .attr( 'fill', pointColor || color )
          .attr( 'stroke', pointOutlineColor )
          .attr( 'stroke-width', pointOutlineWidth )
          .attr( 'd', d3.symbol().type(
            pointShape === 'square' ? d3.symbolSquare :
              pointShape === 'diamond' ? d3.symbolDiamond :
                pointShape === 'triangle' ? d3.symbolTriangle :
                  d3.symbolCircle
          ).size( Math.PI * Math.pow( pointSize, 2 ) ) );
      }
    } );

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
    filteredData, xScale, yScale, innerWidth, innerHeight, chartMargin,
    colors, curveType, lineWidth, lineStyle, showPoints, pointSize, pointShape, effectiveFillOpacity,
    xAxisShow, xAxisShowGrid, xAxisGridColor, xAxisGridWidth, xAxisGridOpacity, xAxisGridDashArray,
    yAxis, xAxisPosition, xAxisTickSize, xAxisTickPadding, xAxisTickCount, xAxisTickFormat,
    xAxisLabelSize, xAxisLabelWeight, xAxisLabelColor, xAxisLabelRotation,
    xAxisTitle, xAxisTitleSize, xAxisTitleWeight, xAxisTitleColor, xAxisTitlePadding,
    legendShow, legendPosition, valueKeys
  ] );

  return (
    <div className='relative w-full h-full'>
      <ChartZoomControls xScale={ xScale } yScale={ yScale } dataLength={ data.length } />
      <svg
        ref={ svgRef }
        viewBox={ `0 0 ${ propWidth } ${ propHeight }` }
        preserveAspectRatio="xMidYMid meet"
        className='w-full h-full overflow-visible'
      />
    </div>
  );
}
