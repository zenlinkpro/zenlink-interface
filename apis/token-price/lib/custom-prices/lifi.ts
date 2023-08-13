import { chainsParachainIdToChainId } from "@zenlink-interface/chain"
import { TokenPrice } from "../types"

export async function fetchTokenPricesFromLifiApi(chainId: number) {
  const ethereumChainId = chainsParachainIdToChainId[chainId]
  const tokenPriceInfo = await fetch(`https://li.quest/v1/tokens?chains=${ethereumChainId}`)
    .then(res => res.json())

  const tokenInfo = new Map<string, TokenPrice>()
  tokenPriceInfo.tokens[ethereumChainId].forEach((info: { address: string, priceUSD: string }) => {
    if (info.address !== '0x0000000000000000000000000000000000000000') {
      tokenInfo.set(
        info.address,
        { id: info.address.toLowerCase(), priceUSD: Number(info.priceUSD), liquidity: 0 }
      )
    }
  })

  return {
    chainId,
    tokens: Array.from(tokenInfo.values())
  }
}
