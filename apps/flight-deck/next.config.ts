import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    experimental: {
        optimizePackageImports: ["lucide-react"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
