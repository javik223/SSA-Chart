'use client';

import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';
import { Separator } from '@/components/ui/separator';

export function RadialAreaSettings() {
  const radialInnerRadius = useChartStore( ( state ) => state.radialInnerRadius );
  const setRadialInnerRadius = useChartStore( ( state ) => state.setRadialInnerRadius );

  return (
    <div className='settings-container'>
      <FormSection title='Geometry'>
        <FormRow>
          <FormCol>
            <FormField
              type='number'
              label='Inner Radius Ratio'
              value={ radialInnerRadius }
              onChange={ ( v ) => setRadialInnerRadius( v ?? 0.2 ) }
              min={ 0 }
              max={ 1 }
              step={ 0.05 }
            />
          </FormCol>
          <FormCol>
            <FormField
              type='number'
              label='Grid Inner Radius Ratio'
              value={ useChartStore( ( state ) => state.radialGridInnerRadiusRatio ) }
              onChange={ ( v ) => useChartStore.getState().setRadialGridInnerRadiusRatio( v ?? 0.9 ) }
              min={ 0 }
              max={ 1.5 }
              step={ 0.01 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Curve Style'>
        <FormRow>
          <FormCol>
            <FormField
              type='select'
              label='Interpolation'
              value={ useChartStore( ( state ) => state.curveType ) }
              onChange={ useChartStore( ( state ) => state.setCurveType ) }
              options={ [
                { label: 'Linear', value: 'linear' },
                { label: 'Cardinal', value: 'cardinal' },
                { label: 'Catmull-Rom', value: 'catmullRom' },
                { label: 'Natural', value: 'natural' },
              ] }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Grid Colors'>
        <FormRow>
          <FormCol>
            <FormField
              type='color'
              label='Domain Color'
              value={ useChartStore( ( state ) => state.radialDomainColor ) }
              onChange={ useChartStore( ( state ) => state.setRadialDomainColor ) }
            />
          </FormCol>
          <FormCol>
            <FormField
              type='color'
              label='Tick Color'
              value={ useChartStore( ( state ) => state.radialTickColor ) }
              onChange={ useChartStore( ( state ) => state.setRadialTickColor ) }
            />
          </FormCol>
        </FormRow>
      </FormSection>
    </div>
  );
}
