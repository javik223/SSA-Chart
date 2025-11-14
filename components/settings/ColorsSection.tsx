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

// Define color palettes
const COLOR_PALETTES = [
  {
    id: 'default',
    name: 'Default',
    colors: [
      '#0052FF',
      '#00A6FF',
      '#A855F7',
      '#FF006B',
      '#FF5722',
      '#FF9800',
      '#FFC107',
      '#00BFA5',
      '#4CAF50',
      '#F44336',
      '#9E9E9E',
      '#424242',
    ],
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: [
      '#B4D7FF',
      '#FFDCE5',
      '#FFF4CC',
      '#D4F4DD',
      '#E5D4FF',
      '#FFE4CC',
      '#D4F1F4',
      '#FFD4D4',
    ],
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: [
      '#FF0080',
      '#7928CA',
      '#0070F3',
      '#50E3C2',
      '#F5A623',
      '#D0021B',
      '#4A90E2',
      '#BD10E0',
    ],
  },
  {
    id: 'earth',
    name: 'Earth Tones',
    colors: [
      '#8B4513',
      '#A0522D',
      '#CD853F',
      '#DEB887',
      '#D2691E',
      '#BC8F8F',
      '#F4A460',
      '#DAA520',
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: [
      '#006994',
      '#0081A7',
      '#00AFB9',
      '#FDFCDC',
      '#FED9B7',
      '#F07167',
      '#00B4D8',
      '#90E0EF',
    ],
  },
];

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

  const selectedPalette =
    COLOR_PALETTES.find((p) => p.id === colorPalette) || COLOR_PALETTES[0];

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
          {/* Color swatches display */}
          <div className='flex items-center gap-2'>
            <div className='flex-1 flex items-center gap-0.5 border rounded-md p-1 bg-white'>
              {selectedPalette.colors.map((color, index) => (
                <div
                  key={index}
                  className='flex-1 h-8 rounded'
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>

            {/* Palette dropdown */}
            <Select value={colorPalette} onValueChange={setColorPalette}>
              <SelectTrigger className='w-auto h-10 px-3 border rounded-md gap-2'>
                <div className='flex gap-0.5'>
                  {selectedPalette.colors.slice(0, 5).map((color, index) => (
                    <div
                      key={index}
                      className='w-3 h-3 rounded-sm'
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <ChevronDown className='h-4 w-4 opacity-50' />
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
          </div>

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
