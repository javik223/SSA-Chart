'use client';

import { useEffect, useRef, useMemo, memo } from 'react';
import * as d3 from 'd3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { createScale } from '@/utils/chartScales';
import { inferScaleType } from '@/utils/inferScaleType';
import { ChartZoomControls } from './ChartZoomControls';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';
import { TooltipContent } from './TooltipContent';
import {
  calculateChartMargins,
  getXPosition as getXPositionHelper,
} from '@/utils/chartHelpers';
import { BaseChartProps } from '@/types/chart-props';
import { BaseChart } from './BaseChart';

interface MultiLineChartProps extends BaseChartProps {
  zoomEnabled?: boolean;
  xAxisName?: string;
}

const DEFAULT_COLORS = [ '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f' ];

interface MultiLineChartContentProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  xScale: any;
  yScale: any;
  colors: string[];
  curveType: 'monotone' | 'step' | 'linear';
  lineWidth: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  showPoints: boolean;
  pointSize: number;
  pointShape: 'circle' | 'square' | 'diamond' | 'triangle';
  pointColor: string;
  pointOutlineWidth: number;
  pointOutlineColor: string;
  showArea: boolean;
  areaOpacity: number;
  xAxisScaleType: 'linear' | 'log' | 'time' | 'band' | 'point';
  innerHeight: number;
  innerWidth: number;
  showTooltip: ( content: React.ReactNode, x: number, y: number ) => void;
  hideTooltip: () => void;
  moveTooltip: ( x: number, y: number ) => void;
  margin: { top: number; right: number; bottom: number; left: number; };
}

