'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { FormCol } from '@/components/ui/form-col';
import { FormField } from '@/components/ui/form-field';
import { FormRow } from '@/components/ui/form-row';
import { FormSection } from '@/components/ui/form-section';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PreviewSettings() {
  const previewWidth = useChartStore( ( state ) => state.previewWidth );
  const setPreviewWidth = useChartStore( ( state ) => state.setPreviewWidth );
  const previewHeight = useChartStore( ( state ) => state.previewHeight );
  const setPreviewHeight = useChartStore( ( state ) => state.setPreviewHeight );
  const previewDevice = useChartStore( ( state ) => state.previewDevice );
  const setPreviewDevice = useChartStore( ( state ) => state.setPreviewDevice );
  const darkModePreview = useChartStore( ( state ) => state.darkModePreview );
  const setDarkModePreview = useChartStore( ( state ) => state.setDarkModePreview );

  return (
    <FormSection>
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
        </FormRow>
        <FormRow>
          <FormCol span={ 3 }>
            <ButtonGroup className='flex'>
              <Button
                variant={ previewDevice === 'viewport' ? 'default' : 'outline' }
                size='icon'
                onClick={ () => setPreviewDevice( 'viewport' ) }
                title='Viewport (Responsive)'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={ 2 } d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' />
                </svg>
              </Button>
              <Button
                variant={ previewDevice === 'mobile' ? 'default' : 'outline' }
                size='icon'
                onClick={ () => setPreviewDevice( 'mobile' ) }
                title='Mobile (375px)'
              >
                <Smartphone className='' />
              </Button>
              <Button
                variant={ previewDevice === 'tablet' ? 'default' : 'outline' }
                size='icon'
                onClick={ () => setPreviewDevice( 'tablet' ) }
                title='Tablet (768px)'
              >
                <Tablet />
              </Button>
              <Button
                variant={ previewDevice === 'desktop' ? 'default' : 'outline' }
                size='icon'
                onClick={ () => setPreviewDevice( 'desktop' ) }
                title='Desktop (1920px)'
              >
                <Monitor />
              </Button>
            </ButtonGroup>
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Viewport (SVG ViewBox)'>
        <Tabs defaultValue='desktop' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-4'>
            <TabsTrigger value='desktop'>Desktop</TabsTrigger>
            <TabsTrigger value='mobile'>Mobile</TabsTrigger>
          </TabsList>

          <TabsContent value='desktop'>
            <FormRow gap='sm'>
              <FormCol span='auto'>
                <FormField
                  type='number'
                  value={ useChartStore( ( state ) => state.desktopViewBoxWidth ) }
                  onChange={ ( v ) => useChartStore.getState().setDesktopViewBoxWidth( v ?? 800 ) }
                  placeholder='Width'
                  label='Desktop Width'
                />
              </FormCol>
              <FormCol span='auto'>
                <FormField
                  type='number'
                  value={ useChartStore( ( state ) => state.desktopViewBoxHeight ) }
                  onChange={ ( v ) => useChartStore.getState().setDesktopViewBoxHeight( v ?? 600 ) }
                  placeholder='Height'
                  label='Desktop Height'
                />
              </FormCol>
            </FormRow>
            <p className='text-xs text-zinc-500 mt-2'>
              Used for Desktop, Tablet, and Viewport modes.
            </p>
          </TabsContent>

          <TabsContent value='mobile'>
            <FormRow gap='sm'>
              <FormCol span='auto'>
                <FormField
                  type='number'
                  value={ useChartStore( ( state ) => state.mobileViewBoxWidth ) }
                  onChange={ ( v ) => useChartStore.getState().setMobileViewBoxWidth( v ?? 400 ) }
                  placeholder='Width'
                  label='Mobile Width'
                />
              </FormCol>
              <FormCol span='auto'>
                <FormField
                  type='number'
                  value={ useChartStore( ( state ) => state.mobileViewBoxHeight ) }
                  onChange={ ( v ) => useChartStore.getState().setMobileViewBoxHeight( v ?? 400 ) }
                  placeholder='Height'
                  label='Mobile Height'
                />
              </FormCol>
            </FormRow>
            <p className='text-xs text-zinc-500 mt-2'>
              Used when Preview Device is set to Mobile.
            </p>
          </TabsContent>
        </Tabs>
      </FormSection>

      {/* <FormSection title='Colorblind check' helpIcon>
        <div className='grid grid-cols-5 gap-2'>
          <Button
            variant={colorblindMode === 'none' ? 'default' : 'outline'}
            size='sm'
            className='h-12 flex flex-col items-center justify-center p-1'
            onClick={() => setColorblindMode('none')}
          >
            <span className='text-[10px]'>None</span>
          </Button>
          <Button
            variant={colorblindMode === 'protanopia' ? 'default' : 'outline'}
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
            variant={colorblindMode === 'deuteranopia' ? 'default' : 'outline'}
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
            variant={colorblindMode === 'tritanopia' ? 'default' : 'outline'}
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
            variant={colorblindMode === 'achromatopsia' ? 'default' : 'outline'}
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
      </FormSection> */}

      <Separator />

      <FormSection title='Dark Mode' helpIcon>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant={ darkModePreview === 'light' ? 'default' : 'outline' }
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
            variant={ darkModePreview === 'dark' ? 'default' : 'outline' }
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
    </FormSection>
  );
}
