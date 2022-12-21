import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

const withTranspileModules = transpileModules([
  '@zenlink-interface/redux-token-lists',
  '@zenlink-interface/redux-localstorage',
  '@zenlink-interface/wagmi',
  '@zenlink-interface/compat',
  '@zenlink-interface/polkadot',
  '@zenlink-interface/parachains-bifrost',
  '@zenlink-interface/shared',
  '@zenlink-interface/ui',
  '@zenlink-interface/graph-client',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/pool',
  reactStrictMode: true,
  swcMinify: false,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dtdshj0e5/image/fetch',
  },
  productionBrowserSourceMaps: true,
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

export default withAxiom(withTranspileModules(nextConfig))
