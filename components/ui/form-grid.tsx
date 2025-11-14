'use client';

import { FormGridProps } from '@/types/form';

export function FormGrid({ columns = 2, children, className = '' }: FormGridProps) {
  const gridClass = {
    2: 'settings-grid-2',
    3: 'settings-grid-3',
    4: 'settings-grid-4',
  }[columns];

  return <div className={`${gridClass} ${className}`}>{children}</div>;
}
