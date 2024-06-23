import type { RC } from './helper'
import { normalizeRawRC, queryVotePositions } from './helper'
import rawSwapDatas from './data/swap-result.json'
import { parseBalanceMap, verifyMerkleRoot } from './merkle'

const WTIME_INF = 2 ** 31 - 1

async function main() {
  const votingDatas = await queryVotePositions(WTIME_INF)
  const swapDatas: RC = normalizeRawRC(rawSwapDatas)

  let sumReward = BigInt(0)
  const userRewards: Record<string, string> = {}

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
      const accountShare = votingDatas[pool][user].valueAt(wTime)
      const rewardForAccount = rewardAmount * accountShare / totalVotingPower

      if (rewardForAccount === BigInt(0))
        continue

      if (!userRewards[user])
        userRewards[user] = '0'
      userRewards[user] = (BigInt(userRewards[user]) + rewardForAccount).toString()
    }

    sumReward += rewardAmount
  }

  console.log('sumReward:', sumReward)
  console.log('userRewards:', userRewards)

  const balanceMap = parseBalanceMap(userRewards)
  console.log('balanceMap:', balanceMap)
  verifyMerkleRoot(balanceMap)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
