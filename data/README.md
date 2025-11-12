# Data

This directory contains data upload, parsing, and validation logic.

## Modules

- `upload.ts` - File upload handling (CSV, Excel)
- `parser.ts` - Parse CSV/Excel files into JSON
- `validator.ts` - Data validation and type checking
- `transformer.ts` - Data transformation utilities

## Supported Formats

- CSV (.csv) - via Papaparse
- Excel (.xlsx) - via SheetJS (xlsx)
