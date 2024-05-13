import type { Market } from '@zenlink-interface/market'
import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Checker, Web3Input } from '@zenlink-interface/compat'
import type { Token } from '@zenlink-interface/currency'
import { Amount, tryParseAmount } from '@zenlink-interface/currency'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Button, Currency, Dots, Typography } from '@zenlink-interface/ui'
import { ZERO } from '@zenlink-interface/math'
import { Trans } from '@lingui/macro'
import { MarketRedeemReviewModal } from './MarketRedeemReviewModal'

interface MarketRedeemProps {
  market: Market
}

export const MarketRedeem: FC<MarketRedeemProps> = ({ market }) => {
  const [redeemInput, setRedeemInput] = useState('')
  const [ptToRedeem, ytToRedeem] = useMemo(
    () => [tryParseAmount(redeemInput, market.PT), tryParseAmount(redeemInput, market.YT)],
    [market.PT, market.YT, redeemInput],
  )

  const pyRedeemed = useMemo(() => {
    if (!ptToRedeem || !ytToRedeem)
      return Amount.fromRawAmount(market.SY, ZERO)
    const pyRedeemed = market.YT.getPYRedeemd([ptToRedeem, ytToRedeem])
    return market.SY.previewRedeem(market.SY.yieldToken, pyRedeemed)
  }, [market.SY, market.YT, ptToRedeem, ytToRedeem])

  return (
    <MarketRedeemReviewModal
      inputValue={redeemInput}
      market={market}
      ptToRedeem={ptToRedeem}
      pyRedeemed={pyRedeemed}
      ytToRedeem={ytToRedeem}
    >
    {({ isWritePending, setOpen }) => (
      <MarketRedeemWidget
        market={market}
        pyRedeemed={pyRedeemed}
        redeemInput={redeemInput}
        setRedeemInput={setRedeemInput}
      >
        <Checker.Connected chainId={market.chainId} fullWidth size="md">
          <Checker.Network chainId={market.chainId} fullWidth size="md">
            <Checker.Amounts
              amounts={[ptToRedeem, ytToRedeem]}
              chainId={market.chainId}
              fullWidth
              size="md"
            >
              <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Redeem</Trans>}
              </Button>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connected>
      </MarketRedeemWidget>
    )}
    </MarketRedeemReviewModal>
  )
}

interface MarketRedeemWidgetProps {
  market: Market
  inputValue?: string
  redeemInput?: string
  setRedeemInput?: (input: string) => void
  pyRedeemed: Amount<Token>
  children?: ReactNode
}

export const MarketRedeemWidget: FC<MarketRedeemWidgetProps> = ({
  market,
  inputValue,
  redeemInput,
  setRedeemInput,
  pyRedeemed,
  children,
}) => {
  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={market.PT}
        disableMaxButton={!!inputValue}
        disabled={!!inputValue}
        loading={false}
        onChange={(input: string) => { setRedeemInput?.(input) }}
        tokenMap={{}}
        value={inputValue || redeemInput || ''}
      />
      {!market.isExpired && (
        <>
          <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
            <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
              <PlusIcon height={16} width={16} />
            </div>
          </div>
          <Web3Input.Currency
            chainId={market.chainId}
            className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
            currency={market.YT}
            disableMaxButton={!!inputValue}
            disabled={!!inputValue}
            loading={false}
            onChange={(input: string) => { setRedeemInput?.(input) }}
            tokenMap={{}}
            value={inputValue || redeemInput || ''}
          />
        </>
      )}
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
          <ChevronDownIcon height={16} width={16} />
        </div>
      </div>
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl p-4 gap-1">
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          <Typography variant="lg" weight={500}>{pyRedeemed.toSignificant(6)}</Typography>
          <div className="flex items-center text-sm gap-1">
            <Currency.Icon
              currency={market.SY.yieldToken}
              disableLink
              height={24}
              width={24}
            />
            <Typography variant="base" weight={600}>{market.SY.yieldToken.symbol}</Typography>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
