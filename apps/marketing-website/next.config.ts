import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "o341ovdtm5.ufs.sh",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/partners",
        destination: process.env.NEXT_PUBLIC_PARTNER_URL || "/dashboard/partner",
        permanent: true,
      },
      {
        source: "/partners/admin",
        destination: process.env.NEXT_PUBLIC_ADMIN_URL || "/dashboard/super-admin",
        permanent: true,
      },
      {
        source: "/onboard",
        destination: process.env.NEXT_PUBLIC_ONBOARD_URL || "http://localhost:3001",
        permanent: false,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
