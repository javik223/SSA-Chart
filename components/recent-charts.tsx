'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecentChartsStore } from '@/store/useRecentChartsStore';
import { BarChart3, Clock } from 'lucide-react';
import { timeAgo } from '@/utils/dateHelpers';
import './recent-charts.css';

export function RecentCharts() {
  const { charts, isLoading, fetchRecentCharts } = useRecentChartsStore();

  useEffect( () => {
    // Check if we already have data to determine if we should show loading state
    const hasData = useRecentChartsStore.getState().charts.length > 0;
    fetchRecentCharts( hasData ); // background=true if we have data
  }, [ fetchRecentCharts ] );

  if ( isLoading && charts.length === 0 ) {
    return (
      <div className="recent-charts-loading-container">
        <div className="recent-charts-loading-spinner"></div>
      </div>
    );
  }

  if ( charts.length === 0 ) {
    return null;
  }

  return (
    <div className="recent-charts-container">
      <div className="recent-charts-header">
        <h2 className="recent-charts-title">Recent Charts</h2>
        <Link href="/saved" className="recent-charts-view-all">
          View all
        </Link>
      </div>

      <div className="recent-charts-scroll-container">
        <div className="recent-charts-scroll-pane">
          { charts.map( ( chart ) => (
            <Link
              key={ chart.id }
              href={ `/dashboard/create?id=${ chart.id }` }
              className="recent-charts-item-link"
            >
              <Card className="recent-charts-card">
                <div className="recent-charts-thumbnail-container">
                  { chart.thumbnail ? (
                    <img
                      src={ chart.thumbnail }
                      alt={ chart.title }
                      className="recent-charts-thumbnail-image"
                    />
                  ) : (
                    <div className="recent-charts-thumbnail-placeholder">
                      <BarChart3 className="recent-charts-placeholder-icon" />
                    </div>
                  ) }
                </div>
                <CardHeader className="recent-charts-card-header">
                  <CardTitle className="recent-charts-card-title" title={ chart.title }>
                    { chart.title }
                  </CardTitle>
                  <p className="recent-charts-card-description">
                    { chart.data.chartDescription || 'No description' }
                  </p>
                </CardHeader>
                <CardContent className="recent-charts-card-content">
                </CardContent>
                <CardFooter className="recent-charts-card-footer">
                  <Clock className="recent-charts-clock-icon" />
                  <span>
                    { timeAgo( chart.updated_at ) }
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ) ) }
        </div>
      </div>
    </div>
  );
}
