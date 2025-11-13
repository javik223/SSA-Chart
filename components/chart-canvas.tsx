'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { BasicChart } from '@/components/charts/BasicChart';
import { ChartTitleSection } from '@/components/chart-title-section';
import { ChartFooter } from '@/components/chart-footer';
import { ChartLegend } from '@/components/chart-legend';
import { ChartControls } from '@/components/chart-controls';
import { ResizeHandle } from '@/components/resize-handle';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

export function ChartCanvas() {
  const data = useChartStore((state) => state.data);
  const columnMapping = useChartStore((state) => state.columnMapping);
  const previewWidth = useChartStore((state) => state.previewWidth);
  const previewHeight = useChartStore((state) => state.previewHeight);

  // Typography
  const layoutMainFont = useChartStore((state) => state.layoutMainFont);
  const layoutTextColor = useChartStore((state) => state.layoutTextColor);

  // Background
  const layoutBackgroundColorEnabled = useChartStore(
    (state) => state.layoutBackgroundColorEnabled
  );
  const layoutBackgroundImageEnabled = useChartStore(
    (state) => state.layoutBackgroundImageEnabled
  );
  const layoutBackgroundColor = useChartStore(
    (state) => state.layoutBackgroundColor
  );
  const layoutBackgroundImageUrl = useChartStore(
    (state) => state.layoutBackgroundImageUrl
  );
  const layoutBackgroundImageSize = useChartStore(
    (state) => state.layoutBackgroundImageSize
  );
  const layoutBackgroundImagePosition = useChartStore(
    (state) => state.layoutBackgroundImagePosition
  );

  // Spacing
  const layoutSpaceBetweenSections = useChartStore(
    (state) => state.layoutSpaceBetweenSections
  );
  const layoutMarginTop = useChartStore((state) => state.layoutMarginTop);
  const layoutMarginRight = useChartStore((state) => state.layoutMarginRight);
  const layoutMarginBottom = useChartStore((state) => state.layoutMarginBottom);
  const layoutMarginLeft = useChartStore((state) => state.layoutMarginLeft);
  const layoutPaddingTop = useChartStore((state) => state.layoutPaddingTop);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);
  const layoutPaddingBottom = useChartStore(
    (state) => state.layoutPaddingBottom
  );
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);

  // Borders
  const layoutBorderEnabled = useChartStore(
    (state) => state.layoutBorderEnabled
  );
  const layoutBorderTop = useChartStore((state) => state.layoutBorderTop);
  const layoutBorderRight = useChartStore((state) => state.layoutBorderRight);
  const layoutBorderBottom = useChartStore((state) => state.layoutBorderBottom);
  const layoutBorderLeft = useChartStore((state) => state.layoutBorderLeft);
  const layoutBorderStyle = useChartStore((state) => state.layoutBorderStyle);
  const layoutBorderColor = useChartStore((state) => state.layoutBorderColor);
  const layoutBorderWidth = useChartStore((state) => state.layoutBorderWidth);
  const layoutBorderRadius = useChartStore((state) => state.layoutBorderRadius);

  // Read Direction
  const layoutReadDirection = useChartStore(
    (state) => state.layoutReadDirection
  );

  // Layout Order
  const layoutOrder = useChartStore((state) => state.layoutOrder);

  // Check if we have data and valid column mapping
  const hasData = data && data.length > 1;
  const hasMapping =
    columnMapping.labels !== null && columnMapping.values.length > 0;

  // Get value keys for legend
  const valueKeys =
    hasData && hasMapping && data[0]
      ? columnMapping.values.map((idx) => String(data[0][idx]))
      : [];

  // Helper function to convert background image size to CSS
  const getBackgroundSize = () => {
    switch (layoutBackgroundImageSize) {
      case 'fill':
        return 'cover';
      case 'fit':
        return 'contain';
      case 'original':
        return 'auto';
      case 'stretch':
        return '100% 100%';
      default:
        return 'cover';
    }
  };

  // Helper function to convert background image position to CSS
  const getBackgroundPosition = () => {
    switch (layoutBackgroundImagePosition) {
      case 'top-left':
        return 'top left';
      case 'top-center':
        return 'top center';
      case 'top-right':
        return 'top right';
      case 'center-left':
        return 'center left';
      case 'center':
        return 'center';
      case 'center-right':
        return 'center right';
      case 'bottom-left':
        return 'bottom left';
      case 'bottom-center':
        return 'bottom center';
      case 'bottom-right':
        return 'bottom right';
      default:
        return 'center';
    }
  };

  // Helper function to get spacing value
  const getSectionSpacing = () => {
    switch (layoutSpaceBetweenSections) {
      case 'none':
        return 0;
      case 'tight':
        return 8;
      case 'loose':
        return 16;
      case 'large':
        return 32;
      default:
        return 16;
    }
  };

  // Helper function to create border style string
  const getBorderStyle = (side: 'Top' | 'Right' | 'Bottom' | 'Left') => {
    if (!layoutBorderEnabled) return 'none';

    const sideEnabled = {
      Top: layoutBorderTop,
      Right: layoutBorderRight,
      Bottom: layoutBorderBottom,
      Left: layoutBorderLeft,
    }[side];

    if (!sideEnabled) return 'none';

    return `${layoutBorderWidth}px ${layoutBorderStyle} ${layoutBorderColor}`;
  };

  // Define all available sections
  const sections = {
    header: <ChartTitleSection key='header' />,
    controls: <ChartControls key='controls' />,
    legend: <ChartLegend key='legend' valueKeys={valueKeys} />,
    'primary-graphic': (
      <div
        key='primary-graphic'
        style={{
          aspectRatio: `${previewWidth} / ${previewHeight}`,
          maxHeight: `${previewHeight}px`,
          paddingLeft: `${layoutPaddingLeft}px`,
          paddingRight: `${layoutPaddingRight}px`,
        }}
        className={cn('w-full')}
      >
        <BasicChart />
      </div>
    ),
    footer: <ChartFooter key='footer' />,
  };

  // Check if we're in grid mode
  const isGridMode = layoutOrder === 'grid-mode-primary-graphic-right';

  // Get ordered sections based on layoutOrder setting
  const getOrderedSections = () => {
    // Parse layout order string to get section order
    const orderMap: Record<string, string[]> = {
      'header-controls-legend-primary-graphic-footer': [
        'header',
        'controls',
        'legend',
        'primary-graphic',
        'footer',
      ],
      'primary-graphic-header-controls-footer': [
        'primary-graphic',
        'header',
        'controls',
        'footer',
      ],
      'header-primary-graphic-controls-legend-footer': [
        'header',
        'primary-graphic',
        'controls',
        'legend',
        'footer',
      ],
      'controls-primary-graphic-header-legend-footer': [
        'controls',
        'primary-graphic',
        'header',
        'legend',
        'footer',
      ],
      'header-controls-primary-graphic-legend-footer': [
        'header',
        'controls',
        'primary-graphic',
        'legend',
        'footer',
      ],
      'header-legend-primary-graphic-controls-footer': [
        'header',
        'legend',
        'primary-graphic',
        'controls',
        'footer',
      ],
      'grid-mode-primary-graphic-right': [
        'header',
        'controls',
        'legend',
        'footer',
      ],
    };

    const order =
      orderMap[layoutOrder] ||
      orderMap['header-controls-legend-primary-graphic-footer'];

    return order
      .map((sectionKey) => sections[sectionKey as keyof typeof sections])
      .filter(Boolean);
  };

  // Get left column sections for grid mode (excludes primary-graphic)
  const getLeftColumnSections = () => {
    return ['header', 'controls', 'legend', 'footer']
      .map((sectionKey) => sections[sectionKey as keyof typeof sections])
      .filter(Boolean);
  };

  if (!hasData || !hasMapping) {
    return (
      <div className='flex h-full items-center justify-center bg-slate-50 p-8'>
        <Card className='w-full max-w-4xl shadow-sm'>
          <CardContent className='flex min-h-[400px] flex-col items-center justify-center gap-4 p-12'>
            <BarChart3 className='h-16 w-16 text-zinc-300' />
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-zinc-900'>
                No chart yet
              </h3>
              <p className='mt-2 text-base text-zinc-500'>
                {!hasData
                  ? 'Upload data or switch to the Data tab to get started'
                  : 'Select columns in the Data tab to visualize'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex h-full items-center justify-center bg-slate-50 p-8 overflow-auto'
      )}
    >
      <div
        data-chart-container
        style={{
          width: `${previewWidth}px`,
          fontFamily: layoutMainFont,
          color: layoutTextColor,
          backgroundColor: layoutBackgroundColorEnabled
            ? layoutBackgroundColor
            : 'transparent',
          backgroundImage:
            layoutBackgroundImageEnabled && layoutBackgroundImageUrl
              ? `url(${layoutBackgroundImageUrl})`
              : 'none',
          backgroundSize: layoutBackgroundImageEnabled
            ? getBackgroundSize()
            : 'auto',
          backgroundPosition: layoutBackgroundImageEnabled
            ? getBackgroundPosition()
            : 'center',
          backgroundRepeat: 'no-repeat',
          marginTop: `${layoutMarginTop}px`,
          marginRight: `${layoutMarginRight}px`,
          marginBottom: `${layoutMarginBottom}px`,
          marginLeft: `${layoutMarginLeft}px`,
          paddingTop: `${layoutPaddingTop}px`,
          paddingBottom: `${layoutPaddingBottom}px`,
          borderTop: getBorderStyle('Top'),
          borderRight: getBorderStyle('Right'),
          borderBottom: getBorderStyle('Bottom'),
          borderLeft: getBorderStyle('Left'),
          borderRadius: `${layoutBorderRadius}px`,
          direction: layoutReadDirection,
          gap: `${getSectionSpacing()}px`,
        }}
        className={cn(
          'relative shadow-md max-w-full min-w-75',
          isGridMode ? 'grid grid-cols-1 md:grid-cols-2' : 'flex flex-col'
        )}
      >
        {isGridMode ? (
          <>
            {/* Left column: header, controls, legend, footer */}
            <div
              className='flex flex-col'
              style={{
                gap: `${getSectionSpacing()}px`,
              }}
            >
              {getLeftColumnSections()}
            </div>

            {/* Right column: primary graphic */}
            <div className='flex items-center justify-center'>
              {sections['primary-graphic']}
            </div>
          </>
        ) : (
          /* Normal vertical layout */
          getOrderedSections()
        )}

        <ResizeHandle />
      </div>
    </div>
  );
}
