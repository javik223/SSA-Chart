'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { ChartType } from '@/types/chart';

interface ChartTransitionProps {
  chartType: ChartType;
  children: ReactNode;
  duration?: number; // Transition duration in milliseconds
  transitionType?: 'fade' | 'slide' | 'zoom';
}

/**
 * ChartTransition Component
 *
 * Provides smooth animated transitions when switching between chart types.
 * Uses CSS transitions for performance and smooth animations.
 */
export function ChartTransition({
  chartType,
  children,
  duration = 400,
  transitionType = 'fade',
}: ChartTransitionProps) {
  const [displayedChartType, setDisplayedChartType] = useState(chartType);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousChartType = useRef(chartType);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if chart type has changed
    if (previousChartType.current !== chartType) {
      // Start transition
      setIsTransitioning(true);

      // Wait for exit animation to complete
      const exitTimer = setTimeout(() => {
        // Update to new chart type
        setDisplayedChartType(chartType);
        previousChartType.current = chartType;

        // Wait a tick for new chart to mount
        requestAnimationFrame(() => {
          // End transition (trigger enter animation)
          setIsTransitioning(false);
        });
      }, duration);

      return () => clearTimeout(exitTimer);
    }
  }, [chartType, duration]);

  // Generate transition styles based on type
  const getTransitionStyles = () => {
    const baseStyles = {
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      width: '100%',
      height: '100%',
    };

    if (transitionType === 'fade') {
      return {
        ...baseStyles,
        opacity: isTransitioning ? 0 : 1,
      };
    }

    if (transitionType === 'slide') {
      return {
        ...baseStyles,
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
      };
    }

    if (transitionType === 'zoom') {
      return {
        ...baseStyles,
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
      };
    }

    return baseStyles;
  };

  return (
    <div
      ref={containerRef}
      style={getTransitionStyles()}
      className="w-full h-full"
    >
      {children}
    </div>
  );
}
