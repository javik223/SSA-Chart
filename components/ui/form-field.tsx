'use client';

import { FormFieldProps } from '@/types/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function FormField(props: FormFieldProps) {
  const { label, className = '', required, disabled } = props;

  const renderField = () => {
    switch (props.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'password':
        return (
          <Input
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            autoComplete={props.autoComplete}
            disabled={disabled}
            required={required}
            className='settings-input-tall'
          />
        );

      case 'number':
        return (
          <Input
            type='number'
            value={props.value}
            onChange={(e) => props.onChange(Number(e.target.value))}
            min={props.min}
            max={props.max}
            step={props.step}
            placeholder={props.placeholder}
            disabled={disabled}
            required={required}
            className='settings-input'
          />
        );

      case 'select':
        return (
          <Select
            value={props.value}
            onValueChange={props.onChange}
            disabled={disabled}
            required={required}
          >
            <SelectTrigger className='settings-select-trigger'>
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'button-group':
        return (
          <ButtonGroup className='w-full'>
            {props.options.map((option) => (
              <Button
                key={option.value}
                variant={props.value === option.value ? 'default' : 'outline'}
                size='sm'
                className='settings-button'
                onClick={() => props.onChange(option.value)}
                disabled={disabled}
              >
                {option.icon || option.label}
              </Button>
            ))}
          </ButtonGroup>
        );

      case 'switch':
        return (
          <div className='settings-switch-row'>
            {props.description && (
              <div className='flex-1'>
                {label && (
                  <Label className='settings-label-secondary'>{label}</Label>
                )}
                {props.description && (
                  <p className='text-xs text-zinc-500'>{props.description}</p>
                )}
              </div>
            )}
            <Switch
              checked={props.checked}
              onCheckedChange={props.onChange}
              disabled={disabled}
            />
          </div>
        );

      case 'color':
        return (
          <Input
            type='color'
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            disabled={disabled}
            className='settings-color-input'
          />
        );

      case 'textarea':
        return (
          <textarea
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 4}
            disabled={disabled}
            required={required}
            className='settings-textarea'
          />
        );

      default:
        return null;
    }
  };

  // For switch fields with description, label is rendered inside
  if (props.type === 'switch' && props.description) {
    return <div className={`settings-field ${className}`}>{renderField()}</div>;
  }

  return (
    <div className={`settings-field ${className}`}>
      {label && <Label className='settings-label-secondary'>{label}</Label>}
      {renderField()}
    </div>
  );
}
