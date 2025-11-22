'use client';

import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';

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
      {/* Position */ }
      <FormSection title='Position'>
        <FormField
          type='select'
          value={ xAxisPosition }
          onChange={ setXAxisPosition }
          options={ [
            { value: 'bottom', label: 'Bottom' },
            { value: 'top', label: 'Top' },
            { value: 'hidden', label: 'Hidden' },
          ] }
        />
      </FormSection>

      <Separator />

      {/* Show/Hide X Axis */ }
      <FormField
        type='switch'
        label='X axis'
        checked={ xAxisShow }
        onChange={ setXAxisShow }
      />

      <Separator />

      {/* Scale */ }
      <FormSection title='Scale'>
        <FormField
          type='select'
          value={ xAxisScaleType }
          onChange={ setXAxisScaleType }
          options={ [
            { value: 'linear', label: 'Linear' },
            { value: 'log', label: 'Log' },
          ] }
        />
      </FormSection>

      <Separator />

      {/* Min/Max Range */ }
      <FormSection title='Range'>
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

      {/* X Axis Title */ }
      <FormSection title='Axis title'>
        <FormField
          type='text'
          value={ xAxisTitle }
          onChange={ setXAxisTitle }
          placeholder='Enter axis title'
        />
      </FormSection>

      <Separator />

      {/* Title Styling */ }
      <FormSection title='Title styling'>
        <FormField
          type='select'
          label='Type'
          value={ xAxisTitleType }
          onChange={ setXAxisTitleType }
          options={ [
            { value: 'auto', label: 'Auto' },
            { value: 'custom', label: 'Custom' },
          ] }
        />

        <FormField
          type='select'
          label='Weight'
          value={ xAxisTitleWeight }
          onChange={ setXAxisTitleWeight }
          options={ [
            { value: 'regular', label: 'Regular' },
            { value: 'bold', label: 'Bold' },
          ] }
        />

        <FormField
          type='color'
          label='Color'
          value={ xAxisTitleColor }
          onChange={ setXAxisTitleColor }
        />

        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Size (px)'
            value={ xAxisTitleSize }
            onChange={ ( v ) => setXAxisTitleSize( v ?? 12 ) }
            min={ 8 }
            max={ 32 }
          />
          <FormField
            type='number'
            label='Padding (px)'
            value={ xAxisTitlePadding }
            onChange={ ( v ) => setXAxisTitlePadding( v ?? 0 ) }
            min={ 0 }
          />
        </FormGrid>
      </FormSection>

      <Separator />

      {/* Tick & Label Styling */ }
      <FormSection title='Tick & label styling'>
        <FormField
          type='select'
          label='Tick position'
          value={ xAxisTickPosition }
          onChange={ setXAxisTickPosition }
          options={ [
            { value: 'outside', label: 'Outside' },
            { value: 'inside', label: 'Inside' },
            { value: 'cross', label: 'Cross' },
          ] }
        />

        <FormField
          type='select'
          label='Label weight'
          value={ xAxisLabelWeight }
          onChange={ setXAxisLabelWeight }
          options={ [
            { value: 'regular', label: 'Regular' },
            { value: 'bold', label: 'Bold' },
          ] }
        />

        <FormField
          type='color'
          label='Label color'
          value={ xAxisLabelColor }
          onChange={ setXAxisLabelColor }
        />

        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Label size (px)'
            value={ xAxisLabelSize }
            onChange={ ( v ) => setXAxisLabelSize( v ?? 12 ) }
            min={ 8 }
            max={ 24 }
          />
          <FormField
            type='number'
            label='Spacing (px)'
            value={ xAxisLabelSpacing }
            onChange={ ( v ) => setXAxisLabelSpacing( v ?? 0 ) }
            min={ 0 }
          />
        </FormGrid>
      </FormSection>

      <Separator />

      {/* Grid Lines */ }
      <FormField
        type='switch'
        label='Show grid lines'
        checked={ xAxisShowGrid }
        onChange={ setXAxisShowGrid }
      />

      <Separator />

      {/* Gridline Styling */ }
      <FormSection title='Gridline styling'>
        <FormField
          type='color'
          label='Color'
          value={ xAxisGridColor }
          onChange={ setXAxisGridColor }
        />

        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Width (px)'
            value={ xAxisGridWidth }
            onChange={ ( v ) => setXAxisGridWidth( v ?? 1 ) }
            min={ 0.5 }
            max={ 5 }
            step={ 0.5 }
          />
          <FormField
            type='number'
            label='Opacity'
            value={ xAxisGridOpacity }
            onChange={ ( v ) => setXAxisGridOpacity( v ?? 1 ) }
            min={ 0 }
            max={ 1 }
            step={ 0.1 }
          />
        </FormGrid>

        <FormField
          type='text'
          label='Dash pattern'
          value={ xAxisGridDashArray }
          onChange={ setXAxisGridDashArray }
          placeholder='e.g., 5,5 or 10,5'
          description='0 = solid, 5,5 = dashed'
        />
      </FormSection>

      <Separator />

      {/* Domain Line */ }
      <FormField
        type='switch'
        label='Show domain line'
        checked={ xAxisShowDomain }
        onChange={ setXAxisShowDomain }
      />

      <Separator />

      {/* Tick Settings */ }
      <FormSection title='Tick settings'>
        <FormGrid columns={ 2 }>
          <FormField
            type='number'
            label='Tick count'
            value={ xAxisTickCount }
            onChange={ ( v ) => setXAxisTickCount( v ?? 5 ) }
            min={ 0 }
          />
          <FormField
            type='number'
            label='Tick size (px)'
            value={ xAxisTickSize }
            onChange={ ( v ) => setXAxisTickSize( v ?? 6 ) }
            min={ 0 }
          />
        </FormGrid>

        <FormField
          type='number'
          label='Tick padding (px)'
          value={ xAxisTickPadding }
          onChange={ ( v ) => setXAxisTickPadding( v ?? 8 ) }
          min={ 0 }
        />
      </FormSection>

      <Separator />

      {/* Label Rotation */ }
      <FormSection title='Label rotation'>
        <FormField
          type='number'
          label='Degrees'
          value={ xAxisLabelRotation }
          onChange={ ( v ) => setXAxisLabelRotation( v ?? 0 ) }
          min={ -90 }
          max={ 90 }
        />
      </FormSection>

      <Separator />

      {/* Tick Format */ }
      <FormSection title='Tick format'>
        <FormField
          type='text'
          value={ xAxisTickFormat }
          onChange={ setXAxisTickFormat }
          placeholder='e.g., .2f, %'
        />
      </FormSection>
    </div>
  );
}
