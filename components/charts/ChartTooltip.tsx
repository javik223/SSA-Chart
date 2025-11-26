import React from 'react';
import { cn } from '@/lib/utils';

interface ChartTooltipProps {
  x: number;
  y: number;
  content: React.ReactNode;
  visible: boolean;
  className?: string;
}

export function ChartTooltip( { x, y, content, visible, className }: ChartTooltipProps ) {
  if ( !visible ) return null;

  return (
    <div
      className={ cn(
        'absolute pointer-events-none z-50 rounded-lg border bg-background px-3 py-2 text-sm shadow-md animate-in fade-in-0 zoom-in-95',
        className
      ) }
      style={ {
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)', // Center horizontally, position above cursor
        marginTop: '-10px', // Add some spacing
      } }
    >
      { content }
    </div>
  );
}
