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
    address: '0xA8d7f38Ceaf885dB10b4d76b070A0c0b298e87be',
    abi: broadcaster,
    functionName: 'finalizeAndBroadcast',
    account,
    args: [[BigInt(1284)]],
  })
}
