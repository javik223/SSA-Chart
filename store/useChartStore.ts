/**
 * Global state management for Claude Charts using Zustand with persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/utils/indexedDBStorage';

import { createDataSlice, DataSlice } from './slices/DataSlice';
import { createChartSlice, ChartSlice } from './slices/ChartSlice';
import { createUISlice, UISlice } from './slices/UISlice';
import { createStyleSlice, StyleSlice } from './slices/StyleSlice';
import { createTextSlice, TextSlice } from './slices/TextSlice';
import { createAxisSlice, AxisSlice } from './slices/AxisSlice';
import { createChartSpecificSlice, ChartSpecificSlice } from './slices/ChartSpecificSlice';

// Re-export shared types
export type { ColumnMapping } from './interfaces';

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

export type ChartStore = DataSlice &
  ChartSlice &
  UISlice &
  StyleSlice &
  TextSlice &
  AxisSlice &
  ChartSpecificSlice;

export const useChartStore = create<ChartStore>()(
  persist(
    (...a) => ({
      ...createDataSlice(...a),
      ...createChartSlice(...a),
      ...createUISlice(...a),
      ...createStyleSlice(...a),
      ...createTextSlice(...a),
      ...createAxisSlice(...a),
      ...createChartSpecificSlice(...a),
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
