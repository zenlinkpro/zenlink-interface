function getTrottle(times: number, intervalMS: number): () => void {
  const lastTrorrledCalls: number[] = []
  const trottle = async () => {
    const now = Date.now()
    while (lastTrorrledCalls.length > 0) {
      const first = lastTrorrledCalls[0]
      if (now - first < intervalMS)
        break
      lastTrorrledCalls.shift()
    }
    if (lastTrorrledCalls.length < times) {
      lastTrorrledCalls.push(now)
      return
    }
    await new Promise(resolve => setTimeout(resolve, intervalMS + lastTrorrledCalls[0] - now + 1))
    await trottle()
  }
  return trottle
}

export class Limited {
  public trottle: () => void
  public counterTotalCall: number
  public counterFailedCall: number

  public constructor(times: number, intervalMS: number) {
    this.trottle = getTrottle(times, intervalMS)
    this.counterTotalCall = 0
    this.counterFailedCall = 0
  }

  public async call<T>(func: () => Promise<T>): Promise<T> {
    while (1) {
      this.trottle()
      ++this.counterTotalCall
      try {
        return await func()
      }
      catch (e) {
        ++this.counterFailedCall
      }
    }
    return await func()
  }

  public async callOnce<T>(func: () => Promise<T>): Promise<T> {
    this.trottle()
    ++this.counterTotalCall
    return await func()
  }
}
