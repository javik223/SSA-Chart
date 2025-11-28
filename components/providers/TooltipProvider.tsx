'use client';

import React, { createContext, useContext, useRef } from 'react';
import { createStore, useStore, StoreApi } from 'zustand';

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: React.ReactNode | null;
}

interface TooltipActions {
  showTooltip: ( content: React.ReactNode, x: number, y: number ) => void;
  hideTooltip: () => void;
  moveTooltip: ( x: number, y: number ) => void;
}

export type TooltipStore = TooltipState & TooltipActions;

export const createTooltipStore = () => {
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  return createStore<TooltipStore>( ( set ) => ( {
    visible: false,
    x: 0,
    y: 0,
    content: null,
    showTooltip: ( content, x, y ) => {
      if ( hideTimeout ) {
        clearTimeout( hideTimeout );
        hideTimeout = null;
      }
      set( { visible: true, content, x, y } );
    },
    hideTooltip: () => {
      if ( hideTimeout ) {
        clearTimeout( hideTimeout );
      }
      hideTimeout = setTimeout( () => {
        set( { visible: false } );
        hideTimeout = null;
      }, 150 );
    },
    moveTooltip: ( x, y ) => {
      if ( hideTimeout ) {
        clearTimeout( hideTimeout );
        hideTimeout = null;
      }
      set( { x, y } );
    },
  } ) );
};

const TooltipContext = createContext<StoreApi<TooltipStore> | null>( null );

export const TooltipProvider = ( { children }: { children: React.ReactNode; } ) => {
  const storeRef = useRef<StoreApi<TooltipStore>>( null );
  if ( !storeRef.current ) {
    storeRef.current = createTooltipStore();
  }

  return (
    <TooltipContext.Provider value={ storeRef.current }>
      { children }
    </TooltipContext.Provider>
  );
};

export const useTooltipStore = <T,>( selector: ( state: TooltipStore ) => T ): T => {
  const store = useContext( TooltipContext );
  if ( !store ) {
    throw new Error( 'Missing TooltipProvider' );
  }
  return useStore( store, selector );
};
