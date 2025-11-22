'use client';

import { PageHeader } from '@/components/page-header';
import { TabContent } from '@/components/tab-content';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';

export default function Home() {
  const [ activeTab, setActiveTab ] = useState( 'data' );

  return (
    <main className='flex flex-col h-screen'>
      <PageHeader />
      <div className='w-full'>
        <ToggleGroup
          className=' bg-slate-50 w-full py-4 flex justify-center'
          variant='outline'
          type='single'
          onValueChange={ ( value ) => {
            if ( value ) setActiveTab( value );
          } }
        >
          <ToggleGroupItem className='min-w-60 bg-white' value='preview'>
            Preview
          </ToggleGroupItem>
          <ToggleGroupItem className='min-w-60 bg-white' value='data'>
            Data
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <TabContent activeTab={ activeTab } />
    </main>
  );
}
