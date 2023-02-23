import type { ParachainId } from '@zenlink-interface/chain'
import { Checker, useAccount } from '@zenlink-interface/compat'
import { Button, Chip, Typography } from '@zenlink-interface/ui'
import { useReferralInfo } from '@zenlink-interface/wagmi'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { SetCodeModal } from './SetCodeModal'

interface TradersSectionProps {
  chainId?: ParachainId
  initialReferralCode?: string
  setInitialCode: Dispatch<SetStateAction<string>>
}

export const TradersSection: FC<TradersSectionProps> = ({ chainId, initialReferralCode, setInitialCode }) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
  const { data, isLoading } = useReferralInfo({
    account: address,
    chainId,
    enabled: chainId && REFERRALS_ENABLED_NETWORKS.includes(chainId),
  })

  useEffect(() => {
    if (chainId && initialReferralCode) {
      setOpen(true)
      setInitialCode('')
    }
  }, [chainId, initialReferralCode, setInitialCode])

  return (
    <section className="flex flex-col">
      {(!chainId || !REFERRALS_ENABLED_NETWORKS.includes(chainId) || !data)
        ? (
          <div className="flex flex-col items-center p-6 gap-3">
            <h2 className="text-2xl font-semibold text-slate-50">Enter Referral Code</h2>
            <Typography weight={500} className="text-slate-200 text-center">
              Please input a referral code to benefit from fee discounts.
            </Typography>
          </div>
          )
        : (
          <div className="flex flex-col px-6 pt-3 pb-6 gap-2">
            <Typography variant="lg" weight={500} className="text-slate-200 flex gap-2 items-center">
              Active Referral Code <Chip label={data.code} color="green" />
            </Typography>
            <Typography variant="sm" weight={500} className="text-slate-400">
              You will receive a 20% discount on your swapping fees
            </Typography>
          </div>
          )
      }
      <div className="w-full px-6 pb-6">
        <Checker.Connected chainId={chainId} fullWidth size="md">
          <Checker.Network fullWidth size="md" chainId={chainId}>
            <Button
              fullWidth
              onClick={() => setOpen(true)}
              disabled={isLoading || !chainId || !REFERRALS_ENABLED_NETWORKS.includes(chainId)}
              size="md"
            >
              {!chainId || !REFERRALS_ENABLED_NETWORKS.includes(chainId)
                ? 'Unsupported network'
                : 'Set or update'
              }
            </Button>
          </Checker.Network>
        </Checker.Connected>
      </div>
      <SetCodeModal chainId={chainId} open={open} setOpen={setOpen} initialReferralCode={initialReferralCode} />
    </section>
  )
}
