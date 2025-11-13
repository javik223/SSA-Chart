/**
 * Chart Registry System
 *
 * This module provides a centralized registry for all chart types.
 * Charts can be registered with metadata and components, making it easy
 * to add new charts without modifying multiple files.
 */

import { ChartType, ChartCategory } from '@/types/chart';
import { ComponentType } from 'react';

/**
 * Chart metadata and configuration
 */
export interface ChartRegistration {
  // Identification
  type: ChartType;
  name: string;
  category: ChartCategory;

  // Display
  description?: string;
  icon?: string; // Icon name or path
  thumbnail?: string; // Preview image path

  // Component
  component: ComponentType<ChartComponentProps>;

  // Features
  supportsMultipleSeries?: boolean;
  supportsAnimation?: boolean;
  requiresGeospatial?: boolean;
  requiresHierarchical?: boolean;

  // Data requirements
  minDataPoints?: number;
  requiredColumns?: {
    label?: boolean;
    value?: boolean;
    category?: boolean;
    latitude?: boolean;
    longitude?: boolean;
    source?: boolean;
    target?: boolean;
  };

  // Status
  status?: 'stable' | 'beta' | 'experimental' | 'coming-soon';

  // Tags for search/filtering
  tags?: string[];
}

/**
 * Props passed to chart components
 */
export interface ChartComponentProps {
  data: any[];
  labelKey: string;
  valueKeys: string[];
  width?: number;
  height?: number;
  legendShow?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendAlignment?: 'start' | 'center' | 'end';
  legendFontSize?: number;
  legendShowValues?: boolean;
  legendGap?: number;
  config?: any;
}

/**
 * Category metadata
 */
export interface CategoryInfo {
  id: ChartCategory;
  name: string;
  description?: string;
  order: number;
}

/**
 * Chart Registry Class
 */
class ChartRegistry {
  private charts: Map<ChartType, ChartRegistration> = new Map();
  private categories: Map<ChartCategory, CategoryInfo> = new Map();

  constructor() {
    // Register default categories
    this.registerCategory({
      id: 'line-bar-pie',
      name: 'Line, Bar, and Pie Charts',
      description: 'Classic chart types for comparing values and showing trends',
      order: 1,
    });

    this.registerCategory({
      id: 'scatter-distribution',
      name: 'Scatter and Distribution',
      description: 'Charts for analyzing distributions and correlations',
      order: 2,
    });

    this.registerCategory({
      id: 'hierarchical-network',
      name: 'Hierarchical and Network',
      description: 'Visualizations for relationships and hierarchies',
      order: 3,
    });

    this.registerCategory({
      id: 'maps-geospatial',
      name: 'Maps and Geospatial',
      description: 'Geographic and location-based visualizations',
      order: 4,
    });

    this.registerCategory({
      id: 'advanced-composite',
      name: 'Advanced and Composite',
      description: 'Complex and multi-dimensional visualizations',
      order: 5,
    });
  }

  /**
   * Register a new category
   */
  registerCategory(category: CategoryInfo): void {
    this.categories.set(category.id, category);
  }

  /**
   * Register a new chart type
   */
  register(registration: ChartRegistration): void {
    if (this.charts.has(registration.type)) {
      console.warn(`Chart type "${registration.type}" is already registered. Overwriting.`);
    }
    this.charts.set(registration.type, registration);
  }

  /**
   * Register multiple charts at once
   */
  registerMany(registrations: ChartRegistration[]): void {
    registrations.forEach((reg) => this.register(reg));
  }

  /**
   * Get a chart registration by type
   */
  get(type: ChartType): ChartRegistration | undefined {
    return this.charts.get(type);
  }

  /**
   * Get all registered charts
   */
  getAll(): ChartRegistration[] {
    return Array.from(this.charts.values());
  }

  /**
   * Get charts by category
   */
  getByCategory(category: ChartCategory): ChartRegistration[] {
    return this.getAll().filter((chart) => chart.category === category);
  }

  /**
   * Get all categories
   */
  getCategories(): CategoryInfo[] {
    return Array.from(this.categories.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Get category info
   */
  getCategory(id: ChartCategory): CategoryInfo | undefined {
    return this.categories.get(id);
  }

  /**
   * Get charts organized by category
   */
  getChartsByCategory(): { category: CategoryInfo; charts: ChartRegistration[] }[] {
    const categories = this.getCategories();
    return categories.map((category) => ({
      category,
      charts: this.getByCategory(category.id),
    }));
  }

  /**
   * Search charts by name, description, or tags
   */
  search(query: string): ChartRegistration[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter((chart) => {
      return (
        chart.name.toLowerCase().includes(lowerQuery) ||
        chart.description?.toLowerCase().includes(lowerQuery) ||
        chart.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }

  /**
   * Filter charts by status
   */
  getByStatus(status: ChartRegistration['status']): ChartRegistration[] {
    return this.getAll().filter((chart) => chart.status === status);
  }

  /**
   * Get only stable/production-ready charts
   */
  getStable(): ChartRegistration[] {
    return this.getAll().filter(
      (chart) => !chart.status || chart.status === 'stable'
    );
  }

  /**
   * Check if a chart type is registered
   */
  has(type: ChartType): boolean {
    return this.charts.has(type);
  }

  /**
   * Unregister a chart type (useful for testing or hot reload)
   */
  unregister(type: ChartType): boolean {
    return this.charts.delete(type);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.charts.clear();
  }
}

/**
 * Global chart registry instance
 */
export const chartRegistry = new ChartRegistry();

/**
 * Helper function to register a chart
 */
export function registerChart(registration: ChartRegistration): void {
  chartRegistry.register(registration);
}

/**
 * Helper function to register multiple charts
 */
export function registerCharts(registrations: ChartRegistration[]): void {
  chartRegistry.registerMany(registrations);
}

/**
 * Helper function to get a chart
 */
export function getChart(type: ChartType): ChartRegistration | undefined {
  return chartRegistry.get(type);
}

/**
 * Helper function to get all charts
 */
export function getAllCharts(): ChartRegistration[] {
  return chartRegistry.getAll();
}

/**
 * Helper function to get charts by category
 */
export function getChartsByCategory(): { category: CategoryInfo; charts: ChartRegistration[] }[] {
  return chartRegistry.getChartsByCategory();
}
