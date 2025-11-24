'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';

interface PolarAreaChartProps {
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

export function PolarAreaChart( {
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
}: PolarAreaChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );

  useEffect( () => {
    if ( !svgRef.current || !data || data.length === 0 ) return;

    const width = propWidth;
    const height = propHeight;
    const radius = Math.min( width, height ) / 2 - 40;

    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    svg
      .attr( 'width', width )
      .attr( 'height', height )
      .style( 'font', `${ labelFontWeight } ${ labelFontSize }px sans-serif` );

    const g = svg.append( 'g' )
      .attr( 'transform', `translate(${ width / 2 },${ height / 2 })` );

    const palette = colors || getColorPalette( colorPalette ).colors;

    // Use first value key for polar area
    const valueKey = valueKeys[ 0 ];

    // Prepare data
    const polarData = data.map( ( d, i ) => ( {
      label: String( d[ labelKey ] ),
      value: Number( d[ valueKey ] ) || 0,
      color: palette[ i % palette.length ],
    } ) );

    const maxValue = d3.max( polarData, d => d.value ) || 100;

    // Radial scale
    const radiusScale = d3.scaleSqrt()
      .domain( [ 0, maxValue ] )
      .range( [ 0, radius ] );

    // Angular scale
    const angleScale = d3.scaleLinear()
      .domain( [ 0, polarData.length ] )
      .range( [ 0, 2 * Math.PI ] );

    // Create arcs
    const arc = d3.arc<any>()
      .innerRadius( 0 )
      .outerRadius( d => radiusScale( d.value ) )
      .startAngle( ( d, i ) => angleScale( i ) )
      .endAngle( ( d, i ) => angleScale( i + 1 ) )
      .padAngle( 0.02 );

    // Draw segments
    g.selectAll( 'path' )
      .data( polarData )
      .join( 'path' )
      .attr( 'd', arc as any )
      .attr( 'fill', d => d.color )
      .style( 'opacity', 0.8 )
      .style( 'stroke', '#fff' )
      .style( 'stroke-width', 2 )
      .on( 'mouseover', function () {
        d3.select( this ).style( 'opacity', 1 );
      } )
      .on( 'mouseout', function () {
        d3.select( this ).style( 'opacity', 0.8 );
      } )
      .append( 'title' )
      .text( d => `${ d.label }: ${ d.value.toLocaleString() }` );

    // Add labels
    if ( labelShow ) {
      g.selectAll( 'text' )
        .data( polarData )
        .join( 'text' )
        .attr( 'transform', ( d, i ) => {
          const angle = angleScale( i + 0.5 );
          const r = radiusScale( d.value ) + 15;
          const x = r * Math.sin( angle );
          const y = -r * Math.cos( angle );
          return `translate(${ x },${ y })`;
        } )
        .attr( 'text-anchor', 'middle' )
        .attr( 'fill', labelColor )
        .text( d => d.label );
    }

  }, [ data, labelKey, valueKeys, propWidth, propHeight, colors, colorPalette, labelShow, labelFontSize, labelColor, labelFontWeight ] );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg ref={ svgRef } style={ { maxWidth: '100%', maxHeight: '100%' } } />
    </div>
  );
}
