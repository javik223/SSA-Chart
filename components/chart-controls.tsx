'use client';

import { useChartStore } from '@/store/useChartStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ChartControls() {
  const chartType = useChartStore( ( state ) => state.chartType );
  const showOnChartControls = useChartStore( ( state ) => state.showOnChartControls );

  // Diverging Bar Controls
  const divergingBarSortBy = useChartStore( ( state ) => state.divergingBarSortBy );
  const setDivergingBarSortBy = useChartStore( ( state ) => state.setDivergingBarSortBy );

  // Treemap Controls
  const treemapColorMode = useChartStore( ( state ) => state.treemapColorMode );
  const setTreemapColorMode = useChartStore( ( state ) => state.setTreemapColorMode );

  const treemapTileMethod = useChartStore( ( state ) => state.treemapTileMethod );
  const setTreemapTileMethod = useChartStore( ( state ) => state.setTreemapTileMethod );

  const treemapCategoryLevel = useChartStore( ( state ) => state.treemapCategoryLevel );
  const setTreemapCategoryLevel = useChartStore( ( state ) => state.setTreemapCategoryLevel );

  const data = useChartStore( ( state ) => state.data );

  if ( !showOnChartControls ) return null;

  // Only show controls relevant to the current chart type
  if ( chartType === 'diverging-bar' ) {
    return (
      <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-md">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium whitespace-nowrap">Sort By:</Label>
          <Select value={ divergingBarSortBy } onValueChange={ setDivergingBarSortBy as any }>
            <SelectTrigger className="h-7 text-xs w-[180px]">
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Original)</SelectItem>
              <SelectItem value="ascending">Ascending (Low to High)</SelectItem>
              <SelectItem value="descending">Descending (High to Low)</SelectItem>
              <SelectItem value="value">By Value</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if ( chartType === 'treemap' ) {
    return (
      <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-md">
        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium whitespace-nowrap">Tiling:</Label>
          <Select value={ treemapTileMethod } onValueChange={ setTreemapTileMethod as any }>
            <SelectTrigger className="h-7 text-xs w-[120px]">
              <SelectValue placeholder="Select tiling" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="binary">Binary</SelectItem>
              <SelectItem value="squarify">Squarify</SelectItem>
              <SelectItem value="resquarify">Resquarify</SelectItem>
              <SelectItem value="slice">Slice</SelectItem>
              <SelectItem value="dice">Dice</SelectItem>
              <SelectItem value="slice-dice">Slice-Dice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs font-medium whitespace-nowrap">Color:</Label>
          <Select value={ treemapColorMode } onValueChange={ setTreemapColorMode as any }>
            <SelectTrigger className="h-7 text-xs w-[120px]">
              <SelectValue placeholder="Select color mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="depth">By Depth</SelectItem>
              <SelectItem value="value">By Value</SelectItem>
              <SelectItem value="category">By Category</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level Selection Control */ }
        { ( () => {
          // Calculate available levels based on data
          if ( !data || data.length === 0 ) return null;

          // Check for path key (path or id)
          const pathKey = Object.keys( data[ 0 ] ).find( k => k.toLowerCase() === 'path' || k.toLowerCase() === 'id' );

          // Check for category keys
          const columnMapping = useChartStore.getState().columnMapping;
          const availableColumns = useChartStore.getState().availableColumns;
          const categoryKeys = ( columnMapping.categories || [] ).map( i => availableColumns[ i ] ).filter( Boolean );

          let maxLevel = 0;
          let isPathBased = false;

          if ( pathKey ) {
            isPathBased = true;
            // Calculate max depth from path data
            const firstPath = String( ( data[ 0 ] as any )[ pathKey ] || '' );
            const separator = firstPath.includes( '/' ) ? '/' : '.';
            // Scan a few rows to find max depth
            data.slice( 0, 10 ).forEach( ( d: any ) => {
              const parts = String( d[ pathKey ] ).split( separator );
              maxLevel = Math.max( maxLevel, parts.length - 1 );
            } );
          } else if ( categoryKeys.length > 0 ) {
            // Use category keys count
            maxLevel = categoryKeys.length;
          }

          if ( maxLevel <= 0 ) return null;

          return (
            <div className="flex items-center gap-2">
              <Label className="text-xs font-medium whitespace-nowrap">Group Level:</Label>
              <Select
                value={ String( treemapCategoryLevel ) }
                onValueChange={ ( val ) => setTreemapCategoryLevel( Number( val ) ) }
              >
                <SelectTrigger className="h-7 text-xs w-[100px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">All</SelectItem>
                  { Array.from( { length: maxLevel }, ( _, i ) => (
                    <SelectItem key={ i } value={ String( i ) }>
                      { isPathBased ? `Level ${ i }` : ( categoryKeys[ i ] || `Level ${ i }` ) }
                    </SelectItem>
                  ) ) }
                </SelectContent>
              </Select>
            </div>
          );
        } )() }
      </div>
    );
  }

  return null;
}
