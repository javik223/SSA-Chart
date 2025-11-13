/**
 * Global state management for Claude Charts using Zustand with persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ChartConfig, ChartData, ChartType } from '@/types';
import { DataTable } from '@/types';
import { cleanData } from '@/utils/dataUtils';
import { inferAllColumnTypes, type ColumnTypeInfo } from '@/utils/dataTypeUtils';

interface ColumnMapping {
  labels: number | null; // Column index for labels/time
  values: number[]; // Column indices for values
  chartsGrid: number | null;
  rowFilter: number | null;
  customPopups: number | null;
}

interface ChartStore {
  // Data state
  dataTable: DataTable | null;
  setDataTable: (data: DataTable | null) => void;

  // Spreadsheet data (raw 2D array)
  data: any[][];
  setData: (data: any[][]) => void;
  replaceData: (data: any[][]) => void;
  mergeData: (data: any[][]) => void;
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

  heightMode: 'auto' | 'standard' | 'aspect';
  setHeightMode: (mode: 'auto' | 'standard' | 'aspect') => void;

  aggregationMode: 'none' | 'sum' | 'average' | 'count';
  setAggregationMode: (mode: 'none' | 'sum' | 'average' | 'count') => void;

  // Preview settings
  previewWidth: number;
  setPreviewWidth: (width: number) => void;

  previewHeight: number;
  setPreviewHeight: (height: number) => void;

  previewDevice: 'mobile' | 'tablet' | 'desktop';
  setPreviewDevice: (device: 'mobile' | 'tablet' | 'desktop') => void;

  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  setColorblindMode: (mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia') => void;

  darkModePreview: 'light' | 'dark';
  setDarkModePreview: (mode: 'light' | 'dark') => void;

  // Chart metadata
  chartTitle: string;
  setChartTitle: (title: string) => void;

  chartDescription: string;
  setChartDescription: (description: string) => void;

  chartFooter: string;
  setChartFooter: (footer: string) => void;

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
  setLayoutBackgroundImageSize: (size: 'fill' | 'fit' | 'original' | 'stretch') => void;

  layoutBackgroundImagePosition: 'top-left' | 'top-right' | 'top-center' | 'center' | 'center-left' | 'center-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
  setLayoutBackgroundImagePosition: (position: 'top-left' | 'top-right' | 'top-center' | 'center' | 'center-left' | 'center-right' | 'bottom-left' | 'bottom-right' | 'bottom-center') => void;

  layoutOrder: string;
  setLayoutOrder: (order: string) => void;

  layoutSpaceBetweenSections: 'none' | 'tight' | 'loose' | 'large';
  setLayoutSpaceBetweenSections: (space: 'none' | 'tight' | 'loose' | 'large') => void;

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
  // Initial data state
  dataTable: null,
  setDataTable: (data) => set({ dataTable: data }),

  // Initial spreadsheet data
  data: (() => {
    const initialData = [
      ['Role', 'Media', 'Finance', 'Health', 'Education'],
      ['Analyst', '25', '21', '18', '9'],
      ['Journalist', '12', '9', '7', '10'],
      ['Marketing', '4', '3', '6', '3'],
      ['Sales', '3', '5', '2', '1'],
    ];
    return initialData;
  })(),
  setData: (data) => {
    // Clean data to remove empty rows and columns
    const cleanedData = cleanData(data);
    set({ data: cleanedData });

    // Extract column names from first row
    if (cleanedData.length > 0 && cleanedData[0]) {
      const columnNames = cleanedData[0].map((col: any) => String(col || ''));
      set({ availableColumns: columnNames });

      // Infer column types
      const types = inferAllColumnTypes(cleanedData);
      set({ columnTypes: types });

      // Update column mapping if columns were deleted
      const { columnMapping } = get();
      const maxIndex = columnNames.length - 1;

      // Filter out column indices that no longer exist
      const newMapping = {
        labels: columnMapping.labels !== null && columnMapping.labels <= maxIndex
          ? columnMapping.labels
          : null,
        values: columnMapping.values.filter(idx => idx <= maxIndex),
        chartsGrid: columnMapping.chartsGrid !== null && columnMapping.chartsGrid <= maxIndex
          ? columnMapping.chartsGrid
          : null,
        rowFilter: columnMapping.rowFilter !== null && columnMapping.rowFilter <= maxIndex
          ? columnMapping.rowFilter
          : null,
        customPopups: columnMapping.customPopups !== null && columnMapping.customPopups <= maxIndex
          ? columnMapping.customPopups
          : null,
      };

      set({ columnMapping: newMapping });
    } else {
      set({ availableColumns: [] });
      set({ columnTypes: [] });
    }
  },
  replaceData: (newData) => {
    // Clean data to remove empty rows and columns
    const cleanedData = cleanData(newData);
    set({ data: cleanedData });

    // Extract column names from first row
    if (cleanedData.length > 0) {
      const columnNames = cleanedData[0].map((col: any) => String(col));
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
  availableColumns: ['Role', 'Media', 'Finance', 'Health', 'Education'],
  setAvailableColumns: (columns) => set({ availableColumns: columns }),

  // Column types - initialize with inferred types for initial data
  columnTypes: (() => {
    const initialData = [
      ['Role', 'Media', 'Finance', 'Health', 'Education'],
      ['Analyst', '25', '21', '18', '9'],
      ['Journalist', '12', '9', '7', '10'],
      ['Marketing', '4', '3', '6', '3'],
      ['Sales', '3', '5', '2', '1'],
    ];
    return inferAllColumnTypes(initialData);
  })(),
  setColumnTypes: (types) => set({ columnTypes: types }),

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

  heightMode: 'auto',
  setHeightMode: (mode) => set({ heightMode: mode }),

  aggregationMode: 'sum',
  setAggregationMode: (mode) => set({ aggregationMode: mode }),

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

  // Chart metadata
  chartTitle: '',
  setChartTitle: (title) => set({ chartTitle: title }),

  chartDescription: '',
  setChartDescription: (description) => set({ chartDescription: description }),

  chartFooter: '',
  setChartFooter: (footer) => set({ chartFooter: footer }),

  // Layout settings
  layoutMainFont: 'Inter',
  setLayoutMainFont: (font) => set({ layoutMainFont: font }),

  layoutTextColor: '#000000',
  setLayoutTextColor: (color) => set({ layoutTextColor: color }),

  layoutBackgroundColorEnabled: true,
  setLayoutBackgroundColorEnabled: (enabled) => set({ layoutBackgroundColorEnabled: enabled }),

  layoutBackgroundImageEnabled: false,
  setLayoutBackgroundImageEnabled: (enabled) => set({ layoutBackgroundImageEnabled: enabled }),

  layoutBackgroundColor: '#ffffff',
  setLayoutBackgroundColor: (color) => set({ layoutBackgroundColor: color }),

  layoutBackgroundImageUrl: '',
  setLayoutBackgroundImageUrl: (url) => set({ layoutBackgroundImageUrl: url }),

  layoutBackgroundImageSize: 'fill',
  setLayoutBackgroundImageSize: (size) => set({ layoutBackgroundImageSize: size }),

  layoutBackgroundImagePosition: 'center',
  setLayoutBackgroundImagePosition: (position) => set({ layoutBackgroundImagePosition: position }),

  layoutOrder: 'header-controls-legend-primary-graphic-footer',
  setLayoutOrder: (order) => set({ layoutOrder: order }),

  layoutSpaceBetweenSections: 'loose',
  setLayoutSpaceBetweenSections: (space) => set({ layoutSpaceBetweenSections: space }),

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
  setLayoutPaddingBottom: (padding) => set({ layoutPaddingBottom: padding }),

  layoutPaddingLeft: 24,
  setLayoutPaddingLeft: (padding) => set({ layoutPaddingLeft: padding }),

  layoutBorderEnabled: false,
  setLayoutBorderEnabled: (enabled) => set({ layoutBorderEnabled: enabled }),

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
  setLayoutReadDirection: (direction) => set({ layoutReadDirection: direction }),

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
  setLegendBaseFontSizeMobile: (size) => set({ legendBaseFontSizeMobile: size }),

  legendBaseFontSizeTablet: 14, // 14px base for tablet
  setLegendBaseFontSizeTablet: (size) => set({ legendBaseFontSizeTablet: size }),

  legendBaseFontSizeDesktop: 16, // 16px base for desktop
  setLegendBaseFontSizeDesktop: (size) => set({ legendBaseFontSizeDesktop: size }),

  legendShowValues: false,
  setLegendShowValues: (show) => set({ legendShowValues: show }),

  legendGap: 20,
  setLegendGap: (gap) => set({ legendGap: gap }),

  legendPaddingTop: 0,
  setLegendPaddingTop: (padding) => set({ legendPaddingTop: padding }),

  legendPaddingRight: 0,
  setLegendPaddingRight: (padding) => set({ legendPaddingRight: padding }),

  legendPaddingBottom: 0,
  setLegendPaddingBottom: (padding) => set({ legendPaddingBottom: padding }),

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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        data: state.data,
        columnMapping: state.columnMapping,
        availableColumns: state.availableColumns,
        columnTypes: state.columnTypes,
        chartType: state.chartType,
        chartConfig: state.chartConfig,
        theme: state.theme,
        gridMode: state.gridMode,
        heightMode: state.heightMode,
        aggregationMode: state.aggregationMode,
        previewWidth: state.previewWidth,
        previewHeight: state.previewHeight,
        previewDevice: state.previewDevice,
        colorblindMode: state.colorblindMode,
        darkModePreview: state.darkModePreview,
        chartTitle: state.chartTitle,
        chartDescription: state.chartDescription,
        chartFooter: state.chartFooter,
        layoutMainFont: state.layoutMainFont,
        layoutTextColor: state.layoutTextColor,
        layoutBackgroundColorEnabled: state.layoutBackgroundColorEnabled,
        layoutBackgroundImageEnabled: state.layoutBackgroundImageEnabled,
        layoutBackgroundColor: state.layoutBackgroundColor,
        layoutBackgroundImageUrl: state.layoutBackgroundImageUrl,
        layoutBackgroundImageSize: state.layoutBackgroundImageSize,
        layoutBackgroundImagePosition: state.layoutBackgroundImagePosition,
        layoutOrder: state.layoutOrder,
        layoutSpaceBetweenSections: state.layoutSpaceBetweenSections,
        layoutMarginTop: state.layoutMarginTop,
        layoutMarginRight: state.layoutMarginRight,
        layoutMarginBottom: state.layoutMarginBottom,
        layoutMarginLeft: state.layoutMarginLeft,
        layoutPaddingTop: state.layoutPaddingTop,
        layoutPaddingRight: state.layoutPaddingRight,
        layoutPaddingBottom: state.layoutPaddingBottom,
        layoutPaddingLeft: state.layoutPaddingLeft,
        layoutBorderEnabled: state.layoutBorderEnabled,
        layoutBorderTop: state.layoutBorderTop,
        layoutBorderRight: state.layoutBorderRight,
        layoutBorderBottom: state.layoutBorderBottom,
        layoutBorderLeft: state.layoutBorderLeft,
        layoutBorderStyle: state.layoutBorderStyle,
        layoutBorderColor: state.layoutBorderColor,
        layoutBorderWidth: state.layoutBorderWidth,
        layoutBorderRadius: state.layoutBorderRadius,
        layoutReadDirection: state.layoutReadDirection,
        legendShow: state.legendShow,
        legendPosition: state.legendPosition,
        legendAlignment: state.legendAlignment,
        legendFontSize: state.legendFontSize,
        legendBaseFontSizeMobile: state.legendBaseFontSizeMobile,
        legendBaseFontSizeTablet: state.legendBaseFontSizeTablet,
        legendBaseFontSizeDesktop: state.legendBaseFontSizeDesktop,
        legendShowValues: state.legendShowValues,
        legendGap: state.legendGap,
        legendPaddingTop: state.legendPaddingTop,
        legendPaddingRight: state.legendPaddingRight,
        legendPaddingBottom: state.legendPaddingBottom,
        legendPaddingLeft: state.legendPaddingLeft,
      }),
    }
  )
);
