/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  version: 2,
  builds: [{ src: 'package.json', use: '@vercel/next' }],
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: false,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  experimental: {
    esmExternals: 'loose',
  },
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dtdshj0e5/image/fetch',
  },
}

module.exports = defaultNextConfig
