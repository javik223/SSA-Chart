import { StateCreator } from 'zustand';
import { DataTable } from '@/types';
import { cleanData } from '@/utils/dataUtils';
import { inferAllColumnTypes, ColumnTypeInfo } from '@/utils/dataTypeUtils';
import { ColumnMapping } from '../interfaces';

export interface DataSlice {
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
}

export const createDataSlice: StateCreator<DataSlice, [], [], DataSlice> = (set, get) => ({
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
          series: adjustIndex(columnMapping.series),
          chartsGrid: adjustIndex(columnMapping.chartsGrid),
          rowFilter: adjustIndex(columnMapping.rowFilter),
          customPopups: adjustIndex(columnMapping.customPopups),
          categories: adjustIndex(columnMapping.categories ? columnMapping.categories[0] : null) ? [adjustIndex(columnMapping.categories![0])!] : null,
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
          series:
            columnMapping.series !== null && columnMapping.series <= maxIndex
              ? columnMapping.series
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
          categories:
            columnMapping.categories !== null &&
            columnMapping.categories.every(c => c <= maxIndex)
              ? columnMapping.categories
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
          series: null,
          chartsGrid: null,
          rowFilter: null,
          customPopups: null,
          categories: null,
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
  columnMapping: { labels: null, values: [], series: null, chartsGrid: null, rowFilter: null, customPopups: null, categories: null },

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
          series: null,
          chartsGrid: null,
          rowFilter: null,
          customPopups: null,
          categories: null,
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
});
