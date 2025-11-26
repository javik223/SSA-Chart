import { StateCreator } from 'zustand';

export interface AxisSlice {
  // X Axis settings
  xAxisShow: boolean;
  setXAxisShow: (show: boolean) => void;

  xAxisTitle: string;
  setXAxisTitle: (title: string) => void;

  xAxisName: string;
  setXAxisName: (name: string) => void;

  xAxisShowLabel: boolean;
  setXAxisShowLabel: (show: boolean) => void;

  xAxisShowGrid: boolean;
  setXAxisShowGrid: (show: boolean) => void;

  xAxisShowDomain: boolean;
  setXAxisShowDomain: (show: boolean) => void;

  xAxisDomainColor: string;
  setXAxisDomainColor: (color: string) => void;

  xAxisTickCount: number | null;
  setXAxisTickCount: (count: number | null) => void;

  xAxisTickSize: number;
  setXAxisTickSize: (size: number) => void;

  xAxisTickPadding: number;
  setXAxisTickPadding: (padding: number) => void;

  xAxisLabelRotation: number;
  setXAxisLabelRotation: (rotation: number) => void;

  xAxisTickFormat: string;
  setXAxisTickFormat: (format: string) => void;
  
  xAxisPosition: 'bottom' | 'top' | 'hidden';
  setXAxisPosition: (position: 'bottom' | 'top' | 'hidden') => void;
  
  xAxisScaleType: 'linear' | 'log' | 'time' | 'band' | 'point';
  setXAxisScaleType: (type: 'linear' | 'log' | 'time' | 'band' | 'point') => void;
  
  xAxisMin: number | null;
  setXAxisMin: (min: number | null) => void;
  
  xAxisMax: number | null;
  setXAxisMax: (max: number | null) => void;
  
  // X Axis Title Styling
  xAxisTitleType: 'auto' | 'custom';
  setXAxisTitleType: (type: 'auto' | 'custom') => void;
  
  xAxisTitleWeight: 'bold' | 'regular';
  setXAxisTitleWeight: (weight: 'bold' | 'regular') => void;
  
  xAxisTitleColor: string;
  setXAxisTitleColor: (color: string) => void;
  
  xAxisTitleSize: number;
  setXAxisTitleSize: (size: number) => void;
  
  xAxisTitlePadding: number;
  setXAxisTitlePadding: (padding: number) => void;

  xAxisTitleAlignment: 'start' | 'center' | 'end';
  setXAxisTitleAlignment: (alignment: 'start' | 'center' | 'end') => void;

  xAxisTitleArrow: boolean;
  setXAxisTitleArrow: (arrow: boolean) => void;
  
  // X Axis Tick & Label Styling
  xAxisTickPosition: 'outside' | 'inside' | 'cross';
  setXAxisTickPosition: (position: 'outside' | 'inside' | 'cross') => void;
  
  xAxisLabelWeight: 'bold' | 'regular';
  setXAxisLabelWeight: (weight: 'bold' | 'regular') => void;
  
  xAxisLabelColor: string;
  setXAxisLabelColor: (color: string) => void;
  
  xAxisLabelSize: number;
  setXAxisLabelSize: (size: number) => void;
  
  xAxisLabelSpacing: number;
  setXAxisLabelSpacing: (spacing: number) => void;
  
  // X Axis Gridline Styling
  xAxisGridColor: string;
  setXAxisGridColor: (color: string) => void;
  
  xAxisGridWidth: number;
  setXAxisGridWidth: (width: number) => void;
  
  xAxisGridOpacity: number;
  setXAxisGridOpacity: (opacity: number) => void;
  
  xAxisGridDashArray: string;
  setXAxisGridDashArray: (dashArray: string) => void;

  // Y Axis settings
  yAxisShow: boolean;
  setYAxisShow: (show: boolean) => void;

  yAxisTitle: string;
  setYAxisTitle: (title: string) => void;

  yAxisName: string;
  setYAxisName: (name: string) => void;

  yAxisShowLabel: boolean;
  setYAxisShowLabel: (show: boolean) => void;

  yAxisShowGrid: boolean;
  setYAxisShowGrid: (show: boolean) => void;

  yAxisShowDomain: boolean;
  setYAxisShowDomain: (show: boolean) => void;

