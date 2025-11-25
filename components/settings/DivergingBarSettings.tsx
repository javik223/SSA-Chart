'use client';

import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';

export function DivergingBarSettings() {
  const divergingBarSortBy = useChartStore( ( state ) => state.divergingBarSortBy );
  const setDivergingBarSortBy = useChartStore( ( state ) => state.setDivergingBarSortBy );

  const showOnChartControls = useChartStore( ( state ) => state.showOnChartControls );
  const setShowOnChartControls = useChartStore( ( state ) => state.setShowOnChartControls );

  const divergingBarLabelPosition = useChartStore( ( state ) => state.divergingBarLabelPosition );
  const setDivergingBarLabelPosition = useChartStore( ( state ) => state.setDivergingBarLabelPosition );

  const divergingBarUseGradientColors = useChartStore( ( state ) => state.divergingBarUseGradientColors );
  const setDivergingBarUseGradientColors = useChartStore( ( state ) => state.setDivergingBarUseGradientColors );

  const divergingBarPositiveColor = useChartStore( ( state ) => state.divergingBarPositiveColor );
  const setDivergingBarPositiveColor = useChartStore( ( state ) => state.setDivergingBarPositiveColor );

  const divergingBarNegativeColor = useChartStore( ( state ) => state.divergingBarNegativeColor );
  const setDivergingBarNegativeColor = useChartStore( ( state ) => state.setDivergingBarNegativeColor );

  return (
    <div className='settings-container'>
      <FormSection title='Controls'>
        <FormField
          type='switch'
          label='Show On-Chart Controls'
          checked={ showOnChartControls }
          onChange={ setShowOnChartControls }
        />
      </FormSection>

      <Separator />

      {/* Sort Settings */ }
      <FormSection title='Sort Options'>
        <FormField
          type='select'
          label='Sort By'
          value={ divergingBarSortBy }
          onChange={ setDivergingBarSortBy }
          options={ [
            { value: 'none', label: 'None (Original Order)' },
            { value: 'ascending', label: 'Ascending (Low to High)' },
            { value: 'descending', label: 'Descending (High to Low)' },
            { value: 'value', label: 'By Value' },
          ] }
        />
      </FormSection>

      <Separator />

      {/* Value Label Settings */ }
      <FormSection title='Value Labels'>
        <FormField
          type='button-group'
          label='Label Position'
          value={ divergingBarLabelPosition }
          onChange={ setDivergingBarLabelPosition }
          options={ [
            { value: 'inside', label: 'Inside bars' },
            { value: 'outside', label: 'Outside bars' },
          ] }
        />
      </FormSection>

      <Separator />

      {/* Color Settings */ }
      <FormSection title='Colors'>
        <FormField
          type='switch'
          label='Use Gradient Colors'
          checked={ divergingBarUseGradientColors }
          onChange={ setDivergingBarUseGradientColors }
        />
        <p className='text-xs text-zinc-500 mt-1'>
          Enable to use a color gradient from red (negative) through light gray (zero) to blue (positive)
        </p>

        { !divergingBarUseGradientColors && (
          <FormGrid columns={ 2 }>
            <FormField
              type='color'
              label='Positive Color'
              value={ divergingBarPositiveColor }
              onChange={ setDivergingBarPositiveColor }
            />
            <FormField
              type='color'
              label='Negative Color'
              value={ divergingBarNegativeColor }
              onChange={ setDivergingBarNegativeColor }
            />
          </FormGrid>
        ) }
      </FormSection>
    </div>
  );
}
