'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  HelpCircle,
  X,
} from 'lucide-react';
import { useChartStore } from '@/store/useChartStore';
import { HeaderSettingsSection } from '@/components/HeaderSettingsSection';
import { FooterSettingsSection } from '@/components/FooterSettingsSection';
import { LayoutSettings } from '@/components/settings/LayoutSettings';
import { XAxisSettings } from '@/components/settings/XAxisSettings';
import { YAxisSettings } from '@/components/settings/YAxisSettings';
import { LinesSettings } from '@/components/settings/LinesSettings';
import { LegendSettings } from '@/components/settings/LegendSettings';
import { LabelsSettings } from '@/components/settings/LabelsSettings';
import { RadialBarSettings } from '@/components/settings/RadialBarSettings';
import { RadialAreaSettings } from '@/components/settings/RadialAreaSettings';
import { DivergingBarSettings } from '@/components/settings/DivergingBarSettings';
import { TreemapSettings } from '@/components/settings/TreemapSettings';
import { DonutSettings } from '@/components/settings/DonutSettings';
import { ColorsSection } from '@/components/settings/ColorsSection';
import { PreviewSettings } from '@/components/settings/PreviewSettings';
import { ThemeSettings } from '@/components/settings/ThemeSettings';
import { ChartTypeSettings } from '@/components/settings/ChartTypeSettings';
import { ZoomSettings } from '@/components/settings/ZoomSettings';
import { AnimationSettings } from '@/components/settings/AnimationSettings';
import { PlotBackgroundSettings } from '@/components/settings/PlotBackgroundSettings';
import { NumberFormattingSettings } from '@/components/settings/NumberFormattingSettings';
import { AnnotationsSettings } from '@/components/settings/AnnotationsSettings';
import { TooltipSettings } from '@/components/settings/TooltipSettings';
import { ControlsSettings } from '@/components/settings/ControlsSettings';
import {
  PANEL_CONFIGS,
  UNIVERSAL_PANELS,
  CHART_SPECIFIC_PANELS,
  EXCLUDED_PANELS,
  PanelId,
} from '@/lib/chartSettingsConfig';

const PANEL_COMPONENTS: Record<PanelId, React.ComponentType> = {
  preview: PreviewSettings,
  theme: ThemeSettings,
  chartType: ChartTypeSettings,
  controls: ControlsSettings,
  colors: ColorsSection,
  lines: LinesSettings,
  labels: LabelsSettings,
  radialBar: RadialBarSettings,
  radialArea: RadialAreaSettings,
  divergingBar: DivergingBarSettings,
  donut: DonutSettings,
  treemap: TreemapSettings,
  xAxis: XAxisSettings,
  yAxis: YAxisSettings,
  background: PlotBackgroundSettings,
  formatting: NumberFormattingSettings,
  legend: LegendSettings,
  popups: TooltipSettings,
  annotations: AnnotationsSettings,
  animations: AnimationSettings,
  zoom: ZoomSettings,
  layout: LayoutSettings,
  header: HeaderSettingsSection,
  footer: FooterSettingsSection,
};

export function ChartSettings() {
  const chartType = useChartStore( ( state ) => state.chartType );
  const [ searchQuery, setSearchQuery ] = useState( '' );
  const [ openSections, setOpenSections ] = useState<string[]>( [] );

  // Determine available panels
  let availablePanels = [
    ...UNIVERSAL_PANELS,
    ...( CHART_SPECIFIC_PANELS[ chartType ] || [] ),
  ];

  // Filter out excluded panels
  if ( EXCLUDED_PANELS[ chartType ] ) {
    availablePanels = availablePanels.filter( ( id ) => !EXCLUDED_PANELS[ chartType ].includes( id ) );
  }

  // Filter and sort panels based on configuration order (if needed, or just use availablePanels order)
  // Here we might want to enforce a specific order. For now, let's use the order in UNIVERSAL_PANELS + specific ones appended.
  // A better approach might be to have a MASTER_ORDER list and filter it.

  // Let's define a master order to ensure consistency
  const MASTER_ORDER: PanelId[] = [
    'preview',
    'theme',
    'chartType',
    'controls',
    'colors',
    'lines',
    'radialBar',
    'radialArea',
    'divergingBar',
    'donut',
    'treemap',
    'xAxis',
    'yAxis',
    'labels',
    'background',
    'formatting',
    'legend',
    'popups',
    'annotations',
    'animations',
    'zoom',
    'layout',
    'header',
    'footer',
  ];

  const activePanels = MASTER_ORDER.filter( ( id ) => availablePanels.includes( id ) );

  // Check if a section matches the search query
  const doesSectionMatch = ( id: PanelId ) => {
    if ( !searchQuery.trim() ) return true;
    const query = searchQuery.toLowerCase();
    const config = PANEL_CONFIGS[ id ];
    return (
      config.title.toLowerCase().includes( query ) ||
      config.description.toLowerCase().includes( query ) ||
      config.keywords.some( ( keyword ) => keyword.includes( query ) )
    );
  };

  // Get matching section values for auto-expand
  const matchingSections = searchQuery.trim()
    ? activePanels.filter( doesSectionMatch )
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
            { activePanels.map( ( id ) => {
              const config = PANEL_CONFIGS[ id ];
              const Component = PANEL_COMPONENTS[ id ];
              const isMatch = doesSectionMatch( id );

              if ( !isMatch && searchQuery.trim() ) return null;

              return (
                <AccordionItem
                  key={ id }
                  value={ id }
                  className={ !isMatch && searchQuery.trim() ? 'hidden' : '' }
                >
                  <AccordionTrigger className='text-sm py-3 px-4 hover:no-underline'>
                    { config.title }
                  </AccordionTrigger>
                  <AccordionContent className='px-4'>
                    <Component />
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
