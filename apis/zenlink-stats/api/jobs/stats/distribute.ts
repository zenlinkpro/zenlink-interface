import { ParachainId, chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { fetchBalance, fetchToken } from '@wagmi/core'

import { fetchZLKBurn } from '@zenlink-interface/graph-client'
import { BURN_ZLK_HOLDER, SYSTEM_ZLK_HOLDER, WS_ENDPOINT, ZENLINK_CHAINS, ZLK_EVM_ADDRESS } from './config'

export async function fetchBifrostKusamaBurn(chainId: ParachainId) {
  const result = await fetchZLKBurn(chainId)
  const burn = result.data?.zlkInfoById.burn ?? '0'
  return Promise.resolve(burn)
}
export async function fetchBifrostKusamaZLKDistributeAndBurn() {
  const wsEndpoint = WS_ENDPOINT[ParachainId.BIFROST_KUSAMA]

  const api = await new ApiPromise({
    provider: new WsProvider(wsEndpoint),
  }).isReady

  const totalIssue = await api.query.tokens.totalIssuance({
    Token: 'ZLK',
  })

  const systemZLKHolder = SYSTEM_ZLK_HOLDER[ParachainId.BIFROST_KUSAMA]

  const systemHolderBalance = await api.query.tokens.accounts.multi(systemZLKHolder.map(account => ([account, { Token: 'ZLK' }])))

  const totalSystemHolder = systemHolderBalance.reduce((total, cur) => {
    return total + BigInt((cur.toJSON() as any).free)
  }, BigInt(0))

  const totalIssueAmount = BigInt(totalIssue.toJSON() as string)

  const burn = await fetchBifrostKusamaBurn(ParachainId.BIFROST_KUSAMA)

  const totalDistribute = totalIssueAmount - totalSystemHolder - BigInt(burn)
  await api.disconnect()

  return {
    totalDistribute: totalDistribute.toString(),
    burn: burn.toString(),
  }
}

export async function fetchEvmZLKDistributeAndBurn(chainId: ParachainId) {
  const zlkAddress = ZLK_EVM_ADDRESS[chainId]

  const ethereumChainId = chainsParachainIdToChainId[chainId]
  const tokenInfo = await fetchToken({
    address: zlkAddress as any,
    chainId: ethereumChainId,
  })

  const totalSupply = tokenInfo.totalSupply.value.toBigInt()

  const systemZLKHolder = SYSTEM_ZLK_HOLDER[chainId]

  const result = await Promise.all(systemZLKHolder.map(address => fetchBalance({
    address: address as any,
    token: zlkAddress as any,
    chainId: ethereumChainId,
  })))

  const totalSystemHolder = result.reduce((total, cur) => {
    return total + cur.value.toBigInt()
  }, BigInt(0))

  const totalDistribute = totalSupply - totalSystemHolder

  const burnZLKHolder = BURN_ZLK_HOLDER[chainId]
  const burnResult = await Promise.all(burnZLKHolder.map(address => fetchBalance({
    address: address as any,
    token: zlkAddress as any,
    chainId: ethereumChainId,
  })))
  const totalBurn = burnResult.reduce((total, cur) => {
    return total + cur.value.toBigInt()
  }, BigInt(0))

  return {
    totalDistribute: totalDistribute.toString(),
    burn: totalBurn.toString(),
  }
}

export async function fetchZLKDistributeAndBurn(chainId: ParachainId) {
  if (chainId === ParachainId.BIFROST_KUSAMA)
    return await fetchBifrostKusamaZLKDistributeAndBurn()
  if (
    chainId === ParachainId.MOONBEAM
    || chainId === ParachainId.MOONRIVER
    || chainId === ParachainId.ASTAR
  )
    return await fetchEvmZLKDistributeAndBurn(chainId)
}

export async function getZLKDistributeAndBurn() {
  const results = await Promise.all(
    ZENLINK_CHAINS.map(chainId => fetchZLKDistributeAndBurn(chainId)),
  )
  const chainsResults = results.map((item, i) => ({
    chainId: ZENLINK_CHAINS[i],
    result: item,
  }))
  // console.log(chainsResults)
  return chainsResults
}
