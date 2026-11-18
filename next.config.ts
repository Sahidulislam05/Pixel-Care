import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  // The browser only ever talks to this origin. Requests to /api/v1/* are
  // forwarded to the Express API, so auth cookies are first-party and no CORS
  // setup is needed in any environment.
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${BACKEND_URL}/api/v1/:path*` },
    ];
  },
  // The backend's bKash callback redirects here; the query (?status=) is kept.
  async redirects() {
    return [
      {
        source: "/dashboard/my-appointments",
        destination: "/dashboard/appointments",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
