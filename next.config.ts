import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out to enable Clerk Middleware
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

export default nextConfig;
