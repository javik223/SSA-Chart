'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartHeader } from '@/components/chart-header';
import { ChartPreview } from '@/components/chart-preview';
import { DataTable } from '@/components/data-table';

export default function Home() {
  return (
    <main className='flex flex-col h-screen'>
      <ChartHeader />

      <Tabs defaultValue='preview' className='flex-1 bg-slate-100'>
        <TabsList className='w-100 self-center my-2 bg-slate-100'>
          <TabsTrigger value='preview' className='font-light'>
            Preview
          </TabsTrigger>
          <TabsTrigger value='data' className='font-light'>
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value='preview' asChild className='grow'>
          <ChartPreview />
        </TabsContent>

        <TabsContent value='data' asChild className='grow'>
          <DataTable />
        </TabsContent>
      </Tabs>
    </main>
  );
}
