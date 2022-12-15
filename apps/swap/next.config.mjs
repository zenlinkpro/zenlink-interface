import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

const withTranspileModules = transpileModules([
  '@zenlink-interface/redux-token-lists',
  '@zenlink-interface/redux-localstorage',
  '@zenlink-interface/wagmi',
  '@zenlink-interface/polkadot',
  '@zenlink-interface/ui',
  '@zenlink-interface/compat',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/swap',
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dtdshj0e5/image/fetch',
  },
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
}

export default withAxiom(withTranspileModules(nextConfig))
