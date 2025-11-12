# Charts

This directory contains D3.js chart modules and utilities for rendering visualizations.

## Structure

- `/line` - Line, area, and related charts
- `/bar` - Bar, column, and histogram charts
- `/scatter` - Scatter plots, bubble charts, and distributions
- `/hierarchical` - Tree maps, sunbursts, network graphs
- `/maps` - Geospatial and choropleth visualizations
- `/utils` - Shared D3 utilities, scales, and helpers

## Chart Module Pattern

Each chart should export a reusable component that accepts:
- `data` - The data to visualize
- `config` - Configuration object (axes, colors, legend, layout)
- `animation` - Animation settings
