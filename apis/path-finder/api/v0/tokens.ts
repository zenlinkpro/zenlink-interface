import type { Chain } from '@wagmi/core'
import { configureChains, createClient, fetchToken } from '@wagmi/core'
import type { ParachainId } from '@zenlink-interface/chain'
import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import type { Currency } from '@zenlink-interface/currency'
import { Native, Token } from '@zenlink-interface/currency'
import { ZENLINK_DEFAULT_TOKEN_LIST } from '@zenlink-interface/token-lists'
import { otherChains } from '@zenlink-interface/wagmi-config'
import { publicProvider } from '@wagmi/core/providers/public'
import { NATIVE_ADDRESS } from '@zenlink-interface/smart-router'
import { SUPPORTED_CHAINS } from './config'

export const DEFAULT_TOKENS_MAP = ZENLINK_DEFAULT_TOKEN_LIST
  .reduce<Map<ParachainId, Map<string, Token>>>((map, tokenList) => {
    const chainId = tokenList.tokens[0]?.parachainId
    if (map.get(chainId))
      return map

    map.set(
      chainId,
      tokenList.tokens.reduce<Map<string, Token>>(
        (tokenMap, { parachainId, address, decimals, name, symbol }) => {
          tokenMap.set(address.toLowerCase(), new Token({
            chainId: parachainId,
            decimals,
            name,
            symbol,
            address,
          }))
          return tokenMap
        },
        new Map(),
      ),
    )
    return map
  }, new Map())

const { provider } = configureChains([...otherChains] as Chain[], [publicProvider({ priority: 0 })])
createClient({ provider, autoConnect: true })

async function fetchTokenInfo(chainId: ParachainId, tokenId: string): Promise<Token | undefined> {
  try {
    const token = await fetchToken({
      address: tokenId as `0x${string}`,
      chainId: chainsParachainIdToChainId[chainId],
    })
    return new Token({
      chainId,
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
      address: token.address,
    })
  }
  catch {
    return undefined
  }
}

export async function getToken(chainId: ParachainId, tokenId: string): Promise<Currency | undefined> {
  if (!SUPPORTED_CHAINS.includes(chainId))
    return undefined
  if (tokenId === 'Native' || tokenId.toLowerCase() === NATIVE_ADDRESS.toLowerCase())
    return Native.onChain(chainId)
  const token = DEFAULT_TOKENS_MAP.get(chainId)?.get(tokenId.toLowerCase()) || (
    await fetchTokenInfo(chainId, tokenId)
  )
  return token
}
