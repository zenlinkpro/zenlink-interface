/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  swcMinify: false,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/dtdshj0e5/image/fetch',
  },
}

module.exports = defaultNextConfig
