# Claude Visualization App Requirements

## Project Overview

Claude is a **frontend-only web application** for creating advanced, interactive data visualizations inspired by Flourish Charts. It’s designed for analysts, researchers, educators, and content creators who want to transform raw data into engaging visuals without code.

Built with **Next.js**, **Shadcn/UI**, **D3.js**, and **Handsontable**, Claude combines modular design, high-performance rendering, and visual clarity for a complete browser-based data storytelling experience.

### Core Objectives

- Provide an **intuitive visual authoring tool** for data-driven storytelling.
- Support multiple chart categories (bar, line, scatter, map, hierarchical, etc.).
- Enable **real-time updates** between uploaded data, in-grid editing, and chart preview.
- Offer **exportable and embeddable** charts.

---

## Supported Chart Categories

Claude will feature a wide range of visualization types modeled after Flourish Studio’s chart gallery, powered by **D3.js** and custom reusable chart modules.

### 1. Line, Bar, and Pie Charts

- Line chart (standard, stacked, projected, with dots)
- Area chart (stacked, proportional, bump, streamgraph)
- Column & bar charts (stacked, grouped, proportional)
- Mixed chart types (Column + Line, Grid of charts)
- Donut and pie charts (with legend, proportional, filtered)
- Population pyramid
- Histogram
- Waterfall chart
- Diverging bar chart (with or without labels)
- Barcode plot
- Survey bars
- Performance vs target
- Seismogram & Step chart

### 2. Scatter and Distribution Charts

- Basic scatter plot
- Bubble chart
- Animated scatter plot
- Beeswarm plot
- Box plot
- Dot plot & Connected dot plot
- Lollipop chart (horizontal/vertical)
- Violin plot
- Proportional symbol chart
- Arrow plot
- Circle timeline
- Forest plot
- Quadrant chart
- Scatter plot with trendline
- Scatter with filters or images

### 3. Hierarchical & Network Charts

- Tree map
- Sunburst chart
- Radial dendrogram
- Circle packing
- Chord diagram
- Network graph (force-directed)
- Sankey diagram
- Alluvial flow chart

### 4. Maps & Geospatial Charts

- Simple point map
- Animated point map
- Growing point map
- Point map (light/dark)
- Choropleth map (by country/region)
- Heatmap (standard or point-based)
- Line and route map
- Satellite map (raster tile)
- Extruded maps (3D hex maps, counties, world)
- Geospatial bubble map

### 5. Advanced & Composite Visualizations

- Cycle plot
- Streamgraph (multi-series)
- Population grid chart
- Custom grid layouts (circular, linear, geographic)
- Grid of pie or donut charts
- Small multiples dashboard layout
- Animated transitions between chart types
- Time-series animations

---

## Data Input & Management

- Users can upload **Excel (.xlsx)** or **CSV (.csv)** files.
- Integrated **Handsontable** grid for live data entry and editing.
- **Data parser** converts raw files into clean JSON structures.
- Built-in validation: column headers, numeric consistency, missing value detection.
- Editable field types: number, text, category, date.
- Real-time synchronization between data table and D3 rendering engine.

---

## Project Structure

```
claude-app/
├── components/              # Reusable Shadcn UI components
├── charts/                  # D3.js chart modules and utilities
├── data/                    # Upload and parsing logic
├── hooks/                   # Custom React hooks
├── pages/                   # Next.js pages and dynamic routes
├── styles/                  # Tailwind + custom themes
├── utils/                   # Helpers (formatting, math, colors)
└── public/                  # Icons, templates, and static assets
```

---

## Development Workflow

### 1. Setup

```bash
npm install
npm run dev
```

Runs locally at `http://localhost:3000`.

### 2. UI Design

- Shadcn/UI and Tailwind CSS for fast, consistent, accessible layouts.
- Modular panels for chart configuration, data upload, and preview.
- Use Framer Motion for UI animations.

### 3. Data Handling

- File upload via drag-and-drop.
- Parsing with **Papaparse** (CSV) and **SheetJS** (Excel).
- Interactive Handsontable grid for inline editing and formatting.

### 4. Chart Rendering

- Each chart is a self-contained D3.js component with props for:

  - Data source
  - Config (axes, color, legend, layout)
  - Animation settings

- Chart module registry to manage available chart types dynamically.
- State sync with React hooks or Zustand.

### 5. Exporting & Sharing

- Download as PNG, SVG, or embeddable iframe.
- Copy configuration JSON for reuse.
- Optionally export project bundle as `.json` for sharing.

### 6. Testing & Deployment

- Unit tests with Jest.
- Visual regression tests for consistent rendering.
- Deployment on **Vercel** with automatic builds.

---

## Architecture Notes

- 100% frontend architecture; no backend storage.
- Data flow: **Upload → Parse → Grid → Chart Renderer**.
- Dynamic chart import for optimal bundle size.
- Client-side caching for recently used data.
- Debounced updates between data grid and D3.
- SVG-first rendering, with Canvas fallback for large datasets.

---

## Future Enhancements

- AI-assisted chart recommendations (auto-detect best chart for dataset).
- Collaborative mode with live editing.
- Cloud sync (Google Drive, Dropbox, Airtable).
- Dashboard builder mode.
- Plugin SDK for custom chart modules.

---

## Summary

Claude will be a modern, modular, and elegant charting studio for the browser. By combining **Next.js**, **D3.js**, **Shadcn/UI**, and **Handsontable**, it will deliver the power and polish of a professional visualization suite — entirely on the frontend, with real-time editing, responsive design, and export-ready results.
