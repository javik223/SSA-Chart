'use client';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { saveChart } from "@/lib/chartStorage";
import { useChartStore } from "@/store/useChartStore";
import { generateThumbnailWithRetry } from "@/utils/thumbnailUtils";
import { Save, Check, Plus, Settings, Share2, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExportDropdown } from "./export-dropdown";
import { useAlertDialog } from "./ui/alert-dialog-simple";

export function CreateChartHeader() {
  const [ isSaving, setIsSaving ] = useState( false );
  const [ justSaved, setJustSaved ] = useState( false );
  const setCurrentChartId = useChartStore( ( state ) => state.setCurrentChartId );
  const resetChart = useChartStore( ( state ) => state.resetChart );
  const currentChartId = useChartStore( ( state ) => state.currentChartId );
  const chartTitle = useChartStore( ( state ) => state.chartTitle );
  const router = useRouter();
  const { showAlert, showConfirm } = useAlertDialog();

  const handleNewChart = async () => {
    const message = currentChartId
      ? 'Your current changes will be lost if not saved.'
      : 'All current data and settings will be cleared.';

    const confirmed = await showConfirm( {
      title: 'Start a New Chart?',
      description: message,
      confirmText: 'Continue',
      cancelText: 'Cancel',
    } );

    if ( confirmed ) {
      console.log( 'Creating new chart - resetting all state...' );

      // Clear the current chart ID first
      setCurrentChartId( null );

      // Reset all chart state
      resetChart();

      // Navigate to create page to ensure clean state
      router.push( '/create' );

      console.log( 'New chart created - all state reset' );
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving( true );
      const state = useChartStore.getState();
      const persistedState = useChartStore.persist.getOptions().partialize?.( state ) || state;

      // Generate thumbnail from chart preview
      console.log( 'Generating thumbnail...' );
      const thumbnail = await generateThumbnailWithRetry();

      if ( thumbnail ) {
        console.log( 'Thumbnail generated successfully' );
      } else {
        console.warn( 'No thumbnail generated, saving without thumbnail' );
      }

      // Save or update chart with thumbnail
      console.log( 'Saving chart to database...' );
      const chartId = await saveChart( persistedState, currentChartId || undefined, thumbnail || undefined );
      console.log( 'Chart saved with ID:', chartId );

      // Update store with chart ID if new
      if ( !currentChartId ) {
        setCurrentChartId( chartId );
      }

      // Show success feedback
      setJustSaved( true );
      setTimeout( () => setJustSaved( false ), 2000 );
    } catch ( error ) {
      console.error( 'Failed to save chart:', error );
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showAlert( {
        title: 'Save Failed',
        description: `Failed to save chart: ${ errorMessage }\n\nPlease check the console for details.`,
      } );
    } finally {
      setIsSaving( false );
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + S
  useEffect( () => {
    const handleKeyDown = ( e: KeyboardEvent ) => {
      if ( ( e.metaKey || e.ctrlKey ) && e.key === 's' ) {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener( 'keydown', handleKeyDown );
    return () => window.removeEventListener( 'keydown', handleKeyDown );
  }, [ currentChartId ] );
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Chart</h1>
        <span className='hidden text-sm text-zinc-500 md:inline'>
          { chartTitle || 'Untitled Chart' }
        </span>
        { currentChartId && (
          <span className='flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700'>
            <Edit3 className='h-3 w-3' />
            Editing
          </span>
        ) }
        <div className="ml-auto flex items-center gap-2 mb-2">
          <div className='flex items-center gap-2'>
            <Button
              variant={ justSaved ? 'default' : 'outline' }
              size='sm'
              onClick={ handleSave }
              disabled={ isSaving }
              className='min-w-[100px]'
              title={ `Save chart (${ navigator.platform.includes( 'Mac' ) ? '⌘' : 'Ctrl' }+S)` }
            >
              { isSaving ? (
                <>
                  <Save className='h-4 w-4 mr-2 animate-pulse' />
                  Saving...
                </>
              ) : justSaved ? (
                <>
                  <Check className='h-4 w-4 mr-2' />
                  Saved!
                </>
              ) : (
                <>
                  <Save className='h-4 w-4 mr-2' />
                  Save
                </>
              ) }
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={ handleNewChart }
              className='hidden sm:flex'
            >
              <Plus className='h-4 w-4 mr-2' />
              New Chart
            </Button>
            <Button variant='outline' size='icon' className='hidden md:flex'>
              <Settings />
            </Button>
            <Button variant='outline' size='icon' className='hidden sm:flex'>
              <Share2 />
            </Button>
            <ExportDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
