import createNextIntlPlugin from "next-intl/plugin";
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import { DEFAULT_CSP } from "./constants/csp.js";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */

const secureHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // img-src vercel.com needed for deploy button,
  // script-src va.vercel-scripts.com for analytics/vercel scripts
  {
    key: "Content-Security-Policy",
    value: `${DEFAULT_CSP} frame-ancestors 'none'`,
  },
  { key: "X-Frame-Options", value: "deny" },
];

const imageRemotePatterns = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "8080",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "*.zitadel.*",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "dev.zitadel.golain.io",
    port: "443",
    pathname: "/**",
  }
];

if (process.env.ZITADEL_API_URL) {
  const hostname = process.env.ZITADEL_API_URL?.replace("https://", "").split(":")[0] || "";
  const port = process.env.ZITADEL_API_URL?.includes(":") 
    ? process.env.ZITADEL_API_URL?.split(":")[1] 
    : "443";
    
  imageRemotePatterns.push({
    protocol: "https",
    hostname,
    port: port || "443",
    pathname: "/**",
  });
}

const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: process.env.NEXT_OUTPUT_MODE || undefined,
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  experimental: {
    dynamicIO: true,
  },
  images: {
    // unoptimized: true,
    remotePatterns: imageRemotePatterns,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: secureHeaders,
      },
    ];
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default withNextIntl(nextConfig);
