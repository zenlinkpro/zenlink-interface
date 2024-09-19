import type { AppProps } from 'next/app'
import type { FC } from 'react'

import { Analytics } from '@vercel/analytics/react'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config.mjs'
import '@zenlink-interface/ui/index.css'

import 'styles/index.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default MyApp
