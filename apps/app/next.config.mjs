import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

const withTranspileModules = transpileModules([
  '@zenlink-interface/ui',
])

const {
  SWAP_URL,
  POOL_URL,
} = process.env

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
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
      // {
      //   source: '/pool/:path*',
      //   destination: `${POOL_URL}/pool/:path*`,
      // },
    ]
  },
}

export default withAxiom(withTranspileModules(nextConfig))
