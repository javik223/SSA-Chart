'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { BasicChart } from '@/components/charts/BasicChart';
import { ChartSettings } from '@/components/chart-settings';

export function ChartPreviewResizable() {
  return (
    <ResizablePanelGroup direction='horizontal'>
      {/* Chart Display Area */}
      <ResizablePanel defaultSize={75} minSize={50}>
        <div className='w-full h-full p-8 flex items-center justify-center'>
          <BasicChart />
        </div>
      </ResizablePanel>

      {/* Resize Handle */}
      <ResizableHandle withHandle />

      {/* Settings Panel */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
        <ChartSettings />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
