import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // optimizePackageImports didn't work, trying modularizeImports
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{kebabCase member}}.js",
    },
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/partners",
        destination: "/dashboard/partner",
        permanent: true,
      },
      {
        source: "/partners/admin",
        destination: "/dashboard/super-admin",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
