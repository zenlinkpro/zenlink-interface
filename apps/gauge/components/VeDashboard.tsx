import { BuildingLibraryIcon, HandRaisedIcon, InformationCircleIcon, WalletIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { ParachainId } from '@zenlink-interface/chain'
import { Amount, DOT, ZLK } from '@zenlink-interface/currency'
import { Button, Currency, Tooltip, Typography } from '@zenlink-interface/ui'
import { useVotingEscrow } from '@zenlink-interface/wagmi'
import { type FC, useMemo } from 'react'

export const VeDashboard: FC = () => {
  const { data: ve } = useVotingEscrow(ParachainId.MOONBEAM, { enabled: true })

  const [totalVeBalance, myVeBalance] = useMemo(
    () => [
      Amount.fromRawAmount(ZLK[ParachainId.MOONBEAM], ve?.totalSupplyAmount || '0'),
      Amount.fromRawAmount(ZLK[ParachainId.MOONBEAM], ve?.balance || '0'),
    ],
    [ve],
  )

  return (
    <div className="flex flex-col sm:flex-row mb-4 bg-slate-200 dark:bg-slate-800 rounded-xl divide-y sm:divide-x sm:divide-y-0 divide-dashed divide-slate-500/50">
      <div className="flex p-4 flex-grow justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BuildingLibraryIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>Total veZLK</Trans>
            </Typography>
          </div>
          <Typography variant="lg" weight={600}>
            {totalVeBalance.toSignificant(4)}
          </Typography>
        </div>
      </div>
      <div className="flex p-4 flex-grow justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <WalletIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>My veZLK</Trans>
            </Typography>
          </div>
          <Typography variant="lg" weight={600}>
            {myVeBalance.toSignificant(4)}
          </Typography>
        </div>
      </div>
      <div className="flex p-4 flex-grow justify-start sm:justify-center items-center">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <HandRaisedIcon height={20} width={20} />
            <Typography weight={500}>
              <Trans>Claimable Rewards</Trans>
            </Typography>
            <Tooltip content={(
              <Typography className="text-slate-700 dark:text-slate-300" variant="xs" weight={500}>
                <Trans>
                  DOT rewards distributed every 4-5 weeks.
                </Trans>
              </Typography>
            )}
            >
              <InformationCircleIcon height={14} width={14} />
            </Tooltip>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
              <Currency.Icon currency={DOT[ParachainId.MOONBEAM]} disableLink height={20} width={20} />
              <Typography variant="lg" weight={600}>
                0
              </Typography>
            </div>
            <Button
              disabled
              size="xs"
            >
              <Trans>Claim</Trans>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
