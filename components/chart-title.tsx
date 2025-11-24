'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';
import './chart-title.css';

export const ChartTitle = memo( function ChartTitle() {
  const chartTitle = useChartStore( ( state ) => state.chartTitle );
  const setChartTitle = useChartStore( ( state ) => state.setChartTitle );
  const layoutPaddingLeft = useChartStore( ( state ) => state.layoutPaddingLeft );
  const layoutPaddingRight = useChartStore( ( state ) => state.layoutPaddingRight );

  // Title style settings
  const titleStyleEnabled = useChartStore( ( state ) => state.titleStyleEnabled );
  const titleFont = useChartStore( ( state ) => state.titleFont );
  const titleFontSize = useChartStore( ( state ) => state.titleFontSize );
  const titleBaseFontSizeMobile = useChartStore(
    ( state ) => state.titleBaseFontSizeMobile
  );
  const titleBaseFontSizeTablet = useChartStore(
    ( state ) => state.titleBaseFontSizeTablet
  );
  const titleBaseFontSizeDesktop = useChartStore(
    ( state ) => state.titleBaseFontSizeDesktop
  );
  const titleFontWeight = useChartStore( ( state ) => state.titleFontWeight );
  const titleColor = useChartStore( ( state ) => state.titleColor );
  const titleLineHeight = useChartStore( ( state ) => state.titleLineHeight );
  const titleSpaceAbove = useChartStore( ( state ) => state.titleSpaceAbove );

  const [ isEditing, setIsEditing ] = useState( false );
  const editableRef = useRef<HTMLHeadingElement>( null );

  const handleDoubleClick = () => {
    setIsEditing( true );
  };

  const saveEdit = () => {
    if ( editableRef.current ) {
      setChartTitle( editableRef.current.innerText );
    }
    setIsEditing( false );
  };

  const cancelEdit = () => {
    if ( editableRef.current ) {
      editableRef.current.innerText = chartTitle; // Revert to original
    }
    setIsEditing( false );
  };

  const handleKeyDown = ( e: React.KeyboardEvent ) => {
    if ( e.key === 'Escape' ) {
      cancelEdit();
    } else if ( e.key === 'Enter' && ( e.metaKey || e.ctrlKey ) ) {
      e.preventDefault();
      saveEdit();
    } else if ( e.key === 'Enter' ) {
      e.preventDefault(); // Prevent new line in contenteditable
    }
  };

  useEffect( () => {
    if ( isEditing ) {
      editableRef.current?.focus();
      // Place caret at the end
      const range = document.createRange();
      const selection = window.getSelection();
      if ( editableRef.current && selection ) {
        range.selectNodeContents( editableRef.current );
        range.collapse( false ); // Collapse to the end
        selection.removeAllRanges();
        selection.addRange( range );
      }
    }
  }, [ isEditing ] );

  if ( !chartTitle && !isEditing ) return null;

  // Calculate responsive font sizes
  const calculatedFontSizeMobile = titleBaseFontSizeMobile * titleFontSize;
  const calculatedFontSizeTablet = titleBaseFontSizeTablet * titleFontSize;
  const calculatedFontSizeDesktop = titleBaseFontSizeDesktop * titleFontSize;

  // Calculate space above
  const getSpaceAbove = () => {
    switch ( titleSpaceAbove ) {
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
    switch ( titleFontWeight ) {
      case 'bold':
        return 'font-bold';
      case 'medium':
        return 'font-medium';
      case 'regular':
        return 'font-normal';
      default:
        return 'font-bold';
    }
  };

  // Build custom styles
  const customStyles: React.CSSProperties = titleStyleEnabled
    ? ( {
      fontFamily: titleFont !== 'Same as parent' ? titleFont : undefined,
      '--title-font-size-mobile': `${ calculatedFontSizeMobile }px`,
      '--title-font-size-tablet': `${ calculatedFontSizeTablet }px`,
      '--title-font-size-desktop': `${ calculatedFontSizeDesktop }px`,
      color: titleColor,
      lineHeight: titleLineHeight,
      paddingTop: getSpaceAbove(),
    } as React.CSSProperties )
    : {};

  return (
    <div
      style={ {
        // paddingLeft: `${layoutPaddingLeft}px`, 
        // paddingRight: `${layoutPaddingRight}px`,
        paddingBottom: '8px',
      } }
    >
      <h2
        ref={ editableRef }
        contentEditable={ isEditing }
        suppressContentEditableWarning={ true }
        onBlur={ saveEdit }
        onKeyDown={ handleKeyDown }
        className={ cn(
          titleStyleEnabled ? 'chart-title' : 'text-2xl md:text-3xl',
          titleStyleEnabled ? getFontWeightClass() : 'font-bold',
          titleStyleEnabled ? '' : 'text-zinc-900',
          isEditing
            ? 'border-2 border-blue-500 rounded px-2 py-1 focus:outline-none'
            : 'cursor-text hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
          'transition-colors whitespace-pre-wrap tracking-tighter'
        ) }
        style={ customStyles }
        onDoubleClick={ handleDoubleClick }
        title='Double-click to edit'
      >
        { chartTitle }
      </h2>
    </div>
  );
} );
