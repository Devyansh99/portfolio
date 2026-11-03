import { existsSync, readFileSync } from "node:fs";
import type { NextConfig } from "next";

// Local-only list of extra dev hosts. The file is git-ignored and absent in production.
const devOrigins: string[] = existsSync("dev-origins.json")
  ? JSON.parse(readFileSync("dev-origins.json", "utf8"))
  : [];

const nextConfig: NextConfig = {
  allowedDevOrigins: devOrigins,
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
