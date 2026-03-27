import { envVars } from "config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Note: assetPrefix removed to serve fonts directly from App Runner
  // CloudFront CDN is used for images/assets uploaded to S3, not for Next.js build artifacts
  // This avoids CORS issues with font files (woff2) which are part of the Next.js build
  assetPrefix: undefined,

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${envVars.apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
