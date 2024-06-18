import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { CheckIcon, ChevronDownIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Checker, Web3Input } from '@zenlink-interface/compat'
import { type Type, tryParseAmount } from '@zenlink-interface/currency'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import { Button, Currency, Dots, Switch, Tooltip, Typography } from '@zenlink-interface/ui'
import { useTokens } from 'lib/state/token-lists'
import { type FC, type ReactNode, useCallback, useMemo, useState } from 'react'
import { Transition } from '@headlessui/react'
import { PricePanel } from 'components'
import { useUsdPctChange } from 'lib/hooks'
import { TradeProvider, useTrade } from './TradeProvider'
import { MarketAddZapReviewModal } from './MarketAddZapReviewModal'
import { MaxBoostTable } from './MaxBoostTable'

interface MarketAddZapProps {
  market: Market
}

export const MarketAddZap: FC<MarketAddZapProps> = ({ market }) => {
  const [addToken, setAddToken] = useState<Type>(market.SY.yieldToken)
  const [addInput, setAddInput] = useState('')
  const [zeroPriceImpactMode, setZeroPriceImpactMode] = useState(false)

  const inputTokenAmount = useMemo(
    () => tryParseAmount(addInput, addToken),
    [addInput, addToken],
  )

  const onSuccess = useCallback(() => {
    setAddInput('')
  }, [])

  return (
    <TradeProvider
      amountSpecified={inputTokenAmount}
      currencyOut={market.SY.yieldToken}
      market={market}
      zeroPriceImpactMode={zeroPriceImpactMode}
    >
      <MarketAddZapReviewModal
        addInput={addInput}
        addToken={addToken}
        market={market}
        onSuccess={onSuccess}
        zeroPriceImpactMode={zeroPriceImpactMode}
      >
        {({ isWritePending, setOpen }) => (
          <MarketAddZapWidget
            addInput={addInput}
            addToken={addToken}
            market={market}
            setAddInput={setAddInput}
            setAddToken={setAddToken}
            setZeroPriceImpactMode={setZeroPriceImpactMode}
            zeroPriceImpactMode={zeroPriceImpactMode}
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
                    {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Add</Trans>}
                  </Button>
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connected>
          </MarketAddZapWidget>
        )}
      </MarketAddZapReviewModal>

    </TradeProvider>
  )
}

interface MarketAddZapWidgetProps {
  market: Market
  previewMode?: boolean
  addToken: Type
  setAddToken?: (token: Type) => void
  addInput?: string
  setAddInput?: (input: string) => void
  zeroPriceImpactMode: boolean
  setZeroPriceImpactMode?: (mode: boolean) => void
  children?: ReactNode
}

export const MarketAddZapWidget: FC<MarketAddZapWidgetProps> = ({
  market,
  previewMode = false,
  children,
  zeroPriceImpactMode,
  setZeroPriceImpactMode,
  addToken,
  addInput,
  setAddInput,
  setAddToken,
}) => {
  const tokenMap = useTokens(market.chainId)
  const { lpMinted, ytMinted, isLoading, amountSpecified } = useTrade()
  const usdPctChange = useUsdPctChange({
    chainId: market.chainId,
    inputAmount: amountSpecified,
    outputAmount: !zeroPriceImpactMode ? lpMinted : undefined,
  })

  return (
    <div className="my-2">
      <Web3Input.Currency
        chainId={market.chainId}
        className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-2xl"
        currency={addToken}
        disableMaxButton={market.isExpired || previewMode}
        disabled={market.isExpired || previewMode}
        includeHotTokens
        includeNative
        loading={false}
        onChange={(input: string) => { setAddInput?.(input) }}
        onSelect={(tokenMap && !previewMode) ? setAddToken : undefined}
        tokenMap={tokenMap}
        value={addInput || ''}
      />
      <div className="flex items-center justify-center -mt-[10px] -mb-[10px] z-10">
        <div className="group bg-white dark:bg-slate-700 p-0.5 border-4 border-gray-200 dark:border-slate-800 rounded-full">
          <ChevronDownIcon height={16} width={16} />
        </div>
      </div>
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl p-4 gap-1">
        {!previewMode && (
          <div className="flex items-center gap-2 mt-2 mb-4">
            <Switch
              checked={zeroPriceImpactMode}
              checkedIcon={<CheckIcon className="text-slate-800" />}
              onChange={checked => setZeroPriceImpactMode?.(checked)}
              size="xs"
              uncheckedIcon={<XMarkIcon className="text-slate-800" />}
            />
            <Typography className="text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
              <Trans>Zero Price Impact Mode</Trans>
            </Typography>
            <Tooltip
              content={(
                <div className="flex flex-col w-80">
                  <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
                    <Trans>
                      In zero price impact mode, YT will be returned to you after providing liquidity.
                    </Trans>
                  </Typography>
                </div>
              )}
            >
              <InformationCircleIcon height={14} width={14} />
            </Tooltip>
          </div>
        )}
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          {isLoading
            ? <div className="rounded-full bg-slate-300 dark:bg-slate-700 w-1/4 h-[20px] animate-pulse" />
            : (
                <div className="flex flex-col items-start">
                  <Typography variant="lg" weight={600}>{lpMinted.toSignificant(6)}</Typography>
                  <PricePanel currency={lpMinted.currency} usdPctChange={usdPctChange} value={lpMinted.toExact()} />
                </div>
              )}
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market}
              disableLink
              height={24}
              width={24}
            />
            <div className="flex flex-col items-end">
              <Typography variant="base" weight={600}>{lpMinted.currency.symbol}</Typography>
              <Typography variant="xs">{getMaturityFormatDate(market)}</Typography>
            </div>
          </div>
        </div>
        <Transition
          className="transition-[max-height] overflow-hidden"
          enter="duration-300 ease-in-out"
          enterFrom="transform max-h-0"
          enterTo="transform max-h-screen"
          leave="transition-[max-height] duration-250 ease-in-out"
          leaveFrom="transform max-h-screen"
          leaveTo="transform max-h-0"
          show={zeroPriceImpactMode}
          unmount={false}
        >
          <PlusIcon className="m-auto mb-1" height={20} width={20} />
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
        </Transition>
        <MaxBoostTable className="mt-3" lpMinted={lpMinted} market={market} />
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  )
}
