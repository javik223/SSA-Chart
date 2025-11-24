'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';

interface CircularBarPlotChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorPalette?: string;
  colorMode?: 'by-column' | 'by-row';

  // Label controls
  labelShow?: boolean;
  labelFontSize?: number;
  labelColor?: string;
  labelFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

export function CircularBarPlotChart( {
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  colors,
  colorPalette = 'default',
  colorMode = 'by-column',
  labelShow = true,
  labelFontSize = 11,
  labelColor = '#000000',
  labelFontWeight = 'normal',
}: CircularBarPlotChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );

  useEffect( () => {
    if ( !svgRef.current || !data || data.length === 0 ) return;

    const width = propWidth;
    const height = propHeight;
    const margin = { top: 100, right: 100, bottom: 100, left: 100 };
    const innerRadius = Math.min( width, height ) / 6;
    const outerRadius = Math.min( width, height ) / 2 - Math.max( margin.top, margin.right, margin.bottom, margin.left );

    // Clear previous
    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    svg
      .attr( 'width', width )
      .attr( 'height', height )
      .attr( 'viewBox', `0 0 ${ width } ${ height }` )
      .style( 'font', `${ labelFontWeight } ${ labelFontSize }px sans-serif` );

    const g = svg.append( 'g' )
      .attr( 'transform', `translate(${ width / 2 },${ height / 2 })` );

    // Get colors
    const palette = colors || getColorPalette( colorPalette ).colors;
    const colorScale = d3.scaleOrdinal<string>()
      .domain( valueKeys )
      .range( palette );

    // X scale: angular position
    const x = d3.scaleBand()
      .range( [ 0, 2 * Math.PI ] )
      .align( 0 )
      .domain( data.map( d => String( d[ labelKey ] ) ) );

    // Y scale: radial position
    const maxValue = d3.max( data, d => {
      return d3.max( valueKeys, key => Number( d[ key ] ) || 0 ) || 0;
    } ) || 100;

    const y = d3.scaleRadial()
      .range( [ innerRadius, outerRadius ] )
      .domain( [ 0, maxValue * 1.1 ] ); // Add 10% padding

    // Create arc generator
    const arc = d3.arc<any>()
      .innerRadius( innerRadius )
      .outerRadius( ( d: any ) => y( d.value ) )
      .startAngle( ( d: any ) => d.startAngle )
      .endAngle( ( d: any ) => d.endAngle )
      .padAngle( 0.01 )
      .padRadius( innerRadius );

    // Prepare data for each series
    valueKeys.forEach( ( valueKey, seriesIndex ) => {
      const barsData = data.map( d => ( {
        label: String( d[ labelKey ] ),
        value: Number( d[ valueKey ] ) || 0,
        startAngle: x( String( d[ labelKey ] ) ) || 0,
        endAngle: ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth(),
        color: colorMode === 'by-column'
          ? colorScale( valueKey )
          : palette[ data.indexOf( d ) % palette.length ],
      } ) );

      // Draw bars
      g.append( 'g' )
        .selectAll( 'path' )
        .data( barsData )
        .join( 'path' )
        .attr( 'fill', d => d.color )
        .attr( 'd', arc as any )
        .style( 'opacity', 0.8 )
        .on( 'mouseover', function () {
          d3.select( this ).style( 'opacity', 1 );
        } )
        .on( 'mouseout', function () {
          d3.select( this ).style( 'opacity', 0.8 );
        } )
        .append( 'title' )
        .text( d => `${ d.label }: ${ d.value.toLocaleString() }` );
    } );

    // Add labels if enabled
    if ( labelShow ) {
      const labelsData = data.map( d => ( {
        label: String( d[ labelKey ] ),
        value: d3.max( valueKeys, key => Number( d[ key ] ) || 0 ) || 0,
        angle: ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth() / 2,
      } ) );

      g.append( 'g' )
        .selectAll( 'g' )
        .data( labelsData )
        .join( 'g' )
        .attr( 'text-anchor', d => {
          const angle = ( d.angle + Math.PI ) % ( 2 * Math.PI );
          return angle < Math.PI ? 'end' : 'start';
        } )
        .attr( 'transform', d => {
          const angle = d.angle * 180 / Math.PI - 90;
          const radius = y( d.value ) + 10;
          return `rotate(${ angle }) translate(${ radius },0)`;
        } )
        .append( 'text' )
        .text( d => d.label )
        .attr( 'transform', d => {
          const angle = ( d.angle + Math.PI ) % ( 2 * Math.PI );
          return angle < Math.PI ? 'rotate(180)' : 'rotate(0)';
        } )
        .attr( 'fill', labelColor )
        .attr( 'alignment-baseline', 'middle' );
    }

  }, [ data, labelKey, valueKeys, propWidth, propHeight, colors, colorPalette, colorMode, labelShow, labelFontSize, labelColor, labelFontWeight ] );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={ svgRef }
        style={ { maxWidth: '100%', maxHeight: '100%' } }
      />
    </div>
  );
}
