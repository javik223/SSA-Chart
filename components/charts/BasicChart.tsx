'use client';

import { useMemo, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { getChart } from '@/lib/chartRegistry';
import { ChartTransition } from './ChartTransition';
import { getColorPalette } from '@/lib/colorPalettes';

export const BasicChart = memo( function BasicChart( { isVisible = true, isFloatingPreview = false }: { isVisible?: boolean; isFloatingPreview?: boolean; } ) {
  // Use selective subscription to only re-render when chart-related data changes
  // This prevents re-renders when title, description, footer, or legend settings change
  const data = useChartStore( ( state ) => state.data );
  const columnMapping = useChartStore( ( state ) => state.columnMapping );
  const chartType = useChartStore( ( state ) => state.chartType );
  const aggregationMode = useChartStore( ( state ) => state.aggregationMode );
  const previewWidth = useChartStore( ( state ) => state.previewWidth );
  const previewHeight = useChartStore( ( state ) => state.previewHeight );
  const desktopViewBoxWidth = useChartStore( ( state ) => state.desktopViewBoxWidth );
  const desktopViewBoxHeight = useChartStore( ( state ) => state.desktopViewBoxHeight );
  const mobileViewBoxWidth = useChartStore( ( state ) => state.mobileViewBoxWidth );
  const mobileViewBoxHeight = useChartStore( ( state ) => state.mobileViewBoxHeight );
  const previewDevice = useChartStore( ( state ) => state.previewDevice );
  const colorPalette = useChartStore( ( state ) => state.colorPalette );
  const colorMode = useChartStore( ( state ) => state.colorMode );

  // X Axis settings
  const xAxisShow = useChartStore( ( state ) => state.xAxisShow );
  const xAxisTitle = useChartStore( ( state ) => state.xAxisTitle );
  const xAxisShowGrid = useChartStore( ( state ) => state.xAxisShowGrid );
  const xAxisShowDomain = useChartStore( ( state ) => state.xAxisShowDomain );
  const xAxisTickCount = useChartStore( ( state ) => state.xAxisTickCount );
  const xAxisTickSize = useChartStore( ( state ) => state.xAxisTickSize );
  const xAxisTickPadding = useChartStore( ( state ) => state.xAxisTickPadding );
  const xAxisLabelRotation = useChartStore( ( state ) => state.xAxisLabelRotation );
  const xAxisTickFormat = useChartStore( ( state ) => state.xAxisTickFormat );
  const xAxisPosition = useChartStore( ( state ) => state.xAxisPosition );
  const xAxisScaleType = useChartStore( ( state ) => state.xAxisScaleType );
  const xAxisMin = useChartStore( ( state ) => state.xAxisMin );
  const xAxisMax = useChartStore( ( state ) => state.xAxisMax );

  // X Axis Title Styling
  const xAxisTitleType = useChartStore( ( state ) => state.xAxisTitleType );
  const xAxisTitleWeight = useChartStore( ( state ) => state.xAxisTitleWeight );
  const xAxisTitleColor = useChartStore( ( state ) => state.xAxisTitleColor );
  const xAxisTitleSize = useChartStore( ( state ) => state.xAxisTitleSize );
  const xAxisTitlePadding = useChartStore( ( state ) => state.xAxisTitlePadding );

  // X Axis Tick & Label Styling
  const xAxisTickPosition = useChartStore( ( state ) => state.xAxisTickPosition );
  const xAxisLabelWeight = useChartStore( ( state ) => state.xAxisLabelWeight );
  const xAxisLabelColor = useChartStore( ( state ) => state.xAxisLabelColor );
  const xAxisLabelSize = useChartStore( ( state ) => state.xAxisLabelSize );
  const xAxisLabelSpacing = useChartStore( ( state ) => state.xAxisLabelSpacing );

  // X Axis Gridline Styling
  const xAxisGridColor = useChartStore( ( state ) => state.xAxisGridColor );
  const xAxisGridWidth = useChartStore( ( state ) => state.xAxisGridWidth );
  const xAxisGridOpacity = useChartStore( ( state ) => state.xAxisGridOpacity );
  const xAxisGridDashArray = useChartStore( ( state ) => state.xAxisGridDashArray );

  // Y Axis settings
  const yAxisShow = useChartStore( ( state ) => state.yAxisShow );
  const yAxisTitle = useChartStore( ( state ) => state.yAxisTitle );
  const yAxisShowGrid = useChartStore( ( state ) => state.yAxisShowGrid );
  const yAxisShowDomain = useChartStore( ( state ) => state.yAxisShowDomain );
  const yAxisTickCount = useChartStore( ( state ) => state.yAxisTickCount );
  const yAxisTickSize = useChartStore( ( state ) => state.yAxisTickSize );
  const yAxisTickPadding = useChartStore( ( state ) => state.yAxisTickPadding );
  const yAxisTickFormat = useChartStore( ( state ) => state.yAxisTickFormat );
  const yAxisMin = useChartStore( ( state ) => state.yAxisMin );
  const yAxisMax = useChartStore( ( state ) => state.yAxisMax );
  const yAxisPosition = useChartStore( ( state ) => state.yAxisPosition );

  // Y Axis Scale & Flip
  const yAxisScaleType = useChartStore( ( state ) => state.yAxisScaleType );
  const yAxisFlip = useChartStore( ( state ) => state.yAxisFlip );
  const yAxisConfigureDefaultMinMax = useChartStore( ( state ) => state.yAxisConfigureDefaultMinMax );
  const yAxisRoundMin = useChartStore( ( state ) => state.yAxisRoundMin );
  const yAxisRoundMax = useChartStore( ( state ) => state.yAxisRoundMax );

  // Y Axis Title Styling
  const yAxisTitleType = useChartStore( ( state ) => state.yAxisTitleType );
  const yAxisTitlePosition = useChartStore( ( state ) => state.yAxisTitlePosition );
  const yAxisTitleWeight = useChartStore( ( state ) => state.yAxisTitleWeight );
  const yAxisTitleColor = useChartStore( ( state ) => state.yAxisTitleColor );
  const yAxisTitleSize = useChartStore( ( state ) => state.yAxisTitleSize );
  const yAxisTitlePadding = useChartStore( ( state ) => state.yAxisTitlePadding );

  // Y Axis Tick & Label Styling
  const yAxisTickPosition = useChartStore( ( state ) => state.yAxisTickPosition );
  const yAxisLabelSize = useChartStore( ( state ) => state.yAxisLabelSize );
  const yAxisLabelColor = useChartStore( ( state ) => state.yAxisLabelColor );
  const yAxisLabelPadding = useChartStore( ( state ) => state.yAxisLabelPadding );
  const yAxisLabelAngle = useChartStore( ( state ) => state.yAxisLabelAngle );
  const yAxisLabelWeight = useChartStore( ( state ) => state.yAxisLabelWeight );
  const yAxisLabelMaxLines = useChartStore( ( state ) => state.yAxisLabelMaxLines );
  const yAxisLabelLineHeight = useChartStore( ( state ) => state.yAxisLabelLineHeight );
  const yAxisLabelSpacing = useChartStore( ( state ) => state.yAxisLabelSpacing );

  // Y Axis Tick Display
  const yAxisTickMode = useChartStore( ( state ) => state.yAxisTickMode );
  const yAxisTickNumber = useChartStore( ( state ) => state.yAxisTickNumber );
  const yAxisOneTickLabelPerLine = useChartStore( ( state ) => state.yAxisOneTickLabelPerLine );

  // Y Axis Gridline Styling
  const yAxisGridColor = useChartStore( ( state ) => state.yAxisGridColor );
  const yAxisGridStyle = useChartStore( ( state ) => state.yAxisGridStyle );
  const yAxisGridWidth = useChartStore( ( state ) => state.yAxisGridWidth );
  const yAxisGridDash = useChartStore( ( state ) => state.yAxisGridDash );
  const yAxisGridSpace = useChartStore( ( state ) => state.yAxisGridSpace );
  const yAxisGridExtend = useChartStore( ( state ) => state.yAxisGridExtend );

  // Y Axis Line & Tick Marks
  const yAxisLineColor = useChartStore( ( state ) => state.yAxisLineColor );
  const yAxisLineWidth = useChartStore( ( state ) => state.yAxisLineWidth );
  const yAxisTickLength = useChartStore( ( state ) => state.yAxisTickLength );
  const yAxisShowAxisLine = useChartStore( ( state ) => state.yAxisShowAxisLine );
  const yAxisEdgePadding = useChartStore( ( state ) => state.yAxisEdgePadding );

  // Line settings
  const curveType = useChartStore( ( state ) => state.curveType );
  const lineWidth = useChartStore( ( state ) => state.lineWidth );
  const lineStyle = useChartStore( ( state ) => state.lineStyle );

  // Point settings
  const showPoints = useChartStore( ( state ) => state.showPoints );
  const pointSize = useChartStore( ( state ) => state.pointSize );
  const pointShape = useChartStore( ( state ) => state.pointShape );
  const pointColor = useChartStore( ( state ) => state.pointColor );
  const pointOutlineWidth = useChartStore( ( state ) => state.pointOutlineWidth );
  const pointOutlineColor = useChartStore( ( state ) => state.pointOutlineColor );

  // Area settings
  const showArea = useChartStore( ( state ) => state.showArea );
  const areaOpacity = useChartStore( ( state ) => state.areaOpacity );

  // Label settings (for charts like Sunburst)
  const labelShow = useChartStore( ( state ) => state.labelShow );
  const labelFontSize = useChartStore( ( state ) => state.labelFontSize );
  const labelColor = useChartStore( ( state ) => state.labelColor );
  const labelFontWeight = useChartStore( ( state ) => state.labelFontWeight );

  // Transform data for chart
  const chartData = useMemo( () => {
    // Skip calculation if not visible
    if ( !isVisible ) return [];

    if ( !data || data.length < 2 ) return [];
    if ( columnMapping.labels === null || columnMapping.values.length === 0 ) {
      return [];
    }

    const headers = data[ 0 ];
    const labelIndex = columnMapping.labels;
    const valueIndices = columnMapping.values;

    // Get label column name
    const labelKey = String( headers[ labelIndex ] || 'label' );

    // Get value column names
    const valueKeys = valueIndices.map( ( idx ) => String( headers[ idx ] || `value${ idx }` ) );

    // Transform data rows
    const rows = data.slice( 1 );

    if ( aggregationMode === 'none' ) {
      // No aggregation - use data as is
      return rows.map( ( row ) => {
        const item: Record<string, string | number> = {};
        item[ labelKey ] = String( row[ labelIndex ] || '' );

        valueIndices.forEach( ( idx, i ) => {
          const value = parseFloat( String( row[ idx ] || '0' ) );
          item[ valueKeys[ i ] ] = isNaN( value ) ? 0 : value;
        } );

        return item;
      } );
    } else {
      // Aggregate data by label
      const aggregated: Record<string, Record<string, number[]>> = {};

      rows.forEach( ( row ) => {
        const label = String( row[ labelIndex ] || '' );
        if ( !aggregated[ label ] ) {
          aggregated[ label ] = {};
          valueKeys.forEach( ( key ) => {
            aggregated[ label ][ key ] = [];
          } );
        }

        valueIndices.forEach( ( idx, i ) => {
          const value = parseFloat( String( row[ idx ] ) );
          if ( !isNaN( value ) ) {
            aggregated[ label ][ valueKeys[ i ] ].push( value );
          }
        } );
      } );

      // Calculate aggregation
      return Object.entries( aggregated ).map( ( [ label, values ] ) => {
        const item: Record<string, string | number> = {};
        item[ labelKey ] = label;

        valueKeys.forEach( ( key ) => {
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

        return item;
      } );
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
  const valueKeys = columnMapping.values.map( ( idx ) => String( headers[ idx ] || `value${ idx }` ) );

  // Get colors from selected palette
  const palette = getColorPalette( colorPalette );

  const chartProps = {
    data: chartData,
    labelKey,
    valueKeys,
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
    xAxisShowGrid,
    xAxisShowDomain,
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
      titleType: yAxisTitleType,
      titlePosition: yAxisTitlePosition,
      titleWeight: yAxisTitleWeight,
      titleColor: yAxisTitleColor,
      titleSize: yAxisTitleSize,
      titlePadding: yAxisTitlePadding,
      tickPosition: yAxisTickPosition,
      labelSize: yAxisLabelSize,
      labelWeight: yAxisLabelWeight,
      labelColor: yAxisLabelColor,
      labelPadding: yAxisLabelPadding,
      labelAngle: yAxisLabelAngle,
      labelMaxLines: yAxisLabelMaxLines,
      labelLineHeight: yAxisLabelLineHeight,
      labelSpacing: yAxisLabelSpacing,
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
      showAxisLine: yAxisShowAxisLine,
      gridColor: yAxisGridColor,
      gridStyle: yAxisGridStyle,
      gridWidth: yAxisGridWidth,
      gridDash: yAxisGridDash,
      gridSpace: yAxisGridSpace,
      gridExtend: yAxisGridExtend,
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
