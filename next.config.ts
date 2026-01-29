import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static export
  images: { unoptimized: true } // Required for static hosting
}
module.exports = nextConfig