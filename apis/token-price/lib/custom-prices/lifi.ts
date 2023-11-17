import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { TokenPrice } from '../types'

export async function fetchTokenPricesFromLifiApi(chainId: number) {
  const ethereumChainId = chainsParachainIdToChainId[chainId]
  const tokenPriceInfo = await fetch(`https://li.quest/v1/tokens?chains=${ethereumChainId}`)
    .then(res => res.json())

  const tokenInfo = new Map<string, TokenPrice>()
  tokenPriceInfo.tokens[ethereumChainId].forEach((info: { address: string, priceUSD: string }) => {
    const address = info.address
    const priceUSD = Number(info.priceUSD)
    if (address !== '0x0000000000000000000000000000000000000000' && priceUSD !== 0) {
      tokenInfo.set(
        address,
        { id: address.toLowerCase(), priceUSD, liquidity: 0 },
      )
    }
  })

  return {
    chainId,
    tokens: Array.from(tokenInfo.values()),
  }
}
