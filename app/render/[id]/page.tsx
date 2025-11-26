'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartRenderer } from '@/components/ChartRenderer';
import { useChartStore } from '@/store/useChartStore';
import { loadChart } from '@/lib/chartStorage';

export default function RenderByIdPage() {
  const params = useParams();
  const chartId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartInfo, setChartInfo] = useState<{ title: string; views: number } | null>(null);
  const loadChartState = useChartStore((state) => state.loadChartState);

  useEffect(() => {
    async function loadChartData() {
      if (!chartId) {
        setError('No chart ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const savedChart = await loadChart(chartId);

        if (!savedChart) {
          setError('Chart not found. It may have been deleted or the link is incorrect.');
          setIsLoading(false);
          return;
        }

        // Load the chart data into the store
        loadChartState(savedChart.data);

        // Store chart metadata
        setChartInfo({
          title: savedChart.title,
          views: savedChart.views,
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load chart:', err);
        setError('Failed to load chart. Please try again later.');
        setIsLoading(false);
      }
    }

    loadChartData();
  }, [chartId, loadChartState]);

  const handleReset = () => {
    window.location.href = '/render';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Loading Chart...
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Please wait while we retrieve your chart
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Chart Not Found
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {error}
            </p>
            <Button onClick={handleReset}>
              Load a Different Chart
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {chartInfo?.title || 'Chart Renderer'}
            </h1>
            {chartInfo && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                {chartInfo.views} {chartInfo.views === 1 ? 'view' : 'views'}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={handleReset}>
            Load Different Chart
          </Button>
        </div>
        <ChartRenderer />
      </div>
    </div>
  );
}
