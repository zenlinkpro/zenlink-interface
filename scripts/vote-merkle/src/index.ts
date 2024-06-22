import type { RC } from './helper'
import { normalizeRawRC, queryVotePositions } from './helper'
import rawSwapDatas from './data/swap-result.json'

const WTIME_INF = 2 ** 31 - 1

async function main() {
  const votingDatas = await queryVotePositions(WTIME_INF)
  const swapDatas: RC = normalizeRawRC(rawSwapDatas)

  let sumReward = BigInt(0)
  const userRewards: Record<string, bigint> = {}

  for (const id in swapDatas) {
    const [pool, _week] = id.split('-')
    const wTime = Number.parseInt(_week)

    if (!votingDatas[pool])
      continue

    const rewardAmount = swapDatas[id]
    let totalVotingPower = BigInt(0)

    for (const user of Object.keys(votingDatas[pool])) {
      const userVotingPower = votingDatas[pool][user].valueAt(wTime)
      totalVotingPower = totalVotingPower + userVotingPower
    }

    for (const user of Object.keys(votingDatas[pool])) {
      if (!userRewards[user])
        userRewards[user] = BigInt(0)
      const accountShare = votingDatas[pool][user].valueAt(wTime)
      if (accountShare === BigInt(0))
        continue
      const rewardForAccount = rewardAmount * accountShare / totalVotingPower
      userRewards[user] += rewardForAccount
    }

    sumReward += rewardAmount
  }

  console.log('sumReward:', sumReward)
  console.log('userRewards:', userRewards)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
