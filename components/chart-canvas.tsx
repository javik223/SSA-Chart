'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, GripVertical } from 'lucide-react';
import { BasicChart } from '@/components/charts/BasicChart';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

export function ChartCanvas() {
  const {
    data,
    columnMapping,
    previewWidth,
    previewHeight,
    setPreviewWidth,
    chartTitle,
    setChartTitle,
    chartDescription,
    setChartDescription,
    chartFooter,
    setChartFooter,
    layoutPaddingTop,
    layoutPaddingRight,
    layoutPaddingBottom,
    layoutPaddingLeft,
    layoutBackgroundColor,
    layoutBorderRadius,
    layoutBorderWidth,
    layoutBorderColor,
  } = useChartStore();

  const [isResizing, setIsResizing] = useState(false);
  const [editingField, setEditingField] = useState<
    'title' | 'description' | 'footer' | null
  >(null);
  const [tempValue, setTempValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = previewWidth;
  };

  // Handle inline editing
  const handleDoubleClick = (
    field: 'title' | 'description' | 'footer',
    currentValue: string
  ) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = () => {
    if (editingField === 'title') {
      setChartTitle(tempValue);
    } else if (editingField === 'description') {
      setChartDescription(tempValue);
    } else if (editingField === 'footer') {
      setChartFooter(tempValue);
    }
    setEditingField(null);
    setTempValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      cancelEdit();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      saveEdit();
    }
  };

  // Auto-grow textarea based on content
  const autoGrowTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  };

  // Focus textarea when editing starts
  useEffect(() => {
    if (editingField) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
      // Initial auto-grow
      setTimeout(autoGrowTextarea, 0);
    }
  }, [editingField]);

  // Auto-grow textarea when content changes
  useEffect(() => {
    if (editingField) {
      autoGrowTextarea();
    }
  }, [tempValue, editingField]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startXRef.current;
      const newWidth = Math.max(300, startWidthRef.current + deltaX);
      setPreviewWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, setPreviewWidth]);

  // Check if we have data and valid column mapping
  const hasData = data && data.length > 1;
  const hasMapping =
    columnMapping.labels !== null && columnMapping.values.length > 0;

  if (!hasData || !hasMapping) {
    return (
      <div className='flex h-full items-center justify-center bg-slate-50 p-8'>
        <Card className='w-full max-w-4xl shadow-sm'>
          <CardContent className='flex min-h-[400px] flex-col items-center justify-center gap-4 p-12'>
            <BarChart3 className='h-16 w-16 text-zinc-300' />
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-zinc-900'>
                No chart yet
              </h3>
              <p className='mt-2 text-base text-zinc-500'>
                {!hasData
                  ? 'Upload data or switch to the Data tab to get started'
                  : 'Select columns in the Data tab to visualize'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex h-full items-center justify-center bg-slate-50 p-8 overflow-auto'
      )}
    >
      <div
        ref={containerRef}
        style={{
          width: `${previewWidth}px`,
          maxWidth: '100%',
          minWidth: '300px',
          backgroundColor: layoutBackgroundColor,
          borderRadius: `${layoutBorderRadius}px`,
          borderWidth: `${layoutBorderWidth}px`,
          borderColor: layoutBorderColor,
          borderStyle: 'solid',
        }}
        className={cn('relative shadow-md')}
      >
        {/* Chart Title */}
        {(chartTitle || editingField === 'title') && (
          <div
            style={{
              paddingLeft: `${layoutPaddingLeft}px`,
              paddingRight: `${layoutPaddingRight}px`,
              paddingTop: `${layoutPaddingTop}px`,
              paddingBottom: '8px',
            }}
          >
            {editingField === 'title' ? (
              <textarea
                ref={textareaRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                className={cn(
                  'w-full text-2xl font-bold text-zinc-900',
                  'border-2 border-blue-500 rounded px-2 py-1',
                  'focus:outline-none resize-none overflow-hidden'
                )}
                placeholder='Enter chart title (Cmd/Ctrl+Enter to save)'
                style={{ minHeight: '3rem' }}
              />
            ) : (
              <h2
                className={cn(
                  'text-2xl font-bold text-zinc-900 cursor-text',
                  'hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
                  'transition-colors whitespace-pre-wrap'
                )}
                onDoubleClick={() => handleDoubleClick('title', chartTitle)}
                title='Double-click to edit'
              >
                {chartTitle}
              </h2>
            )}
          </div>
        )}

        {/* Chart Description */}
        {(chartDescription || editingField === 'description') && (
          <div
            style={{
              paddingLeft: `${layoutPaddingLeft}px`,
              paddingRight: `${layoutPaddingRight}px`,
              paddingBottom: '16px',
            }}
          >
            {editingField === 'description' ? (
              <textarea
                ref={textareaRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                className={cn(
                  'w-full text-sm text-zinc-600',
                  'border-2 border-blue-500 rounded px-2 py-1',
                  'focus:outline-none resize-none overflow-hidden'
                )}
                placeholder='Enter chart description (Cmd/Ctrl+Enter to save)'
                style={{ minHeight: '3rem' }}
              />
            ) : (
              <p
                className={cn(
                  'text-sm text-zinc-600 cursor-text',
                  'hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
                  'transition-colors whitespace-pre-wrap'
                )}
                onDoubleClick={() =>
                  handleDoubleClick('description', chartDescription)
                }
                title='Double-click to edit'
              >
                {chartDescription}
              </p>
            )}
          </div>
        )}

        {/* Chart SVG Container */}
        <div
          style={{
            aspectRatio: `${previewWidth} / ${previewHeight}`,
            maxHeight: `${previewHeight}px`,
          }}
          className={cn('w-full')}
        >
          <BasicChart />
        </div>

        {/* Chart Footer */}
        {(chartFooter || editingField === 'footer') && (
          <div
            className={cn('border-t border-zinc-100')}
            style={{
              paddingLeft: `${layoutPaddingLeft}px`,
              paddingRight: `${layoutPaddingRight}px`,
              paddingTop: '16px',
              paddingBottom: `${layoutPaddingBottom}px`,
            }}
          >
            {editingField === 'footer' ? (
              <textarea
                ref={textareaRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={handleKeyDown}
                className={cn(
                  'w-full text-xs text-zinc-500',
                  'border-2 border-blue-500 rounded px-2 py-1',
                  'focus:outline-none resize-none overflow-hidden'
                )}
                placeholder='Enter chart footer (Cmd/Ctrl+Enter to save)'
                style={{ minHeight: '2rem' }}
              />
            ) : (
              <p
                className={cn(
                  'text-xs text-zinc-500 cursor-text',
                  'hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
                  'transition-colors whitespace-pre-wrap'
                )}
                onDoubleClick={() => handleDoubleClick('footer', chartFooter)}
                title='Double-click to edit'
              >
                {chartFooter}
              </p>
            )}
          </div>
        )}

        {/* Resize Handle */}
        <div
          onMouseDown={handleMouseDown}
          className={cn(
            'absolute bottom-0 right-0 w-6 h-6 cursor-ew-resize',
            'hover:bg-zinc-100 active:bg-zinc-200',
            'flex items-center justify-center group transition-colors'
          )}
          title='Drag to resize width'
        >
          <GripVertical
            className={cn(
              'w-4 h-4 text-zinc-400 group-hover:text-zinc-600 rotate-90'
            )}
          />
        </div>
      </div>
    </div>
  );
}
