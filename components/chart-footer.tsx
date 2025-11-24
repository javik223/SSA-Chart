'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

export const ChartFooter = memo( function ChartFooter() {
  const chartFooter = useChartStore( ( state ) => state.chartFooter );
  const setChartFooter = useChartStore( ( state ) => state.setChartFooter );
  const layoutPaddingLeft = useChartStore( ( state ) => state.layoutPaddingLeft );
  const layoutPaddingRight = useChartStore( ( state ) => state.layoutPaddingRight );

  const [ isEditing, setIsEditing ] = useState( false );
  const [ tempValue, setTempValue ] = useState( '' );
  const textareaRef = useRef<HTMLTextAreaElement>( null );

  const handleDoubleClick = () => {
    setIsEditing( true );
    setTempValue( chartFooter );
  };

  const saveEdit = () => {
    setChartFooter( tempValue );
    setIsEditing( false );
    setTempValue( '' );
  };

  const cancelEdit = () => {
    setIsEditing( false );
    setTempValue( '' );
  };

  const handleKeyDown = ( e: React.KeyboardEvent ) => {
    if ( e.key === 'Escape' ) {
      cancelEdit();
    } else if ( e.key === 'Enter' && ( e.metaKey || e.ctrlKey ) ) {
      e.preventDefault();
      saveEdit();
    }
  };

  const autoGrowTextarea = () => {
    if ( textareaRef.current ) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect( () => {
    if ( isEditing ) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
      setTimeout( autoGrowTextarea, 0 );
    }
  }, [ isEditing ] );

  useEffect( () => {
    if ( isEditing ) {
      autoGrowTextarea();
    }
  }, [ tempValue, isEditing ] );

  if ( !chartFooter && !isEditing ) return null;

  return (
    <div
      data-slot="chart-footer"
      style={ {
        paddingLeft: `${ layoutPaddingLeft }px`,
        paddingRight: `${ layoutPaddingRight }px`,
      } }
    >
      { isEditing ? (
        <textarea
          ref={ textareaRef }
          data-slot="chart-footer-textarea"
          value={ tempValue }
          onChange={ ( e ) => setTempValue( e.target.value ) }
          onBlur={ saveEdit }
          onKeyDown={ handleKeyDown }
          placeholder='Enter chart footer (Cmd/Ctrl+Enter to save)'
        />
      ) : (
        <p
          data-slot="chart-footer-text"
          onDoubleClick={ handleDoubleClick }
          title='Double-click to edit'
        >
          { chartFooter }
        </p>
      ) }
    </div>
  );
} );
