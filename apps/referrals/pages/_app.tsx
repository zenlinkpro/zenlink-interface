import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import type { FC } from 'react'
import { WagmiProvider } from 'wagmi'
import { config } from '@zenlink-interface/wagmi'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { LanguageProvider, storage, storageMiddleware } from '@zenlink-interface/shared'
import { ThemeProvider } from 'next-themes'
import { App, ToastContainer } from '@zenlink-interface/ui'
import { DefaultSeo } from 'next-seo'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { PolkadotApiProvider } from '@zenlink-interface/polkadot'
import { parachains } from '@zenlink-interface/polkadot-config'
import { Header } from 'components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
                    <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
                    <App.Footer />
                    <ToastContainer className="mt-[50px]" />
                  </App.Shell>
                  {/* <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" /> */}
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
