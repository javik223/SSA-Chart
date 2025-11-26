import { StateCreator } from 'zustand';

export interface ChartSpecificSlice {
  // Diverging Bar Chart specific settings
  divergingBarSortBy: 'none' | 'value' | 'ascending' | 'descending';
  setDivergingBarSortBy: (sortBy: 'none' | 'value' | 'ascending' | 'descending') => void;

  divergingBarLabelPosition: 'inside' | 'outside';
  setDivergingBarLabelPosition: (position: 'inside' | 'outside') => void;

  divergingBarUseGradientColors: boolean;
  setDivergingBarUseGradientColors: (use: boolean) => void;

  divergingBarPositiveColor: string;
  setDivergingBarPositiveColor: (color: string) => void;

  divergingBarNegativeColor: string;
  setDivergingBarNegativeColor: (color: string) => void;

  // Donut Chart specific settings
  donutInnerRadius: number;
  setDonutInnerRadius: (radius: number) => void;

  donutPadAngle: number;
  setDonutPadAngle: (angle: number) => void;

  donutCornerRadius: number;
  setDonutCornerRadius: (radius: number) => void;

  donutStartAngle: number;
  setDonutStartAngle: (angle: number) => void;

  donutEndAngle: number;
  setDonutEndAngle: (angle: number) => void;

  donutShowTotal: boolean;
  setDonutShowTotal: (show: boolean) => void;

  donutCenterLabel: string;
  setDonutCenterLabel: (label: string) => void;

  // Treemap settings
  treemapTileMethod: 'binary' | 'squarify' | 'resquarify' | 'slice' | 'dice' | 'slice-dice';
  setTreemapTileMethod: ( method: 'binary' | 'squarify' | 'resquarify' | 'slice' | 'dice' | 'slice-dice' ) => void;

  treemapPadding: number;
  setTreemapPadding: ( padding: number ) => void;

  treemapColorMode: 'depth' | 'value' | 'category';
  setTreemapColorMode: ( mode: 'depth' | 'value' | 'category' ) => void;

  treemapCategoryLevel: number;
  setTreemapCategoryLevel: ( level: number ) => void;

  treemapGradientSteepness: number;
  setTreemapGradientSteepness: ( steepness: number ) => void;

  treemapCategoryLabelColor: string;
  setTreemapCategoryLabelColor: ( color: string ) => void;

  treemapStrokeWidth: number;
  setTreemapStrokeWidth: ( width: number ) => void;

  treemapStrokeColor: string;
  setTreemapStrokeColor: ( color: string ) => void;

  // Radial Bar Chart specific settings
  radialInnerRadius: number;
  setRadialInnerRadius: (radius: number) => void;

  radialStartAngle: number;
  setRadialStartAngle: (angle: number) => void;

  radialEndAngle: number;
  setRadialEndAngle: (angle: number) => void;

  radialPadAngle: number;
  setRadialPadAngle: (angle: number) => void;

  radialCornerRadius: number;
  setRadialCornerRadius: (radius: number) => void;
}

export const createChartSpecificSlice: StateCreator<ChartSpecificSlice, [], [], ChartSpecificSlice> = (set) => ({
  // Diverging Bar Chart settings
  divergingBarSortBy: 'ascending',
  setDivergingBarSortBy: (sortBy) => set({ divergingBarSortBy: sortBy }),

  divergingBarLabelPosition: 'outside',
  setDivergingBarLabelPosition: (position) => set({ divergingBarLabelPosition: position }),

  divergingBarUseGradientColors: true,
  setDivergingBarUseGradientColors: (use) => set({ divergingBarUseGradientColors: use }),

  divergingBarPositiveColor: '#3b82f6',
  setDivergingBarPositiveColor: (color) => set({ divergingBarPositiveColor: color }),

  divergingBarNegativeColor: '#ef4444', // red-500
  setDivergingBarNegativeColor: (color) => set({ divergingBarNegativeColor: color }),

  // Donut Chart settings
  donutInnerRadius: 0.6,
  setDonutInnerRadius: (radius) => set({ donutInnerRadius: radius }),

  donutPadAngle: 0,
  setDonutPadAngle: (angle) => set({ donutPadAngle: angle }),

  donutCornerRadius: 0,
  setDonutCornerRadius: (radius) => set({ donutCornerRadius: radius }),

  donutStartAngle: 0,
  setDonutStartAngle: (angle) => set({ donutStartAngle: angle }),

  donutEndAngle: 360,
  setDonutEndAngle: (angle) => set({ donutEndAngle: angle }),

  donutShowTotal: true,
  setDonutShowTotal: (show) => set({ donutShowTotal: show }),

  donutCenterLabel: 'Total',
  setDonutCenterLabel: (label) => set({ donutCenterLabel: label }),

  // Treemap settings
  treemapTileMethod: 'squarify',
  setTreemapTileMethod: (method) => set({ treemapTileMethod: method }),

  treemapPadding: 0,
  setTreemapPadding: ( padding: number ) => set( { treemapPadding: padding } ),

  treemapColorMode: 'category',
  setTreemapColorMode: ( mode: 'depth' | 'value' | 'category' ) => set( { treemapColorMode: mode } ),

  treemapCategoryLevel: 0,
  setTreemapCategoryLevel: ( level: number ) => set( { treemapCategoryLevel: level } ),

  treemapGradientSteepness: 0.3,
  setTreemapGradientSteepness: ( steepness: number ) => set( { treemapGradientSteepness: steepness } ),

  treemapCategoryLabelColor: '#ffffff',
  setTreemapCategoryLabelColor: ( color: string ) => set( { treemapCategoryLabelColor: color } ),

  treemapStrokeWidth: 1,
  setTreemapStrokeWidth: (width) => set({ treemapStrokeWidth: width }),

  treemapStrokeColor: '#ffffff',
  setTreemapStrokeColor: (color) => set({ treemapStrokeColor: color }),

  // Radial Bar Chart settings
  radialInnerRadius: 180,
  setRadialInnerRadius: (radius) => set({ radialInnerRadius: radius }),

  radialStartAngle: 0,
  setRadialStartAngle: (angle) => set({ radialStartAngle: angle }),

  radialEndAngle: 360,
  setRadialEndAngle: (angle) => set({ radialEndAngle: angle }),

  radialPadAngle: 0.01,
  setRadialPadAngle: (angle) => set({ radialPadAngle: angle }),

  radialCornerRadius: 0,
  setRadialCornerRadius: (radius) => set({ radialCornerRadius: radius }),
});
