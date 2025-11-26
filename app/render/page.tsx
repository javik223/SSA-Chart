'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartRenderer } from '@/components/ChartRenderer';
import { useChartStore } from '@/store/useChartStore';

export default function RenderPage() {
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const loadChartState = useChartStore((state) => state.loadChartState);

  // Check if data is already loaded (from URL params or localStorage)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        loadChartState(decodedData);
        setHasData(true);
      } catch (err) {
        setError('Failed to load chart data from URL');
        console.error('URL data parse error:', err);
      }
    } else {
      // Check if store already has data
      const state = useChartStore.getState();
      if (state.data && state.data.length > 0) {
        setHasData(true);
      }
    }
  }, [loadChartState]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setError(null);

      if (!file.name.endsWith('.json')) {
        setError('Please upload a valid JSON file');
        return;
      }

      try {
        const text = await file.text();
        const chartData = JSON.parse(text);

        // Validate that it contains required fields
        if (!chartData.data && !chartData.chartType) {
          setError('Invalid chart configuration file');
          return;
        }

        // Load the state into the store
        loadChartState(chartData);
        setHasData(true);
      } catch (err) {
        setError('Failed to parse JSON file. Please ensure it\'s a valid chart export.');
        console.error('File parse error:', err);
      }
    },
    [loadChartState]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleReset = () => {
    setHasData(false);
    setError(null);
    useChartStore.getState().resetChart();
  };

  if (hasData) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Chart Renderer
            </h1>
            <Button variant="outline" onClick={handleReset}>
              Load Different Chart
            </Button>
          </div>
          <ChartRenderer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Chart Renderer
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Load an exported chart configuration to view your visualization
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileJson className="mx-auto h-16 w-16 text-zinc-400 dark:text-zinc-600 mb-4" />

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Upload Chart Configuration
          </h2>

          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Drag and drop a JSON file here, or click to browse
          </p>

          <div className="flex flex-col items-center gap-4">
            <Button
              variant="default"
              className="relative"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>

            <input
              id="file-upload"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Error loading file
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
            How to use:
          </h3>
          <ol className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2 list-decimal list-inside">
            <li>Create and configure your chart in the main app</li>
            <li>Click the Export dropdown and select "Share Link"</li>
            <li>A short URL will be generated and saved to the database</li>
            <li>Share the link with others - they can view the chart here</li>
            <li>Alternatively, export as JSON and upload it here manually</li>
          </ol>
        </div>
      </Card>
    </div>
  );
}
