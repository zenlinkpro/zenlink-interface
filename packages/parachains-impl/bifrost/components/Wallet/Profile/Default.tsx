import { ArrowLeftOnRectangleIcon, ArrowTopRightOnSquareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import type { ParachainId } from '@zenlink-interface/chain'
import { chains } from '@zenlink-interface/chain'
import { Amount, Native } from '@zenlink-interface/currency'
import { shortenName } from '@zenlink-interface/format'
import { usePrices } from '@zenlink-interface/shared'
import type { Account } from '@zenlink-interface/polkadot'
import { useNativeBalancesAll } from '@zenlink-interface/polkadot'
import { CopyHelper, IconButton, JazzIcon, Select, Typography } from '@zenlink-interface/ui'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useMemo } from 'react'
import { Trans, t } from '@lingui/macro'
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
    () => Amount.fromRawAmount(Native.onChain(chainId), balancesAll ? balancesAll.freeBalance.toString() : '0'),
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
          <Typography variant="sm" weight={600} className="flex items-center gap-1.5 text-slate-50">
            <Select
              value={account}
              onChange={(value: Account) => updatePolkadotAddress(value.address)}
              button={
                <Select.Button className="shadow-sm ring-offset-slate-100 dark:ring-offset-slate-900">
                  <div className="flex items-center gap-2">
                    <JazzIcon diameter={16} address={account.address} />
                    <Typography variant="sm" weight={600} className="text-slate-800 dark:text-slate-200">
                      {shortenName(account.name)}
                    </Typography>
                  </div>
                </Select.Button>
              }
            >
              <Select.Options className="w-fit">
                {allAccounts.map(a => (
                  <Select.Option key={a.address} value={a} showArrow={false}>
                    <div className="grid grid-cols-[auto_26px] gap-2 items-center w-full">
                      <div className="flex items-center gap-2.5">
                      <JazzIcon diameter={16} address={a.address} />
                        <Typography
                          variant="sm"
                          weight={600}
                          className="text-slate-900 dark:text-slate-50"
                        >
                          {shortenName(a.name, 12)}
                        </Typography>
                      </div>
                      <div className="flex justify-end">
                        {a.address === account.address
                          ? <CheckIcon width={20} height={20} className="text-blue" />
                          : <></>}
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select.Options>
            </Select>
          </Typography>
          <div className="flex gap-3">
            <CopyHelper toCopy={account.address} hideIcon>
              {isCopied => (
                <IconButton className="p-0.5" description={isCopied ? t`Copied!` : t`Copy`}>
                  <DocumentDuplicateIcon width={18} height={18} />
                </IconButton>
              )}
            </CopyHelper>
            <IconButton
              as="a"
              target="_blank"
              href={chains[chainId].getAccountUrl(account.address)}
              className="p-0.5"
              description={t`Explore`}
            >
              <ArrowTopRightOnSquareIcon width={18} height={18} />
            </IconButton>
            <IconButton as="button" onClick={() => { disconnect() }} className="p-0.5" description={t`Disconnect`}>
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
      <div className="h-px bg-slate-500/20 dark:bg-slate-200/10 w-full mt-3" />
      </div>
      <div className="p-2">
        <button
          onClick={() => setView(ProfileView.Transactions)}
          className="flex text-sm font-semibold hover:text-slate-900 hover:dark:text-slate-50 w-full text-slate-600 dark:text-slate-400 justify-between items-center hover:bg-black/[0.04] hover:dark:bg-white/[0.04] rounded-xl p-2 pr-1 py-2.5"
        >
          <Trans>Transactions</Trans> <ChevronRightIcon width={20} height={20} />
        </button>
      </div>
    </>
  )
}
