'use client';

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { useChartStore } from '@/store/useChartStore';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnSizingState,
  type PaginationState,
  type Table as TableType,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getColumnTypeIcon } from '@/utils/dataTypeUtils';
import debounce from 'lodash.debounce';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import './data-grid.css';

interface DataGridProps {
  searchQuery?: string;
  shouldNavigate?: boolean;
  onNavigated?: () => void;
}

// Helper function to convert column index to Excel-style letter
const getColumnLetter = (index: number): string => {
  let letter = '';
  let num = index;
  while (num >= 0) {
    letter = String.fromCharCode((num % 26) + 65) + letter;
    num = Math.floor(num / 26) - 1;
  }
  return letter;
};

// Editable header cell component
function EditableHeaderCell({
  initialValue,
  colIndex,
  onUpdate,
  isEditing,
  onStartEdit,
  onStopEdit,
}: {
  initialValue: unknown;
  colIndex: number;
  onUpdate: (colIndex: number, value: unknown) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const saveValue = () => {
    onUpdate(colIndex, value);
    onStopEdit();
  };

  const cancelEdit = () => {
    setValue(initialValue);
    onStopEdit();
  };

  const onBlur = () => {
    saveValue();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveValue();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  if (!isEditing) {
    return (
      <div
        className="data-grid-cell-display"
        onClick={onStartEdit}
        onDoubleClick={onStartEdit}
      >
        {String(value ?? '')}
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="data-grid-cell-input"
    />
  );
}

// Editable cell component
function EditableCell({
  getValue,
  row,
  column,
  table,
}: {
  getValue: () => unknown;
  row: { index: number };
  column: { id: string };
  table: TableType<unknown[]>;
}) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const meta = table.options.meta as {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    stopEditing: () => void;
    startEditing: (rowIndex: number, colIndex: number) => void;
    editingCell: { rowIndex: number; colIndex: number } | null;
  };

  const colIndex = parseInt(column.id);
  const isEditing =
    meta?.editingCell?.rowIndex === row.index &&
    meta?.editingCell?.colIndex === colIndex;

  // Reset value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const saveValue = () => {
    meta?.updateData(row.index, column.id, value);
    meta?.stopEditing();
  };

  const cancelEdit = () => {
    setValue(initialValue);
    meta?.stopEditing();
  };

  const onStartEdit = () => {
    meta?.startEditing(row.index, colIndex);
  };

  const onBlur = () => {
    saveValue();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveValue();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  if (!isEditing) {
    return (
      <div
        className="data-grid-cell-display"
        onClick={onStartEdit}
        onDoubleClick={onStartEdit}
      >
        {String(value ?? '')}
      </div>
    );
  }

  return (
    <input
      ref={inputRef}
      value={value as string}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="data-grid-cell-input"
    />
  );
}

export const DataGrid = memo(function DataGrid({
  searchQuery = '',
  shouldNavigate = false,
  onNavigated,
}: DataGridProps) {
  const { data, setData, columnMapping, autoSetColumns, columnTypes } =
    useChartStore();
  const hasAutoSet = useRef(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(
    new Set()
  );
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }
    // Auto-set columns on first load
    if (!hasAutoSet.current && data.length > 0) {
      autoSetColumns();
      hasAutoSet.current = true;
    }
  }, [data, autoSetColumns]);

  // Debounced data update
  const debouncedSetData = useMemo(
    () =>
      debounce((newData: unknown[][]) => {
        setData(newData);
      }, 150),
    [setData]
  );

  // Update data handler (adjust for row offset since table excludes header row 0)
  const updateData = useCallback(
    (rowIndex: number, columnId: string, value: unknown) => {
      const colIndex = parseInt(columnId);
      // rowIndex from table is 0-based on dataRows, so actual row in data is rowIndex + 1
      const actualRowIndex = rowIndex + 1;
      const newData = data.map((row, index) => {
        if (index === actualRowIndex) {
          const newRow = [...row];
          newRow[colIndex] = value;
          return newRow;
        }
        return row;
      });
      debouncedSetData(newData);
    },
    [data, debouncedSetData]
  );

  // Update header row data (row 0)
  const updateHeaderData = useCallback(
    (colIndex: number, value: unknown) => {
      const newData = data.map((row, index) => {
        if (index === 0) {
          const newRow = [...row];
          newRow[colIndex] = value;
          return newRow;
        }
        return row;
      });
      debouncedSetData(newData);
    },
    [data, debouncedSetData]
  );

  // Search functionality (skip header row 0)
  useEffect(() => {
    if (!searchQuery || !data) {
      setHighlightedCells(new Set());
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matches = new Set<string>();

    // Skip row 0 (header), only search data rows
    data.forEach((row, rowIndex) => {
      if (rowIndex === 0) return; // Skip header row

      row.forEach((cell, colIndex) => {
        if (
          cell != null &&
          String(cell).toLowerCase().includes(normalizedQuery)
        ) {
          matches.add(`${rowIndex}-${colIndex}`);
        }
      });
    });

    setHighlightedCells(matches);
  }, [searchQuery, data]);

  // Navigate to first search result
  useEffect(() => {
    if (shouldNavigate && highlightedCells.size > 0) {
      const firstMatch = Array.from(highlightedCells)[0];
      const [row, col] = firstMatch.split('-').map(Number);

      // Scroll to the cell
      const tableContainer = tableContainerRef.current;
      if (tableContainer) {
        const cellElement = tableContainer.querySelector(
          `[data-row="${row}"][data-col="${col}"]`
        );
        cellElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      onNavigated?.();
    }
  }, [shouldNavigate, highlightedCells, onNavigated]);

  // Separate header row (row 0) from data rows (rows 1+) - memoize to prevent infinite loops
  const headerRow = useMemo(() => {
    return data && data.length > 0 ? data[0] : [];
  }, [data]);

  const dataRows = useMemo(() => {
    return data && data.length > 1 ? data.slice(1) : [];
  }, [data]);

  // Create columns from data
  const columns = useMemo<ColumnDef<unknown[]>[]>(() => {
    if (!data || data.length === 0) return [];

    const columnCount = data[0]?.length || 0;

    return Array.from({ length: columnCount }, (_, index) => ({
      id: String(index),
      accessorFn: (row: unknown[]) => row[index],
      header: () => {
        const type = columnTypes[index]?.type || 'text';
        const icon = getColumnTypeIcon(type);
        const letter = getColumnLetter(index);

        return (
          <div className="data-grid-column-header">
            <span className="data-grid-column-icon" title={type}>
              {icon}
            </span>
            <span className="data-grid-column-letter">{letter}</span>
          </div>
        );
      },
      cell: EditableCell,
      size: 120,
      minSize: 60,
      maxSize: 500,
    }));
  }, [data, columnTypes]);

  const startEditing = useCallback((rowIndex: number, colIndex: number) => {
    setEditingCell({ rowIndex, colIndex });
  }, []);

  const stopEditing = useCallback(() => {
    setEditingCell(null);
  }, []);

  const table = useReactTable({
    data: dataRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnSizing,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnSizingChange: setColumnSizing,
    onPaginationChange: setPagination,
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
    meta: {
      updateData,
      editingCell,
      startEditing,
      stopEditing,
    },
    enableSortingRemoval: false,
  });

  // Get paginated rows from table
  const { rows } = table.getRowModel();

  // Filter rows based on search (header row 0 is already excluded from table data)
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return rows.filter((row) => {
      const rowData = row.original as unknown[];
      return rowData.some(
        (cell) =>
          cell != null && String(cell).toLowerCase().includes(normalizedQuery)
      );
    });
  }, [rows, searchQuery]);

  const displayRows = searchQuery ? filteredRows : rows;

  // Virtualization - virtualize only the rows being displayed (after pagination and filtering)
  const rowVirtualizer = useVirtualizer({
    count: displayRows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 33,
    overscan: 10, // Reduced since pagination limits rows per page
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  if (!data || data.length === 0) {
    return (
      <div className="data-grid-empty">
        <p className="data-grid-empty-text">No data available</p>
      </div>
    );
  }

  return (
    <div className="data-grid-container">
      <div ref={tableContainerRef} className="data-grid-table-wrapper">
        <div className="data-grid-table-inner" style={{ height: `${totalSize}px` }}>
          <table
            className="data-grid-table"
            style={{
              width: table.getCenterTotalSize(),
            }}
          >
            <thead className="data-grid-thead">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <TableHead className="data-grid-th data-grid-th-row-number">
                    #
                  </TableHead>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="data-grid-th"
                      style={{ width: header.getSize() }}
                    >
                      <div
                        className="data-grid-th-content"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span className="data-grid-sort-indicator">
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? ''}
                        </span>
                      </div>
                      {/* Resize handle */}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        data-resizing={header.column.getIsResizing()}
                        className="data-grid-resize-handle"
                      />
                    </TableHead>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="data-grid-tbody">
              {/* Always render header row first (row 0) */}
              <TableRow className="data-grid-tr data-grid-tr-header">
                <TableCell className="data-grid-td data-grid-td-row-number">
                  1
                </TableCell>
                {columns.map((column, colIndex) => {
                  const cellValue = headerRow[colIndex];
                  const isHeaderEditing =
                    editingCell?.rowIndex === 0 && editingCell?.colIndex === colIndex;
                  return (
                    <TableCell
                      key={column.id}
                      data-row={0}
                      data-col={colIndex}
                      className="data-grid-td data-grid-td-header"
                      style={{ width: column.size }}
                    >
                      <EditableHeaderCell
                        initialValue={cellValue}
                        colIndex={colIndex}
                        onUpdate={updateHeaderData}
                        isEditing={isHeaderEditing}
                        onStartEdit={() => startEditing(0, colIndex)}
                        onStopEdit={stopEditing}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>

              {/* Render data rows with virtualization */}
              {paddingTop > 0 && (
                <tr>
                  <td style={{ height: `${paddingTop}px` }} />
                </tr>
              )}
              {virtualRows.map((virtualRow) => {
                const row = displayRows[virtualRow.index];

                if (!row) return null;

                // Actual row index in original data (offset by 1 for header)
                const actualRowIndex = row.index + 1;

                return (
                  <TableRow key={row.id} className="data-grid-tr">
                    <TableCell className="data-grid-td data-grid-td-row-number">
                      {actualRowIndex + 1}
                    </TableCell>
                    {row.getVisibleCells().map((cell) => {
                      const colIndex = parseInt(cell.column.id);
                      const cellKey = `${actualRowIndex}-${colIndex}`;
                      const isHighlighted = highlightedCells.has(cellKey);
                      const isLabelColumn = colIndex === columnMapping.labels;
                      const isValueColumn =
                        columnMapping.values.includes(colIndex);

                      return (
                        <TableCell
                          key={cell.id}
                          data-row={actualRowIndex}
                          data-col={colIndex}
                          data-label={isLabelColumn}
                          data-value={isValueColumn}
                          data-highlighted={isHighlighted}
                          className="data-grid-td"
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              {paddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${paddingBottom}px` }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="data-grid-pagination">
        <div className="data-grid-pagination-left">
          <span className="data-grid-pagination-label">Rows per page:</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100, 200].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="data-grid-pagination-right">
          <span className="data-grid-pagination-info">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <div className="data-grid-pagination-buttons">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
