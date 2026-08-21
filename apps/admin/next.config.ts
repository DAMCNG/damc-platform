import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@damc/ui", "@damc/db"],
  // See apps/web/next.config.ts - same reasoning, admins expect their own
  // edits to show up immediately when navigating the dashboard.
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  // pnpm hoists the generated Prisma engine to the monorepo root's node_modules,
  // outside this app's own directory. Without these, Next's serverless bundler
  // doesn't discover the .prisma/client engine binary and every DB query fails
  // at runtime on Vercel with "could not locate the Query Engine" even though
  // the same code works fine locally and even at build time.
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingIncludes: {
    "/**/*": ["../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/*.node"],
  },
};

export default nextConfig;
