import { StateCreator } from 'zustand';

export interface StyleSlice {
  // Chart settings
  theme: string;
  setTheme: (theme: string) => void;

  // Color settings
  colorMode: 'by-column' | 'by-row';
  setColorMode: (mode: 'by-column' | 'by-row') => void;

  colorPalette: string;
  setColorPalette: (palette: string) => void;

  colorPaletteExtend: boolean;
  setColorPaletteExtend: (extend: boolean) => void;

  colorCustomOverrides: string;
  setColorCustomOverrides: (overrides: string) => void;

  // Layout settings
  layoutMainFont: string;
  setLayoutMainFont: (font: string) => void;

  layoutTextColor: string;
  setLayoutTextColor: (color: string) => void;

  layoutBackgroundColorEnabled: boolean;
  setLayoutBackgroundColorEnabled: (enabled: boolean) => void;

  layoutBackgroundImageEnabled: boolean;
  setLayoutBackgroundImageEnabled: (enabled: boolean) => void;

  layoutBackgroundColor: string;
  setLayoutBackgroundColor: (color: string) => void;

  layoutBackgroundImageUrl: string;
  setLayoutBackgroundImageUrl: (url: string) => void;

  layoutBackgroundImageSize: 'fill' | 'fit' | 'original' | 'stretch';
  setLayoutBackgroundImageSize: (
    size: 'fill' | 'fit' | 'original' | 'stretch'
  ) => void;

  layoutBackgroundImagePosition:
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'center'
    | 'center-left'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center';
  setLayoutBackgroundImagePosition: (
    position:
      | 'top-left'
      | 'top-right'
      | 'top-center'
      | 'center'
      | 'center-left'
      | 'center-right'
      | 'bottom-left'
      | 'bottom-right'
      | 'bottom-center'
  ) => void;

  layoutOrder: string;
  setLayoutOrder: (order: string) => void;

  layoutSpaceBetweenSections: 'none' | 'tight' | 'loose' | 'large';
  setLayoutSpaceBetweenSections: (
    space: 'none' | 'tight' | 'loose' | 'large'
  ) => void;

  layoutMarginTop: number;
  setLayoutMarginTop: (margin: number) => void;

  layoutMarginRight: number;
  setLayoutMarginRight: (margin: number) => void;

  layoutMarginBottom: number;
  setLayoutMarginBottom: (margin: number) => void;

  layoutMarginLeft: number;
  setLayoutMarginLeft: (margin: number) => void;

  layoutPaddingTop: number;
  setLayoutPaddingTop: (padding: number) => void;

  layoutPaddingRight: number;
  setLayoutPaddingRight: (padding: number) => void;

  layoutPaddingBottom: number;
  setLayoutPaddingBottom: (padding: number) => void;

  layoutPaddingLeft: number;
  setLayoutPaddingLeft: (padding: number) => void;

  layoutBorderEnabled: boolean;
  setLayoutBorderEnabled: (enabled: boolean) => void;

  layoutBorderTop: boolean;
  setLayoutBorderTop: (enabled: boolean) => void;

  layoutBorderRight: boolean;
  setLayoutBorderRight: (enabled: boolean) => void;

  layoutBorderBottom: boolean;
  setLayoutBorderBottom: (enabled: boolean) => void;

  layoutBorderLeft: boolean;
  setLayoutBorderLeft: (enabled: boolean) => void;

  layoutBorderStyle: 'solid' | 'dashed' | 'dotted';
  setLayoutBorderStyle: (style: 'solid' | 'dashed' | 'dotted') => void;

  layoutBorderColor: string;
  setLayoutBorderColor: (color: string) => void;

  layoutBorderWidth: number;
  setLayoutBorderWidth: (width: number) => void;

  layoutBorderRadius: number;
  setLayoutBorderRadius: (radius: number) => void;

  layoutReadDirection: 'ltr' | 'rtl';
  setLayoutReadDirection: (direction: 'ltr' | 'rtl') => void;

  // Line settings
  curveType: 'linear' | 'monotone' | 'step';
  setCurveType: (type: 'linear' | 'monotone' | 'step') => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  setLineStyle: (style: 'solid' | 'dashed' | 'dotted') => void;

  // Point settings
  showPoints: boolean;
  setShowPoints: (show: boolean) => void;
  pointSize: number;
  setPointSize: (size: number) => void;
  pointShape: 'circle' | 'square' | 'triangle' | 'diamond';
  setPointShape: (shape: 'circle' | 'square' | 'triangle' | 'diamond') => void;
  pointColor: string;
  setPointColor: (color: string) => void;
  pointOutlineWidth: number;
  setPointOutlineWidth: (width: number) => void;
  pointOutlineColor: string;
  setPointOutlineColor: (color: string) => void;

  // Area settings
  showArea: boolean;
  setShowArea: (show: boolean) => void;
  areaOpacity: number;
  setAreaOpacity: (opacity: number) => void;

