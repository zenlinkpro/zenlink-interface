/* eslint-disable no-console */
import { BigNumber } from '@ethersproject/bignumber'
import invariant from 'tiny-invariant'
import type {
  BaseToken,
  NetworkInfo,
  RouteLeg,
  SplitMultiRoute,
} from '@zenlink-interface/amm'
import { PoolType, RouteStatus } from '@zenlink-interface/amm'
import { ASSERT, DEBUG, getBigNumber } from '../util'
import type { BasePool } from './pools'
import { GmxPool, MetaPool, StablePool, StandardPool, UniV3Pool, setTokenId } from './pools'
import { Edge } from './Edge'
import { Vertice } from './Vertice'

function getPoolType(pool: BasePool): PoolType {
  switch (pool.constructor) {
    case StandardPool:
      return PoolType.Standard
    case StablePool:
    case MetaPool:
      return PoolType.Stable
    case UniV3Pool:
    case GmxPool:
      return PoolType.Concentrated
    default:
      return PoolType.Unknown
  }
}

export class Graph {
  public readonly vertices: Vertice[]
  public readonly edges: Edge[]
  private tokens: Map<string, Vertice>

  public constructor(
    pools: BasePool[],
    start: BaseToken,
    baseTokenOrNetworks: BaseToken | NetworkInfo[],
    gasPriceSingleNetwork?: number,
    minPriceLiquidity = 0,
  ) {
    const networks: NetworkInfo[]
      = Array.isArray(baseTokenOrNetworks)
        ? baseTokenOrNetworks
        : [
            {
              chainId: baseTokenOrNetworks.chainId,
              baseToken: baseTokenOrNetworks,
              gasPrice: gasPriceSingleNetwork || 0,
            },
          ]

    setTokenId(...networks.map(n => n.baseToken))
    this.vertices = []
    this.edges = []
    this.tokens = new Map()
    pools.forEach((p) => {
      const v0 = this.getOrCreateVertice(p.token0)
      const v1 = this.getOrCreateVertice(p.token1)
      const edge = new Edge(p, v0, v1)
      v0.edges.push(edge)
      v1.edges.push(edge)
      this.edges.push(edge)
    })
    const startV = this.getVert(start)
    if (startV !== undefined)
      this.setPricesStable(startV, 1, networks, minPriceLiquidity)
  }

  private getOrCreateVertice(token: BaseToken): Vertice {
    let vert = this.getVert(token)
    if (vert)
      return vert
    vert = new Vertice(token)
    this.vertices.push(vert)
    this.tokens.set(token.tokenId as string, vert)
    return vert
  }

  public getVert(token: BaseToken): Vertice | undefined {
    return this.tokens.get(token.tokenId as string)
  }

  public cleanCache() {
    this.edges.forEach(e => e.cleanCache())
    this.vertices.forEach(v => v.cleanCache())
  }

  public addPath(from: Vertice | undefined, to: Vertice | undefined, path: Edge[]) {
    let _from = from
    path.forEach((e) => {
      if (_from) {
        e.walk(_from)
        _from = _from.getNeibour(e)
      }
      else {
        console.error('Unexpected 315')
      }
    })

    ASSERT(() => {
      const res = this.vertices.every((v) => {
        let total = 0
        let totalModule = 0
        v.edges.forEach((e) => {
          if (e.vert0 === v) {
            if (e.direction)
              total -= e.amountInPrevious

            else
              total += e.amountInPrevious

            totalModule += e.amountInPrevious
          }
          else {
            if (e.direction)
              total += e.amountOutPrevious

            else
              total -= e.amountOutPrevious

            totalModule += e.amountOutPrevious
          }
        })
        if (v === from)
          return total <= 0
        if (v === to)
          return total >= 0
        if (totalModule === 0)
          return total === 0
        return Math.abs(total / totalModule) < 1e10
      })
      return res
    }, 'Error 290')
  }

