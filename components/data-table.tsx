'use client';

import { DataGrid } from '@/components/data-grid';
import { DataSidebar } from '@/components/data-sidebar';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export function DataTable() {
  const [data, setData] = useState<any[][]>([
    ['Role', 'Media', 'Finance', 'Health', 'Education'],
    ['Analyst', '25', '21', '18', '9'],
    ['Journalist', '12', '9', '7', '10'],
    ['Marketing', '4', '3', '6', '3'],
    ['Sales', '3', '5', '2', '1'],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);

  const handleDataChange = (newData: any[][]) => {
    setData(newData);
  };

  return (
    <div className='flex h-full flex-col bg-white'>
      {/* Main Content: Resizable Grid + Sidebar */}
      <div className='flex-1 overflow-hidden'>
        <ResizablePanelGroup direction='horizontal'>
          {/* Grid Area */}
          <ResizablePanel defaultSize={75} minSize={30}>
            <div className='flex h-full flex-col'>
              {/* Data Grid - fills available space */}
              <div className='flex-1 overflow-auto'>
                <DataGrid data={data} onDataChange={handleDataChange} />
              </div>

              {/* Bottom toolbar - fixed at bottom */}
              <div className='flex items-center justify-between border-t bg-white px-4 py-2'>
                <Button variant='ghost' size='sm'>
                  <Plus className='h-4 w-4' />
                  more rows
                </Button>

                <Button variant='ghost' size='sm'>
                  <Search className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle withHandle />

          {/* Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <DataSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
