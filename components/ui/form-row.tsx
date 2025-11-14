'use client';

import { ReactNode } from 'react';

interface FormRowProps {
  children: ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function FormRow({
  children,
  className = '',
  gap = 'md',
  align = 'start'
}: FormRowProps) {
  const gapClass = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  }[gap];

  const alignClass = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }[align];

  return (
    <div className={`flex ${gapClass} ${alignClass} ${className}`}>
      {children}
    </div>
  );
}
