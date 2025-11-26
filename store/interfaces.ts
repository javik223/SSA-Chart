import { ColumnTypeInfo } from '@/utils/dataTypeUtils';

export interface ColumnMapping {
  labels: number | null; // Column index for labels/time
  values: number[]; // Column indices for values
  series: number | null; // Column index for series (for long-format data)
  chartsGrid: number | null;
  rowFilter: number | null;
  customPopups: number | null;
  categories: number[] | null;
}
