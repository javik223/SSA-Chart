'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ButtonGroup } from '@/components/ui/button-group';
import { Switch } from '@/components/ui/switch';
import {
  CircleHelp,
  RefreshCw,
  Search,
  HelpCircle,
  X,
  Smartphone,
  Tablet,
  Monitor,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Maximize2,
  Maximize,
  Square,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { getChartsByCategory } from '@/lib/chartRegistry';
import { getStatusLabel } from '@/lib/chartRegistrations';
import { HeaderSettingsSection } from '@/components/HeaderSettingsSection';

export function ChartSettings() {
  const {
    chartType,
    setChartType,
    theme,
    setTheme,
    gridMode,
    setGridMode,
    heightMode,
    setHeightMode,
    aggregationMode,
    setAggregationMode,
    previewWidth,
    setPreviewWidth,
    previewHeight,
    setPreviewHeight,
    previewDevice,
    setPreviewDevice,
    colorblindMode,
    setColorblindMode,
    darkModePreview,
    setDarkModePreview,
    legendShow,
    setLegendShow,
    legendPosition,
    setLegendPosition,
    legendAlignment,
    setLegendAlignment,
    legendFontSize,
    setLegendFontSize,
    legendShowValues,
    setLegendShowValues,
    legendGap,
    setLegendGap,
    legendPaddingTop,
    setLegendPaddingTop,
    legendPaddingRight,
    setLegendPaddingRight,
    legendPaddingBottom,
    setLegendPaddingBottom,
    legendPaddingLeft,
    setLegendPaddingLeft,
    chartFooter,
    setChartFooter,
    layoutMainFont,
    setLayoutMainFont,
    layoutTextColor,
    setLayoutTextColor,
    layoutBackgroundColorEnabled,
    setLayoutBackgroundColorEnabled,
    layoutBackgroundImageEnabled,
    setLayoutBackgroundImageEnabled,
    layoutBackgroundColor,
    setLayoutBackgroundColor,
    layoutBackgroundImageUrl,
    setLayoutBackgroundImageUrl,
    layoutBackgroundImageSize,
    setLayoutBackgroundImageSize,
    layoutBackgroundImagePosition,
    setLayoutBackgroundImagePosition,
    layoutOrder,
    setLayoutOrder,
    layoutSpaceBetweenSections,
    setLayoutSpaceBetweenSections,
    layoutMarginTop,
    setLayoutMarginTop,
    layoutMarginRight,
    setLayoutMarginRight,
    layoutMarginBottom,
    setLayoutMarginBottom,
    layoutMarginLeft,
    setLayoutMarginLeft,
    layoutPaddingTop,
    setLayoutPaddingTop,
    layoutPaddingRight,
    setLayoutPaddingRight,
    layoutPaddingBottom,
    setLayoutPaddingBottom,
    layoutPaddingLeft,
    setLayoutPaddingLeft,
    layoutBorderEnabled,
    setLayoutBorderEnabled,
    layoutBorderTop,
    setLayoutBorderTop,
    layoutBorderRight,
    setLayoutBorderRight,
    layoutBorderBottom,
    setLayoutBorderBottom,
    layoutBorderLeft,
    setLayoutBorderLeft,
    layoutBorderStyle,
    setLayoutBorderStyle,
    layoutBorderColor,
    setLayoutBorderColor,
    layoutBorderWidth,
    setLayoutBorderWidth,
    layoutBorderRadius,
    setLayoutBorderRadius,
    layoutReadDirection,
    setLayoutReadDirection,
  } = useChartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Define all accordion sections with searchable content
  const accordionSections = [
    {
      value: 'preview',
      title: 'Preview',
      description: 'Configure preview size, colorblind modes, and theme',
      keywords: [
        'preview',
        'size',
        'colorblind',
        'dark mode',
        'dimensions',
        'accessibility',
      ],
    },
    {
      value: 'controls',
      title: 'Controls & filters',
      description: 'Configure interactive controls and data filters',
      keywords: ['controls', 'filters', 'interactive', 'data'],
    },
    {
      value: 'colors',
      title: 'Colors',
      description: 'Customize chart color schemes',
      keywords: ['colors', 'color', 'schemes', 'palette', 'theme'],
    },
    {
      value: 'lines',
      title: 'Lines, dots and areas',
      description: 'Configure line styles, markers, and fill areas',
      keywords: ['lines', 'dots', 'areas', 'markers', 'style', 'stroke'],
    },
    {
      value: 'labels',
      title: 'Labels',
      description: 'Customize data point labels',
      keywords: ['labels', 'text', 'annotations', 'data points'],
    },
    {
      value: 'x-axis',
      title: 'X axis',
      description: 'Configure horizontal axis settings',
      keywords: ['x axis', 'horizontal', 'axis', 'bottom', 'categories'],
    },
    {
      value: 'y-axis',
      title: 'Y axis',
      description: 'Configure vertical axis settings',
      keywords: ['y axis', 'vertical', 'axis', 'left', 'right', 'values'],
    },
    {
      value: 'background',
      title: 'Plot background',
      description: 'Set background colors and styling',
      keywords: ['background', 'plot', 'canvas', 'color'],
    },
    {
      value: 'formatting',
      title: 'Number formatting',
      description: 'Format numbers, currency, and percentages',
      keywords: [
        'number',
        'formatting',
        'format',
        'currency',
        'percentage',
        'decimal',
      ],
    },
    {
      value: 'legend',
      title: 'Legend',
      description: 'Configure legend position and appearance',
      keywords: ['legend', 'key', 'series', 'position'],
    },
    {
      value: 'popups',
      title: 'Popups & panels',
      description: 'Customize tooltips and information panels',
      keywords: ['popups', 'panels', 'tooltips', 'hover', 'information'],
    },
    {
      value: 'annotations',
      title: 'Annotations',
      description: 'Add text and shapes to highlight data',
      keywords: ['annotations', 'text', 'shapes', 'highlight', 'notes'],
    },
    {
      value: 'animations',
      title: 'Animations',
      description: 'Configure chart animation effects',
      keywords: ['animations', 'effects', 'transitions', 'motion'],
    },
    {
      value: 'layout',
      title: 'Layout',
      description: 'Adjust chart layout and spacing',
      keywords: ['layout', 'spacing', 'margins', 'padding'],
    },
    {
      value: 'header',
      title: 'Header',
      description: 'Customize chart title and subtitle',
      keywords: ['header', 'title', 'subtitle', 'heading'],
    },
    {
      value: 'footer',
      title: 'Footer',
      description: 'Customize chart footer text',
      keywords: ['footer', 'source', 'credits', 'notes'],
    },
  ];

  // Check if a section matches the search query
  const doesSectionMatch = (section: (typeof accordionSections)[0]) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(query) ||
      section.description.toLowerCase().includes(query) ||
      section.keywords.some((keyword) => keyword.includes(query))
    );
  };

  // Get matching section values for auto-expand
  const matchingSections = searchQuery.trim()
    ? accordionSections.filter(doesSectionMatch).map((section) => section.value)
    : [];

  // Use matching sections when searching, otherwise use user-controlled state
  const activeValue = searchQuery.trim() ? matchingSections : openSections;

  return (
    <div className='flex h-full flex-col bg-white border-l'>
      {/* Header */}
      <div className='p-4 border-b'>
        <h2 className='text-sm font-semibold text-zinc-900'>
          Line, bar and pie charts
        </h2>
        <p className='text-xs text-zinc-500 mt-0.5'>v38.6.3</p>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto'>
        <div className='p-4 space-y-4'>
          {/* Theme Section */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label className='text-xs font-medium text-zinc-700 flex items-center gap-1'>
                Theme
                <CircleHelp className='h-3 w-3 text-zinc-400' />
              </Label>
            </div>
            <div className='flex items-center gap-2'>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue placeholder='No theme' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>No theme</SelectItem>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                </SelectContent>
              </Select>
              <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
                <RefreshCw className='h-3 w-3' />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Chart Type Section - Always Visible */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-sm font-medium text-zinc-900'>Chart type</h3>
              <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                <span className='text-lg'>+</span>
              </Button>
            </div>

            {/* Chart Type Dropdown */}
            <div className='space-y-2'>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='max-h-[400px]'>
                  {getChartsByCategory().map(({ category, charts }) => (
                    <div key={category.id}>
                      <div className='px-2 py-1.5 text-xs font-semibold text-zinc-500 first:pt-0'>
                        {category.name}
                      </div>
                      {charts.map((chart) => {
                        const statusLabel = getStatusLabel(chart.status);
                        return (
                          <SelectItem
                            key={chart.type}
                            value={chart.type}
                            disabled={chart.status === 'coming-soon'}
                          >
                            <span className='flex items-center gap-2'>
                              {chart.name}
                              {statusLabel && (
                                <span className='text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600'>
                                  {statusLabel}
                                </span>
                              )}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grid Mode */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium text-zinc-700 flex items-center gap-1'>
                Grid mode
                <CircleHelp className='h-3 w-3 text-zinc-400' />
              </Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={gridMode === 'single' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setGridMode('single')}
                >
                  Single chart
                </Button>
                <Button
                  variant={gridMode === 'grid' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setGridMode('grid')}
                >
                  Grid of charts
                </Button>
              </ButtonGroup>
            </div>

            {/* Height Mode */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium text-zinc-700 flex items-center gap-1'>
                Height mode
                <CircleHelp className='h-3 w-3 text-zinc-400' />
              </Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={heightMode === 'auto' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setHeightMode('auto')}
                >
                  Auto
                </Button>
                <Button
                  variant={heightMode === 'standard' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setHeightMode('standard')}
                >
                  Standard
                </Button>
                <Button
                  variant={heightMode === 'aspect' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setHeightMode('aspect')}
                >
                  Aspect ratio
                </Button>
              </ButtonGroup>
            </div>

            {/* Aggregation Mode */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium text-zinc-700 flex items-center gap-1'>
                Aggregation mode
                <CircleHelp className='h-3 w-3 text-zinc-400' />
              </Label>
              <ButtonGroup className='w-full'>
                <Button
                  variant={aggregationMode === 'none' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setAggregationMode('none')}
                >
                  None
                </Button>
                <Button
                  variant={aggregationMode === 'sum' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setAggregationMode('sum')}
                >
                  Sum
                </Button>
                <Button
                  variant={
                    aggregationMode === 'average' ? 'default' : 'outline'
                  }
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setAggregationMode('average')}
                >
                  Average
                </Button>
                <Button
                  variant={aggregationMode === 'count' ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1 text-xs h-8'
                  onClick={() => setAggregationMode('count')}
                >
                  Count
                </Button>
              </ButtonGroup>
            </div>
          </div>

          <Separator />

          {/* Accordion Sections */}
          <Accordion
            type='multiple'
            className='w-full'
            value={activeValue}
            onValueChange={setOpenSections}
          >
            {accordionSections.map((section) => {
              const isMatch = doesSectionMatch(section);
              return (
                <AccordionItem
                  key={section.value}
                  value={section.value}
                  className={!isMatch ? 'opacity-30 blur-[0.5px]' : ''}
                >
                  <AccordionTrigger className='text-sm py-3 hover:no-underline'>
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    {section.value === 'header' ? (
                      <HeaderSettingsSection />
                    ) : section.value === 'footer' ? (
                      <div className='space-y-4 pb-4'>
                        {/* Chart Footer */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Footer
                          </Label>
                          <Input
                            type='text'
                            value={chartFooter}
                            onChange={(e) => setChartFooter(e.target.value)}
                            className='h-8 text-xs'
                            placeholder='Enter chart footer (e.g., source, credits)'
                          />
                        </div>
                      </div>
                    ) : section.value === 'layout' ? (
                      <div className='space-y-4 pb-4'>
                        {/* Row 1: Main Font and Text Color */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Typography
                          </Label>
                          <div className='grid grid-cols-2 gap-2'>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Main Font
                              </Label>
                              <Select
                                value={layoutMainFont}
                                onValueChange={setLayoutMainFont}
                              >
                                <SelectTrigger className='h-7 text-xs'>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='Inter'>Inter</SelectItem>
                                  <SelectItem value='Arial'>Arial</SelectItem>
                                  <SelectItem value='Helvetica'>
                                    Helvetica
                                  </SelectItem>
                                  <SelectItem value='Times New Roman'>
                                    Times New Roman
                                  </SelectItem>
                                  <SelectItem value='Georgia'>
                                    Georgia
                                  </SelectItem>
                                  <SelectItem value='Verdana'>
                                    Verdana
                                  </SelectItem>
                                  <SelectItem value='Roboto'>Roboto</SelectItem>
                                  <SelectItem value='Open Sans'>
                                    Open Sans
                                  </SelectItem>
                                  <SelectItem value='Lato'>Lato</SelectItem>
                                  <SelectItem value='Montserrat'>
                                    Montserrat
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Text Color
                              </Label>
                              <div className='flex gap-1'>
                                <Input
                                  type='color'
                                  value={layoutTextColor}
                                  onChange={(e) =>
                                    setLayoutTextColor(e.target.value)
                                  }
                                  className='h-7 w-10 cursor-pointer p-0 border-0'
                                />
                                <Input
                                  type='text'
                                  value={layoutTextColor}
                                  onChange={(e) =>
                                    setLayoutTextColor(e.target.value)
                                  }
                                  className='h-7 text-xs flex-1'
                                  placeholder='#000000'
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Row 2: Background */}
                        <div className='space-y-3'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Background
                          </Label>

                          {/* Background Toggle Row */}
                          <div className='grid grid-cols-2 gap-2'>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Color
                              </Label>
                              <ButtonGroup className='w-full'>
                                <Button
                                  variant={
                                    layoutBackgroundColorEnabled
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className='flex-1 text-xs h-7'
                                  onClick={() =>
                                    setLayoutBackgroundColorEnabled(true)
                                  }
                                >
                                  On
                                </Button>
                                <Button
                                  variant={
                                    !layoutBackgroundColorEnabled
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className='flex-1 text-xs h-7'
                                  onClick={() =>
                                    setLayoutBackgroundColorEnabled(false)
                                  }
                                >
                                  Off
                                </Button>
                              </ButtonGroup>
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Image
                              </Label>
                              <ButtonGroup className='w-full'>
                                <Button
                                  variant={
                                    layoutBackgroundImageEnabled
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className='flex-1 text-xs h-7'
                                  onClick={() =>
                                    setLayoutBackgroundImageEnabled(true)
                                  }
                                >
                                  On
                                </Button>
                                <Button
                                  variant={
                                    !layoutBackgroundImageEnabled
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='sm'
                                  className='flex-1 text-xs h-7'
                                  onClick={() =>
                                    setLayoutBackgroundImageEnabled(false)
                                  }
                                >
                                  Off
                                </Button>
                              </ButtonGroup>
                            </div>
                          </div>

                          {/* Background Settings Row */}
                          {layoutBackgroundColorEnabled && (
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Background Color
                              </Label>
                              <div className='flex gap-1'>
                                <Input
                                  type='color'
                                  value={layoutBackgroundColor}
                                  onChange={(e) =>
                                    setLayoutBackgroundColor(e.target.value)
                                  }
                                  className='h-7 w-10 cursor-pointer p-0 border-0'
                                />
                                <Input
                                  type='text'
                                  value={layoutBackgroundColor}
                                  onChange={(e) =>
                                    setLayoutBackgroundColor(e.target.value)
                                  }
                                  className='h-7 text-xs flex-1'
                                  placeholder='#ffffff'
                                />
                              </div>
                            </div>
                          )}

                          {layoutBackgroundImageEnabled && (
                            <>
                              <div className='space-y-1'>
                                <Label className='text-[10px] text-zinc-500'>
                                  Image URL
                                </Label>
                                <Input
                                  type='text'
                                  value={layoutBackgroundImageUrl}
                                  onChange={(e) =>
                                    setLayoutBackgroundImageUrl(e.target.value)
                                  }
                                  className='h-7 text-xs'
                                  placeholder='https://example.com/image.jpg'
                                />
                              </div>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Size
                                  </Label>
                                  <Select
                                    value={layoutBackgroundImageSize}
                                    onValueChange={setLayoutBackgroundImageSize}
                                  >
                                    <SelectTrigger className='h-7 text-xs'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value='fill'>Fill</SelectItem>
                                      <SelectItem value='fit'>Fit</SelectItem>
                                      <SelectItem value='original'>
                                        Original
                                      </SelectItem>
                                      <SelectItem value='stretch'>
                                        Stretch
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Position
                                  </Label>
                                  <Select
                                    value={layoutBackgroundImagePosition}
                                    onValueChange={
                                      setLayoutBackgroundImagePosition
                                    }
                                  >
                                    <SelectTrigger className='h-7 text-xs'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value='top-left'>
                                        Top Left
                                      </SelectItem>
                                      <SelectItem value='top-center'>
                                        Top Center
                                      </SelectItem>
                                      <SelectItem value='top-right'>
                                        Top Right
                                      </SelectItem>
                                      <SelectItem value='center-left'>
                                        Center Left
                                      </SelectItem>
                                      <SelectItem value='center'>
                                        Center
                                      </SelectItem>
                                      <SelectItem value='center-right'>
                                        Center Right
                                      </SelectItem>
                                      <SelectItem value='bottom-left'>
                                        Bottom Left
                                      </SelectItem>
                                      <SelectItem value='bottom-center'>
                                        Bottom Center
                                      </SelectItem>
                                      <SelectItem value='bottom-right'>
                                        Bottom Right
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <Separator />

                        {/* Layout Order */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Layout Order
                          </Label>
                          <Select
                            value={layoutOrder}
                            onValueChange={setLayoutOrder}
                          >
                            <SelectTrigger className='h-7 text-xs'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='header-controls-legend-primary-graphic-footer'>
                                Header → Controls → Legend → Primary Graphic →
                                Footer
                              </SelectItem>
                              <SelectItem value='primary-graphic-header-controls-footer'>
                                Primary Graphic → Header → Controls → Footer
                              </SelectItem>
                              <SelectItem value='header-primary-graphic-controls-legend-footer'>
                                Header → Primary Graphic → Controls → Legend →
                                Footer
                              </SelectItem>
                              <SelectItem value='controls-primary-graphic-header-legend-footer'>
                                Controls → Primary Graphic → Header → Legend →
                                Footer
                              </SelectItem>
                              <SelectItem value='header-controls-primary-graphic-legend-footer'>
                                Header → Controls → Primary Graphic → Legend →
                                Footer
                              </SelectItem>
                              <SelectItem value='header-legend-primary-graphic-controls-footer'>
                                Header → Legend → Primary Graphic → Controls →
                                Footer
                              </SelectItem>
                              <SelectItem value='grid-mode-primary-graphic-right'>
                                Grid Mode: Primary Graphic on Right
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        {/* Space Between Sections */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Space Between Sections
                          </Label>
                          <ButtonGroup className='w-full grid grid-cols-4'>
                            <Button
                              variant={
                                layoutSpaceBetweenSections === 'none'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-10 flex flex-col items-center justify-center gap-0.5'
                              onClick={() =>
                                setLayoutSpaceBetweenSections('none')
                              }
                              title='None'
                            >
                              <Minus className='h-3 w-3' />
                              <span className='text-[9px]'>None</span>
                            </Button>
                            <Button
                              variant={
                                layoutSpaceBetweenSections === 'tight'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-10 flex flex-col items-center justify-center gap-0.5'
                              onClick={() =>
                                setLayoutSpaceBetweenSections('tight')
                              }
                              title='Tight'
                            >
                              <Square className='h-3 w-3' />
                              <span className='text-[9px]'>Tight</span>
                            </Button>
                            <Button
                              variant={
                                layoutSpaceBetweenSections === 'loose'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-10 flex flex-col items-center justify-center gap-0.5'
                              onClick={() =>
                                setLayoutSpaceBetweenSections('loose')
                              }
                              title='Loose'
                            >
                              <Maximize2 className='h-3 w-3' />
                              <span className='text-[9px]'>Loose</span>
                            </Button>
                            <Button
                              variant={
                                layoutSpaceBetweenSections === 'large'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-10 flex flex-col items-center justify-center gap-0.5'
                              onClick={() =>
                                setLayoutSpaceBetweenSections('large')
                              }
                              title='Large'
                            >
                              <Maximize className='h-3 w-3' />
                              <span className='text-[9px]'>Large</span>
                            </Button>
                          </ButtonGroup>
                        </div>

                        <Separator />

                        {/* Margins */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Margins (px)
                          </Label>
                          <div className='grid grid-cols-4 gap-2'>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Top
                              </Label>
                              <Input
                                type='number'
                                value={layoutMarginTop}
                                onChange={(e) =>
                                  setLayoutMarginTop(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Right
                              </Label>
                              <Input
                                type='number'
                                value={layoutMarginRight}
                                onChange={(e) =>
                                  setLayoutMarginRight(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Bottom
                              </Label>
                              <Input
                                type='number'
                                value={layoutMarginBottom}
                                onChange={(e) =>
                                  setLayoutMarginBottom(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Left
                              </Label>
                              <Input
                                type='number'
                                value={layoutMarginLeft}
                                onChange={(e) =>
                                  setLayoutMarginLeft(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Padding Controls */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Padding (px)
                          </Label>
                          <div className='grid grid-cols-4 gap-2'>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Top
                              </Label>
                              <Input
                                type='number'
                                value={layoutPaddingTop}
                                onChange={(e) =>
                                  setLayoutPaddingTop(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Right
                              </Label>
                              <Input
                                type='number'
                                value={layoutPaddingRight}
                                onChange={(e) =>
                                  setLayoutPaddingRight(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Bottom
                              </Label>
                              <Input
                                type='number'
                                value={layoutPaddingBottom}
                                onChange={(e) =>
                                  setLayoutPaddingBottom(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px] text-zinc-500'>
                                Left
                              </Label>
                              <Input
                                type='number'
                                value={layoutPaddingLeft}
                                onChange={(e) =>
                                  setLayoutPaddingLeft(Number(e.target.value))
                                }
                                className='h-7 text-xs'
                              />
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Borders */}
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <Label className='text-xs font-medium text-zinc-700'>
                              Show borders around visualisation
                            </Label>
                            <Switch
                              checked={layoutBorderEnabled}
                              onCheckedChange={setLayoutBorderEnabled}
                            />
                          </div>

                          {layoutBorderEnabled && (
                            <>
                              {/* Border Sides */}
                              <div className='space-y-2'>
                                <Label className='text-[10px] text-zinc-500'>
                                  Border Sides
                                </Label>
                                <div className='grid grid-cols-4 gap-2'>
                                  <div className='flex items-center space-x-1'>
                                    <Switch
                                      id='border-top'
                                      checked={layoutBorderTop}
                                      onCheckedChange={setLayoutBorderTop}
                                      className='scale-75'
                                    />
                                    <Label
                                      htmlFor='border-top'
                                      className='text-[10px] text-zinc-600'
                                    >
                                      Top
                                    </Label>
                                  </div>
                                  <div className='flex items-center space-x-1'>
                                    <Switch
                                      id='border-right'
                                      checked={layoutBorderRight}
                                      onCheckedChange={setLayoutBorderRight}
                                      className='scale-75'
                                    />
                                    <Label
                                      htmlFor='border-right'
                                      className='text-[10px] text-zinc-600'
                                    >
                                      Right
                                    </Label>
                                  </div>
                                  <div className='flex items-center space-x-1'>
                                    <Switch
                                      id='border-bottom'
                                      checked={layoutBorderBottom}
                                      onCheckedChange={setLayoutBorderBottom}
                                      className='scale-75'
                                    />
                                    <Label
                                      htmlFor='border-bottom'
                                      className='text-[10px] text-zinc-600'
                                    >
                                      Bottom
                                    </Label>
                                  </div>
                                  <div className='flex items-center space-x-1'>
                                    <Switch
                                      id='border-left'
                                      checked={layoutBorderLeft}
                                      onCheckedChange={setLayoutBorderLeft}
                                      className='scale-75'
                                    />
                                    <Label
                                      htmlFor='border-left'
                                      className='text-[10px] text-zinc-600'
                                    >
                                      Left
                                    </Label>
                                  </div>
                                </div>
                              </div>

                              {/* Border Style and Color */}
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Style
                                  </Label>
                                  <Select
                                    value={layoutBorderStyle}
                                    onValueChange={setLayoutBorderStyle}
                                  >
                                    <SelectTrigger className='h-7 text-xs'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value='solid'>
                                        Solid
                                      </SelectItem>
                                      <SelectItem value='dashed'>
                                        Dashed
                                      </SelectItem>
                                      <SelectItem value='dotted'>
                                        Dotted
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Width (px)
                                  </Label>
                                  <Input
                                    type='number'
                                    value={layoutBorderWidth}
                                    onChange={(e) =>
                                      setLayoutBorderWidth(
                                        Number(e.target.value)
                                      )
                                    }
                                    className='h-7 text-xs'
                                    min={0}
                                  />
                                </div>
                              </div>

                              {/* Border Color and Radius */}
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Color
                                  </Label>
                                  <div className='flex gap-1'>
                                    <Input
                                      type='color'
                                      value={layoutBorderColor}
                                      onChange={(e) =>
                                        setLayoutBorderColor(e.target.value)
                                      }
                                      className='h-7 w-10 cursor-pointer p-0 border-0'
                                    />
                                    <Input
                                      type='text'
                                      value={layoutBorderColor}
                                      onChange={(e) =>
                                        setLayoutBorderColor(e.target.value)
                                      }
                                      className='h-7 text-xs flex-1'
                                      placeholder='#e4e4e7'
                                    />
                                  </div>
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Radius (px)
                                  </Label>
                                  <Input
                                    type='number'
                                    value={layoutBorderRadius}
                                    onChange={(e) =>
                                      setLayoutBorderRadius(
                                        Number(e.target.value)
                                      )
                                    }
                                    className='h-7 text-xs'
                                    min={0}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <Separator />

                        {/* Read Direction */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Read Direction
                          </Label>
                          <ButtonGroup className='w-full'>
                            <Button
                              variant={
                                layoutReadDirection === 'ltr'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='flex-1 text-xs h-8'
                              onClick={() => setLayoutReadDirection('ltr')}
                            >
                              Left to Right
                            </Button>
                            <Button
                              variant={
                                layoutReadDirection === 'rtl'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='flex-1 text-xs h-8'
                              onClick={() => setLayoutReadDirection('rtl')}
                            >
                              Right to Left
                            </Button>
                          </ButtonGroup>
                        </div>
                      </div>
                    ) : section.value === 'preview' ? (
                      <div className='space-y-4 pb-4'>
                        {/* Size Controls */}
                        <div className='space-y-2'>
                          <Label className='text-xs font-medium text-zinc-700'>
                            Size (px)
                          </Label>
                          <div className='flex gap-2'>
                            <Input
                              type='number'
                              value={previewWidth}
                              onChange={(e) =>
                                setPreviewWidth(Number(e.target.value))
                              }
                              className='h-8 text-xs flex-1'
                              placeholder='Width'
                            />
                            <Input
                              type='number'
                              value={previewHeight}
                              onChange={(e) =>
                                setPreviewHeight(Number(e.target.value))
                              }
                              className='h-8 text-xs flex-1'
                              placeholder='Height'
                            />
                            <ButtonGroup className='flex'>
                              <Button
                                variant={
                                  previewDevice === 'mobile'
                                    ? 'default'
                                    : 'outline'
                                }
                                size='icon'
                                onClick={() => {
                                  setPreviewDevice('mobile');
                                  setPreviewWidth(375);
                                  setPreviewHeight(667);
                                }}
                              >
                                <Smartphone className='w-4 h-4' />
                              </Button>
                              <Button
                                variant={
                                  previewDevice === 'tablet'
                                    ? 'default'
                                    : 'outline'
                                }
                                size='icon'
                                onClick={() => {
                                  setPreviewDevice('tablet');
                                  setPreviewWidth(768);
                                  setPreviewHeight(1024);
                                }}
                              >
                                <Tablet className='w-4 h-4' />
                              </Button>
                              <Button
                                variant={
                                  previewDevice === 'desktop'
                                    ? 'default'
                                    : 'outline'
                                }
                                size='icon'
                                onClick={() => {
                                  setPreviewDevice('desktop');
                                  setPreviewWidth(1920);
                                  setPreviewHeight(1080);
                                }}
                              >
                                <Monitor className='w-4 h-4' />
                              </Button>
                            </ButtonGroup>
                          </div>
                        </div>

                        {/* Colorblind Check */}
                        <div className='space-y-2'>
                          <div className='flex items-center gap-1'>
                            <Label className='text-xs font-medium text-zinc-700'>
                              Colorblind check
                            </Label>
                            <CircleHelp className='h-3 w-3 text-zinc-400' />
                          </div>
                          <div className='grid grid-cols-5 gap-2'>
                            <Button
                              variant={
                                colorblindMode === 'none'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 flex flex-col items-center justify-center p-1'
                              onClick={() => setColorblindMode('none')}
                            >
                              <span className='text-[10px]'>None</span>
                            </Button>
                            <Button
                              variant={
                                colorblindMode === 'protanopia'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 p-1'
                              onClick={() => setColorblindMode('protanopia')}
                            >
                              <div className='flex gap-0.5'>
                                <div className='w-1.5 h-8 rounded-full bg-red-500' />
                                <div className='w-1.5 h-8 rounded-full bg-green-500' />
                                <div className='w-1.5 h-8 rounded-full bg-blue-500' />
                              </div>
                            </Button>
                            <Button
                              variant={
                                colorblindMode === 'deuteranopia'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 p-1'
                              onClick={() => setColorblindMode('deuteranopia')}
                            >
                              <div className='flex gap-0.5'>
                                <div className='w-1.5 h-8 rounded-full bg-yellow-500' />
                                <div className='w-1.5 h-8 rounded-full bg-orange-500' />
                                <div className='w-1.5 h-8 rounded-full bg-blue-500' />
                              </div>
                            </Button>
                            <Button
                              variant={
                                colorblindMode === 'tritanopia'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 p-1'
                              onClick={() => setColorblindMode('tritanopia')}
                            >
                              <div className='flex gap-0.5'>
                                <div className='w-1.5 h-8 rounded-full bg-cyan-500' />
                                <div className='w-1.5 h-8 rounded-full bg-emerald-500' />
                                <div className='w-1.5 h-8 rounded-full bg-teal-500' />
                              </div>
                            </Button>
                            <Button
                              variant={
                                colorblindMode === 'achromatopsia'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 p-1'
                              onClick={() => setColorblindMode('achromatopsia')}
                            >
                              <div className='flex gap-0.5'>
                                <div className='w-1.5 h-8 rounded-full bg-zinc-700' />
                                <div className='w-1.5 h-8 rounded-full bg-zinc-500' />
                                <div className='w-1.5 h-8 rounded-full bg-zinc-300' />
                              </div>
                            </Button>
                          </div>
                        </div>

                        {/* Dark Mode */}
                        <div className='space-y-2'>
                          <div className='flex items-center gap-1'>
                            <Label className='text-xs font-medium text-zinc-700'>
                              Dark Mode
                            </Label>
                            <CircleHelp className='h-3 w-3 text-zinc-400' />
                          </div>
                          <div className='grid grid-cols-2 gap-2'>
                            <Button
                              variant={
                                darkModePreview === 'light'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 flex items-center justify-center'
                              onClick={() => setDarkModePreview('light')}
                            >
                              <svg
                                className='w-6 h-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <circle cx='12' cy='12' r='4' strokeWidth='2' />
                                <path
                                  d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41'
                                  strokeWidth='2'
                                />
                              </svg>
                            </Button>
                            <Button
                              variant={
                                darkModePreview === 'dark'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 flex items-center justify-center'
                              onClick={() => setDarkModePreview('dark')}
                            >
                              <svg
                                className='w-6 h-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'
                                  strokeWidth='2'
                                />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : section.value === 'legend' ? (
                      <div className='space-y-4 pb-4'>
                        {/* Show Legend Toggle */}
                        <div className='flex items-center justify-between'>
                          <Label
                            htmlFor='legend-show'
                            className='text-xs font-medium text-zinc-700'
                          >
                            Show Legend
                          </Label>
                          <Switch
                            id='legend-show'
                            checked={legendShow}
                            onCheckedChange={setLegendShow}
                          />
                        </div>

                        {legendShow && (
                          <>
                            <div className='flex gap-4'>
                              {/* Legend Position */}
                              <div className='space-y-2'>
                                <Label className='text-xs font-medium text-zinc-700'>
                                  Position
                                </Label>
                                <ButtonGroup className='w-full'>
                                  <Button
                                    variant={
                                      legendPosition === 'top'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    className='flex-1 h-8'
                                    onClick={() => setLegendPosition('top')}
                                    title='Top'
                                  >
                                    <ArrowUp className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant={
                                      legendPosition === 'right'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    className='flex-1 h-8'
                                    onClick={() => setLegendPosition('right')}
                                    title='Right'
                                  >
                                    <ArrowRight className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant={
                                      legendPosition === 'bottom'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    className='flex-1 h-8'
                                    onClick={() => setLegendPosition('bottom')}
                                    title='Bottom'
                                  >
                                    <ArrowDown className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant={
                                      legendPosition === 'left'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    className='flex-1 h-8'
                                    onClick={() => setLegendPosition('left')}
                                    title='Left'
                                  >
                                    <ArrowLeft className='h-4 w-4' />
                                  </Button>
                                </ButtonGroup>
                              </div>

                              {/* Legend Alignment */}
                              <div className='space-y-2'>
                                <Label className='text-xs font-medium text-zinc-700'>
                                  Alignment
                                </Label>
                                <ButtonGroup className='grid grid-cols-3'>
                                  <Button
                                    variant={
                                      legendAlignment === 'start'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    className='h-8'
                                    onClick={() => setLegendAlignment('start')}
                                    title='Start'
                                  >
                                    <AlignLeft className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant={
                                      legendAlignment === 'center'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    className='h-8'
                                    onClick={() => setLegendAlignment('center')}
                                    title='Center'
                                  >
                                    <AlignCenter className='h-4 w-4' />
                                  </Button>
                                  <Button
                                    variant={
                                      legendAlignment === 'end'
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size='sm'
                                    className='h-8'
                                    onClick={() => setLegendAlignment('end')}
                                    title='End'
                                  >
                                    <AlignRight className='h-4 w-4' />
                                  </Button>
                                </ButtonGroup>
                              </div>
                            </div>

                            {/* Font Size & Gap */}
                            <div className='space-y-2'>
                              <Label className='text-xs font-medium text-zinc-700'>
                                Spacing
                              </Label>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Size
                                  </Label>
                                  <Input
                                    type='number'
                                    value={legendFontSize}
                                    onChange={(e) =>
                                      setLegendFontSize(Number(e.target.value))
                                    }
                                    className='h-7 text-xs'
                                    min={0.1}
                                    max={10.0}
                                    step={0.1}
                                  />
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Gap (px)
                                  </Label>
                                  <Input
                                    type='number'
                                    value={legendGap}
                                    onChange={(e) =>
                                      setLegendGap(Number(e.target.value))
                                    }
                                    className='h-7 text-xs'
                                    min={5}
                                    max={50}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Show Values Toggle */}
                            <div className='space-y-2'>
                              <div className='flex items-center justify-between'>
                                <div className='space-y-0.5'>
                                  <Label
                                    htmlFor='legend-show-values'
                                    className='text-xs font-medium text-zinc-700'
                                  >
                                    Show Values
                                  </Label>
                                  <p className='text-[10px] text-zinc-500'>
                                    Display numeric values next to legend items
                                  </p>
                                </div>
                                <Switch
                                  id='legend-show-values'
                                  checked={legendShowValues}
                                  onCheckedChange={setLegendShowValues}
                                />
                              </div>
                            </div>

                            {/* Legend Padding */}
                            <div className='space-y-2'>
                              <Label className='text-xs font-medium text-zinc-700'>
                                Padding (px)
                              </Label>
                              <div className='flex gap-2'>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Top
                                  </Label>
                                  <Input
                                    type='number'
                                    value={legendPaddingTop}
                                    onChange={(e) =>
                                      setLegendPaddingTop(
                                        Number(e.target.value)
                                      )
                                    }
                                    className='h-7 text-xs'
                                    min={0}
                                  />
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Right
                                  </Label>
                                  <Input
                                    type='number'
                                    value={legendPaddingRight}
                                    onChange={(e) =>
                                      setLegendPaddingRight(
                                        Number(e.target.value)
                                      )
                                    }
                                    className='h-7 text-xs'
                                    min={0}
                                  />
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Bottom
                                  </Label>
                                  <Input
                                    type='number'
                                    value={legendPaddingBottom}
                                    onChange={(e) =>
                                      setLegendPaddingBottom(
                                        Number(e.target.value)
                                      )
                                    }
                                    className='h-7 text-xs'
                                    min={0}
                                  />
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-zinc-500'>
                                    Left
                                  </Label>
                                  <Input
                                    type='number'
                                    value={legendPaddingLeft}
                                    onChange={(e) =>
                                      setLegendPaddingLeft(
                                        Number(e.target.value)
                                      )
                                    }
                                    className='h-7 text-xs'
                                    min={0}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className='text-xs text-zinc-500 py-2'>
                        {section.description}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>

      {/* Footer with Search */}
      <div className='border-t p-4 space-y-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
          <Input
            placeholder='Search for setting'
            className='h-9 pl-9 pr-9 text-xs'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600'
            >
              <X className='h-4 w-4' />
            </button>
          )}
        </div>

        <Button
          variant='default'
          size='sm'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white h-9'
        >
          <HelpCircle className='h-4 w-4 mr-2' />
          Help
        </Button>
      </div>
    </div>
  );
}