const MultiLineChartContent = memo( ( {
  data,
  labelKey,
  valueKeys,
  xScale,
  yScale,
  colors,
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
  xAxisScaleType,
  innerHeight,
  innerWidth,
  showTooltip,
  hideTooltip,
  moveTooltip,
  margin
}: MultiLineChartContentProps ) => {
  const gRef = useRef<SVGGElement>( null );
  const dotRef = useRef<SVGCircleElement>( null );

  // Helper for X position
  const getXPosition = ( d: any ) => {
    return getXPositionHelper( d, labelKey, xScale, xAxisScaleType as any );
  };

  useEffect( () => {
    if ( !gRef.current || !data ) return;

    const g = d3.select( gRef.current );

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

        let areaPath = g.select<SVGPathElement>( `.area-${ index }` );
        if ( areaPath.empty() ) {
          areaPath = g.append( 'path' ).attr( 'class', `area-series area-${ index }` );
        }

        areaPath
          .datum( data )
          .attr( 'fill', color )
          .attr( 'fill-opacity', areaOpacity )
          .attr( 'd', area );
      } else {
        g.select( `.area-${ index }` ).remove();
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

      let linePath = g.select<SVGPathElement>( `.line-${ index }` );
      if ( linePath.empty() ) {
        linePath = g.append( 'path' ).attr( 'class', `line-series line-${ index }` );
      }

      linePath
        .datum( data )
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

        const points = g.selectAll( `.point-${ index }` )
          .data( data );

        points.exit().remove();

        points.enter()
          .append( 'path' )
          .attr( 'class', `point-series point-${ index }` )
          .merge( points as any )
          .attr( 'transform', d => `translate(${ getXPosition( d ) },${ yScale( Number( d[ key ] ) ) })` )
          .attr( 'fill', pointColor || color )
          .attr( 'stroke', pointOutlineColor )
          .attr( 'stroke-width', pointOutlineWidth )
          .attr( 'd', symbolGenerator );
      } else {
        g.selectAll( `.point-${ index }` ).remove();
      }

      lines.push( { path: linePath, key, color, index } );
    } );

    // --- Interaction Layer ---

    // Dot for current point
    let dot = d3.select( dotRef.current );
    if ( dot.empty() ) {
      // Should be rendered via JSX but we can manipulate it here
    }

    // Track last hovered state to avoid unnecessary updates
    let lastIndex = -1;
    let lastClosestKey: string | null = null;

    const handleHover = ( event: any ) => {
      const [ mx, my ] = d3.pointer( event, gRef.current );

      // Find nearest X index
      let index = 0;
      if ( xAxisScaleType === 'point' || xAxisScaleType === 'band' ) {
        const eachBand = ( xScale as any ).step();
        index = Math.floor( ( mx + ( eachBand / 2 ) ) / eachBand );
        index = Math.max( 0, Math.min( index, data.length - 1 ) );
      } else {
        const xVal = ( xScale as any ).invert( mx );
        const bisect = d3.bisector( ( d: any ) => {
          return xAxisScaleType === 'time' ? new Date( d[ labelKey ] ) : Number( d[ labelKey ] );
        } ).center;
        index = bisect( data, xVal );
      }

      const d = data[ index ];
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
        // Highlight logic
        lines.forEach( l => {
          if ( l.key === closestSeries.key ) {
            l.path
              .attr( 'stroke', l.color )
              .attr( 'stroke-opacity', 1 )
              .attr( 'stroke-width', lineWidth + 1.5 )
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
          .style( 'opacity', 1 )
          .attr( 'cx', px )
          .attr( 'cy', closestSeries.py );

        // Only update tooltip if point changed
        if ( index !== lastIndex || closestSeries.key !== lastClosestKey ) {
          // Show Tooltip
          // Calculate screen coordinates relative to the page (for Portal tooltip)
          // We need to use the svgRef from parent or calculate based on gRef
          const svgNode = gRef.current?.ownerSVGElement;
          const svgRect = svgNode?.getBoundingClientRect();

          if ( svgRect ) {
            const pageX = svgRect.left + window.scrollX + px + margin.left;
            const pageY = svgRect.top + window.scrollY + closestSeries.py + margin.top;

            const colorScale = ( k: string ) => {
              const series = lines.find( l => l.key === k );
              return series?.color || '#8884d8';
            };

            showTooltip(
              <TooltipContent
                data={ d }
                labelKey={ labelKey }
                valueKeys={ [ closestSeries.key ] }
                colorScale={ colorScale }
              />,
              pageX,
              pageY
            );

            lastIndex = index;
            lastClosestKey = closestSeries.key;
          }
        }
      }
    };

    const handleLeave = () => {
      dot.style( 'opacity', 0 );
      hideTooltip();
      lastIndex = -1;
      lastClosestKey = null;
      lines.forEach( l => {
        l.path
          .attr( 'stroke', l.color )
          .attr( 'stroke-opacity', 1 )
          .attr( 'stroke-width', lineWidth );
      } );
    };

    const handleEnter = () => {
      dot.style( 'opacity', 1 );
    };

    // Attach listeners to overlay
    // We try to find the brush overlay from BaseChart first
    const svg = d3.select( gRef.current?.ownerSVGElement );
    let overlay: d3.Selection<any, any, any, any> = svg.select( '.brush-overlay .overlay' );

    if ( overlay.empty() ) {
      // Create our own overlay if brush doesn't exist
      let myOverlay = g.select<SVGRectElement>( '.hover-overlay' );
      if ( myOverlay.empty() ) {
        myOverlay = g.append( 'rect' )
          .attr( 'class', 'hover-overlay' )
          .attr( 'width', innerWidth )
          .attr( 'height', innerHeight )
          .attr( 'fill', 'transparent' )
          .style( 'pointer-events', 'all' );
      }
      overlay = myOverlay;
    } else {
      // Ensure we don't have our own overlay blocking
      g.select( '.hover-overlay' ).remove();
    }

    overlay
      .on( 'pointerenter', handleEnter )
      .on( 'pointerleave', handleLeave )
      .on( 'pointermove', handleHover );

    // Cleanup
    return () => {
      overlay.on( 'pointerenter', null )
        .on( 'pointerleave', null )
        .on( 'pointermove', null );
    };

  }, [ data, labelKey, valueKeys, xScale, yScale, colors, curveType, lineWidth, lineStyle, showPoints, pointSize, pointShape, pointColor, pointOutlineWidth, pointOutlineColor, showArea, areaOpacity, xAxisScaleType, innerHeight, innerWidth, showTooltip, hideTooltip, moveTooltip, margin ] );

  return (
    <g ref={ gRef } className="multi-line-chart-content">
      <circle
        ref={ dotRef }
        r={ 3 }
        fill="black"
        stroke="none"
        style={ { opacity: 0, pointerEvents: 'none' } }
      />
    </g>
  );
} );

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
  const { tooltipState, showTooltip, hideTooltip, moveTooltip } = useChartTooltip();

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
    columnMapping,
    availableColumns,
    setShowZoomControls,
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
    columnMapping: state.columnMapping,
    availableColumns: state.availableColumns,
    setShowZoomControls: state.setShowZoomControls,
  } ) ) );

  // Sync zoomEnabled prop with store
  useEffect( () => {
    setShowZoomControls( zoomEnabled );
  }, [ zoomEnabled, setShowZoomControls ] );

  // Automatically infer and set X-axis scale type
  useEffect( () => {
    if ( !data || data.length === 0 || !labelKey ) return;
    const values = data.map( d => d[ labelKey ] );
    const inferredType = inferScaleType( values );
    setXAxisScaleType( inferredType );
  }, [ data, labelKey, setXAxisScaleType ] );

  // 1. Calculate Dimensions
  const { margin: chartMargin, innerWidth, innerHeight } = useMemo( () => calculateChartMargins( {
    width: propWidth,
    height: propHeight,
    legendShow,
    legendPosition,
    xAxisShow,
    xAxisPosition,
    xAxisTitlePadding,
    xAxisLabelSpacing,
    yAxis
  } ), [ propWidth, propHeight, legendShow, legendPosition, xAxisShow, xAxisPosition, xAxisTitlePadding, xAxisLabelSpacing, yAxis ] );

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

  return (
    <BaseChart
      data={ data }
      labelKey={ labelKey }
      valueKeys={ valueKeys }
      width={ propWidth }
      height={ propHeight }
      colors={ colors }
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
      <MultiLineChartContent
        data={ filteredData }
        labelKey={ labelKey }
        valueKeys={ valueKeys }
        xScale={ xScale }
        yScale={ yScale }
        colors={ colors }
        curveType={ curveType }
        lineWidth={ lineWidth }
        lineStyle={ lineStyle }
        showPoints={ showPoints }
        pointSize={ pointSize }
        pointShape={ pointShape }
        pointColor={ pointColor }
        pointOutlineWidth={ pointOutlineWidth }
        pointOutlineColor={ pointOutlineColor }
        showArea={ showArea }
        areaOpacity={ areaOpacity }
        xAxisScaleType={ xAxisScaleType }
        innerHeight={ innerHeight }
        innerWidth={ innerWidth }
        showTooltip={ showTooltip }
        hideTooltip={ hideTooltip }
        moveTooltip={ moveTooltip }
        margin={ chartMargin }
      />
      <ChartTooltip
        visible={ tooltipState.visible }
        x={ tooltipState.x }
        y={ tooltipState.y }
        content={ tooltipState.content }
      />
    </BaseChart>
  );
}
