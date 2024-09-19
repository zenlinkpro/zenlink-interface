import type { ParachainId } from '@zenlink-interface/chain'
import type { Account } from '@zenlink-interface/polkadot'
import type { Dispatch, FC, SetStateAction } from 'react'
import { ArrowLeftEndOnRectangleIcon, ArrowTopRightOnSquareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { t, Trans } from '@lingui/macro'
import { chains } from '@zenlink-interface/chain'
import { Amount, Native } from '@zenlink-interface/currency'
import { shortenAddress, shortenName } from '@zenlink-interface/format'
import { useNativeBalancesAll } from '@zenlink-interface/polkadot'
import { usePrices } from '@zenlink-interface/shared'
import { CopyHelper, IconButton, JazzIcon, Select, Typography } from '@zenlink-interface/ui'
import { useMemo } from 'react'
import { ProfileView } from './Profile'

interface DefaultProps {
  chainId: ParachainId
  account: Account
  setView: Dispatch<SetStateAction<ProfileView>>
  allAccounts: Account[]
  updatePolkadotAddress: (polkadotAddress: string | undefined) => void
  disconnect: () => void
}

export const Default: FC<DefaultProps> = ({
  chainId,
  account,
  setView,
  allAccounts,
  disconnect,
  updatePolkadotAddress,
}) => {
  const { data: prices } = usePrices({ chainId })
  const balancesAll = useNativeBalancesAll(chainId, account.address)

  const balance = useMemo(
    () => Amount.fromRawAmount(Native.onChain(chainId), balancesAll ? balancesAll.availableBalance.toString() : '0'),
    [balancesAll, chainId],
  )

  const balanceAsUsd = useMemo(() => {
    return prices?.[Native.onChain(chainId).wrapped.address]
      ? balance.multiply(prices?.[Native.onChain(chainId).wrapped.address])
      : balance.multiply('0')
  }, [balance, chainId, prices])

  return (
    <>
      <div className="flex flex-col gap-8 p-4">
        <div className="flex justify-between items-center gap-3">
          <Typography className="flex items-center gap-1.5 text-slate-50" variant="sm" weight={600}>
            <Select
              button={(
                <Select.Button className="shadow-sm ring-offset-slate-100 dark:ring-offset-slate-900">
                  <div className="flex items-center gap-2">
                    <JazzIcon address={account.address} diameter={16} />
                    <Typography className="text-slate-800 dark:text-slate-200" variant="sm" weight={600}>
                      {account.name ? shortenName(account.name) : shortenAddress(account.address)}
                    </Typography>
                  </div>
                </Select.Button>
              )}
              onChange={(value: Account) => updatePolkadotAddress(value.address)}
              value={account}
            >
              <Select.Options className="w-fit">
                {allAccounts.map(a => (
                  <Select.Option key={a.address} showArrow={false} value={a}>
                    <div className="grid grid-cols-[auto_26px] gap-2 items-center w-full">
                      <div className="flex items-center gap-2.5">
                        <JazzIcon address={a.address} diameter={16} />
                        <Typography
                          className="text-slate-900 dark:text-slate-50"
                          variant="sm"
                          weight={600}
                        >
                          {a.name ? shortenName(a.name, 12) : shortenAddress(a.address)}
                        </Typography>
                      </div>
                      <div className="flex justify-end">
                        {a.address === account.address
                          ? <CheckIcon className="text-blue" height={20} width={20} />
                          : <></>}
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select.Options>
            </Select>
          </Typography>
          <div className="flex gap-3">
            <CopyHelper hideIcon toCopy={account.address}>
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
              href={chains[chainId].getAccountUrl(account.address)}
              target="_blank"
            >
              <ArrowTopRightOnSquareIcon height={18} width={18} />
            </IconButton>
            <IconButton as="button" className="p-0.5" description={t`Disconnect`} onClick={() => { disconnect() }}>
              <ArrowLeftEndOnRectangleIcon height={18} width={18} />
            </IconButton>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <Typography className="whitespace-nowrap" variant="h1">
            {balance.toSignificant(6)}
            {' '}
            {Native.onChain(chainId).symbol}
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
          <Trans>Transactions</Trans>
          {' '}
          <ChevronRightIcon height={20} width={20} />
        </button>
      </div>
    </>
  )
}
