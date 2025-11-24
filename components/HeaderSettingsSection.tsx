'use client';

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Maximize2,
  Maximize,
  Square,
  Bold,
  Type,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

interface CustomStyleProps {
  styleEnabled: boolean;
  setStyleEnabled: ( enabled: boolean ) => void;
  font: string;
  setFont: ( font: string ) => void;
  fontSize: number;
  setFontSize: ( size: number ) => void;
  fontWeight: 'bold' | 'regular' | 'medium';
  setFontWeight: ( weight: 'bold' | 'regular' | 'medium' ) => void;
  color: string;
  setColor: ( color: string ) => void;
  lineHeight: number;
  setLineHeight: ( height: number ) => void;
  spaceAbove: 'slim' | 'medium' | 'large' | 'none';
  setSpaceAbove: ( height: 'slim' | 'medium' | 'large' | 'none' ) => void;
}

const CustomStyle = ( props: CustomStyleProps ) => {
  const {
    styleEnabled,
    setStyleEnabled,
    font,
    setFont,
    fontSize: size,
    setFontSize: setSize,
    color,
    setColor,
    fontWeight,
    setFontWeight,
    spaceAbove,
    setSpaceAbove,
    lineHeight,
    setLineHeight,
  } = props;
  return (
    <>
      <FormField
        type='switch'
        label='Custom Style'
        checked={ styleEnabled }
        onChange={ setStyleEnabled }
      />
      { styleEnabled && (
        <FormSection>
          <Separator />
          <FormRow>
            <FormCol span='auto'>
              <FormField
                type='select'
                label='Font'
                value={ font }
                onChange={ setFont }
                options={ [
                  { value: 'Same as parent', label: 'Same as parent' },
                  { value: 'Inter', label: 'Inter' },
                  { value: 'Arial', label: 'Arial' },
                  { value: 'Helvetica', label: 'Helvetica' },
                  { value: 'Times New Roman', label: 'Times New Roman' },
                  { value: 'Georgia', label: 'Georgia' },
                  { value: 'Verdana', label: 'Verdana' },
                  { value: 'Roboto', label: 'Roboto' },
                  { value: 'Open Sans', label: 'Open Sans' },
                  { value: 'Lato', label: 'Lato' },
                  { value: 'Montserrat', label: 'Montserrat' },
                ] }
              />
            </FormCol>

            <FormCol span={ 4 }>
              <FormField
                type='number'
                label='Size'
                value={ size }
                onChange={ ( v ) => setSize( v ?? 12 ) }
                min={ 0.1 }
                max={ 5 }
                step={ 0.1 }
              />
            </FormCol>
          </FormRow>
          <FormRow>
            <FormCol span={ 6 }>
              <FormField
                type='button-group'
                label='Weight'
                value={ fontWeight }
                onChange={ setFontWeight }
                options={ [
                  { value: 'bold', icon: <Bold className='icon-xs' /> },
                  { value: 'medium', label: 'M' },
                  { value: 'regular', icon: <Type className='icon-xs' /> },
                ] }
              />
            </FormCol>

            <FormCol span={ 3 }>
              <FormField
                type='color'
                label='Color'
                value={ color }
                onChange={ setColor }
              />
            </FormCol>

            <FormCol span={ 4 }>
              <FormField
                type='number'
                label='Line Height'
                value={ lineHeight }
                onChange={ ( v ) => setLineHeight( v ?? 1.2 ) }
                min={ 0.8 }
                max={ 3 }
                step={ 0.1 }
              />
            </FormCol>
          </FormRow>
          <FormField
            type='button-group'
            label='Space Above'
            value={ spaceAbove }
            onChange={ setSpaceAbove }
            options={ [
              { value: 'slim', icon: <Minus className='icon-sm' /> },
              { value: 'medium', icon: <Maximize2 className='icon-sm' /> },
              { value: 'large', icon: <Maximize className='icon-sm' /> },
              { value: 'none', icon: <Square className='icon-sm' /> },
            ] }
          />
        </FormSection>
      ) }
    </>
  );
};

