import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Locale metadata only reads request headers; keep it in the initial head for all clients.
  htmlLimitedBots: /.*/,
};

export default nextConfig;
