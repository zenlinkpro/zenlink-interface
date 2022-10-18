import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { Header } from '../components'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
   <>
    <Header />
    <Component {...pageProps} />
   </>
  )
}

export default MyApp
