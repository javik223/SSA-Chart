/**
 * Utility functions for data manipulation
 */

/**
 * Check if a value is empty (null, undefined, empty string, or whitespace)
 */
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || String(value).trim() === '';
}

/**
 * Check if a row is completely empty
 */
export function isRowEmpty(row: any[]): boolean {
  return row.every(isEmpty);
}

/**
 * Check if a column is completely empty
 */
export function isColumnEmpty(data: any[][], colIndex: number): boolean {
  return data.every((row) => isEmpty(row[colIndex]));
}

/**
 * Remove trailing empty rows and columns from data
 * Preserves at least the header row
 */
export function cleanData(data: any[][]): any[][] {
  if (!data || data.length === 0) {
    return data;
  }

  // Make a copy to avoid mutating original
  let cleanedData = [...data.map((row) => [...row])];

  // Remove trailing empty rows (keep at least header row)
  while (cleanedData.length > 1 && isRowEmpty(cleanedData[cleanedData.length - 1])) {
    cleanedData.pop();
  }

  // If all data rows are gone, keep header + one empty row
  if (cleanedData.length === 0) {
    return [[]];
  }

  // Remove trailing empty columns
  if (cleanedData.length > 0) {
    let maxNonEmptyCol = -1;

    // Find the rightmost non-empty column
    for (let colIndex = 0; colIndex < cleanedData[0].length; colIndex++) {
      if (!isColumnEmpty(cleanedData, colIndex)) {
        maxNonEmptyCol = colIndex;
      }
    }

    // Trim all rows to remove empty columns
    if (maxNonEmptyCol >= 0) {
      cleanedData = cleanedData.map((row) => row.slice(0, maxNonEmptyCol + 1));
    } else {
      // All columns are empty, keep just one column
      cleanedData = cleanedData.map(() => ['']);
    }
  }

  return cleanedData;
}

/**
 * Remove all empty rows from data (except header)
 */
export function removeEmptyRows(data: any[][]): any[][] {
  if (!data || data.length === 0) {
    return data;
  }

  // Keep header row, filter out empty data rows
  const header = data[0];
  const dataRows = data.slice(1).filter((row) => !isRowEmpty(row));

  return [header, ...dataRows];
}
