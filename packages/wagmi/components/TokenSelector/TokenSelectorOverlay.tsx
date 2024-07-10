import { AddressZero } from '@ethersproject/constants'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { XCircleIcon } from '@heroicons/react/24/solid'
import chain from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import type { Fraction } from '@zenlink-interface/math'
import {
  Currency,
  DEFAULT_INPUT_PADDING,
  DEFAULT_INPUT_UNSTYLED,
  Input,
  Loader,
  NetworkIcon,
  Overlay,
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

type TokenSelectorOverlayProps = Omit<TokenSelectorProps, 'variant' | 'tokenMap'> & {
  account?: string
  balancesMap?: BalanceMap
  tokenMap: Record<string, Token>
  pricesMap?: Record<string, Fraction> | undefined
  includeNative?: boolean
}

export const TokenSelectorOverlay: FC<TokenSelectorOverlayProps> = ({
  account,
  open,
  onClose,
  tokenMap,
  chainId,
  onSelect,
  onAddToken,
  balancesMap,
  pricesMap,
  includeNative,
}) => {
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
      balancesMap={balancesMap}
      chainId={chainId}
      includeNative={includeNative}
      pricesMap={pricesMap}
      tokenMap={tokenMap}
    >
      {({ currencies, inputRef, query, onInput, searching, queryToken }) => (
        <SlideIn>
          <SlideIn.FromLeft afterEnter={() => inputRef.current?.focus()} onClose={onClose} show={open}>
            <Overlay.Content className="bg-slate-700 !px-0 !pb-[88px]">
              <Overlay.Header onClose={onClose} title="Select Token" />
              <div className="p-3">
                <div
                  className={classNames(
                    'ring-offset-2 ring-offset-slate-700 flex gap-2 bg-slate-800 pr-3 w-full relative items-center justify-between rounded-xl focus-within:ring-2 text-primary ring-blue',
                  )}
                >
                  <Input.Address
                    className={classNames(DEFAULT_INPUT_UNSTYLED, DEFAULT_INPUT_PADDING)}
                    id="token-search"
                    onChange={onInput}
                    placeholder="Search token by address"
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
                      : (
                          <MagnifyingGlassIcon className="text-slate-500" height={20} strokeWidth={2} width={20} />
                        )}
                </div>
              </div>
              <div className="relative h-full pt-5">
                <div className="w-full border-t border-slate-200/5" />
                <div className="absolute inset-0 h-full rounded-t-none bg-slate-800 rounded-xl">
                  {queryToken[0] && (
                    <TokenSelectorImportRow
                      className="!px-4"
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
                        balance={balancesMap?.[currency.isNative ? AddressZero : currency.wrapped.address]}
                        className="!px-4"
                        currency={currency}
                        onCurrency={handleSelect}
                        price={pricesMap?.[currency.wrapped.address]}
                        style={style}
                      />
                    )}
                  />
                  {currencies.length === 0 && !queryToken && chainId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Typography className="flex italic text-slate-500" variant="xs">
                          No tokens found on
                        </Typography>
                        <Typography className="flex gap-1 italic text-slate-500" variant="xs" weight={500}>
                          <NetworkIcon chainId={chainId} height={14} width={14} /> {chain[chainId].name}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Overlay.Content>
          </SlideIn.FromLeft>
        </SlideIn>
      )}
    </TokenListFilterByQuery>
  )
}
