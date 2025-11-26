import { StateCreator } from 'zustand';

export interface TextSlice {
  // Chart metadata
  chartTitle: string;
  setChartTitle: (title: string) => void;

  chartDescription: string;
  setChartDescription: (description: string) => void;

  // Header settings
  headerAlignment: 'left' | 'center' | 'right';
  setHeaderAlignment: (alignment: 'left' | 'center' | 'right') => void;

  // Title settings
  titleStyleEnabled: boolean;
  setTitleStyleEnabled: (enabled: boolean) => void;

  titleFont: string;
  setTitleFont: (font: string) => void;

  titleFontSize: number; // Size multiplier (0.1 to 10.0) applied to base size
  setTitleFontSize: (size: number) => void;

  titleBaseFontSizeMobile: number; // Base font size in px for mobile (<768px)
  setTitleBaseFontSizeMobile: (size: number) => void;

  titleBaseFontSizeTablet: number; // Base font size in px for tablet (768px-1024px)
  setTitleBaseFontSizeTablet: (size: number) => void;

  titleBaseFontSizeDesktop: number; // Base font size in px for desktop (>1024px)
  setTitleBaseFontSizeDesktop: (size: number) => void;

  titleFontWeight: 'bold' | 'regular' | 'medium';
  setTitleFontWeight: (weight: 'bold' | 'regular' | 'medium') => void;

  titleColor: string;
  setTitleColor: (color: string) => void;

  titleLineHeight: number;
  setTitleLineHeight: (lineHeight: number) => void;

  titleSpaceAbove: 'slim' | 'medium' | 'large' | 'none';
  setTitleSpaceAbove: (space: 'slim' | 'medium' | 'large' | 'none') => void;

  // Subtitle settings
  chartSubtitle: string;
  setChartSubtitle: (subtitle: string) => void;

  subtitleStyleEnabled: boolean;
  setSubtitleStyleEnabled: (enabled: boolean) => void;

  subtitleFont: string;
  setSubtitleFont: (font: string) => void;

  subtitleFontSize: number; // Size multiplier (0.1 to 10.0) applied to base size
  setSubtitleFontSize: (size: number) => void;

  subtitleBaseFontSizeMobile: number; // Base font size in px for mobile (<768px)
  setSubtitleBaseFontSizeMobile: (size: number) => void;

  subtitleBaseFontSizeTablet: number; // Base font size in px for tablet (768px-1024px)
  setSubtitleBaseFontSizeTablet: (size: number) => void;

  subtitleBaseFontSizeDesktop: number; // Base font size in px for desktop (>1024px)
  setSubtitleBaseFontSizeDesktop: (size: number) => void;

  subtitleFontWeight: 'bold' | 'regular' | 'medium';
  setSubtitleFontWeight: (weight: 'bold' | 'regular' | 'medium') => void;

  subtitleColor: string;
  setSubtitleColor: (color: string) => void;

  subtitleLineHeight: number;
  setSubtitleLineHeight: (lineHeight: number) => void;

  subtitleSpaceAbove: 'slim' | 'medium' | 'large' | 'none';
  setSubtitleSpaceAbove: (space: 'slim' | 'medium' | 'large' | 'none') => void;

  // Header text settings
  headerText: string;
  setHeaderText: (text: string) => void;

  headerTextStyleEnabled: boolean;
  setHeaderTextStyleEnabled: (enabled: boolean) => void;

  headerTextFont: string;
  setHeaderTextFont: (font: string) => void;

  headerTextFontSize: number; // Size multiplier (0.1 to 10.0) applied to base size
  setHeaderTextFontSize: (size: number) => void;

  headerTextBaseFontSizeMobile: number; // Base font size in px for mobile (<768px)
  setHeaderTextBaseFontSizeMobile: (size: number) => void;

  headerTextBaseFontSizeTablet: number; // Base font size in px for tablet (768px-1024px)
  setHeaderTextBaseFontSizeTablet: (size: number) => void;

  headerTextBaseFontSizeDesktop: number; // Base font size in px for desktop (>1024px)
  setHeaderTextBaseFontSizeDesktop: (size: number) => void;

  headerTextFontWeight: 'bold' | 'regular' | 'medium';
  setHeaderTextFontWeight: (weight: 'bold' | 'regular' | 'medium') => void;

  headerTextColor: string;
  setHeaderTextColor: (color: string) => void;

  headerTextLineHeight: number;
  setHeaderTextLineHeight: (lineHeight: number) => void;

  headerTextSpaceAbove: 'slim' | 'medium' | 'large' | 'none';
  setHeaderTextSpaceAbove: (
    space: 'slim' | 'medium' | 'large' | 'none'
  ) => void;

  // Header border settings
  headerBorder: 'none' | 'top' | 'bottom' | 'top-bottom';
  setHeaderBorder: (border: 'none' | 'top' | 'bottom' | 'top-bottom') => void;

