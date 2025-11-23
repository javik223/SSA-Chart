'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';
import './chart-header-text.css';

export const ChartHeaderText = memo( function ChartHeaderText() {
  const headerText = useChartStore( ( state ) => state.headerText );
  const setHeaderText = useChartStore( ( state ) => state.setHeaderText );
  const layoutPaddingLeft = useChartStore( ( state ) => state.layoutPaddingLeft );
  const layoutPaddingRight = useChartStore( ( state ) => state.layoutPaddingRight );

  // Header text style settings
  const headerTextStyleEnabled = useChartStore(
    ( state ) => state.headerTextStyleEnabled
  );
  const headerTextFont = useChartStore( ( state ) => state.headerTextFont );
  const headerTextFontSize = useChartStore( ( state ) => state.headerTextFontSize );
  const headerTextBaseFontSizeMobile = useChartStore(
    ( state ) => state.headerTextBaseFontSizeMobile
  );
  const headerTextBaseFontSizeTablet = useChartStore(
    ( state ) => state.headerTextBaseFontSizeTablet
  );
  const headerTextBaseFontSizeDesktop = useChartStore(
    ( state ) => state.headerTextBaseFontSizeDesktop
  );
  const headerTextFontWeight = useChartStore(
    ( state ) => state.headerTextFontWeight
  );
  const headerTextColor = useChartStore( ( state ) => state.headerTextColor );
  const headerTextLineHeight = useChartStore(
    ( state ) => state.headerTextLineHeight
  );
  const headerTextSpaceAbove = useChartStore(
    ( state ) => state.headerTextSpaceAbove
  );

  const [ isEditing, setIsEditing ] = useState( false );
  const editableRef = useRef<HTMLParagraphElement>( null );

  const handleDoubleClick = () => {
    setIsEditing( true );
  };

  const saveEdit = () => {
    if ( editableRef.current ) {
      setHeaderText( editableRef.current.innerText );
    }
    setIsEditing( false );
  };

  const cancelEdit = () => {
    if ( editableRef.current ) {
      editableRef.current.innerText = headerText; // Revert to original
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

  if ( !headerText && !isEditing ) return null;

  // Calculate responsive font sizes
  const calculatedFontSizeMobile =
    headerTextBaseFontSizeMobile * headerTextFontSize;
  const calculatedFontSizeTablet =
    headerTextBaseFontSizeTablet * headerTextFontSize;
  const calculatedFontSizeDesktop =
    headerTextBaseFontSizeDesktop * headerTextFontSize;

  // Calculate space above
  const getSpaceAbove = () => {
    switch ( headerTextSpaceAbove ) {
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
    switch ( headerTextFontWeight ) {
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
    ? ( {
      fontFamily:
        headerTextFont !== 'Same as parent' ? headerTextFont : undefined,
      '--header-text-font-size-mobile': `${ calculatedFontSizeMobile }px`,
      '--header-text-font-size-tablet': `${ calculatedFontSizeTablet }px`,
      '--header-text-font-size-desktop': `${ calculatedFontSizeDesktop }px`,
      color: headerTextColor,
      lineHeight: headerTextLineHeight,
      paddingTop: getSpaceAbove(),
    } as React.CSSProperties )
    : {
      paddingTop: getSpaceAbove(),
    };

  return (
    <div
      style={ {
        paddingLeft: `${ layoutPaddingLeft }px`,
        paddingRight: `${ layoutPaddingRight }px`,
        paddingBottom: '8px',
      } }
    >
      <p
        ref={ editableRef }
        contentEditable={ isEditing }
        suppressContentEditableWarning={ true }
        onBlur={ saveEdit }
        onKeyDown={ handleKeyDown }
        className={ cn(
          headerTextStyleEnabled ? 'chart-header-text' : 'text-xs md:text-sm',
          headerTextStyleEnabled ? getFontWeightClass() : '',
          headerTextStyleEnabled ? '' : 'text-zinc-600',
          isEditing
            ? 'border-2 border-blue-500 rounded px-2 py-1 focus:outline-none'
            : 'cursor-text hover:bg-zinc-50 rounded px-2 py-1 -mx-2',
          'transition-colors whitespace-pre-wrap'
        ) }
        style={ customStyles }
        onDoubleClick={ handleDoubleClick }
        title='Double-click to edit'
      >
        { headerText }
      </p>
    </div>
  );
} );
