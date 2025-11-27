'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';
import { useChartStore } from '@/store/useChartStore';

interface SunburstChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorPalette?: string;
  legendShow?: boolean;

  // Label controls
  labelShow?: boolean;
  labelFontSize?: number;
  labelColor?: string;
  labelFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
}

interface HierarchyNode {
  name: string;
  value?: number;
  children: HierarchyNode[];
}

export function SunburstChart( {
  data,
  labelKey,
  valueKeys,
  width: propWidth = 800,
  height: propHeight = 600,
  colors,
  colorPalette = 'default',
  labelShow = true,
  labelFontSize = 14,
  labelColor = '#000000',
  labelFontWeight = 'normal',
}: SunburstChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const { tooltipState, showTooltip, hideTooltip } = useChartTooltip();
  const columnMapping = useChartStore( ( state ) => state.columnMapping );
  const availableColumns = useChartStore( ( state ) => state.availableColumns );

  // 1. Process Data into Hierarchy
  const hierarchyData = useMemo( () => {
    if ( !data || data.length === 0 ) return null;

    const root: HierarchyNode = { name: 'root', children: [] };
    const valueKey = valueKeys[ 0 ]; // Use first value key for size

    data.forEach( ( d ) => {
      const label = String( d[ labelKey ] );
      const value = Number( d[ valueKey ] ) || 0;
      const parts = label.split( '/' ); // Split by slash for hierarchy

      let currentNode = root;
      parts.forEach( ( part, i ) => {
        let child = currentNode.children.find( ( c ) => c.name === part );
        if ( !child ) {
          child = { name: part, children: [] };
          currentNode.children.push( child );
        }
        currentNode = child;

        // If it's the last part, assign value
        if ( i === parts.length - 1 ) {
          currentNode.value = ( currentNode.value || 0 ) + value;
        }
      } );
    } );

    return root;
  }, [ data, labelKey, valueKeys ] );

  useEffect( () => {
    if ( !svgRef.current || !hierarchyData ) return;

    const width = propWidth;
    const height = propHeight;
    const radius = Math.min( width, height ) / 2 * 0.9; // Use 90% of available space

    // Clear previous
    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    svg
      .attr( 'viewBox', `${ -width / 2 } ${ -height / 2 } ${ width } ${ height }` )
      .style( 'font', `${ labelFontWeight } ${ labelFontSize }px sans-serif` );

    // Create hierarchy and partition
    const root = d3.hierarchy( hierarchyData )
      .sum( ( d ) => d.value || 0 )
      .sort( ( a, b ) => ( b.value || 0 ) - ( a.value || 0 ) );

    const partition = d3.partition<HierarchyNode>()
      .size( [ 2 * Math.PI, root.height + 1 ] );

    partition( root );

    // Scales for zooming
    // x maps angle (0 to 2PI)
    // y maps radius (0 to 1)
    root.each( ( d: any ) => {
      d.current = d;
    } );

    const arc = d3.arc<d3.HierarchyRectangularNode<any>>()
      .startAngle( ( d ) => d.x0 )
      .endAngle( ( d ) => d.x1 )
      .padAngle( ( d ) => Math.min( ( d.x1 - d.x0 ) / 2, 0.005 ) )
      .padRadius( radius * 1.5 )
      .innerRadius( ( d ) => d.y0 * radius )
      .outerRadius( ( d ) => Math.max( d.y0 * radius, d.y1 * radius - 1 ) );

    // Colors
    const palette = colors || getColorPalette( colorPalette ).colors;
    const color = d3.scaleOrdinal( d3.quantize( d3.interpolateRainbow, root.children?.length || 1 + 1 ) );
    // Or use our palette
    const colorScale = d3.scaleOrdinal()
      .domain( root.children?.map( d => d.data.name ) || [] )
      .range( palette );

    // Render
    const path = svg.append( 'g' )
      .selectAll( 'path' )
      .data( root.descendants().slice( 1 ) ) // Skip root
      .join( 'path' )
      .attr( 'fill', ( d ) => {
        // Color by top-level parent
        let ancestor = d;
        while ( ancestor.depth > 1 ) ancestor = ancestor.parent!;
        return colorScale( ancestor.data.name ) as string;
      } )
      .attr( 'fill-opacity', ( d ) => d.children ? 0.6 : 1.0 ) // Fade parents
      .attr( 'd', ( d: any ) => arc( d.current ) );

    path.style( 'cursor', 'pointer' )
      .on( 'click', clicked )
      .on( 'mouseenter', ( event, d ) => {
        d3.select( event.currentTarget ).attr( 'fill-opacity', 0.8 );

        const label = d.ancestors().map( ( d ) => d.data.name ).reverse().join( '/' ).replace( 'root/', '' );
        const value = d.value || 0;
        const color = colorScale( d.depth > 1 ? d.parent!.data.name : d.data.name ) as string;

        showTooltip(
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-xs">{ label }</div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={ { backgroundColor: color } }
              />
              <span className="text-muted-foreground">Value:</span>
              <span className="font-medium">
                { value.toLocaleString() }
              </span>
            </div>
            { columnMapping?.customPopups && columnMapping.customPopups.length > 0 && (
              <div className="mt-1 pt-1 border-t border-border/50 flex flex-col gap-0.5">
                { columnMapping.customPopups.map( ( colIndex: number ) => {
                  const colName = availableColumns[ colIndex ];
                  // Try to find matching data in original data
                  // This is tricky for hierarchical data, we might need to rely on leaf nodes or name matching
                  // For Sunburst, d.data.name is the segment name.
                  // If it's a leaf, we might find it.
                  const originalData = data.find( item => String( item[ labelKey ] ).endsWith( d.data.name ) );
                  const val = originalData ? originalData[ colName ] : '';
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
          event.pageX,
          event.pageY
        );
      } )
      .on( 'mousemove', ( event ) => {
        showTooltip( tooltipState.content, event.pageX, event.pageY );
      } )
      .on( 'mouseleave', ( event ) => {
        d3.select( event.currentTarget ).attr( 'fill-opacity', ( d: any ) => d.children ? 0.6 : 1.0 );
        hideTooltip();
      } );

    // Labels
    const label = svg.append( 'g' )
      .attr( 'pointer-events', 'none' )
      .attr( 'text-anchor', 'middle' )
      .style( 'user-select', 'none' )
      .style( 'display', labelShow ? 'block' : 'none' )
      .selectAll( 'text' )
      .data( root.descendants().slice( 1 ) )
      .join( 'text' )
      .attr( 'dy', '0.35em' )
      .attr( 'fill', labelColor )
      .attr( 'fill-opacity', ( d: any ) => +labelVisible( d.current ) )
      .attr( 'transform', ( d: any ) => labelTransform( d.current ) )
      .text( ( d ) => d.data.name );

    const parent = svg.append( 'circle' )
      .datum( root )
      .attr( 'r', radius )
      .attr( 'fill', 'none' )
      .attr( 'pointer-events', 'all' )
      .on( 'click', clicked );

    // Zoom function
    function clicked( event: any, p: any ) {
      parent.datum( p.parent || root );

      root.each( ( d: any ) => d.target = {
        x0: Math.max( 0, Math.min( 1, ( d.x0 - p.x0 ) / ( p.x1 - p.x0 ) ) ) * 2 * Math.PI,
        x1: Math.max( 0, Math.min( 1, ( d.x1 - p.x0 ) / ( p.x1 - p.x0 ) ) ) * 2 * Math.PI,
        y0: Math.max( 0, d.y0 - p.depth ),
        y1: Math.max( 0, d.y1 - p.depth )
      } );

      const t = svg.transition().duration( 750 );

      path.transition( t as any )
        .tween( 'data', ( d: any ) => {
          const i = d3.interpolate( d.current, d.target );
          return ( t: number ) => d.current = i( t );
        } )
        .filter( function ( this: any, d: any ) {
          return !!( +this.getAttribute( 'fill-opacity' ) || arcVisible( d.target ) );
        } )
        .attr( 'fill-opacity', ( d: any ) => arcVisible( d.target ) ? ( d.children ? 0.6 : 1.0 ) : 0 )
        .attr( 'pointer-events', ( d: any ) => arcVisible( d.target ) ? 'auto' : 'none' )
        .attrTween( 'd', ( d: any ) => () => arc( d.current ) || '' );

      label.transition( t as any )
        .attr( 'fill-opacity', ( d: any ) => +labelVisible( d.target ) )
        .attrTween( 'transform', ( d: any ) => () => labelTransform( d.current ) );
    }

    function arcVisible( d: any ) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible( d: any ) {
      return d.y1 <= 3 && d.y0 >= 1 && ( d.y1 - d.y0 ) * ( d.x1 - d.x0 ) > 0.03;
    }

    function labelTransform( d: any ) {
      const x = ( d.x0 + d.x1 ) / 2 * 180 / Math.PI;
      const y = ( d.y0 + d.y1 ) / 2 * radius;
      return `rotate(${ x - 90 }) translate(${ y },0) rotate(${ x < 180 ? 0 : 180 })`;
    }

  }, [ hierarchyData, propWidth, propHeight, colors, colorPalette, labelShow, labelFontSize, labelColor, labelFontWeight, showTooltip, hideTooltip, tooltipState.content, columnMapping, availableColumns ] );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={ svgRef }
        width={ propWidth }
        height={ propHeight }
        style={ { maxWidth: '100%', maxHeight: '100%' } }
      />
      <ChartTooltip
        visible={ tooltipState.visible }
        x={ tooltipState.x }
        y={ tooltipState.y }
        content={ tooltipState.content }
      />
    </div>
  );
}
