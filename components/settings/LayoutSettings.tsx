'use client';

import { Separator } from '@/components/ui/separator';
import { useChartStore } from '@/store/useChartStore';
import { FormField } from '@/components/ui/form-field';
import { FormSection } from '@/components/ui/form-section';
import { FormGrid } from '@/components/ui/form-grid';
import { FormRow } from '@/components/ui/form-row';
import { FormCol } from '@/components/ui/form-col';

export function LayoutSettings() {
  // Typography
  const layoutMainFont = useChartStore((state) => state.layoutMainFont);
  const setLayoutMainFont = useChartStore((state) => state.setLayoutMainFont);
  const layoutTextColor = useChartStore((state) => state.layoutTextColor);
  const setLayoutTextColor = useChartStore((state) => state.setLayoutTextColor);

  // Background
  const layoutBackgroundColorEnabled = useChartStore(
    (state) => state.layoutBackgroundColorEnabled
  );
  const setLayoutBackgroundColorEnabled = useChartStore(
    (state) => state.setLayoutBackgroundColorEnabled
  );
  const layoutBackgroundImageEnabled = useChartStore(
    (state) => state.layoutBackgroundImageEnabled
  );
  const setLayoutBackgroundImageEnabled = useChartStore(
    (state) => state.setLayoutBackgroundImageEnabled
  );
  const layoutBackgroundColor = useChartStore(
    (state) => state.layoutBackgroundColor
  );
  const setLayoutBackgroundColor = useChartStore(
    (state) => state.setLayoutBackgroundColor
  );
  const layoutBackgroundImageUrl = useChartStore(
    (state) => state.layoutBackgroundImageUrl
  );
  const setLayoutBackgroundImageUrl = useChartStore(
    (state) => state.setLayoutBackgroundImageUrl
  );
  const layoutBackgroundImageSize = useChartStore(
    (state) => state.layoutBackgroundImageSize
  );
  const setLayoutBackgroundImageSize = useChartStore(
    (state) => state.setLayoutBackgroundImageSize
  );
  const layoutBackgroundImagePosition = useChartStore(
    (state) => state.layoutBackgroundImagePosition
  );
  const setLayoutBackgroundImagePosition = useChartStore(
    (state) => state.setLayoutBackgroundImagePosition
  );

  // Margins
  const layoutMarginTop = useChartStore((state) => state.layoutMarginTop);
  const setLayoutMarginTop = useChartStore((state) => state.setLayoutMarginTop);
  const layoutMarginRight = useChartStore((state) => state.layoutMarginRight);
  const setLayoutMarginRight = useChartStore(
    (state) => state.setLayoutMarginRight
  );
  const layoutMarginBottom = useChartStore((state) => state.layoutMarginBottom);
  const setLayoutMarginBottom = useChartStore(
    (state) => state.setLayoutMarginBottom
  );
  const layoutMarginLeft = useChartStore((state) => state.layoutMarginLeft);
  const setLayoutMarginLeft = useChartStore(
    (state) => state.setLayoutMarginLeft
  );

  // Padding
  const layoutPaddingTop = useChartStore((state) => state.layoutPaddingTop);
  const setLayoutPaddingTop = useChartStore(
    (state) => state.setLayoutPaddingTop
  );
  const layoutPaddingRight = useChartStore((state) => state.layoutPaddingRight);
  const setLayoutPaddingRight = useChartStore(
    (state) => state.setLayoutPaddingRight
  );
  const layoutPaddingBottom = useChartStore(
    (state) => state.layoutPaddingBottom
  );
  const setLayoutPaddingBottom = useChartStore(
    (state) => state.setLayoutPaddingBottom
  );
  const layoutPaddingLeft = useChartStore((state) => state.layoutPaddingLeft);
  const setLayoutPaddingLeft = useChartStore(
    (state) => state.setLayoutPaddingLeft
  );

  // Border
  const layoutBorderTop = useChartStore((state) => state.layoutBorderTop);
  const setLayoutBorderTop = useChartStore((state) => state.setLayoutBorderTop);
  const layoutBorderRight = useChartStore((state) => state.layoutBorderRight);
  const setLayoutBorderRight = useChartStore(
    (state) => state.setLayoutBorderRight
  );
  const layoutBorderBottom = useChartStore((state) => state.layoutBorderBottom);
  const setLayoutBorderBottom = useChartStore(
    (state) => state.setLayoutBorderBottom
  );
  const layoutBorderLeft = useChartStore((state) => state.layoutBorderLeft);
  const setLayoutBorderLeft = useChartStore(
    (state) => state.setLayoutBorderLeft
  );
  const layoutBorderStyle = useChartStore((state) => state.layoutBorderStyle);
  const setLayoutBorderStyle = useChartStore(
    (state) => state.setLayoutBorderStyle
  );
  const layoutBorderColor = useChartStore((state) => state.layoutBorderColor);
  const setLayoutBorderColor = useChartStore(
    (state) => state.setLayoutBorderColor
  );
  const layoutBorderWidth = useChartStore((state) => state.layoutBorderWidth);
  const setLayoutBorderWidth = useChartStore(
    (state) => state.setLayoutBorderWidth
  );
  const layoutBorderRadius = useChartStore((state) => state.layoutBorderRadius);
  const setLayoutBorderRadius = useChartStore(
    (state) => state.setLayoutBorderRadius
  );

  // Read direction
  const layoutReadDirection = useChartStore(
    (state) => state.layoutReadDirection
  );
  const setLayoutReadDirection = useChartStore(
    (state) => state.setLayoutReadDirection
  );

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Montserrat', label: 'Montserrat' },
  ];

  return (
    <div className='settings-container'>
      {/* Typography */}
      <FormSection title='Typography'>
        <FormGrid columns={2}>
          <FormField
            type='select'
            label='Main Font'
            value={layoutMainFont}
            onChange={setLayoutMainFont}
            options={fontOptions}
          />
          <FormField
            type='color'
            label='Text Color'
            value={layoutTextColor}
            onChange={setLayoutTextColor}
          />
        </FormGrid>
      </FormSection>

      <Separator />

      {/* Background */}
      <FormSection title='Background'>
        <FormGrid columns={2}>
          <FormField
            type='button-group'
            label='Color'
            value={layoutBackgroundColorEnabled ? 'on' : 'off'}
            onChange={(value) =>
              setLayoutBackgroundColorEnabled(value === 'on')
            }
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <FormField
            type='button-group'
            label='Image'
            value={layoutBackgroundImageEnabled ? 'on' : 'off'}
            onChange={(value) =>
              setLayoutBackgroundImageEnabled(value === 'on')
            }
            options={[
              { value: 'on', label: 'On' },
              { value: 'off', label: 'Off' },
            ]}
          />
        </FormGrid>

        {layoutBackgroundColorEnabled && (
          <FormField
            type='color'
            label='Background Color'
            value={layoutBackgroundColor}
            onChange={setLayoutBackgroundColor}
          />
        )}

        {layoutBackgroundImageEnabled && (
          <>
            <FormField
              type='url'
              label='Image URL'
              value={layoutBackgroundImageUrl}
              onChange={setLayoutBackgroundImageUrl}
              placeholder='https://example.com/image.jpg'
            />
            <FormGrid columns={2}>
              <FormField
                type='select'
                label='Size'
                value={layoutBackgroundImageSize}
                onChange={setLayoutBackgroundImageSize}
                options={[
                  { value: 'fill', label: 'Fill' },
                  { value: 'fit', label: 'Fit' },
                  { value: 'original', label: 'Original' },
                  { value: 'stretch', label: 'Stretch' },
                ]}
              />
              <FormField
                type='select'
                label='Position'
                value={layoutBackgroundImagePosition}
                onChange={setLayoutBackgroundImagePosition}
                options={[
                  { value: 'center', label: 'Center' },
                  { value: 'top', label: 'Top' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            </FormGrid>
          </>
        )}
      </FormSection>

      <Separator />

      {/* Margins */}
      <FormSection title='Margins (px)'>
        <FormGrid columns={4}>
          <FormField
            type='number'
            label='Top'
            value={layoutMarginTop}
            onChange={setLayoutMarginTop}
          />
          <FormField
            type='number'
            label='Right'
            value={layoutMarginRight}
            onChange={setLayoutMarginRight}
          />
          <FormField
            type='number'
            label='Bottom'
            value={layoutMarginBottom}
            onChange={setLayoutMarginBottom}
          />
          <FormField
            type='number'
            label='Left'
            value={layoutMarginLeft}
            onChange={setLayoutMarginLeft}
          />
        </FormGrid>
      </FormSection>

      <Separator />

      {/* Padding */}
      <FormSection title='Padding (px)'>
        <FormGrid columns={4}>
          <FormField
            type='number'
            label='Top'
            value={layoutPaddingTop}
            onChange={setLayoutPaddingTop}
          />
          <FormField
            type='number'
            label='Right'
            value={layoutPaddingRight}
            onChange={setLayoutPaddingRight}
          />
          <FormField
            type='number'
            label='Bottom'
            value={layoutPaddingBottom}
            onChange={setLayoutPaddingBottom}
          />
          <FormField
            type='number'
            label='Left'
            value={layoutPaddingLeft}
            onChange={setLayoutPaddingLeft}
          />
        </FormGrid>
      </FormSection>

      <Separator />

      {/* Border */}
      <FormSection title='Border'>
        <FormRow gap='md'>
          <FormCol span='auto'>
            <FormField
              type='switch'
              label='Top'
              checked={layoutBorderTop}
              onChange={setLayoutBorderTop}
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='switch'
              label='Right'
              checked={layoutBorderRight}
              onChange={setLayoutBorderRight}
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='switch'
              label='Bottom'
              checked={layoutBorderBottom}
              onChange={setLayoutBorderBottom}
            />
          </FormCol>
          <FormCol span='auto'>
            <FormField
              type='switch'
              label='Left'
              checked={layoutBorderLeft}
              onChange={setLayoutBorderLeft}
            />
          </FormCol>
        </FormRow>

        {(layoutBorderTop ||
          layoutBorderRight ||
          layoutBorderBottom ||
          layoutBorderLeft) && (
          <div className='settings-nested-section'>
            <FormGrid columns={2}>
              <FormField
                type='select'
                label='Style'
                value={layoutBorderStyle}
                onChange={setLayoutBorderStyle}
                options={[
                  { value: 'solid', label: 'Solid' },
                  { value: 'dashed', label: 'Dashed' },
                  { value: 'dotted', label: 'Dotted' },
                ]}
              />
              <FormField
                type='color'
                label='Color'
                value={layoutBorderColor}
                onChange={setLayoutBorderColor}
              />
            </FormGrid>

            <FormGrid columns={2}>
              <FormField
                type='number'
                label='Width (px)'
                value={layoutBorderWidth}
                onChange={setLayoutBorderWidth}
                min={1}
                max={20}
              />
              <FormField
                type='number'
                label='Radius (px)'
                value={layoutBorderRadius}
                onChange={setLayoutBorderRadius}
                min={0}
                max={50}
              />
            </FormGrid>
          </div>
        )}
      </FormSection>

      <Separator />

      {/* Read Direction */}
      <FormSection title='Read direction'>
        <FormField
          type='button-group'
          value={layoutReadDirection}
          onChange={setLayoutReadDirection}
          options={[
            { value: 'ltr', label: 'LTR' },
            { value: 'rtl', label: 'RTL' },
          ]}
        />
      </FormSection>
    </div>
  );
}
