'use client';

import { useMemo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { useShallow } from 'zustand/react/shallow';
import { getChart } from '@/lib/chartRegistry';
import { getColorPalette } from '@/lib/colorPalettes';

export function GridChart( { isVisible = true }: { isVisible?: boolean; } ) {
  const {
    data,
    columnMapping,
    chartType,
    gridSplitBy,
    gridColumns,
    gridColumnsMobile,
    gridAspectRatio,
    desktopViewBoxWidth,
    desktopViewBoxHeight,
    mobileViewBoxWidth,
    mobileViewBoxHeight,
    previewDevice,
    colorPalette,
    colorMode,
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
    yAxisShow,
    yAxisTitle,
    yAxisShowGrid,
    yAxisShowDomain,
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
    yAxisTickPosition,
    yAxisLabelSize,
    yAxisLabelColor,
    yAxisLabelPadding,
    yAxisLabelAngle,
    yAxisLabelRotation,
    yAxisLabelWeight,
    yAxisLabelMaxLines,
    yAxisLabelLineHeight,
    yAxisLabelSpacing,
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
    yAxisTitleAlignment,
    yAxisTitleArrow,
    yAxisDomainColor,
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
  } = useChartStore( useShallow( ( state ) => ( {
    data: state.data,
    columnMapping: state.columnMapping,
    chartType: state.chartType,
    gridSplitBy: state.gridSplitBy,
    gridColumns: state.gridColumns,
    gridColumnsMobile: state.gridColumnsMobile,
    gridAspectRatio: state.gridAspectRatio,
    desktopViewBoxWidth: state.desktopViewBoxWidth,
    desktopViewBoxHeight: state.desktopViewBoxHeight,
    mobileViewBoxWidth: state.mobileViewBoxWidth,
    mobileViewBoxHeight: state.mobileViewBoxHeight,
    previewDevice: state.previewDevice,
    colorPalette: state.colorPalette,
    colorMode: state.colorMode,
    xAxisShow: state.xAxisShow,
    xAxisTitle: state.xAxisTitle,
    xAxisShowGrid: state.xAxisShowGrid,
    xAxisShowDomain: state.xAxisShowDomain,
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
    yAxisShowGrid: state.yAxisShowGrid,
    yAxisShowDomain: state.yAxisShowDomain,
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
    yAxisTickPosition: state.yAxisTickPosition,
    yAxisLabelSize: state.yAxisLabelSize,
    yAxisLabelColor: state.yAxisLabelColor,
    yAxisLabelPadding: state.yAxisLabelPadding,
    yAxisLabelAngle: state.yAxisLabelAngle,
    yAxisLabelRotation: state.yAxisLabelRotation,
    yAxisLabelWeight: state.yAxisLabelWeight,
    yAxisLabelMaxLines: state.yAxisLabelMaxLines,
    yAxisLabelLineHeight: state.yAxisLabelLineHeight,
    yAxisLabelSpacing: state.yAxisLabelSpacing,
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
    yAxisTitleAlignment: state.yAxisTitleAlignment,
    yAxisTitleArrow: state.yAxisTitleArrow,
    yAxisDomainColor: state.yAxisDomainColor,
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
  } ) ) );

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

  // Map grid columns to Tailwind classes with mobile support
  const getMobileClass = ( cols: number ) => {
    return `grid-cols-${ cols }`;
  };

  const getDesktopClass = ( cols: number ) => {
    if ( cols === 1 ) return 'md:grid-cols-1';
    if ( cols === 2 ) return 'md:grid-cols-2';
    if ( cols === 3 ) return 'md:grid-cols-2 lg:grid-cols-3';
    if ( cols === 4 ) return 'md:grid-cols-2 lg:grid-cols-4';
    if ( cols === 5 ) return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
    if ( cols === 6 ) return 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
    return 'md:grid-cols-2';
  };

  const gridColsClass = `${ getMobileClass( gridColumnsMobile ) } ${ getDesktopClass( gridColumns ) }`;



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
    titleAlignment: yAxisTitleAlignment,
    titleArrow: yAxisTitleArrow,
    tickPosition: yAxisTickPosition,
    labelSize: yAxisLabelSize,
    labelColor: yAxisLabelColor,
    labelPadding: yAxisLabelPadding,
    labelAngle: yAxisLabelAngle,
    labelRotation: yAxisLabelRotation,
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
    domainColor: yAxisDomainColor,
    name: undefined, // GridChart doesn't use axis labels
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
