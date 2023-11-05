import type { ReactNode } from 'react'
import { useEnsName } from 'wagmi'
import type { FetchEnsNameArgs } from 'wagmi/dist/actions'

export type Props = Partial<FetchEnsNameArgs> & {
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
