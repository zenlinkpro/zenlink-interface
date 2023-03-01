import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { chainName } from '@zenlink-interface/chain'
import { AppearOnMount, DEFAULT_INPUT_UNSTYLED, Link, NetworkIcon, Typography, classNames } from '@zenlink-interface/ui'
import { REFERRALS_ENABLED_NETWORKS } from 'config'
import type { FC } from 'react'

interface ReferralsLinkButtonProps {
  chainId: number
}

export const ReferralsLinkButton: FC<ReferralsLinkButtonProps> = ({ chainId }) => {
  if (!REFERRALS_ENABLED_NETWORKS.includes(chainId))
    return null

  return (
    <AppearOnMount className="w-full max-w-[440px]">
      <Link.Internal href="https://app.zenlink.pro/referrals">
        <button
          className={classNames(
            DEFAULT_INPUT_UNSTYLED,
            'flex items-center justify-between mt-4 bg-white/[0.04] hover:bg-white/[0.08] hover:text-slate-200 rounded-2xl py-3 px-4 text-slate-300',
          )}
        >
          <div className="flex items-center gap-2">
            <NetworkIcon chainId={chainId} width={32} height={32} />
            <div>
              <Typography weight={600}>{chainName[chainId]} referral program</Typography>
              <Typography variant="sm" weight={500}>Get fee discounts and earn rebates.</Typography>
            </div>
          </div>
          <ArrowTopRightOnSquareIcon width={20} height={20} />
        </button>
      </Link.Internal>
    </AppearOnMount>
  )
}