import 'styles/index.css'
import '@zenlink-interface/ui/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { Provider } from 'react-redux'
import { DefaultSeo } from 'next-seo'
import { Analytics } from '@vercel/analytics/react'
import { WagmiConfig } from 'wagmi'
import { configureStore } from '@reduxjs/toolkit'
import { config } from '@zenlink-interface/wagmi'
import { LanguageProvider, storage, storageMiddleware } from '@zenlink-interface/shared'
import { ThemeProvider } from 'next-themes'
import { App, ToastContainer } from '@zenlink-interface/ui'

import { Header } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import SEO from '../next-seo.config.mjs'

const store = configureStore({
  reducer: {
    [storage.reducerPath]: storage.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(storageMiddleware),
})

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <WagmiConfig config={config}>
        {/* <PolkadotApiProvider chains={parachains}> */}
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
                <div className="z-[-1] bg-radial-light dark:bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
              </ThemeProvider>
            </LanguageProvider>
          </Provider>
        {/* </PolkadotApiProvider> */}
      </WagmiConfig>
      <Analytics />
    </>
  )
}

export default MyApp
