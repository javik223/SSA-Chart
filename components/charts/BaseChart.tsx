'use client';

import { useEffect, useRef, ReactNode } from 'react';
import * as d3 from 'd3';
import { BaseChartProps, DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import { calculateChartMargins, setupPan, setupBrushZoom, renderXAxis, renderYAxis, renderXGrid, renderYGrid, renderLegend } from '@/utils/chartHelpers';
import { useChartStore } from '@/store/useChartStore';
import { ChartZoomControls } from './ChartZoomControls';


interface BaseChartComponentProps extends BaseChartProps {
  children?: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xScale: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yScale: any;
  valueKeys: string[];
  labelKey?: string;
  data?: Array<Record<string, string | number>>;
}

export function BaseChart( {
  width = 800,
  height = 600,
  colors = [],
  isFloatingPreview = false,
  xScale,
  yScale,
  data,
  labelKey,
  valueKeys,
  children,
  yAxis = DEFAULT_Y_AXIS_CONFIG,
  ...props
}: BaseChartComponentProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const gRef = useRef<SVGGElement>( null );
  const brushRef = useRef<SVGGElement>( null );

  // Get zoom state from store
  const showZoomControls = useChartStore( ( state ) => state.showZoomControls );
  const zoomDomain = useChartStore( ( state ) => state.zoomDomain );
  const setZoomDomain = useChartStore( ( state ) => state.setZoomDomain );

  // Calculate layout using utility
  const {
    margin: chartMargin,
    innerWidth,
    innerHeight,
  } = calculateChartMargins( {
    ...props,
    width,
    height,
    yAxis,
    legendShow: props.legendShow ?? true,
    legendPosition: ( props.legendPosition ?? 'right' ) as 'top' | 'right' | 'bottom' | 'left',
    xAxisShow: props.xAxisShow ?? true,
    xAxisPosition: props.xAxisPosition ?? 'bottom',
    xAxisTitlePadding: props.xAxisTitlePadding ?? 35,
    xAxisLabelSpacing: props.xAxisLabelSpacing ?? 3,
    xAxisTickSize: props.xAxisTickSize ?? 6,
    xAxisTickPadding: props.xAxisTickPadding ?? 3,
    xAxisLabelSize: props.xAxisLabelSize ?? 12,
    xAxisTitleSize: props.xAxisTitleSize ?? 12,
  } );

  // Destructure props needed for rendering (excluding those handled by layout utility if not needed elsewhere)
  const {
    legendShow = true,
    legendPosition = 'right',
    legendAlignment = 'start',
    legendFontSize = 12,
    legendGap = 20,
    legendPaddingTop = 0,
    legendPaddingRight = 0,
    legendPaddingBottom = 0,
    legendPaddingLeft = 0,
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
  } = props;

  // Set up D3 brush for zoom
  useEffect( () => {
    if ( !gRef.current || !showZoomControls || !xScale || !yScale || !data || !labelKey ) return;

    const g = d3.select( gRef.current );

    // Setup Brush Zoom
    setupBrushZoom( {
      g,
      innerWidth,
      innerHeight,
      data,
      labelKey,
      valueKeys,
      setZoomDomain
    } );

    // Setup Pan
    if ( zoomDomain ) {
      setupPan( {
        g,
        innerWidth,
        innerHeight,
        data,
        zoomDomain: zoomDomain as any,
        setZoomDomain,
        valueKeys
      } );
    }

    // Cleanup not strictly necessary as D3 handles event replacement, 
    // but good practice if we were adding global listeners.
    // The utilities attach listeners to elements that are re-created or selected.
  }, [ showZoomControls, innerWidth, innerHeight, xScale, yScale, setZoomDomain, data, labelKey, valueKeys, zoomDomain ] );

  // Render axes
  useEffect( () => {
    if ( !svgRef.current || !gRef.current ) return;

    const svg = d3.select( svgRef.current );
    const g = d3.select( gRef.current );

    // Ensure we have specific groups for axes and grid to avoid clearing children
    let axesGroup = g.select<SVGGElement>( '.axes-group' );
    if ( axesGroup.empty() ) {
      axesGroup = g.insert( 'g', ':first-child' ).attr( 'class', 'axes-group' );
    }

    // Clear previous axes/grid/legend from the axes group only
    axesGroup.selectAll( '*' ).remove();

    // --- Y Grid lines ---
    if ( yAxis.showGrid ) {
      const grid = g
        .insert( 'g', ':first-child' ) // Insert at beginning so it's behind data
        .attr( 'class', 'grid y-grid' )
        .attr( 'opacity', 0.5 );
      const gridAxis = d3
        .axisLeft( yScale )
        .tickSize( -innerWidth )
        .tickFormat( () => '' );

      if ( yAxis.tickCount === null || yAxis.tickCount === undefined ) {
        const autoTickCount = Math.max( 2, Math.floor( innerHeight / 50 ) );
        gridAxis.ticks( autoTickCount );
      } else {
        gridAxis.ticks( yAxis.tickCount );
      }

      // Animate grid
      grid.transition().duration( 300 ).call( gridAxis );

      grid
        .selectAll( 'line' )
        .attr( 'stroke', yAxis.gridColor )
        .attr( 'stroke-width', yAxis.gridWidth )
        .attr( 'stroke-dasharray', yAxis.gridStyle === 'dashed' ? '4,4' : yAxis.gridStyle === 'dotted' ? '1,4' : '0' );

      grid.select( '.domain' ).remove();
    }

    // --- Y Axis ---
    if ( yAxis.show && yAxis.position !== 'hidden' ) {
      const yAxisFunction = yAxis.position === 'left' ? d3.axisLeft( yScale ) : d3.axisRight( yScale );
      const axis = yAxisFunction
        .tickSize( yAxis.tickSize )
        .tickPadding( yAxis.tickPadding );

      if ( yAxis.tickCount === null || yAxis.tickCount === undefined ) {
        const autoTickCount = Math.max( 2, Math.floor( innerHeight / 50 ) );
        axis.ticks( autoTickCount );
      } else {
        axis.ticks( yAxis.tickCount );
      }

      // Apply tick format if provided
      if ( yAxis.tickFormat ) {
        try {
          axis.tickFormat( d3.format( yAxis.tickFormat ) as any );
        } catch ( e ) {
          console.warn( 'Invalid Y-axis tick format:', yAxis.tickFormat );
        }
      }

      const yAxisGroup = axesGroup.append( 'g' )
        .attr( 'class', 'axis y-axis' )
        .attr( 'transform', `translate(${ yAxis.position === 'left' ? 0 : innerWidth },0)` );

      // Animate axis
      yAxisGroup.transition().duration( 300 ).call( axis );

      yAxisGroup
        .style( 'font-size', `${ yAxis.labelSize }px` )
        .style( 'font-weight', yAxis.labelWeight )
        .style( 'color', yAxis.labelColor );

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
        axesGroup.append( 'text' )
          .attr( 'class', 'axis-title y-axis-title' )
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

    // --- X Axis ---
    if ( xAxisShow && xAxisPosition !== 'hidden' ) {
      // Determine axis function based on position
      const axisFunction = xAxisPosition === 'top' ? d3.axisTop( xScale ) : d3.axisBottom( xScale );
      const xAxis = axisFunction
        .tickSize( xAxisTickSize )
        .tickPadding( xAxisTickPadding );

      // Apply tick format if provided
      if ( xAxisTickFormat ) {
        // Check if scale is time scale (has invert and domain is dates)
        const isTimeScale = typeof xScale.invert === 'function' && xScale.domain()[ 0 ] instanceof Date;
        if ( isTimeScale ) {
          xAxis.tickFormat( d3.timeFormat( xAxisTickFormat ) as any );
        } else {
          // Try number format
          try {
            xAxis.tickFormat( d3.format( xAxisTickFormat ) as any );
          } catch ( e ) {
            // Ignore if not a number format
          }
        }
      }

      // Apply tick count
      if ( xAxisTickCount !== null && xAxisTickCount !== undefined ) {
        xAxis.ticks( xAxisTickCount );
      }

      // Calculate Y position based on axis position
      const yPosition = xAxisPosition === 'top' ? 0 : innerHeight;

      const xAxisGroup = axesGroup.append( 'g' )
        .attr( 'class', 'axis x-axis' )
        .attr( 'transform', `translate(0,${ yPosition })` );

      // Animate axis
      xAxisGroup.transition().duration( 300 ).call( xAxis );

      xAxisGroup
        .style( 'font-size', `${ xAxisLabelSize }px` )
        .style( 'font-weight', xAxisLabelWeight )
        .style( 'color', xAxisLabelColor );

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

        axesGroup.append( 'text' )
          .attr( 'class', 'axis-title x-axis-title' )
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

      // --- X Grid lines ---
      if ( xAxisShowGrid ) {
        const grid = axesGroup
          .insert( 'g', ':first-child' ) // Insert at beginning of axes group
          .attr( 'class', 'grid x-grid' )
          .attr( 'opacity', xAxisGridOpacity );

        const gridAxis = d3
          .axisBottom( xScale )
          .tickSize( innerHeight )
          .tickFormat( () => '' );

        if ( xAxisTickCount !== null && xAxisTickCount !== undefined ) {
          gridAxis.ticks( xAxisTickCount );
        }

        // Animate grid
        grid.transition().duration( 300 ).call( gridAxis );

        grid.selectAll( 'line' )
          .attr( 'stroke', xAxisGridColor )
          .attr( 'stroke-width', xAxisGridWidth )
          .attr( 'stroke-dasharray', xAxisGridDashArray );

        grid.select( '.domain' ).remove();
      }
    }

    // --- Legend ---
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

      const legend = axesGroup
        .append( 'g' )
        .attr( 'class', 'legend' )
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
  }, [
    width,
    height,
    chartMargin,
    innerWidth,
    innerHeight,
    xScale,
    yScale,
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
    xAxisTitleWeight,
    xAxisTitleColor,
    xAxisTitleSize,
    xAxisTitlePadding,
    xAxisTickPosition,
    xAxisLabelWeight,
    xAxisLabelColor,
    xAxisLabelSize,
    xAxisLabelSpacing,
    xAxisGridColor,
    xAxisGridWidth,
    xAxisGridOpacity,
    xAxisGridDashArray,
    yAxis,
  ] );

  // Generate unique ID for clip path
  const clipId = `chart-clip-${ Math.random().toString( 36 ).substr( 2, 9 ) }`;

  return (
    <div style={ { width: '100%', height: '100%', position: 'relative' } }>
      {/* Zoom Controls Overlay */ }
      <ChartZoomControls xScale={ xScale } yScale={ yScale } dataLength={ data?.length || 0 } isFloatingPreview={ isFloatingPreview } />

      <svg
        ref={ svgRef }
        viewBox={ `0 0 ${ width } ${ height }` }
        preserveAspectRatio="xMidYMid meet"
        style={ { width: '100%', height: '100%', display: 'block', overflow: 'visible' } }
      >
        <defs>
          <clipPath id={ clipId }>
            <rect width={ innerWidth } height={ innerHeight } x={ 0 } y={ 0 } />
          </clipPath>
        </defs>

        {/* Main group with transform */ }
        <g ref={ gRef } transform={ `translate(${ chartMargin.left },${ chartMargin.top })` }>
          {/* Chart content with clipping - only the data lines/areas are clipped */ }
          <g clipPath={ `url(#${ clipId })` }>
            { children }
          </g>

          {/* Axes group is rendered here by D3 in useEffect - NOT clipped */ }
        </g>

        {/* Brush overlay for zoom (only when enabled) */ }
        { showZoomControls && (
          <g
            ref={ brushRef }
            transform={ `translate(${ chartMargin.left },${ chartMargin.top })` }
            className='brush-overlay'
            style={ { pointerEvents: 'all' } }
          />
        ) }
      </svg>
    </div>
  );
}
