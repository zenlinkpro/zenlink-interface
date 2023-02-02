import type { TokenInfo, TokenList } from '@zenlink-interface/token-lists'
import { WrappedTokenInfo } from '@zenlink-interface/token-lists'
import { DEFAULT_LIST_OF_LISTS } from '@zenlink-interface/token-lists/lists'
import type { ChainTokenMap } from './types'

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

const mapCache = typeof WeakMap !== 'undefined' ? new WeakMap<TokenList | TokenInfo[], ChainTokenMap>() : null

export function tokensToChainTokenMap(tokens: TokenList | TokenInfo[]): ChainTokenMap {
  const cached = mapCache?.get(tokens)
  if (cached)
    return cached

  const [list, infos] = Array.isArray(tokens) ? [undefined, tokens] : [tokens, tokens.tokens]
  const map = infos.reduce<Mutable<ChainTokenMap>>((map, info) => {
    const token = new WrappedTokenInfo(info, list)
    if (map[token.chainId]?.[token.address] !== undefined) {
      console.warn(`Duplicate token skipped: ${token.address}`)
      return map
    }
    if (!map[token.chainId])
      map[token.chainId] = {}

    map[token.chainId][token.address] = { token, list }
    return map
  }, {}) as ChainTokenMap
  mapCache?.set(tokens, map)
  return map
}

// use ordering of default list of lists to assign priority
export function sortByListPriority(urlA: string, urlB: string) {
  const first = DEFAULT_LIST_OF_LISTS.includes(urlA) ? DEFAULT_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER
  const second = DEFAULT_LIST_OF_LISTS.includes(urlB) ? DEFAULT_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER

  // need reverse order to make sure mapping includes top priority last
  if (first < second)
    return 1
  else if (first > second)
    return -1
  return 0
}
