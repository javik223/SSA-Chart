'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ChartCanvas } from '@/components/chart-canvas';
import { ChartSettings } from '@/components/chart-settings';

export function ChartPreviewResizable() {
  return (
    <ResizablePanelGroup direction='horizontal'>
      {/* Chart Canvas Area */}
      <ResizablePanel defaultSize={75} minSize={50}>
        <ChartCanvas />
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
