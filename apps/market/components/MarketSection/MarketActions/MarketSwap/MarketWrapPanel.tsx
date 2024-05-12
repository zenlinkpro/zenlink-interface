import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Checker, CurrencyInput } from '@zenlink-interface/compat'
import { type Type, tryParseAmount } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { type FC, useCallback, useMemo, useState } from 'react'
import { Button, Dots } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import { MarketWrapReviewModal } from './MarketWrapReviewModal'

interface MarketWrapPanelProps {
  market: Market
}

export const MarketWrapPanel: FC<MarketWrapPanelProps> = ({ market }) => {
  const [input, setInput] = useState<string>('')
  const [[inputToken, outputToken], setTokens] = useState<[Type | undefined, Type | undefined]>(
    [market.SY.yieldToken, market.SY],
  )
  const [output, setOutput] = useState<string>('')

  const wrap = Boolean(outputToken?.equals(market.SY))

  const [parsedInputAmount, paresdOutputAmount] = useMemo(() => {
    return [tryParseAmount(input, inputToken), tryParseAmount(output, outputToken)]
  }, [input, inputToken, output, outputToken])

  const onInput = useCallback((val: string) => {
    setInput(val)
    if (wrap) {
      const wrapAmount = tryParseAmount(val, inputToken)
      if (wrapAmount && inputToken) {
        const outputAmount = market.SY.previewDeposit(inputToken, wrapAmount)
        setOutput(outputAmount.toExact())
      }
      else {
        setOutput('')
      }
    }
    else {
      const unwrapAmount = tryParseAmount(val, inputToken)
      if (unwrapAmount && outputToken) {
        const outputAmount = market.SY.previewRedeem(outputToken, unwrapAmount)
        setOutput(outputAmount.toExact())
      }
      else {
        setOutput('')
      }
    }
  }, [inputToken, market.SY, outputToken, wrap])

  const onOutput = useCallback((val: string) => {
    setOutput(val)
  }, [])

  const switchCurrencies = useCallback(() => {
    setTokens(([prevSrc, prevDst]) => [prevDst, prevSrc])
  }, [])

  const onSuccess = useCallback(() => {
    setInput('')
    setOutput('')
  }, [])

  return (
    <div className="my-2">
      <CurrencyInput
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={inputToken}
        loading={!inputToken}
        onChange={onInput}
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
          loading={!outputToken}
          onChange={onOutput}
          value={output}
        />
        <div className="p-3 pt-0">
          <Checker.Connected chainId={market.chainId} fullWidth size="md">
            <Checker.Amounts
              amounts={[parsedInputAmount]}
              chainId={market.chainId}
              fullWidth
              size="md"
            >
              <Checker.Network chainId={market.chainId} fullWidth size="md">
                <MarketWrapReviewModal
                  chainId={market.chainId}
                  inputAmount={parsedInputAmount}
                  market={market}
                  onSuccess={onSuccess}
                  outputAmount={paresdOutputAmount}
                  wrap={wrap}
                >
                  {({ isWritePending, setOpen }) => {
                    return (
                      <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                        {
                          isWritePending
                            ? <Dots><Trans>Confirm transaction</Trans></Dots>
                            : wrap ? <Trans>Wrap</Trans> : <Trans>Unwrap</Trans>
                        }
                      </Button>
                    )
                  }}
                </MarketWrapReviewModal>
              </Checker.Network>
            </Checker.Amounts>
          </Checker.Connected>
        </div>
      </div>
    </div>
  )
}
