'use client';

import { useEffect, useRef } from 'react';
import { initializeCharts } from '@/lib/chartRegistrations';

/**
 * Client component that initializes the chart registry once
 * This ensures charts are registered before any components try to use them
 */
export function ChartInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initializeCharts();
      initialized.current = true;
    }
  }, []);

  return null;
}
