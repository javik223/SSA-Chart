export interface BaseChartProps {
  width?: number;
  height?: number;
  colors?: string[];
  
  // Legend
  legendShow?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendAlignment?: 'start' | 'center' | 'end';
  legendFontSize?: number;
  legendGap?: number;
  legendPaddingTop?: number;
  legendPaddingRight?: number;
  legendPaddingBottom?: number;
  legendPaddingLeft?: number;

  // X Axis
  xAxisShow?: boolean;
  xAxisTitle?: string;
  xAxisShowGrid?: boolean;
  xAxisShowDomain?: boolean;
  xAxisTickCount?: number | null;
  xAxisTickSize?: number;
  xAxisTickPadding?: number;
  xAxisLabelRotation?: number;
  xAxisTickFormat?: string;
  xAxisPosition?: 'bottom' | 'top' | 'hidden';
  xAxisTitleWeight?: 'bold' | 'regular';
  xAxisTitleColor?: string;
  xAxisTitleSize?: number;
  xAxisTitlePadding?: number;
  xAxisTickPosition?: 'outside' | 'inside' | 'cross';
  xAxisLabelWeight?: 'bold' | 'regular';
  xAxisLabelColor?: string;
  xAxisLabelSize?: number;
  xAxisLabelSpacing?: number;
  xAxisGridColor?: string;
  xAxisGridWidth?: number;
  xAxisGridOpacity?: number;
  xAxisGridDashArray?: string;

  // Y Axis
  yAxis?: YAxisConfig;
}

export interface YAxisConfig {
  // General
  show: boolean;
  position: 'left' | 'right' | 'hidden';
  
  // Scale
  scaleType: 'linear' | 'log';
  min: number | null;
  max: number | null;
  flip: boolean;
  configureDefaultMinMax: boolean;
  roundMin: boolean;
  roundMax: boolean;

  // Title
  title: string;
  titleType: 'auto' | 'custom';
  titlePosition: 'side' | 'top-bottom';
  titleWeight: 'bold' | 'regular';
  titleColor: string;
  titleSize: number;
  titlePadding: number;

  // Ticks & Labels
  tickPosition: 'outside' | 'inside' | 'cross';
  labelSize: number;
  labelWeight: 'bold' | 'regular';
  labelColor: string;
  labelPadding: number;
  labelAngle: number;
  labelMaxLines: number;
  labelLineHeight: number;
  labelSpacing: number;
  
  // Tick Display
  tickMode: 'auto' | 'linear' | 'array';
  tickNumber: number;
  oneTickLabelPerLine: boolean;
  tickCount: number | null;
  tickSize: number;
  tickPadding: number;
  tickFormat: string;
  tickLength: number;

  // Grid & Lines
  showGrid: boolean;
  showDomain: boolean;
  showAxisLine: boolean;
  gridColor: string;
  gridStyle: 'solid' | 'dashed' | 'dotted';
  gridWidth: number;
  gridDash: number;
  gridSpace: number;
  gridExtend: boolean;
  lineColor: string;
  lineWidth: number;
  edgePadding: number;
}

export const DEFAULT_Y_AXIS_CONFIG: YAxisConfig = {
  show: true,
  position: 'left',
  scaleType: 'linear',
  min: null,
  max: null,
  flip: false,
  configureDefaultMinMax: true,
  roundMin: false,
  roundMax: false,
  title: '',
  titleType: 'auto',
  titlePosition: 'side',
  titleWeight: 'regular',
  titleColor: '#666666',
  titleSize: 12,
  titlePadding: 40,
  tickPosition: 'outside',
  labelSize: 12,
  labelWeight: 'regular',
  labelColor: '#666666',
  labelPadding: 8,
  labelAngle: 0,
  labelMaxLines: 1,
  labelLineHeight: 1.2,
  labelSpacing: 4,
  tickMode: 'auto',
  tickNumber: 5,
  oneTickLabelPerLine: false,
  tickCount: 5,
  tickSize: 6,
  tickPadding: 8,
  tickFormat: '',
  tickLength: 6,
  showGrid: true,
  showDomain: true,
  showAxisLine: true,
  gridColor: '#e5e7eb',
  gridStyle: 'solid',
  gridWidth: 1,
  gridDash: 0,
  gridSpace: 0,
  gridExtend: false,
  lineColor: '#666666',
  lineWidth: 1,
  edgePadding: 0,
};
