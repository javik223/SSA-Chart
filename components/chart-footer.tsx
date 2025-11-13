'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

export const ChartFooter = memo(function ChartFooter() {
  const chartFooter = useChartStore((state) => state.chartFooter);
  const setChartFooter = useChartStore((state) => state.setChartFooter);
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);
  const layoutPaddingBottom = useChartStore((state) => state.layoutPaddingBottom);

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempValue(chartFooter);
  };

  const saveEdit = () => {
    setChartFooter(tempValue);
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

  if (!chartFooter && !isEditing) return null;

  return (
    <div
      className={cn('border-t border-zinc-200')}
      style={{
        paddingLeft: `${layoutPaddingLeft}px`,
        paddingRight: `${layoutPaddingRight}px`,
        paddingTop: '16px',
        paddingBottom: `${layoutPaddingBottom}px`,
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
          onDoubleClick={handleDoubleClick}
          title='Double-click to edit'
        >
          {chartFooter}
        </p>
      )}
    </div>
  );
});
