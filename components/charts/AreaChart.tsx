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
  getXPosition as getXPositionHelper
} from '@/utils/chartHelpers';
import { BaseChart } from './BaseChart';
import { getColorPalette } from '@/lib/colorPalettes';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';

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



interface AreaChartContentProps {
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
  fillOpacity: number;
  xAxisScaleType: 'linear' | 'log' | 'time' | 'band' | 'point';
  innerHeight: number;
  margin: { top: number; right: number; bottom: number; left: number; };
  showTooltip: ( content: React.ReactNode, x: number, y: number ) => void;
  hideTooltip: () => void;
  tooltipState: any;
  columnMapping: any;
  availableColumns: string[];
}

const AreaChartContent = ( {
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
  fillOpacity,
  xAxisScaleType,
  innerHeight,
  margin,
  showTooltip,
  hideTooltip,
  tooltipState,
  columnMapping,
  availableColumns
}: AreaChartContentProps ) => {
  const gRef = useRef<SVGGElement>( null );

  // Helper function to get X position based on scale type
  const getXPosition = ( d: any ): number => {
    return getXPositionHelper( d, labelKey, xScale, xAxisScaleType );
  };

  useEffect( () => {
    if ( !gRef.current || !data ) return;

    const g = d3.select( gRef.current );

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
      let areaPath = g.select<SVGPathElement>( `.area-${ index }` );
      if ( areaPath.empty() ) {
        areaPath = g.append( 'path' ).attr( 'class', `area-${ index }` );
      }

      areaPath
        .datum( data )
        .attr( 'fill', color )
        .attr( 'fill-opacity', fillOpacity )
        .transition()
        .duration( 500 )
        .ease( d3.easeCubicInOut )
        .attr( 'd', area( data ) );

      // Line generator
      const line = d3
        .line<any>()
        .x( ( d ) => getXPosition( d ) )
        .y( ( d ) => yScale( Number( d[ key ] ) ) );

      if ( curveType === 'monotone' ) line.curve( d3.curveMonotoneX );
      if ( curveType === 'step' ) line.curve( d3.curveStep );
      if ( curveType === 'linear' ) line.curve( d3.curveLinear );

      // Line
      let linePath = g.select<SVGPathElement>( `.line-${ index }` );
      if ( linePath.empty() ) {
        linePath = g.append( 'path' ).attr( 'class', `line-${ index }` );
      }

      linePath
        .datum( data )
        .attr( 'fill', 'none' )
        .attr( 'stroke', color )
        .attr( 'stroke-width', lineWidth )
        .attr( 'stroke-dasharray', lineStyle === 'dashed' ? '5,5' : lineStyle === 'dotted' ? '1,5' : '0' )
        .transition()
        .duration( 500 )
        .ease( d3.easeCubicInOut )
        .attr( 'd', line( data ) );

      // Dots
      if ( showPoints ) {
        const dots = g.selectAll( `.dot-${ index }` )
          .data( data );

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
          .duration( 500 )
          .attr( 'transform', ( d: any ) => `translate(${ getXPosition( d ) },${ yScale( Number( d[ key ] ) ) })` )
          .style( 'opacity', 1 )
          .attrTween( 'd', () => {
            const i = d3.interpolate( 0, fullSize );
            return ( t: number ) => symbolGenerator.size( i( t ) )() || '';
          } );

        // Add interaction to dots
        ( ( dots as any ).merge( dotsEnter ) )
          .on( 'mouseenter', ( event: any, d: any ) => {
            d3.select( event.currentTarget ).attr( 'r', pointSize * 1.5 );

            const [ x, y ] = d3.pointer( event, g.node() );

            showTooltip(
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-xs">{ d[ labelKey ] }</div>
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={ { backgroundColor: color } }
                  />
                  <span className="text-muted-foreground">{ key }:</span>
                  <span className="font-medium">
                    { Number( d[ key ] ).toLocaleString() }
                  </span>
                </div>
                { columnMapping?.customPopups && columnMapping.customPopups.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-border/50 flex flex-col gap-0.5">
                    { columnMapping.customPopups.map( ( colIndex: number ) => {
                      const colName = availableColumns[ colIndex ];
                      const val = d[ colName ];
                      return (
                        <div key={ colIndex } className="flex items-center justify-between gap-4 text-xs">
                          <span className="text-muted-foreground">{ colName }:</span>
                          <span className="font-medium">{ String( val ) }</span>
                        </div>
                      );
                    } ) }
                  </div>
                ) }
              </div>,
              x + margin.left,
              y + margin.top
            );
          } )
          .on( 'mousemove', ( event: any ) => {
            const [ x, y ] = d3.pointer( event, g.node() );
            showTooltip( tooltipState.content, x + margin.left, y + margin.top );
          } )
          .on( 'mouseleave', ( event: any ) => {
            d3.select( event.currentTarget ).attr( 'r', pointSize );
            hideTooltip();
          } );

      } else {
        g.selectAll( `.dot-${ index }` ).remove();
      }
    } );

  }, [ data, labelKey, valueKeys, xScale, yScale, colors, curveType, lineWidth, lineStyle, showPoints, pointSize, pointShape, pointColor, pointOutlineWidth, pointOutlineColor, fillOpacity, xAxisScaleType, innerHeight, showTooltip, hideTooltip, tooltipState.content ] );

  return <g ref={ gRef } className="area-chart-content" />;
};

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
}: AreaChartProps ) {
  // Store hooks
  const zoomDomain = useChartStore( ( state ) => state.zoomDomain );
  const setXAxisScaleType = useChartStore( ( state ) => state.setXAxisScaleType );
  const { tooltipState, showTooltip, hideTooltip } = useChartTooltip();
  const columnMapping = useChartStore( ( state ) => state.columnMapping );
  const availableColumns = useChartStore( ( state ) => state.availableColumns );

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

  // Use store opacity if available, otherwise prop
  const storeAreaOpacity = useChartStore( ( state ) => state.areaOpacity );
  const effectiveFillOpacity = storeAreaOpacity ?? fillOpacity;

  // Automatically infer and set X-axis scale type when data or labelKey changes
  useEffect( () => {
    if ( !data || data.length === 0 || !labelKey ) return;

    const values = data.map( d => d[ labelKey ] );
    const inferredType = inferScaleType( values );

    // Only update if the inferred type is different to avoid unnecessary re-renders
    // We use the store action directly
    setXAxisScaleType( inferredType );
  }, [ data, labelKey, setXAxisScaleType ] );

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

  // Filter Data
  const filteredData = useMemo( () => {
    if ( !zoomDomain?.x ) return data;
    const [ xMin, xMax ] = zoomDomain.x;
    return data.filter( ( d, i ) => {
      // For point scale, we use indices
      return i >= xMin && i <= xMax;
    } );
  }, [ data, zoomDomain?.x ] );

  // Create Scales
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

  return (
    <BaseChart
      data={ data }
      labelKey={ labelKey }
      valueKeys={ valueKeys }
      width={ propWidth }
      height={ propHeight }
      colors={ colors }
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
      <AreaChartContent
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
        fillOpacity={ effectiveFillOpacity }
        xAxisScaleType={ xAxisScaleType }
        innerHeight={ innerHeight }
        margin={ margin.margin }
        showTooltip={ showTooltip }
        hideTooltip={ hideTooltip }
        tooltipState={ tooltipState }
        columnMapping={ columnMapping }
        availableColumns={ availableColumns }
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
