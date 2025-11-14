'use client';

import { useMemo, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { getChart } from '@/lib/chartRegistry';
import { ChartTransition } from './ChartTransition';
import { getColorPalette } from '@/lib/colorPalettes';

export const BasicChart = memo(function BasicChart() {
  // Use selective subscription to only re-render when chart-related data changes
  // This prevents re-renders when title, description, footer, or legend settings change
  const data = useChartStore((state) => state.data);
  const columnMapping = useChartStore((state) => state.columnMapping);
  const chartType = useChartStore((state) => state.chartType);
  const aggregationMode = useChartStore((state) => state.aggregationMode);
  const previewWidth = useChartStore((state) => state.previewWidth);
  const previewHeight = useChartStore((state) => state.previewHeight);
  const colorPalette = useChartStore((state) => state.colorPalette);
  const colorMode = useChartStore((state) => state.colorMode);

  // Transform data for chart
  const chartData = useMemo(() => {
    if (!data || data.length < 2) return [];
    if (columnMapping.labels === null || columnMapping.values.length === 0) {
      return [];
    }

    const headers = data[0];
    const labelIndex = columnMapping.labels;
    const valueIndices = columnMapping.values;

    // Get label column name
    const labelKey = headers[labelIndex];

    // Get value column names
    const valueKeys = valueIndices.map((idx) => headers[idx]);

    // Transform data rows
    const rows = data.slice(1);

    if (aggregationMode === 'none') {
      // No aggregation - use data as is
      return rows.map((row) => {
        const item: Record<string, string | number> = {
          [labelKey]: row[labelIndex] || '',
        };

        valueIndices.forEach((idx, i) => {
          const value = parseFloat(row[idx]);
          item[valueKeys[i]] = isNaN(value) ? 0 : value;
        });

        return item;
      });
    } else {
      // Aggregate data by label
      const aggregated: Record<string, Record<string, number[]>> = {};

      rows.forEach((row) => {
        const label = String(row[labelIndex] || '');
        if (!aggregated[label]) {
          aggregated[label] = {};
          valueKeys.forEach((key) => {
            aggregated[label][key] = [];
          });
        }

        valueIndices.forEach((idx, i) => {
          const value = parseFloat(row[idx]);
          if (!isNaN(value)) {
            aggregated[label][valueKeys[i]].push(value);
          }
        });
      });

      // Calculate aggregation
      return Object.entries(aggregated).map(([label, values]) => {
        const item: Record<string, string | number> = { [labelKey]: label };

        valueKeys.forEach((key) => {
          const nums = values[key];
          if (nums.length === 0) {
            item[key] = 0;
          } else if (aggregationMode === 'sum') {
            item[key] = nums.reduce((a, b) => a + b, 0);
          } else if (aggregationMode === 'average') {
            item[key] = nums.reduce((a, b) => a + b, 0) / nums.length;
          } else if (aggregationMode === 'count') {
            item[key] = nums.length;
          }
        });

        return item;
      });
    }
  }, [data, columnMapping, aggregationMode]);

  if (chartData.length === 0) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p className='text-sm text-zinc-500'>
          No data to display. Please select columns to visualize.
        </p>
      </div>
    );
  }

  const headers = data[0];
  const labelKey = headers[columnMapping.labels!];
  const valueKeys = columnMapping.values.map((idx) => headers[idx]);

  // Get colors from selected palette
  const palette = getColorPalette(colorPalette);

  const chartProps = {
    data: chartData,
    labelKey,
    valueKeys,
    width: previewWidth,
    height: previewHeight,
    colors: palette.colors,
    colorMode,
    // Disable embedded legend since we now use a standalone legend component
    legendShow: false,
  };

  // Get chart registration from registry
  const chartRegistration = getChart(chartType);

  // Render chart component dynamically from registry
  const renderChart = () => {
    if (!chartRegistration) {
      return (
        <div className='flex h-full items-center justify-center'>
          <p className='text-sm text-zinc-500'>
            Chart type &ldquo;{chartType}&rdquo; is not registered or not yet implemented.
          </p>
        </div>
      );
    }

    // Check if chart is coming soon
    if (chartRegistration.status === 'coming-soon') {
      return (
        <div className='flex h-full items-center justify-center flex-col gap-2'>
          <p className='text-sm font-medium text-zinc-700'>{chartRegistration.name}</p>
          <p className='text-xs text-zinc-500'>Coming soon</p>
        </div>
      );
    }

    const ChartComponent = chartRegistration.component;
    return <ChartComponent {...chartProps} />;
  };

  return (
    <ChartTransition chartType={chartType} transitionType='fade' duration={300}>
      <div className='w-full h-full'>
        {renderChart()}
      </div>
    </ChartTransition>
  );
});
