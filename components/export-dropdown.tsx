'use client';

import { useState } from 'react';
import { Download, FileDown, Image, FileImage, FileText, FileJson, Share2, Check, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChartStore } from '@/store/useChartStore';
import { exportChart, type ExportFormat } from '@/utils/exportUtils';
import { saveChart } from '@/lib/chartStorage';
import { generateThumbnailWithRetry } from '@/utils/thumbnailUtils';
import { useAlertDialog } from '@/components/ui/alert-dialog-simple';

export function ExportDropdown() {
  const { showAlert } = useAlertDialog();
  const chartTitle = useChartStore( ( state ) => state.chartTitle );
  const currentChartId = useChartStore( ( state ) => state.currentChartId );
  const [ isExporting, setIsExporting ] = useState( false );
  const [ showWidthDialog, setShowWidthDialog ] = useState( false );
  const [ showShareDialog, setShowShareDialog ] = useState( false );
  const [ shareUrl, setShareUrl ] = useState( '' );
  const [ copied, setCopied ] = useState( false );
  const [ selectedFormat, setSelectedFormat ] = useState<'png' | 'jpg' | 'pdf'>(
    'png'
  );
  const [ exportWidth, setExportWidth ] = useState<number>( 1920 );

  const handleExportClick = ( format: ExportFormat | 'json' | 'share' ) => {
    if ( format === 'svg' ) {
      handleExport( format );
    } else if ( format === 'json' ) {
      handleExportJSON();
    } else if ( format === 'share' ) {
      handleShare();
    } else {
      // Show width dialog for PNG/JPG/PDF
      setSelectedFormat( format as 'png' | 'jpg' | 'pdf' );
      setShowWidthDialog( true );
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting( true );
      const state = useChartStore.getState();
      const persistedState = useChartStore.persist.getOptions().partialize?.( state ) || state;

      // Generate thumbnail from chart preview
      console.log('Generating thumbnail for share...');
      const thumbnail = await generateThumbnailWithRetry();

      if (thumbnail) {
        console.log('Thumbnail generated successfully');
      } else {
        console.warn('No thumbnail generated, saving without thumbnail');
      }

      // If editing an existing chart, update it with the same ID
      // Otherwise, create a new chart with a new ID
      console.log('Saving chart to database...');
      const chartId = await saveChart( persistedState, currentChartId || undefined, thumbnail || undefined );
      console.log('Chart saved with ID:', chartId);

      // Update the current chart ID in store (in case this was a new save)
      if (!currentChartId) {
        useChartStore.getState().setCurrentChartId(chartId);
      }

      // Generate short URL using chart ID
      const baseUrl = window.location.origin;
      const url = `${ baseUrl }/render/${ chartId }`;

      setShareUrl( url );
      setShowShareDialog( true );
    } catch ( error ) {
      console.error( 'Share failed:', error );
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showAlert({
        title: 'Share Failed',
        description: `Failed to generate share link: ${errorMessage}\n\nPlease check the console for details.`,
      });
    } finally {
      setIsExporting( false );
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText( shareUrl );
      setCopied( true );
      setTimeout( () => setCopied( false ), 2000 );
    } catch ( error ) {
      console.error( 'Copy failed:', error );
      showAlert({
        title: 'Copy Failed',
        description: 'Failed to copy URL to clipboard.',
      });
    }
  };

  const handleExportJSON = () => {
    try {
      setIsExporting( true );
      const state = useChartStore.getState();

      // Filter out non-persisted keys if needed, or just export everything relevant
      // For now, let's export the persisted state logic
      const persistedState = useChartStore.persist.getOptions().partialize?.( state ) || state;

      const jsonString = JSON.stringify( persistedState, null, 2 );
      const blob = new Blob( [ jsonString ], { type: 'application/json' } );
      const url = URL.createObjectURL( blob );

      const link = document.createElement( 'a' );
      link.href = url;
      link.download = `${ chartTitle.trim() || 'chart' }.json`;
      document.body.appendChild( link );
      link.click();
      document.body.removeChild( link );
      URL.revokeObjectURL( url );
    } catch ( error ) {
      console.error( 'Export JSON failed:', error );
      showAlert({
        title: 'Export Failed',
        description: 'Failed to export chart configuration.',
      });
    } finally {
      setIsExporting( false );
    }
  };

  const handleExport = async ( format: ExportFormat, width?: number ) => {
    try {
      setIsExporting( true );

      // Find the chart container element
      const chartContainer = document.querySelector(
        '[data-chart-container]'
      ) as HTMLElement;

      if ( !chartContainer ) {
        showAlert({
          title: 'Chart Not Found',
          description: 'Chart container not found. Please ensure a chart is visible.',
        });
        return;
      }

      // Generate filename from chart title or use default
      const filename = chartTitle.trim() || 'chart';

      await exportChart( chartContainer, format, filename, width );
      setShowWidthDialog( false );
    } catch ( error ) {
      console.error( 'Export failed:', error );
      showAlert({
        title: 'Export Failed',
        description: `Failed to export chart as ${ format.toUpperCase() }. Please try again.`,
      });
    } finally {
      setIsExporting( false );
    }
  };

  const handleWidthDialogConfirm = () => {
    // If width is 0, pass undefined to use current width
    handleExport( selectedFormat, exportWidth === 0 ? undefined : exportWidth );
  };

  const presets = [
    { label: 'Current', width: 0 }, // 0 means use current width
    { label: 'HD (1280px)', width: 1280 },
    { label: 'Full HD (1920px)', width: 1920 },
    { label: '2K (2560px)', width: 2560 },
    { label: '4K (3840px)', width: 3840 },
  ];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='h-9 w-9'
            disabled={ isExporting }
          >
            <Download className='h-4 w-4' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuLabel>Export Chart</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={ () => handleExportClick( 'svg' ) }
            disabled={ isExporting }
          >
            <FileDown className='mr-2 h-4 w-4' aria-hidden='true' />
            <div className='flex flex-col'>
              <span className='font-medium'>SVG</span>
              <span className='text-[10px] text-zinc-500'>Vector graphics</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={ () => handleExportClick( 'png' ) }
            disabled={ isExporting }
          >
            <Image className='mr-2 h-4 w-4' />
            <div className='flex flex-col'>
              <span className='font-medium'>PNG</span>
              <span className='text-[10px] text-zinc-500'>
                High quality image
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={ () => handleExportClick( 'jpg' ) }
            disabled={ isExporting }
          >
            <FileImage className='mr-2 h-4 w-4' aria-hidden='true' />
            <div className='flex flex-col'>
              <span className='font-medium'>JPG</span>
              <span className='text-[10px] text-zinc-500'>
                Compressed image
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={ () => handleExportClick( 'pdf' ) }
            disabled={ isExporting }
          >
            <FileText className='mr-2 h-4 w-4' aria-hidden='true' />
            <div className='flex flex-col'>
              <span className='font-medium'>PDF</span>
              <span className='text-[10px] text-zinc-500'>Document format</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={ () => handleExportClick( 'json' ) }
            disabled={ isExporting }
          >
            <FileJson className='mr-2 h-4 w-4' aria-hidden='true' />
            <div className='flex flex-col'>
              <span className='font-medium'>JSON</span>
              <span className='text-[10px] text-zinc-500'>Configuration</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={ () => handleExportClick( 'share' ) }
            disabled={ isExporting }
          >
            <Share2 className='mr-2 h-4 w-4' aria-hidden='true' />
            <div className='flex flex-col'>
              <span className='font-medium'>Share Link</span>
              <span className='text-[10px] text-zinc-500'>Generate URL</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={ showWidthDialog } onOpenChange={ setShowWidthDialog }>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Export { selectedFormat.toUpperCase() }</DialogTitle>
            <DialogDescription>
              Choose the width for your exported image. Height will scale
              proportionally.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='width'>Export Width (px)</Label>
              <Input
                id='width'
                type='number'
                value={ exportWidth }
                onChange={ ( e ) => setExportWidth( Number( e.target.value ) ) }
                min={ 100 }
                max={ 7680 }
                step={ 10 }
              />
            </div>
            <div className='space-y-2'>
              <Label>Presets</Label>
              <div className='grid grid-cols-2 gap-2'>
                { presets.map( ( preset ) => (
                  <Button
                    key={ preset.label }
                    variant={
                      exportWidth === preset.width ? 'default' : 'outline'
                    }
                    size='sm'
                    onClick={ () => setExportWidth( preset.width ) }
                    className='text-xs'
                  >
                    { preset.label }
                  </Button>
                ) ) }
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={ () => setShowWidthDialog( false ) }>
              Cancel
            </Button>
            <Button onClick={ handleWidthDialogConfirm } disabled={ isExporting }>
              { isExporting ? 'Exporting...' : 'Export' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ showShareDialog } onOpenChange={ setShowShareDialog }>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Share Chart</DialogTitle>
            <DialogDescription>
              Share your chart with others using this link. Anyone with the link can view your chart.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='share-url'>Share URL</Label>
              <div className='flex gap-2'>
                <Input
                  id='share-url'
                  value={ shareUrl }
                  readOnly
                  className='flex-1 font-mono text-xs'
                />
                <Button
                  variant='outline'
                  size='icon'
                  onClick={ handleCopyUrl }
                  className='flex-shrink-0'
                >
                  { copied ? (
                    <Check className='h-4 w-4 text-green-600' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  ) }
                </Button>
              </div>
            </div>
            <div className='p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <p className='text-xs text-green-900 dark:text-green-100'>
                <strong>✓ Chart {currentChartId ? 'Updated' : 'Saved'}!</strong> Your chart has been {currentChartId ? 'updated in' : 'saved to'} the database and can be accessed via this short URL. The link will remain active and viewable by anyone who has it.
              </p>
            </div>
            <div className='p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
              <p className='text-xs text-blue-900 dark:text-blue-100'>
                <strong>Tip:</strong> Visit <a href='/saved' className='underline font-semibold'>/saved</a> to view and manage all your saved charts.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={ () => setShowShareDialog( false ) }>
              Close
            </Button>
            <Button onClick={ handleCopyUrl }>
              { copied ? 'Copied!' : 'Copy Link' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
