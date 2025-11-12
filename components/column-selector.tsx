"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X, Check } from "lucide-react";

interface ColumnSelectorProps {
  availableColumns: string[];
  selectedColumns: number | number[] | null;
  onSelect: (index: number | number[]) => void;
  mode?: "single" | "multiple";
  placeholder?: string;
  color?: "pink" | "purple" | "blue" | "cyan";
  compact?: boolean;
}

const colorClasses = {
  pink: "bg-pink-200 text-pink-900",
  purple: "bg-purple-200 text-purple-900",
  blue: "bg-blue-200 text-blue-900",
  cyan: "bg-cyan-200 text-cyan-900",
};

export function ColumnSelector({
  availableColumns,
  selectedColumns,
  onSelect,
  mode = "single",
  placeholder = "Select column",
  color = "pink",
  compact = false,
}: ColumnSelectorProps) {
  const getColumnLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  };

  const getSelectedLabel = () => {
    if (selectedColumns === null) return "";
    if (Array.isArray(selectedColumns)) {
      if (selectedColumns.length === 0) return "";
      if (selectedColumns.length === 1) return getColumnLabel(selectedColumns[0]);
      const first = selectedColumns[0];
      const last = selectedColumns[selectedColumns.length - 1];
      return `${getColumnLabel(first)}-${getColumnLabel(last)}`;
    }
    return getColumnLabel(selectedColumns);
  };

  const handleSingleSelect = (index: number) => {
    onSelect(index);
  };

  const handleMultipleToggle = (index: number) => {
    if (!Array.isArray(selectedColumns)) {
      onSelect([index]);
      return;
    }

    if (selectedColumns.includes(index)) {
      onSelect(selectedColumns.filter((i) => i !== index));
    } else {
      onSelect([...selectedColumns, index].sort());
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(mode === "single" ? null as any : []);
  };

  const selectedLabel = getSelectedLabel();
  const hasSelection = mode === "single" ? selectedColumns !== null : Array.isArray(selectedColumns) && selectedColumns.length > 0;

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex h-7 w-14 items-center justify-center rounded text-sm font-semibold transition-opacity hover:opacity-80 ${colorClasses[color]}`}
          >
            {selectedLabel || "—"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {availableColumns.length === 0 ? (
            <DropdownMenuItem disabled>No columns available</DropdownMenuItem>
          ) : mode === "single" ? (
            availableColumns.map((column, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleSingleSelect(index)}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 flex-1">
                  {selectedColumns === index && (
                    <Check className="h-3 w-3 text-zinc-900" />
                  )}
                  <span>{column}</span>
                </div>
                <span className="text-xs text-zinc-500">{getColumnLabel(index)}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500">
                Select columns
              </div>
              <DropdownMenuSeparator />
              {availableColumns.map((column, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={Array.isArray(selectedColumns) && selectedColumns.includes(index)}
                  onCheckedChange={() => handleMultipleToggle(index)}
                  className="flex items-center justify-between"
                >
                  <span>{column}</span>
                  <span className="text-xs text-zinc-500">{getColumnLabel(index)}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 justify-between text-xs h-7"
            size="sm"
          >
            {hasSelection ? (
              <span className="text-zinc-900">
                {mode === "multiple" && Array.isArray(selectedColumns)
                  ? `${selectedColumns.length} column${selectedColumns.length > 1 ? "s" : ""} selected`
                  : availableColumns[selectedColumns as number] || placeholder}
              </span>
            ) : (
              <span className="text-zinc-500">{placeholder}</span>
            )}
            {hasSelection ? (
              <X
                className="h-3 w-3 text-zinc-500 hover:text-zinc-700"
                onClick={handleClear}
              />
            ) : (
              <ChevronDown className="h-3 w-3 text-zinc-500" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {availableColumns.length === 0 ? (
            <DropdownMenuItem disabled>No columns available</DropdownMenuItem>
          ) : mode === "single" ? (
            availableColumns.map((column, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleSingleSelect(index)}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 flex-1">
                  {selectedColumns === index && (
                    <Check className="h-3 w-3 text-zinc-900" />
                  )}
                  <span>{column}</span>
                </div>
                <span className="text-xs text-zinc-500">{getColumnLabel(index)}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500">
                Select columns
              </div>
              <DropdownMenuSeparator />
              {availableColumns.map((column, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={Array.isArray(selectedColumns) && selectedColumns.includes(index)}
                  onCheckedChange={() => handleMultipleToggle(index)}
                  className="flex items-center justify-between"
                >
                  <span>{column}</span>
                  <span className="text-xs text-zinc-500">{getColumnLabel(index)}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div
        className={`flex h-7 w-14 items-center justify-center rounded text-sm font-semibold ${colorClasses[color]}`}
      >
        {selectedLabel || "—"}
      </div>
    </div>
  );
}
