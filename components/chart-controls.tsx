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

  return null;
}
