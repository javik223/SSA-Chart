import { COLOR_PALETTES } from '@/lib/colorPalettes';
import { ReactNode } from 'react';

// Base field props shared across all field types
interface BaseFieldProps {
  label?: string;
  description?: string;
  id?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

// Text input field
interface TextInputField extends BaseFieldProps {
  type: 'text' | 'email' | 'url' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

// Number input field
interface NumberInputField extends BaseFieldProps {
  type: 'number';
  value: number | string;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

// Select field
interface SelectField extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: any) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

// Button group field
interface ButtonGroupField extends BaseFieldProps {
  type: 'button-group';
  value: string;
  onChange: (value: any) => void;
  options: Array<{ value: string; label?: string; icon?: ReactNode }>;
}

// Switch field
interface SwitchField extends BaseFieldProps {
  type: 'switch';
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

// Color picker field
interface ColorField extends BaseFieldProps {
  type: 'color';
  value: string;
  onChange: (value: string) => void;
}

// Textarea field
interface TextareaField extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface ColorPaletteField extends BaseFieldProps {
  type: 'color-palette';
  options: typeof COLOR_PALETTES;
  value: (typeof COLOR_PALETTES)[0];
  onChange: (value: string) => void;
}

// Discriminated union of all field types
export type FormFieldProps =
  | TextInputField
  | NumberInputField
  | SelectField
  | ButtonGroupField
  | SwitchField
  | ColorField
  | TextareaField
  | ColorPaletteField;

// Form section props
export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  helpIcon?: boolean;
  className?: string;
}

// Form grid props
export interface FormGridProps {
  columns?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}

// Form row props
export interface FormRowProps {
  children: ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

// Form column props
export interface FormColProps {
  children: ReactNode;
  className?: string;
  span?: 'auto' | 'full' | 1 | 2 | 3 | 4 | 6 | 8 | 12;
}
