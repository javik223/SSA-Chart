'use client';

import { ChartDisplay } from '@/components/ChartDisplay';
import { DataGridAG } from '@/components/data-grid-ag';
import { DataSidebar } from '@/components/data-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useDataSync } from '@/hooks/useDataSync';
import { useVirtualData } from '@/hooks/useVirtualData';
import { useChartStore } from '@/store/useChartStore';
import debounce from 'lodash.debounce';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Rnd } from 'react-rnd';
import './data-table.css';

export function DataTable() {
  // Enable initial data load into DuckDB
  useDataSync();

  // Virtual data operations for DuckDB mode
  const virtualData = useVirtualData();

  const {
    addRows,
    dataRowCount,
    currentPage,
    pageSize,
    setCurrentPage,
    setFilterValue,
  } = useChartStore();
  const [ searchOpen, setSearchOpen ] = useState( false );
  const [ searchInput, setSearchInput ] = useState( '' );
  const [ searchQuery, setSearchQuery ] = useState( '' );
  const [ shouldNavigate, setShouldNavigate ] = useState( false );
  const [ isSearching, setIsSearching ] = useState( false );
  const [ rowCount, setRowCount ] = useState( 1 );
  const [ chartPreviewPosition, setChartPreviewPosition ] = useState( { x: 0, y: 0 } );

  // Set initial position for chart preview (client-side only)
  useEffect( () => {
    setChartPreviewPosition( {
      x: window.innerWidth - 300 - 20,
      y: window.innerHeight - 260 - 20,
    } );
  }, [] );

  const handleAddRows = () => {
    const count = Math.max( 1, Math.min( 1000, rowCount ) ); // Min 1, max 1000 rows
    addRows( count );
  };

  // Debounced search to avoid searching on every keystroke
  const debouncedSearch = useMemo(
    () =>
      debounce( ( query: string ) => {
        // Set filter value to trigger SQL query in DuckDB
        setFilterValue( query );
        setCurrentPage( 0 ); // Reset to first page when searching
        setIsSearching( false );
        setShouldNavigate( false );
      }, 300 ),
    [ setFilterValue, setCurrentPage ]
  );

  const handleSearch = useCallback(
    ( query: string ) => {
      setSearchInput( query );
      setIsSearching( true );
      debouncedSearch( query );
    },
    [ debouncedSearch ]
  );

  const handleSearchKeyDown = ( e: React.KeyboardEvent<HTMLInputElement> ) => {
    if ( e.key === 'Enter' && searchQuery ) {
      setShouldNavigate( true );
    }
  };

  const handleClearSearch = useCallback( () => {
    setSearchInput( '' );
    setSearchQuery( '' );
    setShouldNavigate( false );
    setIsSearching( false );
    setFilterValue( '' );
  }, [ setFilterValue ] );

  const handleRowCountChange = useCallback( ( e: React.ChangeEvent<HTMLInputElement> ) => {
    setRowCount( parseInt( e.target.value ) || 1 );
  }, [] );

  const handlePrevPage = useCallback( () => {
    setCurrentPage( Math.max( 0, currentPage - 1 ) );
  }, [ currentPage, setCurrentPage ] );

  const handleNextPage = useCallback( () => {
    setCurrentPage( currentPage + 1 );
  }, [ currentPage, setCurrentPage ] );

  const handleSearchInputChange = useCallback( ( e: React.ChangeEvent<HTMLInputElement> ) => {
    handleSearch( e.target.value );
  }, [ handleSearch ] );

  return (
    <div className='data-table-container relative'>
      {/* Main Content: Resizable Grid + Sidebar */ }
      <div className='data-table-content'>
        <ResizablePanelGroup direction='horizontal' className='data-table-resizable-group'>
          {/* Grid Area */ }
          <ResizablePanel defaultSize={ 75 } minSize={ 30 } className="data-table-grid-panel">
            <div className='data-table-grid-area'>
              <div className='data-table-grid-wrapper'>
                { !virtualData.hasLoaded && (
                  <div className='data-table-loading-overlay'>
                    <div className='data-table-loading-content'>
                      <Loader2 className='data-table-loading-spinner' />
                      <p className='data-table-loading-text'>
                        Loading data...
                      </p>
                    </div>
                  </div>
                ) }
                <DataGridAG virtualData={ virtualData } searchQuery={ searchInput } />
              </div>

              {/* Bottom toolbar - fixed at bottom */ }
              <div className='data-table-toolbar'>
                <div className='data-table-toolbar-left'>
                  <Button variant='ghost' size='sm' onClick={ handleAddRows }>
                    <Plus className='data-table-icon' />
                    more rows
                  </Button>
                  <Input
                    type='number'
                    min={ 1 }
                    max={ 1000 }
                    value={ rowCount }
                    onChange={ handleRowCountChange }
                    className='data-table-row-count-input'
                  />
                </div>

                {/* Pagination controls */ }
                <div className='data-table-pagination'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={ handlePrevPage }
                    disabled={ currentPage === 0 }
                  >
                    <ChevronLeft className='data-table-icon' />
                  </Button>
                  <span className='data-table-pagination-info'>
                    Page { currentPage + 1 } of{ ' ' }
                    { Math.ceil( dataRowCount / pageSize ) || 1 } (
                    { dataRowCount.toLocaleString() } rows)
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={ handleNextPage }
                    disabled={ ( currentPage + 1 ) * pageSize >= dataRowCount }
                  >
                    <ChevronRight className='data-table-icon' />
                  </Button>
                </div>

                <Popover open={ searchOpen } onOpenChange={ setSearchOpen }>
                  <PopoverTrigger asChild>
                    <Button variant='ghost' size='sm'>
                      <Search className='data-table-icon' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='data-table-search-popover'
                    align='end'
                  >
                    <div className='data-table-search-content'>
                      <h4 className='data-table-search-heading'>
                        Search in data
                      </h4>
                      <div className='data-table-search-input-container'>
                        { isSearching ? (
                          <Loader2 className='data-table-search-icon-loading' />
                        ) : (
                          <Search className='data-table-search-icon' />
                        ) }
                        <Input
                          placeholder='Search...'
                          value={ searchInput }
                          onChange={ handleSearchInputChange }
                          onKeyDown={ handleSearchKeyDown }
                          className='data-table-search-input'
                          autoFocus
                        />
                        { searchInput && (
                          <button
                            onClick={ handleClearSearch }
                            className='data-table-search-clear'
                          >
                            <X className='data-table-icon' />
                          </button>
                        ) }
                      </div>
                      <p className='data-table-search-help'>
                        { isSearching
                          ? 'Searching...'
                          : 'Press Enter to navigate, Esc to close' }
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle */ }
          <ResizableHandle withHandle className='data-table-resize-handle' />

          {/* Sidebar */ }
          <ResizablePanel defaultSize={ 25 } minSize={ 20 } maxSize={ 40 } className="data-table-sidebar-panel">
            <DataSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Chart Preview - Bottom Right */ }
      { chartPreviewPosition.x > 0 && (
        <Rnd
          default={ {
            x: chartPreviewPosition.x,
            y: chartPreviewPosition.y,
            width: 300,
            height: 260,
          } }
          minWidth={ 300 }
          minHeight={ 240 }
          className='data-table-chart-preview h-max'
          style={ { position: 'fixed', zIndex: 50 } }
          bounds="window"
        >
          <div className='data-table-chart-preview-content'>
            <ChartDisplay isVisible={ true } minimal={ true } />
          </div>
        </Rnd>
      ) }
    </div>
  );
}
