import type { ContractCallContext } from 'ethereum-multicall'
import { Multicall } from 'ethereum-multicall'
import type { ethers } from 'ethers'
import { BigNumber } from 'ethers'

interface SeriaCall {
  contract: string
  abi: any[]
  method: string
  methodParameters: any
}

export class MultiCallProvider {
  public readonly multicall: Multicall
  public readonly seriaLength: Map<number, number> = new Map()

  public prepairingCallcontext?: ContractCallContext[]
  public prepairingCall?: Promise<any[][]>
  public nextSeriaId = 0
  public lastCallBlockNumber = 0

  public constructor(chainDataProvider: ethers.providers.BaseProvider) {
    this.multicall = new Multicall({
      ethersProvider: chainDataProvider,
      tryAggregate: true,
    })
  }

  // aggregate several multicalls in one
  public async call(inp: ContractCallContext[]): Promise<any[][]> {
    if (!this.prepairingCallcontext) {
      this.prepairingCallcontext = inp
      this.prepairingCall = new Promise<any[][]>((resolve) => {
        setTimeout(async () => {
          const input = this.prepairingCallcontext as ContractCallContext[]
          this.prepairingCallcontext = undefined
          this.prepairingCall = undefined
          this.nextSeriaId = 0
          const { results, blockNumber } = await this.multicall.call(input)
          this.lastCallBlockNumber = blockNumber
          const serias: any[][] = []
          for (const r in results) {
            const [elementSeria, index] = r.split('_')
            const seria = parseInt(elementSeria)
            const retContext = results[r].callsReturnContext[0]
            if (serias[seria] === undefined)
              serias[seria] = new Array(this.seriaLength.get(seria) || 0)
            serias[parseInt(elementSeria)][parseInt(index)] = retContext.success ? retContext.returnValues : undefined
          }
          resolve(serias)
        }, 0)
      })
    }
    else {
      this.prepairingCallcontext = this.prepairingCallcontext.concat(inp)
    }
    return this.prepairingCall as Promise<any[][]>
  }

  public async seriaCall(calls: SeriaCall[]): Promise<any[]> {
    const seria = this.nextSeriaId++
    const getReservesCalls: ContractCallContext[] = calls.map((call, i) => ({
      reference: `${seria}_${i}`,
      contractAddress: call.contract,
      abi: call.abi,
      calls: [
        {
          reference: '',
          methodName: call.method,
          methodParameters: call.methodParameters,
        },
      ],
    }))
    this.seriaLength.set(seria, getReservesCalls.length)
    const serias = await this.call(getReservesCalls) // can be mixed with other calls
    return serias[seria] || []
  }

  public async multiContractCall(contracts: string[], abi: any[], method: string, methodParameters: any): Promise<any[]> {
    if (!contracts.length)
      return []

    return await this.seriaCall(
      contracts.map(contract => ({
        contract,
        abi,
        method,
        methodParameters,
      })),
    )
  }

  public async multiDataCall(contract: string, abi: any[], method: string, methodParameters: any[]): Promise<any[]> {
    return await this.seriaCall(
      methodParameters.map(data => ({
        contract,
        abi,
        method,
        methodParameters: data,
      })),
    )
  }
}

export function convertToNumbersArray(arr: any[]): (number | undefined)[] {
  return arr.map((a) => {
    if (a === undefined)
      return undefined
    return parseInt(a[0].hex, 16)
  })
}

export function convertToBigNumberArray(arr: any[]): (BigNumber | undefined)[] {
  return arr.map((a) => {
    if (a === undefined)
      return undefined
    return BigNumber.from(a[0].hex)
  })
}

export function convertToBigNumber(value: any): BigNumber {
  return BigNumber.from(value.hex)
}

export function convertToBigNumberPair(arr: any[]): ([BigNumber, BigNumber] | undefined)[] {
  return arr.map((a) => {
    if (a === undefined)
      return undefined
    return [BigNumber.from(a[0].hex), BigNumber.from(a[1].hex)]
  })
}

