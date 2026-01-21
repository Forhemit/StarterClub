import type { NextConfig } from "next";

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
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Preserve WordPress URLs during migration
      {
        source: "/wp-content/:path*",
        destination: "/api/legacy-proxy/wp-content/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
