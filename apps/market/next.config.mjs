import defaultNextConfig from '@zenlink-interface/nextjs-config'

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  ...defaultNextConfig,
  basePath: '/market',
  transpilePackages: [
    '@zenlink-interface/redux-token-lists',
    '@zenlink-interface/redux-localstorage',
    '@zenlink-interface/wagmi',
    '@zenlink-interface/shared',
    '@zenlink-interface/ui',
    '@zenlink-interface/graph-client',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/market',
        permanent: true,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
