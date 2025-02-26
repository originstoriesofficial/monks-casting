import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Accept images from all domains
      },
      {
        protocol: "http",
        hostname: "**", // Accept HTTP images (if needed)
      },
    ],
    domains: ["*"], // Fallback to allow all domains
    formats: ["image/avif", "image/webp"], // Allow only avif and webp formats
    contentSecurityPolicy: "default-src 'self'; img-src *; media-src *;",
    dangerouslyAllowSVG: true, // Allow SVGs (if needed)
  },
};

export default nextConfig;