export function HeaderSettingsSection() {
  // Alignment
  const headerAlignment = useChartStore( ( state ) => state.headerAlignment );
  const setHeaderAlignment = useChartStore( ( state ) => state.setHeaderAlignment );

  // Title
  const chartTitle = useChartStore( ( state ) => state.chartTitle );
  const setChartTitle = useChartStore( ( state ) => state.setChartTitle );
  const titleStyleEnabled = useChartStore( ( state ) => state.titleStyleEnabled );
  const setTitleStyleEnabled = useChartStore(
    ( state ) => state.setTitleStyleEnabled
  );
  const titleFont = useChartStore( ( state ) => state.titleFont );
  const setTitleFont = useChartStore( ( state ) => state.setTitleFont );
  const titleFontSize = useChartStore( ( state ) => state.titleFontSize );
  const setTitleFontSize = useChartStore( ( state ) => state.setTitleFontSize );
  const titleFontWeight = useChartStore( ( state ) => state.titleFontWeight );
  const setTitleFontWeight = useChartStore( ( state ) => state.setTitleFontWeight );
  const titleColor = useChartStore( ( state ) => state.titleColor );
  const setTitleColor = useChartStore( ( state ) => state.setTitleColor );
  const titleLineHeight = useChartStore( ( state ) => state.titleLineHeight );
  const setTitleLineHeight = useChartStore( ( state ) => state.setTitleLineHeight );
  const titleSpaceAbove = useChartStore( ( state ) => state.titleSpaceAbove );
  const setTitleSpaceAbove = useChartStore( ( state ) => state.setTitleSpaceAbove );

  // Subtitle
  const chartSubtitle = useChartStore( ( state ) => state.chartSubtitle );
  const setChartSubtitle = useChartStore( ( state ) => state.setChartSubtitle );
  const subtitleStyleEnabled = useChartStore(
    ( state ) => state.subtitleStyleEnabled
  );
  const setSubtitleStyleEnabled = useChartStore(
    ( state ) => state.setSubtitleStyleEnabled
  );
  const subtitleFont = useChartStore( ( state ) => state.subtitleFont );
  const setSubtitleFont = useChartStore( ( state ) => state.setSubtitleFont );
  const subtitleFontSize = useChartStore( ( state ) => state.subtitleFontSize );
  const setSubtitleFontSize = useChartStore(
    ( state ) => state.setSubtitleFontSize
  );
  const subtitleFontWeight = useChartStore( ( state ) => state.subtitleFontWeight );
  const setSubtitleFontWeight = useChartStore(
    ( state ) => state.setSubtitleFontWeight
  );
  const subtitleColor = useChartStore( ( state ) => state.subtitleColor );
  const setSubtitleColor = useChartStore( ( state ) => state.setSubtitleColor );
  const subtitleLineHeight = useChartStore( ( state ) => state.subtitleLineHeight );
  const setSubtitleLineHeight = useChartStore(
    ( state ) => state.setSubtitleLineHeight
  );
  const subtitleSpaceAbove = useChartStore( ( state ) => state.subtitleSpaceAbove );
  const setSubtitleSpaceAbove = useChartStore(
    ( state ) => state.setSubtitleSpaceAbove
  );

  // Header text
  const headerText = useChartStore( ( state ) => state.headerText );
  const setHeaderText = useChartStore( ( state ) => state.setHeaderText );
  const headerTextStyleEnabled = useChartStore(
    ( state ) => state.headerTextStyleEnabled
  );
  const setHeaderTextStyleEnabled = useChartStore(
    ( state ) => state.setHeaderTextStyleEnabled
  );
  const headerTextFont = useChartStore( ( state ) => state.headerTextFont );
  const setHeaderTextFont = useChartStore( ( state ) => state.setHeaderTextFont );
  const headerTextFontSize = useChartStore( ( state ) => state.headerTextFontSize );
  const setHeaderTextFontSize = useChartStore(
    ( state ) => state.setHeaderTextFontSize
  );
  const headerTextFontWeight = useChartStore(
    ( state ) => state.headerTextFontWeight
  );
  const setHeaderTextFontWeight = useChartStore(
    ( state ) => state.setHeaderTextFontWeight
  );
  const headerTextColor = useChartStore( ( state ) => state.headerTextColor );
  const setHeaderTextColor = useChartStore( ( state ) => state.setHeaderTextColor );
  const headerTextLineHeight = useChartStore(
    ( state ) => state.headerTextLineHeight
  );
  const setHeaderTextLineHeight = useChartStore(
    ( state ) => state.setHeaderTextLineHeight
  );
  const headerTextSpaceAbove = useChartStore(
    ( state ) => state.headerTextSpaceAbove
  );
  const setHeaderTextSpaceAbove = useChartStore(
    ( state ) => state.setHeaderTextSpaceAbove
  );

  // Border
  const headerBorder = useChartStore( ( state ) => state.headerBorder );
  const setHeaderBorder = useChartStore( ( state ) => state.setHeaderBorder );
  const headerBorderStyle = useChartStore( ( state ) => state.headerBorderStyle );
  const setHeaderBorderStyle = useChartStore(
    ( state ) => state.setHeaderBorderStyle
  );
  const headerBorderSpace = useChartStore( ( state ) => state.headerBorderSpace );
  const setHeaderBorderSpace = useChartStore(
    ( state ) => state.setHeaderBorderSpace
  );
  const headerBorderWidth = useChartStore( ( state ) => state.headerBorderWidth );
  const setHeaderBorderWidth = useChartStore(
    ( state ) => state.setHeaderBorderWidth
  );
  const headerBorderColor = useChartStore( ( state ) => state.headerBorderColor );
  const setHeaderBorderColor = useChartStore(
    ( state ) => state.setHeaderBorderColor
  );

  // Logo/Image
  const headerLogoEnabled = useChartStore( ( state ) => state.headerLogoEnabled );
  const setHeaderLogoEnabled = useChartStore(
    ( state ) => state.setHeaderLogoEnabled
  );
  const headerLogoImageUrl = useChartStore( ( state ) => state.headerLogoImageUrl );
  const setHeaderLogoImageUrl = useChartStore(
    ( state ) => state.setHeaderLogoImageUrl
  );
  const headerLogoImageLink = useChartStore(
    ( state ) => state.headerLogoImageLink
  );
  const setHeaderLogoImageLink = useChartStore(
    ( state ) => state.setHeaderLogoImageLink
  );
  const headerLogoHeight = useChartStore( ( state ) => state.headerLogoHeight );
  const setHeaderLogoHeight = useChartStore(
    ( state ) => state.setHeaderLogoHeight
  );
  const headerLogoAlign = useChartStore( ( state ) => state.headerLogoAlign );
  const setHeaderLogoAlign = useChartStore( ( state ) => state.setHeaderLogoAlign );
  const headerLogoPosition = useChartStore( ( state ) => state.headerLogoPosition );
  const setHeaderLogoPosition = useChartStore(
    ( state ) => state.setHeaderLogoPosition
  );
  const headerLogoPositionTop = useChartStore(
    ( state ) => state.headerLogoPositionTop
  );
  const setHeaderLogoPositionTop = useChartStore(
    ( state ) => state.setHeaderLogoPositionTop
  );
  const headerLogoPositionRight = useChartStore(
    ( state ) => state.headerLogoPositionRight
  );
  const setHeaderLogoPositionRight = useChartStore(
    ( state ) => state.setHeaderLogoPositionRight
  );
  const headerLogoPositionBottom = useChartStore(
    ( state ) => state.headerLogoPositionBottom
  );
  const setHeaderLogoPositionBottom = useChartStore(
    ( state ) => state.setHeaderLogoPositionBottom
  );
  const headerLogoPositionLeft = useChartStore(
    ( state ) => state.headerLogoPositionLeft
  );
  const setHeaderLogoPositionLeft = useChartStore(
    ( state ) => state.setHeaderLogoPositionLeft
  );

  return (
    <div className='settings-container'>
      {/* Alignment */ }
      <FormField
        label='Alignment'
        type='button-group'
        value={ headerAlignment }
        onChange={ setHeaderAlignment }
        options={ [
          { value: 'left', icon: <AlignLeft className='icon-sm' /> },
          { value: 'center', icon: <AlignCenter className='icon-sm' /> },
          { value: 'right', icon: <AlignRight className='icon-sm' /> },
        ] }
      />

      <Separator />

      {/* Title */ }
      <FormSection title='Title'>
        <FormField
          label='Title'
          type='text'
          value={ chartTitle }
          onChange={ setChartTitle }
          placeholder='Enter chart title'
        />

        <CustomStyle
          styleEnabled={ titleStyleEnabled }
          setStyleEnabled={ setTitleStyleEnabled }
          color={ titleColor }
          setColor={ setTitleColor }
          font={ titleFont }
          setFont={ setTitleFont }
          fontSize={ titleFontSize }
          setFontSize={ setTitleFontSize }
          fontWeight={ titleFontWeight }
          setFontWeight={ setTitleFontWeight }
          lineHeight={ titleLineHeight }
          setLineHeight={ setTitleLineHeight }
          spaceAbove={ titleSpaceAbove }
          setSpaceAbove={ setTitleSpaceAbove }
        />
      </FormSection>

      <Separator />

      {/* Subtitle */ }
      <FormSection title='Subtitle'>
        <FormField
          label='Subtitle'
          type='text'
          value={ chartSubtitle }
          onChange={ setChartSubtitle }
          placeholder='Enter chart subtitle'
        />
        <CustomStyle
          styleEnabled={ subtitleStyleEnabled }
          setStyleEnabled={ setSubtitleStyleEnabled }
          color={ subtitleColor }
          setColor={ setSubtitleColor }
          font={ subtitleFont }
          setFont={ setSubtitleFont }
          fontSize={ subtitleFontSize }
          setFontSize={ setSubtitleFontSize }
          fontWeight={ subtitleFontWeight }
          setFontWeight={ setSubtitleFontWeight }
          lineHeight={ subtitleLineHeight }
          setLineHeight={ setSubtitleLineHeight }
          spaceAbove={ subtitleSpaceAbove }
          setSpaceAbove={ setSubtitleSpaceAbove }
        />
      </FormSection>

      <Separator />

      {/* Header Text */ }
      <FormSection title='Text'>
        <FormField
          label='Text'
          type='textarea'
          value={ headerText }
          onChange={ setHeaderText }
          placeholder='Enter header text or description'
          rows={ 5 }
        />

        <CustomStyle
          styleEnabled={ headerTextStyleEnabled }
          setStyleEnabled={ setHeaderTextStyleEnabled }
          color={ headerTextColor }
          setColor={ setHeaderTextColor }
          font={ headerTextFont }
          setFont={ setHeaderTextFont }
          fontSize={ headerTextFontSize }
          setFontSize={ setHeaderTextFontSize }
          fontWeight={ headerTextFontWeight }
          setFontWeight={ setHeaderTextFontWeight }
          lineHeight={ headerTextLineHeight }
          setLineHeight={ setHeaderTextLineHeight }
          spaceAbove={ headerTextSpaceAbove }
          setSpaceAbove={ setHeaderTextSpaceAbove }
        />
      </FormSection>

      <Separator />

      {/* Border */ }
      <FormSection title='Border'>
        <FormField
          type='select'
          value={ headerBorder }
          onChange={ setHeaderBorder }
          options={ [
            { value: 'none', label: 'None' },
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'top-bottom', label: 'Top & Bottom' },
          ] }
        />

        { headerBorder !== 'none' && (
          <div className='settings-nested-section'>
            <FormSection>
              <FormGrid columns={ 2 }>
                <FormField
                  type='select'
                  label='Style'
                  value={ headerBorderStyle }
                  onChange={ setHeaderBorderStyle }
                  options={ [
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                  ] }
                />

                <FormField
                  type='number'
                  label='Space (px)'
                  value={ headerBorderSpace }
                  onChange={ ( v ) => setHeaderBorderSpace( v ?? 0 ) }
                  min={ 0 }
                  max={ 50 }
                />
              </FormGrid>
              <FormGrid columns={ 2 }>
                <FormField
                  type='number'
                  label='Width (px)'
                  value={ headerBorderWidth }
                  onChange={ ( v ) => setHeaderBorderWidth( v ?? 1 ) }
                  min={ 1 }
                  max={ 10 }
                />

                <FormField
                  type='color'
                  label='Color'
                  value={ headerBorderColor }
                  onChange={ setHeaderBorderColor }
                />
              </FormGrid>
            </FormSection>
          </div>
        ) }
      </FormSection>

      <Separator />

      {/* Logo / Image */ }
      <FormSection title='Logo / Image'>
        <FormField
          label='Enabled'
          type='switch'
          checked={ headerLogoEnabled }
          onChange={ setHeaderLogoEnabled }
        />

        { headerLogoEnabled && (
          <FormSection className='settings-nested-section'>
            <FormGrid columns={ 2 }>
              <FormField
                type='url'
                label='Image URL'
                value={ headerLogoImageUrl }
                onChange={ setHeaderLogoImageUrl }
                placeholder='https://...'
              />

              <FormField
                type='url'
                label='Link URL'
                value={ headerLogoImageLink }
                onChange={ setHeaderLogoImageLink }
                placeholder='https://...'
              />

              <FormField
                type='number'
                label='Height (px)'
                value={ headerLogoHeight }
                onChange={ ( v ) => setHeaderLogoHeight( v ?? 50 ) }
                min={ 20 }
                max={ 200 }
              />

              <FormField
                type='select'
                label='Align'
                value={ headerLogoAlign }
                onChange={ setHeaderLogoAlign }
                options={ [
                  { value: 'header', label: 'Header' },
                  { value: 'main-container', label: 'Main Container' },
                ] }
              />
            </FormGrid>

            <FormField
              type='button-group'
              label='Position'
              value={ headerLogoPosition }
              onChange={ setHeaderLogoPosition }
              options={ [
                { value: 'top', icon: <ArrowUp className='icon-sm' /> },
                { value: 'left', icon: <ArrowLeft className='icon-sm' /> },
                { value: 'right', icon: <ArrowRight className='icon-sm' /> },
              ] }
            />
            <FormGrid columns={ 4 }>
              <FormField
                type='number'
                label='Top'
                value={ headerLogoPositionTop }
                onChange={ ( v ) => setHeaderLogoPositionTop( v ?? 0 ) }
              />

              <FormField
                type='number'
                label='Right'
                value={ headerLogoPositionRight }
                onChange={ ( v ) => setHeaderLogoPositionRight( v ?? 0 ) }
              />

              <FormField
                type='number'
                label='Bottom'
                value={ headerLogoPositionBottom }
                onChange={ ( v ) => setHeaderLogoPositionBottom( v ?? 0 ) }
              />

              <FormField
                type='number'
                label='Left'
                value={ headerLogoPositionLeft }
                onChange={ ( v ) => setHeaderLogoPositionLeft( v ?? 0 ) }
              />
            </FormGrid>
          </FormSection>
        ) }
      </FormSection>
    </div>
  );
}
