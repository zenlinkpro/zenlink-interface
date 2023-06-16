/** @type {import('next').NextConfig} */
const defaultNextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  swcMinify: true,
  poweredByHeader: false,
  staticPageGenerationTimeout: 180,
  experimental: {
    esmExternals: 'loose',
    swcPlugins: [
      ['@lingui/swc-plugin', {}],
    ],
  },
  // images: {
  //   loader: 'cloudinary',
  //   path: 'https://res.cloudinary.com/dtdshj0e5/image/fetch',
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // If client-side, don't polyfill `fs`
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        dns: false,
        tls: false,
        net: false,
      }
    }

    return config
  },
}

module.exports = defaultNextConfig
