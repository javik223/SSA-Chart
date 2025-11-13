'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';
import './chart-header-text.css';

export const ChartHeaderText = memo(function ChartHeaderText() {
  const headerText = useChartStore((state) => state.headerText);
  const setHeaderText = useChartStore((state) => state.setHeaderText);
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);

  // Header text style settings
  const headerTextStyleEnabled = useChartStore(
    (state) => state.headerTextStyleEnabled
  );
  const headerTextFont = useChartStore((state) => state.headerTextFont);
  const headerTextFontSize = useChartStore((state) => state.headerTextFontSize);
  const headerTextBaseFontSizeMobile = useChartStore(
    (state) => state.headerTextBaseFontSizeMobile
  );
  const headerTextBaseFontSizeTablet = useChartStore(
    (state) => state.headerTextBaseFontSizeTablet
  );
  const headerTextBaseFontSizeDesktop = useChartStore(
    (state) => state.headerTextBaseFontSizeDesktop
  );
  const headerTextFontWeight = useChartStore(
    (state) => state.headerTextFontWeight
  );
  const headerTextColor = useChartStore((state) => state.headerTextColor);
  const headerTextLineHeight = useChartStore(
    (state) => state.headerTextLineHeight
  );
  const headerTextSpaceAbove = useChartStore(
    (state) => state.headerTextSpaceAbove
  );

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTempValue(headerText);
  };

  const saveEdit = () => {
    setHeaderText(tempValue);
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

  if (!headerText && !isEditing) return null;

  // Calculate responsive font sizes
  const calculatedFontSizeMobile =
    headerTextBaseFontSizeMobile * headerTextFontSize;
  const calculatedFontSizeTablet =
    headerTextBaseFontSizeTablet * headerTextFontSize;
  const calculatedFontSizeDesktop =
    headerTextBaseFontSizeDesktop * headerTextFontSize;

  // Calculate space above
  const getSpaceAbove = () => {
    switch (headerTextSpaceAbove) {
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
    switch (headerTextFontWeight) {
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
  const customStyles: React.CSSProperties = headerTextStyleEnabled
    ? ({
        fontFamily:
          headerTextFont !== 'Same as parent' ? headerTextFont : undefined,
        '--header-text-font-size-mobile': `${calculatedFontSizeMobile}px`,
        '--header-text-font-size-tablet': `${calculatedFontSizeTablet}px`,
        '--header-text-font-size-desktop': `${calculatedFontSizeDesktop}px`,
        color: headerTextColor,
        lineHeight: headerTextLineHeight,
        paddingTop: getSpaceAbove(),
      } as React.CSSProperties)
    : {
        paddingTop: getSpaceAbove(),
      };

  return (
    <div
      style={{
        // paddingLeft: `${layoutPaddingLeft}px`,
        paddingRight: `${layoutPaddingRight}px`,
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
            'w-full text-sm text-zinc-600',
            'border-2 border-blue-500 rounded px-2 py-1',
            'focus:outline-none resize-none overflow-hidden'
          )}
          placeholder='Enter header text (Cmd/Ctrl+Enter to save)'
          style={{ minHeight: '2rem', ...customStyles }}
        />
      ) : (
        <p
          className={cn(
            headerTextStyleEnabled ? 'chart-header-text' : 'text-xs md:text-sm',
            headerTextStyleEnabled ? getFontWeightClass() : '',
            headerTextStyleEnabled ? '' : 'text-zinc-600',
            'cursor-text hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
            'transition-colors whitespace-pre-wrap'
          )}
          style={customStyles}
          onDoubleClick={handleDoubleClick}
          title='Double-click to edit'
        >
          {headerText}
        </p>
      )}
    </div>
  );
});
