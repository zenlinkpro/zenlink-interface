import type { FC, ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode | Array<ReactNode>
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <div id="popover-portal" />
    </>
  )
}
