'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';

interface RadialBarChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorPalette?: string;
  labelShow?: boolean;
  labelFontSize?: number;
  labelColor?: string;
  labelFontWeight?: string;
}

export function RadialBarChart( {
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  colors,
  colorPalette = 'default',
  labelShow = true,
  labelFontSize = 11,
  labelColor = '#000000',
  labelFontWeight = 'normal',
}: RadialBarChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );

  useEffect( () => {
    if ( !svgRef.current || !data || data.length === 0 ) return;

    const width = propWidth;
    const height = propHeight;
    const innerRadius = Math.min( width, height ) / 8;
    const outerRadius = Math.min( width, height ) / 2 - 40;

    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    svg
      .attr( 'width', width )
      .attr( 'height', height )
      .style( 'font', `${ labelFontWeight } ${ labelFontSize }px sans-serif` );

    const g = svg.append( 'g' )
      .attr( 'transform', `translate(${ width / 2 },${ height / 2 })` );

    const palette = colors || getColorPalette( colorPalette ).colors;
    const colorScale = d3.scaleOrdinal<string>()
      .domain( valueKeys )
      .range( palette );

    // X scale (angular)
    const x = d3.scaleBand()
      .range( [ 0, 2 * Math.PI ] )
      .align( 0 )
      .domain( data.map( d => String( d[ labelKey ] ) ) );

    // Y scale (radial) - stacked
    const maxTotal = d3.max( data, d => {
      return d3.sum( valueKeys, key => Number( d[ key ] ) || 0 );
    } ) || 100;

    const y = d3.scaleLinear()
      .range( [ innerRadius, outerRadius ] )
      .domain( [ 0, maxTotal ] );

    // Create stacked data
    valueKeys.forEach( ( valueKey, index ) => {
      const stackedData = data.map( d => {
        const previousSum = d3.sum( valueKeys.slice( 0, index ), key => Number( d[ key ] ) || 0 );
        const currentValue = Number( d[ valueKey ] ) || 0;
        return {
          label: String( d[ labelKey ] ),
          value: currentValue,
          innerRadius: y( previousSum ),
          outerRadius: y( previousSum + currentValue ),
          startAngle: x( String( d[ labelKey ] ) ) || 0,
          endAngle: ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth(),
        };
      } );

      const arc = d3.arc<any>()
        .innerRadius( d => d.innerRadius )
        .outerRadius( d => d.outerRadius )
        .startAngle( d => d.startAngle )
        .endAngle( d => d.endAngle )
        .padAngle( 0.01 )
        .padRadius( innerRadius );

      g.append( 'g' )
        .selectAll( 'path' )
        .data( stackedData )
        .join( 'path' )
        .attr( 'fill', colorScale( valueKey ) )
        .attr( 'd', arc as any )
        .style( 'opacity', 0.8 )
        .on( 'mouseover', function () {
          d3.select( this ).style( 'opacity', 1 );
        } )
        .on( 'mouseout', function () {
          d3.select( this ).style( 'opacity', 0.8 );
        } )
        .append( 'title' )
        .text( d => `${ d.label } - ${ valueKey }: ${ d.value.toLocaleString() }` );
    } );

    // Add labels
    if ( labelShow ) {
      g.append( 'g' )
        .selectAll( 'g' )
        .data( data )
        .join( 'g' )
        .attr( 'text-anchor', d => {
          const angle = ( ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth() / 2 + Math.PI ) % ( 2 * Math.PI );
          return angle < Math.PI ? 'end' : 'start';
        } )
        .attr( 'transform', d => {
          const angle = ( ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth() / 2 ) * 180 / Math.PI - 90;
          const total = d3.sum( valueKeys, key => Number( d[ key ] ) || 0 );
          return `rotate(${ angle }) translate(${ y( total ) + 10 },0)`;
        } )
        .append( 'text' )
        .text( d => String( d[ labelKey ] ) )
        .attr( 'transform', d => {
          const angle = ( ( x( String( d[ labelKey ] ) ) || 0 ) + x.bandwidth() / 2 + Math.PI ) % ( 2 * Math.PI );
          return angle < Math.PI ? 'rotate(180)' : 'rotate(0)';
        } )
        .attr( 'fill', labelColor )
        .attr( 'alignment-baseline', 'middle' );
    }

  }, [ data, labelKey, valueKeys, propWidth, propHeight, colors, colorPalette, labelShow, labelFontSize, labelColor, labelFontWeight ] );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg ref={ svgRef } style={ { maxWidth: '100%', maxHeight: '100%' } } />
    </div>
  );
}
