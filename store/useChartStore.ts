/**
 * Global state management for Claude Charts using Zustand
 */

import { create } from 'zustand';
import { ChartConfig, ChartData, ChartType } from '@/types';
import { DataTable } from '@/types';

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

  // Column mapping
  columnMapping: ColumnMapping;
  setColumnMapping: (mapping: Partial<ColumnMapping>) => void;
  autoSetColumns: () => void;

  // Available columns from data
  availableColumns: string[];
  setAvailableColumns: (columns: string[]) => void;

  // Chart state
  chartType: ChartType;
  setChartType: (type: ChartType) => void;

  chartConfig: ChartConfig;
  setChartConfig: (config: Partial<ChartConfig>) => void;

  chartData: ChartData | null;
  setChartData: (data: ChartData | null) => void;

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

export const useChartStore = create<ChartStore>((set, get) => ({
  // Initial data state
  dataTable: null,
  setDataTable: (data) => set({ dataTable: data }),

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
  availableColumns: [],
  setAvailableColumns: (columns) => set({ availableColumns: columns }),

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
}));
