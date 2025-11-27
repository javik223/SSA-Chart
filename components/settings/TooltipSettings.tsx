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

          <FormSection title='Appearance'>
            <FormField
              label='Show Arrow'
              type='switch'
              checked={ tooltipShowArrow }
              onChange={ setTooltipShowArrow }
            />

            <FormGrid columns={ 2 }>
              <FormField
                label='Background'
                type='color'
                value={ tooltipBackgroundColor }
                onChange={ setTooltipBackgroundColor }
              />
              <FormField
                label='Text Color'
                type='color'
                value={ tooltipTextColor }
                onChange={ setTooltipTextColor }
              />
            </FormGrid>
          </FormSection>

          <Separator />

          <FormSection title='Spacing (px)'>
            <FormGrid columns={ 2 }>
              <FormField
                label='Border Radius'
                type='number'
                value={ tooltipBorderRadius }
                onChange={ ( v ) => setTooltipBorderRadius( v ?? 0 ) }
                min={ 0 }
                max={ 50 }
              />
              <FormField
                label='Padding'
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
