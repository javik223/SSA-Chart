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
  Minus,
  Maximize2,
  Maximize,
  Square,
  Bold,
  Type,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';

export function HeaderSettingsSection() {
  const chartTitle = useChartStore((state) => state.chartTitle);
  const setChartTitle = useChartStore((state) => state.setChartTitle);
  const chartSubtitle = useChartStore((state) => state.chartSubtitle);
  const setChartSubtitle = useChartStore((state) => state.setChartSubtitle);
  const headerText = useChartStore((state) => state.headerText);
  const setHeaderText = useChartStore((state) => state.setHeaderText);

  const headerAlignment = useChartStore((state) => state.headerAlignment);
  const setHeaderAlignment = useChartStore((state) => state.setHeaderAlignment);

  // Title settings
  const titleStyleEnabled = useChartStore((state) => state.titleStyleEnabled);
  const setTitleStyleEnabled = useChartStore(
    (state) => state.setTitleStyleEnabled
  );
  const titleFont = useChartStore((state) => state.titleFont);
  const setTitleFont = useChartStore((state) => state.setTitleFont);
  const titleFontSize = useChartStore((state) => state.titleFontSize);
  const setTitleFontSize = useChartStore((state) => state.setTitleFontSize);
  const titleFontWeight = useChartStore((state) => state.titleFontWeight);
  const setTitleFontWeight = useChartStore((state) => state.setTitleFontWeight);
  const titleColor = useChartStore((state) => state.titleColor);
  const setTitleColor = useChartStore((state) => state.setTitleColor);
  const titleLineHeight = useChartStore((state) => state.titleLineHeight);
  const setTitleLineHeight = useChartStore((state) => state.setTitleLineHeight);
  const titleSpaceAbove = useChartStore((state) => state.titleSpaceAbove);
  const setTitleSpaceAbove = useChartStore((state) => state.setTitleSpaceAbove);

  // Subtitle settings
  const subtitleStyleEnabled = useChartStore(
    (state) => state.subtitleStyleEnabled
  );
  const setSubtitleStyleEnabled = useChartStore(
    (state) => state.setSubtitleStyleEnabled
  );
  const subtitleFont = useChartStore((state) => state.subtitleFont);
  const setSubtitleFont = useChartStore((state) => state.setSubtitleFont);
  const subtitleFontSize = useChartStore((state) => state.subtitleFontSize);
  const setSubtitleFontSize = useChartStore(
    (state) => state.setSubtitleFontSize
  );
  const subtitleFontWeight = useChartStore((state) => state.subtitleFontWeight);
  const setSubtitleFontWeight = useChartStore(
    (state) => state.setSubtitleFontWeight
  );
  const subtitleColor = useChartStore((state) => state.subtitleColor);
  const setSubtitleColor = useChartStore((state) => state.setSubtitleColor);
  const subtitleLineHeight = useChartStore((state) => state.subtitleLineHeight);
  const setSubtitleLineHeight = useChartStore(
    (state) => state.setSubtitleLineHeight
  );
  const subtitleSpaceAbove = useChartStore((state) => state.subtitleSpaceAbove);
  const setSubtitleSpaceAbove = useChartStore(
    (state) => state.setSubtitleSpaceAbove
  );

  // Header text settings
  const headerTextStyleEnabled = useChartStore(
    (state) => state.headerTextStyleEnabled
  );
  const setHeaderTextStyleEnabled = useChartStore(
    (state) => state.setHeaderTextStyleEnabled
  );
  const headerTextFont = useChartStore((state) => state.headerTextFont);
  const setHeaderTextFont = useChartStore((state) => state.setHeaderTextFont);
  const headerTextFontSize = useChartStore((state) => state.headerTextFontSize);
  const setHeaderTextFontSize = useChartStore(
    (state) => state.setHeaderTextFontSize
  );
  const headerTextFontWeight = useChartStore(
    (state) => state.headerTextFontWeight
  );
  const setHeaderTextFontWeight = useChartStore(
    (state) => state.setHeaderTextFontWeight
  );
  const headerTextColor = useChartStore((state) => state.headerTextColor);
  const setHeaderTextColor = useChartStore((state) => state.setHeaderTextColor);
  const headerTextLineHeight = useChartStore(
    (state) => state.headerTextLineHeight
  );
  const setHeaderTextLineHeight = useChartStore(
    (state) => state.setHeaderTextLineHeight
  );
  const headerTextSpaceAbove = useChartStore(
    (state) => state.headerTextSpaceAbove
  );
  const setHeaderTextSpaceAbove = useChartStore(
    (state) => state.setHeaderTextSpaceAbove
  );

  // Border settings
  const headerBorder = useChartStore((state) => state.headerBorder);
  const setHeaderBorder = useChartStore((state) => state.setHeaderBorder);
  const headerBorderStyle = useChartStore((state) => state.headerBorderStyle);
  const setHeaderBorderStyle = useChartStore(
    (state) => state.setHeaderBorderStyle
  );
  const headerBorderSpace = useChartStore((state) => state.headerBorderSpace);
  const setHeaderBorderSpace = useChartStore(
    (state) => state.setHeaderBorderSpace
  );
  const headerBorderWidth = useChartStore((state) => state.headerBorderWidth);
  const setHeaderBorderWidth = useChartStore(
    (state) => state.setHeaderBorderWidth
  );
  const headerBorderColor = useChartStore((state) => state.headerBorderColor);
  const setHeaderBorderColor = useChartStore(
    (state) => state.setHeaderBorderColor
  );

  // Logo/Image settings
  const headerLogoEnabled = useChartStore((state) => state.headerLogoEnabled);
  const setHeaderLogoEnabled = useChartStore(
    (state) => state.setHeaderLogoEnabled
  );
  const headerLogoImageUrl = useChartStore((state) => state.headerLogoImageUrl);
  const setHeaderLogoImageUrl = useChartStore(
    (state) => state.setHeaderLogoImageUrl
  );
  const headerLogoImageLink = useChartStore(
    (state) => state.headerLogoImageLink
  );
  const setHeaderLogoImageLink = useChartStore(
    (state) => state.setHeaderLogoImageLink
  );
  const headerLogoHeight = useChartStore((state) => state.headerLogoHeight);
  const setHeaderLogoHeight = useChartStore(
    (state) => state.setHeaderLogoHeight
  );
  const headerLogoAlign = useChartStore((state) => state.headerLogoAlign);
  const setHeaderLogoAlign = useChartStore((state) => state.setHeaderLogoAlign);
  const headerLogoPosition = useChartStore((state) => state.headerLogoPosition);
  const setHeaderLogoPosition = useChartStore(
    (state) => state.setHeaderLogoPosition
  );
  const headerLogoPositionTop = useChartStore(
    (state) => state.headerLogoPositionTop
  );
  const setHeaderLogoPositionTop = useChartStore(
    (state) => state.setHeaderLogoPositionTop
  );
  const headerLogoPositionRight = useChartStore(
    (state) => state.headerLogoPositionRight
  );
  const setHeaderLogoPositionRight = useChartStore(
    (state) => state.setHeaderLogoPositionRight
  );
  const headerLogoPositionBottom = useChartStore(
    (state) => state.headerLogoPositionBottom
  );
  const setHeaderLogoPositionBottom = useChartStore(
    (state) => state.setHeaderLogoPositionBottom
  );
  const headerLogoPositionLeft = useChartStore(
    (state) => state.headerLogoPositionLeft
  );
  const setHeaderLogoPositionLeft = useChartStore(
    (state) => state.setHeaderLogoPositionLeft
  );

  return (
    <div className='space-y-4 pb-4'>
      {/* Row 1: Alignment */}
      <div className='space-y-2'>
        <Label className='text-xs font-medium text-zinc-700'>Alignment</Label>
        <ButtonGroup className='w-full'>
          <Button
            variant={headerAlignment === 'left' ? 'default' : 'outline'}
            size='sm'
            className='flex-1 text-xs h-7'
            onClick={() => setHeaderAlignment('left')}
          >
            <AlignLeft className='h-4 w-4' />
          </Button>
          <Button
            variant={headerAlignment === 'center' ? 'default' : 'outline'}
            size='sm'
            className='flex-1 text-xs h-7'
            onClick={() => setHeaderAlignment('center')}
          >
            <AlignCenter className='h-4 w-4' />
          </Button>
          <Button
            variant={headerAlignment === 'right' ? 'default' : 'outline'}
            size='sm'
            className='flex-1 text-xs h-7'
            onClick={() => setHeaderAlignment('right')}
          >
            <AlignRight className='h-4 w-4' />
          </Button>
        </ButtonGroup>
      </div>

      <Separator />

      {/* Row 2: Title */}
      <div className='space-y-2'>
        <Label className='text-xs font-medium text-zinc-700'>Title</Label>
        <Input
          type='text'
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
          className='h-8 text-xs'
          placeholder='Enter chart title'
        />

        {/* Title Style Switch */}
        <div className='flex items-center justify-between'>
          <Label className='text-xs text-zinc-600'>Custom Style</Label>
          <Switch
            checked={titleStyleEnabled}
            onCheckedChange={setTitleStyleEnabled}
          />
        </div>

        {titleStyleEnabled && (
          <div className='space-y-3 pl-2 border-l-2 border-zinc-200'>
            {/* Title Font */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Font</Label>
              <Select value={titleFont} onValueChange={setTitleFont}>
                <SelectTrigger className='h-7 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Same as parent'>Same as parent</SelectItem>
                  <SelectItem value='Inter'>Inter</SelectItem>
                  <SelectItem value='Arial'>Arial</SelectItem>
                  <SelectItem value='Helvetica'>Helvetica</SelectItem>
                  <SelectItem value='Times New Roman'>
                    Times New Roman
                  </SelectItem>
                  <SelectItem value='Georgia'>Georgia</SelectItem>
                  <SelectItem value='Verdana'>Verdana</SelectItem>
                  <SelectItem value='Roboto'>Roboto</SelectItem>
                  <SelectItem value='Open Sans'>Open Sans</SelectItem>
                  <SelectItem value='Lato'>Lato</SelectItem>
                  <SelectItem value='Montserrat'>Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Size</Label>
              <Input
                type='number'
                value={titleFontSize}
                onChange={(e) => setTitleFontSize(Number(e.target.value))}
                className='h-7 text-xs'
                min={0.1}
                max={5}
                step={0.1}
              />
            </div>

            {/* Weight, Color, Line Height */}
            <div className='grid grid-cols-3 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Weight</Label>
                <ButtonGroup className='w-full'>
                  <Button
                    variant={titleFontWeight === 'bold' ? 'default' : 'outline'}
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setTitleFontWeight('bold')}
                    title='Bold'
                  >
                    <Bold className='h-3 w-3' />
                  </Button>
                  <Button
                    variant={
                      titleFontWeight === 'medium' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setTitleFontWeight('medium')}
                    title='Medium'
                  >
                    M
                  </Button>
                  <Button
                    variant={
                      titleFontWeight === 'regular' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setTitleFontWeight('regular')}
                    title='Regular'
                  >
                    <Type className='h-3 w-3' />
                  </Button>
                </ButtonGroup>
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Color</Label>
                <Input
                  type='color'
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className='h-7 w-full cursor-pointer p-0 border-0'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Line Height</Label>
                <Input
                  type='number'
                  value={titleLineHeight}
                  onChange={(e) => setTitleLineHeight(Number(e.target.value))}
                  className='h-7 text-xs'
                  min={0.8}
                  max={3}
                  step={0.1}
                />
              </div>
            </div>

            {/* Space Above */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Space Above</Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={titleSpaceAbove === 'slim' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setTitleSpaceAbove('slim')}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <Button
                  variant={titleSpaceAbove === 'medium' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setTitleSpaceAbove('medium')}
                >
                  <Maximize2 className='h-4 w-4' />
                </Button>
                <Button
                  variant={titleSpaceAbove === 'large' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setTitleSpaceAbove('large')}
                >
                  <Maximize className='h-4 w-4' />
                </Button>
                <Button
                  variant={titleSpaceAbove === 'none' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setTitleSpaceAbove('none')}
                >
                  <Square className='h-4 w-4' />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Row 3: Subtitle */}
      <div className='space-y-2'>
        <Label className='text-xs font-medium text-zinc-700'>Subtitle</Label>
        <Input
          type='text'
          value={chartSubtitle}
          onChange={(e) => setChartSubtitle(e.target.value)}
          className='h-8 text-xs'
          placeholder='Enter chart subtitle'
        />

        {/* Subtitle Style Switch */}
        <div className='flex items-center justify-between'>
          <Label className='text-xs text-zinc-600'>Custom Style</Label>
          <Switch
            checked={subtitleStyleEnabled}
            onCheckedChange={setSubtitleStyleEnabled}
          />
        </div>

        {subtitleStyleEnabled && (
          <div className='space-y-3 pl-2 border-l-2 border-zinc-200'>
            {/* Subtitle Font */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Font</Label>
              <Select value={subtitleFont} onValueChange={setSubtitleFont}>
                <SelectTrigger className='h-7 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Same as parent'>Same as parent</SelectItem>
                  <SelectItem value='Inter'>Inter</SelectItem>
                  <SelectItem value='Arial'>Arial</SelectItem>
                  <SelectItem value='Helvetica'>Helvetica</SelectItem>
                  <SelectItem value='Times New Roman'>
                    Times New Roman
                  </SelectItem>
                  <SelectItem value='Georgia'>Georgia</SelectItem>
                  <SelectItem value='Verdana'>Verdana</SelectItem>
                  <SelectItem value='Roboto'>Roboto</SelectItem>
                  <SelectItem value='Open Sans'>Open Sans</SelectItem>
                  <SelectItem value='Lato'>Lato</SelectItem>
                  <SelectItem value='Montserrat'>Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Size */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Size</Label>
              <Input
                type='number'
                value={subtitleFontSize}
                onChange={(e) => setSubtitleFontSize(Number(e.target.value))}
                className='h-7 text-xs'
                min={0.1}
                max={5}
                step={0.1}
              />
            </div>

            {/* Weight, Color, Line Height */}
            <div className='grid grid-cols-3 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Weight</Label>
                <ButtonGroup className='w-full'>
                  <Button
                    variant={
                      subtitleFontWeight === 'bold' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setSubtitleFontWeight('bold')}
                    title='Bold'
                  >
                    <Bold className='h-3 w-3' />
                  </Button>
                  <Button
                    variant={
                      subtitleFontWeight === 'medium' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setSubtitleFontWeight('medium')}
                    title='Medium'
                  >
                    M
                  </Button>
                  <Button
                    variant={
                      subtitleFontWeight === 'regular' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setSubtitleFontWeight('regular')}
                    title='Regular'
                  >
                    <Type className='h-3 w-3' />
                  </Button>
                </ButtonGroup>
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Color</Label>
                <Input
                  type='color'
                  value={subtitleColor}
                  onChange={(e) => setSubtitleColor(e.target.value)}
                  className='h-7 w-full cursor-pointer p-0 border-0'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Line Height</Label>
                <Input
                  type='number'
                  value={subtitleLineHeight}
                  onChange={(e) =>
                    setSubtitleLineHeight(Number(e.target.value))
                  }
                  className='h-7 text-xs'
                  min={0.8}
                  max={3}
                  step={0.1}
                />
              </div>
            </div>

            {/* Space Above */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Space Above</Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={
                    subtitleSpaceAbove === 'slim' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setSubtitleSpaceAbove('slim')}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    subtitleSpaceAbove === 'medium' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setSubtitleSpaceAbove('medium')}
                >
                  <Maximize2 className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    subtitleSpaceAbove === 'large' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setSubtitleSpaceAbove('large')}
                >
                  <Maximize className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    subtitleSpaceAbove === 'none' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setSubtitleSpaceAbove('none')}
                >
                  <Square className='h-4 w-4' />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Row 4: Text (Description) */}
      <div className='space-y-2'>
        <Label className='text-xs font-medium text-zinc-700'>Text</Label>
        <textarea
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
          className='w-full h-20 px-3 py-2 text-xs border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
          placeholder='Enter header text or description'
        />

        {/* Text Style Switch */}
        <div className='flex items-center justify-between'>
          <Label className='text-xs text-zinc-600'>Custom Style</Label>
          <Switch
            checked={headerTextStyleEnabled}
            onCheckedChange={setHeaderTextStyleEnabled}
          />
        </div>

        {headerTextStyleEnabled && (
          <div className='space-y-3 py-1 px-2 pb-2 border border-x-zinc-200 rounded-md shadow-xl shadow-slate-200'>
            {/* Text Font */}
            <div className='flex space-y-1 grow'>
              <div className='space-y-1 flex-1'>
                <Label className='text-xs text-zinc-600'>Font</Label>
                <Select value={headerTextFont}>
                  <SelectTrigger className='text-[12px] w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='w-full'>
                    <SelectItem value='Same as parent'>
                      Same as parent
                    </SelectItem>
                    <SelectItem value='Inter'>Inter</SelectItem>
                    <SelectItem value='Arial'>Arial</SelectItem>
                    <SelectItem value='Helvetica'>Helvetica</SelectItem>
                    <SelectItem value='Times New Roman'>
                      Times New Roman
                    </SelectItem>
                    <SelectItem value='Georgia'>Georgia</SelectItem>
                    <SelectItem value='Verdana'>Verdana</SelectItem>
                    <SelectItem value='Roboto'>Roboto</SelectItem>
                    <SelectItem value='Open Sans'>Open Sans</SelectItem>
                    <SelectItem value='Lato'>Lato</SelectItem>
                    <SelectItem value='Montserrat'>Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Size</Label>
                <Input
                  type='number'
                  value={headerTextFontSize}
                  onChange={(e) =>
                    setHeaderTextFontSize(Number(e.target.value))
                  }
                  className='text-xs'
                  min={0.1}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>

            {/* Weight, Color, Line Height */}
            <div className='grid grid-cols-3 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Weight</Label>
                <ButtonGroup className='w-full'>
                  <Button
                    variant={
                      headerTextFontWeight === 'bold' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setHeaderTextFontWeight('bold')}
                    title='Bold'
                  >
                    <Bold className='h-3 w-3' />
                  </Button>
                  <Button
                    variant={
                      headerTextFontWeight === 'medium' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setHeaderTextFontWeight('medium')}
                    title='Medium'
                  >
                    M
                  </Button>
                  <Button
                    variant={
                      headerTextFontWeight === 'regular' ? 'default' : 'outline'
                    }
                    size='sm'
                    className='flex-1 text-xs h-7 p-0'
                    onClick={() => setHeaderTextFontWeight('regular')}
                    title='Regular'
                  >
                    <Type className='h-3 w-3' />
                  </Button>
                </ButtonGroup>
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Color</Label>
                <Input
                  type='color'
                  value={headerTextColor}
                  onChange={(e) => setHeaderTextColor(e.target.value)}
                  className='h-7 w-full cursor-pointer p-0 border-0'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Line Height</Label>
                <Input
                  type='number'
                  value={headerTextLineHeight}
                  onChange={(e) =>
                    setHeaderTextLineHeight(Number(e.target.value))
                  }
                  className='h-7 text-xs'
                  min={0.8}
                  max={3}
                  step={0.1}
                />
              </div>
            </div>

            {/* Space Above */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Space Above</Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={
                    headerTextSpaceAbove === 'slim' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setHeaderTextSpaceAbove('slim')}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    headerTextSpaceAbove === 'medium' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setHeaderTextSpaceAbove('medium')}
                >
                  <Maximize2 className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    headerTextSpaceAbove === 'large' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setHeaderTextSpaceAbove('large')}
                >
                  <Maximize className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    headerTextSpaceAbove === 'none' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setHeaderTextSpaceAbove('none')}
                >
                  <Square className='h-4 w-4' />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Row 5: Border */}
      <div className='space-y-2'>
        <Label className='text-xs font-medium text-zinc-700'>Border</Label>
        <Select value={headerBorder} onValueChange={setHeaderBorder}>
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

        {headerBorder !== 'none' && (
          <div className='space-y-2 pl-2 border-l-2 border-zinc-200'>
            {/* Style, Space */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Style</Label>
                <Select
                  value={headerBorderStyle}
                  onValueChange={setHeaderBorderStyle}
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
                  value={headerBorderSpace}
                  onChange={(e) => setHeaderBorderSpace(Number(e.target.value))}
                  className='h-7 text-xs'
                  min={0}
                  max={50}
                />
              </div>
            </div>

            {/* Width, Color */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Width (px)</Label>
                <Input
                  type='number'
                  value={headerBorderWidth}
                  onChange={(e) => setHeaderBorderWidth(Number(e.target.value))}
                  className='h-7 text-xs'
                  min={1}
                  max={10}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Color</Label>
                <Input
                  type='color'
                  value={headerBorderColor}
                  onChange={(e) => setHeaderBorderColor(e.target.value)}
                  className='h-7 w-full cursor-pointer p-0 border-0'
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Row 6: Logo / Image */}
      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <Label className='text-xs font-medium text-zinc-700'>
            Logo / Image
          </Label>
          <Switch
            checked={headerLogoEnabled}
            onCheckedChange={setHeaderLogoEnabled}
          />
        </div>

        {headerLogoEnabled && (
          <div className='space-y-3 pl-2 border-l-2 border-zinc-200'>
            {/* Upload Image & Link */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Image URL</Label>
                <Input
                  type='text'
                  value={headerLogoImageUrl}
                  onChange={(e) => setHeaderLogoImageUrl(e.target.value)}
                  className='h-7 text-xs'
                  placeholder='https://...'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Link URL</Label>
                <Input
                  type='text'
                  value={headerLogoImageLink}
                  onChange={(e) => setHeaderLogoImageLink(e.target.value)}
                  className='h-7 text-xs'
                  placeholder='https://...'
                />
              </div>
            </div>

            {/* Height & Align */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Height (px)</Label>
                <Input
                  type='number'
                  value={headerLogoHeight}
                  onChange={(e) => setHeaderLogoHeight(Number(e.target.value))}
                  className='h-7 text-xs'
                  min={20}
                  max={200}
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Align</Label>
                <Select
                  value={headerLogoAlign}
                  onValueChange={setHeaderLogoAlign}
                >
                  <SelectTrigger className='h-7 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='header'>Header</SelectItem>
                    <SelectItem value='main-container'>
                      Main Container
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Position */}
            <div className='space-y-1'>
              <Label className='text-xs text-zinc-600'>Position</Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={headerLogoPosition === 'top' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setHeaderLogoPosition('top')}
                >
                  <ArrowUp className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    headerLogoPosition === 'left' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setHeaderLogoPosition('left')}
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant={
                    headerLogoPosition === 'right' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-7'
                  onClick={() => setHeaderLogoPosition('right')}
                >
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </ButtonGroup>
            </div>

            {/* Position Values */}
            <div className='grid grid-cols-4 gap-2'>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Top (px)</Label>
                <Input
                  type='number'
                  value={headerLogoPositionTop}
                  onChange={(e) =>
                    setHeaderLogoPositionTop(Number(e.target.value))
                  }
                  className='h-7 text-xs'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Right (px)</Label>
                <Input
                  type='number'
                  value={headerLogoPositionRight}
                  onChange={(e) =>
                    setHeaderLogoPositionRight(Number(e.target.value))
                  }
                  className='h-7 text-xs'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Bottom (px)</Label>
                <Input
                  type='number'
                  value={headerLogoPositionBottom}
                  onChange={(e) =>
                    setHeaderLogoPositionBottom(Number(e.target.value))
                  }
                  className='h-7 text-xs'
                />
              </div>
              <div className='space-y-1'>
                <Label className='text-xs text-zinc-600'>Left (px)</Label>
                <Input
                  type='number'
                  value={headerLogoPositionLeft}
                  onChange={(e) =>
                    setHeaderLogoPositionLeft(Number(e.target.value))
                  }
                  className='h-7 text-xs'
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
