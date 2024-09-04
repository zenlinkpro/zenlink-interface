import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import type { FC } from 'react'
import { config } from '@zenlink-interface/wagmi'
import { WagmiProvider } from 'wagmi'
import { ThemeProvider } from 'next-themes'
import { App, ToastContainer } from '@zenlink-interface/ui'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { DefaultSeo } from 'next-seo'
import { parachains } from '@zenlink-interface/polkadot-config'
import { PolkadotApiProvider } from '@zenlink-interface/polkadot'
import { LanguageProvider, storage, storageMiddleware } from '@zenlink-interface/shared'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { tokenLists } from 'lib/state/token-lists'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import SEO from '../next-seo.config.mjs'
import { AggregationSwapBanner, Header } from '../components'

const store = configureStore({
  // @ts-expect-error ignore
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(storageMiddleware),
  // @ts-expect-error ignore
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
    [storage.reducerPath]: storage.reducer,
  },
})

const queryClient = new QueryClient()

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <PolkadotApiProvider chains={parachains}>
            <Provider store={store}>
              <LanguageProvider>
                <ThemeProvider attribute="class" disableTransitionOnChange enableSystem={false}>
                  <App.Shell>
                    <DefaultSeo {...SEO} />
                    <Header />
                    <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
                    <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                    <App.Footer />
                    <ToastContainer className="mt-[50px]" />
                  </App.Shell>
                  <AggregationSwapBanner />
                  <div className="z-[-1] bg-radial-light dark:bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
                </ThemeProvider>
              </LanguageProvider>
            </Provider>
          </PolkadotApiProvider>
        </QueryClientProvider>
      </WagmiProvider>
      <Analytics />
    </>
  )
}

export default MyApp
