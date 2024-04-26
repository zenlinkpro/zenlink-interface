import '@zenlink-interface/ui/index.css'

import { App, ToastContainer } from '@zenlink-interface/ui'
import { config } from '@zenlink-interface/wagmi'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import type { FC } from 'react'
import { Provider } from 'react-redux'
import { WagmiProvider } from 'wagmi'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from 'next-themes'
import { DefaultSeo } from 'next-seo'
import { LanguageProvider, storage, storageMiddleware } from '@zenlink-interface/shared'

import { tokenLists } from 'lib/state/token-lists'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { PolkadotApiProvider } from '@zenlink-interface/polkadot'
import { parachains } from '@zenlink-interface/polkadot-config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
