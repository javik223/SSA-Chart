'use client';

import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';

export function YAxisGridSettings() {
  const yAxisGridColor = useChartStore( ( state ) => state.yAxisGridColor );
  const setYAxisGridColor = useChartStore( ( state ) => state.setYAxisGridColor );
  const yAxisGridStyle = useChartStore( ( state ) => state.yAxisGridStyle );
  const setYAxisGridStyle = useChartStore( ( state ) => state.setYAxisGridStyle );
  const yAxisGridWidth = useChartStore( ( state ) => state.yAxisGridWidth );
  const setYAxisGridWidth = useChartStore( ( state ) => state.setYAxisGridWidth );
  const yAxisGridDash = useChartStore( ( state ) => state.yAxisGridDash );
  const setYAxisGridDash = useChartStore( ( state ) => state.setYAxisGridDash );
  const yAxisGridSpace = useChartStore( ( state ) => state.yAxisGridSpace );
  const setYAxisGridSpace = useChartStore( ( state ) => state.setYAxisGridSpace );
  const yAxisGridExtend = useChartStore( ( state ) => state.yAxisGridExtend );
  const setYAxisGridExtend = useChartStore( ( state ) => state.setYAxisGridExtend );
  const yAxisLineColor = useChartStore( ( state ) => state.yAxisLineColor );
  const setYAxisLineColor = useChartStore( ( state ) => state.setYAxisLineColor );
  const yAxisLineWidth = useChartStore( ( state ) => state.yAxisLineWidth );
  const setYAxisLineWidth = useChartStore( ( state ) => state.setYAxisLineWidth );
  const yAxisTickLength = useChartStore( ( state ) => state.yAxisTickLength );
  const setYAxisTickLength = useChartStore( ( state ) => state.setYAxisTickLength );
  const yAxisShowAxisLine = useChartStore( ( state ) => state.yAxisShowAxisLine );
  const setYAxisShowAxisLine = useChartStore( ( state ) => state.setYAxisShowAxisLine );
  const yAxisEdgePadding = useChartStore( ( state ) => state.yAxisEdgePadding );
  const setYAxisEdgePadding = useChartStore( ( state ) => state.setYAxisEdgePadding );
  const yAxisShowGrid = useChartStore( ( state ) => state.yAxisShowGrid );
  const setYAxisShowGrid = useChartStore( ( state ) => state.setYAxisShowGrid );

  return (
    <>
      <FormSection title='Tick marks & axis line'>
        <FormGrid columns={ 2 }>
          <FormField
            type='color'
            label='Line color'
            value={ yAxisLineColor }
            onChange={ setYAxisLineColor }
          />
          <FormField
            type='number'
            label='Line width'
            value={ yAxisLineWidth }
            onChange={ ( v ) => setYAxisLineWidth( v ?? 1 ) }
            min={ 0 }
            max={ 10 }
            step={ 0.5 }
          />
        </FormGrid>

        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Tick length'
            value={ yAxisTickLength }
            onChange={ ( v ) => setYAxisTickLength( v ?? 6 ) }
            min={ 0 }
          />
          <FormField
            type='button-group'
            label='Gridlines'
            value={ yAxisShowGrid ? 'on' : 'off' }
            onChange={ ( value ) => setYAxisShowGrid( value === 'on' ) }
            options={ [
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ] }
          />
        </FormGrid>

        <FormField
          type='switch'
          label='Axis line'
          checked={ yAxisShowAxisLine }
          onChange={ setYAxisShowAxisLine }
        />

        <FormField
          type='number'
          label='Edge padding (px)'
          value={ yAxisEdgePadding }
          onChange={ ( v ) => setYAxisEdgePadding( v ?? 0 ) }
          min={ 0 }
        />
      </FormSection>

      <Separator />

      <FormSection title='Gridlines'>
        <FormField
          type='color'
          label='Color'
          value={ yAxisGridColor }
          onChange={ setYAxisGridColor }
        />

        <FormField
          type='select'
          label='Style'
          value={ yAxisGridStyle }
          onChange={ setYAxisGridStyle }
          options={ [
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
          ] }
        />

        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Width (px)'
            value={ yAxisGridWidth }
            onChange={ ( v ) => setYAxisGridWidth( v ?? 1 ) }
            min={ 0.5 }
            max={ 5 }
            step={ 0.5 }
          />
          <FormField
            type='number'
            label='Dash'
            value={ yAxisGridDash }
            onChange={ ( v ) => setYAxisGridDash( v ?? 0 ) }
            min={ 0 }
          />
        </FormGrid>

        <FormField
          type='number'
          label='Space'
          value={ yAxisGridSpace }
          onChange={ ( v ) => setYAxisGridSpace( v ?? 0 ) }
          min={ 0 }
        />

        <FormField
          type='switch'
          label='Extend'
          description='Extend grid lines between categories'
          checked={ yAxisGridExtend }
          onChange={ setYAxisGridExtend }
        />
      </FormSection>
    </>
  );
}
