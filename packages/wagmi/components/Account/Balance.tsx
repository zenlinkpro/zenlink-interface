import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { chainsChainIdToParachainId } from '@zenlink-interface/chain'
import type { ParachainId } from '@zenlink-interface/chain'
import { Amount, Native } from '@zenlink-interface/currency'
import { useIsMounted } from '@zenlink-interface/hooks'
import { JSBI } from '@zenlink-interface/math'
import { IconButton, Loader, NetworkIcon, Tooltip, Typography } from '@zenlink-interface/ui'
import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'
import { useBalance, useNetwork } from 'wagmi'
import { NetworkSelector } from '../NetworkSelector'

export interface Props {
  address?: string
  supportedNetworks?: ParachainId[]
  children?({ content, isLoading }: { content: ReactNode; isLoading: boolean }): ReactNode
}

export const Balance: FC<Props> = ({ address, supportedNetworks, children }) => {
  const { chain } = useNetwork()
  const isMounted = useIsMounted()
  const { data, isError, isLoading } = useBalance({ addressOrName: address, enabled: !!address })

  const parachainId: number | undefined = useMemo(
    () => chain ? chainsChainIdToParachainId[chain.id] : undefined,
    [chain],
  )

  return useMemo(() => {
    const content = isLoading
      ? <Loader />
      : isError
        ? (
          <Tooltip
            button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
            panel={
              <Typography variant="xs" className="text-center">
                An error occurred while trying
                <br /> to fetch your balance
              </Typography>
            }
          />
          )
        : supportedNetworks && !supportedNetworks.includes(parachainId ?? -1)
          ? (
            <Tooltip
              button={<ExclamationCircleIcon width={20} height={20} className="text-red" />}
              panel={
                <Typography variant="xs" className="text-center">
                  Unsupported Network
                </Typography>
              }
            />
            )
          : (
            <Typography weight={500} className="flex gap-2 items-center text-slate-200 -ml-0.5" as="span">
              {parachainId && (
                <NetworkSelector supportedNetworks={supportedNetworks}>
                  <IconButton as="div">
                    <NetworkIcon chainId={parachainId} width={20} height={20} />
                  </IconButton>
                </NetworkSelector>
              )}
              <Typography weight={500} className="items-baseline hidden gap-1 sm:flex text-slate-200" as="span">
                {isMounted
                  && parachainId
                  && data
                  && Amount.fromRawAmount(Native.onChain(parachainId), JSBI.BigInt(data.value)).toSignificant(4)}
                <Typography weight={500} className="text-slate-500" as="span">
                  {parachainId ? Native.onChain(parachainId)?.symbol : ''}
                </Typography>
              </Typography>
            </Typography>
            )

    if (typeof children === 'function')
      return <>{children({ content, isLoading: isLoading || !(isMounted && chain && data) })}</>

    return content
  }, [chain, children, data, isError, isLoading, isMounted, supportedNetworks, parachainId])
}
