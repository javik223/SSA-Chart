'use client';

import { ReactNode } from 'react';

interface FormColProps {
  children: ReactNode;
  className?: string;
  span?: 'auto' | 'full' | 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12;
}

export function FormCol( {
  children,
  className = '',
  span = 'auto'
}: FormColProps ) {
  const spanClass = {
    'auto': 'flex-1',
    'full': 'w-full',
    1: 'w-1/12',
    2: 'w-2/12',
    3: 'w-3/12',
    4: 'w-4/12',
    6: 'w-6/12',
    8: 'w-8/12',
    10: 'w-10/12',
    12: 'w-full',
  }[ span ];

  return (
    <div className={ `${ spanClass } ${ className }` }>
      { children }
    </div>
  );
}
