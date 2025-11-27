'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';
import { useChartStore } from '@/store/useChartStore';
import { TooltipContent } from './TooltipContent';

interface RadarChartProps {
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

export function RadarChart( {
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
}: RadarChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const { tooltipState, showTooltip, hideTooltip, moveTooltip } = useChartTooltip();
  const columnMapping = useChartStore( ( state ) => state.columnMapping );
  const availableColumns = useChartStore( ( state ) => state.availableColumns );

  useEffect( () => {
    if ( !svgRef.current || !data || data.length === 0 ) return;

    const width = propWidth;
    const height = propHeight;
    const radius = Math.min( width, height ) / 2 - 60;

    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    svg
      .attr( 'width', width )
      .attr( 'height', height )
      .style( 'font', `${ labelFontWeight } ${ labelFontSize }px sans-serif` );

    const g = svg.append( 'g' )
      .attr( 'transform', `translate(${ width / 2 },${ height / 2 })` );

    const palette = colors || getColorPalette( colorPalette ).colors;

    // Axes are the data labels
    const axes = data.map( d => String( d[ labelKey ] ) );
    const numAxes = axes.length;

    // Find max value across all series
    const maxValue = d3.max( data, d => {
      return d3.max( valueKeys, key => Number( d[ key ] ) || 0 ) || 0;
    } ) || 100;

    // Radial scale
    const radiusScale = d3.scaleLinear()
      .domain( [ 0, maxValue ] )
      .range( [ 0, radius ] );

    // Angle for each axis
    const angleSlice = ( 2 * Math.PI ) / numAxes;

    // Draw circular grid
    const levels = 5;
    for ( let i = 1; i <= levels; i++ ) {
      const levelRadius = ( radius / levels ) * i;
      g.append( 'circle' )
        .attr( 'r', levelRadius )
        .style( 'fill', 'none' )
        .style( 'stroke', '#CDCDCD' )
        .style( 'stroke-width', '0.5px' );
    }

    // Draw axes
    axes.forEach( ( axis, i ) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = radius * Math.cos( angle );
      const y = radius * Math.sin( angle );

      g.append( 'line' )
        .attr( 'x1', 0 )
        .attr( 'y1', 0 )
        .attr( 'x2', x )
        .attr( 'y2', y )
        .style( 'stroke', '#CDCDCD' )
        .style( 'stroke-width', '1px' );

      // Add axis labels
      if ( labelShow ) {
        const labelX = ( radius + 20 ) * Math.cos( angle );
        const labelY = ( radius + 20 ) * Math.sin( angle );

        g.append( 'text' )
          .attr( 'x', labelX )
          .attr( 'y', labelY )
          .attr( 'text-anchor', 'middle' )
          .attr( 'alignment-baseline', 'middle' )
          .attr( 'fill', labelColor )
          .text( axis );
      }
    } );

    // Draw data series
    valueKeys.forEach( ( valueKey, seriesIndex ) => {
      const seriesData = data.map( ( d, i ) => {
        const angle = angleSlice * i - Math.PI / 2;
        const value = Number( d[ valueKey ] ) || 0;
        const r = radiusScale( value );
        return {
          x: r * Math.cos( angle ),
          y: r * Math.sin( angle ),
          value: value,
          label: String( d[ labelKey ] ),
          originalData: d,
        };
      } );

      // Create line generator
      const lineGenerator = d3.line<any>()
        .x( d => d.x )
        .y( d => d.y )
        .curve( d3.curveLinearClosed );

      // Draw area
      g.append( 'path' )
        .datum( seriesData )
        .attr( 'd', lineGenerator )
        .style( 'fill', palette[ seriesIndex % palette.length ] )
        .style( 'fill-opacity', 0.2 )
        .style( 'stroke', palette[ seriesIndex % palette.length ] )
        .style( 'stroke-width', '2px' );

      // Draw points
      g.selectAll( `.point-${ seriesIndex }` )
        .data( seriesData )
        .join( 'circle' )
        .attr( 'class', `point-${ seriesIndex }` )
        .attr( 'cx', d => d.x )
        .attr( 'cy', d => d.y )
        .attr( 'r', 4 )
        .style( 'fill', palette[ seriesIndex % palette.length ] )
        .style( 'stroke', '#fff' )
        .style( 'stroke-width', '2px' )
        .on( 'mouseenter', function ( event, d ) {
          d3.select( this ).attr( 'r', 6 );

          const colorScale = () => palette[ seriesIndex % palette.length ];
          showTooltip(
            <TooltipContent
              data={ d.originalData }
              labelKey={ labelKey }
              valueKeys={ [ valueKey ] }
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
          d3.select( this ).attr( 'r', 4 );
          hideTooltip();
        } );
    } );

  }, [ data, labelKey, valueKeys, propWidth, propHeight, colors, colorPalette, labelShow, labelFontSize, labelColor, labelFontWeight, showTooltip, hideTooltip, moveTooltip, columnMapping, availableColumns ] );

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
