'use client';

import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';
import { Separator } from '@/components/ui/separator';

export function RadialBarSettings() {
  const radialInnerRadius = useChartStore( ( state ) => state.radialInnerRadius );
  const setRadialInnerRadius = useChartStore( ( state ) => state.setRadialInnerRadius );
  const radialPadAngle = useChartStore( ( state ) => state.radialPadAngle );
  const setRadialPadAngle = useChartStore( ( state ) => state.setRadialPadAngle );
  const radialCornerRadius = useChartStore( ( state ) => state.radialCornerRadius );
  const setRadialCornerRadius = useChartStore( ( state ) => state.setRadialCornerRadius );
  const radialStartAngle = useChartStore( ( state ) => state.radialStartAngle );
  const setRadialStartAngle = useChartStore( ( state ) => state.setRadialStartAngle );
  const radialEndAngle = useChartStore( ( state ) => state.radialEndAngle );
  const setRadialEndAngle = useChartStore( ( state ) => state.setRadialEndAngle );

  return (
    <div className='settings-container'>
      <FormSection title='Geometry'>
        <FormRow>
          <FormCol>
            <FormField
              type='number'
              label='Inner Radius'
              value={ radialInnerRadius }
              onChange={ ( v ) => setRadialInnerRadius( v ?? 180 ) }
              min={ 0 }
              max={ 500 }
              step={ 10 }
            />
          </FormCol>
          <FormCol>
            <FormField
              type='number'
              label='Pad Angle'
              value={ radialPadAngle }
              onChange={ ( v ) => setRadialPadAngle( v ?? 0.01 ) }
              min={ 0 }
              max={ 0.5 }
              step={ 0.01 }
            />
          </FormCol>
        </FormRow>
        <FormRow>
          <FormCol>
            <FormField
              type='number'
              label='Corner Radius'
              value={ radialCornerRadius }
              onChange={ ( v ) => setRadialCornerRadius( v ?? 0 ) }
              min={ 0 }
              max={ 20 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Angles'>
        <FormRow>
          <FormCol>
            <FormField
              type='number'
              label='Start Angle'
              value={ radialStartAngle }
              onChange={ ( v ) => setRadialStartAngle( v ?? 0 ) }
              min={ -360 }
              max={ 360 }
              step={ 15 }
            />
          </FormCol>
          <FormCol>
            <FormField
              type='number'
              label='End Angle'
              value={ radialEndAngle }
              onChange={ ( v ) => setRadialEndAngle( v ?? 360 ) }
              min={ -360 }
              max={ 360 }
              step={ 15 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Colors'>
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
