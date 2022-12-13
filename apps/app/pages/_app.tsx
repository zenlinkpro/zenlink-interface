import '@zenlink-interface/ui/index.css'
import 'styles/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { DefaultSeo } from 'next-seo'

import SEO from '../next-seo.config.mjs'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
