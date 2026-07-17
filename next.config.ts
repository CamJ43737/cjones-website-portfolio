import type { NextConfig } from "next";

/**
 * Optional subdirectory deploy (e.g. GitHub Pages):
 *   NEXT_PUBLIC_BASE_PATH=/cjones-website-portfolio
 *
 * Leave unset for Vercel / custom domains (root path).
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Native Next.js on Vercel (not static-export / GitHub Pages mode)
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
