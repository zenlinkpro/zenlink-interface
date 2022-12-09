import { fetchTxStatus } from '../../queries'

export type Status = 'error' | 'idle' | 'loading' | 'success'

export const txStatus = async (chainId: number, hash: string, onStatus: (status: Status) => void) => {
  onStatus('loading')

  const { data, error } = await fetchTxStatus(chainId, hash)
  if (error)
    return
  if (data) {
    onStatus(data.success ? 'success' : 'error')
  }
  else {
    const interval = setInterval(async () => {
      const { data, error } = await fetchTxStatus(chainId, hash)

      if (error)
        clearInterval(interval)

      if (data) {
        onStatus(data.success ? 'success' : 'error')
        clearInterval(interval)
      }
    }, 12000)
  }
}