  headerBorderStyle: 'solid' | 'dashed' | 'dotted';
  setHeaderBorderStyle: (style: 'solid' | 'dashed' | 'dotted') => void;

  headerBorderSpace: number;
  setHeaderBorderSpace: (space: number) => void;

  headerBorderWidth: number;
  setHeaderBorderWidth: (width: number) => void;

  headerBorderColor: string;
  setHeaderBorderColor: (color: string) => void;

  // Header logo/image settings
  headerLogoEnabled: boolean;
  setHeaderLogoEnabled: (enabled: boolean) => void;

  headerLogoImageUrl: string;
  setHeaderLogoImageUrl: (url: string) => void;

  headerLogoImageLink: string;
  setHeaderLogoImageLink: (link: string) => void;

  headerLogoHeight: number;
  setHeaderLogoHeight: (height: number) => void;

  headerLogoAlign: 'header' | 'main-container';
  setHeaderLogoAlign: (align: 'header' | 'main-container') => void;

  headerLogoPosition: 'top' | 'left' | 'right';
  setHeaderLogoPosition: (position: 'top' | 'left' | 'right') => void;

  headerLogoPositionTop: number;
  setHeaderLogoPositionTop: (top: number) => void;

  headerLogoPositionRight: number;
  setHeaderLogoPositionRight: (right: number) => void;

  headerLogoPositionBottom: number;
  setHeaderLogoPositionBottom: (bottom: number) => void;

  headerLogoPositionLeft: number;
  setHeaderLogoPositionLeft: (left: number) => void;

  chartFooter: string;
  setChartFooter: (footer: string) => void;

  // Footer settings
  footerAlignment: 'left' | 'center' | 'right';
  setFooterAlignment: (alignment: 'left' | 'center' | 'right') => void;

  // Advanced footer styles
  footerStylesEnabled: boolean;
  setFooterStylesEnabled: (enabled: boolean) => void;

  footerFont: string;
  setFooterFont: (font: string) => void;

  footerFontWeight: 'bold' | 'regular';
  setFooterFontWeight: (weight: 'bold' | 'regular') => void;

  // Source fields
  footerSourceName: string;
  setFooterSourceName: (name: string) => void;

  footerSourceUrl: string;
  setFooterSourceUrl: (url: string) => void;

  footerSourceLabel: string;
  setFooterSourceLabel: (label: string) => void;

  // Note fields
  footerNote: string;
  setFooterNote: (note: string) => void;

  footerNoteSecondary: string;
  setFooterNoteSecondary: (note: string) => void;

  // Footer logo/image settings
  footerLogoEnabled: boolean;
  setFooterLogoEnabled: (enabled: boolean) => void;

  footerLogoImageUrl: string;
  setFooterLogoImageUrl: (url: string) => void;

  footerLogoImageLink: string;
  setFooterLogoImageLink: (link: string) => void;

  footerLogoHeight: number;
  setFooterLogoHeight: (height: number) => void;

  footerLogoAlign: 'footer' | 'main-container';
  setFooterLogoAlign: (align: 'footer' | 'main-container') => void;

  footerLogoPosition: 'bottom' | 'left' | 'right';
  setFooterLogoPosition: (position: 'bottom' | 'left' | 'right') => void;

  footerLogoPositionTop: number;
  setFooterLogoPositionTop: (top: number) => void;

  footerLogoPositionRight: number;
  setFooterLogoPositionRight: (right: number) => void;

  footerLogoPositionBottom: number;
  setFooterLogoPositionBottom: (bottom: number) => void;

  footerLogoPositionLeft: number;
  setFooterLogoPositionLeft: (left: number) => void;

  // Footer border settings
  footerBorder: 'none' | 'top' | 'bottom' | 'top-bottom';
  setFooterBorder: (border: 'none' | 'top' | 'bottom' | 'top-bottom') => void;

  footerBorderStyle: 'solid' | 'dashed' | 'dotted';
  setFooterBorderStyle: (style: 'solid' | 'dashed' | 'dotted') => void;

  footerBorderSpace: number;
  setFooterBorderSpace: (space: number) => void;

  footerBorderWidth: number;
  setFooterBorderWidth: (width: number) => void;

  footerBorderColor: string;
  setFooterBorderColor: (color: string) => void;
}

