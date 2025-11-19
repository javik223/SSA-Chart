import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Turbopack configuration for Next.js 16+
  turbopack: {},

  // DuckDB is client-side only (web worker), so it should be external to server
  serverExternalPackages: ['@duckdb/duckdb-wasm'],
};

export default nextConfig;
