import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import type { FC, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { Type } from '@zenlink-interface/currency'
import { tryParseAmount } from '@zenlink-interface/currency'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Button, Currency, Dots, Typography } from '@zenlink-interface/ui'
import { Checker, Web3Input } from '@zenlink-interface/compat'
import { Trans } from '@lingui/macro'
import { useTokens } from 'lib/state/token-lists'
import { PricePanel } from 'components'
import { MarketMintReviewModal } from './MarketMintReviewModal'
import { MintTradeProvider, useMintTrade } from './MintTradeProvider'

interface MarketMintProps {
  market: Market
}

export const MarketMint: FC<MarketMintProps> = ({ market }) => {
  const [mintToken, setMintToken] = useState<Type>(market.SY.yieldToken)
  const [mintInput, setMintInput] = useState('')
  const inputTokenAmount = useMemo(
    () => tryParseAmount(mintInput, mintToken),
    [mintInput, mintToken],
  )

  const onSuccess = useCallback(() => {
    setMintInput('')
  }, [])

  return (
    <MintTradeProvider
      amountSpecified={inputTokenAmount}
      currencyOut={market.SY.yieldToken}
      market={market}
    >
      <MarketMintReviewModal
        market={market}
        mintInput={mintInput}
        mintToken={mintToken}
        onSuccess={onSuccess}
      >
        {({ isWritePending, setOpen }) => (
          <MarketMintWidget
            market={market}
            mintInput={mintInput}
            mintToken={mintToken}
            setMintInput={setMintInput}
            setMintToken={setMintToken}
          >
            <Checker.Connected chainId={market.chainId} fullWidth size="md">
              <Checker.Network chainId={market.chainId} fullWidth size="md">
                <Checker.Amounts
                  amounts={[inputTokenAmount]}
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
    </MintTradeProvider>
  )
}

interface MarketMintWidgetProps {
  market: Market
  mintToken: Type
  setMintToken?: (token: Type) => void
  mintInput?: string
  setMintInput?: (input: string) => void
  previewMode?: boolean
  children?: ReactNode
}

export const MarketMintWidget: FC<MarketMintWidgetProps> = ({
  market,
  mintToken,
  setMintToken,
  mintInput,
  setMintInput,
  previewMode = false,
  children,
}) => {
  const tokenMap = useTokens(market.chainId)
  const { ptMinted, ytMinted, isLoading } = useMintTrade()

  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={mintToken}
        disableMaxButton={market.isExpired || previewMode}
        disabled={market.isExpired || previewMode}
        includeHotTokens
        includeNative
        loading={false}
        onChange={(input: string) => { setMintInput?.(input) }}
        onSelect={(tokenMap && !previewMode) ? setMintToken : undefined}
        tokenMap={tokenMap}
        value={mintInput || ''}
      />
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
          <ChevronDownIcon height={16} width={16} />
        </div>
      </div>
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl p-4 gap-1">
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          {isLoading
            ? <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-1/4 h-[20px] animate-pulse" />
            : (
                <div className="flex flex-col items-start">
                  <Typography variant="lg" weight={600}>{ptMinted.toSignificant(6)}</Typography>
                  <PricePanel currency={ptMinted.currency} value={ptMinted.toExact()} />
                </div>
              )}
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market.PT}
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
        <PlusIcon className="m-auto" height={20} width={20} />
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          {isLoading
            ? <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-1/4 h-[20px] animate-pulse" />
            : (
                <div className="flex flex-col items-start">
                  <Typography variant="lg" weight={600}>{ytMinted.toSignificant(6)}</Typography>
                  <PricePanel currency={ytMinted.currency} value={ytMinted.toExact()} />
                </div>
              )}
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market.YT}
              disableLink
              height={24}
              width={24}
            />
            <div className="flex flex-col items-end">
              <Typography variant="base" weight={600}>{market.YT.symbol}</Typography>
              <Typography variant="xs">{getMaturityFormatDate(market)}</Typography>
            </div>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
