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
                variant={ previewDevice === 'mobile' ? 'default' : 'outline' }
                size='icon'
                onClick={ () => {
                  setPreviewDevice( 'mobile' );
                  setPreviewWidth( 375 );
                  setPreviewHeight( 667 );
                } }
              >
                <Smartphone className='' />
              </Button>
              <Button
                variant={ previewDevice === 'tablet' ? 'default' : 'outline' }
                size='icon'
                onClick={ () => {
                  setPreviewDevice( 'tablet' );
                  setPreviewWidth( 768 );
                  setPreviewHeight( 1024 );
                } }
              >
                <Tablet />
              </Button>
              <Button
                variant={ previewDevice === 'desktop' ? 'default' : 'outline' }
                size='icon'
                onClick={ () => {
                  setPreviewDevice( 'desktop' );
                  setPreviewWidth( 1920 );
                  setPreviewHeight( 1080 );
                } }
              >
                <Monitor />
              </Button>
            </ButtonGroup>
          </FormCol>
        </FormRow>
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
