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

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

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

  const [ mounted, setMounted ] = useState( false );

  useEffect( () => {
    setMounted( true );
  }, [] );

  if ( !tooltipShow || !mounted ) return null;

  return createPortal(
    <motion.div
      className={ cn(
        'absolute pointer-events-none z-50 shadow-md',
        className
      ) }
      style={ {
        backgroundColor: tooltipBackgroundColor,
        color: tooltipTextColor,
        borderRadius: `${ tooltipBorderRadius }px`,
        padding: `${ tooltipPadding }px`,
        border: '1px solid rgba(0,0,0,0.1)',
        // transform: 'translate(-50%, -100%)',
        marginTop: tooltipShowArrow ? '-20px' : '-20px',
      } }
      animate={ {
        opacity: visible ? 1 : 0,
        left: x,
        top: y,
      } }
      transition={ {
        duration: 0.2,
        ease: 'easeOut',
      } }
    >
      { content }
      { tooltipShowArrow && (
        <div
          className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 border-r border-b border-black/10"
          style={ { backgroundColor: tooltipBackgroundColor } }
        />
      ) }
    </motion.div>,
    document.body
  );
}
