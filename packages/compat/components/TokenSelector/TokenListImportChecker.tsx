import type { ParachainId } from '@zenlink-interface/chain'
import type { Token } from '@zenlink-interface/currency'
import type { FC, ReactNode } from 'react'
import { TokenListImportChecker as WagmiTokenListImportChecker } from '@zenlink-interface/wagmi'
import { TokenListImportChecker as BifrostTokenListImportChecker } from '@zenlink-interface/parachains-manta'
import { isEvmNetwork } from '../../config'

interface TokenListImportCheckerProps {
  chainId: ParachainId
  children: ReactNode
  onAddTokens: (tokens: Token[]) => void
  tokens?: { address: string; chainId: number }[]
  tokenMap: Record<string, Token>
  customTokensMap: Record<string, Token>
}

export const TokenListImportChecker: FC<TokenListImportCheckerProps> = ({
  chainId,
  children,
  ...props
}) => {
  if (isEvmNetwork(chainId))
    return <WagmiTokenListImportChecker {...props}>{children}</WagmiTokenListImportChecker>

  return <BifrostTokenListImportChecker>{children}</BifrostTokenListImportChecker>
}
