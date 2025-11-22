'use client';

import { memo } from 'react';
import { ChartPreview } from '@/components/chart-preview';
import { DataTable } from '@/components/data-table';

interface TabContentProps {
  activeTab: string;
}

// Memoize individual tab panels to prevent re-renders
const PreviewPanel = memo( function PreviewPanel( { isVisible }: { isVisible: boolean; } ) {
  return <ChartPreview isVisible={ isVisible } />;
} );

const DataPanel = memo( function DataPanel() {
  return <DataTable />;
} );

export const TabContent = memo( function TabContent( {
  activeTab,
}: TabContentProps ) {
  return (
    <div className='w-full h-full flex-1 relative'>
      <div
        className={ `absolute inset-0 w-full h-full ${ activeTab === 'preview' ? 'z-10' : 'z-0 invisible'
          }` }
      >
        <PreviewPanel isVisible={ activeTab === 'preview' } />
      </div>

      <div
        className={ `absolute inset-0 w-full h-full ${ activeTab === 'data' ? 'z-10' : 'z-0 invisible'
          }` }
      >
        <DataPanel />
      </div>
    </div>
  );
} );
