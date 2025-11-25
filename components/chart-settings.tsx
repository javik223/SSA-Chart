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
import { LinesSettings } from '@/components/settings/LinesSettings';
import { LegendSettings } from '@/components/settings/LegendSettings';
import { LabelsSettings } from '@/components/settings/LabelsSettings';
import { DivergingBarSettings } from '@/components/settings/DivergingBarSettings';
import { ColorsSection } from '@/components/settings/ColorsSection';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';
import { PreviewSettings } from '@/components/settings/PreviewSettings';

export function ChartSettings() {
  const {
    chartType,
    setChartType,
    theme,
    setTheme,
    gridMode,
    setGridMode,
    gridSplitBy,
    setGridSplitBy,
    gridColumns,
    setGridColumns,
    gridColumnsMobile,
    setGridColumnsMobile,
    gridAspectRatio,
    setGridAspectRatio,
    showZoomControls,
    setShowZoomControls,
    resetZoom,
    heightMode,
    setHeightMode,
    aggregationMode,
    setAggregationMode,
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

  // Group chart options for FormField select
  const chartTypeOptions = getChartsByCategory().map( ( { category, charts } ) => ( {
    label: category.name,
    options: charts.map( ( chart ) => {
      const statusLabel = getStatusLabel( chart.status );
      return {
        value: chart.type,
        label: (
          <span className='settings-header'>
            { chart.name }
            { statusLabel && (
              <span className='status-badge'>
                { statusLabel }
              </span>
            ) }
          </span>
        ),
        disabled: chart.status === 'coming-soon',
      };
    } ),
  } ) );

  // Define all accordion sections with searchable content
  const allAccordionSections = [
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
      value: 'diverging-bar',
      title: 'Diverging Bar Options',
      description: 'Configure diverging bar chart specific settings',
      keywords: [ 'diverging', 'bar', 'sort', 'gradient', 'colors', 'labels' ],
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
      value: 'zoom',
      title: 'Zoom',
      description: 'Enable interactive zoom functionality',
      keywords: [ 'zoom', 'interactive', 'brush', 'selection', 'pan' ],
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

  const accordionSections = allAccordionSections.filter( section =>
    section.value !== 'diverging-bar' || chartType === 'diverging-bar'
  );

  // Check if a section matches the search query
  const doesSectionMatch = ( section: ( typeof allAccordionSections )[ 0 ] ) => {
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
        <div className='settings-content'>
          {/* Accordion Sections */ }
          <Accordion
            type='multiple'
            className='settings-trigger'
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
                    ) : section.value === 'lines' ? (
                      <LinesSettings />
                    ) : section.value === 'labels' ? (
                      <LabelsSettings />
                    ) : section.value === 'diverging-bar' ? (
                      <DivergingBarSettings />
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
                                <RefreshCw className='icon-xs' />
                              </Button>
                            </FormCol>
                          </FormRow>
                        </FormSection>
                      </div>
                    ) : section.value === 'zoom' ? (
                      <FormSection>
                        <FormField
                          type='switch'
                          label='Show zoom controls'
                          checked={ showZoomControls }
                          onChange={ setShowZoomControls }
                        />
                        <p className='text-xs text-zinc-500 mt-1'>Display zoom buttons on the chart</p>

                        { showZoomControls && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={ resetZoom }
                            className='w-full mt-2'
                          >
                            <RefreshCw className='icon-sm mr-2' />
                            Reset Zoom
                          </Button>
                        ) }
                      </FormSection>
                    ) : section.value === 'chart-type' ? (
                      <div className='settings-container'>
                        <FormSection>
                          <FormField
                            type='select'
                            value={ chartType }
                            onChange={ setChartType }
                            options={ chartTypeOptions }
                          />

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

                          { gridMode === 'grid' && (
                            <FormRow>
                              <FormCol>
                                <FormField
                                  type='button-group'
                                  label='Split by'
                                  value={ gridSplitBy }
                                  onChange={ setGridSplitBy }
                                  options={ [
                                    { value: 'label', label: 'By Label' },
                                    { value: 'value', label: 'By Value' },
                                  ] }
                                />
                              </FormCol>
                              <FormCol>
                                <FormField
                                  type='select'
                                  label='Aspect ratio'
                                  value={ gridAspectRatio }
                                  onChange={ setGridAspectRatio }
                                  options={ [
                                    { value: '16/9', label: '16:9 (Widescreen)' },
                                    { value: '4/3', label: '4:3 (Standard)' },
                                    { value: '1/1', label: '1:1 (Square)' },
                                    { value: '21/9', label: '21:9 (Ultrawide)' },
                                    { value: '3/2', label: '3:2 (Classic)' },
                                    { value: '2/1', label: '2:1 (Panoramic)' },
                                  ] }
                                />
                              </FormCol>
                            </FormRow>
                          ) }

                          { gridMode === 'grid' && (
                            <FormRow>
                              <FormCol>
                                <FormField
                                  type='number'
                                  label='Grid columns'
                                  value={ gridColumns }
                                  onChange={ ( value ) => setGridColumns( Number( value ) ) }
                                  min={ 1 }
                                  max={ 6 }
                                />
                              </FormCol>
                              <FormCol>
                                <FormField
                                  type='number'
                                  label='Grid columns (Mobile)'
                                  value={ gridColumnsMobile }
                                  onChange={ ( value ) => setGridColumnsMobile( Number( value ) ) }
                                  min={ 1 }
                                  max={ 6 }
                                />
                              </FormCol>
                            </FormRow>
                          ) }

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
                        <PreviewSettings />
                      </div>
                    ) : section.value === 'legend' ? (
                      <LegendSettings />
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
          <Search className='search-icon' />
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
              <X className='icon-sm' />
            </button>
          ) }
        </div>

        <Button
          variant='default'
          size='sm'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white h-9'
        >
          <HelpCircle className='icon-sm mr-2' />
          Help
        </Button>
      </div>
    </div>
  );
}
