'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { getColorPalette } from '@/lib/colorPalettes';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { TooltipContent } from './TooltipContent';

interface CirclePackingChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  categoryKeys?: string[];
  width?: number;
  height?: number;
  colors?: string[];

  // Label controls
  labelShow?: boolean;
  labelFontSize?: number;
  labelColor?: string;
  labelFontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

  // Circle packing specific
  padding?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

interface HierarchyNode {
  name: string;
  value?: number;
  children?: HierarchyNode[];
  [ key: string ]: any;
}

export function CirclePackingChart( {
  data,
  labelKey,
  valueKeys,
  categoryKeys = [],
  width: propWidth = 800,
  height: propHeight = 600,
  colors,
  labelShow = true,
  labelFontSize = 12,
  labelColor = '#000000',
  labelFontWeight = 'normal',
  padding = 3,
  strokeColor = '#ffffff',
  strokeWidth = 1.5,
}: CirclePackingChartProps ) {
  const svgRef = useRef<SVGSVGElement>( null );
  const containerRef = useRef<HTMLDivElement>( null );
  const { tooltipState, showTooltip, hideTooltip, moveTooltip } = useChartTooltip();

  // View state - tracks current zoom focus [x, y, radius]
  const [ view, setView ] = useState<[ number, number, number ]>( [ propWidth / 2, propHeight / 2, propWidth / 2 ] );
  const [ focus, setFocus ] = useState<any>( null );

  // Store state
  const {
    theme,
    columnMapping,
    availableColumns,
  } = useChartStore( useShallow( ( state ) => ( {
    theme: state.theme,
    columnMapping: state.columnMapping,
    availableColumns: state.availableColumns,
  } ) ) );

  // Dimensions
  const width = propWidth || 600;
  const height = propHeight || 600;

  // Convert flat data to hierarchy
  const root = useMemo( () => {
    if ( !data || data.length === 0 ) return null;

    const syntheticCategoryKeys = categoryKeys.length === 0 ? [ labelKey ] : categoryKeys;

    let hierarchy: HierarchyNode;

    if ( syntheticCategoryKeys.length === 0 ) {
      // No categories - create flat structure
      hierarchy = {
        name: 'root',
        children: data.map( ( d ) => ( {
          name: String( d[ labelKey ] ),
          value: valueKeys.reduce( ( sum, key ) => sum + ( Number( d[ key ] ) || 0 ), 0 ),
          ...d,
        } ) ),
      };
    } else {
      // Build nested hierarchy from categories
      const buildHierarchy = ( items: any[], keys: string[], level: number = 0 ): HierarchyNode => {
        if ( level >= keys.length ) {
          // Leaf level - group by label
          const grouped = d3.group( items, ( d: any ) => d[ labelKey ] );
          return {
            name: 'root',
            children: Array.from( grouped, ( [ key, values ] ) => ( {
              name: String( key ),
              value: values.reduce( ( sum, v ) => sum + valueKeys.reduce( ( s, vk ) => s + ( Number( v[ vk ] ) || 0 ), 0 ), 0 ),
              ...values[ 0 ],
            } ) ),
          };
        }

        const key = keys[ level ];
        const grouped = d3.group( items, ( d: any ) => d[ key ] );

        const children = Array.from( grouped, ( [ groupKey, groupValues ] ) => {
          const childNode = buildHierarchy( groupValues, keys, level + 1 );
          return {
            name: String( groupKey ),
            children: childNode.children,
          };
        } );

        return {
          name: level === 0 ? 'root' : '',
          children,
        };
      };

      hierarchy = buildHierarchy( data, syntheticCategoryKeys );
    }

    const d3Hierarchy = d3.hierarchy<HierarchyNode>( hierarchy )
      .sum( ( d ) => d.value || 0 )
      .sort( ( a, b ) => ( b.value || 0 ) - ( a.value || 0 ) );

    return d3Hierarchy;
  }, [ data, valueKeys, categoryKeys, labelKey ] );

  // Pack layout
  const packRoot = useMemo( () => {
    if ( !root ) return null;

    const pack = d3.pack<HierarchyNode>()
      .size( [ width, height ] )
      .padding( padding );

    return pack( root.copy() );
  }, [ root, width, height, padding ] );

  // Color scale
  const colorScale = useMemo( () => {
    const paletteObj = getColorPalette( useChartStore.getState().colorPalette );
    const palette = paletteObj.colors;

    // Use interpolated color based on depth
    return d3.scaleLinear<string>()
      .domain( [ 0, ( packRoot?.height || 5 ) ] )
      .range( [ palette[ 0 ] || '#8dd3c7', palette[ palette.length - 1 ] || '#1f77b4' ] )
      .interpolate( d3.interpolateHcl );
  }, [ packRoot, colors ] );

  // Initialize focus to root when packRoot changes
  useEffect( () => {
    if ( packRoot && !focus ) {
      setFocus( packRoot );
      setView( [ packRoot.x, packRoot.y, packRoot.r * 2 ] );
    }
  }, [ packRoot ] );

  // Render
  useEffect( () => {
    if ( !svgRef.current || !packRoot || !focus ) return;

    const svg = d3.select( svgRef.current );
    svg.selectAll( '*' ).remove();

    // Background
    svg.append( 'rect' )
      .attr( 'width', width )
      .attr( 'height', height )
      .attr( 'fill', theme === 'dark' ? '#1a1a1a' : '#f5f5f5' )
      .on( 'click', () => zoom( packRoot ) );

    // Zoom function
    const zoom = ( d: any, duration: number = 750 ) => {
      if ( !d ) return;

      setFocus( d );

      const transition = svg.transition()
        .duration( duration )
        .tween( 'zoom', () => {
          const i = d3.interpolateZoom( view, [ d.x, d.y, d.r * 2 ] );
          return ( t: number ) => {
            const v = i( t );
            zoomTo( v );
            setView( v );
          };
        } );

      // Update label visibility
      label
        .filter( function ( this: any, d: any ) {
          return d.parent === focus || ( this as any ).style.display === 'inline';
        } )
        .transition( transition as any )
        .style( 'fill-opacity', ( d: any ) => d.parent === focus ? 1 : 0 )
        .on( 'start', function ( this: any, d: any ) {
          if ( d.parent === focus ) ( this as any ).style.display = 'inline';
        } )
        .on( 'end', function ( this: any, d: any ) {
          if ( d.parent !== focus ) ( this as any ).style.display = 'none';
        } );
    };

    // ZoomTo function
    const zoomTo = ( v: [ number, number, number ] ) => {
      const k = width / v[ 2 ];

      label.attr( 'transform', ( d: any ) => `translate(${ ( d.x - v[ 0 ] ) * k },${ ( d.y - v[ 1 ] ) * k })` );
      node.attr( 'transform', ( d: any ) => `translate(${ ( d.x - v[ 0 ] ) * k },${ ( d.y - v[ 1 ] ) * k })` );
      node.select( 'circle' ).attr( 'r', ( d: any ) => d.r * k );
    };

    // Create nodes (circles)
    const node = svg.append( 'g' )
      .selectAll( 'g' )
      .data( packRoot.descendants().slice( 1 ) ) // Exclude root
      .join( 'g' )
      .attr( 'cursor', ( d: any ) => d.children ? 'pointer' : 'default' )
      .on( 'click', ( event: any, d: any ) => {
        if ( focus !== d ) {
          zoom( d, event.shiftKey ? 2000 : 750 );
          event.stopPropagation();
        }
      } )
      .on( 'mouseover', ( event: any, d: any ) => {
        if ( d.children ) return; // Don't show tooltip for parent nodes

        // Highlight circle
        d3.select( event.currentTarget ).select( 'circle' )
          .attr( 'stroke', '#000' )
          .attr( 'stroke-width', 2 );

        const data = d.data as any;
        const label = String( data.name || data[ labelKey ] || '' );
        const value = d.value || 0;

        const tooltipData = {
          ...data,
          [ labelKey ]: label,
          [ valueKeys[ 0 ] ]: value
        };

        const color = d.children ? String( colorScale( d.depth ) ) : '#ffffff';
        const colorScaleFn = () => color;

        showTooltip(
          <TooltipContent
            data={ tooltipData }
            labelKey={ labelKey }
            valueKeys={ valueKeys }
            colorScale={ colorScaleFn }
          />,
          event.pageX,
          event.pageY
        );
      } )
      .on( 'mousemove', ( event: any ) => {
        moveTooltip( event.pageX, event.pageY );
      } )
      .on( 'mouseleave', ( event: any ) => {
        d3.select( event.currentTarget ).select( 'circle' )
          .attr( 'stroke', strokeColor )
          .attr( 'stroke-width', strokeWidth );
        hideTooltip();
      } );

    node.append( 'circle' )
      .attr( 'fill', ( d: any ) => d.children ? String( colorScale( d.depth ) ) : '#ffffff' )
      .attr( 'stroke', strokeColor )
      .attr( 'stroke-width', strokeWidth );

    // Create labels
    const label = svg.append( 'g' )
      .style( 'font', `${ labelFontWeight } ${ labelFontSize }px sans-serif` )
      .attr( 'pointer-events', 'none' )
      .attr( 'text-anchor', 'middle' )
      .selectAll( 'text' )
      .data( packRoot.descendants() )
      .join( 'text' )
      .style( 'fill', labelColor )
      .style( 'fill-opacity', ( d: any ) => d.parent === packRoot ? 1 : 0 )
      .style( 'display', ( d: any ) => d.parent === packRoot ? 'inline' : 'none' )
      .text( ( d: any ) => labelShow ? ( d.data.name || d.data[ labelKey ] || '' ) : '' );

    // Apply initial zoom
    zoomTo( view );

  }, [ data, packRoot, width, height, focus, labelShow, labelFontSize, labelColor, labelFontWeight, strokeColor, strokeWidth, theme, colorScale, showTooltip, hideTooltip, moveTooltip ] );

  return (
    <div ref={ containerRef } className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={ svgRef }
        width={ width }
        height={ height }
        viewBox={ `0 0 ${ width } ${ height }` }
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
