import { useState, useCallback } from 'react';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: React.ReactNode | null;
}

export function useChartTooltip() {
  const [ tooltipState, setTooltipState ] = useState<TooltipState>( {
    visible: false,
    x: 0,
    y: 0,
    content: null,
  } );

  const showTooltip = useCallback( ( content: React.ReactNode, x: number, y: number ) => {
    setTooltipState( {
      visible: true,
      x,
      y,
      content,
    } );
  }, [] );

  const hideTooltip = useCallback( () => {
    setTooltipState( prev => ( { ...prev, visible: false } ) );
  }, [] );

  const moveTooltip = useCallback( ( x: number, y: number ) => {
    setTooltipState( prev => ( { ...prev, x, y } ) );
  }, [] );

  return {
    tooltipState,
    showTooltip,
    hideTooltip,
    moveTooltip,
  };
}
