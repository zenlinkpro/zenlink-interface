import { setTokenId } from './basePool'
import type { BaseToken } from './baseToken'
import type { Edge } from './edge'

export class Vertice {
  public readonly token: BaseToken
  public readonly edges: Edge[]

  public price: number
  public gasPrice: number

  public bestIncome: number
  public gasSpent: number
  public bestTotal: number
  public bestSource?: Edge
  public checkLine: number

  public constructor(t: BaseToken) {
    this.token = t
    setTokenId(this.token)
    this.edges = []
    this.price = 0
    this.gasPrice = 0
    this.bestIncome = 0
    this.gasSpent = 0
    this.bestTotal = 0
    this.bestSource = undefined
    this.checkLine = -1
  }

  public cleanCache(): void {
    this.bestIncome = 0
    this.gasSpent = 0
    this.bestTotal = 0
    this.bestSource = undefined
    this.checkLine = -1
  }

  public getNeibour(e?: Edge): Vertice | undefined {
    if (!e)
      return undefined
    return e.vert0 === this ? e.vert1 : e.vert0
  }

  public getOutputEdges(): Edge[] {
    return this.edges.filter((e) => {
      if (!e.canBeUsed)
        return false
      if (e.amountInPrevious === 0)
        return false
      if (e.direction !== (e.vert0 === this))
        return false
      return true
    })
  }

  public getInputEdges(): Edge[] {
    return this.edges.filter((e) => {
      if (!e.canBeUsed)
        return false
      if (e.amountInPrevious === 0)
        return false
      if (e.direction === (e.vert0 === this))
        return false
      return true
    })
  }
}
