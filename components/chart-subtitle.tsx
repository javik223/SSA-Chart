'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';
import './chart-subtitle.css';

export const ChartSubtitle = memo(function ChartSubtitle() {
  const chartSubtitle = useChartStore((state) => state.chartSubtitle);
  const setChartSubtitle = useChartStore((state) => state.setChartSubtitle);
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);

  // Subtitle style settings
  const subtitleStyleEnabled = useChartStore(
    (state) => state.subtitleStyleEnabled
  );
  const subtitleFont = useChartStore((state) => state.subtitleFont);
  const subtitleFontSize = useChartStore((state) => state.subtitleFontSize);
  const subtitleBaseFontSizeMobile = useChartStore(
    (state) => state.subtitleBaseFontSizeMobile
  );
  const subtitleBaseFontSizeTablet = useChartStore(
    (state) => state.subtitleBaseFontSizeTablet
  );
  const subtitleBaseFontSizeDesktop = useChartStore(
    (state) => state.subtitleBaseFontSizeDesktop
  );
  const subtitleFontWeight = useChartStore((state) => state.subtitleFontWeight);
  const subtitleColor = useChartStore((state) => state.subtitleColor);
  const subtitleLineHeight = useChartStore((state) => state.subtitleLineHeight);
  const subtitleSpaceAbove = useChartStore((state) => state.subtitleSpaceAbove);

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempValue(chartSubtitle);
  };

  const saveEdit = () => {
    setChartSubtitle(tempValue);
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
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
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

  if (!chartSubtitle && !isEditing) return null;

  // Calculate responsive font sizes
  const calculatedFontSizeMobile =
    subtitleBaseFontSizeMobile * subtitleFontSize;
  const calculatedFontSizeTablet =
    subtitleBaseFontSizeTablet * subtitleFontSize;
  const calculatedFontSizeDesktop =
    subtitleBaseFontSizeDesktop * subtitleFontSize;

  // Calculate space above
  const getSpaceAbove = () => {
    switch (subtitleSpaceAbove) {
      case 'slim':
        return '4px';
      case 'medium':
        return '8px';
      case 'large':
        return '16px';
      case 'none':
        return '0px';
      default:
        return '0px';
    }
  };

  // Get font weight class
  const getFontWeightClass = () => {
    switch (subtitleFontWeight) {
      case 'bold':
        return 'font-bold';
      case 'medium':
        return 'font-medium';
      case 'regular':
        return 'font-normal';
      default:
        return 'font-normal';
    }
  };

  // Build custom styles
  const customStyles: React.CSSProperties = subtitleStyleEnabled
    ? ({
        fontFamily:
          subtitleFont !== 'Same as parent' ? subtitleFont : undefined,
        '--subtitle-font-size-mobile': `${calculatedFontSizeMobile}px`,
        '--subtitle-font-size-tablet': `${calculatedFontSizeTablet}px`,
        '--subtitle-font-size-desktop': `${calculatedFontSizeDesktop}px`,
        color: subtitleColor,
        lineHeight: subtitleLineHeight,
        paddingTop: getSpaceAbove(),
      } as React.CSSProperties)
    : {
        paddingTop: getSpaceAbove(),
      };

  return (
    <div
      style={{
        paddingLeft: `${layoutPaddingLeft}px`,
        paddingRight: `${layoutPaddingRight}px`,
        paddingBottom: '4px',
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
            'w-full',
            subtitleStyleEnabled ? 'chart-subtitle' : 'text-lg md:text-xl',
            subtitleStyleEnabled ? getFontWeightClass() : 'font-semibold',
            subtitleStyleEnabled ? '' : 'text-zinc-700',
            'border-2 border-blue-500 rounded px-2 py-1',
            'focus:outline-none resize-none overflow-hidden'
          )}
          placeholder='Enter subtitle (Cmd/Ctrl+Enter to save)'
          style={{ minHeight: '2rem', ...customStyles }}
        />
      ) : (
        <h3
          className={cn(
            subtitleStyleEnabled ? 'chart-subtitle' : 'text-lg md:text-xl',
            subtitleStyleEnabled ? getFontWeightClass() : 'font-semibold',
            subtitleStyleEnabled ? '' : 'text-zinc-700',
            'cursor-text hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
            'transition-colors whitespace-pre-wrap'
          )}
          style={customStyles}
          onDoubleClick={handleDoubleClick}
          title='Double-click to edit'
        >
          {chartSubtitle}
        </h3>
      )}
    </div>
  );
});
