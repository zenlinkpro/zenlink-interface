import type { ClaimDataWithContract, MerkleResults } from '../types'
import fs from 'node:fs/promises'

async function main() {
  const rootPath = 'api/vote/claim'
  const dataFiles = await fs.readdir(`${rootPath}/data`)

  const userResults: Record<string, ClaimDataWithContract[]> = {}

  for (const dataFile of dataFiles) {
    const data = JSON.parse(
      await fs.readFile(`${rootPath}/data/${dataFile}`, { encoding: 'utf-8' }),
    ) as MerkleResults

    Object.entries(data.balanceMap.claims).forEach(([user, claimData]) => {
      if (!userResults[user]) {
        userResults[user] = []
      }
      userResults[user].push({ contractAddress: data.contractAddress, ...claimData })
    })
  }

  await fs.writeFile(
    `${rootPath}/user-results.json`,
    JSON.stringify(userResults, null, 2),
    { encoding: 'utf-8' },
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
