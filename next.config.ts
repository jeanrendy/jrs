import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',          // Enables static export
  basePath: '/jrs',         // EXACTLY matches your repo name
  images: {
    unoptimized: true       // Required for static hosting
  }
};

export default nextConfig;