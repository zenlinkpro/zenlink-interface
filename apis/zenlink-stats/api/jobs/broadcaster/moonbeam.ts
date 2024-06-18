import { privateKeyToAccount } from 'viem/accounts'
import { type Address, createWalletClient, fallback, http } from 'viem'
import { moonbeam } from 'viem/chains'
import { broadcaster } from '../../../abis'

export async function broadcast() {
  const account = privateKeyToAccount(process.env.BROADCAST_ACCOUNT as Address)
  const walletClient = createWalletClient({
    account,
    chain: moonbeam,
    transport: fallback([
      http(moonbeam.rpcUrls.default.http[0]),
    ]),
  })

  await walletClient.writeContract({
    address: '0x2E322226EBCc099b3A7ACEe87951c115B2ec1fcC',
    abi: broadcaster,
    functionName: 'finalizeAndBroadcast',
    account,
    args: [[BigInt(1284)]],
  })
}
