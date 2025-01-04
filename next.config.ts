import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
    ],
  },
};

export default nextConfig;