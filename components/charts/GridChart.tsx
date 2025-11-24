'use client';

import { useMemo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { getChart } from '@/lib/chartRegistry';
import { getColorPalette } from '@/lib/colorPalettes';

export function GridChart( { isVisible = true }: { isVisible?: boolean; } ) {
  const data = useChartStore( ( state ) => state.data );
  const columnMapping = useChartStore( ( state ) => state.columnMapping );
  const chartType = useChartStore( ( state ) => state.chartType );
  const gridSplitBy = useChartStore( ( state ) => state.gridSplitBy );
  const gridColumns = useChartStore( ( state ) => state.gridColumns );
  const gridAspectRatio = useChartStore( ( state ) => state.gridAspectRatio );
  const desktopViewBoxWidth = useChartStore( ( state ) => state.desktopViewBoxWidth );
  const desktopViewBoxHeight = useChartStore( ( state ) => state.desktopViewBoxHeight );
  const mobileViewBoxWidth = useChartStore( ( state ) => state.mobileViewBoxWidth );
  const mobileViewBoxHeight = useChartStore( ( state ) => state.mobileViewBoxHeight );
  const previewDevice = useChartStore( ( state ) => state.previewDevice );

  // Get all chart settings from store (matching BasicChart)
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
  const xAxisTitleType = useChartStore( ( state ) => state.xAxisTitleType );
  const xAxisTitleWeight = useChartStore( ( state ) => state.xAxisTitleWeight );
  const xAxisTitleColor = useChartStore( ( state ) => state.xAxisTitleColor );
  const xAxisTitleSize = useChartStore( ( state ) => state.xAxisTitleSize );
  const xAxisTitlePadding = useChartStore( ( state ) => state.xAxisTitlePadding );
  const xAxisTickPosition = useChartStore( ( state ) => state.xAxisTickPosition );
  const xAxisLabelWeight = useChartStore( ( state ) => state.xAxisLabelWeight );
  const xAxisLabelColor = useChartStore( ( state ) => state.xAxisLabelColor );
  const xAxisLabelSize = useChartStore( ( state ) => state.xAxisLabelSize );
  const xAxisLabelSpacing = useChartStore( ( state ) => state.xAxisLabelSpacing );
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
  const yAxisScaleType = useChartStore( ( state ) => state.yAxisScaleType );
  const yAxisFlip = useChartStore( ( state ) => state.yAxisFlip );
  const yAxisConfigureDefaultMinMax = useChartStore( ( state ) => state.yAxisConfigureDefaultMinMax );
  const yAxisRoundMin = useChartStore( ( state ) => state.yAxisRoundMin );
  const yAxisRoundMax = useChartStore( ( state ) => state.yAxisRoundMax );
  const yAxisTitleType = useChartStore( ( state ) => state.yAxisTitleType );
  const yAxisTitlePosition = useChartStore( ( state ) => state.yAxisTitlePosition );
  const yAxisTitleWeight = useChartStore( ( state ) => state.yAxisTitleWeight );
  const yAxisTitleColor = useChartStore( ( state ) => state.yAxisTitleColor );
  const yAxisTitleSize = useChartStore( ( state ) => state.yAxisTitleSize );
  const yAxisTitlePadding = useChartStore( ( state ) => state.yAxisTitlePadding );
  const yAxisTickPosition = useChartStore( ( state ) => state.yAxisTickPosition );
  const yAxisLabelSize = useChartStore( ( state ) => state.yAxisLabelSize );
  const yAxisLabelColor = useChartStore( ( state ) => state.yAxisLabelColor );
  const yAxisLabelPadding = useChartStore( ( state ) => state.yAxisLabelPadding );
  const yAxisLabelAngle = useChartStore( ( state ) => state.yAxisLabelAngle );
  const yAxisLabelWeight = useChartStore( ( state ) => state.yAxisLabelWeight );
  const yAxisLabelMaxLines = useChartStore( ( state ) => state.yAxisLabelMaxLines );
  const yAxisLabelLineHeight = useChartStore( ( state ) => state.yAxisLabelLineHeight );
  const yAxisLabelSpacing = useChartStore( ( state ) => state.yAxisLabelSpacing );
  const yAxisTickMode = useChartStore( ( state ) => state.yAxisTickMode );
  const yAxisTickNumber = useChartStore( ( state ) => state.yAxisTickNumber );
  const yAxisOneTickLabelPerLine = useChartStore( ( state ) => state.yAxisOneTickLabelPerLine );
  const yAxisGridColor = useChartStore( ( state ) => state.yAxisGridColor );
  const yAxisGridStyle = useChartStore( ( state ) => state.yAxisGridStyle );
  const yAxisGridWidth = useChartStore( ( state ) => state.yAxisGridWidth );
  const yAxisGridDash = useChartStore( ( state ) => state.yAxisGridDash );
  const yAxisGridSpace = useChartStore( ( state ) => state.yAxisGridSpace );
  const yAxisGridExtend = useChartStore( ( state ) => state.yAxisGridExtend );
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

  // Label settings
  const labelShow = useChartStore( ( state ) => state.labelShow );
  const labelFontSize = useChartStore( ( state ) => state.labelFontSize );
  const labelColor = useChartStore( ( state ) => state.labelColor );
  const labelFontWeight = useChartStore( ( state ) => state.labelFontWeight );

  // Split data into groups
  const chartGroups = useMemo( (): Array<{
    title: string;
    data: Array<Record<string, string | number>>;
    labelKey: string;
    valueKeys: string[];
    colorIndex?: number;
  }> => {
    if ( !data || data.length < 2 || !isVisible ) return [];
    if ( columnMapping.labels === null || columnMapping.values.length === 0 ) return [];

    const headers = data[ 0 ];
    const rows = data.slice( 1 );
    const labelIndex = columnMapping.labels;
    const valueIndices = columnMapping.values;

    const labelKey = String( headers[ labelIndex ] || 'label' );
    const valueKeys = valueIndices.map( ( idx ) => String( headers[ idx ] || `value${ idx }` ) );

    if ( gridSplitBy === 'label' ) {
      // Group by unique label values
      const groups = new Map<string, Array<Record<string, string | number>>>();

      rows.forEach( ( row ) => {
        const label = String( row[ labelIndex ] || '' );
        if ( !groups.has( label ) ) {
          groups.set( label, [] );
        }

        const item: Record<string, string | number> = {};
        item[ labelKey ] = label;
        valueIndices.forEach( ( idx, i ) => {
          const value = parseFloat( String( row[ idx ] || '0' ) );
          item[ valueKeys[ i ] ] = isNaN( value ) ? 0 : value;
        } );

        groups.get( label )!.push( item );
      } );

      return Array.from( groups.entries() ).map( ( [ category, categoryData ] ) => ( {
        title: category,
        data: categoryData,
        labelKey,
        valueKeys,
      } ) );
    } else {
      // Split by value columns
      return valueKeys.map( ( valueKey, colorIndex ) => {
        const categoryData = rows.map( ( row ) => {
          const item: Record<string, string | number> = {};
          item[ labelKey ] = String( row[ labelIndex ] || '' );
          const value = parseFloat( String( row[ valueIndices[ valueKeys.indexOf( valueKey ) ] ] || '0' ) );
          item[ valueKey ] = isNaN( value ) ? 0 : value;
          return item;
        } );

        return {
          title: valueKey,
          data: categoryData,
          labelKey,
          valueKeys: [ valueKey ],
          colorIndex, // Track which color this chart should use
        };
      } );
    }
  }, [ data, columnMapping, gridSplitBy, isVisible ] );

  // Calculate grid layout
  const aspectRatioValue = useMemo( () => {
    const ratios: Record<string, number> = {
      '16/9': 16 / 9,
      '4/3': 4 / 3,
      '1/1': 1,
      '21/9': 21 / 9,
      '3/2': 3 / 2,
      '2/1': 2 / 1,
    };
    return ratios[ gridAspectRatio ] || 16 / 9;
  }, [ gridAspectRatio ] );

  // Get chart component
  const chartRegistration = getChart( chartType );
  if ( !chartRegistration || chartGroups.length === 0 ) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-zinc-500">No data to display in grid mode</p>
      </div>
    );
  }

  const ChartComponent = chartRegistration.component;

  // Get colors from palette
  const palette = getColorPalette( colorPalette );

  // Map grid columns to Tailwind classes
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  }[ gridColumns ] || 'grid-cols-2';



  // Create yAxis config object (matching BasicChart)
  const yAxis = {
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
    labelColor: yAxisLabelColor,
    labelPadding: yAxisLabelPadding,
    labelAngle: yAxisLabelAngle,
    labelWeight: yAxisLabelWeight,
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
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className={ `grid gap-4 ${ gridColsClass }` }>
        { chartGroups.map( ( group, index ) => (
          <div
            key={ index }
            className="flex flex-col border border-zinc-200 rounded-lg p-3 bg-white"
            style={ {
              aspectRatio: aspectRatioValue,
            } }
          >
            <h3 className="text-sm font-semibold text-zinc-700 mb-2 text-center">
              { group.title }
            </h3>
            <div className="flex-1 min-h-0 w-full responsive-chart-container">
              <ChartComponent
                data={ group.data }
                labelKey={ group.labelKey }
                valueKeys={ group.valueKeys }
                width={ previewDevice === 'mobile' ? mobileViewBoxWidth : desktopViewBoxWidth }
                height={ previewDevice === 'mobile' ? mobileViewBoxHeight : desktopViewBoxHeight }
                colors={ group.colorIndex !== undefined ? [ palette.colors[ group.colorIndex ] ] : palette.colors }
                colorMode={ colorMode }
                legendShow={ false }
                isFloatingPreview={ true }
                xAxisShow={ xAxisShow }
                xAxisTitle={ xAxisTitle }
                xAxisShowGrid={ xAxisShowGrid }
                xAxisShowDomain={ xAxisShowDomain }
                xAxisTickCount={ xAxisTickCount }
                xAxisTickSize={ xAxisTickSize }
                xAxisTickPadding={ xAxisTickPadding }
                xAxisLabelRotation={ xAxisLabelRotation }
                xAxisTickFormat={ xAxisTickFormat }
                xAxisPosition={ xAxisPosition }
                xAxisScaleType={ xAxisScaleType }
                xAxisMin={ xAxisMin }
                xAxisMax={ xAxisMax }
                xAxisTitleType={ xAxisTitleType }
                xAxisTitleWeight={ xAxisTitleWeight }
                xAxisTitleColor={ xAxisTitleColor }
                xAxisTitleSize={ xAxisTitleSize }
                xAxisTitlePadding={ xAxisTitlePadding }
                xAxisTickPosition={ xAxisTickPosition }
                xAxisLabelWeight={ xAxisLabelWeight }
                xAxisLabelColor={ xAxisLabelColor }
                xAxisLabelSize={ xAxisLabelSize }
                xAxisLabelSpacing={ xAxisLabelSpacing }
                xAxisGridColor={ xAxisGridColor }
                xAxisGridWidth={ xAxisGridWidth }
                xAxisGridOpacity={ xAxisGridOpacity }
                xAxisGridDashArray={ xAxisGridDashArray }
                yAxis={ yAxis }
                curveType={ curveType }
                lineWidth={ lineWidth }
                lineStyle={ lineStyle }
                showPoints={ showPoints }
                pointSize={ pointSize }
                pointShape={ pointShape }
                pointColor={ pointColor }
                pointOutlineWidth={ pointOutlineWidth }
                pointOutlineColor={ pointOutlineColor }
                showArea={ showArea }
                areaOpacity={ areaOpacity }
                labelShow={ labelShow }
                labelFontSize={ labelFontSize }
                labelColor={ labelColor }
                labelFontWeight={ labelFontWeight }
              />
            </div>
          </div>
        ) ) }
      </div>
    </div>
  );
}