  yAxisDomainColor: string;
  setYAxisDomainColor: (color: string) => void;

  yAxisTickCount: number | null;
  setYAxisTickCount: (count: number | null) => void;

  yAxisTickSize: number;
  setYAxisTickSize: (size: number) => void;

  yAxisTickPadding: number;
  setYAxisTickPadding: (padding: number) => void;

  yAxisTickFormat: string;
  setYAxisTickFormat: (format: string) => void;

  yAxisMin: number | null;
  setYAxisMin: (min: number | null) => void;

  yAxisMax: number | null;
  setYAxisMax: (max: number | null) => void;

  yAxisPosition: 'left' | 'right' | 'hidden';
  setYAxisPosition: (position: 'left' | 'right' | 'hidden') => void;
  
  // Y Axis Scale
  yAxisScaleType: 'linear' | 'log';
  setYAxisScaleType: (type: 'linear' | 'log') => void;
  
  // Y Axis Flip
  yAxisFlip: boolean;
  setYAxisFlip: (flip: boolean) => void;
  
  // Y Axis Configure Default Min/Max
  yAxisConfigureDefaultMinMax: boolean;
  setYAxisConfigureDefaultMinMax: (configure: boolean) => void;
  
  // Y Axis Round Min/Max
  yAxisRoundMin: boolean;
  setYAxisRoundMin: (round: boolean) => void;
  
  yAxisRoundMax: boolean;
  setYAxisRoundMax: (round: boolean) => void;
  
  // Y Axis Title Styling
  yAxisTitleType: 'auto' | 'custom';
  setYAxisTitleType: (type: 'auto' | 'custom') => void;
  
  yAxisTitlePosition: 'side' | 'top-bottom';
  setYAxisTitlePosition: (position: 'side' | 'top-bottom') => void;
  
  yAxisTitleWeight: 'bold' | 'regular';
  setYAxisTitleWeight: (weight: 'bold' | 'regular') => void;
  
  yAxisTitleColor: string;
  setYAxisTitleColor: (color: string) => void;
  
  yAxisTitleSize: number;
  setYAxisTitleSize: (size: number) => void;
  
  yAxisTitlePadding: number;
  setYAxisTitlePadding: (padding: number) => void;

  yAxisTitleAlignment: 'start' | 'center' | 'end';
  setYAxisTitleAlignment: (alignment: 'start' | 'center' | 'end') => void;

  yAxisTitleArrow: boolean;
  setYAxisTitleArrow: (arrow: boolean) => void;
  
  // Y Axis Tick & Label Styling
  yAxisTickPosition: 'outside' | 'inside' | 'cross';
  setYAxisTickPosition: (position: 'outside' | 'inside' | 'cross') => void;
  
  yAxisLabelSize: number;
  setYAxisLabelSize: (size: number) => void;
  
  yAxisLabelColor: string;
  setYAxisLabelColor: (color: string) => void;
  
  yAxisLabelPadding: number;
  setYAxisLabelPadding: (padding: number) => void;
  
  yAxisLabelAngle: number;
  setYAxisLabelAngle: (angle: number) => void;

  yAxisLabelRotation: number;
  setYAxisLabelRotation: (rotation: number) => void;
  
  yAxisLabelWeight: 'bold' | 'regular';
  setYAxisLabelWeight: (weight: 'bold' | 'regular') => void;
  
  yAxisLabelMaxLines: number;
  setYAxisLabelMaxLines: (maxLines: number) => void;
  
  yAxisLabelLineHeight: number;
  setYAxisLabelLineHeight: (lineHeight: number) => void;
  
  yAxisLabelSpacing: number;
  setYAxisLabelSpacing: (spacing: number) => void;
  
  // Y Axis Tick Display
  yAxisTickMode: 'auto' | 'linear' | 'array';
  setYAxisTickMode: (mode: 'auto' | 'linear' | 'array') => void;
  
  yAxisTickNumber: number;
  setYAxisTickNumber: (number: number) => void;
  
  yAxisOneTickLabelPerLine: boolean;
  setYAxisOneTickLabelPerLine: (oneTick: boolean) => void;
  
  // Y Axis Gridline Styling
  yAxisGridColor: string;
  setYAxisGridColor: (color: string) => void;
  
