import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { client } from '@zenlink-interface/wagmi'
import { WagmiConfig } from 'wagmi'
import { App, ThemeProvider, ToastContainer } from '@zenlink-interface/ui'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { tokenLists } from 'lib/state/token-lists'
import { DefaultSeo } from 'next-seo'
import { parachains } from '@zenlink-interface/polkadot-config'
import { PolkadotApiProvider } from '@zenlink-interface/polkadot'
import { storage, storageMiddleware } from '@zenlink-interface/shared'
import { Header } from '../components'

import SEO from '../next-seo.config.mjs'

const store = configureStore({
  // @ts-expect-error ignore
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [storage.reducerPath]: storage.reducer,
  },
  // @ts-expect-error ignore
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(storageMiddleware),
})

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <PolkadotApiProvider chains={parachains}>
        <WagmiConfig client={client}>
          <Provider store={store}>
            <ThemeProvider>
              <App.Shell>
                <DefaultSeo {...SEO} />
                <Header />
                <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
                <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                <ToastContainer className="mt-[50px]" />
              </App.Shell>
              <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
            </ThemeProvider>
          </Provider>
        </WagmiConfig>
      </PolkadotApiProvider>
    </>
  )
}

export default MyApp
