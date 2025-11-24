'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ColumnSelector } from '@/components/column-selector';
import { useChartStore } from '@/store/useChartStore';
import { ChevronDown, CircleHelp, Upload } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { parseFile } from '@/utils/fileParser';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

export function DataSidebar() {
  const {
    availableColumns,
    columnMapping,
    setColumnMapping,
    autoSetColumns,
    replaceData,
    mergeData,
  } = useChartStore();
  const fileInputRef = useRef<HTMLInputElement>( null );
  const [ uploadMode, setUploadMode ] = useState<'replace' | 'merge'>( 'replace' );
  const [ isAlertOpen, setIsAlertOpen ] = useState( false );
  const { toast } = useToast();

  // Track which fields are expanded
  const [ expandedFields, setExpandedFields ] = useState<Record<string, boolean>>(
    {
      labels: false,
      values: false,
      chartsGrid: false,
      rowFilter: false,
      customPopups: false,
    }
  );

  const toggleField = ( field: string ) => {
    setExpandedFields( ( prev ) => ( { ...prev, [ field ]: !prev[ field ] } ) );
  };

  const handleLabelsSelect = ( index: number | number[] ) => {
    setColumnMapping( { labels: index as number } );
  };

  const handleValuesSelect = ( indices: number | number[] ) => {
    setColumnMapping( { values: Array.isArray( indices ) ? indices : [ indices ] } );
  };

  const handleChartsGridSelect = ( index: number | number[] ) => {
    setColumnMapping( { chartsGrid: index as number } );
  };

  const handleRowFilterSelect = ( index: number | number[] ) => {
    setColumnMapping( { rowFilter: index as number } );
  };

  const handleCustomPopupsSelect = ( index: number | number[] ) => {
    setColumnMapping( { customPopups: index as number } );
  };

  const getColumnLabel = ( index: number | null ) => {
    if ( index === null ) return '';
    return String.fromCharCode( 65 + index );
  };

  const getColumnRangeLabel = ( indices: number[] ) => {
    if ( indices.length === 0 ) return '';
    if ( indices.length === 1 ) return getColumnLabel( indices[ 0 ] );
    const first = indices[ 0 ];
    const last = indices[ indices.length - 1 ];
    return `${ getColumnLabel( first ) }-${ getColumnLabel( last ) }`;
  };

  const handleUploadClick = ( mode: 'replace' | 'merge' ) => {
    setUploadMode( mode );
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[ 0 ];
    if ( !file ) return;

    try {
      const result = await parseFile( file );

      if ( result.success && result.data.length > 0 ) {
        if ( uploadMode === 'replace' ) {
          replaceData( result.data );
          toast( {
            title: 'Data uploaded successfully',
            description: `Replaced with ${ result.data.length } rows from ${ file.name }`,
          } );
        } else {
          mergeData( result.data );
          toast( {
            title: 'Data merged successfully',
            description: `Added ${ result.data.length - 1 } rows from ${ file.name
              }`,
          } );
        }
      } else {
        toast( {
          title: 'Upload failed',
          description: result.error || 'Failed to parse file',
          variant: 'destructive',
        } );
      }
    } catch ( error ) {
      toast( {
        title: 'Upload failed',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      } );
    }

    // Reset file input
    event.target.value = '';
  };

  const handleClearData = () => {
    replaceData( [ [] ] );
    setIsAlertOpen( false );
    toast( {
      title: 'Data cleared',
      description: 'All data has been removed from the spreadsheet',
    } );
  };

  return (
    <div className='h-full overflow-y-auto border-l bg-white p-6'>
      <div className='space-y-4'>
        {/* Hidden file input */ }
        <input
          ref={ fileInputRef }
          type='file'
          accept='.csv,.xlsx,.xls,.tsv,.txt,.json,.geojson'
          onChange={ handleFileChange }
          className='hidden'
        />

        {/* Header */ }
        <div className='flex justify-between'>
          <h2 className='text-lg font-semibold text-zinc-900'>Data</h2>
          <div className='flex items-center gap-2'>
            <span className='text-xs text-zinc-500'>Saved</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' className='rounded-full' variant='outline'>
                  <Upload className='h-4 w-4' />
                  <ChevronDown className='h-2 w-2' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  className='flex flex-col items-start gap-1 cursor-pointer'
                  onClick={ () => handleUploadClick( 'replace' ) }
                >
                  <h3 className='text-sm font-medium'>Upload data file</h3>
                  <small className='text-slate-500 font-normal'>
                    Replace data with uploaded file <br />
                    (Excel, CSV, TSV, JSON, GeoJSON)
                  </small>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='flex flex-col items-start gap-1 cursor-pointer'
                  onClick={ () => handleUploadClick( 'merge' ) }
                >
                  <h3 className='text-sm font-medium'>Upload data and merge</h3>
                  <small className='text-slate-500 font-normal'>
                    Merge current sheet with the uploaded file <br />
                    (Excel, CSV, TSV, JSON, GeoJSON)
                  </small>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='flex flex-col items-start gap-1 cursor-pointer text-red-600'
                  onSelect={ ( e ) => {
                    e.preventDefault();
                    setIsAlertOpen( true );
                  } }
                >
                  <div className='flex items-center gap-2'>
                    <Trash2 className='h-4 w-4' />
                    <h3 className='text-sm font-medium'>Clear all data</h3>
                  </div>
                  <small className='text-slate-500 font-normal'>
                    Remove all data from the spreadsheet
                  </small>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Alert Dialog for Clear Confirmation */ }
            <AlertDialog open={ isAlertOpen } onOpenChange={ setIsAlertOpen }>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all
                    data from your spreadsheet.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={ handleClearData }
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Clear All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Separator />

        {/* Select Columns Section */ }
        <div className='space-y-3'>
          <div className='flex items-center justify-between border-b border-b-zinc-200 pb-3'>
            <Label className='text-[10px] font-medium uppercase text-zinc-600 tracking-wider'>
              Select columns to visualise
            </Label>
            <Button
              variant='link'
              size='sm'
              className='h-auto p-0 text-xs'
              onClick={ autoSetColumns }
            >
              Auto-set columns
            </Button>
          </div>

          {/* Labels/time */ }
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Label className='text-sm font-medium text-zinc-900'>
                  Labels/time
                </Label>
                <button
                  onClick={ () => toggleField( 'labels' ) }
                  className='rounded-full p-0.5 hover:bg-zinc-100'
                >
                  <CircleHelp className='h-4 w-4 text-zinc-500' />
                </button>
                <span className='rounded border border-zinc-300 bg-white px-1.5 py-0 text-[10px] font-normal uppercase text-zinc-600'>
                  Required
                </span>
              </div>
              <ColumnSelector
                availableColumns={ availableColumns }
                selectedColumns={ columnMapping.labels }
                onSelect={ handleLabelsSelect }
                mode='single'
                placeholder=''
                color='pink'
                compact
              />
            </div>

            { expandedFields.labels && (
              <div className='space-y-2 animate-in slide-in-from-top-2'>
                <p className='text-xs text-zinc-500'>
                  A column of names, numbers or datetimes.
                </p>

                <div className='space-y-1.5'>
                  <div className='text-xs text-zinc-600'>
                    Accepted column types
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <div className='flex h-5 items-center justify-center rounded bg-zinc-600 px-1.5 text-[10px] font-semibold text-white'>
                      ABC
                    </div>
                    <div className='flex h-5 w-5 items-center justify-center rounded bg-zinc-600'>
                      <svg
                        className='h-3 w-3 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <rect
                          x='3'
                          y='4'
                          width='18'
                          height='18'
                          rx='2'
                          ry='2'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <line
                          x1='16'
                          y1='2'
                          x2='16'
                          y2='6'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <line
                          x1='8'
                          y1='2'
                          x2='8'
                          y2='6'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <line
                          x1='3'
                          y1='10'
                          x2='21'
                          y2='10'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                    <div className='flex h-5 items-center justify-center rounded bg-zinc-600 px-1.5 text-[10px] font-semibold text-white'>
                      123
                    </div>
                  </div>
                </div>
              </div>
            ) }
          </div>

          {/* Values */ }
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Label className='text-sm font-medium text-zinc-900'>
                  Values
                </Label>
                <button
                  onClick={ () => toggleField( 'values' ) }
                  className='rounded-full p-0.5 hover:bg-zinc-100'
                >
                  <CircleHelp className='h-4 w-4 text-zinc-500' />
                </button>
              </div>
              <ColumnSelector
                availableColumns={ availableColumns }
                selectedColumns={ columnMapping.values }
                onSelect={ handleValuesSelect }
                mode='multiple'
                placeholder=''
                color='purple'
                compact
              />
            </div>

            { expandedFields.values && (
              <div className='space-y-2 animate-in slide-in-from-top-2'>
                <p className='text-xs text-zinc-500'>
                  One or more columns of numbers. The &apos;Preferred output
                  format&apos; of the first column is used to format values.
                </p>

                <div className='space-y-1.5'>
                  <div className='text-xs text-zinc-600'>
                    Accepted column types
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <div className='flex h-5 w-5 items-center justify-center rounded bg-zinc-600'>
                      <svg
                        className='h-3 w-3 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <rect
                          x='3'
                          y='4'
                          width='18'
                          height='18'
                          rx='2'
                          ry='2'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <line
                          x1='16'
                          y1='2'
                          x2='16'
                          y2='6'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <line
                          x1='8'
                          y1='2'
                          x2='8'
                          y2='6'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <line
                          x1='3'
                          y1='10'
                          x2='21'
                          y2='10'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ) }
          </div>
        </div>

        <Separator />

        {/* Charts grid */ }
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Label className='text-sm font-medium text-zinc-900'>
                Charts grid
              </Label>
              <button
                onClick={ () => toggleField( 'chartsGrid' ) }
                className='rounded-full p-0.5 hover:bg-zinc-100'
              >
                <CircleHelp className='h-4 w-4 text-zinc-500' />
              </button>
            </div>
            <ColumnSelector
              availableColumns={ availableColumns }
              selectedColumns={ columnMapping.chartsGrid }
              onSelect={ handleChartsGridSelect }
              mode='single'
              placeholder=''
              color='pink'
              compact
            />
          </div>

          { expandedFields.chartsGrid && (
            <div className='space-y-2 animate-in slide-in-from-top-2'>
              <p className='text-xs text-zinc-500'>
                Optional grid column for creating a panel of charts.
              </p>
            </div>
          ) }
        </div>

        <Separator />

        {/* Row filter */ }
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Label className='text-sm font-medium text-zinc-900'>
                Row filter
              </Label>
              <button
                onClick={ () => toggleField( 'rowFilter' ) }
                className='rounded-full p-0.5 hover:bg-zinc-100'
              >
                <CircleHelp className='h-4 w-4 text-zinc-500' />
              </button>
            </div>
            <ColumnSelector
              availableColumns={ availableColumns }
              selectedColumns={ columnMapping.rowFilter }
              onSelect={ handleRowFilterSelect }
              mode='single'
              placeholder=''
              color='blue'
              compact
            />
          </div>

          { expandedFields.rowFilter && (
            <div className='space-y-2 animate-in slide-in-from-top-2'>
              <p className='text-xs text-zinc-500'>
                Filter rows based on column values.
              </p>
            </div>
          ) }
        </div>

        <Separator />

        {/* Info for custom popups */ }
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Label className='text-sm font-medium text-zinc-900'>
                Info for custom popups
              </Label>
              <button
                onClick={ () => toggleField( 'customPopups' ) }
                className='rounded-full p-0.5 hover:bg-zinc-100'
              >
                <CircleHelp className='h-4 w-4 text-zinc-500' />
              </button>
            </div>
            <ColumnSelector
              availableColumns={ availableColumns }
              selectedColumns={ columnMapping.customPopups }
              onSelect={ handleCustomPopupsSelect }
              mode='single'
              placeholder=''
              color='cyan'
              compact
            />
          </div>

          { expandedFields.customPopups && (
            <div className='space-y-2 animate-in slide-in-from-top-2'>
              <p className='text-xs text-zinc-500'>
                Add custom information to display in chart popups.
              </p>
            </div>
          ) }
        </div>
      </div>
    </div>
  );
}
