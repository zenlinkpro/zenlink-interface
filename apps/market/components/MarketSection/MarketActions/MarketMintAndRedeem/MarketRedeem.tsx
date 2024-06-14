import type { Market } from '@zenlink-interface/market'
import type { FC, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { Checker, Web3Input } from '@zenlink-interface/compat'
import type { Type } from '@zenlink-interface/currency'
import { tryParseAmount } from '@zenlink-interface/currency'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Button, Dots } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import { useTokens } from 'lib/state/token-lists'
import { MarketRedeemReviewModal } from './MarketRedeemReviewModal'
import { RedeemTradeProvider, useRedeemTrade } from './RedeemTradeProvider'

interface MarketRedeemProps {
  market: Market
}

export const MarketRedeem: FC<MarketRedeemProps> = ({ market }) => {
  const [redeemToken, setRedeemToken] = useState<Type>(market.SY.yieldToken)
  const [redeemInput, setRedeemInput] = useState('')
  const [ptToRedeem, ytToRedeem] = useMemo(
    () => [tryParseAmount(redeemInput, market.PT), tryParseAmount(redeemInput, market.YT)],
    [market.PT, market.YT, redeemInput],
  )

  const pyRedeemed = useMemo(() => {
    if (!ptToRedeem || !ytToRedeem)
      return undefined
    const pyRedeemed = market.YT.getPYRedeemd([ptToRedeem, ytToRedeem])
    return market.SY.previewRedeem(market.SY.yieldToken, pyRedeemed)
  }, [market.SY, market.YT, ptToRedeem, ytToRedeem])

  const onSuccess = useCallback(() => {
    setRedeemInput('')
  }, [])

  return (
    <RedeemTradeProvider
      amountSpecified={pyRedeemed}
      currencyOut={redeemToken}
      market={market}
    >
      <MarketRedeemReviewModal
        market={market}
        onSuccess={onSuccess}
        ptToRedeem={ptToRedeem}
        redeemInput={redeemInput}
        redeemToken={redeemToken}
        ytToRedeem={ytToRedeem}
      >
        {({ isWritePending, setOpen }) => (
          <MarketRedeemWidget
            market={market}
            redeemInput={redeemInput}
            redeemToken={redeemToken}
            setRedeemInput={setRedeemInput}
            setRedeemToken={setRedeemToken}
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
    </RedeemTradeProvider>
  )
}

interface MarketRedeemWidgetProps {
  market: Market
  redeemToken: Type
  setRedeemToken?: (token: Type) => void
  redeemInput?: string
  setRedeemInput?: (input: string) => void
  previewMode?: boolean
  children?: ReactNode
}

export const MarketRedeemWidget: FC<MarketRedeemWidgetProps> = ({
  market,
  redeemToken,
  setRedeemToken,
  redeemInput,
  setRedeemInput,
  previewMode = false,
  children,
}) => {
  const tokenMap = useTokens(market.chainId)

  const { isLoading, outputAmount } = useRedeemTrade()

  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={market.PT}
        disableMaxButton={previewMode}
        disabled={previewMode}
        loading={false}
        onChange={(input: string) => { setRedeemInput?.(input) }}
        tokenMap={{}}
        value={redeemInput || ''}
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
            disableMaxButton={previewMode}
            disabled={previewMode}
            loading={false}
            onChange={(input: string) => { setRedeemInput?.(input) }}
            tokenMap={{}}
            value={redeemInput || ''}
          />
        </>
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
          currency={redeemToken}
          disableMaxButton
          disabled
          loading={isLoading}
          onChange={() => { }}
          onSelect={(tokenMap && !previewMode) ? setRedeemToken : undefined}
          tokenMap={tokenMap}
          value={outputAmount?.toSignificant(6) || ''}
        />
        {children && <div className="p-4">{children}</div>}
      </div>
    </div>
  )
}
