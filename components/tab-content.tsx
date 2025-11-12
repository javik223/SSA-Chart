'use client';

import { memo, Activity } from 'react';
import { ChartPreview } from '@/components/chart-preview';
import { DataTable } from '@/components/data-table';

interface TabContentProps {
  activeTab: string;
}

// Memoize individual tab panels to prevent re-renders
const PreviewPanel = memo(function PreviewPanel() {
  return <ChartPreview />;
});

const DataPanel = memo(function DataPanel() {
  return <DataTable />;
});

export const TabContent = memo(function TabContent({ activeTab }: TabContentProps) {
  return (
    <div className='flex-1 relative'>
      <Activity mode={activeTab === 'preview' ? 'visible' : 'hidden'}>
        <div className={`absolute inset-0 ${activeTab === 'preview' ? '' : 'pointer-events-none'}`}>
          <PreviewPanel />
        </div>
      </Activity>

      <Activity mode={activeTab === 'data' ? 'visible' : 'hidden'}>
        <div className={`absolute inset-0 ${activeTab === 'data' ? '' : 'pointer-events-none'}`}>
          <DataPanel />
        </div>
      </Activity>
    </div>
  );
});
