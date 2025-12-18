import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@starter-club/shared-types", "@starter-club/ui", "@starter-club/utils"],
};

export default nextConfig;
