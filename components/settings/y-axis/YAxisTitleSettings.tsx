'use client';

import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';

export function YAxisTitleSettings() {
  const yAxisTitle = useChartStore( ( state ) => state.yAxisTitle );
  const setYAxisTitle = useChartStore( ( state ) => state.setYAxisTitle );
  const yAxisTitleType = useChartStore( ( state ) => state.yAxisTitleType );
  const setYAxisTitleType = useChartStore( ( state ) => state.setYAxisTitleType );
  const yAxisTitlePosition = useChartStore( ( state ) => state.yAxisTitlePosition );
  const setYAxisTitlePosition = useChartStore( ( state ) => state.setYAxisTitlePosition );
  const yAxisTitleWeight = useChartStore( ( state ) => state.yAxisTitleWeight );
  const setYAxisTitleWeight = useChartStore( ( state ) => state.setYAxisTitleWeight );
  const yAxisTitleColor = useChartStore( ( state ) => state.yAxisTitleColor );
  const setYAxisTitleColor = useChartStore( ( state ) => state.setYAxisTitleColor );
  const yAxisTitleSize = useChartStore( ( state ) => state.yAxisTitleSize );
  const setYAxisTitleSize = useChartStore( ( state ) => state.setYAxisTitleSize );
  const yAxisTitlePadding = useChartStore( ( state ) => state.yAxisTitlePadding );
  const setYAxisTitlePadding = useChartStore( ( state ) => state.setYAxisTitlePadding );

  return (
    <>
      <FormSection title='Axis title'>
        <FormField
          type='select'
          label='Type'
          value={ yAxisTitleType }
          onChange={ setYAxisTitleType }
          options={ [
            { value: 'auto', label: 'Auto' },
            { value: 'custom', label: 'Custom' },
          ] }
        />

        <FormField
          type='text'
          label='Text'
          value={ yAxisTitle }
          onChange={ setYAxisTitle }
          placeholder='Enter axis title'
        />
      </FormSection>

      <Separator />

      <FormSection title='Axis title styling'>
        <FormField
          type='select'
          label='Position'
          value={ yAxisTitlePosition }
          onChange={ setYAxisTitlePosition }
          options={ [
            { value: 'side', label: 'Side' },
            { value: 'top-bottom', label: 'Top/bottom' },
          ] }
        />

        <FormField
          type='select'
          label='Weight'
          value={ yAxisTitleWeight }
          onChange={ setYAxisTitleWeight }
          options={ [
            { value: 'regular', label: 'Regular' },
            { value: 'bold', label: 'Bold' },
          ] }
        />

        <FormField
          type='color'
          label='Color'
          value={ yAxisTitleColor }
          onChange={ setYAxisTitleColor }
        />

        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Size (px)'
            value={ yAxisTitleSize }
            onChange={ ( v ) => setYAxisTitleSize( v ?? 12 ) }
            min={ 8 }
            max={ 32 }
          />
          <FormField
            type='number'
            label='Padding (px)'
            value={ yAxisTitlePadding }
            onChange={ ( v ) => setYAxisTitlePadding( v ?? 40 ) }
            min={ 0 }
          />
        </FormGrid>
      </FormSection>
    </>
  );
}
