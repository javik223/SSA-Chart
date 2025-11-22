'use client';

import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';

export function YAxisTickSettings() {
  const yAxisTickPosition = useChartStore( ( state ) => state.yAxisTickPosition );
  const setYAxisTickPosition = useChartStore( ( state ) => state.setYAxisTickPosition );
  const yAxisLabelSize = useChartStore( ( state ) => state.yAxisLabelSize );
  const setYAxisLabelSize = useChartStore( ( state ) => state.setYAxisLabelSize );
  const yAxisLabelColor = useChartStore( ( state ) => state.yAxisLabelColor );
  const setYAxisLabelColor = useChartStore( ( state ) => state.setYAxisLabelColor );
  const yAxisLabelPadding = useChartStore( ( state ) => state.yAxisLabelPadding );
  const setYAxisLabelPadding = useChartStore( ( state ) => state.setYAxisLabelPadding );
  const yAxisLabelAngle = useChartStore( ( state ) => state.yAxisLabelAngle );
  const setYAxisLabelAngle = useChartStore( ( state ) => state.setYAxisLabelAngle );
  const yAxisLabelWeight = useChartStore( ( state ) => state.yAxisLabelWeight );
  const setYAxisLabelWeight = useChartStore( ( state ) => state.setYAxisLabelWeight );
  const yAxisLabelMaxLines = useChartStore( ( state ) => state.yAxisLabelMaxLines );
  const setYAxisLabelMaxLines = useChartStore( ( state ) => state.setYAxisLabelMaxLines );
  const yAxisLabelLineHeight = useChartStore( ( state ) => state.yAxisLabelLineHeight );
  const setYAxisLabelLineHeight = useChartStore( ( state ) => state.setYAxisLabelLineHeight );
  const yAxisLabelSpacing = useChartStore( ( state ) => state.yAxisLabelSpacing );
  const setYAxisLabelSpacing = useChartStore( ( state ) => state.setYAxisLabelSpacing );
  const yAxisTickMode = useChartStore( ( state ) => state.yAxisTickMode );
  const setYAxisTickMode = useChartStore( ( state ) => state.setYAxisTickMode );
  const yAxisTickNumber = useChartStore( ( state ) => state.yAxisTickNumber );
  const setYAxisTickNumber = useChartStore( ( state ) => state.setYAxisTickNumber );
  const yAxisOneTickLabelPerLine = useChartStore( ( state ) => state.yAxisOneTickLabelPerLine );
  const setYAxisOneTickLabelPerLine = useChartStore( ( state ) => state.setYAxisOneTickLabelPerLine );

  return (
    <>
      <FormSection title='Ticks & labels'>
        <FormField
          type='select'
          label='Position'
          value={ yAxisTickPosition }
          onChange={ setYAxisTickPosition }
          options={ [
            { value: 'outside', label: 'Default' },
            { value: 'inside', label: 'Active' },
            { value: 'cross', label: 'Below' },
          ] }
        />
      </FormSection>

      <Separator />

      <FormSection title='Labels'>


        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Size (px)'
            value={ yAxisLabelSize }
            onChange={ ( v ) => setYAxisLabelSize( v ?? 12 ) }
            min={ 8 }
            max={ 24 }
          />
          <FormField
            type='number'
            label='Padding (px)'
            value={ yAxisLabelPadding }
            onChange={ ( v ) => setYAxisLabelPadding( v ?? 8 ) }
            min={ 0 }
          />
        </FormGrid>

        <FormField
          type='number'
          label='Angle (degrees)'
          value={ yAxisLabelAngle }
          onChange={ ( v ) => setYAxisLabelAngle( v ?? 0 ) }
          min={ -90 }
          max={ 90 }
        />

        <Separator />

        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Max lines'
            value={ yAxisLabelMaxLines }
            onChange={ ( v ) => setYAxisLabelMaxLines( v ?? 1 ) }
            min={ 1 }
          />
          <FormField
            type='number'
            label='Line height'
            value={ yAxisLabelLineHeight }
            onChange={ ( v ) => setYAxisLabelLineHeight( v ?? 1.2 ) }
            min={ 0.8 }
            max={ 3 }
            step={ 0.1 }
          />
        </FormGrid>

        <FormField
          type='number'
          label='Spacing (px)'
          value={ yAxisLabelSpacing }
          onChange={ ( v ) => setYAxisLabelSpacing( v ?? 4 ) }
          min={ 0 }
        />
      </FormSection>

      <Separator />

      <FormSection title='Tick display'>
        <FormField
          type='select'
          label='Mode'
          value={ yAxisTickMode }
          onChange={ setYAxisTickMode }
          options={ [
            { value: 'auto', label: 'Auto' },
            { value: 'linear', label: 'Linear' },
            { value: 'array', label: 'Array' },
          ] }
        />

        { yAxisTickMode === 'linear' && (
          <FormField
            type='number'
            label='Tick count'
            value={ yAxisTickNumber }
            onChange={ ( v ) => setYAxisTickNumber( v ?? 5 ) }
            min={ 1 }
          />
        ) }
        <FormField
          type='switch'
          label='One tick label per line'
          checked={ yAxisOneTickLabelPerLine }
          onChange={ setYAxisOneTickLabelPerLine }
        />
      </FormSection>
    </>
  );
}
