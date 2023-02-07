import type { ParachainId } from '@zenlink-interface/chain'
import type { Type as Currency } from '@zenlink-interface/currency'
import { Native, Token } from '@zenlink-interface/currency'
import { NATIVE_ADDRESS } from '@zenlink-interface/smart-router'
import { ZENLINK_DEFAULT_TOKEN_LIST } from '@zenlink-interface/token-lists'
import { SUPPORTED_CHAINS } from './config'

const DEFAULT_TOKENS_MAP = ZENLINK_DEFAULT_TOKEN_LIST
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

export function getToken(chainId: ParachainId, tokenId: string): Currency | undefined {
  if (!SUPPORTED_CHAINS.includes(chainId))
    return undefined
  if (tokenId === 'Native' || tokenId.toLowerCase() === NATIVE_ADDRESS.toLowerCase())
    return Native.onChain(chainId)
  return DEFAULT_TOKENS_MAP.get(chainId)?.get(tokenId.toLowerCase())
}
