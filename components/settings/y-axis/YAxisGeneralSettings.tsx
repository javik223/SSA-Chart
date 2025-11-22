'use client';

import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { useChartStore } from '@/store/useChartStore';

export function YAxisGeneralSettings() {
  const yAxisShow = useChartStore( ( state ) => state.yAxisShow );
  const setYAxisShow = useChartStore( ( state ) => state.setYAxisShow );
  const yAxisPosition = useChartStore( ( state ) => state.yAxisPosition );
  const setYAxisPosition = useChartStore( ( state ) => state.setYAxisPosition );

  return (
    <>
      <FormField
        type='button-group'
        label='Axis visible'
        value={ yAxisShow ? 'on' : 'off' }
        onChange={ ( value ) => setYAxisShow( value === 'on' ) }
        options={ [
          { value: 'on', label: 'Axis visible' },
          { value: 'off', label: 'Axis hidden' },
        ] }
      />

      <FormSection title='Position'>
        <FormField
          type='select'
          value={ yAxisPosition }
          onChange={ setYAxisPosition }
          options={ [
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
            { value: 'hidden', label: 'Hidden' },
          ] }
        />
      </FormSection>
    </>
  );
}
