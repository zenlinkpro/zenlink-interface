import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { ApiPromise, WsProvider } from '@polkadot/api'
import type { Address } from '@wagmi/core'
import { fetchBalance, fetchToken } from '@wagmi/core'
import { fetchZLKTokenInfo } from '@zenlink-interface/graph-client'
import {
  EVM_CHAINS,
  SUBSTRATE_CHAINS,
  SYSTEM_ZLK_HOLDERS,
  WS_ENDPOINTS,
  ZENLINK_CHAINS,
  ZLK_DEAD_ADDRESSES,
  ZLK_EVM_ADDRESSES,
} from './config'

export async function fetchZenlinkTokenBurnedInfo(chainId: ParachainId) {
  const result = await fetchZLKTokenInfo(chainId)
  return Number(result.data?.burn ?? '0')
}

export async function fetchBifrostKusamaZLKInfo() {
  const api = await new ApiPromise({
    provider: new WsProvider(WS_ENDPOINTS[ParachainId.BIFROST_KUSAMA]),
  }).isReady
  const [totalIssuance, systemHoldersBalances, burnedAmount] = await Promise.all([
    api.query.tokens.totalIssuance({ Token: 'ZLK' }),
    api.query.assets.account.multi(
      SYSTEM_ZLK_HOLDERS[ParachainId.BIFROST_KUSAMA].map(account => ([account, { Token: 'ZLK' }])),
    ),
    fetchZenlinkTokenBurnedInfo(ParachainId.BIFROST_KUSAMA),
  ])

  const totalSystemHolder = systemHoldersBalances.reduce(
    (total, balance) => total + BigInt((balance.toJSON() as { free: string }).free), BigInt(0),
  )
  const totalIssueAmount = BigInt(totalIssuance.toJSON() as string)

  await api.disconnect()

  return {
    totalDistribute: (totalIssueAmount - totalSystemHolder - BigInt(burnedAmount)).toString(),
    burn: burnedAmount.toString(),
  }
}

export async function fetchEvmZLKInfo(chainId: ParachainId) {
  const [zlkInfo, systemBalances, burnedBalances] = await Promise.all([
    fetchToken({
      address: ZLK_EVM_ADDRESSES[chainId] as Address,
      chainId: chainsParachainIdToChainId[chainId],
    }),
    Promise.all(SYSTEM_ZLK_HOLDERS[chainId].map(address => fetchBalance({
      address: address as Address,
      token: ZLK_EVM_ADDRESSES[chainId] as Address,
      chainId: chainsParachainIdToChainId[chainId],
    }))),
    Promise.all(ZLK_DEAD_ADDRESSES[chainId].map(address => fetchBalance({
      address: address as Address,
      token: ZLK_EVM_ADDRESSES[chainId] as Address,
      chainId: chainsParachainIdToChainId[chainId],
    }))),
  ])

  const totalSupply = zlkInfo.totalSupply.value
  const totalSystemBalances = systemBalances.reduce(
    (total, balance) => total + balance.value, BigInt(0),
  )
  const totalBurnedBalances = burnedBalances.reduce(
    (total, balance) => total + balance.value, BigInt(0),
  )

  return {
    totalDistribute: (totalSupply - totalSystemBalances).toString(),
    burn: totalBurnedBalances.toString(),
  }
}

export async function fetchZLKInfo(chainId: ParachainId) {
  if (SUBSTRATE_CHAINS.includes(chainId))
    return await fetchBifrostKusamaZLKInfo()
  if (EVM_CHAINS.includes(chainId))
    return await fetchEvmZLKInfo(chainId)
}

export async function getZLKInfo() {
  const results = await Promise.all(
    ZENLINK_CHAINS.map(chainId => fetchZLKInfo(chainId)),
  )
  return results.map((result, i) => ({ chainId: ZENLINK_CHAINS[i], result }))
}
