'use client';

import { FormSectionProps } from '@/types/form';
import { Label } from '@/components/ui/label';
import { CircleHelp } from 'lucide-react';

export function FormSection({
  title,
  children,
  helpIcon = false,
  className = '',
}: FormSectionProps) {
  return (
    <div className={`settings-section ${className}`}>
      {title && (
        <Label
          className={
            helpIcon
              ? 'settings-label-with-icon'
              : 'settings-label-primary'
          }
        >
          {title}
          {helpIcon && <CircleHelp className='settings-help-icon' />}
        </Label>
      )}
      {children}
    </div>
  );
}
