'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { ChartZoomControls } from './ChartZoomControls';
import {
  calculateChartMargins,
  renderLegend,
  setupBrushZoomY,
  setupPanY,
} from '@/utils/chartHelpers';
import { getColorPalette } from '@/lib/colorPalettes';
import { ChartTooltip } from './ChartTooltip';
import { TooltipContent } from './TooltipContent';
import { TooltipProvider } from '@/components/providers/TooltipProvider';
import { useTooltipActions } from '@/hooks/useTooltip';

interface DivergingBarChartProps {
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

  // Diverging-specific options
  showLabels?: boolean;
  barHeight?: number;
  barPadding?: number;
  positiveColor?: string;
  negativeColor?: string;
  sortBy?: 'none' | 'value' | 'label' | 'ascending' | 'descending';
  useGradientColors?: boolean;
  labelPosition?: 'inside' | 'outside';
}

const DEFAULT_COLORS = [ '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f' ];

function DivergingBarChartInner( {
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
  xAxisPosition = 'top',
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

  // Diverging-specific
  showLabels = true,
  barHeight = 20,
  barPadding = 0.2,
  positiveColor = '#3b82f6', // blue-500
  negativeColor = '#ef4444', // red-500
  sortBy = 'none',
  useGradientColors = true,
  labelPosition = 'inside',
}: DivergingBarChartProps ) {

  const svgRef = useRef<SVGSVGElement>( null );
  const { showTooltip, hideTooltip, moveTooltip } = useTooltipActions();
  const columnMapping = useChartStore( ( state ) => state.columnMapping );
  const availableColumns = useChartStore( ( state ) => state.availableColumns );

  // Store hooks
  const { zoomDomain, setZoomDomain } = useChartStore( useShallow( ( state ) => ( {
    zoomDomain: state.zoomDomain,
    setZoomDomain: state.setZoomDomain,
  } ) ) );

  const previousZoomDomainRef = useRef<typeof zoomDomain>( null );

  // Chart dimensions
  // For diverging charts, Y-axis labels are centered, so we need minimal side margins
  const margin = useMemo( () => {
    const hasXTitle = !!( xAxisTitle || xAxisName );
    const effectiveTitlePadding = hasXTitle ? xAxisTitlePadding : 0;

    const baseMargin = calculateChartMargins( {
      legendShow,
      legendPosition,
      xAxisShow,
      xAxisPosition,
      xAxisTitlePadding: effectiveTitlePadding,
      xAxisLabelSpacing,
      yAxis: { ...yAxis, titlePadding: 0, labelSpacing: 0 }, // Don't add Y-axis margin
      width: propWidth,
      height: propHeight
    } );

    // For diverging charts, use minimal margins since Y-axis is centered
    // Only keep space for value labels that extend beyond bars
    baseMargin.margin.left = 20;
    baseMargin.margin.right = 20;

    // Adjust top margin: if axis is top, we have base 20 + padding. 
    // If no title, we have 20. Let's reduce that base 20 to 10 for a tighter look.
    if ( xAxisShow && xAxisPosition === 'top' ) {
      baseMargin.margin.top = Math.max( 10, baseMargin.margin.top - 10 );
    } else {
      baseMargin.margin.top = 0;
    }

    baseMargin.margin.bottom = xAxisShow && xAxisPosition === 'bottom' ? baseMargin.margin.bottom + 10 : 0;

    baseMargin.innerWidth = propWidth - baseMargin.margin.left - baseMargin.margin.right;
    baseMargin.innerHeight = propHeight - baseMargin.margin.top - baseMargin.margin.bottom;

    return baseMargin;
  }, [
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

  // Process and sort data
  const processedData = useMemo( () => {
    // Diverging bar charts need values that can be positive or negative
    // If two value columns are provided, calculate the difference (second - first)
    // If one value column is provided, use it directly
    const processed = data.map( d => {
      let value: number;

      if ( valueKeys.length >= 2 ) {
        // Calculate difference: second column - first column
        const baseValue = Number( d[ valueKeys[ 0 ] ] ) || 0;
        const compareValue = Number( d[ valueKeys[ 1 ] ] ) || 0;
        value = compareValue - baseValue;
      } else {
        // Use the single value column directly
        value = Number( d[ valueKeys[ 0 ] ] ) || 0;
      }

      return {
        label: String( d[ labelKey ] ),
        value,
        rawData: d
      };
    } );

    // Apply sorting
    if ( sortBy === 'value' || sortBy === 'ascending' ) {
      return processed.sort( ( a, b ) => a.value - b.value );
    } else if ( sortBy === 'descending' ) {
      return processed.sort( ( a, b ) => b.value - a.value );
    } else if ( sortBy === 'label' ) {
      return processed.sort( ( a, b ) => a.label.localeCompare( b.label ) );
    }

    return processed;
  }, [ data, labelKey, valueKeys, sortBy ] );

  // Filter data based on zoom
  const filteredData = useMemo( () => {
    if ( !zoomDomain || !zoomDomain.y ) return processedData;
    const [ start, end ] = zoomDomain.y;
    return processedData.slice( start, end + 1 );
  }, [ processedData, zoomDomain ] );

  // Create scales
  const xScale = useMemo( () => {
    const extent = d3.extent( filteredData, d => d.value ) as [ number, number ];

    // For diverging charts, ALWAYS use symmetric scale around zero
    // This ensures negative and positive values are visually comparable
    const maxAbs = Math.max( Math.abs( extent[ 0 ] || 0 ), Math.abs( extent[ 1 ] || 0 ) );

    // Add 10% padding to the max absolute value
    const paddedMax = maxAbs * 1.1;

    // Always symmetric: ignore xAxisMin/xAxisMax for diverging charts
    const domain = [ -paddedMax, paddedMax ];

    return d3.scaleLinear()
      .domain( domain )
      .range( [ 0, innerWidth ] );
  }, [ filteredData, innerWidth ] );

  const yScale = useMemo( () => {
    return d3.scaleBand()
      .domain( filteredData.map( d => d.label ) )
      .range( [ 0, innerHeight ] )
      .padding( barPadding );
  }, [ filteredData, innerHeight, barPadding ] );

  // Create diverging color scale
  const divergingColorScale = useMemo( () => {
    const extent = d3.extent( filteredData, d => d.value ) as [ number, number ];

    if ( useGradientColors ) {
      // Use the selected colors for gradient: negative -> light gray -> positive
      return d3.scaleLinear<string>()
        .domain( [ extent[ 0 ], 0, extent[ 1 ] ] )
        .range( [ negativeColor, '#f5f5f5', positiveColor ] )
        .interpolate( d3.interpolateRgb );
    } else {
      // Simple two-color mode
      return ( value: number ) => value >= 0 ? positiveColor : negativeColor;
    }
  }, [ filteredData, useGradientColors, positiveColor, negativeColor ] );

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

    // Clear previous content for fresh render
    g.selectAll( '.content-group' ).remove();
    g.selectAll( '.x-axis' ).remove();
    g.selectAll( '.y-axis' ).remove();
    g.selectAll( '.x-grid' ).remove();
    g.selectAll( '.zero-line' ).remove();

    const contentGroup = g.append( 'g' ).attr( 'class', 'content-group' );

    // Draw grid lines if enabled
    if ( xAxisShowGrid ) {
      const gridGroup = g.append( 'g' ).attr( 'class', 'x-grid' );

      gridGroup.selectAll( 'line' )
        .data( xScale.ticks( xAxisTickCount ) )
        .join( 'line' )
        .attr( 'x1', d => xScale( d ) )
        .attr( 'x2', d => xScale( d ) )
        .attr( 'y1', 0 )
        .attr( 'y2', innerHeight )
        .attr( 'stroke', xAxisGridColor )
        .attr( 'stroke-width', xAxisGridWidth )
        .attr( 'stroke-opacity', xAxisGridOpacity )
        .attr( 'stroke-dasharray', xAxisGridDashArray );
    }

    // Draw zero line (central axis) - subtle
    g.append( 'line' )
      .attr( 'class', 'zero-line' )
      .attr( 'x1', xScale( 0 ) )
      .attr( 'x2', xScale( 0 ) )
      .attr( 'y1', 0 )
      .attr( 'y2', innerHeight )
      .attr( 'stroke', '#9ca3af' )
      .attr( 'stroke-width', 1 )
      .attr( 'stroke-opacity', 0.5 );

    // Render bars
    const bars = contentGroup
      .selectAll<SVGRectElement, typeof filteredData[ 0 ]>( 'rect' )
      .data( filteredData, d => d.label );

    bars.exit().remove();

    const barsEnter = bars.enter().append( 'rect' );

    const barsMerge = barsEnter.merge( bars );

    barsMerge
      .attr( 'y', d => yScale( d.label ) || 0 )
      .attr( 'height', yScale.bandwidth() )
      .attr( 'fill', d => {
        if ( typeof divergingColorScale === 'function' ) {
          return divergingColorScale( d.value ) as string;
        }
        return d.value >= 0 ? positiveColor : negativeColor;
      } )
      .attr( 'rx', 0 ) // No rounded corners like the reference
      .attr( 'ry', 0 )
      .on( 'mouseenter', function ( event, d ) {
        d3.select( this ).attr( 'opacity', 0.8 );

        const colorScale = () => d.value >= 0 ? positiveColor : negativeColor;
        showTooltip(
          <TooltipContent
            data={ d.rawData }
            labelKey={ labelKey }
            valueKeys={ valueKeys }
            colorScale={ colorScale }
          />,
          event.pageX,
          event.pageY
        );
      } )
      .on( 'mousemove', ( event ) => {
        moveTooltip( event.pageX, event.pageY );
      } )
      .on( 'mouseleave', function () {
        d3.select( this ).attr( 'opacity', 1 );
        hideTooltip();
      } );

    // Animate bars from zero
    barsMerge
      .transition()
      .duration( 500 )
      .attr( 'x', d => d.value >= 0 ? xScale( 0 ) : xScale( d.value ) )
      .attr( 'width', d => Math.abs( xScale( d.value ) - xScale( 0 ) ) );

    // Add value labels if enabled
    if ( showLabels ) {
      const labels = contentGroup
        .selectAll<SVGTextElement, typeof filteredData[ 0 ]>( 'text.value-label' )
        .data( filteredData, d => d.label );

      labels.exit().remove();

      const labelsEnter = labels.enter()
        .append( 'text' )
        .attr( 'class', 'value-label' );

      const labelsMerge = labelsEnter.merge( labels );

      // Helper function to format large numbers
      const formatValue = ( value: number ): string => {
        if ( xAxisTickFormat ) {
          try {
            return d3.format( xAxisTickFormat )( value );
          } catch ( e ) {
            // Ignore invalid format strings while typing
          }
        }

        const absValue = Math.abs( value );
        const sign = value >= 0 ? '+' : '';

        if ( absValue >= 1000000 ) {
          return `${ sign }${ ( value / 1000000 ).toFixed( 1 ) }M`;
        } else if ( absValue >= 1000 ) {
          return `${ sign }${ ( value / 1000 ).toFixed( 0 ) }K`;
        }
        return `${ sign }${ value.toFixed( 0 ) }`;
      };

      labelsMerge
        .attr( 'y', d => ( yScale( d.label ) || 0 ) + yScale.bandwidth() / 2 )
        .attr( 'dy', '0.35em' )
        .attr( 'font-size', '10px' )
        .attr( 'font-weight', '400' )
        .attr( 'fill', '#000000' ) // Always black text
        .text( d => formatValue( d.value ) );

      if ( labelPosition === 'inside' ) {
        // Inside the bars, at the end away from zero
        labelsMerge
          .transition()
          .duration( 500 )
          .attr( 'x', d => {
            const barEnd = d.value >= 0 ? xScale( d.value ) : xScale( d.value );
            return d.value >= 0 ? barEnd - 5 : barEnd + 5;
          } )
          .attr( 'text-anchor', d => d.value >= 0 ? 'end' : 'start' );
      } else {
        // Outside the bars, away from zero axis (at the end of the bar)
        labelsMerge
          .transition()
          .duration( 500 )
          .attr( 'x', d => {
            const barEnd = xScale( d.value );
            // For positive values: place to the right of the bar
            // For negative values: place to the left of the bar
            return d.value >= 0 ? barEnd + 5 : barEnd - 5;
          } )
          .attr( 'text-anchor', d => d.value >= 0 ? 'start' : 'end' );
      }
    }

    // Render X Axis
    if ( xAxisShow ) {
      const xAxisGenerator = d3.axisTop( xScale )
        .ticks( xAxisTickCount )
        .tickSize( xAxisTickSize )
        .tickPadding( xAxisTickPadding );

      if ( xAxisTickFormat ) {
        try {
          xAxisGenerator.tickFormat( d3.format( xAxisTickFormat ) );
        } catch ( e ) {
          // Ignore invalid format strings while typing
        }
      }

      const xAxisGroup = g.append( 'g' )
        .attr( 'class', 'x-axis' )
        .attr( 'transform', xAxisPosition === 'top' ? 'translate(0,0)' : `translate(0,${ innerHeight })` )
        .call( xAxisGenerator );

      xAxisGroup.selectAll( 'text' )
        .attr( 'font-size', `${ xAxisLabelSize }px` )
        .attr( 'font-weight', xAxisLabelWeight )
        .attr( 'fill', xAxisLabelColor );

      xAxisGroup.select( '.domain' )
        .attr( 'stroke', xAxisShowDomain ? '#9ca3af' : 'none' );

      // Add axis title if provided
      if ( xAxisTitle || xAxisName ) {
        const titleText = xAxisTitleType === 'custom' ? xAxisTitle : ( xAxisName || xAxisTitle );
        xAxisGroup.append( 'text' )
          .attr( 'class', 'axis-title' )
          .attr( 'x', innerWidth / 2 )
          .attr( 'y', xAxisPosition === 'top' ? -xAxisTitlePadding : xAxisTitlePadding )
          .attr( 'text-anchor', 'middle' )
          .attr( 'font-size', `${ xAxisTitleSize }px` )
          .attr( 'font-weight', xAxisTitleWeight )
          .attr( 'fill', xAxisTitleColor )
          .text( titleText );
      }
    }

    // Render Y Axis (labels) - positioned based on bar direction for diverging chart
    if ( yAxis.show ) {
      const zeroPosition = xScale( 0 );
      const labelSpacing = yAxis.labelSpacing || 15;

      // Create label group
      const yLabelGroup = g.append( 'g' )
        .attr( 'class', 'y-axis' );

      // Render each label individually based on its bar direction
      const yLabels = yLabelGroup
        .selectAll<SVGTextElement, typeof filteredData[ 0 ]>( 'text' )
        .data( filteredData );

      yLabels.enter()
        .append( 'text' )
        .merge( yLabels )
        .attr( 'x', d => {
          // Negative bars (pointing left): label on right side of zero
          // Positive bars (pointing right): label on left side of zero
          return d.value < 0 ? zeroPosition + labelSpacing : zeroPosition - labelSpacing;
        } )
        .attr( 'y', d => ( yScale( d.label ) || 0 ) + yScale.bandwidth() / 2 )
        .attr( 'dy', '0.35em' )
        .attr( 'text-anchor', d => d.value < 0 ? 'start' : 'end' )
        .attr( 'font-size', `${ yAxis.labelSize || 12 }px` )
        .attr( 'font-weight', yAxis.labelWeight || 'regular' )
        .attr( 'fill', yAxis.labelColor || '#000000' )
        .text( d => d.label );
    }

    // Render Legend
    renderLegend( {
      svg,
      width: propWidth,
      height: propHeight,
      chartMargin: margin.margin,
      innerWidth,
      valueKeys: [ 'Positive', 'Negative' ],
      colors: [ positiveColor, negativeColor ],
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
    filteredData,
    processedData,
    showLabels,
    barHeight,
    barPadding,
    positiveColor,
    negativeColor,
    sortBy,
    useGradientColors,
    labelPosition,
    divergingColorScale,
    showTooltip,
    hideTooltip,
    moveTooltip,
    columnMapping,
    availableColumns
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
      <ChartTooltip />
    </div>
  );
}

export function DivergingBarChart( props: DivergingBarChartProps ) {
  return (
    <TooltipProvider>
      <DivergingBarChartInner { ...props } />
    </TooltipProvider>
  );
}
