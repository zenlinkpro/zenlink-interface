import '@zenlink-interface/ui/index.css'
import 'styles/index.css'

import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { useEffect } from 'react'
import { client } from '@zenlink-interface/wagmi'
import { WagmiConfig } from 'wagmi'
import { App } from '@zenlink-interface/ui'
import { useRouter } from 'next/router'
import { Header } from '../components'

declare global {
  interface Window {
    dataLayer: Record<string, any>[]
  }
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  useEffect(() => {
    const handler = (page) => {
      window.dataLayer.push({
        event: 'pageview',
        page,
      })
    }
    router.events.on('routeChangeComplete', handler)
    router.events.on('hashChangeComplete', handler)
    return () => {
      router.events.off('routeChangeComplete', handler)
      router.events.off('hashChangeComplete', handler)
    }
  }, [router.events])

  return (
   <>
    <WagmiConfig client={client}>
      <App.Shell>
        <Header />
        <Component {...pageProps} />
      </App.Shell>
    </WagmiConfig>
   </>
  )
}

export default MyApp
