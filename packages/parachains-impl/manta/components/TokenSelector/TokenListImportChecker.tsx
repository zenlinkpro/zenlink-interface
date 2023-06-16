import type { FC, ReactNode } from 'react'

interface TokenListImportCheckerProps {
  children: ReactNode
}

// Currently no token import checker on Bifrost chain
export const TokenListImportChecker: FC<TokenListImportCheckerProps> = ({ children }) => {
  return <>{children}</>
}
