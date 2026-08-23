import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(isGithubActions
    ? {
        basePath: "/bandhakvifamily",
        assetPrefix: "/bandhakvifamily/",
      }
    : {}),
};

export default nextConfig;
