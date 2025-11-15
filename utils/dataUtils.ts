/**
 * Utility functions for data manipulation
 */

/**
 * Check if a value is empty (null, undefined, empty string, or whitespace)
 */
export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === '';
}

/**
 * Check if a row is completely empty
 */
export function isRowEmpty(row: unknown[]): boolean {
  return row.every(isEmpty);
}

/**
 * Check if a column is completely empty
 */
export function isColumnEmpty(data: unknown[][], colIndex: number): boolean {
  return data.every((row) => isEmpty(row[colIndex]));
}

/**
 * Remove trailing empty rows and columns from data
 * Preserves at least the header row
 */
export function cleanData(data: unknown[][]): unknown[][] {
  if (!data || data.length === 0) {
    return data;
  }

  // Make a copy to avoid mutating original
  let cleanedData = [...data.map((row) => [...row])];

  // Remove trailing empty rows (keep at least header row)
  while (
    cleanedData.length > 1 &&
    isRowEmpty(cleanedData[cleanedData.length - 1])
  ) {
    cleanedData.pop();
  }

  // If all data rows are gone, keep header + one empty row
  if (cleanedData.length === 0) {
    return [[]];
  }

  // Identify all empty columns
  const emptyColumnIndices: number[] = [];
  if (cleanedData.length > 0) {
    for (let colIndex = 0; colIndex < cleanedData[0].length; colIndex++) {
      if (isColumnEmpty(cleanedData, colIndex)) {
        emptyColumnIndices.push(colIndex);
      }
    }
  }

  // Filter out empty columns from all rows
  if (emptyColumnIndices.length > 0) {
    cleanedData = cleanedData.map((row) =>
      row.filter((_, colIndex) => !emptyColumnIndices.includes(colIndex))
    );
  }

  // If after removing empty columns, all columns are gone, ensure at least one empty column remains
  if (cleanedData.length > 0 && cleanedData[0].length === 0) {
    cleanedData = cleanedData.map(() => ['']);
  }

  return cleanedData;
}

/**
 * Remove all empty rows from data (except header)
 */
export function removeEmptyRows(data: string[][]): string[][] {
  if (!data || data.length === 0) {
    return data;
  }

  // Keep header row, filter out empty data rows
  const header = data[0];
  const dataRows = data.slice(1).filter((row) => !isRowEmpty(row));

  return [header, ...dataRows];
}
