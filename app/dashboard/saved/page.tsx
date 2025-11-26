'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Trash2, Eye, ExternalLink, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { listCharts, deleteChart, searchCharts, type SavedChart } from '@/lib/chartStorage';
import { AnimatePresence, motion } from 'motion/react';
import { useAlertDialog } from '@/components/ui/alert-dialog-simple';
import { DashboardLayout } from '@/components/dashboard-layout';

export default function SavedChartsPage() {
  const router = useRouter();
  const { showAlert, showConfirm } = useAlertDialog();
  const [ charts, setCharts ] = useState<SavedChart[]>( [] );
  const [ isLoading, setIsLoading ] = useState( true );
  const [ searchQuery, setSearchQuery ] = useState( '' );
  const [ isSearching, setIsSearching ] = useState( false );

  useEffect( () => {
    loadCharts();
  }, [] );

  const loadCharts = async () => {
    try {
      setIsLoading( true );
      const chartList = await listCharts( 100 );
      console.log( 'Loaded charts:', chartList.length );
      console.log( 'Charts with thumbnails:', chartList.filter( c => c.thumbnail ).length );
      setCharts( chartList );
    } catch ( error ) {
      console.error( 'Failed to load charts:', error );
    } finally {
      setIsLoading( false );
    }
  };

  const handleSearch = async () => {
    if ( !searchQuery.trim() ) {
      loadCharts();
      return;
    }

    try {
      setIsSearching( true );
      const results = await searchCharts( searchQuery );
      setCharts( results );
    } catch ( error ) {
      console.error( 'Search failed:', error );
    } finally {
      setIsSearching( false );
    }
  };

  const handleDelete = async ( chartId: string ) => {
    const confirmed = await showConfirm( {
      title: 'Delete Chart',
      description: 'Are you sure you want to delete this chart? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    } );

    if ( !confirmed ) {
      return;
    }

    try {
      await deleteChart( chartId );
      setCharts( charts.filter( ( c ) => c.id !== chartId ) );
    } catch ( error ) {
      console.error( 'Failed to delete chart:', error );
      showAlert( {
        title: 'Delete Failed',
        description: 'Failed to delete chart. Please try again.',
      } );
    }
  };

  const handleView = ( chartId: string ) => {
    router.push( `/render/${ chartId }` );
  };

  const handleEdit = ( chartId: string ) => {
    // Redirect to create page with edit mode
    router.push( `/create?edit=${ chartId }` );
  };

  const formatDate = ( dateString: string ) => {
    return new Date( dateString ).toLocaleDateString( 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    } );
  };

  if ( isLoading ) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Card className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Loading Charts...
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please wait while we retrieve your saved charts
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Saved Charts
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Browse and manage your saved chart visualizations
            </p>
          </div>

          <div className="mb-6 flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search charts by title..."
                value={ searchQuery }
                onChange={ ( e ) => setSearchQuery( e.target.value ) }
                onKeyDown={ ( e ) => e.key === 'Enter' && handleSearch() }
                className="w-full"
              />
            </div>
            <Button onClick={ handleSearch } disabled={ isSearching }>
              { isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              ) }
            </Button>
            { searchQuery && (
              <Button variant="outline" onClick={ () => { setSearchQuery( '' ); loadCharts(); } }>
                Clear
              </Button>
            ) }
          </div>

          { charts.length === 0 ? (
            <Card className="p-12 text-center">
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                No Charts Found
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                { searchQuery ? 'Try a different search query' : 'Create and save your first chart to see it here' }
              </p>
              <Button onClick={ () => router.push( '/create' ) }>
                Go to Chart Builder
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                { charts.map( ( chart ) => (
                  <motion.div key={ chart.id } initial={ {
                    opacity: 0,
                    y: 20,
                  } } animate={ {
                    opacity: 1,
                    y: 0,
                  } } exit={ {
                    opacity: 0,
                    y: -20,
                  } }
                    layout
                    className="overflow-hidden hover:shadow-lg transition-shadow">
                    <Card className='pt-0 overflow-hidden'>
                      {/* Chart Preview */ }
                      <div
                        className="h-48 bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center cursor-pointer relative group overflow-hidden"
                        onClick={ () => handleView( chart.id ) }
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center z-10">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="h-8 w-8 text-white drop-shadow-lg" />
                          </div>
                        </div>
                        { chart.thumbnail ? (
                          <img
                            src={ chart.thumbnail }
                            alt={ chart.title }
                            className="w-full h-full object-cover"
                            onError={ ( e ) => {
                              console.error( 'Failed to load thumbnail for chart:', chart.id );
                              e.currentTarget.style.display = 'none';
                            } }
                            onLoad={ () => {
                              console.log( 'Thumbnail loaded successfully for chart:', chart.id );
                            } }
                          />
                        ) : (
                          <div className="text-zinc-400 dark:text-zinc-600 text-sm">
                            No preview available
                          </div>
                        ) }
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1 truncate">
                            { chart.title }
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              { chart.views } { chart.views === 1 ? 'view' : 'views' }
                            </span>
                            <span>{ formatDate( chart.updated_at ) }</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mb-3">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={ () => handleView( chart.id ) }
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={ () => handleEdit( chart.id ) }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={ () => handleDelete( chart.id ) }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mt-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono truncate">
                          { window.location.origin }/render/{ chart.id }
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ) ) }
              </AnimatePresence>
            </div>
          ) }
        </div>
      </div>
    </DashboardLayout>
  );
}
