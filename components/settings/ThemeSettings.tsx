'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

export function ThemeSettings() {
  const theme = useChartStore((state) => state.theme);
  const setTheme = useChartStore((state) => state.setTheme);

  return (
    <FormRow gap='sm'>
      <FormCol span='auto'>
        <FormField
          type='select'
          value={theme}
          onChange={setTheme}
          options={[
            { value: 'none', label: 'No theme' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
      </FormCol>
      <FormCol span={1}>
        <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
          <RefreshCw className='h-3 w-3' />
        </Button>
      </FormCol>
    </FormRow>
  );
}
