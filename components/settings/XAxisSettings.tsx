'use client';

import { ArrowUp, ArrowDown, EyeOff, TrendingUp, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

export function XAxisSettings() {
  // Position
  const xAxisPosition = useChartStore( ( state ) => state.xAxisPosition );
  const setXAxisPosition = useChartStore( ( state ) => state.setXAxisPosition );

  // Show/Hide
  const xAxisShow = useChartStore( ( state ) => state.xAxisShow );
  const setXAxisShow = useChartStore( ( state ) => state.setXAxisShow );

  // Scale
  const xAxisScaleType = useChartStore( ( state ) => state.xAxisScaleType );
  const setXAxisScaleType = useChartStore( ( state ) => state.setXAxisScaleType );

  // Min/Max
  const xAxisMin = useChartStore( ( state ) => state.xAxisMin );
  const setXAxisMin = useChartStore( ( state ) => state.setXAxisMin );
  const xAxisMax = useChartStore( ( state ) => state.xAxisMax );
  const setXAxisMax = useChartStore( ( state ) => state.setXAxisMax );

  // Title
  const xAxisTitle = useChartStore( ( state ) => state.xAxisTitle );
  const setXAxisTitle = useChartStore( ( state ) => state.setXAxisTitle );

  // Title Styling
  const xAxisTitleType = useChartStore( ( state ) => state.xAxisTitleType );
  const setXAxisTitleType = useChartStore( ( state ) => state.setXAxisTitleType );
  const xAxisTitleWeight = useChartStore( ( state ) => state.xAxisTitleWeight );
  const setXAxisTitleWeight = useChartStore( ( state ) => state.setXAxisTitleWeight );
  const xAxisTitleColor = useChartStore( ( state ) => state.xAxisTitleColor );
  const setXAxisTitleColor = useChartStore( ( state ) => state.setXAxisTitleColor );
  const xAxisTitleSize = useChartStore( ( state ) => state.xAxisTitleSize );
  const setXAxisTitleSize = useChartStore( ( state ) => state.setXAxisTitleSize );
  const xAxisTitlePadding = useChartStore( ( state ) => state.xAxisTitlePadding );
  const setXAxisTitlePadding = useChartStore( ( state ) => state.setXAxisTitlePadding );

  // Tick & Label Styling
  const xAxisTickPosition = useChartStore( ( state ) => state.xAxisTickPosition );
  const setXAxisTickPosition = useChartStore( ( state ) => state.setXAxisTickPosition );
  const xAxisLabelWeight = useChartStore( ( state ) => state.xAxisLabelWeight );
  const setXAxisLabelWeight = useChartStore( ( state ) => state.setXAxisLabelWeight );
  const xAxisLabelColor = useChartStore( ( state ) => state.xAxisLabelColor );
  const setXAxisLabelColor = useChartStore( ( state ) => state.setXAxisLabelColor );
  const xAxisLabelSize = useChartStore( ( state ) => state.xAxisLabelSize );
  const setXAxisLabelSize = useChartStore( ( state ) => state.setXAxisLabelSize );
  const xAxisLabelSpacing = useChartStore( ( state ) => state.xAxisLabelSpacing );
  const setXAxisLabelSpacing = useChartStore( ( state ) => state.setXAxisLabelSpacing );

  // Gridline Styling
  const xAxisGridColor = useChartStore( ( state ) => state.xAxisGridColor );
  const setXAxisGridColor = useChartStore( ( state ) => state.setXAxisGridColor );
  const xAxisGridWidth = useChartStore( ( state ) => state.xAxisGridWidth );
  const setXAxisGridWidth = useChartStore( ( state ) => state.setXAxisGridWidth );
  const xAxisGridOpacity = useChartStore( ( state ) => state.xAxisGridOpacity );
  const setXAxisGridOpacity = useChartStore( ( state ) => state.setXAxisGridOpacity );
  const xAxisGridDashArray = useChartStore( ( state ) => state.xAxisGridDashArray );
  const setXAxisGridDashArray = useChartStore( ( state ) => state.setXAxisGridDashArray );

  // Grid & Domain
  const xAxisShowGrid = useChartStore( ( state ) => state.xAxisShowGrid );
  const setXAxisShowGrid = useChartStore( ( state ) => state.setXAxisShowGrid );
  const xAxisShowDomain = useChartStore( ( state ) => state.xAxisShowDomain );
  const setXAxisShowDomain = useChartStore( ( state ) => state.setXAxisShowDomain );

  // Ticks
  const xAxisTickCount = useChartStore( ( state ) => state.xAxisTickCount );
  const setXAxisTickCount = useChartStore( ( state ) => state.setXAxisTickCount );
  const xAxisTickSize = useChartStore( ( state ) => state.xAxisTickSize );
  const setXAxisTickSize = useChartStore( ( state ) => state.setXAxisTickSize );
  const xAxisTickPadding = useChartStore( ( state ) => state.xAxisTickPadding );
  const setXAxisTickPadding = useChartStore( ( state ) => state.setXAxisTickPadding );

  // Label Rotation
  const xAxisLabelRotation = useChartStore( ( state ) => state.xAxisLabelRotation );
  const setXAxisLabelRotation = useChartStore( ( state ) => state.setXAxisLabelRotation );

  // Tick Format
  const xAxisTickFormat = useChartStore( ( state ) => state.xAxisTickFormat );
  const setXAxisTickFormat = useChartStore( ( state ) => state.setXAxisTickFormat );

  return (
    <div className='settings-container'>
      <FormSection>
        <FormRow>
          <FormCol span='auto'>
            <FormField
              type='switch'
              label='Show X Axis'
              checked={ xAxisShow }
              onChange={ setXAxisShow }
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='button-group'
              label='Position'
              value={ xAxisPosition }
              onChange={ setXAxisPosition as ( value: string ) => void }
              options={ [
                { value: 'top', icon: <ArrowUp className='h-4 w-4' /> },
                { value: 'bottom', icon: <ArrowDown className='h-4 w-4' /> },
                { value: 'hidden', icon: <EyeOff className='h-4 w-4' /> },
              ] }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Scale & Range'>
        <FormField
          type='button-group'
          label='Scale Type'
          value={ xAxisScaleType }
          onChange={ setXAxisScaleType as ( value: string ) => void }
          options={ [
            { value: 'linear', icon: <TrendingUp className='h-4 w-4' />, tooltip: 'Linear' },
            { value: 'log', icon: <Activity className='h-4 w-4' />, tooltip: 'Logarithmic' },
            { value: 'time', icon: <span className='text-xs font-bold'>T</span>, tooltip: 'Time' },
            { value: 'band', icon: <span className='text-xs font-bold'>B</span>, tooltip: 'Band' },
            { value: 'point', icon: <span className='text-xs font-bold'>P</span>, tooltip: 'Point' },
          ] }
        />
        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Min'
            value={ xAxisMin ?? '' }
            onChange={ setXAxisMin }
            placeholder='Auto'
          />
          <FormField
            type='number'
            label='Max'
            value={ xAxisMax ?? '' }
            onChange={ setXAxisMax }
            placeholder='Auto'
          />
        </FormGrid>
      </FormSection>

      <Separator />

      <FormSection title='Title'>
        <FormField
          type='text'
          label='Axis Title'
          value={ xAxisTitle }
          onChange={ setXAxisTitle }
          placeholder='Enter axis title'
        />

        <FormField
          type='switch'
          label='Custom Style'
          checked={ xAxisTitleType !== 'auto' }
          onChange={ ( enabled ) => setXAxisTitleType( enabled ? 'custom' : 'auto' ) }
        />

        { xAxisTitleType !== 'auto' && (
          <FormSection>
            <Separator />
            <FormRow>
              <FormCol span={ 8 }>
                <FormField
                  type='button-group'
                  label='Weight'
                  value={ xAxisTitleWeight }
                  onChange={ setXAxisTitleWeight as ( value: string ) => void }
                  options={ [
                    { value: 'bold', label: 'Bold' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'normal', label: 'Normal' },
                  ] }
                />
              </FormCol>
              <FormCol span='auto'>
                <FormField
                  type='color'
                  label='Color'
                  value={ xAxisTitleColor }
                  onChange={ setXAxisTitleColor }
                />
              </FormCol>
            </FormRow>

            <FormRow>
              <FormCol span={ 6 }>
                <FormField
                  type='number'
                  label='Size'
                  value={ xAxisTitleSize }
                  onChange={ ( v ) => setXAxisTitleSize( v ?? 12 ) }
                  min={ 8 }
                  max={ 32 }
                />
              </FormCol>
              <FormCol span={ 6 }>
                <FormField
                  type='number'
                  label='Padding'
                  value={ xAxisTitlePadding }
                  onChange={ ( v ) => setXAxisTitlePadding( v ?? 0 ) }
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
          <FormCol span='auto'>
            <FormField
              type='button-group'
              label='Position'
              value={ xAxisTickPosition }
              onChange={ setXAxisTickPosition as ( value: string ) => void }
              options={ [
                { value: 'default', label: 'Default' },
                { value: 'axis-label', label: 'Axis Label' },
                { value: 'annotation', label: 'Annotation' },
                { value: 'cross', label: 'Cross' },
              ] }
            />
          </FormCol>
        </FormRow>

        <FormRow>
          <FormCol span='auto'>
            <FormField
              type='text'
              label='Format'
              value={ xAxisTickFormat }
              onChange={ setXAxisTickFormat }
              placeholder='e.g., .2f'
            />
          </FormCol>
        </FormRow>

        <FormRow>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Tick Count'
              value={ xAxisTickCount ?? 0 }
              onChange={ ( v ) => setXAxisTickCount( v === 0 ? null : v ) }
              min={ 0 }
              max={ 50 }
              description='Set to 0 for auto'
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Size'
              value={ xAxisTickSize }
              onChange={ ( v ) => setXAxisTickSize( v ?? 6 ) }
              min={ 0 }
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Padding'
              value={ xAxisTickPadding }
              onChange={ ( v ) => setXAxisTickPadding( v ?? 8 ) }
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
              value={ xAxisLabelWeight }
              onChange={ setXAxisLabelWeight as ( value: string ) => void }
              options={ [
                { value: 'bold', label: 'Bold' },
                { value: 'medium', label: 'Medium' },
                { value: 'normal', label: 'Normal' },
              ] }
            />
          </FormCol>
          <FormCol span={ 2 }>
            <FormField
              type='number'
              label='Rotation'
              value={ xAxisLabelRotation }
              onChange={ ( v ) => setXAxisLabelRotation( v ?? 0 ) }
              min={ -90 }
              max={ 90 }
              step={ 15 }
            />
          </FormCol>
        </FormRow>

        <FormRow>
          <FormCol span={ 4 }>
            <FormField
              type='color'
              label='Color'
              value={ xAxisLabelColor }
              onChange={ setXAxisLabelColor }
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Size'
              value={ xAxisLabelSize }
              onChange={ ( v ) => setXAxisLabelSize( v ?? 12 ) }
              min={ 8 }
              max={ 24 }
            />
          </FormCol>
          <FormCol span={ 4 }>
            <FormField
              type='number'
              label='Spacing'
              value={ xAxisLabelSpacing }
              onChange={ ( v ) => setXAxisLabelSpacing( v ?? 0 ) }
              min={ -100 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Grid & Domain'>
        <FormRow>
          <FormCol span={ 6 }>
            <FormField
              type='switch'
              label='Show Grid'
              checked={ xAxisShowGrid }
              onChange={ setXAxisShowGrid }
            />
          </FormCol>
          <FormCol span={ 6 }>
            <FormField
              type='switch'
              label='Show Domain'
              checked={ xAxisShowDomain }
              onChange={ setXAxisShowDomain }
            />
          </FormCol>
        </FormRow>

        { xAxisShowGrid && (
          <>
            <FormRow>
              <FormCol span={ 6 }>
                <FormField
                  type='color'
                  label='Grid Color'
                  value={ xAxisGridColor }
                  onChange={ setXAxisGridColor }
                />
              </FormCol>
              <FormCol span={ 6 }>
                <FormField
                  type='text'
                  label='Dash Pattern'
                  value={ xAxisGridDashArray }
                  onChange={ setXAxisGridDashArray }
                  placeholder='e.g., 5,5'
                />
              </FormCol>
            </FormRow>
            <FormRow>
              <FormCol span={ 6 }>
                <FormField
                  type='number'
                  label='Width'
                  value={ xAxisGridWidth }
                  onChange={ ( v ) => setXAxisGridWidth( v ?? 1 ) }
                  min={ 0.5 }
                  max={ 5 }
                  step={ 0.5 }
                />
              </FormCol>
              <FormCol span={ 6 }>
                <FormField
                  type='number'
                  label='Opacity'
                  value={ xAxisGridOpacity }
                  onChange={ ( v ) => setXAxisGridOpacity( v ?? 1 ) }
                  min={ 0 }
                  max={ 1 }
                  step={ 0.1 }
                />
              </FormCol>
            </FormRow>
          </>
        ) }
      </FormSection>
    </div>
  );
}
