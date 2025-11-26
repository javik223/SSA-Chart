'use client';

import { useMemo, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { getChart } from '@/lib/chartRegistry';
import { ChartTransition } from './ChartTransition';
import { getColorPalette } from '@/lib/colorPalettes';

export const BasicChart = memo( function BasicChart( { isVisible = true, isFloatingPreview = false }: { isVisible?: boolean; isFloatingPreview?: boolean; } ) {
  // Use selective subscription to only re-render when chart-related data changes
  // This prevents re-renders when title, description, footer, or legend settings change
  const {
    data,
    columnMapping,
    chartType,
    aggregationMode,
    previewWidth,
    previewHeight,
    desktopViewBoxWidth,
    desktopViewBoxHeight,
    mobileViewBoxWidth,
    mobileViewBoxHeight,
    previewDevice,
    colorPalette,
    colorMode,
    xAxisShow,
    xAxisTitle,
    xAxisName,
    xAxisShowLabel,
    xAxisShowGrid,
    xAxisShowDomain,
    xAxisDomainColor,
    xAxisTickCount,
    xAxisTickSize,
    xAxisTickPadding,
    xAxisLabelRotation,
    xAxisTickFormat,
    xAxisPosition,
    xAxisScaleType,
    xAxisMin,
    xAxisMax,
    xAxisTitleType,
    xAxisTitleWeight,
    xAxisTitleColor,
    xAxisTitleSize,
    xAxisTitlePadding,
    xAxisTitleAlignment,
    xAxisTitleArrow,
    xAxisTickPosition,
    xAxisLabelWeight,
    xAxisLabelColor,
    xAxisLabelSize,
    xAxisLabelSpacing,
    xAxisGridColor,
    xAxisGridWidth,
    xAxisGridOpacity,
    xAxisGridDashArray,
    yAxisShow,
    yAxisTitle,
    yAxisName,
    yAxisShowLabel,
    yAxisShowGrid,
    yAxisShowDomain,
    yAxisDomainColor,
    yAxisTickCount,
    yAxisTickSize,
    yAxisTickPadding,
    yAxisTickFormat,
    yAxisMin,
    yAxisMax,
    yAxisPosition,
    yAxisScaleType,
    yAxisFlip,
    yAxisConfigureDefaultMinMax,
    yAxisRoundMin,
    yAxisRoundMax,
    yAxisTitleType,
    yAxisTitlePosition,
    yAxisTitleWeight,
    yAxisTitleColor,
    yAxisTitleSize,
    yAxisTitlePadding,
    yAxisTitleAlignment,
    yAxisTitleArrow,
    yAxisTickPosition,
    yAxisLabelSize,
    yAxisLabelColor,
    yAxisLabelPadding,
    yAxisLabelAngle,
    yAxisLabelWeight,
    yAxisLabelMaxLines,
    yAxisLabelLineHeight,
    yAxisLabelSpacing,
    yAxisLabelRotation,
    yAxisTickMode,
    yAxisTickNumber,
    yAxisOneTickLabelPerLine,
    yAxisGridColor,
    yAxisGridStyle,
    yAxisGridWidth,
    yAxisGridDash,
    yAxisGridSpace,
    yAxisGridExtend,
    yAxisGridOpacity,
    yAxisGridDashArray,
    yAxisLineColor,
    yAxisLineWidth,
    yAxisTickLength,
    yAxisShowAxisLine,
    yAxisEdgePadding,
    curveType,
    lineWidth,
    lineStyle,
    showPoints,
    pointSize,
    pointShape,
    pointColor,
    pointOutlineWidth,
    pointOutlineColor,
    showArea,
    areaOpacity,
    labelShow,
    labelFontSize,
    labelColor,
    labelFontWeight,
    labelPadding,
    divergingBarSortBy,
    divergingBarLabelPosition,
    divergingBarUseGradientColors,
    divergingBarPositiveColor,
    divergingBarNegativeColor,
    treemapGradientSteepness,
    treemapCategoryLabelColor,
    treemapStrokeWidth,
    treemapStrokeColor,
  } = useChartStore( useShallow( ( state ) => ( {
    data: state.data,
    columnMapping: state.columnMapping,
    chartType: state.chartType,
    aggregationMode: state.aggregationMode,
    previewWidth: state.previewWidth,
    previewHeight: state.previewHeight,
    desktopViewBoxWidth: state.desktopViewBoxWidth,
    desktopViewBoxHeight: state.desktopViewBoxHeight,
    mobileViewBoxWidth: state.mobileViewBoxWidth,
    mobileViewBoxHeight: state.mobileViewBoxHeight,
    previewDevice: state.previewDevice,
    colorPalette: state.colorPalette,
    colorMode: state.colorMode,
    xAxisShow: state.xAxisShow,
    xAxisTitle: state.xAxisTitle,
    xAxisName: state.xAxisName,
    xAxisShowLabel: state.xAxisShowLabel,
    xAxisShowGrid: state.xAxisShowGrid,
    xAxisShowDomain: state.xAxisShowDomain,
    xAxisDomainColor: state.xAxisDomainColor,
    xAxisTickCount: state.xAxisTickCount,
    xAxisTickSize: state.xAxisTickSize,
    xAxisTickPadding: state.xAxisTickPadding,
    xAxisLabelRotation: state.xAxisLabelRotation,
    xAxisTickFormat: state.xAxisTickFormat,
    xAxisPosition: state.xAxisPosition,
    xAxisScaleType: state.xAxisScaleType,
    xAxisMin: state.xAxisMin,
    xAxisMax: state.xAxisMax,
    xAxisTitleType: state.xAxisTitleType,
    xAxisTitleWeight: state.xAxisTitleWeight,
    xAxisTitleColor: state.xAxisTitleColor,
    xAxisTitleSize: state.xAxisTitleSize,
    xAxisTitlePadding: state.xAxisTitlePadding,
    xAxisTitleAlignment: state.xAxisTitleAlignment,
    xAxisTitleArrow: state.xAxisTitleArrow,
    xAxisTickPosition: state.xAxisTickPosition,
    xAxisLabelWeight: state.xAxisLabelWeight,
    xAxisLabelColor: state.xAxisLabelColor,
    xAxisLabelSize: state.xAxisLabelSize,
    xAxisLabelSpacing: state.xAxisLabelSpacing,
    xAxisGridColor: state.xAxisGridColor,
    xAxisGridWidth: state.xAxisGridWidth,
    xAxisGridOpacity: state.xAxisGridOpacity,
    xAxisGridDashArray: state.xAxisGridDashArray,
    yAxisShow: state.yAxisShow,
    yAxisTitle: state.yAxisTitle,
    yAxisName: state.yAxisName,
    yAxisShowLabel: state.yAxisShowLabel,
    yAxisShowGrid: state.yAxisShowGrid,
    yAxisShowDomain: state.yAxisShowDomain,
    yAxisDomainColor: state.yAxisDomainColor,
    yAxisTickCount: state.yAxisTickCount,
    yAxisTickSize: state.yAxisTickSize,
    yAxisTickPadding: state.yAxisTickPadding,
    yAxisTickFormat: state.yAxisTickFormat,
    yAxisMin: state.yAxisMin,
    yAxisMax: state.yAxisMax,
    yAxisPosition: state.yAxisPosition,
    yAxisScaleType: state.yAxisScaleType,
    yAxisFlip: state.yAxisFlip,
    yAxisConfigureDefaultMinMax: state.yAxisConfigureDefaultMinMax,
    yAxisRoundMin: state.yAxisRoundMin,
    yAxisRoundMax: state.yAxisRoundMax,
    yAxisTitleType: state.yAxisTitleType,
    yAxisTitlePosition: state.yAxisTitlePosition,
    yAxisTitleWeight: state.yAxisTitleWeight,
    yAxisTitleColor: state.yAxisTitleColor,
    yAxisTitleSize: state.yAxisTitleSize,
    yAxisTitlePadding: state.yAxisTitlePadding,
    yAxisTitleAlignment: state.yAxisTitleAlignment,
    yAxisTitleArrow: state.yAxisTitleArrow,
    yAxisTickPosition: state.yAxisTickPosition,
    yAxisLabelSize: state.yAxisLabelSize,
    yAxisLabelColor: state.yAxisLabelColor,
    yAxisLabelPadding: state.yAxisLabelPadding,
    yAxisLabelAngle: state.yAxisLabelAngle,
    yAxisLabelWeight: state.yAxisLabelWeight,
    yAxisLabelMaxLines: state.yAxisLabelMaxLines,
    yAxisLabelLineHeight: state.yAxisLabelLineHeight,
    yAxisLabelSpacing: state.yAxisLabelSpacing,
    yAxisLabelRotation: state.yAxisLabelRotation,
    yAxisTickMode: state.yAxisTickMode,
    yAxisTickNumber: state.yAxisTickNumber,
    yAxisOneTickLabelPerLine: state.yAxisOneTickLabelPerLine,
    yAxisGridColor: state.yAxisGridColor,
    yAxisGridStyle: state.yAxisGridStyle,
    yAxisGridWidth: state.yAxisGridWidth,
    yAxisGridDash: state.yAxisGridDash,
    yAxisGridSpace: state.yAxisGridSpace,
    yAxisGridExtend: state.yAxisGridExtend,
    yAxisGridOpacity: state.yAxisGridOpacity,
    yAxisGridDashArray: state.yAxisGridDashArray,
    yAxisLineColor: state.yAxisLineColor,
    yAxisLineWidth: state.yAxisLineWidth,
    yAxisTickLength: state.yAxisTickLength,
    yAxisShowAxisLine: state.yAxisShowAxisLine,
    yAxisEdgePadding: state.yAxisEdgePadding,
    curveType: state.curveType,
    lineWidth: state.lineWidth,
    lineStyle: state.lineStyle,
    showPoints: state.showPoints,
    pointSize: state.pointSize,
    pointShape: state.pointShape,
    pointColor: state.pointColor,
    pointOutlineWidth: state.pointOutlineWidth,
    pointOutlineColor: state.pointOutlineColor,
    showArea: state.showArea,
    areaOpacity: state.areaOpacity,
    labelShow: state.labelShow,
    labelFontSize: state.labelFontSize,
    labelColor: state.labelColor,
    labelFontWeight: state.labelFontWeight,
    labelPadding: state.labelPadding,
    divergingBarSortBy: state.divergingBarSortBy,
    divergingBarLabelPosition: state.divergingBarLabelPosition,
    divergingBarUseGradientColors: state.divergingBarUseGradientColors,
    divergingBarPositiveColor: state.divergingBarPositiveColor,
    divergingBarNegativeColor: state.divergingBarNegativeColor,
    treemapGradientSteepness: state.treemapGradientSteepness,
    treemapCategoryLabelColor: state.treemapCategoryLabelColor,
    treemapStrokeWidth: state.treemapStrokeWidth,
    treemapStrokeColor: state.treemapStrokeColor,
  } ) ) );

  // Transform data for chart
  const { chartData, valueKeys, categoryKeys } = useMemo( () => {
    // Skip calculation if not visible
    if ( !isVisible ) return { chartData: [], valueKeys: [], categoryKeys: [] };

    if ( !data || data.length < 2 ) return { chartData: [], valueKeys: [], categoryKeys: [] };
    if ( columnMapping.labels === null || columnMapping.values.length === 0 ) {
      return { chartData: [], valueKeys: [], categoryKeys: [] };
    }

    const headers = data[ 0 ];
    const labelIndex = columnMapping.labels;
    const valueIndices = columnMapping.values;
    const seriesIndex = columnMapping.series;
    const categoryIndices = columnMapping.categories;

    // Get label column name
    const labelKey = String( headers[ labelIndex ] || 'label' );

    // Get category column names
    const categoryKeys = categoryIndices
      ? categoryIndices.map( idx => String( headers[ idx ] || `category${ idx }` ) )
      : [];

    // Standard value keys (for wide format)
    const standardValueKeys = valueIndices.map( ( idx ) => String( headers[ idx ] || `value${ idx }` ) );

    // Transform data rows
    const rows = data.slice( 1 );

    // Handle Long Format (Pivoting) if Series is selected
    if ( seriesIndex !== null && seriesIndex !== undefined && seriesIndex.length > 0 ) {
      const valueIndex = valueIndices[ 0 ]; // Use the first value column for pivoting

      // Group by label
      const groupedByLabel: Record<string, Record<string, number>> = {};
      const uniqueSeries = new Set<string>();

      // Loop through each series column
      seriesIndex.forEach( ( sIdx ) => {
        const seriesKey = String( headers[ sIdx ] || `series${ sIdx }` );

        rows.forEach( ( row ) => {
          const label = String( row[ labelIndex ] || '' );
          const series = String( row[ sIdx ] || '' );
          const value = parseFloat( String( row[ valueIndex ] || '0' ) );

          if ( !groupedByLabel[ label ] ) {
            groupedByLabel[ label ] = {};
          }

          if ( series ) {
            const key = `${ seriesKey }: ${ series }`;
            groupedByLabel[ label ][ key ] = isNaN( value ) ? 0 : value;
            uniqueSeries.add( key );
          }
        } );
      } );

      const pivotedData = Object.entries( groupedByLabel ).map( ( [ label, seriesValues ] ) => {
        return {
          [ labelKey ]: label,
          ...seriesValues,
        };
      } );

      return {
        chartData: pivotedData,
        valueKeys: Array.from( uniqueSeries ).sort(),
        categoryKeys: []
      };
    }

    // Standard Wide Format Handling
    if ( aggregationMode === 'none' ) {
      // No aggregation - use data as is
      const processedData = rows.map( ( row ) => {
        const item: Record<string, string | number> = {};
        item[ labelKey ] = String( row[ labelIndex ] || '' );

        valueIndices.forEach( ( idx, i ) => {
          const value = parseFloat( String( row[ idx ] || '0' ) );
          item[ standardValueKeys[ i ] ] = isNaN( value ) ? 0 : value;
        } );

        // Add category columns
        if ( categoryIndices ) {
          categoryIndices.forEach( ( idx, i ) => {
            item[ categoryKeys[ i ] ] = String( row[ idx ] || '' );
          } );
        }

        return item;
      } );
      return { chartData: processedData, valueKeys: standardValueKeys, categoryKeys };
    } else {
      // Aggregate data by label
      const aggregated: Record<string, Record<string, number[]>> = {};

      rows.forEach( ( row ) => {
        const label = String( row[ labelIndex ] || '' );
        if ( !aggregated[ label ] ) {
          aggregated[ label ] = {};
          standardValueKeys.forEach( ( key ) => {
            aggregated[ label ][ key ] = [];
          } );
        }

        valueIndices.forEach( ( idx, i ) => {
          const value = parseFloat( String( row[ idx ] ) );
          if ( !isNaN( value ) ) {
            aggregated[ label ][ standardValueKeys[ i ] ].push( value );
          }
        } );
      } );

      // Calculate aggregation
      const aggregatedData = Object.entries( aggregated ).map( ( [ label, values ] ) => {
        const item: Record<string, string | number> = {};
        item[ labelKey ] = label;

        standardValueKeys.forEach( ( key ) => {
          const nums = values[ key ];
          if ( nums.length === 0 ) {
            item[ key ] = 0;
          } else if ( aggregationMode === 'sum' ) {
            item[ key ] = nums.reduce( ( a, b ) => a + b, 0 );
          } else if ( aggregationMode === 'average' ) {
            item[ key ] = nums.reduce( ( a, b ) => a + b, 0 ) / nums.length;
          } else if ( aggregationMode === 'count' ) {
            item[ key ] = nums.length;
          }
        } );

        // Add category columns (take first value found for the label group)
        // Note: This assumes categories are consistent within a label group, which might not always be true but is a reasonable default for aggregation
        if ( categoryIndices ) {
          // Find a row that matches this label to get category values
          // This is expensive, better to store it during aggregation
          // For now, let's just find the first row with this label
          const matchRow = rows.find( r => String( r[ labelIndex ] || '' ) === label );
          if ( matchRow ) {
            categoryIndices.forEach( ( idx, i ) => {
              item[ categoryKeys[ i ] ] = String( matchRow[ idx ] || '' );
            } );
          }
        }

        return item;
      } );
      return { chartData: aggregatedData, valueKeys: standardValueKeys, categoryKeys };
    }
  }, [ data, columnMapping, aggregationMode, isVisible ] );

  // If not visible, render nothing or a placeholder to keep the component mounted but lightweight
  if ( !isVisible ) {
    return <div className='w-full h-full' />;
  }

  if ( chartData.length === 0 ) {
    return (
      <div className='flex h-full items-center justify-center'>
        <p className='text-sm text-zinc-500'>
          No data to display. Please select columns to visualize.
        </p>
      </div>
    );
  }

  const headers = data[ 0 ];
  const labelKey = String( headers[ columnMapping.labels! ] || 'label' );

  // Get colors from selected palette
  const palette = getColorPalette( colorPalette );

  const chartProps = {
    data: chartData,
    labelKey,
    valueKeys,
    categoryKeys,
    width: previewDevice === 'mobile' ? mobileViewBoxWidth : desktopViewBoxWidth,
    height: previewDevice === 'mobile' ? mobileViewBoxHeight : desktopViewBoxHeight,
    colors: palette.colors,
    colorMode,
    isFloatingPreview,
    // Disable embedded legend since we now use a standalone legend component
    legendShow: false,
    // X Axis
    xAxisShow,
    xAxisTitle,
    xAxisName: xAxisShowLabel ? ( xAxisName || labelKey ) : undefined,
    xAxisShowGrid,
    xAxisShowDomain,
    xAxisDomainColor,
    xAxisTickCount,
    xAxisTickSize,
    xAxisTickPadding,
    xAxisLabelRotation,
    xAxisTickFormat,
    xAxisPosition,
    xAxisScaleType,
    xAxisMin,
    xAxisMax,
    xAxisTitleType,
    xAxisTitleWeight,
    xAxisTitleColor,
    xAxisTitleSize,
    xAxisTitlePadding,
    xAxisTitleAlignment,
    xAxisTitleArrow,
    xAxisTickPosition,
    xAxisLabelWeight,
    xAxisLabelColor,
    xAxisLabelSize,
    xAxisLabelSpacing,
    xAxisGridColor,
    xAxisGridWidth,
    xAxisGridOpacity,
    xAxisGridDashArray,



    // Line settings
    curveType,
    lineWidth,
    lineStyle,

    // Point settings
    showPoints,
    pointSize,
    pointShape,
    pointColor,
    pointOutlineWidth,
    pointOutlineColor,

    // Area settings
    showArea,
    areaOpacity,

    // Label settings (for charts like Sunburst)
    labelShow,
    labelFontSize,
    labelColor,
    labelFontWeight,
    labelPadding: labelPadding,

    // Diverging Bar Chart settings
    sortBy: divergingBarSortBy,
    labelPosition: divergingBarLabelPosition,
    useGradientColors: divergingBarUseGradientColors,
    positiveColor: divergingBarPositiveColor,
    negativeColor: divergingBarNegativeColor,
    showLabels: labelShow,

    // Treemap settings
    treemapGradientSteepness,
    treemapCategoryLabelColor,
    treemapStrokeWidth,
    treemapStrokeColor,

    // Y Axis Config
    yAxis: {
      show: yAxisShow,
      position: yAxisPosition,
      scaleType: yAxisScaleType,
      min: yAxisMin,
      max: yAxisMax,
      flip: yAxisFlip,
      configureDefaultMinMax: yAxisConfigureDefaultMinMax,
      roundMin: yAxisRoundMin,
      roundMax: yAxisRoundMax,
      title: yAxisTitle,
      name: yAxisShowLabel ? ( yAxisName || ( valueKeys.length > 0 ? valueKeys[ 0 ] : '' ) ) : undefined,
      titleType: yAxisTitleType,
      titlePosition: yAxisTitlePosition,
      titleWeight: yAxisTitleWeight,
      titleColor: yAxisTitleColor,
      titleSize: yAxisTitleSize,
      titlePadding: yAxisTitlePadding,
      titleAlignment: yAxisTitleAlignment,
      titleArrow: yAxisTitleArrow,
      tickPosition: yAxisTickPosition,
      labelSize: yAxisLabelSize,
      labelWeight: yAxisLabelWeight,
      labelColor: yAxisLabelColor,
      labelPadding: yAxisLabelPadding,
      labelAngle: yAxisLabelAngle,
      labelMaxLines: yAxisLabelMaxLines,
      labelLineHeight: yAxisLabelLineHeight,
      labelSpacing: yAxisLabelSpacing,
      labelRotation: yAxisLabelRotation,
      tickMode: yAxisTickMode,
      tickNumber: yAxisTickNumber,
      oneTickLabelPerLine: yAxisOneTickLabelPerLine,
      tickCount: yAxisTickCount,
      tickSize: yAxisTickSize,
      tickPadding: yAxisTickPadding,
      tickFormat: yAxisTickFormat,
      tickLength: yAxisTickLength,
      showGrid: yAxisShowGrid,
      showDomain: yAxisShowDomain,
      domainColor: yAxisDomainColor,
      showAxisLine: yAxisShowAxisLine,
      gridColor: yAxisGridColor,
      gridStyle: yAxisGridStyle,
      gridWidth: yAxisGridWidth,
      gridDash: yAxisGridDash,
      gridSpace: yAxisGridSpace,
      gridExtend: yAxisGridExtend,
      gridOpacity: yAxisGridOpacity,
      gridDashArray: yAxisGridDashArray,
      lineColor: yAxisLineColor,
      lineWidth: yAxisLineWidth,
      edgePadding: yAxisEdgePadding,
    },
  };

  // Get chart registration from registry
  const chartRegistration = getChart( chartType );

  // Render chart component dynamically from registry
  const renderChart = () => {
    if ( !chartRegistration ) {
      return (
        <div className='flex h-full items-center justify-center'>
          <p className='text-sm text-zinc-500'>
            Chart type &ldquo;{ chartType }&rdquo; is not registered or not yet implemented.
          </p>
        </div>
      );
    }

    // Check if chart is coming soon
    if ( chartRegistration.status === 'coming-soon' ) {
      return (
        <div className='flex h-full items-center justify-center flex-col gap-2'>
          <p className='text-sm font-medium text-zinc-700'>{ chartRegistration.name }</p>
          <p className='text-xs text-zinc-500'>Coming soon</p>
        </div>
      );
    }

    const ChartComponent = chartRegistration.component;
    return <ChartComponent { ...chartProps } />;
  };

  return (
    <ChartTransition chartType={ chartType } transitionType='fade' duration={ 300 }>
      <div className='w-full h-full'>
        { renderChart() }
      </div>
    </ChartTransition>
  );
} );
