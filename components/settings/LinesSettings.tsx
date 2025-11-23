'use client';

import { Circle, Square, Triangle, Diamond } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';
import { AnimatePresence, motion } from 'motion/react';

export function LinesSettings() {
  const curveType = useChartStore( ( state ) => state.curveType );
  const setCurveType = useChartStore( ( state ) => state.setCurveType );
  const lineWidth = useChartStore( ( state ) => state.lineWidth );
  const setLineWidth = useChartStore( ( state ) => state.setLineWidth );
  const lineStyle = useChartStore( ( state ) => state.lineStyle );
  const setLineStyle = useChartStore( ( state ) => state.setLineStyle );

  const showPoints = useChartStore( ( state ) => state.showPoints );
  const setShowPoints = useChartStore( ( state ) => state.setShowPoints );
  const pointSize = useChartStore( ( state ) => state.pointSize );
  const setPointSize = useChartStore( ( state ) => state.setPointSize );
  const pointShape = useChartStore( ( state ) => state.pointShape );
  const setPointShape = useChartStore( ( state ) => state.setPointShape );
  const pointColor = useChartStore( ( state ) => state.pointColor );
  const setPointColor = useChartStore( ( state ) => state.setPointColor );
  const pointOutlineWidth = useChartStore( ( state ) => state.pointOutlineWidth );
  const setPointOutlineWidth = useChartStore( ( state ) => state.setPointOutlineWidth );
  const pointOutlineColor = useChartStore( ( state ) => state.pointOutlineColor );
  const setPointOutlineColor = useChartStore( ( state ) => state.setPointOutlineColor );

  const showArea = useChartStore( ( state ) => state.showArea );
  const setShowArea = useChartStore( ( state ) => state.setShowArea );
  const areaOpacity = useChartStore( ( state ) => state.areaOpacity );
  const setAreaOpacity = useChartStore( ( state ) => state.setAreaOpacity );

  return (
    <div className='settings-container'>
      <FormSection title='Lines'>
        <FormRow>
          <FormCol span='auto'>
            <FormField
              type='select'
              label='Curve Type'
              value={ curveType }
              onChange={ setCurveType as ( value: string ) => void }
              options={ [
                { value: 'linear', label: 'Linear' },
                { value: 'monotone', label: 'Smooth' },
                { value: 'step', label: 'Step' },
              ] }
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='select'
              label='Style'
              value={ lineStyle }
              onChange={ setLineStyle as ( value: string ) => void }
              options={ [
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' },
              ] }
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='number'
              label='Width'
              value={ lineWidth }
              onChange={ ( v ) => setLineWidth( v ?? 2 ) }
              min={ 1 }
              max={ 10 }
            />
          </FormCol>
        </FormRow>
      </FormSection>

      <Separator />

      <FormSection title='Data Points'>
        <FormField
          type='switch'
          label='Show Points'
          checked={ showPoints }
          onChange={ setShowPoints }
        />

        { showPoints && (
          <>
            <Separator />
            <FormRow>
              <FormCol span='auto'>
                <FormField
                  type='number'
                  label='Size'
                  value={ pointSize }
                  onChange={ ( v ) => setPointSize( v ?? 4 ) }
                  min={ 1 }
                  max={ 20 }
                />
              </FormCol>

              <FormCol span='auto'>
                <FormField
                  type='button-group'
                  label='Shape'
                  value={ pointShape }
                  onChange={ setPointShape as ( value: string ) => void }
                  options={ [
                    { value: 'circle', icon: <Circle className='h-3 w-3' /> },
                    { value: 'square', icon: <Square className='h-3 w-3' /> },
                    { value: 'diamond', icon: <Diamond className='h-3 w-3' /> },
                    { value: 'triangle', icon: <Triangle className='h-3 w-3' /> },
                  ] }
                />
              </FormCol>
              <FormCol span='auto'>
                <FormField
                  type='color'
                  label='Color'
                  value={ pointColor }
                  onChange={ setPointColor }
                />
              </FormCol>
            </FormRow>
            <Separator />
            <FormRow>
              <FormCol span='auto'>
                <FormField
                  type='number'
                  label='Outline Width'
                  value={ pointOutlineWidth }
                  onChange={ ( v ) => setPointOutlineWidth( v ?? 2 ) }
                  min={ 0 }
                  max={ 10 }
                />
              </FormCol>
              <FormCol span='auto'>
                <FormField
                  type='color'
                  label='Outline Color'
                  value={ pointOutlineColor }
                  onChange={ setPointOutlineColor }
                />
              </FormCol>
            </FormRow>
          </>
        ) }
      </FormSection>

      <Separator />

      <FormSection title='Areas'>
        <FormRow>
          <FormField
            type='switch'
            label='Fill Area'
            checked={ showArea }
            onChange={ setShowArea }
          />
          <FormCol span={ 12 }>
            <AnimatePresence>
              { showArea && (
                <motion.div initial={ { opacity: 0, height: 0 } } animate={ { opacity: 1, height: 'auto' } } exit={ { opacity: 0, height: 0 } } transition={ { duration: .3 } }>
                  <FormField
                    type='number'
                    label='Opacity'
                    value={ areaOpacity }
                    onChange={ ( v ) => setAreaOpacity( v ?? 0.2 ) }
                    min={ 0 }
                    max={ 1 }
                    step={ 0.1 }
                  />
                </motion.div>
              ) }
            </AnimatePresence>
          </FormCol>
        </FormRow>
      </FormSection>
    </div>
  );
}
