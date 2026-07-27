import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@damc/ui", "@damc/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
