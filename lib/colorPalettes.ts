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
      // Extended colors
      '#3F51B5', // Indigo
      '#CDDC39', // Lime
      '#8BC34A', // Light Green
      '#795548', // Brown
      '#607D8B', // Blue Grey
      '#00BCD4', // Cyan
      '#673AB7', // Deep Purple
      '#FFEB3B', // Yellow
      // Further extended colors
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#3F51B5', // Indigo
      '#2196F3', // Blue
      '#03A9F4', // Light Blue
      '#00BCD4', // Cyan
      '#009688', // Teal
      '#8BC34A', // Light Green
      '#CDDC39', // Lime
      '#FFC107', // Amber
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    colors: [
      '#1A237E', // Indigo 900
      '#0D47A1', // Blue 900
      '#01579B', // Light Blue 900
      '#006064', // Cyan 900
      '#263238', // Blue Grey 900
      '#37474F', // Blue Grey 800
      '#455A64', // Blue Grey 700
      '#546E7A', // Blue Grey 600
      '#1565C0', // Blue 800
      '#283593', // Indigo 800
    ],
  },
  {
    id: 'warm',
    name: 'Warm',
    colors: [
      '#B71C1C', // Red 900
      '#C62828', // Red 800
      '#D32F2F', // Red 700
      '#E64A19', // Deep Orange 600
      '#F57C00', // Orange 700
      '#FFA000', // Amber 700
      '#FFB300', // Amber 600
      '#FFCA28', // Amber 400
      '#FF7043', // Deep Orange 400
      '#FF5252', // Red Accent 200
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
  {
  id: 'monochrome',
  name: 'Monochrome',
  colors: [
    '#000000',
    '#1A1A1A',
    '#333333',
    '#4D4D4D',
    '#666666',
    '#808080',
    '#999999',
    '#B3B3B3',
    '#CCCCCC',
    '#E6E6E6',
  ],
},
{
  id: 'neon',
  name: 'Neon',
  colors: [
    '#39FF14', // Neon Green
    '#FF073A', // Neon Red
    '#FE019A', // Neon Pink
    '#0FF0FC', // Neon Cyan
    '#F5F500', // Neon Yellow
    '#FF6EC7', // Neon Magenta
    '#16F529', // Lime Neon
  ],
},
{
  id: 'sunset',
  name: 'Sunset',
  colors: [
    '#FF4500',
    '#FF6A00',
    '#FF8C00',
    '#FFA500',
    '#FFC04D',
    '#FFD280',
    '#FFE5B4',
    '#FFF2D5',
  ],
},
{
  id: 'forest',
  name: 'Forest',
  colors: [
    '#0B3D0B',
    '#145214',
    '#1E6821',
    '#2E8B57',
    '#3CB371',
    '#6DBE83',
    '#98D7A0',
    '#C1EBD0',
  ],
},
{
  id: 'cool',
  name: 'Cool Blues',
  colors: [
    '#001F3F',
    '#003566',
    '#0353A4',
    '#0466C8',
    '#4EA8DE',
    '#89C2D9',
    '#ADE8F4',
    '#CAF0F8',
  ],
},
{
  id: 'rainbow',
  name: 'Rainbow',
  colors: [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#8B00FF',
  ],
},
{
  id: 'gold',
  name: 'Gold & Luxury',
  colors: [
    '#3C2F2F',
    '#4F3C3C',
    '#705A36',
    '#8B6F47',
    '#B08D57', // Luxury Gold
    '#D4AF37', // Metallic Gold
    '#FFD700', // Pure Gold
    '#FFE7A9',
  ],
},
{
  id: 'retro',
  name: 'Retro 80s',
  colors: [
    '#FF6EC7',
    '#FFB86C',
    '#F1FA8C',
    '#50FA7B',
    '#8BE9FD',
    '#BD93F9',
    '#FF79C6',
    '#FF5555',
  ],
},

];

export function getColorPalette(paletteId: string) {
  return COLOR_PALETTES.find((p) => p.id === paletteId) || COLOR_PALETTES[0];
}
