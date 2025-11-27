'use client';

import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';
import { FormGrid } from '@/components/ui/form-grid';
import { ColumnSelector } from '@/components/column-selector';
import { Label } from '@/components/ui/label';

export function TooltipSettings() {
  const {
    tooltipShow,
    setTooltipShow,
    tooltipBackgroundColor,
    setTooltipBackgroundColor,
    tooltipTextColor,
    setTooltipTextColor,
    tooltipBorderRadius,
    setTooltipBorderRadius,
    tooltipPadding,
    setTooltipPadding,
    tooltipShowArrow,
    setTooltipShowArrow,
    availableColumns,
    columnMapping,
    setColumnMapping,
    tooltipTitleMode,
    setTooltipTitleMode,
    tooltipCustomTitle,
    setTooltipCustomTitle,
    // Header
    tooltipHeaderTextColor,
    setTooltipHeaderTextColor,
    tooltipHeaderBackgroundColor,
    setTooltipHeaderBackgroundColor,
    tooltipHeaderFontSize,
    setTooltipHeaderFontSize,
    tooltipHeaderFontWeight,
    setTooltipHeaderFontWeight,
    tooltipHeaderPadding,
    setTooltipHeaderPadding,
    tooltipHeaderAlignment,
    setTooltipHeaderAlignment,
    tooltipHeaderFontFamily,
    setTooltipHeaderFontFamily,
    // Content
    tooltipContentTextColor,
    setTooltipContentTextColor,
    tooltipContentBackgroundColor,
    setTooltipContentBackgroundColor,
    tooltipContentFontSize,
    setTooltipContentFontSize,
    tooltipContentFontWeight,
    setTooltipContentFontWeight,
    tooltipContentPadding,
    setTooltipContentPadding,
    tooltipContentAlignment,
    setTooltipContentAlignment,
    tooltipContentFontFamily,
    setTooltipContentFontFamily,
  } = useChartStore(
    useShallow( ( state ) => ( {
      tooltipShow: state.tooltipShow,
      setTooltipShow: state.setTooltipShow,
      tooltipBackgroundColor: state.tooltipBackgroundColor,
      setTooltipBackgroundColor: state.setTooltipBackgroundColor,
      tooltipTextColor: state.tooltipTextColor,
      setTooltipTextColor: state.setTooltipTextColor,
      tooltipBorderRadius: state.tooltipBorderRadius,
      setTooltipBorderRadius: state.setTooltipBorderRadius,
      tooltipPadding: state.tooltipPadding,
      setTooltipPadding: state.setTooltipPadding,
      tooltipShowArrow: state.tooltipShowArrow,
      setTooltipShowArrow: state.setTooltipShowArrow,
      availableColumns: state.availableColumns,
      columnMapping: state.columnMapping,
      setColumnMapping: state.setColumnMapping,
      tooltipTitleMode: state.tooltipTitleMode,
      setTooltipTitleMode: state.setTooltipTitleMode,
      tooltipCustomTitle: state.tooltipCustomTitle,
      setTooltipCustomTitle: state.setTooltipCustomTitle,
      // Header
      tooltipHeaderTextColor: state.tooltipHeaderTextColor,
      setTooltipHeaderTextColor: state.setTooltipHeaderTextColor,
      tooltipHeaderBackgroundColor: state.tooltipHeaderBackgroundColor,
      setTooltipHeaderBackgroundColor: state.setTooltipHeaderBackgroundColor,
      tooltipHeaderFontSize: state.tooltipHeaderFontSize,
      setTooltipHeaderFontSize: state.setTooltipHeaderFontSize,
      tooltipHeaderFontWeight: state.tooltipHeaderFontWeight,
      setTooltipHeaderFontWeight: state.setTooltipHeaderFontWeight,
      tooltipHeaderPadding: state.tooltipHeaderPadding,
      setTooltipHeaderPadding: state.setTooltipHeaderPadding,
      tooltipHeaderAlignment: state.tooltipHeaderAlignment,
      setTooltipHeaderAlignment: state.setTooltipHeaderAlignment,
      tooltipHeaderFontFamily: state.tooltipHeaderFontFamily,
      setTooltipHeaderFontFamily: state.setTooltipHeaderFontFamily,
      // Content
      tooltipContentTextColor: state.tooltipContentTextColor,
      setTooltipContentTextColor: state.setTooltipContentTextColor,
      tooltipContentBackgroundColor: state.tooltipContentBackgroundColor,
      setTooltipContentBackgroundColor: state.setTooltipContentBackgroundColor,
      tooltipContentFontSize: state.tooltipContentFontSize,
      setTooltipContentFontSize: state.setTooltipContentFontSize,
      tooltipContentFontWeight: state.tooltipContentFontWeight,
      setTooltipContentFontWeight: state.setTooltipContentFontWeight,
      tooltipContentPadding: state.tooltipContentPadding,
      setTooltipContentPadding: state.setTooltipContentPadding,
      tooltipContentAlignment: state.tooltipContentAlignment,
      setTooltipContentAlignment: state.setTooltipContentAlignment,
      tooltipContentFontFamily: state.tooltipContentFontFamily,
      setTooltipContentFontFamily: state.setTooltipContentFontFamily,
    } ) )
  );

  return (
    <div className='settings-container'>
      <FormField
        label='Show Tooltip'
        type='switch'
        checked={ tooltipShow }
        onChange={ setTooltipShow }
      />

      { tooltipShow && (
        <>
          <Separator />

          <FormSection title='Content'>
            <FormRow>
              <FormCol>
                <FormField
                  label='Title Mode'
                  type='select'
                  value={ tooltipTitleMode }
                  onChange={ setTooltipTitleMode }
                  options={ [
                    { label: 'Data Label', value: 'label' },
                    { label: 'Custom Text', value: 'custom' },
                  ] }
                />
              </FormCol>
              { tooltipTitleMode === 'custom' && (
                <FormCol>
                  <FormField
                    label='Custom Title'
                    type='text'
                    value={ tooltipCustomTitle }
                    onChange={ setTooltipCustomTitle }
                    placeholder='Enter title...'
                  />
                </FormCol>
              ) }
            </FormRow>

            <div className="space-y-2 mt-4">
              <Label className="text-xs font-medium">Custom Columns</Label>
              <ColumnSelector
                availableColumns={ availableColumns }
                selectedColumns={ columnMapping.customPopups }
                onSelect={ ( index ) =>
                  setColumnMapping( { customPopups: index as number[] } )
                }
                mode='multiple'
                placeholder='Select columns to show'
                color='cyan'
                allowClear
              />
            </div>
          </FormSection>

          <Separator />

          <Separator />

          <FormSection title='Header Styling'>
            <FormGrid columns={ 2 }>
              <FormField
                label='Text Color'
                type='color'
                value={ tooltipHeaderTextColor }
                onChange={ setTooltipHeaderTextColor }
              />
              <FormField
                label='Background'
                type='color'
                value={ tooltipHeaderBackgroundColor }
                onChange={ setTooltipHeaderBackgroundColor }
              />
              <FormField
                label='Font Size'
                type='number'
                value={ tooltipHeaderFontSize }
                onChange={ ( v ) => setTooltipHeaderFontSize( v ?? 14 ) }
                min={ 8 }
                max={ 32 }
              />
              <FormField
                label='Padding'
                type='number'
                value={ tooltipHeaderPadding }
                onChange={ ( v ) => setTooltipHeaderPadding( v ?? 0 ) }
                min={ 0 }
                max={ 32 }
              />
              <FormField
                label='Font Weight'
                type='select'
                value={ tooltipHeaderFontWeight }
                onChange={ setTooltipHeaderFontWeight }
                options={ [
                  { label: 'Normal', value: 'normal' },
                  { label: 'Bold', value: 'bold' },
                  { label: 'Light', value: '300' },
                  { label: 'Medium', value: '500' },
                  { label: 'Heavy', value: '900' },
                ] }
              />
              <FormField
                label='Alignment'
                type='select'
                value={ tooltipHeaderAlignment }
                onChange={ setTooltipHeaderAlignment }
                options={ [
                  { label: 'Start', value: 'start' },
                  { label: 'Center', value: 'center' },
                  { label: 'End', value: 'end' },
                ] }
              />
            </FormGrid>
          </FormSection>

          <Separator />

          <FormSection title='Content Styling'>
            <FormGrid columns={ 2 }>
              <FormField
                label='Text Color'
                type='color'
                value={ tooltipContentTextColor }
                onChange={ setTooltipContentTextColor }
              />
              <FormField
                label='Background'
                type='color'
                value={ tooltipContentBackgroundColor }
                onChange={ setTooltipContentBackgroundColor }
              />
              <FormField
                label='Font Size'
                type='number'
                value={ tooltipContentFontSize }
                onChange={ ( v ) => setTooltipContentFontSize( v ?? 12 ) }
                min={ 8 }
                max={ 32 }
              />
              <FormField
                label='Padding'
                type='number'
                value={ tooltipContentPadding }
                onChange={ ( v ) => setTooltipContentPadding( v ?? 0 ) }
                min={ 0 }
                max={ 32 }
              />
              <FormField
                label='Font Weight'
                type='select'
                value={ tooltipContentFontWeight }
                onChange={ setTooltipContentFontWeight }
                options={ [
                  { label: 'Normal', value: 'normal' },
                  { label: 'Bold', value: 'bold' },
                  { label: 'Light', value: '300' },
                  { label: 'Medium', value: '500' },
                  { label: 'Heavy', value: '900' },
                ] }
              />
              <FormField
                label='Alignment'
                type='select'
                value={ tooltipContentAlignment }
                onChange={ setTooltipContentAlignment }
                options={ [
                  { label: 'Start', value: 'start' },
                  { label: 'Center', value: 'center' },
                  { label: 'End', value: 'end' },
                ] }
              />
            </FormGrid>
          </FormSection>

          <Separator />

          <FormSection title='General Appearance'>
            <FormField
              label='Show Arrow'
              type='switch'
              checked={ tooltipShowArrow }
              onChange={ setTooltipShowArrow }
            />

            <FormGrid columns={ 2 }>
              <FormField
                label='Container Background'
                type='color'
                value={ tooltipBackgroundColor }
                onChange={ setTooltipBackgroundColor }
              />
              <FormField
                label='Default Text Color'
                type='color'
                value={ tooltipTextColor }
                onChange={ setTooltipTextColor }
              />
              <FormField
                label='Border Radius'
                type='number'
                value={ tooltipBorderRadius }
                onChange={ ( v ) => setTooltipBorderRadius( v ?? 0 ) }
                min={ 0 }
                max={ 50 }
              />
              <FormField
                label='Container Padding'
                type='number'
                value={ tooltipPadding }
                onChange={ ( v ) => setTooltipPadding( v ?? 0 ) }
                min={ 0 }
                max={ 50 }
              />
            </FormGrid>
          </FormSection>
        </>
      ) }
    </div>
  );
}
