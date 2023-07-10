import { AddressZero } from '@ethersproject/constants'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/solid'
import chain from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { useIsSmScreen } from '@zenlink-interface/hooks'
import type { Fraction } from '@zenlink-interface/math'
import {
  Currency,
  DEFAULT_INPUT_PADDING,
  DEFAULT_INPUT_UNSTYLED,
  Dialog,
  Input,
  Loader,
  NetworkIcon,
  SlideIn,
  Typography,
  classNames,
} from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback } from 'react'

import type { BalanceMap } from '../../hooks/useBalance/types'
import { TokenListFilterByQuery } from '../TokenListFilterByQuery'
import type { TokenSelectorProps } from './TokenSelector'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { TokenSelectorRow } from './TokenSelectorRow'
import { TokenSelectorSettingsOverlay } from './TokenSelectorSettingsOverlay'

type TokenSelectorDialogProps = Omit<TokenSelectorProps, 'variant' | 'tokenMap'> & {
  account?: string
  balancesMap?: BalanceMap
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction> | undefined
  includeNative?: boolean
}

export const TokenSelectorDialog: FC<TokenSelectorDialogProps> = ({
  account,
  open,
  onClose,
  tokenMap,
  customTokenMap,
  chainId,
  onSelect,
  onAddToken,
  onRemoveToken,
  balancesMap,
  pricesMap,
  includeNative,
}) => {
  const isSmallScreen = useIsSmScreen()

  const handleSelect = useCallback(
    (currency: Type) => {
      onSelect && onSelect(currency)
      onClose()
    },
    [onClose, onSelect],
  )

  const handleImport = useCallback(
    (currency: Token) => {
      onAddToken && onAddToken(currency)
      onSelect && onSelect(currency)
      onClose()
    },
    [onAddToken, onClose, onSelect],
  )

  return (
    <TokenListFilterByQuery
      tokenMap={tokenMap}
      chainId={chainId}
      pricesMap={pricesMap}
      balancesMap={balancesMap}
      includeNative={includeNative}
    >
      {({ currencies, inputRef, query, onInput, searching, queryToken }) => (
        <Dialog open={open} unmount={false} onClose={onClose} initialFocus={isSmallScreen ? undefined : inputRef}>
          <Dialog.Content className="!max-w-md overflow-hidden h-[75vh] sm:h-[640px] pb-[116px]">
            <SlideIn>
              <Dialog.Header onClose={onClose} title="Select Token">
                {customTokenMap && (
                  <TokenSelectorSettingsOverlay customTokenMap={customTokenMap} onRemoveToken={onRemoveToken} />
                )}
              </Dialog.Header>
              <div
                className={classNames(
                  'my-3 mb-5 ring-offset-2 ring-offset-slate-800 flex gap-2 bg-slate-700 pr-3 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue',
                )}
              >
                <Input.Address
                  variant="unstyled"
                  id="token-search"
                  ref={inputRef}
                  placeholder="Search token by name"
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
                <div className="w-full border-t border-slate-200/5" />
                <div className="relative h-[calc(100%-32px)] pt-5">
                  <div className="absolute inset-0 h-full rounded-t-none rounded-xl">
                    {queryToken[0] && (
                      <TokenSelectorImportRow
                        className="!px-6"
                        currencies={queryToken}
                        onImport={() => queryToken[0] && handleImport(queryToken[0])}
                      />
                    )}
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
                          balance={balancesMap?.[currency.isNative ? AddressZero : currency.wrapped.address]}
                          price={pricesMap?.[currency.wrapped.address]}
                        />
                      )}
                    />
                    {currencies.length === 0 && !queryToken && chainId && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Typography variant="xs" className="flex italic text-slate-500">
                            No tokens found on
                          </Typography>
                          <Typography variant="xs" weight={500} className="flex gap-1 italic text-slate-500">
                            <NetworkIcon width={14} height={14} chainId={chainId} /> {chain[chainId].name}
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
