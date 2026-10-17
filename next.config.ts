import type { NextConfig } from "next";

// Blog posts are read from disk at request time; ship them with these routes.
const posts = ["./content/posts/**/*.mdx"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Locale metadata only reads request headers; keep it in the initial head for all clients.
  htmlLimitedBots: /.*/,
  outputFileTracingIncludes: {
    "/blog": posts,
    "/blog/*": posts,
    "/sitemap.xml": posts,
  },
};

export default nextConfig;
