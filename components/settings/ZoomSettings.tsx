'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';

export function ZoomSettings() {
  const showZoomControls = useChartStore( ( state ) => state.showZoomControls );
  const setShowZoomControls = useChartStore( ( state ) => state.setShowZoomControls );
  const resetZoom = useChartStore( ( state ) => state.resetZoom );

  return (
    <FormSection>
      <FormField
        type='switch'
        label='Show zoom controls'
        checked={ showZoomControls }
        onChange={ setShowZoomControls }
      />
      <p className='text-xs text-zinc-500 mt-1'>Display zoom buttons on the chart</p>

      { showZoomControls && (
        <Button
          variant='outline'
          size='sm'
          onClick={ resetZoom }
          className='w-full mt-2'
        >
          <RefreshCw className='icon-sm mr-2' />
          Reset Zoom
        </Button>
      ) }
    </FormSection>
  );
}
