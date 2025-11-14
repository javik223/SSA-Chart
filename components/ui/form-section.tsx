'use client';

import { FormSectionProps } from '@/types/form';
import { Label } from '@/components/ui/label';
import { CircleHelp } from 'lucide-react';
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from './field';
import { cn } from '@/lib/utils';

export function FormSection({
  title,
  children,
  helpIcon = false,
  className = '',
  description,
  ...props
}: FormSectionProps & Partial<typeof FieldGroup>) {
  return (
    <FieldGroup className={className} {...props}>
      {(title || description) && (
        <FieldSet className='gap-0'>
          {title && (
            <FieldLegend
              className={cn(
                'uppercase',
                'tracking-widest',
                'settings-legend-title',
                {
                  'settings-label-with-icon': helpIcon,
                }
              )}
            >
              {title}
              {helpIcon && <CircleHelp className='settings-help-icon' />}
            </FieldLegend>
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldSet>
      )}
      {children}
    </FieldGroup>
  );
}
