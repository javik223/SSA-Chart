import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { listCharts, SavedChart } from '@/lib/chartStorage';

interface RecentChartsState {
  charts: SavedChart[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  fetchRecentCharts: (background?: boolean) => Promise<void>;
}

export const useRecentChartsStore = create<RecentChartsState>()(
  persist(
    (set) => ({
      charts: [],
      isLoading: false,
      error: null,
      lastUpdated: null,
      fetchRecentCharts: async (background = false) => {
        // If not background fetch, set loading state
        if (!background) {
          set({ isLoading: true, error: null });
        }

        try {
          const charts = await listCharts(10);

          // Update store with new charts
          set({
            charts,
            isLoading: false,
            lastUpdated: Date.now(),
            error: null
          });
        } catch (error) {
          console.error('Failed to fetch recent charts:', error);
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch recent charts',
            isLoading: false
          });
        }
      }
    }),
    {
      name: 'recent-charts-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        charts: state.charts,
        lastUpdated: state.lastUpdated,
        // Don't persist loading and error states
      }),
    }
  )
);
