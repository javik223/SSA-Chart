'use client';

import { useChartStore } from '@/store/useChartStore';
import { getChartsByCategory } from '@/lib/chartRegistry';
import { getStatusLabel } from '@/lib/chartRegistrations';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

export function ChartTypeSettings() {
  const chartType = useChartStore( ( state ) => state.chartType );
  const setChartType = useChartStore( ( state ) => state.setChartType );
  const gridMode = useChartStore( ( state ) => state.gridMode );
  const setGridMode = useChartStore( ( state ) => state.setGridMode );
  const gridSplitBy = useChartStore( ( state ) => state.gridSplitBy );
  const setGridSplitBy = useChartStore( ( state ) => state.setGridSplitBy );
  const gridColumns = useChartStore( ( state ) => state.gridColumns );
  const setGridColumns = useChartStore( ( state ) => state.setGridColumns );
  const gridColumnsMobile = useChartStore( ( state ) => state.gridColumnsMobile );
  const setGridColumnsMobile = useChartStore( ( state ) => state.setGridColumnsMobile );
  const gridAspectRatio = useChartStore( ( state ) => state.gridAspectRatio );
  const setGridAspectRatio = useChartStore( ( state ) => state.setGridAspectRatio );
  const heightMode = useChartStore( ( state ) => state.heightMode );
  const setHeightMode = useChartStore( ( state ) => state.setHeightMode );
  const aggregationMode = useChartStore( ( state ) => state.aggregationMode );
  const setAggregationMode = useChartStore( ( state ) => state.setAggregationMode );

  // Group chart options for FormField select
  const chartTypeOptions = getChartsByCategory().map( ( { category, charts } ) => ( {
    label: category.name,
    options: charts.map( ( chart ) => {
      const statusLabel = getStatusLabel( chart.status );
      return {
        value: chart.type,
        label: (
          <span className='settings-header'>
            { chart.name }
            { statusLabel && (
              <span className='status-badge'>
                { statusLabel }
              </span>
            ) }
          </span>
        ),
        disabled: chart.status === 'coming-soon',
      };
    } ),
  } ) );

  return (
    <div className='settings-container'>
      <FormSection>
        <FormField
          type='select'
          value={ chartType }
          onChange={ setChartType as ( value: string ) => void }
          options={ chartTypeOptions }
        />

        <FormField
          type='button-group'
          label='Grid mode'
          value={ gridMode }
          onChange={ setGridMode as ( value: string ) => void }
          options={ [
            { value: 'single', label: 'Single chart' },
            { value: 'grid', label: 'Grid of charts' },
          ] }
        />

        { gridMode === 'grid' && (
          <FormRow>
            <FormCol>
              <FormField
                type='button-group'
                label='Split by'
                value={ gridSplitBy }
                onChange={ setGridSplitBy as ( value: string ) => void }
                options={ [
                  { value: 'label', label: 'By Label' },
                  { value: 'value', label: 'By Value' },
                ] }
              />
            </FormCol>
            <FormCol>
              <FormField
                type='select'
                label='Aspect ratio'
                value={ gridAspectRatio }
                onChange={ setGridAspectRatio as ( value: string ) => void }
                options={ [
                  { value: '16/9', label: '16:9 (Widescreen)' },
                  { value: '4/3', label: '4:3 (Standard)' },
                  { value: '1/1', label: '1:1 (Square)' },
                  { value: '21/9', label: '21:9 (Ultrawide)' },
                  { value: '3/2', label: '3:2 (Classic)' },
                  { value: '2/1', label: '2:1 (Panoramic)' },
                ] }
              />
            </FormCol>
          </FormRow>
        ) }

        { gridMode === 'grid' && (
          <FormRow>
            <FormCol>
              <FormField
                type='number'
                label='Grid columns'
                value={ gridColumns }
                onChange={ ( value ) => setGridColumns( Number( value ) ) }
                min={ 1 }
                max={ 6 }
              />
            </FormCol>
            <FormCol>
              <FormField
                type='number'
                label='Grid columns (Mobile)'
                value={ gridColumnsMobile }
                onChange={ ( value ) => setGridColumnsMobile( Number( value ) ) }
                min={ 1 }
                max={ 6 }
              />
            </FormCol>
          </FormRow>
        ) }

        <FormField
          type='button-group'
          label='Height mode'
          value={ heightMode }
          onChange={ setHeightMode as ( value: string ) => void }
          options={ [
            { value: 'auto', label: 'Auto' },
            { value: 'standard', label: 'Standard' },
            { value: 'aspect', label: 'Aspect ratio' },
          ] }
        />

        <FormField
          type='button-group'
          label='Aggregation mode'
          value={ aggregationMode }
          onChange={ setAggregationMode as ( value: string ) => void }
          options={ [
            { value: 'none', label: 'None' },
            { value: 'sum', label: 'Sum' },
            { value: 'average', label: 'Average' },
            { value: 'count', label: 'Count' },
          ] }
        />
      </FormSection>
    </div>
  );
}
