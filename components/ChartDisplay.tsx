'use client';

import { useMemo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { BasicChart } from '@/components/charts/BasicChart';
import { GridChart } from '@/components/charts/GridChart';
import { ChartHeaderSection } from '@/components/chart-header-section';
import { ChartLegend } from '@/components/chart-legend';
import { ChartFooterSection } from '@/components/chart-footer-section';
import { ChartControls } from '@/components/chart-controls';

export function ChartDisplay( { isVisible = true, minimal = false }: { isVisible?: boolean; minimal?: boolean; } ) {
  const {
    legendPosition,
    gridMode,
    data,
    columnMapping,
    previewDevice,
    layoutMainFont,
    layoutTextColor,
    layoutBackgroundColorEnabled,
    layoutBackgroundColor,
    layoutBackgroundImageEnabled,
    layoutBackgroundImageUrl,
    layoutBackgroundImageSize,
    layoutBackgroundImagePosition,
    layoutMarginTop,
    layoutMarginRight,
    layoutMarginBottom,
    layoutMarginLeft,
    layoutPaddingTop,
    layoutPaddingRight,
    layoutPaddingBottom,
    layoutPaddingLeft,
    layoutBorderTop,
    layoutBorderRight,
    layoutBorderBottom,
    layoutBorderLeft,
    layoutBorderStyle,
    layoutBorderColor,
    layoutBorderWidth,
    layoutBorderRadius,
    layoutOrder,
    layoutSpaceBetweenSections,
  } = useChartStore( useShallow( ( state ) => ( {
    legendPosition: state.legendPosition,
    gridMode: state.gridMode,
    data: state.data,
    columnMapping: state.columnMapping,
    previewDevice: state.previewDevice,
    layoutMainFont: state.layoutMainFont,
    layoutTextColor: state.layoutTextColor,
    layoutBackgroundColorEnabled: state.layoutBackgroundColorEnabled,
    layoutBackgroundColor: state.layoutBackgroundColor,
    layoutBackgroundImageEnabled: state.layoutBackgroundImageEnabled,
    layoutBackgroundImageUrl: state.layoutBackgroundImageUrl,
    layoutBackgroundImageSize: state.layoutBackgroundImageSize,
    layoutBackgroundImagePosition: state.layoutBackgroundImagePosition,
    layoutMarginTop: state.layoutMarginTop,
    layoutMarginRight: state.layoutMarginRight,
    layoutMarginBottom: state.layoutMarginBottom,
    layoutMarginLeft: state.layoutMarginLeft,
    layoutPaddingTop: state.layoutPaddingTop,
    layoutPaddingRight: state.layoutPaddingRight,
    layoutPaddingBottom: state.layoutPaddingBottom,
    layoutPaddingLeft: state.layoutPaddingLeft,
    layoutBorderTop: state.layoutBorderTop,
    layoutBorderRight: state.layoutBorderRight,
    layoutBorderBottom: state.layoutBorderBottom,
    layoutBorderLeft: state.layoutBorderLeft,
    layoutBorderStyle: state.layoutBorderStyle,
    layoutBorderColor: state.layoutBorderColor,
    layoutBorderWidth: state.layoutBorderWidth,
    layoutBorderRadius: state.layoutBorderRadius,
    layoutOrder: state.layoutOrder,
    layoutSpaceBetweenSections: state.layoutSpaceBetweenSections,
  } ) ) );

  // Calculate valueKeys for legend
  const valueKeys = useMemo( () => {
    if ( !data || data.length === 0 ) return [];
    const headers = data[ 0 ];
    return columnMapping.values.map( ( idx ) =>
      String( headers[ idx ] || `value${ idx }` )
    );
  }, [ data, columnMapping ] );

  // Calculate device width
  const getDeviceWidth = () => {
    switch ( previewDevice ) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      case 'desktop':
        return '1920px';
      case 'viewport':
      default:
        return '100%';
    }
  };

  // Calculate container styles
  const containerStyle: React.CSSProperties = {
    // Typography
    fontFamily: layoutMainFont,
    color: layoutTextColor,

    // Background
    backgroundColor: layoutBackgroundColorEnabled
      ? layoutBackgroundColor
      : 'white',
    backgroundImage:
      layoutBackgroundImageEnabled && layoutBackgroundImageUrl
        ? `url(${ layoutBackgroundImageUrl })`
        : undefined,
    backgroundSize:
      layoutBackgroundImageEnabled && layoutBackgroundImageUrl
        ? layoutBackgroundImageSize === 'fill'
          ? 'cover'
          : layoutBackgroundImageSize === 'fit'
            ? 'contain'
            : layoutBackgroundImageSize === 'stretch'
              ? '100% 100%'
              : 'auto'
        : undefined,
    backgroundPosition:
      layoutBackgroundImageEnabled && layoutBackgroundImageUrl
        ? layoutBackgroundImagePosition
        : undefined,
    backgroundRepeat: 'no-repeat',

    // Margins
    marginTop: `${ layoutMarginTop }px`,
    marginRight: `${ layoutMarginRight }px`,
    marginBottom: `${ layoutMarginBottom }px`,
    marginLeft: `${ layoutMarginLeft }px`,

    // Padding
    paddingTop: `${ layoutPaddingTop }px`,
    paddingRight: `${ layoutPaddingRight }px`,
    paddingBottom: `${ layoutPaddingBottom }px`,
    paddingLeft: `${ layoutPaddingLeft }px`,

    // Border
    borderTop: layoutBorderTop
      ? `${ layoutBorderWidth }px ${ layoutBorderStyle } ${ layoutBorderColor }`
      : undefined,
    borderRight: layoutBorderRight
      ? `${ layoutBorderWidth }px ${ layoutBorderStyle } ${ layoutBorderColor }`
      : undefined,
    borderBottom: layoutBorderBottom
      ? `${ layoutBorderWidth }px ${ layoutBorderStyle } ${ layoutBorderColor }`
      : undefined,
    borderLeft: layoutBorderLeft
      ? `${ layoutBorderWidth }px ${ layoutBorderStyle } ${ layoutBorderColor }`
      : undefined,
    borderRadius: `${ layoutBorderRadius }px`,
  };

  const getSpacingClass = () => {
    switch ( layoutSpaceBetweenSections ) {
      case 'tight':
        return 'gap-2';
      case 'loose':
        return 'gap-6';
      case 'large':
        return 'gap-10';
      default:
        return 'gap-0';
    }
  };

  const renderContent = () => {
    // Components map
    const components = {
      header: !minimal ? <ChartHeaderSection key="header" /> : null,
      controls: !minimal ? <ChartControls key="controls" /> : null,
      legend: !minimal ? (
        <div key="legend" className="w-full">
          { legendPosition === 'top' && <ChartLegend valueKeys={ valueKeys } /> }
          { legendPosition === 'bottom' && <ChartLegend valueKeys={ valueKeys } /> }
        </div>
      ) : null,
      graphic: (
        <div key="graphic" className='chart-preview-graphic-wrapper'>
          { !minimal && legendPosition === 'left' && gridMode === 'single' && (
            <ChartLegend valueKeys={ valueKeys } />
          ) }

          <div className='chart-preview-graphic'>
            { gridMode === 'grid' ? (
              <GridChart isVisible={ isVisible } />
            ) : (
              <BasicChart isVisible={ isVisible } />
            ) }
          </div>

          { !minimal && legendPosition === 'right' && gridMode === 'single' && (
            <ChartLegend valueKeys={ valueKeys } />
          ) }
        </div>
      ),
      footer: !minimal ? <ChartFooterSection key="footer" /> : null,
    };

    // Special case for Grid Mode
    if ( layoutOrder === 'grid-mode-primary-graphic-right' ) {
      return (
        <div className={ `chart-preview-content-row ${ getSpacingClass() }` }>
          <div className={ `chart-preview-content-col ${ getSpacingClass() }` }>
            { components.header }
            { components.controls }
            { components.legend }
            { components.footer }
          </div>
          <div className="flex-1 h-full">
            { components.graphic }
          </div>
        </div>
      );
    }

    // Standard stacking orders
    const orderMap: Record<string, string[]> = {
      'header-controls-legend-primary-graphic-footer': [ 'header', 'controls', 'legend', 'graphic', 'footer' ],
      'primary-graphic-header-controls-footer': [ 'graphic', 'header', 'controls', 'footer' ],
      'header-primary-graphic-controls-legend-footer': [ 'header', 'graphic', 'controls', 'legend', 'footer' ],
      'controls-primary-graphic-header-legend-footer': [ 'controls', 'graphic', 'header', 'legend', 'footer' ],
      'header-controls-primary-graphic-legend-footer': [ 'header', 'controls', 'graphic', 'legend', 'footer' ],
      'header-legend-primary-graphic-controls-footer': [ 'header', 'legend', 'graphic', 'controls', 'footer' ],
    };

    const currentOrder = orderMap[ layoutOrder ] || orderMap[ 'header-controls-legend-primary-graphic-footer' ];

    return (
      <div className={ `chart-preview-content-col ${ getSpacingClass() }` }>
        { currentOrder.map( key => components[ key as keyof typeof components ] ) }
      </div>
    );
  };

  return (
    <div className='chart-preview-area'>
      <div
        data-chart-container
        className='chart-preview-card max-md:overflow-auto'
        style={ {
          ...containerStyle,
          width: getDeviceWidth(),
          maxWidth: previewDevice === 'viewport' ? '100%' : getDeviceWidth(),
        } }
      >
        { renderContent() }
      </div>
    </div>
  );
}
