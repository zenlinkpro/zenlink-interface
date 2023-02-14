import '@zenlink-interface/ui/index.css'

import { App, ThemeProvider, ToastContainer } from '@zenlink-interface/ui'
import { client } from '@zenlink-interface/wagmi'
import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { configureStore } from '@reduxjs/toolkit'
import { PolkadotApiProvider } from '@zenlink-interface/polkadot'
import { parachains } from '@zenlink-interface/polkadot-config'
import { DefaultSeo } from 'next-seo'
import { storage, storageMiddleware } from '@zenlink-interface/shared'

import { tokenLists } from 'lib/state/token-lists'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Header } from 'components'
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
      <WagmiConfig client={client}>
        <PolkadotApiProvider chains={parachains}>
          <Provider store={store}>
            <ThemeProvider>
              <App.Shell>
                <DefaultSeo {...SEO} />
                <Header />
                <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
                <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                <ToastContainer className="mt-[50px]" />
              </App.Shell>
            </ThemeProvider>
          </Provider>
        </PolkadotApiProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
