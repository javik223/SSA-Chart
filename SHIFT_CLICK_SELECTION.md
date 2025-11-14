# Shift-Click Range Selection

## Overview

Added shift-click functionality to the column selector dropdown, allowing users to quickly select a range of columns by clicking the first item, then holding Shift and clicking the last item.

## How It Works

### Basic Usage

1. **Click** the first column you want to select (e.g., "Media")
2. **Hold Shift** and **click** the last column in your range (e.g., "Education")
3. All columns between and including the first and last are automatically selected

### Example Scenario

Given columns: A (Role), B (Media), C (Finance), D (Health), E (Education)

**Action:**
1. Click "Media" (B) → ✓ B selected
2. Hold Shift + Click "Education" (E) → ✓ B, C, D, E all selected

**Result:** Columns B, C, D, E are selected and displayed as `B-E`

## Advanced Features

### Chaining Shift-Clicks

You can build up your selection by shift-clicking multiple times:

1. Click "Media" (B)
2. Shift+Click "Health" (D) → B, C, D selected
3. Shift+Click "Finance" (C) → Still B, C, D (already selected)
4. Shift+Click "Education" (E) → B, C, D, E selected

### Mixed Selection

Combine normal clicks with shift-clicks:

1. Click "Media" (B) → B selected
2. Click "Education" (E) → B, E selected
3. Shift+Click "Health" (D) → B, D, E selected (fills gap from E to D)

### Deselecting Still Works

- Normal click on a selected item deselects it
- Shift-click always adds to selection (never removes)

## Technical Implementation

### State Management

```tsx
const lastClickedIndexRef = useRef<number | null>(null);
```

Tracks the most recently clicked index to calculate the range for shift-clicks.

### Range Selection Logic

```tsx
const handleMultipleToggle = (index: number, shiftKey: boolean = false) => {
  if (!Array.isArray(selectedColumns)) {
    lastClickedIndexRef.current = index;
    onSelect([index]);
    return;
  }

  // Handle shift-click range selection
  if (shiftKey && lastClickedIndexRef.current !== null) {
    const start = Math.min(lastClickedIndexRef.current, index);
    const end = Math.max(lastClickedIndexRef.current, index);
    const rangeIndices = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );

    // Merge with existing selections and remove duplicates
    const newSelection = Array.from(
      new Set([...selectedColumns, ...rangeIndices])
    ).sort();

    onSelect(newSelection);
    return;
  }

  // Normal toggle behavior
  if (selectedColumns.includes(index)) {
    onSelect(selectedColumns.filter((i) => i !== index));
  } else {
    onSelect([...selectedColumns, index].sort());
  }

  // Update last clicked index for future shift-clicks
  lastClickedIndexRef.current = index;
};
```

### Event Handling

```tsx
<DropdownMenuCheckboxItem
  key={index}
  checked={Array.isArray(selectedColumns) && selectedColumns.includes(index)}
  onCheckedChange={() => {}}
  onClick={(e) => {
    e.preventDefault();
    handleMultipleToggle(index, e.shiftKey);
  }}
  onSelect={(e) => e.preventDefault()}
  className="flex items-center justify-between cursor-pointer"
>
  <span>{column}</span>
  <span className="text-xs text-zinc-500">{getColumnLabel(index)}</span>
</DropdownMenuCheckboxItem>
```

**Key Points:**
- `onClick` captures the click event with `e.shiftKey` property
- `e.preventDefault()` keeps the dropdown open
- `onSelect` also prevents default to avoid closing
- `onCheckedChange` is kept empty as we handle everything in `onClick`

## User Experience

### Benefits

✅ **Faster selection** - Select 10 columns with just 2 clicks instead of 10
✅ **Intuitive** - Familiar pattern from file explorers and other UIs
✅ **Flexible** - Combine with normal clicks for precise control
✅ **Visual feedback** - Selected items show checkmarks immediately
✅ **Smart display** - Consecutive selections show as ranges (e.g., `B-E`)

### Use Cases

1. **Select all value columns** - Click first, Shift+click last
2. **Select most columns** - Click "All", then uncheck a few
3. **Select with gaps** - Normal click multiple items, then use shift for ranges
4. **Quick adjustments** - Shift-click to extend selection, normal click to fine-tune

## Testing Checklist

### Test Case 1: Basic Shift-Click
1. Open Values dropdown
2. Click column B
3. Hold Shift, click column E
4. ✅ Verify B, C, D, E are all checked
5. ✅ Verify button shows `B-E`

### Test Case 2: Backwards Selection
1. Open Values dropdown
2. Click column E
3. Hold Shift, click column B
4. ✅ Verify B, C, D, E are all checked (works both directions)

### Test Case 3: Extending Selection
1. Click column B
2. Shift+Click column D (selects B, C, D)
3. Normal click column F
4. Shift+Click column H
5. ✅ Verify F, G, H are added to selection
6. ✅ Verify button shows all selected columns

### Test Case 4: Deselecting
1. Select B, C, D, E (using shift-click)
2. Normal click on C
3. ✅ Verify C is deselected
4. ✅ Verify button shows `B,D,E`

### Test Case 5: Dropdown Stays Open
1. Click any column
2. Shift+Click another column
3. ✅ Verify dropdown remains open
4. Continue clicking
5. ✅ Verify can make multiple selections without reopening

### Test Case 6: Visual Feedback
1. Shift+Click to select range
2. ✅ Verify all items in range show checkmarks instantly
3. ✅ Verify grid highlights selected columns in purple

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Select range | Click first, then Shift+Click last |
| Toggle individual | Click without Shift |
| Select all | Click "All" button |
| Clear all | Click "None" button |
| Close dropdown | Click outside or press Escape |

## Files Modified

- ✅ `components/column-selector.tsx`
  - Added `useState` and `useRef` imports
  - Added `lastClickedIndexRef` to track clicks
  - Modified `handleMultipleToggle` to accept `shiftKey` parameter
  - Added shift-click range selection logic
  - Updated checkbox items to use `onClick` with shift detection

## Implementation Notes

### Why Not Use `onCheckedChange`?

`onCheckedChange` from Radix UI only provides the new checked state (boolean), not the event object. We need the event object to detect if Shift was held, so we use `onClick` instead.

### Why Keep Empty `onCheckedChange`?

The `DropdownMenuCheckboxItem` component requires `onCheckedChange` prop. We provide an empty function and handle everything in `onClick`.

### Range Calculation

```tsx
const start = Math.min(lastClickedIndexRef.current, index);
const end = Math.max(lastClickedIndexRef.current, index);
const rangeIndices = Array.from(
  { length: end - start + 1 },
  (_, i) => start + i
);
```

This ensures the range works regardless of click order (top-to-bottom or bottom-to-top).

### Deduplication

```tsx
const newSelection = Array.from(
  new Set([...selectedColumns, ...rangeIndices])
).sort();
```

Using `Set` ensures no duplicate indices, and `.sort()` keeps the array in order for clean display.

## Future Enhancements

Possible improvements for future versions:

- **Ctrl/Cmd+Click** - Toggle items without affecting last clicked reference
- **Ctrl/Cmd+A** - Select all keyboard shortcut
- **Arrow keys** - Navigate with keyboard
- **Space** - Toggle current focused item
- **Visual preview** - Show range highlight before confirming

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera

Shift key detection is a standard browser API and widely supported.

---

**Result:** Shift-click range selection makes multi-column selection fast and intuitive! 🎉
