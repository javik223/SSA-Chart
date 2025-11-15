'use client';

import { useState } from 'react';
import { Download, FileDown, Image, FileImage, FileText } from 'lucide-react';
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

export function ExportDropdown() {
  const chartTitle = useChartStore((state) => state.chartTitle);
  const [isExporting, setIsExporting] = useState(false);
  const [showWidthDialog, setShowWidthDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'jpg' | 'pdf'>(
    'png'
  );
  const [exportWidth, setExportWidth] = useState<number>(1920);

  const handleExportClick = (format: ExportFormat) => {
    if (format === 'svg') {
      handleExport(format);
    } else {
      // Show width dialog for PNG/JPG/PDF
      setSelectedFormat(format as 'png' | 'jpg' | 'pdf');
      setShowWidthDialog(true);
    }
  };

  const handleExport = async (format: ExportFormat, width?: number) => {
    try {
      setIsExporting(true);

      // Find the chart container element
      const chartContainer = document.querySelector(
        '[data-chart-container]'
      ) as HTMLElement;

      if (!chartContainer) {
        alert('Chart container not found. Please ensure a chart is visible.');
        return;
      }

      // Generate filename from chart title or use default
      const filename = chartTitle.trim() || 'chart';

      await exportChart(chartContainer, format, filename, width);
      setShowWidthDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert(
        `Failed to export chart as ${format.toUpperCase()}. Please try again.`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleWidthDialogConfirm = () => {
    // If width is 0, pass undefined to use current width
    handleExport(selectedFormat, exportWidth === 0 ? undefined : exportWidth);
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
            disabled={isExporting}
          >
            <Download className='h-4 w-4' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuLabel>Export Chart</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleExportClick('svg')}
            disabled={isExporting}
          >
            <FileDown className='mr-2 h-4 w-4' aria-hidden='true' />
            <div className='flex flex-col'>
              <span className='font-medium'>SVG</span>
              <span className='text-[10px] text-zinc-500'>Vector graphics</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExportClick('png')}
            disabled={isExporting}
          >
            <Image className='mr-2 h-4 w-4' alt='' />
            <div className='flex flex-col'>
              <span className='font-medium'>PNG</span>
              <span className='text-[10px] text-zinc-500'>
                High quality image
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleExportClick('jpg')}
            disabled={isExporting}
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
            onClick={() => handleExportClick('pdf')}
            disabled={isExporting}
          >
            <FileText className='mr-2 h-4 w-4' aria-hidden='true' />
            <div className='flex flex-col'>
              <span className='font-medium'>PDF</span>
              <span className='text-[10px] text-zinc-500'>Document format</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showWidthDialog} onOpenChange={setShowWidthDialog}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Export {selectedFormat.toUpperCase()}</DialogTitle>
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
                value={exportWidth}
                onChange={(e) => setExportWidth(Number(e.target.value))}
                min={100}
                max={7680}
                step={10}
              />
            </div>
            <div className='space-y-2'>
              <Label>Presets</Label>
              <div className='grid grid-cols-2 gap-2'>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant={
                      exportWidth === preset.width ? 'default' : 'outline'
                    }
                    size='sm'
                    onClick={() => setExportWidth(preset.width)}
                    className='text-xs'
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowWidthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleWidthDialogConfirm} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
