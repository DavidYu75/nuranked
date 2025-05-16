/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/logos/**',
      },
    ],
    unoptimized: true, // This will allow any external image to be loaded without optimization
  },
};

module.exports = nextConfig;
