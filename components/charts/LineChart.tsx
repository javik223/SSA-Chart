'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { YAxisConfig, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { useChartStore } from '@/store/useChartStore';
import { createScale } from '@/utils/chartScales';
import { inferScaleType } from '@/utils/inferScaleType';
import { ChartZoomControls } from './ChartZoomControls';

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

  // 1. Calculate Dimensions
  const { innerWidth, innerHeight, chartMargin } = useMemo( () => {
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const legendSpace = 120; // Default space for legend

    // Adjust margins for legend
    if ( legendShow ) {
      if ( legendPosition === 'top' ) margin.top += legendSpace;
      if ( legendPosition === 'bottom' ) margin.bottom += legendSpace;
      if ( legendPosition === 'left' ) margin.left += legendSpace;
      if ( legendPosition === 'right' ) margin.right += legendSpace;
    }

    // Default margins if legend is not taking up space
    if ( legendPosition !== 'bottom' ) margin.bottom = Math.max( margin.bottom, 40 );
    if ( legendPosition !== 'left' ) margin.left = Math.max( margin.left, 50 );

    // Adjust margins for axis titles and labels
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      if ( xAxisPosition === 'bottom' ) margin.bottom += xAxisTitlePadding + xAxisLabelSpacing;
      if ( xAxisPosition === 'top' ) margin.top += xAxisTitlePadding + xAxisLabelSpacing;
    }

    if ( yAxis.show && yAxis.position !== 'hidden' ) {
      if ( yAxis.position === 'left' ) margin.left += yAxis.titlePadding + yAxis.labelSpacing;
      if ( yAxis.position === 'right' ) margin.right += yAxis.titlePadding + yAxis.labelSpacing;
    }

    // Add edge padding
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

  // Helper function to get X position based on scale type
  const getXPosition = ( d: any ): number => {
    let value: any;

    // Convert value based on scale type
    if ( xAxisScaleType === 'linear' ) {
      value = Number( d[ labelKey ] );
    } else if ( xAxisScaleType === 'time' ) {
      // Convert to Date object for time scales
      value = new Date( d[ labelKey ] );
    } else {
      // For point/band scales, use string
      value = String( d[ labelKey ] );
    }

    const pos = xScale( value as any ) || 0;

    // Add bandwidth offset for point/band scales
    if ( 'bandwidth' in xScale ) {
      return pos + ( xScale.bandwidth() / 2 );
    }
    return pos;
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

    // Y Grid lines
    if ( yAxis.showGrid ) {
      const grid = g.append( 'g' )
        .attr( 'class', 'y-grid' )
        .attr( 'opacity', 0.5 ); // Use a default opacity or add a prop for it

      // Apply grid with transition for smooth zoom animation
      grid.transition()
        .duration( 300 )
        .call(
          d3
            .axisLeft( yScale )
            .tickSize( -innerWidth )
            .tickFormat( () => '' )
            .ticks( yAxis.tickCount ?? 10 )
        );

      grid.selectAll( 'line' )
        .attr( 'stroke', yAxis.gridColor )
        .attr( 'stroke-width', yAxis.gridWidth )
        .attr( 'stroke-dasharray', yAxis.gridStyle === 'dashed' ? '4,4' : yAxis.gridStyle === 'dotted' ? '1,4' : '0' );

      grid.select( '.domain' ).remove();
    }

    // Y Axis
    if ( yAxis.show && yAxis.position !== 'hidden' ) {
      const yAxisFunction = yAxis.position === 'left' ? d3.axisLeft( yScale ) : d3.axisRight( yScale );
      const axis = yAxisFunction
        .tickSize( yAxis.tickSize )
        .tickPadding( yAxis.tickPadding )
        .ticks( yAxis.tickCount ?? 10 );

      // Apply tick format if provided
      if ( yAxis.tickFormat ) {
        try {
          axis.tickFormat( d3.format( yAxis.tickFormat ) );
        } catch ( e ) {
          console.warn( 'Invalid Y-axis tick format:', yAxis.tickFormat );
        }
      }

      const yAxisGroup = g.append( 'g' )
        .attr( 'transform', `translate(${ yAxis.position === 'left' ? 0 : innerWidth },0)` )
        .style( 'font-size', `${ yAxis.labelSize }px` )
        .style( 'font-weight', yAxis.labelWeight )
        .style( 'color', yAxis.labelColor );

      // Apply axis with transition for smooth zoom animation
      yAxisGroup.transition()
        .duration( 300 )
        .call( axis );

      // Apply tick position
      if ( yAxis.tickPosition === 'inside' ) {
        yAxisGroup.selectAll( '.tick line' )
          .attr( 'x2', yAxis.position === 'left' ? yAxis.tickSize : -yAxis.tickSize );
      } else if ( yAxis.tickPosition === 'cross' ) {
        yAxisGroup.selectAll( '.tick line' )
          .attr( 'x1', yAxis.position === 'left' ? yAxis.tickSize / 2 : -yAxis.tickSize / 2 )
          .attr( 'x2', yAxis.position === 'left' ? -yAxis.tickSize / 2 : yAxis.tickSize / 2 );
      }

      // Apply label rotation
      if ( yAxis.labelAngle !== 0 ) {
        yAxisGroup.selectAll( 'text' )
          .attr( 'transform', `rotate(${ yAxis.labelAngle })` )
          .style( 'text-anchor', yAxis.labelAngle < 0 ? 'end' : 'start' );
      }

      // Add Y axis title
      if ( yAxis.title ) {
        const titleX = yAxis.position === 'left' ? -yAxis.titlePadding : innerWidth + yAxis.titlePadding;
        const titleY = innerHeight / 2;
        g.append( 'text' )
          .attr( 'transform', `translate(${ titleX },${ titleY }) rotate(-90)` )
          .style( 'text-anchor', 'middle' )
          .style( 'font-size', `${ yAxis.titleSize }px` )
          .style( 'font-weight', yAxis.titleWeight )
          .style( 'fill', yAxis.titleColor )
          .text( yAxis.title );
      }

      // Hide domain line if needed
      if ( !yAxis.showDomain ) {
        yAxisGroup.select( '.domain' ).remove();
      }

      // Apply axis line color/width if shown
      if ( yAxis.showDomain ) {
        yAxisGroup.select( '.domain' )
          .attr( 'stroke', yAxis.lineColor )
          .attr( 'stroke-width', yAxis.lineWidth );
      }
    }



    // X axis
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      // Determine axis function based on position
      const axisFunction = xAxisPosition === 'top' ? d3.axisTop( xScale as any ) : d3.axisBottom( xScale as any );
      const xAxis = axisFunction
        .tickSize( xAxisTickSize )
        .tickPadding( xAxisTickPadding )
        .ticks( xAxisTickCount ?? 10 );

      // Note: xAxisTickFormat is not applied for scalePoint as it uses string domain
      // Tick count also doesn't apply to scalePoint

      // Calculate Y position based on axis position
      const yPosition = xAxisPosition === 'top' ? 0 : innerHeight;

      const xAxisGroup = g.append( 'g' )
        .attr( 'transform', `translate(0,${ yPosition })` )
        .style( 'font-size', `${ xAxisLabelSize }px` )
        .style( 'font-weight', xAxisLabelWeight )
        .style( 'color', xAxisLabelColor );

      // Apply axis with transition for smooth zoom animation
      xAxisGroup.transition()
        .duration( 300 )
        .call( xAxis );

      // Apply tick position
      if ( xAxisTickPosition === 'inside' ) {
        xAxisGroup.selectAll( '.tick line' )
          .attr( 'y2', xAxisPosition === 'top' ? xAxisTickSize : -xAxisTickSize );
      } else if ( xAxisTickPosition === 'cross' ) {
        xAxisGroup.selectAll( '.tick line' )
          .attr( 'y1', xAxisPosition === 'top' ? xAxisTickSize / 2 : -xAxisTickSize / 2 )
          .attr( 'y2', xAxisPosition === 'top' ? -xAxisTickSize / 2 : xAxisTickSize / 2 );
      }

      // Apply label rotation
      if ( xAxisLabelRotation !== 0 ) {
        xAxisGroup.selectAll( 'text' )
          .attr( 'transform', `rotate(${ xAxisLabelRotation })` )
          .style( 'text-anchor', xAxisLabelRotation > 0 ? 'start' : 'end' )
          .attr( 'dx', xAxisLabelRotation > 0 ? '0.5em' : '-0.5em' )
          .attr( 'dy', xAxisLabelRotation > 0 ? '0.5em' : '0.5em' );
      }

      // Apply label spacing
      xAxisGroup.selectAll( '.tick text' )
        .attr( 'dy', xAxisPosition === 'top' ? `-${ xAxisLabelSpacing }px` : `${ xAxisLabelSpacing }px` );

      // Add X axis title
      if ( xAxisTitle ) {
        const titleY = xAxisPosition === 'top'
          ? -xAxisTitlePadding
          : innerHeight + xAxisTitlePadding;

        g.append( 'text' )
          .attr( 'x', innerWidth / 2 )
          .attr( 'y', titleY )
          .style( 'text-anchor', 'middle' )
          .style( 'font-size', `${ xAxisTitleSize }px` )
          .style( 'font-weight', xAxisTitleWeight )
          .style( 'fill', xAxisTitleColor )
          .text( xAxisTitle );
      }

      // Hide domain line if needed
      if ( !xAxisShowDomain ) {
        xAxisGroup.select( '.domain' ).remove();
      }

      // X Grid lines
      if ( xAxisShowGrid ) {
        const grid = g.append( 'g' )
          .attr( 'class', 'x-grid' )
          .attr( 'opacity', xAxisGridOpacity );

        // Apply grid with transition for smooth zoom animation
        grid.transition()
          .duration( 300 )
          .call(
            d3
              .axisBottom( xScale as any )
              .tickSize( innerHeight )
              .tickFormat( () => '' )
              .ticks( xAxisTickCount ?? 10 )
          );

        grid.selectAll( 'line' )
          .attr( 'stroke', xAxisGridColor )
          .attr( 'stroke-width', xAxisGridWidth )
          .attr( 'stroke-dasharray', xAxisGridDashArray );

        grid.select( '.domain' ).remove();
      }
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

    // Legend
    if ( legendShow ) {
      // Calculate legend position based on legendPosition prop
      let legendX = 0;
      let legendY = 0;
      let legendOrientation: 'vertical' | 'horizontal' = 'vertical';

      if ( legendPosition === 'right' ) {
        legendX = width - chartMargin.right + 5 - legendPaddingRight;
        // Apply vertical alignment for right position
        if ( legendAlignment === 'center' ) {
          legendY = height / 2;
        } else if ( legendAlignment === 'end' ) {
          legendY = height - chartMargin.bottom;
        } else {
          legendY = chartMargin.top;
        }
        legendY += legendPaddingTop;
        legendOrientation = 'vertical';
      } else if ( legendPosition === 'left' ) {
        legendX = 5 + legendPaddingLeft;
        // Apply vertical alignment for left position
        if ( legendAlignment === 'center' ) {
          legendY = height / 2;
        } else if ( legendAlignment === 'end' ) {
          legendY = height - chartMargin.bottom;
        } else {
          legendY = chartMargin.top;
        }
        legendY += legendPaddingTop;
        legendOrientation = 'vertical';
      } else if ( legendPosition === 'top' ) {
        // Apply horizontal alignment for top position
        if ( legendAlignment === 'center' ) {
          legendX = width / 2;
        } else if ( legendAlignment === 'end' ) {
          legendX = width - chartMargin.right;
        } else {
          legendX = chartMargin.left;
        }
        legendX += legendPaddingLeft;
        legendY = 5 + legendPaddingTop;
        legendOrientation = 'horizontal';
      } else if ( legendPosition === 'bottom' ) {
        // Apply horizontal alignment for bottom position
        if ( legendAlignment === 'center' ) {
          legendX = width / 2;
        } else if ( legendAlignment === 'end' ) {
          legendX = width - chartMargin.right;
        } else {
          legendX = chartMargin.left;
        }
        legendX += legendPaddingLeft;
        legendY = height - chartMargin.bottom + 45 - legendPaddingBottom;
        legendOrientation = 'horizontal';
      }

      const legend = svg
        .append( 'g' )
        .attr( 'transform', `translate(${ legendX },${ legendY })` );

      if ( legendOrientation === 'vertical' ) {
        // Vertical layout
        valueKeys.forEach( ( key, index ) => {
          const legendRow = legend
            .append( 'g' )
            .attr( 'transform', `translate(0,${ index * ( 15 + legendGap ) })` );

          legendRow
            .append( 'rect' )
            .attr( 'width', 15 )
            .attr( 'height', 15 )
            .attr( 'fill', colors[ index % colors.length ] );

          legendRow
            .append( 'text' )
            .attr( 'x', 20 )
            .attr( 'y', 12 )
            .text( key )
            .style( 'font-size', `${ legendFontSize }px` )
            .attr( 'text-anchor', 'start' );
        } );
      } else {
        // Horizontal layout with wrapping
        let cumulativeX = 0;
        let cumulativeY = 0;
        const maxWidth = innerWidth;
        const lineHeight = 15 + legendGap;

        valueKeys.forEach( ( key, index ) => {
          // Estimate item width (rect + spacing + text width)
          const itemWidth = 15 + 5 + key.length * legendFontSize * 0.6 + legendGap;

          // Check if we need to wrap to next line
          if ( cumulativeX > 0 && cumulativeX + itemWidth > maxWidth ) {
            cumulativeX = 0;
            cumulativeY += lineHeight;
          }

          const legendItem = legend
            .append( 'g' )
            .attr( 'transform', `translate(${ cumulativeX },${ cumulativeY })` );

          legendItem
            .append( 'rect' )
            .attr( 'width', 15 )
            .attr( 'height', 15 )
            .attr( 'fill', colors[ index % colors.length ] );

          legendItem
            .append( 'text' )
            .attr( 'x', 20 )
            .attr( 'y', 12 )
            .text( key )
            .style( 'font-size', `${ legendFontSize }px` )
            .attr( 'text-anchor', 'start' );

          // Move X position for next item
          cumulativeX += itemWidth;
        } );
      }
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
