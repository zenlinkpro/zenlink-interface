import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { type Token, type Type, tryParseAmount } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { type FC, useCallback, useMemo, useState } from 'react'
import { Checker } from '@zenlink-interface/compat'
import { Button, Dots } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import { useTokens } from 'lib/state/token-lists'
import { useSettings } from '@zenlink-interface/shared'
import { Percent, ZERO } from '@zenlink-interface/math'
import { TradeProvider, useTrade } from './TradeProvider'
import { CurrencyInput } from './CurrencyInput'
import { MarketSwapReviewModal } from './MarketSwapReviewModal'
import { SwapStatsDisclosure } from './SwapStatsDisclosure'

interface MarketSwapPanelProps {
  market: Market
  isPt: boolean
}

interface TokenMap {
  [address: string]: Token
}

const SWAP_DEFAULT_SLIPPAGE = new Percent(100, 10_000) // 1.00%

export const MarketSwapPanel: FC<MarketSwapPanelProps> = ({ market, isPt }) => {
  const tokenMap = useTokens(market.chainId)

  const defaultTokenMap: TokenMap = useMemo(() => {
    const initialTokenMap = {
      ...tokenMap,
      [market.SY.yieldToken.address]: market.SY.yieldToken,
    }
    return isPt
      ? { ...initialTokenMap, [market.YT.address]: market.YT }
      : { ...initialTokenMap, [market.PT.address]: market.PT }
  }, [isPt, market.PT, market.SY.yieldToken, market.YT, tokenMap])

  const [input, setInput] = useState<string>('')
  const [[inputToken, outputToken], setTokens] = useState<[Type | undefined, Type | undefined]>(
    [market.SY.yieldToken, isPt ? market.PT : market.YT],
  )
  const [output, setOutput] = useState<string>('')
  const [[inputTokenMap, outputTokenMap], setTokenMaps] = useState<[TokenMap | undefined, TokenMap | undefined]>(
    [defaultTokenMap, undefined],
  )

  const [parsedInputAmount] = useMemo(() => {
    return [tryParseAmount(input, inputToken), tryParseAmount(output, outputToken)]
  }, [input, inputToken, output, outputToken])

  const onInput = useCallback((val: string) => {
    setInput(val)
  }, [])

  const onOutput = useCallback((val: string) => {
    setOutput(val)
  }, [])

  const switchCurrencies = useCallback(() => {
    setTokens(([prevSrc, prevDst]) => [prevDst, prevSrc])
    setTokenMaps(([prevSrc, prevDst]) => [prevDst, prevSrc])
  }, [])

  const _setInputToken = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevDst && currency.equals(prevDst) ? [prevDst, prevSrc] : [currency, prevDst]
    })
  }, [])

  const _setOutputToken = useCallback((currency: Type) => {
    setTokens(([prevSrc, prevDst]) => {
      return prevSrc && currency.equals(prevSrc) ? [prevDst, prevSrc] : [prevSrc, currency]
    })
  }, [])

  const onSuccess = useCallback(() => {
    setInput('')
    setOutput('')
  }, [])

  return (
    <TradeProvider
      amountSpecified={parsedInputAmount}
      currencyOut={outputToken}
      market={market}
    >
      <div className="my-2">
        <CurrencyInput
          chainId={market.chainId}
          className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
          currency={inputToken}
          includeHotTokens
          includeNative
          isInputType
          loading={!inputToken}
          onChange={onInput}
          onSelect={inputTokenMap ? _setInputToken : undefined}
          tokenMap={inputTokenMap}
          value={input}
        />
        <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
          <div
            className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full cursor-pointer"
            onClick={switchCurrencies}
          >
            <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
              <ChevronDownIcon height={16} width={16} />
            </div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-slate-700/50 rounded-2xl">
          <CurrencyInput
            chainId={market.chainId}
            className="p-3"
            currency={outputToken}
            disableMaxButton
            disabled
            includeHotTokens
            includeNative
            isInputType={false}
            loading={!outputToken}
            onChange={onOutput}
            onSelect={outputTokenMap ? _setOutputToken : undefined}
            tokenMap={outputTokenMap}
            value={output}
          />
          <SwapStatsDisclosure />
          <div className="p-3 pt-0">
            <Checker.Connected chainId={market.chainId} fullWidth size="md">
              <Checker.Amounts
                amounts={[parsedInputAmount]}
                chainId={market.chainId}
                fullWidth
                size="md"
              >
                <Checker.Network chainId={market.chainId} fullWidth size="md">
                  <MarketSwapReviewModal chainId={market.chainId} market={market} onSuccess={onSuccess}>
                    {({ isWritePending, setOpen }) => {
                      return <SwapButton isWritePending={isWritePending} setOpen={setOpen} />
                    }}
                  </MarketSwapReviewModal>
                </Checker.Network>
              </Checker.Amounts>
            </Checker.Connected>
          </div>
        </div>
      </div>
    </TradeProvider>
  )
}

const SwapButton: FC<{
  isWritePending: boolean
  setOpen: (open: boolean) => void
}> = ({ isWritePending, setOpen }) => {
  const { isLoading: isLoadingTrade, trade, isSyncing } = useTrade()
  const [{ slippageTolerance }] = useSettings()
  const swapSlippage = useMemo(
    () => (slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : SWAP_DEFAULT_SLIPPAGE),
    [slippageTolerance],
  )

  const onClick = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <Checker.Custom
      guard={(
        <Button disabled fullWidth size="md">
          <Trans>No trade found</Trans>
        </Button>
      )}
      showGuardIfTrue={!trade && !isLoadingTrade && !isSyncing}
    >
      <Button
        disabled={
          isWritePending
          || trade?.minimumAmountOut(swapSlippage)?.equalTo(ZERO)
          || Boolean(!trade)
        }
        fullWidth
        onClick={onClick}
        size="md"
      >
        {
          isLoadingTrade
            ? <Trans>Finding Best Price</Trans>
            : isWritePending
              ? <Dots><Trans>Confirm transaction</Trans></Dots>
              : <Trans>Swap</Trans>
        }
      </Button>
    </Checker.Custom>
  )
}
