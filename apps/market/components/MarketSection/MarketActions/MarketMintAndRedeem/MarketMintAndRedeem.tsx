import { Tab } from '@headlessui/react'
import { type Market, getMaturityFormatDate } from '@zenlink-interface/market'
import type { FC, ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Button, Currency, Dots, Typography, classNames } from '@zenlink-interface/ui'
import { Trans } from '@lingui/macro'
import { Checker, Web3Input } from '@zenlink-interface/compat'
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid'
import type { Token } from '@zenlink-interface/currency'
import { Amount, tryParseAmount } from '@zenlink-interface/currency'
import { ZERO } from '@zenlink-interface/math'
import { MarketMintReviewModal } from './MarketMintReviewModal'

const TAB_DEFAULT_CLASS = 'w-full rounded-full py-1 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
const TAB_SELECTED_CLASS = 'bg-white text-slate-700 shadow'
const TAB_NOT_SELECTED_CLASS = 'text-blue-100 hover:bg-white/[0.12] hover:text-white'

interface MarketMintAndRedeemProps {
  market: Market
}

export const MarketMintAndRedeem: FC<MarketMintAndRedeemProps> = ({ market }) => {
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
    <div className="w-full max-w-md px-2 py-2 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex w-2/5 space-x-1 rounded-full bg-blue-900/20 p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                TAB_DEFAULT_CLASS,
                selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
              )}
          >
            <Trans>Mint</Trans>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                TAB_DEFAULT_CLASS,
                selected ? TAB_SELECTED_CLASS : TAB_NOT_SELECTED_CLASS,
              )}
          >
            <Trans>Redeem</Trans>
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <MarketMintReviewModal
              inputValue={mintInput}
              market={market}
              ptMinted={ptMinted}
              yieldToMints={yieldToMints}
              ytMinted={ytMinted}
            >
              {({ isWritePending, setOpen }) => (
                <>
                  <MarketMintWidget
                    market={market}
                    mintInput={mintInput}
                    ptMinted={ptMinted}
                    setMintInput={setMintInput}
                    ytMinted={ytMinted}
                  >
                    <Checker.Connected chainId={market.chainId} fullWidth size="md">
                      <Checker.Network chainId={market.chainId} fullWidth size="md">
                        {/* <Checker.Amounts
                          amounts={[yieldToMints]}
                          chainId={market.chainId}
                          fullWidth
                          size="md"
                        > */}
                          <Button disabled={isWritePending} fullWidth onClick={() => setOpen(true)} size="md">
                            {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Mint</Trans>}
                          </Button>
                        {/* </Checker.Amounts> */}
                      </Checker.Network>
                    </Checker.Connected>
                  </MarketMintWidget>
                </>
              )}
            </MarketMintReviewModal>
          </Tab.Panel>
          <Tab.Panel>22</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
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
        disableMaxButton={!!inputValue}
        disabled={!!inputValue}
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
      <div className="flex flex-col bg-white/50 dark:bg-slate-700/50 rounded-2xl px-4 py-6 gap-1">
        <div className="flex items-center justify-between border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2">
          <Typography variant="lg" weight={500}>{ptMinted.toSignificant(6)}</Typography>
          <div className="flex items-center text-sm gap-2">
            <Currency.Icon
              currency={market.PT}
              disableLink
              height={24}
              layout="responsive"
              priority
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
              layout="responsive"
              priority
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
