/**
 * Chart type definitions for Claude Charts
 */

// Line, Bar, and Pie Charts
export type LineBarPieChartType =
  | 'line'
  | 'multi-line'
  | 'line-stacked'
  | 'line-projected'
  | 'line-with-dots'
  | 'area'
  | 'area-stacked'
  | 'area-proportional'
  | 'bump'
  | 'streamgraph'
  | 'column'
  | 'column-stacked'
  | 'column-grouped'
  | 'column-proportional'
  | 'bar'
  | 'bar-stacked'
  | 'bar-grouped'
  | 'bar-proportional'
  | 'diverging-bar'
  | 'diverging-bar-labeled'
  | 'column-line-mixed'
  | 'grid-of-charts'
  | 'pie'
  | 'donut'
  | 'pie-with-legend'
  | 'pie-proportional'
  | 'pie-filtered'
  | 'grid-of-pies'
  | 'grid-of-donuts'
  | 'population-pyramid'
  | 'histogram'
  | 'waterfall'
  | 'barcode-plot'
  | 'survey-bars'
  | 'performance-vs-target'
  | 'seismogram'
  | 'step-chart'
  | 'circular-barplot'
  | 'radial-bar'
  | 'radial-stacked-bar'
  | 'polar-area'
  | 'radar';

// Scatter and Distribution Charts
export type ScatterDistributionChartType =
  | 'scatter'
  | 'scatter-animated'
  | 'scatter-with-trendline'
  | 'scatter-with-filters'
  | 'scatter-with-images'
  | 'bubble'
  | 'beeswarm'
  | 'boxplot'
  | 'dot-plot'
  | 'connected-dot-plot'
  | 'lollipop-horizontal'
  | 'lollipop-vertical'
  | 'violin'
  | 'proportional-symbol'
  | 'arrow-plot'
  | 'circle-timeline'
  | 'forest-plot'
  | 'quadrant';

// Hierarchical and Network Charts
export type HierarchicalNetworkChartType =
  | 'treemap'
  | 'sunburst'
  | 'radial-dendrogram'
  | 'circle-packing'
  | 'chord'
  | 'network-force-directed'
  | 'sankey'
  | 'alluvial';

// Maps and Geospatial Charts
export type MapGeospatialChartType =
  | 'point-map'
  | 'point-map-animated'
  | 'point-map-growing'
  | 'point-map-light'
  | 'point-map-dark'
  | 'choropleth'
  | 'choropleth-country'
  | 'choropleth-region'
  | 'heatmap'
  | 'heatmap-point-based'
  | 'line-map'
  | 'route-map'
  | 'satellite-map'
  | 'hex-map-3d'
  | 'extruded-counties'
  | 'extruded-world'
  | 'bubble-map';

// Advanced and Composite Visualizations
export type AdvancedCompositeChartType =
  | 'cycle-plot'
  | 'streamgraph-multi'
  | 'population-grid'
  | 'grid-layout-circular'
  | 'grid-layout-linear'
  | 'grid-layout-geographic'
  | 'small-multiples'
  | 'time-series-animated';

// Union of all chart types
export type ChartType =
  | LineBarPieChartType
  | ScatterDistributionChartType
  | HierarchicalNetworkChartType
  | MapGeospatialChartType
  | AdvancedCompositeChartType;

export type ChartCategory =
  | 'line-bar-pie'
  | 'scatter-distribution'
  | 'hierarchical-network'
  | 'maps-geospatial'
  | 'advanced-composite';

export interface ChartData {
  labels: string[];
  datasets: DatasetConfig[];
}

