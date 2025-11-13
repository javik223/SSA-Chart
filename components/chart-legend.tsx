'use client';

import { useChartStore } from '@/store/useChartStore';
import { getColor } from '@/utils/colors';
import { cn } from '@/lib/utils';
import './chart-legend.css';

interface ChartLegendProps {
  valueKeys: string[];
  colorPalette?: 'default' | 'pastel' | 'vivid';
}

export function ChartLegend({
  valueKeys,
  colorPalette = 'default',
}: ChartLegendProps) {
  const legendShow = useChartStore((state) => state.legendShow);
  const legendPosition = useChartStore((state) => state.legendPosition);
  const legendAlignment = useChartStore((state) => state.legendAlignment);
  const legendFontSize = useChartStore((state) => state.legendFontSize);
  const legendBaseFontSizeMobile = useChartStore(
    (state) => state.legendBaseFontSizeMobile
  );
  const legendBaseFontSizeTablet = useChartStore(
    (state) => state.legendBaseFontSizeTablet
  );
  const legendBaseFontSizeDesktop = useChartStore(
    (state) => state.legendBaseFontSizeDesktop
  );
  const legendShowValues = useChartStore((state) => state.legendShowValues);
  const legendGap = useChartStore((state) => state.legendGap);
  const legendPaddingTop = useChartStore((state) => state.legendPaddingTop);
  const legendPaddingRight = useChartStore((state) => state.legendPaddingRight);
  const legendPaddingBottom = useChartStore(
    (state) => state.legendPaddingBottom
  );
  const legendPaddingLeft = useChartStore((state) => state.legendPaddingLeft);

  // General layout padding - applies to all sections
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);

  if (!legendShow || valueKeys.length === 0) return null;

  const isHorizontal = legendPosition === 'top' || legendPosition === 'bottom';

  // Calculate responsive font sizes
  // Final size = base size (px) * multiplier
  const calculatedFontSizeMobile = legendBaseFontSizeMobile * legendFontSize;
  const calculatedFontSizeTablet = legendBaseFontSizeTablet * legendFontSize;
  const calculatedFontSizeDesktop = legendBaseFontSizeDesktop * legendFontSize;

  return (
    <div
      className={cn(
        'chart-legend',
        isHorizontal ? 'chart-legend--horizontal' : 'chart-legend--vertical',
        `chart-legend--align-${legendAlignment}`
      )}
      style={
        {
          '--legend-gap': `${legendGap}px`,
          '--legend-padding-top': `${legendPaddingTop}px`,
          '--legend-padding-right': `${
            layoutPaddingRight + legendPaddingRight
          }px`,
          '--legend-padding-bottom': `${legendPaddingBottom}px`,
          '--legend-padding-left': `${layoutPaddingLeft + legendPaddingLeft}px`,
          '--legend-font-size-mobile': `${calculatedFontSizeMobile}px`,
          '--legend-font-size-tablet': `${calculatedFontSizeTablet}px`,
          '--legend-font-size-desktop': `${calculatedFontSizeDesktop}px`,
          '--legend-item-gap-half': `${legendGap / 2}px`,
        } as React.CSSProperties
      }
    >
      {valueKeys.map((key, index) => (
        <div key={key} className='chart-legend-item'>
          <div
            className='chart-legend-color-box'
            style={
              {
                '--legend-color': getColor(colorPalette, index),
              } as React.CSSProperties
            }
          />
          <span className='whitespace-nowrap'>{key}</span>
          {legendShowValues && (
            <span className='text-zinc-500 font-mono text-xs'>
              {/* Values would be populated from data context */}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
