'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Type,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';

export function FooterSettingsSection() {
  const chartFooter = useChartStore((state) => state.chartFooter);
  const setChartFooter = useChartStore((state) => state.setChartFooter);

  const footerAlignment = useChartStore((state) => state.footerAlignment);
  const setFooterAlignment = useChartStore((state) => state.setFooterAlignment);

  // Advanced footer styles
  const footerStylesEnabled = useChartStore((state) => state.footerStylesEnabled);
  const setFooterStylesEnabled = useChartStore((state) => state.setFooterStylesEnabled);
  const footerFont = useChartStore((state) => state.footerFont);
  const setFooterFont = useChartStore((state) => state.setFooterFont);
  const footerFontWeight = useChartStore((state) => state.footerFontWeight);
  const setFooterFontWeight = useChartStore((state) => state.setFooterFontWeight);

  // Source fields
  const footerSourceName = useChartStore((state) => state.footerSourceName);
  const setFooterSourceName = useChartStore((state) => state.setFooterSourceName);
  const footerSourceUrl = useChartStore((state) => state.footerSourceUrl);
  const setFooterSourceUrl = useChartStore((state) => state.setFooterSourceUrl);
  const footerSourceLabel = useChartStore((state) => state.footerSourceLabel);
  const setFooterSourceLabel = useChartStore((state) => state.setFooterSourceLabel);

  // Note fields
  const footerNote = useChartStore((state) => state.footerNote);
  const setFooterNote = useChartStore((state) => state.setFooterNote);
  const footerNoteSecondary = useChartStore((state) => state.footerNoteSecondary);
  const setFooterNoteSecondary = useChartStore((state) => state.setFooterNoteSecondary);

  // Footer logo/image settings
  const footerLogoEnabled = useChartStore((state) => state.footerLogoEnabled);
  const setFooterLogoEnabled = useChartStore((state) => state.setFooterLogoEnabled);
  const footerLogoImageUrl = useChartStore((state) => state.footerLogoImageUrl);
  const setFooterLogoImageUrl = useChartStore((state) => state.setFooterLogoImageUrl);
  const footerLogoImageLink = useChartStore((state) => state.footerLogoImageLink);
  const setFooterLogoImageLink = useChartStore((state) => state.setFooterLogoImageLink);
  const footerLogoHeight = useChartStore((state) => state.footerLogoHeight);
  const setFooterLogoHeight = useChartStore((state) => state.setFooterLogoHeight);
  const footerLogoAlign = useChartStore((state) => state.footerLogoAlign);
  const setFooterLogoAlign = useChartStore((state) => state.setFooterLogoAlign);
  const footerLogoPosition = useChartStore((state) => state.footerLogoPosition);
  const setFooterLogoPosition = useChartStore((state) => state.setFooterLogoPosition);
  const footerLogoPositionTop = useChartStore((state) => state.footerLogoPositionTop);
  const setFooterLogoPositionTop = useChartStore((state) => state.setFooterLogoPositionTop);
  const footerLogoPositionRight = useChartStore((state) => state.footerLogoPositionRight);
  const setFooterLogoPositionRight = useChartStore((state) => state.setFooterLogoPositionRight);
  const footerLogoPositionBottom = useChartStore((state) => state.footerLogoPositionBottom);
  const setFooterLogoPositionBottom = useChartStore((state) => state.setFooterLogoPositionBottom);
  const footerLogoPositionLeft = useChartStore((state) => state.footerLogoPositionLeft);
  const setFooterLogoPositionLeft = useChartStore((state) => state.setFooterLogoPositionLeft);

  // Footer border settings
  const footerBorder = useChartStore((state) => state.footerBorder);
  const setFooterBorder = useChartStore((state) => state.setFooterBorder);
  const footerBorderStyle = useChartStore((state) => state.footerBorderStyle);
  const setFooterBorderStyle = useChartStore((state) => state.setFooterBorderStyle);
  const footerBorderSpace = useChartStore((state) => state.footerBorderSpace);
  const setFooterBorderSpace = useChartStore((state) => state.setFooterBorderSpace);
  const footerBorderWidth = useChartStore((state) => state.footerBorderWidth);
  const setFooterBorderWidth = useChartStore((state) => state.setFooterBorderWidth);
  const footerBorderColor = useChartStore((state) => state.footerBorderColor);
  const setFooterBorderColor = useChartStore((state) => state.setFooterBorderColor);

  return (
    <div className='space-y-4 pb-4'>
      {/* Row 1: Alignment */}
      <div className='space-y-2'>
        <Label className='text-xs font-medium text-zinc-700'>
          Alignment
        </Label>
        <ButtonGroup className='w-full'>
          <Button
            variant={footerAlignment === 'left' ? 'default' : 'outline'}
            size='sm'
            className='flex-1 text-xs h-7'
            onClick={() => setFooterAlignment('left')}
          >
            <AlignLeft className='h-4 w-4' />
          </Button>
          <Button
            variant={footerAlignment === 'center' ? 'default' : 'outline'}
            size='sm'
            className='flex-1 text-xs h-7'
            onClick={() => setFooterAlignment('center')}
          >
            <AlignCenter className='h-4 w-4' />
          </Button>
          <Button
            variant={footerAlignment === 'right' ? 'default' : 'outline'}
            size='sm'
            className='flex-1 text-xs h-7'
            onClick={() => setFooterAlignment('right')}
          >
            <AlignRight className='h-4 w-4' />
          </Button>
        </ButtonGroup>
      </div>

      <Separator />

      {/* Row 2: Advanced Footer Styles */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label className='text-xs font-medium text-zinc-700'>
            Advanced footer styles
          </Label>
          <Switch
            checked={footerStylesEnabled}
            onCheckedChange={setFooterStylesEnabled}
          />
        </div>

        {footerStylesEnabled && (
          <div className='space-y-3 pl-2 border-l-2 border-zinc-200'>
            {/* Row 1: Title Font and Weight */}
            <div className='space-y-2'>
              <Label className='text-xs text-zinc-600'>Title Font</Label>
              <Select value={footerFont} onValueChange={setFooterFont}>
                <SelectTrigger className='h-7 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Same as parent'>Same as parent</SelectItem>
                  <SelectItem value='Inter'>Inter</SelectItem>
                  <SelectItem value='Arial'>Arial</SelectItem>
                  <SelectItem value='Helvetica'>Helvetica</SelectItem>
                  <SelectItem value='Georgia'>Georgia</SelectItem>
                  <SelectItem value='Times New Roman'>Times New Roman</SelectItem>
                  <SelectItem value='Courier New'>Courier New</SelectItem>
                </SelectContent>
              </Select>

              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Weight</Label>
                <ButtonGroup className='w-full'>
                  <Button
                    variant={footerFontWeight === 'bold' ? 'default' : 'outline'}
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setFooterFontWeight('bold')}
                    title='Bold'
                  >
                    <Bold className='h-3 w-3' />
                  </Button>
                  <Button
                    variant={footerFontWeight === 'regular' ? 'default' : 'outline'}
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setFooterFontWeight('regular')}
                    title='Regular'
                  >
                    <Type className='h-3 w-3' />
                  </Button>
                </ButtonGroup>
              </div>
            </div>

            {/* Row 2: Source Text Fields */}
            <div className='space-y-2'>
              <Label className='text-xs text-zinc-600'>Text</Label>
              <div className='space-y-2'>
                <Input
                  type='text'
                  value={footerSourceName}
                  onChange={(e) => setFooterSourceName(e.target.value)}
                  className='h-7 text-xs'
                  placeholder='Source name'
                />
                <Input
                  type='text'
                  value={footerSourceUrl}
                  onChange={(e) => setFooterSourceUrl(e.target.value)}
                  className='h-7 text-xs'
                  placeholder='Source URL'
                />
                <Input
                  type='text'
                  value={footerSourceLabel}
                  onChange={(e) => setFooterSourceLabel(e.target.value)}
                  className='h-7 text-xs'
                  placeholder='Source label (for Citation)'
                />
              </div>
            </div>

            {/* Row 3: Note Fields */}
            <div className='space-y-2'>
              <Label className='text-xs text-zinc-600'>Note</Label>
              <textarea
                value={footerNote}
                onChange={(e) => setFooterNote(e.target.value)}
                className='w-full h-16 px-3 py-2 text-xs border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                placeholder='Note'
              />
              <textarea
                value={footerNoteSecondary}
                onChange={(e) => setFooterNoteSecondary(e.target.value)}
                className='w-full h-16 px-3 py-2 text-xs border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                placeholder='Note (secondary)'
              />
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Row 3: Logo/Image */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label className='text-xs font-medium text-zinc-700'>
            Add logo or image
          </Label>
          <Switch
            checked={footerLogoEnabled}
            onCheckedChange={setFooterLogoEnabled}
          />
        </div>

        {footerLogoEnabled && (
          <div className='space-y-3 pl-2 border-l-2 border-zinc-200'>
            {/* Row 1: Upload and Link */}
            <div className='space-y-2'>
              <Input
                type='text'
                value={footerLogoImageUrl}
                onChange={(e) => setFooterLogoImageUrl(e.target.value)}
                className='h-7 text-xs'
                placeholder='Upload image or enter URL'
              />
              <Input
                type='text'
                value={footerLogoImageLink}
                onChange={(e) => setFooterLogoImageLink(e.target.value)}
                className='h-7 text-xs'
                placeholder='Input link (optional)'
              />
            </div>

            {/* Row 2: Height and Align */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Height (px)</Label>
                <Input
                  type='number'
                  value={footerLogoHeight}
                  onChange={(e) => setFooterLogoHeight(Number(e.target.value))}
                  className='h-7 text-xs'
                  min={10}
                  max={200}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Align</Label>
                <Select value={footerLogoAlign} onValueChange={setFooterLogoAlign}>
                  <SelectTrigger className='h-7 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='footer'>Footer</SelectItem>
                    <SelectItem value='main-container'>Main Container</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3: Position Button Group */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Position</Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={footerLogoPosition === 'bottom' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setFooterLogoPosition('bottom')}
                >
                  <ArrowDown className='h-4 w-4' />
                </Button>
                <Button
                  variant={footerLogoPosition === 'left' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setFooterLogoPosition('left')}
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant={footerLogoPosition === 'right' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setFooterLogoPosition('right')}
                >
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </ButtonGroup>
            </div>

            {/* Row 4: Position Fields */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Top (px)</Label>
                <Input
                  type='number'
                  value={footerLogoPositionTop}
                  onChange={(e) => setFooterLogoPositionTop(Number(e.target.value))}
                  className='h-7 text-xs'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Right (px)</Label>
                <Input
                  type='number'
                  value={footerLogoPositionRight}
                  onChange={(e) => setFooterLogoPositionRight(Number(e.target.value))}
                  className='h-7 text-xs'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Bottom (px)</Label>
                <Input
                  type='number'
                  value={footerLogoPositionBottom}
                  onChange={(e) => setFooterLogoPositionBottom(Number(e.target.value))}
                  className='h-7 text-xs'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Left (px)</Label>
                <Input
                  type='number'
                  value={footerLogoPositionLeft}
                  onChange={(e) => setFooterLogoPositionLeft(Number(e.target.value))}
                  className='h-7 text-xs'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Row 4: Border */}
      <div className='space-y-2'>
        <Label className='text-xs font-medium text-zinc-700'>Border</Label>
        <Select value={footerBorder} onValueChange={setFooterBorder}>
          <SelectTrigger className='h-7 text-xs'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='none'>None</SelectItem>
            <SelectItem value='top'>Top</SelectItem>
            <SelectItem value='bottom'>Bottom</SelectItem>
            <SelectItem value='top-bottom'>Top & Bottom</SelectItem>
          </SelectContent>
        </Select>

        {footerBorder !== 'none' && (
          <div className='space-y-3 pl-2 border-l-2 border-zinc-200'>
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Style</Label>
                <Select
                  value={footerBorderStyle}
                  onValueChange={setFooterBorderStyle}
                >
                  <SelectTrigger className='h-7 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='solid'>Solid</SelectItem>
                    <SelectItem value='dashed'>Dashed</SelectItem>
                    <SelectItem value='dotted'>Dotted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Space (px)</Label>
                <Input
                  type='number'
                  value={footerBorderSpace}
                  onChange={(e) => setFooterBorderSpace(Number(e.target.value))}
                  className='h-7 text-xs'
                  min={0}
                  max={50}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Width (px)</Label>
                <Input
                  type='number'
                  value={footerBorderWidth}
                  onChange={(e) => setFooterBorderWidth(Number(e.target.value))}
                  className='h-7 text-xs'
                  min={1}
                  max={10}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Color</Label>
                <ColorPicker
                  value={footerBorderColor}
                  onChange={setFooterBorderColor}
                  className='h-7 w-full'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
