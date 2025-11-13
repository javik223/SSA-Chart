'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

export const ChartDescription = memo(function ChartDescription() {
  const chartDescription = useChartStore((state) => state.chartDescription);
  const setChartDescription = useChartStore((state) => state.setChartDescription);
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempValue(chartDescription);
  };

  const saveEdit = () => {
    setChartDescription(tempValue);
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

  if (!chartDescription && !isEditing) return null;

  return (
    <div
      className='border-b-zinc-200 border-b'
      style={{
        paddingLeft: `${layoutPaddingLeft}px`,
        paddingRight: `${layoutPaddingRight}px`,
        paddingBottom: '16px',
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
            'text-xs md:text-sm text-zinc-600 cursor-text',
            'hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
            'transition-colors whitespace-pre-wrap'
          )}
          onDoubleClick={handleDoubleClick}
          title='Double-click to edit'
        >
          {chartDescription}
        </p>
      )}
    </div>
  );
});
