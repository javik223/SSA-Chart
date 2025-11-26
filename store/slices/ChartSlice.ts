import { StateCreator } from 'zustand';
import { ChartConfig, ChartData, ChartType } from '@/types';

export interface ChartSlice {
  // Chart state
  chartType: ChartType;
  setChartType: (type: ChartType) => void;

  chartConfig: ChartConfig;
  setChartConfig: (config: Partial<ChartConfig>) => void;

  showOnChartControls: boolean;
  setShowOnChartControls: (show: boolean) => void;

  chartData: ChartData | null;
  setChartData: (data: ChartData | null) => void;

  // Current chart ID (for editing saved charts)
  currentChartId: string | null;
  setCurrentChartId: (id: string | null) => void;

  // Grid settings
  gridMode: 'single' | 'grid';
  setGridMode: (mode: 'single' | 'grid') => void;
  
  gridSplitBy: 'label' | 'value';
  setGridSplitBy: (splitBy: 'label' | 'value') => void;
  
  gridColumns: number;
  setGridColumns: (columns: number) => void;

  gridColumnsMobile: number;
  setGridColumnsMobile: (columns: number) => void;

  gridAspectRatio: string;
  setGridAspectRatio: (ratio: string) => void;

  heightMode: 'auto' | 'standard' | 'aspect';
  setHeightMode: (mode: 'auto' | 'standard' | 'aspect') => void;

  aggregationMode: 'none' | 'sum' | 'average' | 'count';
  setAggregationMode: (mode: 'none' | 'sum' | 'average' | 'count') => void;

  // Actions
  resetChart: () => void;
  loadChartState: (state: any) => void;
}

export const createChartSlice: StateCreator<ChartSlice, [], [], ChartSlice> = (set) => ({
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

  showOnChartControls: false,
  setShowOnChartControls: (show) => set({ showOnChartControls: show }),

  chartData: null,
  setChartData: (data) => set({ chartData: data }),

  currentChartId: null,
  setCurrentChartId: (id) => set({ currentChartId: id }),

  gridMode: 'single',
  setGridMode: (mode) => set({ gridMode: mode }),

  gridSplitBy: 'value',
  setGridSplitBy: (splitBy) => set({ gridSplitBy: splitBy }),
  
  gridColumns: 2,
  setGridColumns: (columns) => set({ gridColumns: columns }),

  gridColumnsMobile: 1,
  setGridColumnsMobile: (columns) => set({ gridColumnsMobile: columns }),

  gridAspectRatio: '16/9',
  setGridAspectRatio: (ratio) => set({ gridAspectRatio: ratio }),

  heightMode: 'auto',
  setHeightMode: (mode) => set({ heightMode: mode }),

  aggregationMode: 'sum',
  setAggregationMode: (mode) => set({ aggregationMode: mode }),

  // Reset action - resets ALL state to initial values (used for "New Chart")
  resetChart: () =>
    set({
      // Reset chart type and config
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
      chartData: null,

      // Clear current chart ID (very important for "New Chart" functionality)
      currentChartId: null,

      // Reset grid settings
      gridMode: 'single',
      gridSplitBy: 'value',
      gridColumns: 2,
      gridColumnsMobile: 1,
      gridAspectRatio: '16:9',

      // Reset other chart settings
      heightMode: 'auto',
      aggregationMode: 'sum',
      showOnChartControls: false,

      // Reset data-related properties (from DataSlice)
      dataTable: null,
      data: Array(6).fill(Array(5).fill('')),
      columnMapping: {
        labels: null,
        values: [],
        series: null,
        chartsGrid: null,
        rowFilter: null,
        customPopups: null,
        categories: null,
      },
      availableColumns: [],
      columnTypes: [],
      dataRowCount: 0,
      dataColCount: 0,
      currentPage: 1,
      filterColumn: null,
      filterValue: '',
      sortColumn: null,
      sortDirection: null,
    } as any), // Using 'as any' because we're resetting properties from multiple slices

  loadChartState: (state) => set((currentState) => ({ ...currentState, ...state })),
});
