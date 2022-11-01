import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { isAddress } from '@ethersproject/address'
import { TradeType } from '@zenlink-interface/amm'
import { ParachainId, chainsChainIdToParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { Native, USDC, tryParseAmount } from '@zenlink-interface/currency'
import { useIsMounted, usePrevious } from '@zenlink-interface/hooks'
import { Widget, classNames } from '@zenlink-interface/ui'
import { TokenListImportChecker, useWalletState } from '@zenlink-interface/wagmi'
import { CurrencyInput, Layout, SettingsOverlay, SwapStatsDisclosure, TradeProvider } from 'components'
import { useCustomTokens } from 'lib/state/storage'
import { useTokens } from 'lib/state/token-lists'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useConnect, useNetwork } from 'wagmi'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const { chainId, token0, token1, input0 } = query
  return {
    props: {
      chainId: chainId ?? null,
      token0: token0 ?? null,
      token1: token1 ?? null,
      input0: !isNaN(Number(input0)) ? input0 : '',
    },
  }
}

const getDefaultToken1 = (chainId: number): Type | undefined => {
  if (chainId in USDC)
    return USDC[chainId]
  return undefined
}

function Swap(initialState: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const connect = useConnect()
  const { connecting, notConnected } = useWalletState(!!connect.pendingConnector)
  const router = useRouter()

  const defaultChainId = ParachainId.ASTAR
  const activeChainId = chain ? chainsChainIdToParachainId[chain.id] : undefined
  const queryChainId = router.query.chainId ? Number(router.query.chainId) : undefined
  const chainId = queryChainId
    || (activeChainId || (!connecting && notConnected ? defaultChainId : undefined))
  const previousChain = usePrevious(chain)

  useEffect(() => {
    if (
      chain
      && previousChain
      && chain.id !== previousChain.id
      && chain.id !== Number(router?.query?.chainId)
    ) {
      // Clear up the query string if user changes network
      // whilst there is a chainId parameter in the query...
      delete router.query.chainId
      delete router.query.token0
      delete router.query.token1
      delete router.query.input0
      router.replace(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { shallow: true },
      )
    }
  }, [router, chain, previousChain])

  const tokenMap = useTokens(chainId)
  const [customTokensMap, { addCustomToken, removeCustomToken, addCustomTokens }] = useCustomTokens(chainId)

  const inputToken = useMemo(() => {
    if (!chainId || !isMounted || Object.keys(tokenMap).length === 0)
      return undefined
    if (initialState.token0 && initialState.token0 in tokenMap)
      return tokenMap[initialState.token0]
    if (initialState.token0 && initialState.token0.toLowerCase() in customTokensMap)
      return customTokensMap[initialState.token0.toLowerCase()]
    return Native.onChain(chainId)
  }, [chainId, customTokensMap, initialState.token0, isMounted, tokenMap])

  const outputToken = useMemo(() => {
    if (!chainId || !isMounted || Object.keys(tokenMap).length === 0)
      return undefined
    if (initialState.token1 && initialState.token1 in tokenMap)
      return tokenMap[initialState.token1]
    if (initialState.token1 && initialState.token1.toLowerCase() in customTokensMap)
      return customTokensMap[initialState.token1.toLowerCase()]
    return getDefaultToken1(chainId)
  }, [chainId, customTokensMap, initialState.token1, isMounted, tokenMap])

  const [input0, setInput0] = useState<string>(initialState.input0)
  const [[token0, token1], setTokens] = useState<[Type | undefined, Type | undefined]>([inputToken, outputToken])
  const [input1, setInput1] = useState<string>('')
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT)

  const wrap = Boolean(token0 && token1 && token0.isNative && token1.equals(Native.onChain(token1.chainId).wrapped))
  const unwrap = Boolean(token0 && token1 && token1.isNative && token0.equals(Native.onChain(token0.chainId).wrapped))
  const isWrap = wrap || unwrap

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(isWrap ? input0 : input1, token1)]
  }, [input0, input1, isWrap, token0, token1])

  const onInput0 = useCallback((val: string) => {
    setTradeType(TradeType.EXACT_INPUT)
    setInput0(val)
  }, [])

  const onInput1 = useCallback((val: string) => {
    setTradeType(TradeType.EXACT_OUTPUT)
    setInput1(val)
  }, [])

  const switchCurrencies = useCallback(() => {
    setTokens(([prevSrc, prevDst]) => [prevDst, prevSrc])
  }, [])

  // const amounts = useMemo(() => [parsedInput0], [parsedInput0])

  useEffect(() => {
    setTokens([inputToken, outputToken])
    setInput0(initialState.input0)
    setInput1('')
  }, [chainId, initialState.input0, inputToken, outputToken])

  // const onSuccess = useCallback(() => {
  //   setInput0('')
  //   setInput1('')
  // }, [])

  const _setToken0 = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevDst && currency.equals(prevDst) ? [prevDst, prevSrc] : [currency, prevDst]
    })
  }, [])

  const _setToken1 = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevSrc && currency.equals(prevSrc) ? [prevDst, prevSrc] : [prevSrc, currency]
    })
  }, [])

  const checkIfImportedTokens = useMemo(() => {
    const tokens: { address: string; chainId: number }[] = []
    if (initialState.token0 && isAddress(initialState.token0))
      tokens.push({ address: initialState.token0, chainId: Number(initialState.chainId) })
    if (initialState.token1 && isAddress(initialState.token1))
      tokens.push({ address: initialState.token1, chainId: Number(initialState.chainId) })
    return tokens
  }, [initialState.chainId, initialState.token0, initialState.token1])

  return (
    <TokenListImportChecker
      onAddTokens={addCustomTokens}
      customTokensMap={customTokensMap}
      tokenMap={tokenMap}
      tokens={checkIfImportedTokens}
    >
      <TradeProvider
        chainId={chainId}
        tradeType={tradeType}
        amountSpecified={tradeType === TradeType.EXACT_INPUT ? parsedInput0 : parsedInput1}
        mainCurrency={token0}
        otherCurrency={token1}
      >
        <Layout>
          <Widget id="swap" maxWidth={400}>
            <Widget.Content>
              <div className={classNames('p-3 mx-0.5 items-center pb-4 font-medium')}>
                <div className="flex justify-end">
                  <SettingsOverlay chainId={chainId} />
                </div>
              </div>
              <CurrencyInput
                className="p-3"
                value={input0}
                onChange={onInput0}
                currency={token0}
                onSelect={_setToken0}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={chainId}
                tokenMap={tokenMap}
                inputType={TradeType.EXACT_INPUT}
                tradeType={tradeType}
                loading={!token0}
              />
              <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                <button
                  type="button"
                  onClick={switchCurrencies}
                  className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
                >
                  <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                    <ChevronDownIcon width={16} height={16} />
                  </div>
                </button>
              </div>
              <div className="bg-slate-800">
                <CurrencyInput
                  disabled={true}
                  className="p-3"
                  value={isWrap ? input0 : input1}
                  onChange={onInput1}
                  currency={token1}
                  onSelect={_setToken1}
                  customTokenMap={customTokensMap}
                  onAddToken={addCustomToken}
                  onRemoveToken={removeCustomToken}
                  chainId={chainId}
                  tokenMap={tokenMap}
                  inputType={TradeType.EXACT_OUTPUT}
                  tradeType={tradeType}
                  loading={!token1}
                  isWrap={isWrap}
                />
                <SwapStatsDisclosure />
              </div>
            </Widget.Content>
          </Widget>
        </Layout>
      </TradeProvider>
    </TokenListImportChecker>
  )
}

export default Swap
