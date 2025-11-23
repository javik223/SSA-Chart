import * as d3 from 'd3';

export type ScaleType = 'linear' | 'log' | 'time' | 'band' | 'point';

interface ScaleOptions {
  domain: any[];
  range: [number, number];
  padding?: number;
  nice?: boolean;
}

/**
 * Helper to parse dates from various formats
 */
const parseDate = (value: any): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    // Try ISO first
    const iso = new Date(value);
    if (!isNaN(iso.getTime())) return iso;
    
    // Try D3 parsers for common formats if needed, 
    // but usually new Date() handles standard formats well.
    // If we have specific formats like "2023-Q1", we'd need custom logic here.
  }
  return null;
};

export const createScale = (
  type: ScaleType,
  { domain, range, padding = 0, nice = false }: ScaleOptions
) => {
  switch (type) {
    case 'time': {
      const dates = domain.map(parseDate).filter((d): d is Date => d !== null);
      const extent = d3.extent(dates);
      
      // Fallback if no valid dates
      if (!extent[0] || !extent[1]) {
        return d3.scalePoint().domain(domain.map(String)).range(range).padding(padding);
      }

      const scale = d3.scaleUtc().domain(extent).range(range);
      if (nice) scale.nice();
      return scale;
    }

    case 'log': {
      // Log scale domain must be strictly positive or strictly negative
      // Filter out <= 0 values for safety
      const validDomain = domain.filter(d => Number(d) > 0).map(Number);
      const extent = d3.extent(validDomain) as [number, number];
      
      // Fallback to linear if invalid log domain
      if (!extent[0] || !extent[1]) {
        return d3.scaleLinear().domain(d3.extent(domain.map(Number)) as [number, number]).range(range);
      }

      const scale = d3.scaleLog().domain(extent).range(range);
      if (nice) scale.nice();
      return scale;
    }

    case 'band': {
      return d3
        .scaleBand()
        .domain(domain.map(String))
        .range(range)
        .padding(padding);
    }

    case 'point': {
      return d3
        .scalePoint()
        .domain(domain.map(String))
        .range(range)
        .padding(padding);
    }

    case 'linear':
    default: {
      const extent = d3.extent(domain.map(Number)) as [number, number];
      const scale = d3.scaleLinear().domain(extent).range(range);
      if (nice) scale.nice();
      return scale;
    }
  }
};
