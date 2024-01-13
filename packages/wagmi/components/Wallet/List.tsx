import { useIsMounted } from '@zenlink-interface/hooks'
import type { FC, ReactNode } from 'react'
import { useAccount, useConnect } from 'wagmi'

export type RenderProps = ReturnType<typeof useConnect> & { isMounted: boolean }

export interface ListProps {
  children?: ReactNode | ReactNode[] | ((x: RenderProps) => ReactNode | ReactNode[])
}

export const List: FC = () => {
  const isMounted = useIsMounted()
  const { connector: currentConnector } = useAccount()
  const connect = useConnect()

  return (
    <>
      {connect.connectors
        .filter(connector => isMounted && connector.id !== currentConnector?.id)
        .map(connector => (
          <button key={connector.id} onClick={() => connect.connect({ connector })}>
            {connector.name === 'Safe' ? 'Gnosis Safe' : connector.name}
          </button>
        ))}
    </>
  )
}
