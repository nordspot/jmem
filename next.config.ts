import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export only when NOT running CMS
  // npm run build → static export for Cloudflare
  // npm run cms → dev mode with Keystatic admin at /keystatic
  output: process.env.KEYSTATIC ? undefined : "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
