'use client';

import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { Textarea } from '@/components/ui/textarea';
import { COLOR_PALETTES, getColorPalette } from '@/lib/colorPalettes';
import { useChartStore } from '@/store/useChartStore';
import '@/styles/color-selection.css';
import { PropsWithChildren } from 'react';
import { FieldSeparator } from '../ui/field';
import { Separator } from '../ui/separator';

export const ColorPalettePreview = ({
  color,
}: PropsWithChildren<{ color: string }>) => (
  <div
    className='color-palette-preview'
    style={{ backgroundColor: color }}
    title={color}
  />
);

export const ColorPaletteSelectItem = ({
  color,
}: PropsWithChildren<{ color: string }>) => (
  <div
    className='color-palette-select-item'
    style={{ backgroundColor: color }}
  />
);

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
      <FormField
        label='Color mode'
        type='button-group'
        value={colorMode}
        onChange={setColorMode}
        options={[
          { value: 'by-column', label: 'By column' },
          { value: 'by-row', label: 'By row' },
        ]}
      />
      <FormField
        label='Palette'
        type='color-palette'
        options={COLOR_PALETTES}
        onChange={setColorPalette}
        value={selectedPalette}
      />

      <FormField
        type='switch'
        label='Extend palette'
        checked={colorPaletteExtend}
        onChange={setColorPaletteExtend}
        className='flex justify-between'
      />

      {colorPaletteExtend && (
        <FormField
          label='Custom overrides'
          type='textarea'
          value={colorCustomOverrides}
          onChange={(val) => setColorCustomOverrides(val)}
          placeholder='Enter custom color overrides...'
          className='min-h-[120px] text-xs font-mono'
        />
      )}
    </div>
  );
}
