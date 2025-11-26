'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ChartSettings } from '@/components/chart-settings';
import { ChartDisplay } from '@/components/ChartDisplay';

export function ChartPreview( { isVisible = true }: { isVisible?: boolean; } ) {
  return (
    <div className='chart-preview-container'>
      <ResizablePanelGroup direction='horizontal' className="flex-col! md:flex-row! gap-4">
        {/* Chart Display Area */ }
        <ResizablePanel defaultSize={ 75 } minSize={ 50 } className="basis-auto! md:basis-0! shrink-0 h-full overflow-auto!">
          <ChartDisplay isVisible={ isVisible } />
        </ResizablePanel>

        {/* Resize Handle */ }
        <ResizableHandle withHandle className="hidden md:flex" />

        {/* Settings Panel */ }
        <ResizablePanel defaultSize={ 25 } minSize={ 20 } maxSize={ 40 } className="basis-auto! md:basis-0!">
          <ChartSettings />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
