import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@damc/ui", "@damc/db"],
  // Content is admin-managed and expected to show up promptly after an edit.
  // The client-side router otherwise caches visited pages for up to 5
  // minutes (static) / 30s (dynamic) and can keep serving that stale copy on
  // Link navigation even after the server has been told to revalidate -
  // disabling it means every navigation asks the server fresh, which then
  // decides (via revalidatePath / the revalidate window) whether it already
  // has up-to-date data cached or needs to re-render.
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
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
