'use client';

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChartStore } from '@/store/useChartStore';
import { getColumnTypeIcon } from '@/utils/dataTypeUtils';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Filter,
  Lock,
  Unlock,
  X,
  GripVertical,
  Copy,
  ClipboardPaste,
  Scissors,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualDataFunctions {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  loadPage: () => Promise<void>;
  updateCell: (row: number, col: number, value: unknown) => Promise<void>;
  updateCellsAndPersist: (
    updates: Array<{ row: number; col: number; value: unknown }>
  ) => Promise<void>;
  deleteRows: (rowIndices: number[]) => Promise<void>;
  insertRows: (rows: unknown[][]) => Promise<void>;
  syncToDuckDB: (data: unknown[][]) => Promise<void>;
}

interface DataGridTanstackProps {
  searchQuery?: string;
  shouldNavigate?: boolean;
  onNavigated?: () => void;
  virtualData?: VirtualDataFunctions;
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

// Editable column name component
interface EditableColumnNameProps {
  name: string;
  onRename: (newName: string) => void;
}

function EditableColumnName({ name, onRename }: EditableColumnNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => {
          if (editValue.trim()) {
            onRename(editValue.trim());
          }
          setIsEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (editValue.trim()) {
              onRename(editValue.trim());
            }
            setIsEditing(false);
          } else if (e.key === 'Escape') {
            setEditValue(name);
            setIsEditing(false);
          }
        }}
        className='flex-1 min-w-0 text-sm font-semibold text-slate-700 bg-white border border-blue-500 rounded px-1 outline-none'
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      ref={spanRef}
      className='flex-1 min-w-0 text-left text-sm font-semibold text-slate-700 truncate cursor-text'
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditValue(name);
        setIsEditing(true);
      }}
    >
      {name}
    </span>
  );
}

// Editable cell component
interface EditableCellProps {
  value: unknown;
  row: number;
  col: number;
  onUpdate: (row: number, col: number, value: unknown) => void;
  isReadOnly?: boolean;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
  isSelected?: boolean;
}

function EditableCell({
  value,
  row,
  col,
  onUpdate,
  isReadOnly = false,
  alignment = 'left',
  className,
  isSelected = false,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value ?? ''));
  const [displayValue, setDisplayValue] = useState(String(value ?? ''));
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  // Update display value when prop changes (e.g., after data reload)
  useEffect(() => {
    setDisplayValue(String(value ?? ''));
  }, [value]);

  // Focus cell when selected (for keyboard input)
  useEffect(() => {
    if (isSelected && cellRef.current && !isEditing) {
      cellRef.current.focus();
    }
  }, [isSelected, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Don't select all if we started typing (editValue differs from displayValue)
      if (editValue === displayValue) {
        inputRef.current.select();
      } else {
        // Move cursor to end
        inputRef.current.setSelectionRange(editValue.length, editValue.length);
      }
    }
  }, [isEditing, editValue, displayValue]);

  const handleDoubleClick = () => {
    if (!isReadOnly) {
      setIsEditing(true);
      setEditValue(displayValue);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== displayValue) {
      // Optimistically update the display value
      setDisplayValue(editValue);
      onUpdate(row, col, editValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        handleBlur();
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        setEditValue(displayValue);
      }
    } else if (!isReadOnly) {
      // Not editing - handle keyboard input to start editing
      if (e.key === 'Enter' || e.key === 'F2') {
        // Enter or F2: edit with current value
        e.preventDefault();
        setIsEditing(true);
        setEditValue(displayValue);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete/Backspace: clear cell
        e.preventDefault();
        setDisplayValue('');
        onUpdate(row, col, '');
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Single character: start editing with that character
        e.preventDefault();
        setIsEditing(true);
        setEditValue(e.key);
      }
    }
  };

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment];

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full h-full px-2 py-1 min-h-[28px] bg-white outline-none border-none focus:ring-0',
          alignmentClass
        )}
      />
    );
  }

  return (
    <div
      ref={cellRef}
      tabIndex={isSelected ? 0 : -1}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'px-2 py-1 min-h-[28px] cursor-default truncate outline-none',
        alignmentClass,
        isReadOnly && 'bg-gray-50 text-gray-500',
        className
      )}
    >
      {displayValue}
    </div>
  );
}

