# FormRow & FormCol - Flexible Form Layouts

## Overview

`FormRow` and `FormCol` provide flexible, semantic form layouts beyond the constraints of `FormGrid`. Use these when you need:

- **Variable column widths** - Some columns wider than others
- **Auto-sizing columns** - Let columns grow based on content
- **Fine-grained control** - Precise layout control for complex forms
- **Responsive layouts** - Easy adjustments for different screen sizes

---

## Components

### `<FormRow />` - Horizontal Container

Creates a horizontal flex container with configurable gap and alignment.

**Props:**
```typescript
interface FormRowProps {
  children: ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';           // Default: 'md'
  align?: 'start' | 'center' | 'end' | 'stretch';  // Default: 'start'
}
```

**Gap Values:**
- `sm`: `gap-1` (0.25rem / 4px)
- `md`: `gap-2` (0.5rem / 8px)
- `lg`: `gap-4` (1rem / 16px)

**Align Values:**
- `start`: Items aligned to top
- `center`: Items centered vertically
- `end`: Items aligned to bottom
- `stretch`: Items stretched to fill height

---

### `<FormCol />` - Column Wrapper

Defines column width within a `FormRow`.

**Props:**
```typescript
interface FormColProps {
  children: ReactNode;
  className?: string;
  span?: 'auto' | 'full' | 1 | 2 | 3 | 4 | 6 | 8 | 12;  // Default: 'auto'
}
```

**Span Values:**
- `auto`: `flex-1` - Grows to fill available space
- `full`: `w-full` - Full width (12/12)
- `1`: `w-1/12` - 8.33% width
- `2`: `w-2/12` - 16.67% width
- `3`: `w-3/12` - 25% width (quarter)
- `4`: `w-4/12` - 33.33% width (third)
- `6`: `w-6/12` - 50% width (half)
- `8`: `w-8/12` - 66.67% width (two-thirds)
- `12`: `w-full` - 100% width

---

## Usage Examples

### Basic Two-Column Layout

```tsx
<FormRow>
  <FormCol span='auto'>
    <FormField type='text' label='First Name' value={firstName} onChange={setFirstName} />
  </FormCol>
  <FormCol span='auto'>
    <FormField type='text' label='Last Name' value={lastName} onChange={setLastName} />
  </FormCol>
</FormRow>
```

**Result:** Two equal-width columns

---

### Unequal Column Widths

```tsx
<FormRow>
  <FormCol span='auto'>
    <FormField
      type='select'
      label='Font'
      value={font}
      onChange={setFont}
      options={fontOptions}
    />
  </FormCol>
  <FormCol span={4}>
    <FormField
      type='number'
      label='Size'
      value={size}
      onChange={setSize}
      min={8}
      max={72}
    />
  </FormCol>
</FormRow>
```

**Result:** Font selector takes 2/3 width, Size takes 1/3 width

---

### Three-Column with Custom Widths

```tsx
<FormRow gap='md'>
  <FormCol span={6}>
    <FormField type='text' label='Street Address' value={street} onChange={setStreet} />
  </FormCol>
  <FormCol span={3}>
    <FormField type='text' label='City' value={city} onChange={setCity} />
  </FormCol>
  <FormCol span={3}>
    <FormField type='text' label='Postal Code' value={postal} onChange={setPostal} />
  </FormCol>
</FormRow>
```

**Result:** 50% + 25% + 25% layout

---

### Centered Alignment

```tsx
<FormRow align='center' gap='lg'>
  <FormCol span={4}>
    <FormField type='text' label='Code' value={code} onChange={setCode} />
  </FormCol>
  <FormCol span='auto'>
    <span className='text-sm text-zinc-500'>Enter your activation code</span>
  </FormCol>
</FormRow>
```

**Result:** Input and helper text vertically centered

---

### Responsive Widths

```tsx
<FormRow gap='md'>
  <FormCol span={8} className='md:w-6/12 lg:w-4/12'>
    <FormField type='select' label='Category' value={category} onChange={setCategory} options={categories} />
  </FormCol>
  <FormCol span={4} className='md:w-6/12 lg:w-8/12'>
    <FormField type='text' label='Description' value={description} onChange={setDescription} />
  </FormCol>
</FormRow>
```