  public setPricesStable(from: Vertice, price: number, networks: NetworkInfo[], minLiquidity = 0) {
    const processedVert = new Set<Vertice>()
    let nextEdges: Edge[] = []
    const edgeValues = new Map<Edge, number>()
    const value = (e: Edge): number => edgeValues.get(e) as number

    function addVertice(v: Vertice, price: number) {
      v.price = price
      const newEdges = v.edges.filter((e) => {
        if (processedVert.has(v.getNeibour(e) as Vertice))
          return false
        if (e.pool.alwaysAppropriateForPricing())
          return true
        const liquidity = price * parseInt(e.reserve(v).toString())
        if (liquidity < minLiquidity)
          return false
        edgeValues.set(e, liquidity)
        return true
      })
      newEdges.sort((e1, e2) => value(e1) - value(e2))
      const res: Edge[] = []
      while (nextEdges.length && newEdges.length) {
        if (value(nextEdges[0]) < value(newEdges[0]))
          res.push(nextEdges.shift() as Edge)
        else res.push(newEdges.shift() as Edge)
      }
      nextEdges = [...res, ...nextEdges, ...newEdges]
      processedVert.add(v)
    }

    addVertice(from, price)
    while (nextEdges.length > 0) {
      const bestEdge = nextEdges.pop() as Edge
      const [vFrom, vTo] = processedVert.has(bestEdge.vert1)
        ? [bestEdge.vert1, bestEdge.vert0]
        : [bestEdge.vert0, bestEdge.vert1]
      if (processedVert.has(vTo))
        continue
      const p = bestEdge.pool.calcCurrentPriceWithoutFee(vFrom === bestEdge.vert1)
      addVertice(vTo, vFrom.price * p)
    }

    const gasPrice = new Map<number | string | undefined, number>()
    networks.forEach((n) => {
      const vPrice = this.getVert(n.baseToken)?.price || 0
      gasPrice.set(n.chainId, n.gasPrice * vPrice)
    })
    processedVert.forEach((v) => {
      const gasPriceChainId = gasPrice.get(v.token.chainId)
      invariant(gasPriceChainId !== undefined, 'SetPricesStable: GasPriceChainId')
      invariant(v.price !== 0, 'SetPricesStable: vertice price')
      v.gasPrice = gasPriceChainId / v.price
    })
  }

  public findBestPathExactIn(
    from: BaseToken,
    to: BaseToken,
    amountIn: number,
  ):
    | {
      path: Edge[]
      output: number
      gasSpent: number
      totalOutput: number
    }
    | undefined {
    const start = this.getVert(from)
    const finish = this.getVert(to)
    if (!start || !finish)
      return

    this.edges.forEach((e) => {
      e.bestEdgeIncome = 0
      e.spentGasNew = 0
    })
    this.vertices.forEach((v) => {
      v.bestIncome = 0
      v.gasSpent = 0
      v.bestTotal = 0
      v.bestSource = undefined
      v.checkLine = -1
    })
    start.bestIncome = amountIn
    start.bestTotal = amountIn
    const processedVert = new Set<Vertice>()
    const nextVertList = [start]

    let debug_info = ''
    let checkLine = 0
    for (;;) {
      let closestVert: Vertice | undefined
      let closestTotal: number | undefined
      let closestPosition = 0
      nextVertList.forEach((v, i) => {
        if (closestTotal === undefined || v.bestTotal > closestTotal) {
          closestTotal = v.bestTotal
          closestVert = v
          closestPosition = i
        }
      })

      if (!closestVert)
        return

      closestVert.checkLine = checkLine++

      if (closestVert === finish) {
        const bestPath = []
        for (let v: Vertice | undefined = finish; v?.bestSource; v = v.getNeibour(v.bestSource))
          bestPath.unshift(v.bestSource)

        DEBUG(() => console.log(debug_info))

        return {
          path: bestPath,
          output: finish.bestIncome,
          gasSpent: finish.gasSpent,
          totalOutput: finish.bestTotal,
        }
      }
      nextVertList.splice(closestPosition, 1)

      closestVert.edges.forEach((e) => {
        const v2 = closestVert === e.vert0 ? e.vert1 : e.vert0
        if (processedVert.has(v2))
          return
        let newIncome: number, gas: number
        try {
          const { output, gasSpent } = e.getOutput(
            closestVert as Vertice,
            (closestVert as Vertice).bestIncome,
          )
          if (!isFinite(output) || !isFinite(gasSpent))
            // Math errors protection
            return

          newIncome = output
          gas = gasSpent
        }
        catch (err) {
          // Any arithmetic error or out-of-liquidity
          e.bestEdgeIncome = -1
          return
        }

        const newGasSpent = (closestVert as Vertice).gasSpent + gas
        const price = v2.price / finish.price
        const gasPrice = v2.gasPrice * price
        const newTotal = newIncome * price - newGasSpent * gasPrice

        invariant(e.bestEdgeIncome === 0, 'Error 373')
        e.bestEdgeIncome = newIncome * price
        e.spentGasNew = e.spentGas + gas

        if (!v2.bestSource)
          nextVertList.push(v2)
        if (!v2.bestSource || newTotal > v2.bestTotal) {
          DEBUG(() => {
            const st = closestVert?.token === from ? '*' : ''
            const fn = v2?.token === to ? '*' : ''
            debug_info += `${st}${closestVert?.token.name}->${v2.token.name}${fn} ${v2.bestIncome} -> ${newIncome}\n`
          })
          v2.bestIncome = newIncome
          v2.gasSpent = newGasSpent
          v2.bestTotal = newTotal
          v2.bestSource = e
        }
      })

      processedVert.add(closestVert)
    }
  }

