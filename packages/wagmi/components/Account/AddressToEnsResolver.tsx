import type { ReactNode } from 'react'
import type { UseEnsNameParameters } from 'wagmi'
import { useEnsName } from 'wagmi'

export type Props = Partial<UseEnsNameParameters> & {
  children: ReactNode | Array<ReactNode> | ((payload: ReturnType<typeof useEnsName>) => JSX.Element)
}

export function AddressToEnsResolver({
  children,
  chainId = 1,
  ...props
}: Props): JSX.Element {
  const result = useEnsName({ ...props, chainId })

  if (typeof children === 'function')
    return children(result)

  return <>{children}</>
}
