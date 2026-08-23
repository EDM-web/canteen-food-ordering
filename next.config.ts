import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh", // UploadThing v7+ ရဲ့ CDN
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Unsplash Images
      },
    ],
  },
};

export default nextConfig;
