import defaultNextConfig from '@zenlink-interface/nextjs-config'

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/referrals',
  transpilePackages: [
    '@zenlink-interface/redux-localstorage',
    '@zenlink-interface/wagmi',
    '@zenlink-interface/polkadot',
    '@zenlink-interface/parachains-manta',
    '@zenlink-interface/compat',
    '@zenlink-interface/shared',
    '@zenlink-interface/ui',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/referrals',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
