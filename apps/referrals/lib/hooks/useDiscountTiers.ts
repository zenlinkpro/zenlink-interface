import type { ParachainId } from '@zenlink-interface/chain'
import { useAccount, useBalance } from '@zenlink-interface/compat'
import { ZLK } from '@zenlink-interface/currency'
import { useMemo } from 'react'

export enum Tiers {
  Tier0 = 'Tier0',
  Tier1 = 'Tier1',
  Tier2 = 'Tier2',
  Tier3 = 'Tier3',
  Tier4 = 'Tier4',
  Tier5 = 'Tier5',
  Tier6 = 'Tier6',
  Tier7 = 'Tier7',
}

interface TiersRules {
  tier: Tiers
  range: [number | undefined, number | undefined]
  desc: string
  discount: string
}

export interface DiscountTiers {
  id: string
  tier: Tiers
  positionSize: string
  discount: string
  highlighted: boolean
}

const TIERS_RULES: TiersRules[] = [
  { tier: Tiers.Tier0, range: [undefined, 0], desc: 'ZLK = 0', discount: '0%' },
  { tier: Tiers.Tier1, range: [0, 5000], desc: '0 < ZLK < 5000', discount: '3%' },
  { tier: Tiers.Tier2, range: [5000, 30000], desc: '5000 <= ZLK < 30000', discount: '5%' },
  { tier: Tiers.Tier3, range: [30000, 60000], desc: '30000 <= ZLK < 60000', discount: '10%' },
  { tier: Tiers.Tier4, range: [60000, 100000], desc: '60000 <= ZLK < 100000', discount: '12%' },
  { tier: Tiers.Tier5, range: [100000, 150000], desc: '100000 <= ZLK < 150000', discount: '15%' },
  { tier: Tiers.Tier6, range: [150000, 300000], desc: '150000 <= ZLK < 300000', discount: '18%' },
  { tier: Tiers.Tier7, range: [300000, undefined], desc: 'ZLK >= 300000', discount: '20%' },
]

export function useDiscountTiers(chainId: ParachainId) {
  const { address } = useAccount()
  const { data: balance } = useBalance({ chainId, account: address, currency: ZLK[chainId] })

  return useMemo(
    () => TIERS_RULES.map(({ tier, range, discount, desc }) => ({
      id: tier,
      tier,
      positionSize: desc,
      discount,
      highlighted:
        balance && address
          ? (
              range[0] === 0
                ? Number(balance.toExact()) > range[0]
                : Number(balance.toExact()) >= (range[0] ?? 0)
            ) && (
              range[1] === 0
                ? Number(balance.toExact()) === range[1]
                : Number(balance.toExact()) < (range[1] ?? Number.POSITIVE_INFINITY)
            )
          : false,
    })),
    [address, balance],
  )
}