export interface DatasetConfig {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartConfig {
  type: ChartType;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  animation?: AnimationConfig;
  axes?: AxesConfig;
  legend?: LegendConfig;
  colors?: string[];
  theme?: 'light' | 'dark';
}

export interface AnimationConfig {
  enabled: boolean;
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface AxesConfig {
  x?: AxisConfig;
  y?: AxisConfig;
}

export interface AxisConfig {
  label?: string;
  show?: boolean;
  grid?: boolean;
  format?: string;
}

export interface LegendConfig {
  show?: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export interface ChartExport {
  format: 'png' | 'svg' | 'json' | 'iframe';
  quality?: number;
  scale?: number;
}

// ============================================
// Chart-Specific Configuration Interfaces
// ============================================

// Scatter and Bubble Chart Configuration
export interface ScatterBubbleConfig {
  xColumn: string;
  yColumn: string;
  sizeColumn?: string; // For bubble charts
  categoryColumn?: string;
  showTrendline?: boolean;
  trendlineType?: 'linear' | 'polynomial' | 'exponential';
  pointRadius?: number;
  pointOpacity?: number;
}

// Hierarchical Chart Configuration (Treemap, Sunburst, Circle Packing)
export interface HierarchicalConfig {
  valueColumn: string;
  hierarchyColumns: string[]; // e.g., ['category', 'subcategory', 'item']
  colorScheme?: 'categorical' | 'sequential' | 'diverging';
  showLabels?: boolean;
  labelThreshold?: number; // Minimum size to show label
  padding?: number;
}

// Network and Flow Configuration (Sankey, Alluvial, Chord, Network)
export interface NetworkFlowConfig {
  sourceColumn: string;
  targetColumn: string;
  valueColumn: string;
  nodeColorColumn?: string;
  linkColorColumn?: string;
  nodeAlignment?: 'left' | 'right' | 'center' | 'justify';
  nodeWidth?: number;
  nodePadding?: number;
  linkOpacity?: number;
  showLabels?: boolean;
}

// Network Graph Specific Configuration
export interface NetworkGraphConfig extends NetworkFlowConfig {
  forceStrength?: number;
  chargeStrength?: number;
  linkDistance?: number;
  centerStrength?: number;
  collisionRadius?: number;
  showArrows?: boolean;
}

// Distribution Chart Configuration (Box Plot, Violin, Beeswarm)
export interface DistributionConfig {
  valueColumn: string;
  categoryColumn?: string;
  showOutliers?: boolean;
  showMean?: boolean;
  showMedian?: boolean;
  bandwidth?: number; // For violin plots
  jitter?: number; // For beeswarm plots
  orientation?: 'horizontal' | 'vertical';
}

// Time Series Configuration
export interface TimeSeriesConfig {
  dateColumn: string;
  valueColumns: string[];
  dateFormat?: string;
  interpolation?: 'linear' | 'step' | 'basis' | 'cardinal' | 'monotone';
  showPoints?: boolean;
  projection?: {
    enabled: boolean;
    startDate?: string;
    endDate?: string;
    style?: 'dashed' | 'dotted' | 'solid';
  };
}

// Small Multiples / Grid Configuration
export interface GridLayoutConfig {
  splitByColumn: string;
  columns?: number;
  rows?: number;
  layoutType?: 'grid' | 'circular' | 'geographic';
  shareAxes?: boolean;
  shareScale?: boolean;
  padding?: number;
}

// Stacked Chart Configuration
export interface StackedConfig {
  stackMode?: 'normal' | 'proportional' | 'diverging';
  stackOrder?: 'none' | 'ascending' | 'descending' | 'inside-out' | 'reverse';
  offset?: 'none' | 'silhouette' | 'wiggle' | 'expand';
}

// Transition and Animation Configuration
export interface TransitionConfig extends AnimationConfig {
  type?: 'morph' | 'fade' | 'slide' | 'zoom';
  delay?: number;
  stagger?: number; // Delay between elements
  loop?: boolean;
  autoplay?: boolean;
}

// ============================================
// Geospatial and Map Configuration
// ============================================

export type MapProjection =
  | 'mercator'
  | 'albers'
  | 'equalEarth'
  | 'naturalEarth'
  | 'orthographic'
  | 'stereographic'
  | 'azimuthalEqualArea'
  | 'conicConformal';

export type MapTileProvider =
  | 'openstreetmap'
  | 'mapbox'
  | 'carto-light'
  | 'carto-dark'
  | 'satellite'
  | 'terrain';

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

// Point Map Configuration
export interface PointMapConfig {
  latitudeColumn: string;
  longitudeColumn: string;
  sizeColumn?: string;
  colorColumn?: string;
  labelColumn?: string;
  pointRadius?: number;
  pointOpacity?: number;
  clusterPoints?: boolean;
  clusterRadius?: number;
  animation?: {
    enabled: boolean;
    type?: 'grow' | 'fade' | 'pulse' | 'sequential';
    duration?: number;
    delay?: number;
  };
}

// Choropleth Map Configuration
export interface ChoroplethConfig {
  geoJsonUrl?: string;
  geoJsonData?: any;
  regionColumn: string; // Column that matches GeoJSON property
  valueColumn: string;
  colorScale?: 'sequential' | 'diverging' | 'quantile' | 'quantize';
  colorScheme?: string; // e.g., 'Blues', 'RdYlGn'
  numberOfBins?: number;
  showLegend?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
}

// Heatmap Configuration (Geographic)
export interface GeoHeatmapConfig {
  latitudeColumn: string;
  longitudeColumn: string;
  intensityColumn?: string;
  radius?: number;
  blur?: number;
  maxIntensity?: number;
  gradient?: { [key: number]: string }; // e.g., { 0.4: 'blue', 0.6: 'yellow', 1.0: 'red' }
}

// Route/Line Map Configuration
export interface RouteMapConfig {
  routeData: GeoCoordinate[][];
  lineWidth?: number;
  lineColor?: string | string[];
  animated?: boolean;
  animationSpeed?: number;
  showArrows?: boolean;
  curvature?: number; // For curved routes
}

// 3D/Extruded Map Configuration
export interface ExtrudedMapConfig {
  geoJsonUrl?: string;
  geoJsonData?: any;
  regionColumn: string;
  heightColumn: string;
  colorColumn?: string;
  extrusionScale?: number;
  pitch?: number; // Camera angle
  bearing?: number; // Camera rotation
  lightPosition?: [number, number, number];
  ambientLight?: number;
}

// Base Map Configuration
export interface MapConfig {
  projection?: MapProjection;
  center?: GeoCoordinate;
  zoom?: number;
  bounds?: MapBounds;
  tileProvider?: MapTileProvider;
  tileUrl?: string;
  showControls?: boolean;
  showScale?: boolean;
  showAttribution?: boolean;
  interactive?: boolean;
  scrollZoom?: boolean;
  theme?: 'light' | 'dark';
}

// Extended Chart Configuration with specific types
export interface ExtendedChartConfig extends ChartConfig {
  scatter?: ScatterBubbleConfig;
  hierarchical?: HierarchicalConfig;
  network?: NetworkFlowConfig | NetworkGraphConfig;
  distribution?: DistributionConfig;
  timeSeries?: TimeSeriesConfig;
  grid?: GridLayoutConfig;
  stacked?: StackedConfig;
  transition?: TransitionConfig;
  map?: MapConfig;
  pointMap?: PointMapConfig;
  choropleth?: ChoroplethConfig;
  geoHeatmap?: GeoHeatmapConfig;
  routeMap?: RouteMapConfig;
  extrudedMap?: ExtrudedMapConfig;
}
