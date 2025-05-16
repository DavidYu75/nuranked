/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'randomuser.me',        // For profile photos
      'logo.clearbit.com',    // For company logos
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/logos/**',
      },
      {
        protocol: 'https',
        hostname: 'shorturl.at',
      },
      {
        protocol: 'https',
        hostname: 'tinyurl.com',
      },
    ],
  },
};

module.exports = nextConfig;
