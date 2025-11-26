'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';

interface RadialStackedBarChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorPalette?: string;
  legendShow?: boolean;
}

export function RadialStackedBarChart( {
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  colors,
  colorPalette = 'default',
  legendShow = true,
}: RadialStackedBarChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const { tooltipState, showTooltip, hideTooltip } = useChartTooltip();

  // Get chart specific settings from store
  const {
    legendShow: storeLegendShow,
    labelShow,
    labelFontSize,
    labelColor,
    labelFontWeight,
    radialInnerRadius,
    radialStartAngle,
    radialEndAngle,
    radialPadAngle,
    radialCornerRadius,
    legendPosition,
    legendFontSize,
    legendGap,
    radialDomainColor,
    radialTickColor,
  } = useChartStore( useShallow( ( state ) => ( {
    legendShow: state.legendShow,
    labelShow: state.labelShow,
    labelFontSize: state.labelFontSize,
    labelColor: state.labelColor,
    labelFontWeight: state.labelFontWeight,
    radialInnerRadius: state.radialInnerRadius,
    radialStartAngle: state.radialStartAngle,
    radialEndAngle: state.radialEndAngle,
    radialPadAngle: state.radialPadAngle,
    radialCornerRadius: state.radialCornerRadius,
    legendPosition: state.legendPosition,
    legendFontSize: state.legendFontSize,
    legendGap: state.legendGap,
    radialDomainColor: state.radialDomainColor,
    radialTickColor: state.radialTickColor,
  } ) ) );

  // Use store value if available, otherwise fallback to prop (though prop is likely false from BasicChart)
  // Actually, we want to prioritize the store value for global settings
  const showLegend = storeLegendShow ?? legendShow;

  useEffect( () => {
    console.log( '[RadialStackedBarChart] valueKeys:', valueKeys );
    if ( !svgRef.current || !data || data.length === 0 ) return;

    const width = propWidth;
    const height = propHeight;
    const innerRadius = radialInnerRadius;
    const outerRadius = Math.min( width, height ) / 2 - 40;

    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    svg
      .attr( 'width', width )
      .attr( 'height', height )
      .attr( 'viewBox', `${ -width / 2 } ${ -height / 2 } ${ width } ${ height }` )
      .style( 'font', `${ labelFontWeight } ${ labelFontSize }px sans-serif` );

    // Prepare data for stacking
    const stack = d3.stack()
      .keys( valueKeys )
      .value( ( d: any, key ) => Number( d[ key ] ) || 0 );

    const stackedData = stack( data as any );

    // Convert degrees to radians
    const startAngleRad = ( radialStartAngle * Math.PI ) / 180;
    const endAngleRad = ( radialEndAngle * Math.PI ) / 180;

    // Scales
    const x = d3.scaleBand()
      .domain( data.map( d => String( d[ labelKey ] ) ) )
      .range( [ startAngleRad, endAngleRad ] )
      .align( 0 );

    // Y scale: We need to find the maximum total value for the domain
    const maxVal = d3.max( stackedData, layer => d3.max( layer, d => d[ 1 ] ) ) || 0;

    const y = d3.scaleLinear() // Using linear for radius as standard approximation
      .domain( [ 0, maxVal ] )
      .range( [ innerRadius, outerRadius ] );

    const palette = colors || getColorPalette( colorPalette ).colors;
    const color = d3.scaleOrdinal<string>()
      .domain( valueKeys )
      .range( palette );

    const arc = d3.arc<any>()
      .innerRadius( d => y( d[ 0 ] ) )
      .outerRadius( d => y( d[ 1 ] ) )
      .startAngle( d => x( String( d.data[ labelKey ] ) ) || 0 )
      .endAngle( d => ( x( String( d.data[ labelKey ] ) ) || 0 ) + x.bandwidth() )
      .padAngle( radialPadAngle )
      .padRadius( innerRadius )
      .cornerRadius( radialCornerRadius );

    // Draw bars
    svg.append( 'g' )
      .selectAll( 'g' )
      .data( stackedData )
      .join( 'g' )
      .attr( 'fill', d => color( d.key ) )
      .selectAll( 'path' )
      .data( d => d )
      .join( 'path' )
      .attr( 'd', arc as any )
      .on( 'mouseenter', ( event, d: any ) => {
        d3.select( event.currentTarget ).style( 'opacity', 0.8 );
        const [ x, y ] = d3.pointer( event, svg.node() );

        // Calculate value
        const value = d[ 1 ] - d[ 0 ];

        showTooltip(
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-xs">{ d.data[ labelKey ] }</div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={ { backgroundColor: color( d.key ) } }
              />
              <span className="text-muted-foreground">{ d.key }:</span>
              <span className="font-medium">
                { value.toLocaleString() }
              </span>
            </div>
          </div>,
          x + width / 2, // Adjust for centered coordinate system
          y + height / 2
        );
      } )
      .on( 'mousemove', ( event ) => {
        const [ x, y ] = d3.pointer( event, svg.node() );
        showTooltip( tooltipState.content, x + width / 2, y + height / 2 );
      } )
      .on( 'mouseleave', ( event ) => {
        d3.select( event.currentTarget ).style( 'opacity', 1 );
        hideTooltip();
      } );

    // X Axis (Labels)
    if ( labelShow ) {
      svg.append( 'g' )
        .attr( 'text-anchor', 'middle' )
        .selectAll( 'g' )
        .data( data )
        .join( 'g' )
        .attr( 'transform', d => `
          rotate(${ ( ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth() / 2 ) * 180 / Math.PI - 90 })
          translate(${ innerRadius },0)
        `)
        .call( g => g.append( 'line' )
          .attr( 'x2', -5 )
          .attr( 'stroke', '#000' ) )
        .call( g => g.append( 'text' )
          .attr( 'transform', d => ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth() / 2 + Math.PI / 2 % ( 2 * Math.PI ) < Math.PI
            ? 'rotate(90)translate(0,16)'
            : 'rotate(-90)translate(0,-9)' )
          .text( d => String( d[ labelKey ] ) )
          .attr( 'fill', labelColor )
          .style( 'font-size', `${ labelFontSize }px` )
          .style( 'font-weight', labelFontWeight ) );
    }

    // Y Axis (Radial circles)
    const yAxis = ( g: any ) => g
      .attr( 'text-anchor', 'middle' )
      .call( ( g: any ) => g.append( 'text' )
        .attr( 'y', -innerRadius )
        .attr( 'dy', '-1em' )
        .text( 'Value' ) // Could be prop
        .style( 'fill', 'currentColor' ) )
      .call( ( g: any ) => g.selectAll( 'g' )
        .data( y.ticks( 5 ).slice( 1 ) )
        .join( 'g' )
        .attr( 'fill', 'none' )
        .call( ( g: any ) => g.append( 'circle' )
          .attr( 'stroke', radialDomainColor )
          .attr( 'stroke-opacity', 0.2 )
          .attr( 'r', y ) )
        .call( ( g: any ) => g.append( 'text' )
          .attr( 'y', ( d: number ) => -y( d ) )
          .attr( 'dy', '0.35em' )
          .attr( 'stroke', '#fff' )
          .attr( 'stroke-width', 5 )
          .text( y.tickFormat( 5, 's' ) )
          .clone( true )
          .attr( 'fill', radialTickColor )
          .attr( 'stroke', 'none' ) ) );

    svg.append( 'g' )
      .call( yAxis );

    // Legend
    if ( showLegend ) {
      // Calculate effective font size (base 14px * multiplier)
      const baseFontSize = 14;
      const effectiveFontSize = legendFontSize * baseFontSize;

      let legendX = 0;
      let legendY = 0;
      let textAnchor = 'start';

      console.log( '[RadialStackedBarChart] Legend Debug:', {
        showLegend,
        legendPosition,
        valueKeys,
        effectiveFontSize,
        legendGap
      } );

      if ( legendPosition === 'center' ) {
        // Center logic:
        const totalHeight = valueKeys.length * ( effectiveFontSize + legendGap );
        legendY = -totalHeight / 2 + effectiveFontSize / 2; // Start Y (centered)
        legendX = 0; // We will center items individually

        const legend = svg.append( 'g' )
          .attr( 'transform', `translate(${ legendX }, ${ legendY })` )
          .attr( 'text-anchor', textAnchor )
          .style( 'font-size', `${ effectiveFontSize }px` );

        const legendItems = legend.selectAll( 'g' )
          .data( valueKeys.slice().reverse() )
          .join( 'g' )
          .attr( 'transform', ( d, i ) => `translate(0,${ i * ( effectiveFontSize + legendGap ) })` );

        legendItems.append( 'rect' )
          .attr( 'width', effectiveFontSize )
          .attr( 'height', effectiveFontSize )
          .attr( 'fill', d => color( d ) );

        legendItems.append( 'text' )
          .attr( 'x', effectiveFontSize + 5 )
          .attr( 'y', effectiveFontSize / 2 )
          .attr( 'dy', '0.35em' )
          .text( d => d );

        // Center items
        legendItems.each( function () {
          const g = d3.select( this );
          const text = g.select( 'text' );
          const textNode = text.node() as SVGTextElement;
          const textWidth = textNode.getComputedTextLength();
          const totalWidth = effectiveFontSize + 5 + textWidth;

          // Get current transform to preserve Y
          const currentTransform = g.attr( 'transform' );
          const yMatch = /translate\([^,]+,\s*([^)]+)\)/.exec( currentTransform );
          const y = yMatch ? yMatch[ 1 ] : '0';

          g.attr( 'transform', `translate(${ -totalWidth / 2 }, ${ y })` );
        } );
      }
    }

  }, [
    data, labelKey, valueKeys, propWidth, propHeight, colors, colorPalette,
    showLegend, labelShow, labelFontSize, labelColor, labelFontWeight,
    radialInnerRadius, radialStartAngle, radialEndAngle, radialPadAngle, radialCornerRadius,
    legendPosition, legendFontSize, legendGap, radialDomainColor, radialTickColor,
    showTooltip, hideTooltip, tooltipState.content
  ] );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg ref={ svgRef } style={ { maxWidth: '100%', maxHeight: '100%' } } />
      <ChartTooltip
        visible={ tooltipState.visible }
        x={ tooltipState.x }
        y={ tooltipState.y }
        content={ tooltipState.content }
      />
    </div>
  );
}
