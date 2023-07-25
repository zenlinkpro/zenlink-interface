import fs from 'node:fs'
import { ApiPromise, WsProvider } from '@polkadot/api'
import configs from './configs'

// please confirm an right chain before use this script
const currentChain = configs.mantaStaging

const writeFileSync = (filePath: string, content: any) => {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2))
}

const getTokens = async (api: ApiPromise) => {
  const tokenListOnChain = (
    await api.query.assetManager.assetIdMetadata.entries()
  ).map(([key, value]) => [key.toHuman(), value.toHuman()])

  const chainProperties: any = (await api.rpc.system.properties()).toHuman()
  const tokens: any = [
    {
      networkId: currentChain.networkId,
      address: `${currentChain.chainId}-0-0`,
      parachainId: currentChain.chainId,
      ethereumChainId: currentChain.chainId,
      assetType: 0,
      assetIndex: 0,
      symbol: chainProperties.tokenSymbol[0],
      decimals: parseInt(chainProperties.tokenDecimals[0], 10),
      name: chainProperties.tokenSymbol[0],
    },
  ]

  tokenListOnChain.forEach((item: any) => {
    const assetId = item[0][0]
    const symbol = item[1].metadata.symbol
    const name = item[1].metadata.name
    const decimals = parseInt(item[1].metadata.decimals, 10)
    tokens.push({
      networkId: currentChain.networkId,
      address: `${currentChain.chainId}-2-${assetId}`,
      parachainId: currentChain.chainId,
      assetType: 2,
      assetIndex: parseInt(assetId, 10),
      symbol,
      decimals,
      name,
    })
  })

  return tokens
}

const getPairs = async (api: ApiPromise) => {
  const pairListOnChain = (
    await api.query.zenlinkProtocol.liquidityPairs.entries()
  ).map(([key, value]) => [key.toHuman(), value.toHuman()])
  const pairStatusOnChain = (
    await api.query.zenlinkProtocol.pairStatuses.entries()
  ).map(([key, value]) => [key.toHuman(), value.toHuman()])

  const formatTokenString = (token: any) =>
    `${token.chainId.replace(/,/g, '')}-${
      token.assetType
    }-${token.assetIndex.replace(/,/g, '')}`

  const pairAccounts: any = {}
  pairStatusOnChain.forEach((item: any) => {
    const account = item[1].Trading.pairAccount
    const token0String = formatTokenString(item[0][0][0])
    const token1String = formatTokenString(item[0][0][1])
    pairAccounts[`${token0String}-${token1String}`] = account
    pairAccounts[`${token1String}-${token0String}`] = account
  })

  const supportTokensMap: any = {}
  const result: any = {}
  pairListOnChain.forEach((item: any) => {
    const token0String = formatTokenString(item[0][0][0])
    const token1String = formatTokenString(item[0][0][1])
    const pairKey = `${token0String}-${token1String}`
    const pairAddress = formatTokenString(item[1])
    supportTokensMap[token0String] = true
    supportTokensMap[token1String] = true
    result[pairKey] = {
      address: pairAddress,
      account: pairAccounts[pairKey],
    }
  })
  currentChain.forceIncludeTokens.forEach((tokenString: string) => {
    supportTokensMap[tokenString] = true
  })
  return {
    pairs: result,
    supportTokens: Object.keys(supportTokensMap),
  }
}

const main = async () => {
  const api = new ApiPromise({
    provider: new WsProvider(currentChain.endPoint),
  })
  await api.isReady

  // Get All pairs form chain
  const { pairs, supportTokens } = await getPairs(api)

  // Get All tokens from chain
  const allTokens = await getTokens(api)
  const tokens = allTokens.filter((token: any) =>
    supportTokens.includes(token.address),
  )

  // Write tokens to file
  console.log('Writing tokens to file')
  const tokenResult = {
    name: currentChain.distTokensTitle,
    timestamp: new Date().toISOString(),
    tokens,
  }
  writeFileSync(currentChain.distTokensFilePath, tokenResult)
  console.log(`Update [${currentChain.distTokensTitle}] tokens done!`)

  // Write pairs to file
  console.log('Writing pairs to file')
  const pairResult = {
    name: currentChain.distPairsTitle,
    timestamp: new Date().toISOString(),
    pairs,
  }
  writeFileSync(currentChain.distPairsFilePath, pairResult)
  console.log(`Update [${currentChain.distTokensTitle}] pairs done!`)

  process.exit(0)
}

main()
