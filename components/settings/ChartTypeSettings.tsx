'use client';

import { useChartStore } from '@/store/useChartStore';
import { getChartsByCategory } from '@/lib/chartRegistry';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';

export function ChartTypeSettings() {
  const chartType = useChartStore((state) => state.chartType);
  const setChartType = useChartStore((state) => state.setChartType);
  const gridMode = useChartStore((state) => state.gridMode);
  const setGridMode = useChartStore((state) => state.setGridMode);
  const heightMode = useChartStore((state) => state.heightMode);
  const setHeightMode = useChartStore((state) => state.setHeightMode);
  const aggregationMode = useChartStore((state) => state.aggregationMode);
  const setAggregationMode = useChartStore((state) => state.setAggregationMode);

  // Flatten chart options for FormField select (doesn't support grouped options)
  const chartTypeOptions = getChartsByCategory().flatMap(({ charts }) =>
    charts
      .filter((chart) => chart.status !== 'coming-soon')
      .map((chart) => ({
        value: chart.type,
        label: chart.name,
      }))
  );

  return (
    <div>
      <FormSection>
        <FormField
          type='select'
          value={chartType}
          onChange={setChartType as (value: string) => void}
          options={chartTypeOptions}
        />

        <FormSection>
          <FormField
            type='button-group'
            label='Grid mode'
            value={gridMode}
            onChange={setGridMode as (value: string) => void}
            options={[
              { value: 'single', label: 'Single chart' },
              { value: 'grid', label: 'Grid of charts' },
            ]}
          />

          <FormField
            type='button-group'
            label='Height mode'
            value={heightMode}
            onChange={setHeightMode as (value: string) => void}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 'standard', label: 'Standard' },
              { value: 'aspect', label: 'Aspect ratio' },
            ]}
          />

          <FormField
            type='button-group'
            label='Aggregation mode'
            value={aggregationMode}
            onChange={setAggregationMode as (value: string) => void}
            options={[
              { value: 'none', label: 'None' },
              { value: 'sum', label: 'Sum' },
              { value: 'average', label: 'Average' },
              { value: 'count', label: 'Count' },
            ]}
          />
        </FormSection>
      </FormSection>
    </div>
  );
}
