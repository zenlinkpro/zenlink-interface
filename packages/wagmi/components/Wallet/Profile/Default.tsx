import { ArrowLeftOnRectangleIcon, ArrowTopRightOnSquareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import type { ParachainId } from '@zenlink-interface/chain'
import chains, { chainsParachainIdToChainId } from '@zenlink-interface/chain'
import { Amount, Native } from '@zenlink-interface/currency'
import { shortenAddress } from '@zenlink-interface/format'
import { usePrices } from '@zenlink-interface/shared'
import { CopyHelper, IconButton, JazzIcon, Typography } from '@zenlink-interface/ui'
import Image from 'next/legacy/image'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useMemo } from 'react'
import { useBalance, useDisconnect, useEnsAvatar } from 'wagmi'

import { ProfileView } from './Profile'

interface DefaultProps {
  chainId: ParachainId
  address: `0x${string}`
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const Default: FC<DefaultProps> = ({ chainId, address, setView }) => {
  const { data: prices } = usePrices({ chainId })
  const { data: avatar } = useEnsAvatar({
    address,
    chainId: 1,
  })

  const { data: _balance } = useBalance({
    address,
    chainId: chainsParachainIdToChainId[chainId],
  })

  const balance = useMemo(
    () => Amount.fromRawAmount(Native.onChain(chainId), _balance ? _balance?.value.toString() : '0'),
    [_balance, chainId],
  )

  const { disconnect } = useDisconnect()

  const balanceAsUsd = useMemo(() => {
    return balance && prices?.[Native.onChain(chainId).wrapped.address]
      ? balance.multiply(prices?.[Native.onChain(chainId).wrapped.address])
      : undefined
  }, [balance, chainId, prices])

  return (
    <>
      <div className="flex flex-col gap-8 p-4">
        <div className="flex justify-between gap-3">
          <Typography variant="sm" weight={600} className="flex items-center gap-1.5 text-slate-50">
            {avatar
              ? (
                <div className="w-4 h-4">
                  <Image alt="ens-avatar" src={avatar} width={16} height={16} className="rounded-full" />
                </div>
                )
              : (
                <JazzIcon diameter={16} address={address} />
                )}
            {shortenAddress(address)}
          </Typography>
          <div className="flex gap-3">
            <CopyHelper toCopy={address} hideIcon>
              {isCopied => (
                <IconButton className="p-0.5" description={isCopied ? 'Copied!' : 'Copy'}>
                  <DocumentDuplicateIcon width={18} height={18} />
                </IconButton>
              )}
            </CopyHelper>
            <IconButton
              as="a"
              target="_blank"
              href={chains[chainId].getAccountUrl(address)}
              className="p-0.5"
              description="Explore"
            >
              <ArrowTopRightOnSquareIcon width={18} height={18} />
            </IconButton>
            <IconButton as="button" onClick={() => disconnect()} className="p-0.5" description="Disconnect">
              <ArrowLeftOnRectangleIcon width={18} height={18} />
            </IconButton>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <Typography variant="h1" className="whitespace-nowrap">
            {balance.toSignificant(6)} {Native.onChain(chainId).symbol}
          </Typography>
          <Typography weight={600} className="text-slate-400">
            ${balanceAsUsd?.toFixed(2)}
          </Typography>
        </div>
      </div>
      <div className="px-2">
        <div className="h-px bg-slate-200/10 w-full mt-3" />
      </div>
      <div className="p-2">
        <button
          onClick={() => setView(ProfileView.Transactions)}
          className="flex text-sm font-semibold hover:text-slate-50 w-full text-slate-400 justify-between items-center hover:bg-white/[0.04] rounded-xl p-2 pr-1 py-2.5"
        >
          Transactions <ChevronRightIcon width={20} height={20} />
        </button>
      </div>
    </>
  )
}
