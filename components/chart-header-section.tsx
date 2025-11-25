'use client';

import { useChartStore } from '@/store/useChartStore';
import { cn } from '@/lib/utils';

/**
 * Chart header section component that groups title, subtitle, and logo together
 * with support for alignment, borders, and advanced styles
 */
export function ChartHeaderSection() {
  // Header content
  const chartTitle = useChartStore((state) => state.chartTitle);
  const chartSubtitle = useChartStore((state) => state.chartSubtitle);
  const headerText = useChartStore((state) => state.headerText);

  // Header settings
  const headerAlignment = useChartStore((state) => state.headerAlignment);
  
  // Border settings
  const headerBorder = useChartStore((state) => state.headerBorder);
  const headerBorderStyle = useChartStore((state) => state.headerBorderStyle);
  const headerBorderSpace = useChartStore((state) => state.headerBorderSpace);
  const headerBorderWidth = useChartStore((state) => state.headerBorderWidth);
  const headerBorderColor = useChartStore((state) => state.headerBorderColor);

  // Logo settings
  const headerLogoEnabled = useChartStore((state) => state.headerLogoEnabled);
  const headerLogoImageUrl = useChartStore(
    (state) => state.headerLogoImageUrl
  );
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
  const hasContent =
    chartTitle ||
    chartSubtitle ||
    headerText ||
    headerLogoEnabled;

  if (!hasContent) return null;

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

  // Calculate logo position styles for grid
  const getLogoPositionStyles = (): React.CSSProperties => {
    return {
      marginTop: `${headerLogoPositionTop}px`,
      marginBottom: `${headerLogoPositionBottom}px`,
      marginLeft: `${headerLogoPositionLeft}px`,
      marginRight: `${headerLogoPositionRight}px`,
    };
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

    return (
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
  };

  // Render text content (title, subtitle, etc.)
  const renderTextContent = () => {
    return (
      <div className='flex flex-col'>
        {chartTitle && <h2 className='text-2xl font-bold'>{chartTitle}</h2>}
        {chartSubtitle && <h3 className='text-lg text-zinc-500'>{chartSubtitle}</h3>}
        {headerText && <p className='text-sm text-zinc-600 mt-2'>{headerText}</p>}
      </div>
    );
  };

  // Calculate grid template based on logo position
  const getGridTemplate = () => {
    if (!headerLogoEnabled || !headerLogoImageUrl) {
      return {
        display: 'flex',
        flexDirection: 'column' as const,
      };
    }

    if (headerLogoPosition === 'left') {
      return {
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: '16px',
        alignItems: 'center',
      };
    } else if (headerLogoPosition === 'right') {
      return {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
      };
    } else {
      // top position
      return {
        display: 'flex',
        flexDirection: 'column' as const,
      };
    }
  };

  return (
    <div
      className={cn('flex flex-col', getAlignmentClass())}
      style={{
        ...getBorderStyles(),
        paddingBottom: '16px',
      }}
    >
       {headerLogoPosition === 'top' && renderLogo()}
      <div style={getGridTemplate()}>
        {/* Logo on left */}
        {headerLogoPosition === 'left' && renderLogo()}

        {/* Text Content */}
        {renderTextContent()}

        {/* Logo on right */}
        {headerLogoPosition === 'right' && renderLogo()}
      </div>
    </div>
  );
}
