import type { ParachainId } from '@zenlink-interface/chain'
import { Checker, useAccount } from '@zenlink-interface/compat'
import { Button, Chip, Dots, Skeleton, Typography } from '@zenlink-interface/ui'
import { useOwnedCodes } from '@zenlink-interface/wagmi'
import { CodesTable } from 'components/CodesTable'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import { parseBytes32String } from 'ethers/lib/utils.js'
import type { FC } from 'react'
import { useState } from 'react'
import { GenerateCodeModal } from './GenerateCodeModal'

interface AffiliatesSectionProps {
  chainId?: ParachainId
}

export const AffiliatesSection: FC<AffiliatesSectionProps> = ({ chainId }) => {
  const [open, setOpen] = useState(false)
  const { address } = useAccount()
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
            {isLoading
              ? <Skeleton.Box className="h-[88px] bg-white/[0.06] m-6" />
              : (
                <div className="flex flex-col items-center p-6 gap-3">
                  <h2 className="text-xl font-semibold text-slate-50">Generate Referral Code</h2>
                  <Typography weight={500} className="text-slate-300 text-center">
                    Looks like you don&apos;t have a referral code to share.
                    Create one now and start earning rebates!
                  </Typography>
                </div>
                )
            }
          </>
          )
        : (
          <div className="flex flex-col px-6 pt-3 pb-6 gap-2">
            <Typography variant="lg" weight={500} className="text-slate-200 flex gap-2 items-center">
              Referral Codes <Chip label={ownedCodes.length || '0'} size="sm" color="blue" />
            </Typography>
            <Typography variant="sm" weight={500} className="text-slate-400">
              This account earns a 25% rebate as an associate
            </Typography>
            <CodesTable codes={ownedCodes.map(code => parseBytes32String(code))} chainId={chainId} />
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
                : isLoading
                  ? <Dots>Checking codes</Dots>
                  : 'Generate'
              }
            </Button>
          </Checker.Network>
        </Checker.Connected>
      </div>
      <GenerateCodeModal chainId={chainId} open={open} setOpen={setOpen} />
    </section>
  )
}
