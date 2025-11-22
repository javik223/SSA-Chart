'use client';

import { Separator } from '@/components/ui/separator';
import { YAxisGeneralSettings } from './y-axis/YAxisGeneralSettings';
import { YAxisScaleSettings } from './y-axis/YAxisScaleSettings';
import { YAxisTitleSettings } from './y-axis/YAxisTitleSettings';
import { YAxisTickSettings } from './y-axis/YAxisTickSettings';
import { YAxisGridSettings } from './y-axis/YAxisGridSettings';

export function YAxisSettings() {
  return (
    <div className='settings-container'>
      <YAxisGeneralSettings />
      <Separator />
      <YAxisScaleSettings />
      <Separator />
      <YAxisTitleSettings />
      <Separator />
      <YAxisTickSettings />
      <Separator />
      <YAxisGridSettings />
    </div>
  );
}
