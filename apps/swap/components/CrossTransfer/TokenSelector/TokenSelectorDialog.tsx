import type { Token, Type } from '@zenlink-interface/currency'
import { useIsSmScreen } from '@zenlink-interface/hooks'
import type { Fraction } from '@zenlink-interface/math'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
  Currency,
  DEFAULT_INPUT_PADDING,
  DEFAULT_INPUT_UNSTYLED,
  Dialog,
  Input,
  Loader,
  SlideIn,
  Typography,
  classNames,
} from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback } from 'react'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { TokenListFilterByQuery } from './TokenListFilterByQuery'
import type { TokenSelectorProps } from './TokenSelector'
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
    <TokenListFilterByQuery
      tokenMap={tokenMap}
    >
      {({ currencies, inputRef, query, onInput, searching, queryToken }) => (
        <Dialog open={open} unmount={false} onClose={onClose} initialFocus={isSmallScreen ? undefined : inputRef}>
          <Dialog.Content className="!max-w-md overflow-hidden !h-[640px] md:!h-[75vh] pb-[116px]">
            <SlideIn>
              <Dialog.Header onClose={onClose} title="Select Token">
              </Dialog.Header>
              <div
                className={classNames(
                  'my-3 mb-5 ring-offset-2 border border-slate-500/20 ring-offset-slate-300 dark:ring-offset-slate-800 flex gap-2 bg-slate-200 dark:bg-slate-700 pr-3 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue',
                )}
              >
                <Input.Address
                  variant="unstyled"
                  id="token-search"
                  ref={inputRef}
                  placeholder="Search token"
                  value={query}
                  onChange={onInput}
                  className={classNames(DEFAULT_INPUT_UNSTYLED, DEFAULT_INPUT_PADDING)}
                />
                {searching
                  ? (
                    <div className="relative left-[-2px]">
                      <Loader size={14} strokeWidth={3} className="animate-spin-slow text-slate-500" />
                    </div>
                    )
                  : query
                    ? (
                      <XCircleIcon
                        width={20}
                        height={20}
                        className="cursor-pointer text-slate-500 hover:text-slate-300"
                        onClick={() => onInput('')}
                      />
                      )
                    : (
                      <MagnifyingGlassIcon className="text-slate-500" strokeWidth={2} width={20} height={20} />
                      )}
              </div>
              <div className="relative h-full -ml-6 -mr-6">
                <div className="w-full border-t border-slate-500/20 dark:border-slate-200/5" />
                <div className={classNames(
                  'h-[calc(100%-32px)]',
                  'relative pt-5',
                )}>
                  <div className="absolute inset-0 h-full rounded-t-none rounded-xl">
                    <Currency.List
                      className="divide-y hide-scrollbar divide-slate-700"
                      currencies={currencies}
                      rowRenderer={({ currency, style }) => (
                        <TokenSelectorRow
                          account={account}
                          currency={currency}
                          style={style}
                          onCurrency={handleSelect}
                          className="!px-6"
                        />
                      )}
                    />
                    {currencies.length === 0 && !queryToken && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Typography variant="xs" className="flex italic text-slate-500">
                            No tokens found on
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
