'use client';

import React from 'react';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import * as d3 from 'd3';

interface TooltipContentProps {
  data: Record<string, string | number | Date>;
  labelKey: string;
  valueKeys: string[];
  colorScale: ( key: string ) => string;
}

export function TooltipContent( { data, labelKey, valueKeys, colorScale }: TooltipContentProps ) {
  // Safety check
  if ( !data || !labelKey || !valueKeys || valueKeys.length === 0 ) {
    return <div className="text-xs">No data available</div>;
  }

  const {
    tooltipTitleMode,
    tooltipCustomTitle,
    columnMapping,
    availableColumns,
    // Header
    tooltipHeaderTextColor,
    tooltipHeaderBackgroundColor,
    tooltipHeaderFontSize,
    tooltipHeaderFontWeight,
    tooltipHeaderPadding,
    tooltipHeaderAlignment,
    tooltipHeaderFontFamily,
    // Content
    tooltipContentTextColor,
    tooltipContentBackgroundColor,
    tooltipContentFontSize,
    tooltipContentFontWeight,
    tooltipContentPadding,
    tooltipContentAlignment,
    tooltipContentFontFamily,
  } = useChartStore( useShallow( ( state ) => ( {
    tooltipTitleMode: state.tooltipTitleMode,
    tooltipCustomTitle: state.tooltipCustomTitle,
    columnMapping: state.columnMapping,
    availableColumns: state.availableColumns,
    // Header
    tooltipHeaderTextColor: state.tooltipHeaderTextColor,
    tooltipHeaderBackgroundColor: state.tooltipHeaderBackgroundColor,
    tooltipHeaderFontSize: state.tooltipHeaderFontSize,
    tooltipHeaderFontWeight: state.tooltipHeaderFontWeight,
    tooltipHeaderPadding: state.tooltipHeaderPadding,
    tooltipHeaderAlignment: state.tooltipHeaderAlignment,
    tooltipHeaderFontFamily: state.tooltipHeaderFontFamily,
    // Content
    tooltipContentTextColor: state.tooltipContentTextColor,
    tooltipContentBackgroundColor: state.tooltipContentBackgroundColor,
    tooltipContentFontSize: state.tooltipContentFontSize,
    tooltipContentFontWeight: state.tooltipContentFontWeight,
    tooltipContentPadding: state.tooltipContentPadding,
    tooltipContentAlignment: state.tooltipContentAlignment,
    tooltipContentFontFamily: state.tooltipContentFontFamily,
  } ) ) );

  // Determine Title
  let title: React.ReactNode = '';
  if ( tooltipTitleMode === 'custom' ) {
    title = tooltipCustomTitle;
  } else {
    const val = data[ labelKey ];
    if ( val instanceof Date ) {
      title = d3.utcFormat( "%B %Y" )( val );
    } else if ( typeof val === 'string' && !isNaN( Date.parse( val ) ) ) {
      // Try to parse string date if labelKey implies date?
      // For now, just display as is or try formatting if it looks like a date
      // But safer to just display string
      title = val;
      // If the chart knows it's a date, it should have passed a Date object or we handle it.
      // In RadialAreaChart, we convert to Date for labels.
      // Let's try to detect if it's a date string
      const d = new Date( val );
      if ( !isNaN( d.getTime() ) && val.length > 4 ) { // Simple check
        title = d3.utcFormat( "%B %Y" )( d );
      }
    } else {
      title = String( val || '' );
    }
  }

  // Determine Body Items
  const selectedIndices = columnMapping.customPopups || [];
  let items: { label: string; value: string; color?: string; }[] = [];

  if ( selectedIndices.length > 0 ) {
    // Show selected columns
    items = selectedIndices.map( idx => {
      const col = availableColumns[ idx ];
      if ( !col ) return null;

      const key = col; // availableColumns is string[]
      const val = data[ key ];
      const numVal = Number( val );
      const displayVal = isNaN( numVal ) ? String( val ) : numVal.toLocaleString();

      return {
        label: key,
        value: displayVal,
        color: valueKeys.includes( key ) ? colorScale( key ) : undefined
      };
    } ).filter( Boolean ) as any;
  } else {
    // Default: Show all valueKeys
    items = valueKeys.map( key => {
      const val = Number( data[ key ] );
      return {
        label: key,
        value: isNaN( val ) ? String( data[ key ] ) : val.toLocaleString(),
        color: colorScale( key )
      };
    } );
  }

  return (
    <div className="flex flex-col min-w-[180px]">
      { title && (
        <div
          className="border-b border-border/50 mb-1"
          style={ {
            color: tooltipHeaderTextColor || 'inherit',
            backgroundColor: tooltipHeaderBackgroundColor || 'transparent',
            fontSize: `${ tooltipHeaderFontSize }px`,
            fontWeight: tooltipHeaderFontWeight,
            padding: `${ tooltipHeaderPadding > 0 ? tooltipHeaderPadding / 2 : 0 }px ${ tooltipHeaderPadding }px`,
            textAlign: tooltipHeaderAlignment,
            fontFamily: tooltipHeaderFontFamily,
          } }
        >
          { title }
        </div>
      ) }
      <div
        style={ {
          color: tooltipContentTextColor || 'inherit',
          backgroundColor: tooltipContentBackgroundColor || 'transparent',
          fontSize: `${ tooltipContentFontSize }px`,
          fontWeight: tooltipContentFontWeight,
          padding: `${ tooltipContentPadding > 0 ? tooltipContentPadding / 2 : 0 }px ${ tooltipContentPadding }px`,
          textAlign: tooltipContentAlignment,
          fontFamily: tooltipContentFontFamily,
        } }
      >
        { items.map( ( item, i ) => (
          <div key={ i } className="flex items-center justify-between gap-3 mb-1 last:mb-0">
            <div className="flex items-center gap-1.5">
              { item.color && (
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={ { backgroundColor: item.color } }
                />
              ) }
              <span className="opacity-80 capitalize">{ item.label }</span>
            </div>
            <span className="font-medium">{ item.value }</span>
          </div>
        ) ) }
      </div>
    </div>
  );
}
