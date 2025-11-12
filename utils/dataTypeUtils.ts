/**
 * Data type inference and validation utilities
 */

export type ColumnType = 'text' | 'number' | 'percentage' | 'date' | 'boolean' | 'mixed';

export interface ColumnTypeInfo {
  type: ColumnType;
  confidence: number; // 0-1, how confident we are about the type
  sampleValues: any[];
}

/**
 * Check if a value is a valid number
 */
function isNumber(value: any): boolean {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Check if a value is a valid date
 */
function isDate(value: any): boolean {
  if (value === null || value === undefined || value === '') return false;
  const dateValue = new Date(value);
  return dateValue instanceof Date && !isNaN(dateValue.getTime());
}

/**
 * Check if a value is a boolean
 */
function isBoolean(value: any): boolean {
  if (value === null || value === undefined) return false;
  const str = String(value).toLowerCase().trim();
  return ['true', 'false', 'yes', 'no', '1', '0'].includes(str);
}

/**
 * Check if a value is a percentage
 */
function isPercentage(value: any): boolean {
  if (value === null || value === undefined || value === '') return false;
  const str = String(value).trim();

  // Check if value contains % symbol
  if (!str.includes('%')) return false;

  // Extract numeric part (remove % and any whitespace)
  const numericPart = str.replace(/%/g, '').trim();

  // Check if the remaining part is a valid number
  const num = Number(numericPart);
  return !isNaN(num) && isFinite(num);
}

/**
 * Infer the data type of a column based on its values
 */
export function inferColumnType(
  data: any[][],
  columnIndex: number,
  sampleSize: number = 100
): ColumnTypeInfo {
  // Skip header row, start from row 1
  const values = data
    .slice(1)
    .map((row) => row[columnIndex])
    .filter((val) => val !== null && val !== undefined && val !== '')
    .slice(0, sampleSize);

  if (values.length === 0) {
    return { type: 'text', confidence: 0, sampleValues: [] };
  }

  let numberCount = 0;
  let percentageCount = 0;
  let dateCount = 0;
  let booleanCount = 0;
  let textCount = 0;

  values.forEach((value) => {
    if (isBoolean(value)) {
      booleanCount++;
    } else if (isPercentage(value)) {
      percentageCount++;
    } else if (isNumber(value)) {
      numberCount++;
    } else if (isDate(value)) {
      dateCount++;
    } else {
      textCount++;
    }
  });

  const total = values.length;
  const counts = [
    { type: 'boolean' as ColumnType, count: booleanCount },
    { type: 'percentage' as ColumnType, count: percentageCount },
    { type: 'number' as ColumnType, count: numberCount },
    { type: 'date' as ColumnType, count: dateCount },
    { type: 'text' as ColumnType, count: textCount },
  ];

  // Sort by count descending
  counts.sort((a, b) => b.count - a.count);

  const dominantType = counts[0];
  const confidence = dominantType.count / total;

  // If confidence is low (< 0.7), mark as mixed
  if (confidence < 0.7 && counts[1].count > 0) {
    return {
      type: 'mixed',
      confidence,
      sampleValues: values.slice(0, 5),
    };
  }

  return {
    type: dominantType.type,
    confidence,
    sampleValues: values.slice(0, 5),
  };
}

/**
 * Infer types for all columns in the dataset
 */
export function inferAllColumnTypes(data: any[][]): ColumnTypeInfo[] {
  if (data.length === 0) return [];

  const columnCount = data[0].length;
  const types: ColumnTypeInfo[] = [];

  for (let col = 0; col < columnCount; col++) {
    types.push(inferColumnType(data, col));
  }

  return types;
}

/**
 * Get icon/emoji for column type
 */
export function getColumnTypeIcon(type: ColumnType): string {
  switch (type) {
    case 'text':
      return 'ABC';
    case 'number':
      return '123';
    case 'percentage':
      return '%';
    case 'date':
      return '📅';
    case 'boolean':
      return '✓/✗';
    case 'mixed':
      return '※';
    default:
      return 'ABC';
  }
}

/**
 * Get color for column type
 */
export function getColumnTypeColor(type: ColumnType): string {
  switch (type) {
    case 'text':
      return 'text-blue-600';
    case 'number':
      return 'text-green-600';
    case 'percentage':
      return 'text-emerald-600';
    case 'date':
      return 'text-purple-600';
    case 'boolean':
      return 'text-orange-600';
    case 'mixed':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Validate if a value matches the expected column type
 */
export function validateColumnValue(value: any, type: ColumnType): boolean {
  if (value === null || value === undefined || value === '') {
    return true; // Empty values are always valid
  }

  switch (type) {
    case 'number':
      return isNumber(value);
    case 'percentage':
      return isPercentage(value);
    case 'date':
      return isDate(value);
    case 'boolean':
      return isBoolean(value);
    case 'text':
      return true; // Text always valid
    case 'mixed':
      return true; // Mixed always valid
    default:
      return true;
  }
}

/**
 * Format column type info for display
 */
export function formatColumnTypeInfo(info: ColumnTypeInfo): string {
  const percentage = Math.round(info.confidence * 100);
  return `${info.type} (${percentage}% confidence)`;
}
