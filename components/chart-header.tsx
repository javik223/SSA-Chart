'use client';

import { Button } from '@/components/ui/button';
import { Download, Settings, Share2, BarChart3 } from 'lucide-react';

export function ChartHeader() {
  return (
    <header className='border-b bg-white px-4 py-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 md:gap-4'>
          <div className='flex items-center gap-2'>
            <h1 className='text-xl font-bold text-zinc-900 md:text-2xl'>
              SSA Charts
            </h1>
          </div>
          <span className='hidden text-sm text-zinc-500 md:inline'>
            Untitled Chart
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' className='hidden md:flex'>
            <Settings />
          </Button>
          <Button variant='outline' size='icon' className='hidden sm:flex'>
            <Share2 />
          </Button>
          <Button size='icon'>
            <Download />
          </Button>
        </div>
      </div>
    </header>
  );
}
