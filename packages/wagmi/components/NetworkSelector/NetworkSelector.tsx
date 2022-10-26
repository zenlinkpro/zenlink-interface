import type { ParachainId } from '@zenlink-interface/chain'
import chains, {
  chainsChainIdToParachainId,
  chainsParachainIdToChainId,
} from '@zenlink-interface/chain'
import { Listbox } from '@headlessui/react'
import { NetworkIcon, Select, Typography, classNames } from '@zenlink-interface/ui'
import { useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkSelectorProps {
  children: ReactNode
  supportedNetworks?: ParachainId[]
}

export const NetworkSelector: FC<NetworkSelectorProps> = ({ children, supportedNetworks }) => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const networks = useMemo(() => Array.from(new Set(supportedNetworks)), [supportedNetworks])
  const parachainId: number | undefined = useMemo(
    () => chain ? chainsChainIdToParachainId[chain.id] : undefined,
    [chain],
  )

  if (!networks.length)
    return <>{children}</>

  return (
    <Select
      button={
        <Listbox.Button className="flex items-center">
          {children}
        </Listbox.Button>
      }
    >
      <Select.Options className="!w-[max-content] right-0 !mt-[16px] !fixed !bg-slate-700">
        <div className="grid grid-cols-1 px-2 py-2 md:grid-cols-2 gap-x-4">
          {networks.map(el => (
            <div
              onClick={() => {
                switchNetwork && switchNetwork(chainsParachainIdToChainId[el])
              }}
              key={el}
              className={classNames(
                parachainId === el ? 'bg-slate-800' : 'hover:opacity-80',
                'px-2 flex rounded-xl justify-between gap-2 items-center cursor-pointer transform-all h-[40px]',
              )}
            >
              <div className="flex items-center gap-2">
                <NetworkIcon type="naked" chainId={el} width={22} height={22} />
                <Typography variant="sm" weight={500} className="text-slate-50">
                  {chains[el].name}
                </Typography>
              </div>
              {parachainId === el && <div className="w-2 h-2 mr-1 rounded-full bg-green" />}
            </div>
          ))}
        </div>
      </Select.Options>
    </Select>
  )
}
