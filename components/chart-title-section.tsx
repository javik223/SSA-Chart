'use client';

import { ChartTitle } from '@/components/chart-title';
import { ChartDescription } from '@/components/chart-description';
import { useChartStore } from '@/store/useChartStore';

/**
 * Chart title section component that groups title and description together
 * as a single section for layout ordering purposes
 */
export function ChartTitleSection() {
  const chartTitle = useChartStore((state) => state.chartTitle);
  const chartDescription = useChartStore((state) => state.chartDescription);

  // If both title and description are empty, don't render anything
  if (!chartTitle && !chartDescription) return null;

  return (
    <div className='flex flex-col'>
      <ChartTitle />
      <ChartDescription />
    </div>
  );
}
