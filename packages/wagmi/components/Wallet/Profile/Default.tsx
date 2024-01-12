import {
  ArrowLeftOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
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
import { useBalance, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

import { Trans, t } from '@lingui/macro'
import type { Address } from 'viem'
import { ProfileView } from './Profile'

interface DefaultProps {
  chainId: ParachainId
  address: Address
  setView: Dispatch<SetStateAction<ProfileView>>
}

export const Default: FC<DefaultProps> = ({ chainId, address, setView }) => {
  const { data: prices } = usePrices({ chainId })
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { data: avatar } = useEnsAvatar({
    name: ensName ?? undefined,
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
          <Typography className="flex items-center gap-1.5 text-gray-700 dark:text-slate-200" variant="sm" weight={600}>
            {avatar
              ? (
                <div className="w-4 h-4">
                  <Image alt="ens-avatar" className="rounded-full" height={16} src={avatar} width={16} />
                </div>
                )
              : (
                <JazzIcon address={address} diameter={16} />
                )}
            {shortenAddress(address)}
          </Typography>
          <div className="flex gap-3">
            <CopyHelper hideIcon toCopy={address}>
              {isCopied => (
                <IconButton className="p-0.5" description={isCopied ? t`Copied!` : t`Copy`}>
                  <DocumentDuplicateIcon height={18} width={18} />
                </IconButton>
              )}
            </CopyHelper>
            <IconButton
              as="a"
              className="p-0.5"
              description={t`Explore`}
              href={chains[chainId].getAccountUrl(address)}
              target="_blank"
            >
              <ArrowTopRightOnSquareIcon height={18} width={18} />
            </IconButton>
            <IconButton as="button" className="p-0.5" description={t`Disconnect`} onClick={() => disconnect()}>
              <ArrowLeftOnRectangleIcon height={18} width={18} />
            </IconButton>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <Typography className="whitespace-nowrap" variant="h1">
            {balance.toSignificant(6)} {Native.onChain(chainId).symbol}
          </Typography>
          <Typography className="text-slate-400" weight={600}>
            $
            {balanceAsUsd?.toFixed(2)}
          </Typography>
        </div>
      </div>
      <div className="px-2">
        <div className="h-px bg-slate-500/20 dark:bg-slate-200/10 w-full mt-3" />
      </div>
      <div className="p-2">
        <button
          className="flex text-sm font-semibold hover:text-slate-900 hover:dark:text-slate-50 w-full text-slate-600 dark:text-slate-400 justify-between items-center hover:bg-black/[0.04] hover:dark:bg-white/[0.04] rounded-xl p-2 pr-1 py-2.5"
          onClick={() => setView(ProfileView.Transactions)}
        >
          <Trans>Transactions</Trans> <ChevronRightIcon height={20} width={20} />
        </button>
      </div>
    </>
  )
}