**Result:** Responsive layout that changes at breakpoints

---

## FormRow vs FormGrid

### When to use FormGrid

✅ **Equal column widths**
```tsx
<FormGrid columns={3}>
  <FormField type='number' label='Top' ... />
  <FormField type='number' label='Right' ... />
  <FormField type='number' label='Bottom' ... />
</FormGrid>
```

✅ **Simple, predictable layouts**
✅ **Quick prototyping**

---

### When to use FormRow + FormCol

✅ **Unequal column widths**
```tsx
<FormRow>
  <FormCol span='auto'>
    <FormField type='select' label='Font' ... />
  </FormCol>
  <FormCol span={4}>
    <FormField type='number' label='Size' ... />
  </FormCol>
</FormRow>
```

✅ **Complex responsive layouts**
✅ **Mixed content types** (inputs + text + buttons)
✅ **Fine-grained control**

---

## Real-World Examples

### Form with Label and Input Side-by-Side

```tsx
<FormRow align='center' gap='md'>
  <FormCol span={3}>
    <Label className='settings-label-secondary'>API Key</Label>
  </FormCol>
  <FormCol span='auto'>
    <FormField
      type='text'
      value={apiKey}
      onChange={setApiKey}
      placeholder='Enter your API key'
    />
  </FormCol>
</FormRow>
```

---

### Button Group with Helper Text

```tsx
<FormSection title='Visibility'>
  <FormRow align='center' gap='md'>
    <FormCol span='auto'>
      <FormField
        type='button-group'
        value={visibility}
        onChange={setVisibility}
        options={[
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' },
          { value: 'unlisted', label: 'Unlisted' },
        ]}
      />
    </FormCol>
    <FormCol span={4}>
      <p className='text-xs text-zinc-500'>
        Control who can see this chart
      </p>
    </FormCol>
  </FormRow>
</FormSection>
```

---

### Complex Multi-Row Form

```tsx
<FormSection title='User Profile'>
  {/* Row 1: Name fields */}
  <FormRow gap='md'>
    <FormCol span='auto'>
      <FormField type='text' label='First Name' value={firstName} onChange={setFirstName} />
    </FormCol>
    <FormCol span='auto'>
      <FormField type='text' label='Last Name' value={lastName} onChange={setLastName} />
    </FormCol>
  </FormRow>

  {/* Row 2: Email (full width) */}
  <FormRow>
    <FormCol span='full'>
      <FormField type='email' label='Email Address' value={email} onChange={setEmail} />
    </FormCol>
  </FormRow>

  {/* Row 3: Phone and Extension */}
  <FormRow gap='md'>
    <FormCol span={8}>
      <FormField type='text' label='Phone Number' value={phone} onChange={setPhone} />
    </FormCol>
    <FormCol span={4}>
      <FormField type='text' label='Ext.' value={ext} onChange={setExt} />
    </FormCol>
  </FormRow>

  {/* Row 4: Address fields */}
  <FormRow gap='md'>
    <FormCol span={8}>
      <FormField type='text' label='Street' value={street} onChange={setStreet} />
    </FormCol>
    <FormCol span={4}>
      <FormField type='text' label='Apt/Unit' value={unit} onChange={setUnit} />
    </FormCol>
  </FormRow>

  <FormRow gap='md'>
    <FormCol span={6}>
      <FormField type='text' label='City' value={city} onChange={setCity} />
    </FormCol>
    <FormCol span={3}>
      <FormField type='select' label='State' value={state} onChange={setState} options={states} />
    </FormCol>
    <FormCol span={3}>
      <FormField type='text' label='ZIP' value={zip} onChange={setZip} />
    </FormCol>
  </FormRow>
</FormSection>
```

---

## Nesting and Combining

You can combine FormRow, FormCol, and FormGrid for complex layouts:

