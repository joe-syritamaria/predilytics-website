import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.youtube.com", "api.qrserver.com"], // allow YouTube thumbnails + QR generator
  },
};

export default nextConfig;
