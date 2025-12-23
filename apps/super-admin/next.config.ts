import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@starter-club/shared-types", "@starter-club/ui", "@starter-club/utils"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "o341ovdtm5.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
