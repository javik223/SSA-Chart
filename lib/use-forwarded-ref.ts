import { ForwardedRef, useEffect, useRef } from 'react';

/**
 * Utility hook to merge a forwarded ref with an internal ref
 */
export function useForwardedRef<T>(forwardedRef: ForwardedRef<T>) {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!forwardedRef) return;

    if (typeof forwardedRef === 'function') {
      forwardedRef(innerRef.current);
    } else {
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
}
