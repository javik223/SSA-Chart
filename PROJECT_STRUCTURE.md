# Claude Charts - Project Structure

## Directory Overview

```
claude-charts/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   └── ...               # Custom components (to be added)
│
├── charts/               # D3.js chart modules
│   ├── line/            # Line charts
│   ├── bar/             # Bar charts
│   ├── scatter/         # Scatter plots
│   ├── hierarchical/    # Tree maps, sunbursts, etc.
│   ├── maps/            # Geospatial visualizations
│   └── utils/           # Shared D3 utilities
│
├── data/                # Data handling
│   ├── upload.ts       # File upload logic
│   ├── parser.ts       # CSV/Excel parsing
│   ├── validator.ts    # Data validation
│   └── transformer.ts  # Data transformation
│
├── hooks/              # Custom React hooks
│   ├── useChartData.ts
│   ├── useFileUpload.ts
│   └── useDebounce.ts
│
├── store/              # Zustand state management
│   └── useChartStore.ts
│
├── types/              # TypeScript type definitions
│   ├── chart.ts       # Chart types
│   ├── data.ts        # Data types
│   └── index.ts       # Type exports
│
├── utils/              # Utility functions
│   ├── colors.ts      # Color palettes
│   ├── format.ts      # Formatters
│   ├── math.ts        # Math helpers
│   └── export.ts      # Export utilities
│
├── styles/            # Additional styles
│
├── public/            # Static assets
│   ├── icons/
│   └── templates/
│
└── lib/               # Shadcn/UI utilities
    └── utils.ts
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI (Radix UI)
- **Data Visualization**: D3.js
- **Data Grid**: Handsontable
- **Data Parsing**: Papaparse (CSV), SheetJS (Excel)
- **State Management**: Zustand
- **Animations**: Motion

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run with Turbopack
npm run dev:turbo

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

### Development Server

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features

### Data Flow

1. **Upload** → User uploads CSV or Excel file
2. **Parse** → File is parsed into structured data
3. **Validate** → Data is validated for consistency
4. **Transform** → Data is transformed for visualization
5. **Render** → Chart is rendered using D3.js
6. **Export** → User can export as PNG, SVG, or JSON

### Chart Categories

- **Line, Bar, Pie**: Basic charts with variants
- **Scatter & Distribution**: Advanced statistical visualizations
- **Hierarchical & Network**: Complex relationship charts
- **Maps & Geospatial**: Location-based visualizations
- **Advanced & Composite**: Dashboard layouts and animations

## Next Steps

1. Build the main application layout
2. Implement file upload component
3. Create data grid with Handsontable
4. Build chart renderer with D3.js
5. Add export functionality
6. Create chart gallery and templates