  // Legend settings
  legendShow: boolean;
  setLegendShow: (show: boolean) => void;

  legendPosition: 'top' | 'right' | 'bottom' | 'left';
  setLegendPosition: (position: 'top' | 'right' | 'bottom' | 'left') => void;

  legendAlignment: 'start' | 'center' | 'end';
  setLegendAlignment: (alignment: 'start' | 'center' | 'end') => void;

  legendFontSize: number; // Size multiplier (0.1 to 10.0) applied to base rem size
  setLegendFontSize: (size: number) => void;

  legendBaseFontSizeMobile: number; // Base font size in px for mobile (<768px)
  setLegendBaseFontSizeMobile: (size: number) => void;

  legendBaseFontSizeTablet: number; // Base font size in px for tablet (768px-1024px)
  setLegendBaseFontSizeTablet: (size: number) => void;

  legendBaseFontSizeDesktop: number; // Base font size in px for desktop (>1024px)
  setLegendBaseFontSizeDesktop: (size: number) => void;

  legendShowValues: boolean;
  setLegendShowValues: (show: boolean) => void;

  legendGap: number;
  setLegendGap: (gap: number) => void;

  legendPaddingTop: number;
  setLegendPaddingTop: (padding: number) => void;

  legendPaddingRight: number;
  setLegendPaddingRight: (padding: number) => void;

  legendPaddingBottom: number;
  setLegendPaddingBottom: (padding: number) => void;

  legendPaddingLeft: number;
  setLegendPaddingLeft: (padding: number) => void;

  // Label settings (for charts like Sunburst)
  labelShow: boolean;
  setLabelShow: (show: boolean) => void;

  labelFontSize: number;
  setLabelFontSize: (size: number) => void;

  labelColor: string;
  setLabelColor: (color: string) => void;

  labelFontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  setLabelFontWeight: (weight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900') => void;

  labelPadding: number;
  setLabelPadding: (padding: number) => void;
}

export const createStyleSlice: StateCreator<StyleSlice, [], [], StyleSlice> = (set) => ({
  // Chart settings
  theme: 'none',
  setTheme: (theme) => set({ theme }),

  // Color settings
  colorMode: 'by-column',
  setColorMode: (mode) => set({ colorMode: mode }),

  colorPalette: 'default',
  setColorPalette: (palette) => set({ colorPalette: palette }),

  colorPaletteExtend: false,
  setColorPaletteExtend: (extend) => set({ colorPaletteExtend: extend }),

  colorCustomOverrides: '',
  setColorCustomOverrides: (overrides) =>
    set({ colorCustomOverrides: overrides }),

  // Layout settings
  layoutMainFont: 'Inter',
  setLayoutMainFont: (font) => set({ layoutMainFont: font }),

  layoutTextColor: '#000000',
  setLayoutTextColor: (color) => set({ layoutTextColor: color }),

  layoutBackgroundColorEnabled: true,
  setLayoutBackgroundColorEnabled: (enabled) =>
    set({ layoutBackgroundColorEnabled: enabled }),

  layoutBackgroundImageEnabled: false,
  setLayoutBackgroundImageEnabled: (enabled) =>
    set({ layoutBackgroundImageEnabled: enabled }),

  layoutBackgroundColor: '#ffffff',
  setLayoutBackgroundColor: (color) =>
    set({ layoutBackgroundColor: color }),

  layoutBackgroundImageUrl: '',
  setLayoutBackgroundImageUrl: (url) =>
    set({ layoutBackgroundImageUrl: url }),

  layoutBackgroundImageSize: 'fill',
  setLayoutBackgroundImageSize: (size) =>
    set({ layoutBackgroundImageSize: size }),

  layoutBackgroundImagePosition: 'center',
  setLayoutBackgroundImagePosition: (position) =>
    set({ layoutBackgroundImagePosition: position }),

  layoutOrder: 'header-controls-legend-primary-graphic-footer',
  setLayoutOrder: (order) => set({ layoutOrder: order }),

  layoutSpaceBetweenSections: 'loose',
  setLayoutSpaceBetweenSections: (space) =>
    set({ layoutSpaceBetweenSections: space }),

  layoutMarginTop: 0,
  setLayoutMarginTop: (margin) => set({ layoutMarginTop: margin }),

  layoutMarginRight: 0,
  setLayoutMarginRight: (margin) => set({ layoutMarginRight: margin }),

  layoutMarginBottom: 0,
  setLayoutMarginBottom: (margin) => set({ layoutMarginBottom: margin }),

  layoutMarginLeft: 0,
  setLayoutMarginLeft: (margin) => set({ layoutMarginLeft: margin }),

  layoutPaddingTop: 24,
  setLayoutPaddingTop: (padding) => set({ layoutPaddingTop: padding }),

  layoutPaddingRight: 24,
  setLayoutPaddingRight: (padding) => set({ layoutPaddingRight: padding }),

  layoutPaddingBottom: 24,
  setLayoutPaddingBottom: (padding) =>
    set({ layoutPaddingBottom: padding }),

  layoutPaddingLeft: 24,
  setLayoutPaddingLeft: (padding) => set({ layoutPaddingLeft: padding }),

  layoutBorderEnabled: false,
  setLayoutBorderEnabled: (enabled) =>
    set({ layoutBorderEnabled: enabled }),

  layoutBorderTop: true,
  setLayoutBorderTop: (enabled) => set({ layoutBorderTop: enabled }),

  layoutBorderRight: true,
  setLayoutBorderRight: (enabled) => set({ layoutBorderRight: enabled }),

  layoutBorderBottom: true,
  setLayoutBorderBottom: (enabled) => set({ layoutBorderBottom: enabled }),

  layoutBorderLeft: true,
  setLayoutBorderLeft: (enabled) => set({ layoutBorderLeft: enabled }),

  layoutBorderStyle: 'solid',
  setLayoutBorderStyle: (style) => set({ layoutBorderStyle: style }),

  layoutBorderColor: '#e4e4e7',
  setLayoutBorderColor: (color) => set({ layoutBorderColor: color }),

  layoutBorderWidth: 1,
  setLayoutBorderWidth: (width) => set({ layoutBorderWidth: width }),

  layoutBorderRadius: 0,
  setLayoutBorderRadius: (radius) => set({ layoutBorderRadius: radius }),

  layoutReadDirection: 'ltr',
  setLayoutReadDirection: (direction) =>
    set({ layoutReadDirection: direction }),

  // Line settings
  curveType: 'linear',
  setCurveType: (type) => set({ curveType: type }),
  lineWidth: 2,
  setLineWidth: (width) => set({ lineWidth: width }),
  lineStyle: 'solid',
  setLineStyle: (style) => set({ lineStyle: style }),

  // Point settings
  showPoints: false,
  setShowPoints: (show) => set({ showPoints: show }),
  pointSize: 4,
  setPointSize: (size) => set({ pointSize: size }),
  pointShape: 'circle',
  setPointShape: (shape) => set({ pointShape: shape }),
  pointColor: '#3b82f6',
  setPointColor: (color) => set({ pointColor: color }),
  pointOutlineWidth: 2,
  setPointOutlineWidth: (width) => set({ pointOutlineWidth: width }),
  pointOutlineColor: '#ffffff',
  setPointOutlineColor: (color) => set({ pointOutlineColor: color }),

  // Area settings
  showArea: false,
  setShowArea: (show) => set({ showArea: show }),
  areaOpacity: 0.2,
  setAreaOpacity: (opacity) => set({ areaOpacity: opacity }),

  // Legend settings
  legendShow: true,
  setLegendShow: (show) => set({ legendShow: show }),

  legendPosition: 'right',
  setLegendPosition: (position) => set({ legendPosition: position }),

  legendAlignment: 'start',
  setLegendAlignment: (alignment) => set({ legendAlignment: alignment }),

  legendFontSize: 1.0, // Default 1.0 = 1rem
  setLegendFontSize: (size) => set({ legendFontSize: size }),

  legendBaseFontSizeMobile: 12, // 12px base for mobile
  setLegendBaseFontSizeMobile: (size) =>
    set({ legendBaseFontSizeMobile: size }),

  legendBaseFontSizeTablet: 14, // 14px base for tablet
  setLegendBaseFontSizeTablet: (size) =>
    set({ legendBaseFontSizeTablet: size }),

  legendBaseFontSizeDesktop: 16, // 16px base for desktop
  setLegendBaseFontSizeDesktop: (size) =>
    set({ legendBaseFontSizeDesktop: size }),

  legendShowValues: false,
  setLegendShowValues: (show) => set({ legendShowValues: show }),

  legendGap: 20,
  setLegendGap: (gap) => set({ legendGap: gap }),

  legendPaddingTop: 0,
  setLegendPaddingTop: (padding) => set({ legendPaddingTop: padding }),

  legendPaddingRight: 0,
  setLegendPaddingRight: (padding) => set({ legendPaddingRight: padding }),

  legendPaddingBottom: 0,
  setLegendPaddingBottom: (padding) =>
    set({ legendPaddingBottom: padding }),

  legendPaddingLeft: 0,
  setLegendPaddingLeft: (padding) => set({ legendPaddingLeft: padding }),

  // Label settings
  labelShow: true,
  setLabelShow: (show) => set({ labelShow: show }),

  labelFontSize: 14,
  setLabelFontSize: (size) => set({ labelFontSize: size }),

  labelColor: '#000000',
  setLabelColor: (color) => set({ labelColor: color }),

  labelFontWeight: 'normal',
  setLabelFontWeight: (weight) => set({ labelFontWeight: weight }),

  labelPadding: 4,
  setLabelPadding: (padding) => set({ labelPadding: padding }),
});
