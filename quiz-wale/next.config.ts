import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx'],
 images: {
    domains: ['quizwalev1.netlify.app', 'res.cloudinary.com', ], 
  },
};

export default nextConfig;