  public findBestRouteExactIn(
    from: BaseToken,
    to: BaseToken,
    amountIn: BigNumber | number,
    mode: number | number[],
  ): SplitMultiRoute {
    let amountInBN: BigNumber
    if (amountIn instanceof BigNumber) {
      amountInBN = amountIn
      amountIn = parseInt(amountIn.toString())
    }
    else {
      amountInBN = getBigNumber(amountIn)
    }

    let routeValues = []
    if (Array.isArray(mode)) {
      const sum = mode.reduce((a, b) => a + b, 0)
      routeValues = mode.map(e => e / sum)
    }
    else {
      for (let i = 0; i < mode; ++i) routeValues.push(1 / mode)
    }

    this.edges.forEach((e) => {
      e.amountInPrevious = 0
      e.amountOutPrevious = 0
      e.direction = true
    })
    let output = 0
    let gasSpentInit = 0
    let totalOutput = 0
    let totalrouted = 0
    let primaryPrice
    let step
    for (step = 0; step < routeValues.length; ++step) {
      const p = this.findBestPathExactIn(from, to, amountIn * routeValues[step])
      if (!p) {
        break
      }
      else {
        output += p.output
        gasSpentInit += p.gasSpent
        totalOutput += p.totalOutput
        this.addPath(this.getVert(from), this.getVert(to), p.path)
        totalrouted += routeValues[step]
      }
    }
    if (step === 0 || output === 0) {
      return {
        status: RouteStatus.NoWay,
        fromToken: from,
        toToken: to,
        amountIn: 0,
        amountInBN: BigNumber.from(0),
        amountOut: 0,
        amountOutBN: BigNumber.from(0),
        legs: [],
        gasSpent: 0,
        totalAmountOut: 0,
        totalAmountOutBN: BigNumber.from(0),
      }
    }
    let status
    if (step < routeValues.length)
      status = RouteStatus.Partial
    else status = RouteStatus.Success

    const fromVert = this.getVert(from) as Vertice
    const toVert = this.getVert(to) as Vertice
    const { legs, gasSpent, topologyWasChanged } = this.getRouteLegs(fromVert, toVert)
    invariant(gasSpent <= gasSpentInit, 'Internal Error 491')

    if (topologyWasChanged)
      output = this.getLegsAmountOut(legs, amountIn)

    let swapPrice, priceImpact
    try {
      swapPrice = output / amountIn
      const priceTo = this.getVert(to)?.price
      const priceFrom = this.getVert(from)?.price
      primaryPrice = priceTo && priceFrom ? priceFrom / priceTo : undefined
      priceImpact = primaryPrice !== undefined ? 1 - swapPrice / primaryPrice : undefined
    }
    catch (e) {
      /* skip division by 0 errors */
    }

    return {
      status,
      fromToken: from,
      toToken: to,
      primaryPrice,
      swapPrice,
      priceImpact,
      amountIn: amountIn * totalrouted,
      amountInBN: status === RouteStatus.Success ? amountInBN : getBigNumber(amountIn * totalrouted),
      amountOut: output,
      amountOutBN: getBigNumber(output),
      legs,
      gasSpent,
      totalAmountOut: totalOutput, // TODO: should be recalculated if topologyWasChanged
      totalAmountOutBN: getBigNumber(totalOutput),
    }
  }

