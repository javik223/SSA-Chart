'use client';

import { useEffect, useRef, useState } from 'react';
import { useChartStore } from '@/store/useChartStore';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import Handsontable from 'handsontable/base';
import { HotColumn, HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';

registerAllModules();

interface DataGridProps {
  data?: any[][];
  columns?: string[];
  onDataChange?: (data: any[][]) => void;
}

export function DataGrid({ data, columns, onDataChange }: DataGridProps) {
  const { setAvailableColumns, columnMapping, autoSetColumns } =
    useChartStore();
  const hasAutoSet = useRef(false);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    const columnNames = data[0].map((col: any) => String(col));
    setAvailableColumns(columnNames);
    // Auto-set columns on first load
    if (!hasAutoSet.current && columnNames.length > 0) {
      autoSetColumns();
      hasAutoSet.current = true;
    }
  }, [data, setAvailableColumns, columnMapping, autoSetColumns]);

  const handleDataChange = (newData: Handsontable.CellValue[][]) => {
    if (onDataChange) {
      onDataChange(newData as any[][]);
    }
  };

  return (
    <HotTable
      themeName='ht-theme-main'
      className='w-full h-full'
      // other options
      data={data}
      rowHeaders={true}
      colHeaders={true}
      height='100%'
      width='100%'
      contextMenu={true}
      minSpareRows={1}
      stretchH='all'
      licenseKey='non-commercial-and-evaluation'
      manualColumnResize={true}
      manualRowResize={true}
      manualColumnMove={true}
      manualRowMove={true}
      dropdownMenu={true}
      filters={true}
      multiColumnSorting={true}
      dataDotNotation={true}
      textEllipsis={true}
      wordWrap={true}
      search={true}
      manualColumnFreeze={true}
      cells={(row, col) => {
        const cellProperties: any = {};

        // First row styling (header row)
        if (row === 0) {
          cellProperties.className = 'htCenter htMiddle font-semibold';
          if (col === columnMapping.labels) {
            cellProperties.className += ' bg-pink-100';
          } else if (columnMapping.values.includes(col)) {
            cellProperties.className += ' bg-purple-100';
          }
        }

        return cellProperties;
      }}
      afterChange={(changes) => {
        if (changes) {
          const newData = [...data];
          changes.forEach(([row, col, , newValue]) => {
            newData[row][col] = newValue;
          });
          handleDataChange(newData);
        }
      }}
    />
  );
}
