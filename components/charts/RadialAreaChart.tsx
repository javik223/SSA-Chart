'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { ChartTooltip } from './ChartTooltip';

import { TooltipContent } from './TooltipContent';
import { createScale } from '@/utils/chartScales';

interface RadialAreaChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorPalette?: string;
  innerRadiusRatio?: number; // Ratio of inner radius to outer radius (0-1)
  curve?: 'linear' | 'cardinal' | 'catmullRom' | 'natural';
}

import { TooltipProvider } from '@/components/providers/TooltipProvider';
import { useTooltipActions } from '@/hooks/useTooltip';

function RadialAreaChartInner( {
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  colors,
  colorPalette = 'default',
  innerRadiusRatio = 0.2,
  curve = 'linear',
}: RadialAreaChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const { showTooltip, hideTooltip, moveTooltip } = useTooltipActions();

  // Get chart specific settings from store
  const {
    curveType: storeCurveType,
    radialInnerRadius: storeInnerRadiusRatio,
    xAxisShow,
    xAxisShowLabel,
    xAxisShowGrid,
    xAxisLabelSize,
    xAxisLabelColor,
    xAxisGridColor,
    xAxisGridWidth,
    xAxisGridOpacity,
    yAxisShow,
    yAxisShowLabel,
    yAxisShowGrid,
    yAxisLabelSize,
    yAxisLabelColor,
    yAxisTickCount,
    yAxisGridColor,
    yAxisGridWidth,
    yAxisGridOpacity,
    yAxisScaleType,
    xAxisScaleType,
    radialGridInnerRadiusRatio,
  } = useChartStore( useShallow( ( state ) => ( {
    labelShow: state.labelShow,
    labelFontSize: state.labelFontSize,
    labelColor: state.labelColor,
    labelFontWeight: state.labelFontWeight,
    radialDomainColor: state.radialDomainColor,
    radialTickColor: state.radialTickColor,
    columnMapping: state.columnMapping,
    availableColumns: state.availableColumns,
    curveType: state.curveType,
    radialInnerRadius: state.radialInnerRadius,
    radialGridInnerRadiusRatio: state.radialGridInnerRadiusRatio,
    xAxisShow: state.xAxisShow,
    xAxisShowLabel: state.xAxisShowLabel,
    xAxisShowGrid: state.xAxisShowGrid,
    xAxisShowDomain: state.xAxisShowDomain,
    xAxisLabelSize: state.xAxisLabelSize,
    xAxisLabelColor: state.xAxisLabelColor,
    xAxisLabelWeight: state.xAxisLabelWeight,
    xAxisGridColor: state.xAxisGridColor,
    xAxisGridWidth: state.xAxisGridWidth,
    xAxisGridOpacity: state.xAxisGridOpacity,
    yAxisShow: state.yAxisShow,
    yAxisShowLabel: state.yAxisShowLabel,
    yAxisShowGrid: state.yAxisShowGrid,
    yAxisShowDomain: state.yAxisShowDomain,
    yAxisLabelSize: state.yAxisLabelSize,
    yAxisLabelColor: state.yAxisLabelColor,
    yAxisTickCount: state.yAxisTickCount,
    yAxisGridColor: state.yAxisGridColor,
    yAxisGridWidth: state.yAxisGridWidth,
    yAxisGridOpacity: state.yAxisGridOpacity,
    yAxisScaleType: state.yAxisScaleType,
    xAxisScaleType: state.xAxisScaleType,
    legendShow: state.legendShow,
    legendPosition: state.legendPosition,
    legendAlignment: state.legendAlignment,
    legendFontSize: state.legendFontSize,
    legendGap: state.legendGap,
    legendPaddingTop: state.legendPaddingTop,
    legendPaddingRight: state.legendPaddingRight,
    legendPaddingBottom: state.legendPaddingBottom,
    legendPaddingLeft: state.legendPaddingLeft,
  } ) ) );

  // Use store values if available
  const effectiveCurve = storeCurveType || curve;
  const effectiveInnerRadiusRatio = storeInnerRadiusRatio !== undefined ? storeInnerRadiusRatio : innerRadiusRatio;

  // Color scale
  const colorScale = useMemo( () => {
    const paletteObj = getColorPalette( colorPalette );
    const palette = colors || paletteObj.colors;
    return d3.scaleOrdinal<string>( palette ).domain( valueKeys );
  }, [ colors, colorPalette, valueKeys ] );

  useEffect( () => {
    if ( !svgRef.current || !data || data.length === 0 || !valueKeys || valueKeys.length === 0 ) return;

    // --- Verbatim Example Implementation (Adapted for React & Data) ---

    // 1. Setup Dimensions
    const width = propWidth;
    const height = propHeight; // Use prop height
    const margin = 10;
    // Ensure innerRadiusRatio is between 0 and 1
    const safeInnerRadiusRatio = Math.min( Math.max( effectiveInnerRadiusRatio, 0 ), 0.9 );
    const innerRadius = ( width / 2 - margin ) * safeInnerRadiusRatio;
    const outerRadius = width / 2 - margin;

    // 2. Setup Scales

    // X Scale (Angle) - using scaleType setting
    // For radial charts, we need time scale for date-based data
    const xDomain = data.map( d => d[ labelKey ] );

    // Detect if we have date data
    const firstValue = xDomain[ 0 ];
    const isDateData = xDomain.length > 0 &&
      typeof firstValue === 'string' &&
      !isNaN( new Date( firstValue ).getTime() );

    // Force time scale for date data, as log/linear don't work with dates for angles
    const effectiveXScaleType = isDateData ? 'time' : ( xAxisScaleType || 'linear' );

    const xScaleBase = createScale(
      effectiveXScaleType,
      {
        domain: xDomain,
        range: [ 0, 2 * Math.PI ],
        nice: true
      }
    );

    // Helper function to get angle from data point
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getAngle = ( d: any ): number => {
      const value = d[ labelKey ];
      if ( effectiveXScaleType === 'time' ) {
        const date = new Date( value as string | number | Date );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return ( xScaleBase as any )( date ) ?? 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ( xScaleBase as any )( value ) ?? 0;
    };

    // Y Scale (Radius) - using scaleType setting
    // Find max value across all value keys
    // Y Scale (Radius)
    const allValues = data.flatMap( d => valueKeys.map( k => Number( d[ k ] ) || 0 ) );
    const minValue = d3.min( allValues ) || 0;
    const maxValue = d3.max( allValues ) || 0;

    const y = d3.scaleLinear()
      .domain( [ minValue, maxValue ] )
      .range( [ innerRadius, outerRadius ] );

    // 3. Generators
    // Map curve type to D3 curve function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const curveMap: Record<string, any> = {
      linear: d3.curveLinearClosed,
      cardinal: d3.curveCardinalClosed,
      catmullRom: d3.curveCatmullRomClosed,
      natural: d3.curveNatural,
    };
    const curveFunction = curveMap[ effectiveCurve ] || d3.curveLinearClosed;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const line = d3.lineRadial<any>()
      .curve( curveFunction )
      .angle( getAngle );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const area = d3.areaRadial<any>()
      .curve( curveFunction )
      .angle( getAngle );

    // 4. SVG Creation
    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    svg
      .attr( "viewBox", `${ -width / 2 } ${ -height / 2 } ${ width } ${ height }` )
      .attr( "style", "width: 100%; height: auto; font: 10px sans-serif;" )
      .attr( "stroke-linejoin", "round" )
      .attr( "stroke-linecap", "round" );

    // 5. Draw Data
    // Check for specific range keys to draw bands (min-max, minmin-maxmax)
    console.log( 'valueKeys:', valueKeys );
    if ( data.length > 0 ) console.log( 'First data point:', data[ 0 ] );
    const hasMinMax = valueKeys.includes( 'min' ) && valueKeys.includes( 'max' );
    const hasMinMinMaxMax = valueKeys.includes( 'minmin' ) && valueKeys.includes( 'maxmax' );

    if ( hasMinMax || hasMinMinMaxMax ) {
      // Special rendering for ranges

      // 1. Draw minmin-maxmax band (lightest)
      if ( hasMinMinMaxMax ) {
        const areaPath = area
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .innerRadius( ( d: any ) => y( Number( d[ 'minmin' ] ) || 0 ) )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .outerRadius( ( d: any ) => y( Number( d[ 'maxmax' ] ) || 0 ) )
          ( data );

        svg.append( "path" )
          .attr( "fill", colorScale( 'maxmax' ) )
          .attr( "fill-opacity", 0.2 )
          .attr( "d", areaPath );
      }

      // 2. Draw min-max band (darker)
      if ( hasMinMax ) {
        const areaPath = area
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .innerRadius( ( d: any ) => y( Number( d[ 'min' ] ) || 0 ) )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .outerRadius( ( d: any ) => y( Number( d[ 'max' ] ) || 0 ) )
          ( data );

        svg.append( "path" )
          .attr( "fill", colorScale( 'max' ) )
          .attr( "fill-opacity", 0.3 )
          .attr( "d", areaPath );
      }

      // 3. Draw avg line (if exists)
      if ( valueKeys.includes( 'avg' ) ) {
        const linePath = line
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .radius( ( d: any ) => y( Number( d[ 'avg' ] ) || 0 ) )
          ( data );

        svg.append( "path" )
          .attr( "fill", "none" )
          .attr( "stroke", colorScale( 'avg' ) )
          .attr( "stroke-width", 2 )
          .attr( "d", linePath );
      }
    } else {
      // Default rendering for other data
      valueKeys.forEach( ( valueKey ) => {
        // Area for this series
        const areaPath = area
          .innerRadius( innerRadius )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .outerRadius( ( d: any ) => y( Number( d[ valueKey ] ) || 0 ) )
          ( data );

        svg.append( "path" )
          .attr( "fill", colorScale( valueKey ) )
          .attr( "fill-opacity", 0.1 )
          .attr( "d", areaPath );

        // Line for this series
        const linePath = line
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .radius( ( d: any ) => y( Number( d[ valueKey ] ) || 0 ) )
          ( data );

        svg.append( "path" )
          .attr( "fill", "none" )
          .attr( "stroke", colorScale( valueKey ) )
          .attr( "stroke-width", 2 )
          .attr( "d", linePath );
      } );
    }

    // 6. Ticks & Grid - Radial lines and month labels
    if ( xAxisShow && xAxisShowGrid ) {
      // Create 12 evenly spaced grid lines around the circle
      const gridAngles = d3.range( 12 ).map( i => ( i * 2 * Math.PI ) / 12 );

      // Extend grid lines inwards to the labels (match reference)
      const gridInnerRadius = innerRadius * ( radialGridInnerRadiusRatio ?? 0.96 );

      svg.append( "g" )
        .selectAll( "line" )
        .data( gridAngles )
        .join( "line" )
        .attr( "stroke", xAxisGridColor || "#000" )
        .attr( "stroke-opacity", xAxisGridOpacity ?? 0.2 )
        .attr( "stroke-width", xAxisGridWidth ?? 1 )
        .attr( "x1", d => d3.pointRadial( d, gridInnerRadius )[ 0 ] )
        .attr( "y1", d => d3.pointRadial( d, gridInnerRadius )[ 1 ] )
        .attr( "x2", d => d3.pointRadial( d, outerRadius )[ 0 ] )
        .attr( "y2", d => d3.pointRadial( d, outerRadius )[ 1 ] );
    }

    // Add month labels using textPath for curved text
    if ( xAxisShow && xAxisShowLabel && effectiveXScaleType === 'time' && data.length > 0 ) {
      // Get the date range
      const dates = data.map( d => new Date( d[ labelKey ] as string | number | Date ) );
      const [ minDate, maxDate ] = d3.extent( dates ) as [ Date, Date ];

      // Generate 12 month labels
      const monthLabels = d3.timeMonth.range( minDate, d3.timeMonth.offset( maxDate, 1 ), 1 ).slice( 0, 12 );

      // Create a unique ID prefix for this chart instance
      const chartId = `radial-${ Math.random().toString( 36 ).substr( 2, 9 ) }`;

      const labelGroup = svg.append( "g" );

      monthLabels.forEach( ( d, i ) => {
        const nextMonth = d3.timeMonth.offset( d, 1 );
        const startAngle = ( ( xScaleBase as any )( d ) as number ) ?? 0;
        const endAngle = ( ( xScaleBase as any )( nextMonth ) as number ) ?? 0;

        // Path for text to follow
        const pathId = `${ chartId }-month-${ i }`;
        const radius = innerRadius * ( radialGridInnerRadiusRatio ?? 0.96 ); // Radius for the text path

        // Draw the arc path (invisible)
        labelGroup.append( "path" )
          .attr( "id", pathId )
          .attr( "fill", "none" )
          .attr( "d", `
            M${ d3.pointRadial( startAngle, radius ) }
            A${ radius },${ radius } 0,0,1 ${ d3.pointRadial( endAngle, radius ) }
          `);

        // Add text linked to the path
        labelGroup.append( "text" )
          .append( "textPath" )
          .attr( "xlink:href", `#${ pathId }` )
          .attr( "startOffset", "10%" ) // Center text in the arc segment
          .attr( "text-anchor", "left" )
          .style( "font-size", `${ xAxisLabelSize || 10 }px` )
          .style( "fill", xAxisLabelColor || "currentColor" )
          .text( d3.utcFormat( "%B" )( d ) );
      } );
    }

    // 7. Y Axis (Concentric Circles)
    if ( yAxisShow ) {
      const yTicks = y.ticks( yAxisTickCount || 5 ).reverse();

      const yAxisGroup = svg.append( "g" )
        .selectAll( "g" )
        .data( yTicks )
        .join( "g" );

      // Concentric circles (grid)
      if ( yAxisShowGrid ) {
        yAxisGroup.call( g => g.append( "circle" )
          .attr( "fill", "none" )
          .attr( "stroke", yAxisGridColor || "currentColor" )
          .attr( "stroke-opacity", yAxisGridOpacity ?? 0.2 )
          .attr( "stroke-width", yAxisGridWidth ?? 1 )
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr( "r", y as any ) );
      }

      // Value labels
      if ( yAxisShowLabel ) {
        yAxisGroup.call( g => {
          // Add labels at 4 cardinal directions: top, right, bottom, left
          const angles = [
            { angle: -Math.PI / 2, anchor: "middle", dx: "0.5em" },  // top - offset to avoid line
            { angle: 0, anchor: "start", dx: "0" },                  // right
            { angle: Math.PI / 2, anchor: "middle", dx: "0.5em" },   // bottom - offset to avoid line
            { angle: Math.PI, anchor: "end", dx: "0" }               // left
          ];

          angles.forEach( ( { angle, anchor, dx } ) => {
            g.append( "text" )
              .attr( "text-anchor", anchor )
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .attr( "x", ( d: any ) => d3.pointRadial( angle, y( d ) )[ 0 ] )
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .attr( "y", ( d: any ) => d3.pointRadial( angle, y( d ) )[ 1 ] )
              .attr( "dx", dx )
              .attr( "dy", angle === -Math.PI / 2 ? "-0.5em" : angle === Math.PI / 2 ? "1em" : "0.35em" )
              .attr( "stroke", "#fff" )
              .attr( "stroke-width", 3 )
              .attr( "fill", yAxisLabelColor || "currentColor" )
              .attr( "paint-order", "stroke" )
              .style( "font-size", `${ yAxisLabelSize || 10 }px` )
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .text( ( d, i ) => `${ d.toLocaleString() }` );
          } );
        } );
      }
    }


    // 8. Tooltip Interaction Layer
    if ( data.length > 0 ) {
      const sliceAngle = ( 2 * Math.PI ) / data.length;

      const tooltipArc = d3.arc<any>()
        .innerRadius( innerRadius )
        .outerRadius( outerRadius )
        .startAngle( d => ( ( xScaleBase( d[ labelKey ] ) as number ) ?? 0 ) - sliceAngle / 2 )
        .endAngle( d => ( ( xScaleBase( d[ labelKey ] ) as number ) ?? 0 ) + sliceAngle / 2 );

      svg.append( "g" )
        .selectAll( "path" )
        .data( data )
        .join( "path" )
        .attr( "d", tooltipArc )
        .attr( "fill", "transparent" )
        .style( "cursor", "crosshair" )
        .on( "mouseenter", ( event, d ) => {
          const content = (
            <TooltipContent
              data={ d }
              labelKey={ labelKey }
              valueKeys={ valueKeys }
              colorScale={ colorScale as any }
            />
          );

          // Calculate position of the data point (snap to point)
          // Use avg if available, otherwise first key
          const valKey = valueKeys.includes( 'avg' ) ? 'avg' : valueKeys[ 0 ];
          const val = Number( d[ valKey ] ) || 0;

          const angle = ( ( ( xScaleBase as any )( d[ labelKey ] ) as number ) ?? 0 );
          const radius = y( val );
          const [ cx, cy ] = d3.pointRadial( angle, radius );

          // Get SVG position and scale to map chart coordinates to page coordinates
          const svgRect = svgRef.current?.getBoundingClientRect();
          if ( svgRect ) {
            const scaleX = svgRect.width / propWidth;
            const scaleY = svgRect.height / propHeight;

            // SVG center in page coordinates (viewBox is centered at 0,0)
            const centerX = svgRect.left + window.scrollX + svgRect.width / 2;
            const centerY = svgRect.top + window.scrollY + svgRect.height / 2;

            const pageX = centerX + cx * scaleX;
            const pageY = centerY + cy * scaleY;

            showTooltip( content, pageX, pageY );
          }
        } )
        .on( "mouseleave", () => {
          hideTooltip();
        } );
    }

  }, [
    data,
    labelKey,
    valueKeys,
    propWidth,
    propHeight,
    colorScale,
    effectiveCurve,
    effectiveInnerRadiusRatio,
    xAxisScaleType,
    yAxisScaleType,
    xAxisShow,
    xAxisShowGrid,
    xAxisShowLabel,
    xAxisLabelSize,
    xAxisLabelColor,
    xAxisGridColor,
    xAxisGridWidth,
    xAxisGridOpacity,
    yAxisShow,
    yAxisShowGrid,
    yAxisShowLabel,
    yAxisLabelSize,
    yAxisLabelColor,
    yAxisTickCount,
    yAxisGridColor,
    yAxisGridWidth,
    yAxisGridOpacity,
    radialGridInnerRadiusRatio,
    showTooltip,
    hideTooltip,
    moveTooltip,
  ] );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={ svgRef }
        viewBox={ `0 0 ${ propWidth } ${ propHeight }` }
        style={ { maxWidth: '100%', maxHeight: '100%' } }
      />
      <ChartTooltip />
    </div>
  );
}

export function RadialAreaChart( props: RadialAreaChartProps ) {
  return (
    <TooltipProvider>
      <RadialAreaChartInner { ...props } />
    </TooltipProvider>
  );
}
