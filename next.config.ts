import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.7"],
  devIndicators: false,
  poweredByHeader: false,
};

export default nextConfig;
