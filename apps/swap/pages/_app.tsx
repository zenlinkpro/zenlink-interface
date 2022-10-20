import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { client } from '@zenlink-interface/wagmi'
import { WagmiConfig } from 'wagmi'

import { Header } from '../components'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
   <>
    <WagmiConfig client={client}>
      <Header />
      <Component {...pageProps} />
    </WagmiConfig>
   </>
  )
}

export default MyApp