export const createTextSlice: StateCreator<TextSlice, [], [], TextSlice> = (set) => ({
  // Chart metadata
  chartTitle: '',
  setChartTitle: (title) => set({ chartTitle: title }),

  chartDescription: '',
  setChartDescription: (description) =>
    set({ chartDescription: description }),

  // Header settings
  headerAlignment: 'left',
  setHeaderAlignment: (alignment) => set({ headerAlignment: alignment }),

  // Title settings
  titleStyleEnabled: false,
  setTitleStyleEnabled: (enabled) => set({ titleStyleEnabled: enabled }),

  titleFont: 'Same as parent',
  setTitleFont: (font) => set({ titleFont: font }),

  titleFontSize: 1.0,
  setTitleFontSize: (size) => set({ titleFontSize: size }),

  titleBaseFontSizeMobile: 24,
  setTitleBaseFontSizeMobile: (size) =>
    set({ titleBaseFontSizeMobile: size }),

  titleBaseFontSizeTablet: 28,
  setTitleBaseFontSizeTablet: (size) =>
    set({ titleBaseFontSizeTablet: size }),

  titleBaseFontSizeDesktop: 32,
  setTitleBaseFontSizeDesktop: (size) =>
    set({ titleBaseFontSizeDesktop: size }),

  titleFontWeight: 'bold',
  setTitleFontWeight: (weight) => set({ titleFontWeight: weight }),

  titleColor: '#000000',
  setTitleColor: (color) => set({ titleColor: color }),

  titleLineHeight: 1.2,
  setTitleLineHeight: (lineHeight) => set({ titleLineHeight: lineHeight }),

  titleSpaceAbove: 'none',
  setTitleSpaceAbove: (space) => set({ titleSpaceAbove: space }),

  // Subtitle settings
  chartSubtitle: '',
  setChartSubtitle: (subtitle) => set({ chartSubtitle: subtitle }),

  subtitleStyleEnabled: false,
  setSubtitleStyleEnabled: (enabled) =>
    set({ subtitleStyleEnabled: enabled }),

  subtitleFont: 'Same as parent',
  setSubtitleFont: (font) => set({ subtitleFont: font }),

  subtitleFontSize: 1.0,
  setSubtitleFontSize: (size) => set({ subtitleFontSize: size }),

  subtitleBaseFontSizeMobile: 18,
  setSubtitleBaseFontSizeMobile: (size) =>
    set({ subtitleBaseFontSizeMobile: size }),

  subtitleBaseFontSizeTablet: 20,
  setSubtitleBaseFontSizeTablet: (size) =>
    set({ subtitleBaseFontSizeTablet: size }),

  subtitleBaseFontSizeDesktop: 22,
  setSubtitleBaseFontSizeDesktop: (size) =>
    set({ subtitleBaseFontSizeDesktop: size }),

  subtitleFontWeight: 'regular',
  setSubtitleFontWeight: (weight) => set({ subtitleFontWeight: weight }),

  subtitleColor: '#000000',
  setSubtitleColor: (color) => set({ subtitleColor: color }),

  subtitleLineHeight: 1.3,
  setSubtitleLineHeight: (lineHeight) =>
    set({ subtitleLineHeight: lineHeight }),

  subtitleSpaceAbove: 'slim',
  setSubtitleSpaceAbove: (space) => set({ subtitleSpaceAbove: space }),

  // Header text settings
  headerText: '',
  setHeaderText: (text) => set({ headerText: text }),

  headerTextStyleEnabled: false,
  setHeaderTextStyleEnabled: (enabled) =>
    set({ headerTextStyleEnabled: enabled }),

  headerTextFont: 'Same as parent',
  setHeaderTextFont: (font) => set({ headerTextFont: font }),

  headerTextFontSize: 1.0,
  setHeaderTextFontSize: (size) => set({ headerTextFontSize: size }),

  headerTextBaseFontSizeMobile: 14,
  setHeaderTextBaseFontSizeMobile: (size) =>
    set({ headerTextBaseFontSizeMobile: size }),

  headerTextBaseFontSizeTablet: 15,
  setHeaderTextBaseFontSizeTablet: (size) =>
    set({ headerTextBaseFontSizeTablet: size }),

  headerTextBaseFontSizeDesktop: 16,
  setHeaderTextBaseFontSizeDesktop: (size) =>
    set({ headerTextBaseFontSizeDesktop: size }),

  headerTextFontWeight: 'regular',
  setHeaderTextFontWeight: (weight) =>
    set({ headerTextFontWeight: weight }),

  headerTextColor: '#000000',
  setHeaderTextColor: (color) => set({ headerTextColor: color }),

  headerTextLineHeight: 1.5,
  setHeaderTextLineHeight: (lineHeight) =>
    set({ headerTextLineHeight: lineHeight }),

  headerTextSpaceAbove: 'slim',
  setHeaderTextSpaceAbove: (space) => set({ headerTextSpaceAbove: space }),

  // Header border settings
  headerBorder: 'none',
  setHeaderBorder: (border) => set({ headerBorder: border }),

  headerBorderStyle: 'solid',
  setHeaderBorderStyle: (style) => set({ headerBorderStyle: style }),

  headerBorderSpace: 10,
  setHeaderBorderSpace: (space) => set({ headerBorderSpace: space }),

  headerBorderWidth: 1,
  setHeaderBorderWidth: (width) => set({ headerBorderWidth: width }),

  headerBorderColor: '#e5e7eb',
  setHeaderBorderColor: (color) => set({ headerBorderColor: color }),

  // Header logo/image settings
  headerLogoEnabled: false,
  setHeaderLogoEnabled: (enabled) => set({ headerLogoEnabled: enabled }),

  headerLogoImageUrl: '',
  setHeaderLogoImageUrl: (url) => set({ headerLogoImageUrl: url }),

  headerLogoImageLink: '',
  setHeaderLogoImageLink: (link) => set({ headerLogoImageLink: link }),

  headerLogoHeight: 50,
  setHeaderLogoHeight: (height) => set({ headerLogoHeight: height }),

  headerLogoAlign: 'header',
  setHeaderLogoAlign: (align) => set({ headerLogoAlign: align }),

  headerLogoPosition: 'top',
  setHeaderLogoPosition: (position) =>
    set({ headerLogoPosition: position }),

  headerLogoPositionTop: 0,
  setHeaderLogoPositionTop: (top) => set({ headerLogoPositionTop: top }),

  headerLogoPositionRight: 0,
  setHeaderLogoPositionRight: (right) =>
    set({ headerLogoPositionRight: right }),

  headerLogoPositionBottom: 0,
  setHeaderLogoPositionBottom: (bottom) =>
    set({ headerLogoPositionBottom: bottom }),

  headerLogoPositionLeft: 0,
  setHeaderLogoPositionLeft: (left) =>
    set({ headerLogoPositionLeft: left }),

  chartFooter: '',
  setChartFooter: (footer) => set({ chartFooter: footer }),

  // Footer settings
  footerAlignment: 'left',
  setFooterAlignment: (alignment) => set({ footerAlignment: alignment }),

  // Advanced footer styles
  footerStylesEnabled: false,
  setFooterStylesEnabled: (enabled) =>
    set({ footerStylesEnabled: enabled }),

  footerFont: 'Same as parent',
  setFooterFont: (font) => set({ footerFont: font }),

  footerFontWeight: 'regular',
  setFooterFontWeight: (weight) => set({ footerFontWeight: weight }),

  // Source fields
  footerSourceName: '',
  setFooterSourceName: (name) => set({ footerSourceName: name }),

  footerSourceUrl: '',
  setFooterSourceUrl: (url) => set({ footerSourceUrl: url }),

  footerSourceLabel: '',
  setFooterSourceLabel: (label) => set({ footerSourceLabel: label }),

  // Note fields
  footerNote: '',
  setFooterNote: (note) => set({ footerNote: note }),

  footerNoteSecondary: '',
  setFooterNoteSecondary: (note) => set({ footerNoteSecondary: note }),

  // Footer logo/image settings
  footerLogoEnabled: false,
  setFooterLogoEnabled: (enabled) => set({ footerLogoEnabled: enabled }),

  footerLogoImageUrl: '',
  setFooterLogoImageUrl: (url) => set({ footerLogoImageUrl: url }),

  footerLogoImageLink: '',
  setFooterLogoImageLink: (link) => set({ footerLogoImageLink: link }),

  footerLogoHeight: 50,
  setFooterLogoHeight: (height) => set({ footerLogoHeight: height }),

  footerLogoAlign: 'footer',
  setFooterLogoAlign: (align) => set({ footerLogoAlign: align }),

  footerLogoPosition: 'bottom',
  setFooterLogoPosition: (position) =>
    set({ footerLogoPosition: position }),

  footerLogoPositionTop: 0,
  setFooterLogoPositionTop: (top) => set({ footerLogoPositionTop: top }),

  footerLogoPositionRight: 0,
  setFooterLogoPositionRight: (right) =>
    set({ footerLogoPositionRight: right }),

  footerLogoPositionBottom: 0,
  setFooterLogoPositionBottom: (bottom) =>
    set({ footerLogoPositionBottom: bottom }),

  footerLogoPositionLeft: 0,
  setFooterLogoPositionLeft: (left) =>
    set({ footerLogoPositionLeft: left }),

  // Footer border settings
  footerBorder: 'none',
  setFooterBorder: (border) => set({ footerBorder: border }),

  footerBorderStyle: 'solid',
  setFooterBorderStyle: (style) => set({ footerBorderStyle: style }),

  footerBorderSpace: 10,
  setFooterBorderSpace: (space) => set({ footerBorderSpace: space }),

  footerBorderWidth: 1,
  setFooterBorderWidth: (width) => set({ footerBorderWidth: width }),

  footerBorderColor: '#e5e7eb',
  setFooterBorderColor: (color) => set({ footerBorderColor: color }),
});
