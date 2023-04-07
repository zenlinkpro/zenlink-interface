import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { client } from '@zenlink-interface/wagmi'
import { WagmiConfig } from 'wagmi'
import { ThemeProvider } from 'next-themes'
import { App, ToastContainer } from '@zenlink-interface/ui'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { DefaultSeo } from 'next-seo'
import { parachains } from '@zenlink-interface/polkadot-config'
import { PolkadotApiProvider } from '@zenlink-interface/polkadot'
import { LanguageProvider, storage, storageMiddleware } from '@zenlink-interface/shared'

import { tokenLists } from 'lib/state/token-lists'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import SEO from '../next-seo.config.mjs'
import { Header } from '../components'

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
            <LanguageProvider>
              <ThemeProvider attribute="class" enableSystem={false}>
                <App.Shell>
                  <DefaultSeo {...SEO} />
                  <Header />
                  <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
                  <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                  <App.Footer />
                  <ToastContainer className="mt-[50px]" />
                </App.Shell>
                <div className="z-[-1] bg-radial-light dark:bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
              </ThemeProvider>
            </LanguageProvider>
          </Provider>
        </PolkadotApiProvider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
