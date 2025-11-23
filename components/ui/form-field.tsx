'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FormFieldProps } from '@/types/form';
import {
  ColorPalettePreview,
  ColorPaletteSelectItem,
} from '../settings/ColorsSection';
import { Field, FieldDescription, FieldLabel } from './field';
import { ColorPicker } from './color-picker';

export function FormField( props: FormFieldProps ) {
  const { label, className = '', required, disabled, description, id } = props;

  const renderField = () => {
    switch ( props.type ) {
      case 'text':
      case 'email':
      case 'url':
      case 'password':
        return (
          <Input
            type={ props.type }
            id={ props.id }
            value={ props.value }
            onChange={ ( e ) => props.onChange( e.target.value ) }
            placeholder={ props.placeholder }
            autoComplete={ props.autoComplete }
            disabled={ disabled }
            required={ required }
            className='settings-input-tall'
          />
        );

      case 'number':
        return (
          <Input
            type='number'
            id={ props.id }
            value={ props.value }
            onChange={ ( e ) => {
              const val = e.target.value;
              props.onChange( val === '' ? null : Number( val ) );
            } }
            min={ props.min }
            max={ props.max }
            step={ props.step }
            placeholder={ props.placeholder }
            disabled={ disabled }
            required={ required }
            className='settings-input'
          />
        );

      case 'select':
        return (
          <Select
            value={ props.value }
            onValueChange={ props.onChange }
            disabled={ disabled }
            required={ required }
          >
            <SelectTrigger className='settings-select-trigger'>
              <SelectValue placeholder={ props.placeholder } />
            </SelectTrigger>
            <SelectContent id={ props.id }>
              { props.options.map( ( option, index ) => {
                if ( 'options' in option ) {
                  return (
                    <SelectGroup key={ index }>
                      <SelectLabel>{ option.label }</SelectLabel>
                      { option.options.map( ( subOption ) => (
                        <SelectItem
                          key={ subOption.value }
                          value={ subOption.value }
                          disabled={ subOption.disabled }
                        >
                          { subOption.label }
                        </SelectItem>
                      ) ) }
                    </SelectGroup>
                  );
                }
                return (
                  <SelectItem
                    key={ option.value }
                    value={ option.value }
                    disabled={ option.disabled }
                  >
                    { option.label }
                  </SelectItem>
                );
              } ) }
            </SelectContent>
          </Select>
        );

      case 'button-group':
        return (
          <ButtonGroup className='w-full gap-0'>
            { props.options.map( ( option ) => (
              <Button
                key={ option.value }
                variant={ props.value === option.value ? 'default' : 'outline' }
                size='sm'
                className='settings-button'
                onClick={ () => props.onChange( option.value ) }
                disabled={ disabled }
                title={ option.tooltip }
              >
                { option.icon || option.label }
              </Button>
            ) ) }
          </ButtonGroup>
        );

      case 'switch':
        return (
          <div className='settings-switch-row'>
            { props.description && (
              <div className='flex-1'>
                { label && <FieldLabel>{ label }</FieldLabel> }
                { props.description && (
                  <FieldDescription>{ props.description }</FieldDescription>
                ) }
              </div>
            ) }
            <Switch
              id={ props.id }
              checked={ props.checked }
              onCheckedChange={ props.onChange }
              disabled={ disabled }
            />
          </div>
        );

      case 'color':
        return (
          // <Input
          //   type='color'
          //   id={props.id}
          //   value={props.value}
          //   onChange={(e) => props.onChange(e.target.value)}
          //   disabled={disabled}
          //   className='settings-color-input'
          // />
          <ColorPicker
            value={ props.value }
            onChange={ props.onChange }
            className='settings-color-input'
          />
        );

      case 'textarea':
        return (
          <textarea
            id={ props.id }
            value={ props.value }
            onChange={ ( e ) => props.onChange( e.target.value ) }
            placeholder={ props.placeholder }
            rows={ props.rows || 4 }
            disabled={ disabled }
            required={ required }
            className='settings-textarea'
          />
        );

      case 'color-palette':
        return (
          <div className='space-y-3'>
            {/* Color palette selector */ }
            <Select value={ props.value.name } onValueChange={ props.onChange }>
              <SelectTrigger className='w-full h-auto p-1.5 border border-zinc-200 rounded-md relative'>
                <span className='absolute my-auto pl-2 text-black text-xs font-medium mix-blend-plus-soft-light opacity-70'>
                  { props.value.name }
                </span>
                <div className='flex-1 flex items-center'>
                  { props.value.colors.map( ( color, index ) => (
                    <ColorPalettePreview key={ index } color={ color } />
                  ) ) }
                </div>
              </SelectTrigger>
              <SelectContent id={ props.id }>
                { props.options.map( ( palette ) => (
                  <SelectItem key={ palette.id } value={ palette.id }>
                    <div className='flex items-center gap-2'>
                      <div className='flex'>
                        { palette.colors.slice( 0, 6 ).map( ( color, index ) => (
                          <ColorPaletteSelectItem key={ index } color={ color } />
                        ) ) }
                      </div>
                      <span>{ palette.name }</span>
                    </div>
                  </SelectItem>
                ) ) }
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  // For switch fields with description, label is rendered inside
  if ( props.type === 'switch' && props.description ) {
    return <div className={ `settings-field ${ className }` }>{ renderField() }</div>;
  }

  return (
    <Field className={ `settings-field ${ className }` }>
      { label && (
        <FieldLabel className='settings-label-primary' htmlFor={ id }>
          { label }
        </FieldLabel>
      ) }
      { renderField() }
      { description && <FieldDescription className='-mt-2!'>{ description }</FieldDescription> }
    </Field>
  );
}
