'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { BasicChart } from '@/components/charts/BasicChart';
import { ChartSettings } from '@/components/chart-settings';
import { ChartTitleSection } from '@/components/chart-title-section';
import { ChartLegend } from '@/components/chart-legend';
import { ChartFooterSection } from '@/components/chart-footer-section';
import { useChartStore } from '@/store/useChartStore';
import { useMemo } from 'react';

export function ChartPreview( { isVisible = true }: { isVisible?: boolean; } ) {
  const legendPosition = useChartStore( ( state ) => state.legendPosition );
  const data = useChartStore( ( state ) => state.data );
  const columnMapping = useChartStore( ( state ) => state.columnMapping );

  // Layout Settings
  const layoutMainFont = useChartStore( ( state ) => state.layoutMainFont );
  const layoutTextColor = useChartStore( ( state ) => state.layoutTextColor );
  const layoutBackgroundColorEnabled = useChartStore(
    ( state ) => state.layoutBackgroundColorEnabled
  );
  const layoutBackgroundColor = useChartStore(
    ( state ) => state.layoutBackgroundColor
  );
  const layoutBackgroundImageEnabled = useChartStore(
    ( state ) => state.layoutBackgroundImageEnabled
  );
  const layoutBackgroundImageUrl = useChartStore(
    ( state ) => state.layoutBackgroundImageUrl
  );
  const layoutBackgroundImageSize = useChartStore(
    ( state ) => state.layoutBackgroundImageSize
  );
  const layoutBackgroundImagePosition = useChartStore(
    ( state ) => state.layoutBackgroundImagePosition
  );

  // Margins
  const layoutMarginTop = useChartStore( ( state ) => state.layoutMarginTop );
  const layoutMarginRight = useChartStore( ( state ) => state.layoutMarginRight );
  const layoutMarginBottom = useChartStore( ( state ) => state.layoutMarginBottom );
  const layoutMarginLeft = useChartStore( ( state ) => state.layoutMarginLeft );

  // Padding
  const layoutPaddingTop = useChartStore( ( state ) => state.layoutPaddingTop );
  const layoutPaddingRight = useChartStore( ( state ) => state.layoutPaddingRight );
  const layoutPaddingBottom = useChartStore(
    ( state ) => state.layoutPaddingBottom
  );
  const layoutPaddingLeft = useChartStore( ( state ) => state.layoutPaddingLeft );

  // Border
  const layoutBorderTop = useChartStore( ( state ) => state.layoutBorderTop );
  const layoutBorderRight = useChartStore( ( state ) => state.layoutBorderRight );
  const layoutBorderBottom = useChartStore( ( state ) => state.layoutBorderBottom );
  const layoutBorderLeft = useChartStore( ( state ) => state.layoutBorderLeft );
  const layoutBorderStyle = useChartStore( ( state ) => state.layoutBorderStyle );
  const layoutBorderColor = useChartStore( ( state ) => state.layoutBorderColor );
  const layoutBorderWidth = useChartStore( ( state ) => state.layoutBorderWidth );
  const layoutBorderRadius = useChartStore( ( state ) => state.layoutBorderRadius );

  // Layout Order & Spacing
  const layoutOrder = useChartStore( ( state ) => state.layoutOrder );
  const layoutSpaceBetweenSections = useChartStore(
    ( state ) => state.layoutSpaceBetweenSections
  );

  // Calculate valueKeys for legend
  const valueKeys = useMemo( () => {
    if ( !data || data.length === 0 ) return [];
    const headers = data[ 0 ];
    return columnMapping.values.map( ( idx ) =>
      String( headers[ idx ] || `value${ idx }` )
    );
  }, [ data, columnMapping ] );

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
      header: <ChartTitleSection key="header" />,
      controls: null, // Placeholder for controls
      legend: (
        <div key="legend" className="w-full">
          { legendPosition === 'top' && <ChartLegend valueKeys={ valueKeys } /> }
          { legendPosition === 'bottom' && <ChartLegend valueKeys={ valueKeys } /> }
        </div>
      ),
      graphic: (
        <div key="graphic" className='flex flex-1 min-h-0 w-full'>
          { legendPosition === 'left' && (
            <ChartLegend valueKeys={ valueKeys } />
          ) }

          <div className='flex-1 w-full h-full flex items-center justify-center relative'>
            <BasicChart isVisible={ isVisible } />
          </div>

          { legendPosition === 'right' && (
            <ChartLegend valueKeys={ valueKeys } />
          ) }
        </div>
      ),
      footer: <ChartFooterSection key="footer" />,
    };

    // Special case for Grid Mode
    if ( layoutOrder === 'grid-mode-primary-graphic-right' ) {
      return (
        <div className={ `flex flex-row w-full h-full ${ getSpacingClass() }` }>
          <div className={ `flex flex-col flex-1 ${ getSpacingClass() }` }>
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
      <div className={ `flex flex-col w-full h-full ${ getSpacingClass() }` }>
        { currentOrder.map( key => components[ key as keyof typeof components ] ) }
      </div>
    );
  };

  return (
    <div className='flex h-full flex-col bg-zinc-100'>
      <ResizablePanelGroup direction='horizontal'>
        {/* Chart Display Area */ }
        <ResizablePanel defaultSize={ 75 } minSize={ 50 }>
          <div className='w-full h-full overflow-auto flex items-center justify-center p-8'>
            <div
              data-chart-container
              className='flex flex-col shadow-sm transition-all duration-200'
              style={ {
                ...containerStyle,
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
              } }
            >
              { renderContent() }
            </div>
          </div>
        </ResizablePanel>

        {/* Resize Handle */ }
        <ResizableHandle withHandle />

        {/* Settings Panel */ }
        <ResizablePanel defaultSize={ 25 } minSize={ 20 } maxSize={ 40 }>
          <ChartSettings />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
