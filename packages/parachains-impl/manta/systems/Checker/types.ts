import type { ButtonProps } from '@zenlink-interface/ui'
import type { ReactNode } from 'react'

export interface CheckerButton extends ButtonProps<'button'> {
  children: ReactNode
}
