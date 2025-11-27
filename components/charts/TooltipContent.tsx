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
  const {
    tooltipTitleMode,
    tooltipCustomTitle,
    columnMapping,
    availableColumns,
  } = useChartStore( useShallow( ( state ) => ( {
    tooltipTitleMode: state.tooltipTitleMode,
    tooltipCustomTitle: state.tooltipCustomTitle,
    columnMapping: state.columnMapping,
    availableColumns: state.availableColumns,
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
      title = String( val );
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
    <div className="flex flex-col gap-1 min-w-[120px]">
      { title && (
        <div className="font-semibold border-b pb-1 mb-1 border-border/50">
          { title }
        </div>
      ) }
      { items.map( ( item, i ) => (
        <div key={ i } className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            { item.color && (
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={ { backgroundColor: item.color } }
              />
            ) }
            <span className="opacity-80 capitalize">{ item.label }</span>
          </div>
          <span className="font-mono font-medium">{ item.value }</span>
        </div>
      ) ) }
    </div>
  );
}
