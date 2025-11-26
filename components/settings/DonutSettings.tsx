'use client';

import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';
import { Separator } from '@/components/ui/separator';

export function DonutSettings() {
  const donutInnerRadius = useChartStore( ( state ) => state.donutInnerRadius );
  const setDonutInnerRadius = useChartStore( ( state ) => state.setDonutInnerRadius );
  const donutPadAngle = useChartStore( ( state ) => state.donutPadAngle );
  const setDonutPadAngle = useChartStore( ( state ) => state.setDonutPadAngle );
  const donutCornerRadius = useChartStore( ( state ) => state.donutCornerRadius );
  const setDonutCornerRadius = useChartStore( ( state ) => state.setDonutCornerRadius );
  const donutStartAngle = useChartStore( ( state ) => state.donutStartAngle );
  const setDonutStartAngle = useChartStore( ( state ) => state.setDonutStartAngle );
  const donutEndAngle = useChartStore( ( state ) => state.donutEndAngle );
  const setDonutEndAngle = useChartStore( ( state ) => state.setDonutEndAngle );
  const donutShowTotal = useChartStore( ( state ) => state.donutShowTotal );
  const setDonutShowTotal = useChartStore( ( state ) => state.setDonutShowTotal );
  const donutCenterLabel = useChartStore( ( state ) => state.donutCenterLabel );
  const setDonutCenterLabel = useChartStore( ( state ) => state.setDonutCenterLabel );

  return (
    <div className='settings-container'>
      <FormSection title='Geometry'>
        <FormRow>
          <FormCol>
            <FormField
              type='number'
              label='Inner Radius'
              value={ donutInnerRadius }
              onChange={ ( v ) => setDonutInnerRadius( v ?? 0.6 ) }
              min={ 0 }
              max={ 0.95 }
              step={ 0.05 }
            />
          </FormCol>
          <FormCol>
            <FormField
              type='number'
              label='Pad Angle'
              value={ donutPadAngle }
              onChange={ ( v ) => setDonutPadAngle( v ?? 0 ) }
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
              value={ donutCornerRadius }
              onChange={ ( v ) => setDonutCornerRadius( v ?? 0 ) }
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
              value={ donutStartAngle }
              onChange={ ( v ) => setDonutStartAngle( v ?? 0 ) }
              min={ -360 }
              max={ 360 }
              step={ 15 }
            />
          </FormCol>
          <FormCol>
            <FormField
              type='number'
              label='End Angle'
              value={ donutEndAngle }
              onChange={ ( v ) => setDonutEndAngle( v ?? 360 ) }
              min={ -360 }
              max={ 360 }
              step={ 15 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Center Content'>
        <FormField
          type='switch'
          label='Show Total'
          checked={ donutShowTotal }
          onChange={ setDonutShowTotal }
        />

        { donutShowTotal && (
          <FormField
            type='text'
            label='Center Label'
            value={ donutCenterLabel }
            onChange={ setDonutCenterLabel }
            placeholder='Total'
          />
        ) }
      </FormSection>
    </div>
  );
}
