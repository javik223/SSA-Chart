'use client';

import { ChartTitle } from '@/components/chart-title';
import { ChartSubtitle } from '@/components/chart-subtitle';
import { ChartHeaderText } from '@/components/chart-header-text';
import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

/**
 * Chart title section component that groups title, subtitle, and header text together
 * with support for alignment, borders, and logo/image
 */
export function ChartTitleSection() {
  const chartTitle = useChartStore((state) => state.chartTitle);
  const chartSubtitle = useChartStore((state) => state.chartSubtitle);
  const headerText = useChartStore((state) => state.headerText);

  // Header settings
  const headerAlignment = useChartStore((state) => state.headerAlignment);
  const headerBorder = useChartStore((state) => state.headerBorder);
  const headerBorderStyle = useChartStore((state) => state.headerBorderStyle);
  const headerBorderSpace = useChartStore((state) => state.headerBorderSpace);
  const headerBorderWidth = useChartStore((state) => state.headerBorderWidth);
  const headerBorderColor = useChartStore((state) => state.headerBorderColor);

  // Logo settings
  const headerLogoEnabled = useChartStore((state) => state.headerLogoEnabled);
  const headerLogoImageUrl = useChartStore((state) => state.headerLogoImageUrl);
  const headerLogoImageLink = useChartStore(
    (state) => state.headerLogoImageLink
  );
  const headerLogoHeight = useChartStore((state) => state.headerLogoHeight);
  const headerLogoAlign = useChartStore((state) => state.headerLogoAlign);
  const headerLogoPosition = useChartStore((state) => state.headerLogoPosition);
  const headerLogoPositionTop = useChartStore(
    (state) => state.headerLogoPositionTop
  );
  const headerLogoPositionRight = useChartStore(
    (state) => state.headerLogoPositionRight
  );
  const headerLogoPositionBottom = useChartStore(
    (state) => state.headerLogoPositionBottom
  );
  const headerLogoPositionLeft = useChartStore(
    (state) => state.headerLogoPositionLeft
  );

  // Layout padding
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);

  // If all content is empty, don't render anything
  if (!chartTitle && !chartSubtitle && !headerText && !headerLogoEnabled)
    return null;

  // Calculate border styles
  const getBorderStyles = (): React.CSSProperties => {
    if (headerBorder === 'none') return {};

    const borderStyle = `${headerBorderWidth}px ${headerBorderStyle} ${headerBorderColor}`;
    const result: React.CSSProperties = {};

    if (headerBorder === 'top' || headerBorder === 'top-bottom') {
      result.borderTop = borderStyle;
      result.paddingTop = `${headerBorderSpace}px`;
    }
    if (headerBorder === 'bottom' || headerBorder === 'top-bottom') {
      result.borderBottom = borderStyle;
      result.paddingBottom = `${headerBorderSpace}px`;
    }

    return result;
  };

  // Calculate alignment class
  const getAlignmentClass = () => {
    switch (headerAlignment) {
      case 'center':
        return 'items-center text-center';
      case 'right':
        return 'items-end text-right';
      default:
        return 'items-start text-left';
    }
  };

  // Calculate logo position styles
  const getLogoPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      marginTop: `${headerLogoPositionTop}px`,
      marginBottom: `${headerLogoPositionBottom}px`,
    };

    if (headerLogoPosition === 'top') {
      return {
        ...baseStyles,
        marginLeft: `${headerLogoPositionLeft}px`,
        marginRight: `${headerLogoPositionRight}px`,
      };
    } else if (headerLogoPosition === 'left') {
      return {
        ...baseStyles,
        position: 'absolute',
        left: `${headerLogoPositionLeft}px`,
      };
    } else if (headerLogoPosition === 'right') {
      return {
        ...baseStyles,
        position: 'absolute',
        right: `${headerLogoPositionRight}px`,
      };
    }

    return baseStyles;
  };

  // Render logo/image
  const renderLogo = () => {
    if (!headerLogoEnabled || !headerLogoImageUrl) return null;

    const logoElement = (
      <img
        src={headerLogoImageUrl}
        alt='Header Logo'
        style={{
          height: `${headerLogoHeight}px`,
          display: 'block',
        }}
      />
    );

    const logoWrapper = (
      <div style={getLogoPositionStyles()}>
        {headerLogoImageLink ? (
          <a
            href={headerLogoImageLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            {logoElement}
          </a>
        ) : (
          logoElement
        )}
      </div>
    );

    return logoWrapper;
  };

  return (
    <div
      className={cn('relative flex flex-col', getAlignmentClass())}
      style={{
        ...getBorderStyles(),
        paddingLeft:
          headerLogoAlign === 'header' ? `${layoutPaddingLeft}px` : 0,
        paddingRight:
          headerLogoAlign === 'header' ? `${layoutPaddingRight}px` : 0,
      }}
    >
      {/* Logo at top position */}
      {headerLogoPosition === 'top' && renderLogo()}

      {/* Logo at left/right position (absolute) */}
      {(headerLogoPosition === 'left' || headerLogoPosition === 'right') &&
        renderLogo()}

      {/* Text Content */}
      <div className='flex flex-col w-full'>
        <ChartTitle />
        <ChartSubtitle />
        <ChartHeaderText />
      </div>
    </div>
  );
}