```tsx
<FormSection title='Advanced Settings'>
  {/* Top row: Full-width field */}
  <FormRow>
    <FormCol span='full'>
      <FormField type='text' label='Project Name' ... />
    </FormCol>
  </FormRow>

  {/* Middle: Two-column with nested grid */}
  <FormRow gap='lg'>
    <FormCol span={6}>
      <div className='settings-nested-section'>
        <FormGrid columns={2}>
          <FormField type='number' label='Width' ... />
          <FormField type='number' label='Height' ... />
        </FormGrid>
      </div>
    </FormCol>
    <FormCol span={6}>
      <FormField type='textarea' label='Description' ... rows={4} />
    </FormCol>
  </FormRow>

  {/* Bottom: Three equal columns using FormGrid */}
  <FormGrid columns={3}>
    <FormField type='color' label='Primary' ... />
    <FormField type='color' label='Secondary' ... />
    <FormField type='color' label='Accent' ... />
  </FormGrid>
</FormSection>
```

---

## Comparison: Before vs After

### Before (Manual Flex)

```tsx
<div className='flex gap-2 items-start'>
  <div className='flex-1'>
    <FormField type='select' label='Font' ... />
  </div>
  <div className='w-4/12'>
    <FormField type='number' label='Size' ... />
  </div>
</div>
```

### After (FormRow + FormCol)

```tsx
<FormRow gap='md' align='start'>
  <FormCol span='auto'>
    <FormField type='select' label='Font' ... />
  </FormCol>
  <FormCol span={4}>
    <FormField type='number' label='Size' ... />
  </FormCol>
</FormRow>
```

**Benefits:**
- ✅ More semantic and readable
- ✅ Consistent gap handling
- ✅ Easier to adjust alignment
- ✅ Self-documenting code

---

## CSS Classes Reference

FormRow generates:
```tsx
flex gap-{size} items-{align}
```

FormCol generates:
```tsx
flex-1          // span='auto'
w-full          // span='full'
w-1/12 ... w-full  // span={1...12}
```

---

## Best Practices

### 1. Use FormGrid for Equal Columns
```tsx
// ✅ Good
<FormGrid columns={3}>
  <FormField ... />
  <FormField ... />
  <FormField ... />
</FormGrid>

// ❌ Overkill
<FormRow>
  <FormCol span={4}><FormField ... /></FormCol>
  <FormCol span={4}><FormField ... /></FormCol>
  <FormCol span={4}><FormField ... /></FormCol>
</FormRow>
```

### 2. Use FormRow for Unequal Columns
```tsx
// ✅ Good
<FormRow>
  <FormCol span='auto'><FormField type='select' ... /></FormCol>
  <FormCol span={3}><FormField type='number' ... /></FormCol>
</FormRow>

// ❌ Can't do with FormGrid
```

### 3. Leverage 'auto' for Flexible Widths
```tsx
// ✅ Good - Font grows, size is fixed
<FormRow>
  <FormCol span='auto'><FormField type='select' label='Font' ... /></FormCol>
  <FormCol span={3}><FormField type='number' label='Size' ... /></FormCol>
</FormRow>
```

### 4. Use Alignment for Mixed Content
```tsx
// ✅ Good - Centered alignment for mixed heights
<FormRow align='center'>
  <FormCol span='auto'><FormField ... /></FormCol>
  <FormCol span={4}><p className='text-sm'>Helper text</p></FormCol>
</FormRow>
```

---

## Files Created

1. ✅ `components/ui/form-row.tsx` - Row component
2. ✅ `components/ui/form-col.tsx` - Column component
3. ✅ `types/form.ts` - Updated with FormRow and FormCol types
4. ✅ `FORMROW_FORMCOL_GUIDE.md` - This guide

---

## Migration Guide

### Replace Custom Flex Layouts

**Before:**
```tsx
<div className='flex gap-2'>
  <div className='flex-1'>
    <FormField ... />
  </div>
  <div className='w-1/3'>
    <FormField ... />
  </div>
</div>
```

**After:**
```tsx
<FormRow gap='md'>
  <FormCol span='auto'>
    <FormField ... />
  </FormCol>
  <FormCol span={4}>
    <FormField ... />
  </FormCol>
</FormRow>
```

---

## Summary

**FormRow + FormCol** provide:
- ✅ Semantic, readable layouts
- ✅ Flexible column widths
- ✅ Built-in gap and alignment
- ✅ Responsive-friendly
- ✅ Type-safe props
- ✅ Perfect complement to FormGrid

**Use them when you need more control than FormGrid offers!** 🎯
