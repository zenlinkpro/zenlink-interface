import defaultNextConfig from '@zenlink-interface/nextjs-config'

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/swap',
  async redirects() {
    return [
      {
        basePath: false,
        destination: '/swap',
        permanent: true,
        source: '/',
      },
    ]
  },
  transpilePackages: [
    '@zenlink-interface/redux-token-lists',
    '@zenlink-interface/redux-localstorage',
    '@zenlink-interface/wagmi',
    '@zenlink-interface/polkadot',
    '@zenlink-interface/parachains-bifrost',
    '@zenlink-interface/compat',
    '@zenlink-interface/shared',
    '@zenlink-interface/ui',
  ],
}

export default nextConfig
