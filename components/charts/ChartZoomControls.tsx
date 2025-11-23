'use client';

import { Plus, Minus, Maximize, RotateCcw } from 'lucide-react';
import { useChartStore } from '@/store/useChartStore';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { useDragControls, motion } from "motion/react";
import { GripHorizontalIcon } from "lucide-react";


interface ChartZoomControlsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xScale: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yScale: any;
  dataLength: number;
  isFloatingPreview?: boolean;
}

export function ChartZoomControls( { xScale, yScale, dataLength, isFloatingPreview = false }: ChartZoomControlsProps ) {
  const showZoomControls = useChartStore( ( state ) => state.showZoomControls );
  const zoomDomain = useChartStore( ( state ) => state.zoomDomain );
  const setZoomDomain = useChartStore( ( state ) => state.setZoomDomain );
  const resetZoom = useChartStore( ( state ) => state.resetZoom );

  const controls = useDragControls();

  if ( !showZoomControls ) return null;

  const handleZoom = ( factor: number ) => {
    if ( !xScale || !yScale ) return;

    const newZoomDomain: any = {};

    // Handle X Axis - Always use indices
    const currentXDomain = zoomDomain?.x || [ 0, dataLength - 1 ];
    const xMin = currentXDomain[ 0 ];
    const xMax = currentXDomain[ 1 ];
    const xRange = xMax - xMin;
    const xPadding = xRange * factor;

    // Calculate new indices
    let newXMin = xMin + xPadding;
    let newXMax = xMax - xPadding;

    // Clamp to bounds
    newXMin = Math.max( 0, newXMin );
    newXMax = Math.min( dataLength - 1, newXMax );

    // Ensure min < max
    if ( newXMin < newXMax ) {
      newZoomDomain.x = [ Math.round( newXMin ), Math.round( newXMax ) ];
    } else {
      newZoomDomain.x = currentXDomain; // No change if invalid
    }

    // Handle Y Axis - Use values
    if ( typeof yScale.invert === 'function' ) {
      const domain = yScale.domain();
      const [ min, max ] = domain.map( ( d: any ) => Number( d ) );
      const range = max - min;
      const padding = range * factor;

      newZoomDomain.y = [ min + padding, max - padding ];
    }

    if ( newZoomDomain.x || newZoomDomain.y ) {
      setZoomDomain( {
        x: newZoomDomain.x || null,
        y: newZoomDomain.y || null
      } );
    }
  };


  return (
    <motion.div drag className={ `absolute top-4 right-4 flex flex-col gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-zinc-200 p-1 z-10 justify-center items-center ${ isFloatingPreview ? 'scale-75' : '' }` } dragListener={ false } dragControls={ controls }>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='md:size-8 hover:bg-zinc-100'
              onClick={ () => handleZoom( 0.1 ) }
            >
              <Plus className='size-3 md:size-4 text-zinc-700' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>Zoom In</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-zinc-100'
              onClick={ () => handleZoom( -0.1 ) }
            >
              <Minus className='size-3 md:size-4 text-zinc-700' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>Zoom Out</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-zinc-100'
              onClick={ resetZoom }
            >
              <Maximize className='size-3 md:size-4 text-zinc-700' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>Fit to Extent</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='md:size-8 hover:bg-zinc-100'
              onClick={ resetZoom }
            >
              <RotateCcw className='size-3 md:size-4 text-zinc-700' />
            </Button>
          </TooltipTrigger>
          <TooltipContent side='left'>Reset Zoom</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <motion.span onPointerDown={ event => controls.start( event ) }><GripHorizontalIcon size={ 18 } className='text-gray-300' /></motion.span>
    </motion.div>
  );
}
