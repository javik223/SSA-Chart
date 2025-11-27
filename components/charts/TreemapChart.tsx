'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { ChartComponentProps } from '@/lib/chartRegistry';
import { getColorPalette } from '@/lib/colorPalettes';
import { ChartTooltip } from './ChartTooltip';
import { useChartTooltip } from '@/hooks/useChartTooltip';
import { TooltipContent } from './TooltipContent';

export function TreemapChart( {
  data,
  labelKey,
  valueKeys,
  categoryKeys, // Add categoryKeys prop
  width,
  height,
  colors,
  colorMode = 'by-column',
  labelColor,
  labelFontSize,
  labelFontWeight,
  labelPadding,
  treemapGradientSteepness,
  treemapCategoryLabelColor,
  treemapStrokeWidth,
  treemapStrokeColor,
}: ChartComponentProps ) {
  const containerRef = useRef<HTMLDivElement>( null );
  const svgRef = useRef<SVGSVGElement>( null );
  const { tooltipState, showTooltip, hideTooltip, moveTooltip } = useChartTooltip();

  // Zoom state - track current zoom node
  const [ currentZoomNode, setCurrentZoomNode ] = useState<any>( null );

  // Store state
  const {
    treemapTileMethod,
    treemapPadding,
    treemapColorMode,
    treemapCategoryLevel,
    theme,
    columnMapping,
    availableColumns,
  } = useChartStore( useShallow( ( state ) => ( {
    treemapTileMethod: state.treemapTileMethod,
    treemapPadding: state.treemapPadding,
    treemapColorMode: state.treemapColorMode,
    treemapCategoryLevel: state.treemapCategoryLevel,
    theme: state.theme,
    columnMapping: state.columnMapping,
    availableColumns: state.availableColumns,
  } ) ) );

  // Dimensions
  const margin = { top: 10, right: 10, bottom: 10, left: 0 };
  const innerWidth = Math.max( 0, ( width || 600 ) - margin.left - margin.right );
  const innerHeight = Math.max( 0, ( height || 400 ) - margin.top - margin.bottom );

  // Process data into hierarchy
  const root = useMemo( () => {
    if ( !data || data.length === 0 ) return null;

    const valueKey = valueKeys[ 0 ];

    // Check if we have explicit parentId structure
    const hasParentId = 'parentId' in data[ 0 ] && 'id' in data[ 0 ];

    // Check for 'path' or 'id' column
    const pathKey = Object.keys( data[ 0 ] ).find( k => k.toLowerCase() === 'path' || k.toLowerCase() === 'id' );

    // Check for category column (from settings)
    const hasCategories = categoryKeys && categoryKeys.length > 0;

    console.log( '[Treemap] categoryKeys:', categoryKeys );
    console.log( '[Treemap] hasCategories:', hasCategories );

    let hierarchy;

    if ( hasCategories ) {
      // Use category columns for grouping
      // Filter keys based on selected level
      // Treat -1 (All) as 0
      const effectiveLevel = Math.max( 0, treemapCategoryLevel );
      const activeCategoryKeys = categoryKeys.slice( effectiveLevel );

      if ( activeCategoryKeys.length === 0 ) {
        // No grouping keys active, treat as flat list
        const rootData = { name: 'root', children: data };
        hierarchy = d3.hierarchy( rootData );
      } else {
        // d3.group can take multiple keys for nested grouping
        const grouped = d3.group( data, ...activeCategoryKeys.map( ( key: string ) => ( d: any ) => d[ key ] ) );

        // Helper to convert Map to hierarchy object
        const mapToNode = ( name: string, value: any ): any => {
          if ( value instanceof Map ) {
            return { name, children: Array.from( value, ( [ k, v ] ) => mapToNode( String( k ), v ) ) };
          }
          return { name, children: value };
        };

        const rootData = { name: 'root', children: Array.from( grouped, ( [ k, v ] ) => mapToNode( String( k ), v ) ) };
        hierarchy = d3.hierarchy( rootData );
      }
    } else if ( pathKey ) {
      try {
        // Transform path-based data into flat data with synthetic columns
        // This allows us to reuse the robust d3.group logic below

        // Auto-detect separator
        const firstPath = String( data[ 0 ]?.[ pathKey ] || '' );
        const separator = firstPath.includes( '/' ) ? '/' : '.';

        // 1. Determine max depth and create synthetic columns
        let maxDepth = 0;
        const transformedData = data.map( ( d: any ) => {
          const path = String( d[ pathKey ] );
          const parts = path.split( separator );
          maxDepth = Math.max( maxDepth, parts.length );

          const newProps: any = {};
          parts.forEach( ( part, i ) => {
            newProps[ `__level_${ i }` ] = part;
          } );

          return { ...d, ...newProps };
        } );

        // 2. Generate category keys for the levels
        // If we have 'flare.analytics.cluster', we want levels 0 and 1 as categories
        // The last level is usually the leaf name, but d3.group handles leaves automatically
        // if we group by all levels.
        // However, usually for 'flare.analytics.cluster', 'cluster' is the leaf node.
        // If we group by L0, L1, L2, we get:
        // flare -> analytics -> cluster -> [Leaf Object]
        // This is correct.

        const syntheticCategoryKeys = Array.from( { length: maxDepth }, ( _, i ) => `__level_${ i }` );

        // Filter keys based on selected level
        // If level is 1, we want to start grouping from Level 1
        const effectiveLevel = Math.max( 0, treemapCategoryLevel );
        const activeCategoryKeys = syntheticCategoryKeys.slice( effectiveLevel );

        // 3. Use d3.group with the synthetic keys
        const grouped = d3.group( transformedData, ...activeCategoryKeys.map( ( key: string ) => ( d: any ) => d[ key ] ) );

        // 4. Convert Map to hierarchy object (reusing the helper)
        // Note: We need to define mapToNode here or move it out if it's not accessible
        const mapToNode = ( name: string, value: any ): any => {
          if ( value instanceof Map ) {
            return { name, children: Array.from( value, ( [ k, v ] ) => mapToNode( String( k ), v ) ) };
          }
          return { name, children: value };
        };

        const rootData = { name: 'root', children: Array.from( grouped, ( [ k, v ] ) => mapToNode( String( k ), v ) ) };

        // Optimization: If root has only one child (e.g. 'flare'), make that the root
        // Only apply this optimization if we haven't manually selected a level > 0
        if ( rootData.children.length === 1 && effectiveLevel === 0 ) {
          hierarchy = d3.hierarchy( rootData.children[ 0 ] );
        } else {
          hierarchy = d3.hierarchy( rootData );
        }

      } catch ( e ) {
        console.warn( 'Failed to build hierarchy from path data', e );
        hierarchy = d3.hierarchy( { children: data } );
      }
    } else if ( hasParentId ) {
      try {
        hierarchy = d3.stratify()
          .id( ( d: any ) => d.id )
          .parentId( ( d: any ) => d.parentId )
          ( data );
      } catch ( e ) {
        console.warn( 'Failed to stratify data, falling back to flat hierarchy', e );
        // Fallback to flat
        hierarchy = d3.hierarchy( { children: data } );
      }
    } else {
      // Group by labelKey (and potentially series/category if available)
      // For now, we'll assume a simple flat list or 1-level grouping if 'group' column exists
      const hasGroup = 'group' in data[ 0 ];

      if ( hasGroup ) {
        const grouped = d3.group( data, ( d: any ) => d.group );
        hierarchy = d3.hierarchy( grouped );
      } else {
        // Flat hierarchy
        hierarchy = d3.hierarchy( {
          name: 'root',
          children: data
        } );
      }
    }

    // Sum and sort
    hierarchy
      .sum( ( d: any ) => d ? Number( d[ valueKey ] ) || 0 : 0 )
      .sort( ( a, b ) => ( b.value || 0 ) - ( a.value || 0 ) );

    return hierarchy;
  }, [ data, valueKeys, categoryKeys, treemapCategoryLevel ] );

  // Layout
  const treemapRoot = useMemo( () => {
    if ( !root ) return null;

    const tileMethod = {
      'binary': d3.treemapBinary,
      'squarify': d3.treemapSquarify,
      'resquarify': d3.treemapResquarify,
      'slice': d3.treemapSlice,
      'dice': d3.treemapDice,
      'slice-dice': d3.treemapSliceDice,
    }[ treemapTileMethod ] || d3.treemapSquarify;

    const treemap = d3.treemap<any>()
      .tile( tileMethod )
      .size( [ innerWidth, innerHeight ] )
      .paddingOuter( 0 )
      .paddingTop( ( node ) => {
        // Add padding for headers in category mode for top-level groups
        if ( treemapColorMode === 'category' && node.depth === 1 ) {
          // Calculate padding based on the header font size (baseSize * 1.3) plus some spacing
          const baseSize = labelFontSize || 10;
          const headerSize = baseSize * 1.3;
          return headerSize * 1.5; // 1.5x the header font size for comfortable spacing
        }
        return 0;
      } )
      .paddingInner( 0 )
      .round( true );

    return treemap( root.copy() );
  }, [ root, innerWidth, innerHeight, treemapTileMethod, treemapPadding, treemapColorMode ] );

  // Color scale
  const colorScale = useMemo( () => {
    const paletteObj = getColorPalette( useChartStore.getState().colorPalette );
    const palette = paletteObj.colors;

    if ( treemapColorMode === 'depth' ) {
      return d3.scaleOrdinal<string, string>( palette );
    } else if ( treemapColorMode === 'value' ) {
      const values = root?.leaves().map( d => d.value || 0 ) || [];
      const minValue = d3.min( values ) || 0;
      const maxValue = d3.max( values ) || 0;

      // Create a multi-color gradient using all colors in the palette
      // This creates interpolation points at equal intervals across the palette
      const colorInterpolator = ( t: number ) => {
        const index = t * ( palette.length - 1 );
        const lowerIndex = Math.floor( index );
        const upperIndex = Math.ceil( index );
        const localT = index - lowerIndex;

        if ( lowerIndex === upperIndex ) return palette[ lowerIndex ];

        return d3.interpolateRgb( palette[ lowerIndex ], palette[ upperIndex ] )( localT );
      };

      return d3.scaleSequential( colorInterpolator )
        .domain( [ minValue, maxValue ] );
    } else {
      // Category (formerly root logic) - Color by top-level parent
      const topLevelChildren = root?.children || [];
      const categories = topLevelChildren.map( d => {
        // Use id or label for category identification
        return ( d.data as any ).id || ( d.data as any ).name || String( ( d.data as any )[ labelKey ] );
      } );
      return d3.scaleOrdinal<string, string>( palette ).domain( categories as any );
    }
  }, [ root, colors, treemapColorMode, labelKey ] );

  // Calculate value extents per top-level group for gradient coloring
  const groupValueExtents = useMemo( () => {
    if ( !root || treemapColorMode !== 'category' ) return new Map();

    const extents = new Map<string, [ number, number ]>();

    // Iterate over top-level children (groups)
    ( root.children || [] ).forEach( ( group: any ) => {
      const groupId = ( group.data as any ).id || ( group.data as any ).name || String( ( group.data as any )[ labelKey ] );
      const leaves = group.leaves();
      const values = leaves.map( ( d: any ) => Number( d.value ) || 0 );
      const min = Number( d3.min( values ) ) || 0;
      const max = Number( d3.max( values ) ) || 0;
      extents.set( groupId, [ min, max ] );
    } );

    return extents;
  }, [ root, treemapColorMode, labelKey ] );

  // Helper to get top-level parent for a node
  const getTopLevelParent = ( node: any ): string => {
    if ( !node.parent ) return ''; // Root
    let current = node;
    while ( current.parent && current.parent.depth > 0 ) {
      current = current.parent;
    }
    return ( current.data as any ).id || ( current.data as any ).name || String( ( current.data as any )[ labelKey ] );
  };

  // Initialize zoom node to root when treemapRoot changes
  useEffect( () => {
    if ( treemapRoot && !currentZoomNode ) {
      setCurrentZoomNode( treemapRoot );
    }
  }, [ treemapRoot ] );

  // Render
  useEffect( () => {
    if ( !svgRef.current || !treemapRoot || !currentZoomNode ) return;

    const svg = d3.select( containerRef.current ).select( 'svg' );

    // Ensure we have the main group
    const g = svg.select( 'g' ).empty()
      ? svg.append( 'g' ).attr( 'transform', `translate(${ margin.left },${ margin.top })` )
      : svg.select( 'g' );

    // Create scales for zooming - map node coordinates to SVG space
    const x = d3.scaleLinear()
      .domain( [ currentZoomNode.x0, currentZoomNode.x1 ] )
      .range( [ 0, innerWidth ] );

    const y = d3.scaleLinear()
      .domain( [ currentZoomNode.y0, currentZoomNode.y1 ] )
      .range( [ 0, innerHeight ] );

    // Render all descendants to show hierarchy nesting
    const nodes = treemapRoot.descendants();

    // Robust key function for data join
    const key = ( d: any ) => {
      // Use stable identifier if available to allow morphing across hierarchy levels
      if ( d.data.id ) return d.data.id;
      if ( d.data.name && d.data.name !== 'root' ) return d.data.name;
      if ( d.data[ labelKey ] ) return d.data[ labelKey ];

      // Fallback for root or unnamed nodes
      const ancestors = d.ancestors().reverse();
      return ancestors.map( ( n: any ) => n.data.name || n.data[ labelKey ] || 'root' ).join( '.' );
    };

    const t = svg.transition().duration( 750 ) as any;

    // Zoom functions
    const zoomIn = ( d: any ) => {
      if ( !d.children ) return; // Only zoom into parent nodes
      setCurrentZoomNode( d );
    };

    const zoomOut = () => {
      if ( currentZoomNode.parent ) {
        setCurrentZoomNode( currentZoomNode.parent );
      }
    };

    // Position function - apply zoom transforms
    const position = ( selection: any, node: any ) => {
      selection
        .attr( 'transform', ( d: any ) => `translate(${ x( d.x0 ) },${ y( d.y0 ) })` )
        .select( 'rect' )
        .attr( 'width', ( d: any ) => Math.max( 0, x( d.x1 ) - x( d.x0 ) ) )
        .attr( 'height', ( d: any ) => Math.max( 0, y( d.y1 ) - y( d.y0 ) ) );
    };

    const cell = ( g as any ).selectAll( 'g.node' )
      .data( nodes, key as any )
      .join(
        ( enter: any ) => {
          const enterG = enter.append( 'g' )
            .attr( 'class', 'node' )
            .attr( 'cursor', ( d: any ) => d.children ? 'pointer' : 'default' )
            .attr( 'opacity', 0 );

          // Apply initial positioning with zoom
          enterG.call( position, currentZoomNode );

          enterG.append( 'rect' )
            .attr( 'id', ( d: any, i: number ) => `rect-${ i }` )
            .attr( 'width', ( d: any ) => Math.max( 0, d.x1 - d.x0 ) )
            .attr( 'height', ( d: any ) => Math.max( 0, d.y1 - d.y0 ) );

          enterG.append( 'clipPath' )
            .attr( 'id', ( d: any, i: number ) => `clip-${ i }` )
            .append( 'rect' )
            .attr( 'width', ( d: any ) => Math.max( 0, d.x1 - d.x0 ) )
            .attr( 'height', ( d: any ) => Math.max( 0, d.y1 - d.y0 ) );

          enterG.append( 'text' )
            .attr( 'clip-path', ( d: any, i: number ) => `url(#clip-${ i })` );

          return enterG.call( ( enter: any ) => enter.transition( t ).attr( 'opacity', 1 ) );
        },
        ( update: any ) => update.call( ( update: any ) => {
          update.transition( t )
            .attr( 'cursor', ( d: any ) => d.children ? 'pointer' : 'default' )
            .call( position, currentZoomNode )
            .attr( 'opacity', 1 );
        } ),
        ( exit: any ) => exit.call( ( exit: any ) => exit.transition( t ).attr( 'opacity', 0 ).remove() )
      );

    // Add click handlers for zoom
    cell
      .filter( ( d: any ) => d.children )
      .on( 'click', ( event: any, d: any ) => {
        // Don't zoom if this is the current zoom node (clicking the header)
        if ( d === currentZoomNode && currentZoomNode.parent ) {
          zoomOut();
        } else if ( d.children ) {
          zoomIn( d );
        }
        event.stopPropagation();
      } );

    // Update Rects (for both enter and update selections)
    cell.select( 'rect' )
      .transition( t )
      .attr( 'width', ( d: any ) => Math.max( 0, d.x1 - d.x0 ) )
      .attr( 'height', ( d: any ) => Math.max( 0, d.y1 - d.y0 ) )
      .attr( 'fill', ( d: any ) => {
        if ( treemapColorMode === 'category' ) {
          // Both groups and leaves get the category color
          // For groups (depth 1), use a slightly darker shade of the base color
          if ( d.depth === 1 ) {
            const baseColor = colorScale( ( ( d.data as any ).id || String( ( d.data as any )[ labelKey ] || ( d.data as any ).name ) ) as any );
            // Darken the color by interpolating 20% towards black
            return d3.interpolateRgb( baseColor, '#000000' )( 0.2 );
          }

          // Leaves use the top-level parent's ID
          const parentId = getTopLevelParent( d );
          const baseColor = colorScale( parentId as any );

          // Apply gradient based on value within the group
          const extents = groupValueExtents.get( parentId );
          if ( extents ) {
            const [ min, max ] = extents;
            const value = d.value || 0;
            // Avoid divide by zero if min === max
            const t = min === max ? 1 : ( value - min ) / ( max - min );

            // Interpolate from a lighter version (mixed with white) to the full color
            // Use gradient steepness to control the range (0 = no gradient, 1 = maximum gradient)
            const steepness = treemapGradientSteepness ?? 0.3;
            const startPoint = 1 - steepness; // e.g., 0.3 steepness -> start at 0.7
            return d3.interpolateRgb( '#ffffff', baseColor )( startPoint + steepness * t );
          }

          return baseColor;
        }

        if ( treemapColorMode === 'depth' ) return colorScale( String( d.depth ) as any );
        if ( treemapColorMode === 'value' ) return colorScale( d.value || 0 );
        return colorScale( String( ( d.data as any )[ labelKey ] ) as any );
      } )
      .attr( 'fill-opacity', 1 )
      .attr( 'stroke', treemapStrokeColor || '#ffffff' )
      .attr( 'stroke-width', treemapStrokeWidth ?? 1 );

    // Re-attach events (since they might be lost on enter/update if not careful, but usually fine on 'cell')
    // Actually, we should attach events to the enter selection or merge.
    // Since 'cell' is the merged selection, we can attach here.
    cell.select( 'rect' )
      .on( 'mouseover', ( event: any, d: any ) => {
        // Don't show tooltip for group headers
        if ( d.children ) return;

        // Extract all other properties for the tooltip
        const data = d.data as any;
        const excludeKeys = [ 'id', 'parentId', 'children', 'path', labelKey, ...valueKeys, 'value' ];
        const extraFields = Object.keys( data )
          .filter( k => !excludeKeys.includes( k ) && typeof data[ k ] !== 'object' )
          .map( k => ( { key: k, value: data[ k ] } ) );

        const label = String( data[ labelKey ] || data.name || data[ 0 ] || '' );
        const value = d.value || 0;
        const color = String(
          treemapColorMode === 'value' ? colorScale( d.value || 0 ) :
            treemapColorMode === 'category' ? colorScale( getTopLevelParent( d ) as any ) :
              colorScale( String( ( d.data as any )[ labelKey ] ) as any )
        );

        const tooltipData = {
          ...data,
          [ labelKey ]: label,
          [ valueKeys[ 0 ] ]: value
        };

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
        d3.select( event.currentTarget ).attr( 'opacity', 0.9 );
      } )
      .on( 'mousemove', ( event: any ) => {
        moveTooltip( event.pageX, event.pageY );
      } )
      .on( 'mouseleave', ( event: any ) => {
        hideTooltip();
        d3.select( event.currentTarget ).attr( 'opacity', 1 );
      } );

    // Update Clip Rects
    cell.select( 'clipPath' ).select( 'rect' )
      .transition( t )
      .attr( 'width', ( d: any ) => Math.max( 0, d.x1 - d.x0 ) )
      .attr( 'height', ( d: any ) => Math.max( 0, d.y1 - d.y0 ) );

    // Update Text
    cell.select( 'text' )
      .selectAll( 'tspan' )
      .data( ( d: any ) => {
        // For group nodes (depth 1), show the group label
        if ( treemapColorMode === 'category' && d.depth === 1 ) {
          const id = ( d.data as any ).id || ( d.data as any ).name || String( ( d.data as any )[ labelKey ] );
          const label = id.split( /[\/.]/ ).pop() || id;
          return [ label ];
        }
        // For leaf nodes, show label if space permits
        if ( !d.children && ( d.x1 - d.x0 ) > 30 && ( d.y1 - d.y0 ) > 15 ) {
          const fullLabel = String( ( d.data as any )[ labelKey ] || ( d.data as any ).name || d.data[ 0 ] || '' );
          const separator = fullLabel.includes( '/' ) ? '/' : '.';
          const leafName = fullLabel.split( separator ).pop() || fullLabel;
          return leafName.split( /(?=[A-Z][a-z])/g ).concat( d3.format( "," )( d.value || 0 ) );
        }
        return [];
      } )
      .join( 'tspan' )
      .attr( 'x', labelPadding || 4 )
      .attr( 'y', function ( this: SVGElement, d: any, i: number ) {
        const parent = this.parentNode as Element;
        const node = ( parent as any ).__data__;
        const baseSize = labelFontSize || 10;
        const fontSize = node.depth === 1 ? baseSize * 1.3 : baseSize;
        const lineHeight = fontSize * 1.2;
        return lineHeight + i * lineHeight;
      } )
      .text( ( d: any ) => String( d ) )
      .attr( 'fill', function ( this: SVGElement, d: any ) {
        const parent = this.parentNode as Element;
        const node = ( parent as any ).__data__;

        // Use category label color for category headers (depth 1)
        if ( node.depth === 1 && treemapCategoryLabelColor ) return treemapCategoryLabelColor;

        // Use user-specified label color if provided
        if ( labelColor ) return labelColor;

        // White text for headers and leaves in category mode (assuming dark/vibrant colors)
        if ( treemapColorMode === 'category' ) return '#fff';
        return '#333';
      } )
      .attr( 'font-size', function ( this: SVGElement, d: any ) {
        const parent = this.parentNode as Element;
        const node = ( parent as any ).__data__;
        const baseSize = labelFontSize || 10;
        if ( node.depth === 1 ) return `${ baseSize * 1.3 }px`;
        return `${ baseSize }px`;
      } )
      .attr( 'font-weight', function ( this: SVGElement, d: any, i: number, nodes: any ) {
        const parent = this.parentNode as Element;
        const node = ( parent as any ).__data__;
        if ( node.depth === 1 ) return '600'; // Medium bold for headers
        if ( labelFontWeight ) return labelFontWeight;
        return i === nodes.length - 1 ? 'bold' : 'normal';
      } )
      .attr( 'text-transform', function ( this: SVGElement, d: any ) {
        const parent = this.parentNode as Element;
        const node = ( parent as any ).__data__;
        return node.depth === 1 ? 'uppercase' : 'none';
      } );

  }, [ treemapRoot, innerWidth, innerHeight, colorScale, treemapColorMode, labelKey, theme, margin.left, margin.top, valueKeys, labelColor, labelFontSize, labelFontWeight, labelPadding, treemapGradientSteepness, treemapCategoryLabelColor, treemapStrokeWidth, treemapStrokeColor, showTooltip, hideTooltip, moveTooltip, currentZoomNode ] );

  // Build breadcrumb path
  const breadcrumbPath = useMemo( () => {
    if ( !currentZoomNode ) return [];
    const path: any[] = [];
    let node = currentZoomNode;
    while ( node ) {
      path.unshift( node );
      node = node.parent;
    }
    return path;
  }, [ currentZoomNode ] );

  return (
    <div className='relative w-full h-full flex flex-col' ref={ containerRef }>
      {/* Breadcrumb Navigation */ }
      { currentZoomNode && currentZoomNode !== treemapRoot && (
        <div className="flex items-center gap-2 mb-2 text-xs">
          <button
            onClick={ () => setCurrentZoomNode( treemapRoot ) }
            className="px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Root
          </button>
          { breadcrumbPath.slice( 1, -1 ).map( ( node: any, i: number ) => (
            <div key={ i } className="flex items-center gap-2">
              <span className="text-zinc-400">/</span>
              <button
                onClick={ () => setCurrentZoomNode( node ) }
                className="px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                { ( node.data as any ).name || ( node.data as any )[ labelKey ] || 'Node' }
              </button>
            </div>
          ) ) }
          { breadcrumbPath.length > 1 && (
            <>
              <span className="text-zinc-400">/</span>
              <span className="px-2 py-1 font-medium text-zinc-900 dark:text-zinc-100">
                { ( currentZoomNode.data as any ).name || ( currentZoomNode.data as any )[ labelKey ] || 'Current' }
              </span>
            </>
          ) }
        </div>
      ) }

      {/* Custom Legend for Category Mode */ }
      { treemapColorMode === 'category' && root && (
        <div className="flex flex-wrap justify-start items-start gap-4 mb-2">
          { ( root.children || [] ).map( ( child: any, i: number ) => {
            const id = ( child.data as any ).id || ( child.data as any ).name || String( ( child.data as any )[ labelKey ] );
            const label = id.split( /[\/.]/ ).pop() || id;
            const color = colorScale( id );
            return (
              <div key={ i } className="flex items-center gap-1.5">
                <div className="w-3 h-3" style={ { backgroundColor: color } } />
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{ label }</span>
              </div>
            );
          } ) }
        </div>
      ) }

      <div className="flex-1 min-h-0">
        <svg
          ref={ svgRef }
          width="100%"
          height="100%"
          viewBox={ `0 0 ${ width } ${ height ? ( treemapColorMode === 'category' ? height - 40 : height ) : 400 }` }
          preserveAspectRatio="xMidYMid meet"
          className='w-full h-full'
          style={ { overflow: 'visible' } }
        />
      </div>

      { tooltipState.visible && (
        <ChartTooltip
          visible={ tooltipState.visible }
          x={ tooltipState.x }
          y={ tooltipState.y }
          content={ tooltipState.content }
        />
      ) }
    </div>
  );
};
