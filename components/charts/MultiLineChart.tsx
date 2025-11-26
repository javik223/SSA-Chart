'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { createScale } from '@/utils/chartScales';
import { inferScaleType } from '@/utils/inferScaleType';
import { ChartZoomControls } from './ChartZoomControls';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';
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
import { BaseChartProps } from '@/types/chart-props';

interface MultiLineChartProps extends BaseChartProps {
  zoomEnabled?: boolean;
  xAxisName?: string;
}

const DEFAULT_COLORS = [ '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f' ];

export function MultiLineChart( {
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  colors = DEFAULT_COLORS,
  legendShow = true,
  legendPosition = 'top',
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
  xAxisTitlePadding = 35,
  xAxisLabelSpacing = 3,
  xAxisGridColor = '#e5e7eb',
  xAxisGridWidth = 1,
  xAxisGridOpacity = 0.5,
  xAxisGridDashArray = '0',
  xAxisMin = null,
  xAxisMax = null,
  xAxisTitleType = 'auto',
  xAxisTitleWeight = 'regular',
  xAxisTitleColor = '#000',
  xAxisTitleSize = 12,
  xAxisTitleAlignment = 'center',
  xAxisTitleArrow = false,
  xAxisTickPosition = 'outside',
  xAxisLabelWeight = 'regular',
  xAxisLabelColor = '#000',
  xAxisLabelSize = 12,

  // Y Axis
  yAxis = DEFAULT_Y_AXIS_CONFIG,

  // Zoom
  zoomEnabled = true,
}: MultiLineChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const previousZoomDomainRef = useRef<any>( null );
  const { tooltipState, showTooltip, hideTooltip } = useChartTooltip();

  // Store hooks
  // Store hooks
  const {
    setXAxisScaleType,
    curveType,
    lineWidth,
    lineStyle,
    showPoints,
    pointSize,
    pointShape,
    pointColor,
    pointOutlineWidth,
    pointOutlineColor,
    showArea,
    areaOpacity,
    zoomDomain,
    setZoomDomain,
  } = useChartStore( useShallow( ( state ) => ( {
    setXAxisScaleType: state.setXAxisScaleType,
    curveType: state.curveType,
    lineWidth: state.lineWidth,
    lineStyle: state.lineStyle,
    showPoints: state.showPoints,
    pointSize: state.pointSize,
    pointShape: state.pointShape,
    pointColor: state.pointColor,
    pointOutlineWidth: state.pointOutlineWidth,
    pointOutlineColor: state.pointOutlineColor,
    showArea: state.showArea,
    areaOpacity: state.areaOpacity,
    zoomDomain: state.zoomDomain,
    setZoomDomain: state.setZoomDomain,
  } ) ) );

  // Automatically infer and set X-axis scale type
  useEffect( () => {
    if ( !data || data.length === 0 || !labelKey ) return;
    const values = data.map( d => d[ labelKey ] );
    const inferredType = inferScaleType( values );
    setXAxisScaleType( inferredType );
  }, [ data, labelKey, setXAxisScaleType ] );

  // 1. Calculate Dimensions
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
  }, [ propWidth, propHeight, legendShow, legendPosition, xAxisShow, xAxisPosition, xAxisTitlePadding, xAxisLabelSpacing, yAxis ] );

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

    // Handle manual min/max for linear scales
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
    );
  }, [ filteredData, labelKey, xAxisScaleType, innerWidth ] );

  const yScale = useMemo( () => {
    let yMin = yAxis.min !== null ? yAxis.min : 0;
    let yMax = yAxis.max !== null ? yAxis.max : ( d3.max( filteredData, ( d ) =>
      Math.max( ...valueKeys.map( ( key ) => Number( d[ key ] ) || 0 ) )
    ) || 0 );

    // Apply zoom domain to Y if it exists
    if ( zoomDomain?.y ) {
      [ yMin, yMax ] = zoomDomain.y;
    } else {
      // Handle configureDefaultMinMax only if not zoomed
      if ( yAxis.configureDefaultMinMax && yAxis.min === null && yAxis.max === null ) {
        const allValues = filteredData.flatMap( d => valueKeys.map( key => Number( d[ key ] ) || 0 ) );
        const dataMin = Math.min( ...allValues );
        const dataMax = Math.max( ...allValues );
        const padding = ( dataMax - dataMin ) * 0.1;
        yMin = dataMin - padding;
        yMax = dataMax + padding;
      }
    }

    // Handle roundMin/roundMax
    if ( yAxis.roundMin && yAxis.min === null && !zoomDomain?.y ) yMin = Math.floor( yMin );
    if ( yAxis.roundMax && yAxis.max === null && !zoomDomain?.y ) yMax = Math.ceil( yMax );

    const scale = d3.scaleLinear()
      .domain( [ yMin, yMax ] )
      .range( [ innerHeight, 0 ] );

    if ( yAxis.min === null && yAxis.max === null && !yAxis.configureDefaultMinMax && !zoomDomain?.y ) {
      scale.nice();
    }

    return scale;
  }, [ filteredData, valueKeys, yAxis, innerHeight, zoomDomain?.y ] );

  // Helper for X position
  const getXPosition = ( d: any ) => {
    return getXPositionHelper( d, labelKey, xScale, xAxisScaleType as any );
  };

  // Render Chart
  useEffect( () => {
    if ( !svgRef.current || !data ) return;

    // Check if this is a zoom update (smooth transition) vs full redraw
    const isZoomUpdate = previousZoomDomainRef.current !== null &&
      JSON.stringify( previousZoomDomainRef.current ) !== JSON.stringify( zoomDomain );

    // Update the ref for next render
    previousZoomDomainRef.current = zoomDomain;

    // Transition duration
    const transitionDuration = isZoomUpdate ? 500 : 0;

    // Only clear if not a zoom update
    if ( !isZoomUpdate ) {
      d3.select( svgRef.current ).selectAll( '*' ).remove();
    }

    const svg = d3.select( svgRef.current )
      .attr( 'viewBox', `0 0 ${ propWidth } ${ propHeight }` )
      .attr( 'preserveAspectRatio', 'xMidYMid meet' );

    // If it's a zoom update, just update the existing elements
    if ( isZoomUpdate ) {
      const g = svg.select( 'g.main-group' );

      if ( g.empty() ) {
        d3.select( svgRef.current ).selectAll( '*' ).remove();
        previousZoomDomainRef.current = null;
      } else {
        const contentGroup = g.select( 'g.content-group' );

        // Update lines with transition
        valueKeys.forEach( ( key, index ) => {
          const line = d3.line<any>()
            .x( d => getXPosition( d ) )
            .y( d => yScale( Number( d[ key ] ) ) )
            .curve( d3.curveBasis );

          contentGroup.select( `path.line-${ index }` )
            .datum( filteredData )
            .transition()
            .duration( transitionDuration )
            .ease( d3.easeCubicInOut )
            .attr( 'd', line( filteredData ) );
        } );

        // Re-render Y Grid
        renderYGrid( g as any, { yScale, innerWidth, innerHeight, yAxis } );
        // Re-render Y Axis
        renderYAxis( g as any, { yScale, innerWidth, innerHeight, yAxis, xAxisPosition } );

        // Re-render X axis
        if ( xAxisShow && xAxisPosition !== 'hidden' ) {
          renderXAxis( g as any, {
            xScale, innerWidth, innerHeight, xAxisShow, xAxisPosition,
            xAxisTickSize, xAxisTickPadding, xAxisTickCount, xAxisTickFormat,
            xAxisScaleType, xAxisLabelSize, xAxisLabelWeight,
            xAxisLabelColor, xAxisLabelRotation, xAxisLabelSpacing,
            xAxisTitle, xAxisTitleSize, xAxisTitleWeight,
            xAxisTitleColor, xAxisTitlePadding, xAxisTitleAlignment, xAxisTitleArrow,
            xAxisName, yAxisPosition: yAxis.position, xAxisShowDomain
          } );
          renderXGrid( g as any, {
            xScale, innerWidth, innerHeight, xAxisShowGrid,
            xAxisGridColor, xAxisGridWidth, xAxisGridOpacity, xAxisGridDashArray, xAxisTickCount
          } );
        }

        // Re-initialize brush zoom
        if ( zoomEnabled ) {
          setupBrushZoom( {
            g: g as any,
            innerWidth,
            innerHeight,
            data,
            labelKey,
            valueKeys,
            setZoomDomain
          } );

          setupPan( {
            g: g as any,
            innerWidth,
            innerHeight,
            data,
            zoomDomain: zoomDomain as any,
            setZoomDomain,
            valueKeys
          } );
        }

        return;
      }
    }

    // --- Full Render ---

    const g = svg
      .append( 'g' )
      .attr( 'class', 'main-group' )
      .attr( 'transform', `translate(${ chartMargin.left },${ chartMargin.top })` );

    // Grid
    renderYGrid( g, { yScale, innerWidth, innerHeight, yAxis } );
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      renderXGrid( g, {
        xScale, innerWidth, innerHeight, xAxisShowGrid,
        xAxisGridColor, xAxisGridWidth, xAxisGridOpacity, xAxisGridDashArray, xAxisTickCount
      } );
    }

    // Axes
    renderYAxis( g, { yScale, innerWidth, innerHeight, yAxis, xAxisPosition } );
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      renderXAxis( g, {
        xScale, innerWidth, innerHeight, xAxisShow, xAxisPosition,
        xAxisTickSize, xAxisTickPadding, xAxisTickCount, xAxisTickFormat,
        xAxisScaleType, xAxisLabelSize, xAxisLabelWeight,
        xAxisLabelColor, xAxisLabelRotation, xAxisLabelSpacing,
        xAxisTitle, xAxisTitleSize, xAxisTitleWeight,
        xAxisTitleColor, xAxisTitlePadding, xAxisTitleAlignment, xAxisTitleArrow,
        xAxisName, yAxisPosition: yAxis.position, xAxisShowDomain
      } );
    }

    // Clip Path
    const clipId = createClipPath( svg, innerWidth, innerHeight );

    // Content Group
    const contentGroup = g.append( 'g' )
      .attr( 'class', 'content-group' )
      .attr( 'clip-path', `url(#${ clipId })` );

    // Draw Lines and Areas
    const lines: any[] = [];
    valueKeys.forEach( ( key, index ) => {
      const color = colors.length > 1 ? colors[ index % colors.length ] : 'steelblue';

      // Area generator (if showArea is true)
      if ( showArea ) {
        const area = d3.area<any>()
          .x( d => getXPosition( d ) )
          .y0( innerHeight )
          .y1( d => yScale( Number( d[ key ] ) ) );

        // Apply curve type
        if ( curveType === 'monotone' ) area.curve( d3.curveMonotoneX );
        else if ( curveType === 'step' ) area.curve( d3.curveStep );
        else if ( curveType === 'linear' ) area.curve( d3.curveLinear );
        else area.curve( d3.curveBasis );

        contentGroup.append( 'path' )
          .datum( filteredData )
          .attr( 'class', `area-series area-${ index }` )
          .attr( 'fill', color )
          .attr( 'fill-opacity', areaOpacity )
          .attr( 'd', area );
      }

      // Line generator
      const line = d3.line<any>()
        .x( d => getXPosition( d ) )
        .y( d => yScale( Number( d[ key ] ) ) );

      // Apply curve type
      if ( curveType === 'monotone' ) line.curve( d3.curveMonotoneX );
      else if ( curveType === 'step' ) line.curve( d3.curveStep );
      else if ( curveType === 'linear' ) line.curve( d3.curveLinear );
      else line.curve( d3.curveBasis );

      // Apply line style
      const strokeDasharray = lineStyle === 'dashed' ? '5,5' : lineStyle === 'dotted' ? '1,5' : '0';

      const path = contentGroup.append( 'path' )
        .datum( filteredData )
        .attr( 'class', `line-series line-${ index }` )
        .attr( 'fill', 'none' )
        .attr( 'stroke', color )
        .attr( 'stroke-width', lineWidth )
        .attr( 'stroke-dasharray', strokeDasharray )
        .attr( 'stroke-linejoin', 'round' )
        .attr( 'stroke-linecap', 'round' )
        .attr( 'stroke-opacity', 1 )
        .attr( 'd', line );

      // Draw points (if showPoints is true)
      if ( showPoints ) {
        const symbolGenerator = d3.symbol().type(
          pointShape === 'square' ? d3.symbolSquare :
            pointShape === 'diamond' ? d3.symbolDiamond :
              pointShape === 'triangle' ? d3.symbolTriangle :
                d3.symbolCircle
        ).size( Math.PI * Math.pow( pointSize, 2 ) );

        contentGroup.selectAll( `.point-${ index }` )
          .data( filteredData )
          .enter()
          .append( 'path' )
          .attr( 'class', `point-series point-${ index }` )
          .attr( 'transform', d => `translate(${ getXPosition( d ) },${ yScale( Number( d[ key ] ) ) })` )
          .attr( 'fill', pointColor || color )
          .attr( 'stroke', pointOutlineColor )
          .attr( 'stroke-width', pointOutlineWidth )
          .attr( 'd', symbolGenerator );
      }

      lines.push( { path, key, color, index } );
    } );

    // Legend
    renderLegend( {
      svg, width: propWidth, height: propHeight, chartMargin, innerWidth,
      valueKeys, colors, legendShow, legendPosition, legendAlignment,
      legendFontSize, legendGap, legendPaddingTop,
      legendPaddingRight, legendPaddingBottom, legendPaddingLeft
    } );

    // --- Interaction Layer ---

    // Dot for current point
    const dot = contentGroup.append( 'circle' )
      .attr( 'r', 3 )
      .attr( 'fill', 'black' )
      .attr( 'stroke', 'none' )
      .style( 'opacity', 0 )
      .style( 'pointer-events', 'none' );

    // Hover Event Handler
    const handleHover = ( event: any ) => {
      const [ mx, my ] = d3.pointer( event );

      // Find nearest X index
      let index = 0;
      if ( xAxisScaleType === 'point' || xAxisScaleType === 'band' ) {
        const eachBand = ( xScale as any ).step();
        index = Math.floor( ( mx + ( eachBand / 2 ) ) / eachBand );
        index = Math.max( 0, Math.min( index, filteredData.length - 1 ) );
      } else {
        const xVal = ( xScale as any ).invert( mx );
        const bisect = d3.bisector( ( d: any ) => {
          return xAxisScaleType === 'time' ? new Date( d[ labelKey ] ) : Number( d[ labelKey ] );
        } ).center;
        index = bisect( filteredData, xVal );
      }

      const d = filteredData[ index ];
      if ( !d ) return;

      // Find closest series by Y distance
      let minDist = Infinity;
      let closestSeries: any = null;

      lines.forEach( series => {
        const val = Number( d[ series.key ] );
        if ( isNaN( val ) ) return;
        const py = yScale( val );
        const dist = Math.abs( py - my );
        if ( dist < minDist ) {
          minDist = dist;
          closestSeries = { ...series, val, py };
        }
      } );

      if ( closestSeries ) {
        lines.forEach( l => {
          if ( l.key === closestSeries.key ) {
            l.path
              .attr( 'stroke', l.color )
              .attr( 'stroke-opacity', 1 )
              .attr( 'stroke-width', 2.5 )
              .raise();
          } else {
            l.path
              .attr( 'stroke', '#ddd' )
              .attr( 'stroke-opacity', 0.8 )
              .attr( 'stroke-width', 1.5 );
          }
        } );

        const px = getXPosition( d );
        dot
          .attr( 'cx', px )
          .attr( 'cy', closestSeries.py );

        // Show Tooltip
        // Calculate screen coordinates relative to the container
        // We need to account for margins
        const tooltipX = px + chartMargin.left;
        const tooltipY = closestSeries.py + chartMargin.top;

        showTooltip(
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-xs">{ d[ labelKey ] }</div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={ { backgroundColor: closestSeries.color } }
              />
              <span className="text-muted-foreground">{ closestSeries.key }:</span>
              <span className="font-medium">
                { Number( closestSeries.val ).toLocaleString() }
              </span>
            </div>
          </div>,
          tooltipX,
          tooltipY
        );
      }
    };

    const handleLeave = () => {
      dot.style( 'opacity', 0 );
      hideTooltip();
      lines.forEach( l => {
        l.path
          .attr( 'stroke', l.color )
          .attr( 'stroke-opacity', 1 )
          .attr( 'stroke-width', 1.5 );
      } );
    };

    const handleEnter = () => {
      dot.style( 'opacity', 1 );
    };

    // Overlay for events (separate from brush/zoom)
    const hoverRect = g.append( 'rect' )
      .attr( 'width', innerWidth )
      .attr( 'height', innerHeight )
      .attr( 'fill', 'transparent' )
      .style( 'pointer-events', 'all' ) // Capture events
      .on( 'pointerenter', handleEnter )
      .on( 'pointerleave', handleLeave )
      .on( 'pointermove', handleHover );

    // Setup Zoom and Pan
    if ( zoomEnabled ) {
      setupBrushZoom( {
        g,
        innerWidth,
        innerHeight,
        data,
        labelKey,
        valueKeys,
        setZoomDomain
      } );

      setupPan( {
        g,
        innerWidth,
        innerHeight,
        data,
        zoomDomain: zoomDomain as any,
        setZoomDomain,
        valueKeys
      } );

      // Attach hover listeners to brush overlay so it doesn't block interactions
      const brushOverlay = g.select( '.brush .overlay' );
      if ( !brushOverlay.empty() ) {
        brushOverlay
          .on( 'pointerenter', handleEnter )
          .on( 'pointerleave', handleLeave )
          .on( 'pointermove', handleHover );
      }
    }

  }, [ data, labelKey, valueKeys, propWidth, propHeight, colors, legendShow, legendPosition, legendAlignment, legendFontSize, legendGap, legendPaddingTop, legendPaddingRight, legendPaddingBottom, legendPaddingLeft, xAxisShow, xAxisPosition, xAxisScaleType, xAxisTitle, xAxisTitleSize, xAxisTitleWeight, xAxisTitleColor, xAxisTitlePadding, xAxisLabelSize, xAxisLabelWeight, xAxisLabelColor, xAxisLabelRotation, xAxisLabelSpacing, xAxisTickCount, xAxisTickSize, xAxisTickPadding, xAxisTickFormat, xAxisShowGrid, xAxisGridColor, xAxisGridWidth, xAxisGridOpacity, xAxisGridDashArray, xAxisShowDomain, yAxis, curveType, lineWidth, lineStyle, innerWidth, innerHeight, chartMargin, xScale, yScale, zoomEnabled, zoomDomain, setZoomDomain, showTooltip, hideTooltip ] );

  return (
    <div className="relative w-full h-full">
      <svg ref={ svgRef } className="w-full h-full overflow-visible" />
      <ChartTooltip
        visible={ tooltipState.visible }
        x={ tooltipState.x }
        y={ tooltipState.y }
        content={ tooltipState.content }
      />
      <ChartZoomControls xScale={ xScale } yScale={ yScale } dataLength={ data.length } />
    </div>
  );
}