  public getRouteLegs(
    from: Vertice,
    to: Vertice,
  ): {
      legs: RouteLeg[]
      gasSpent: number
      topologyWasChanged: boolean
    } {
    const { vertices, topologyWasChanged } = this.cleanTopology(from, to)
    const legs: RouteLeg[] = []
    let gasSpent = 0
    vertices.forEach((n) => {
      const outEdges = n.getOutputEdges().map((e) => {
        const from = this.edgeFrom(e)
        return from ? [e, from.vert, from.amount] : [e]
      })

      let outAmount = outEdges.reduce((a, b) => a + (b[2] as number), 0)
      if (outAmount <= 0)
        return

      const total = outAmount

      // IMPORTANT: Casting to Number to avoid compiler bug which for some reason
      // keeps reference to outAmount which is mutated later
      // const total = Number(outAmount)
      // const totalTest = outAmount

      // console.debug('BEFORE', { outAmount, total, totalTest })

      outEdges.forEach((e, i) => {
        const p = e[2] as number
        const quantity = i + 1 === outEdges.length ? 1 : p / outAmount
        const edge = e[0] as Edge

        const poolType = getPoolType(edge.pool)

        legs.push({
          poolId: edge.pool.poolId,
          poolAddress: edge.pool.address,
          poolType,
          poolFee: edge.pool.fee,
          tokenFrom: n.token,
          tokenTo: (n.getNeibour(edge) as Vertice).token,
          assumedAmountIn: edge.direction ? edge.amountInPrevious : edge.amountOutPrevious,
          assumedAmountOut: edge.direction ? edge.amountOutPrevious : edge.amountInPrevious,
          swapPortion: quantity,
          absolutePortion: p / total,
        })
        gasSpent += (e[0] as Edge).pool.swapGasCost
        outAmount -= p
      })
      invariant(outAmount / total < 1e-12, 'Error 281')
    })
    return { legs, gasSpent, topologyWasChanged }
  }

  public getLegsAmountOut(legs: RouteLeg[], amountIn: number): number {
    const amounts = new Map<string, number>()
    amounts.set(legs[0].tokenFrom.tokenId as string, amountIn)
    legs.forEach((l) => {
      const vert = this.getVert(l.tokenFrom)
      invariant(vert !== undefined, 'Internal Error 570')
      const edge = (vert as Vertice).edges.find(e => e.pool.address === l.poolAddress)
      invariant(edge !== undefined, 'Internel Error 569')
      const pool = (edge as Edge).pool
      const direction = vert === (edge as Edge).vert0

      const inputTotal = amounts.get(l.tokenFrom.tokenId as string)
      invariant(inputTotal !== undefined, 'Internal Error 564')
      const input = (inputTotal as number) * l.swapPortion
      amounts.set(l.tokenFrom.tokenId as string, (inputTotal as number) - input)
      const output = pool.getOutput(input, direction).output

      const vertNext = (vert as Vertice).getNeibour(edge) as Vertice
      const prevAmount = amounts.get(vertNext.token.tokenId as string)
      amounts.set(vertNext.token.tokenId as string, (prevAmount || 0) + output)
    })
    return amounts.get(legs[legs.length - 1].tokenTo.tokenId as string) || 0
  }

  public edgeFrom(e: Edge): { vert: Vertice; amount: number } | undefined {
    if (e.amountInPrevious === 0)
      return undefined
    return e.direction
      ? { vert: e.vert0, amount: e.amountInPrevious }
      : { vert: e.vert1, amount: e.amountOutPrevious }
  }

