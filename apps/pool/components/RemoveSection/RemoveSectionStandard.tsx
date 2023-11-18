import { calculateSlippageAmount } from '@zenlink-interface/amm'
import {
  Approve,
  Checker,
  PairState,
  useAccount,
  usePair,
  usePairTotalSupply,
  useRemoveLiquidityStandardReview,
} from '@zenlink-interface/compat'
import { Amount } from '@zenlink-interface/currency'
import type { Pair } from '@zenlink-interface/graph-client'
import { useIsMounted } from '@zenlink-interface/hooks'
import { Percent } from '@zenlink-interface/math'
import { useNotifications, useSettings } from '@zenlink-interface/shared'
import { Button, Dots } from '@zenlink-interface/ui'
import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { Trans } from '@lingui/macro'
import { useTokensFromPair, useUnderlyingTokenBalanceFromPool } from '../../lib/hooks'
import { usePoolPosition } from '../PoolPositionProvider'
import { RemoveSectionWidgetStandard } from './RemoveSectionWidgetStandard'

interface RemoveSectionLegacyProps {
  pair: Pair
}

const DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE = new Percent(5, 100)

export const RemoveSectionStandard: FC<RemoveSectionLegacyProps> = ({ pair }) => {
  const { token0, token1 } = useTokensFromPair(pair)
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const [{ slippageTolerance }] = useSettings()
  const [, { createNotification }] = useNotifications(address)

  const slippagePercent = useMemo(
    () =>
      slippageTolerance ? new Percent(slippageTolerance * 100, 10_000) : DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE,
    [slippageTolerance],
  )

  const [percentage, setPercentage] = useState<string>('')
  const percentToRemove = useMemo(() => new Percent(percentage, 100), [percentage])

  const {
    data: [poolState, pool],
  } = usePair(pair.chainId, token0, token1)
  const { balance } = usePoolPosition()
  const totalSupply = usePairTotalSupply(pool, pair.chainId)

  const [reserve0, reserve1] = useMemo(() => {
    return [pool?.reserve0, pool?.reserve1]
  }, [pool?.reserve0, pool?.reserve1])

  const reserves = useMemo(() => {
    return reserve0 && reserve1 ? [reserve0, reserve1] : []
  }, [reserve0, reserve1])

  const underlying = useUnderlyingTokenBalanceFromPool({
    reserves,
    totalSupply,
    balance,
  })

  const [underlying0, underlying1] = underlying

  const currencyAToRemove = useMemo(
    () =>
      token0
        ? percentToRemove && percentToRemove.greaterThan('0') && underlying0
          ? Amount.fromRawAmount(token0, percentToRemove.multiply(underlying0.quotient).quotient || '0')
          : Amount.fromRawAmount(token0, '0')
        : undefined,
    [percentToRemove, token0, underlying0],
  )

  const currencyBToRemove = useMemo(
    () =>
      token1
        ? percentToRemove && percentToRemove.greaterThan('0') && underlying1
          ? Amount.fromRawAmount(token1, percentToRemove.multiply(underlying1.quotient).quotient || '0')
          : Amount.fromRawAmount(token1, '0')
        : undefined,
    [percentToRemove, token1, underlying1],
  )

  const [minAmount0, minAmount1] = useMemo(() => {
    return [
      currencyAToRemove
        ? Amount.fromRawAmount(
          currencyAToRemove.currency,
          calculateSlippageAmount(currencyAToRemove, slippagePercent)[0],
        )
        : undefined,
      currencyBToRemove
        ? Amount.fromRawAmount(
          currencyBToRemove.currency,
          calculateSlippageAmount(currencyBToRemove, slippagePercent)[0],
        )
        : undefined,
    ]
  }, [slippagePercent, currencyAToRemove, currencyBToRemove])

  const amountToRemove = useMemo(
    () => balance?.multiply(percentToRemove),
    [balance, percentToRemove],
  )

  const { sendTransaction, isWritePending, routerAddress } = useRemoveLiquidityStandardReview({
    chainId: pair.chainId,
    pool,
    token0,
    token1,
    percentToRemove,
    balance,
    minAmount0,
    minAmount1,
  })

  return (
    <div>
      <RemoveSectionWidgetStandard
        chainId={pair.chainId}
        isFarm={false}
        percentage={percentage}
        setPercentage={setPercentage}
        token0={token0}
        token0Minimum={minAmount0}
        token1={token1}
        token1Minimum={minAmount1}
      >
        <Checker.Connected chainId={pair.chainId} fullWidth size="md">
          <Checker.Custom
            guard={(
              <Button disabled={true} fullWidth size="md">
                <Trans>Pool Not Found</Trans>
              </Button>
            )}
            showGuardIfTrue={isMounted && [PairState.NOT_EXISTS, PairState.INVALID].includes(poolState)}
          >
            <Checker.Network chainId={pair.chainId} fullWidth size="md">
              <Checker.Custom
                guard={(
                  <Button disabled={true} fullWidth size="md">
                    <Trans>Enter Amount</Trans>
                  </Button>
                )}
                showGuardIfTrue={+percentage <= 0}
              >
                <Approve
                  chainId={pair.chainId}
                  className="flex-grow !justify-end"
                  components={(
                    <Approve.Components>
                      <Approve.Token
                        address={routerAddress}
                        amount={amountToRemove}
                        chainId={pair.chainId}
                        className="whitespace-nowrap"
                        fullWidth
                        size="md"
                      />
                    </Approve.Components>
                  )}
                  onSuccess={createNotification}
                  render={({ approved }) => {
                    return (
                      <Button
                        disabled={!approved || isWritePending}
                        fullWidth
                        onClick={() => sendTransaction?.()}
                        size="md"
                        variant="filled"
                      >
                        {isWritePending ? <Dots><Trans>Confirm transaction</Trans></Dots> : <Trans>Remove Liquidity</Trans>}
                      </Button>
                    )
                  }}
                />
              </Checker.Custom>
            </Checker.Network>
          </Checker.Custom>
        </Checker.Connected>
      </RemoveSectionWidgetStandard>
    </div>
  )
}
