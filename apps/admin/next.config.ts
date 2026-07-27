import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@damc/ui", "@damc/db"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
};

export default nextConfig;
