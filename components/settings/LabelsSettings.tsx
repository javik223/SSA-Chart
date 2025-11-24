'use client';

import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';

export function LabelsSettings() {
  const labelShow = useChartStore( ( state ) => state.labelShow );
  const setLabelShow = useChartStore( ( state ) => state.setLabelShow );

  const labelFontSize = useChartStore( ( state ) => state.labelFontSize );
  const setLabelFontSize = useChartStore( ( state ) => state.setLabelFontSize );

  const labelColor = useChartStore( ( state ) => state.labelColor );
  const setLabelColor = useChartStore( ( state ) => state.setLabelColor );

  const labelFontWeight = useChartStore( ( state ) => state.labelFontWeight );
  const setLabelFontWeight = useChartStore( ( state ) => state.setLabelFontWeight );

  return (
    <div className='settings-container'>
      {/* Show/Hide Labels */ }
      <FormSection title='Visibility'>
        <FormField
          type='switch'
          label='Show Labels'
          checked={ labelShow }
          onChange={ setLabelShow }
        />
      </FormSection>

      <Separator />

      {/* Label Styling */ }
      <FormSection title='Label Styling'>
        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Font Size (px)'
            value={ labelFontSize }
            onChange={ ( v ) => setLabelFontSize( v ?? 14 ) }
            min={ 8 }
            max={ 48 }
          />
          <FormField
            type='color'
            label='Color'
            value={ labelColor }
            onChange={ setLabelColor }
          />
        </FormGrid>

        <FormField
          type='select'
          label='Font Weight'
          value={ labelFontWeight }
          onChange={ setLabelFontWeight }
          options={ [
            { value: 'normal', label: 'Normal' },
            { value: 'bold', label: 'Bold' },
            { value: '100', label: '100 (Thin)' },
            { value: '200', label: '200 (Extra Light)' },
            { value: '300', label: '300 (Light)' },
            { value: '400', label: '400 (Normal)' },
            { value: '500', label: '500 (Medium)' },
            { value: '600', label: '600 (Semi Bold)' },
            { value: '700', label: '700 (Bold)' },
            { value: '800', label: '800 (Extra Bold)' },
            { value: '900', label: '900 (Black)' },
          ] }
        />
      </FormSection>
    </div>
  );
}
