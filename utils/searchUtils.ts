/**
 * Efficient search utilities for large datasets
 */

export interface SearchResult {
  row: number;
  col: number;
  value: string;
}

/**
 * Perform case-insensitive search across data
 * Optimized for large datasets with early termination
 */
export function searchData(
  data: any[][],
  query: string,
  maxResults: number = 100
): SearchResult[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const results: SearchResult[] = [];
  const normalizedQuery = query.toLowerCase().trim();

  // Early termination when we reach max results
  for (let row = 0; row < data.length && results.length < maxResults; row++) {
    const rowData = data[row];
    if (!rowData) continue;

    for (let col = 0; col < rowData.length && results.length < maxResults; col++) {
      const cellValue = rowData[col];
      if (cellValue == null) continue;

      const normalizedValue = String(cellValue).toLowerCase();
      if (normalizedValue.includes(normalizedQuery)) {
        results.push({
          row,
          col,
          value: String(cellValue),
        });
      }
    }
  }

  return results;
}

/**
 * Highlight cells in Handsontable based on search results
 */
export function getCellClassName(
  row: number,
  col: number,
  searchResults: SearchResult[],
  columnMapping: any
): string {
  let className = '';

  // First row styling (header row)
  if (row === 0) {
    className = 'htCenter htMiddle font-semibold';
    if (col === columnMapping.labels) {
      className += ' bg-pink-100';
    } else if (columnMapping.values.includes(col)) {
      className += ' bg-purple-100';
    }
  }

  // Search highlight
  const isSearchResult = searchResults.some(
    (result) => result.row === row && result.col === col
  );
  if (isSearchResult) {
    className += ' bg-yellow-200';
  }

  return className;
}
