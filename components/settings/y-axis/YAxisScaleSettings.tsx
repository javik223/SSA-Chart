'use client';

import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { useChartStore } from '@/store/useChartStore';

export function YAxisScaleSettings() {
  const yAxisScaleType = useChartStore( ( state ) => state.yAxisScaleType );
  const setYAxisScaleType = useChartStore( ( state ) => state.setYAxisScaleType );
  const yAxisMin = useChartStore( ( state ) => state.yAxisMin );
  const setYAxisMin = useChartStore( ( state ) => state.setYAxisMin );
  const yAxisMax = useChartStore( ( state ) => state.yAxisMax );
  const setYAxisMax = useChartStore( ( state ) => state.setYAxisMax );
  const yAxisFlip = useChartStore( ( state ) => state.yAxisFlip );
  const setYAxisFlip = useChartStore( ( state ) => state.setYAxisFlip );
  const yAxisConfigureDefaultMinMax = useChartStore( ( state ) => state.yAxisConfigureDefaultMinMax );
  const setYAxisConfigureDefaultMinMax = useChartStore( ( state ) => state.setYAxisConfigureDefaultMinMax );
  const yAxisRoundMin = useChartStore( ( state ) => state.yAxisRoundMin );
  const setYAxisRoundMin = useChartStore( ( state ) => state.setYAxisRoundMin );
  const yAxisRoundMax = useChartStore( ( state ) => state.yAxisRoundMax );
  const setYAxisRoundMax = useChartStore( ( state ) => state.setYAxisRoundMax );

  return (
    <FormSection title='Scale'>
      <FormField
        type='select'
        label='Type'
        value={ yAxisScaleType }
        onChange={ setYAxisScaleType }
        options={ [
          { value: 'linear', label: 'Linear' },
          { value: 'log', label: 'Log' },
        ] }
      />

      <FormGrid columns={ 2 }>
        <FormField
          type='number'
          label='Min'
          value={ yAxisMin ?? '' }
          onChange={ setYAxisMin }
          placeholder='Auto'
        />
        <FormField
          type='number'
          label='Max'
          value={ yAxisMax ?? '' }
          onChange={ setYAxisMax }
          placeholder='Auto'
        />
      </FormGrid>

      <FormField
        type='switch'
        label='Flip axis'
        checked={ yAxisFlip }
        onChange={ setYAxisFlip }
      />

      <FormField
        type='switch'
        label='Configure default min/max'
        checked={ yAxisConfigureDefaultMinMax }
        onChange={ setYAxisConfigureDefaultMinMax }
      />

      <FormSection title='Round min/max'>
        <FormGrid columns={ 2 }>
          <FormField
            type='button-group'
            label='Min'
            value={ yAxisRoundMin ? 'on' : 'off' }
            onChange={ ( value ) => setYAxisRoundMin( value === 'on' ) }
            options={ [
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ] }
          />
          <FormField
            type='button-group'
            label='Max'
            value={ yAxisRoundMax ? 'on' : 'off' }
            onChange={ ( value ) => setYAxisRoundMax( value === 'on' ) }
            options={ [
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ] }
          />
        </FormGrid>
      </FormSection>
    </FormSection>
  );
}
