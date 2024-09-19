import type { Token, Type } from '@zenlink-interface/currency'
import type { Fraction } from '@zenlink-interface/math'
import type { FC } from 'react'
import type { TokenSelectorProps } from './TokenSelector'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { useIsSmScreen } from '@zenlink-interface/hooks'
import {
  classNames,
  Currency,
  DEFAULT_INPUT_PADDING,
  DEFAULT_INPUT_UNSTYLED,
  Dialog,
  Input,
  Loader,
  SlideIn,
  Typography,
} from '@zenlink-interface/ui'
import { useCallback } from 'react'
import { TokenListFilterByQuery } from './TokenListFilterByQuery'
import { TokenSelectorRow } from './TokenSelectorRow'

type TokenSelectorDialogProps = Omit<TokenSelectorProps, 'variant' | 'tokenMap'> & {
  account?: string
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction> | undefined
  includeNative?: boolean
}

export const TokenSelectorDialog: FC<TokenSelectorDialogProps> = ({
  account,
  open,
  onClose,
  tokenMap,
  onSelect,
}) => {
  const isSmallScreen = useIsSmScreen()

  const handleSelect = useCallback(
    (currency: Type) => {
      onSelect && onSelect(currency)
      onClose()
    },
    [onClose, onSelect],
  )
  return (
    <TokenListFilterByQuery tokenMap={tokenMap}>
      {({ currencies, inputRef, query, onInput, searching, queryToken }) => (
        <Dialog initialFocus={isSmallScreen ? undefined : inputRef} onClose={onClose} open={open} unmount={false}>
          <Dialog.Content className="!max-w-md overflow-hidden !h-[640px] md:!h-[75vh] pb-[116px]">
            <SlideIn>
              <Dialog.Header onClose={onClose} title={<Trans>Select Token</Trans>} />
              <div
                className={classNames(
                  'my-3 mb-5 ring-offset-2 border border-slate-500/20 ring-offset-slate-300 dark:ring-offset-slate-800 flex gap-2 bg-slate-200 dark:bg-slate-700 pr-3 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue',
                )}
              >
                <Input.Address
                  className={classNames(DEFAULT_INPUT_UNSTYLED, DEFAULT_INPUT_PADDING)}
                  id="token-search"
                  onChange={onInput}
                  placeholder="Search token"
                  ref={inputRef}
                  value={query}
                  variant="unstyled"
                />
                {searching
                  ? (
                      <div className="relative left-[-2px]">
                        <Loader className="animate-spin-slow text-slate-500" size={14} strokeWidth={3} />
                      </div>
                    )
                  : query
                    ? (
                        <XCircleIcon
                          className="cursor-pointer text-slate-500 hover:text-slate-300"
                          height={20}
                          onClick={() => onInput('')}
                          width={20}
                        />
                      )
                    : <MagnifyingGlassIcon className="text-slate-500" height={20} strokeWidth={2} width={20} />}
              </div>
              <div className="relative h-full -ml-6 -mr-6">
                <div className="w-full border-t border-slate-500/20 dark:border-slate-200/5" />
                <div className={classNames('h-[calc(100%-32px)] relative pt-5')}>
                  <div className="absolute inset-0 h-full rounded-t-none rounded-xl">
                    <Currency.List
                      className="divide-y hide-scrollbar divide-slate-700"
                      currencies={currencies}
                      rowRenderer={({ currency, style }) => (
                        <TokenSelectorRow
                          account={account}
                          className="!px-6"
                          currency={currency}
                          onCurrency={handleSelect}
                          style={style}
                        />
                      )}
                    />
                    {currencies.length === 0 && !queryToken && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Typography className="flex italic text-slate-500" variant="xs">
                            <Trans>No tokens found on</Trans>
                          </Typography>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SlideIn>
          </Dialog.Content>
        </Dialog>
      )}
    </TokenListFilterByQuery>
  )
}
