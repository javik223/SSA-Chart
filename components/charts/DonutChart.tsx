'use client';

import { PieChart } from './PieChart';

interface DonutChartProps {
  data: Array<Record<string, string | number>>;
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  colors?: string[];
  colorMode?: 'by-column' | 'by-row';
  legendShow?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendAlignment?: 'start' | 'center' | 'end';
  legendFontSize?: number;
  legendShowValues?: boolean;
  legendGap?: number;
  legendPaddingTop?: number;
  legendPaddingRight?: number;
  legendPaddingBottom?: number;
  legendPaddingLeft?: number;
  onSliceClick?: ( index: number, label: string, value: number ) => void;
  onSliceHover?: ( index: number | null, label: string | null, value: number | null ) => void;
  forceRenderer?: 'svg' | 'canvas';
}

/**
 * DonutChart - A PieChart with a hollow center
 *
 * This is a convenience wrapper around PieChart with a preset innerRadius of 0.6.
 * The center displays the total value.
 */
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';

export function DonutChart( props: DonutChartProps ) {
  const {
    donutInnerRadius,
    donutPadAngle,
    donutCornerRadius,
    donutStartAngle,
    donutEndAngle,
    donutShowTotal,
    donutCenterLabel,
  } = useChartStore( useShallow( ( state ) => ( {
    donutInnerRadius: state.donutInnerRadius,
    donutPadAngle: state.donutPadAngle,
    donutCornerRadius: state.donutCornerRadius,
    donutStartAngle: state.donutStartAngle,
    donutEndAngle: state.donutEndAngle,
    donutShowTotal: state.donutShowTotal,
    donutCenterLabel: state.donutCenterLabel,
  } ) ) );

  return (
    <PieChart
      { ...props }
      innerRadius={ donutInnerRadius }
      padAngle={ donutPadAngle }
      cornerRadius={ donutCornerRadius }
      startAngle={ donutStartAngle }
      endAngle={ donutEndAngle }
      showTotal={ donutShowTotal }
      centerLabel={ donutCenterLabel }
    />
  );
}
