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

export function HeaderSettingsSection() {
  // Alignment
  const headerAlignment = useChartStore((state) => state.headerAlignment);
  const setHeaderAlignment = useChartStore((state) => state.setHeaderAlignment);

  // Title
  const chartTitle = useChartStore((state) => state.chartTitle);
  const setChartTitle = useChartStore((state) => state.setChartTitle);
  const titleStyleEnabled = useChartStore((state) => state.titleStyleEnabled);
  const setTitleStyleEnabled = useChartStore(
    (state) => state.setTitleStyleEnabled
  );
  const titleFont = useChartStore((state) => state.titleFont);
  const setTitleFont = useChartStore((state) => state.setTitleFont);
  const titleFontSize = useChartStore((state) => state.titleFontSize);
  const setTitleFontSize = useChartStore((state) => state.setTitleFontSize);
  const titleFontWeight = useChartStore((state) => state.titleFontWeight);
  const setTitleFontWeight = useChartStore((state) => state.setTitleFontWeight);
  const titleColor = useChartStore((state) => state.titleColor);
  const setTitleColor = useChartStore((state) => state.setTitleColor);
  const titleLineHeight = useChartStore((state) => state.titleLineHeight);
  const setTitleLineHeight = useChartStore((state) => state.setTitleLineHeight);
  const titleSpaceAbove = useChartStore((state) => state.titleSpaceAbove);
  const setTitleSpaceAbove = useChartStore((state) => state.setTitleSpaceAbove);

  // Subtitle
  const chartSubtitle = useChartStore((state) => state.chartSubtitle);
  const setChartSubtitle = useChartStore((state) => state.setChartSubtitle);
  const subtitleStyleEnabled = useChartStore(
    (state) => state.subtitleStyleEnabled
  );
  const setSubtitleStyleEnabled = useChartStore(
    (state) => state.setSubtitleStyleEnabled
  );
  const subtitleFont = useChartStore((state) => state.subtitleFont);
  const setSubtitleFont = useChartStore((state) => state.setSubtitleFont);
  const subtitleFontSize = useChartStore((state) => state.subtitleFontSize);
  const setSubtitleFontSize = useChartStore(
    (state) => state.setSubtitleFontSize
  );
  const subtitleFontWeight = useChartStore((state) => state.subtitleFontWeight);
  const setSubtitleFontWeight = useChartStore(
    (state) => state.setSubtitleFontWeight
  );
  const subtitleColor = useChartStore((state) => state.subtitleColor);
  const setSubtitleColor = useChartStore((state) => state.setSubtitleColor);
  const subtitleLineHeight = useChartStore((state) => state.subtitleLineHeight);
  const setSubtitleLineHeight = useChartStore(
    (state) => state.setSubtitleLineHeight
  );
  const subtitleSpaceAbove = useChartStore((state) => state.subtitleSpaceAbove);
  const setSubtitleSpaceAbove = useChartStore(
    (state) => state.setSubtitleSpaceAbove
  );

  // Header text
  const headerText = useChartStore((state) => state.headerText);
  const setHeaderText = useChartStore((state) => state.setHeaderText);
  const headerTextStyleEnabled = useChartStore(
    (state) => state.headerTextStyleEnabled
  );
  const setHeaderTextStyleEnabled = useChartStore(
    (state) => state.setHeaderTextStyleEnabled
  );
  const headerTextFont = useChartStore((state) => state.headerTextFont);
  const setHeaderTextFont = useChartStore((state) => state.setHeaderTextFont);
  const headerTextFontSize = useChartStore((state) => state.headerTextFontSize);
  const setHeaderTextFontSize = useChartStore(
    (state) => state.setHeaderTextFontSize
  );
  const headerTextFontWeight = useChartStore(
    (state) => state.headerTextFontWeight
  );
  const setHeaderTextFontWeight = useChartStore(
    (state) => state.setHeaderTextFontWeight
  );
  const headerTextColor = useChartStore((state) => state.headerTextColor);
  const setHeaderTextColor = useChartStore((state) => state.setHeaderTextColor);
  const headerTextLineHeight = useChartStore(
    (state) => state.headerTextLineHeight
  );
  const setHeaderTextLineHeight = useChartStore(
    (state) => state.setHeaderTextLineHeight
  );
  const headerTextSpaceAbove = useChartStore(
    (state) => state.headerTextSpaceAbove
  );
  const setHeaderTextSpaceAbove = useChartStore(
    (state) => state.setHeaderTextSpaceAbove
  );

  // Border
  const headerBorder = useChartStore((state) => state.headerBorder);
  const setHeaderBorder = useChartStore((state) => state.setHeaderBorder);
  const headerBorderStyle = useChartStore((state) => state.headerBorderStyle);
  const setHeaderBorderStyle = useChartStore(
    (state) => state.setHeaderBorderStyle
  );
  const headerBorderSpace = useChartStore((state) => state.headerBorderSpace);
  const setHeaderBorderSpace = useChartStore(
    (state) => state.setHeaderBorderSpace
  );
  const headerBorderWidth = useChartStore((state) => state.headerBorderWidth);
  const setHeaderBorderWidth = useChartStore(
    (state) => state.setHeaderBorderWidth
  );
  const headerBorderColor = useChartStore((state) => state.headerBorderColor);
  const setHeaderBorderColor = useChartStore(
    (state) => state.setHeaderBorderColor
  );

  // Logo/Image
  const headerLogoEnabled = useChartStore((state) => state.headerLogoEnabled);
  const setHeaderLogoEnabled = useChartStore(
    (state) => state.setHeaderLogoEnabled
  );
  const headerLogoImageUrl = useChartStore((state) => state.headerLogoImageUrl);
  const setHeaderLogoImageUrl = useChartStore(
    (state) => state.setHeaderLogoImageUrl
  );
  const headerLogoImageLink = useChartStore(
    (state) => state.headerLogoImageLink
  );
  const setHeaderLogoImageLink = useChartStore(
    (state) => state.setHeaderLogoImageLink
  );
  const headerLogoHeight = useChartStore((state) => state.headerLogoHeight);
  const setHeaderLogoHeight = useChartStore(
    (state) => state.setHeaderLogoHeight
  );
  const headerLogoAlign = useChartStore((state) => state.headerLogoAlign);
  const setHeaderLogoAlign = useChartStore((state) => state.setHeaderLogoAlign);
  const headerLogoPosition = useChartStore((state) => state.headerLogoPosition);
  const setHeaderLogoPosition = useChartStore(
    (state) => state.setHeaderLogoPosition
  );
  const headerLogoPositionTop = useChartStore(
    (state) => state.headerLogoPositionTop
  );
  const setHeaderLogoPositionTop = useChartStore(
    (state) => state.setHeaderLogoPositionTop
  );
  const headerLogoPositionRight = useChartStore(
    (state) => state.headerLogoPositionRight
  );
  const setHeaderLogoPositionRight = useChartStore(
    (state) => state.setHeaderLogoPositionRight
  );
  const headerLogoPositionBottom = useChartStore(
    (state) => state.headerLogoPositionBottom
  );
  const setHeaderLogoPositionBottom = useChartStore(
    (state) => state.setHeaderLogoPositionBottom
  );
  const headerLogoPositionLeft = useChartStore(
    (state) => state.headerLogoPositionLeft
  );
  const setHeaderLogoPositionLeft = useChartStore(
    (state) => state.setHeaderLogoPositionLeft
  );

  return (
    <div className='settings-container'>
      {/* Alignment */}
      <FormSection title='Alignment'>
        <FormField
          type='button-group'
          value={headerAlignment}
          onChange={setHeaderAlignment}
          options={[
            { value: 'left', icon: <AlignLeft className='h-4 w-4' /> },
            { value: 'center', icon: <AlignCenter className='h-4 w-4' /> },
            { value: 'right', icon: <AlignRight className='h-4 w-4' /> },
          ]}
        />
      </FormSection>

      <Separator />

      {/* Title */}
      <FormSection title='Title'>
        <FormField
          type='text'
          value={chartTitle}
          onChange={setChartTitle}
          placeholder='Enter chart title'
        />

        <FormField
          type='switch'
          label='Custom Style'
          checked={titleStyleEnabled}
          onChange={setTitleStyleEnabled}
        />

        {titleStyleEnabled && (
          <div className='settings-nested-section'>
            <FormRow>
              <FormCol span='auto'>
                <FormField
                  type='select'
                  label='Font'
                  value={titleFont}
                  onChange={setTitleFont}
                  options={[
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
                  ]}
                />
              </FormCol>

              <FormCol span={4}>
                <FormField
                  type='number'
                  label='Size'
                  value={titleFontSize}
                  onChange={setTitleFontSize}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </FormCol>
            </FormRow>

            <FormGrid columns={3}>
              <FormField
                type='button-group'
                label='Weight'
                value={titleFontWeight}
                onChange={setTitleFontWeight}
                options={[
                  { value: 'bold', icon: <Bold className='h-3 w-3' /> },
                  { value: 'medium', label: 'M' },
                  { value: 'regular', icon: <Type className='h-3 w-3' /> },
                ]}
              />

              <FormField
                type='color'
                label='Color'
                value={titleColor}
                onChange={setTitleColor}
              />

              <FormField
                type='number'
                label='Line Height'
                value={titleLineHeight}
                onChange={setTitleLineHeight}
                min={0.8}
                max={3}
                step={0.1}
              />
            </FormGrid>

            <FormField
              type='button-group'
              label='Space Above'
              value={titleSpaceAbove}
              onChange={setTitleSpaceAbove}
              options={[
                { value: 'slim', icon: <Minus className='h-4 w-4' /> },
                { value: 'medium', icon: <Maximize2 className='h-4 w-4' /> },
                { value: 'large', icon: <Maximize className='h-4 w-4' /> },
                { value: 'none', icon: <Square className='h-4 w-4' /> },
              ]}
            />
          </div>
        )}
      </FormSection>

      <Separator />

      {/* Subtitle */}
      <FormSection title='Subtitle'>
        <FormField
          type='text'
          value={chartSubtitle}
          onChange={setChartSubtitle}
          placeholder='Enter chart subtitle'
        />

        <FormField
          type='switch'
          label='Custom Style'
          checked={subtitleStyleEnabled}
          onChange={setSubtitleStyleEnabled}
        />

        {subtitleStyleEnabled && (
          <div className='settings-nested-section'>
            <FormField
              type='select'
              label='Font'
              value={subtitleFont}
              onChange={setSubtitleFont}
              options={[
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
              ]}
            />

            <FormField
              type='number'
              label='Size'
              value={subtitleFontSize}
              onChange={setSubtitleFontSize}
              min={0.1}
              max={5}
              step={0.1}
            />

            <FormGrid columns={3}>
              <FormField
                type='button-group'
                label='Weight'
                value={subtitleFontWeight}
                onChange={setSubtitleFontWeight}
                options={[
                  { value: 'bold', icon: <Bold className='h-3 w-3' /> },
                  { value: 'medium', label: 'M' },
                  { value: 'regular', icon: <Type className='h-3 w-3' /> },
                ]}
              />

              <FormField
                type='color'
                label='Color'
                value={subtitleColor}
                onChange={setSubtitleColor}
              />

              <FormField
                type='number'
                label='Line Height'
                value={subtitleLineHeight}
                onChange={setSubtitleLineHeight}
                min={0.8}
                max={3}
                step={0.1}
              />
            </FormGrid>

            <FormField
              type='button-group'
              label='Space Above'
              value={subtitleSpaceAbove}
              onChange={setSubtitleSpaceAbove}
              options={[
                { value: 'slim', icon: <Minus className='h-4 w-4' /> },
                { value: 'medium', icon: <Maximize2 className='h-4 w-4' /> },
                { value: 'large', icon: <Maximize className='h-4 w-4' /> },
                { value: 'none', icon: <Square className='h-4 w-4' /> },
              ]}
            />
          </div>
        )}
      </FormSection>

      <Separator />

      {/* Header Text */}
      <FormSection title='Text'>
        <FormField
          type='textarea'
          value={headerText}
          onChange={setHeaderText}
          placeholder='Enter header text or description'
          rows={5}
        />

        <FormField
          type='switch'
          label='Custom Style'
          checked={headerTextStyleEnabled}
          onChange={setHeaderTextStyleEnabled}
        />

        {headerTextStyleEnabled && (
          <div className='settings-nested-section-enhanced'>
            <FormRow gap='md' align='start'>
              <FormCol span='auto'>
                <FormField
                  type='select'
                  label='Font'
                  value={headerTextFont}
                  onChange={setHeaderTextFont}
                  options={[
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
                  ]}
                />
              </FormCol>

              <FormCol span={4}>
                <FormField
                  type='number'
                  label='Size'
                  value={headerTextFontSize}
                  onChange={setHeaderTextFontSize}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </FormCol>
            </FormRow>

            <FormGrid columns={3}>
              <FormField
                type='button-group'
                label='Weight'
                value={headerTextFontWeight}
                onChange={setHeaderTextFontWeight}
                options={[
                  { value: 'bold', icon: <Bold className='h-3 w-3' /> },
                  { value: 'medium', label: 'M' },
                  { value: 'regular', icon: <Type className='h-3 w-3' /> },
                ]}
              />

              <FormField
                type='color'
                label='Color'
                value={headerTextColor}
                onChange={setHeaderTextColor}
              />

              <FormField
                type='number'
                label='Line Height'
                value={headerTextLineHeight}
                onChange={setHeaderTextLineHeight}
                min={0.8}
                max={3}
                step={0.1}
              />
            </FormGrid>

            <FormField
              type='button-group'
              label='Space Above'
              value={headerTextSpaceAbove}
              onChange={setHeaderTextSpaceAbove}
              options={[
                { value: 'slim', icon: <Minus className='h-4 w-4' /> },
                { value: 'medium', icon: <Maximize2 className='h-4 w-4' /> },
                { value: 'large', icon: <Maximize className='h-4 w-4' /> },
                { value: 'none', icon: <Square className='h-4 w-4' /> },
              ]}
            />
          </div>
        )}
      </FormSection>

      <Separator />

      {/* Border */}
      <FormSection title='Border'>
        <FormField
          type='select'
          value={headerBorder}
          onChange={setHeaderBorder}
          options={[
            { value: 'none', label: 'None' },
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'top-bottom', label: 'Top & Bottom' },
          ]}
        />

        {headerBorder !== 'none' && (
          <div className='settings-nested-section'>
            <FormGrid columns={2}>
              <FormField
                type='select'
                label='Style'
                value={headerBorderStyle}
                onChange={setHeaderBorderStyle}
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'dashed', label: 'Dashed' },
                  { value: 'dotted', label: 'Dotted' },
                ]}
              />

              <FormField
                type='number'
                label='Space (px)'
                value={headerBorderSpace}
                onChange={setHeaderBorderSpace}
                min={0}
                max={50}
              />

              <FormField
                type='number'
                label='Width (px)'
                value={headerBorderWidth}
                onChange={setHeaderBorderWidth}
                min={1}
                max={10}
              />

              <FormField
                type='color'
                label='Color'
                value={headerBorderColor}
                onChange={setHeaderBorderColor}
              />
            </FormGrid>
          </div>
        )}
      </FormSection>

      <Separator />

      {/* Logo / Image */}
      <FormSection title='Logo / Image'>
        <FormField
          type='switch'
          checked={headerLogoEnabled}
          onChange={setHeaderLogoEnabled}
        />

        {headerLogoEnabled && (
          <div className='settings-nested-section'>
            <FormGrid columns={2}>
              <FormField
                type='url'
                label='Image URL'
                value={headerLogoImageUrl}
                onChange={setHeaderLogoImageUrl}
                placeholder='https://...'
              />

              <FormField
                type='url'
                label='Link URL'
                value={headerLogoImageLink}
                onChange={setHeaderLogoImageLink}
                placeholder='https://...'
              />

              <FormField
                type='number'
                label='Height (px)'
                value={headerLogoHeight}
                onChange={setHeaderLogoHeight}
                min={20}
                max={200}
              />

              <FormField
                type='select'
                label='Align'
                value={headerLogoAlign}
                onChange={setHeaderLogoAlign}
                options={[
                  { value: 'header', label: 'Header' },
                  { value: 'main-container', label: 'Main Container' },
                ]}
              />
            </FormGrid>

            <FormField
              type='button-group'
              label='Position'
              value={headerLogoPosition}
              onChange={setHeaderLogoPosition}
              options={[
                { value: 'top', icon: <ArrowUp className='h-4 w-4' /> },
                { value: 'left', icon: <ArrowLeft className='h-4 w-4' /> },
                { value: 'right', icon: <ArrowRight className='h-4 w-4' /> },
              ]}
            />

            <FormGrid columns={4}>
              <FormField
                type='number'
                label='Top (px)'
                value={headerLogoPositionTop}
                onChange={setHeaderLogoPositionTop}
              />

              <FormField
                type='number'
                label='Right (px)'
                value={headerLogoPositionRight}
                onChange={setHeaderLogoPositionRight}
              />

              <FormField
                type='number'
                label='Bottom (px)'
                value={headerLogoPositionBottom}
                onChange={setHeaderLogoPositionBottom}
              />

              <FormField
                type='number'
                label='Left (px)'
                value={headerLogoPositionLeft}
                onChange={setHeaderLogoPositionLeft}
              />
            </FormGrid>
          </div>
        )}
      </FormSection>
    </div>
  );
}