export const DataGridTanstack = memo(function DataGridTanstack({
  searchQuery = '',
  shouldNavigate = false,
  onNavigated,
  virtualData,
}: DataGridTanstackProps) {
  const data = useChartStore((state) => state.data);
  const setData = useChartStore((state) => state.setData);
  const columnMapping = useChartStore((state) => state.columnMapping);
  const columnTypes = useChartStore((state) => state.columnTypes);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const [globalFilter, setGlobalFilter] = useState('');

  // Sync searchQuery prop to global filter
  useEffect(() => {
    setGlobalFilter(searchQuery);
    // Reset to first page when search changes
    if (searchQuery) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchQuery]);

  // Column properties state
  const [columnAlignments, setColumnAlignments] = useState<
    Record<string, 'left' | 'center' | 'right'>
  >({});
  const [readOnlyColumns, setReadOnlyColumns] = useState<Set<string>>(
    new Set()
  );

  // Context menu state
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Multi-cell selection state
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [selectionStart, setSelectionStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionAnchor, setSelectionAnchor] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Clipboard state
  const [clipboard, setClipboard] = useState<{
    value: unknown;
    isCut: boolean;
  } | null>(null);

  // Fill handle state (for drag-to-fill)
  const [isFilling, setIsFilling] = useState(false);
  const [fillStart, setFillStart] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [fillEnd, setFillEnd] = useState<{ row: number; col: number } | null>(
    null
  );

  // Drag reorder state
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);
  const [draggedRow, setDraggedRow] = useState<number | null>(null);
  const [dragOverRow, setDragOverRow] = useState<number | null>(null);

  // Column resize state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<number | null>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  // Extract headers and data
  const { headers, tableData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { headers: [], tableData: [] };
    }

    const firstRow = data[0];
    const isHeaderRow =
      Array.isArray(firstRow) &&
      firstRow.length > 0 &&
      firstRow.every((cell) => typeof cell === 'string');

    if (isHeaderRow) {
      return {
        headers: firstRow as string[],
        tableData: data.slice(1),
      };
    } else {
      // Generate default headers
      const colCount = firstRow?.length || 0;
      return {
        headers: Array.from({ length: colCount }, (_, i) => getColumnLetter(i)),
        tableData: data,
      };
    }
  }, [data]);

  // Handle cell update with optimistic rendering
  const handleCellUpdate = useCallback(
    (row: number, col: number, value: unknown) => {
      // Optimistic update: Update local data immediately
      const currentData = dataRef.current;
      if (currentData[row + 1]) {
        const newData = [...currentData];
        newData[row + 1] = [...newData[row + 1]];
        newData[row + 1][col] = value;
        setData(newData);
      }

      // Then persist to DuckDB
      if (virtualData) {
        virtualData.updateCell(row, col, value).catch((err) => {
          console.error('[DataGridTanstack] Failed to update cell:', err);
          // Could revert optimistic update here if needed
        });
      }
    },
    [virtualData, setData]
  );

  // Handle row deletion
  const handleDeleteRows = useCallback(
    (rowIndices: number[]) => {
      if (virtualData) {
        virtualData.deleteRows(rowIndices).catch((err) => {
          console.error('[DataGridTanstack] Failed to delete rows:', err);
        });
      }
    },
    [virtualData]
  );

  // Use ref to access current data in callbacks without causing re-renders
  const dataRef = useRef(data);
  dataRef.current = data;

  // Handle column deletion
  const handleDeleteColumn = useCallback(
    async (colIndex: number) => {
      const currentData = dataRef.current;
      const newData = currentData.map((row) =>
        row.filter((_, i) => i !== colIndex)
      );
      setData(newData, { index: colIndex, count: 1 });

      // Sync to DuckDB
      if (virtualData) {
        try {
          await virtualData.syncToDuckDB(newData);
        } catch (err) {
          console.error(
            '[DataGridTanstack] Failed to sync column deletion to DuckDB:',
            err
          );
        }
      }
    },
    [setData, virtualData]
  );

  // Handle insert column
  const handleInsertColumn = useCallback(
    async (colIndex: number, position: 'left' | 'right') => {
      const currentData = dataRef.current;
      const insertAt = position === 'left' ? colIndex : colIndex + 1;
      const newData = currentData.map((row, rowIndex) => {
        const newRow = [...row];
        newRow.splice(
          insertAt,
          0,
          rowIndex === 0 ? `Column ${insertAt + 1}` : ''
        );
        return newRow;
      });
      setData(newData);

      // Sync to DuckDB so the new column is persisted
      if (virtualData) {
        try {
          await virtualData.syncToDuckDB(newData);
        } catch (err) {
          console.error(
            '[DataGridTanstack] Failed to sync column to DuckDB:',
            err
          );
        }
      }
    },
    [setData, virtualData]
  );

  // Handle clear column
  const handleClearColumn = useCallback(
    async (colIndex: number) => {
      const currentData = dataRef.current;
      const newData = currentData.map((row, rowIndex) => {
        if (rowIndex === 0) return row; // Keep header
        const newRow = [...row];
        newRow[colIndex] = '';
        return newRow;
      });
      setData(newData);

      // Sync to DuckDB
      if (virtualData) {
        try {
          await virtualData.syncToDuckDB(newData);
        } catch (err) {
          console.error(
            '[DataGridTanstack] Failed to sync column clear to DuckDB:',
            err
          );
        }
      }
    },
    [setData, virtualData]
  );

  // Handle rename column
  const handleRenameColumn = useCallback(
    async (colIndex: number, newName: string) => {
      const currentData = dataRef.current;
      if (!currentData[0]) return;

      const newData = [...currentData];
      newData[0] = [...newData[0]];
      newData[0][colIndex] = newName;
      setData(newData);

      // Sync to DuckDB
      if (virtualData) {
        try {
          await virtualData.syncToDuckDB(newData);
        } catch (err) {
          console.error(
            '[DataGridTanstack] Failed to sync column rename to DuckDB:',
            err
          );
        }
      }
    },
    [setData, virtualData]
  );

  // Handle change column type
  const setColumnTypes = useChartStore((state) => state.setColumnTypes);
  const handleChangeColumnType = useCallback(
    (colIndex: number, newType: 'text' | 'number' | 'date' | 'boolean') => {
      const newTypes = [...columnTypes];
      if (newTypes[colIndex]) {
        newTypes[colIndex] = { ...newTypes[colIndex], type: newType };
      } else {
        newTypes[colIndex] = { type: newType, confidence: 1, sampleValues: [] };
      }
      setColumnTypes(newTypes);
    },
    [columnTypes, setColumnTypes]
  );

  // Handle column resize
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, colIndex: number, currentWidth: number) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingColumn(colIndex);
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = currentWidth;
    },
    []
  );

  // Global resize handlers
  useEffect(() => {
    if (resizingColumn === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - resizeStartX.current;
      const newWidth = Math.max(50, resizeStartWidth.current + delta);
      setColumnWidths((prev) => ({
        ...prev,
        [`col_${resizingColumn}`]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn]);

  // Handle column reorder
  const handleColumnReorder = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      const currentData = dataRef.current;
      const newData = currentData.map((row) => {
        const newRow = [...row];
        const [moved] = newRow.splice(fromIndex, 1);
        newRow.splice(toIndex, 0, moved);
        return newRow;
      });
      setData(newData);

      // Sync to DuckDB
      if (virtualData) {
        try {
          await virtualData.syncToDuckDB(newData);
        } catch (err) {
          console.error(
            '[DataGridTanstack] Failed to sync column reorder to DuckDB:',
            err
          );
        }
      }
    },
    [setData, virtualData]
  );

  // Handle row reorder
  const handleRowReorder = useCallback(
    async (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      const currentData = dataRef.current;
      const newData = [...currentData];
      // +1 to account for header row
      const [moved] = newData.splice(fromIndex + 1, 1);
      newData.splice(toIndex + 1, 0, moved);
      setData(newData);

      // Sync to DuckDB
      if (virtualData) {
        try {
          await virtualData.syncToDuckDB(newData);
        } catch (err) {
          console.error(
            '[DataGridTanstack] Failed to sync row reorder to DuckDB:',
            err
          );
        }
      }
    },
    [setData, virtualData]
  );

  // Handle copy cell
  const handleCopy = useCallback(() => {
    if (!selectedCell) return;
    const currentData = dataRef.current;
    // +1 because tableData doesn't include header, but data does
    const value = currentData[selectedCell.row + 1]?.[selectedCell.col];
    setClipboard({ value, isCut: false });

    // Also copy to system clipboard
    if (value !== undefined && value !== null) {
      navigator.clipboard.writeText(String(value)).catch(console.error);
    }
  }, [selectedCell]);

  // Handle cut cell
  const handleCut = useCallback(() => {
    if (!selectedCell) return;
    const currentData = dataRef.current;
    const value = currentData[selectedCell.row + 1]?.[selectedCell.col];
    setClipboard({ value, isCut: true });

    // Also copy to system clipboard
    if (value !== undefined && value !== null) {
      navigator.clipboard.writeText(String(value)).catch(console.error);
    }
  }, [selectedCell]);

  // Handle paste cell
  const handlePaste = useCallback(async () => {
    if (!selectedCell) return;

    let valueToInsert: unknown;

    // Try to get from internal clipboard first, then system clipboard
    if (clipboard) {
      valueToInsert = clipboard.value;

      // If it was a cut, clear the original cell
      if (clipboard.isCut && virtualData) {
        // We'd need to track the source cell for this
        setClipboard(null);
      }
    } else {
      // Try system clipboard
      try {
        const text = await navigator.clipboard.readText();
        valueToInsert = text;
      } catch {
        return;
      }
    }

    if (virtualData && valueToInsert !== undefined) {
      virtualData
        .updateCell(selectedCell.row, selectedCell.col, valueToInsert)
        .catch(console.error);
    }
  }, [selectedCell, clipboard, virtualData]);

  // Handle clear cell(s)
  const handleClearCell = useCallback(() => {
    if (!virtualData) return;

    // Clear all selected cells
    if (selectedCells.size > 0) {
      const updates: Array<{ row: number; col: number; value: unknown }> = [];
      selectedCells.forEach((cellKey) => {
        const [row, col] = cellKey.split(':').map(Number);
        updates.push({ row, col, value: '' });
      });

      if (updates.length > 0) {
        virtualData.updateCellsAndPersist(updates).catch(console.error);
      }
    } else if (selectedCell) {
      virtualData
        .updateCell(selectedCell.row, selectedCell.col, '')
        .catch(console.error);
    }
  }, [selectedCell, selectedCells, virtualData]);

  // Handle insert row above
  const handleInsertRowAbove = useCallback(() => {
    if (!selectedCell || !virtualData) return;
    const currentData = dataRef.current;
    const colCount = currentData[0]?.length || 0;
    const emptyRow = Array(colCount).fill('');

    // Insert at the selected row position
    const newData = [...currentData];
    newData.splice(selectedCell.row + 1, 0, emptyRow); // +1 for header
    setData(newData);
  }, [selectedCell, virtualData, setData]);

  // Handle insert row below
  const handleInsertRowBelow = useCallback(() => {
    if (!selectedCell || !virtualData) return;
    const currentData = dataRef.current;
    const colCount = currentData[0]?.length || 0;
    const emptyRow = Array(colCount).fill('');

    // Insert after the selected row
    const newData = [...currentData];
    newData.splice(selectedCell.row + 2, 0, emptyRow); // +2 for header and after current
    setData(newData);
  }, [selectedCell, virtualData, setData]);

  // Handle toggle read-only
  const handleToggleReadOnly = useCallback(() => {
    if (!selectedCell) return;
    const colId = `col_${selectedCell.col}`;
    setReadOnlyColumns((prev) => {
      const next = new Set(prev);
      if (next.has(colId)) {
        next.delete(colId);
      } else {
        next.add(colId);
      }
      return next;
    });
  }, [selectedCell]);

  // Handle fill handle mouse down (start drag-to-fill)
  const handleFillHandleMouseDown = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      e.stopPropagation();
      setIsFilling(true);
      setFillStart({ row, col });
      setFillEnd({ row, col });
      // Clear any text selection during fill
      window.getSelection()?.removeAllRanges();
    },
    []
  );

  // Handle fill mouse move (during drag-to-fill)
  const handleFillMouseMove = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (isFilling && fillStart) {
        // Only allow vertical filling (same column)
        if (colIndex === fillStart.col) {
          setFillEnd({ row: rowIndex, col: colIndex });
        }
      }
    },
    [isFilling, fillStart]
  );

  // Handle fill mouse up (complete drag-to-fill)
  const handleFillMouseUp = useCallback(() => {
    if (isFilling && fillStart && fillEnd) {
      const currentData = dataRef.current;
      // Get the source value (+1 for header row)
      const sourceValue = currentData[fillStart.row + 1]?.[fillStart.col];

      // Determine fill range
      const startRow = Math.min(fillStart.row, fillEnd.row);
      const endRow = Math.max(fillStart.row, fillEnd.row);

      // Collect all updates for batch operation
      const updates: Array<{ row: number; col: number; value: unknown }> = [];
      for (let row = startRow; row <= endRow; row++) {
        if (row !== fillStart.row) {
          updates.push({ row, col: fillStart.col, value: sourceValue });
        }
      }

      // Optimistic update: Update local data immediately
      if (updates.length > 0) {
        const newData = [...currentData];
        for (const update of updates) {
          if (newData[update.row + 1]) {
            newData[update.row + 1] = [...newData[update.row + 1]];
            newData[update.row + 1][update.col] = update.value;
          }
        }
        setData(newData);

        // Then persist to DuckDB
        if (virtualData) {
          virtualData.updateCellsAndPersist(updates).catch((err) => {
            console.error('[DataGridTanstack] Failed to persist fill:', err);
          });
        }
      }
    }

    setIsFilling(false);
    setFillStart(null);
    setFillEnd(null);
  }, [isFilling, fillStart, fillEnd, virtualData, setData]);

  // Check if a cell is in the fill range
  const isCellInFillRange = useCallback(
    (row: number, col: number) => {
      if (!isFilling || !fillStart || !fillEnd) return false;
      if (col !== fillStart.col) return false;

      const startRow = Math.min(fillStart.row, fillEnd.row);
      const endRow = Math.max(fillStart.row, fillEnd.row);

      return row >= startRow && row <= endRow && row !== fillStart.row;
    },
    [isFilling, fillStart, fillEnd]
  );

  // Generate columns dynamically
  const columns: ColumnDef<unknown[]>[] = useMemo(() => {
    if (headers.length === 0) return [];

    const cols: ColumnDef<unknown[]>[] = [
      // Row number column
      {
        id: 'rowNumber',
        header: () => (
          <div className='w-10 text-center text-xs text-gray-500'>#</div>
        ),
        cell: ({ row }) => (
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', String(row.index));
              // Use requestAnimationFrame to set state after drag starts
              requestAnimationFrame(() => {
                setDraggedRow(row.index);
              });
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverRow(row.index);
            }}
            onDragLeave={() => {
              setDragOverRow(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedRow !== null && draggedRow !== row.index) {
                handleRowReorder(draggedRow, row.index);
              }
              setDraggedRow(null);
              setDragOverRow(null);
            }}
            onDragEnd={() => {
              setDraggedRow(null);
              setDragOverRow(null);
            }}
            className={cn(
              'w-10 h-full text-center text-xs text-gray-500 font-mono cursor-grab active:cursor-grabbing relative',
              draggedRow === row.index && 'opacity-30 bg-gray-200'
            )}
          >
            {/* Drop indicator - top */}
            {dragOverRow === row.index &&
              draggedRow !== null &&
              draggedRow > row.index && (
                <div className='absolute left-0 right-0 top-0 h-0.5 bg-blue-500 -translate-y-1/2 z-20' />
              )}
            {/* Drop indicator - bottom */}
            {dragOverRow === row.index &&
              draggedRow !== null &&
              draggedRow < row.index && (
                <div className='absolute left-0 right-0 bottom-0 h-0.5 bg-blue-500 translate-y-1/2 z-20' />
              )}
            {row.index + 1}
          </div>
        ),
        size: 50,
        enableSorting: false,
        enableHiding: false,
      },
      // Selection column
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
            className='ml-1'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
            className='ml-1'
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
    ];

    // Data columns
    headers.forEach((header, index) => {
      const colId = `col_${index}`;
      const type = columnTypes[index]?.type || 'text';
      const icon = getColumnTypeIcon(type);
      const isLabelColumn = columnMapping.labels === index;
      const isValueColumn = columnMapping.values.includes(index);

      cols.push({
        id: colId,
        accessorFn: (row) => row[index],
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(index));
                // Use requestAnimationFrame to set state after drag starts
                requestAnimationFrame(() => {
                  setDraggedColumn(index);
                });
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(index);
              }}
              onDragLeave={() => {
                setDragOverColumn(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedColumn !== null && draggedColumn !== index) {
                  handleColumnReorder(draggedColumn, index);
                }
                setDraggedColumn(null);
                setDragOverColumn(null);
              }}
              onDragEnd={() => {
                setDraggedColumn(null);
                setDragOverColumn(null);
              }}
              className={cn(
                'w-full relative',
                draggedColumn === index && 'opacity-30 bg-gray-200'
              )}
            >
              {/* Drop indicator - left side */}
              {dragOverColumn === index &&
                draggedColumn !== null &&
                draggedColumn > index && (
                  <div className='absolute left-0 top-0 bottom-0 w-1 bg-blue-500 -translate-x-1/2 z-20' />
                )}
              {/* Drop indicator - right side */}
              {dragOverColumn === index &&
                draggedColumn !== null &&
                draggedColumn < index && (
                  <div className='absolute right-0 top-0 bottom-0 w-1 bg-blue-500 translate-x-1/2 z-20' />
                )}
              <div
                className={cn(
                  'h-8 w-full flex items-center gap-1 px-2 hover:bg-gray-100',
                  isLabelColumn && 'bg-pink-50',
                  isValueColumn && 'bg-purple-50'
                )}
              >
                <GripVertical className='h-3 w-3 text-gray-400 cursor-grab shrink-0' />
                <span
                  className='rounded bg-violet-100 px-1 py-0.5 text-[10px] font-mono font-medium text-slate-500 shrink-0'
                  title={type}
                >
                  {icon}
                </span>
                <EditableColumnName
                  name={header || getColumnLetter(index)}
                  onRename={(newName) => handleRenameColumn(index, newName)}
                />
                {isSorted === 'asc' && <ArrowUp className='h-3 w-3 shrink-0' />}
                {isSorted === 'desc' && (
                  <ArrowDown className='h-3 w-3 shrink-0' />
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className='p-1 hover:bg-gray-200 rounded shrink-0'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChevronDown className='h-3 w-3 opacity-50' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-48'>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span className='mr-2'>{icon}</span>
                        Data Type
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => handleChangeColumnType(index, 'text')}
                        >
                          <span className='mr-2'>ABC</span>
                          Text
                          {type === 'text' && (
                            <span className='ml-auto'>✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeColumnType(index, 'number')
                          }
                        >
                          <span className='mr-2'>123</span>
                          Number
                          {type === 'number' && (
                            <span className='ml-auto'>✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeColumnType(index, 'date')}
                        >
                          <span className='mr-2'>📅</span>
                          Date
                          {type === 'date' && (
                            <span className='ml-auto'>✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeColumnType(index, 'boolean')
                          }
                        >
                          <span className='mr-2'>✓✗</span>
                          Boolean
                          {type === 'boolean' && (
                            <span className='ml-auto'>✓</span>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(false)}
                    >
                      <ArrowUp className='mr-2 h-4 w-4' />
                      Sort Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(true)}
                    >
                      <ArrowDown className='mr-2 h-4 w-4' />
                      Sort Descending
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Filter className='mr-2 h-4 w-4' />
                        Filter
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className='p-2'>
                        <Input
                          placeholder='Filter value...'
                          value={(column.getFilterValue() as string) ?? ''}
                          onChange={(e) =>
                            column.setFilterValue(e.target.value)
                          }
                          className='h-8 text-sm'
                        />
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <AlignLeft className='mr-2 h-4 w-4' />
                        Alignment
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() =>
                            setColumnAlignments((prev) => ({
                              ...prev,
                              [colId]: 'left',
                            }))
                          }
                        >
                          <AlignLeft className='mr-2 h-4 w-4' />
                          Left
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setColumnAlignments((prev) => ({
                              ...prev,
                              [colId]: 'center',
                            }))
                          }
                        >
                          <AlignCenter className='mr-2 h-4 w-4' />
                          Center
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setColumnAlignments((prev) => ({
                              ...prev,
                              [colId]: 'right',
                            }))
                          }
                        >
                          <AlignRight className='mr-2 h-4 w-4' />
                          Right
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setReadOnlyColumns((prev) => {
                          const next = new Set(prev);
                          if (next.has(colId)) {
                            next.delete(colId);
                          } else {
                            next.add(colId);
                          }
                          return next;
                        });
                      }}
                    >
                      {readOnlyColumns.has(colId) ? (
                        <>
                          <Unlock className='mr-2 h-4 w-4' />
                          Make Editable
                        </>
                      ) : (
                        <>
                          <Lock className='mr-2 h-4 w-4' />
                          Make Read Only
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleInsertColumn(index, 'left')}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Insert Column Left
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInsertColumn(index, 'right')}
                    >
                      <Plus className='mr-2 h-4 w-4' />
                      Insert Column Right
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleClearColumn(index)}>
                      <X className='mr-2 h-4 w-4' />
                      Clear Column
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteColumn(index)}
                      className='text-red-600 focus:text-red-600'
                    >
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete Column
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Resize handle */}
              <div
                className={cn(
                  'absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-30',
                  resizingColumn === index && 'bg-blue-500'
                )}
                onMouseDown={(e) => {
                  const currentWidth = columnWidths[`col_${index}`] || 120;
                  handleResizeStart(e, index, currentWidth);
                }}
              />
            </div>
          );
        },
        cell: ({ row, getValue, table }) => {
          const value = getValue();
          const isLabelCol = columnMapping.labels === index;
          const isValueCol = columnMapping.values.includes(index);
          const meta = table.options.meta as
            | { isCellSelected: (row: number, col: number) => boolean }
            | undefined;
          const isSelected = meta?.isCellSelected(row.index, index) || false;

          return (
            <EditableCell
              value={value}
              row={row.index}
              col={index}
              onUpdate={handleCellUpdate}
              isReadOnly={readOnlyColumns.has(colId)}
              alignment={columnAlignments[colId] || 'left'}
              isSelected={isSelected}
              className={cn(
                isLabelCol && 'bg-pink-50',
                isValueCol && 'bg-purple-50'
              )}
            />
          );
        },
        size: 120,
        enableResizing: true,
      });
    });

    return cols;
  }, [
    headers,
    columnTypes,
    columnMapping,
    columnAlignments,
    readOnlyColumns,
    handleCellUpdate,
    handleDeleteColumn,
    handleInsertColumn,
    handleClearColumn,
    handleColumnReorder,
    handleRowReorder,
    handleRenameColumn,
    handleChangeColumnType,
    handleResizeStart,
    draggedColumn,
    dragOverColumn,
    draggedRow,
    dragOverRow,
    resizingColumn,
    columnWidths,
  ]);

  // Helper to generate cell key
  const getCellKey = (row: number, col: number) => `${row}:${col}`;

  // Check if cell is selected
  const isCellSelected = useCallback(
    (row: number, col: number) => selectedCells.has(getCellKey(row, col)),
    [selectedCells]
  );

  // Initialize table with meta for selection state
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
    enableRowSelection: true,
    meta: {
      isCellSelected,
    },
  });

  // Virtualization setup
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35, // Estimated row height in pixels
    overscan: 10, // Number of rows to render outside visible area
  });

  // Helper to get cells in a rectangular selection
  const getCellsInRange = (
    start: { row: number; col: number },
    end: { row: number; col: number }
  ) => {
    const cells = new Set<string>();
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        cells.add(getCellKey(r, c));
      }
    }
    return cells;
  };

  // Handle cell mouse down for selection
  const handleCellMouseDown = (
    e: React.MouseEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    // Prevent selection when clicking on editable input
    if ((e.target as HTMLElement).tagName === 'INPUT') return;

    const cellKey = getCellKey(rowIndex, colIndex);

    // Right-click: preserve selection if clicking within it
    if (e.button === 2) {
      if (selectedCells.has(cellKey)) {
        // Just update primary cell, keep selection
        setSelectedCell({ row: rowIndex, col: colIndex });
        return;
      }
      // Right-click outside selection: select just this cell
      setSelectedCells(new Set([cellKey]));
      setSelectedCell({ row: rowIndex, col: colIndex });
      setSelectionAnchor({ row: rowIndex, col: colIndex });
      return;
    }

    if (e.shiftKey && selectionAnchor) {
      // Shift+click: extend selection from anchor
      const newSelection = getCellsInRange(selectionAnchor, {
        row: rowIndex,
        col: colIndex,
      });
      setSelectedCells(newSelection);
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+click: toggle cell in selection
      setSelectedCells((prev) => {
        const next = new Set(prev);
        if (next.has(cellKey)) {
          next.delete(cellKey);
        } else {
          next.add(cellKey);
        }
        return next;
      });
      setSelectionAnchor({ row: rowIndex, col: colIndex });
    } else {
      // Regular click: start new selection
      setSelectedCells(new Set([cellKey]));
      setSelectionStart({ row: rowIndex, col: colIndex });
      setSelectionAnchor({ row: rowIndex, col: colIndex });
      setIsSelecting(true);
    }

    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  // Handle mouse enter during drag selection
  const handleCellMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isSelecting && selectionStart) {
      const newSelection = getCellsInRange(selectionStart, {
        row: rowIndex,
        col: colIndex,
      });
      setSelectedCells(newSelection);
    }
  };

  // Handle keyboard navigation
  const handleKeyboardNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;
      const maxRow = tableData.length - 1;
      const maxCol = headers.length - 1;

      let newRow = row;
      let newCol = col;
      let handled = false;

      switch (e.key) {
        case 'ArrowUp':
          if (row > 0) {
            newRow = row - 1;
            handled = true;
          }
          break;
        case 'ArrowDown':
          if (row < maxRow) {
            newRow = row + 1;
            handled = true;
          }
          break;
        case 'ArrowLeft':
          if (col > 0) {
            newCol = col - 1;
            handled = true;
          }
          break;
        case 'ArrowRight':
          if (col < maxCol) {
            newCol = col + 1;
            handled = true;
          }
          break;
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            // Move left
            if (col > 0) {
              newCol = col - 1;
            } else if (row > 0) {
              // Wrap to end of previous row
              newRow = row - 1;
              newCol = maxCol;
            }
          } else {
            // Move right
            if (col < maxCol) {
              newCol = col + 1;
            } else if (row < maxRow) {
              // Wrap to start of next row
              newRow = row + 1;
              newCol = 0;
            }
          }
          handled = true;
          break;
        case 'Enter':
          if (!e.shiftKey && row < maxRow) {
            newRow = row + 1;
            handled = true;
          } else if (e.shiftKey && row > 0) {
            newRow = row - 1;
            handled = true;
          }
          break;
        case 'Home':
          if (e.ctrlKey || e.metaKey) {
            newRow = 0;
            newCol = 0;
          } else {
            newCol = 0;
          }
          handled = true;
          break;
        case 'End':
          if (e.ctrlKey || e.metaKey) {
            newRow = maxRow;
            newCol = maxCol;
          } else {
            newCol = maxCol;
          }
          handled = true;
          break;
      }

      if (handled) {
        e.preventDefault();
        const cellKey = getCellKey(newRow, newCol);
        setSelectedCell({ row: newRow, col: newCol });
        setSelectedCells(new Set([cellKey]));
        setSelectionAnchor({ row: newRow, col: newCol });
      }
    },
    [selectedCell, tableData.length, headers.length, getCellKey]
  );

  // Handle mouse up to end selection and fill
  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    if (isFilling) {
      handleFillMouseUp();
    }
  }, [isFilling, handleFillMouseUp]);

  // Track table ref for coordinate-based cell detection during fill
  // Using tableContainerRef defined earlier for virtualization

  // Global mouse move handler for fill drag
  useEffect(() => {
    if (!isFilling || !tableContainerRef.current) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const tableElement = tableContainerRef.current;
      if (!tableElement) return;

      // Find all data cells and check which one the mouse is over
      const cells = tableElement.querySelectorAll('[data-cell-row]');
      for (const cell of cells) {
        const rect = cell.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          const row = parseInt(cell.getAttribute('data-cell-row') || '0');
          const col = parseInt(cell.getAttribute('data-cell-col') || '0');
          if (fillStart && col === fillStart.col) {
            setFillEnd({ row, col });
          }
          break;
        }
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isFilling, fillStart]);

  // Add global mouse up listener
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp]);

  // Handle context menu - preserve selection if right-clicking within it
  const handleContextMenu = (rowIndex: number, colIndex: number) => {
    const cellKey = getCellKey(rowIndex, colIndex);

    // If right-clicking on a cell that's already selected, keep the selection
    if (selectedCells.has(cellKey)) {
      // Just update the primary selected cell for operations
      setSelectedCell({ row: rowIndex, col: colIndex });
      return;
    }

    // Otherwise, select just this cell
    setSelectedCell({ row: rowIndex, col: colIndex });
    setSelectedCells(new Set([cellKey]));
    setSelectionAnchor({ row: rowIndex, col: colIndex });
  };

  // Navigate when search results change
  useEffect(() => {
    if (shouldNavigate && tableData.length > 0) {
      onNavigated?.();
    }
  }, [shouldNavigate, onNavigated, tableData.length]);

  // Delete selected rows
  const handleDeleteSelectedRows = useCallback(() => {
    const selectedRowIndices = Object.keys(rowSelection)
      .filter((key) => rowSelection[key as keyof typeof rowSelection])
      .map((key) => parseInt(key));

    if (selectedRowIndices.length > 0) {
      handleDeleteRows(selectedRowIndices);
      setRowSelection({});
    }
  }, [rowSelection, handleDeleteRows]);

  // Show loading state when no data
  if (!data || data.length === 0) {
    return (
      <div className='w-full h-full flex items-center justify-center text-gray-500'>
        <p>No data loaded. Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col'>
      {/* Toolbar */}
      <div className='flex items-center justify-between px-4 py-2 border-b bg-gray-50'>
        <div className='flex items-center gap-2'>
          {Object.keys(rowSelection).length > 0 && (
            <>
              <span className='text-sm text-gray-600'>
                {Object.keys(rowSelection).length} row(s) selected
              </span>
              <Button
                variant='destructive'
                size='sm'
                onClick={handleDeleteSelectedRows}
              >
                <Trash2 className='h-4 w-4 mr-1' />
                Delete Selected
              </Button>
            </>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                Columns <ChevronDown className='ml-1 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuItem
                    key={column.id}
                    className='capitalize'
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    <Checkbox
                      checked={column.getIsVisible()}
                      className='mr-2'
                    />
                    {column.id.replace('col_', 'Column ')}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div
        ref={tableContainerRef}
        className='flex-1 overflow-auto focus:outline-none relative'
        tabIndex={0}
        onKeyDown={handleKeyboardNavigation}
      >
        {/* Loading overlay */}
        {virtualData?.isLoading && (
          <div className='absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center'>
            <div className='flex flex-col items-center gap-3'>
              <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
              <span className='text-sm font-medium text-gray-600'>
                Loading data...
              </span>
            </div>
          </div>
        )}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Table style={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHeader className='sticky top-0 bg-white z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className='border-b'
                    style={{ display: 'flex' }}
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className='h-10 px-0 border-r last:border-r-0 p-0! shrink-0'
                        style={{
                          width: header.id.startsWith('col_')
                            ? columnWidths[header.id] || header.getSize()
                            : header.getSize(),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  position: 'relative',
                }}
              >
                {rows.length ? (
                  rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                      <TableRow
                        key={row.id}
                        data-index={virtualRow.index}
                        ref={(node) => rowVirtualizer.measureElement(node)}
                        data-state={row.getIsSelected() && 'selected'}
                        className='border-b hover:bg-gray-50'
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {row.getVisibleCells().map((cell, cellIndex) => {
                          // Calculate actual column index (skip row number and checkbox)
                          const actualColIndex = cellIndex - 2;
                          const isDataCell = cellIndex > 1;
                          const isSelected =
                            isDataCell &&
                            isCellSelected(row.index, actualColIndex);
                          const isInFillRange =
                            isDataCell &&
                            isCellInFillRange(row.index, actualColIndex);
                          const showFillHandle =
                            isDataCell &&
                            selectedCell?.row === row.index &&
                            selectedCell?.col === actualColIndex;

                          return (
                            <TableCell
                              key={cell.id}
                              data-cell-row={isDataCell ? row.index : undefined}
                              data-cell-col={
                                isDataCell ? actualColIndex : undefined
                              }
                              className={cn(
                                'p-0! border-r last:border-r-0 select-none relative shrink-0',
                                isSelected &&
                                  'bg-blue-50 outline-1 outline-blue-500 -outline-offset-1 z-10',
                                isInFillRange &&
                                  'bg-blue-50/50 outline-dashed outline-1 outline-blue-400 -outline-offset-1',
                                showFillHandle && 'overflow-visible'
                              )}
                              style={{
                                width: cell.column.id.startsWith('col_')
                                  ? columnWidths[cell.column.id] ||
                                    cell.column.getSize()
                                  : cell.column.getSize(),
                              }}
                              onMouseDown={(e) => {
                                if (isDataCell) {
                                  handleCellMouseDown(
                                    e,
                                    row.index,
                                    actualColIndex
                                  );
                                }
                              }}
                              onMouseEnter={() => {
                                if (isDataCell) {
                                  handleCellMouseEnter(
                                    row.index,
                                    actualColIndex
                                  );
                                  handleFillMouseMove(
                                    row.index,
                                    actualColIndex
                                  );
                                }
                              }}
                              onMouseMove={() => {
                                if (isDataCell && isFilling) {
                                  handleFillMouseMove(
                                    row.index,
                                    actualColIndex
                                  );
                                }
                              }}
                              onContextMenu={() => {
                                if (isDataCell) {
                                  handleContextMenu(row.index, actualColIndex);
                                }
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                              {/* Fill handle - small square at bottom-right corner */}
                              {showFillHandle && (
                                <div
                                  className='absolute bottom-0 right-0 w-1.5 h-1.5 bg-blue-500 cursor-crosshair z-20 translate-x-1/2 translate-y-1/2'
                                  onMouseDown={(e) =>
                                    handleFillHandleMouseDown(
                                      e,
                                      row.index,
                                      actualColIndex
                                    )
                                  }
                                />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ContextMenuTrigger>
          <ContextMenuContent className='w-56'>
            {selectedCell && (
              <>
                {/* Clipboard operations */}
                <ContextMenuItem onClick={handleCopy}>
                  <Copy className='mr-2 h-4 w-4' />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCut}>
                  <Scissors className='mr-2 h-4 w-4' />
                  Cut
                </ContextMenuItem>
                <ContextMenuItem onClick={handlePaste}>
                  <ClipboardPaste className='mr-2 h-4 w-4' />
                  Paste
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Cell operations */}
                <ContextMenuItem onClick={handleClearCell}>
                  <X className='mr-2 h-4 w-4' />
                  Clear Cell
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Row operations */}
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Plus className='mr-2 h-4 w-4' />
                    Insert Row
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem onClick={handleInsertRowAbove}>
                      <ArrowUp className='mr-2 h-4 w-4' />
                      Insert Above
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleInsertRowBelow}>
                      <ArrowDown className='mr-2 h-4 w-4' />
                      Insert Below
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem
                  onClick={() => handleDeleteRows([selectedCell.row])}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete Row
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Column operations */}
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Plus className='mr-2 h-4 w-4' />
                    Insert Column
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onClick={() =>
                        handleInsertColumn(selectedCell.col, 'left')
                      }
                    >
                      <ArrowUp className='mr-2 h-4 w-4 -rotate-90' />
                      Insert Left
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() =>
                        handleInsertColumn(selectedCell.col, 'right')
                      }
                    >
                      <ArrowDown className='mr-2 h-4 w-4 -rotate-90' />
                      Insert Right
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem
                  onClick={() => handleDeleteColumn(selectedCell.col)}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete Column
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleClearColumn(selectedCell.col)}
                >
                  <X className='mr-2 h-4 w-4' />
                  Clear Column
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Column properties */}
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <AlignLeft className='mr-2 h-4 w-4' />
                    Alignment
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onClick={() => {
                        const colId = `col_${selectedCell.col}`;
                        setColumnAlignments((prev) => ({
                          ...prev,
                          [colId]: 'left',
                        }));
                      }}
                    >
                      <AlignLeft className='mr-2 h-4 w-4' />
                      Left
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        const colId = `col_${selectedCell.col}`;
                        setColumnAlignments((prev) => ({
                          ...prev,
                          [colId]: 'center',
                        }));
                      }}
                    >
                      <AlignCenter className='mr-2 h-4 w-4' />
                      Center
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => {
                        const colId = `col_${selectedCell.col}`;
                        setColumnAlignments((prev) => ({
                          ...prev,
                          [colId]: 'right',
                        }));
                      }}
                    >
                      <AlignRight className='mr-2 h-4 w-4' />
                      Right
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem onClick={handleToggleReadOnly}>
                  {readOnlyColumns.has(`col_${selectedCell.col}`) ? (
                    <>
                      <Unlock className='mr-2 h-4 w-4' />
                      Make Editable
                    </>
                  ) : (
                    <>
                      <Lock className='mr-2 h-4 w-4' />
                      Make Read-Only
                    </>
                  )}
                </ContextMenuItem>
              </>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>

      {/* Pagination Controls */}
      <div className='flex items-center justify-between px-4 py-3 border-t bg-gray-50'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>
            Showing{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} rows
          </span>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Rows per page:</span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent>
                {[25, 50, 100, 250, 500].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='flex items-center gap-1 text-sm text-gray-600 px-2'>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
