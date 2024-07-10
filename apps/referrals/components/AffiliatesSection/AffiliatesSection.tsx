import type { ParachainId } from '@zenlink-interface/chain'
import { Checker, useAccount } from '@zenlink-interface/compat'
import { Button, Chip, Dots, Skeleton, Typography } from '@zenlink-interface/ui'
import { useOwnedCodes } from '@zenlink-interface/wagmi'
import { CodesTable } from 'components/CodesTable'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import { parseBytes32String } from 'ethers/lib/utils.js'
import type { FC } from 'react'
import { useState } from 'react'
import { Trans } from '@lingui/macro'
import { GenerateCodeModal } from './GenerateCodeModal'

interface AffiliatesSectionProps {
  chainId?: ParachainId
}

export const AffiliatesSection: FC<AffiliatesSectionProps> = ({ chainId }) => {
  const [open, setOpen] = useState(false)
  const { address, isConnecting } = useAccount()
  const { data: ownedCodes, isLoading } = useOwnedCodes({
    account: address,
    chainId,
    enabled: chainId && REFERRALS_ENABLED_NETWORKS.includes(chainId),
  })

  return (
    <section className="flex flex-col">
      {(!chainId || !REFERRALS_ENABLED_NETWORKS.includes(chainId) || !ownedCodes.length)
        ? (
            <>
              {isLoading || isConnecting
                ? <Skeleton.Box className="h-[88px] bg-black/[0.12] dark:bg-white/[0.06] m-6" />
                : (
                    <div className="flex flex-col items-center p-6 gap-3">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                        <Trans>Generate Referral Code</Trans>
                      </h2>
                      <Typography className="text-slate-700 dark:text-slate-300 text-center" weight={500}>
                        <Trans>
                          Looks like you don&apos;t have a referral code to share.
                          Create one now and start earning rebates!
                        </Trans>
                      </Typography>
                    </div>
                  )}
            </>
          )
        : (
            <div className="flex flex-col px-6 pt-3 pb-6 gap-2">
              <Typography className="text-slate-800 dark:text-slate-200 flex gap-2 items-center" variant="lg" weight={500}>
                <Trans>Referral Codes</Trans> <Chip color="blue" label={ownedCodes.length || '0'} size="sm" />
              </Typography>
              <Typography className="text-slate-600 dark:text-slate-400" variant="sm" weight={500}>
                <Trans>This account earns a 25% rebate as an associate</Trans>
              </Typography>
              <CodesTable chainId={chainId} codes={ownedCodes.map(code => parseBytes32String(code))} />
            </div>
          )}
      <div className="w-full px-6 pb-6">
        <Checker.Connected chainId={chainId} fullWidth size="md">
          <Checker.Network chainId={chainId} fullWidth size="md">
            <Button
              disabled={isLoading || !chainId || !REFERRALS_ENABLED_NETWORKS.includes(chainId)}
              fullWidth
              onClick={() => setOpen(true)}
              size="md"
            >
              {!chainId || !REFERRALS_ENABLED_NETWORKS.includes(chainId)
                ? 'Unsupported network'
                : isLoading
                  ? <Dots><Trans>Checking codes</Trans></Dots>
                  : 'Generate'}
            </Button>
          </Checker.Network>
        </Checker.Connected>
      </div>
      <GenerateCodeModal chainId={chainId} open={open} setOpen={setOpen} />
    </section>
  )
}
