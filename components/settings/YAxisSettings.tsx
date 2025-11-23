'use client';

import { ArrowLeft, ArrowRight, EyeOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

export function YAxisSettings() {
  // Position
  const yAxisPosition = useChartStore( ( state ) => state.yAxisPosition );
  const setYAxisPosition = useChartStore( ( state ) => state.setYAxisPosition );

  // Show/Hide
  const yAxisShow = useChartStore( ( state ) => state.yAxisShow );
  const setYAxisShow = useChartStore( ( state ) => state.setYAxisShow );

  // Scale
  const yAxisScaleType = useChartStore( ( state ) => state.yAxisScaleType );
  const setYAxisScaleType = useChartStore( ( state ) => state.setYAxisScaleType );

  // Min/Max
  const yAxisMin = useChartStore( ( state ) => state.yAxisMin );
  const setYAxisMin = useChartStore( ( state ) => state.setYAxisMin );
  const yAxisMax = useChartStore( ( state ) => state.yAxisMax );
  const setYAxisMax = useChartStore( ( state ) => state.setYAxisMax );

  // Title
  const yAxisTitle = useChartStore( ( state ) => state.yAxisTitle );
  const setYAxisTitle = useChartStore( ( state ) => state.setYAxisTitle );

  // Title Styling
  const yAxisTitleType = useChartStore( ( state ) => state.yAxisTitleType );
  const setYAxisTitleType = useChartStore( ( state ) => state.setYAxisTitleType );
  const yAxisTitleWeight = useChartStore( ( state ) => state.yAxisTitleWeight );
  const setYAxisTitleWeight = useChartStore( ( state ) => state.setYAxisTitleWeight );
  const yAxisTitleColor = useChartStore( ( state ) => state.yAxisTitleColor );
  const setYAxisTitleColor = useChartStore( ( state ) => state.setYAxisTitleColor );
  const yAxisTitleSize = useChartStore( ( state ) => state.yAxisTitleSize );
  const setYAxisTitleSize = useChartStore( ( state ) => state.setYAxisTitleSize );
  const yAxisTitlePadding = useChartStore( ( state ) => state.yAxisTitlePadding );
  const setYAxisTitlePadding = useChartStore( ( state ) => state.setYAxisTitlePadding );

  // Tick & Label Styling
  const yAxisTickPosition = useChartStore( ( state ) => state.yAxisTickPosition );
  const setYAxisTickPosition = useChartStore( ( state ) => state.setYAxisTickPosition );
  const yAxisLabelWeight = useChartStore( ( state ) => state.yAxisLabelWeight );
  const setYAxisLabelWeight = useChartStore( ( state ) => state.setYAxisLabelWeight );
  const yAxisLabelColor = useChartStore( ( state ) => state.yAxisLabelColor );
  const setYAxisLabelColor = useChartStore( ( state ) => state.setYAxisLabelColor );
  const yAxisLabelSize = useChartStore( ( state ) => state.yAxisLabelSize );
  const setYAxisLabelSize = useChartStore( ( state ) => state.setYAxisLabelSize );
  const yAxisLabelSpacing = useChartStore( ( state ) => state.yAxisLabelSpacing );
  const setYAxisLabelSpacing = useChartStore( ( state ) => state.setYAxisLabelSpacing );

  // Gridline Styling
  const yAxisGridColor = useChartStore( ( state ) => state.yAxisGridColor );
  const setYAxisGridColor = useChartStore( ( state ) => state.setYAxisGridColor );
  const yAxisGridWidth = useChartStore( ( state ) => state.yAxisGridWidth );
  const setYAxisGridWidth = useChartStore( ( state ) => state.setYAxisGridWidth );
  const yAxisGridStyle = useChartStore( ( state ) => state.yAxisGridStyle );
  const setYAxisGridStyle = useChartStore( ( state ) => state.setYAxisGridStyle );

  // Grid & Domain
  const yAxisShowGrid = useChartStore( ( state ) => state.yAxisShowGrid );
  const setYAxisShowGrid = useChartStore( ( state ) => state.setYAxisShowGrid );
  const yAxisShowDomain = useChartStore( ( state ) => state.yAxisShowDomain );
  const setYAxisShowDomain = useChartStore( ( state ) => state.setYAxisShowDomain );

  // Ticks
  const yAxisTickCount = useChartStore( ( state ) => state.yAxisTickCount );
  const setYAxisTickCount = useChartStore( ( state ) => state.setYAxisTickCount );
  const yAxisTickSize = useChartStore( ( state ) => state.yAxisTickSize );
  const setYAxisTickSize = useChartStore( ( state ) => state.setYAxisTickSize );
  const yAxisTickPadding = useChartStore( ( state ) => state.yAxisTickPadding );
  const setYAxisTickPadding = useChartStore( ( state ) => state.setYAxisTickPadding );

  // Label Rotation
  const yAxisLabelAngle = useChartStore( ( state ) => state.yAxisLabelAngle );
  const setYAxisLabelAngle = useChartStore( ( state ) => state.setYAxisLabelAngle );

  // Tick Format
  const yAxisTickFormat = useChartStore( ( state ) => state.yAxisTickFormat );
  const setYAxisTickFormat = useChartStore( ( state ) => state.setYAxisTickFormat );

  return (
    <div className='settings-container'>
      <FormSection>
        <FormRow>
          <FormCol span='auto'>
            <FormField
              type='switch'
              label='Show Y Axis'
              checked={ yAxisShow }
              onChange={ setYAxisShow }
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='button-group'
              label='Position'
              value={ yAxisPosition }
              onChange={ setYAxisPosition as ( value: string ) => void }
              options={ [
                { value: 'left', icon: <ArrowLeft className='h-4 w-4' /> },
                { value: 'right', icon: <ArrowRight className='h-4 w-4' /> },
                { value: 'hidden', icon: <EyeOff className='h-4 w-4' /> },
              ] }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Scale & Range'>
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
      </FormSection>

      <Separator />

      <FormSection title='Title'>
        <FormField
          type='text'
          label='Axis Title'
          value={ yAxisTitle }
          onChange={ setYAxisTitle }
          placeholder='Enter axis title'
        />

        <FormField
          type='switch'
          label='Custom Style'
          checked={ yAxisTitleType !== 'auto' }
          onChange={ ( enabled ) => setYAxisTitleType( enabled ? 'custom' : 'auto' ) }
        />

        { yAxisTitleType !== 'auto' && (
          <FormSection>
            <Separator />
            <FormRow>
              <FormCol span={ 10 }>
                <FormField
                  type='button-group'
                  label='Weight'
                  value={ yAxisTitleWeight }
                  onChange={ setYAxisTitleWeight as ( value: string ) => void }
                  options={ [
                    { value: 'bold', label: 'Bold' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'normal', label: 'Normal' },
                  ] }
                />
              </FormCol>
              <FormCol span={ 2 }>
                <FormField
                  type='color'
                  label='Color'
                  value={ yAxisTitleColor }
                  onChange={ setYAxisTitleColor }
                />
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol span={ 6 }>
                <FormField
                  type='number'
                  label='Size'
                  value={ yAxisTitleSize }
                  onChange={ ( v ) => setYAxisTitleSize( v ?? 12 ) }
                  min={ 8 }
                  max={ 32 }
                />
              </FormCol>
              <FormCol span={ 6 }>
                <FormField
                  type='number'
                  label='Padding'
                  value={ yAxisTitlePadding }
                  onChange={ ( v ) => setYAxisTitlePadding( v ?? 0 ) }
                  min={ 0 }
                />
              </FormCol>
            </FormRow>
          </FormSection>
        ) }
      </FormSection>

      <Separator />

      <FormSection title='Ticks'>
        <FormRow>
          <FormCol span={ 10 }>
            <FormField
              type='button-group'
              label='Position'
              value={ yAxisTickPosition }
              onChange={ setYAxisTickPosition as ( value: string ) => void }
              options={ [
                { value: 'default', label: 'Default' },
                { value: 'inside', label: 'Inside' },
                { value: 'cross', label: 'Cross' },
              ] }
            />
          </FormCol>
          <FormCol span={ 2 }>
            <FormField
              type='text'
              label='Format'
              value={ yAxisTickFormat }
              onChange={ setYAxisTickFormat }
              placeholder='e.g., .2f'
            />
          </FormCol>
        </FormRow>

        <FormRow>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Count'
              value={ yAxisTickCount ?? 0 }
              onChange={ ( v ) => setYAxisTickCount( v === 0 ? null : v ) }
              min={ 0 }
              max={ 50 }
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Size'
              value={ yAxisTickSize }
              onChange={ ( v ) => setYAxisTickSize( v ?? 6 ) }
              min={ 0 }
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Padding'
              value={ yAxisTickPadding }
              onChange={ ( v ) => setYAxisTickPadding( v ?? 8 ) }
              min={ 0 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Labels'>
        <FormRow>
          <FormCol span={ 10 }>
            <FormField
              type='button-group'
              label='Weight'
              value={ yAxisLabelWeight }
              onChange={ setYAxisLabelWeight as ( value: string ) => void }
              options={ [
                { value: 'bold', label: 'Bold' },
                { value: 'medium', label: 'Medium' },
                { value: 'normal', label: 'Normal' },
              ] }
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='number'
              label='Rotation'
              value={ yAxisLabelAngle }
              onChange={ ( v ) => setYAxisLabelAngle( v ?? 0 ) }
              min={ -90 }
              max={ 90 }
            />
          </FormCol>
        </FormRow>

        <FormRow>
          <FormCol span={ 4 }>
            <FormField
              type='color'
              label='Color'
              value={ yAxisLabelColor }
              onChange={ setYAxisLabelColor }
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Size'
              value={ yAxisLabelSize }
              onChange={ ( v ) => setYAxisLabelSize( v ?? 12 ) }
              min={ 8 }
              max={ 24 }
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Spacing'
              value={ yAxisLabelSpacing }
              onChange={ ( v ) => setYAxisLabelSpacing( v ?? 0 ) }
              min={ 0 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Grid & Domain'>
        <FormGrid columns={ 2 }>
          <FormField
            type='switch'
            label='Show grid'
            checked={ yAxisShowGrid }
            onChange={ setYAxisShowGrid }
          />
          <FormField
            type='switch'
            label='Show domain'
            checked={ yAxisShowDomain }
            onChange={ setYAxisShowDomain }
          />
        </FormGrid>

        { yAxisShowGrid && (
          <>
            <Separator />
            <FormGrid columns={ 2 }>
              <FormField
                type='color'
                label='Grid Color'
                value={ yAxisGridColor }
                onChange={ setYAxisGridColor }
              />
              <FormField
                type='number'
                label='Grid Width'
                value={ yAxisGridWidth }
                onChange={ ( v ) => setYAxisGridWidth( v ?? 1 ) }
                min={ 0.5 }
                max={ 5 }
                step={ 0.5 }
              />
            </FormGrid>

            <FormField
              type='button-group'
              label='Grid Style'
              value={ yAxisGridStyle }
              onChange={ setYAxisGridStyle as ( value: string ) => void }
              options={ [
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' },
              ] }
            />
          </>
        ) }
      </FormSection>
    </div>
  );
}
