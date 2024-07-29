import { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Token } from '@zenlink-interface/currency'
import { Dialog } from '@zenlink-interface/ui'
import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTokens } from '../../hooks'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'

interface TokenListImportCheckerProps {
  children: ReactNode
  onAddTokens: (tokens: Token[]) => void
  tokens?: { address: string, chainId: number }[]
  tokenMap: Record<string, Token>
  customTokensMap: Record<string, Token>
}

export const TokenListImportChecker: FC<TokenListImportCheckerProps> = ({
  onAddTokens,
  tokenMap,
  customTokensMap,
  tokens,
  children,
}) => {
  const _tokens = useMemo(() => {
    if (!tokens || Object.keys(tokenMap).length === 0)
      return []
    return tokens.filter((el) => {
      return !(el.address in tokenMap) && !(el.address.toLowerCase() in customTokensMap)
    })
  }, [customTokensMap, tokenMap, tokens])

  return (
    <TokenListImportCheckerCore
      customTokensMap={customTokensMap}
      onAddTokens={onAddTokens}
      tokenMap={tokenMap}
      tokens={_tokens}
    >
      {children}
    </TokenListImportCheckerCore>
  )
}

const TokenListImportCheckerCore: FC<TokenListImportCheckerProps & { tokens: { address: string, chainId: number }[] }> = ({
  children,
  tokens,
  onAddTokens,
  tokenMap,
  customTokensMap,
}) => {
  const [open, setOpen] = useState(false)

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const { data: currencies } = useTokens({
    tokens: tokens.map(el => ({
      address: el.address,
      chainId: chainsParachainIdToChainId[el.chainId],
    })),
  })

  const _currencies = useMemo(() => {
    if (!currencies)
      return
    return currencies.map((el, idx) => {
      const { address, name, symbol, decimals } = el
      return new Token({ address, name, symbol, decimals, chainId: tokens[idx].chainId })
    })
  }, [currencies, tokens])

  const handleImport = useCallback(() => {
    if (!currencies)
      return

    if (onAddTokens && _currencies)
      onAddTokens(_currencies)

    onClose()
  }, [_currencies, currencies, onAddTokens, onClose])

  useEffect(() => {
    if (!tokens)
      return
    tokens.forEach((el) => {
      if (!(el.address in tokenMap) && !(el.address.toLowerCase() in customTokensMap))
        setOpen(true)
    })
  }, [customTokensMap, tokenMap, tokens])

  return (
    <>
      {children}
      {_currencies && (
        <Dialog onClose={onClose} open={open}>
          <Dialog.Content>
            <Dialog.Header
              onClose={() => setOpen(false)}
              title={_currencies.length > 1 ? 'Import Tokens' : 'Import Token'}
            />
            <TokenSelectorImportRow currencies={_currencies} onImport={handleImport} slideIn={false} />
          </Dialog.Content>
        </Dialog>
      )}
    </>
  )
}
