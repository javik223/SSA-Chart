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
import './data-table.css';

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
    <div className='data-table-container'>
      {/* Main Content: Resizable Grid + Sidebar */}
      <div className='data-table-content'>
        <ResizablePanelGroup direction='horizontal'>
          {/* Grid Area */}
          <ResizablePanel defaultSize={75} minSize={30}>
            <div className='data-table-grid-area'>
              {/* Data Grid - fills available space */}
              <div className='data-table-grid-wrapper'>
                <DataGrid
                  searchQuery={searchQuery}
                  shouldNavigate={shouldNavigate}
                  onNavigated={() => setShouldNavigate(false)}
                />
              </div>

              {/* Bottom toolbar - fixed at bottom */}
              <div className='data-table-toolbar'>
                <div className='data-table-toolbar-left'>
                  <Button variant='ghost' size='sm' onClick={handleAddRows}>
                    <Plus className='data-table-icon' />
                    more rows
                  </Button>
                  <Input
                    type='number'
                    min={1}
                    max={1000}
                    value={rowCount}
                    onChange={(e) => setRowCount(parseInt(e.target.value) || 1)}
                    className='data-table-row-count-input'
                  />
                </div>

                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <Search className='data-table-icon' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='data-table-search-popover' align='end'>
                    <div className='data-table-search-content'>
                      <h4 className='data-table-search-heading'>Search in data</h4>
                      <div className='data-table-search-input-container'>
                        {isSearching ? (
                          <Loader2 className='data-table-search-icon-loading' />
                        ) : (
                          <Search className='data-table-search-icon' />
                        )}
                        <Input
                          placeholder='Search...'
                          value={searchInput}
                          onChange={(e) => handleSearch(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                          className='data-table-search-input'
                          autoFocus
                        />
                        {searchInput && (
                          <button
                            onClick={handleClearSearch}
                            className='data-table-search-clear'
                          >
                            <X className='data-table-icon' />
                          </button>
                        )}
                      </div>
                      <p className='data-table-search-help'>
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
          <ResizableHandle withHandle className='data-table-resize-handle' />

          {/* Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <DataSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
