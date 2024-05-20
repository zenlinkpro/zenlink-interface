import { ParachainId } from '@zenlink-interface/chain'
import type { Gauge } from '@zenlink-interface/market'
import { JSBI, Percent, _1e18 } from '@zenlink-interface/math'
import { useGauges, useVoteReview } from '@zenlink-interface/wagmi'
import type { FC, ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Address } from 'viem'

export enum VoteMode {
  VIEW,
  UPDATE,
}

export enum ChartMode {
  COMMUNITY_VOTE,
  MY_VOTE,
}

interface GaugeVotesProps {
  gauges: Gauge[] | undefined
  isLoading: boolean
  unusedVotePercent: Percent
  voteMode: VoteMode
  setVoteMode: (mode: VoteMode) => void
  chartMode: ChartMode
  setChartMode: (mode: ChartMode) => void
  votedPercentMap: Record<string, Percent>
  communityVotedPercentMap: Record<string, Percent>
  voteInputMap: Record<string, Percent>
  onInputVote: (gauge: Gauge, input: number) => void
  onClearInputVote: () => void
  isWritePending: boolean
  sendTransaction: (() => void) | undefined
}

const VotesContext = createContext<GaugeVotesProps | undefined>(undefined)

interface GaugeVotesProviderProps {
  children?: ReactNode
}

export const GaugeVotesProvider: FC<GaugeVotesProviderProps> = ({ children }) => {
  const [voteInputMap, setVoteInputMap] = useState<Record<string, Percent>>({})
  const [voteMode, setVoteMode] = useState(VoteMode.VIEW)
  const [chartMode, setChartMode] = useState(ChartMode.COMMUNITY_VOTE)

  const { data: gauges, isLoading } = useGauges(ParachainId.MOONBEAM)

  const onSetVoteMode = useCallback((mode: VoteMode) => {
    if (mode === VoteMode.UPDATE)
      setChartMode(ChartMode.MY_VOTE)
    else
      setChartMode(ChartMode.COMMUNITY_VOTE)

    setVoteMode(mode)
  }, [])

  const votedPercentMap: Record<string, Percent> = useMemo(() => {
    if (!gauges || !gauges.length)
      return {}

    return gauges.reduce((map, guage) => ({
      ...map,
      [guage.id]: guage.votedPercentage,
    }), {})
  }, [gauges])

  const communityVotedPercentMap = useMemo(() => {
    if (!gauges || !gauges.length)
      return {}

    return gauges.reduce((map, guage) => ({
      ...map,
      [guage.id]: guage.communityVotedPercentage,
    }), {})
  }, [gauges])

  const unusedVotePercent = useMemo(() => {
    if (!gauges || !gauges.length)
      return new Percent(0)

    const percentTotal = gauges.reduce(
      (total, gauge) => {
        const votedPercent = votedPercentMap[gauge.id]
        const inputPercent = voteInputMap[gauge.id]

        return total.add(inputPercent || votedPercent || new Percent(0))
      },
      new Percent(0),
    )
    return new Percent(1).subtract(percentTotal)
  }, [gauges, voteInputMap, votedPercentMap])

  const onInputVote = useCallback((gauge: Gauge, input: number) => {
    if (voteMode === VoteMode.VIEW)
      return

    const numerator = Number.parseInt(
      ((input / 100) * JSBI.toNumber(gauge.USER_VOTE_MAX_WEIGHT)).toString(),
    )
    const inputPercent = new Percent(numerator, gauge.USER_VOTE_MAX_WEIGHT)

    const percentTotal = (gauges || [])
      .filter(_gauge => _gauge.id !== gauge.id)
      .reduce((total, gauge) => {
        const votedPercent = votedPercentMap[gauge.id]
        const inputPercent = voteInputMap[gauge.id]

        return total.add(inputPercent || votedPercent || new Percent(0))
      }, new Percent(0))

    const unusedVotePercent = new Percent(1).subtract(percentTotal)

    setVoteInputMap(prev => ({
      ...prev,
      [gauge.id]: inputPercent.greaterThan(unusedVotePercent)
        ? unusedVotePercent
        : inputPercent,
    }))
  }, [gauges, voteInputMap, voteMode, votedPercentMap])

  const onClearInputVote = useCallback(() => {
    if (voteMode === VoteMode.VIEW)
      return
    setVoteInputMap({})
  }, [voteMode])

  const voteReviewProps = useMemo(() => ({
    markets: Object.keys(voteInputMap) as Address[],
    weights: Object.values(voteInputMap).map(percent => percent.multiply(_1e18).quotient),
  }), [voteInputMap])

  const { isWritePending, sendTransaction } = useVoteReview({
    chainId: ParachainId.MOONBEAM,
    markets: voteReviewProps.markets,
    weights: voteReviewProps.weights,
  })

  return (
    <VotesContext.Provider
      value={{
        gauges,
        isLoading,
        unusedVotePercent,
        voteMode,
        setVoteMode: onSetVoteMode,
        chartMode,
        setChartMode,
        votedPercentMap,
        communityVotedPercentMap,
        voteInputMap,
        onInputVote,
        onClearInputVote,
        isWritePending,
        sendTransaction,
      }}
    >
      {children}
    </VotesContext.Provider>
  )
}

export function useGaugeVotes() {
  const context = useContext(VotesContext)
  if (!context)
    throw new Error('Hook can only be used inside Votes Context')

  return context
}
