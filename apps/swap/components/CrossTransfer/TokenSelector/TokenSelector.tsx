import type { Token, Type } from '@zenlink-interface/currency'
import { useIsMounted } from '@zenlink-interface/hooks'
import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { TokenSelectorDialog } from './TokenSelectorDialog'

export interface TokenSelectorProps {
  variant: 'overlay' | 'dialog'
  currency?: Type
  open: boolean
  tokenMap: Record<string, Token>
  onClose(): void
  onSelect?(currency: Type): void
  includeNative?: boolean
}

export const TokenSelector: FC<TokenSelectorProps> = memo(
  ({
    tokenMap,
    onSelect,
    open,
    ...props
  }) => {
    const isMounted = useIsMounted()

    const _tokenMap: Record<string, Token> = useMemo(
      () => ({ ...tokenMap }),
      [tokenMap],
    )
    return useMemo(() => {
      if (!isMounted)
        return <></>

      return (
        <TokenSelectorDialog
          open={open}
          tokenMap={_tokenMap}
          onSelect={onSelect}
          {...props}
        />
      )
    }, [_tokenMap, isMounted, onSelect, open, props])
  },
  (prevProps, nextProps) => {
    return (
      prevProps.variant === nextProps.variant
      && prevProps.currency === nextProps.currency
      && prevProps.open === nextProps.open
      && prevProps.tokenMap === nextProps.tokenMap
    )
  },
)
