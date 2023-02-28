import '@zenlink-interface/ui/index.css'

import { App, AppType, ThemeProvider, ToastContainer } from '@zenlink-interface/ui'
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

import { SUPPORTED_CHAIN_IDS } from 'config'
import SEO from '../next-seo.config.mjs'

const store = configureStore({
  reducer: {
    [storage.reducerPath]: storage.reducer,
  },
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
                <App.Header apptype={AppType.Analytics} maxWidth="6xl" />
                <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                <App.Footer />
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
