# Column Selector - Quick Guide

## Multi-Select Features

### Basic Selection
- **Click** - Toggle individual column
- **Shift+Click** - Select range from last click to current
- **"All" button** - Select all columns
- **"None" button** - Deselect all columns

## Common Workflows

### Select Consecutive Columns (e.g., B, C, D, E)
1. Click first column (B)
2. Hold Shift + Click last column (E)
3. Result: `B-E` displayed on button

### Select Non-Consecutive Columns (e.g., B, D, F)
1. Click B
2. Click D (without Shift)
3. Click F (without Shift)
4. Result: `B,D,F` displayed on button

### Select Most Columns
1. Click "All" button
2. Uncheck the few you don't want
3. Result: All except unchecked

### Quick Adjustments
1. Make initial selection (click or shift-click)
2. Normal click to deselect specific items
3. Shift-click to extend range
4. Result: Fine-tuned selection

## Display Format

| Selection | Display |
|-----------|---------|
| None | `—` |
| Single (B) | `B` |
| Consecutive (B,C,D) | `B-D` |
| Non-consecutive (B,D,F) | `B,D,F` |
| Many (>5) | `B-F` or comma list |

## Tips

💡 **Dropdown stays open** - Make multiple selections without reopening

💡 **Hover for details** - See full column names in tooltip

💡 **Grid highlights** - Selected value columns show purple background

💡 **Auto-format** - Consecutive columns automatically display as ranges

## Keyboard

- **Escape** - Close dropdown
- **Click outside** - Close dropdown
- **Shift+Click** - Range selection

## Behavior

✅ Clicking selected item deselects it
✅ Shift-clicking always adds (never removes)
✅ Order doesn't matter (click B then Shift+E, or E then Shift+B both work)
✅ Selections are always sorted numerically

---

**Quick Start:** Click first column → Shift+Click last column → Done! 🎯
