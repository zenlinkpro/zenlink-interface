import type { Token } from '@zenlink-interface/currency'
import type { Address } from 'viem'
import type { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { ParachainId } from '@zenlink-interface/chain'
import { Amount, DOT } from '@zenlink-interface/currency'
import { JSBI, ZERO } from '@zenlink-interface/math'
import { useCheckVotingRewards, votingResultValidator } from '@zenlink-interface/wagmi'
import { useMemo } from 'react'

interface UseVotingRewardsReturn {
  unClaimedDOTAmount: Amount<Token>
  data: z.infer<typeof votingResultValidator>
}

export function useVotingRewards(account?: string | Address): UseVotingRewardsReturn {
  const queryKey = useMemo(() => ['https://zenlink-stats.zenlink.pro/api/vote/claim', account], [account])

  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`https://zenlink-stats.zenlink.pro/api/vote/claim/${account}`)
        .then(response => response.json())
      return votingResultValidator.parse(res.data)
    },
    staleTime: 20000,
    enabled: !!account,
  })

  const { data: checkedData } = useCheckVotingRewards(ParachainId.MOONBEAM, data)

  return useMemo(() => {
    const unClaimedDOTAmount = Amount.fromRawAmount(
      DOT[ParachainId.MOONBEAM],
      checkedData.reduce((total, d) => JSBI.add(total, JSBI.BigInt(d.amount)), ZERO),
    )

    return {
      unClaimedDOTAmount,
      data: checkedData,
    }
  }, [checkedData])
}
