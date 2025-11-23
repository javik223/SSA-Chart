'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// Since we don't have @radix-ui/react-tooltip installed, we'll create a simple mock
// or we should ask the user to install it.
// But for now, let's create a simple functional replacement using standard React state
// to avoid breaking the build.

const TooltipProvider = ( { children }: { children: React.ReactNode; } ) => <>{ children }</>;

const Tooltip = ( { children }: { children: React.ReactNode; } ) => {
  const [ open, setOpen ] = React.useState( false );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={ () => setOpen( true ) }
      onMouseLeave={ () => setOpen( false ) }
    >
      { React.Children.map( children, child => {
        if ( React.isValidElement( child ) ) {
          // @ts-ignore
          return React.cloneElement( child, { open } );
        }
        return child;
      } ) }
    </div>
  );
};

const TooltipTrigger = ( { asChild, children, ...props }: any ) => {
  return children;
};

const TooltipContent = ( { children, className, side = 'top', open, ...props }: any ) => {
  if ( !open ) return null;

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={ cn(
        'absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        sideClasses[ side as keyof typeof sideClasses ],
        className
      ) }
      { ...props }
    >
      { children }
    </div>
  );
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
