import transpileModules from 'next-transpile-modules'
import { withAxiom } from 'next-axiom'

const withTranspileModules = transpileModules([
  '@vercel/examples-ui',
  '@zenlink-interface/ui',
])

// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  productionBrowserSourceMaps: true,
}

export default withAxiom(withTranspileModules(nextConfig))
