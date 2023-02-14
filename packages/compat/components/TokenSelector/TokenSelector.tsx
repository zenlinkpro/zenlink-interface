import type { ParachainId } from '@zenlink-interface/chain'
import type { Token, Type } from '@zenlink-interface/currency'
import { useIsMounted } from '@zenlink-interface/hooks'
import { usePrices } from '@zenlink-interface/shared'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { useAccount, useBalances } from '../../hooks'
import { TokenSelectorDialog } from './TokenSelectorDialog'

export interface TokenSelectorProps {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  chainId: ParachainId | undefined
  tokenMap: Record<string, Token>
  customTokenMap?: Record<string, Token>
  onClose(): void
  onSelect?(currency: Type): void
  onAddToken?(token: Token): void
  onRemoveToken?({ chainId, address }: { chainId: ParachainId; address: string }): void
  includeNative?: boolean
}

export const TokenSelector: FC<TokenSelectorProps> = memo(
  ({
    tokenMap,
    chainId,
    onSelect,
    open,
    customTokenMap = {},
    includeNative,
    ...props
  }) => {
    const { address } = useAccount()
    const isMounted = useIsMounted()

    const _tokenMap: Record<string, Token> = useMemo(
      () => ({ ...tokenMap, ...customTokenMap }),
      [tokenMap, customTokenMap],
    )

    const _tokenMapValues = useMemo(() => {
      return Object.values(_tokenMap)
    }, [_tokenMap])

    const { data: balances } = useBalances({
      account: address,
      chainId,
      currencies: _tokenMapValues,
      enabled: open,
    })

    const { data: pricesMap } = usePrices({ chainId })

    return useMemo(() => {
      if (!isMounted)
        return <></>

      return (
        <TokenSelectorDialog
          open={open}
          account={address}
          balancesMap={balances}
          pricesMap={pricesMap}
          tokenMap={_tokenMap}
          chainId={chainId}
          onSelect={onSelect}
          includeNative={includeNative}
          {...props}
        />
      )
    }, [_tokenMap, address, balances, chainId, isMounted, onSelect, open, props, includeNative, pricesMap])
  },
  (prevProps, nextProps) => {
    return (
      prevProps.variant === nextProps.variant
      && prevProps.currency === nextProps.currency
      && prevProps.open === nextProps.open
      && prevProps.tokenMap === nextProps.tokenMap
      && prevProps.customTokenMap === nextProps.customTokenMap
    )
  },
)
