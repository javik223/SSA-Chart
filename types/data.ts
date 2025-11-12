/**
 * Data type definitions for Claude Charts
 */

export type DataFieldType = 'number' | 'string' | 'date' | 'category';

export interface DataField {
  name: string;
  type: DataFieldType;
  required?: boolean;
}

export interface DataRow {
  [key: string]: string | number | Date | null;
}

export interface DataTable {
  fields: DataField[];
  rows: DataRow[];
  name?: string;
  source?: string;
}

export interface FileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface ParseResult {
  success: boolean;
  data?: DataTable;
  errors?: ParseError[];
}

export interface ParseError {
  row?: number;
  column?: string;
  message: string;
  type: 'validation' | 'format' | 'missing';
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'numeric' | 'date' | 'unique';
  message?: string;
}
