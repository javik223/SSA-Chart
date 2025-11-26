'use client';

import React, { useEffect, useState } from 'react';
import { MultiLineChart } from '@/components/charts/MultiLineChart';
import { DEFAULT_Y_AXIS_CONFIG } from '@/types/chart-types';
import Papa from 'papaparse';

export default function MultiLineTestPage() {
  const [ data, setData ] = useState<any[]>( [] );
  const [ valueKeys, setValueKeys ] = useState<string[]>( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    async function loadData() {
      try {
        const response = await fetch( '/unemployment.csv' );
        const csvText = await response.text();

        Papa.parse( csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: ( results ) => {
            const rawData = results.data as any[];

            // Pivot data: We need one row per date, with columns for each division
            const pivotedData: Record<string, any> = {};
            const divisions = new Set<string>();

            rawData.forEach( row => {
              const date = row.date;
              const division = row.division;
              const value = row.unemployment;

              if ( !date || !division ) return;

              if ( !pivotedData[ date ] ) {
                pivotedData[ date ] = { date };
              }

              pivotedData[ date ][ division ] = value;
              divisions.add( division );
            } );

            const finalData = Object.values( pivotedData ).sort( ( a, b ) =>
              new Date( a.date ).getTime() - new Date( b.date ).getTime()
            );

            setData( finalData );
            setValueKeys( Array.from( divisions ) );
            setLoading( false );
          }
        } );
      } catch ( error ) {
        console.error( 'Error loading data:', error );
        setLoading( false );
      }
    }

    loadData();
  }, [] );

  if ( loading ) return <div className="p-8">Loading data...</div>;

  return (
    <div className="p-8 h-screen flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Unemployment by Metro Division</h1>
      <div className="flex-1 border rounded-lg p-4 shadow-sm bg-white">
        <MultiLineChart
          data={ data }
          labelKey="date"
          valueKeys={ valueKeys }
          xAxisScaleType="time"
          xAxisTitle=""
          xAxisTickFormat="%Y"
          legendShow={ false } // Hide legend as requested by visual style (too many series)
          yAxis={ {
            ...DEFAULT_Y_AXIS_CONFIG,
            ...{
              show: true,
              position: 'left',
              scaleType: 'linear',
              min: 0,
              max: null,
              flip: false,
              configureDefaultMinMax: true,
              roundMin: false,
              roundMax: false,
              title: 'Unemployment (%)',
              titleType: 'custom',
              titlePosition: 'top-bottom', // Position title at top
              titleWeight: 'regular',
              titleColor: '#000',
              titleSize: 10,
              titlePadding: 10,
              tickPosition: 'outside',
              labelSize: 10,
              labelWeight: 'regular',
              labelColor: '#000',
              labelPadding: 8,
              labelAngle: 0,
              labelMaxLines: 1,
              labelLineHeight: 1.2,
              labelSpacing: 4,
              tickMode: 'auto',
              tickNumber: 5,
              oneTickLabelPerLine: false,
              tickCount: 5,
              tickSize: 6,
              tickPadding: 8,
              tickFormat: '',
              tickLength: 6,
              showGrid: true,
              showDomain: false, // Hide Y axis line
              showAxisLine: false,
              gridColor: '#e5e7eb',
              gridStyle: 'solid',
              gridWidth: 1,
              gridDash: 0,
              gridSpace: 0,
              gridExtend: true, // Extend grid lines
              lineColor: '#666666',
              lineWidth: 1,
              edgePadding: 0,
            }
          } }
          xAxisShowDomain={ true }
          xAxisTickSize={ 6 }
          colors={ [ 'steelblue' ] } // All lines blue
        />
      </div>
    </div>
  );
}
