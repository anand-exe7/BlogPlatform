import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
      {
        source: '/member',
        destination: '/member/profile',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
