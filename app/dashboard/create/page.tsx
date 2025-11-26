'use client';

import { PageHeader } from '@/components/page-header';
import { TabContent } from '@/components/tab-content';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadChart } from '@/lib/chartStorage';
import { useChartStore } from '@/store/useChartStore';
import { useAlertDialog } from '@/components/ui/alert-dialog-simple';
import { CreateChartHeader } from '@/components/create-chart-header';

function CreateChartContent() {
  const [ activeTab, setActiveTab ] = useState( 'data' );
  const { showAlert } = useAlertDialog();
  const searchParams = useSearchParams();
  const loadChartState = useChartStore( ( state ) => state.loadChartState );
  const setCurrentChartId = useChartStore( ( state ) => state.setCurrentChartId );

  // Load chart for editing if edit parameter is present
  useEffect( () => {
    const editId = searchParams.get( 'edit' );
    if ( editId ) {
      loadChartForEditing( editId );
    }
  }, [ searchParams ] );

  const loadChartForEditing = async ( chartId: string ) => {
    try {
      const chart = await loadChart( chartId );
      if ( chart ) {
        // Load the chart data into the store
        loadChartState( chart.data );
        // Store the current chart ID for updates
        setCurrentChartId( chartId );
        // Switch to preview tab to show the loaded chart
        setActiveTab( 'preview' );
      } else {
        showAlert( {
          title: 'Chart Not Found',
          description: 'The requested chart could not be found.',
        } );
      }
    } catch ( error ) {
      console.error( 'Failed to load chart for editing:', error );
      showAlert( {
        title: 'Load Failed',
        description: 'Failed to load chart for editing. Please try again.',
      } );
    }
  };

  return (
    <main className='flex flex-col md:h-screen'>
      <CreateChartHeader />
      <div className='w-full'>
        <ToggleGroup
          className=' bg-slate-50 w-full py-4 flex justify-center'
          variant='outline'
          type='single'
          onValueChange={ ( value ) => {
            if ( value ) setActiveTab( value );
          } }
        >
          <ToggleGroupItem className='min-w-40 md:min-w-60 bg-white' value='preview'>
            Preview
          </ToggleGroupItem>
          <ToggleGroupItem className='min-w-40 md:min-w-60 bg-white' value='data'>
            Data
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <TabContent activeTab={ activeTab } />
    </main>
  );
}

export default function CreateChartPage() {
  return (
    <Suspense fallback={ <div className="flex items-center justify-center h-screen">Loading...</div> }>
      <CreateChartContent />
    </Suspense>
  );
}
