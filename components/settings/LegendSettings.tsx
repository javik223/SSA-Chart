'use client';

import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

export function LegendSettings() {
  const legendShow = useChartStore( ( state ) => state.legendShow );
  const setLegendShow = useChartStore( ( state ) => state.setLegendShow );
  const legendPosition = useChartStore( ( state ) => state.legendPosition );
  const setLegendPosition = useChartStore( ( state ) => state.setLegendPosition );
  const legendAlignment = useChartStore( ( state ) => state.legendAlignment );
  const setLegendAlignment = useChartStore( ( state ) => state.setLegendAlignment );
  const legendFontSize = useChartStore( ( state ) => state.legendFontSize );
  const setLegendFontSize = useChartStore( ( state ) => state.setLegendFontSize );
  const legendShowValues = useChartStore( ( state ) => state.legendShowValues );
  const setLegendShowValues = useChartStore( ( state ) => state.setLegendShowValues );
  const legendGap = useChartStore( ( state ) => state.legendGap );
  const setLegendGap = useChartStore( ( state ) => state.setLegendGap );
  const legendPaddingTop = useChartStore( ( state ) => state.legendPaddingTop );
  const setLegendPaddingTop = useChartStore( ( state ) => state.setLegendPaddingTop );
  const legendPaddingRight = useChartStore( ( state ) => state.legendPaddingRight );
  const setLegendPaddingRight = useChartStore( ( state ) => state.setLegendPaddingRight );
  const legendPaddingBottom = useChartStore( ( state ) => state.legendPaddingBottom );
  const setLegendPaddingBottom = useChartStore( ( state ) => state.setLegendPaddingBottom );
  const legendPaddingLeft = useChartStore( ( state ) => state.legendPaddingLeft );
  const setLegendPaddingLeft = useChartStore( ( state ) => state.setLegendPaddingLeft );

  return (
    <div className='settings-container'>
      <FormField
        label='Show Legend'
        type='switch'
        checked={ legendShow }
        onChange={ setLegendShow }
      />

      { legendShow && (
        <>
          <Separator />

          <FormSection>
            <FormRow gap='md'>
              <FormCol span='auto'>
                <FormField
                  type='button-group'
                  label='Position'
                  value={ legendPosition }
                  onChange={ setLegendPosition as ( value: string ) => void }
                  options={ [
                    {
                      value: 'top',
                      icon: <ArrowUp className='icon-sm' />,
                    },
                    {
                      value: 'right',
                      icon: <ArrowRight className='icon-sm' />,
                    },
                    {
                      value: 'bottom',
                      icon: <ArrowDown className='icon-sm' />,
                    },
                    {
                      value: 'left',
                      icon: <ArrowLeft className='icon-sm' />,
                    },
                  ] }
                />
              </FormCol>

              <FormCol span='auto'>
                <FormField
                  type='button-group'
                  label='Alignment'
                  value={ legendAlignment }
                  onChange={ setLegendAlignment as ( value: string ) => void }
                  options={ [
                    {
                      value: 'start',
                      icon: <AlignLeft className='icon-sm' />,
                    },
                    {
                      value: 'center',
                      icon: <AlignCenter className='icon-sm' />,
                    },
                    {
                      value: 'end',
                      icon: <AlignRight className='icon-sm' />,
                    },
                  ] }
                />
              </FormCol>
            </FormRow>
          </FormSection>

          <Separator />

          <FormSection title='Spacing'>
            <FormGrid columns={ 2 }>
              <FormField
                type='number'
                label='Size'
                value={ legendFontSize }
                onChange={ ( v ) => setLegendFontSize( v ?? 1 ) }
                min={ 0.1 }
                max={ 10.0 }
                step={ 0.1 }
              />
              <FormField
                type='number'
                label='Gap (px)'
                value={ legendGap }
                onChange={ ( v ) => setLegendGap( v ?? 5 ) }
                min={ 5 }
                max={ 50 }
              />
            </FormGrid>
          </FormSection>

          <Separator />

          <FormField
            label='Show Values'
            description='Display numeric values next to legend items'
            type='switch'
            checked={ legendShowValues }
            onChange={ setLegendShowValues }
          />

          <Separator />

          <FormSection title='Padding (px)'>
            <FormGrid columns={ 4 }>
              <FormField
                type='number'
                label='Top'
                value={ legendPaddingTop }
                onChange={ ( v ) => setLegendPaddingTop( v ?? 0 ) }
                min={ 0 }
              />
              <FormField
                type='number'
                label='Right'
                value={ legendPaddingRight }
                onChange={ ( v ) => setLegendPaddingRight( v ?? 0 ) }
                min={ 0 }
              />
              <FormField
                type='number'
                label='Bottom'
                value={ legendPaddingBottom }
                onChange={ ( v ) => setLegendPaddingBottom( v ?? 0 ) }
                min={ 0 }
              />
              <FormField
                type='number'
                label='Left'
                value={ legendPaddingLeft }
                onChange={ ( v ) => setLegendPaddingLeft( v ?? 0 ) }
                min={ 0 }
              />
            </FormGrid>
          </FormSection>
        </>
      ) }
    </div>
  );
}
