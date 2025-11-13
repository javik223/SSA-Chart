'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/page-header';
import { TabContent } from '@/components/tab-content';

export default function Home() {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <main className='flex flex-col h-screen'>
      <PageHeader />

      <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1 bg-slate-100'>
        <TabsList className='w-100 self-center my-2 bg-slate-100'>
          <TabsTrigger value='preview' className='font-light'>
            Preview
          </TabsTrigger>
          <TabsTrigger value='data' className='font-light'>
            Data
          </TabsTrigger>
        </TabsList>

        <TabContent activeTab={activeTab} />
      </Tabs>
    </main>
  );
}
