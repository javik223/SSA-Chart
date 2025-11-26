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

  // Reset action
  resetChart: () =>
    set({
      // Note: DataSlice properties should be reset in the composed store or by calling multiple reset functions?
      // Or resetChart resets everything?
      // In the original store, resetChart reset everything.
      // Here, resetChart is in ChartSlice, but it should probably reset other slices too.
      // However, since we are composing, `set` works on the whole store.
      // So I can reset properties from other slices here IF I know about them.
      // But to keep slices independent, maybe I should have a root `reset` or each slice has `reset`.
      // The original `resetChart` reset `dataTable`, `chartData`, `data`, `availableColumns`, `columnMapping`, `chartType`, `chartConfig`.
      // I will implement `resetChart` to reset ChartSlice properties here.
      // And I'll need to make sure `DataSlice` has a reset or `resetChart` in the root store calls multiple resets.
      // Actually, `resetChart` in the original store reset EVERYTHING.
      // I'll keep it simple: `resetChart` here resets chart-related things.
      // I'll add `resetData` to DataSlice?
      // Or I can just set the properties I know about in this slice.
      // But `resetChart` was a global action.
      // I'll leave `resetChart` in `ChartSlice` for now, but I might need to move it to a `RootSlice` or similar if it needs to touch multiple slices.
      // For now, I'll just reset what's in this slice + the data stuff if I can access it via `set` (which I can, but types might complain).
      // I'll just reset ChartSlice state here.
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
    }),
});
