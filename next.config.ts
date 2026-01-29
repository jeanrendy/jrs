import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',          // Required for static hosting
  basePath: '/jrs',         // Must match your repo name exactly
  images: {
    unoptimized: true       // Required for static images
  }
};

export default nextConfig;