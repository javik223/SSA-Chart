/**
 * Color palettes and utilities for Claude Charts
 */

export const colorPalettes = {
  // Categorical palettes
  default: [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
  ],

  pastel: [
    '#a5b4fc', // blue
    '#86efac', // green
    '#fde047', // yellow
    '#fca5a5', // red
    '#c4b5fd', // purple
    '#f9a8d4', // pink
    '#67e8f9', // cyan
    '#fdba74', // orange
  ],

  vivid: [
    '#2563eb', // blue
    '#059669', // green
    '#d97706', // amber
    '#dc2626', // red
    '#7c3aed', // purple
    '#db2777', // pink
    '#0891b2', // cyan
    '#ea580c', // orange
  ],

  // Sequential palettes (for heatmaps, choropleth)
  blues: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af'],
  greens: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534'],
  reds: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'],

  // Diverging palettes (for comparison)
  redBlue: ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5', '#dbeafe', '#93c5fd', '#3b82f6', '#2563eb', '#1d4ed8'],
  orangePurple: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#e9d5ff', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed'],
};

/**
 * Get a color from a palette by index (with wrapping)
 */
export function getColor(palette: keyof typeof colorPalettes, index: number): string {
  const colors = colorPalettes[palette];
  return colors[index % colors.length];
}

/**
 * Generate an array of colors from a palette
 */
export function getColorScale(palette: keyof typeof colorPalettes, count: number): string[] {
  const colors = colorPalettes[palette];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Adjust color opacity
 */
export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  return rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})` : hex;
}
