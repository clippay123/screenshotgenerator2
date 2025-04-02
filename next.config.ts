import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co", // Allow any Supabase storage domain
      },
    ],
  },
};

export default nextConfig;
