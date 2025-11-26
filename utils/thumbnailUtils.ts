import { toJpeg } from 'html-to-image';

/**
 * Generate a thumbnail image from the chart preview area
 * Captures only the chart graphic, excluding header and footer
 */
export async function generateChartThumbnail(): Promise<string | null> {
  try {
    // Find the chart graphic element (not the full container)
    const chartGraphic = document.querySelector('.chart-preview-graphic') as HTMLElement;

    if (!chartGraphic) {
      console.warn('Chart graphic not found for thumbnail generation');
      console.log('Available chart elements:', {
        chartPreviewGraphic: document.querySelector('.chart-preview-graphic'),
        chartPreviewGraphicWrapper: document.querySelector('.chart-preview-graphic-wrapper'),
        dataChartContainer: document.querySelector('[data-chart-container]'),
      });
      return null;
    }

    // Wait a bit for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the chart graphic as JPEG
    const thumbnailDataUrl = await toJpeg(chartGraphic, {
      quality: 0.7,
      pixelRatio: 1,
      backgroundColor: '#ffffff',
      cacheBust: true,
    });

    console.log('Thumbnail generated successfully, size:', thumbnailDataUrl.length, 'bytes');
    return thumbnailDataUrl;
  } catch (error) {
    console.error('Failed to generate thumbnail:', error);
    return null;
  }
}

/**
 * Generate thumbnail with retry logic
 */
export async function generateThumbnailWithRetry(maxRetries = 3): Promise<string | null> {
  for (let i = 0; i < maxRetries; i++) {
    const thumbnail = await generateChartThumbnail();
    if (thumbnail) {
      return thumbnail;
    }
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return null;
}