  yAxisGridStyle: 'solid' | 'dashed' | 'dotted';
  setYAxisGridStyle: (style: 'solid' | 'dashed' | 'dotted') => void;
  
  yAxisGridWidth: number;
  setYAxisGridWidth: (width: number) => void;

  yAxisGridOpacity: number;
  setYAxisGridOpacity: (opacity: number) => void;

  yAxisGridDashArray: string;
  setYAxisGridDashArray: (dashArray: string) => void;
  
  yAxisGridDash: number;
  setYAxisGridDash: (dash: number) => void;
  
  yAxisGridSpace: number;
  setYAxisGridSpace: (space: number) => void;
  
  yAxisGridExtend: boolean;
  setYAxisGridExtend: (extend: boolean) => void;
  
  // Y Axis Line & Tick Marks
  yAxisLineColor: string;
  setYAxisLineColor: (color: string) => void;
  
  yAxisLineWidth: number;
  setYAxisLineWidth: (width: number) => void;
  
  yAxisTickLength: number;
  setYAxisTickLength: (length: number) => void;
  
  yAxisShowAxisLine: boolean;
  setYAxisShowAxisLine: (show: boolean) => void;
  
  yAxisEdgePadding: number;
  setYAxisEdgePadding: (padding: number) => void;
}

export const createAxisSlice: StateCreator<AxisSlice, [], [], AxisSlice> = (set) => ({
  // X Axis settings
  xAxisShow: true,
  setXAxisShow: (show) => set({ xAxisShow: show }),

  xAxisTitle: '',
  setXAxisTitle: (title) => set({ xAxisTitle: title }),

  xAxisName: '',
  setXAxisName: (name) => set({ xAxisName: name }),

  xAxisShowLabel: false,
  setXAxisShowLabel: (show) => set({ xAxisShowLabel: show }),

  xAxisShowGrid: true,
  setXAxisShowGrid: (show) => set({ xAxisShowGrid: show }),

  xAxisShowDomain: true,
  setXAxisShowDomain: (show) => set({ xAxisShowDomain: show }),

  xAxisDomainColor: '#000000',
  setXAxisDomainColor: (color) => set({ xAxisDomainColor: color }),

  xAxisTickCount: 10,
  setXAxisTickCount: (count) => set({ xAxisTickCount: count }),

  xAxisTickSize: 6,
  setXAxisTickSize: (size) => set({ xAxisTickSize: size }),

  xAxisTickPadding: 3,
  setXAxisTickPadding: (padding) => set({ xAxisTickPadding: padding }),

  xAxisLabelRotation: 0,
  setXAxisLabelRotation: (rotation) => set({ xAxisLabelRotation: rotation }),

  xAxisTickFormat: '',
  setXAxisTickFormat: (format) => set({ xAxisTickFormat: format }),
  
  xAxisPosition: 'bottom',
  setXAxisPosition: (position) => set({ xAxisPosition: position }),
  
  xAxisScaleType: 'linear',
  setXAxisScaleType: (type) => set({ xAxisScaleType: type }),
  
  xAxisMin: null,
  setXAxisMin: (min) => set({ xAxisMin: min }),
  
  xAxisMax: null,
  setXAxisMax: (max) => set({ xAxisMax: max }),
  
  // X Axis Title Styling
  xAxisTitleType: 'auto',
  setXAxisTitleType: (type) => set({ xAxisTitleType: type }),
  
  xAxisTitleWeight: 'regular',
  setXAxisTitleWeight: (weight) => set({ xAxisTitleWeight: weight }),
  
  xAxisTitleColor: '#000000',
  setXAxisTitleColor: (color) => set({ xAxisTitleColor: color }),
  
  xAxisTitleSize: 12,
  setXAxisTitleSize: (size) => set({ xAxisTitleSize: size }),
  
  xAxisTitlePadding: 35,
  setXAxisTitlePadding: (padding) => set({ xAxisTitlePadding: padding }),

  xAxisTitleAlignment: 'center',
  setXAxisTitleAlignment: (alignment) => set({ xAxisTitleAlignment: alignment }),

  xAxisTitleArrow: false,
  setXAxisTitleArrow: (arrow) => set({ xAxisTitleArrow: arrow }),
  
  // X Axis Tick & Label Styling
  xAxisTickPosition: 'outside',
  setXAxisTickPosition: (position) => set({ xAxisTickPosition: position }),
  
  xAxisLabelWeight: 'regular',
  setXAxisLabelWeight: (weight) => set({ xAxisLabelWeight: weight }),
  
  xAxisLabelColor: '#000000',
  setXAxisLabelColor: (color) => set({ xAxisLabelColor: color }),
  
  xAxisLabelSize: 12,
  setXAxisLabelSize: (size) => set({ xAxisLabelSize: size }),
  
  xAxisLabelSpacing: 3,
  setXAxisLabelSpacing: (spacing) => set({ xAxisLabelSpacing: spacing }),
  
  // X Axis Gridline Styling
  xAxisGridColor: '#e5e7eb',
  setXAxisGridColor: (color) => set({ xAxisGridColor: color }),
  
  xAxisGridWidth: 1,
  setXAxisGridWidth: (width) => set({ xAxisGridWidth: width }),
  
  xAxisGridOpacity: 0.5,
  setXAxisGridOpacity: (opacity) => set({ xAxisGridOpacity: opacity }),
  
  xAxisGridDashArray: '0',
  setXAxisGridDashArray: (dashArray) => set({ xAxisGridDashArray: dashArray }),

  // Y Axis settings
  yAxisShow: true,
  setYAxisShow: (show) => set({ yAxisShow: show }),

  yAxisTitle: '',
  setYAxisTitle: (title) => set({ yAxisTitle: title }),

  yAxisName: '',
  setYAxisName: (name) => set({ yAxisName: name }),

  yAxisShowLabel: false,
  setYAxisShowLabel: (show) => set({ yAxisShowLabel: show }),

  yAxisShowGrid: true,
  setYAxisShowGrid: (show) => set({ yAxisShowGrid: show }),

  yAxisShowDomain: true,
  setYAxisShowDomain: (show) => set({ yAxisShowDomain: show }),

  yAxisDomainColor: '#000000',
  setYAxisDomainColor: (color) => set({ yAxisDomainColor: color }),

  yAxisTickCount: 10,
  setYAxisTickCount: (count) => set({ yAxisTickCount: count }),

  yAxisTickSize: 6,
  setYAxisTickSize: (size) => set({ yAxisTickSize: size }),

  yAxisTickPadding: 3,
  setYAxisTickPadding: (padding) => set({ yAxisTickPadding: padding }),

  yAxisTickFormat: '',
  setYAxisTickFormat: (format) => set({ yAxisTickFormat: format }),

  yAxisMin: null,
  setYAxisMin: (min) => set({ yAxisMin: min }),

  yAxisMax: null,
  setYAxisMax: (max) => set({ yAxisMax: max }),

  yAxisPosition: 'left',
  setYAxisPosition: (position) => set({ yAxisPosition: position }),
  
  // Y Axis Scale
  yAxisScaleType: 'linear',
  setYAxisScaleType: (type) => set({ yAxisScaleType: type }),
  
  // Y Axis Flip
  yAxisFlip: false,
  setYAxisFlip: (flip) => set({ yAxisFlip: flip }),
  
  // Y Axis Configure Default Min/Max
  yAxisConfigureDefaultMinMax: false,
  setYAxisConfigureDefaultMinMax: (configure) => set({ yAxisConfigureDefaultMinMax: configure }),
  
  // Y Axis Round Min/Max
  yAxisRoundMin: false,
  setYAxisRoundMin: (round) => set({ yAxisRoundMin: round }),
  
  yAxisRoundMax: false,
  setYAxisRoundMax: (round) => set({ yAxisRoundMax: round }),
  
  // Y Axis Title Styling
  yAxisTitleType: 'auto',
  setYAxisTitleType: (type) => set({ yAxisTitleType: type }),
  
  yAxisTitlePosition: 'side',
  setYAxisTitlePosition: (position) => set({ yAxisTitlePosition: position }),
  
  yAxisTitleWeight: 'bold',
  setYAxisTitleWeight: (weight) => set({ yAxisTitleWeight: weight }),
  
  yAxisTitleColor: '#000000',
  setYAxisTitleColor: (color) => set({ yAxisTitleColor: color }),
  
  yAxisTitleSize: 14,
  setYAxisTitleSize: (size) => set({ yAxisTitleSize: size }),
  
  yAxisTitlePadding: 40,
  setYAxisTitlePadding: (padding) => set({ yAxisTitlePadding: padding }),

  yAxisTitleAlignment: 'center',
  setYAxisTitleAlignment: (alignment) => set({ yAxisTitleAlignment: alignment }),

  yAxisTitleArrow: false,
  setYAxisTitleArrow: (arrow) => set({ yAxisTitleArrow: arrow }),
  
  // Y Axis Tick & Label Styling
  yAxisTickPosition: 'outside',
  setYAxisTickPosition: (position) => set({ yAxisTickPosition: position }),
  
  yAxisLabelSize: 12,
  setYAxisLabelSize: (size) => set({ yAxisLabelSize: size }),
  
  yAxisLabelColor: '#000000',
  setYAxisLabelColor: (color) => set({ yAxisLabelColor: color }),
  
  yAxisLabelPadding: 5,
  setYAxisLabelPadding: (padding) => set({ yAxisLabelPadding: padding }),
  
  yAxisLabelAngle: 0,
  setYAxisLabelAngle: (angle) => set({ yAxisLabelAngle: angle }),

  yAxisLabelRotation: 0,
  setYAxisLabelRotation: (rotation) => set({ yAxisLabelRotation: rotation }),
  
  yAxisLabelWeight: 'regular',
  setYAxisLabelWeight: (weight) => set({ yAxisLabelWeight: weight }),
  
  yAxisLabelMaxLines: 1,
  setYAxisLabelMaxLines: (maxLines) => set({ yAxisLabelMaxLines: maxLines }),
  
  yAxisLabelLineHeight: 1.2,
  setYAxisLabelLineHeight: (lineHeight) => set({ yAxisLabelLineHeight: lineHeight }),
  
  yAxisLabelSpacing: 3,
  setYAxisLabelSpacing: (spacing) => set({ yAxisLabelSpacing: spacing }),
  
  // Y Axis Tick Display
  yAxisTickMode: 'auto',
  setYAxisTickMode: (mode) => set({ yAxisTickMode: mode }),
  
  yAxisTickNumber: 10,
  setYAxisTickNumber: (number) => set({ yAxisTickNumber: number }),
  
  yAxisOneTickLabelPerLine: false,
  setYAxisOneTickLabelPerLine: (oneTick) => set({ yAxisOneTickLabelPerLine: oneTick }),
  
  // Y Axis Gridline Styling
  yAxisGridColor: '#e5e7eb',
  setYAxisGridColor: (color) => set({ yAxisGridColor: color }),
  
  yAxisGridStyle: 'solid',
  setYAxisGridStyle: (style) => set({ yAxisGridStyle: style }),
  
  yAxisGridWidth: 1,
  setYAxisGridWidth: (width) => set({ yAxisGridWidth: width }),

  yAxisGridOpacity: 0.5,
  setYAxisGridOpacity: (opacity) => set({ yAxisGridOpacity: opacity }),

  yAxisGridDashArray: '0',
  setYAxisGridDashArray: (dashArray) => set({ yAxisGridDashArray: dashArray }),
  
  yAxisGridDash: 5,
  setYAxisGridDash: (dash) => set({ yAxisGridDash: dash }),
  
  yAxisGridSpace: 5,
  setYAxisGridSpace: (space) => set({ yAxisGridSpace: space }),
  
  yAxisGridExtend: false,
  setYAxisGridExtend: (extend) => set({ yAxisGridExtend: extend }),
  
  // Y Axis Line & Tick Marks
  yAxisLineColor: '#000000',
  setYAxisLineColor: (color) => set({ yAxisLineColor: color }),
  
  yAxisLineWidth: 1,
  setYAxisLineWidth: (width) => set({ yAxisLineWidth: width }),
  
  yAxisTickLength: 6,
  setYAxisTickLength: (length) => set({ yAxisTickLength: length }),
  
  yAxisShowAxisLine: true,
  setYAxisShowAxisLine: (show) => set({ yAxisShowAxisLine: show }),
  
  yAxisEdgePadding: 0,
  setYAxisEdgePadding: (padding) => set({ yAxisEdgePadding: padding }),
});
