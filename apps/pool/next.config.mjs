import defaultNextConfig from '@zenlink-interface/nextjs-config'

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/pool',
  transpilePackages: [
    '@zenlink-interface/redux-token-lists',
    '@zenlink-interface/redux-localstorage',
    '@zenlink-interface/wagmi',
    '@zenlink-interface/polkadot',
    '@zenlink-interface/parachains-manta',
    '@zenlink-interface/compat',
    '@zenlink-interface/shared',
    '@zenlink-interface/ui',
    '@zenlink-interface/graph-client',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pool',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
