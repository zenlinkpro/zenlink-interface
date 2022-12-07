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
import { storage, storageMiddleware } from 'lib/state/storage'
import { Header } from '../components'

const store = configureStore({
  reducer: {
    [tokenLists.reducerPath]: tokenLists.reducer,
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
        <Provider store={store}>
          <ThemeProvider>
            <App.Shell>
              <Header />
              <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
              <Component {...pageProps} chainIds={SUPPORTED_CHAIN_IDS} />
              <ToastContainer className="mt-[50px]" />
            </App.Shell>
            <div className="z-[-1] bg-gradient-radial fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
          </ThemeProvider>
        </Provider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
