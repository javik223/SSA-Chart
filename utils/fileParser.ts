/**
 * File parser utility for handling CSV, Excel, TSV, JSON, and GeoJSON files
 */

import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export interface ParseResult {
  data: any[][];
  success: boolean;
  error?: string;
}

/**
 * Parse CSV file
 */
export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve({
          data: results.data as any[][],
          success: true,
        });
      },
      error: (error) => {
        resolve({
          data: [],
          success: false,
          error: error.message,
        });
      },
    });
  });
}

/**
 * Parse TSV file
 */
export function parseTSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      delimiter: '\t',
      complete: (results) => {
        resolve({
          data: results.data as any[][],
          success: true,
        });
      },
      error: (error) => {
        resolve({
          data: [],
          success: false,
          error: error.message,
        });
      },
    });
  });
}

/**
 * Parse Excel file (xlsx, xls)
 */
export function parseExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to array of arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        }) as any[][];

        resolve({
          data: jsonData,
          success: true,
        });
      } catch (error) {
        resolve({
          data: [],
          success: false,
          error: error instanceof Error ? error.message : 'Failed to parse Excel file',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        data: [],
        success: false,
        error: 'Failed to read file',
      });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Parse JSON file
 */
export function parseJSON(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const jsonData = JSON.parse(text);

        // Convert JSON to 2D array
        let data: any[][];

        if (Array.isArray(jsonData)) {
          // If it's an array of objects, convert to 2D array
          if (jsonData.length > 0 && typeof jsonData[0] === 'object' && !Array.isArray(jsonData[0])) {
            const keys = Object.keys(jsonData[0]);
            data = [
              keys,
              ...jsonData.map((obj) => keys.map((key) => obj[key] ?? '')),
            ];
          } else {
            // If it's already an array of arrays
            data = jsonData;
          }
        } else if (typeof jsonData === 'object' && jsonData !== null) {
          // Handle hierarchical/nested objects by flattening them
          // This is useful for tree structures like sunburst data
          const flattenedRows: any[] = [];
          
          function flattenNode(node: any, path: string = '', depth: number = 0) {
            const row: any = {
              name: node.name || 'root',
              path: path || node.name || 'root',
              depth: depth,
              value: node.value || 0,
            };
            
            // Add any other properties
            Object.keys(node).forEach(key => {
              if (key !== 'name' && key !== 'children' && key !== 'value') {
                row[key] = node[key];
              }
            });
            
            flattenedRows.push(row);
            
            // Recursively process children
            if (node.children && Array.isArray(node.children)) {
              node.children.forEach((child: any) => {
                const childPath = path ? `${path}/${child.name || 'unnamed'}` : (child.name || 'unnamed');
                flattenNode(child, childPath, depth + 1);
              });
            }
          }
          
          flattenNode(jsonData);
          
          if (flattenedRows.length > 0) {
            const keys = Object.keys(flattenedRows[0]);
            data = [
              keys,
              ...flattenedRows.map((obj) => keys.map((key) => obj[key] ?? '')),
            ];
          } else {
            resolve({
              data: [],
              success: false,
              error: 'Could not extract data from JSON object',
            });
            return;
          }
        } else {
          resolve({
            data: [],
            success: false,
            error: 'JSON must be an array or object',
          });
          return;
        }

        resolve({
          data,
          success: true,
        });
      } catch (error) {
        resolve({
          data: [],
          success: false,
          error: error instanceof Error ? error.message : 'Failed to parse JSON file',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        data: [],
        success: false,
        error: 'Failed to read file',
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Parse GeoJSON file
 */
export function parseGeoJSON(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const geoJsonData = JSON.parse(text);

        // Extract features and properties
        if (geoJsonData.type === 'FeatureCollection' && Array.isArray(geoJsonData.features)) {
          const features = geoJsonData.features;

          if (features.length === 0) {
            resolve({
              data: [],
              success: false,
              error: 'GeoJSON has no features',
            });
            return;
          }

          // Get all property keys
          const keys = new Set<string>();
          features.forEach((feature: any) => {
            if (feature.properties) {
              Object.keys(feature.properties).forEach((key) => keys.add(key));
            }
          });

          const headers = Array.from(keys);
          const data = [
            headers,
            ...features.map((feature: any) =>
              headers.map((key) => feature.properties?.[key] ?? '')
            ),
          ];

          resolve({
            data,
            success: true,
          });
        } else {
          resolve({
            data: [],
            success: false,
            error: 'Invalid GeoJSON format',
          });
        }
      } catch (error) {
        resolve({
          data: [],
          success: false,
          error: error instanceof Error ? error.message : 'Failed to parse GeoJSON file',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        data: [],
        success: false,
        error: 'Failed to read file',
      });
    };

    reader.readAsText(file);
  });
}

/**
 * Main file parser that detects file type and uses appropriate parser
 */
export async function parseFile(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCSV(file);
    case 'tsv':
    case 'txt':
      return parseTSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'json':
      return parseJSON(file);
    case 'geojson':
      return parseGeoJSON(file);
    default:
      return {
        data: [],
        success: false,
        error: `Unsupported file type: ${extension}`,
      };
  }
}
