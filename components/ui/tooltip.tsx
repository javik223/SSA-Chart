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
      className="tooltip"
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
    top: 'tooltip-content-top',
    bottom: 'tooltip-content-bottom',
    left: 'tooltip-content-left',
    right: 'tooltip-content-right',
  };

  return (
    <div
      className={ cn(
        'tooltip-content',
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
