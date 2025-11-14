'use client';

import { useChartStore } from '@/store/useChartStore';
import { FormSection } from '@/components/ui/form-section';
import { FormField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { HelpCircle, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COLOR_PALETTES, getColorPalette } from '@/lib/colorPalettes';

export function ColorsSection() {
  const colorMode = useChartStore((state) => state.colorMode);
  const setColorMode = useChartStore((state) => state.setColorMode);
  const colorPalette = useChartStore((state) => state.colorPalette);
  const setColorPalette = useChartStore((state) => state.setColorPalette);
  const colorPaletteExtend = useChartStore((state) => state.colorPaletteExtend);
  const setColorPaletteExtend = useChartStore(
    (state) => state.setColorPaletteExtend
  );
  const colorCustomOverrides = useChartStore(
    (state) => state.colorCustomOverrides
  );
  const setColorCustomOverrides = useChartStore(
    (state) => state.setColorCustomOverrides
  );

  const selectedPalette = getColorPalette(colorPalette);

  return (
    <div className='settings-container'>
      <FormSection title='Color mode' helpIcon>
        <FormField
          type='button-group'
          value={colorMode}
          onChange={setColorMode}
          options={[
            { value: 'by-column', label: 'By column' },
            { value: 'by-row', label: 'By row' },
          ]}
        />
      </FormSection>

      <Separator />

      <FormSection title='Palette'>
        <div className='space-y-3'>
          {/* Color palette selector */}
          <Select value={colorPalette} onValueChange={setColorPalette}>
            <SelectTrigger className='w-full h-auto p-1.5 border rounded-md'>
              <div className='flex items-center gap-1.5 w-full'>
                <div className='flex-1 flex items-center gap-0.5'>
                  {selectedPalette.colors.map((color, index) => (
                    <div
                      key={index}
                      className='flex-1 h-8 rounded'
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <ChevronDown className='h-4 w-4 opacity-50 shrink-0' />
              </div>
            </SelectTrigger>
            <SelectContent>
              {COLOR_PALETTES.map((palette) => (
                <SelectItem key={palette.id} value={palette.id}>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-0.5'>
                      {palette.colors.slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className='w-3 h-3 rounded-sm'
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span>{palette.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Extend toggle */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5'>
              <Label className='text-xs font-normal text-zinc-600'>
                Extend
              </Label>
              <HelpCircle className='h-3 w-3 text-zinc-400' />
            </div>
            <Switch
              checked={colorPaletteExtend}
              onCheckedChange={setColorPaletteExtend}
            />
          </div>
        </div>
      </FormSection>

      <Separator />

      <FormSection title='Custom overrides' helpIcon>
        <Textarea
          value={colorCustomOverrides}
          onChange={(e) => setColorCustomOverrides(e.target.value)}
          placeholder='Enter custom color overrides...'
          className='min-h-[120px] text-xs font-mono'
        />
      </FormSection>
    </div>
  );
}
