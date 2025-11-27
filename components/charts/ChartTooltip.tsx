import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { useTooltipState } from '@/hooks/useTooltip';

interface ChartTooltipProps {
  className?: string;
}

export function ChartTooltip( { className }: ChartTooltipProps ) {
  const { x, y, content, visible } = useTooltipState();
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
