'use client';

import { FormField } from '@/components/ui/form-field';
import { FormGrid } from '@/components/ui/form-grid';
import { FormSection } from '@/components/ui/form-section';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bold,
  Type,
} from 'lucide-react';

export function FooterSettingsSection() {
  // Alignment
  const footerAlignment = useChartStore( ( state ) => state.footerAlignment );
  const setFooterAlignment = useChartStore( ( state ) => state.setFooterAlignment );

  // Advanced styles
  const footerStylesEnabled = useChartStore(
    ( state ) => state.footerStylesEnabled
  );
  const setFooterStylesEnabled = useChartStore(
    ( state ) => state.setFooterStylesEnabled
  );
  const footerFont = useChartStore( ( state ) => state.footerFont );
  const setFooterFont = useChartStore( ( state ) => state.setFooterFont );
  const footerFontWeight = useChartStore( ( state ) => state.footerFontWeight );
  const setFooterFontWeight = useChartStore(
    ( state ) => state.setFooterFontWeight
  );

  // Source
  const footerSourceName = useChartStore( ( state ) => state.footerSourceName );
  const setFooterSourceName = useChartStore(
    ( state ) => state.setFooterSourceName
  );
  const footerSourceUrl = useChartStore( ( state ) => state.footerSourceUrl );
  const setFooterSourceUrl = useChartStore( ( state ) => state.setFooterSourceUrl );
  const footerSourceLabel = useChartStore( ( state ) => state.footerSourceLabel );
  const setFooterSourceLabel = useChartStore(
    ( state ) => state.setFooterSourceLabel
  );

  // Notes
  const footerNote = useChartStore( ( state ) => state.footerNote );
  const setFooterNote = useChartStore( ( state ) => state.setFooterNote );
  const footerNoteSecondary = useChartStore(
    ( state ) => state.footerNoteSecondary
  );
  const setFooterNoteSecondary = useChartStore(
    ( state ) => state.setFooterNoteSecondary
  );

  // Logo/Image
  const footerLogoEnabled = useChartStore( ( state ) => state.footerLogoEnabled );
  const setFooterLogoEnabled = useChartStore(
    ( state ) => state.setFooterLogoEnabled
  );
  const footerLogoImageUrl = useChartStore( ( state ) => state.footerLogoImageUrl );
  const setFooterLogoImageUrl = useChartStore(
    ( state ) => state.setFooterLogoImageUrl
  );
  const footerLogoImageLink = useChartStore(
    ( state ) => state.footerLogoImageLink
  );
  const setFooterLogoImageLink = useChartStore(
    ( state ) => state.setFooterLogoImageLink
  );
  const footerLogoHeight = useChartStore( ( state ) => state.footerLogoHeight );
  const setFooterLogoHeight = useChartStore(
    ( state ) => state.setFooterLogoHeight
  );
  const footerLogoAlign = useChartStore( ( state ) => state.footerLogoAlign );
  const setFooterLogoAlign = useChartStore( ( state ) => state.setFooterLogoAlign );
  const footerLogoPosition = useChartStore( ( state ) => state.footerLogoPosition );
  const setFooterLogoPosition = useChartStore(
    ( state ) => state.setFooterLogoPosition
  );
  const footerLogoPositionTop = useChartStore(
    ( state ) => state.footerLogoPositionTop
  );
  const setFooterLogoPositionTop = useChartStore(
    ( state ) => state.setFooterLogoPositionTop
  );
  const footerLogoPositionRight = useChartStore(
    ( state ) => state.footerLogoPositionRight
  );
  const setFooterLogoPositionRight = useChartStore(
    ( state ) => state.setFooterLogoPositionRight
  );
  const footerLogoPositionBottom = useChartStore(
    ( state ) => state.footerLogoPositionBottom
  );
  const setFooterLogoPositionBottom = useChartStore(
    ( state ) => state.setFooterLogoPositionBottom
  );
  const footerLogoPositionLeft = useChartStore(
    ( state ) => state.footerLogoPositionLeft
  );
  const setFooterLogoPositionLeft = useChartStore(
    ( state ) => state.setFooterLogoPositionLeft
  );

  // Border
  const footerBorder = useChartStore( ( state ) => state.footerBorder );
  const setFooterBorder = useChartStore( ( state ) => state.setFooterBorder );
  const footerBorderStyle = useChartStore( ( state ) => state.footerBorderStyle );
  const setFooterBorderStyle = useChartStore(
    ( state ) => state.setFooterBorderStyle
  );
  const footerBorderSpace = useChartStore( ( state ) => state.footerBorderSpace );
  const setFooterBorderSpace = useChartStore(
    ( state ) => state.setFooterBorderSpace
  );
  const footerBorderWidth = useChartStore( ( state ) => state.footerBorderWidth );
  const setFooterBorderWidth = useChartStore(
    ( state ) => state.setFooterBorderWidth
  );
  const footerBorderColor = useChartStore( ( state ) => state.footerBorderColor );
  const setFooterBorderColor = useChartStore(
    ( state ) => state.setFooterBorderColor
  );

  return (
    <div className='settings-container'>
      {/* Alignment */ }
      <FormField
        label='Alignment'
        type='button-group'
        value={ footerAlignment }
        onChange={ setFooterAlignment }
        options={ [
          { value: 'left', icon: <AlignLeft className='h-4 w-4' /> },
          { value: 'center', icon: <AlignCenter className='h-4 w-4' /> },
          { value: 'right', icon: <AlignRight className='h-4 w-4' /> },
        ] }
      />

      <Separator />

      {/* Advanced Footer Styles */ }
      <FormSection>
        <FormField
          label='Advanced footer styles'
          type='switch'
          checked={ footerStylesEnabled }
          onChange={ setFooterStylesEnabled }
        />

        { footerStylesEnabled && (
          <FormSection className='settings-nested-section'>
            <FormField
              type='select'
              label='Title Font'
              value={ footerFont }
              onChange={ setFooterFont }
              options={ [
                { value: 'Same as parent', label: 'Same as parent' },
                { value: 'Inter', label: 'Inter' },
                { value: 'Arial', label: 'Arial' },
                { value: 'Helvetica', label: 'Helvetica' },
                { value: 'Georgia', label: 'Georgia' },
                { value: 'Times New Roman', label: 'Times New Roman' },
                { value: 'Courier New', label: 'Courier New' },
              ] }
            />

            <FormField
              type='button-group'
              label='Weight'
              value={ footerFontWeight }
              onChange={ setFooterFontWeight }
              options={ [
                { value: 'bold', icon: <Bold className='h-3 w-3' /> },
                { value: 'regular', icon: <Type className='h-3 w-3' /> },
              ] }
            />

            <FormSection className='settings-field'>
              <FormField
                type='text'
                label='Source name'
                value={ footerSourceName }
                onChange={ setFooterSourceName }
                placeholder='Source name'
              />
              <FormField
                type='url'
                value={ footerSourceUrl }
                onChange={ setFooterSourceUrl }
                placeholder='Source URL'
              />
              <FormField
                type='text'
                value={ footerSourceLabel }
                onChange={ setFooterSourceLabel }
                placeholder='Source label (for Citation)'
              />
            </FormSection>

            <div className='settings-field'>
              <FormField
                type='textarea'
                label='Note'
                value={ footerNote }
                onChange={ setFooterNote }
                placeholder='Note'
                rows={ 4 }
              />
              <FormField
                type='textarea'
                value={ footerNoteSecondary }
                onChange={ setFooterNoteSecondary }
                placeholder='Note (secondary)'
                rows={ 4 }
              />
            </div>
          </FormSection>
        ) }
      </FormSection>

      <Separator />

      {/* Logo / Image */ }
      <FormSection>
        <FormField
          label='Add logo or image'
          type='switch'
          checked={ footerLogoEnabled }
          onChange={ setFooterLogoEnabled }
        />

        { footerLogoEnabled && (
          <FormSection className='settings-nested-section'>
            <FormGrid columns={ 2 }>
              <FormField
                type='url'
                label='Image URL'
                value={ footerLogoImageUrl }
                onChange={ setFooterLogoImageUrl }
                placeholder='https://...'
              />

              <FormField
                type='url'
                label='Link URL'
                value={ footerLogoImageLink }
                onChange={ setFooterLogoImageLink }
                placeholder='https://...'
              />

              <FormField
                type='number'
                label='Height (px)'
                value={ footerLogoHeight }
                onChange={ ( v ) => setFooterLogoHeight( v ?? 50 ) }
                min={ 20 }
                max={ 200 }
              />

              <FormField
                type='select'
                label='Align'
                value={ footerLogoAlign }
                onChange={ setFooterLogoAlign }
                options={ [
                  { value: 'footer', label: 'Footer' },
                  { value: 'main-container', label: 'Main Container' },
                ] }
              />
            </FormGrid>

            <FormField
              type='button-group'
              label='Position'
              value={ footerLogoPosition }
              onChange={ setFooterLogoPosition }
              options={ [
                { value: 'bottom', icon: <ArrowDown className='h-4 w-4' /> },
                { value: 'left', icon: <ArrowLeft className='h-4 w-4' /> },
                { value: 'right', icon: <ArrowRight className='h-4 w-4' /> },
              ] }
            />

            <FormGrid columns={ 4 }>
              <FormField
                type='number'
                label='Top'
                value={ footerLogoPositionTop }
                onChange={ ( v ) => setFooterLogoPositionTop( v ?? 0 ) }
              />

              <FormField
                type='number'
                label='Right'
                value={ footerLogoPositionRight }
                onChange={ ( v ) => setFooterLogoPositionRight( v ?? 0 ) }
              />

              <FormField
                type='number'
                label='Bottom'
                value={ footerLogoPositionBottom }
                onChange={ ( v ) => setFooterLogoPositionBottom( v ?? 0 ) }
              />

              <FormField
                type='number'
                label='Left'
                value={ footerLogoPositionLeft }
                onChange={ ( v ) => setFooterLogoPositionLeft( v ?? 0 ) }
              />
            </FormGrid>
          </FormSection>
        ) }
      </FormSection>

      <Separator />

      {/* Border */ }
      <FormSection>
        <FormField
          label='Border'
          type='select'
          value={ footerBorder }
          onChange={ setFooterBorder }
          options={ [
            { value: 'none', label: 'None' },
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'top-bottom', label: 'Top & Bottom' },
          ] }
        />

        { footerBorder !== 'none' && (
          <FormSection className='settings-nested-section'>
            <FormGrid columns={ 2 }>
              <FormField
                type='select'
                label='Style'
                value={ footerBorderStyle }
                onChange={ setFooterBorderStyle }
                options={ [
                  { value: 'solid', label: 'Solid' },
                  { value: 'dashed', label: 'Dashed' },
                  { value: 'dotted', label: 'Dotted' },
                ] }
              />

              <FormField
                type='number'
                label='Space (px)'
                value={ footerBorderSpace }
                onChange={ ( v ) => setFooterBorderSpace( v ?? 0 ) }
                min={ 0 }
                max={ 50 }
              />

              <FormField
                type='number'
                label='Width (px)'
                value={ footerBorderWidth }
                onChange={ ( v ) => setFooterBorderWidth( v ?? 1 ) }
                min={ 1 }
                max={ 10 }
              />

              <FormField
                type='color'
                label='Color'
                value={ footerBorderColor }
                onChange={ setFooterBorderColor }
              />
            </FormGrid>
          </FormSection>
        ) }
      </FormSection>
    </div>
  );
}
