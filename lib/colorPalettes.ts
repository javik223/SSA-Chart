// Define color palettes for charts
export const COLOR_PALETTES = [
  {
    id: 'default',
    name: 'Default',
    colors: [
      '#0052FF',
      '#00A6FF',
      '#A855F7',
      '#FF006B',
      '#FF5722',
      '#FF9800',
      '#FFC107',
      '#00BFA5',
      '#4CAF50',
      '#F44336',
      '#9E9E9E',
      '#424242',
    ],
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: [
      '#B4D7FF',
      '#FFDCE5',
      '#FFF4CC',
      '#D4F4DD',
      '#E5D4FF',
      '#FFE4CC',
      '#D4F1F4',
      '#FFD4D4',
    ],
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    colors: [
      '#FF0080',
      '#7928CA',
      '#0070F3',
      '#50E3C2',
      '#F5A623',
      '#D0021B',
      '#4A90E2',
      '#BD10E0',
    ],
  },
  {
    id: 'earth',
    name: 'Earth Tones',
    colors: [
      '#8B4513',
      '#A0522D',
      '#CD853F',
      '#DEB887',
      '#D2691E',
      '#BC8F8F',
      '#F4A460',
      '#DAA520',
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: [
      '#006994',
      '#0081A7',
      '#00AFB9',
      '#FDFCDC',
      '#FED9B7',
      '#F07167',
      '#00B4D8',
      '#90E0EF',
    ],
  },
];

export function getColorPalette(paletteId: string) {
  return COLOR_PALETTES.find((p) => p.id === paletteId) || COLOR_PALETTES[0];
}
