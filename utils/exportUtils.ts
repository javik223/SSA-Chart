/**
 * Export utilities for chart downloads
 */

import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';

export type ExportFormat = 'svg' | 'png' | 'jpg' | 'pdf';

/**
 * Downloads a file with the given content
 */
function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Prepares container for export by hiding resize handle
 */
function prepareContainerForExport(containerElement: HTMLElement) {
  const resizeHandle = containerElement.querySelector(
    '[title="Drag to resize width"]'
  ) as HTMLElement;
  const originalDisplay = resizeHandle?.style.display;
  if (resizeHandle) {
    resizeHandle.style.display = 'none';
  }
  return { resizeHandle, originalDisplay };
}

/**
 * Restores container after export
 */
function restoreContainer(
  resizeHandle: HTMLElement | null,
  originalDisplay: string | undefined
) {
  if (resizeHandle && originalDisplay !== undefined) {
    resizeHandle.style.display = originalDisplay;
  }
}

/**
 * Exports container as SVG file
 */
export async function exportAsSVG(
  containerElement: HTMLElement,
  filename: string = 'chart'
) {
  const { resizeHandle, originalDisplay } =
    prepareContainerForExport(containerElement);

  try {
    // Filter function to exclude resize handle from export
    function filter(node: HTMLElement) {
      // Exclude the resize handle
      if (node.title === 'Drag to resize width') {
        return false;
      }
      return true;
    }

    const dataUrl = await htmlToImage.toSvg(containerElement, { filter });

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    downloadFile(blob, `${filename}.svg`);

    restoreContainer(resizeHandle, originalDisplay);
  } catch (error) {
    restoreContainer(resizeHandle, originalDisplay);
    console.error('Error exporting as SVG:', error);
    throw error;
  }
}

/**
 * Exports container as PNG file
 */
export async function exportAsPNG(
  containerElement: HTMLElement,
  filename: string = 'chart',
  exportWidth?: number
) {
  const { resizeHandle, originalDisplay } =
    prepareContainerForExport(containerElement);

  try {
    const rect = containerElement.getBoundingClientRect();
    const originalWidth = rect.width;

    // Calculate pixel ratio based on export width
    let pixelRatio = 2; // Default 2x for retina
    if (exportWidth) {
      pixelRatio = exportWidth / originalWidth;
    }

    const blob = await htmlToImage.toBlob(containerElement, {
      quality: 1,
      pixelRatio: pixelRatio,
    });

    if (blob) {
      downloadFile(blob, `${filename}.png`);
    } else {
      throw new Error('Failed to create PNG blob');
    }

    restoreContainer(resizeHandle, originalDisplay);
  } catch (error) {
    restoreContainer(resizeHandle, originalDisplay);
    console.error('Error exporting as PNG:', error);
    throw error;
  }
}

/**
 * Exports container as JPG file
 */
export async function exportAsJPG(
  containerElement: HTMLElement,
  filename: string = 'chart',
  exportWidth?: number,
  quality: number = 0.95
) {
  const { resizeHandle, originalDisplay } =
    prepareContainerForExport(containerElement);

  try {
    const rect = containerElement.getBoundingClientRect();
    const originalWidth = rect.width;

    // Calculate pixel ratio based on export width
    let pixelRatio = 2; // Default 2x for retina
    if (exportWidth) {
      pixelRatio = exportWidth / originalWidth;
    }

    const dataUrl = await htmlToImage.toJpeg(containerElement, {
      quality: quality,
      pixelRatio: pixelRatio,
      backgroundColor: '#ffffff', // White background for JPG
    });

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    downloadFile(blob, `${filename}.jpg`);

    restoreContainer(resizeHandle, originalDisplay);
  } catch (error) {
    restoreContainer(resizeHandle, originalDisplay);
    console.error('Error exporting as JPG:', error);
    throw error;
  }
}

/**
 * Exports container as PDF file with high-quality rendering
 * Uses PNG conversion to avoid compatibility issues with modern CSS
 */
export async function exportAsPDF(
  containerElement: HTMLElement,
  filename: string = 'chart',
  exportWidth?: number
) {
  const { resizeHandle, originalDisplay } =
    prepareContainerForExport(containerElement);

  try {
    const rect = containerElement.getBoundingClientRect();
    const originalWidth = rect.width;
    const originalHeight = rect.height;

    // Calculate pixel ratio for high quality
    // Use 3x minimum for crisp PDF output
    let pixelRatio = 3;
    if (exportWidth) {
      pixelRatio = Math.max(3, exportWidth / originalWidth);
    }

    // Convert to high-quality PNG first (avoids LAB color issues)
    const dataUrl = await htmlToImage.toPng(containerElement, {
      quality: 1,
      pixelRatio: pixelRatio,
    });

    // Calculate PDF dimensions (convert pixels to mm, assuming 96 DPI)
    const pdfWidth = (originalWidth * 25.4) / 96;
    const pdfHeight = (originalHeight * 25.4) / 96;

    // Determine orientation
    const orientation = pdfWidth > pdfHeight ? 'landscape' : 'portrait';

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: [pdfWidth, pdfHeight],
      compress: true,
    });

    // Add image to PDF
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    // Save PDF
    pdf.save(`${filename}.pdf`);

    restoreContainer(resizeHandle, originalDisplay);
  } catch (error) {
    restoreContainer(resizeHandle, originalDisplay);
    console.error('Error exporting as PDF:', error);
    throw error;
  }
}

/**
 * Main export function that handles all formats
 */
export async function exportChart(
  containerElement: HTMLElement,
  format: ExportFormat,
  filename: string = 'chart',
  exportWidth?: number
) {
  switch (format) {
    case 'svg':
      await exportAsSVG(containerElement, filename);
      break;
    case 'png':
      await exportAsPNG(containerElement, filename, exportWidth);
      break;
    case 'jpg':
      await exportAsJPG(containerElement, filename, exportWidth);
      break;
    case 'pdf':
      await exportAsPDF(containerElement, filename, exportWidth);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
