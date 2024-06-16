import defaultNextConfig from '@zenlink-interface/nextjs-config'

const {
  NEXT_PUBLIC_SWAP_URL,
  NEXT_PUBLIC_POOL_URL,
  NEXT_PUBLIC_MARKET_URL,
  NEXT_PUBLIC_GAUGE_URL,
  NEXT_PUBLIC_REFERRALS_URL,
  NEXT_PUBLIC_ANALYTICS_URL,
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
        destination: `${NEXT_PUBLIC_SWAP_URL}/swap`,
      },
      {
        source: '/swap/:path*',
        destination: `${NEXT_PUBLIC_SWAP_URL}/swap/:path*`,
      },
      {
        source: '/pool',
        destination: `${NEXT_PUBLIC_POOL_URL}/pool`,
      },
      {
        source: '/pool/:path*',
        destination: `${NEXT_PUBLIC_POOL_URL}/pool/:path*`,
      },
      {
        source: '/market',
        destination: `${NEXT_PUBLIC_MARKET_URL}/market`,
      },
      {
        source: '/market/:path*',
        destination: `${NEXT_PUBLIC_MARKET_URL}/market/:path*`,
      },
      {
        source: '/gauge',
        destination: `${NEXT_PUBLIC_GAUGE_URL}/gauge`,
      },
      {
        source: '/gauge/:path*',
        destination: `${NEXT_PUBLIC_GAUGE_URL}/gauge/:path*`,
      },
      {
        source: '/referrals',
        destination: `${NEXT_PUBLIC_REFERRALS_URL}/referrals`,
      },
      {
        source: '/referrals/:path*',
        destination: `${NEXT_PUBLIC_REFERRALS_URL}/referrals/:path*`,
      },
      {
        source: '/analytics',
        destination: `${NEXT_PUBLIC_ANALYTICS_URL}/analytics`,
      },
      {
        source: '/analytics/:path*',
        destination: `${NEXT_PUBLIC_ANALYTICS_URL}/analytics/:path*`,
      },
    ]
  },
}

export default nextConfig
