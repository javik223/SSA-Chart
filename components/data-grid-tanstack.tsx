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
import { Reorder } from 'motion/react';
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
import './data-grid-tanstack.css';

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
        className='data-grid-column-name-input'
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      ref={spanRef}
      className='data-grid-column-name'
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
          'w-full h-full px-2 py-1 min-h-7 bg-white outline-none border-none focus:ring-0',
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
        'px-2 py-1 min-h-7 cursor-default truncate outline-none',
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
  const setColumnMapping = useChartStore((state) => state.setColumnMapping);
  const columnTypes = useChartStore((state) => state.columnTypes);
  const setColumnTypes = useChartStore((state) => state.setColumnTypes);

  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });

  // Reset to first page when search changes
  useEffect(() => {
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

  // Column order state for Motion Reorder
  const [columnOrder, setColumnOrder] = useState<number[]>([]);

  // Row drag reorder state (keeping HTML5 for rows for now)
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
      // Optimistic update: Remove rows from local data immediately
      const currentData = dataRef.current;
      // Sort indices in descending order to remove from end first
      const sortedIndices = [...rowIndices].sort((a, b) => b - a);

      const newData = [...currentData];
      sortedIndices.forEach((idx) => {
        // +1 to account for header row
        newData.splice(idx + 1, 1);
      });
      setData(newData);

      // Then persist to DuckDB
      if (virtualData) {
        virtualData.deleteRows(rowIndices).catch((err) => {
          console.error('[DataGridTanstack] Failed to delete rows:', err);
        });
      }
    },
    [virtualData, setData]
  );

  // Use ref to access current data in callbacks without causing re-renders
  const dataRef = useRef(data);
  dataRef.current = data;

  // Handle column deletion (optimistic)
  const handleDeleteColumn = useCallback(
    (colIndex: number) => {
      // Optimistic update: Remove column from local data immediately
      const currentData = dataRef.current;
      const newData = currentData.map((row) =>
        row.filter((_, i) => i !== colIndex)
      );
      setData(newData, { index: colIndex, count: 1 });

      // Then sync to DuckDB in background
      if (virtualData) {
        virtualData.syncToDuckDB(newData).catch((err) => {
          console.error(
            '[DataGridTanstack] Failed to sync column deletion to DuckDB:',
            err
          );
        });
      }
    },
    [setData, virtualData]
  );

  // Handle insert column (optimistic)
  const handleInsertColumn = useCallback(
    (colIndex: number, position: 'left' | 'right') => {
      // Optimistic update: Insert column immediately
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

      // Then sync to DuckDB in background
      if (virtualData) {
        virtualData.syncToDuckDB(newData).catch((err) => {
          console.error(
            '[DataGridTanstack] Failed to sync column to DuckDB:',
            err
          );
        });
      }
    },
    [setData, virtualData]
  );

  // Handle clear column (optimistic)
  const handleClearColumn = useCallback(
    (colIndex: number) => {
      // Optimistic update: Clear column immediately
      const currentData = dataRef.current;
      const newData = currentData.map((row, rowIndex) => {
        if (rowIndex === 0) return row; // Keep header
        const newRow = [...row];
        newRow[colIndex] = '';
        return newRow;
      });
      setData(newData);

      // Then sync to DuckDB in background
      if (virtualData) {
        virtualData.syncToDuckDB(newData).catch((err) => {
          console.error(
            '[DataGridTanstack] Failed to sync column clear to DuckDB:',
            err
          );
        });
      }
    },
    [setData, virtualData]
  );

  // Handle rename column (optimistic)
  const handleRenameColumn = useCallback(
    (colIndex: number, newName: string) => {
      // Optimistic update: Rename column immediately
      const currentData = dataRef.current;
      if (!currentData[0]) return;

      const newData = [...currentData];
      newData[0] = [...newData[0]];
      newData[0][colIndex] = newName;
      setData(newData);

      // Then sync to DuckDB in background
      if (virtualData) {
        virtualData.syncToDuckDB(newData).catch((err) => {
          console.error(
            '[DataGridTanstack] Failed to sync column rename to DuckDB:',
            err
          );
        });
      }
    },
    [setData, virtualData]
  );

  // Handle change column type
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

  // Handle column reorder (called by Motion Reorder)
  const handleColumnReorder = useCallback(
    (newOrder: number[]) => {
      // Just update the visual order state
      // Data stays in original order, we only change how it's displayed
      setColumnOrder(newOrder);
    },
    []
  );

  // Handle row reorder (optimistic)
  const handleRowReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      // Optimistic update: Reorder rows immediately
      const currentData = dataRef.current;
      const newData = [...currentData];
      // +1 to account for header row
      const [moved] = newData.splice(fromIndex + 1, 1);
      newData.splice(toIndex + 1, 0, moved);
      setData(newData);

      // Then sync to DuckDB in background
      if (virtualData) {
        virtualData.syncToDuckDB(newData).catch((err) => {
          console.error(
            '[DataGridTanstack] Failed to sync row reorder to DuckDB:',
            err
          );
        });
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
      if (clipboard.isCut) {
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

    if (valueToInsert === undefined) return;

    // Optimistic update: Update cell in local data immediately
    const currentData = dataRef.current;
    if (currentData[selectedCell.row + 1]) {
      const newData = [...currentData];
      newData[selectedCell.row + 1] = [...newData[selectedCell.row + 1]];
      newData[selectedCell.row + 1][selectedCell.col] = valueToInsert;
      setData(newData);
    }

    // Then persist to DuckDB
    if (virtualData) {
      virtualData
        .updateCell(selectedCell.row, selectedCell.col, valueToInsert)
        .catch(console.error);
    }
  }, [selectedCell, clipboard, virtualData, setData]);

  // Handle clear cell(s)
  const handleClearCell = useCallback(() => {
    const currentData = dataRef.current;

    // Collect updates
    const updates: Array<{ row: number; col: number; value: unknown }> = [];

    if (selectedCells.size > 0) {
      selectedCells.forEach((cellKey) => {
        const [row, col] = cellKey.split(':').map(Number);
        updates.push({ row, col, value: '' });
      });
    } else if (selectedCell) {
      updates.push({ row: selectedCell.row, col: selectedCell.col, value: '' });
    }

    if (updates.length === 0) return;

    // Optimistic update: Clear cells in local data immediately
    const newData = [...currentData];
    for (const update of updates) {
      if (newData[update.row + 1]) {
        newData[update.row + 1] = [...newData[update.row + 1]];
        newData[update.row + 1][update.col] = '';
      }
    }
    setData(newData);

    // Then persist to DuckDB
    if (virtualData) {
      virtualData.updateCellsAndPersist(updates).catch(console.error);
    }
  }, [selectedCell, selectedCells, virtualData, setData]);

  // Handle insert row above (optimistic)
  const handleInsertRowAbove = useCallback(() => {
    if (!selectedCell) return;
    const currentData = dataRef.current;
    const colCount = currentData[0]?.length || 0;
    const emptyRow = Array(colCount).fill('');

    // Optimistic update: Insert row in local data immediately
    const newData = [...currentData];
    newData.splice(selectedCell.row + 1, 0, emptyRow); // +1 for header
    setData(newData);

    // Then sync to DuckDB in background
    if (virtualData) {
      virtualData.syncToDuckDB(newData).catch((err) => {
        console.error(
          '[DataGridTanstack] Failed to sync row insert to DuckDB:',
          err
        );
      });
    }
  }, [selectedCell, virtualData, setData]);

  // Handle insert row below (optimistic)
  const handleInsertRowBelow = useCallback(() => {
    if (!selectedCell) return;
    const currentData = dataRef.current;
    const colCount = currentData[0]?.length || 0;
    const emptyRow = Array(colCount).fill('');

    // Optimistic update: Insert row in local data immediately
    const newData = [...currentData];
    newData.splice(selectedCell.row + 2, 0, emptyRow); // +2 for header and after current
    setData(newData);

    // Then sync to DuckDB in background
    if (virtualData) {
      virtualData.syncToDuckDB(newData).catch((err) => {
        console.error(
          '[DataGridTanstack] Failed to sync row insert to DuckDB:',
          err
        );
      });
    }
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

  // Initialize/update column order when headers change
  useEffect(() => {
    const newLength = headers.length;
    if (newLength === 0) {
      setColumnOrder([]);
      return;
    }

    // If columnOrder is empty or length changed, reset to identity mapping
    if (columnOrder.length === 0 || columnOrder.length !== newLength) {
      setColumnOrder(Array.from({ length: newLength }, (_, i) => i));
    }
  }, [headers.length, columnOrder.length]);

  // Generate columns dynamically
  const columns: ColumnDef<unknown[]>[] = useMemo(() => {
    if (headers.length === 0) return [];

    const cols: ColumnDef<unknown[]>[] = [
      // Row number column
      {
        id: 'rowNumber',
        header: () => (
          <div className='data-grid-row-number-header'>#</div>
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
              'data-grid-row-number',
              draggedRow === row.index && 'opacity-30 bg-gray-200'
            )}
          >
            {/* Drop indicator - top */}
            {dragOverRow === row.index &&
              draggedRow !== null &&
              draggedRow > row.index && (
                <div className='data-grid-drop-indicator-top' />
              )}
            {/* Drop indicator - bottom */}
            {dragOverRow === row.index &&
              draggedRow !== null &&
              draggedRow < row.index && (
                <div className='data-grid-drop-indicator-bottom' />
              )}
            {row.index + 1}
          </div>
        ),
        size: 50,
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
            <div className='w-full relative'>
              <div
                className={cn(
                  'data-grid-column-header-content',
                  isLabelColumn && 'label-column',
                  isValueColumn && 'value-column'
                )}
              >
                <GripVertical className='data-grid-grip-icon' />
                <span
                  className='data-grid-type-badge'
                  title={type}
                >
                  {icon}
                </span>
                <EditableColumnName
                  name={header || getColumnLetter(index)}
                  onRename={(newName) => handleRenameColumn(index, newName)}
                />
                {isSorted === 'asc' && <ArrowUp className='data-grid-sort-icon' />}
                {isSorted === 'desc' && (
                  <ArrowDown className='data-grid-sort-icon' />
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className='data-grid-dropdown-trigger'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChevronDown className='data-grid-dropdown-icon' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='data-grid-dropdown-content'>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span className='data-grid-menu-icon'>{icon}</span>
                        Data Type
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onClick={() => handleChangeColumnType(index, 'text')}
                        >
                          <span className='data-grid-menu-icon'>ABC</span>
                          Text
                          {type === 'text' && (
                            <span className='data-grid-menu-checkmark'>✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeColumnType(index, 'number')
                          }
                        >
                          <span className='data-grid-menu-icon'>123</span>
                          Number
                          {type === 'number' && (
                            <span className='data-grid-menu-checkmark'>✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleChangeColumnType(index, 'date')}
                        >
                          <span className='data-grid-menu-icon'>📅</span>
                          Date
                          {type === 'date' && (
                            <span className='data-grid-menu-checkmark'>✓</span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleChangeColumnType(index, 'boolean')
                          }
                        >
                          <span className='data-grid-menu-icon'>✓✗</span>
                          Boolean
                          {type === 'boolean' && (
                            <span className='data-grid-menu-checkmark'>✓</span>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(false)}
                    >
                      <ArrowUp className='data-grid-menu-icon' />
                      Sort Ascending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => column.toggleSorting(true)}
                    >
                      <ArrowDown className='data-grid-menu-icon' />
                      Sort Descending
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Filter className='data-grid-menu-icon' />
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
                        <AlignLeft className='data-grid-menu-icon' />
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
                          <AlignLeft className='data-grid-menu-icon' />
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
                          <AlignCenter className='data-grid-menu-icon' />
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
                          <AlignRight className='data-grid-menu-icon' />
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
                          <Unlock className='data-grid-menu-icon' />
                          Make Editable
                        </>
                      ) : (
                        <>
                          <Lock className='data-grid-menu-icon' />
                          Make Read Only
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleInsertColumn(index, 'left')}
                    >
                      <Plus className='data-grid-menu-icon' />
                      Insert Column Left
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleInsertColumn(index, 'right')}
                    >
                      <Plus className='data-grid-menu-icon' />
                      Insert Column Right
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleClearColumn(index)}>
                      <X className='data-grid-menu-icon' />
                      Clear Column
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteColumn(index)}
                      className='text-red-600 focus:text-red-600'
                    >
                      <Trash2 className='data-grid-menu-icon' />
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
    handleRenameColumn,
    handleChangeColumnType,
    handleResizeStart,
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
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
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

  // Delete the right-clicked row
  const handleDeleteCurrentRow = useCallback(() => {
    if (!selectedCell) return;
    handleDeleteRows([selectedCell.row]);
  }, [selectedCell, handleDeleteRows]);

  // Show loading state when no data
  if (!data || data.length === 0) {
    return (
      <div className='w-full h-full flex items-center justify-center text-gray-500'>
        <p>No data loaded. Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className='data-grid-container'>
      {/* Toolbar */}
      <div className='data-grid-toolbar'>
        <div className='data-grid-toolbar-left'></div>
        <div className='data-grid-toolbar-right'>
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
                    <span className='mr-2'>
                      {column.getIsVisible() ? '✓' : ' '}
                    </span>
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
        className='data-grid-table-container'
        tabIndex={0}
        onKeyDown={handleKeyboardNavigation}
      >
        {/* Loading overlay */}
        {virtualData?.isLoading && (
          <div className='data-grid-loading-overlay'>
            <div className='data-grid-loading-content'>
              <Loader2 className='data-grid-loading-spinner' />
              <span className='data-grid-loading-text'>Loading data...</span>
            </div>
          </div>
        )}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => {
                  // Separate row number column from data columns
                  const rowNumHeader = headerGroup.headers.find(h => h.id === 'rowNumber');
                  const dataHeaders = headerGroup.headers.filter(h => h.id !== 'rowNumber');

                  return (
                    <TableRow key={headerGroup.id} className="flex">
                      {/* Row number column (not reorderable) */}
                      {rowNumHeader && (
                        <TableHead
                          key={rowNumHeader.id}
                          style={{
                            width: rowNumHeader.getSize(),
                          }}
                        >
                          {flexRender(
                            rowNumHeader.column.columnDef.header,
                            rowNumHeader.getContext()
                          )}
                        </TableHead>
                      )}

                      {/* Data columns with Motion Reorder */}
                      <Reorder.Group
                        as="div"
                        axis="x"
                        values={columnOrder}
                        onReorder={handleColumnReorder}
                        className="flex flex-1"
                        layoutScroll
                        style={{ overflow: 'visible' }}
                      >
                        {columnOrder.map((colIndex) => {
                          const header = dataHeaders.find(h => h.id === `col_${colIndex}`);
                          if (!header) return null;

                          return (
                            <Reorder.Item
                              key={header.id}
                              value={colIndex}
                              as="div"
                              data-reorder-item
                              dragListener={true}
                              dragControls={undefined}
                              whileDrag={{
                                scale: 1.03,
                                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                                zIndex: 1000,
                                backgroundColor: "rgba(255,255,255,0.95)",
                              }}
                              transition={{
                                layout: {
                                  type: "spring",
                                  stiffness: 350,
                                  damping: 25,
                                },
                              }}
                              style={{
                                width: columnWidths[header.id] || header.getSize(),
                                position: 'relative',
                              }}
                            >
                              <TableHead
                                style={{
                                  width: '100%',
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </TableHead>
                            </Reorder.Item>
                          );
                        })}
                      </Reorder.Group>
                    </TableRow>
                  );
                })}
              </TableHeader>
              <TableBody
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
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
                        className='data-grid-virtual-row'
                        style={{
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {(() => {
                          const allCells = row.getVisibleCells();
                          // Separate fixed columns from data columns
                          const rowNumCell = allCells.find(c => c.column.id === 'rowNumber');
                          const dataCells = allCells.filter(c => c.column.id !== 'rowNumber');

                          // Reorder data cells based on columnOrder
                          const orderedDataCells = columnOrder
                            .map(colIndex => dataCells.find(c => c.column.id === `col_${colIndex}`))
                            .filter((c): c is NonNullable<typeof c> => c !== undefined);

                          // Combine fixed + ordered data cells
                          const orderedCells = [
                            ...(rowNumCell ? [rowNumCell] : []),
                            ...orderedDataCells
                          ];

                          return orderedCells.map((cell, cellIndex) => {
                            // Calculate actual column index
                            // For data cells, map visual index back to original data column index
                            const visualColIndex = cellIndex - 1; // -1 for row number column
                            const actualColIndex = visualColIndex >= 0 ? columnOrder[visualColIndex] : -1;
                            const isDataCell = cellIndex > 0; // Data cells start after row number
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
                                isSelected && 'data-grid-cell-selected',
                                isInFillRange && 'data-grid-cell-fill-range',
                                showFillHandle &&
                                  'data-grid-cell-overflow-visible'
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
                                  className='data-grid-fill-handle'
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
                        });
                        })()}
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
                  <Copy className='data-grid-menu-icon' />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCut}>
                  <Scissors className='data-grid-menu-icon' />
                  Cut
                </ContextMenuItem>
                <ContextMenuItem onClick={handlePaste}>
                  <ClipboardPaste className='data-grid-menu-icon' />
                  Paste
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Cell operations */}
                <ContextMenuItem onClick={handleClearCell}>
                  <X className='data-grid-menu-icon' />
                  Clear Cell
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Row operations */}
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Plus className='data-grid-menu-icon' />
                    Insert Row
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem onClick={handleInsertRowAbove}>
                      <ArrowUp className='data-grid-menu-icon' />
                      Insert Above
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleInsertRowBelow}>
                      <ArrowDown className='data-grid-menu-icon' />
                      Insert Below
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem
                  onClick={handleDeleteCurrentRow}
                >
                  <Trash2 className='data-grid-menu-icon' />
                  Delete Row
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Column operations */}
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Plus className='data-grid-menu-icon' />
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
                  <Trash2 className='data-grid-menu-icon' />
                  Delete Column
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleClearColumn(selectedCell.col)}
                >
                  <X className='data-grid-menu-icon' />
                  Clear Column
                </ContextMenuItem>
                <ContextMenuSeparator />

                {/* Column properties */}
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <AlignLeft className='data-grid-menu-icon' />
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
                      <AlignLeft className='data-grid-menu-icon' />
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
                      <AlignCenter className='data-grid-menu-icon' />
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
                      <AlignRight className='data-grid-menu-icon' />
                      Right
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem onClick={handleToggleReadOnly}>
                  {readOnlyColumns.has(`col_${selectedCell.col}`) ? (
                    <>
                      <Unlock className='data-grid-menu-icon' />
                      Make Editable
                    </>
                  ) : (
                    <>
                      <Lock className='data-grid-menu-icon' />
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
      <div className='data-grid-pagination'>
        <div className='data-grid-pagination-info'>
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
        </div>
        <div className='data-grid-pagination-controls'>
          <div className='data-grid-pagination-size'>
            <span className='data-grid-pagination-size-label'>
              Rows per page:
            </span>
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
          <div className='data-grid-pagination-buttons'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='data-grid-pagination-page-info'>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <Button
              variant='outline'
              size='icon'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
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
