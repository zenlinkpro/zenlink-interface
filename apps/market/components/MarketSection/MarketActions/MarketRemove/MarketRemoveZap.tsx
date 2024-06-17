import { Checker, Web3Input, useAccount, useBalance } from '@zenlink-interface/compat'
import type { Amount, Token, Type } from '@zenlink-interface/currency'
import { tryParseAmount } from '@zenlink-interface/currency'
import type { Market } from '@zenlink-interface/market'
import { Percent } from '@zenlink-interface/math'
import type { FC, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { Button, Dots, classNames } from '@zenlink-interface/ui'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useTokens } from 'lib/state/token-lists'
import { Trans } from '@lingui/macro'
import { useUsdPctChange } from 'lib/hooks'
import { TradeProvider, useTrade } from './TradeProvider'
import { MarketRemoveZapReviewModal } from './MarketRemoveZapReview'

interface MarketRemoveZapProps {
  market: Market
}

export const MarketRemoveZap: FC<MarketRemoveZapProps> = ({ market }) => {
  const { address } = useAccount()
  const [outToken, setOutToken] = useState<Type>(market.SY.yieldToken)
  const [removeInput, setRemoveInput] = useState('')
  const [percentage, setPercentage] = useState<string>('')
  const percentToRemove = useMemo(() => new Percent(percentage, 100), [percentage])

  const { data: lpBalance } = useBalance({ chainId: market.chainId, currency: market, account: address })
  const lpToRemove = useMemo(
    () => lpBalance?.multiply(percentToRemove),
    [lpBalance, percentToRemove],
  )

  const amountToTrade = useMemo(() => {
    if (!lpToRemove || lpToRemove.equalTo(0))
      return undefined

    try {
      const syAmountOut = market.getRemoveLiquiditySingleSy(lpToRemove as Amount<Token>)
      return market.SY.previewRedeem(market.SY.yieldToken, syAmountOut)
    }
    catch {
      return undefined
    }
  }, [lpToRemove, market])

  const onSetRemoveAmount = useCallback((input: string) => {
    setPercentage('')
    setRemoveInput(input)
    const parsedAmount = tryParseAmount(input, market)
    if (parsedAmount && lpBalance) {
      const percent = +new Percent(parsedAmount.quotient, lpBalance.quotient).asFraction.toSignificant(6) * 100
      setPercentage(percent > 100 ? '100' : percent.toFixed(0))
    }
  }, [lpBalance, market])

  const onSetPercentage = useCallback((percent: string) => {
    setPercentage(percent)
    const amount = lpBalance?.multiply(new Percent(percent, 100))
    setRemoveInput(amount?.toExact() || '')
  }, [lpBalance])

  const onSuccess = useCallback(() => {
    onSetPercentage('')
  }, [onSetPercentage])

  return (
    <TradeProvider
      amountSpecified={amountToTrade}
      currencyOut={outToken}
      market={market}
    >
      <MarketRemoveZapReviewModal
        lpToRemove={lpToRemove}
        market={market}
        onSuccess={onSuccess}
        outToken={outToken}
        removeInput={removeInput}
      >
        {({ isWritePending, setOpen }) => (
          <MarketRemoveZapWidget
            lpToRemove={lpToRemove}
            market={market}
            outToken={outToken}
            removeInput={removeInput}
            setOutToken={setOutToken}
            setPercentage={onSetPercentage}
            setRemoveInput={onSetRemoveAmount}
          >
            <Checker.Connected chainId={market.chainId} fullWidth size="md">
              <Checker.Network chainId={market.chainId} fullWidth size="md">
                <Checker.Amounts
                  amounts={[lpToRemove]}
                  chainId={market.chainId}
                  fullWidth
                  size="md"
                >
                  <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                    {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Remove</Trans>}
                  </Button>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connected>
          </MarketRemoveZapWidget>
        )}
      </MarketRemoveZapReviewModal>
    </TradeProvider>
  )
}

interface MarketRemoveZapWidgetProps {
  market: Market
  lpToRemove?: Amount<Type> | undefined
  previewMode?: boolean
  removeInput?: string
  setRemoveInput?: (input: string) => void
  setPercentage?: (input: string) => void
  outToken: Type
  setOutToken?: (token: Type) => void
  children?: ReactNode
}

export const MarketRemoveZapWidget: FC<MarketRemoveZapWidgetProps> = ({
  market,
  removeInput,
  setPercentage,
  lpToRemove,
  setRemoveInput,
  outToken,
  setOutToken,
  previewMode = false,
  children,
}) => {
  const tokenMap = useTokens(market.chainId)
  const { outputAmount, isLoading } = useTrade()
  const usdPctChange = useUsdPctChange({
    chainId: market.chainId,
    inputAmount: lpToRemove,
    outputAmount,
  })

  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className={classNames(
          'p-3 bg-white/50 dark:bg-slate-700/50 rounded-t-2xl',
          !setPercentage && 'rounded-b-2xl',
        )}
        currency={market}
        disableMaxButton={previewMode}
        disabled={previewMode}
        loading={false}
        onChange={(input: string) => { setRemoveInput?.(input) }}
        tokenMap={{}}
        value={removeInput || ''}
      />
      {setPercentage && (
        <div className="flex items-center justify-between bg-white/50 dark:bg-slate-700/50 border-t-2 border-slate-200 dark:border-slate-700 px-4 py-3 rounded-b-2xl">
          <Button onClick={() => setPercentage('25')} size="xs">
            25%
          </Button>
          <Button onClick={() => setPercentage('50')} size="xs">
            50%
          </Button>
          <Button onClick={() => setPercentage('75')} size="xs">
            75%
          </Button>
          <Button onClick={() => setPercentage('100')} size="xs">
            MAX
          </Button>
        </div>
      )}
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
          <ChevronDownIcon height={16} width={16} />
        </div>
      </div>
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl gap-1">
        <Web3Input.Currency
          chainId={market.chainId}
          className="p-3 rounded-2xl"
          currency={outToken}
          disableMaxButton
          disabled
          loading={isLoading}
          onChange={() => { }}
          onSelect={(tokenMap && !previewMode) ? setOutToken : undefined}
          tokenMap={tokenMap}
          usdPctChange={usdPctChange}
          value={outputAmount?.toSignificant(6) || ''}
        />
        {children && <div className="p-4">{children}</div>}
      </div>
    </div>
  )
}
