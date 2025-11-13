'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

export const ChartTitle = memo(function ChartTitle() {
  const chartTitle = useChartStore((state) => state.chartTitle);
  const setChartTitle = useChartStore((state) => state.setChartTitle);
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);
  const layoutPaddingTop = useChartStore((state) => state.layoutPaddingTop);

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempValue(chartTitle);
  };

  const saveEdit = () => {
    setChartTitle(tempValue);
    setIsEditing(false);
    setTempValue('');
  };

  const cancelEdit = () => {
    setIsEditing(false);
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

  const autoGrowTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
      setTimeout(autoGrowTextarea, 0);
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      autoGrowTextarea();
    }
  }, [tempValue, isEditing]);

  if (!chartTitle && !isEditing) return null;

  return (
    <div
      style={{
        paddingLeft: `${layoutPaddingLeft}px`,
        paddingRight: `${layoutPaddingRight}px`,
        paddingTop: `${layoutPaddingTop}px`,
        paddingBottom: '8px',
      }}
    >
      {isEditing ? (
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
            'text-2xl md:text-3xl font-bold text-zinc-900 cursor-text',
            'hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
            'transition-colors whitespace-pre-wrap tracking-tighter'
          )}
          onDoubleClick={handleDoubleClick}
          title='Double-click to edit'
        >
          {chartTitle}
        </h2>
      )}
    </div>
  );
});
