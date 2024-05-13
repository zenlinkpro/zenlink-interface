import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import type { Token } from '@zenlink-interface/currency'
import { Amount, tryParseAmount } from '@zenlink-interface/currency'
import { ZERO } from '@zenlink-interface/math'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Button, Currency, Dots, Typography } from '@zenlink-interface/ui'
import { Checker, Web3Input } from '@zenlink-interface/compat'
import { Trans } from '@lingui/macro'
import { MarketMintReviewModal } from './MarketMintReviewModal'

interface MarketMintProps {
  market: Market
}

export const MarketMint: FC<MarketMintProps> = ({ market }) => {
  const [mintInput, setMintInput] = useState('')
  const yieldToMints = useMemo(
    () => tryParseAmount(mintInput, market.SY.yieldToken),
    [market.SY.yieldToken, mintInput],
  )

  const [ptMinted, ytMinted] = useMemo(() => {
    if (!yieldToMints)
      return [Amount.fromRawAmount(market.PT, ZERO), Amount.fromRawAmount(market.YT, ZERO)]
    const syToMints = market.SY.previewDeposit(yieldToMints.currency, yieldToMints)
    return market.YT.getPYMinted(syToMints)
  }, [market.PT, market.SY, market.YT, yieldToMints])

  return (
    <MarketMintReviewModal
      inputValue={mintInput}
      market={market}
      ptMinted={ptMinted}
      yieldToMints={yieldToMints}
      ytMinted={ytMinted}
    >
    {({ isWritePending, setOpen }) => (
      <MarketMintWidget
        market={market}
        mintInput={mintInput}
        ptMinted={ptMinted}
        setMintInput={setMintInput}
        ytMinted={ytMinted}
      >
        <Checker.Connected chainId={market.chainId} fullWidth size="md">
          <Checker.Network chainId={market.chainId} fullWidth size="md">
            <Checker.Amounts
              amounts={[yieldToMints]}
              chainId={market.chainId}
              fullWidth
              size="md"
            >
              <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Mint</Trans>}
              </Button>
            </Checker.Amounts>
          </Checker.Network>
        </Checker.Connected>
      </MarketMintWidget>
    )}
    </MarketMintReviewModal>
  )
}

interface MarketMintWidgetProps {
  market: Market
  inputValue?: string
  mintInput?: string
  setMintInput?: (input: string) => void
  ptMinted: Amount<Token>
  ytMinted: Amount<Token>
  children?: ReactNode
}

export const MarketMintWidget: FC<MarketMintWidgetProps> = ({
  market,
  inputValue,
  mintInput,
  setMintInput,
  ptMinted,
  ytMinted,
  children,
}) => {
  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={market.SY.yieldToken}
        disableMaxButton={market.isExpired || !!inputValue}
        disabled={market.isExpired || !!inputValue}
        loading={false}
        onChange={(input: string) => { setMintInput?.(input) }}
        tokenMap={{}}
        value={inputValue || mintInput || ''}
      />
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
          <ChevronDownIcon height={16} width={16} />
        </div>
      </div>
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl p-4 gap-1">
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          <Typography variant="lg" weight={500}>{ptMinted.toSignificant(6)}</Typography>
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market.PT}
              disableLink
              height={24}
              width={24}
            />
            <div className="flex flex-col items-end">
              <Typography variant="sm" weight={600}>{`PT ${market.SY.yieldToken.symbol}`}</Typography>
              <Typography variant="xxs">{getMaturityFormatDate(market)}</Typography>
            </div>
          </div>
        </div>
        <PlusIcon className="m-auto" height={20} width={20} />
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          <Typography variant="lg" weight={500}>{ytMinted.toSignificant(6)}</Typography>
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market.YT}
              disableLink
              height={24}
              width={24}
            />
            <div className="flex flex-col items-end">
              <Typography variant="sm" weight={600}>{`YT ${market.SY.yieldToken.symbol}`}</Typography>
              <Typography variant="xxs">{getMaturityFormatDate(market)}</Typography>
            </div>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
