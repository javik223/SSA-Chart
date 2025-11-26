'use client';

import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';

export function TreemapSettings() {
  const treemapTileMethod = useChartStore( ( state ) => state.treemapTileMethod );
  const setTreemapTileMethod = useChartStore( ( state ) => state.setTreemapTileMethod );

  const treemapPadding = useChartStore( ( state ) => state.treemapPadding );
  const setTreemapPadding = useChartStore( ( state ) => state.setTreemapPadding );

  const treemapColorMode = useChartStore( ( state ) => state.treemapColorMode );
  const setTreemapColorMode = useChartStore( ( state ) => state.setTreemapColorMode );

  const treemapGradientSteepness = useChartStore( ( state ) => state.treemapGradientSteepness );
  const setTreemapGradientSteepness = useChartStore( ( state ) => state.setTreemapGradientSteepness );

  const treemapCategoryLabelColor = useChartStore( ( state ) => state.treemapCategoryLabelColor );
  const setTreemapCategoryLabelColor = useChartStore( ( state ) => state.setTreemapCategoryLabelColor );

  const treemapStrokeWidth = useChartStore( ( state ) => state.treemapStrokeWidth );
  const setTreemapStrokeWidth = useChartStore( ( state ) => state.setTreemapStrokeWidth );

  const treemapStrokeColor = useChartStore( ( state ) => state.treemapStrokeColor );
  const setTreemapStrokeColor = useChartStore( ( state ) => state.setTreemapStrokeColor );

  const showOnChartControls = useChartStore( ( state ) => state.showOnChartControls );
  const setShowOnChartControls = useChartStore( ( state ) => state.setShowOnChartControls );

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

      <FormSection title='Layout'>
        <FormField
          type='select'
          label='Tiling Method'
          value={ treemapTileMethod }
          onChange={ setTreemapTileMethod as any }
          options={ [
            { value: 'binary', label: 'Binary' },
            { value: 'squarify', label: 'Squarify' },
            { value: 'resquarify', label: 'Resquarify' },
            { value: 'slice', label: 'Slice' },
            { value: 'dice', label: 'Dice' },
            { value: 'slice-dice', label: 'Slice-Dice' },
          ] }
        />
        <FormField
          type='number'
          label='Padding'
          value={ treemapPadding }
          onChange={ ( val ) => setTreemapPadding( val || 0 ) }
          min={ 0 }
          max={ 20 }
        />
      </FormSection>

      <Separator />

      <FormSection title='Appearance'>
        <FormField
          type='select'
          label='Color Mode'
          value={ treemapColorMode }
          onChange={ setTreemapColorMode as any }
          options={ [
            { value: 'depth', label: 'By Depth' },
            { value: 'value', label: 'By Value' },
            { value: 'category', label: 'By Category' },
          ] }
        />
        <FormField
          type='number'
          label='Gradient Steepness'
          value={ treemapGradientSteepness }
          onChange={ ( val ) => setTreemapGradientSteepness( val ?? 0.3 ) }
          min={ 0 }
          max={ 1 }
          step={ 0.05 }
        />
        <FormField
          type='color'
          label='Category Label Color'
          value={ treemapCategoryLabelColor }
          onChange={ setTreemapCategoryLabelColor }
        />
        <FormField
          type='number'
          label='Stroke Width'
          value={ treemapStrokeWidth }
          onChange={ ( val ) => setTreemapStrokeWidth( val ?? 1 ) }
          min={ 0 }
          max={ 5 }
          step={ 0.5 }
        />
        <FormField
          type='color'
          label='Stroke Color'
          value={ treemapStrokeColor }
          onChange={ setTreemapStrokeColor }
        />
      </FormSection>
    </div>
  );
}
