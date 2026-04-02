import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No static export — hybrid mode for Cloudflare Workers
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
