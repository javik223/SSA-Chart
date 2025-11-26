'use client';

import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/utils';

/**
 * Chart footer section component that groups source, notes, and logo together
 * with support for alignment, borders, and advanced styles
 */
export function ChartFooterSection() {
  // Footer content
  // Footer content
  const {
    footerSourceName,
    footerSourceUrl,
    footerSourceLabel,
    footerNote,
    footerNoteSecondary,
    footerAlignment,
    footerStylesEnabled,
    footerFont,
    footerFontWeight,
    footerBorder,
    footerBorderStyle,
    footerBorderSpace,
    footerBorderWidth,
    footerBorderColor,
    footerLogoEnabled,
    footerLogoImageUrl,
    footerLogoImageLink,
    footerLogoHeight,
    footerLogoAlign,
    footerLogoPosition,
    footerLogoPositionTop,
    footerLogoPositionRight,
    footerLogoPositionBottom,
    footerLogoPositionLeft,
    layoutPaddingLeft,
    layoutPaddingRight,
  } = useChartStore( useShallow( ( state ) => ( {
    footerSourceName: state.footerSourceName,
    footerSourceUrl: state.footerSourceUrl,
    footerSourceLabel: state.footerSourceLabel,
    footerNote: state.footerNote,
    footerNoteSecondary: state.footerNoteSecondary,
    footerAlignment: state.footerAlignment,
    footerStylesEnabled: state.footerStylesEnabled,
    footerFont: state.footerFont,
    footerFontWeight: state.footerFontWeight,
    footerBorder: state.footerBorder,
    footerBorderStyle: state.footerBorderStyle,
    footerBorderSpace: state.footerBorderSpace,
    footerBorderWidth: state.footerBorderWidth,
    footerBorderColor: state.footerBorderColor,
    footerLogoEnabled: state.footerLogoEnabled,
    footerLogoImageUrl: state.footerLogoImageUrl,
    footerLogoImageLink: state.footerLogoImageLink,
    footerLogoHeight: state.footerLogoHeight,
    footerLogoAlign: state.footerLogoAlign,
    footerLogoPosition: state.footerLogoPosition,
    footerLogoPositionTop: state.footerLogoPositionTop,
    footerLogoPositionRight: state.footerLogoPositionRight,
    footerLogoPositionBottom: state.footerLogoPositionBottom,
    footerLogoPositionLeft: state.footerLogoPositionLeft,
    layoutPaddingLeft: state.layoutPaddingLeft,
    layoutPaddingRight: state.layoutPaddingRight,
  } ) ) );

  // If all content is empty, don't render anything
  const hasContent =
    footerSourceName ||
    footerSourceUrl ||
    footerNote ||
    footerNoteSecondary ||
    footerLogoEnabled;

  if ( !hasContent ) return null;

  // Calculate border styles
  const getBorderStyles = (): React.CSSProperties => {
    if ( footerBorder === 'none' ) return {};

    const borderStyle = `${ footerBorderWidth }px ${ footerBorderStyle } ${ footerBorderColor }`;
    const result: React.CSSProperties = {};

    if ( footerBorder === 'top' || footerBorder === 'top-bottom' ) {
      result.borderTop = borderStyle;
      result.paddingTop = `${ footerBorderSpace }px`;
    }
    if ( footerBorder === 'bottom' || footerBorder === 'top-bottom' ) {
      result.borderBottom = borderStyle;
      result.paddingBottom = `${ footerBorderSpace }px`;
    }

    return result;
  };

  // Calculate alignment class
  const getAlignmentClass = () => {
    switch ( footerAlignment ) {
      case 'center':
        return 'items-center text-center';
      case 'right':
        return 'items-end text-right';
      default:
        return 'items-start text-left';
    }
  };

  // Calculate font weight class
  const getFontWeightClass = () => {
    if ( !footerStylesEnabled ) return '';
    switch ( footerFontWeight ) {
      case 'bold':
        return 'font-bold';
      default:
        return 'font-normal';
    }
  };

  // Build custom styles
  const customStyles: React.CSSProperties = footerStylesEnabled
    ? {
      fontFamily: footerFont !== 'Same as parent' ? footerFont : undefined,
    }
    : {};

  // Calculate logo position styles for grid
  const getLogoPositionStyles = (): React.CSSProperties => {
    return {
      marginTop: `${ footerLogoPositionTop }px`,
      marginBottom: `${ footerLogoPositionBottom }px`,
      marginLeft: `${ footerLogoPositionLeft }px`,
      marginRight: `${ footerLogoPositionRight }px`,
    };
  };

  // Render logo/image
  const renderLogo = () => {
    if ( !footerLogoEnabled || !footerLogoImageUrl ) return null;

    const logoElement = (
      <img
        src={ footerLogoImageUrl }
        alt='Footer Logo'
        style={ {
          height: `${ footerLogoHeight }px`,
          display: 'block',
        } }
      />
    );

    return (
      <div style={ getLogoPositionStyles() }>
        { footerLogoImageLink ? (
          <a
            href={ footerLogoImageLink }
            target='_blank'
            rel='noopener noreferrer'
          >
            { logoElement }
          </a>
        ) : (
          logoElement
        ) }
      </div>
    );
  };

  // Render source citation
  const renderSource = () => {
    if ( !footerSourceName && !footerSourceUrl ) return null;

    const label = footerSourceLabel || 'Source';
    const sourceName = footerSourceName || '';

    return (
      <div
        className={ cn(
          'text-xs text-zinc-500 mb-1',
          getFontWeightClass()
        ) }
        style={ customStyles }
      >
        { label }:{ ' ' }
        { footerSourceUrl ? (
          <a
            href={ footerSourceUrl }
            target='_blank'
            rel='noopener noreferrer'
            className='underline hover:text-zinc-700'
          >
            { sourceName }
          </a>
        ) : (
          sourceName
        ) }
      </div>
    );
  };

  // Render notes
  const renderNotes = () => {
    if ( !footerNote && !footerNoteSecondary ) return null;

    return (
      <div className='space-y-1'>
        { footerNote && (
          <div
            className={ cn(
              'text-xs text-zinc-500 whitespace-pre-wrap',
              getFontWeightClass()
            ) }
            style={ customStyles }
          >
            { footerNote }
          </div>
        ) }
        { footerNoteSecondary && (
          <div
            className={ cn(
              'text-xs text-zinc-400 whitespace-pre-wrap',
              getFontWeightClass()
            ) }
            style={ customStyles }
          >
            { footerNoteSecondary }
          </div>
        ) }
      </div>
    );
  };

  // Calculate grid template based on logo position
  const getGridTemplate = () => {
    if ( !footerLogoEnabled || !footerLogoImageUrl ) {
      return {
        display: 'flex',
        flexDirection: 'column' as const,
      };
    }

    if ( footerLogoPosition === 'left' ) {
      return {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '16px',
        alignItems: 'center',
      };
    } else if ( footerLogoPosition === 'right' ) {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
      };
    } else {
      // bottom position
      return {
        display: 'flex',
        flexDirection: 'column' as const,
      };
    }
  };

  return (
    <div
      className={ cn( 'flex flex-col', getAlignmentClass() ) }
      style={ {
        ...getBorderStyles(),
        // paddingLeft:
        //   footerLogoAlign === 'footer' ? `${ layoutPaddingLeft }px` : 0,
        // paddingRight:
        //   footerLogoAlign === 'footer' ? `${ layoutPaddingRight }px` : 0,
        paddingTop: '16px',
      } }
    >
      <div style={ getGridTemplate() }>
        {/* Logo on left */ }
        { footerLogoPosition === 'left' && renderLogo() }

        {/* Text Content */ }
        <div className='flex flex-col'>
          { renderSource() }
          { renderNotes() }
        </div>

        {/* Logo on right */ }
        { footerLogoPosition === 'right' && renderLogo() }
      </div>

      {/* Logo at bottom position */ }
      { footerLogoPosition === 'bottom' && renderLogo() }
    </div>
  );
}
