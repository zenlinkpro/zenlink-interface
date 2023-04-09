import type { ParachainId } from '@zenlink-interface/chain'
import { Checker, useAccount } from '@zenlink-interface/compat'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Button, Chip, Skeleton, Typography } from '@zenlink-interface/ui'
import { useOwnedCodes, useReferralInfo } from '@zenlink-interface/wagmi'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import type { Dispatch, FC, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { Trans, t } from '@lingui/macro'
import { SetCodeModal } from './SetCodeModal'

interface TradersSectionProps {
  chainId?: ParachainId
  initialReferralCode?: string
  setInitialCode: Dispatch<SetStateAction<string>>
}

export const TradersSection: FC<TradersSectionProps> = ({ chainId, initialReferralCode, setInitialCode }) => {
  const [open, setOpen] = useState(false)
  const { address, isConnecting } = useAccount()
  const mounted = useIsMounted()
  const { data, isLoading } = useReferralInfo({
    account: address,
    chainId,
    enabled: chainId && REFERRALS_ENABLED_NETWORKS.includes(chainId),
  })
  const { data: ownedCodes } = useOwnedCodes({
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
      {(!chainId || !REFERRALS_ENABLED_NETWORKS.includes(chainId) || !data || !mounted)
        ? (
          <>
            {isLoading || isConnecting || !mounted
              ? <Skeleton.Box className="h-[88px] bg-black/[0.12] dark:bg-white/[0.06] mt-3 mb-6 mx-6" />
              : (
                <div className="flex flex-col items-center justify-center p-6 gap-3 h-[128px]">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Enter Referral Code</h2>
                  <Typography weight={500} className="text-slate-700 dark:text-slate-300 text-center">
                    <Trans>Please input a referral code to benefit from fee discounts.</Trans>
                  </Typography>
                </div>
                )
            }
          </>
          )
        : (
          <div className="flex flex-col items-center justify-center px-6 pt-3 pb-6 gap-2 h-[128px]">
            <Typography variant="lg" weight={500} className="text-slate-800 dark:text-slate-200 flex gap-2 items-center">
              <Trans>Active Referral Code</Trans> <Chip label={data.code} color="green" />
            </Typography>
            <Typography variant="sm" weight={500} className="text-slate-600 dark:text-slate-400">
              <Trans>You will receive a 20% discount on your swapping fees</Trans>
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
                ? t`Unsupported network`
                : !data ? t`Set` : t`Update`
              }
            </Button>
          </Checker.Network>
        </Checker.Connected>
      </div>
      <SetCodeModal
        chainId={chainId}
        open={open}
        setOpen={setOpen}
        initialReferralCode={initialReferralCode}
        ownedCodes={ownedCodes}
      />
    </section>
  )
}
