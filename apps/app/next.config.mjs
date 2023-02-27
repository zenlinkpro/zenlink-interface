import defaultNextConfig from '@zenlink-interface/nextjs-config'

const {
  SWAP_URL,
  POOL_URL,
  REFERRALS_URL,
  ANALYTICS_URL,
} = process.env

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  transpilePackages: [
    '@zenlink-interface/ui',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: true,
        basePath: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/swap',
        destination: `${SWAP_URL}/swap`,
      },
      {
        source: '/swap/:path*',
        destination: `${SWAP_URL}/swap/:path*`,
      },
      {
        source: '/pool',
        destination: `${POOL_URL}/pool`,
      },
      {
        source: '/pool/:path*',
        destination: `${POOL_URL}/pool/:path*`,
      },
      {
        source: '/referrals',
        destination: `${REFERRALS_URL}/referrals`,
      },
      {
        source: '/referrals/:path*',
        destination: `${REFERRALS_URL}/referrals/:path*`,
      },
      {
        source: '/analytics',
        destination: `${ANALYTICS_URL}/analytics`,
      },
      {
        source: '/analytics/:path*',
        destination: `${ANALYTICS_URL}/analytics/:path*`,
      },
    ]
  },
}

export default nextConfig
