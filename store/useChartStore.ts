/**
 * Global state management for Claude Charts using Zustand with persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChartConfig, ChartData, ChartType } from '@/types';
import { DataTable } from '@/types';
import { cleanData } from '@/utils/dataUtils';
import {
  inferAllColumnTypes,
  type ColumnTypeInfo,
} from '@/utils/dataTypeUtils';
import { indexedDBStorage } from '@/utils/indexedDBStorage';

// Custom storage wrapper that handles BigInt serialization
const bigIntSafeStorage = {
  getItem: async (name: string) => {
    const value = await indexedDBStorage.getItem(name);
    if (!value) return null;
    try {
      return JSON.parse(value, (key, val) => {
        // Convert back to BigInt if it was serialized as such
        if (val && typeof val === 'object' && val.__type === 'bigint') {
          return BigInt(val.value);
        }
        return val;
      });
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: unknown) => {
    const serialized = JSON.stringify(value, (key, val) => {
      // Convert BigInt to string with special marker
      if (typeof val === 'bigint') {
        return { __type: 'bigint', value: val.toString() };
      }
      return val;
    });
    await indexedDBStorage.setItem(name, serialized);
  },
  removeItem: async (name: string) => {
    await indexedDBStorage.removeItem(name);
  },
};

export interface ColumnMapping {
  labels: number | null; // Column index for labels/time
  values: number[]; // Column indices for values
  chartsGrid: number | null;
  rowFilter: number | null;
  customPopups: number | null;
}

interface ChartStore {
  // Data storage mode
  useDuckDB: boolean;
  setUseDuckDB: (use: boolean) => void;

  // Data state
  dataTable: DataTable | null;
  setDataTable: (data: DataTable | null) => void;

  // Spreadsheet data (raw 2D array) - Used when useDuckDB is false
  data: unknown[][];
  setData: (data: unknown[][], deletedColumnInfo?: { index: number; count: number }) => void;
  replaceData: (data: unknown[][]) => void;
  mergeData: (data: unknown[][]) => void;
  addRows: (count: number) => void;

  // Column mapping
  columnMapping: ColumnMapping;
  setColumnMapping: (mapping: Partial<ColumnMapping>) => void;
  autoSetColumns: () => void;

  // Available columns from data
  availableColumns: string[];
  setAvailableColumns: (columns: string[]) => void;

  // Column type information
  columnTypes: ColumnTypeInfo[];
  setColumnTypes: (types: ColumnTypeInfo[]) => void;

  // Data metadata (for DuckDB mode)
  dataRowCount: number;
  setDataRowCount: (count: number) => void;

  dataColCount: number;
  setDataColCount: (count: number) => void;

  // Pagination state (for DuckDB mode)
  currentPage: number;
  setCurrentPage: (page: number) => void;

  pageSize: number;
  setPageSize: (size: number) => void;

  // Filtering state (for DuckDB mode)
  filterColumn: number | null;
  setFilterColumn: (col: number | null) => void;

  filterValue: string;
  setFilterValue: (value: string) => void;

  // Sorting state (for DuckDB mode)
  sortColumn: number | null;
  setSortColumn: (col: number | null) => void;

  sortDirection: 'asc' | 'desc' | null;
  setSortDirection: (dir: 'asc' | 'desc' | null) => void;

  // Chart state
  chartType: ChartType;
  setChartType: (type: ChartType) => void;

  chartConfig: ChartConfig;
  setChartConfig: (config: Partial<ChartConfig>) => void;

  chartData: ChartData | null;
  setChartData: (data: ChartData | null) => void;

  // Chart settings
  theme: string;
  setTheme: (theme: string) => void;

  gridMode: 'single' | 'grid';
  setGridMode: (mode: 'single' | 'grid') => void;
  
  gridSplitBy: 'label' | 'value';
  setGridSplitBy: (splitBy: 'label' | 'value') => void;
  
  gridColumns: number;
  setGridColumns: (columns: number) => void;
  
  gridAspectRatio: string;
  setGridAspectRatio: (ratio: string) => void;

  heightMode: 'auto' | 'standard' | 'aspect';
  setHeightMode: (mode: 'auto' | 'standard' | 'aspect') => void;

  aggregationMode: 'none' | 'sum' | 'average' | 'count';
  setAggregationMode: (mode: 'none' | 'sum' | 'average' | 'count') => void;

  // Zoom settings
  zoomDomain: { x: [number, number] | null; y: [number, number] | null } | null;
  setZoomDomain: (domain: { x: [number, number] | null; y: [number, number] | null } | null) => void;
  resetZoom: () => void;
  
  showZoomControls: boolean;
  setShowZoomControls: (show: boolean) => void;

  // Preview settings
  previewWidth: number;
  setPreviewWidth: (width: number) => void;

  previewHeight: number;
  setPreviewHeight: (height: number) => void;

  previewDevice: 'mobile' | 'tablet' | 'desktop';
  setPreviewDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;

  colorblindMode:
    | 'none'
    | 'protanopia'
    | 'deuteranopia'
    | 'tritanopia'
    | 'achromatopsia';
  setColorblindMode: (
    mode:
      | 'none'
      | 'protanopia'
      | 'deuteranopia'
      | 'tritanopia'
      | 'achromatopsia'
  ) => void;

  darkModePreview: 'light' | 'dark';
  setDarkModePreview: (mode: 'light' | 'dark') => void;

  // Color settings
  colorMode: 'by-column' | 'by-row';
  setColorMode: (mode: 'by-column' | 'by-row') => void;

  colorPalette: string;
  setColorPalette: (palette: string) => void;

  colorPaletteExtend: boolean;
  setColorPaletteExtend: (extend: boolean) => void;

  colorCustomOverrides: string;
  setColorCustomOverrides: (overrides: string) => void;

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

  // X Axis settings
  xAxisShow: boolean;
  setXAxisShow: (show: boolean) => void;

  xAxisTitle: string;
  setXAxisTitle: (title: string) => void;

  xAxisShowGrid: boolean;
  setXAxisShowGrid: (show: boolean) => void;

  xAxisShowDomain: boolean;
  setXAxisShowDomain: (show: boolean) => void;

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
  
  // X Axis Tick & Label Styling
  xAxisTickPosition: 'outside' | 'inside' | 'cross';
  setXAxisTickPosition: (position: 'outside' | 'inside' | 'cross') => void;
  
  xAxisLabelWeight: 'bold' | 'regular' | 'light';
  setXAxisLabelWeight: (weight: 'bold' | 'regular' | 'light') => void;
  
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

  yAxisShowGrid: boolean;
  setYAxisShowGrid: (show: boolean) => void;

  yAxisShowDomain: boolean;
  setYAxisShowDomain: (show: boolean) => void;

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
  
  yAxisLabelWeight: 'bold' | 'regular' | 'light';
  setYAxisLabelWeight: (weight: 'bold' | 'regular' | 'light') => void;
  
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

  // UI state
  isDataPanelOpen: boolean;
  toggleDataPanel: () => void;

  isConfigPanelOpen: boolean;
  toggleConfigPanel: () => void;

  isExporting: boolean;
  setIsExporting: (value: boolean) => void;

  // Actions
  resetChart: () => void;
}

export const useChartStore = create<ChartStore>()(
  persist(
    (set, get) => ({
      // Data storage mode - always use DuckDB
      useDuckDB: true,
      setUseDuckDB: () => {}, // No-op, always use DuckDB

      // Initial data state
      dataTable: null,
      setDataTable: (data) => set({ dataTable: data }),

      // Initial spreadsheet data
      data: (() => {
        // Initialize with empty 5x5 grid
        const initialData = Array(6).fill(Array(5).fill(''));
        return initialData;
      })(),
      setData: (data, deletedColumnInfo) => {
        // Clean data to remove empty rows and columns
        const cleanedData = cleanData(data);
        set({ data: cleanedData });

        // Extract column names from first row
        if (cleanedData.length > 0 && cleanedData[0]) {
          const columnNames = cleanedData[0].map((col) => String(col || ''));
          set({ availableColumns: columnNames });

          // Infer column types
          const types = inferAllColumnTypes(cleanedData);
          set({ columnTypes: types });

          // Update column mapping
          const { columnMapping } = get();
          let newMapping = { ...columnMapping };

          if (deletedColumnInfo) {
            const { index: deletedIndex, count: deletedCount } = deletedColumnInfo;
            const deletedEndIndex = deletedIndex + deletedCount;

            // Helper to adjust single index
            const adjustIndex = (oldIndex: number | null) => {
              if (oldIndex === null) return null;
              if (oldIndex >= deletedIndex && oldIndex < deletedEndIndex) {
                return null; // Mapped column was deleted
              }
              if (oldIndex >= deletedEndIndex) {
                return oldIndex - deletedCount; // Mapped column shifted left
              }
              return oldIndex; // Mapped column unaffected
            };

            newMapping = {
              labels: adjustIndex(columnMapping.labels),
              chartsGrid: adjustIndex(columnMapping.chartsGrid),
              rowFilter: adjustIndex(columnMapping.rowFilter),
              customPopups: adjustIndex(columnMapping.customPopups),
              values: columnMapping.values
                .filter((idx) => !(idx >= deletedIndex && idx < deletedEndIndex)) // Remove deleted values
                .map((idx) => (idx >= deletedEndIndex ? idx - deletedCount : idx)), // Adjust remaining values
            };
          } else {
            // Fallback for when deletedColumnInfo is not provided (e.g., initial load or other data changes)
            // This logic ensures indices are within bounds after general data changes
            const maxIndex = columnNames.length - 1;
            newMapping = {
              labels:
                columnMapping.labels !== null && columnMapping.labels <= maxIndex
                  ? columnMapping.labels
                  : null,
              values: columnMapping.values.filter((idx) => idx <= maxIndex),
              chartsGrid:
                columnMapping.chartsGrid !== null &&
                columnMapping.chartsGrid <= maxIndex
                  ? columnMapping.chartsGrid
                  : null,
              rowFilter:
                columnMapping.rowFilter !== null &&
                columnMapping.rowFilter <= maxIndex
                  ? columnMapping.rowFilter
                  : null,
              customPopups:
                columnMapping.customPopups !== null &&
                columnMapping.customPopups <= maxIndex
                  ? columnMapping.customPopups
                  : null,
            };
          }

          set({ columnMapping: newMapping });
        } else {
          set({ availableColumns: [] });
          set({ columnTypes: [] });
          set({
            columnMapping: {
              labels: null,
              values: [],
              chartsGrid: null,
              rowFilter: null,
              customPopups: null,
            },
          });
        }
      },
      replaceData: (newData) => {
        // Clean data to remove empty rows and columns
        const cleanedData = cleanData(newData);
        set({ data: cleanedData });

        // Extract column names from first row
        if (cleanedData.length > 0) {
          const columnNames = cleanedData[0].map((col) => String(col));
          set({ availableColumns: columnNames });

          // Infer column types
          const types = inferAllColumnTypes(cleanedData);
          set({ columnTypes: types });

          // Auto-set columns for new data
          get().autoSetColumns();
        }
      },
      mergeData: (newData) => {
        const { data } = get();
        // Remove header from new data if it exists
        const dataToMerge = newData.length > 1 ? newData.slice(1) : newData;
        // Append new rows to existing data
        const mergedData = [...data, ...dataToMerge];
        // Clean merged data
        const cleanedData = cleanData(mergedData);
        set({ data: cleanedData });
      },
      addRows: (count: number) => {
        const { data } = get();
        // Determine the number of columns from the first row
        const columnCount = data.length > 0 && data[0] ? data[0].length : 5;

        // Create empty rows
        const newRows = Array.from({ length: count }, () =>
          Array.from({ length: columnCount }, () => '')
        );

        // Append to existing data
        const updatedData = [...data, ...newRows];
        set({ data: updatedData });
      },

      // Initial column mapping
      columnMapping: {
        labels: null,
        values: [],
        chartsGrid: null,
        rowFilter: null,
        customPopups: null,
        // Initial mapping is empty
      },
      setColumnMapping: (mapping) =>
        set((state) => ({
          columnMapping: { ...state.columnMapping, ...mapping },
        })),

      // Auto-set columns based on data
      autoSetColumns: () => {
        const { availableColumns } = get();
        if (availableColumns.length > 0) {
          const labels = 0; // First column as labels
          const values = availableColumns.slice(1).map((_, i) => i + 1); // Rest as values
          set({
            columnMapping: {
              labels,
              values,
              chartsGrid: null,
              rowFilter: null,
              customPopups: null,
            },
          });
        }
      },

      // Available columns
      availableColumns: Array(5).fill(''),
      setAvailableColumns: (columns) => set({ availableColumns: columns }),

      // Column types - initialize with inferred types for initial data
      columnTypes: (() => {
        const initialData = Array(6).fill(Array(5).fill(''));
        return inferAllColumnTypes(initialData);
      })(),
      setColumnTypes: (types) => set({ columnTypes: types }),

      // Data metadata (for DuckDB mode)
      dataRowCount: 5, // Initial data has 5 empty rows
      setDataRowCount: (count) => set({ dataRowCount: count }),

      dataColCount: 5, // Initial data has 5 columns
      setDataColCount: (count) => set({ dataColCount: count }),

      // Pagination state (for DuckDB mode)
      currentPage: 0,
      setCurrentPage: (page) => set({ currentPage: page }),

      pageSize: 1000, // Load 1000 rows at a time
      setPageSize: (size) => set({ pageSize: size }),

      // Filtering state (for DuckDB mode)
      filterColumn: null,
      setFilterColumn: (col) => set({ filterColumn: col }),

      filterValue: '',
      setFilterValue: (value) => set({ filterValue: value }),

      // Sorting state (for DuckDB mode)
      sortColumn: null,
      setSortColumn: (col) => set({ sortColumn: col }),

      sortDirection: null,
      setSortDirection: (dir) => set({ sortDirection: dir }),

      // Initial chart state
      chartType: 'bar',
      setChartType: (type) => set({ chartType: type }),

      chartConfig: {
        type: 'bar',
        responsive: true,
        animation: {
          enabled: true,
          duration: 300,
          easing: 'ease-in-out',
        },
        legend: {
          show: true,
          position: 'top',
        },
        theme: 'light',
      },
      setChartConfig: (config) =>
        set((state) => ({
          chartConfig: { ...state.chartConfig, ...config },
        })),

      chartData: null,
      setChartData: (data) => set({ chartData: data }),

      // Chart settings
      theme: 'none',
      setTheme: (theme) => set({ theme }),

      gridMode: 'single',
      setGridMode: (mode) => set({ gridMode: mode }),
      
      gridSplitBy: 'label',
      setGridSplitBy: (splitBy) => set({ gridSplitBy: splitBy }),
      
      gridColumns: 2,
      setGridColumns: (columns) => set({ gridColumns: columns }),
      
      gridAspectRatio: '16/9',
      setGridAspectRatio: (ratio) => set({ gridAspectRatio: ratio }),

      heightMode: 'auto',
      setHeightMode: (mode) => set({ heightMode: mode }),

      aggregationMode: 'sum',
      setAggregationMode: (mode) => set({ aggregationMode: mode }),

      // Zoom settings
      zoomDomain: null,
      setZoomDomain: (domain) => set({ zoomDomain: domain }),
      resetZoom: () => set({ zoomDomain: null }),
      
      showZoomControls: true,
      setShowZoomControls: (show) => set({ showZoomControls: show }),

      // Preview settings
      previewWidth: 1920,
      setPreviewWidth: (width) => set({ previewWidth: width }),

      previewHeight: 1080,
      setPreviewHeight: (height) => set({ previewHeight: height }),

      previewDevice: 'desktop',
      setPreviewDevice: (device) => set({ previewDevice: device }),

      colorblindMode: 'none',
      setColorblindMode: (mode) => set({ colorblindMode: mode }),

      darkModePreview: 'light',
      setDarkModePreview: (mode) => set({ darkModePreview: mode }),

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

      // X Axis settings
      xAxisShow: true,
      setXAxisShow: (show) => set({ xAxisShow: show }),

      xAxisTitle: '',
      setXAxisTitle: (title) => set({ xAxisTitle: title }),

      xAxisShowGrid: true,
      setXAxisShowGrid: (show) => set({ xAxisShowGrid: show }),

      xAxisShowDomain: true,
      setXAxisShowDomain: (show) => set({ xAxisShowDomain: show }),

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
      
      // X Axis Tick & Label Styling
      xAxisTickPosition: 'outside',
      setXAxisTickPosition: (position) => set({ xAxisTickPosition: position }),
      
      xAxisLabelWeight: 'light',
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

      yAxisShowGrid: true,
      setYAxisShowGrid: (show) => set({ yAxisShowGrid: show }),

      yAxisShowDomain: true,
      setYAxisShowDomain: (show) => set({ yAxisShowDomain: show }),

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
      
      yAxisLabelWeight: 'light',
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

      // Initial UI state
      isDataPanelOpen: true,
      toggleDataPanel: () =>
        set((state) => ({ isDataPanelOpen: !state.isDataPanelOpen })),

      isConfigPanelOpen: true,
      toggleConfigPanel: () =>
        set((state) => ({ isConfigPanelOpen: !state.isConfigPanelOpen })),

      isExporting: false,
      setIsExporting: (value) => set({ isExporting: value }),

      // Reset action
      resetChart: () =>
        set({
          dataTable: null,
          chartData: null,
          data: [['', '', '', '', '']],
          availableColumns: [],
          columnMapping: {
            labels: null,
            values: [],
            chartsGrid: null,
            rowFilter: null,
            customPopups: null,
          },
          chartType: 'bar',
          chartConfig: {
            type: 'bar',
            responsive: true,
            animation: {
              enabled: true,
              duration: 300,
              easing: 'ease-in-out',
            },
            legend: {
              show: true,
              position: 'top',
            },
            theme: 'light',
          },
        }),
    }),
    {
      name: 'claude-charts-storage',
      storage: createJSONStorage(() => bigIntSafeStorage),
      partialize: (state) => {
        // Note: We ALWAYS persist 'data' even in DuckDB mode because:
        // - DuckDB runs in-memory and is cleared on page reload
        // - Zustand's IndexedDB persistence is the source of truth
        // - On page load, we reload persisted data into DuckDB
        const nonPersistedKeys = [
          'dataTable',
          'chartData',
          'isDataPanelOpen',
          'isConfigPanelOpen',
          'isExporting',
          'filterValue',
          'filterColumn',
          'currentPage',
        ];

        const persistedState = { ...state };
        nonPersistedKeys.forEach((key) => {
          delete persistedState[key as keyof ChartStore];
        });
        return persistedState;
      },
    }
  )
);
