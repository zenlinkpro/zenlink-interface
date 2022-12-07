import '@zenlink-interface/ui/index.css'

import { App, ThemeProvider, ToastContainer } from '@zenlink-interface/ui'
import { client } from '@zenlink-interface/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { Provider } from 'react-redux'
import { WagmiConfig } from 'wagmi'
import { configureStore } from '@reduxjs/toolkit'
import { tokenLists } from 'lib/state/token-lists'
import { storage, storageMiddleware } from 'lib/state/storage'

export { reportWebVitals } from 'next-axiom'

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
          </ThemeProvider>
        </Provider>
      </WagmiConfig>
    </>
  )
}

export default MyApp
