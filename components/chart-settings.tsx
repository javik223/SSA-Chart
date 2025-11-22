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
import { ButtonGroup } from '@/components/ui/button-group';
import {
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
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { getChartsByCategory } from '@/lib/chartRegistry';
import { getStatusLabel } from '@/lib/chartRegistrations';
import { HeaderSettingsSection } from '@/components/HeaderSettingsSection';
import { FooterSettingsSection } from '@/components/FooterSettingsSection';
import { LayoutSettings } from '@/components/settings/LayoutSettings';
import { XAxisSettings } from '@/components/settings/XAxisSettings';
import { YAxisSettings } from '@/components/settings/YAxisSettings';
import { ColorsSection } from '@/components/settings/ColorsSection';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

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
  } = useChartStore();

  const [ searchQuery, setSearchQuery ] = useState( '' );
  const [ openSections, setOpenSections ] = useState<string[]>( [] );

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
      value: 'theme',
      title: 'Theme',
      description: 'Choose a visual theme for your chart',
      keywords: [ 'theme', 'visual', 'style', 'appearance', 'light', 'dark' ],
    },
    {
      value: 'chart-type',
      title: 'Chart type',
      description: 'Select the type of chart to display',
      keywords: [ 'chart', 'type', 'visualization', 'graph', 'display' ],
    },
    {
      value: 'controls',
      title: 'Controls & filters',
      description: 'Configure interactive controls and data filters',
      keywords: [ 'controls', 'filters', 'interactive', 'data' ],
    },
    {
      value: 'colors',
      title: 'Colors',
      description: 'Customize chart color schemes',
      keywords: [ 'colors', 'color', 'schemes', 'palette', 'theme' ],
    },
    {
      value: 'lines',
      title: 'Lines, dots and areas',
      description: 'Configure line styles, markers, and fill areas',
      keywords: [ 'lines', 'dots', 'areas', 'markers', 'style', 'stroke' ],
    },
    {
      value: 'labels',
      title: 'Labels',
      description: 'Customize data point labels',
      keywords: [ 'labels', 'text', 'annotations', 'data points' ],
    },
    {
      value: 'x-axis',
      title: 'X axis',
      description: 'Configure horizontal axis settings',
      keywords: [ 'x axis', 'horizontal', 'axis', 'bottom', 'categories' ],
    },
    {
      value: 'y-axis',
      title: 'Y axis',
      description: 'Configure vertical axis settings',
      keywords: [ 'y axis', 'vertical', 'axis', 'left', 'right', 'values' ],
    },
    {
      value: 'background',
      title: 'Plot background',
      description: 'Set background colors and styling',
      keywords: [ 'background', 'plot', 'canvas', 'color' ],
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
      keywords: [ 'legend', 'key', 'series', 'position' ],
    },
    {
      value: 'popups',
      title: 'Popups & panels',
      description: 'Customize tooltips and information panels',
      keywords: [ 'popups', 'panels', 'tooltips', 'hover', 'information' ],
    },
    {
      value: 'annotations',
      title: 'Annotations',
      description: 'Add text and shapes to highlight data',
      keywords: [ 'annotations', 'text', 'shapes', 'highlight', 'notes' ],
    },
    {
      value: 'animations',
      title: 'Animations',
      description: 'Configure chart animation effects',
      keywords: [ 'animations', 'effects', 'transitions', 'motion' ],
    },
    {
      value: 'layout',
      title: 'Layout',
      description: 'Adjust chart layout and spacing',
      keywords: [ 'layout', 'spacing', 'margins', 'padding' ],
    },
    {
      value: 'header',
      title: 'Header',
      description: 'Customize chart title and subtitle',
      keywords: [ 'header', 'title', 'subtitle', 'heading' ],
    },
    {
      value: 'footer',
      title: 'Footer',
      description: 'Customize chart footer text',
      keywords: [ 'footer', 'source', 'credits', 'notes' ],
    },
  ];

  // Check if a section matches the search query
  const doesSectionMatch = ( section: ( typeof accordionSections )[ 0 ] ) => {
    if ( !searchQuery.trim() ) return true;
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes( query ) ||
      section.description.toLowerCase().includes( query ) ||
      section.keywords.some( ( keyword ) => keyword.includes( query ) )
    );
  };

  // Get matching section values for auto-expand
  const matchingSections = searchQuery.trim()
    ? accordionSections.filter( doesSectionMatch ).map( ( section ) => section.value )
    : [];

  // Use matching sections when searching, otherwise use user-controlled state
  const activeValue = searchQuery.trim() ? matchingSections : openSections;

  return (
    <div className='flex h-full flex-col bg-white border-l'>
      {/* Header */ }
      <div className='p-4 border-b'>
        <h2 className='text-sm font-semibold text-zinc-900'>
          Line, bar and pie charts
        </h2>
        <p className='text-xs text-zinc-500 mt-0.5'>v38.6.3</p>
      </div>

      {/* Scrollable Content */ }
      <div className='flex-1 overflow-y-auto'>
        <div className='space-y-4'>
          {/* Accordion Sections */ }
          <Accordion
            type='multiple'
            className='w-full'
            value={ activeValue }
            onValueChange={ setOpenSections }
          >
            { accordionSections.map( ( section ) => {
              const isMatch = doesSectionMatch( section );
              return (
                <AccordionItem
                  key={ section.value }
                  value={ section.value }
                  className={ !isMatch ? 'opacity-30 blur-[0.5px]' : '' }
                >
                  <AccordionTrigger className='text-sm py-3 px-4 hover:no-underline'>
                    { section.title }
                  </AccordionTrigger>
                  <AccordionContent className='px-4'>
                    { section.value === 'header' ? (
                      <HeaderSettingsSection />
                    ) : section.value === 'footer' ? (
                      <FooterSettingsSection />
                    ) : section.value === 'layout' ? (
                      <LayoutSettings />
                    ) : section.value === 'colors' ? (
                      <ColorsSection />
                    ) : section.value === 'x-axis' ? (
                      <XAxisSettings />
                    ) : section.value === 'y-axis' ? (
                      <YAxisSettings />
                    ) : section.value === 'theme' ? (
                      <div className='settings-container'>
                        <FormSection title='Theme' helpIcon>
                          <FormRow gap='sm'>
                            <FormCol span='auto'>
                              <FormField
                                type='select'
                                value={ theme }
                                onChange={ setTheme }
                                options={ [
                                  { value: 'none', label: 'No theme' },
                                  { value: 'light', label: 'Light' },
                                  { value: 'dark', label: 'Dark' },
                                ] }
                              />
                            </FormCol>
                            <FormCol span={ 1 }>
                              <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
                                <RefreshCw className='h-3 w-3' />
                              </Button>
                            </FormCol>
                          </FormRow>
                        </FormSection>
                      </div>
                    ) : section.value === 'chart-type' ? (
                      <div className='settings-container'>
                        <FormSection title='Chart type'>
                          <div className='flex items-center justify-end -mt-8 mb-2'>
                            <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                              <span className='text-lg'>+</span>
                            </Button>
                          </div>

                          <Select value={ chartType } onValueChange={ setChartType }>
                            <SelectTrigger className='h-8 text-xs'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              { getChartsByCategory().map( ( { category, charts } ) => (
                                <div key={ category.id }>
                                  <div className='px-2 py-1.5 text-xs font-semibold text-zinc-500 first:pt-0'>
                                    { category.name }
                                  </div>
                                  { charts.map( ( chart ) => {
                                    const statusLabel = getStatusLabel( chart.status );
                                    return (
                                      <SelectItem
                                        key={ chart.type }
                                        value={ chart.type }
                                        disabled={ chart.status === 'coming-soon' }
                                      >
                                        <span className='flex items-center gap-2'>
                                          { chart.name }
                                          { statusLabel && (
                                            <span className='text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600'>
                                              { statusLabel }
                                            </span>
                                          ) }
                                        </span>
                                      </SelectItem>
                                    );
                                  } ) }
                                </div>
                              ) ) }
                            </SelectContent>
                          </Select>

                          <FormField
                            type='button-group'
                            label='Grid mode'
                            value={ gridMode }
                            onChange={ setGridMode }
                            options={ [
                              { value: 'single', label: 'Single chart' },
                              { value: 'grid', label: 'Grid of charts' },
                            ] }
                          />

                          <FormField
                            type='button-group'
                            label='Height mode'
                            value={ heightMode }
                            onChange={ setHeightMode }
                            options={ [
                              { value: 'auto', label: 'Auto' },
                              { value: 'standard', label: 'Standard' },
                              { value: 'aspect', label: 'Aspect ratio' },
                            ] }
                          />

                          <FormField
                            type='button-group'
                            label='Aggregation mode'
                            value={ aggregationMode }
                            onChange={ setAggregationMode }
                            options={ [
                              { value: 'none', label: 'None' },
                              { value: 'sum', label: 'Sum' },
                              { value: 'average', label: 'Average' },
                              { value: 'count', label: 'Count' },
                            ] }
                          />
                        </FormSection>
                      </div>
                    ) : section.value === 'preview' ? (
                      <div className='settings-container'>
                        <FormSection title='Size (px)'>
                          <FormRow gap='sm'>
                            <FormCol span='auto'>
                              <FormField
                                type='number'
                                value={ previewWidth }
                                onChange={ ( v ) => setPreviewWidth( v ?? 800 ) }
                                placeholder='Width'
                              />
                            </FormCol>
                            <FormCol span='auto'>
                              <FormField
                                type='number'
                                value={ previewHeight }
                                onChange={ ( v ) => setPreviewHeight( v ?? 600 ) }
                                placeholder='Height'
                              />
                            </FormCol>
                            <FormCol span={ 3 }>
                              <ButtonGroup className='flex'>
                                <Button
                                  variant={
                                    previewDevice === 'mobile'
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size='icon'
                                  onClick={ () => {
                                    setPreviewDevice( 'mobile' );
                                    setPreviewWidth( 375 );
                                    setPreviewHeight( 667 );
                                  } }
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
                                  onClick={ () => {
                                    setPreviewDevice( 'tablet' );
                                    setPreviewWidth( 768 );
                                    setPreviewHeight( 1024 );
                                  } }
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
                                  onClick={ () => {
                                    setPreviewDevice( 'desktop' );
                                    setPreviewWidth( 1920 );
                                    setPreviewHeight( 1080 );
                                  } }
                                >
                                  <Monitor className='w-4 h-4' />
                                </Button>
                              </ButtonGroup>
                            </FormCol>
                          </FormRow>
                        </FormSection>

                        <Separator />

                        <FormSection title='Colorblind check' helpIcon>
                          <div className='grid grid-cols-5 gap-2'>
                            <Button
                              variant={
                                colorblindMode === 'none'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 flex flex-col items-center justify-center p-1'
                              onClick={ () => setColorblindMode( 'none' ) }
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
                              onClick={ () => setColorblindMode( 'protanopia' ) }
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
                              onClick={ () => setColorblindMode( 'deuteranopia' ) }
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
                              onClick={ () => setColorblindMode( 'tritanopia' ) }
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
                              onClick={ () => setColorblindMode( 'achromatopsia' ) }
                            >
                              <div className='flex gap-0.5'>
                                <div className='w-1.5 h-8 rounded-full bg-zinc-700' />
                                <div className='w-1.5 h-8 rounded-full bg-zinc-500' />
                                <div className='w-1.5 h-8 rounded-full bg-zinc-300' />
                              </div>
                            </Button>
                          </div>
                        </FormSection>

                        <Separator />

                        <FormSection title='Dark Mode' helpIcon>
                          <div className='grid grid-cols-2 gap-2'>
                            <Button
                              variant={
                                darkModePreview === 'light'
                                  ? 'default'
                                  : 'outline'
                              }
                              size='sm'
                              className='h-12 flex items-center justify-center'
                              onClick={ () => setDarkModePreview( 'light' ) }
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
                              onClick={ () => setDarkModePreview( 'dark' ) }
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
                        </FormSection>
                      </div>
                    ) : section.value === 'legend' ? (
                      <div className='settings-container'>
                        <FormField
                          label='Show Legend'
                          type='switch'
                          checked={ legendShow }
                          onChange={ setLegendShow }
                        />

                        { legendShow && (
                          <>
                            <Separator />

                            <FormSection>
                              <FormRow gap='md'>
                                <FormCol span='auto'>
                                  <FormField
                                    type='button-group'
                                    label='Position'
                                    value={ legendPosition }
                                    onChange={ setLegendPosition }
                                    options={ [
                                      {
                                        value: 'top',
                                        icon: <ArrowUp className='h-4 w-4' />,
                                      },
                                      {
                                        value: 'right',
                                        icon: (
                                          <ArrowRight className='h-4 w-4' />
                                        ),
                                      },
                                      {
                                        value: 'bottom',
                                        icon: <ArrowDown className='h-4 w-4' />,
                                      },
                                      {
                                        value: 'left',
                                        icon: <ArrowLeft className='h-4 w-4' />,
                                      },
                                    ] }
                                  />
                                </FormCol>

                                <FormCol span='auto'>
                                  <FormField
                                    type='button-group'
                                    label='Alignment'
                                    value={ legendAlignment }
                                    onChange={ setLegendAlignment }
                                    options={ [
                                      {
                                        value: 'start',
                                        icon: <AlignLeft className='h-4 w-4' />,
                                      },
                                      {
                                        value: 'center',
                                        icon: (
                                          <AlignCenter className='h-4 w-4' />
                                        ),
                                      },
                                      {
                                        value: 'end',
                                        icon: (
                                          <AlignRight className='h-4 w-4' />
                                        ),
                                      },
                                    ] }
                                  />
                                </FormCol>
                              </FormRow>
                            </FormSection>

                            <Separator />

                            <FormSection title='Spacing'>
                              <FormGrid columns={ 2 }>
                                <FormField
                                  type='number'
                                  label='Size'
                                  value={ legendFontSize }
                                  onChange={ ( v ) => setLegendFontSize( v ?? 1 ) }
                                  min={ 0.1 }
                                  max={ 10.0 }
                                  step={ 0.1 }
                                />
                                <FormField
                                  type='number'
                                  label='Gap (px)'
                                  value={ legendGap }
                                  onChange={ ( v ) => setLegendGap( v ?? 5 ) }
                                  min={ 5 }
                                  max={ 50 }
                                />
                              </FormGrid>
                            </FormSection>

                            <Separator />

                            <FormField
                              label='Show Values'
                              description='Display numeric values next to legend items'
                              type='switch'
                              checked={ legendShowValues }
                              onChange={ setLegendShowValues }
                            />

                            <Separator />

                            <FormSection title='Padding (px)'>
                              <FormGrid columns={ 4 }>
                                <FormField
                                  type='number'
                                  label='Top'
                                  value={ legendPaddingTop }
                                  onChange={ ( v ) => setLegendPaddingTop( v ?? 0 ) }
                                  min={ 0 }
                                />
                                <FormField
                                  type='number'
                                  label='Right'
                                  value={ legendPaddingRight }
                                  onChange={ ( v ) => setLegendPaddingRight( v ?? 0 ) }
                                  min={ 0 }
                                />
                                <FormField
                                  type='number'
                                  label='Bottom'
                                  value={ legendPaddingBottom }
                                  onChange={ ( v ) => setLegendPaddingBottom( v ?? 0 ) }
                                  min={ 0 }
                                />
                                <FormField
                                  type='number'
                                  label='Left'
                                  value={ legendPaddingLeft }
                                  onChange={ ( v ) => setLegendPaddingLeft( v ?? 0 ) }
                                  min={ 0 }
                                />
                              </FormGrid>
                            </FormSection>
                          </>
                        ) }
                      </div>
                    ) : (
                      <div className='text-xs text-zinc-500 py-2'>
                        { section.description }
                      </div>
                    ) }
                  </AccordionContent>
                </AccordionItem>
              );
            } ) }
          </Accordion>
        </div>
      </div>

      {/* Footer with Search */ }
      <div className='border-t p-4 space-y-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400' />
          <Input
            placeholder='Search for setting'
            className='h-9 pl-9 pr-9 text-xs'
            value={ searchQuery }
            onChange={ ( e ) => setSearchQuery( e.target.value ) }
          />
          { searchQuery && (
            <button
              onClick={ () => setSearchQuery( '' ) }
              className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600'
            >
              <X className='h-4 w-4' />
            </button>
          ) }
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
