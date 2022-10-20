import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { client } from '@zenlink-interface/wagmi'
import { WagmiConfig } from 'wagmi'

import { App } from '@zenlink-interface/ui'
import { Header } from '../components'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
   <>
    <WagmiConfig client={client}>
      <App.Shell>
        <Header />
        <Component {...pageProps} />
      </App.Shell>
    </WagmiConfig>
   </>
  )
}

export default MyApp
