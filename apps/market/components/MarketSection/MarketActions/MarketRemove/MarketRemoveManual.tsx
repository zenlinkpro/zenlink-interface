import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Checker, Web3Input, useAccount } from '@zenlink-interface/compat'
import type { Token, Type } from '@zenlink-interface/currency'
import { Amount, tryParseAmount } from '@zenlink-interface/currency'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import { Percent, ZERO } from '@zenlink-interface/math'
import { Button, Currency, Dots, Typography, classNames } from '@zenlink-interface/ui'
import { useBalance } from '@zenlink-interface/wagmi'
import type { FC, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { Trans } from '@lingui/macro'
import { PricePanel } from 'components'
import { MarketRemoveManualReviewModal } from './MarketRemoveManualReviewModal'

interface MarketRemoveManualProps {
  market: Market
}

export const MarketRemoveManual: FC<MarketRemoveManualProps> = ({ market }) => {
  const { address } = useAccount()
  const [removeInput, setRemoveInput] = useState('')
  const [percentage, setPercentage] = useState<string>('')
  const percentToRemove = useMemo(() => new Percent(percentage, 100), [percentage])

  const { data: lpBalance } = useBalance({ chainId: market.chainId, currency: market, account: address })

  const [tokenUnderlying, ptUnderlying] = useMemo(() => {
    if (!lpBalance || market.marketState.totalLp.equalTo(ZERO))
      return []
    const tokenReserve = market.SY.previewRedeem(market.SY.yieldToken, market.marketState.totalSy)
    const ptReserve = market.marketState.totalPt
    return [
      tokenReserve.multiply(lpBalance.divide(market.marketState.totalLp)),
      ptReserve.multiply(lpBalance.divide(market.marketState.totalLp)),
    ]
  }, [lpBalance, market.SY, market.marketState.totalLp, market.marketState.totalPt, market.marketState.totalSy])

  const tokenRemoved = useMemo(
    () => lpBalance
      ? percentToRemove && percentToRemove.greaterThan('0') && tokenUnderlying
        ? Amount.fromRawAmount(market.SY.yieldToken, percentToRemove.multiply(tokenUnderlying.quotient).quotient)
        : Amount.fromRawAmount(market.SY.yieldToken, ZERO)
      : undefined,
    [lpBalance, market.SY.yieldToken, percentToRemove, tokenUnderlying],
  )

  const ptRemoved = useMemo(
    () => lpBalance
      ? percentToRemove && percentToRemove.greaterThan('0') && ptUnderlying
        ? Amount.fromRawAmount(market.PT, percentToRemove.multiply(ptUnderlying.quotient).quotient)
        : Amount.fromRawAmount(market.PT, ZERO)
      : undefined,
    [lpBalance, market.PT, percentToRemove, ptUnderlying],
  )

  const lpToRemove = useMemo(
    () => lpBalance?.multiply(percentToRemove),
    [lpBalance, percentToRemove],
  )

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
    <MarketRemoveManualReviewModal
      lpToRemove={lpToRemove}
      market={market}
      onSuccess={onSuccess}
      ptRemoved={ptRemoved}
      removeInputValue={removeInput}
      tokenRemoved={tokenRemoved}
    >
      {({ isWritePending, setOpen }) => (
        <MarketRemoveManualWidget
          lpToRemove={lpToRemove}
          market={market}
          ptRemoved={ptRemoved}
          removeInput={removeInput}
          setPercentage={onSetPercentage}
          setRemoveInput={onSetRemoveAmount}
          tokenRemoved={tokenRemoved}
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
        </MarketRemoveManualWidget>
      )}
    </MarketRemoveManualReviewModal>
  )
}

interface MarketRemoveManualWidgetProps {
  market: Market
  lpToRemove?: Amount<Type>
  tokenRemoved?: Amount<Token>
  ptRemoved?: Amount<Token>
  removeInputValue?: string
  removeInput?: string
  setRemoveInput?: (input: string) => void
  setPercentage?: (input: string) => void
  children?: ReactNode
}

export const MarketRemoveManualWidget: FC<MarketRemoveManualWidgetProps> = ({
  market,
  tokenRemoved,
  ptRemoved,
  removeInput,
  removeInputValue,
  setPercentage,
  setRemoveInput,
  children,
}) => {
  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className={classNames(
          'p-3 bg-white/50 dark:bg-slate-700/50 rounded-t-2xl',
          !setPercentage && 'rounded-b-2xl',
        )}
        currency={market}
        disableMaxButton={!!removeInputValue}
        disabled={!!removeInputValue}
        loading={false}
        onChange={(input: string) => { setRemoveInput?.(input) }}
        tokenMap={{}}
        value={removeInputValue || removeInput || ''}
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
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl p-4 gap-1">
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          <div className="flex flex-col items-start">
            <Typography variant="lg" weight={600}>{tokenRemoved?.toSignificant(6)}</Typography>
            <PricePanel currency={tokenRemoved?.currency} value={tokenRemoved?.toExact() || '0'} />
          </div>
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market.SY.yieldToken}
              disableLink
              height={24}
              width={24}
            />
            <div className="flex flex-col items-end">
              <Typography variant="base" weight={600}>{market.SY.yieldToken.symbol}</Typography>
              <Typography variant="xs">{getMaturityFormatDate(market)}</Typography>
            </div>
          </div>
        </div>
        <PlusIcon className="m-auto" height={20} width={20} />
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          <div className="flex flex-col items-start">
            <Typography variant="lg" weight={600}>{ptRemoved?.toSignificant(6)}</Typography>
            <PricePanel currency={ptRemoved?.currency} value={ptRemoved?.toExact() || '0'} />
          </div>
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market.YT}
              disableLink
              height={24}
              width={24}
            />
            <div className="flex flex-col items-end">
              <Typography variant="base" weight={600}>{market.PT.symbol}</Typography>
              <Typography variant="xs">{getMaturityFormatDate(market)}</Typography>
            </div>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