  public cleanTopology(from: Vertice, to: Vertice): { vertices: Vertice[]; topologyWasChanged: boolean } {
    let topologyWasChanged = false
    let result = this.topologySort(from, to)
    if (result.status !== 2) {
      topologyWasChanged = true
      invariant(result.status === 0, 'Internal Error 554')
      while (result.status === 0) {
        this.removeWeakestEdge(result.vertices)
        result = this.topologySort(from, to)
      }
      if (result.status === 3) {
        this.removeDeadEnds(result.vertices)
        result = this.topologySort(from, to)
      }
      invariant(result.status === 2, 'Internal Error 563')
      if (result.status !== 2)
        return { vertices: [], topologyWasChanged }
    }
    return { vertices: result.vertices, topologyWasChanged }
  }

  public removeDeadEnds(verts: Vertice[]) {
    verts.forEach((v) => {
      v.getInputEdges().forEach((e) => {
        e.canBeUsed = false
      })
    })
  }

  public removeWeakestEdge(verts: Vertice[]) {
    let minVert: Vertice | undefined
    let minVertNext: Vertice
    let minOutput = Number.MAX_VALUE
    verts.forEach((v1, i) => {
      const v2 = i === 0 ? verts[verts.length - 1] : verts[i - 1]
      let out = 0
      v1.getOutputEdges().forEach((e) => {
        if (v1.getNeibour(e) !== v2)
          return
        out += e.direction ? e.amountOutPrevious : e.amountInPrevious
      })
      if (out < minOutput) {
        minVert = v1
        minVertNext = v2
        minOutput = out
      }
    })
    minVert?.getOutputEdges().forEach((e) => {
      if (minVert?.getNeibour(e) !== minVertNext)
        return
      e.canBeUsed = false
    })
  }

  public topologySort(from: Vertice, to: Vertice): { status: number; vertices: Vertice[] } {
    // undefined or 0 - not processed, 1 - in process, 2 - finished, 3 - dedend
    const vertState = new Map<Vertice, number>()
    const vertsFinished: Vertice[] = []
    const foundCycle: Vertice[] = []
    const foundDeadEndVerts: Vertice[] = []

    // 0 - cycle was found and created, return
    // 1 - during cycle creating
    // 2 - vertex is processed ok
    // 3 - dead end vertex
    function topSortRecursive(current: Vertice): number {
      const state = vertState.get(current)
      if (state === 2 || state === 3)
        return state
      if (state === 1) {
        invariant(foundCycle.length === 0, 'Internal Error 566')
        foundCycle.push(current)
        return 1
      }
      vertState.set(current, 1)

      let successors2Exist = false
      const outEdges = current.getOutputEdges()
      for (let i = 0; i < outEdges.length; ++i) {
        const e = outEdges[i]
        const res = topSortRecursive(current.getNeibour(e) as Vertice)
        if (res === 0)
          return 0
        if (res === 1) {
          if (foundCycle[0] === current) { return 0 }
          else {
            foundCycle.push(current)
            return 1
          }
        }
        if (res === 2)
          successors2Exist = true // Ok successors
      }
      if (successors2Exist) {
        invariant(current !== to, 'Internal Error 589')
        vertsFinished.push(current)
        vertState.set(current, 2)
        return 2
      }
      else {
        if (current !== to) {
          foundDeadEndVerts.push(current)
          vertState.set(current, 3)
          return 3
        }
        vertsFinished.push(current)
        vertState.set(current, 2)
        return 2
      }
    }

    const res = topSortRecursive(from)
    if (res === 0)
      return { status: 0, vertices: foundCycle }
    if (foundDeadEndVerts.length)
      return { status: 3, vertices: foundDeadEndVerts }
    ASSERT(() => {
      if (vertsFinished[0] !== to)
        return false
      if (vertsFinished[vertsFinished.length - 1] !== from)
        return false
      return true
    }, 'Internal Error 614')
    if (res === 2)
      return { status: 2, vertices: vertsFinished.reverse() }
    invariant(true, 'Internal Error 612')
    return { status: 1, vertices: [] }
  }
}
