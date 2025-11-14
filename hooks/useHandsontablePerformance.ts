/**
 * Performance monitoring hook for Handsontable
 * Use in development to track grid performance metrics
 */

import { useEffect, useRef, useState } from 'react';
import type { HotTableRef } from '@handsontable/react-wrapper';

interface PerformanceMetrics {
  mountTime: number;
  renderCount: number;
  avgRenderTime: number;
  lastRenderTime: number;
  editCount: number;
  avgEditTime: number;
  searchCount: number;
  avgSearchTime: number;
  scrollFPS: number;
  memoryUsage: number;
}

export function useHandsontablePerformance(
  hotRef: React.RefObject<HotTableRef>,
  enabled: boolean = process.env.NODE_ENV === 'development'
) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    mountTime: 0,
    renderCount: 0,
    avgRenderTime: 0,
    lastRenderTime: 0,
    editCount: 0,
    avgEditTime: 0,
    searchCount: 0,
    avgSearchTime: 0,
    scrollFPS: 0,
    memoryUsage: 0,
  });

  const renderTimes = useRef<number[]>([]);
  const editTimes = useRef<number[]>([]);
  const searchTimes = useRef<number[]>([]);
  const frameCount = useRef(0);
  const lastFrameTime = useRef(performance.now());

  // Track mount time
  useEffect(() => {
    if (!enabled) return;

    const mountStart = performance.now();
    performance.mark('handsontable-mount-start');

    return () => {
      performance.mark('handsontable-mount-end');
      performance.measure(
        'handsontable-mount',
        'handsontable-mount-start',
        'handsontable-mount-end'
      );

      const measure = performance.getEntriesByName('handsontable-mount')[0];
      if (measure) {
        console.log(
          `%c📊 Handsontable Mount Time: ${measure.duration.toFixed(2)}ms`,
          'color: #4CAF50; font-weight: bold;'
        );
      }
    };
  }, [enabled]);

  // Track render performance
  useEffect(() => {
    if (!enabled) return;

    const hotInstance = hotRef.current?.hotInstance;
    if (!hotInstance) return;

    const originalRender = hotInstance.render.bind(hotInstance);
    let renderCount = 0;

    hotInstance.render = function (...args: unknown[]) {
      const start = performance.now();
      const result = originalRender.apply(this, args as []);
      const duration = performance.now() - start;

      renderCount++;
      renderTimes.current.push(duration);

      // Keep only last 100 measurements
      if (renderTimes.current.length > 100) {
        renderTimes.current.shift();
      }

      const avgRenderTime =
        renderTimes.current.reduce((a, b) => a + b, 0) /
        renderTimes.current.length;

      setMetrics((prev) => ({
        ...prev,
        renderCount,
        avgRenderTime,
        lastRenderTime: duration,
      }));

      if (duration > 50) {
        console.warn(
          `⚠️ Slow render detected: ${duration.toFixed(2)}ms (target: <16ms for 60fps)`
        );
      }

      return result;
    };

    return () => {
      hotInstance.render = originalRender;
    };
  }, [enabled, hotRef]);

  // Track scroll FPS
  useEffect(() => {
    if (!enabled) return;

    const measureFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const elapsed = now - lastFrameTime.current;

      if (elapsed >= 1000) {
        const fps = (frameCount.current / elapsed) * 1000;
        setMetrics((prev) => ({ ...prev, scrollFPS: fps }));

        if (fps < 50) {
          console.warn(
            `⚠️ Low FPS detected: ${fps.toFixed(1)} (target: >55fps)`
          );
        }

        frameCount.current = 0;
        lastFrameTime.current = now;
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  // Track memory usage
  useEffect(() => {
    if (!enabled) return;

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1048576;

        setMetrics((prev) => ({ ...prev, memoryUsage: usedMB }));

        if (usedMB > 200) {
          console.warn(
            `⚠️ High memory usage: ${usedMB.toFixed(2)}MB (target: <100MB)`
          );
        }
      }
    };

    const interval = setInterval(measureMemory, 5000);
    return () => clearInterval(interval);
  }, [enabled]);

  // Public methods for tracking custom operations
  const trackEdit = (duration: number) => {
    if (!enabled) return;

    editTimes.current.push(duration);
    if (editTimes.current.length > 100) {
      editTimes.current.shift();
    }

    const avgEditTime =
      editTimes.current.reduce((a, b) => a + b, 0) / editTimes.current.length;

    setMetrics((prev) => ({
      ...prev,
      editCount: prev.editCount + 1,
      avgEditTime,
    }));

    if (duration > 100) {
      console.warn(
        `⚠️ Slow edit detected: ${duration.toFixed(2)}ms (target: <50ms)`
      );
    }
  };

  const trackSearch = (duration: number) => {
    if (!enabled) return;

    searchTimes.current.push(duration);
    if (searchTimes.current.length > 100) {
      searchTimes.current.shift();
    }

    const avgSearchTime =
      searchTimes.current.reduce((a, b) => a + b, 0) /
      searchTimes.current.length;

    setMetrics((prev) => ({
      ...prev,
      searchCount: prev.searchCount + 1,
      avgSearchTime,
    }));

    if (duration > 300) {
      console.warn(
        `⚠️ Slow search detected: ${duration.toFixed(2)}ms (target: <300ms)`
      );
    }
  };

  const logMetrics = () => {
    if (!enabled) return;

    console.group('📊 Handsontable Performance Metrics');
    console.table({
      'Render Count': metrics.renderCount,
      'Avg Render Time': `${metrics.avgRenderTime.toFixed(2)}ms`,
      'Last Render Time': `${metrics.lastRenderTime.toFixed(2)}ms`,
      'Edit Count': metrics.editCount,
      'Avg Edit Time': `${metrics.avgEditTime.toFixed(2)}ms`,
      'Search Count': metrics.searchCount,
      'Avg Search Time': `${metrics.avgSearchTime.toFixed(2)}ms`,
      'Scroll FPS': `${metrics.scrollFPS.toFixed(1)}`,
      'Memory Usage': `${metrics.memoryUsage.toFixed(2)}MB`,
    });
    console.groupEnd();
  };

  const reset = () => {
    renderTimes.current = [];
    editTimes.current = [];
    searchTimes.current = [];
    setMetrics({
      mountTime: 0,
      renderCount: 0,
      avgRenderTime: 0,
      lastRenderTime: 0,
      editCount: 0,
      avgEditTime: 0,
      searchCount: 0,
      avgSearchTime: 0,
      scrollFPS: 0,
      memoryUsage: 0,
    });
  };

  return {
    metrics,
    trackEdit,
    trackSearch,
    logMetrics,
    reset,
  };
}

/**
 * Example usage in DataGrid component:
 *
 * const { metrics, trackEdit, trackSearch, logMetrics } = useHandsontablePerformance(hotRef);
 *
 * // In handleDataChange:
 * const start = performance.now();
 * // ... edit logic
 * trackEdit(performance.now() - start);
 *
 * // In search effect:
 * const start = performance.now();
 * // ... search logic
 * trackSearch(performance.now() - start);
 *
 * // To view metrics in console:
 * logMetrics();
 */
