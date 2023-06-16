import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { TradeType } from '@zenlink-interface/amm'
import { ParachainId } from '@zenlink-interface/chain'
import type { Type } from '@zenlink-interface/currency'
import { DOT, Native, USDC, USDT, tryParseAmount } from '@zenlink-interface/currency'
import { useIsMounted, usePrevious } from '@zenlink-interface/hooks'
import { Button, Dots, Tab, Widget } from '@zenlink-interface/ui'
import { WrapType } from '@zenlink-interface/wagmi'
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Percent, ZERO } from '@zenlink-interface/math'
import { useCustomTokens, useSettings } from '@zenlink-interface/shared'
import { Checker, TokenListImportChecker, isEvmNetwork } from '@zenlink-interface/compat'
import { isAddress } from '@zenlink-interface/format'
import { warningSeverity } from 'lib/functions'
import { useTokens } from 'lib/state/token-lists'
import {
  CurrencyInput,
  Layout,
  ReferralsLinkButton,
  SettingsOverlay,
  SwapReviewModal,
  SwapStatsDisclosure,
  TradeProvider,
  WrapReviewModal,
  useTrade,
} from 'components'
import { Trans, t } from '@lingui/macro'

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

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000) // 0.50%

const getDefaultToken1 = (chainId: number): Type | undefined => {
  if (chainId in USDC)
    return USDC[chainId as keyof typeof USDC]
  if (chainId in USDT)
    return USDT[chainId as keyof typeof USDT]
  if (chainId in DOT)
    return DOT[chainId as keyof typeof DOT]
  return undefined
}

function Swap(initialState: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isMounted = useIsMounted()
  const router = useRouter()
  const [{ parachainId }] = useSettings()

  const defaultChainId = ParachainId.CALAMARI_KUSAMA
  const queryChainId = router.query.chainId ? Number(router.query.chainId) : undefined
  const chainId = queryChainId || (parachainId || defaultChainId)
  const previousChainId = usePrevious(chainId)

  useEffect(() => {
    if (
      previousChainId
      && chainId !== previousChainId
      && chainId !== Number(router?.query?.chainId)
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
  }, [router, previousChainId, chainId])

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

  const wrap = Boolean(isEvmNetwork(chainId) && token0 && token1 && token0.isNative && token1.equals(Native.onChain(token1.chainId).wrapped))
  const unwrap = Boolean(isEvmNetwork(chainId) && token0 && token1 && token1.isNative && token0.equals(Native.onChain(token0.chainId).wrapped))
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

  const amounts = useMemo(() => [parsedInput0], [parsedInput0])

  useEffect(() => {
    setTokens([inputToken, outputToken])
    setInput0(initialState.input0)
    setInput1('')
  }, [chainId, initialState.input0, inputToken, outputToken])

  const onSuccess = useCallback(() => {
    setInput0('')
    setInput1('')
  }, [])

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
      chainId={chainId}
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
        <div className="flex flex-col items-center">
          <Widget id="swap" maxWidth={440}>
            <Widget.Content>
              <Widget.Header title={<Trans>Swap</Trans>} className="!pb-3">
                <SettingsOverlay chainId={chainId} />
              </Widget.Header>
              <CurrencyInput
                className="p-3 h-[96px]"
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
                  className="group bg-slate-300 dark:bg-slate-700 p-0.5 border-2 border-slate-400 dark:border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
                >
                  <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                    <ChevronDownIcon width={16} height={16} />
                  </div>
                </button>
              </div>
              <div className="bg-slate-200 dark:bg-slate-800">
                <CurrencyInput
                  disabled
                  className="p-3 h-[96px]"
                  value={isWrap ? input0 : input1}
                  onChange={onInput1}
                  disableMaxButton
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
                <div className="p-3 pt-0">
                  <Checker.Connected chainId={chainId} fullWidth size="md">
                    <Checker.Amounts
                      fullWidth
                      size="md"
                      chainId={chainId}
                      amounts={amounts}
                    >
                      <Checker.Network fullWidth size="md" chainId={chainId}>
                        {isWrap
                          ? (
                            <WrapReviewModal
                              chainId={chainId}
                              input0={parsedInput0}
                              input1={parsedInput1}
                              wrapType={wrap ? WrapType.Wrap : WrapType.Unwrap}
                            >
                              {({ isWritePending, setOpen }) => {
                                return (
                                  <Button disabled={isWritePending} fullWidth size="md" onClick={() => setOpen(true)}>
                                    {wrap ? 'Wrap' : 'Unwrap'}
                                  </Button>
                                )
                              }}
                            </WrapReviewModal>
                            )
                          : (
                            <SwapReviewModal chainId={chainId} onSuccess={onSuccess}>
                              {({ isWritePending, setOpen }) => {
                                return <SwapButton isWritePending={isWritePending} setOpen={setOpen} />
                              }}
                            </SwapReviewModal>
                            )}
                      </Checker.Network>
                    </Checker.Amounts>
                  </Checker.Connected>
                </div>
              </div>
            </Widget.Content>
          </Widget>
          <ReferralsLinkButton chainId={chainId} />
        </div>
      </TradeProvider>
    </TokenListImportChecker>
  )
}

const SwapButton: FC<{
  isWritePending: boolean
  setOpen(open: boolean): void
}> = ({ isWritePending, setOpen }) => {
  const { isLoading: isLoadingTrade, trade, isSyncing } = useTrade()
  const [{ slippageTolerance }] = useSettings()
  const swapSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance],
  )

  const priceImpactSeverity = useMemo(() => warningSeverity(trade?.priceImpact), [trade])
  const priceImpactTooHigh = priceImpactSeverity > 3

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <Checker.Custom
      showGuardIfTrue={!trade && !isLoadingTrade && !isSyncing}
      guard={
        <Button fullWidth disabled size="md">
          <Trans>No trade found</Trans>
        </Button>
      }
    >
      <Button
        fullWidth
        onClick={onClick}
        disabled={
          isWritePending
          || priceImpactTooHigh
          || trade?.minimumAmountOut(swapSlippage)?.equalTo(ZERO)
          || Boolean(!trade && priceImpactSeverity > 2)
        }
        size="md"
        color={isLoadingTrade || isSyncing
          ? 'blue'
          : priceImpactTooHigh || priceImpactSeverity > 2 ? 'red' : 'blue'
        }
        {...(Boolean(!trade && priceImpactSeverity > 2) && {
          title: t`Enable expert mode to swap with high price impact`,
        })}
      >
        {isLoadingTrade
          ? (
              t`Finding Best Price`
            )
          : isWritePending
            ? (
              <Dots><Trans>Confirm transaction</Trans></Dots>
              )
            : priceImpactTooHigh
              ? (
                  t`High Price Impact`
                )
              : trade && priceImpactSeverity > 2
                ? (
                    t`Swap Anyway`
                  )
                : (
                    t`Swap`
                  )}
      </Button>
    </Checker.Custom>
  )
}

function SwapPage(initialState: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <Swap {...initialState} />
    </Layout>
  )
}

export default SwapPage
