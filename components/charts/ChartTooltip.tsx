import React from 'react';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  x: number;
  y: number;
  content: React.ReactNode;
  visible: boolean;
  className?: string;
}

import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';

export function ChartTooltip( { x, y, content, visible, className }: ChartTooltipProps ) {
  const {
    tooltipShow,
    tooltipBackgroundColor,
    tooltipTextColor,
    tooltipBorderRadius,
    tooltipPadding,
    tooltipShowArrow,
  } = useChartStore(
    useShallow( ( state ) => ( {
      tooltipShow: state.tooltipShow,
      tooltipBackgroundColor: state.tooltipBackgroundColor,
      tooltipTextColor: state.tooltipTextColor,
      tooltipBorderRadius: state.tooltipBorderRadius,
      tooltipPadding: state.tooltipPadding,
      tooltipShowArrow: state.tooltipShowArrow,
    } ) )
  );

  if ( !visible || !tooltipShow ) return null;

  return (
    <div
      className={ cn(
        'absolute pointer-events-none z-50 shadow-md animate-in fade-in-0 zoom-in-95',
        className
      ) }
      style={ {
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)', // Center horizontally, position above cursor
        marginTop: tooltipShowArrow ? '-10px' : '-5px', // Add some spacing
        backgroundColor: tooltipBackgroundColor,
        color: tooltipTextColor,
        borderRadius: `${ tooltipBorderRadius }px`,
        padding: `${ tooltipPadding }px`,
        border: '1px solid rgba(0,0,0,0.1)',
      } }
    >
      { content }
      { tooltipShowArrow && (
        <div
          className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-black/10"
          style={ { backgroundColor: tooltipBackgroundColor } }
        />
      ) }
    </div>
  );
}
