/// <reference lib="dom" />

import type { ChainTokenPrice, TokenPrice } from '../types'

const zlkAddress = '0x3fd9b6c9a24e09f67b7b706d72864aebb439100c'
const wglmrAddress = '0xacc15dc74880c9944775448304b263d191c6077f'

export async function fetchMoonbeamTokenPricesFromCoingeckoApi(): Promise<ChainTokenPrice> {
  const defaultTokenPriceInfo = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=moonbeam,zenlink-network-token&vs_currencies=usd',
  ).then(res => res.json())
  const stellaTokenPriceInfo = await fetch(
    'https://api.coingecko.com/api/v3/exchanges/stellaswap-v3/tickers?include_exchange_logo=false',
  ).then(res => res.json())

  const tokenInfo = new Map<string, TokenPrice>()
  tokenInfo.set(
    zlkAddress,
    { id: zlkAddress.toLowerCase(), priceUSD: defaultTokenPriceInfo['zenlink-network-token'].usd, liquidity: 0 },
  )
  tokenInfo.set(
    wglmrAddress,
    { id: wglmrAddress.toLowerCase(), priceUSD: defaultTokenPriceInfo.moonbeam.usd, liquidity: 0 },
  )

  stellaTokenPriceInfo.tickers.forEach(
    (tick: { trust_score: string, base: string, converted_last: { usd: number } }) => {
      if (tick.trust_score !== 'red') {
        tokenInfo.set(
          tick.base,
          { id: tick.base.toLowerCase(), priceUSD: tick.converted_last.usd, liquidity: 0 },
        )
      }
    },
  )

  return {
    chainId: 2004,
    tokens: Array.from(tokenInfo.values()),
  }
}
