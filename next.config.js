/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['hobbycue.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'assets/audio/', // Adjust the output path as needed
        },
      },
    })
    return config
  },
  async redirects() {
    return [
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://hobbycue.com/:path*',
        permanent: true,
      },
    ]
  },
}

const withPWA = require('next-pwa')({
  dest: 'public', // Destination directory for the PWA files
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development mode
  register: true, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
})

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig)
