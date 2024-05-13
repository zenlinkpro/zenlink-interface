import type { Token, Type } from '@zenlink-interface/currency'
import { useIsSmScreen } from '@zenlink-interface/hooks'
import type { Fraction } from '@zenlink-interface/math'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import chain from '@zenlink-interface/chain'
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
  Currency as UICurrency,
  classNames,
} from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useCallback } from 'react'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { AddressZero } from '@ethersproject/constants'
import { TokenSelectorSettingsOverlay } from '@zenlink-interface/wagmi'
import { COMMON_BASES } from '@zenlink-interface/router-config'
import { Trans, t } from '@lingui/macro'
import { uuid } from '@zenlink-interface/math'
import type { BalanceMap } from '../../hooks/useBalance/types'
import { TokenListFilterByQuery } from '../TokenListFilterByQuery'
import { isEvmNetwork } from '../../config'
import type { TokenSelectorProps } from './TokenSelector'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { TokenSelectorRow } from './TokenSelectorRow'

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
  includeHotTokens,
  currency,
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
      balancesMap={balancesMap}
      chainId={chainId}
      includeNative={includeNative}
      pricesMap={pricesMap}
      tokenMap={tokenMap}
    >
      {({ currencies, inputRef, query, onInput, searching, queryToken }) => (
        <Dialog initialFocus={isSmallScreen ? undefined : inputRef} onClose={onClose} open={open} unmount={false}>
          <Dialog.Content className="!max-w-md overflow-hidden !h-[640px] md:!h-[75vh] pb-[116px]">
            <SlideIn>
              <Dialog.Header onClose={onClose} title={<Trans>Select Token</Trans>}>
                {customTokenMap && (
                  <TokenSelectorSettingsOverlay customTokenMap={customTokenMap} onRemoveToken={onRemoveToken} />
                )}
              </Dialog.Header>
              <div
                className={classNames(
                  'my-3 mb-5 ring-offset-2 border border-slate-500/20 ring-offset-slate-300 dark:ring-offset-slate-800 flex gap-2 bg-slate-100 dark:bg-slate-800 pr-3 w-full relative items-center justify-between rounded-2xl focus-within:ring-2 text-primary ring-blue',
                )}
              >
                <Input.Address
                  className={classNames(DEFAULT_INPUT_UNSTYLED, DEFAULT_INPUT_PADDING)}
                  id="token-search"
                  onChange={onInput}
                  placeholder={t`Search token by address`}
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
              <div className="-ml-6 -mr-6">
                {includeHotTokens && chainId && COMMON_BASES[chainId]?.length && (
                  <div className="flex flex-wrap gap-2 border-t border-slate-500/20 dark:border-slate-200/5 px-6 py-3">
                    {COMMON_BASES[chainId].map(base => (
                      <button
                        className={classNames(
                          currency?.equals(base) ? 'bg-blue-400/20 border-blue-700 text-blue-600' : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-black dark:text-white',
                          'text-sm border border-slate-500/20 cursor-pointer h-[34px] transition-all flex flex-row items-center gap-1 font-semibold rounded-xl px-2.5',
                        )}
                        key={uuid()}
                        onClick={() => handleSelect(base)}
                      >
                        <div className="w-5 h-5">
                          <UICurrency.Icon
                            currency={base}
                            disableLink
                            height={20}
                            layout="responsive"
                            priority
                            width={20}
                          />
                        </div>
                        <div className="ml-0.5 -mr-0.5">{base.symbol}</div>
                      </button>
                    ),
                    )}
                  </div>
                )}
              </div>
              <div className="relative h-full -ml-6 -mr-6">
                <div className="w-full border-t border-slate-500/20 dark:border-slate-200/5" />
                <div className={classNames(
                  includeHotTokens && chainId && COMMON_BASES[chainId]?.length ? 'h-[calc(100%-130px)]' : 'h-[calc(100%-34px)]',
                  'relative pt-5',
                )}
                >
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
                          balance={balancesMap?.[currency.isNative ? isEvmNetwork(currency.chainId) ? AddressZero : currency.wrapped.address : currency.wrapped.address]}
                          className="!px-6"
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
                            <Trans>No tokens found on</Trans>
                          </Typography>
                          <Typography className="flex gap-1 italic text-slate-500" variant="xs" weight={500}>
                            <NetworkIcon chainId={chainId} height={14} width={14} />
                            {' '}
                            {chain[chainId].name}
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
