import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
 images: {
    domains: ['quizwalev1.netlify.app', 'res.cloudinary.com', ], 
  },
};

export default nextConfig;
