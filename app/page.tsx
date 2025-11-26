'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Save, TrendingUp, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { listCharts } from '@/lib/chartStorage';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

export default function HomePage() {
  const [ chartCount, setChartCount ] = useState( 0 );

  useEffect( () => {
    async function loadChartCount() {
      try {
        const charts = await listCharts( 1000 );
        setChartCount( charts.length );
      } catch ( error ) {
        console.error( 'Failed to load chart count:', error );
      }
    }
    loadChartCount();
  }, [] );

  return (
    <>
      <SiteHeader />
      <div className='flex flex-1 flex-col p-4'>
        <div className='@container/main flex flex-1 flex-col gap-2'>
          <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
            <DashboardLayout>
              <div className="container py-10">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground mt-2">
                    Create beautiful data visualizations and manage your saved charts
                  </p>
                </div>

                {/* Stats */ }
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Saved Charts
                      </CardTitle>
                      <Save className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{ chartCount }</div>
                      <p className="text-xs text-muted-foreground">
                        Total charts created
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Chart Types
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">15+</div>
                      <p className="text-xs text-muted-foreground">
                        Available visualizations
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Data Sources
                      </CardTitle>
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">CSV, Excel</div>
                      <p className="text-xs text-muted-foreground">
                        Supported formats
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Export Options
                      </CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">PNG, SVG, PDF</div>
                      <p className="text-xs text-muted-foreground">
                        Multiple formats
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */ }
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle>Create New Chart</CardTitle>
                          <CardDescription>
                            Start building a new visualization from your data
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your data from CSV or Excel files, customize your chart with multiple visualization types, and export in various formats.
                      </p>
                      <Link href="/create">
                        <Button className="w-full" size="lg">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Create Chart
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                          <Save className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle>Saved Charts</CardTitle>
                          <CardDescription>
                            View, edit, and manage all your saved visualizations
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access your saved charts library with { chartCount } visualization{ chartCount !== 1 ? 's' : '' }. Edit, share, or export any of your existing charts.
                      </p>
                      <Link href="/saved">
                        <Button className="w-full" size="lg" variant="outline">
                          <Save className="mr-2 h-4 w-4" />
                          View Saved Charts
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                {/* Features */ }
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-4">Features</h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Interactive Editor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Live preview as you configure your charts with intuitive controls and real-time updates.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Multiple Chart Types</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Choose from bar, line, pie, donut, treemap, diverging bar, and many more visualization types.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Easy Sharing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Generate shareable links or export your charts as high-quality images for presentations.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </DashboardLayout>
          </div>
        </div>
      </div>
    </>
  );
}
