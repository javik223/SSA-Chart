'use client';

import { useState, useCallback, useMemo } from 'react';
import { DataGrid } from '@/components/data-grid';
import { DataSidebar } from '@/components/data-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import { useChartStore } from '@/store/useChartStore';
import debounce from 'lodash.debounce';

export function DataTable() {
  const { addRows } = useChartStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [rowCount, setRowCount] = useState(1);

  const handleAddRows = () => {
    const count = Math.max(1, Math.min(1000, rowCount)); // Min 1, max 1000 rows
    addRows(count);
  };

  // Debounced search to avoid searching on every keystroke
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
        setIsSearching(false);
        setShouldNavigate(false);
      }, 300),
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchInput(query);
      setIsSearching(true);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery) {
      setShouldNavigate(true);
    }
  };

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setSearchQuery('');
    setShouldNavigate(false);
    setIsSearching(false);
  }, []);

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
                <DataGrid
                  searchQuery={searchQuery}
                  shouldNavigate={shouldNavigate}
                  onNavigated={() => setShouldNavigate(false)}
                />
              </div>

              {/* Bottom toolbar - fixed at bottom */}
              <div className='flex items-center justify-between border-t bg-slate-50 px-4 py-2'>
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='sm' onClick={handleAddRows}>
                    <Plus className='h-4 w-4' />
                    more rows
                  </Button>
                  <Input
                    type='number'
                    min={1}
                    max={1000}
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value) || 1)}
                    className='w-16 h-8 rounded-full text-center'
                  />
                </div>

                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <Search className='h-4 w-4' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-80' align='end'>
                    <div className='space-y-2'>
                      <h4 className='font-medium text-sm'>Search in data</h4>
                      <div className='relative'>
                        {isSearching ? (
                          <Loader2 className='absolute left-2 top-2.5 h-4 w-4 text-zinc-500 animate-spin' />
                        ) : (
                          <Search className='absolute left-2 top-2.5 h-4 w-4 text-zinc-500' />
                        )}
                        <Input
                          placeholder='Search...'
                          value={searchInput}
                          onChange={(e) => handleSearch(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          className='pl-8 pr-8'
                          autoFocus
                        />
                        {searchInput && (
                          <button
                            onClick={handleClearSearch}
                            className='absolute right-2 top-2.5 text-zinc-500 hover:text-zinc-700'
                          >
                            <X className='h-4 w-4' />
                          </button>
                        )}
                      </div>
                      <p className='text-xs text-zinc-500'>
                        {isSearching
                          ? 'Searching...'
                          : 'Press Enter to navigate, Esc to close'}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle withHandle className='w-0 bg-transparent' />

          {/* Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <DataSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
