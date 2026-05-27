import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  transpilePackages: ['recharts', 'es-toolkit'],

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  allowedDevOrigins: [
    "*.localhost",
    "localhost",
    "0.0.0.0",
    "192.168.1.40",
    "192.168.1.46",
  ],

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  async rewrites() {
    const ipAddress = process.env.IP_ADDRESS || "http://localhost:5000";

    return [
      {
        source: "/api/v1/:path*",
        destination: `${ipAddress}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${ipAddress}/uploads/:path*`,
      },
    ];
  },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,
};

const pwa = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,
  buildExcludes: [/middleware-manifest\.json$/],
});

export default isDev
  ? nextConfig
  : (pwa(nextConfig as any) as NextConfig);
