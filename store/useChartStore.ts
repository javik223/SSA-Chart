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
  layoutPaddingTop: number;
  setLayoutPaddingTop: (padding: number) => void;

  layoutPaddingRight: number;
  setLayoutPaddingRight: (padding: number) => void;

  layoutPaddingBottom: number;
  setLayoutPaddingBottom: (padding: number) => void;

  layoutPaddingLeft: number;
  setLayoutPaddingLeft: (padding: number) => void;

  layoutBackgroundColor: string;
  setLayoutBackgroundColor: (color: string) => void;

  layoutBorderRadius: number;
  setLayoutBorderRadius: (radius: number) => void;

  layoutBorderWidth: number;
  setLayoutBorderWidth: (width: number) => void;

  layoutBorderColor: string;
  setLayoutBorderColor: (color: string) => void;

  // Legend settings
  legendShow: boolean;
  setLegendShow: (show: boolean) => void;

  legendPosition: 'top' | 'right' | 'bottom' | 'left';
  setLegendPosition: (position: 'top' | 'right' | 'bottom' | 'left') => void;

  legendAlignment: 'start' | 'center' | 'end';
  setLegendAlignment: (alignment: 'start' | 'center' | 'end') => void;

  legendFontSize: number;
  setLegendFontSize: (size: number) => void;

  legendShowValues: boolean;
  setLegendShowValues: (show: boolean) => void;

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
  layoutPaddingTop: 24,
  setLayoutPaddingTop: (padding) => set({ layoutPaddingTop: padding }),

  layoutPaddingRight: 24,
  setLayoutPaddingRight: (padding) => set({ layoutPaddingRight: padding }),

  layoutPaddingBottom: 24,
  setLayoutPaddingBottom: (padding) => set({ layoutPaddingBottom: padding }),

  layoutPaddingLeft: 24,
  setLayoutPaddingLeft: (padding) => set({ layoutPaddingLeft: padding }),

  layoutBackgroundColor: '#ffffff',
  setLayoutBackgroundColor: (color) => set({ layoutBackgroundColor: color }),

  layoutBorderRadius: 0,
  setLayoutBorderRadius: (radius) => set({ layoutBorderRadius: radius }),

  layoutBorderWidth: 1,
  setLayoutBorderWidth: (width) => set({ layoutBorderWidth: width }),

  layoutBorderColor: '#e4e4e7',
  setLayoutBorderColor: (color) => set({ layoutBorderColor: color }),

  // Legend settings
  legendShow: true,
  setLegendShow: (show) => set({ legendShow: show }),

  legendPosition: 'right',
  setLegendPosition: (position) => set({ legendPosition: position }),

  legendAlignment: 'start',
  setLegendAlignment: (alignment) => set({ legendAlignment: alignment }),

  legendFontSize: 12,
  setLegendFontSize: (size) => set({ legendFontSize: size }),

  legendShowValues: false,
  setLegendShowValues: (show) => set({ legendShowValues: show }),

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
        layoutPaddingTop: state.layoutPaddingTop,
        layoutPaddingRight: state.layoutPaddingRight,
        layoutPaddingBottom: state.layoutPaddingBottom,
        layoutPaddingLeft: state.layoutPaddingLeft,
        layoutBackgroundColor: state.layoutBackgroundColor,
        layoutBorderRadius: state.layoutBorderRadius,
        layoutBorderWidth: state.layoutBorderWidth,
        layoutBorderColor: state.layoutBorderColor,
        legendShow: state.legendShow,
        legendPosition: state.legendPosition,
        legendAlignment: state.legendAlignment,
        legendFontSize: state.legendFontSize,
        legendShowValues: state.legendShowValues,
      }),
    }
  )
);
