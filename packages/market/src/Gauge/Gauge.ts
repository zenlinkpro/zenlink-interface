import { JSBI, Percent, ZERO, _1e18 } from '@zenlink-interface/math'
import type { Market } from '../Market'

interface UserVote {
  totalVotedWeight: JSBI
  weight: JSBI
}

export class Gauge {
  public readonly USER_VOTE_MAX_WEIGHT = _1e18
  public readonly id: string
  public readonly market: Market
  public readonly totalVotes: JSBI
  public readonly poolVote: JSBI
  public readonly userVote: UserVote

  public constructor(market: Market, totalVotes: JSBI, poolVote: JSBI, userVote?: UserVote) {
    this.id = market.id
    this.market = market
    this.totalVotes = totalVotes
    this.poolVote = poolVote
    this.userVote = userVote || { totalVotedWeight: ZERO, weight: ZERO }
  }

  public get communityVotedPercentage(): Percent {
    if (JSBI.equal(this.totalVotes, ZERO))
      return new Percent(0)

    return new Percent(this.poolVote, this.totalVotes)
  }

  public get totalVotedPercentage(): Percent {
    const { totalVotedWeight } = this.userVote
    return new Percent(totalVotedWeight, this.USER_VOTE_MAX_WEIGHT)
  }

  public get votedPercentage(): Percent {
    const { weight } = this.userVote
    return new Percent(weight, this.USER_VOTE_MAX_WEIGHT)
  }

  public get maxVoteLeftPercentage(): Percent {
    const { totalVotedWeight } = this.userVote
    return new Percent(
      JSBI.subtract(this.USER_VOTE_MAX_WEIGHT, totalVotedWeight),
      this.USER_VOTE_MAX_WEIGHT,
    )
  }
}
